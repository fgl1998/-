<template>
  <div class="page">
    <common-header></common-header>

    <div class="page-wrap">
      <div class="wrap-center">
        <div class="wrap-lt">
          <div class="nav-ul">
            <div :class="['nav-list', actived == '1' ? 'actived' : '']">
              <span><image src="../../../static/images/project/vector-1.png" mode="aspectFit"></image></span> 基本信息
            </div>
            <div :class="['nav-list', actived == '2' ? 'actived' : '']">
              <span><image src="../../../static/images/project/vector-4.png" mode="aspectFit"></image></span> 就业状态
            </div>
            <div :class="['nav-list', actived == '3' ? 'actived' : '']">
              <span><image src="../../../static/images/project/vector-5.png" mode="aspectFit"></image></span> 就业意愿
            </div>
            <div :class="['nav-list', actived == '4' ? 'actived' : '']">
              <span><image src="../../../static/images/project/vector-3.png" mode="aspectFit"></image></span> 培训意愿
            </div>
            <div :class="['nav-list', actived == '5' ? 'actived' : '']">
              <span><image src="../../../static/images/project/vector-4.png" mode="aspectFit"></image></span> 创业意愿
            </div>
          </div>
        </div>
        <div class="wrap-rt">
          <div class="wrap-center-part">
            <base-info
              ref="baseInfo"
              :userInfo="userInfo"
              :labourInfo="labourInfo"
              v-show="actived == '1'"
              @triggerBtn="triggerBtn"
            ></base-info>
            <employment-status
              ref="employmentStatus"
              :userInfo="userInfo"
              :labourStatus="labourStatus"
              v-show="actived == '2'"
              @triggerBtn="triggerBtn"
            ></employment-status>
            <employment-intention
              ref="employmentIntention"
              :userInfo="userInfo"
              :labourEmpoyInter="labourEmpoyInter"
              v-show="actived == '3'"
              @triggerBtn="triggerBtn"
            ></employment-intention>
            <training-intention
              ref="trainingIntention"
              :userInfo="userInfo"
              :labourTrain="labourTrain"
              :trainTypeTree="trainTypeTree"
              v-show="actived == '4'"
              @triggerBtn="triggerBtn"
            ></training-intention>
            <entrepreneurial-willingness
              ref="entrepreneurialWillingness"
              :userInfo="userInfo"
              :labourEntrepreneurial="labourEntrepreneurial"
              v-show="actived == '5'"
              @triggerBtn="triggerBtn"
            ></entrepreneurial-willingness>
          </div>
          <div class="wrap-bottom-part">
            <view class="footer">
              <button @click="prevBtn" style="background: #fff; border: 1px solid #a2a7a9" v-if="actived != '1'">
                上一步
              </button>
              <button type="primary" @click="nextBtn" v-if="actived != '5'">下一步</button>
              <button type="primary" @click="nextBtn" v-else :disabled="saveBtn">保存</button>
            </view>
          </div>
        </div>
      </div>
    </div>

    <common-footer :userName="userInfo.aac003" :isLogin="isLogin"></common-footer>
  </div>
</template>

<script>
import baseInfo from './part/baseInfo.vue'
import employmentStatus from './part/employmentStatus.vue'
import employmentIntention from './part/employmentIntention.vue'
import trainingIntention from './part/trainingIntention.vue'
import entrepreneurialWillingness from './part/entrepreneurialWillingness.vue'

