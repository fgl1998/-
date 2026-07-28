<!-- 高校毕业生社会保险补贴（灵活就业） -->
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
            <ComponentDeclarePicker
              label="申请开始年月"
              idName="r00021"
              mode="date"
              fields="month"
              v-model="projectDeclareInfo.r00021"
              placeholder="请选择申请开始年月"
            ></ComponentDeclarePicker>
            <ComponentDeclarePicker
              label="申请结束年月"
              idName="r00022"
              mode="date"
              fields="month"
              :startTime="projectDeclareInfo.r00021"
              v-model="projectDeclareInfo.r00022"
              placeholder="请选择申请结束年月"
            ></ComponentDeclarePicker>
            <div class="cell-item required">
              <div class="key">参保地</div>
              <div class="value">
                <input
                  type="text"
                  v-model="projectDeclareInfo.r00169"
                  placeholder="请输入参保地"
                />
              </div>
            </div>
            <div class="cell-item required">
              <div class="key">养老保险每月缴费金额</div>
              <div class="value">
                <input
                  type="number"
                  maxlength="19"
                  v-model="projectDeclareInfo.r00111"
                  placeholder="请输入养老保险每月缴费金额"
                />
              </div>
            </div>
            <div class="cell-item required">
              <div class="key">养老保险补贴金额</div>
              <div class="value">
                <input
                  type="number"
                  maxlength="19"
                  v-model="projectDeclareInfo.r00023"
                  placeholder="请输入养老保险补贴金额"
                />
              </div>
            </div>
            <div class="cell-item required">
              <div class="key">医疗保险每月缴费金额</div>
              <div class="value">
                <input
                  type="number"
                  maxlength="19"
                  v-model="projectDeclareInfo.r00112"
                  placeholder="请输入医疗保险每月缴费金额"
                />
              </div>
            </div>
            <div class="cell-item required">
              <div class="key">医疗保险补贴金额</div>
              <div class="value">
                <input
                  type="number"
                  maxlength="19"
                  v-model="projectDeclareInfo.r00024"
                  placeholder="请输入医疗保险补贴金额"
                />
              </div>
            </div>
            <div class="cell-item required">
              <div class="key">发放金额</div>
              <div class="value">
                <input
                  type="number"
                  v-model="projectDeclareInfo.aae019"
                  placeholder="请输入发放金额"
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
import ComponentDeclareCard from '@/components/project/ez-declare-card/ez-declare-card.vue'
import ComponentDeclarePersonnel from '@/components/project/ez-declare-personnel/ez-declare-personnel.vue'
import ComponentDeclarePicker from '@/components/project/ez-declare-picker/ez-declare-picker.vue'

import { useDeclare } from '@/mixins'
import { useGetCurrentDate, useGetBirthdayByIDCard } from '@/hooks/common'
import { showModal } from '@/utils/uni-api'
export default {
  name: 'pageDeclare20756',
  data() {
    return {
      isMultipleChoicesPersonnel: false,
      renderObj: {
        idCard: true, // 身份证
        userName: true, // 姓名
        tel: true, // 联系电话
        age: true, // 年龄
        gender: true, // 性别
        birthday: true, // 出生年月
        permanentAddress: true, // 户籍地址
      },
      // 申报信息
      projectDeclareInfo: {
        aq0025: '',
      },
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
      const { r00021, r00022, r00169, r00111, r00023, r00112, r00024, aae019 } =
        this.projectDeclareInfo

      if (!r00021) {
        showModal('请选择申请开始年月')
        return false
      }
      if (!r00022) {
        showModal('请选择申请结束年月')
        return false
      }
      if (!r00169) {
        showModal('请输入参保地')
        return false
      }
      if (!r00111) {
        showModal('请输入养老保险每月缴费金额')
        return false
      }
      if (!r00023) {
        showModal('请输入养老保险补贴金额')
        return false
      }
      if (!r00112) {
        showModal('请输入医疗保险每月缴费金额')
        return false
      }
      if (!r00024) {
        showModal('请输入医疗保险补贴金额')
        return false
      }
      if (!aae019) {
        showModal('请输入发放金额')
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
      const { r00021, r00022, r00169, r00111, r00023, r00112, r00024, aae019 } =
        this.projectDeclareInfo

      const { idCard, permanentAddress } = this.basicInfo
      const birthday = useGetBirthdayByIDCard(idCard)
      // 扩展字段
      let hb00BizMap = {
        r00105: birthday, // 出生日期
        r00079: permanentAddress, // 户籍地址
        r00021: r00021.replace(/\-/g, ''), // 申请开始年月
        r00022: r00022.replace(/\-/g, ''), // 申请结束年月
        r00169, // 参保地
        r00111, // 养老保险每月缴费金额
        r00023, // 养老保险补贴金额
        r00112, // 医疗保险每月缴费金额
        r00024, // 医疗保险补贴金额
        aae019, // 发放金额
        chb01m: '1', // 发放类型 正常发放
        aae209: useGetCurrentDate('month', ''), // 发放期号 当前申报年月
      }

      this.handleDeclareData(hb00BizMap, '0')
    },
  },
}
</script>

<style lang="scss" scoped></style>
