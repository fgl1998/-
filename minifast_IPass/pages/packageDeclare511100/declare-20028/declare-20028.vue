<!-- 就业困难人员和灵活就业人员社保补贴 -->
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
              <div class="key">养老保险补贴金额</div>
              <div class="value">
                <input
                  type="number"
                  v-model="projectDeclareInfo.r00023"
                  placeholder="请输入养老保险补贴金额"
                />
              </div>
            </div>
            <div class="cell-item required">
              <div class="key">医疗保险补贴金额</div>
              <div class="value">
                <input
                  type="number"
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
import ComponentDeclareCard from '@/components/project/ez-declare-card/ez-declare-card.vue'
import ComponentDeclarePersonnel from '@/components/project/ez-declare-personnel/ez-declare-personnel.vue'
import ComponentDeclareRadio from '@/components/project/ez-declare-radio/ez-declare-radio.vue'
import ComponentDeclarePicker from '@/components/project/ez-declare-picker/ez-declare-picker.vue'

import { useDeclare } from '@/mixins'
import { useGetCurrentDate } from '@/hooks/common'
import { showModal } from '@/utils/uni-api'
export default {
  name: 'pageDeclare20028',
  data() {
    return {
      // 基本信息 渲染配置
      renderObj: {
        idCard: true, // 身份证
        userName: true, // 姓名
        tel: true, // 联系电话
        age: true, // 年龄
        gender: true, // 性别
        birthday: true, // 出生年月
        permanentAddress: true, // 户籍地址
      },
      // 自定义添加一些属性 防止双向绑定失败 例如 picker组件之类
      projectDeclareInfo: {},
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
  methods: {
    // 获取该申报项目的所需要的码表数据
    // aaz502、aac011、dac009、aac004、aac005、aae008、yesorno 不用再次获取
    // 编写格式参考达州20033项目
    async getCodeTableCacheData() {},
    // 检测数据输入格式是否正确 须根据项目需求更改
    handleCheckInput() {
      const { r00021, r00022, r00169, r00023, r00024, aae019 } =
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
      if (!r00023) {
        showModal('请输入养老保险补贴金额')
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
    // 下一步
    handleJumpNextStep() {
      if (!this.handleCheckComponentInput()) {
        return
      }
      if (!this.handleCheckInput()) {
        return
      }

      const { birthday, gender, permanentAddress } = this.basicInfo

      const { r00021, r00022, r00169, r00023, r00024, aae019 } =
        this.projectDeclareInfo
      // 扩展字段
      const hb00BizMap = {
        aac004: gender,
        r00021: r00021.replace(/\-/g, ''),
        r00022: r00022.replace(/\-/g, ''),
        r00169,
        r00023,
        r00024,
        r00105: birthday, //出生日期
        r00079: permanentAddress,
        aae019, //发放金额
        chb01m: '1', // 发放类型 正常发放
        aae209: useGetCurrentDate('month', ''), // 发放期号 当前申报年月
      }
      this.handleDeclareData(hb00BizMap, '0')
    },
  },
}
</script>

<style lang="scss" scoped></style>
