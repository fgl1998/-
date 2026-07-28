<!-- 绿色惠民殡葬费 -->
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
              <div class="key">与逝者关系</div>
              <div class="value">
                <input
                  type="text"
                  maxlength="19"
                  v-model="projectDeclareInfo.m00138"
                  placeholder="请输入与逝者关系"
                />
              </div>
            </div>

            <div class="cell-item required">
              <div class="key">票据金额</div>
              <div class="value">
                <input
                  type="digit"
                  maxlength="19"
                  v-model="projectDeclareInfo.m00139"
                  placeholder="请输入票据金额"
                />
              </div>
            </div>

            <div class="cell-item required">
              <div class="key">逝者姓名</div>
              <div class="value">
                <input
                  type="text"
                  maxlength="19"
                  v-model="projectDeclareInfo.m00059"
                  placeholder="请输入逝者姓名"
                />
              </div>
            </div>

            <div class="cell-item required">
              <div class="key">逝者身份证号码</div>
              <div class="value">
                <input
                  type="idcard"
                  maxlength="18"
                  v-model="projectDeclareInfo.m00058"
                  placeholder="请输入逝者身份证号码"
                />
              </div>
            </div>

            <ComponentSelectPermanentAddress
              label="逝者户籍地址"
              placeholder="请选择逝者户籍地址"
              v-model="projectDeclareInfo.m00098"
            >
            </ComponentSelectPermanentAddress>

            <ComponentDeclarePicker
              label="死亡时间"
              idName="m00060"
              mode="date"
              fields="day"
              :endTime="today_d"
              v-model="projectDeclareInfo.m00060"
              placeholder="请选择死亡时间"
            ></ComponentDeclarePicker>

            <ComponentDeclarePicker
              label="火化日期"
              idName="m00150"
              mode="date"
              fields="day"
              :endTime="today_d"
              v-model="projectDeclareInfo.m00150"
              placeholder="请选择火化日期"
            ></ComponentDeclarePicker>

            <div class="cell-item required">
              <div class="key">申请金额</div>
              <div class="value">
                <input
                  type="number"
                  v-model="projectDeclareInfo.aae019"
                  placeholder="请输入申请金额"
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
import ComponentDeclareCard from '@/components/project/ez-declare-card/ez-declare-card.vue'
import ComponentDeclarePersonnel from '@/components/project/ez-declare-personnel/ez-declare-personnel.vue'
import ComponentDeclarePicker from '@/components/project/ez-declare-picker/ez-declare-picker.vue'

import { useDeclare } from '@/mixins'
import { useGetCurrentDate } from '@/hooks/common'
import { checkIDCard } from '@/utils/check'
import { showModal } from '@/utils/uni-api'
export default {
  name: 'pageDeclare20270',
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
      },
      // 申报信息
      projectDeclareInfo: {
        m00098: '',
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
        chb0a9, //户籍地址
        m00032, //性别
        aae019, //发放金额
        m00138, //与逝者关系
        m00139, //票据金额
        m00059, //逝者姓名
        m00058, //逝者身份证号码
        m00098, //逝者户籍地址
        m00060, //死亡时间
        m00150, //火化日期
      } = this.projectDeclareInfo
      if (!m00138) {
        showModal('请输入与逝者关系')
        return false
      }
      if (!m00139) {
        showModal('请输入票据金额')
        return false
      }
      if (!m00059) {
        showModal('请输入逝者姓名')
        return false
      }
      if (!m00058) {
        showModal('请输入逝者身份证号码')
        return false
      } else {
        const checkResult = checkIDCard(m00058, '逝者身份证号码')
        if (checkResult.status === '0') {
          showModal(checkResult.msg)
          return false
        }
      }
      if (!m00098) {
        showModal('请选择逝者户籍地址')
        return false
      }
      if (!m00060) {
        showModal('请选择死亡时间')
        return false
      }
      if (!m00150) {
        showModal('请选择火化日期')
        return false
      }
      if (!aae019) {
        showModal('请输入申请金额')
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
        m00032, //性别
        aae019, //发放金额
        m00138, //与逝者关系
        m00139, //票据金额
        m00059, //逝者姓名
        m00058, //逝者身份证号码
        m00098, //逝者户籍地址
        m00060, //死亡时间
        m00150, //火化日期
      } = this.projectDeclareInfo

      const { gender, permanentAddress } = this.basicInfo

      // 扩展字段
      let hb00BizMap = {
        aae006: permanentAddress, //户籍地址
        m00032: gender, //性别
        aae019, //发放金额
        m00138, //与逝者关系
        m00139, //票据金额
        m00059, //逝者姓名
        m00058, //逝者身份证号码
        m00098, //逝者户籍地址
        m00060, //死亡时间
        m00150, //火化日期
        chb01m: '1', // 发放类型 正常发放
        aae209: useGetCurrentDate('month', ''), // 发放期号 当前申报年月
      }

      this.handleDeclareData(hb00BizMap, '0')
    },
  },
}
</script>

<style lang="scss" scoped></style>
