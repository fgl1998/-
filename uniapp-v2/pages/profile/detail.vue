<template>
  <view class="profile-page safe-page">
    <view v-if="loading" class="state-card">正在加载作者资料…</view>
    <view v-else-if="errorMessage" class="state-card">
      <text class="state-title">作者主页加载失败</text>
      <text class="state-copy">{{ errorMessage }}</text>
      <u-button type="primary" plain shape="circle" @click="loadProfile">重新加载</u-button>
    </view>

    <view v-else-if="profile" class="profile-card">
      <view class="avatar avatar--large">{{ avatarText }}</view>
      <view class="username">{{ profile.username }}</view>
      <view class="bio">{{ profile.bio || '这个人还没有填写简介。' }}</view>
      <view class="stats">
        <view class="stat stat--clickable" hover-class="stat--active" @click="openRelation('following')"><text class="stat-value">{{ followingCount }}</text><text>关注</text></view>
        <view class="stat stat--clickable" hover-class="stat--active" @click="openRelation('followers')"><text class="stat-value">{{ followersCount }}</text><text>粉丝</text></view>
        <view class="stat stat--clickable" hover-class="stat--active" @click="openArticles"><text class="stat-value">{{ articleCount }}</text><text>文章</text></view>
      </view>
      <u-button
        v-if="!isSelf"
        type="primary"
        :plain="profile.following"
        shape="circle"
        :loading="followSubmitting"
        :disabled="followSubmitting"
        @click="toggleFollow"
      >
        {{ profile.following ? '已关注' : '关注' }}
      </u-button>
      <view v-else class="self-label">这是我自己</view>
    </view>
  </view>
</template>

<script>
const profileApi = require('../../api/profile')
const articleApi = require('../../api/article')
const session = require('../../common/session')

export default {
  data() {
    return {
      username: '',
      profile: null,
      isSelf: false,
      followingCount: 0,
      followersCount: 0,
      articleCount: 0,
      loading: false,
      followSubmitting: false,
      errorMessage: '',
      requestGeneration: 0,
    }
  },
  computed: {
    avatarText() {
      return ((this.profile && this.profile.username) || '?').slice(0, 1).toUpperCase()
    },
  },
  onLoad(options) {
    if (!session.getToken()) {
      uni.reLaunch({ url: '/pages/login/login' })
      return
    }
    try {
      this.username = decodeURIComponent(options.username || '')
    } catch (error) {
      this.username = options.username || ''
    }
    if (!this.username) {
      this.errorMessage = '作者地址无效'
      return
    }
    return this.loadProfile()
  },
  async onPullDownRefresh() {
    try {
      await this.loadProfile()
    } finally {
      uni.stopPullDownRefresh()
    }
  },
  methods: {
    async loadProfile() {
      const token = session.getToken()
      const currentUser = session.getUser() || {}
      const currentUserId = Number(currentUser.id) || 0
      if (!token || !currentUserId) {
        uni.reLaunch({ url: '/pages/login/login' })
        return
      }
      const generation = ++this.requestGeneration
      this.loading = true
      this.errorMessage = ''
      try {
        const profile = await profileApi.get(this.username)
        if (!this.isCurrentRequest(generation, token, currentUserId)) return
        if (!profile || !profile.id) throw new Error('作者信息缺少用户 ID')

        this.profile = { ...profile, following: Boolean(profile.following) }
        this.isSelf = Number(currentUser.id) === Number(this.profile.id)
          || Boolean(currentUser.username && currentUser.username === this.profile.username)
        uni.setNavigationBarTitle({ title: `${this.profile.username}的主页` })

        const [followingUsers, followerUsers, articles] = await Promise.all([
          profileApi.followingList(this.profile.id),
          profileApi.followedList(this.profile.id),
          articleApi.getArticleListByUserId(this.profile.id),
        ])
        if (!this.isCurrentRequest(generation, token, currentUserId)) return
        this.followingCount = Array.isArray(followingUsers) ? followingUsers.length : 0
        this.followersCount = Array.isArray(followerUsers) ? followerUsers.length : 0
        this.articleCount = Array.isArray(articles) ? articles.length : 0
      } catch (error) {
        if (this.isCurrentRequest(generation, token, currentUserId)) {
          this.errorMessage = (error && error.message) || '作者主页加载失败'
        }
      } finally {
        if (generation === this.requestGeneration) this.loading = false
      }
    },
    isCurrentRequest(generation, token, currentUserId) {
      const currentUser = session.getUser() || {}
      return generation === this.requestGeneration
        && session.getToken() === token
        && Number(currentUser.id) === currentUserId
    },
    openRelation(type) {
      if (!this.profile || !this.profile.id || !this.profile.username) return
      const relationType = type === 'followers' ? 'followers' : 'following'
      uni.navigateTo({
        url: `/pages/profile/relation?type=${relationType}&userId=${this.profile.id}&username=${encodeURIComponent(this.profile.username)}`,
      })
    },
    openArticles() {
      if (!this.profile || !this.profile.id || !this.profile.username) return
      uni.navigateTo({
        url: `/pages/article/list?type=mine&userId=${this.profile.id}&username=${encodeURIComponent(this.profile.username)}`,
      })
    },
    async toggleFollow() {
      if (!this.profile || !this.profile.id || this.isSelf || this.followSubmitting) return
      const token = session.getToken()
      const currentUser = session.getUser() || {}
      const currentUserId = Number(currentUser.id) || 0
      const generation = this.requestGeneration
      if (!token || !currentUserId) return
      const wasFollowing = Boolean(this.profile.following)
      this.followSubmitting = true
      try {
        const result = wasFollowing
          ? await profileApi.unfollow(this.profile.id)
          : await profileApi.follow(this.profile.id)
        if (!this.isFollowRequestCurrent(generation, token, currentUserId)) return
        const nextFollowing = result && typeof result.following === 'boolean'
          ? result.following
          : !wasFollowing
        this.profile.following = nextFollowing
        if (nextFollowing !== wasFollowing) {
          this.followersCount = Math.max(0, this.followersCount + (nextFollowing ? 1 : -1))
        }
      } catch (error) {
        if (this.isFollowRequestCurrent(generation, token, currentUserId)) {
          uni.showToast({
            title: (error && error.message) || '关注操作失败',
            icon: 'none',
          })
        }
      } finally {
        this.followSubmitting = false
      }
    },
    isFollowRequestCurrent(generation, token, currentUserId) {
      const currentUser = session.getUser() || {}
      return generation === this.requestGeneration
        && session.getToken() === token
        && Number(currentUser.id) === currentUserId
    },
  },
}
</script>

