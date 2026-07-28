<template>
  <!-- 残疾人基本辅具适配补贴（残联） -->
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
        :addressFilter="['102415']"
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
            <div class="cell-item required">
              <div class="key">二代残疾证号</div>
              <div class="value">
                <input
                  type="text"
                  v-model="projectDeclareInfo.c03601"
                  placeholder="请输入二代残疾证号"
                />
              </div>
            </div>

            <ComponentDeclarePicker
              label="辅具类型"
              idName="c00188"
              :range="codeMap.c00188"
              placeholder="请选择辅具类型"
              v-model="projectDeclareInfo.c00188"
            ></ComponentDeclarePicker>

            <div class="cell-item required">
              <div class="key">监护人姓名</div>
              <div class="value">
                <input
                  type="text"
                  v-model="projectDeclareInfo.c77501"
                  placeholder="请输入监护人姓名"
                />
              </div>
            </div>

            <ComponentDeclarePicker
              label="与残疾人关系"
              idName="c00056"
              :range="codeMap.f00024"
              placeholder="请选择与残疾人关系"
              v-model="projectDeclareInfo.c00056"
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
import { showModal } from '@/utils/uni-api'

export default {
  name: 'pageDeclare20291',
  data() {
    return {
      renderObj: {
        idCard: true, // 身份证
        userName: true, // 姓名
        tel: true, // 联系电话
        gender: true, // 性别
        currentAddress: true, // 现居住地址
        permanentAddress: true, // 户籍地址
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
      let f00024 = [] // 与残疾人关系
      let c00188 = [] // 辅具类型

      try {
        f00024 = await getCodeListByCodeName('f00024')
      } catch (err) {
        if (isDev) {
          console.log('code table f00024 error：', err)
        }
      }

      try {
        c00188 = await getCodeListByCodeName('c00188')
      } catch (err) {
        if (isDev) {
          console.log('code table c00188 error：', err)
        }
      }

      this.codeMap = {
        ...this.codeMap,
        f00024,
        c00188,
      }
    },
    // 检测数据输入格式是否正确 须根据项目需求更改
    handleCheckInput() {
      const {
        aac004, //性别
        c00008, //户籍地址
        c00015, //现居住地址

        c03601, //二代残疾证号
        c00188, //辅具类型
        c77501, //监护人姓名
        c00056, //与残疾人关系
      } = this.projectDeclareInfo
      if (!c03601) {
        showModal('请输入二代残疾证号')
        return false
      }
      if (!c00188) {
        showModal('请选择辅具类型')
        return false
      }
      if (!c77501) {
        showModal('请输入监护人姓名')
        return false
      }
      if (!c00056) {
        showModal('请选择与残疾人关系')
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
        currentAddress, // 现居住地址
        permanentAddress, // 户籍地址
      } = this.basicInfo

      const {
        c03601, //二代残疾证号
        c00188, //辅具类型
        c77501, //监护人姓名
        c00056, //与残疾人关系
      } = this.projectDeclareInfo
      // 扩展字段
      var hb00BizMap = {
        aac004: gender, //性别
        c00008: permanentAddress, //户籍地址
        c00015: currentAddress, //现居住地址

        c03601, //二代残疾证号
        c00188, //辅具类型
        c77501, //监护人姓名
        c00056, //与残疾人关系
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
