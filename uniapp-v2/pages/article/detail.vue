<template>
  <view class="detail-page safe-page">
    <view v-if="loading" class="state-card">正在加载文章…</view>
    <view v-else-if="errorMessage" class="state-card">
      <text class="state-title">文章加载失败</text>
      <text class="state-copy">{{ errorMessage }}</text>
      <u-button type="primary" plain shape="circle" @click="loadPage">重新加载</u-button>
    </view>

    <template v-else-if="article">
      <view class="article-card">
        <view class="article-title">{{ article.title }}</view>
        <view class="article-author" @click="openAuthor(article.author)">
          <view class="author-avatar">{{ authorInitial(article.author) }}</view>
          <view>
            <view class="author-name">{{ article.author.username || '匿名作者' }}</view>
            <view class="author-date">{{ formatDate(article.createdAt) }}</view>
          </view>
        </view>
        <view v-if="article.tags.length" class="tag-list">
          <text v-for="tag in article.tags" :key="tag" class="tag"># {{ tag }}</text>
        </view>
        <view class="article-body">{{ article.body }}</view>
        <u-button
          :type="article.favorited ? 'warning' : 'primary'"
          :plain="!article.favorited"
          shape="circle"
          :loading="favoriteSubmitting"
          :disabled="favoriteSubmitting"
          @click="toggleFavorite"
        >
          {{ article.favorited ? '取消收藏' : '收藏' }} · {{ article.favoritesCount }}
        </u-button>
      </view>

      <view class="comment-section">
        <view class="section-title">评论</view>
        <view class="comment-editor">
          <u-textarea v-model="commentBody" placeholder="说说你的想法…" maxlength="500" count />
          <view class="submit-comment">
            <u-button
              type="primary"
              size="small"
              :loading="commentSubmitting"
              :disabled="commentsMutating"
              @click="submitComment"
            >发布评论</u-button>
          </view>
        </view>

        <view v-if="commentsLoading" class="comment-state">正在加载评论…</view>
        <view v-else-if="commentsError" class="comment-state comment-state--error" @click="loadComments">
          {{ commentsError }}，点击重试
        </view>
        <view v-else-if="comments.length === 0" class="comment-state">暂无评论，来抢沙发吧。</view>
        <template v-else>
          <view v-for="comment in comments" :key="comment.id" class="comment-card">
            <view class="comment-header">
              <view>
                <text class="comment-author">{{ comment.author.username || '匿名用户' }}</text>
                <text class="comment-date">{{ formatDate(comment.createdAt, true) }}</text>
              </view>
              <text
                v-if="comment.author.id === currentUser.id"
                class="delete-comment"
                @click="deleteComment(comment)"
              >删除</text>
            </view>
            <view class="comment-body">{{ comment.body }}</view>
          </view>
        </template>
      </view>
    </template>
  </view>
</template>

<script>
const articleApi = require('../../api/article')
const session = require('../../common/session')
const { normalizeArticle, normalizeComment } = require('../../common/article')

