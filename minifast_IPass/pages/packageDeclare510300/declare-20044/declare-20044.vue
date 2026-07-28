<template>
  <!-- 地质灾害避险搬迁（自然资源规划局） -->
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
    <div class="personnel-type-wrapper space-top-wrapper">
      <ComponentDeclarePersonnel
        :renderData="personnelList"
        :isOpenCategoryNotes="true"
        @change="handleChangePersonnelInfo"
      ></ComponentDeclarePersonnel>
    </div>

    <!-- start 需要修改的地方开始 在以下代码中根据项目需求更改 上面代码勿动 -->
    <div class="declare-info-wrapper">
      <ComponentPanel title="申报信息">
        <div class="panel-content">
          <div class="cell-items">
            <div class="cell-item required">
              <div class="key">组</div>
              <div class="value">
                <input
                  type="text"
                  v-model="projectDeclareInfo.chb019"
                  placeholder="请输入您所在组"
                />
              </div>
            </div>

            <ComponentDeclarePicker
              label="搬迁年度"
              idName="a00027"
              placeholder="请选择搬迁年度"
              mode="date"
              fields="year"
              :endTime="today_y"
              v-model="projectDeclareInfo.a00027"
            ></ComponentDeclarePicker>

            <ComponentDeclarePicker
              label="预计搬迁完成时间"
              idName="a00059"
              placeholder="请选择预计搬迁完成时间"
              mode="date"
              fields="day"
              :endTime="today_d"
              v-model="projectDeclareInfo.a00059"
            ></ComponentDeclarePicker>

            <ComponentSelectAddressMultitype
              label="原居住地址"
              placeholder="请选择原居住地址"
              :isShowBtn="false"
              v-model="projectDeclareInfo.a00032"
            >
            </ComponentSelectAddressMultitype>

            <ComponentSelectAddressMultitype
              label="拟搬迁地址"
              placeholder="请选择拟搬迁地址"
              :isShowBtn="false"
              v-model="projectDeclareInfo.a00034"
            >
            </ComponentSelectAddressMultitype>

            <ComponentSelectAddressMultitype
              label="所属地质灾害隐患点"
              placeholder="请选择所属地质灾害隐患点"
              :isShowBtn="false"
              v-model="projectDeclareInfo.a00045"
            >
            </ComponentSelectAddressMultitype>
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

import { getDate } from '@/utils/get'
import { showModal } from '@/utils/uni-api'

export default {
  name: 'pageDeclare20003',
  data() {
    return {
      renderObj: {
        idCard: true, // 身份证
        userName: true, // 姓名
        tel: true, // 联系电话
        permanentAddress: true, // 户籍地址
      },
      today_y: getDate('year'),
      today_d: getDate('day'),
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
    async getCodeTableCacheData() {},
    // 检测数据输入格式是否正确 须根据项目需求更改
    handleCheckInput() {
      const {
        chb019, //组
        a00027, //搬迁年度
        a00059, //预计搬迁完成时间
        a00032, //原居住地址
        a00034, //拟搬迁地址
        a00045, //所属地质灾害隐患点
      } = this.projectDeclareInfo
      if (!chb019) {
        showModal('请输入所在组')
        return false
      }
      if (!a00027) {
        showModal('请选择搬迁年度')
        return false
      }
      if (!a00059) {
        showModal('请选择预计搬迁完成时间')
        return false
      }
      if (!a00032) {
        showModal('请选择原居住地址')
        return false
      }
      if (!a00034) {
        showModal('请选择拟搬迁地址')
        return false
      }
      if (!a00045) {
        showModal('请输入所属地质灾害隐患点')
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
        chb019, //组
        a00027, //搬迁年度
        a00059, //预计搬迁完成时间
        a00032, //原居住地址
        a00034, //拟搬迁地址
        a00045, //所属地质灾害隐患点
      } = this.projectDeclareInfo
      // 扩展字段
      var hb00BizMap = {
        chb019, //组
        a00027, //搬迁年度
        a00059, //预计搬迁完成时间
        a00032, //原居住地址
        a00034, //拟搬迁地址
        a00045, //所属地质灾害隐患点
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
