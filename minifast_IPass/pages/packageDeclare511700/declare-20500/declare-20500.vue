<!-- 职业技能培训贫困学员交通生活补贴（就业科培训局） -->
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
        isOpenOCR
        :projectNumber="chi031"
        :projectName="chi031_desc"
        addressFilter="1569457,1569460,1569463,1569466,1569472,1569475,1569469,1569481,2095930"
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
            <div class="cell-item required">
              <div class="key">培训天数</div>
              <div class="value">
                <input
                  type="number"
                  maxlength="1"
                  v-model="projectDeclareInfo.aj0014"
                  placeholder="请输入培训天数"
                />
              </div>
            </div>
            <ComponentDeclarePicker
              label="培训机构名称"
              idName="aj0010"
              :range="codeMap.aj0010"
              placeholder="请选择培训机构名称"
              v-model="projectDeclareInfo.aj0010"
              @change="getPickerValueDesc"
            >
            </ComponentDeclarePicker>
            <ComponentDeclarePicker
              label="培训技能类别"
              idName="aj0011"
              :range="codeMap.aj0011"
              placeholder="请选择培训技能类别"
              v-model="projectDeclareInfo.aj0011"
              @change="getPickerValueDesc"
            >
            </ComponentDeclarePicker>
            <ComponentDeclarePicker
              label="培训技能名称"
              idName="aj0015"
              :range="codeMap.aj0015"
              placeholder="请选择培训技能名称"
              v-model="projectDeclareInfo.aj0015"
              @change="getPickerValueDesc"
            >
            </ComponentDeclarePicker>
            <ComponentDeclarePicker
              label="培训期"
              idName="aj0037"
              placeholder="请选择培训期"
              :range="pxq"
              v-model="projectDeclareInfo.aj0037"
            ></ComponentDeclarePicker>
            <ComponentDeclarePicker
              label="培训开始时间"
              idName="aj0008"
              placeholder="请选择培训开始时间"
              mode="date"
              fields="day"
              :startTime="start_time"
              :endTime="today"
              v-model="projectDeclareInfo.aj0008"
            ></ComponentDeclarePicker>
            <ComponentDeclarePicker
              label="获取资格证时间"
              idName="aj0008"
              placeholder="请选择获取资格证时间"
              mode="date"
              fields="day"
              :startTime="start_time"
              :endTime="today"
              v-model="projectDeclareInfo.aj0009"
            ></ComponentDeclarePicker>

            <div class="cell-item required">
              <div class="key">补贴金额</div>
              <div class="value">{{ 50 * projectDeclareInfo.aj0014 }}</div>
            </div>
            <div class="cell-item required">
              <div class="key">培训期号</div>
              <div class="value">
                {{ getpxqh || '暂无' || projectDeclareInfo.aj0012 }}
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
import ComponentDeclarePersonnel from '@/components/project/ez-declare-personnel/ez-declare-personnel.vue'
import ComponentDeclarePicker from '@/components/project/ez-declare-picker/ez-declare-picker.vue'

import { useDeclare } from '@/mixins'

import { getDate, getIsDev } from '@/utils/get'
import { getCodeListByCodeName } from '@/utils/custom-api'
import { showModal } from '@/utils/uni-api'

