<template>
  <div v-if="visible" :class="panelClass">
    <div class="popup-mask" @click="handleMaskClick"></div>

    <div
      :class="['popup-wrapper', animation ? 'popup-wrapper--animation' : '']"
      role="dialog"
      aria-modal="true"
      @click.stop
    >
      <div class="screen-box">
        <div class="screen-title">
          <div class="screen-title-base">
            <span v-if="titleHighlight" class="screen-title-highlight">{{ titleHighlight }}</span>
            <span v-if="titleText">{{ titleText }}</span>
            <span v-if="titleDesc" class="screen-title-desc">{{ titleDesc }}</span>
          </div>
          <div v-if="showClose" class="screen-title-close" @click="close">
            <img src="../assets/icon-close.png" alt="关闭" />
          </div>
        </div>

        <slot></slot>
        <slot name="footer"></slot>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'industry-popup-panel',
  props: {
    type: {
      type: String,
      default: 'center',
    },
    animation: {
      type: Boolean,
      default: true,
    },
    maskClick: {
      type: Boolean,
      default: true,
    },
    showClose: {
      type: Boolean,
      default: true,
    },
    titleHighlight: {
      type: String,
      default: '',
    },
    titleText: {
      type: String,
      default: '',
    },
    titleDesc: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      visible: false,
      previousBodyOverflow: '',
      escListenerBound: false,
    }
  },
  computed: {
    panelClass() {
      return ['popup-panel', `popup-panel--${this.popupType}`]
    },
    popupType() {
      const supportTypes = ['center', 'top', 'bottom', 'left', 'right']
      return supportTypes.includes(this.type) ? this.type : 'center'
    },
  },
  beforeDestroy() {
    this.toggleEscapeListener(false)
    this.toggleBodyScroll(false)
  },
  methods: {
    open() {
      if (this.visible) {
        return
      }
      this.visible = true
      this.toggleBodyScroll(true)
      this.toggleEscapeListener(true)
      this.emitStateChange(true)
    },
    close() {
      if (!this.visible) {
        return
      }
      this.visible = false
      this.toggleEscapeListener(false)
      this.toggleBodyScroll(false)
      this.emitStateChange(false)
    },
    handleMaskClick() {
      if (this.maskClick) {
        this.close()
        return
      }
      this.$emit('maskClick')
    },
    emitStateChange(show) {
      const event = { show }
      this.$emit('change', event)
      this.$emit(show ? 'open' : 'close', event)
    },
    handleWindowKeydown(event) {
      if (event.key === 'Escape') {
        this.close()
      }
    },
    toggleEscapeListener(shouldBind) {
      if (typeof window === 'undefined') {
        return
      }
      if (shouldBind && !this.escListenerBound) {
        window.addEventListener('keydown', this.handleWindowKeydown)
        this.escListenerBound = true
        return
      }
      if (!shouldBind && this.escListenerBound) {
        window.removeEventListener('keydown', this.handleWindowKeydown)
        this.escListenerBound = false
      }
    },
    toggleBodyScroll(shouldLock) {
      if (typeof document === 'undefined' || !document.body) {
        return
      }
      if (shouldLock) {
        this.previousBodyOverflow = document.body.style.overflow
        document.body.style.overflow = 'hidden'
        return
      }
      document.body.style.overflow = this.previousBodyOverflow || ''
      this.previousBodyOverflow = ''
    },
  },
}
</script>

<style lang="scss" scoped>
.popup-panel {
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 9999;
  display: flex;
  padding: 24px;
  box-sizing: border-box;
  overflow: hidden;
}

.popup-panel--center {
  align-items: center;
  justify-content: center;
}

.popup-panel--top {
  align-items: flex-start;
  justify-content: center;
}

.popup-panel--bottom {
  align-items: flex-end;
  justify-content: center;
}

.popup-panel--left {
  align-items: center;
  justify-content: flex-start;
}

.popup-panel--right {
  align-items: center;
  justify-content: flex-end;
}

.popup-mask {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  background: rgba(0, 0, 0, 0.45);
}

.popup-wrapper {
  position: relative;
  z-index: 1;
}

.popup-wrapper--animation {
  animation: popup-enter 0.2s ease-out;
}

.screen-box {
  width: 1440px;
  max-width: calc(100vw - 48px);
  height: 800px;
  max-height: calc(100vh - 48px);
  background: #fdfdfd;
  border-radius: 20px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  box-shadow: 0 24px 60px rgba(0, 0, 0, 0.16);
}

.screen-title {
  box-sizing: border-box;
  width: 100%;
  min-height: 70px;
  padding: 0 30px;
  border-bottom: 1px solid #dddddd;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #fdfdfd;
  flex-shrink: 0;
}

.screen-title-base {
  flex: 1;
  min-width: 0;
  min-height: 70px;
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 0px;
  font-weight: 600;
  font-size: 24px;
  color: rgba(0, 0, 0, 0.9);
  position: relative;
  padding-left: 15px;
}

.screen-title-base::before {
  content: '';
  position: absolute;
  top: 50%;
  left: 0;
  transform: translateY(-50%);
  width: 8px;
  height: 23px;
  background: #0c6af7;
  border-radius: 2px;
}

.screen-title-highlight {
  color: #0c6af7;
}

.screen-title-desc {
  margin-left: 5px;
  font-weight: 400;
  font-size: 18px;
  color: rgba(0, 0, 0, 0.6);
  line-height: 21px;
}

.screen-title-close {
  width: 34px;
  height: 34px;
  flex-shrink: 0;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border: none;
  padding: 0;
  background: transparent;
  cursor: pointer;
}

.screen-title-close img {
  width: 100%;
  height: 100%;
  display: block;
}

@keyframes popup-enter {
  from {
    opacity: 0;
    transform: translateY(12px) scale(0.98);
  }

  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

@media (max-width: 768px) {
  .popup-panel {
    padding: 12px;
  }

  .screen-box {
    max-width: calc(100vw - 24px);
    height: calc(100vh - 24px);
    max-height: calc(100vh - 24px);
    border-radius: 16px;
  }

  .screen-title {
    min-height: 60px;
    padding: 0 16px;
  }

  .screen-title-base {
    min-height: 60px;
    padding-left: 12px;
    font-size: 18px;
  }

  .screen-title-base::before {
    width: 6px;
    height: 18px;
  }

  .screen-title-desc {
    margin-left: 0;
    font-size: 13px;
    line-height: 18px;
    width: 100%;
  }

  .screen-title-close {
    width: 28px;
    height: 28px;
  }
}
</style>
