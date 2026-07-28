<!-- 大学生、就业困难人员、返乡农民工、建档立卡贫困劳动力一次性创业补贴 -->
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
        currentAddressLabel="常住地址"
        currentAddressPlaceholder="请选择或输入常住地址"
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
              label="最高学历"
              idName="aq0014"
              :range="codeMap.aq0014"
              rangeKey="aaa103"
              valueKey="aaa102"
              placeholder="请选择最高学历"
              v-model="projectDeclareInfo.r00180"
            ></ComponentDeclarePicker>
            <ComponentDeclarePicker
              label="文化程度"
              idName="aq0001"
              :range="codeMap.r00167"
              rangeKey="aaa103"
              valueKey="aaa102"
              placeholder="请选择文化程度"
              v-model="projectDeclareInfo.r00167"
            ></ComponentDeclarePicker>
            <div class="cell-item">
              <div class="key">专业技术职务级别</div>
              <div class="value">
                <input
                  type="text"
                  v-model="projectDeclareInfo.r00170"
                  placeholder="请输入专业技术职务级别"
                />
              </div>
            </div>
            <div class="cell-item">
              <div class="key">专业技术职务</div>
              <div class="value">
                <input
                  type="text"
                  v-model="projectDeclareInfo.r00172"
                  placeholder="请输入专业技术职务"
                />
              </div>
            </div>
            <ComponentDeclarePicker
              label="取得专技日期"
              idName="r00171"
              mode="date"
              :required="false"
              fields="day"
              :endTime="today_d"
              v-model="projectDeclareInfo.r00171"
              placeholder="请选择取得专技日期"
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
import ComponentDeclareCard from '@/components/project/ez-declare-card/ez-declare-card.vue'
import ComponentDeclarePersonnel from '@/components/project/ez-declare-personnel/ez-declare-personnel.vue'
import ComponentDeclareRadio from '@/components/project/ez-declare-radio/ez-declare-radio.vue'
import ComponentDeclarePicker from '@/components/project/ez-declare-picker/ez-declare-picker.vue'

import { useDeclare } from '@/mixins'
import { useGetCurrentDate } from '@/hooks/common'
import { getCodeListByCodeName } from '@/utils/custom-api'
import { showModal } from '@/utils/uni-api'
export default {
  name: 'pageDeclare20501',
  data() {
    return {
      today_d: useGetCurrentDate(),
      // 基本信息 渲染配置
      renderObj: {
        idCard: true, // 身份证
        userName: true, // 姓名
        tel: true, // 联系电话
        age: true, // 年龄
        gender: true, // 性别
        birthday: true, // 出生年月
        permanentAddress: true, // 户籍地址
        currentAddress: true, // 常住地址
      },
      // 自定义添加一些属性 防止双向绑定失败 例如 picker组件之类
      projectDeclareInfo: {
        aj0050: '',
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
  methods: {
    // 获取该申报项目的所需要的码表数据
    // aaz502、aac011、dac009、aac004、aac005、aae008、yesorno 不用再次获取
    // 编写格式参考达州20033项目
    async getCodeTableCacheData() {
      let aq0014 = [] // 最高学历
      let r00167 = [] // 文化程度

      try {
        r00167 = await getCodeListByCodeName('J00010')
      } catch (err) {
        console.error('code J00010 table error：', err)
      }

      try {
        aq0014 = await getCodeListByCodeName('AQ0014')
      } catch (err) {
        console.error('code AQ0014 table error：', err)
      }
      this.codeMap = {
        ...this.codeMap,
        aq0014,
        r00167,
      }
    },
    // 检测数据输入格式是否正确 须根据项目需求更改
    handleCheckInput() {
      const { r00180, r00167 } = this.projectDeclareInfo
      if (!r00180) {
        showModal('请选择最高学历')
        return false
      }
      if (!r00167) {
        showModal('请选择文化程度')
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

      const { birthday, permanentAddress, currentAddress } = this.basicInfo

      const { r00180, r00167, r00170, r00172, r00171 } = this.projectDeclareInfo
      // 扩展字段
      const hb00BizMap = {
        r00180,
        r00167,
        r00170,
        r00172,
        r00171,
        r00105: birthday, //出生日期
        r00079: permanentAddress,
        r00168: currentAddress,
        aae019: 0,
        chb01m: '1', // 发放类型 正常发放
        aae209: useGetCurrentDate('month', ''), // 发放期号 当前申报年月
      }
      this.handleDeclareData(hb00BizMap, '0')
    },
  },
}
</script>

<style lang="scss" scoped></style>
