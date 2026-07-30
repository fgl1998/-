<template>
  <view class="action-bar">
    <view
      v-for="item in items"
      :key="item.key"
      class="action-item"
      :class="{ disabled: isDisabled(item.key) }"
      @click="handleClick(item)"
    >
      <u-icon :name="ICON_MAP[item.type]" :color="iconColor(item.key, item.type)" size="32" />
      <text class="label">{{ item.text }}</text>
    </view>
  </view>
</template>

<script>
const ICON_MAP = {
  success: 'checkbox-mark',
  reset: 'reload',
  close: 'close-circle',
  info: 'info-circle',
}

const COLOR_MAP = {
  success: '#67c23a',
  reset: '#409eff',
  close: '#f56c6c',
  info: '#409eff',
}

const DISABLED_COLOR = '#c0c4cc'

export default {
  name: 'ActionBar',
  props: {
    /** 固定按钮定义 */
    items: {
      type: Array,
      required: true,
      // [{ key, type, text }]
    },

    /** 动态禁用 key 列表 */
    disabledKeys: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      ICON_MAP,
    }
  },
  methods: {
    isDisabled(key) {
      return this.disabledKeys.includes(key)
    },
    iconColor(key, type) {
      return this.isDisabled(key) ? DISABLED_COLOR : COLOR_MAP[type]
    },
    handleClick(item) {
      if (this.isDisabled(item.key)) return
      this.$emit('action', { key: item.key })
    },
  },
}
</script>

<style scoped>
.action-bar {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 24rpx;
}

.action-item {
  display: flex;
  align-items: center;
  gap: 8rpx;
  font-size: 28rpx;
  color: #303133;
}

.action-item.disabled {
  color: #c0c4cc;
}
</style>
