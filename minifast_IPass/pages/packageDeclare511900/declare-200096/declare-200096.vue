<!-- 市级残疾人困难救助补贴（残联） -->
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
        :renderData="personnelList"
        :isOpenCategoryNotes="true"
        @change="handleChangePersonnelInfo"
      ></ComponentDeclarePersonnel>
    </div>

    <div class="space-top-wrapper">
      <ComponentPanel title="申报信息">
        <div class="panel-content">
          <div class="cell-items">
            <ComponentDeclarePicker
              label="残疾类型"
              idName="chb0h1"
              :range="codeMap.chb0h1"
              placeholder="请选择残疾类型"
              v-model="projectDeclareInfo.chb0h1"
              @change="getPickerValueDesc"
            ></ComponentDeclarePicker>
            <ComponentDeclarePicker
              label="残疾等级"
              idName="chb0h2"
              :range="codeMap.chb0h2"
              placeholder="请选择残疾等级"
              v-model="projectDeclareInfo.chb0h2"
              @change="getPickerValueDesc"
            ></ComponentDeclarePicker>
            <div class="cell-item">
              <div class="key">残疾证号</div>
              <div class="value">
                <input
                  type="text"
                  maxlength="20"
                  v-model="projectDeclareInfo.c03601"
                  placeholder="请输入残疾证号"
                />
              </div>
            </div>
            <div class="cell-item required">
              <div class="key">申报类别</div>
              <div class="value">
                <input
                  type="text"
                  maxlength="20"
                  v-model="projectDeclareInfo.c00336"
                  placeholder="请输入申报类别"
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

import { getIsDev } from '@/utils/get'
import { checkIDCard, checkPhoneNumber } from '@/utils/check'
import { getCodeListByCodeName } from '@/utils/custom-api'
import { navigateBack, showModal } from '@/utils/uni-api'
export default {
  name: 'pageDeclare20457',
  data() {
    return {
      // 基本信息 渲染配置
      renderObj: {
        idCard: true, // 身份证
        userName: true, // 姓名
        tel: true, // 联系电话
        nation: true, //民族
        currentAddress: true, // 现居住地址
        permanentAddress: true, // 户籍地址
      },
      // 自定义添加一些属性 防止双向绑定失败 例如 picker组件之类
      projectDeclareInfo: {
        chb0h1: '',
        chb0h2: '',
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
      const isDev = getIsDev //当前环境是否是开发环境
      let chb0h1 = [] // 残疾类型
      let chb0h2 = [] // 残疾等级
      try {
        chb0h1 = await getCodeListByCodeName('chb0h1')
      } catch (err) {
        if (isDev) {
          console.log('code table chb0h1 error', err)
        }
      }
      try {
        chb0h2 = await getCodeListByCodeName('chb0h2')
      } catch (err) {
        if (isDev) {
          console.log('code table chb0h2 error', err)
        }
      }
      this.codeMap = {
        ...this.codeMap,
        chb0h1,
        chb0h2,
      }
    },

    // 检测数据输入格式是否正确 须根据项目需求更改
    handleCheckInput() {
      const {
        chb0h1, // 残疾人类别
        chb0h2, // 残疾等级
        c03601, // 残疾证号
        c00336, // 申报类别
      } = this.projectDeclareInfo
      if (!chb0h1) {
        showModal('请选择残疾类型')
        return false
      }
      if (!chb0h2) {
        showModal('请选择残疾等级')
        return false
      }
      if (!c03601) {
        showModal('请输入残疾证号')
        return false
      }
      if (!c00336) {
        showModal('请输入申报类别')
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
        currentAddress, // 现居住地址
        nation, //民族
        permanentAddress, // 户籍地址
      } = this.basicInfo

      const {
        chb0h1, // 残疾人类别
        chb0h2, // 残疾等级
        c03601, // 残疾证号
        c00336, // 申报类别
      } = this.projectDeclareInfo

      // 扩展字段
      const hb00BizMap = {
        chb0h1, // 残疾人类别
        chb0h2, // 残疾等级
        c03601, // 残疾证号
        c00336, // 申报类别
        c00015: currentAddress, // 现居住地址
        aae006: permanentAddress, //户籍地址
        aac005: nation, // 民族
      }
      this.handleDeclareData(hb00BizMap, '0')
    },
  },
  computed: {},
  watch: {},
}
</script>

<style lang="scss" scoped></style>
