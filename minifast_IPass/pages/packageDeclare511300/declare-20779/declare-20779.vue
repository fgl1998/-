<!-- 农村公益性岗位补贴资金 人社局 -->
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
            <ComponentSelectPermanentAddress
              label="就业所在村"
              placeholder="就业所在村"
              @change="handleChangePermanentAddressjy"
              v-model="projectDeclareInfo.r00038"
            >
            </ComponentSelectPermanentAddress>
            <ComponentDeclarePicker
              label="合同开始日期"
              idName="r00051"
              mode="date"
              fields="day"
              :startTime="
                projectDeclareInfo.r00052
                  ? projectDeclareInfo.r00052.replace(
                      parseInt(projectDeclareInfo.r00052.slice(0, 4)),
                      parseInt(projectDeclareInfo.r00052.slice(0, 4)) - 1
                    )
                  : ''
              "
              :endTime="new Date().getTime()"
              placeholder="请选择您的合同开始日期"
              v-model="projectDeclareInfo.r00051"
            ></ComponentDeclarePicker>
            <ComponentDeclarePicker
              v-if="projectDeclareInfo.r00051"
              label="合同结束日期"
              idName="r00052"
              mode="date"
              fields="day"
              :startTime="
                projectDeclareInfo.r00051 ? projectDeclareInfo.r00051 : ''
              "
              :endTime="
                projectDeclareInfo.r00051
                  ? projectDeclareInfo.r00051.replace(
                      parseInt(projectDeclareInfo.r00051.slice(0, 4)),
                      parseInt(projectDeclareInfo.r00051.slice(0, 4)) + 1
                    )
                  : ''
              "
              placeholder="请选择您的合同结束日期"
              v-model="projectDeclareInfo.r00052"
            ></ComponentDeclarePicker>
            <ComponentDeclarePicker
              label="岗位类别"
              idName="r00057"
              :range="codeMap.r00057"
              placeholder="请选择岗位类别"
              v-model="projectDeclareInfo.r00057"
            ></ComponentDeclarePicker>
            <ComponentDeclareRadio
              label="劳动能力"
              type="radio"
              :range="R00058RenderData"
              valueKey="value"
              renderKey="name"
              value="普通"
              @input="changeRadioR00058"
            ></ComponentDeclareRadio>
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

import { getIsDev } from '@/utils/get'
import { checkIDCard, checkPhoneNumber } from '@/utils/check'
import { getCodeListByCodeName } from '@/utils/custom-api'
import { showModal } from '@/utils/uni-api'

