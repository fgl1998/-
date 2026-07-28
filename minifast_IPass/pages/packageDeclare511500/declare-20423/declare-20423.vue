<!-- 脱贫家庭（含监测帮扶对象家庭）雨露计划补助（乡村振兴局） -->
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

    <!-- 申报信息 -->
    <div class="space-top-wrapper">
      <ComponentPanel title="申报信息">
        <div class="panel-content">
          <div class="cell-items">
            <div class="cell-item required">
              <div class="key">贷款金额</div>
              <div class="value">
                <input
                  type="text"
                  v-model="projectDeclareInfo.f00058"
                  placeholder="请输入贷款金额"
                />
              </div>
            </div>

            <div class="cell-item required">
              <div class="key">贷款银行</div>
              <div class="value">
                <input
                  type="text"
                  v-model="projectDeclareInfo.f00059"
                  placeholder="请输入贷款金额"
                />
              </div>
            </div>

            <ComponentDeclarePicker
              mode="date"
              fields="day"
              label="贷款时间"
              align="right"
              placeholder="请选择贷款时间"
              v-model="projectDeclareInfo.f00060"
            ></ComponentDeclarePicker>

            <ComponentDeclarePicker
              mode="date"
              fields="day"
              label="到期时间"
              align="right"
              placeholder="请选择到期时间"
              v-model="projectDeclareInfo.f00061"
            ></ComponentDeclarePicker>

            <div class="cell-item required">
              <div class="key">年利率</div>
              <div class="value">
                <input
                  type="text"
                  v-model="projectDeclareInfo.f00062"
                  placeholder="请输入年利率"
                />
              </div>
            </div>
            <div class="cell-item required">
              <div class="key">贷款业务号</div>
              <div class="value">
                <input
                  type="text"
                  v-model="projectDeclareInfo.f00095"
                  placeholder="请输入贷款业务号"
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
import { showModal } from '@/utils/uni-api'
export default {
  name: 'pageDeclare20423',
  data() {
    return {
      // 基本信息 渲染配置
      renderObj: {
        idCard: true, // 身份证
        userName: true, // 姓名
        tel: true, // 联系电话
        gender: true, // 性别
        permanentAddress: true, // 户籍地址
        currentAddress: true, // 现居住地址
      },
      // 自定义添加一些属性 防止双向绑定失败 例如 picker组件之类
      projectDeclareInfo: {
        f00025: '', // 学历
        f00092: '', // 农户类型
      },
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
    async getCodeTableCacheData() {},
    // 检测数据输入格式是否正确 须根据项目需求更改
    handleCheckInput() {
      const {
        f00058, // 贷款金额
        f00059, // 贷款银行
        f00060, // 贷款时间
        f00061, // 到期时间
        f00062, // 年利率
        f00095, // 贷款业务号
      } = this.projectDeclareInfo

      if (!f00058) {
        showModal('请输入贷款金额')
        return false
      }
      if (!f00059) {
        showModal('请输入贷款银行')
        return false
      }
      if (!f00060) {
        showModal('请选择贷款时间')
        return false
      }
      if (!f00061) {
        showModal('请选择到期时间')
        return false
      }
      if (!f00062) {
        showModal('请输入年利率')
        return false
      }
      if (!f00095) {
        showModal('请输入贷款业务号')
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
      const { permanentAddress, gender, currentAddress } = this.basicInfo

      const {
        f00058, // 贷款金额
        f00059, // 贷款银行
        f00060, // 贷款时间
        f00061, // 到期时间
        f00062, // 年利率
        f00095, // 贷款业务号
      } = this.projectDeclareInfo

      // 扩展字段
      const hb00BizMap = {
        f00039: permanentAddress,
        f00040: currentAddress,
        aac004: gender,
        f00058, // 贷款金额
        f00059, // 贷款银行
        f00060, // 贷款时间
        f00061, // 到期时间
        f00062, // 年利率
        f00095, // 贷款业务号
      }

      this.handleDeclareData(hb00BizMap, '0')
    },
  },
  computed: {},
  watch: {},
}
</script>

<style lang="scss" scoped></style>
