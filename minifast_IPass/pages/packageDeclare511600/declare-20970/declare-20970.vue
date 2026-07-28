<!-- 邓小平故里扶贫救助基金（教育局） -->
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
		permanentAddressLabel='受理地址'
		permanentAddressPlaceholder='请选择申报受理地址'
        @changeDeclareType="handleChangeDeclareType"
        @changeBasicInfo="handleChangeBasicInfo"
        @changeCodeMap="handleChangeCodeMap"
        @changeAgentInfo="handleChangeAgentInfo"
        @changeDataByIdCard="handleChangeDataByIdCard"
        @changeDataByIdCardBank="handleChangeDataByIdCardBank"
        :addressFilter="['511642']"
      >
      </ComponentDeclare>
    </div>
    <!-- 165003 -->

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
                <ComponentDeclarePicker
                  label="学段"
                  idName="j00010"
                  :range="codeMap.j00010_5"
                  v-model="projectDeclareInfo.j00010"
                  placeholder="请选择学段"
                ></ComponentDeclarePicker>
                <block>
                  <div class="cell-item required">
                    <div class="key">学校名称</div>
                    <div class="value">
                      <input
                        type="text"
                        maxlength="12"
                        v-model="projectDeclareInfo.j00001desc"
                        placeholder="请输入学校名称"
                      />
                    </div>
                  </div>
                </block>
                <div class="cell-item required">
                  <div class="key">专业名称</div>
                  <div class="value">
                    <input
                      type="text"
                      maxlength="12"
                      v-model="projectDeclareInfo.j00023"
                      placeholder="请输入专业名称"
                    />
                  </div>
                </div>
                <ComponentDeclarePicker
                  mode="date"
                  fields="day"
                  label="入学时间"
                  align="right"
                  :endTime="today_d"
                  placeholder="请选择入学时间"
                  v-model="projectDeclareInfo.chb0g1"
                ></ComponentDeclarePicker>
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
          type="20014"
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
import ComponentDeclareCard from '../components/ez-declare-card/ez-declare-card.vue'
import ComponentDeclarePersonnel from '@/components/project/ez-declare-personnel/ez-declare-personnel.vue'
import ComponentDeclarePicker from '@/components/project/ez-declare-picker/ez-declare-picker.vue'

import { useDeclare } from '@/mixins'

import { getDate, getIsDev } from '@/utils/get'
import { getCodeListByCodeName } from '@/utils/custom-api'
import { showModal } from '@/utils/uni-api'
export default {
  name: 'pageDeclare20970',
  data() {
    return {
      // 基本信息 渲染配置
      renderObj: {
        idCard: true, // 身份证
        userName: true, // 姓名
        tel: true, // 联系电话
        gender: true, //性别
        nation: true, // 民族
        permanentAddress: true, // 户籍地址
      },
      // 自定义添加一些属性 防止双向绑定失败 例如 picker组件之类
      projectDeclareInfo: {
        j00010: '',
      },
      // 卡片列表数据
      cardList: [],
      today_d: getDate('day'),
      address: '',
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
      const isDev = getIsDev() // 当前环境是否是开发环境
      let j00010_5 = [] // 学段
      try {
        j00010_5 = await getCodeListByCodeName('j00010_5')
      } catch (err) {
        if (isDev) {
          console.log('code table j00010_5 error：', err)
        }
      }
      this.codeMap = {
        ...this.codeMap,
        j00010_5,
      }
    },
    // 捕获 cardList 不用修改
    handleChangeCardList(type, data) {
      this.cardList = [...data]
    },

    handleCheckInput() {
      const {
        j00010, // 学段
        j00023, // 专业名称
        j00001desc, // 学校名称
        aae019, // 发放金额
        chb0g1, // 入学时间
      } = this.projectDeclareInfo
      const cardList = this.cardList
      if (!j00010) {
        showModal('请选择学段')
        return false
      }
      if (!j00001desc) {
        showModal('请输入学校名称')
        return false
      }
      if (!j00023) {
        showModal('请输入专业名称')
        return false
      }
      if (!chb0g1) {
        showModal('请选择入学时间')
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
      const { nation, gender } = this.basicInfo
      const cardList = this.cardList

      const {
        j00010, // 学段
        j00023, // 专业名称
        j00001desc, // 学校名称
        aae019, // 发放金额
        chb0g1, // 入学时间
      } = this.projectDeclareInfo

      // 扩展字段
      let hb00BizMap = {
        aac004: gender,
        aac005: nation,
        j00010, // 学段
        j00023, // 专业名称
        j00001desc, // 学校名称
        chb0g1, // 入学时间
        aae019: '', // 发放金额
      }

      const hp03List = []

      cardList.map((item) => {
        hp03List.push({
          aac003: item.name, // 姓名
          aac004: item.gender_desc, // 性别
          chp034: item.age, // 年龄
          chp031: item.relationship_desc, // 关系
          chb48b: item.workAdress, // 工作学习单位
          aac111: item.job, // 职业
          chb485: item.healthy_desc, // 健康状况
          chp032: item.wages, // 年收入
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
