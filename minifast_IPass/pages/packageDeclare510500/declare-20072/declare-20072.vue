<!-- 城镇住房保障家庭租赁补贴资金（住房和城乡建设局） -->
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
        permanentAddressLabel="房屋租赁地址"
        permanentAddressPlaceholder="请选择房屋租赁地址"
        buttonName="复用房屋租赁地址"
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

    <div class="space-top-wrapper">
      <ComponentPanel title="申报信息">
        <div class="panel-content">
          <div class="cell-items">
            <ComponentSelectAddressMultitype
              label="私房房屋坐落"
              placeholder="请选择或输入私房房屋坐落"
              buttonName="复用房屋租赁地址"
              :isShowBtn="renderObj.permanentAddress"
              @clickBtn="projectDeclareInfo.z00037 = basicInfo.permanentAddress"
              v-model="projectDeclareInfo.z00037"
            >
            </ComponentSelectAddressMultitype>
            <div class="cell-item required">
              <div class="key">自有私房面积</div>
              <div class="value">
                <input
                  type="number"
                  maxlength="6"
                  v-model="projectDeclareInfo.z00036"
                  placeholder="请输入自有私房面积"
                />
              </div>
            </div>
            <div class="cell-item required">
              <div class="key">租房私房面积</div>
              <div class="value">
                <input
                  type="number"
                  maxlength="6"
                  v-model="projectDeclareInfo.z00038"
                  placeholder="请输入租房私房面积"
                />
              </div>
            </div>
            <div class="cell-item required">
              <div class="key">月租金</div>
              <div class="value">
                <input
                  type="number"
                  maxlength="6"
                  v-model="projectDeclareInfo.z00039"
                  placeholder="请输入月租金"
                />
              </div>
            </div>

            <div class="cell-item required">
              <div class="key">申请家庭保障人数</div>
              <div class="value">
                <input
                  type="number"
                  maxlength="3"
                  v-model="projectDeclareInfo.z00040"
                  placeholder="请输入申请家庭保障人数"
                />
              </div>
            </div>
            <div class="cell-item required">
              <div class="key">应享受面积</div>
              <div class="value">
                <input type="number" maxlength="6" v-model="projectDeclareInfo.z00041" placeholder="请输入应享受面积" />
              </div>
            </div>
            <div class="cell-item required">
              <div class="key">应扣除面积</div>
              <div class="value">
                <input type="number" maxlength="6" v-model="projectDeclareInfo.z00042" placeholder="请输入应扣除面积" />
              </div>
            </div>
            <div class="cell-item required">
              <div class="key">应补贴面积</div>
              <div class="value">
                <input type="number" maxlength="6" v-model="projectDeclareInfo.z00043" placeholder="请输入应补贴面积" />
              </div>
            </div>
            <ComponentDeclarePicker
              label="租房开始时间"
              mode="date"
              fields="day"
              placeholder="请选择租房开始时间"
              v-model="projectDeclareInfo.z00044"
            ></ComponentDeclarePicker>
            <ComponentDeclarePicker
              label="租房结束时间"
              mode="date"
              fields="day"
              placeholder="请选择租房结束时间"
              v-model="projectDeclareInfo.z00045"
            ></ComponentDeclarePicker>
          </div>
        </div>
      </ComponentPanel>
    </div>
    <!-- 家庭保障成员信息 -->
    <div class="space-top-wrapper">
      <ComponentPanel title="家庭保障成员信息">
        <ComponentDeclareCard
          :renderData="cardList"
          type="20072"
          addButtonName="家庭保障成员信息"
          @change="handleChangeCardList"
        ></ComponentDeclareCard>
      </ComponentPanel>
    </div>
    <!-- end  需要修改的地方结束 在以下代码中根据项目需求更改 下面代码勿动-->
    <div class="button-wrapper">
      <ComponentButton @click="handleJumpNextStep" name="下一步" type="primary"></ComponentButton>
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
import ComponentDeclareCard from '@/components/project/ez-declare-card/ez-declare-card.vue'
import ComponentDeclarePersonnel from '@/components/project/ez-declare-personnel/ez-declare-personnel.vue'
import ComponentDeclareRadio from '@/components/project/ez-declare-radio/ez-declare-radio.vue'
import ComponentDeclarePicker from '@/components/project/ez-declare-picker/ez-declare-picker.vue'
import ComponentSelectAddressMultitype from '@/components/project/ez-select-address-multitype/ez-select-address-multitype.vue'
import { useDeclare } from '@/mixins'

