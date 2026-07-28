<template>
  <!-- “福彩圆梦·孤儿助学工程”助学金发放 -->
  <view class="declare">
    <div class="progress-wrapper">
      <ComponentDeclareStep :current="2"></ComponentDeclareStep>
    </div>

    <div class="basic-info-wrapper">
      <ComponentDeclare
        :declareType="declareType"
        :fixedDeclareType="fixedDeclareType"
        :renderObj="renderObj"
        :projectNumber="chi031"
        :projectName="chi031_desc"
        @changeDeclareType="handleChangeDeclareType"
        @changeBasicInfo="handleChangeBasicInfo"
        @changeCodeMap="handleChangeCodeMap"
        @changeAgentInfo="handleChangeAgentInfo"
        @changeDataByIdCard="handleChangeDataByIdCard"
      >
      </ComponentDeclare>
    </div>

    <!-- start 需要修改的地方开始 在以下代码中根据项目需求更改 上面代码勿动 -->
    <div class="declare-info-wrapper">
      <ComponentPanel title="申报信息">
        <div class="panel-content">
          <div class="cell-items">
            <div class="cell-item required">
              <div class="key">就读学校</div>
              <div class="value">
                <input
                  type="text"
                  v-model="projectDeclareInfo.m00068"
                  placeholder="请输入就读学校"
                />
              </div>
            </div>

            <ComponentDeclarePicker
              label="院校类别"
              idName="m00039"
              :range="codeMap.m00039"
              placeholder="请选择院校类别"
              v-model="projectDeclareInfo.m00039"
            >
            </ComponentDeclarePicker>

            <ComponentSelectAddressMultitype
              label="就读学校地址"
              placeholder="请选择或输入就读学校地址"
              v-model="projectDeclareInfo.m00106"
              :isShowBtn="false"
            >
            </ComponentSelectAddressMultitype>
          </div>
        </div>
      </ComponentPanel>
    </div>

    <!-- end  需要修改的地方结束 在以下代码中根据项目需求更改 下面代码勿动-->
    <div class="button-wrapper">
      <ComponentButton
        @click="handleJumpNextStep"
        name="下一步"
        type="primary"
      ></ComponentButton>
    </div>
  </view>
</template>

<script>
import ComponentButton from '@/components/common/ez-button/ez-button.vue'
import ComponentPanel from '@/components/common/ez-panel/ez-panel.vue'

import ComponentDeclareStep from '@/components/project/ez-declare-step/ez-declare-step.vue'
import ComponentDeclare from '@/components/project/ez-declare/ez-declare.vue'
import ComponentSelectPermanentAddress from '@/components/project/ez-select-permanent-address/ez-select-permanent-address.vue'
import ComponentSelectCurrentAddress from '@/components/project/ez-select-current-address/ez-select-current-address.vue'
import ComponentDeclareCard from '../components/ez-declare-card/ez-declare-card.vue'
import ComponentDeclarePersonnel from '@/components/project/ez-declare-personnel/ez-declare-personnel.vue'
import ComponentDeclareRadio from '@/components/project/ez-declare-radio/ez-declare-radio.vue'
import ComponentDeclarePicker from '@/components/project/ez-declare-picker/ez-declare-picker.vue'
import ComponentSelectAddressMultitype from '@/components/project/ez-select-address-multitype/ez-select-address-multitype.vue'
import { useDeclare } from '@/mixins'

import { getIsDev } from '@/utils/get'
import { checkIDCard, checkPhoneNumber } from '@/utils/check'
import { getCodeListByCodeName } from '@/utils/custom-api'
import { showModal } from '@/utils/uni-api'
export default {
  name: 'pageDeclare20982',

  data() {
    return {
      renderObj: {
        idCard: true, // 身份证
        userName: true, // 姓名
        tel: true, // 联系电话
        permanentAddress: true, // 户籍地址
        currentAddress: true, //现居地址
        gender: true, //性别
      },

      projectDeclareInfo: {
        m00106: '',
      },
    }
  },
  components: {
    ComponentButton,
    ComponentPanel,
    ComponentDeclare,
    ComponentDeclareStep,
    ComponentSelectPermanentAddress,
    ComponentSelectCurrentAddress,
    ComponentDeclareCard,
    ComponentDeclareRadio,
    ComponentDeclarePersonnel,
    ComponentDeclarePicker,
    ComponentSelectAddressMultitype,
  },
  mixins: [useDeclare],
  // 监听页面加载，其参数为上个页面传递的数据，参数类型为Object（用于页面传参）
  onLoad(e) {
    this.handleOnLoad(e)
  },
  // 监听页面显示
  onShow() {},
  // 监听页面隐藏
  onHide() {},
  methods: {
    async getCodeTableCacheData() {
      const isDev = getIsDev() // 当前环境是否是开发环境
      let m00039 = [] // 院校类别

      try {
        m00039 = await getCodeListByCodeName('m00039')
      } catch (err) {
        if (isDev) {
          console.log('code table m00039 error：', err)
        }
      }

      this.codeMap = {
        ...this.codeMap,
        m00039,
      }
    },
    // 手动输入手机号 失去焦点监听
    handleAae005Blur(e) {
      const { value } = e.target
      const checkIDCardResult = checkPhoneNumber(value)
      if (checkIDCardResult.status === '0') {
        showModal(checkIDCardResult.msg, '提示', false)
      }
    },
    // 手动输入身份证号 失去焦点监听
    handleBlurW00038(e) {
      const { value } = e.target
      const checkResult = checkIDCard(value)
      if (checkResult.status === '0') {
        showModal(checkResult.msg)
      }
    },
    // 检测数据输入格式是否正确 须根据项目需求更改
    handleCheckInput() {
      const {
        chb0a9, //户籍地址
        chb0a3, //现居住地址
        m00032, //性别

        m00068, //就读学校
        m00039, //院校类别
        m00106, //就读学校地址
      } = this.projectDeclareInfo
      if (!m00068) {
        showModal('请输入就读学校')
        return false
      }
      if (!m00039) {
        showModal('请选择院校类别')
        return false
      }
      if (!m00106) {
        showModal('请选择就读学校地址')
        return false
      }

      return true
    },
    // 下一步
    handleJumpNextStep() {
      if (!this.handleCheckComponentInput()) {
        return
      }
      if (!this.handleCheckInput()) {
        return
      }
      const {
        permanentAddress, //户籍地址
        currentAddress, //现居地址
        gender, //性别
      } = this.basicInfo

      const {
        chb0a9, //户籍地址
        chb0a3, //现居住地址
        m00032, //性别

        m00068, //就读学校
        m00039, //院校类别
        m00106, //就读学校地址
      } = this.projectDeclareInfo
      // 扩展字段
      const hb00BizMap = {
        chb0a9: permanentAddress, //户籍地址
        chb0a3: currentAddress, //现居住地址
        m00032: gender, //性别

        m00068, //就读学校
        m00039, //院校类别
        m00106, //就读学校地址
      }

      this.handleDeclareData(hb00BizMap, '0')
    },
  },
  computed: {},
  watch: {},
}
</script>

<style lang="scss" scoped>
.declare-info-wrapper {
  margin-top: 30rpx;
}
</style>
