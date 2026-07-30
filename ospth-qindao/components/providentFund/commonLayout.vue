<template>
  <handle-complete v-if="handleComplete"/>
  <view class="layout-container" v-else>
    <van-nav-bar left-arrow left-text="返回" @click-left="previous" class="nav-bar fixed-header">
      <template #right>
        <van-icon name="phone-o" size="24"/>
      </template>
    </van-nav-bar>
    <view class="content-panel">
      <keep-alive>
        <component v-show="currentStepComponent.component"
            :is="currentStepComponent.component"
            v-bind="currentStepComponent.props || {}"
            ref="stepComponent"
            @go-previous="childrenPrevious"
            @go-next="childrenNext"
        />
      </keep-alive>

      <!-- 上传材料 -->
      <upload v-if="sceneCode" :materialList="materialVosCopy" :taskBasicGuid="taskBasicGuid" :projectNo="projectNo"
              :handleItemCode="handleItemCode"
              @handleBack="handleBack" :pageEcho='pageEcho' :shareParam="shareParam" :materialData="materialData"/>
    </view>

    <user-auth v-if="needAuth" :auth-type="currentStepComponent.authType" @cancel="needAuth=false"
               @authSuccess="authSuccess"/>

	  <operation-manual :showManual="showManual" @closePop="closePop" @showPop="showPop"></operation-manual>

    <view class="button-group">
      <van-button type="default" size="large" class="manual-btn custom-btn" @click="showPop()">
        <view style="display: flex;flex-direction: column;">
          <van-icon name="question-o" size="14"/>
          <text style="font-size: 22rpx;margin-top: 12rpx">操作手册</text>
        </view>
      </van-button>
      <van-button type="default" size="large" class="manual-btn save-btn custom-btn" @click="saveInfo">保存</van-button>
      <van-button type="default" size="large" @click="next" class="next-btn custom-btn">
        {{ stepMap.length - 1 === step ? '提交' : currentStepComponent.nextText || '下一步' }}
      </van-button>
    </view>
  </view>
</template>

<script>
// import 'common/psmp/js/terminalUtil.js'
import ENUMS from '@osppm/common/enum.js'
import upload from '@/components/upload-last/upload-last.vue'
import commonLayoutMixin from '@osppm/mixin/commonLayoutMixin'
import UserAuth from '@/components/providentFund/userAuth.vue'
import handleComplete from '@/components/providentFund/handleComplete.vue'
import operationManual from '@/components/operation-manual/operation-manual.vue'

