<!-- 福彩“金秋助学”补助 -->
<template>
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
              <div class="key">毕业院校</div>
              <div class="value">
                <input
                  type="text"
                  v-model="projectDeclareInfo.m00024"
                  placeholder="请输入毕业院校"
                />
              </div>
            </div>

            <div class="cell-item required">
              <div class="key">录取院校</div>
              <div class="value">
                <input
                  type="text"
                  v-model="projectDeclareInfo.m00036"
                  placeholder="请输入录取院校"
                />
              </div>
            </div>

            <ComponentSelectAddressMultitype
              label="院校所在地"
              placeholder="请选择或输入院校所在地"
              :isShowBtn="renderObj.permanentAddress"
              @clickBtn="projectDeclareInfo.m00038 = basicInfo.permanentAddress"
              v-model="projectDeclareInfo.m00038"
            >
            </ComponentSelectAddressMultitype>

            <ComponentDeclarePicker
              label="家庭经济状况"
              idName="m00025"
              :range="codeMap.m00025"
              placeholder="请选择家庭经济状况"
              v-model="projectDeclareInfo.m00025"
            ></ComponentDeclarePicker>
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

import { getIsDev, getDate } from '@/utils/get'
import { getCodeListByCodeName } from '@/utils/custom-api'
import { showModal } from '@/utils/uni-api'

export default {
  name: 'pageDeclare20047',
  data() {
    return {
      renderObj: {
        idCard: true, // 身份证
        userName: true, // 姓名
        tel: true, // 联系电话
        nation: true, //民族
        permanentAddress: true, // 户籍地址
      },
      today: getDate(),
      projectDeclareInfo: {
        m00038: '', //地院校所在地
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
      let m00025 = [] // 家庭经济状况

      try {
        m00025 = await getCodeListByCodeName('m00025')
      } catch (err) {
        if (isDev) {
          console.log('code table m00025 error：', err)
        }
      }
      this.codeMap = {
        ...this.codeMap,
        m00025,
      }
    },
    // 检测数据输入格式是否正确 须根据项目需求更改
    handleCheckInput() {
      const {
        m00024, //毕业院校
        m00036, //录取院校
        m00038, //院校所在地
        m00025, //家庭经济状况
      } = this.projectDeclareInfo

      if (!m00024) {
        showModal('请输入毕业院校')
        return false
      }
      if (!m00036) {
        showModal('请输入录取院校')
        return false
      }
      if (!m00038) {
        showModal('请选择院校所在地')
        return false
      }
      if (!m00025) {
        showModal('请选择入家庭经济状况')
        return false
      }
      return true
    },
    // 下一步
    handleJumpNextStep() {
      // if (!this.handleCheckComponentInput()) {
      //   return;
      // }
      if (!this.handleCheckInput()) {
        return
      }

      const {} = this.basicInfo

      const {
        m00024, //毕业院校
        m00036, //录取院校
        m00038, //院校所在地
        m00025, //家庭经济状况
      } = this.projectDeclareInfo
      // 扩展字段
      var hb00BizMap = {
        m00024, //毕业院校
        m00036, //录取院校
        m00038, //院校所在地
        m00025, //家庭经济状况
        // aae019:0
      }

      this.handleDeclareData(hb00BizMap, '0')
    },
  },
  computed: {},
}
</script>

<style lang="scss" scoped>
.declare-info-wrapper {
  margin-top: 30rpx;
}
</style>
