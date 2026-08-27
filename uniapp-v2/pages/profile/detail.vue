<template>
  <view class="profile-page safe-page">
    <view class="mock-tip">当前为作者主页演示数据。</view>
    <view class="profile-card">
      <view class="avatar avatar--large">{{ avatarText }}</view>
      <view class="username">{{ profile.username }}</view>
      <view class="bio">{{ profile.bio }}</view>
      <view class="stats">
        <view class="stat"><text class="stat-value">{{ followingCount }}</text><text>关注</text></view>
        <view class="stat"><text class="stat-value">{{ followersCount }}</text><text>粉丝</text></view>
        <view class="stat"><text class="stat-value">{{ articleCount }}</text><text>文章</text></view>
      </view>
      <u-button v-if="!isSelf" type="primary" :plain="profile.following" shape="circle" @click="toggleFollow">
        {{ profile.following ? '已关注' : '关注' }}
      </u-button>
      <view v-else class="self-label">这是我自己</view>
    </view>
  </view>
</template>

<script>
const session = require('../../common/session')
const { getMockProfile, getMockMyArticles, favoriteArticles } = require('../../mock/user-center')

export default {
  data() {
    return {
      username: '',
      profile: {},
      isSelf: false,
      followingCount: 6,
      followersCount: 18,
      articleCount: 0,
    }
  },
  computed: {
    avatarText() {
      return (this.profile.username || '?').slice(0, 1).toUpperCase()
    },
  },
  onLoad(options) {
    try {
      this.username = decodeURIComponent(options.username || '')
    } catch (error) {
      this.username = options.username || ''
    }
    const currentUser = session.getUser() || {}
    this.isSelf = Boolean(currentUser.username && currentUser.username === this.username)
    this.profile = this.isSelf
      ? { ...getMockProfile(this.username), ...currentUser, following: false }
      : getMockProfile(this.username)
    this.articleCount = [...getMockMyArticles(currentUser), ...favoriteArticles]
      .filter((article) => article.author.username === this.profile.username).length
    uni.setNavigationBarTitle({ title: `${this.profile.username}的主页` })
  },
  methods: {
    toggleFollow() {
      this.profile.following = !this.profile.following
      uni.showToast({
        title: this.profile.following ? '已关注（演示）' : '已取消关注（演示）',
        icon: 'none',
      })
    },
  },
}
</script>

<style lang="scss" scoped>
.profile-page { min-height: 100vh; box-sizing: border-box; padding: 24rpx; }
.mock-tip { margin-bottom: 22rpx; padding: 20rpx 24rpx; color: #e6a23c; font-size: 24rpx; background: #fdf6ec; border-radius: 16rpx; }
.profile-card { display: flex; flex-direction: column; align-items: center; padding: 54rpx 36rpx 44rpx; background: #fff; border-radius: 24rpx; box-shadow: 0 10rpx 36rpx rgba(31, 41, 55, 0.06); }
.avatar { display: flex; align-items: center; justify-content: center; color: #fff; font-weight: 700; background: #3c9cff; border-radius: 50%; }
.avatar--large { width: 126rpx; height: 126rpx; font-size: 48rpx; }
.username { margin-top: 24rpx; color: #303133; font-size: 40rpx; font-weight: 700; }
.bio { margin: 18rpx 0 34rpx; color: #606266; font-size: 27rpx; line-height: 1.7; text-align: center; }
.stats { display: flex; width: 100%; margin-bottom: 38rpx; padding: 28rpx 0; border-top: 1rpx solid #ebeef5; border-bottom: 1rpx solid #ebeef5; }
.stat { display: flex; flex: 1; flex-direction: column; align-items: center; color: #909399; font-size: 23rpx; }
.stat-value { margin-bottom: 8rpx; color: #303133; font-size: 34rpx; font-weight: 650; }
.self-label { color: #909399; font-size: 25rpx; }
</style>
