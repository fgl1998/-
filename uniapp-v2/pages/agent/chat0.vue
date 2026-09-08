<template>
  <view class="chat-page">
    <view v-if="!isLoggedIn" class="guest-card">
      <view class="assistant-mark">AI</view>
      <text class="guest-title">登录后与智能助手对话</text>
      <text class="guest-copy">用一句话查找社区文章，发现感兴趣的内容。</text>
      <u-button type="primary" shape="circle" @click="goLogin">去登录</u-button>
    </view>

    <template v-else>
      <view class="chat-notice">每次提问独立回答，离开页面后记录不会保存。</view>

      <scroll-view
        class="message-list"
        scroll-y
        :scroll-into-view="scrollTarget"
        :scroll-with-animation="true"
      >
        <view class="message-content">
          <view v-if="messages.length === 0" class="welcome-card">
            <view class="assistant-mark">AI</view>
            <view class="welcome-title">想找什么文章？</view>
            <view class="welcome-copy">我是 RealWorld 智能助手，可以帮你搜索文章、整理查询结果。</view>
            <view class="suggestions-title">可以这样问我</view>
            <view
              v-for="question in suggestions"
              :key="question"
              class="suggestion"
              @click="useSuggestion(question)"
            >
              <text>{{ question }}</text>
              <text class="suggestion-arrow">↗</text>
            </view>
          </view>

          <view
            v-for="message in messages"
            :key="message.id"
            :id="message.id"
            class="message-row"
            :class="{ 'message-row--user': message.role === 'user' }"
          >
            <text class="message-label">{{ message.role === 'user' ? '你' : '智能助手' }}</text>
            <view class="message-bubble" :class="{ 'message-bubble--user': message.role === 'user' }">
              <text class="message-text" selectable>{{ message.content }}</text>
            </view>
            <view v-if="message.status === 'failed'" class="message-error">
              <text>{{ message.error }}</text>
              <button class="retry-button" size="mini" :disabled="sending" @click="retryMessage(message)">重试</button>
            </view>
          </view>

          <view v-if="sending" class="pending-message">
            <view class="pending-dot" />
            <text>正在查找和整理，请稍候…</text>
          </view>
          <view id="chat-bottom" class="scroll-anchor" />
        </view>
      </scroll-view>

      <view class="composer">
        <textarea
          v-model="draft"
          class="composer-input"
          placeholder="输入你想查询的文章或关键词…"
          placeholder-class="input-placeholder"
          :maxlength="2000"
          :disabled="sending"
          :cursor-spacing="20"
          :adjust-position="true"
          :show-confirm-bar="false"
        />
        <view class="composer-actions">
          <text class="character-count">{{ draft.length }} / 2000</text>
          <view class="send-button">
            <u-button type="primary" shape="circle" size="small" :loading="sending" :disabled="!canSend" @click="sendMessage">
              {{ sending ? '等待回答' : '发送' }}
            </u-button>
          </view>
        </view>
      </view>
    </template>
  </view>
</template>

<script>
const agentApi = require('../../api/agent')
const session = require('../../common/session')

export default {
  data() {
    return {
      isLoggedIn: false,
      draft: '',
      messages: [],
      sending: false,
      scrollTarget: '',
      messageSequence: 0,
      activeToken: '',
      requestGeneration: 0,
      pageActive: false,
      suggestions: ['帮我找 Node.js 相关的文章', '最近有哪些文章？'],
    }
  },
  computed: {
    canSend() {
      const message = this.draft.trim()
      return this.isLoggedIn && !this.sending && message.length > 0 && message.length <= 2000
    },
  },
  onShow() {
    this.pageActive = true
    this.syncSession()
  },
  onUnload() {
    this.pageActive = false
    this.resetConversation()
  },
  methods: {
    resetConversation() {
      // 消息只属于当前页面实例；旧请求完成时也不能重新填回这些消息。
      this.requestGeneration += 1
      this.messages = []
      this.draft = ''
      this.sending = false
      this.scrollTarget = ''
    },
    syncSession() {
      const token = session.getToken()
      if (token !== this.activeToken) {
        this.resetConversation()
        this.activeToken = token
      }
      this.isLoggedIn = Boolean(token)
      return token
    },
    goLogin() {
      uni.navigateTo({ url: '/pages/login/login' })
    },
    useSuggestion(question) {
      if (!this.sending) this.draft = question
    },
    scrollToMessage(target = 'chat-bottom') {
      this.scrollTarget = ''
      this.$nextTick(() => {
        if (this.pageActive) this.scrollTarget = target
      })
    },
    async sendMessage() {
      if (!this.pageActive || this.sending) return
      const token = this.syncSession()
      if (!token) {
        this.goLogin()
        return
      }
      const content = this.draft.trim()
      if (!content) return
      if (content.length > 2000) {
        uni.showToast({ title: '问题不能超过 2000 个字符', icon: 'none' })
        return
      }
      const question = {
        id: `message-${++this.messageSequence}`,
        role: 'user',
        content,
        status: 'pending',
        error: '',
      }
      this.messages.push(question)
      this.draft = ''
      await this.requestAnswer(question, token)
    },
    async retryMessage(question) {
      if (!this.pageActive || this.sending) return
      const token = this.syncSession()
      if (!token) {
        this.goLogin()
        return
      }
      if (!this.messages.includes(question) || question.status !== 'failed') return
      await this.requestAnswer(question, token)
    },
    async requestAnswer(question, token) {
      const generation = ++this.requestGeneration
      let scrollTarget = question.id
      this.sending = true
      question.status = 'pending'
      question.error = ''
      this.scrollToMessage()

      try {
        const result = await agentApi.chat(question.content)
        if (!this.isCurrentRequest(generation, token)) return
        const answer = result && typeof result.answer === 'string' ? result.answer.trim() : ''
        if (!answer) throw new Error('助手暂时没有返回回答，请重试')
        question.status = 'sent'
        const reply = {
          id: `message-${++this.messageSequence}`,
          role: 'assistant',
          content: answer,
          status: 'sent',
          error: '',
        }
        // 重试早先的问题时，回答仍放在对应问题后面，避免问答错位。
        this.messages.splice(this.messages.indexOf(question) + 1, 0, reply)
        scrollTarget = reply.id
      } catch (error) {
        if (!this.isCurrentRequest(generation, token)) return
        question.status = 'failed'
        question.error = (error && error.message) || '暂时无法回答，请稍后重试'
      } finally {
        if (this.pageActive && generation === this.requestGeneration) {
          this.sending = false
          this.syncSession()
          this.scrollToMessage(scrollTarget)
        }
      }
    },
    isCurrentRequest(generation, token) {
      return this.pageActive && generation === this.requestGeneration && session.getToken() === token
    },
  },
}
</script>