export default {
  name: 'labourIndex',
  components: {
    baseInfo,
    employmentStatus,
    employmentIntention,
    trainingIntention,
    entrepreneurialWillingness,
  },
  onLoad: function (option) {
    this.userInfo = uni.getStorageSync('userInfo')
    if (this.userInfo) {
      this.isLogin = true
    } else {
      this.isLogin = false
    }
  },

  data() {
    return {
      userInfo: {},
      isLogin: false,
      actived: '1',
      labourInfo: {}, //基本信息
      labourStatus: {}, //就业状态
      labourEmpoyInter: {}, //就业意愿
      labourTrain: {}, //培训意愿
      labourEntrepreneurial: {}, //创业意愿
      trainTypeTree: [],
      saveBtn: false,
    }
  },

  methods: {
    prevBtn() {
      if (this.actived != 1) {
        this.actived = this.actived - 1
        this.$nextTick(() => {
          if (this.actived == '1') {
            this.$refs.baseInfo.prev(this.labourInfo)
          } else if (this.actived == '2') {
            this.$refs.employmentStatus.prev(this.labourStatus)
          } else if (this.actived == '3') {
            this.$refs.employmentIntention.prev(this.labourEmpoyInter)
          } else if (this.actived == '4') {
            this.$refs.trainingIntention.prev(this.labourTrain)
          }
          //this.$refs.baseInfo.prev(this.labourInfo)
        })
      }
    },
    nextBtn() {
      if (this.actived == '1') {
        this.$refs.baseInfo.next()
      } else if (this.actived == '2') {
        this.$refs.employmentStatus.next()
      } else if (this.actived == '3') {
        this.$refs.employmentIntention.next()
      } else if (this.actived == '4') {
        this.$refs.trainingIntention.next()
      } else {
        this.$refs.entrepreneurialWillingness.endBtn()
      }
    },

    triggerBtn(num, formVal) {
      this.actived = num == '6' ? '5' : num

      if (num == '2') {
        this.labourInfo = formVal
      } else if (num == '3') {
        this.labourStatus = formVal
      } else if (num == '4') {
        this.labourEmpoyInter = formVal
      } else if (num == '5') {
        this.labourTrain = formVal
      } else {
        this.labourEntrepreneurial = formVal
        this.save()
      }
    },

    save() {
      //保存
      this.saveBtn = true
      let param = {
        method: 'jy388_aq07_interface',
        type: 'web',
        aac058: '01',
        ...this.labourInfo,
        ...this.labourStatus,
        ...this.labourEmpoyInter,
        ...this.labourTrain,
        ...this.labourEntrepreneurial,
      }
      this.$utils.request(null, param, true).then((res) => {
        if (!res.serviceSuccess) {
          this.saveBtn = false
          this.$utils.showToast('调用服务异常')
          return
        } else {
          this.$utils.showToast('保存成功')
          setTimeout(() => {
            this.actived = '1'
            this.resetArr()
          }, 1500)
        }
      })
    },

    resetArr() {
      // this.labourInfo = []
      // this.labourStatus = []
      // this.labourEmpoyInter = []
      // this.labourTrain = []
      // this.labourEntrepreneurial = []
      this.$utils.redirectTo('/pages/laborInformationCollection/labourIndex/labourIndex')
    },
  },
}
</script>

<style lang="scss" scoped>
.wrap-center {
  display: flex;
  justify-content: space-between;
  overflow: none;
}
.wrap-lt {
  width: 340px;
  height: 760px;
  background: url('../../../static/images/project/left-bg.png') center no-repeat;
  box-sizing: border-box;
  overflow: hidden;
  .nav-ul {
    width: 240px;
    margin: 70px auto;
    overflow: hidden;
    .nav-list {
      width: 240px;
      height: 64px;
      background: rgba(3, 32, 182, 0.25);
      border-radius: 32px 32px 32px 32px;
      font-family: PingFang SC, PingFang SC;
      font-weight: 500;
      font-size: 24px;
      color: #ffffff;
      line-height: 64px;
      text-align: center;
      font-style: normal;
      text-transform: none;
      margin-bottom: 32px;
      // /cursor: pointer;
      &.actived {
        background: #efa10f;
        box-shadow: 0px 8px 12px 0px rgba(3, 102, 202, 0.4);
      }
      span {
        width: 30px;
        height: 30px;
        display: inline-block;
        vertical-align: middle;
        margin-right: 5px;
        line-height: 30px;
        image {
          width: 100%;
          height: 100%;
        }
      }
    }
  }
}

.wrap-rt {
  width: 1420px;
  height: 760px;
  //overflow: hidden;
  box-sizing: border-box;
  padding: 0 40px;
  .wrap-center-part {
    width: 100%;
    //overflow: hidden;
    height: calc(100% - 90px);
  }

  .wrap-bottom-part {
    width: 100%;
    height: 55px;
    display: flex;
    justify-content: center;
    .footer {
      width: 300px;
      height: 55px;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    button {
      width: 134px;
      height: 48px;
      line-height: 48px;

      border-radius: 4px 4px 4px 4px;
    }
  }
}
</style>
