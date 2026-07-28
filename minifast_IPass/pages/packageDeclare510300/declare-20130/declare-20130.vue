<template>
  <!-- 在岗村医养老保险缴费补助（卫生健康委） -->
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
        addressRemove="102419"
        @changeDeclareType="handleChangeDeclareType"
        @changeBasicInfo="handleChangeBasicInfo"
        @changeCodeMap="handleChangeCodeMap"
        @changeAgentInfo="handleChangeAgentInfo"
        @changeDataByIdCard="seDataByIdCard"
      >
      </ComponentDeclare>
    </div>

    <!-- start 需要修改的地方开始 在以下代码中根据项目需求更改 上面代码勿动 -->
    <div class="declare-info-wrapper">
      <ComponentPanel title="申报信息">
        <div class="panel-content">
          <div class="cell-items">
            <div class="cell-item required">
              <div class="key">累计工作年限</div>
              <div class="value">
                <input
                  type="text"
                  v-model="projectDeclareInfo.w00031"
                  placeholder="请输入累计工作年限"
                />
              </div>
            </div>

            <ComponentSelectAddressMultitype
              label="执业地点"
              placeholder="请选择或输入执业地点"
              :isShowBtn="false"
              v-model="projectDeclareInfo.w00102"
            >
            </ComponentSelectAddressMultitype>

            <div class="cell-item required">
              <div class="key">执业证号</div>
              <div class="value">
                <input
                  type="text"
                  maxlength="31"
                  v-model="projectDeclareInfo.w00103"
                  placeholder="请输入执业证号"
                />
              </div>
            </div>

            <ComponentDeclarePicker
              label="养老保险类型"
              idName="w00104"
              :range="codeMap.w00104"
              placeholder="请选择养老保险类型"
              v-model="projectDeclareInfo.w00104"
            ></ComponentDeclarePicker>

            <div class="cell-item required">
              <div class="key">养老保险缴费金额</div>
              <div class="value">
                <input
                  type="digit"
                  maxlength="20"
                  v-model="projectDeclareInfo.w00105"
                  placeholder="请输入养老保险缴费金额"
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
import ComponentSelectPermanentAddress from '@/components/project/ez-select-permanent-address/ez-select-permanent-address.vue'
import ComponentSelectCurrentAddress from '@/components/project/ez-select-current-address/ez-select-current-address.vue'
import ComponentDeclareCard from '../components/ez-declare-card/ez-declare-card.vue'
import ComponentDeclarePersonnel from '@/components/project/ez-declare-personnel/ez-declare-personnel.vue'
import ComponentDeclareRadio from '@/components/project/ez-declare-radio/ez-declare-radio.vue'
import ComponentDeclarePicker from '@/components/project/ez-declare-picker/ez-declare-picker.vue'
import ComponentSelectAddressMultitype from '@/components/project/ez-select-address-multitype/ez-select-address-multitype.vue'
import { useDeclare } from '@/mixins'

import { getIsDev } from '@/utils/get'
import { getCodeListByCodeName } from '@/utils/custom-api'
import { showModal } from '@/utils/uni-api'

export default {
  name: 'pageDeclare20130',
  data() {
    return {
      renderObj: {
        idCard: true, // 身份证
        userName: true, // 姓名
        tel: true, // 联系电话
        permanentAddress: true, // 户籍地址
        gender: true, // 性别
        age: true, // 年龄
      },
      projectDeclareInfo: {
        w00102: '',
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
    async getCodeTableCacheData() {
      const isDev = getIsDev() // 当前环境是否是开发环境
      let w00104 = [] // 养老保险类型

      try {
        w00104 = await getCodeListByCodeName('w00104')
      } catch (err) {
        if (isDev) {
          console.log('code table w00104 error：', err)
        }
      }

      this.codeMap = {
        ...this.codeMap,
        w00104,
      }
    },
    // 检测数据输入格式是否正确 须根据项目需求更改
    handleCheckInput() {
      const {
        aac004, //性别
        chb00l, //年龄

        w00031, //累计工作年限
        w00102, //执业地点
        w00103, //执业证号
        w00104, //养老保险类型
        w00105, //养老保险缴费金额（元
      } = this.projectDeclareInfo
      if (!w00031) {
        showModal('请输入累计工作年限')
        return false
      }
      if (!w00102) {
        showModal('请选择执业地点')
        return false
      }
      if (!w00103) {
        showModal('请输入执业证号')
        return false
      }
      if (!w00104) {
        showModal('请选择养老保险类型')
        return false
      }
      if (!w00105) {
        showModal('请输入养老保险缴费金额（元')
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
        age, // 年龄
      } = this.basicInfo

      const {
        w00031, //累计工作年限
        w00102, //执业地点
        w00103, //执业证号
        w00104, //养老保险类型
        w00105, //养老保险缴费金额（元
      } = this.projectDeclareInfo
      // 扩展字段
      var hb00BizMap = {
        aac004: gender, //性别
        chb00l: age, //年龄

        w00031, //累计工作年限
        w00102, //执业地点
        w00103, //执业证号
        w00104, //养老保险类型
        w00105, //养老保险缴费金额（元
      }

      this.handleDeclareData(hb00BizMap, '0')
    },
  },
  computed: {},
}
</script>

<style lang="scss" scoped>
.declare-info-wrapper {
  margin-top: 30rpx;
}
</style>
