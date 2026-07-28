<!-- 困难毕业生求职创业补贴 -->
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
    <!-- 人员类别 -->
    <div class="space-top-wrapper">
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
              <div class="key">学校名称</div>
              <div class="value">
                <input
                  type="text"
                  v-model="projectDeclareInfo.aj0021"
                  placeholder="请输入学校名称"
                />
              </div>
            </div>
            <ComponentDeclarePicker
              label="毕业生类型"
              idName="aj0061"
              :range="codeMap.AJ0061"
              placeholder="请选择毕业生类型"
              v-model="projectDeclareInfo.aj0061"
            ></ComponentDeclarePicker>
            <ComponentDeclarePicker
              label="学历"
              idName="aj0024"
              :range="codeMap.AJ0024"
              placeholder="请选择学历"
              v-model="projectDeclareInfo.aj0024"
            ></ComponentDeclarePicker>
            <div class="cell-item required">
              <div class="key">学号</div>
              <div class="value">
                <input
                  type="text"
                  v-model="projectDeclareInfo.aj0062"
                  placeholder="请输入学号"
                />
              </div>
            </div>
            <div class="cell-item">
              <div class="key">联系电话</div>
              <div class="value">
                <input
                  type="number"
                  v-model="projectDeclareInfo.aae005"
                  placeholder="请输入联系电话"
                  @blur="handleCheckPhone"
                />
              </div>
            </div>
            <div class="cell-item required">
              <div class="key">补贴金额（元）</div>
              <div class="value">
                <input
                  type="number"
                  v-model="projectDeclareInfo.aae019"
                  placeholder="请输入补贴金额"
                />
              </div>
            </div>
            <div class="cell-item required">
              <div class="key">生源地</div>
              <div class="value">
                <input
                  type="text"
                  v-model="projectDeclareInfo.aj0063"
                  placeholder="请输入生源地"
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
  name: 'pageDeclare20733',
  data() {
    return {
      renderObj: {
        idCard: true, // 身份证
        userName: true, // 姓名
        permanentAddress: true, // 户籍地址
        currentAddress: true // 现居住地址
      },
      // 申报信息
      projectDeclareInfo: {
        aj0021: '', //学校名称
        aj0061: '', //毕业生类型
        aj0024: '', //学历
        aj0062: '', //学号
        aae005: '', //联系电话
        aae019: '', //补贴金额
        aj0063: '' //生源地
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
  // 监听页面初次渲染完成
  onReady() {},
  // 监听页面显示
  onShow() {},
  // 监听页面隐藏
  onHide() {},
  methods: {
    handleCheckPhone(e) {
      const { value } = e.target
      const { status, msg } = checkPhoneNumber(value)
      if (status == '0') {
        showModal(msg, '提示', false)
        this.projectDeclareInfo = {
          ...this.projectDeclareInfo,
          aae005: ''
        }
      }
    },
    // 获取该申报项目的所需要的码表数据
    // aaz502、aac011、dac009、aac004、aac005、aae008、yesorno 不用再次获取
    // 编写格式参考达州20033项目
    async getCodeTableCacheData() {
      const isDev = getIsDev() // 当前环境是否是开发环境
      let AJ0061 = [] // 毕业生类型
      let AJ0024 = [] // 学历
      try {
        AJ0061 = await getCodeListByCodeName('AJ0061_1')
      } catch (err) {
        if (isDev) {
          console.log('code table AJ0061_1 error：', err)
        }
      }
      try {
        AJ0024 = await getCodeListByCodeName('AJ0024_1')
      } catch (err) {
        if (isDev) {
          console.log('code table AJ0024_1 error：', err)
        }
      }
      this.codeMap = {
        ...this.codeMap,
        AJ0061,
        AJ0024
      }
    },
    // 检测数据输入格式是否正确 须根据项目需求修改
    handleCheckInput() {
      const {
        aj0021, //学校名称
        aj0061, //毕业生类型
        aj0024, //学历
        aj0062, //学号
        aae019, //补贴金额
        aj0063 //生源地
      } = this.projectDeclareInfo
      if (!aj0021) {
        showModal('请填写学校名称')
        return false
      }
      if (!aj0061) {
        showModal('请选择毕业生类型')
        return false
      }
      if (!aj0024) {
        showModal('请选择学历')
        return false
      }
      if (!aj0062) {
        showModal('请填写学号')
        return false
      }
      if (!aae019) {
        showModal('请填写补贴金额')
        return false
      }
      if (!aj0063) {
        showModal('请填写生源地')
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
      const { idCard, userName, permanentAddress, currentAddress } =
        this.basicInfo
      const {
        aj0021, //学校名称
        aj0061, //毕业生类型
        aj0024, //学历
        aj0062, //学号
        aae005, //联系电话
        aae019, //补贴金额
        aj0063 //生源地
      } = this.projectDeclareInfo

      // 扩展字段
      let hb00BizMap = {
        aac002: idCard, // 身份证号
        aac003: userName, // 姓名
        aae006: permanentAddress, // 户籍地址
        aj0021, //学校名称
        aj0061, //毕业生类型
        aj0024, //学历
        aj0062, //学号
        aae005, //联系电话
        aae019, //补贴金额
        aj0063, //生源地
        aj0016: currentAddress //现居地址
      }
      console.log('hb00BizMap===', hb00BizMap)
      this.handleDeclareData(hb00BizMap, '0')
    }
  },
  computed: {},
  watch: {}
}
</script>

<style lang="scss" scoped>
.declare-info-wrapper {
  margin-top: 30rpx;
}
</style>
