<!-- 公共租赁住房租赁补贴（住建局） -->
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
        permanentAddressLabel="申请辖区"
        permanentAddressPlaceholder="请选择申请辖区"
        :projectNumber="chi031"
        :projectName="chi031_desc"
        @changeDeclareType="handleChangeDeclareType"
        @changeBasicInfo="handleChangeBasicInfo"
        @changeCodeMap="handleChangeCodeMap"
        @changeAgentInfo="handleChangeAgentInfo"
        @changeDataByIdCard="handleChangeDataByIdCard"
      ></ComponentDeclare>
    </div>

    <!-- start 需要修改的地方开始 在以下代码中根据项目需求更改 上面代码勿动 -->
    <div class="personnel-type-wrapper space-top-wrapper">
      <ComponentDeclarePersonnel
        :renderData="personnelList"
        :filterData="['2161']"
        @change="handleChangePersonnelInfo"
      ></ComponentDeclarePersonnel>
    </div>

    <!-- 申报信息 -->
    <div class="space-top-wrapper">
      <ComponentPanel title="申报信息">
        <div class="panel-content">
          <div class="cell-items">
            <!-- 						<ComponentSelectPermanentAddress
						  label="申请辖区"
						  placeholder="请选择申请辖区"
						  v-model="address"
						  @change="handleChangeAddress"
            ></ComponentSelectPermanentAddress>-->
            <ComponentDeclarePicker
              label="人员属性"
              idName="z00047"
              :range="codeMap.z00047"
              placeholder="请选择人员属性"
              v-model="projectDeclareInfo.z00047"
              @change="getPickerValueDesc"
            ></ComponentDeclarePicker>
            <ComponentDeclarePicker
              label="婚姻状况"
              idName="z00015"
              :range="codeMap.aac017"
              placeholder="请选择婚姻状况"
              v-model="projectDeclareInfo.z00015"
              @change="getPickerValueDesc"
            ></ComponentDeclarePicker>

            <ComponentDeclarePicker
              label="所属群体"
              idName="z00065"
              :range="codeMap.z00065"
              placeholder="请选择所属群体"
              v-model="projectDeclareInfo.z00065"
            ></ComponentDeclarePicker>

            <ComponentDeclarePicker
              label="残疾类别"
              idName="z00066"
              :range="codeMap.z00066"
              :required="false"
              placeholder="请选择残疾类别"
              v-model="projectDeclareInfo.z00066"
            ></ComponentDeclarePicker>

            <ComponentDeclarePicker
              label="残疾等级"
              idName="z00067"
              :range="codeMap.chb0h2"
              :required="false"
              placeholder="请选择残疾等级"
              v-model="projectDeclareInfo.z00067"
            ></ComponentDeclarePicker>

            <div class="cell-item required">
              <div class="key">家庭人数</div>
              <div class="value">
                <input
                  type="number"
                  maxlength="3"
                  v-model="projectDeclareInfo.z56203"
                  placeholder="请输入家庭人数"
                />
              </div>
            </div>
            <ComponentDeclarePicker
              label="租房合同开始时间"
              idName="z00048"
              placeholder="请选择开始时间"
              mode="date"
              fields="month"
              startTime="2000-01"
              :endTime="today"
              v-model="projectDeclareInfo.z00048"
            ></ComponentDeclarePicker>
            <ComponentDeclarePicker
              label="租房合同结束时间"
              idName="z00049"
              placeholder="请选择结束时间"
              mode="date"
              fields="month"
              :startTime="projectDeclareInfo.z00048"
              v-model="projectDeclareInfo.z00049"
            ></ComponentDeclarePicker>
            <ComponentDeclarePicker
              label="申请年度"
              idName="z00079"
              placeholder="请选择申请年度"
              mode="date"
              fields="year"
              :startTime="today"
              :endTime="nextYear"
              v-model="projectDeclareInfo.z00079"
            ></ComponentDeclarePicker>
          </div>
        </div>
      </ComponentPanel>
    </div>

    <!-- 共同申请人信息 -->
    <div class="space-top-wrapper">
      <ComponentPanel title="共同申请人信息">
        <ComponentDeclareCard
          :renderData="cardList"
          type="200001"
          addButtonName="添加共同申请人"
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
import ComponentDeclareCard from '../components/ez-declare-card/ez-declare-card.vue'
import ComponentDeclarePersonnel from '@/components/project/ez-declare-personnel/ez-declare-personnel.vue'
import ComponentDeclarePicker from '@/components/project/ez-declare-picker/ez-declare-picker.vue'