import { getIsDev } from '@/utils/get'
import { checkIDCard, checkPhoneNumber } from '@/utils/check'
import { getCodeListByCodeName } from '@/utils/custom-api'
import { navigateBack, showModal } from '@/utils/uni-api'
export default {
  name: 'pageDeclare20072',
  data() {
    return {
      // 基本信息 渲染配置
      renderObj: {
        idCard: true, // 身份证
        userName: true, // 姓名
        tel: true, // 联系电话
        gender: true, // 性别
        nation: true, // 民族
        age: true, // 年龄
        permanentAddress: true, // 户籍地址
        currentAddress: true, // 现居住地址
      },

      // 自定义添加一些属性 防止双向绑定失败 例如 picker组件之类

      projectDeclareInfo: {
        z00037: '', //
        z00044: '', //
        z00045: '', //
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

  // 监听页面初次渲染完成
  onReady() {},
  // 监听页面显示
  onShow() {},
  // 监听页面隐藏
  onHide() {},
  methods: {
    // 捕获 cardList 不用修改
    handleChangeCardList(type, data) {
      this.cardList = [...data]
    },
    // 获取该申报项目的所需要的码表数据
    // aaz502、aac011、dac009、aac004、aac005、aae008、yesorno 不用再次获取
    // 编写格式参考达州20033项目
    async getCodeTableCacheData() {},

    // 检测数据输入格式是否正确 须根据项目需求更改
    handleCheckInput() {
      const {
        z00037, // 私房房屋坐落
        z00036, // 自有私房面积
        z00038, // 租住私房面积
        z00039, // 月租金
        z00040, // 申请家庭保障人数
        z00041, // 应享受面积
        z00042, // 应扣除面积
        z00043, // 应补贴面积
        z00044, // 租房开始时间
        z00045, // 租房结束时间
      } = this.projectDeclareInfo

      const cardList = this.cardList

      if (!z00037) {
        showModal('请选择或输入私房房屋坐落！')
        return false
      }
      if (!z00036) {
        showModal('请输入自有私房面积')
        return false
      }
      if (!z00038) {
        showModal('请输入租住私房面积')
        return false
      }
      if (!z00039) {
        showModal('请输入月租金')
        return false
      }
      if (!z00040) {
        showModal('请输入申请家庭保障人数')
        return false
      }
      if (!z00041) {
        showModal('请输入应享受面积')
        return false
      }
      if (!z00042) {
        showModal('请输入应扣除面积')
        return false
      }
      if (!z00043) {
        showModal('请输入应补贴面积')
        return false
      }
      if (!z00044) {
        showModal('请选择租房开始时间')
        return false
      }
      if (!z00045) {
        showModal('请选择租房结束时间')
        return false
      }
      if (cardList.length == 0) {
        showModal('请添加家庭保障成员信息')
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
        nation, // 民族
        age, // 年龄
        gender, // 性别
        permanentAddress, // 户籍地址
        currentAddress, // 现居住地址
      } = this.basicInfo

      const cardList = this.cardList

      const {
        z00037, // 私房房屋坐落
        z00036, // 自有私房面积
        z00038, // 租住私房面积
        z00039, // 月租金
        z00040, // 申请家庭保障人数
        z00041, // 应享受面积
        z00042, // 应扣除面积
        z00043, // 应补贴面积
        z00044, // 租房开始时间
        z00045, // 租房结束时间
      } = this.projectDeclareInfo

      // 扩展字段

      const hb00BizMap = {
        aac005: nation, // 民族
        chb00l: age, // 年龄
        aac004: gender, // 性别
        aae006: permanentAddress, //户籍地址
        c00015: currentAddress, // 现居住地址
        z00037, // 私房房屋坐落
        z00036, // 自有私房面积
        z00038, // 租住私房面积
        z00039, // 月租金
        z00040, // 申请家庭保障人数
        z00041, // 应享受面积
        z00042, // 应扣除面积
        z00043, // 应补贴面积
        z00044, // 租房开始时间
        z00045, // 租房结束时间
      }

      let hp03List = []

      cardList.map((item) => {
        hp03List.push({
          aac003: item.name, // 姓名
          aac002: item.idCard, // 身份证
          c00024: item.relationship_desc, // 与申请人关系
          c00316: item.work, // 工作单位
        })
      })
      this.handleDeclareData(hb00BizMap, '0')
    },
  },
  computed: {},
  watch: {},
}
</script>

<style lang="scss" scoped></style>