<style lang="scss" scoped>
.chat-page { display: flex; flex-direction: column; height: calc(100vh - var(--window-top, 0px)); overflow: hidden; background: #f5f7fa; }
.chat-notice { flex-shrink: 0; padding: 20rpx 24rpx; color: #7c8798; font-size: 22rpx; text-align: center; background: #edf3fa; }
.message-list { flex: 1; height: 0; min-height: 0; }
.message-content { padding: 28rpx 28rpx 0; }
.welcome-card { margin: 16rpx 0 32rpx; padding: 40rpx 32rpx; background: #fff; border-radius: 24rpx; box-shadow: 0 10rpx 36rpx rgba(31, 41, 55, 0.04); }
.assistant-mark { display: flex; align-items: center; justify-content: center; width: 76rpx; height: 76rpx; color: #fff; font-size: 27rpx; font-weight: 700; background: #3c9cff; border-radius: 22rpx; }
.welcome-title { margin-top: 28rpx; color: #303133; font-size: 40rpx; font-weight: 700; }
.welcome-copy { margin-top: 16rpx; color: #606266; font-size: 27rpx; line-height: 1.75; }
.suggestions-title { margin: 36rpx 0 16rpx; color: #909399; font-size: 23rpx; }
.suggestion { display: flex; align-items: center; justify-content: space-between; margin-top: 16rpx; padding: 24rpx; color: #3979b7; font-size: 26rpx; line-height: 1.5; background: #f2f7fd; border-radius: 16rpx; }
.suggestion-arrow { flex-shrink: 0; margin-left: 12rpx; font-size: 30rpx; }
.message-row { display: flex; flex-direction: column; align-items: flex-start; margin-bottom: 32rpx; }
.message-row--user { align-items: flex-end; }
.message-label { margin: 0 8rpx 12rpx; color: #909399; font-size: 22rpx; }
.message-bubble { max-width: 94%; padding: 24rpx 28rpx; color: #303133; background: #fff; border-radius: 4rpx 22rpx 22rpx; }
.message-bubble--user { max-width: 88%; color: #fff; background: #3c9cff; border-radius: 22rpx 4rpx 22rpx 22rpx; }
.message-text { font-size: 28rpx; line-height: 1.8; white-space: pre-wrap; overflow-wrap: anywhere; word-break: break-word; }
.message-error { display: flex; align-items: center; max-width: 94%; margin-top: 14rpx; color: #d75555; font-size: 23rpx; line-height: 1.6; }
.retry-button { flex-shrink: 0; margin: 0 0 0 16rpx; padding: 0 20rpx; color: #3c9cff; font-size: 23rpx; background: #fff; }
.retry-button::after { border-color: #d5e6f8; }
.pending-message { display: flex; align-items: center; margin: 8rpx 0 28rpx; color: #7c8798; font-size: 25rpx; }
.pending-dot { width: 14rpx; height: 14rpx; margin-right: 14rpx; background: #3c9cff; border-radius: 50%; }
.scroll-anchor { height: 24rpx; }
.composer { flex-shrink: 0; padding: 24rpx 28rpx; padding-bottom: calc(24rpx + constant(safe-area-inset-bottom)); padding-bottom: calc(24rpx + env(safe-area-inset-bottom)); background: #fff; border-top: 1rpx solid #e8edf3; }
.composer-input { width: 100%; height: 112rpx; padding: 16rpx 20rpx; color: #303133; font-size: 28rpx; line-height: 1.6; background: #f5f7fa; border-radius: 16rpx; }
.input-placeholder { color: #a0a8b3; }
.composer-actions { display: flex; align-items: center; justify-content: space-between; margin-top: 18rpx; }
.character-count { color: #a0a8b3; font-size: 22rpx; }
.send-button { width: 184rpx; }
.guest-card { display: flex; flex-direction: column; align-items: center; margin: 100rpx 24rpx 24rpx; padding: 48rpx 32rpx; text-align: center; background: #fff; border-radius: 24rpx; }
.guest-title { margin-top: 28rpx; color: #303133; font-size: 34rpx; font-weight: 600; }
.guest-copy { margin: 20rpx 0 36rpx; color: #909399; font-size: 27rpx; line-height: 1.7; }
</style>
