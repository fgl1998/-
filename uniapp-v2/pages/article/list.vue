<template>
  <view class="article-list-page safe-page">
    <view class="mock-tip">当前使用演示数据，接口完成后替换为真实文章。</view>
    <view v-if="articles.length === 0" class="empty-state">暂无{{ pageTitle }}</view>
    <view v-for="article in articles" :key="article.slug" class="article-card">
      <view class="article-title">{{ article.title }}</view>
      <view class="article-description">{{ article.description }}</view>
      <view v-if="article.tags.length" class="tags">
        <text v-for="tag in article.tags" :key="tag" class="tag"># {{ tag }}</text>
      </view>
      <view class="article-footer">
        <view class="author" @click="openAuthor(article.author)">
          <view class="avatar">{{ avatarText(article.author.username) }}</view>
          <text>{{ article.author.username }}</text>
        </view>
        <text class="favorite">♥ {{ article.favoritesCount }}</text>
      </view>
    </view>
  </view>
</template>

<script>
const session = require('../../common/session')
const { favoriteArticles, getMockMyArticles } = require('../../mock/user-center')

export default {
  data() {
    return {
      type: 'mine',
      pageTitle: '我的文章',
      articles: [],
    }
  },
  onLoad(options) {
    const type = options.type === 'favorites' ? 'favorites' : 'mine'
    const myArticles = getMockMyArticles(session.getUser())
    this.type = type
    this.pageTitle = type === 'favorites' ? '我收藏的文章' : '我的文章'
    this.articles = type === 'favorites' ? favoriteArticles : myArticles
    uni.setNavigationBarTitle({ title: this.pageTitle })
  },
  methods: {
    avatarText(username) {
      return (username || '?').slice(0, 1).toUpperCase()
    },
    openAuthor(author) {
      uni.navigateTo({
        url: `/pages/profile/detail?username=${encodeURIComponent(author.username)}`,
      })
    },
  },
}
</script>

<style lang="scss" scoped>
.article-list-page { min-height: 100vh; box-sizing: border-box; padding: 24rpx; }
.mock-tip { margin-bottom: 22rpx; padding: 20rpx 24rpx; color: #e6a23c; font-size: 24rpx; background: #fdf6ec; border-radius: 16rpx; }
.article-card { margin-bottom: 22rpx; padding: 30rpx; background: #fff; border-radius: 20rpx; box-shadow: 0 8rpx 28rpx rgba(31, 41, 55, 0.05); }
.article-title { color: #303133; font-size: 33rpx; font-weight: 650; line-height: 1.45; }
.article-description { margin-top: 14rpx; color: #606266; font-size: 27rpx; line-height: 1.65; }
.tags { display: flex; flex-wrap: wrap; gap: 12rpx; margin-top: 18rpx; }
.tag { color: #3c9cff; font-size: 23rpx; }
.article-footer { display: flex; align-items: center; justify-content: space-between; margin-top: 26rpx; padding-top: 22rpx; border-top: 1rpx solid #ebeef5; }
.author { display: flex; align-items: center; gap: 14rpx; color: #606266; font-size: 25rpx; }
.avatar { display: flex; align-items: center; justify-content: center; width: 52rpx; height: 52rpx; color: #fff; font-size: 22rpx; font-weight: 700; background: #3c9cff; border-radius: 50%; }
.favorite { color: #f56c6c; font-size: 25rpx; }
.empty-state { padding: 100rpx 0; color: #909399; text-align: center; }
</style>
