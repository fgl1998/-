<template>
  <el-dialog
    :visible.sync="visible"
    :append-to-body="true"
    width="60%"
    :close-on-click-modal="false"
    custom-class="dialog"
    :before-close="handleClose"
  >
    <div slot="title" class="title">
      <image src="../../static/images/work.png" />
      <view>面试通知</view>
    </div>
    请 <span>xxx</span> 参加面试。
  </el-dialog>
</template>

<script>
import moment from 'moment'

export default {
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    data: {
      type: Object,
      default: () => {},
    },
  },
  data() {
    return {
      // disabledDate: (current) => {
      //   return current < this.moment().startOf('day')
      // },
    }
  },
  watch: {},
  mounted() {},
  methods: {
    handleClose() {
      this.$emit('close')
    },
  },
}
</script>

<style lang="less" scoped>
/deep/ .el-dialog {
  border-radius: 8px;
}

/deep/ .el-dialog__header {
  padding: 0px;
}

/deep/ .el-icon-close {
  width: 24px;
  height: 24px;
  color: #ffffff;
}

/deep/ .el-icon-close:hover {
  color: #ffffff;
}

/deep/ .el-form-item__label {
  font-family: SourceHanSansCN, SourceHanSansCN;
  font-weight: 400;
  font-size: 18px;
  color: #333333;
  text-align: left;
  font-style: normal;
}

/deep/ .el-form-item {
  margin-right: 36px;
}

.title {
  width: calc(100% - 24px);
  height: 48px;
  background: linear-gradient(180deg, #35aeff 0%, #0375f2 100%);
  border-radius: 8px 8px 0 0;
  padding: 22px 0 0 24px;
  display: flex;

  > image {
    height: 24px;
    width: 24px;
    margin-right: 12px;
  }

  > view {
    width: 296px;
    font-family: SourceHanSansCN, SourceHanSansCN;
    font-weight: 500;
    font-size: 24px;
    color: #ffffff;
    line-height: 24px;
    text-align: left;
    font-style: normal;
  }
}

.top {
  width: 100%;
  display: flex;

  > image {
    width: 98px;
    height: 98px;
    margin-right: 28px;
  }

  .base-info {
    > view:first-child {
      height: 30px;
      font-family: SourceHanSansCNBold, SourceHanSansCNBold;
      font-weight: bold;
      font-size: 24px;
      color: #333333;
      text-align: left;
      font-style: normal;
    }

    > view:nth-child(2) {
      // width: 100%;
      margin-top: 8px;
      display: flex;

      > view {
        // height: 30px;
        font-family: SourceHanSansCN, SourceHanSansCN;
        font-weight: 400;
        font-size: 18px;
        color: #666666;
        text-align: left;
        font-style: normal;
      }

      > view:nth-child(1) {
        width: 200px;
        border-right: 1px solid #666666;
        margin-right: 20px;
      }

      > view:nth-child(2) {
        width: 55px;
        border-right: 1px solid #666666;
        margin-right: 20px;
      }

      > view:nth-child(3) {
        width: 100px;
        border-right: 1px solid #666666;
        margin-right: 20px;
      }
    }

    > view:last-child {
      display: flex;
      font-family: SourceHanSansCN, SourceHanSansCN;
      font-weight: 400;
      font-size: 18px;
      color: #666666;
      text-align: left;
      font-style: normal;
      margin-top: 8px;

      > view:first-child {
        // width: 350px;
        padding-right: 20px;
        border-right: 1px solid #666666;
        margin-right: 20px;
      }
    }
  }
}

.form {
  margin: 57px 0 0 0;
  border-top: 1px solid #eeeeee;
  padding: 42px 0 0 70px;
}

/deep/ .el-dialog__footer {
  text-align: center;
}
</style>
