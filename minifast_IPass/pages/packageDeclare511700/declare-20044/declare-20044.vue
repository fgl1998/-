<!-- 地质灾害避险搬迁安置补助 -->
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
        isOpenOCR
        :projectNumber="chi031"
        :projectName="chi031_desc"
        addressFilter="1569457,1569460,1569463,1569466,1569472,1569475,1569469,1569481,2095930"
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
            <ComponentDeclarePicker
              label="搬迁年度"
              mode="date"
              fields="year"
              startTime="2019-01-01"
              :endTime="today_y"
              placeholder="请选择搬迁年度"
              v-model="projectDeclareInfo.a00016"
            ></ComponentDeclarePicker>
            <ComponentDeclarePicker
              label="搬迁完成时间"
              mode="date"
              fields="day"
              startTime="2019-01-01"
              :endTime="today_d"
              placeholder="请选择搬迁完成时间"
              v-model="projectDeclareInfo.a00021"
            ></ComponentDeclarePicker>
            <!-- 安置地区 -->
            <!-- <ComponentSelectAddressMultitype
              label="安置地区"
              placeholder="请选择或输入安置地区"
              :isShowBtn="renderObj.permanentAddress"
              @clickBtn="projectDeclareInfo.a00019 = basicInfo.permanentAddress"
              v-model="projectDeclareInfo.a00019"
            >
            </ComponentSelectAddressMultitype> -->
            <ComponentSelectPermanentAddress
              label="安置地区"
              placeholder="请选择安置地区"
              v-model="projectDeclareInfo.a00019"
            ></ComponentSelectPermanentAddress>
          </div>
        </div>
      </ComponentPanel>
    </div>

    <!-- 户主信息 -->
    <div class="space-top-wrapper">
      <ComponentPanel title="户主信息">
        <div class="panel-content">
          <div class="cell-items">
            <div class="cell-item required">
              <div class="key">姓名</div>
              <div class="value">
                <input
                  type="text"
                  v-model="projectDeclareInfo.a00024"
                  placeholder="请输入户主的姓名"
                />
              </div>
            </div>
            <div class="cell-item required">
              <div class="key">身份证号</div>
              <div class="value">
                <input
                  type="idcard"
                  maxlength="18"
                  v-model="projectDeclareInfo.a00025"
                  @blur="handleBlur01"
                  placeholder="请输入户主的身份证号"
                />
              </div>
            </div>
            <div class="cell-item required">
              <div class="key">联系电话</div>
              <div class="value">
                <input
                  type="number"
                  maxlength="11"
                  v-model="projectDeclareInfo.a00026"
                  placeholder="请输入户主联系电话"
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
import ComponentDeclareCard from '../components/ez-declare-card/ez-declare-card.vue'
import ComponentDeclarePersonnel from '@/components/project/ez-declare-personnel/ez-declare-personnel.vue'
import ComponentDeclarePicker from '@/components/project/ez-declare-picker/ez-declare-picker.vue'
// import ComponentSelectAddressMultitype from '@/components/project/ez-select-address-multitype/ez-select-address-multitype.vue'
import ComponentSelectPermanentAddress from '@/components/project/ez-select-permanent-address/ez-select-permanent-address.vue'
import { useDeclare } from '@/mixins'

import { getDate } from '@/utils/get'
import { checkIDCard, checkPhoneNumber } from '@/utils/check'
import { showModal } from '@/utils/uni-api'
export default {
  name: 'pageDeclare20044',
  data() {
    return {
      today_y: getDate('year'),
      today_d: getDate('day'),
      renderObj: {
        idCard: true, // 身份证
        userName: true, // 姓名
        tel: true, // 联系电话
        permanentAddress: true // 户籍地址
      },
      // 申报信息
      projectDeclareInfo: {
        a00019: '' // 安置地区
      },
      // 卡片列表数据
      cardList: []
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
    // ComponentSelectAddressMultitype,
    ComponentSelectPermanentAddress
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
    // 户主身份证号 失去焦点监听
    handleBlur01(e) {
      const { value } = e.target
      const checkResult = checkIDCard(value, '户主身份证号')
      if (checkResult.status === '0') {
        showModal(checkResult.msg)
      }
    },

    // 检测数据输入格式是否正确 须根据项目需求修改
    handleCheckInput() {
      const {
        a00016, // 搬迁年度
        a00019, // 安置地区
        a00021, // 搬迁完成时间
        a00024, // 户主姓名
        a00025, // 户主身份证号
        a00026 // 户主联系方式
      } = this.projectDeclareInfo

      const cardList = this.cardList

      if (!a00016) {
        showModal('请选择搬迁年度')
        return false
      }
      if (!a00021) {
        showModal('请选择搬迁完成时间')
        return false
      }
      if (!a00019) {
        showModal('请选择或输入安置地区')
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

      if (!a00026) {
        showModal('请输入户主联系方式')
        return false
      } else {
        const checkResult = checkPhoneNumber(a00026, '户主联系电话')
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

    // 下一步 须根据项目需求修改
    handleJumpNextStep() {
      if (!this.handleCheckComponentInput()) {
        return
      }
      if (!this.handleCheckInput()) {
        return
      }

      const cardList = this.cardList

      const {
        a00016, // 搬迁年度
        a00019, // 安置地区
        a00021, // 搬迁完成时间
        a00024, // 户主姓名
        a00025, // 户主身份证号
        a00026 // 户主联系方式
      } = this.projectDeclareInfo

      // 扩展字段
      let hb00BizMap = {
        a00016, // 搬迁年度
        a00019, // 安置地区
        a00021, // 搬迁完成时间
        a00024, // 户主姓名
        a00025, // 户主身份证号
        a00026 // 户主联系方式
      }

      let hp03List = []

      cardList.map((item) => {
        hp03List.push({
          aac003: item.name,
          aac002: item.idCard,
          chp031: item.relationship
        })
      })
      this.handleDeclareData(hb00BizMap, '1', null, hp03List)
    }
  },
  computed: {},
  watch: {}
}
</script>

<style lang="scss" scoped></style>
