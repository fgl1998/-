<template>
  <!-- 农村独生子女父母参加新型农村社会养老保险增发养老补助金(龙马潭、泸县、古蔺) -->
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
            <div class="cell-item">
              <div class="key">子女姓名</div>
              <div class="value">
                <input
                  type="text"
                  v-model="projectDeclareInfo.w00004"
                  placeholder="请输入子女姓名"
                />
              </div>
            </div>

            <ComponentDeclarePicker
              label="子女性别"
              idName="w00067"
              :range="codeMap.w00067"
              placeholder="请选择子女性别"
              v-model="projectDeclareInfo.w00067"
              :required="false"
            >
            </ComponentDeclarePicker>

            <ComponentDeclarePicker
              label="子女出生时间"
              idName="w00068"
              :required="false"
              mode="date"
              fields="day"
              :endTime="new Date().getTime()"
              placeholder="请选择子女出生时间"
              v-model="projectDeclareInfo.w00068"
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

import { getIsDev } from '@/utils/get'
import { getCodeListByCodeName } from '@/utils/custom-api'
export default {
  name: 'pageDeclare20599',

  data() {
    return {
      renderObj: {
        idCard: true, // 身份证
        userName: true, // 姓名
        tel: true, // 联系电话
        permanentAddress: true, // 户籍地址
        age: true, // 年龄
        currentAddress: true, //现居地址
      },

      projectDeclareInfo: {},
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
      let w00067 = [] // 子女性别

      try {
        w00067 = await getCodeListByCodeName('w00067')
      } catch (err) {
        if (isDev) {
          console.log('code table w00067 error：', err)
        }
      }

      this.codeMap = {
        ...this.codeMap,
        w00067,
      }
    },
    // 检测数据输入格式是否正确 须根据项目需求更改
    handleCheckInput() {
      const {
        chb00l, //年龄
        w00034, //现居住地址

        w00004, //子女姓名
        w00067, //子女性别
        w00068, //子女出生时间
      } = this.projectDeclareInfo
      // if (!w00004) {
      //   showModal("请输入子女姓名");
      //   return false;
      // }
      //    if (!w00067) {
      //      showModal("请选择子女性别");
      //      return false;
      //    }
      //    if (!w00068) {
      //      showModal("请选择子女出生时间");
      //      return false;
      //    }

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
      const { age, currentAddress } = this.basicInfo

      const { idCard, userName, tel } = this.agentInfo

      const {
        w00004, //子女姓名
        w00067, //子女性别
        w00068, //子女出生时间
      } = this.projectDeclareInfo
      // 扩展字段
      const hb00BizMap = {
        chb00l: age, //年龄
        w00034: currentAddress, //现居住地址

        w00004, //子女姓名
        w00067, //子女性别
        w00068, //子女出生时间
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
