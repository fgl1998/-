<!-- 孤儿、事实无人抚养儿童年满18周岁后助学项目 -->
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

            <div class="cell-item required">
              <div class="key">学校名称及专业</div>
              <div class="value">
                <input
                  type="text"
                  v-model="projectDeclareInfo.m00137"
                  placeholder="请输入学校名称及专业"
                />
              </div>
            </div>

            <ComponentDeclarePicker
              label="类别"
              idName="m00199"
              :range="codeMap.M00199"
              rangeKey="aaa103"
              valueKey="aaa102"
              placeholder="请选择类别"
              v-model="projectDeclareInfo.m00199"
            ></ComponentDeclarePicker>

            <div class="cell-item">
              <div class="key">录取通知书编号</div>
              <div class="value">
                <input
                  type="text"
                  v-model="projectDeclareInfo.m00054"
                  placeholder="请输入录取通知书编号"
                />
              </div>
            </div>
            <ComponentSelectAddressMultitype
              label="就读学校地址"
              placeholder="请选择或输入就读学校地址"
              :isShowBtn="renderObj.permanentAddress"
              @clickBtn="projectDeclareInfo.m00106 = basicInfo.permanentAddress"
              v-model="projectDeclareInfo.m00106"
            >
            </ComponentSelectAddressMultitype>
            <ComponentDeclarePicker
              label="入学时间"
              idName="m00056"
              mode="date"
              fields="day"
              v-model="projectDeclareInfo.m00056"
              placeholder="请选择入学时间"
            ></ComponentDeclarePicker>

            <ComponentDeclarePicker
              label="预计毕业时间"
              idName="m00070"
              mode="date"
              fields="day"
              v-model="projectDeclareInfo.m00070"
              placeholder="请选择预计毕业时间"
            ></ComponentDeclarePicker>

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
import ComponentSelectAddressMultitype from '@/components/project/ez-select-address-multitype/ez-select-address-multitype.vue'

import { useDeclare } from '@/mixins'

import { getIsDev } from '@/utils/get'
import { getCodeListByCodeName } from '@/utils/custom-api'
import { showModal } from '@/utils/uni-api'

export default {
  name: 'pageDeclare200085',
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
        m00137: '', //学校名称及专业
        m00199: '', //类别
        m00054: '', //录取通知书编号
        m00106: '', //就读学校地址
        m00056: '', //入学时间
        m00070: '' //预计毕业时间
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
    ComponentDeclarePicker,
    ComponentSelectAddressMultitype
  },
  mixins: [useDeclare],
  // 监听页面加载，其参数为上个页面传递的数据，参数类型为Object（用于页面传参）
  onLoad(e) {
    this.handleOnLoad(e)
  },
  methods: {
    // 获取该申报项目的所需要的码表数据
    // aaz502、aac011、dac009、aac004、aac005、aae008、yesorno 不用再次获取
    // 编写格式参考达州20033项目
    async getCodeTableCacheData() {
      const isDev = getIsDev() // 当前环境是否是开发环境
      let M00199 = [] // 类别

      try {
        M00199 = await getCodeListByCodeName('M00199')
      } catch (err) {
        if (isDev) {
          console.error('code table error：', err)
        }
      }

      this.codeMap = {
        ...this.codeMap,
        M00199
      }
    },
    // 检测数据输入格式是否正确 须根据项目需求修改
    handleCheckInput() {
      const { m00137, m00199, m00054, m00106, m00056, m00070 } =
        this.projectDeclareInfo

      if (!m00137) {
        showModal('请填写学校名称及专业')
        return false
      }
      if (!m00199) {
        showModal('请选择类别')
        return false
      }
      if (!m00106) {
        showModal('请选择就读学校地址')
        return false
      }
      if (!m00056) {
        showModal('请选择入学时间')
        return false
      }
      if (!m00070) {
        showModal('请选择预计毕业时间')
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
      const { m00137, m00199, m00054, m00106, m00056, m00070 } = this.projectDeclareInfo
      // 扩展字段
      let hb00BizMap = {
        m00137, 
        m00199, 
        m00054, 
        m00106, 
        m00056, 
        m00070
      }

      this.handleDeclareData(hb00BizMap, '0')
    }
  }
}
</script>
  
  <style lang="scss" scoped></style>
  
  