<!-- 事实无人抚养儿童基本生活补贴 民政局 -->
<template>
  <view class="declare">
    <!-- 当前申报流程 -->
    <div class="progress-wrapper">
      <ComponentDeclareStep :current="2"></ComponentDeclareStep>
    </div>

    <!-- 申报人或者代办人基本信息 -->
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

    <!-- start 需要修改的地方开始 在以下代码中根据项目需求更改 上面代码勿动 -->
    <!-- 申报信息 -->
    <div class="space-top-wrapper">
      <ComponentPanel title="申报信息">
        <div class="panel-content">
          <div class="cell-items">
            <ComponentDeclarePicker
              label="父母状态"
              idName="m00027"
              :range="codeMap.m00027"
              placeholder="请选择父母状态"
              v-model="projectDeclareInfo.m00027"
            >
            </ComponentDeclarePicker>

            <ComponentDeclarePicker
              label="儿童身体状况"
              idName="m00092"
              :range="codeMap.m00092"
              placeholder="请选择儿童身体状况"
              v-model="projectDeclareInfo.m00092"
            >
            </ComponentDeclarePicker>

            <ComponentDeclarePicker
              label="儿童学工状况"
              idName="m00093"
              :range="codeMap.m00093"
              placeholder="请选择儿童学工状况"
              v-model="projectDeclareInfo.m00093"
            >
            </ComponentDeclarePicker>

            <div class="cell-item required">
              <div class="key">低保金</div>
              <div class="value">
                <input
                  type="digit"
                  maxlength="10"
                  v-model="projectDeclareInfo.m00127"
                  placeholder="请输入低保金"
                />
              </div>
            </div>

            <div class="cell-item required">
              <div class="key">特困人员救助供养金额</div>
              <div class="value">
                <input
                  type="digit"
                  maxlength="10"
                  v-model="projectDeclareInfo.m48403"
                  placeholder="请输入"
                />
              </div>
            </div>

            <div class="cell-item required">
              <div class="key">困难残疾人生活补贴金额</div>
              <div class="value">
                <input
                  type="digit"
                  maxlength="10"
                  v-model="projectDeclareInfo.m48404"
                  placeholder="请输入"
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
import ComponentDeclarePersonnel from '@/components/project/ez-declare-personnel/ez-declare-personnel.vue'
import ComponentDeclarePicker from '@/components/project/ez-declare-picker/ez-declare-picker.vue'

import { useDeclare } from '@/mixins'
import { useGetCurrentDate } from '@/hooks/common'
import { getCodeListByCodeName } from '@/utils/custom-api'
import { showModal } from '@/utils/uni-api'
export default {
  name: 'pageDeclare20447',
  data() {
    return {
      // 基本信息 渲染配置
      renderObj: {
        idCard: true, // 身份证
        userName: true, // 姓名
        tel: true, // 联系电话
        gender: true, // 性别
        birthday: true, //出生日期
        nation: true, //民族
        permanentAddress: true, // 户籍地址
        currentAddress: true, //现居地址
      },
      projectDeclareInfo: {},
      today_d: useGetCurrentDate(),
      today_y: useGetCurrentDate('year', ''),
    }
  },
  components: {
    ComponentButton,
    ComponentPanel,
    ComponentDeclare,
    ComponentDeclareStep,
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
      let m00027 = [] // 父母状态
      let m00092 = [] // 儿童身体状况
      let m00093 = [] // 儿童学工状态

      try {
        m00027 = await getCodeListByCodeName('m00027')
      } catch (err) {
        console.error('code table m00027 error：', err)
      }

      try {
        m00092 = await getCodeListByCodeName('m00092')
      } catch (err) {
        console.error('code table m00092 error：', err)
      }

      try {
        m00093 = await getCodeListByCodeName('m00093')
      } catch (err) {
        console.error('code table m00093 error：', err)
      }

      this.codeMap = {
        ...this.codeMap,
        m00027,
        m00092,
        m00093,
      }
    },
    // 检测数据输入格式是否正确 须根据项目需求更改
    handleCheckInput() {
      const {
        aac004, //性别
        m00079, //出生日期
        aac005, //民族
        chb0a9, //户籍地址
        chb0a3, //现居住地址

        m00027, //父母状态
        m00092, //儿童身体状况
        m00093, //儿童学工状况
        m00127, //低保金
        m48403, //特困人员救助供养金额
        m48404, //困难残疾人生活补贴金额
      } = this.projectDeclareInfo

      if (!m00027) {
        showModal('请选择父母状态')
        return false
      }
      if (!m00092) {
        showModal('请选择儿童身体状况')
        return false
      }
      if (!m00093) {
        showModal('请选择儿童学工状况')
        return false
      }
      if (!m00127) {
        showModal('请输入低保金')
        return false
      }
      if (!m48403) {
        showModal('请输入特困人员救助供养金额')
        return false
      }
      if (!m48404) {
        showModal('请输入困难残疾人生活补贴金额')
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
        gender, // 性别
        birthday, //出生日期
        nation, //民族
        permanentAddress, // 户籍地址
        currentAddress, //现居地址
      } = this.basicInfo

      const {
        m00027, //父母状态
        m00092, //儿童身体状况
        m00093, //儿童学工状况
        m00127, //低保金
        m48403, //特困人员救助供养金额
        m48404, //困难残疾人生活补贴金额
      } = this.projectDeclareInfo

      // 扩展字段
      const hb00BizMap = {
        aac004: gender, //性别
        m00079: birthday, //出生日期
        aac005: nation, //民族
        chb0a9: permanentAddress, //户籍地址
        chb0a3: currentAddress, //现居住地址

        m00027, //父母状态
        m00092, //儿童身体状况
        m00093, //儿童学工状况
        m00127, //低保金
        m48403, //特困人员救助供养金额
        m48404, //困难残疾人生活补贴金额
      }

      this.handleDeclareData(hb00BizMap, '0')
    },
  },
  computed: {},
  watch: {},
}
</script>

<style lang="scss" scoped></style>
