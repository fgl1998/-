<template>
  <view class="result h5-page">
    <div class="progress-wrapper">
      <ComponentDeclareStep :current="5"></ComponentDeclareStep>
    </div>

    <div class="swiper" v-if="renderData && renderData.length > 0">
      <block v-for="(item, index) in renderData" :key="index">
        <div class="swiper-item">
          <div class="swiper-item-name">
            {{ item.chi031_desc }}
          </div>
          <div class="declare-result" :class="item.chb01b === '1' ? '' : 'fail'">
            <ComponentImg
              :path="item.chb01b === '1' ? images.success : images.fail"
              :width="item.chb01b === '1' ? '126rpx' : '152rpx'"
              height="116rpx"></ComponentImg>
            <p>{{ item.chb01b === '1' ? '申报成功' : '申报失败' }}</p>
          </div>
        </div>
      </block>
    </div>

    <div class="check-info-wrapper" v-if="checkList && checkList.length > 0">
      <div class="item-wrapper" v-for="item in checkList" :key="item.id">
        <ComponentPanel :title="item.name">
          <div class="panel-content">
            <block v-for="item2 in item.list" :key="item2.chb000">
              <div class="item d-f ai-c jc-sb" :class="[item2.isSuccess ? 'success' : 'fail']">
                <div class="left d-f ai-c">
                  <div class="iconimg"></div>
                  <div>{{ item2.chr023 }}</div>
                </div>
                <div class="right d-f ai-c">
                  <div class="tag" :class="[item2.chr032 === '1' ? '' : 'fail']">
                    {{ item2.chr032 === '1' ? '核验成功' : '核验失败' }}
                  </div>
                </div>
              </div>
              <div class="item-fail-tip d-f ai-c" v-if="!item2.isSuccess">
                <div class="iconimg"></div>
                <span>{{ item2.chr037 }}</span>
              </div>
            </block>
          </div>
        </ComponentPanel>
      </div>
    </div>

    <div class="button-wrapper d-f ai-c jc-sb" v-if="declareType == '02'">
      <ComponentButton width="320rpx" name="继续申报" type="secondary" @click="handleApply"></ComponentButton>
      <ComponentButton width="320rpx" name="完成" type="primary" @click="handleComplete"></ComponentButton>
    </div>
    <div class="button-wrapper" v-else>
      <ComponentButton name="完成" type="primary" @click="handleComplete"></ComponentButton>
    </div>

    <div class="nav-wrapper">
      <ComponentPanel title="快捷导航">
        <div class="panel-content">
          <div class="item d-f ai-c" @click="handleJumpRoute">
            <div class="img-wrapper">
              <ComponentImg :path="images.nav01" width="140rpx" height="146rpx"></ComponentImg>
            </div>
            <p>业务申报进度查询情况</p>
          </div>
        </div>
      </ComponentPanel>
    </div>
  </view>
</template>

