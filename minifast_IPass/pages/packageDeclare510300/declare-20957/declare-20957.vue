<!-- 绿色殡葬（民政局） -->
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
        :permanentAddressLabel="
          personnelInfo.cac102 === '659' ? '现居地址' : '户籍地址'
        "
        :permanentAddressPlaceholder="
          personnelInfo.cac102 === '659' ? '请输入现居地址' : '请输入户籍地址'
        "
        addressRemove="102419"
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
                  type="idcard"
                  maxlength="18"
                  v-model="projectDeclareInfo.m00058"
                  placeholder="请输入逝者身份证号"
                />
              </div>
            </div>

            <ComponentDeclarePicker
              label="逝者性别"
              idName="sex"
              placeholder="请选择逝者性别"
              :range="codeMap.aac004"
              v-model="projectDeclareInfo.m00161"
            ></ComponentDeclarePicker>

            <ComponentDeclarePicker
              label="死亡时间"
              idName="m00060"
              placeholder="请选择死亡时间"
              mode="date"
              fields="day"
              :endTime="today"
              v-model="projectDeclareInfo.m00060"
            ></ComponentDeclarePicker>

            <!--            <ComponentDeclarePicker
              label="申报年度"
              idName="m00097"
              placeholder="请选择申报年度"
              mode="date"
              fields="year"
              :startTime="projectDeclareInfo.m00060"
              :endTime="today"
              v-model="projectDeclareInfo.m00097"
            ></ComponentDeclarePicker>

            <ComponentDeclarePicker
              label="申报日期"
              idName="m00081"
              placeholder="请选择申报日期"
              mode="date"
              fields="day"
              :startTime="projectDeclareInfo.m00060"
              :endTime="today"
              v-model="projectDeclareInfo.m00081"
            ></ComponentDeclarePicker> -->

            <ComponentDeclarePicker
              class="noquire"
              label="火化日期"
              idName="m00150"
              placeholder="请选择火化日期"
              mode="date"
              fields="day"
              :startTime="projectDeclareInfo.m00060"
              :endTime="today"
              v-model="projectDeclareInfo.m00150"
            ></ComponentDeclarePicker>

            <ComponentSelectPermanentAddress
              placeholder="请选择逝者户籍地址"
              label="逝者户籍地址"
              v-model="projectDeclareInfo.m00098"
              @change="changeAddress"
            >
            </ComponentSelectPermanentAddress>
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

import { getIsDev, getDate } from '@/utils/get'
import { checkIDCard, checkPhoneNumber } from '@/utils/check'
import { getCodeListByCodeName } from '@/utils/custom-api'
import { showModal } from '@/utils/uni-api'
export default {
  name: 'pageDeclare20003',
  data() {
    return {
      // 基本信息 渲染配置
      renderObj: {
        idCard: true, // 身份证
        userName: true, // 姓名
        tel: true, // 联系电话
        permanentAddress: true, // 户籍地址
        nation: true, // 民族
      },
      today: getDate(),
      // 自定义添加一些属性 防止双向绑定失败 例如 picker组件之类
      projectDeclareInfo: {
        m00161: '', // 逝者性别
        m00060: '', // 死亡时间
        m00097: '', // 申报年度
        m00081: '', // 申请日期
        m00150: '', // 火化日期
        m00098: '', // 逝者户籍地址
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
    changeAddress(value) {
      this.projectDeclareInfo.chb015 = value[0].orgid
      this.projectDeclareInfo.chb017 = value[1].orgid
      this.projectDeclareInfo.chb018 = value[2].orgid
    },
    // 获取该申报项目的所需要的码表数据
    // aaz502、aac011、dac009、aac004、aac005、aae008、yesorno 不用再次获取
    // 编写格式参考达州20033项目
    async getCodeTableCacheData() {},
    // 检测数据输入格式是否正确 须根据项目需求更改
    handleCheckInput() {
      const {
        m00059, // 逝者姓名
        m00058, // 逝者身份证号
        m00161, // 逝者性别
        m00060, // 死亡时间
        // m00097, // 申报年度
        // m00081, // 申请日期
        m00150, // 火化日期
        m00098, // 逝者户籍地址
      } = this.projectDeclareInfo

      if (!m00059) {
        showModal('请输入逝者姓名')
        return false
      }
      if (!m00058) {
        showModal('请输入逝者身份证号')
        return false
      } else {
        const checkResult = checkIDCard(m00058, '逝者身份证号')
        if (checkResult.status === '0') {
          showModal(checkResult.msg)
          return false
        }
      }
      if (!m00161) {
        showModal('请选择逝者性别')
        return false
      }
      if (!m00060) {
        showModal('请选择死亡时间')
        return false
      }
      // if (!m00097) {
      //   showModal('请选择申报年度')
      //   return false
      // }
      // if (!m00081) {
      //   showModal('请选择申请日期')
      //   return false
      // }
      if (!m00098) {
        showModal('请选择逝者户籍地址')
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
        nation, // 民族
      } = this.basicInfo

      const {
        m00059, // 逝者姓名
        m00058, // 逝者身份证号
        m00161, // 逝者性别
        m00060, // 死亡时间
        // m00097, // 申报年度
        // m00081, // 申请日期
        m00150, // 火化日期
        m00098, // 逝者户籍地址
        chb015,
        chb017,
        chb018,
      } = this.projectDeclareInfo

      // 扩展字段
      const hb00BizMap = {
        aac005: nation, // 民族
        aae006: permanentAddress, // 户籍地址
        m00059, // 逝者姓名
        m00058, // 逝者身份证号
        m00161, // 逝者性别
        m00060, // 死亡时间
        // m00097, // 申报年度
        // m00081, // 申请日期
        m00150, // 火化日期
        m00098, // 逝者户籍地址
        chb015,
        chb017,
        chb018,
      }

      this.handleDeclareData(hb00BizMap, '0')
    },
  },
  computed: {},
  watch: {},
}
</script>

<style lang="scss" scoped>
.noquire /deep/ .ez-declare-picker-wrapper .label.data-v-2c56183c::before {
  content: '';
}
</style>
