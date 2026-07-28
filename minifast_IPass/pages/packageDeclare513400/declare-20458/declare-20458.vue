<!-- 生猪出栏补贴 -->
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
            <ComponentSelectAddressMultitype
              label="详细地址"
              placeholder="请选择或输入详细地址"
              :isShowBtn="renderObj.permanentAddress"
              @clickBtn="projectDeclareInfo.n00061 = basicInfo.permanentAddress"
              v-model="projectDeclareInfo.n00061"
            >
            </ComponentSelectAddressMultitype>
            <div class="cell-item required">
              <div class="key">所在组</div>
              <div class="value">
                <input
                  type="text"
                  v-model="projectDeclareInfo.chb019"
                  placeholder="请输入所在组"
                />
              </div>
            </div>
            <div class="cell-item required disabled">
              <div class="key">补贴标准(元/头)</div>
              <div class="value">
                {{ projectDeclareInfo.n23901 || '暂无' }}
              </div>
            </div>
            <div class="cell-item required">
              <div class="key">生猪出栏数量</div>
              <div class="value">
                <input
                  type="number"
                  maxlength="11"
                  v-model="projectDeclareInfo.n00054"
                  placeholder="请输入生猪出栏数量"
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
import ComponentSelectPermanentAddress from '@/components/project/ez-select-permanent-address/ez-select-permanent-address.vue'
import ComponentSelectCurrentAddress from '@/components/project/ez-select-current-address/ez-select-current-address.vue'
import ComponentDeclareCard from '../components/ez-declare-card/ez-declare-card.vue'
import ComponentDeclarePersonnel from '@/components/project/ez-declare-personnel/ez-declare-personnel.vue'
import ComponentDeclareRadio from '@/components/project/ez-declare-radio/ez-declare-radio.vue'
import ComponentDeclarePicker from '@/components/project/ez-declare-picker/ez-declare-picker.vue'
import ComponentSelectAddressMultitype from '@/components/project/ez-select-address-multitype/ez-select-address-multitype.vue'
import { useDeclare } from '@/mixins'

import { getIsDev, getDate } from '@/utils/get'
import { checkIDCard, checkPhoneNumber } from '@/utils/check'
import { getCodeListByCodeName } from '@/utils/custom-api'
import { showModal } from '@/utils/uni-api'

export default {
  name: 'pageDeclare20458',
  data() {
    return {
      renderObj: {
        idCard: true, // 身份证
        userName: true, // 姓名
        tel: true, // 联系电话
        permanentAddress: true, // 户籍地址
      },
      // 申报信息
      projectDeclareInfo: {
        n23901: 10,
        aae006: '',
        n00061: '',
      },
      // 卡片列表数据
      cardList: [],
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
  // 监听页面初次渲染完成
  onReady() {},
  // 监听页面显示
  onShow() {},
  // 监听页面隐藏
  onHide() {},
  methods: {
    // 检测数据输入格式是否正确 须根据项目需求修改
    handleCheckInput() {
      const {
        n00061, // 详细地址
        chb019, // 组
        n23901, // 补贴标准（元/头）
        n00054, // 生猪出栏数量
      } = this.projectDeclareInfo
      if (!n00061) {
        showModal('请选择或输入详细地址')
        return false
      }
      if (!chb019) {
        showModal('请输入所在组')
        return false
      }
      if (!n23901) {
        showModal('没有补贴标准')
        return false
      }
      if (!n00054) {
        showModal('请输入生猪出栏数量')
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
        idCard,
        userName,
        tel,
        permanentAddress,
        district,
        township,
        village,
      } = this.basicInfo
      const {
        aac002, // 身份证号
        aac003, // 姓名
        aae005, // 联系电话
        aae006, // 户籍地址

        chb015,
        chb017,
        chb018,
        chb019,

        n00061, // 详细地址
        n23901, // 补贴标准（元/头）
        n00054, // 生猪出栏数量
      } = this.projectDeclareInfo

      // 扩展字段
      let hb00BizMap = {
        aac002: idCard, // 身份证号
        aac003: userName, // 姓名
        aae005: tel, // 联系电话
        aae006: permanentAddress, // 户籍地址

        chb015: district,
        chb017: township,
        chb018: village,
        chb019,
        n00061, // 详细地址
        n23901, // 补贴标准（元/头）
        n00054: parseInt(n00054), //生猪出栏数量
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
