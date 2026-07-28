<!-- 家庭经济困难大学生资助 -->
<template>
  <view class="declare">
    <!-- 当前申报流程 -->
    <div class="progress-wrapper">
      <ComponentDeclareStep :current="2"></ComponentDeclareStep>
    </div>

    <!-- 申报人或者代办人基本信息 -->
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
        addressRemove="2239419"
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
            <div class="cell-item required">
              <div class="key">高中毕业学校</div>
              <div class="value">
                <input
                  type="text"
                  v-model="projectDeclareInfo.j00051"
                  placeholder="请输入高中毕业学校"
                />
              </div>
            </div>

            <div class="cell-item required">
              <div class="key">就读学校名称</div>
              <div class="value">
                <input
                  type="text"
                  v-model="projectDeclareInfo.j00001"
                  placeholder="请输入就读学校名称"
                />
              </div>
            </div>

            <div class="cell-item required">
              <div class="key">专业名称</div>
              <div class="value">
                <input
                  type="text"
                  v-model="projectDeclareInfo.j00023"
                  placeholder="请输入专业名称"
                />
              </div>
            </div>

            <ComponentDeclarePicker
              label="录取学历层次"
              idName="j51001"
              :range="codeMap.j51001"
              placeholder="请选择学历层次"
              v-model="projectDeclareInfo.j51001"
            >
            </ComponentDeclarePicker>
          </div>
        </div>
      </ComponentPanel>
    </div>

    <!-- 添加家庭其他成员 -->
    <div class="space-top-wrapper">
      <ComponentPanel title="添加家庭其他成员">
        <ComponentDeclareCard
          :renderData="cardList1"
          type="200182"
          addButtonName="添加家庭其他成员"
          @change="handleChangeCardList1"
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

import { getCodeListByCodeName } from '@/utils/custom-api'
import { showModal } from '@/utils/uni-api'

export default {
  name: 'pageDeclare200182',
  data() {
    return {
      // 基本信息 渲染配置
      renderObj: {
        idCard: true, // 身份证
        userName: true, // 姓名
        nation: true, // 民族
        tel: true, // 联系电话
        gender: true, // 性别
        birthday: true, // 出生年月
        permanentAddress: true, // 户籍地址
      },
      projectDeclareInfo: {},
      cardList1: [],
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
      let j51001 = [] // 申请人当前学历

      try {
        j51001 = await getCodeListByCodeName('J51001_GZ')
      } catch (err) {
        console.error('code table j51001 error：', err)
      }

      this.codeMap = {
        ...this.codeMap,
        j51001,
      }
    },
    // 捕获 cardList 不用修改
    handleChangeCardList1(type, data) {
      this.cardList1 = [...data]
    },
    // 检测数据输入格式是否正确 须根据项目需求更改
    handleCheckInput() {
      const {
        j00051, // 高中毕业学校
        j00001, // 就读学校名称
        j00023, // 专业名称
        j51001, // 录取学历层次
      } = this.projectDeclareInfo
      if (!j00051) {
        showModal('请输入高中毕业学校')
        return false
      }
      if (!j00001) {
        showModal('请输入就读学校名称')
        return false
      }
      if (!j00023) {
        showModal('请输入专业名称')
        return false
      }
      if (!j51001) {
        showModal('请选择录取学历层次')
        return false
      }
      if (this.cardList1.length == 0) {
        showModal('请添加其他家庭成员信息')
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
      const cardList1 = this.cardList1
      const {
        birthday, // 出生年月
        permanentAddress, // 户籍地址
        nation,
      } = this.basicInfo

      const {
        j00051, // 高中毕业学校
        j00001, // 就读学校名称
        j00023, // 专业名称
        j51001, // 录取学历层次
      } = this.projectDeclareInfo

      // 扩展字段
      const hb00BizMap = {
        j00059: birthday, // 出生年月
        aae006: permanentAddress, // 户籍地址
        j00051, // 高中毕业学校
        j00001, // 就读学校名称
        j00023, // 专业名称
        j51001, // 录取学历层次
        aac005: nation,
      }

      const hp03List = []

      //新加其他家庭成员信息
      cardList1.map((item) => {
        hp03List.push({
          chp031: item.relationship_desc, // 与申请人关系
          aac003: item.name, // 姓名
          aac111: item.job,
          chp034: item.age,
        })
      })
      this.handleDeclareData(hb00BizMap, '0', null, hp03List)
    },
  },
  computed: {},
  watch: {},
}
</script>

<style lang="scss" scoped></style>
