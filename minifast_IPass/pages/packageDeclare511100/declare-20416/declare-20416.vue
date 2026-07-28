<!-- 生猪重大动物疫病强制扑杀补助 -->
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
        :isMultipleChoicesPersonnel="isMultipleChoicesPersonnel"
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
              <div class="key">养殖规模</div>
              <div class="value">
                <input
                  type="text"
                  maxlength="19"
                  v-model="projectDeclareInfo.n00180"
                  placeholder="请输入养殖规模"
                />
              </div>
            </div>

            <ComponentDeclarePicker
              label="扑杀时间"
              idName="n00181"
              mode="date"
              fields="day"
              :endTime="today_d"
              v-model="projectDeclareInfo.n00181"
              placeholder="请选择扑杀时间"
            ></ComponentDeclarePicker>

            <div class="cell-item required">
              <div class="key">扑杀原因</div>
              <div class="value">
                <input
                  type="text"
                  v-model="projectDeclareInfo.n00182"
                  placeholder="请输入扑杀原因"
                />
              </div>
            </div>

            <div class="cell-item required">
              <div class="key">无害化处理方式</div>
              <div class="value">
                <input
                  type="text"
                  v-model="projectDeclareInfo.n00183"
                  placeholder="请输入无害化处理方式"
                />
              </div>
            </div>
          </div>
        </div>
      </ComponentPanel>
    </div>

    <!-- 添加禽畜捕杀信息 -->
    <div class="space-top-wrapper">
      <ComponentPanel title="禽畜捕杀信息">
        <ComponentDeclareCard
          :renderData="cardList"
          type="20416"
          addButtonName="添加禽畜捕杀信息"
          @change="handleChangeCardList"
        ></ComponentDeclareCard>
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
import ComponentDeclareCard from '@/components/project/ez-declare-card/ez-declare-card.vue'
import ComponentDeclarePersonnel from '@/components/project/ez-declare-personnel/ez-declare-personnel.vue'
import ComponentDeclarePicker from '@/components/project/ez-declare-picker/ez-declare-picker.vue'
import ComponentSelectAddressMultitype from '@/components/project/ez-select-address-multitype/ez-select-address-multitype.vue'

import { useDeclare } from '@/mixins'
import { useGetCurrentDate } from '@/hooks/common'
import { showModal } from '@/utils/uni-api'
export default {
  name: 'pageDeclare20416',
  data() {
    return {
      isMultipleChoicesPersonnel: false,
      today_d: useGetCurrentDate(),
      renderObj: {
        idCard: true, // 身份证
        userName: true, // 姓名
        tel: true, // 联系电话
        permanentAddress: true, // 户籍地址
        currentAddress: true, //现居地址
      },
      // 申报信息
      projectDeclareInfo: {},
      // 卡片列表数据
      cardList: [],
    }
  },
  components: {
    ComponentButton,
    ComponentPanel,
    ComponentDeclare,
    ComponentDeclareStep,
    ComponentDeclareCard,
    ComponentDeclarePersonnel,
    ComponentDeclarePicker,
    ComponentSelectPermanentAddress,
    ComponentSelectAddressMultitype,
  },
  mixins: [useDeclare],
  // 监听页面加载，其参数为上个页面传递的数据，参数类型为Object（用于页面传参）
  onLoad(e) {
    this.handleOnLoad(e)
  },
  methods: {
    // 获取该申报项目的所需要的码表数据
    // aaz502、aac011、dac009、aac004、aac005、aae008、yesorno 不用再次获取
    // 编写格式参考达州20033项目
    async getCodeTableCacheData() {},
    // 捕获 cardList 不用修改
    handleChangeCardList(type, data) {
      this.cardList = [...data]
    },
    // 检测数据输入格式是否正确 须根据项目需求修改
    handleCheckInput() {
      const {
        n00180, //养殖规模
        n00181, //扑杀时间
        n00182, //扑杀原因
        n00183, //无害化处理方式
      } = this.projectDeclareInfo
      const cardList = this.cardList
      if (!n00180) {
        showModal('请输入养殖规模')
        return false
      }
      if (!n00181) {
        showModal('请选择扑杀时间')
        return false
      }
      if (!n00182) {
        showModal('请输入扑杀原因')
        return false
      }
      if (!n00183) {
        showModal('请输入无害化处理方式')
        return false
      }
      if (cardList.length == 0) {
        showModal('请添加禽畜捕杀信息')
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
        n00180, //养殖规模
        n00181, //扑杀时间
        n00182, //扑杀原因
        n00183, //无害化处理方式
      } = this.projectDeclareInfo

      const {
        currentAddress, //现居地址
      } = this.basicInfo
      const cardList = this.cardList
      const hp15List = []
      let total = 0

      cardList.map((item) => {
        total = total + Number(item.money)
        hp15List.push({
          chp15i: item.type,
          chp15j: item.weight,
          chp15k: item.quantity,
          chp15h: item.each,
          chp158: item.money,
        })
      })

      // 扩展字段
      let hb00BizMap = {
        n00041: currentAddress, //现居住地址
        n00180, //养殖规模
        n00181, //扑杀时间
        n00182, //扑杀原因
        n00183, //无害化处理方式
        aae019: total, //合计发放金额
        chb01m: '1', // 发放类型 正常发放
        aae209: useGetCurrentDate('month', ''), // 发放期号 当前申报年月
      }

      this.handleDeclareData(hb00BizMap, '0', null, null, null, hp15List)
    },
  },
}
</script>

<style lang="scss" scoped></style>
