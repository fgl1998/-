<template>
  <view class="article-list-page safe-page">
    <view v-if="loading && articles.length === 0" class="state-card">正在加载{{ pageTitle }}…</view>

    <view v-else-if="errorMessage && articles.length === 0" class="state-card">
      <text class="state-title">{{ pageTitle }}加载失败</text>
      <text class="state-copy">{{ errorMessage }}</text>
      <u-button type="primary" plain shape="circle" @click="loadArticles">重新加载</u-button>
    </view>

    <view v-else-if="articles.length === 0" class="state-card">
      <text class="state-title">暂无{{ pageTitle }}</text>
    </view>

    <template v-else>
      <view v-if="errorMessage" class="refresh-error" @click="loadArticles">
        {{ errorMessage }}，点击重试
      </view>
      <view
        v-for="article in articles"
        :key="article.slug"
        class="article-card"
        @click="openArticle(article)"
      >
        <view class="article-title">{{ article.title || '未命名文章' }}</view>
        <view class="article-description">{{ article.description || '暂无摘要' }}</view>
        <view v-if="article.tags.length" class="tags">
          <text v-for="tag in article.tags" :key="tag" class="tag"># {{ tag }}</text>
        </view>
        <view class="article-footer">
          <view class="author" @click.stop="openAuthor(article.author)">
            <view class="avatar">{{ avatarText(article.author.username) }}</view>
            <view>
              <view>{{ article.author.username || '匿名作者' }}</view>
              <view class="article-date">{{ formatDate(article.createdAt) }}</view>
            </view>
          </view>
          <view class="article-actions">
            <text class="favorite">♥ {{ article.favoritesCount }}</text>
            <text
              v-if="canDelete"
              class="delete-action"
              :class="{ 'delete-action--disabled': deletingArticleId === article.id }"
              @click.stop="confirmDelete(article)"
            >{{ deletingArticleId === article.id ? '删除中…' : '删除' }}</text>
          </view>
        </view>
      </view>
      <view v-if="loading" class="refreshing">正在刷新…</view>
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
      type: 'mine',
      pageTitle: '我的文章',
      userId: 0,
      targetUserId: 0,
      targetUsername: '',
      activeToken: '',
      activeUserId: 0,
      activeTargetUserId: 0,
      contextGeneration: 0,
      requestGeneration: 0,
      articles: [],
      loading: false,
      canDelete: false,
      deletingArticleId: 0,
      deleteOperationSequence: 0,
      activeDeleteOperationId: 0,
      errorMessage: '',
    }
  },
  onLoad(options) {
    options = options || {}
    const type = options.type === 'favorites' ? 'favorites' : 'mine'
    this.type = type
    this.targetUserId = Number(options.userId) || 0
    try {
      this.targetUsername = decodeURIComponent(options.username || '')
    } catch (error) {
      this.targetUsername = options.username || ''
    }
    const ownerName = this.targetUsername || '该用户'
    this.pageTitle = this.targetUserId
      ? `${ownerName}${type === 'favorites' ? '收藏的文章' : '的文章'}`
      : (type === 'favorites' ? '我收藏的文章' : '我的文章')
    uni.setNavigationBarTitle({ title: this.pageTitle })
    return this.loadArticles()
  },
  async onPullDownRefresh() {
    try {
      await this.loadArticles()
    } finally {
      uni.stopPullDownRefresh()
    }
  },
  methods: {
    async loadArticles() {
      const token = session.getToken()
      const currentUser = session.getUser() || {}
      const currentUserId = Number(currentUser.id) || 0
      const targetUserId = this.targetUserId || currentUserId
      if (!token || !currentUserId || !targetUserId) {
        this.contextGeneration += 1
        this.requestGeneration += 1
        this.activeToken = ''
        this.activeUserId = 0
        this.activeTargetUserId = 0
        this.userId = 0
        this.articles = []
        this.loading = false
        this.canDelete = false
        this.deletingArticleId = 0
        this.activeDeleteOperationId = 0
        uni.reLaunch({ url: '/pages/login/login' })
        return
      }

      this.canDelete = this.type === 'mine' && targetUserId === currentUserId

      const sessionChanged = token !== this.activeToken
        || currentUserId !== this.activeUserId
        || targetUserId !== this.activeTargetUserId
      if (sessionChanged) {
        this.contextGeneration += 1
        this.requestGeneration += 1
        this.activeToken = token
        this.activeUserId = currentUserId
        this.activeTargetUserId = targetUserId
        this.userId = targetUserId
        this.articles = []
        this.errorMessage = ''
        this.loading = false
        this.deletingArticleId = 0
        this.activeDeleteOperationId = 0
      }
      if (this.deletingArticleId) return
      if (this.loading) return

      const generation = ++this.requestGeneration
      this.loading = true
      this.errorMessage = ''
      try {
        const result = this.type === 'favorites'
          ? await articleApi.getFavoriteArticleListByUserId(targetUserId)
          : await articleApi.getArticleListByUserId(targetUserId)
        if (!this.isCurrentRequest(generation, token, currentUserId, targetUserId)) return
        this.articles = (Array.isArray(result) ? result : []).map(normalizeArticle)
      } catch (error) {
        if (this.isCurrentRequest(generation, token, currentUserId, targetUserId)) {
          this.errorMessage = (error && error.message) || `${this.pageTitle}加载失败`
        }
      } finally {
        if (generation === this.requestGeneration) this.loading = false
      }
    },
    isCurrentRequest(generation, token, currentUserId, targetUserId) {
      const currentUser = session.getUser() || {}
      return generation === this.requestGeneration
        && session.getToken() === token
        && Number(currentUser.id) === currentUserId
        && (this.targetUserId || Number(currentUser.id)) === targetUserId
    },
    async confirmDelete(article) {
      if (!this.canDelete || !article || !article.id || this.deletingArticleId || this.loading) return
      const operationId = ++this.deleteOperationSequence
      this.activeDeleteOperationId = operationId
      this.deletingArticleId = article.id
      try {
        const confirmed = await new Promise((resolve) => {
          uni.showModal({
            title: '删除文章',
            content: `确定删除《${article.title || '未命名文章'}》吗？`,
            confirmText: '删除',
            confirmColor: '#f56c6c',
            success: (result) => resolve(Boolean(result && result.confirm)),
            fail: () => resolve(false),
          })
        })
        if (!confirmed) return

        const token = session.getToken()
        const currentUser = session.getUser() || {}
        const currentUserId = Number(currentUser.id) || 0
        const ownerUserId = Number(this.userId) || 0
        const contextGeneration = this.contextGeneration
        if (!this.isDeleteContextCurrent(contextGeneration, operationId, token, currentUserId, ownerUserId)) return

        try {
          await articleApi.deleteArticle(article.id)
          if (!this.isDeleteContextCurrent(contextGeneration, operationId, token, currentUserId, ownerUserId)) return
          this.articles = this.articles.filter((item) => item.id !== article.id)
          uni.showToast({ title: '文章已删除', icon: 'success' })
        } catch (error) {
          if (this.isDeleteContextCurrent(contextGeneration, operationId, token, currentUserId, ownerUserId)) {
            uni.showToast({
              title: (error && error.message) || '文章删除失败',
              icon: 'none',
            })
          }
        }
      } finally {
        if (this.activeDeleteOperationId === operationId) {
          this.activeDeleteOperationId = 0
          this.deletingArticleId = 0
        }
      }
    },
    isDeleteContextCurrent(contextGeneration, operationId, token, currentUserId, ownerUserId) {
      const currentUser = session.getUser() || {}
      return contextGeneration === this.contextGeneration
        && operationId === this.activeDeleteOperationId
        && session.getToken() === token
        && Number(currentUser.id) === currentUserId
        && currentUserId === ownerUserId
        && Number(this.userId) === ownerUserId
        && this.type === 'mine'
    },
    avatarText(username) {
      return (username || '?').slice(0, 1).toUpperCase()
    },
    openArticle(article) {
      if (!article || !article.slug) return
      uni.navigateTo({ url: `/pages/article/detail?slug=${encodeURIComponent(article.slug)}` })
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
      return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
    },
  },
}
</script>

