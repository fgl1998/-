<template>
  <!-- 灵活就业社会保险补贴（人社局） -->
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
            <div class="cell-item required">
              <div class="key">就业失业登记证编号</div>
              <div class="value">
                <input
                  type="number"
                  maxlength="16"
                  v-model="projectDeclareInfo.r00010"
                  placeholder="请输入就业失业登记证编号"
                  @blur="checkLoseWork"
                />
              </div>
            </div>
            <ComponentDeclarePicker
              label="灵活就业登记时间"
              mode="date"
              placeholder="请选择就业登记时间"
              v-model="projectDeclareInfo.r00036"
            ></ComponentDeclarePicker>
            <div class="cell-item required">
              <div class="key">灵活就业月数</div>
              <div class="value">
                <input
                  type="number"
                  maxlength="2"
                  v-model="projectDeclareInfo.r00060"
                  placeholder="请输入灵活就业月数"
                />
              </div>
            </div>

            <ComponentSelectAddressMultitype
              label="灵活就业地点"
              placeholder="请选择或输入灵活就业地点"
              @clickBtn="projectDeclareInfo.r00033 = basicInfo.permanentAddress"
              v-model="projectDeclareInfo.r00033"
            ></ComponentSelectAddressMultitype>

            <ComponentDeclarePicker
              label="灵活就业岗位类型"
              idName="r00039"
              :range="codeMap.r00057"
              placeholder="请选择岗位类型"
              v-model="projectDeclareInfo.r00039"
              @change="getPickerValueDesc"
            ></ComponentDeclarePicker>
            <div class="cell-item required">
              <div class="key">月收入(元)</div>
              <div class="value">
                <input
                  type="number"
                  maxlength="10"
                  v-model="projectDeclareInfo.r00037"
                  placeholder="请输入月收入"
                />
              </div>
            </div>
            <ComponentDeclarePicker
              label="申请补贴开始月"
              mode="date"
              fields="month"
              placeholder="请选择申请补贴开始月"
              v-model="projectDeclareInfo.r00019_start"
            ></ComponentDeclarePicker>
            <ComponentDeclarePicker
              label="申请补贴结束月"
              mode="date"
              fields="month"
              placeholder="请选择申请补贴结束月"
              v-model="projectDeclareInfo.r00019_end"
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
import ComponentSelectAddressMultitype from '@/components/project/ez-select-address-multitype/ez-select-address-multitype.vue'
import ComponentDeclarePersonnel from '@/components/project/ez-declare-personnel/ez-declare-personnel.vue'
import ComponentDeclarePicker from '@/components/project/ez-declare-picker/ez-declare-picker.vue'

import { useDeclare } from '@/mixins'

import { getIsDev } from '@/utils/get'
import { getCodeListByCodeName } from '@/utils/custom-api'
import { showModal } from '@/utils/uni-api'

export default {
  name: 'pageDeclare20073',

  data() {
    return {
      educationKey: 'r43701',
      renderObj: {
        idCard: true, // 身份证
        userName: true, // 姓名
        tel: true, // 联系电话
        age: true, // 年龄
        education: true, // 学历
        permanentAddress: true, // 户籍地址
        gender: true, //性别
      },

      projectDeclareInfo: {
        r00033: '',
        r00019_start: '',
        r00019_end: '',
        r00019: '',
        r00010: '',
      },
    }
  },
  components: {
    ComponentButton,
    ComponentPanel,
    ComponentDeclare,
    ComponentDeclareStep,
    ComponentSelectAddressMultitype,
    ComponentDeclarePersonnel,
    ComponentDeclarePicker,
  },
  mixins: [useDeclare],
  // 监听页面加载，其参数为上个页面传递的数据，参数类型为Object（用于页面传参）
  onLoad(e) {
    this.handleOnLoad(e)
    // 姓名、身份证号、联系方式、文化程度、就业失业登记证编号、
    // 就业困难人员类别（大龄人员、残疾人、低收入家庭连续失业1年以上、其它）、
    // 灵活就业时间、灵活就业月数、在何地从事何种工作、月收入、申请补贴月度（时间段）
  },
  computed: {
    isMoth() {
      let { r00019_start, r00019_end } = this.projectDeclareInfo
      if (r00019_start && r00019_end) {
        let dateBegin = new Date(r00019_start.replace(/-/g, '/')).getTime() //将-转化为/，使用new Date
        let dateEnd = new Date(r00019_end.replace(/-/g, '/')).getTime() //获取结束时间
        if (dateBegin > dateEnd) {
          this.projectDeclareInfo = {
            ...this.projectDeclareInfo,
            r00019_start: r00019_end,
            r00019_end: r00019_start,
          }
        }
        this.projectDeclareInfo.r00019 =
          this.projectDeclareInfo.r00019_start +
          '至' +
          this.projectDeclareInfo.r00019_end
        return this.projectDeclareInfo.r00019
      } else {
        return ''
      }
    },
  },
  // 监听页面显示
  onShow() {},
  // 监听页面隐藏
  onHide() {},
  methods: {
    async getCodeTableCacheData() {
      const isDev = getIsDev() // 当前环境是否是开发环境
      let r00057 = [] // 请选择岗位类型

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
    // 校验失业证件编号
    checkLoseWork(e) {
      console.log(e, 'e')
      let value = e.detail.value
      let bools = /^[1-8][0-7]\d{14}$/.test(value)
      if (!bools) {
        showModal('请输入正确的登记证编号', '提示', false).then((res) => {
          this.projectDeclareInfo = {
            ...this.projectDeclareInfo,
            r00010: '',
          }
        })
      }
    },
    // 检测数据输入格式是否正确 须根据项目需求更改
    handleCheckInput() {
      const {
        r00019, // 申请补贴月度
        r00033, // 就业地点
        r00010, // 登记证编号
        r00039, // 岗位类型
        r00037, // 月收入
        r00036, // 就业时间
        r43701, // 学历
        r00060, // 就业月数

        r00019_start,
        r00019_end,
      } = this.projectDeclareInfo

      if (!r00010) {
        showModal('请输入就业失业登记证编号')
        return false
      }
      if (!r00036) {
        showModal('请选择灵活就业时间')
        return false
      }
      if (!r00060) {
        showModal('请输入灵活就业月数')
        return false
      }
      if (!r00033) {
        showModal('请选择或输入灵活就业地点')
        return false
      }
      if (!r00039) {
        showModal('请选择灵活就业岗位类型')
        return false
      }
      if (!r00037) {
        showModal('请输入月收入')
        return false
      }
      if (!r00019_start) {
        showModal('请选择申请补贴开始月')
        return false
      }
      if (!r00019_end) {
        showModal('请选择申请补贴结束月')
        return false
      }
      if (!r00019) {
        showModal('请选择申请补贴月度')
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
      const { education } = this.basicInfo

      const {
        r00019, // 申请补贴月度
        r00033, // 就业地点
        r00010, // 登记证编号
        r00039, // 岗位类型
        r00037, // 月收入
        r00036, // 就业时间
        r43701, // 学历
        r00060, // 就业月数
      } = this.projectDeclareInfo

      // 扩展字段
      const hb00BizMap = {
        r00019, // 申请补贴月度
        r00033, // 就业地点
        r00010, // 登记证编号
        r00039, // 岗位类型
        r00037, // 月收入
        r00036, // 就业时间
        r43701: education, // 学历
        r00060, // 就业月数
      }

      this.handleDeclareData(hb00BizMap, '1')
    },
  },
  watch: {},
}
</script>

<style lang="scss" scoped></style>