export default {
  data() {
    return {
      slug: '',
      article: null,
      comments: [],
      currentUser: {},
      loading: false,
      commentsLoading: false,
      favoriteSubmitting: false,
      commentSubmitting: false,
      commentsMutating: false,
      deletingCommentId: null,
      commentsRefreshQueued: false,
      commentsRefreshPromise: null,
      errorMessage: '',
      commentsError: '',
      commentBody: '',
    }
  },
  onLoad(options) {
    if (!session.getToken()) {
      uni.reLaunch({ url: '/pages/login/login' })
      return
    }

    this.currentUser = session.getUser() || {}
    try {
      this.slug = decodeURIComponent(options.slug || '')
    } catch (error) {
      this.slug = options.slug || ''
    }

    if (!this.slug) {
      this.errorMessage = '文章地址无效'
      return
    }
    this.loadPage()
  },
  methods: {
    showError(message) {
      uni.showToast({ title: message, icon: 'none' })
    },
    async loadPage() {
      if (this.loading) return
      this.loading = true
      this.errorMessage = ''
      try {
        const result = await articleApi.detail(this.slug)
        this.article = normalizeArticle(result)
        if (!this.article.id) throw new Error('文章不存在')
        await this.loadComments()
      } catch (error) {
        this.errorMessage = (error && error.message) || '文章加载失败'
      } finally {
        this.loading = false
      }
    },
    async loadComments() {
      if (!this.article || !this.article.id) return
      this.commentsRefreshQueued = true
      if (!this.commentsRefreshPromise) {
        this.commentsRefreshPromise = this.runCommentsRefreshQueue()
      }
      return this.commentsRefreshPromise
    },
    async runCommentsRefreshQueue() {
      this.commentsLoading = true
      try {
        while (this.commentsRefreshQueued) {
          this.commentsRefreshQueued = false
          this.commentsError = ''
          try {
            const result = await articleApi.listComments(this.article.id)
            this.comments = (Array.isArray(result) ? result : []).map(normalizeComment)
          } catch (error) {
            this.commentsError = (error && error.message) || '评论加载失败'
          }
        }
      } finally {
        this.commentsLoading = false
        this.commentsRefreshPromise = null
      }
    },
    async toggleFavorite() {
      if (!this.article || !this.article.id || this.favoriteSubmitting) return

      const wasFavorited = this.article.favorited
      this.favoriteSubmitting = true
      try {
        const result = wasFavorited
          ? await articleApi.unfavorite(this.article.id)
          : await articleApi.favorite(this.article.id)
        this.article.favorited = result && typeof result.favorited === 'boolean' ? result.favorited : !wasFavorited
        this.article.favoritesCount = Math.max(0, this.article.favoritesCount + (wasFavorited ? -1 : 1))
      } catch (error) {
        this.showError((error && error.message) || '收藏操作失败')
      } finally {
        this.favoriteSubmitting = false
      }
    },
    async submitComment() {
      if (this.commentsMutating || !this.article) return
      const body = this.commentBody.trim()
      if (!body) {
        this.showError('请输入评论内容')
        return
      }

      this.commentsMutating = true
      this.commentSubmitting = true
      try {
        await articleApi.createComment(this.article.id, this.commentBody)
        this.commentBody = ''
        await this.loadComments()
      } catch (error) {
        this.showError((error && error.message) || '评论发布失败')
      } finally {
        this.commentSubmitting = false
        this.commentsMutating = false
      }
    },
    async deleteComment(comment) {
      if (!this.canDeleteComment(comment) || this.commentsMutating) return
      this.commentsMutating = true
      this.deletingCommentId = comment.id
      try {
        await articleApi.deleteComment(comment.id)
        await this.loadComments()
      } catch (error) {
        this.showError((error && error.message) || '评论删除失败')
      } finally {
        this.deletingCommentId = null
        this.commentsMutating = false
      }
    },
    canDeleteComment(comment) {
      return Boolean(this.currentUser && comment.author && comment.author.id === this.currentUser.id)
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
    formatDate(value, withTime) {
      if (!value) return ''
      const date = new Date(value)
      if (Number.isNaN(date.getTime())) return value
      const dateText = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
      if (!withTime) return dateText
      return `${dateText} ${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`
    },
  },
}
</script>

<style lang="scss" scoped>
.detail-page { min-height: 100vh; box-sizing: border-box; padding: 24rpx; }
.state-card, .article-card, .comment-editor, .comment-card { background: #fff; border-radius: 20rpx; }
.state-card { display: flex; flex-direction: column; align-items: center; gap: 24rpx; margin-top: 100rpx; padding: 48rpx 32rpx; color: #909399; text-align: center; }
.state-title { color: #303133; font-size: 34rpx; font-weight: 600; }
.state-copy { font-size: 27rpx; }
.article-card { padding: 36rpx 32rpx; }
.article-title { color: #303133; font-size: 44rpx; font-weight: 700; line-height: 1.4; }
.article-author { display: flex; align-items: center; margin-top: 28rpx; }
.author-avatar { display: flex; align-items: center; justify-content: center; width: 68rpx; height: 68rpx; margin-right: 18rpx; color: #fff; font-size: 27rpx; font-weight: 700; background: linear-gradient(135deg, #3c9cff, #7a74ff); border-radius: 50%; }
.author-name { color: #303133; font-size: 27rpx; font-weight: 600; }
.author-date { margin-top: 5rpx; color: #909399; font-size: 22rpx; }
.tag-list { display: flex; flex-wrap: wrap; gap: 12rpx; margin-top: 24rpx; }
.tag { padding: 6rpx 14rpx; color: #3c9cff; font-size: 23rpx; background: #ecf5ff; border-radius: 999rpx; }
.article-body { margin: 40rpx 0; color: #303133; font-size: 30rpx; line-height: 1.85; white-space: pre-wrap; word-break: break-word; }
.comment-section { margin-top: 36rpx; }
.section-title { margin-bottom: 20rpx; color: #303133; font-size: 34rpx; font-weight: 600; }
.comment-editor { margin-bottom: 24rpx; padding: 24rpx; }
.submit-comment { display: flex; justify-content: flex-end; margin-top: 18rpx; }
.comment-state { padding: 40rpx 20rpx; color: #909399; font-size: 26rpx; text-align: center; }
.comment-state--error { color: #f56c6c; }
.comment-card { margin-bottom: 20rpx; padding: 28rpx; }
.comment-header { display: flex; justify-content: space-between; align-items: center; }
.comment-author { color: #303133; font-size: 27rpx; font-weight: 600; }
.comment-date { margin-left: 18rpx; color: #909399; font-size: 22rpx; }
.delete-comment { color: #f56c6c; font-size: 24rpx; }
.comment-body { margin-top: 18rpx; color: #606266; font-size: 28rpx; line-height: 1.65; white-space: pre-wrap; word-break: break-word; }
</style>