<style lang="scss" scoped>
.article-list-page { min-height: 100vh; box-sizing: border-box; padding: 24rpx; }
.state-card { display: flex; flex-direction: column; align-items: center; gap: 24rpx; margin-top: 100rpx; padding: 48rpx 32rpx; color: #909399; text-align: center; background: #fff; border-radius: 20rpx; }
.state-title { color: #303133; font-size: 32rpx; font-weight: 600; }
.state-copy { font-size: 26rpx; line-height: 1.6; }
.refresh-error { margin-bottom: 20rpx; padding: 20rpx 24rpx; color: #f56c6c; font-size: 24rpx; text-align: center; background: #fef0f0; border-radius: 16rpx; }
.article-card { margin-bottom: 22rpx; padding: 30rpx; background: #fff; border-radius: 20rpx; box-shadow: 0 8rpx 28rpx rgba(31, 41, 55, 0.05); }
.article-title { color: #303133; font-size: 33rpx; font-weight: 650; line-height: 1.45; }
.article-description { margin-top: 14rpx; color: #606266; font-size: 27rpx; line-height: 1.65; }
.tags { display: flex; flex-wrap: wrap; gap: 12rpx; margin-top: 18rpx; }
.tag { color: #3c9cff; font-size: 23rpx; }
.article-footer { display: flex; align-items: center; justify-content: space-between; margin-top: 26rpx; padding-top: 22rpx; border-top: 1rpx solid #ebeef5; }
.author { display: flex; align-items: center; gap: 14rpx; color: #606266; font-size: 25rpx; }
.avatar { display: flex; align-items: center; justify-content: center; width: 52rpx; height: 52rpx; color: #fff; font-size: 22rpx; font-weight: 700; background: #3c9cff; border-radius: 50%; }
.article-date { margin-top: 5rpx; color: #909399; font-size: 20rpx; }
.article-actions { display: flex; align-items: center; gap: 24rpx; }
.favorite { color: #f56c6c; font-size: 25rpx; }
.delete-action { padding: 8rpx 14rpx; color: #f56c6c; font-size: 24rpx; background: #fef0f0; border-radius: 10rpx; }
.delete-action--disabled { color: #c0c4cc; background: #f4f4f5; }
.refreshing { padding: 22rpx 0; color: #909399; font-size: 24rpx; text-align: center; }
</style>
