<!-- 独生子女父母奖励金 -->
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
        :projectName="chi031_desc"
        @changeDeclareType="handleChangeDeclareType"
        @changeBasicInfo="handleChangeBasicInfo"
        @changeCodeMap="handleChangeCodeMap"
      >
      </ComponentDeclare>
    </div>

    <!-- start 需要修改的地方 在以下代码中根据项目需求更改 -->
    <div class="declare-info-wrapper" v-if="declareType === '02'">
      <ComponentPanel title="申报信息">
        <div class="panel-content">
          <div class="cell-items">
            <block>
              <div class="cell-item required">
                <div class="key">身份证号</div>
                <div class="value">
                  <input
                    type="idcard"
                    maxlength="18"
                    v-model="projectDeclareInfo.aac002"
                    @blur="handleAac002Blur"
                    placeholder="请输入申报人的身份证号"
                  />
                </div>
              </div>
              <div class="cell-item required">
                <div class="key">姓名</div>
                <div class="value">
                  <input
                    type="text"
                    v-model="projectDeclareInfo.aac003"
                    placeholder="请输入申报人的姓名"
                  />
                </div>
              </div>
              <div class="cell-item required">
                <div class="key">联系电话</div>
                <div class="value">
                  <input
                    type="number"
                    maxlength="11"
                    v-model="projectDeclareInfo.aae005"
                    placeholder="请输入联系电话"
                    @blur="handleAae005Blur"
                  />
                </div>
              </div>
              <!-- 户籍地址 -->
              <ComponentSelectPermanentAddress
                v-model="projectDeclareInfo.aae006"
                @change="handleChangePermanentAddress"
              ></ComponentSelectPermanentAddress>
            </block>
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
import ComponentDeclareCard from '../components/ez-declare-card/ez-declare-card.vue'
import ComponentDeclareRadio from '@/components/project/ez-declare-radio/ez-declare-radio.vue'

import { useDeclare } from '@/mixins'

export default {
  name: 'pageDeclare20002',
  data() {
    return {
      renderObj: {
        idCard: true, // 身份证
        userName: true, // 姓名
        tel: true, // 联系电话
        permanentAddress: true, // 户籍地址
      },
    }
  },
  components: {
    ComponentButton,
    ComponentPanel,
    ComponentDeclare,
    ComponentDeclareStep,
    ComponentSelectPermanentAddress,
    ComponentDeclareCard,
    ComponentDeclareRadio,
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
      const declareType = this.declareType
      const personnelInfo = this.personnelInfo
      const { permanentAddress, tel, idCard } = this.basicInfo
      const {
        aac002, // 身份证号
        aac003, // 姓名
        aae005, // 联系电话
        aae006, // 户籍地址
      } = this.projectDeclareInfo

      return true
    },

    // 下一步 须根据项目需求修改
    handleJumpNextStep() {
      if (!this.handleCheckComponentInput()) {
        return
      }
      const checkResult = this.handleCheckInput()
      if (!checkResult) {
        return
      }
      // 扩展字段
      const hb00BizMap = {
        time: +new Date(),
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