<script>
  import imageSuccess from './images/success.png'
  import imageFail from './images/fail.png'
  import imageNav01 from './images/nav-01.png'
  import imageNav02 from './images/nav-02.png'

  import ComponentPanel from '@/components/common/ez-panel/ez-panel.vue'
  import ComponentButton from '@/components/common/ez-button/ez-button.vue'
  import ComponentImg from '@/components/common/ez-img/ez-img.vue'
  import ComponentDeclareStep from '@/components/project/ez-declare-step/ez-declare-step.vue'
  import config from '@/config'
  import { switchTab, navigateTo, hideLoading, showLoading, reLaunch } from '@/utils/uni-api'
  import { requestB013 } from '@/service/api'
  import { getDeclareConfig } from '@/utils/get'

  import { DECLARE_INFO, OTHERS_DECLARE_INFO, USER_LIST } from '@/store/constants' // 常量
  import { mapGetters } from 'vuex'

  export default {
    name: 'declareResult',
    components: {
      ComponentPanel,
      ComponentButton,
      ComponentImg,
      ComponentDeclareStep
    },
    data() {
      return {
        images: {
          success: {
            src: '', // 本地图片
            httpSrc: imageSuccess // 网络图片
          },
          fail: {
            src: '', // 本地图片
            httpSrc: imageFail // 网络图片
          },
          nav01: {
            src: '', // 本地图片
            httpSrc: imageNav01 // 网络图片
          },
          nav02: {
            src: '', // 本地图片
            httpSrc: imageNav02 // 网络图片
          }
        },
        renderData: [], // swiper 渲染数据
        // 校验列表
        checkList: [],
        currentIndex: 0,
        isSuccess: false, // 是否申报成功
        declareType: '01' // 申报模式
      }
    },
    // 监听页面加载，其参数为上个页面传递的数据，参数类型为Object（用于页面传参）
    onLoad(e) {
      showLoading()
      const { info } = e
      let data = JSON.parse(info)
      // data = [
      //   {
      //     chb000: '410135',
      //     chb01b: '1',
      //     chr037: '校验成功',
      //     cpb100: '10021631',
      //   },
      //   {
      //     chb000: '410135',
      //     chb01b: '2',
      //     chr037: '校验成功',
      //     cpb100: '10021631',
      //   },
      // ]
      let arr = []
      if (data instanceof Array) {
        const declareInfo = this.declareInfo
        const othersDeclareInfo = this.othersDeclareInfo
        data.forEach((item, index) => {
          // chb000: '410135' 申报业务主键
          // chb01b: '1' 0 未校验 1 校验成功 2 校验失败
          // chr037: '校验成功'
          // cpb100: '10021631' 申报流程主键
          const obj = {
            id: item.chb000,
            chb000: item.chb000,
            chb01b: item.chb01b,
            chr037: item.chr037,
            cpb100: item.cpb100
          }
          if (index === 0) {
            obj.chi031 = declareInfo.chi031
            obj.chi031_desc = declareInfo.chi031_desc
          }
          if (index === 1) {
            obj.chi031 = othersDeclareInfo.chi031
            obj.chi031_desc = othersDeclareInfo.chi031_desc
          }
          arr.push(obj)
        })
      }
      this.renderData = [...arr]
      this.getCheckList()
    },
    // 监听页面初次渲染完成
    onReady() {},
    // 监听页面显示
    onShow() {
      const { chb00z } = this.declareInfo
      if (chb00z) {
        this.declareType = '02'
      }
    },
    // 监听页面隐藏
    onHide() {},
    methods: {
      // 请求 用于查询补贴项目补贴享受人员的校验结果
      _requestB013(chb000) {
        return new Promise((resolve, reject) => {
          requestB013(chb000, 1, 999, false)
            .then((res) => {
              const { list } = res.lists.hr03List
              if (list && list.length > 0) {
                const newList = []
                list.map((item) => {
                  item.isSuccess = false
                  // 1 校验通过，2 校验不通过
                  if (item.chr032 === '1') {
                    item.isSuccess = true
                  }
                  newList.push(item)
                  resolve(newList)
                })
              } else {
                reject(res)
                hideLoading()
              }
            })
            .catch((err) => {
              reject(err)
              hideLoading()
            })
        })
      },
      // 获取校验列表数据
      getCheckList() {
        this.checkList = []
        const declareInfo = this.declareInfo
        const othersDeclareInfo = this.othersDeclareInfo
        const renderData = [...this.renderData]
        const len = renderData.length

        if (len === 1) {
          const { chb000 } = renderData[0]
          this._requestB013(chb000).then((res) => {
            this.checkList = [{ id: chb000, name: '校验结果', list: res }]
            hideLoading()
          })
        }

        if (len === 2) {
          const { chb000: key1 } = renderData[0]
          const { chb000: key2 } = renderData[1]
          Promise.all([this._requestB013(key1), this._requestB013(key2)]).then((res) => {
            this.checkList = [
              { id: key1, name: declareInfo.chi031_desc, list: res[0] },
              { id: key1, name: othersDeclareInfo.chi031_desc, list: res[1] }
            ]
            hideLoading()
          })
        }
      },
      // swiper change
      handleSwiperChange(e) {
        const value = e.target.current
        this.currentIndex = value
        this.requestCheck(value)
      },
      // 点击完成 回调函数
      handleComplete() {
        switchTab('home')
      },
      // 跳转路由
      handleJumpRoute() {
        const { chb009 } = this.declareInfo
        navigateTo('my-declare', 'packageDetails', {
          type: chb009 === '02' ? 'agent' : ''
        })
      },
      // 继续申报
      handleApply() {
        const { declarePackageName } = config
        const { chi031, chi031_desc } = this.declareInfo
        const declareConfig = getDeclareConfig(chi031)
        const { isFixedDeclareType, fixedDeclareType } = declareConfig
        const name = 'declare-' + chi031

        // 固定申报模式
        if (isFixedDeclareType) {
          reLaunch(name, declarePackageName, {
            chi031,
            declareType: '02',
            fixedDeclareType,
            chi031_desc
          })
        } else {
          reLaunch(name, declarePackageName, {
            chi031,
            declareType: '02',
            chi031_desc
          })
        }
      }
    },
    computed: {
      ...mapGetters([DECLARE_INFO, OTHERS_DECLARE_INFO, USER_LIST])
    },
    watch: {}
  }
</script>