export default {
  name: 'pageDeclare20779',

  data() {
    return {
      renderObj: {
        idCard: true, // 身份证
        userName: true, // 姓名
        age: true, // 年龄
        tel: true, // 联系电话
        gender: true,
        permanentAddress: true, // 户籍地址
      },

      projectDeclareInfo: {
        chbaac: '',
        aae006: '',
        r00038: '',
        r00051: '',
        r00052: '',
      },
      // 劳动能力
      R00058RenderData: [
        {
          id: '01',
          value: '01',
          name: '普通',
          disabled: false,
          checked: false,
        },
        {
          id: '02',
          value: '02',
          name: '弱',
          disabled: false,
          checked: false,
        },
      ],
      // 岗位类别码值
      R00057RenderData: [
        {
          id: '01',
          value: '01',
          name: '公共卫生服务',
        },
        {
          id: '02',
          value: '02',
          name: '托老托幼',
        },
        {
          id: '03',
          value: '03',
          name: '残疾人看护',
        },
        {
          id: '04',
          value: '04',
          name: '停车管理',
        },
        {
          id: '05',
          value: '05',
          name: '设施维护',
        },
        {
          id: '06',
          value: '06',
          name: '保洁',
        },
        {
          id: '07',
          value: '07',
          name: '保安',
        },
        {
          id: '08',
          value: '08',
          name: '其他',
        },
      ],
      R00057PickeredIndex: 0,
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
  // 监听页面显示
  onShow() {},
  // 监听页面隐藏
  onHide() {},
  computed: {
    difference() {
      let _this = this
      let { r00051, r00052 } = this.projectDeclareInfo
      if (r00051) {
        let dateBegin = new Date(r00051.replace(/-/g, '/')).getTime() //将-转化为/，使用new Date
        let dateEnd = new Date().getTime() //获取结束时间
        if (dateBegin > dateEnd) {
          showModal('起始时间不能超过当前', '提示', false).then((res) => {
            _this.projectDeclareInfo = {
              ..._this.projectDeclareInfo,
              r00051: '',
            }
          })
          return false
        }
      }
      if (r00051 && r00052) {
        let timeNum = parseInt(r00051.slice(0, 4))
        let maxDate = r00051.replace(timeNum, timeNum + 1)
        maxDate = new Date(maxDate.replace(/-/g, '/')).getTime() //将-转化为/，使用new Date
        let dateBegin = new Date(r00051.replace(/-/g, '/')).getTime() //将-转化为/，使用new Date
        let dateEnd = new Date(r00052.replace(/-/g, '/')).getTime() //获取结束时间
        if (dateEnd > maxDate) {
          showModal('合同期限超过一年', '提示', false).then((res) => {
            _this.projectDeclareInfo = {
              ..._this.projectDeclareInfo,
              r00051: '',
              r00052: '',
            }
          })
          return false
        } else if (dateBegin > dateEnd) {
          showModal('起始日期大于结束日期', '提示', false).then((res) => {
            _this.projectDeclareInfo = {
              ..._this.projectDeclareInfo,
              r00051: '',
              r00052: '',
            }
          })
          return false
        } else {
          return true
        }
      } else {
        return true
      }
    },
  },
  methods: {
    async getCodeTableCacheData() {
      const isDev = getIsDev() // 当前环境是否是开发环境
      let r00057 = [] // 申请人当前学历

      try {
        r00057 = await getCodeListByCodeName('r00057')
      } catch (err) {
        if (isDev) {
          console.log('code table r00057 error：', err)
        }
      }

      this.codeMap = {
        ...this.codeMap,
        r00057,
      }
    },
    // 检测数据输入格式是否正确 须根据项目需求更改
    handleCheckInput() {
      const {
        r00038, //就业所在村
        r00052, //合同或协议结束日期
        // r00053, //申报季度
        r00051, //合同或协议开始日期
        r00057, //岗位类别
        r00058, //劳动能力
      } = this.projectDeclareInfo
      // if (!r00053) {
      //   showModal('请选择申报季度', '提示', false)
      //   return false
      // }
      if (!r00038) {
        showModal('请输入您的就业村', '提示', false)
        return false
      }
      if (!r00051) {
        showModal('请输入您的合同或协议开始日期', '提示', false)
        return false
      }
      if (!r00052) {
        showModal('请选择您的合同或协议结束日期', '提示', false)
        return false
      }
      if (!r00057) {
        showModal('请选择您的岗位类别', '提示', false)
        return false
      }
      if (!r00058) {
        showModal('请选择劳动能力', '提示', false)
        return false
      }
      return true
    },
    // 就业地址改变
    handleChangePermanentAddressjy(value) {
      const chb015 = value[0].orgid
      const chb017 = value[1].orgid
      const chb018 = value[2].orgid
      this.userObj = {
        ...this.userObj,
        chb015,
        chb017,
        chb018,
      }
      let chb00e = 0
      if (chb015 == '511302' || chb015 == '511324') {
        chb00e = 500
      }
      if (
        chb015 == '511303' ||
        chb015 == '511304' ||
        chb015 == '511381' ||
        chb015 == '511321'
      ) {
        chb00e = 400
      }
      if (chb015 == '511325' || chb015 == '511323') {
        chb00e = 300
      }
      if (chb015 == '511322') {
        chb00e = 450
      }
      const r00038 = value.map((item) => item.orgname)
      this.projectDeclareInfo = {
        ...this.projectDeclareInfo,
        chb015,
        chb017,
        chb018,
        chb00e: chb00e,
        r00038: r00038.join('-'),
      }
    },
    // 选择岗位类别
    hadleR00057picker(e) {
      const { value } = e.target
      const item = this.R00057RenderData[value]

      this.projectDeclareInfo = {
        ...this.projectDeclareInfo,
        r00057: item.value,
        r00057_desc: item.name,
      }
    },
    // 选择劳动能力
    changeRadioR00058(value) {
      const data = this.R00058RenderData
      // data.map((item) => {
      //   item.checked = false
      //   if (item.value === value) {
      //     item.checked = true
      //   }
      // })
      this.projectDeclareInfo = {
        ...this.projectDeclareInfo,
        r00058: value,
      }
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
        idCard,
        userName,
        tel,
        age,
        gender,
        district,
        township,
        village,
        permanentAddress,
      } = this.basicInfo

      const {
        aac002,
        aac003,
        aae005,
        aac004,
        aae006,
        chb015,
        chb017,
        chb018,
        chb00e,
        r00034,
      } = this.projectDeclareInfo

      const {
        r00038, //就业所在村
        r00052, //合同或协议结束日期
        // r00053, //申报季度
        r00051, //合同或协议开始日期
        r00057, //岗位类别
        r00058, // 劳动能力
      } = this.projectDeclareInfo

      // 扩展字段
      let hb00BizMap = {
        r00038, //就业所在村
        r00052, //合同或协议结束日期
        // r00053, //申报季度
        chb00e,
        r00051, //合同或协议开始日期
        r00057, //岗位类别
        r00058, // 劳动能力
        aae209: r00051.substring(0, 7).replace('-', ''), // 享受补贴开始时间
      }
      hb00BizMap = {
        ...hb00BizMap,
        aac004: gender,
        aac002: idCard,
        aac003: userName,
        aae005: tel,
        aae006: permanentAddress,
        chb015: chb015,
        chb017: chb017,
        chb018: chb018,
        r00034: age,
      }
      this.handleDeclareData(hb00BizMap, '0')
    },
  },
  watch: {},
}
</script>

<style lang="scss" scoped>
.declare-info-wrapper {
  margin-top: 30rpx;
}
</style>
