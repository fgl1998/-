<template>
  <view class="common-section">
    <!-- 卡片 -->
    <view class="common-card" v-for="(record, index) in data" :key="index">
      <!-- 内容区 -->
      <view class="common-content">
        <view class="common-item" v-for="field in schema" :key="field.prop">
          <span class="common-label">{{ field.label }}：</span>
          <span class="common-value">
            {{ renderField(record, field) }}
          </span>
        </view>
      </view>

      <!-- 操作按钮 -->
      <view class="card-actions" v-if="actions.length">
        <view
          v-for="action in actions"
          :key="action.key"
          class="action-btn"
          :class="[action.type, { disabled: isDisabled(action, record) }]"
          @click="onActionClick(action, record)"
        >
          {{ action.text }}
        </view>
      </view>
    </view>

    <!-- 空态 -->
    <view class="employment-record-empty" v-if="!data || data.length === 0"> 暂无申请记录 </view>
  </view>
</template>

<script>
export default {
  name: 'RecordCardList',

  props: {
    data: {
      type: Array,
      default: () => [],
    },
    schema: {
      type: Array,
      required: true,
    },
    actions: {
      type: Array,
      default: () => [],
      /**
       * [{
       *   key: 'edit',
       *   text: '编辑',
       *   type: 'primary',
       *   disabledWhen(record) {}
       * }]
       */
    },
  },

  methods: {
    /* ===== 字段展示 ===== */

    renderField(record, field) {
      const value = record[field.prop]

      if (value === undefined || value === null || value === '') {
        return '-'
      }

      if (typeof field.formatter === 'function') {
        return field.formatter(value, record)
      }

      if (field.dict && this.$dict) {
        return this.$dict.getDict(field.dict, value)
      }

      if (field.map) {
        return field.map[value] || value
      }

      return value
    },

    /* ===== 操作按钮 ===== */

    isDisabled(action, record) {
      if (typeof action.disabledWhen === 'function') {
        return action.disabledWhen(record)
      }
      return false
    },

    onActionClick(action, record) {
      if (this.isDisabled(action, record)) return

      this.$emit('action', {
        key: action.key,
        record,
      })
    },
  },
}
</script>

<style scoped>
.common-card {
  background: #ffffff;
  border-radius: 16rpx;
  padding: 24rpx;
  margin-bottom: 20rpx;

  /* 关键：弱阴影 + 边框 */
  box-shadow: 0 6rpx 16rpx rgba(0, 0, 0, 0.04);
  border: 1px solid #ebeef5;
}

.common-content {
  display: flex;
  flex-direction: column;
}

.common-item {
  display: flex;
  margin-bottom: 12rpx;
}

.common-label {
  color: #909399;
  font-size: 26rpx;
}

.common-value {
  color: #303133;
  font-size: 26rpx;
}

.card-actions {
  display: flex;
  justify-content: flex-end;
  margin-top: 20rpx;
}

.action-btn {
  padding: 8rpx 20rpx;
  border-radius: 8rpx;
  font-size: 26rpx;
  margin-left: 16rpx;
}

.action-btn.primary {
  background: #409eff;
  color: #fff;
}

.action-btn.secondary {
  border: 1px solid #409eff;
  color: #409eff;
}

.action-btn.danger {
  border: 1px solid #f56c6c;
  color: #f56c6c;
}

.action-btn.disabled {
  opacity: 0.5;
  pointer-events: none;
}

.employment-record-empty {
  text-align: center;
  padding: 40px 0;
  color: #999;
  font-size: 14px;
  background-color: #fff;
  border-radius: 8px;
  background: #f5f7fa; /* 页面浅灰 */
}
</style>