export default {
  name: 'pageDeclare20500',
  data() {
    return {
      today: getDate(),
      start_time: '',
      renderObj: {
        idCard: true, // 身份证
        userName: true, // 姓名
        tel: true, // 联系电话
        permanentAddress: true, // 户籍地址
      },
      projectDeclareInfo: {
        aj0008: '', // 培训开始时间
        aj0009: '', // 获取资格证时间
        aj0010: '', // 培训机构名称
        aj0011: '', // 培训技能类型
        aj0037: '', // 培训期
        aj0013: '', // 补贴金额
        aj0014: '', // 培训天数
        aj0015: '', // 培训技能名称
      },
      pxq: [
        {
          id: 1,
          aaa102: '01',
          aaa103: '01',
        },
        {
          id: 2,
          aaa102: '02',
          aaa103: '02',
        },

        {
          id: 3,
          aaa102: '03',
          aaa103: '03',
        },
        {
          id: 4,
          aaa102: '04',
          aaa103: '04',
        },
        {
          id: 5,
          aaa102: '05',
          aaa103: '05',
        },
        {
          id: 6,
          aaa102: '06',
          aaa103: '06',
        },
        {
          id: 7,
          aaa102: '07',
          aaa103: '07',
        },
        {
          id: 8,
          aaa102: '08',
          aaa103: '08',
        },
        {
          id: 9,
          aaa102: '09',
          aaa103: '09',
        },
        {
          id: 10,
          aaa102: '10',
          aaa103: '10',
        },
      ],
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
  onReady() {
    const today = getDate()
    let temArr = today.split('-')
    let y = Number(temArr[0]) - 2
    temArr[0] = y
    this.start_time = temArr.join('-')
  },
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
      let aj0010 = [] // 培训机构名称
      let aj0011 = [] // 技能类别
      let aj0015 = [] // 技能名称

      try {
        aj0010 = await getCodeListByCodeName('aj0010')
        aj0011 = await getCodeListByCodeName('aj0011')
        aj0015 = await getCodeListByCodeName('aj0015')
      } catch (err) {
        if (isDev) {
          console.log('code table aj0010｜aj0011｜aj0015 error：', err)
        }
      }
      this.codeMap = {
        ...this.codeMap,
        aj0010,
        aj0011,
        aj0015,
      }
    },
    // 检测数据输入格式是否正确 须根据项目需求修改
    handleCheckInput() {
      const {
        aj0008, // 培训开始时间
        aj0009, // 获取资格证时间
        aj0010, // 培训机构名称
        aj0011, // 培训技能类型
        aj0037, // 培训期

        aj0014, // 培训天数
        aj0015, // 培训技能名称
      } = this.projectDeclareInfo

      if (!aj0014) {
        showModal('请输入培训天数，且不能为0')
        return false
      } else {
        if (aj0014 > 3) {
          showModal('培训天数最多3天，请重新输入')
          return false
        }
      }
      if (!aj0010) {
        showModal('请选择培训机构名称')
        return false
      }
      if (!aj0011) {
        showModal('请选择培训技能类别')
        return false
      }
      if (!aj0015) {
        showModal('请选择培训技能名称')
        return false
      }
      if (!aj0037) {
        showModal('请选择培训期')
        return false
      }

      if (!aj0008) {
        showModal('请选择培训开始时间')
        return false
      }
      if (!aj0009) {
        showModal('请选择获取资格证时间')
        return false
      }

      const today = getDate()
      const m1 =
        parseInt(today.split('-')[1].replace(/^0+/, '')) +
        parseInt(today.split('-')[0]) * 12
      const m2 =
        parseInt(aj0009.split('-')[1].replace(/^0+/, '')) +
        parseInt(aj0009.split('-')[0]) * 12
      const diff = m1 - m2
      if (diff < 6 || diff > 12) {
        showModal('取得资格证时间必须在6-12个月时间范围内才能进行申报')
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
        permanentAddress, //户籍地址
      } = this.basicInfo

      const {
        aj0008, // 培训开始时间
        aj0009, // 获取资格证时间
        aj0010, // 培训机构名称
        aj0011, // 培训技能类型
        aj0037, // 培训期
        aj0013, // 补贴金额
        aj0014, // 培训天数
        aj0015, // 培训技能名称
        aj0012, // 培训期号
      } = this.projectDeclareInfo
      // 扩展字段

      //自主申报

      const hb00BizMap = {
        aae006: permanentAddress, // 户籍地址
        aj0008, // 培训开始时间
        aj0009, // 获取资格证时间
        aj0010, // 培训机构名称
        aj0011, // 培训技能类型
        aj0037, // 培训期
        aj0012: this.getpxqh, // 培训期号
        aj0013, // 补贴金额
        aj0014, // 培训天数
        aj0015, // 培训技能名称
      }
      this.handleDeclareData(hb00BizMap, '0')
    },
  },

  computed: {
    getpxqh() {
      let pxqh = ''
      var currentdate = getDate('month').split('-').join('')
      const { aj0010, aj0037, aj0008 } = this.projectDeclareInfo
      var sj = aj0008.split('-').join('').slice(0, 6)
      const { district } = this.basicInfo
      if (district && currentdate && aj0037 && aj0010) {
        pxqh = district + sj + aj0010 + aj0037
      }
      return pxqh
    },
  },
}
</script>

<style lang="scss" scoped>
</style>
