<template>
  <view id="evaluation" v-show="isShow">
    <view>
      <view class="header">
        <view>
          <view>面试评价</view>
        </view>
        <image src="../../static/images/close.png" @click="closeView"></image>
      </view>
      <view>
        <view class="navTop">
          <image :src="$utils.getSexHeadOrDefault(data.aae707, data.aac004)"></image>
          <view>
            <view>{{ data.aac003 }}</view>
            <view>
              <!-- <view>身份证号码:{{ data.aac002 }}</view> -->
              <view>年龄:{{ data.age }}</view>
              <view>{{ $codeConfig.getCodeLabel('aac004', data.aac004) }}</view>
              <view>{{ data.aac011Desc ? data.aac011Desc : '未知学历' }}</view>
              <view>{{ data.aac183 ? data.aac183 : '未知专业' }}</view>
              <view>{{ data.acc217 ? $codeConfig.getCodeLabel('ACC217', data.acc217) : '未知工作经验' }}</view>
              <view>{{ data.acc04t ? $codeConfig.getCodeLabel('acc04t', data.acc04t) : '未知状态' }}</view>
            </view>
            <view>
              <view
                >电子邮箱：<span>{{ data.aae159 ? data.aae159 : '暂无' }}</span></view
              >
              <view
                >联系电话：<span>{{ data.aae005 ? data.aae005 : '暂无' }}</span></view
              >
            </view>
          </view>
        </view>
        <view class="content">
          <view>
            <view
              >您对本次面试人员<span>{{ data.aac003 }}</span
              >满意度如何呢？</view
            >
            <view>
              <view v-for="(item, index) in imgs" :key="index" @click="chooseImg(item)">
                <image :src="item.url"></image>
                <view>{{ item.text }}</view>
              </view>
            </view>
          </view>
        </view>
        <view class="inputView">
          <uni-easyinput
            type="textarea"
            autoHeight
            v-model="editInfo"
            placeholder="请输入您要发表面试评价的相关内容..."
            placeholderStyle="fontSize:18px;font-weight: 400;"
            maxlength="300"
          ></uni-easyinput>
        </view>
      </view>
      <view class="btnBottom">
        <view @click="resumeBtn">提交评价</view>
        <view @click="clearInfo">取消</view>
      </view>
    </view>
  </view>
</template>

<script>
import epselect from '../ep-select/ep-select.vue'

export default {
  name: 'commonFeedback',
  components: {
    epselect,
  },
  props: {
    isShow: {
      type: Boolean,
      default: false,
    },
    data: {
      type: Object,
      default: () => {},
    },
  },
  watch: {
    isShow(newVal) {
      if (newVal) {
      }
    },
  },
  data() {
    return {
      userInfo: this.$loginConfig.getLoginInfo(),
      param: {},
      editInfo: '',
      imageActive1: false,
      imageActive2: false,
      satisfaction: {},
      imgs: [
        {
          url: '../../static/images/img/interview/icon_非常不满意@2x.png',
          default: '../../static/images/img/interview/icon_非常不满意@2x.png',
          choose: '../../static/images/img/interview/icon_非常不满意（hover）@2x.png',
          text: '非常不满意',
          value: '1',
        },
        {
          url: '../../static/images/img/interview/icon_不满意@2x.png',
          default: '../../static/images/img/interview/icon_不满意@2x.png',
          choose: '../../static/images/img/interview/icon_不满意（hover）@2x.png',
          text: '不满意',
          value: '2',
        },
        {
          url: '../../static/images/img/interview/icon_一般@2x.png',
          default: '../../static/images/img/interview/icon_一般@2x.png',
          choose: '../../static/images/img/interview/icon_一般（hover）@2x.png',
          text: '一般',
          value: '3',
        },
        {
          url: '../../static/images/img/interview/icon_满意@2x.png',
          default: '../../static/images/img/interview/icon_满意@2x.png',
          choose: '../../static/images/img/interview/icon_满意（hover）@2x.png',
          text: '满意',
          value: '4',
        },
        {
          url: '../../static/images/img/interview/icon_非常满意@2x.png',
          default: '../../static/images/img/interview/icon_非常满意@2x.png',
          choose: '../../static/images/img/interview/icon_非常满意（hover）@2x.png',
          text: '非常满意',
          value: '5',
        },
      ],
    }
  },
  methods: {
    chooseImg(item) {
      this.satisfaction = item
      this.imgs.forEach((img, index) => {
        if (item.value == img.value) {
          this.imgs[index].url = img.url == img.default ? img.choose : img.default
        } else {
          this.imgs[index].url = img.default
        }
      })
    },
    closeView() {
      this.$emit('close')
    },
    // 提交反馈
    resumeBtn() {
      if (!this.satisfaction || !this.satisfaction.value) {
        this.$message.error('请对本次面试人员满意度进行评价!')
        return
      }
      this.param.acc312 = this.satisfaction
      this.param.aac001 = this.data.aac001
      this.param.acb210 = this.data.acb210
      this.param.acg015 = '1'
      this.param.acg016 = this.userInfo.user_id
      this.param.acg012 = this.editInfo
      this.param.acc310 = this.data.acc310
      this.param.yae100 = '19'
      this.param.acg01a = this.satisfaction.value
      this.param.acg01e = this.satisfaction.value
      this.param.acg01f = this.satisfaction.value
      this.param.acg01g = this.satisfaction.value
      this.param.acg01h = this.satisfaction.value
      this.param.acg011 = '1'
      this.param.acg014 = '0'
      this.param.ycb202 = '0'
      this.param.method = 'jy202_hrm212'
      this.$http
        .post(this.$requestConstant.businessRequestType, 'jy202_hrm212', null, this.param, true)
        .then((data) => {
          this.$message.success('提交评价成功!')
          this.clearInfo()
        })
    },
    clearInfo() {
      this.editInfo = ''
      this.closeView()
    },
  },
}
</script>

