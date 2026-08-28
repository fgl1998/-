<template>
  <view class="relation-page safe-page">
    <view v-if="loading && users.length === 0" class="state-card">正在加载{{ pageTitle }}…</view>

    <view v-else-if="errorMessage && users.length === 0" class="state-card">
      <text class="state-title">{{ pageTitle }}加载失败</text>
      <text class="state-copy">{{ errorMessage }}</text>
      <u-button type="primary" plain shape="circle" @click="loadUsers">重新加载</u-button>
    </view>

    <view v-else-if="users.length === 0" class="state-card">
      <text class="state-title">暂无{{ pageTitle }}</text>
    </view>

    <template v-else>
      <view v-if="errorMessage" class="refresh-error" @click="loadUsers">
        {{ errorMessage }}，点击重试
      </view>
      <view
        v-for="user in users"
        :key="user.id"
        class="user-card"
        @click="openProfile(user)"
      >
        <view class="avatar">{{ avatarText(user.username) }}</view>
        <view class="user-content">
          <view class="username">{{ user.username }}</view>
          <view class="bio">{{ user.bio || '这个人还没有填写简介。' }}</view>
        </view>
        <text class="arrow">›</text>
      </view>
      <view v-if="loading" class="refreshing">正在刷新…</view>
    </template>
  </view>
</template>

<script>
const profileApi = require('../../api/profile')
const session = require('../../common/session')

export default {
  data() {
    return {
      type: 'following',
      pageTitle: '我的关注',
      userId: 0,
      targetUserId: 0,
      targetUsername: '',
      activeToken: '',
      activeUserId: 0,
      activeTargetUserId: 0,
      requestGeneration: 0,
      users: [],
      loading: false,
      errorMessage: '',
    }
  },
  onLoad(options) {
    options = options || {}
    const type = options.type === 'followers' ? 'followers' : 'following'
    this.type = type
    this.targetUserId = Number(options.userId) || 0
    try {
      this.targetUsername = decodeURIComponent(options.username || '')
    } catch (error) {
      this.targetUsername = options.username || ''
    }
    const ownerName = this.targetUsername || '该用户'
    this.pageTitle = this.targetUserId
      ? `${ownerName}的${type === 'followers' ? '粉丝' : '关注'}`
      : (type === 'followers' ? '我的粉丝' : '我的关注')
    uni.setNavigationBarTitle({ title: this.pageTitle })
    return this.loadUsers()
  },
  async onPullDownRefresh() {
    try {
      await this.loadUsers()
    } finally {
      uni.stopPullDownRefresh()
    }
  },
  methods: {
    async loadUsers() {
      const token = session.getToken()
      const currentUser = session.getUser() || {}
      const currentUserId = Number(currentUser.id) || 0
      const targetUserId = this.targetUserId || currentUserId
      if (!token || !currentUserId || !targetUserId) {
        this.requestGeneration += 1
        this.activeToken = ''
        this.activeUserId = 0
        this.activeTargetUserId = 0
        this.userId = 0
        this.users = []
        this.loading = false
        uni.reLaunch({ url: '/pages/login/login' })
        return
      }

      const sessionChanged = token !== this.activeToken
        || currentUserId !== this.activeUserId
        || targetUserId !== this.activeTargetUserId
      if (sessionChanged) {
        this.requestGeneration += 1
        this.activeToken = token
        this.activeUserId = currentUserId
        this.activeTargetUserId = targetUserId
        this.userId = targetUserId
        this.users = []
        this.errorMessage = ''
        this.loading = false
      }
      if (this.loading) return

      const generation = ++this.requestGeneration
      this.loading = true
      this.errorMessage = ''
      try {
        const result = this.type === 'followers'
          ? await profileApi.followedList(targetUserId)
          : await profileApi.followingList(targetUserId)
        if (!this.isCurrentRequest(generation, token, currentUserId, targetUserId)) return
        this.users = Array.isArray(result) ? result : []
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
    avatarText(username) {
      return (username || '?').slice(0, 1).toUpperCase()
    },
    openProfile(user) {
      if (!user || !user.username) return
      uni.navigateTo({
        url: `/pages/profile/detail?username=${encodeURIComponent(user.username)}`,
      })
    },
  },
}
</script>

<style lang="scss" scoped>
.relation-page { min-height: 100vh; box-sizing: border-box; padding: 24rpx; }
.state-card { display: flex; flex-direction: column; align-items: center; gap: 24rpx; margin-top: 100rpx; padding: 48rpx 32rpx; color: #909399; text-align: center; background: #fff; border-radius: 20rpx; }
.state-title { color: #303133; font-size: 32rpx; font-weight: 600; }
.state-copy { font-size: 26rpx; line-height: 1.6; }
.refresh-error { margin-bottom: 20rpx; padding: 20rpx 24rpx; color: #f56c6c; font-size: 24rpx; text-align: center; background: #fef0f0; border-radius: 16rpx; }
.user-card { display: flex; align-items: center; margin-bottom: 20rpx; padding: 28rpx; background: #fff; border-radius: 20rpx; box-shadow: 0 8rpx 28rpx rgba(31, 41, 55, 0.05); }
.avatar { display: flex; flex: 0 0 auto; align-items: center; justify-content: center; width: 84rpx; height: 84rpx; color: #fff; font-size: 32rpx; font-weight: 700; background: #3c9cff; border-radius: 50%; }
.user-content { flex: 1; min-width: 0; margin-left: 24rpx; }
.username { color: #303133; font-size: 30rpx; font-weight: 600; }
.bio { overflow: hidden; margin-top: 10rpx; color: #909399; font-size: 25rpx; text-overflow: ellipsis; white-space: nowrap; }
.arrow { color: #c0c4cc; font-size: 46rpx; }
.refreshing { padding: 22rpx 0; color: #909399; font-size: 24rpx; text-align: center; }
</style>
