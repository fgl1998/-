<template>
  <view class="ez-declare-card-wrapper">
    <block v-for="(item, index) in renderData" :key="item.id">
      <div class="card">
        <div class="operating">
          <div class="iconfont iconfont-edit" @click.stop="handleEdit(index)"></div>
          <div class="iconfont iconfont-delete" @click.stop="handleDelete(index)"></div>
        </div>
        <div class="cells"></div>
      </div>
    </block>

    <div class="card add" @click="handleAdd">
      <div class="iconfont iconfont-add"></div>
      <div class="">{{ addButtonName }}</div>
    </div>

    <ComponentPopup ref="popup" type="center" style="max-height: 100px">
      <div class="popup-con">
        <div class="button-wrapper">
          <ComponentButton name="保存" type="primary" @click="handleSave"></ComponentButton>
        </div>
        <div class="iconfont iconfont-close" @click="closePopup"></div>
      </div>
    </ComponentPopup>
  </view>
</template>

<script>
  import ComponentPopup from '@/components/common/ez-popup/ez-popup.vue'
  import ComponentDeclarePicker from '@/components/project/ez-declare-picker/ez-declare-picker.vue'
  import ComponentButton from '@/components/common/ez-button/ez-button.vue'
  import { getCodeListByCodeName } from '@/utils/custom-api'
  import ComponentDeclareRadio from '@/components/project/ez-declare-radio/ez-declare-radio.vue'
  import { showModal } from '@/utils/uni-api'
  import { getDate } from '@/utils/get'
  import { checkIDCard, checkPhoneNumber } from '@/utils/check'
  import { getAge } from '@/utils/get'
  import { requestSPGetHo08 } from '@/service/api'
  /**
   * 申报 卡片 组件
   * @description 申报 卡片 组件
   */
  export default {
    name: 'ezDeclareCard',
    props: {
      // 渲染数据
      renderData: {
        type: [Array],
        default: () => {
          return []
        }
      },
      // 添加按钮名称
      addButtonName: {
        type: [String],
        default: '添加'
      },
      // 类型 根据项目编号设定
      type: {
        type: [String],
        required: true
      }
    },
    data() {
      return {
        // 选择的信息 或者 填报的信息
        selectInfo: {},
        // 码值
        codeMap: {}
      }
    },
    components: {
      ComponentPopup,
      ComponentButton,
      ComponentDeclarePicker,
      ComponentDeclareRadio
    },
    filters: {},
    computed: {},
    created() {},
    mounted() {
      this.getCodeTableCacheData()
    },
    methods: {
      openPopup() {
        this.$refs.popup.open()
      },
      closePopup() {
        this.$refs.popup.close()
      },
      // 获取该申报项目的所需要的码表数据
      getCodeTableCacheData() {},

      // 检测输入项是否输入合法
      handleCheck() {
        return true
      },
      // 添加
      handleAdd() {
        this.selectInfo = {}

        this.openPopup()
      },
      // 编辑
      handleEdit(index) {
        const item = this.renderData[index]
        this.selectInfo = {
          ...item
        }
        this.openPopup()
      },
      // 删除
      handleDelete(index) {
        const type = this.type
        const newRenderData = [...this.renderData]
        newRenderData.splice(index, 1)
        this.$emit('change', type, newRenderData)
      },
      // 保存
      handleSave() {
        const result = this.handleCheck()
        if (!result) {
          return
        }
        const type = this.type
        const renderData = [...this.renderData]
        const newRenderData = []
        let selectInfo = { ...this.selectInfo }
        const { id } = selectInfo
        // 编辑
        if (id) {
          renderData.forEach((item) => {
            if (item.id === id) {
              item = {
                ...selectInfo
              }
            }
            newRenderData.push(item)
          })
          this.$emit('change', type, newRenderData)
        } else {
          // 添加
          // console.log('======selectInfo====', selectInfo)
          selectInfo = { ...selectInfo, id: +new Date() + '' }
          renderData.push(selectInfo)
          this.$emit('change', type, renderData)
        }
        this.selectInfo = { ...selectInfo }
        this.closePopup()
      }
    },
    watch: {}
  }
</script>

<style lang="scss" scoped>
  .ez-declare-card-wrapper {
    .card {
      background-color: #ffffff;
      border-radius: 8rpx;
      border: solid 1px $border-color;
      font-size: 28rpx;
      line-height: 1;
      color: $color;
      padding: 20rpx;
      position: relative;
      margin-bottom: 24rpx;
      &.add {
        color: $primary;
        min-height: 200rpx;
        font-size: 32rpx;
        font-weight: 500;
        display: flex;
        align-items: center;
        justify-content: center;
        margin-bottom: 0;
        .iconfont-add {
          font-size: 40rpx;
        }
      }
      .cell {
        margin-bottom: 20rpx;
        font-size: 28rpx;
        line-height: 1.4;
        display: flex;
        .key {
          color: $color;
        }
        .name {
          font-weight: 600;
          font-size: 32rpx;
        }
        .relationship_man {
          box-sizing: border-box;
          border: 1px solid #aac1de;
          color: #2f77e2;
          font-size: 24rpx;
          padding: 2rpx 10rpx;
          background-color: #d6e8ff;
          border-radius: 5rpx;
        }
        .relationship_woman {
          box-sizing: border-box;
          border: 1px solid #d694c2;
          color: #e615a6;
          font-size: 24rpx;
          padding: 2rpx 10rpx;
          background-color: #fff0fa;
          border-radius: 5rpx;
        }
        .interval {
          padding: 0 10rpx;
          color: #ccc;
        }
        .value {
          flex: 1;
          overflow: hidden;
          color: #ff7e00;
        }
        &:last-of-type {
          margin-bottom: 0;
        }
      }
      .operating {
        position: absolute;
        right: 0;
        top: 0;
        display: flex;
        align-items: center;
        .iconfont {
          font-size: 32rpx;
          color: $primary;
          padding: 20rpx;
        }
      }
    }
    .popup-con {
      width: 700rpx;
      background-color: #fff;
      position: relative;
      padding: 40rpx;
      padding-top: 60rpx;
      border-radius: 8rpx;
      .input-cell {
        display: flex;
        align-items: center;
        border-bottom: 1px solid $border-color;

        height: 100rpx;
        .key {
          font-size: 30rpx;
          color: $color;
          font-weight: 700;
          padding-left: 14rpx;
          position: relative;
          &::before {
            content: '*';
            position: absolute;
            color: #f00;
            top: 50%;
            transform: translateY(-50%);
            margin-top: -4rpx;
            left: 0;
          }
        }
        .value {
          flex: 1;
          color: shade($color-placeholder, 20%);
          overflow: hidden;
          padding-left: 20rpx;
          text-align: right;
        }
        .input {
          font-size: 30rpx;
          line-height: 1.4;
          color: shade($color-placeholder, 20%);
          display: block;
          font-weight: 700;
          width: 100%;
        }
        &.disabled {
          .value,
          input {
            opacity: 0.4;
          }
        }
      }
      .box-over {
        max-height: 550rpx;
        overflow-y: scroll;
        -webkit-overflow-scrolling: touch;
      }
      .button-wrapper {
        padding: $spacing * 2;
        padding-bottom: 20rpx;
      }
      .iconfont-close {
        position: absolute;
        top: 10rpx;
        right: 10rpx;
        font-size: 36rpx;
        color: #f00;
        padding: 12rpx;
      }
    }
  }
</style>
