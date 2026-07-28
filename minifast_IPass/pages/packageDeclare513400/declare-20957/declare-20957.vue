<!-- 绿色惠民殡葬 -->
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

    <div class="personnel-type-wrapper space-top-wrapper">
      <ComponentDeclarePersonnel
        :renderData="personnelList"
        @change="handleChangePersonnelInfo"
      ></ComponentDeclarePersonnel>
    </div>

    <!-- 申报信息 -->
    <div class="space-top-wrapper">
      <ComponentPanel title="申报信息">
        <div class="panel-content">
          <div class="cell-items">
            <ComponentDeclarePicker
              label="遗体接运费"
              idName="m00200"
              :range="codeMap.YESORNO"
              rangeKey="aaa103"
              valueKey="aaa102"
              placeholder="请选择是否涉及遗体接运费"
              v-model="projectDeclareInfo.m00200"
            ></ComponentDeclarePicker>
            <ComponentDeclarePicker
              label="遗体火化费"
              idName="m00201"
              :range="codeMap.YESORNO"
              rangeKey="aaa103"
              valueKey="aaa102"
              placeholder="请选择是否涉及遗体火化费"
              v-model="projectDeclareInfo.m00201"
            ></ComponentDeclarePicker>
            <ComponentDeclarePicker
              label="遗体冷冻或冷藏费"
              idName="m00202"
              :range="codeMap.YESORNO"
              rangeKey="aaa103"
              valueKey="aaa102"
              placeholder="请选择是否涉及遗体冷冻或冷藏费"
              v-model="projectDeclareInfo.m00202"
            ></ComponentDeclarePicker>
            <ComponentDeclarePicker
              label="骨灰寄存费"
              idName="m00203"
              :range="codeMap.YESORNO"
              rangeKey="aaa103"
              valueKey="aaa102"
              placeholder="请选择是否涉及骨灰寄存费"
              v-model="projectDeclareInfo.m00203"
            ></ComponentDeclarePicker>

            <div class="cell-item required">
              <div class="key">逝者姓名</div>
              <div class="value">
                <input
                  type="text"
                  v-model="projectDeclareInfo.m00059"
                  placeholder="请输入逝者姓名"
                />
              </div>
            </div>

            <div class="cell-item required">
              <div class="key">逝者身份证号</div>
              <div class="value">
                <input
                  type="text"
                  @change="handleBlurm00058"
                  v-model="projectDeclareInfo.m00058"
                  placeholder="请输入逝者身份证号"
                />
              </div>
            </div>

            <div class="cell-item required">
              <div class="key">申请人与死者关系</div>
              <div class="value">
                <input
                  type="text"
                  v-model="projectDeclareInfo.m00194"
                  placeholder="请输入申请人与死者关系"
                />
              </div>
            </div>
          </div>
        </div>
      </ComponentPanel>
    </div>

    <!-- end  在以上代码中根据项目需求更改-->
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
import ComponentDeclareCard from '@/components/project/ez-declare-card/ez-declare-card.vue'
import ComponentDeclarePersonnel from '@/components/project/ez-declare-personnel/ez-declare-personnel.vue'
import ComponentDeclareRadio from '@/components/project/ez-declare-radio/ez-declare-radio.vue'
import ComponentDeclarePicker from '@/components/project/ez-declare-picker/ez-declare-picker.vue'

import { useDeclare } from '@/mixins'

import { getIsDev } from '@/utils/get'
import { getCodeListByCodeName } from '@/utils/custom-api'
import { showModal } from '@/utils/uni-api'
import { checkIDCard } from '@/utils/check'

export default {
  name: 'pageDeclare20957',
  data() {
    return {
      renderObj: {
        idCard: true, // 身份证
        userName: true, // 姓名
        tel: true, // 联系电话
        permanentAddress: true, // 户籍地址
        age: true, // 年龄
        gender: true, // 性别
        nation: true // 民族
      },
      // 申报信息
      projectDeclareInfo: {
        m00200: '', //是否涉及遗体接运费
        m00201: '', //是否涉及遗体火化费
        m00202: '', //是否涉及遗体冷冻或冷藏费
        m00203: '', //是否涉及骨灰寄存费
        m00059: '', //逝者姓名
        m00058: '', //逝者身份证号
        m00194: '' //申请人与死者关系
      }
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
    ComponentDeclarePicker
  },
  mixins: [useDeclare],
  // 监听页面加载，其参数为上个页面传递的数据，参数类型为Object（用于页面传参）
  onLoad(e) {
    this.handleOnLoad(e)
  },
  methods: {

    // 输入框失去焦点校验身份证号
    handleBlurm00058(e) {
      const { value } = e.target
      const checkResult = checkIDCard(value)
      if (checkResult.status === '0') {
        showModal(checkResult.msg)
        this.projectDeclareInfo.m00058 = ''
      }
    },

    // 获取该申报项目的所需要的码表数据
    // aaz502、aac011、dac009、aac004、aac005、aae008、yesorno 不用再次获取
    // 编写格式参考达州20033项目
    async getCodeTableCacheData() {
      const isDev = getIsDev() // 当前环境是否是开发环境
      let YESORNO = [] // 选项是否

      try {
        YESORNO = await getCodeListByCodeName('YESORNO')
      } catch (err) {
        if (isDev) {
          console.error('code table error：', err)
        }
      }

      this.codeMap = {
        ...this.codeMap,
        YESORNO
      }
    },
    // 检测数据输入格式是否正确 须根据项目需求修改
    handleCheckInput() {
      const { m00200, m00201, m00202, m00203, m00059, m00058, m00194 } = this.projectDeclareInfo

      if (!m00200) {
        showModal('请选择是否涉及遗体接运费')
        return false
      }
      if (!m00201) {
        showModal('请选择是否涉及遗体火化费')
        return false
      }
      if (!m00202) {
        showModal('请选择是否涉及遗体冷冻或冷藏费')
        return false
      }
      if (!m00203) {
        showModal('请选择是否涉及骨灰寄存费')
        return false
      }
      if (!m00059) {
        showModal('请填写逝者姓名')
        return false
      }
      if (!m00058) {
        showModal('请填写逝者身份证号')
        return false
      }
      if (!m00194) {
        showModal('请填写申请人与死者关系')
        return false
      }
      return true
    },

    // 下一步 须根据项目需求修改
    handleJumpNextStep() {
      if (!this.handleCheckComponentInput()) {
        return
      }
      if (!this.handleCheckInput()) {
        return
      }
      const { m00200, m00201, m00202, m00203, m00059, m00058, m00194 } = this.projectDeclareInfo
      // 扩展字段
      let hb00BizMap = {
        m00200,
        m00201,
        m00202, 
        m00203, 
        m00059, 
        m00058, 
        m00194
      }

      this.handleDeclareData(hb00BizMap, '0')
    }
  }
}
</script>
  
  <style lang="scss" scoped></style>
  
  