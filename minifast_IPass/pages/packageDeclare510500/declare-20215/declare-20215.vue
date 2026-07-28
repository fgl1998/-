<template>
  <!-- 卫生扶贫救助基金 -->
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
              v-if="declareType == '02'"
              label="与受助人关系"
              idName="w00039"
              :range="codeMap.w00039"
              placeholder="请选择与受助人关系"
              v-model="projectDeclareInfo.w00039"
              :required="false"
            >
            </ComponentDeclarePicker>

            <ComponentSelectAddressMultitype
              label="家庭地址"
              placeholder="请选择或输入家庭地址"
              :isShowBtn="renderObj.permanentAddress"
              @clickBtn="projectDeclareInfo.w00131 = basicInfo.permanentAddress"
              v-model="projectDeclareInfo.w00131"
            >
            </ComponentSelectAddressMultitype>

            <div class="cell-item required">
              <div class="key">就医医疗机构</div>
              <div class="value">
                <input
                  type="text"
                  v-model="projectDeclareInfo.w00101"
                  placeholder="请输入就医医疗机构"
                />
              </div>
            </div>

            <div class="cell-item required">
              <div class="key">医疗总费用</div>
              <div class="value">
                <input
                  type="digit"
                  maxlength="20"
                  v-model="projectDeclareInfo.w03003"
                  placeholder="请输入医疗总费用"
                />
              </div>
            </div>

            <div class="cell-item required">
              <div class="key">医保报销费用</div>
              <div class="value">
                <input
                  type="digit"
                  maxlength="20"
                  v-model="projectDeclareInfo.w00007"
                  placeholder="请输入医保报销费用"
                />
              </div>
            </div>

            <div class="cell-item required">
              <div class="key">医疗救助金额</div>
              <div class="value">
                <input
                  type="digit"
                  maxlength="20"
                  v-model="projectDeclareInfo.w00098"
                  placeholder="请输入医疗救助金额"
                />
              </div>
            </div>

            <div class="cell-item required">
              <div class="key">个人自费费用</div>
              <div class="value">
                <input
                  type="digit"
                  maxlength="20"
                  v-model="projectDeclareInfo.w00008"
                  placeholder="请输入个人自费费用"
                />
              </div>
            </div>

            <ComponentDeclarePicker
              label="出院时间"
              idName="w00132"
              mode="date"
              fields="day"
              :endTime="new Date().getTime()"
              placeholder="请选择出院时间"
              v-model="projectDeclareInfo.w00132"
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
import ComponentSelectAddressMultitype from '@/components/project/ez-select-address-multitype/ez-select-address-multitype.vue'
import { useDeclare } from '@/mixins'
import { showModal } from '@/utils/uni-api'

export default {
  name: 'pageDeclare20215',

  data() {
    return {
      renderObj: {
        idCard: true, // 身份证
        userName: true, // 姓名
        tel: true, // 联系电话
        permanentAddress: true, // 户籍地址
        gender: true, //性别
        age: true, // 年龄
      },

      projectDeclareInfo: {
        w00131: '',
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
    ComponentSelectAddressMultitype,
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
    getCodeTableCacheData() {},
    // 检测数据输入格式是否正确 须根据项目需求更改
    handleCheckInput() {
      const {
        w00131, //家庭地址
        aac004, //性别
        chb00l, //年龄
        aae006, //户籍地址/详细地址

        w00039, //与受助人关系
        w00101, //就医医疗机构
        w03003, //医疗总费用
        w00007, //医保报销费用
        w00098, //医疗救助金额（元）
        w00008, //个人自费费用
        w00132, //出院时间

        chb00y, //代办人姓名
        chb00z, //代办人身份证号码
        chb00w, //代办人联系电话
      } = this.projectDeclareInfo
      // if (!w00039 && this.declareType == '02') {
      //   showModal("请输入与受助人关系");
      //   return false;
      // }
      if (!w00131) {
        showModal('请输入家庭地址')
        return false
      }
      if (!w00101) {
        showModal('请输入就医医疗机构')
        return false
      }
      if (!w03003) {
        showModal('请输入医疗总费用')
        return false
      }
      if (!w00007) {
        showModal('请输入医保报销费用')
        return false
      }
      if (!w00098) {
        showModal('请输入医疗救助金额（元）')
        return false
      }
      if (!w00008) {
        showModal('请输入个人自费费用')
        return false
      }
      if (!w00132) {
        showModal('请选择出院时间')
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
        permanentAddress,
        age,
        currentAddress,
      } = this.basicInfo

      const { idCard, userName, tel } = this.agentInfo

      const {
        w00131, //家庭地址
        w00039, //与受助人关系
        w00101, //就医医疗机构
        w03003, //医疗总费用
        w00007, //医保报销费用
        w00098, //医疗救助金额（元）
        w00008, //个人自费费用
        w00132, //出院时间
      } = this.projectDeclareInfo
      // 扩展字段
      const hb00BizMap = {
        w00131, //家庭地址
        aac004: gender, //性别
        chb00l: age, //年龄
        aae006: permanentAddress, //户籍地址/详细地址

        w00039, //与受助人关系
        w00101, //就医医疗机构
        w03003, //医疗总费用
        w00007, //医保报销费用
        w00098, //医疗救助金额（元）
        w00008, //个人自费费用
        w00132, //出院时间

        chb00y: userName, //代办人姓名
        chb00z: idCard, //代办人身份证号码
        chb00w: tel, //代办人联系电话
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
