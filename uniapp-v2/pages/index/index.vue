<template>
  <view class="page safe-page">
    <view v-if="!isLoggedIn" class="state-card state-card--guest">
      <text class="state-title">登录后查看文章</text>
      <text class="state-copy">发现社区里的最新内容、收藏文章并参与评论。</text>
      <u-button type="primary" shape="circle" @click="goLogin">去登录</u-button>
    </view>

    <template v-else>
      <view class="page-toolbar">
        <view>
          <view class="toolbar-title">社区文章</view>
          <view class="toolbar-copy">分享你的想法和经验</view>
        </view>
        <u-button type="primary" size="small" shape="circle" @click="goCreate">发布文章</u-button>
      </view>

      <view v-if="loading && articles.length === 0" class="state-card">
        <text class="state-copy">正在加载文章…</text>
      </view>
      <view v-else-if="errorMessage && articles.length === 0" class="state-card">
        <text class="state-title">文章加载失败</text>
        <text class="state-copy">{{ errorMessage }}</text>
        <u-button type="primary" plain shape="circle" @click="retryLoad">重新加载</u-button>
      </view>
      <view v-else-if="articles.length === 0" class="state-card">
        <text class="state-title">还没有文章</text>
        <text class="state-copy">稍后再来看看吧。</text>
      </view>

      <template v-else>
        <view
          v-for="article in articles"
          :key="article.slug"
          class="article-card"
          @click="openArticle(article)"
        >
          <view class="article-author">
            <view class="author-avatar" @click.stop="openAuthor(article.author)">
              {{ authorInitial(article.author) }}
            </view>
            <view class="author-info">
              <view class="author-name">{{ article.author.username || '匿名作者' }}</view>
              <view class="author-date">{{ formatDate(article.createdAt) }}</view>
            </view>
          </view>
          <view class="article-title">{{ article.title || '未命名文章' }}</view>
          <view class="article-summary">{{ article.description || '暂无摘要' }}</view>
          <view v-if="article.tags.length" class="tag-list">
            <text v-for="tag in article.tags" :key="tag" class="tag"># {{ tag }}</text>
          </view>
          <view class="favorite-count">♥ {{ article.favoritesCount }}</view>
        </view>

        <view class="list-footer">
          <text v-if="loading">正在加载更多…</text>
          <text v-else-if="errorMessage" class="footer-error" @click="retryLoad">
            {{ errorMessage }}，点击重试
          </text>
          <text v-else-if="!hasMore">没有更多了</text>
          <text v-else>上拉加载更多</text>
        </view>
      </template>
    </template>
  </view>
</template>

<script>
const articleApi = require('../../api/article')
const session = require('../../common/session')
const { normalizeArticle } = require('../../common/article')

