<!-- 扶贫小额信息贷款贴息（扶贫开发局） -->
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

    <!-- 申报信息 -->
    <div class="space-top-wrapper">
      <ComponentPanel title="申报信息">
        <div class="panel-content">
          <div class="cell-items">
            <!-- 组 -->
            <div class="cell-item required">
              <div class="key">组</div>
              <div class="value">
                <input
                  type="text"
                  v-model="projectDeclareInfo.chb019"
                  placeholder="请输入组"
                />
              </div>
            </div>
            <div class="cell-item required">
              <div class="key">户主姓名</div>
              <div class="value">
                <input
                  type="text"
                  v-model="projectDeclareInfo.f00023"
                  placeholder="请输入户主姓名"
                />
              </div>
            </div>
            <div class="cell-item required">
              <div class="key">户主身份证号</div>
              <div class="value">
                <input
                  type="idcard"
                  maxlength="18"
                  v-model="projectDeclareInfo.f00022"
                  placeholder="请输入户主身份证号"
                  @blur="handleBlurM00004"
                />
              </div>
            </div>
            <div class="cell-item required">
              <div class="key">借据号</div>
              <div class="value">
                <input
                  type="text"
                  v-model="projectDeclareInfo.f00073"
                  placeholder="请输入借据号"
                />
              </div>
            </div>

            <div class="cell-item required">
              <div class="key">贷款总金额</div>
              <div class="value">
                <input
                  type="digit"
                  v-model="projectDeclareInfo.f00058"
                  placeholder="请输入贷款总金额"
                />
              </div>
            </div>

            <ComponentDeclarePicker
              label="贷款时间"
              idName="a00020"
              mode="date"
              fields="day"
              :endTime="today_d"
              v-model="projectDeclareInfo.f00060"
              placeholder="请选择您的贷款时间"
            ></ComponentDeclarePicker>

            <div class="cell-item required">
              <div class="key">结息总金额</div>
              <div class="value">
                <input
                  type="digit"
                  v-model="projectDeclareInfo.f00074"
                  placeholder="请输入贷款总金额"
                />
              </div>
            </div>

            <ComponentDeclarePicker
              v-if="projectDeclareInfo.f00060"
              label="结息时间"
              idName="a00020"
              mode="date"
              fields="day"
              :endTime="projectDeclareInfo.f00060"
              v-model="projectDeclareInfo.f00075"
              placeholder="请选择您的结息时间"
            ></ComponentDeclarePicker>

            <div class="cell-item required">
              <div class="key">罚息金额</div>
              <div class="value">
                <input
                  type="digit"
                  v-model="projectDeclareInfo.f00076"
                  placeholder="请输入罚息金额"
                />
              </div>
            </div>

            <div class="cell-item required">
              <div class="key">贴息金额</div>
              <div class="value">
                <input
                  type="digit"
                  v-model="projectDeclareInfo.aae019"
                  placeholder="请输入贴息金额"
                />
              </div>
            </div>

            <ComponentDeclarePicker
              label="申报季度"
              idName="f00077"
              :range="codeMap.r00053"
              placeholder="请选择申报季度"
              v-model="projectDeclareInfo.f00077"
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
import ComponentSelectPermanentAddress from '@/components/project/ez-select-permanent-address/ez-select-permanent-address.vue'
import ComponentSelectCurrentAddress from '@/components/project/ez-select-current-address/ez-select-current-address.vue'
import ComponentDeclareCard from '../components/ez-declare-card/ez-declare-card.vue'
import ComponentDeclarePersonnel from '@/components/project/ez-declare-personnel/ez-declare-personnel.vue'
import ComponentDeclareRadio from '@/components/project/ez-declare-radio/ez-declare-radio.vue'
import ComponentDeclarePicker from '@/components/project/ez-declare-picker/ez-declare-picker.vue'

import { useDeclare } from '@/mixins'

import { getIsDev, getDate } from '@/utils/get'
import { checkIDCard, checkPhoneNumber } from '@/utils/check'
import { getCodeListByCodeName } from '@/utils/custom-api'
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
        permanentAddress: true // 户籍地址
      },
      // 自定义添加一些属性 防止双向绑定失败 例如 picker组件之类
      projectDeclareInfo: {
        f00060: ''
      },
      today_d: getDate()
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
    ComponentDeclarePicker
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
      let r00053 = [] // 申报缘由

      try {
        r00053 = await getCodeListByCodeName('r00053')
      } catch (err) {
        if (isDev) {
          console.log('code table r00053 error：', err)
        }
      }

      this.codeMap = {
        ...this.codeMap,
        r00053
      }
    },
    // 手动输入户主身份证号 失去焦点监听
    handleBlurM00004(e) {
      const { value } = e.target
      const checkResult = checkIDCard(value)
      if (checkResult.status === '0') {
        showModal(checkResult.msg)
      }
    },
    // 检测数据输入格式是否正确 须根据项目需求更改
    handleCheckInput() {
      const {
        aac004, //性别
        f00023, //户主名称
        f00022, //户主身份证号码
        f00058, //贷款总金额
        f00060, //贷款时间
        f00039, //户籍地址
        f00073, //借据号
        f00074, //结息总金额
        f00075, //结息时间
        f00076, //罚息金额
        f00077, //申报季度
        aae019, //贴息金额
        chb019 // 组
      } = this.projectDeclareInfo

      if (!chb019) {
        showModal('请输入组（社）')
        return false
      }
      if (!f00023) {
        showModal('请输入户主名称')
        return false
      }

      if (!f00022) {
        showModal('请输入户主身份证号码')
        return false
      } else {
        const checkResult = checkIDCard(f00022, '户主身份证号码')
        if (checkResult.status === '0') {
          showModal(checkResult.msg)
          return false
        }
      }

      if (!f00058) {
        showModal('请输入贷款总金额')
        return false
      }

      if (!f00060) {
        showModal('请选择贷款时间')
        return false
      }

      if (!f00073) {
        showModal('请输入借据号')
        return false
      }

      if (!f00074) {
        showModal('请输入结息总金额')
        return false
      }

      if (!f00075) {
        showModal('请选择结息时间')
        return false
      }

      if (!f00076) {
        showModal('请输入罚息金额')
        return false
      }

      if (!aae019) {
        showModal('请输入贴息金额')
        return false
      }

      if (!f00077) {
        showModal('请选择申报季度')
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
        permanentAddress // 户籍地址
      } = this.basicInfo

      const {
        aac004, //性别
        f00023, //户主名称
        f00022, //户主身份证号码
        f00058, //贷款总金额
        f00060, //贷款时间
        f00039, //户籍地址
        f00073, //借据号
        f00074, //结息总金额
        f00075, //结息时间
        f00076, //罚息金额
        aae019, //贴息金额
        f00077, //申报季度
        chb019 // 组
      } = this.projectDeclareInfo

      // 扩展字段
      const hb00BizMap = {
        aac004: gender, //性别
        f00023, //户主名称
        f00022, //户主身份证号码
        f00058, //贷款总金额
        f00060, //贷款时间
        f00039: permanentAddress, //户籍地址
        f00073, //借据号
        f00074, //结息总金额
        f00075, //结息时间
        f00076, //罚息金额
        aae019, //贴息金额
        f00077, //申报季度
        chb019 // 组
      }

      this.handleDeclareData(hb00BizMap, '0')
    }
  },
  computed: {},
  watch: {}
}
</script>

<style lang="scss" scoped></style>
