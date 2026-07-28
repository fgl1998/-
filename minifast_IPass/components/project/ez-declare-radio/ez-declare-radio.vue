<template>
  <view class="ez-declare-radio-wrapper" :class="[aglin]">
    <div class="key" :class="{ required: required }" v-if="label">{{ label }}</div>
    <radio-group v-if="type === 'radio'" class="radio-group" @change="handleChange">
      <block v-for="item in localRange" :key="item[valueKey]">
        <label class="label" :for="'radio' + item[valueKey]" :class="[item.checked ? 'checked' : '']">
          <div class="iconfont" :class="[item.checked ? 'iconfont-radio-checked' : 'iconfont-radio']"></div>
          <radio class="radio" :checked="item.checked" :value="item[valueKey]" :id="'radio' + item[valueKey]"></radio>
          <div class="label-text">
            {{ item[renderKey] }}
          </div>
        </label>
      </block>
    </radio-group>
    <checkbox-group v-if="type === 'checkbox'" class="checked-group d-f fw-w ai-c" @change="handleChange">
      <block v-for="item in localRange" :key="item[valueKey]">
        <label :for="'c_' + item[valueKey]" class="label d-f ai-c" :class="[item.checked ? 'checked' : '']">
          <div class="iconfont" :class="[item.checked ? 'iconfont-checkbox-checked' : 'iconfont-checkbox']"></div>
          <checkbox
            class="checkbox"
            :id="'c_' + item[valueKey]"
            :value="item[valueKey]"
            :checked="item.checked"></checkbox>
          <p class="label-text">{{ item[renderKey] }}</p>
        </label>
      </block>
    </checkbox-group>
  </view>
</template>

<script>
  /**
   * 申报 radio/checkbox 组件
   * @description 申报 radio/checkbox 组件
   */
  export default {
    name: 'ezDeclareRadio',
    props: {
      label: {
        type: [String],
        default: ''
      },
      value: {
        type: [String, Array]
      },
      renderKey: {
        type: [String],
        default: 'aaa103'
      },
      valueKey: {
        type: [String],
        default: 'aaa102'
      },
      // id 唯一标识
      idName: {
        type: [String],
        default: ''
      },
      // 类型 radio 单选 checkbox 多选
      type: {
        type: [String],
        default: 'radio'
      },
      // 排序方向
      aglin: {
        type: [String],
        default: 'right'
      },
      // 渲染数据
      range: {
        type: [Array],
        default: () => {
          return []
        }
      },
      required: {
        type: [Boolean],
        default: true
      }
    },
    data() {
      return {
        localRange: [], // 本地range
        time: 0 // 次数
      }
    },
    components: {},
    created() {},
    mounted() {
      this.init()
    },
    methods: {
      // 初始化
      init() {
        const range = [...this.range]
        const value = this.value
        const valueKey = this.valueKey
        const type = this.type
        const newRange = []
        if (type === 'radio') {
          range.forEach((item) => {
            item.checked = false
            if (item[valueKey] === value) {
              item.checked = true
            }
            newRange.push(item)
          })
        }
        if (type === 'checkbox') {
          range.forEach((item) => {
            item.checked = false
            if (value) {
              value.forEach((one) => {
                if (item[valueKey] === one) {
                  item.checked = true
                }
              })
            }
            newRange.push(item)
          })
        }
        this.localRange = [...newRange]
      },
      // 捕获 change
      handleChange(e) {
        const { value } = e.target
        const range = [...this.range]
        const valueKey = this.valueKey
        const renderKey = this.renderKey
        const type = this.type
        const idName = this.idName

        const newRange = []

        let name = ''
        if (type === 'checkbox') {
          range.forEach((item) => {
            item.checked = false
            if (value) {
              value.forEach((one) => {
                if (item[valueKey] === one) {
                  item.checked = true
                }
              })
            }
            newRange.push(item)
          })
        }
        if (type === 'radio') {
          range.forEach((item) => {
            item.checked = false
            if (item[valueKey] === value) {
              item.checked = true
              name += item[renderKey]
            }
            newRange.push(item)
          })
        }
        this.localRange = [...newRange]
        this.$emit('input', value)
        this.$emit('change', idName, name, value)
      }
    },
    watch: {
      range: {
        handler(val) {
          if (val && val.length > 0) {
            this.init()
          }
        },
        immediate: true
      },
      value: {
        handler(val) {
          this.init()
        },
        immediate: true
      }
    }
  }
</script>

<style lang="scss" scoped>
  .checkbox,
  .radio {
    width: 0;
    height: 0;
    display: none;
  }
  .ez-declare-radio-wrapper {
    width: 100%;
    border-bottom: 1px solid $border-color;
    padding: 6rpx 0;
    display: flex;
    flex-direction: column;
    .key {
      font-size: 30rpx;
      line-height: 1.4;
      color: $color;
      font-weight: 700;
      padding-left: 14rpx;
      position: relative;
      max-width: 300rpx;
    }
    .required {
      &::before {
        content: '*';
        position: absolute;
        color: #f00;
        top: 0;
        left: 0;
      }
    }
    .checked-group,
    .radio-group {
      width: 100%;
      display: flex;
      flex-wrap: wrap;
      .label {
        font-size: 30rpx;
        height: 88rpx;
        color: shade($color-placeholder, 20%);
        font-weight: 700;
        transition: all 0.3s;
        display: flex;
        align-items: center;
        margin-right: $spacing * 2;
        &.checked {
          color: $primary;
        }
        &:last-child {
          border-bottom: 0;
          margin-right: 0;
        }
      }
      .iconfont {
        font-size: 32rpx;
        margin-right: 20rpx;
        transition: all 0.3s;
      }

      .label-text {
        flex: 1;
        overflow: hidden;
        line-height: 1.4;
      }
    }
    &.right {
      flex-direction: row;
      align-items: center;
      justify-content: space-between;
      .checked-group,
      .radio-group {
        flex: 1;
        justify-content: flex-end;
      }
    }
  }
</style>