<style lang="scss" scoped>
.profile-page { min-height: 100vh; box-sizing: border-box; padding: 24rpx; }
.state-card { display: flex; flex-direction: column; align-items: center; gap: 24rpx; margin-top: 100rpx; padding: 48rpx 32rpx; color: #909399; text-align: center; background: #fff; border-radius: 20rpx; }
.state-title { color: #303133; font-size: 32rpx; font-weight: 600; }
.state-copy { font-size: 26rpx; line-height: 1.6; }
.profile-card { display: flex; flex-direction: column; align-items: center; padding: 54rpx 36rpx 44rpx; background: #fff; border-radius: 24rpx; box-shadow: 0 10rpx 36rpx rgba(31, 41, 55, 0.06); }
.avatar { display: flex; align-items: center; justify-content: center; color: #fff; font-weight: 700; background: #3c9cff; border-radius: 50%; }
.avatar--large { width: 126rpx; height: 126rpx; font-size: 48rpx; }
.username { margin-top: 24rpx; color: #303133; font-size: 40rpx; font-weight: 700; }
.bio { margin: 18rpx 0 34rpx; color: #606266; font-size: 27rpx; line-height: 1.7; text-align: center; }
.stats { display: flex; width: 100%; margin-bottom: 38rpx; padding: 28rpx 0; border-top: 1rpx solid #ebeef5; border-bottom: 1rpx solid #ebeef5; }
.stat { display: flex; flex: 1; flex-direction: column; align-items: center; color: #909399; font-size: 23rpx; }
.stat--clickable { border-radius: 16rpx; }
.stat--active { background: #f2f8ff; opacity: 0.75; }
.stat-value { margin-bottom: 8rpx; color: #303133; font-size: 34rpx; font-weight: 650; }
.self-label { color: #909399; font-size: 25rpx; }
</style>
