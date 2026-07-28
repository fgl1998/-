<!-- 新增能繁母猪补贴 农业农村局-->
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

    <!-- start 需要修改的地方 在以下代码中根据项目需求更改 -->
    <div class="declare-info-wrapper">
      <ComponentPanel title="申报信息">
        <div class="panel-content">
          <div class="cell-items">
            <ComponentSelectAddressMultitype
              label="联系地址"
              v-model="projectDeclareInfo.n00055"
              @clickBtn="projectDeclareInfo.n00055 = basicInfo.permanentAddress"
              placeholder="请选择或输入联系地址"
            ></ComponentSelectAddressMultitype>

            <ComponentDeclarePicker
              label="母猪新增方式"
              :range="codeMap.n00056"
              placeholder="请选择母猪新增方式"
              v-model="projectDeclareInfo.n00056"
            ></ComponentDeclarePicker>

            <ComponentDeclarePicker
              label="外购(留种)时间"
              mode="date"
              fields="day"
              :endTime="endDate"
              placeholder="请选择时间"
              v-model="projectDeclareInfo.n00057"
            ></ComponentDeclarePicker>

            <div class="cell-item required">
              <div class="key">外购(自留)数量</div>
              <div class="value">
                <input
                  type="number"
                  maxlength="8"
                  v-model="projectDeclareInfo.n00058"
                  placeholder="请输入外购(自留)数量"
                />
              </div>
            </div>

            <ComponentDeclarePicker
              label="产仔时间"
              mode="date"
              fields="day"
              :endTime="endDate"
              placeholder="请选择产仔时间"
              v-model="projectDeclareInfo.n00059"
            ></ComponentDeclarePicker>

            <div class="cell-item required">
              <div class="key">产仔数量</div>
              <div class="value">
                <input
                  type="number"
                  maxlength="8"
                  v-model="projectDeclareInfo.n00060"
                  placeholder="请输入产仔数量"
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
import ComponentSelectAddressMultitype from '@/components/project/ez-select-address-multitype/ez-select-address-multitype.vue'
import ComponentDeclarePicker from '@/components/project/ez-declare-picker/ez-declare-picker.vue'

import { useDeclare } from '@/mixins'

import { getIsDev } from '@/utils/get'
import { getCodeListByCodeName } from '@/utils/custom-api'
import { showModal } from '@/utils/uni-api'

export default {
  name: 'pageDeclare20797',
  data() {
    return {
      renderObj: {
        idCard: true, // 身份证
        userName: true, // 姓名
        tel: true, // 联系电话
        permanentAddress: true, // 户籍地址
      },
      projectDeclareInfo: {
        n00055: '',
      },
      endDate: new Date(),
    }
  },
  components: {
    ComponentButton,
    ComponentPanel,
    ComponentDeclare,
    ComponentDeclareStep,
    ComponentSelectAddressMultitype,
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
    async getCodeTableCacheData() {
      const isDev = getIsDev() // 当前环境是否是开发环境
      let n00056 = [] // 申请人当前学历

      try {
        n00056 = await getCodeListByCodeName('n00056')
      } catch (err) {
        if (isDev) {
          console.log('code table n00056 error：', err)
        }
      }

      this.codeMap = {
        ...this.codeMap,
        n00056,
      }
    },
    // 检测数据输入格式是否正确 须根据项目需求修改
    handleCheckInput() {
      const {
        n00055, // 联系地址
        n00056, // 母猪新增方式
        n00057, // 外购(留种)时间
        n00058, // 外购(自留)数量
        n00059, // 产仔时间
        n00060, // 产仔数量
      } = this.projectDeclareInfo

      if (!n00055) {
        showModal('请选择联系地址')
        return false
      }
      if (!n00056) {
        showModal('请选择母猪新增方式')
        return false
      }
      if (!n00057) {
        showModal('请选择外购(留种)时间')
        return false
      }
      if (!(n00058 + '')) {
        showModal('请输入外购(自留)数量')
        return false
      }
      if (!n00059) {
        showModal('请选择产仔时间')
        return false
      }
      if (!(n00060 + '')) {
        showModal('请输入产仔数量')
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
        n00055, // 联系地址
        n00056, // 母猪新增方式
        n00057, // 外购(留种)时间
        n00058, // 外购(自留)数量
        n00059, // 产仔时间
        n00060, // 产仔数量
      } = this.projectDeclareInfo

      // 扩展字段
      const hb00BizMap = {
        n00055, // 联系地址
        n00056, // 母猪新增方式
        n00057, // 外购(留种)时间
        n00058, // 外购(自留)数量
        n00059, // 产仔时间
        n00060, // 产仔数量
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
