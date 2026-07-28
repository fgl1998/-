<!-- 省部级劳模生活补助金 总工会 -->
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
    <div class="declare-info-wrapper">
      <ComponentPanel title="申报信息">
        <div class="panel-content">
          <div class="cell-items">
            <ComponentDeclarePicker
              label="就业状态"
              idName="chbaae"
              :range="codeMap.aac016"
              placeholder="请选择您的就业状态"
              v-model="projectDeclareInfo.chbaae"
              @change="getPickerValueDesc"
            ></ComponentDeclarePicker>

            <div class="cell-item required">
              <div class="key">工作单位</div>
              <div class="value">
                <input
                  type="text"
                  maxlength="16"
                  v-model="projectDeclareInfo.chbaaa"
                  placeholder="请输入您的工作单位"
                />
              </div>
            </div>
            <div class="cell-item required">
              <div class="key">职位</div>
              <div class="value">
                <input
                  type="text"
                  maxlength="16"
                  v-model="projectDeclareInfo.chbaab"
                  placeholder="请输入您的职位"
                />
              </div>
            </div>
            <div class="cell-item required">
              <div class="key">月收入(元)</div>
              <div class="value">
                <input
                  type="number"
                  maxlength="12"
                  v-model="projectDeclareInfo.chbaaf"
                  placeholder="请输入您的月收入"
                />
              </div>
            </div>
            <ComponentDeclarePicker
              label="省部级劳模荣誉获得年度"
              idName="chbaac"
              mode="date"
              fields="year"
              :endTime="today"
              placeholder="请选择获得年度"
              v-model="projectDeclareInfo.chbaac"
              @change="getPickerValueDesc"
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
import ComponentDeclarePicker from '@/components/project/ez-declare-picker/ez-declare-picker.vue'

import { useDeclare } from '@/mixins'

import { getIsDev, getDate } from '@/utils/get'
import { getCodeListByCodeName } from '@/utils/custom-api'
import { showModal } from '@/utils/uni-api'

export default {
  name: 'pageDeclare20487',

  data() {
    return {
      today: getDate(),
      renderObj: {
        idCard: true, // 身份证
        userName: true, // 姓名
        tel: true, // 联系电话
        permanentAddress: true, // 户籍地址
      },

      projectDeclareInfo: {
        chbaac: '',
      },
    }
  },
  components: {
    ComponentButton,
    ComponentPanel,
    ComponentDeclare,
    ComponentDeclareStep,
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
  methods: {
    // 获取该申报项目的所需要的码表数据
    // aaz502、aac011、dac009、aac004、aac005、aae008、yesorno 不用再次获取
    // 编写格式参考达州20033项目
    async getCodeTableCacheData() {
      const isDev = getIsDev() // 当前环境是否是开发环境
      let aac016 = [] // 就业状态

      try {
        aac016 = await getCodeListByCodeName('aac016')
      } catch (err) {
        if (isDev) {
          console.log('code table aac016 error：', err)
        }
      }

      this.codeMap = {
        ...this.codeMap,
        aac016,
      }
    },
    // 检测数据输入格式是否正确 须根据项目需求更改
    handleCheckInput() {
      const {
        chbaaa, // 工作单位
        chbaab, // 职务
        chbaac, // 荣誉获得年度
        chbaaf, // 月收入
        chbaae, // 就业状态
      } = this.projectDeclareInfo

      if (!chbaae) {
        showModal('请选择就业状态')
        return false
      }
      if (!chbaaa) {
        showModal('请输入您的工作单位')
        return false
      }
      if (!chbaab) {
        showModal('请输入您的职位')
        return false
      }
      if (!chbaaf) {
        showModal('请输入您的月收入')
        return false
      }
      if (!chbaac) {
        showModal('请选择您获取该劳模荣誉的时间')
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
        chbaaa, // 工作单位
        chbaab, // 职务
        chbaac, // 荣誉获得年度
        chbaaf, // 月收入
        chbaae, // 就业状态
      } = this.projectDeclareInfo

      // 扩展字段
      const hb00BizMap = {
        chbaaa, // 工作单位
        chbaab, // 职务
        chbaac, // 荣誉获得年度
        chbaaf, // 月收入
        chbaae, // 就业状态
      }

      this.handleDeclareData(hb00BizMap, '0')
    },
  },
  computed: {},
  watch: {},
}
</script>

<style lang="scss" scoped>
.declare-info-wrapper {
  margin-top: 30rpx;
}
</style>