<style lang="scss" scoped>
  .result {
    padding: $spacing;
    .swiper {
      width: 100%;
      margin-top: $spacing;
    }
    .swiper-item {
      height: 292rpx;
      background-color: #ffffff;
      border-radius: 16rpx;
      padding-top: 34rpx;
      margin-bottom: 30rpx;
      .swiper-item-name {
        font-size: 32rpx;
        line-height: 44rpx;
        font-weight: 700;
        padding: 0 20rpx;
        color: #333;
        text-align: center;
        @include textOverflow();
      }
      .declare-result {
        padding-top: 20rpx;
        &.fail {
          p {
            color: #f00;
          }
        }
        p {
          width: 100%;
          font-size: 26rpx;
          line-height: 36rpx;
          color: $primary;
          font-weight: 700;
          text-align: center;
          padding-top: 12rpx;
        }
      }
    }

    .check-info-wrapper {
      .item-wrapper {
        margin-bottom: 0;
      }
      .panel-content {
        padding-top: $spacing;
        padding-right: 16rpx;
        padding-left: $spacing;
      }
      .item {
        font-size: 30rpx;
        font-weight: 500;
        line-height: 44rpx;
        color: #3d424d;
        &.success {
          margin-bottom: 36rpx;
        }
        &.fail {
          .iconimg {
            transform: rotate(90deg);
          }
        }
      }
      .iconimg {
        width: 44rpx;
        height: 44rpx;
        transition: all 0.3s;
        background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAFgAAABYCAMAAABGS8AGAAAAyVBMVEUAAAA5gv9Ci/85g/84gv84g/84g//O4//h8P/O4v/O4//O4/84g//O4/85hP87hP87hf/////P5P/Q5f/O4//O4//O4//O4/84gv85gv/O4/84g//P4//P4/85hP/P5P/O5f/O4/87hP/R5//S6f/W6P/W7//N4v/O5P/O4/85g/85gv87hf9Gi//N4v84gv9Ulf5Eiv7K4f4/h/661v5cmv620v6kyP6XwP5/sP7H3/7A2f52qf5zqP7J3/6gxP6cwv56rf5upf6oaOj+AAAALnRSTlMAhxH8+OLb0Qf48eLRmHY+NgNBN+nKw7i1r62pjHFuXFFIMCMcFQ/dgntmXkkLocSkggAAAahJREFUWMPtmMlSAjEURWPT0CAziIIIiDgPr5nn0f//KNMPKDUxLrybWJVTxYbFKeo0neRFOBwOh8NS8hk/8yK+UgpSQQv2vvqhpO59ftNOkeTyHhRnQiZREEcCYh7KmDgmpfIT+k1xgA6kGpBYOk/y8VBS876JOQcoFl41MscLipjSZVAsRC7KEcspYqIGKhYFzlH1FDFd3IFi4dU4R14RyxyImGn6nINUnoqgWNwkQsloQaTmAMXCq0fm3oQUzkqImHnmN3zWJ4XHIiY25zi/BcXi7d2Qow2KBU0HP+e4KoJiGnc5x1DPAYppvuIcG1I4vQbFdMix03MkMfExR1fLUemAYlovI/Ngq+dAxMyWcyzXpJBNgmIa7nOMSSHogGLq7zjHVMvRQsTMphepV3M9Byim4YhzaOZKEhRTf8a/mVSykJiZyBw9UklbK96nWBpSwA9voT88K/9u5hfEzlfavAhZuWyaF3ortybzZmrn9m8+sFh5xDIfCq08xpoP3naOCn8YbqBxrGTnAGkcee0c0s3XCjZehPxydWPpZZPxeszhcDgc/5IPSiYfrzUN0WAAAAAASUVORK5CYII=);
      }
      .tag {
        font-size: 28rpx;
        font-weight: 500;
        line-height: 44rpx;
        color: #51d574;
        background-color: rgba(#4fd57b, 0.1);
        border-radius: 4rpx;
        width: 150rpx;
        text-align: center;
        &.fail {
          color: #ff6853;
          background-color: #ffe1dd;
        }
      }
      .item-fail-tip {
        font-size: 26rpx;
        color: #f00;
        line-height: 1.4;
        margin-bottom: 36rpx;
        padding-top: 12rpx;
        padding-left: 44rpx;
        font-weight: 500;
        .iconimg {
          width: 32rpx;
          height: 32rpx;
        }
        span {
          flex: 1;
          overflow: hidden;
        }
      }
    }
    .button-wrapper {
      padding: $spacing 0;
    }
    .nav-wrapper {
      .panel-content {
        padding: 16rpx 0;
      }
      .item {
        width: 100%;
        height: 180rpx;
        background-color: #eff5ff;
        border-radius: 8rpx;
        font-size: 28rpx;
        color: #082a6b;
        &.item-02 {
          margin-top: $spacing;
          .img-wrapper {
            padding: 0 36rpx 0 28rpx;
          }
        }
        .img-wrapper {
          padding: 0 66rpx 0 58rpx;
        }
      }
    }
  }
</style>