<style lang="scss" scoped>
#evaluation {
  width: 100%;
  height: 100%;
  position: fixed;
  top: 0;
  left: 0;
  background-color: rgba(0, 0, 0, 0.7);

  > view {
    width: 1200px;
    height: 750px;
    background: #ffffff;
    border-radius: 8px;
    position: absolute;
    left: 45%;
    top: 50%;
    transform: translateX(-50%) translateY(-50%);
    -webkit-transform: translateX(-50%) translateY(-50%);

    > view:last-child {
      padding: 32px 24px 0px 24px;
    }
  }
}

.header {
  height: 68px;
  background: #0682fe;
  border-radius: 8px 8px 0px 0px;
  padding: 0px 24px 0px 24px;
  display: flex;
  align-items: center;
  justify-content: space-between;

  > image {
    width: 24px;
    height: 24px;
    cursor: pointer;
  }

  > view {
    display: flex;
    align-items: center;
    font-size: 24px;
    font-weight: 500;
    color: #ffffff;

    > image {
      width: 24px;
      height: 24px;
      margin-right: 12px;
    }
  }
}

.navTop {
  display: flex;
  align-items: center;

  > image {
    width: 88px;
    height: 88px;
  }

  > view {
    margin-left: 25px;

    > view:first-child {
      font-size: 20px;
      font-weight: bold;
      color: #333333;
    }

    > view:nth-child(2),
    > view:last-child {
      display: flex;
      align-items: center;
      font-size: 14px;
      font-weight: 400;
      color: #666666;
      margin-top: 10px;

      > view {
        border-right: 1px solid #666666;
        padding: 0px 12px 0px 12px;
      }

      > view:first-child {
        padding-left: 0px;
      }

      > view:last-child {
        padding-right: 0px;
        border-right: none;
      }
    }
  }
}

.content {
  width: 1215;
  height: 200px;
  margin: 20px auto 0px auto;

  > view:first-child {
    height: 200px;
    background: #fafafa;
    border-radius: 2px;
    font-size: 20px;
    font-weight: 400;
    color: #999999;

    > view:first-child {
      padding: 16px 0px 25px 24px;

      > span {
        font-weight: bolder;
        color: #0682fe;
      }
    }

    > view:last-child {
      display: flex;
      align-items: center;
      justify-content: space-around;

      > view {
        cursor: pointer;

        > image {
          width: 88px;
          height: 86px;
          // border: 10px solid #FAFAFA;
        }

        > view {
          height: 20px;
          font-family: PingFangSC, PingFang SC;
          font-weight: 400;
          font-size: 14px;
          color: #666666;
          line-height: 40px;
          text-align: center;
          font-style: normal;
        }
      }
    }
  }

  > view:last-child {
    height: 200px;
    background: #ffffff;
    border: 1px solid #eeeeee;
    border-radius: 2px;
    margin-top: 12px;
  }
}

.inputView {
  height: 200px;
  border-radius: 8px 8px 0px 0px;
  font-size: 28px;
  font-weight: 400;
  color: #333333;
}

/deep/ .uni-easyinput__content-textarea {
  min-height: 200px;
  font-size: 18px;
  color: #333333;
}

.btnBottom {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 40px;

  > view {
    width: 160px;
    height: 42px;
    text-align: center;
    line-height: 42px;
    font-size: 16px;
    font-weight: 400;
    cursor: pointer;
  }

  > view:first-child {
    color: #ffffff;
    background-color: #007dee;
    margin-right: 24px;
  }

  > view:last-child {
    color: #333333;
    background-color: #eff3f6;
  }
}
</style>