export default {
  data() {
    return {
      isLoggedIn: false,
      articles: [],
      page: 1,
      pageSize: 10,
      hasMore: true,
      loading: false,
      loadingMode: '',
      errorMessage: '',
      lastFailedMode: 'reset',
      activeToken: '',
      activeRequestToken: '',
      requestGeneration: 0,
      pendingReset: false,
      pendingResetToken: '',
      pendingAppend: false,
      pendingAppendToken: '',
      articleRequestPromise: null,
    }
  },
  onShow() {
    const token = session.getToken()
    this.isLoggedIn = Boolean(token)

    if (!token) {
      this.invalidateArticleRequests()
      this.resetList()
      this.activeToken = ''
      return
    }

    if (token !== this.activeToken || this.articles.length === 0) {
      return this.loadArticles(true)
    }
  },
  async onPullDownRefresh() {
    try {
      if (this.isLoggedIn) await this.loadArticles(true)
    } finally {
      uni.stopPullDownRefresh()
    }
  },
  onReachBottom() {
    this.loadArticles(false)
  },
  methods: {
    resetList() {
      this.articles = []
      this.page = 1
      this.hasMore = true
      this.errorMessage = ''
    },
    invalidateArticleRequests() {
      this.requestGeneration += 1
      this.pendingReset = false
      this.pendingResetToken = ''
      this.pendingAppend = false
      this.pendingAppendToken = ''
    },
    async loadArticles(reset) {
      const token = session.getToken()
      this.isLoggedIn = Boolean(token)
      if (!token) {
        this.invalidateArticleRequests()
        this.resetList()
        this.activeToken = ''
        return
      }

      if (reset) {
        const resetAlreadyScheduled =
          (this.loadingMode === 'reset' && this.activeRequestToken === token) ||
          (this.pendingReset && this.pendingResetToken === token)
        if (resetAlreadyScheduled) return this.articleRequestPromise

        this.requestGeneration += 1
        this.pendingReset = true
        this.pendingResetToken = token
        this.pendingAppend = false
        this.pendingAppendToken = ''
        this.activeToken = token
      } else {
        if (token !== this.activeToken) return this.loadArticles(true)
        if (!this.hasMore) return
        if (this.loadingMode || this.pendingReset || this.pendingAppend) return this.articleRequestPromise

        this.pendingAppend = true
        this.pendingAppendToken = token
      }

      if (!this.articleRequestPromise) {
        this.articleRequestPromise = this.runArticleQueue()
      }
      return this.articleRequestPromise
    },
    async runArticleQueue() {
      try {
        while (this.pendingReset || this.pendingAppend) {
          let mode
          let token
          if (this.pendingReset) {
            mode = 'reset'
            token = this.pendingResetToken
            this.pendingReset = false
            this.pendingResetToken = ''
          } else {
            mode = 'append'
            token = this.pendingAppendToken
            this.pendingAppend = false
            this.pendingAppendToken = ''
          }
          await this.performArticleRequest(mode, token, this.requestGeneration)
        }
      } finally {
        this.loading = false
        this.loadingMode = ''
        this.activeRequestToken = ''
        this.articleRequestPromise = null
      }
    },
    async performArticleRequest(mode, token, generation) {
      const targetPage = mode === 'reset' ? 1 : this.page
      this.loading = true
      this.loadingMode = mode
      this.activeRequestToken = token
      if (generation === this.requestGeneration && session.getToken() === token) {
        this.errorMessage = ''
      }

      try {
        const result = await articleApi.list({ page: targetPage, pageSize: this.pageSize })
        if (generation !== this.requestGeneration || session.getToken() !== token) return
        const incoming = Array.isArray(result && result.items)
          ? result.items.map(normalizeArticle)
          : []

        this.articles = mode === 'reset' ? incoming : this.mergeArticles(this.articles, incoming)
        this.page = targetPage + 1
        this.hasMore = Number.isFinite(Number(result && result.totalPages))
          ? targetPage < Number(result.totalPages)
          : incoming.length === this.pageSize
        this.lastFailedMode = ''
      } catch (error) {
        if (generation !== this.requestGeneration || session.getToken() !== token) return
        this.errorMessage = (error && error.message) || '请求失败，请稍后重试'
        this.lastFailedMode = mode
      }
    },
    mergeArticles(current, incoming) {
      const seen = new Set(current.map((item) => String(item.id || item.slug)))
      return current.concat(incoming.filter((item) => {
        const key = String(item.id || item.slug)
        if (seen.has(key)) return false
        seen.add(key)
        return true
      }))
    },
    retryLoad() {
      return this.loadArticles(this.lastFailedMode !== 'append')
    },
    goLogin() {
      uni.navigateTo({ url: '/pages/login/login' })
    },
    goCreate() {
      uni.navigateTo({ url: '/pages/article/create' })
    },
    openArticle(article) {
      if (!article.slug) return
      uni.navigateTo({ url: `/pages/article/detail?slug=${encodeURIComponent(article.slug)}` })
    },
    authorInitial(author) {
      return ((author && author.username) || '?').slice(0, 1).toUpperCase()
    },
    openAuthor(author) {
      if (!author || !author.username) return
      uni.navigateTo({
        url: `/pages/profile/detail?username=${encodeURIComponent(author.username)}`,
      })
    },
    formatDate(value) {
      if (!value) return ''
      const date = new Date(value)
      if (Number.isNaN(date.getTime())) return value
      const month = String(date.getMonth() + 1).padStart(2, '0')
      const day = String(date.getDate()).padStart(2, '0')
      return `${date.getFullYear()}-${month}-${day}`
    },
  },
}
</script>

<style lang="scss" scoped>
.page {
  min-height: 100vh;
  box-sizing: border-box;
  padding: 24rpx;
}

.state-card,
.article-card {
  background: #fff;
  border-radius: 20rpx;
  box-shadow: 0 8rpx 28rpx rgba(31, 41, 55, 0.05);
}

.article-author { display: flex; align-items: center; margin-bottom: 24rpx; }
.author-avatar { display: flex; align-items: center; justify-content: center; width: 62rpx; height: 62rpx; margin-right: 16rpx; color: #fff; font-size: 26rpx; font-weight: 700; background: linear-gradient(135deg, #3c9cff, #7a74ff); border-radius: 50%; }
.author-info { min-width: 0; }
.author-name { color: #303133; font-size: 25rpx; font-weight: 600; }
.author-date { margin-top: 5rpx; color: #909399; font-size: 21rpx; }

.page-toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 24rpx;
  padding: 24rpx 8rpx 12rpx;
}

.toolbar-title { color: #303133; font-size: 36rpx; font-weight: 700; }
.toolbar-copy { margin-top: 6rpx; color: #909399; font-size: 23rpx; }

.state-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 120rpx;
  padding: 56rpx 36rpx;
  text-align: center;
}

.state-card--guest { margin-top: 80rpx; }
.state-title { margin-bottom: 16rpx; color: #303133; font-size: 34rpx; font-weight: 600; }
.state-copy { margin-bottom: 36rpx; color: #909399; font-size: 27rpx; line-height: 1.7; }

.article-card {
  position: relative;
  margin-bottom: 24rpx;
  padding: 32rpx;
}

.article-title {
  padding-right: 120rpx;
  color: #303133;
  font-size: 34rpx;
  font-weight: 600;
  line-height: 1.45;
}

.article-summary {
  display: -webkit-box;
  overflow: hidden;
  margin-top: 16rpx;
  color: #606266;
  font-size: 28rpx;
  line-height: 1.65;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
}

.tag-list { display: flex; flex-wrap: wrap; gap: 12rpx; margin-top: 20rpx; }
.tag { padding: 6rpx 14rpx; color: #3c9cff; font-size: 23rpx; background: #ecf5ff; border-radius: 999rpx; }
.favorite-count { position: absolute; top: 36rpx; right: 32rpx; color: #f56c6c; font-size: 25rpx; }
.list-footer { padding: 24rpx 0 36rpx; color: #909399; font-size: 25rpx; text-align: center; }
.footer-error { color: #f56c6c; }
</style>
