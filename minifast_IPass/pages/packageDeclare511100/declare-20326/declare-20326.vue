<!-- 百岁老人去世丧葬补贴 -->
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
    <div class="personnel-type-wrapper space-top-wrapper">
      <ComponentDeclarePersonnel
        :isMultipleChoicesPersonnel="isMultipleChoicesPersonnel"
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
            <div class="cell-item required">
              <div class="key">去世老人姓名</div>
              <div class="value">
                <input
                  type="text"
                  maxlength="19"
                  v-model="projectDeclareInfo.m00159"
                  placeholder="请输入去世老人姓名"
                />
              </div>
            </div>

            <div class="cell-item required">
              <div class="key">去世老人身份证号码</div>
              <div class="value">
                <input
                  type="idcard"
                  maxlength="18"
                  v-model="projectDeclareInfo.m00158"
                  placeholder="请输入去世老人身份证号码"
                />
              </div>
            </div>

            <ComponentDeclarePicker
              label="死亡时间"
              idName="m00060"
              mode="date"
              fields="day"
              :endTime="today_d"
              v-model="projectDeclareInfo.m00060"
              placeholder="请选择死亡时间"
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
import ComponentDeclareCard from '@/components/project/ez-declare-card/ez-declare-card.vue'
import ComponentDeclarePersonnel from '@/components/project/ez-declare-personnel/ez-declare-personnel.vue'
import ComponentDeclarePicker from '@/components/project/ez-declare-picker/ez-declare-picker.vue'

import { useDeclare } from '@/mixins'
import { useGetCurrentDate } from '@/hooks/common'
import { checkIDCard } from '@/utils/check'
import { showModal } from '@/utils/uni-api'
export default {
  name: 'pageDeclare20326',
  data() {
    return {
      isMultipleChoicesPersonnel: false,
      today_d: useGetCurrentDate(),
      renderObj: {
        idCard: true, // 身份证
        userName: true, // 姓名
        tel: true, // 联系电话
        gender: true, // 性别
        permanentAddress: true, // 户籍地址
        age: true, // 年龄
        nation: true, // 民族
        currentAddress: true, //现居地址
      },
      // 申报信息
      projectDeclareInfo: {},
    }
  },
  components: {
    ComponentButton,
    ComponentPanel,
    ComponentDeclare,
    ComponentDeclareStep,
    ComponentDeclareCard,
    ComponentDeclarePersonnel,
    ComponentDeclarePicker,
    ComponentSelectPermanentAddress,
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
    async getCodeTableCacheData() {},
    // 检测数据输入格式是否正确 须根据项目需求修改
    handleCheckInput() {
      const {
        m00159, //去世老人姓名
        m00158, //去世老人身份证号
        m00060, //死亡时间
      } = this.projectDeclareInfo
      if (!m00159) {
        showModal('请输入去世老人姓名')
        return false
      }
      if (!m00158) {
        showModal('请输入去世老人身份证号')
        return false
      } else {
        const checkResult = checkIDCard(m00158, '去世老人身份证号')
        if (checkResult.status === '0') {
          showModal(checkResult.msg)
          return false
        }
      }
      if (!m00060) {
        showModal('请选择死亡时间')
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
      const {
        aae019, //发放金额
        m00159, //去世老人姓名
        m00158, //去世老人身份证号
        m00060, //死亡时间
      } = this.projectDeclareInfo

      const {
        gender, // 性别
        permanentAddress, // 户籍地址
        age, // 年龄
        nation, // 民族
        currentAddress, //现居地址
      } = this.basicInfo

      // 扩展字段
      let hb00BizMap = {
        aac004: gender, //性别
        chb00l: age, //年龄
        aac005: nation, //民族
        aae006: permanentAddress, //户籍地址/详细地址
        chb0a3: currentAddress, //现居住地址
        aae019: 0, //发放金额
        m00159, //去世老人姓名
        m00158, //去世老人身份证号
        m00060, //死亡时间
        chb01m: '1', // 发放类型 正常发放
        aae209: useGetCurrentDate('month', ''), // 发放期号 当前申报年月
      }

      this.handleDeclareData(hb00BizMap, '0')
    },
  },
}
</script>

<style lang="scss" scoped></style>
