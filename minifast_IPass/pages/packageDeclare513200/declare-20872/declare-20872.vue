<!-- 特困人员丧葬费 民政局 -->
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
    <div class="space-top-wrapper">
      <ComponentPanel title="申报信息">
        <div class="panel-content">
          <div class="cell-items">
            <!-- 子女或亲属姓名 -->
            <div class="cell-item required">
              <div class="key">子女或亲属姓名</div>
              <div class="value">
                <input
                  type="text"
                  v-model="projectDeclareInfo.chb0a1"
                  placeholder="请输入姓名"
                />
              </div>
            </div>
            <!--子女或亲属联系电话-->
            <div class="cell-item required">
              <div class="key">子女或亲属联系电话</div>
              <div class="value">
                <input
                  type="number"
                  maxlength="11"
                  v-model="projectDeclareInfo.chb0a2"
                  placeholder="请输入联系电话"
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

import { useDeclare } from '@/mixins'

import { getIsDev } from '@/utils/get'
import { checkIDCard, checkPhoneNumber } from '@/utils/check'
import { getCodeListByCodeName } from '@/utils/custom-api'
import { showModal } from '@/utils/uni-api'

export default {
  name: 'pageDeclare20872',
  data() {
    return {
      renderObj: {
        idCard: true, // 身份证
        userName: true, // 姓名
        tel: true, // 联系电话
        permanentAddress: true, // 户籍地址
      },
      projectDeclareInfo: {
        chb0a1: '',
        chb0a2: '',
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
    // 检测数据输入格式是否正确 须根据项目需求修改
    handleCheckInput() {
      const {
        chb0a1, // 子女或亲属姓名
        chb0a2, // 子女或亲属联系电话
      } = this.projectDeclareInfo
      if (!chb0a1) {
        showModal('请输入子女或亲属姓名')
        return false
      }
      if (!chb0a2) {
        showModal('请输入子女或亲属联系电话')
        return false
      } else {
        const checkResult = checkPhoneNumber(chb0a2, '子女或亲属联系电话')
        if (checkResult.status === '0') {
          showModal(checkResult.msg)
          return false
        }
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
        nature, // 户口性质
        currentAddress, // 现居住地址
      } = this.basicInfo

      const {
        chb0a1, // 子女或亲属姓名
        chb0a2, // 子女或亲属联系电话
      } = this.projectDeclareInfo
      // 扩展字段
      let hb00BizMap = {
        chb0a1, // 子女或亲属姓名
        chb0a2, // 子女或亲属联系电话
      }

      this.handleDeclareData(hb00BizMap, '0')
    },
  },
  computed: {},
  watch: {},
}
</script>

<style lang="scss" scoped></style>