export default {
  name: 'commonLayout',
  mixins: [commonLayoutMixin],
  props: ['stepMap'],
  components: {
    UserAuth,
    upload,
    handleComplete,
	  operationManual,
  },
  data() {
    return {
      step: 0,
      showManual: false,
    }
  },
  created() {
    // window.terminalUtil._setShowButtonCol(false)
  },
  mounted() {
    this.init(this.$route.query)
  },
  methods: {
    saveInfo() {
    },
    /**
     * 上一步按钮点击事件
     * 1. 检查当前组件是否提供了 beforePrevious 钩子函数
     * 2. 如果提供了，则执行该函数并检查返回值
     * 3. 如果返回值为 false，则不执行跳转操作
     * 4. 否则，将当前步骤更新为当前步骤的上一步
     */
    async previous() {
      const comp = this.$refs.stepComponent
      if (comp && comp.beforePrevious) {
        const pass = await comp.beforePrevious()
        if (pass === false) return
      }
      const previous = this.currentStepComponent.previous
      if (previous === ENUMS.STEP.GO_PATH) {
        const path = this.currentStepComponent.previousPath
        if (!path) {
          terminalUtil._alertMsgWindow('提示', '无法返回上一步：未定义跳转路径', 'error')
          return
        }
        // terminalUtil._setShowButtonCol(true)
        this.$router.push(path)
        return
      }
      if (previous === ENUMS.STEP.GO_BACK) {
        window.parent.postMessage(
            {
              type: 'previousStep',
            }, '*')
        return
      }

      this.step = previous
    },
    /**
     * popup弹窗
     */
    showPop() {
      this.showManual = true
    },
    closePop() {
      this.showManual = false
    },
    /**
     * 下一步按钮点击事件
     * 1. 检查当前组件是否提供了 beforeNext 钩子函数
     * 2. 如果提供了，则执行该函数并检查返回值
     * 3. 如果返回值为 false，则不执行跳转操作
     * 4. 否则，将当前步骤更新为当前步骤的下一步
     */
    async next() {
      console.info(`当前步骤（${this.currentStepComponent.title}），开始进行点击【下一步】需要触发的操作`)
      const comp = this.$refs.stepComponent
      console.info(`判断当前步骤是否需要进行表单校验：` + !!(comp && comp.formValidate))

      // 1. 表单校验
      if (comp && comp.formValidate) {
        const pass = await comp.formValidate()
        console.info('表单校验结果：' + pass)
        if (pass === false) return
      }

      // 2. 材料校验
      console.info(`判断当前步骤是否需要进行材料校验：` + (this?.materialVosCopy?.length > 0))
      if (this?.materialVosCopy?.length > 0) {
        // 校验材料是否上传完成
        // if (!this.fnValMaterials()) {
        //   console.info('校验材料结果：false')
        //   return
        // }
      }

      // 3. 认证判断（核心：有认证就等待，无认证直接下一步）
      console.info(`判断当前步骤是否需要进行认证：` + !!(this.currentStepComponent.authType))
      if (this?.currentStepComponent?.authType) {
        console.info('当前步骤认证方式：' + this.currentStepComponent.authType)
        this.needAuth = true
        return // 中断，等待认证完成
      }

      // ==========================================
      // 无认证 → 直接执行抽离的下一步方法
      // ==========================================
      await this.executeNextStep()
    },
    /**
     * 子组件触发下一步事件
     * 直接跳转到当前步骤的下一步
     */
    childrenNext() {
      this.step = this.currentStepComponent.next
    },
    /**
     * 子组件触发上一步事件
     * 直接跳转到当前步骤的上一步
     */
    childrenPrevious() {
      this.step = this.currentStepComponent.previous
    },

    // ======================================================
    // 【抽取出来的方法】：beforeNext 校验 + 步骤跳转
    // ======================================================
    async executeNextStep() {
      const comp = this.$refs.stepComponent

      // 检查当前组件是否提供了 beforeNext 钩子函数
      if (comp && comp.beforeNext) {
        const pass = await comp.beforeNext()
        if (pass === false) return
      }

      const next = this.currentStepComponent.next
      if (next === ENUMS.STEP.FINISH) {
        this.handleComplete = true
        console.info('操作完成')
        return
      }
      if (next === this.stepMap.length) {
        alert(`步骤数超 stepMap 上限，请确认 stepMap 的步骤配置是否正确。下一步步骤数:【${next}】,stepMap 长度：【${this.stepMap.length}】`)
        return
      }
      this.step = next
    },
    authSuccess() {
      this.needAuth = false
      this.executeNextStep()
    },
  },
}
</script>

<style scoped lang="less">
.layout-container {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background-color: #f3f4f6;
  box-sizing: border-box;
  position: relative;
  /* 给底部按钮留空间，不被遮挡 */
  padding: 0 24rpx 180rpx;
}

.content-panel {
  flex: 1;
  box-sizing: border-box;
  margin-bottom: 24rpx;
  padding-top: 88rpx;

}

/* 🔥 固定在底部核心样式 */
.button-group {
  display: flex;
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 24rpx;
  background: #fff; /* 底部背景白色，不穿透 */
  box-shadow: 0 -2rpx 10rpx rgba(0,0,0,0.05);
  z-index: 99;
}

.nav-bar {
  background: unset;
  margin-left: 24rpx;
}

.nav-bar ::v-deep .van-nav-bar__left, ::v-deep .van-dropdown-menu__title {
  font-size: 32rpx;
  margin-left: 0;
  padding-left: 0;
  font-weight: 500 !important;
}

.nav-bar ::v-deep .van-nav-bar__text {
  color: #1677ff !important;
  font-size: 32rpx;
}

.manual-btn {
  flex: 0.5;
  margin-right: 18rpx;
  background: #fff !important;
  border: 1px solid #1677ff !important;
  color: #1677ff !important;
}

.save-btn {
  flex: 1;
}

.next-btn {
  flex: 2;
  color: #fff !important;
  background-color: #1677ff !important;
  border-radius: 8rpx;
}

.custom-btn {
  border-radius: 10rpx !important;
  font-size: 32rpx !important;
  font-weight: 500 !important;
  height: 90rpx;
}

/* 顶部导航固定 */
::v-deep .fixed-header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 999;
  background: rgba(243, 244, 246, 1);
}

/deep/ .van-dropdown-menu__bar{
  background-color: unset;
  box-shadow: unset;
}
</style>
