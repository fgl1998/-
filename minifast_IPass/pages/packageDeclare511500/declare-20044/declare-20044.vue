<!-- 地质灾害避险搬迁安置 自然资源和规划局 -->
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
        @changeDataByIdCardBank="handleChangeDataByIdCardBank"
      >
      </ComponentDeclare>
    </div>

    <div class="personnel-type-wrapper space-top-wrapper">
      <ComponentDeclarePersonnel
        :renderData="personnelList"
        :isOpenCategoryNotes="true"
        @change="handleChangePersonnelInfo"
      ></ComponentDeclarePersonnel>
    </div>

    <!-- start 需要修改的地方开始 在以下代码中根据项目需求更改 上面代码勿动 -->
    <!-- 申报信息 -->
    <div class="space-top-wrapper">
      <ComponentPanel title="申报信息">
        <div class="panel-content">
          <div class="cell-items">
            <ComponentSelectAddressMultitype
              label="现居地址"
              placeholder="请选择现居地址"
              :isShowBtn="renderObj.permanentAddress"
              @clickBtn="projectDeclareInfo.a00019 = basicInfo.permanentAddress"
              v-model="projectDeclareInfo.a00019"
            >
            </ComponentSelectAddressMultitype>

            <div class="cell-item required">
              <div class="key">隐患点名称</div>
              <div class="value">
                <input
                  type="text"
                  v-model="projectDeclareInfo.a00011"
                  placeholder="请输入隐患点名称"
                />
              </div>
            </div>
          </div>
        </div>
      </ComponentPanel>
    </div>

    <!-- 家庭成员信息 -->
    <div class="space-top-wrapper">
      <ComponentPanel title="家庭成员信息">
        <ComponentDeclareCard
          :renderData="cardList"
          type="20044"
          addButtonName="添加家庭成员"
          @change="handleChangeCardList"
        ></ComponentDeclareCard>
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
import ComponentSelectAddressMultitype from '@/components/project/ez-select-address-multitype/ez-select-address-multitype.vue'
import ComponentDeclareCard from '@/components/project/ez-declare-card/ez-declare-card.vue'
import ComponentDeclarePersonnel from '@/components/project/ez-declare-personnel/ez-declare-personnel.vue'

import { useDeclare } from '@/mixins'
import { useGetCurrentDate } from '@/hooks/common'
import { showModal } from '@/utils/uni-api'
export default {
  name: 'pageDeclare20044',
  data() {
    return {
      today: useGetCurrentDate(),
      // 基本信息 渲染配置
      renderObj: {
        idCard: true, // 身份证
        userName: true, // 姓名
        tel: true, // 联系电话
        permanentAddress: true, // 户籍地址
        // SSCBankCardNumber: true, // 社保卡银行卡号
        // SSCBankCardCategory: true, // 社保卡银行卡类别
      },
      // 自定义添加一些属性 防止双向绑定失败 例如 picker组件之类
      projectDeclareInfo: {
        a00019: '',
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
    ComponentSelectAddressMultitype,
    ComponentDeclareCard,
    ComponentDeclarePersonnel,
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
    // 捕获 cardList 不用修改
    handleChangeCardList(type, data) {
      this.cardList = [...data]
    },

    handleCheckInput() {
      const {
        a00019, //现居住地址
        a00011, //隐患点名称

        aae005, //联系电话
      } = this.projectDeclareInfo
      const cardList = this.cardList
      if (!a00019) {
        showModal('请选择或输入现居住地址')
        return false
      }
      if (!a00011) {
        showModal('请输入隐患点名称')
        return false
      }

      if (cardList.length == 0) {
        showModal('请添加家庭成员')
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
      const cardList = this.cardList

      const { tel } = this.basicInfo

      const {
        a00019, //现居住地址
        a00011, //隐患点名称
      } = this.projectDeclareInfo

      // 扩展字段
      let hb00BizMap = {
        a00019, //现居住地址
        a00011, //隐患点名称
        aae005: tel, //联系电话
      }

      const hp03List = []

      cardList.map((item) => {
        hp03List.push({
          aac003: item.name,
          aac002: item.idCard,
          chp031: item.relationship,
        })
      })

      this.handleDeclareData(hb00BizMap, '1', null, hp03List)
    },
  },
  computed: {},
  watch: {},
}
</script>

<style lang="scss" scoped></style>
