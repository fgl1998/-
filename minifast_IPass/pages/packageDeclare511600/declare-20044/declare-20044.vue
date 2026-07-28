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
        :isOpenOCR="true"
		permanentAddressLabel='受灾地址'
		permanentAddressPlaceholder='受灾地址作为受理地址'
        @changeDeclareType="handleChangeDeclareType"
        @changeBasicInfo="handleChangeBasicInfo"
        @changeCodeMap="handleChangeCodeMap"
        @changeAgentInfo="handleChangeAgentInfo"
        @changeDataByIdCard="handleChangeDataByIdCard"
        @changeDataByIdCardBank="handleChangeDataByIdCardBank"
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

    <!-- 申报信息 -->
    <div class="space-top-wrapper">
      <ComponentPanel title="申报信息">
        <div class="panel-content">
          <div class="cell-items">
            <div class="panel-content">
              <div class="cell-items">
                <ComponentSelectAddressMultitype
                  label="安置地区"
                  placeholder="请选择安置地区"
                  :isShowBtn="renderObj.permanentAddress"
                  @clickBtn="
                    projectDeclareInfo.a00028 = basicInfo.permanentAddress
                  "
                  v-model="projectDeclareInfo.a00028"
                >
                </ComponentSelectAddressMultitype>

                <ComponentDeclarePicker
                  label="受灾年度"
                  idName="a00016"
                  mode="date"
                  fields="year"
                  :endTime="today"
                  v-model="projectDeclareInfo.a00016"
                  placeholder="请选择受灾年度"
                ></ComponentDeclarePicker>
                <ComponentDeclarePicker
                  label="搬迁完成时间"
                  idName="a00021"
                  mode="date"
                  fields="day"
                  :endTime="today"
                  v-model="projectDeclareInfo.a00021"
                  placeholder="请选择搬迁完成时间"
                ></ComponentDeclarePicker>
                <div class="cell-item required">
                  <div class="key">户主姓名</div>
                  <div class="value">
                    <input
                      type="text"
                      maxlength="8"
                      v-model="projectDeclareInfo.a00024"
                      placeholder="请输入户主姓名"
                    />
                  </div>
                </div>
                <div class="cell-item required">
                  <div class="key">户主身份证号</div>
                  <div class="value">
                    <input
                      type="idcard"
                      maxlength="18"
                      v-model="projectDeclareInfo.a00025"
                      placeholder="请输入户主身份证号"
                    />
                  </div>
                </div>
                <div class="cell-item required disabled">
                  <div class="key">补贴金额</div>
                  <div class="value">35000元</div>
                </div>
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
import ComponentDeclarePicker from '@/components/project/ez-declare-picker/ez-declare-picker.vue'

import { useDeclare } from '@/mixins'

import { getDate } from '@/utils/get'
import { checkIDCard } from '@/utils/check'
import { showModal } from '@/utils/uni-api'
export default {
  name: 'pageDeclare20044',
  data() {
    return {
      today: getDate(),
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
        a00021: '',
        a00016: '',
        a00028: '',
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
    // 捕获 cardList 不用修改
    handleChangeCardList(type, data) {
      this.cardList = [...data]
    },

    handleCheckInput() {
      const {
        a00028, // 安置地区
        a00016, // 施工年度
        a00021, // 搬迁完成时间
        a00024, // 户主姓名
        a00025, // 户主身份证号

        aae019, // 发放金额
      } = this.projectDeclareInfo
      const cardList = this.cardList
      if (!a00028) {
        showModal('请选择或输入安置地区')
        return false
      }
      if (!a00016) {
        showModal('请选择受灾年度')
        return false
      }

      if (!a00021) {
        showModal('请选择搬迁完成时间')
        return false
      }
      if (!a00024) {
        showModal('请输入户主姓名')
        return false
      }
      if (!a00025) {
        showModal('请输入户主身份证号')
        return false
      } else {
        const checkResult = checkIDCard(a00025, '户主身份证号')
        if (checkResult.status === '0') {
          showModal(checkResult.msg)
          return false
        }
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

      const {
        a00028, // 安置地区
        a00016, // 施工年度
        a00021, // 搬迁完成时间
        a00024, // 户主姓名
        a00025, // 户主身份证号

        aae019, // 发放金额
      } = this.projectDeclareInfo

      // 扩展字段
      let hb00BizMap = {
        a00028, // 安置地区
        a00016, // 施工年度
        a00021, // 搬迁完成时间
        a00024, // 户主姓名
        a00025, // 户主身份证号

        aae019: '35000', // 发放金额
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