import { useDeclare } from '@/mixins'
import { useGetCurrentDate } from '@/hooks/common'
import { getCodeListByCodeName } from '@/utils/custom-api'
import { showModal } from '@/utils/uni-api'
export default {
  name: 'pageDeclare200002',
  data() {
    return {
      today: useGetCurrentDate(),
      nextYear: parseInt(useGetCurrentDate('year')) + 1,
      // 基本信息 渲染配置
      renderObj: {
        idCard: true, // 身份证
        userName: true, // 姓名
        tel: true, // 联系电话
        age: true, // 年龄
        gender: true, // 性别
        nation: true, // 民族
        currentAddress: true, // 现居住地址
        permanentAddress: true // 户籍地址
      },
      // 自定义添加一些属性 防止双向绑定失败 例如 picker组件之类
      projectDeclareInfo: {
        z00015: '',
        z00047: '',
        z00048: '',
        z00049: '',
        z00065: '',
        z00066: '',
        z00067: '',
        z00079: ''
      },
      address: '', // 申请辖区
      addressInfo: {
        chb015: '',
        chb017: '',
        chb018: ''
      },
      cardList: []
    }
  },
  components: {
    ComponentButton,
    ComponentPanel,
    ComponentDeclare,
    ComponentDeclareStep,
    ComponentSelectPermanentAddress,
    ComponentDeclareCard,
    ComponentDeclarePersonnel,
    ComponentDeclarePicker
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
    async getCodeTableCacheData() {
      let z00047 = [] // 人员属性
      let aac017 = [] // 婚姻状况
      let z00065 = [] // 所属群体
      let z00066 = [] // 残疾类别
      let chb0h2 = [] // 残疾等级

      try {
        z00047 = await getCodeListByCodeName('z00047')
      } catch (err) {
        console.error('code table z00047 error：', err)
      }
      try {
        aac017 = await getCodeListByCodeName('aac017')
      } catch (err) {
        console.error('code table aac017 error：', err)
      }
      try {
        z00065 = await getCodeListByCodeName('z00065')
      } catch (err) {
        console.error('code table z00065 error：', err)
      }

      try {
        z00066 = await getCodeListByCodeName('z00066')
      } catch (err) {
        console.error('code table z00066 error：', err)
      }

      try {
        chb0h2 = await getCodeListByCodeName('chb0h2')
      } catch (err) {
        console.error('code table chb0h2 error：', err)
      }
      this.codeMap = {
        ...this.codeMap,
        z00047,
        aac017,
        z00065,
        z00066,
        chb0h2
      }
    },
    // 捕获 cardList 不用修改
    handleChangeCardList(type, data) {
      this.cardList = [...data]
    },
    // 申请辖区选择变化触发
    handleChangeAddress(value) {
      let [{ orgid: chb015 }, { orgid: chb017 }, { orgid: chb018 }] = value
      this.addressInfo = {
        ...this.addressInfo,
        chb015,
        chb017,
        chb018
      }
    },
    // 检测数据输入格式是否正确 须根据项目需求更改
    handleCheckInput() {
      const {
        z00047, // 人员属性
        z00065, // 所属群体
        z00066, // 残疾类别
        z00067, // 残疾等级
        z00015, // 婚姻状况
        z56203, // 家庭人数
        z00048, // 租房合同开始时间
        z00049, // 租房合同结束时间
        z00079 // 申请年度
      } = this.projectDeclareInfo

      if (!z00047) {
        showModal('请选择人员属性')
        return false
      }
      if (!z00065) {
        showModal('请选择所属群体')
        return false
      }
      // if (!z00066) {
      //   showModal('请选择残疾类别')
      //   return false
      // }
      // if (!z00067) {
      //   showModal('请选择残疾等级')
      //   return false
      // }
      if (!z00015) {
        showModal('请选择婚姻状况')
        return false
      }
      if (!z56203) {
        showModal('请输入家庭人数')
        return false
      }
      if (!z00048) {
        showModal('请选择租房合同开始时间')
        return false
      }
      if (!z00049) {
        showModal('请选择租房合同结束时间')
        return false
      }
      if (!z00079) {
        showModal('请选择申请年度')
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
        permanentAddress, // 户籍地址
        currentAddress, // 现居住地址
        nation, // 民族
        age, // 年龄
        gender // 性别
      } = this.basicInfo

      const {
        z00047, // 人员属性
        z00065, // 所属群体
        z00066, // 残疾类别
        z00067, // 残疾等级
        z00015, // 婚姻状况
        z56203, // 家庭人数
        z00048, // 租房合同开始时间
        z00049, // 租房合同结束时间
        z00079 // 申请年度
      } = this.projectDeclareInfo

      // 扩展字段
      const hb00BizMap = {
        z00046: currentAddress, // 现居住地址
        z00018: permanentAddress, // 户籍地址
        aac004: gender, // 性别
        aac005: nation, // 民族
        chb00l: age, // 年龄
        z00047, // 人员属性
        z00065, // 所属群体
        z00066, // 残疾类别
        z00067, // 残疾等级
        z00015, // 婚姻状况
        z56203, // 家庭人数
        z00048, // 租房合同开始时间
        z00049, // 租房合同结束时间
        z00079 // 申请年度
      }

      const cardList = this.cardList
      const hp03List = []
      cardList.map(item => {
        hp03List.push({
          aac003: item.name,
          aac002: item.idCard,
          aae005: item.tel,
          chp032: item.income,
          chp052: item.unit,
          chp062: item.group,
          chb487: item.categories,
          chb488: item.grade
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
