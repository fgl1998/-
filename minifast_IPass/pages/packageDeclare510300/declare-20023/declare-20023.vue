<!-- 县级贫困残疾人大学生及特困残疾人子女大学生助学金 残联 -->
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
        addressRemove="102419"
        @changeDeclareType="handleChangeDeclareType"
        @changeBasicInfo="handleChangeBasicInfo"
        @changeCodeMap="handleChangeCodeMap"
        @changeAgentInfo="handleChangeAgentInfo"
        @changeDataByIdCard="seDataByIdCard"
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
              <div class="key">二代残疾证号</div>
              <div class="value">
                <input
                  type="number"
                  maxlength="20"
                  v-model="projectDeclareInfo.c03601"
                  placeholder="请输入二代残疾证号"
                />
              </div>
            </div>

            <ComponentDeclarePicker
              label="残疾人类别"
              idName="chb0h1"
              :range="codeMap.chb0h1"
              placeholder="请选择残疾人类别"
              v-model="projectDeclareInfo.chb0h1"
            ></ComponentDeclarePicker>

            <div class="cell-item required">
              <div class="key">学制</div>
              <div class="value">
                <input
                  type="text"
                  v-model="projectDeclareInfo.c00201"
                  placeholder="请输入学制"
                />
              </div>
            </div>

            <div class="cell-item">
              <div class="key">年级</div>
              <div class="value">
                <input
                  type="text"
                  v-model="projectDeclareInfo.c00144"
                  placeholder="请输入年级"
                />
              </div>
            </div>

            <ComponentDeclarePicker
              label="入学时间"
              idName="c00103"
              placeholder="请选择入学时间"
              mode="date"
              fields="day"
              :endTime="today"
              v-model="projectDeclareInfo.c00103"
            ></ComponentDeclarePicker>

            <ComponentDeclarePicker
              label="学校类别"
              idName="c00143"
              :range="codeMap.c00143"
              placeholder="请选择学校类别"
              v-model="projectDeclareInfo.c00143"
            ></ComponentDeclarePicker>

            <ComponentDeclarePicker
              label="是否全日制"
              idName="c00321"
              :range="codeMap.yesorno"
              placeholder="请选择是否全日制"
              v-model="projectDeclareInfo.c00321"
            ></ComponentDeclarePicker>

            <div
              class="cell-item required"
              v-if="personnelInfo.cac102 == '1109'"
            >
              <div class="key">父亲(母亲)姓名</div>
              <div class="value">
                <input
                  type="text"
                  v-model="projectDeclareInfo.c00006"
                  placeholder="请输入父亲(母亲)姓名"
                />
              </div>
            </div>

            <div
              class="cell-item required"
              v-if="personnelInfo.cac102 == '1109'"
            >
              <div class="key">父（母）残疾证号</div>
              <div class="value">
                <input
                  type="number"
                  maxlength="20"
                  v-model="projectDeclareInfo.c00292"
                  placeholder="请输入父（母）残疾证号"
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

import { getIsDev, getDate } from '@/utils/get'
import { getCodeListByCodeName } from '@/utils/custom-api'
import { showModal } from '@/utils/uni-api'

export default {
  name: 'pageDeclare20023',
  data() {
    return {
      // 基本信息 渲染配置
      renderObj: {
        idCard: true, // 身份证
        userName: true, // 姓名
        gender: true, // 性别
        nation: true, //民族
        tel: true, // 联系电话
        age: true, //年龄
        permanentAddress: true, // 户籍地址
        currentAddress: true, // 现居住地址
      },
      today: getDate(),
      projectDeclareInfo: {
        c00337: '', // 假肢类别
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
    // 获取该申报项目的所需要的码表数据
    // aaz502、aac011、dac009、aac004、aac005、aae008、yesorno 不用再次获取
    // 编写格式参考达州20033项目
    async getCodeTableCacheData() {
      const isDev = getIsDev() // 当前环境是否是开发环境
      let c00143 = [] //学校类别
      let chb0h1 = [] //残疾类别

      try {
        c00143 = await getCodeListByCodeName('c00143')
      } catch (err) {
        if (isDev) {
          console.log('code table c00143 error：', err)
        }
      }

      try {
        chb0h1 = await getCodeListByCodeName('chb0h1')
      } catch (err) {
        if (isDev) {
          console.log('code table chb0h1 error：', err)
        }
      }

      this.codeMap = {
        ...this.codeMap,
        c00143,
        chb0h1,
      }
    },

    // 检测数据输入格式是否正确 须根据项目需求更改
    handleCheckInput() {
      const {
        aac004, //性别
        chb00l, //年龄
        aac005, //民族
        aae006, //户籍地址/详细地址
        c00015, //现居住地址

        c03601, //二代残疾证号
        chb0h1, //残疾人类别
        c00201, //学制
        c00144, //年级
        c00103, //入学时间
        c00143, //学校类别
        c00321, //是否全日制
        c00006, //父亲(母亲)姓名
        c00292, //父（母）残疾证号
      } = this.projectDeclareInfo

      let { cac102 } = this.personnelInfo

      if (!c03601) {
        showModal('请输入二代残疾证号')
        return false
      }
      if (!chb0h1) {
        showModal('请选择残疾人类别')
        return false
      }
      if (!c00201) {
        showModal('请选择学制')
        return false
      }
      if (!c00144) {
        showModal('请输入年级')
        return false
      }
      if (!c00103) {
        showModal('请选择入学时间')
        return false
      }
      if (!c00143) {
        showModal('请选择学校类别')
        return false
      }
      if (!c00321) {
        showModal('请选择是否全日制')
        return false
      }
      if (!c00006 && cac102 == '1109') {
        showModal('请输入父亲(母亲)姓名')
        return false
      }
      if (!c03601 && cac102 == '1109') {
        showModal('请输入父（母）残疾证号')
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
        nation, //民族
        age, //年龄
        permanentAddress, // 户籍地址
        currentAddress, // 现居住地址
      } = this.basicInfo

      const {
        c03601, //二代残疾证号
        chb0h1, //残疾人类别
        c00201, //学制
        c00144, //年级
        c00103, //入学时间
        c00143, //学校类别
        c00321, //是否全日制
        c00006, //父亲(母亲)姓名
        c00292, //父（母）残疾证号
      } = this.projectDeclareInfo

      // 扩展字段
      const hb00BizMap = {
        aac004: gender, //性别
        chb00l: age, //年龄
        aac005: nation, //民族
        aae006: permanentAddress, //户籍地址/详细地址
        c00015: currentAddress, //现居住地址

        c03601, //二代残疾证号
        chb0h1, //残疾人类别
        c00201, //学制
        c00144, //年级
        c00103, //入学时间
        c00143, //学校类别
        c00321, //是否全日制
        c00006, //父亲(母亲)姓名
        c00292, //父（母）残疾证号
      }

      this.handleDeclareData(hb00BizMap, '0')
    },
  },
  computed: {},
  watch: {},
}
</script>

<style lang="scss" scoped></style>
