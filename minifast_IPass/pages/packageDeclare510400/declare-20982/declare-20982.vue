<!-- 福彩圆梦·孤儿助学工程（民政局） -->
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
    <!-- 申报信息 -->
    <div class="space-top-wrapper">
      <ComponentPanel title="申报信息">
        <div class="panel-content">
          <div class="cell-items">
            <div class="cell-item required">
              <div class="key">录取院校</div>
              <div class="value">
                <input
                  type="text"
                  v-model="projectDeclareInfo.m00036"
                  placeholder="请输入录取院校"
                />
              </div>
            </div>
            <div class="cell-item required">
              <div class="key">录取专业</div>
              <div class="value">
                <input
                  type="text"
                  v-model="projectDeclareInfo.m00037"
                  placeholder="请输入录取专业"
                />
              </div>
            </div>
            <ComponentDeclarePicker
              label="院校类别"
              idName="m00039"
              :range="codeMap.m00039"
              placeholder="请选择院校类别"
              v-model="projectDeclareInfo.m00039"
              @change="getPickerValueDesc"
            ></ComponentDeclarePicker>
            <ComponentSelectAddressMultitype
              label="院校所在地"
              placeholder="请选择或输入院校所在地"
              :isShowBtn="false"
              v-model="projectDeclareInfo.m00038"
            >
            </ComponentSelectAddressMultitype>
            <ComponentDeclarePicker
              label="入学时间"
              idName="m00056"
              placeholder="请选择入学时间"
              mode="date"
              fields="day"
              :endTime="today"
              v-model="projectDeclareInfo.m00056"
            ></ComponentDeclarePicker>
            <div class="cell-item required">
              <div class="key">孤儿系统编号</div>
              <div class="value">
                <input
                  type="number"
                  maxlength="14"
                  v-model="projectDeclareInfo.m33101"
                  placeholder="请输入孤儿系统编号"
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
import ComponentDeclarePicker from '@/components/project/ez-declare-picker/ez-declare-picker.vue'
import ComponentSelectAddressMultitype from '@/components/project/ez-select-address-multitype/ez-select-address-multitype.vue'

import { useDeclare } from '@/mixins'

import { getDate, getIsDev } from '@/utils/get'
import { getCodeListByCodeName } from '@/utils/custom-api'
import { showModal } from '@/utils/uni-api'
export default {
  name: 'pageDeclare20982',
  data() {
    return {
      today: getDate(),
      // 基本信息 渲染配置
      renderObj: {
        idCard: true, // 身份证
        userName: true, // 姓名
        tel: true, // 联系电话
        gender: true, // 性别
        birthday: true, // 出生日期
        permanentAddress: true, // 户籍地址
        nation: true, // 民族
      },
      // 自定义添加一些属性 防止双向绑定失败 例如 picker组件之类
      projectDeclareInfo: {
        m00039: '', // 院校类别
				m00038: '', // 院校地址
      },
    }
  },
  components: {
    ComponentButton,
    ComponentPanel,
    ComponentDeclare,
    ComponentDeclareStep,
    ComponentDeclarePicker,
    ComponentSelectAddressMultitype
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
      let m00039 = [] // 院校类别

      try {
        m00039 = await getCodeListByCodeName('m00039')
      } catch (err) {
        if (isDev) {
          console.log('code table m00039 error：', err)
        }
      }

      this.codeMap = {
        ...this.codeMap,
        m00039,
      }
    },
    // 检测数据输入格式是否正确 须根据项目需求更改
    handleCheckInput() {
      const {
        m00036, // 录取院校
        m00037, // 录取专业
        m00039, // 院校类别
        m00038, // 院校所在地
        m00056, // 入学时间
        m33101, // 孤儿系统编号
      } = this.projectDeclareInfo

      if (!m00036) {
        showModal('请输入录取院校')
        return false
      }

      if (!m00037) {
        showModal('请输入录取专业')
        return false
      }
      if (!m00039) {
        showModal('请选择院校类别')
        return false
      }
      if (!m00038) {
        showModal('请选择或输入院校所在地')
        return false
      }
      if (!m00056) {
        showModal('请选择入学时间')
        return false
      }
      if (!m33101) {
        showModal('请输入孤儿系统编号')
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
        gender, // 性别
        nation, // 民族
      } = this.basicInfo

      const {
        m00036, // 录取院校
        m00037, // 录取专业
        m00039, // 院校类别
        m00038, // 院校所在地
        m00056, // 入学时间
        m33101, // 孤儿系统编号
        aac005, // 民族
      } = this.projectDeclareInfo

      // 扩展字段
      const hb00BizMap = {
        aac004: gender, // 性别
        chb0a9: permanentAddress, //户籍地址
        m00036, // 录取院校
        m00037, // 录取专业
        m00039, // 院校类别
        m00038, // 院校所在地
        m00056, // 入学时间
        m33101, // 孤儿系统编号
        aac005: nation, // 民族
      }
      this.handleDeclareData(hb00BizMap, '0')
    },
  },
  computed: {},
  watch: {},
}
</script>

<style lang="scss" scoped>
</style>
