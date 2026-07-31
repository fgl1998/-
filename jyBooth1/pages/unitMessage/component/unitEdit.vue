<template>
  <view id="unitEdit" v-show="editShow">
    <view>
      <view>企业简介编辑</view>
      <view class="inputView">
        <uni-easyinput
          type="textarea"
          autoHeight
          v-model="editInfo"
          placeholder="请输入公司简介"
          placeholderStyle="fontSize:28px;font-weight: 400;"
          maxlength="-1"
        ></uni-easyinput>
      </view>
      <view class="btnView">
        <view @click="closeEdit">取消</view>
        <view @click="saveEdit">保存</view>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  name: 'unitEdit',
  props: {
    editShow: {
      type: Boolean,
    },
    userInfo: {
      type: String,
    },
    aab004: {
      type: String,
      required: true,
    },
  },
  watch: {
    editShow: {
      handler(val) {
        if (val) {
          this.editInfo = this.htmlDecode(this.userInfo)
        }
      },
    },
  },
  data() {
    return {
      editInfo: '',
      param1: {
        apiCode: 'jy201_hrm512',
        method: 'jy201_hrm512',
        aab001: '',
      },
    }
  },
  methods: {
    htmlDecode(text) {
      var dom = document.createElement('div')
      dom.innerHTML = text
      let outPut = dom.innerText || dom.contentText
      dom = null
      return outPut
    },
    closeEdit(value) {
      this.$emit('closeEdit', { type: false, values: value })
    },
    saveEdit() {
      const loginInfo = this.$loginConfig.getLoginInfo()
      this.param1.aab001 = loginInfo.aab001
      this.param1.aab092 = this.editInfo
      // this.param1.aab004 = '四川久远投资控股集团有限公司'
      this.param1.aab004 = this.aab004
      this.$http
        .post(this.$requestConstant.businessRequestType, 'jy201_hrm512', null, this.param1, true)
        .then((responseData) => {
          uni.showToast({
            title: '保存成功',
            duration: 2000,
            icon: 'none',
          })
          this.closeEdit(this.editInfo)
        })
    },
  },
}
</script>

<style lang="scss" scoped>
#unitEdit {
  width: 100%;
  height: 100%;
  position: fixed;
  top: 0;
  left: 0;
  background-color: rgba(0, 0, 0, 0.7);

  > view {
    width: 1678px;
    height: 854px;
    background: #ffffff;
    border-radius: 8px;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translateX(-50%) translateY(-50%);
    -webkit-transform: translateX(-50%) translateY(-50%);

    > view:last-child {
      padding: 32px 24px 0px 24px;
    }

    > view:first-child {
      background-color: #1f8cff;
      font-size: 30px;
      font-weight: bolder;
      color: white;
      text-align: center;
      height: 100px;
      line-height: 100px;
      border-radius: 8px 8px 0px 0px;
    }
  }

  .inputView::-webkit-scrollbar {
    /*滚动条整体样式*/
    width: 12px; /*高宽分别对应横竖滚动条的尺寸*/
  }

  .inputView::-webkit-scrollbar-thumb {
    /*滚动条里面小方块*/
    border-radius: 6px;
    background-color: skyblue;
    background-image: url('../../../static/images/scrollbar1.png');
    background-repeat: no-repeat;
    background-size: cover;
    background-position: center;
  }

  .inputView::-webkit-scrollbar-track {
    /*滚动条里面轨道*/
    background: #f1f6fe;
    border-radius: 6px;
  }

  .inputView {
    height: 638px;
    overflow-x: hidden;
    overflow-y: auto;
    border-radius: 8px 8px 0px 0px;
    font-size: 28px;
    font-weight: 400;
    color: #333333;
  }

  /deep/ .uni-easyinput__content-textarea {
    min-height: 608px;
    padding-top: 15px;
    font-size: 28px;
    font-size: 28px;
    font-weight: 400;
    color: #333333;
  }

  .btnView {
    display: flex;
    height: 116px;
    align-items: center;
    justify-content: center;
    background: #f4f7fc;
    border-radius: 0px 0px 8px 8px;

    > view {
      width: 224px;
      height: 42px;
      border-radius: 4px;
      font-size: 18px;
      text-align: center;
      line-height: 42px;
      cursor: pointer;
    }

    > view:first-child {
      background-color: #ffffff;
      color: #666666;
      font-weight: 400;
      margin-right: 32px;
    }

    > view:last-child {
      background-color: #1f8cff;
      font-weight: bold;
      color: #ffffff;
    }
  }
}
</style>
