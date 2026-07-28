<!-- 城市特困人员救助供养金 民政局 -->
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
        @changeDataByIdCardBank="handleChangeDataByIdCardBank"
      >
      </ComponentDeclare>
    </div>

    <!-- start 需要修改的地方开始 在以下代码中根据项目需求更改 上面代码勿动 -->
    <div class="personnel-type-wrapper space-top-wrapper">
      <ComponentDeclarePersonnel
        :renderData="personnelList"
        :isOpenCategoryNotes="true"
        @change="handleChangePersonnelInfo"
      ></ComponentDeclarePersonnel>
    </div>

    <!-- 申报信息 -->
    <div class="space-top-wrapper">
      <ComponentPanel title="申报信息">
        <div class="panel-content">
          <div class="cell-items">
            <div class="panel-content">
              <div class="cell-items">
                <!-- 组 -->
                <div class="cell-item required">
                  <div class="key">组</div>
                  <div class="value">
                    <input
                      type="text"
                      v-model="projectDeclareInfo.chb019"
                      placeholder="请输入组"
                    />
                  </div>
                </div>
                <div class="cell-item required">
                  <div class="key">经济年收入</div>
                  <div class="value">
                    <input
                      type="digit"
                      v-model="projectDeclareInfo.m00101"
                      placeholder="请输入经济年收入"
                    />
                  </div>
                </div>
                <ComponentDeclarePicker
                  label="供养类别"
                  idName="m00008"
                  :range="codeMap.m00008"
                  v-model="projectDeclareInfo.m00008"
                  placeholder="请选择供养类别"
                ></ComponentDeclarePicker>
                <ComponentDeclarePicker
                  label="户籍类别"
                  idName="m00002"
                  :range="codeMap.A00022"
                  v-model="projectDeclareInfo.m00002"
                  placeholder="请选择户籍类别"
                ></ComponentDeclarePicker>
                <block v-if="personnelInfo.cac102 === '694'">
                  <ComponentDeclarePicker
                    label="护理类别"
                    idName="m00102"
                    :range="codeMap.m00102"
                    v-model="projectDeclareInfo.m00102"
                    placeholder="请选择护理类别"
                  ></ComponentDeclarePicker>
                </block>
              </div>
            </div>
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

import { useDeclare } from '@/mixins'

import { getIsDev } from '@/utils/get'
import { checkIDCard, checkPhoneNumber } from '@/utils/check'
import { getCodeListByCodeName } from '@/utils/custom-api'
import { showModal } from '@/utils/uni-api'
export default {
  name: 'pageDeclare20121',
  data() {
    return {
      // 基本信息 渲染配置
      renderObj: {
        idCard: true, // 身份证
        userName: true, // 姓名
        tel: true, // 联系电话
        permanentAddress: true, // 户籍地址
        currentAddress: true, // 现居住地址
        nation: true, // 民族

        // SSCBankCardNumber: true, // 社保卡银行卡号
        // SSCBankCardCategory: true, // 社保卡银行卡类别
      },
      // 自定义添加一些属性 防止双向绑定失败 例如 picker组件之类
      projectDeclareInfo: {
        A00022: '',
        m00102: '',
        m00008: '',
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
  },
  mixins: [useDeclare],
  // 监听页面加载，其参数为上个页面传递的数据，参数类型为Object（用于页面传参）
  onLoad(e) {
    this.handleOnLoad(e)
  },
  // 监听页面初次渲染完成
  onReady() {},
  // 监听页面显示
  onShow() {},
  // 监听页面隐藏
  onHide() {},
  methods: {
    // 获取该申报项目的所需要的码表数据
    // aaz502、aac011、dac009、aac004、aac005、aae008、yesorno 不用再次获取
    // 编写格式参考达州20033项目
    async getCodeTableCacheData() {
      const isDev = getIsDev() // 当前环境是否是开发环境
      let A00022 = [] // 户籍类别
      let m00008 = [] // 供养类别
      let m00102 = [] // 护理类别
      try {
        A00022 = await getCodeListByCodeName('A00022')
      } catch (err) {
        if (isDev) {
          console.log('code table A00022 error：', err)
        }
      }
      try {
        m00008 = await getCodeListByCodeName('m00008')
      } catch (err) {
        if (isDev) {
          console.log('code table m00008 error：', err)
        }
      }
      try {
        m00102 = await getCodeListByCodeName('m00102')
      } catch (err) {
        if (isDev) {
          console.log('code table m00102 error：', err)
        }
      }

      this.codeMap = {
        ...this.codeMap,
        A00022,
        m00008,
        m00102,
      }
    },

    handleCheckInput() {
      const { m00002, m00008, m00101, chb019 } = this.projectDeclareInfo
      if (!chb019) {
        showModal('请输入组（社）')
        return false
      }
      if (!m00002) {
        showModal('请选择户籍类别')
        return false
      }
      if (!m00008) {
        showModal('请选择供养类别')
        return false
      }
      if (!m00101) {
        showModal('请输入经济年收入')
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
        permanentAddress, // 户籍地址
        currentAddress, // 现居住地址
        nation, // 民族
        A00022,
      } = this.basicInfo

      const { m00002, m00008, m00102, m00101, chb019 } = this.projectDeclareInfo

      // 扩展字段
      const hb00BizMap = {
        chb0a9: permanentAddress, // 户籍地址
        chb0a3: currentAddress, // 现居住地址
        aac005: nation, // 民族
        m00002: m00002,
        m00008,
        m00102,
        m00101,
        chb019,
      }
      this.handleDeclareData(hb00BizMap, '0')
    },
  },
  computed: {},
  watch: {},
}
</script>

<style lang="scss" scoped></style>
