<!-- 非义务教育阶段贫困学生资助 教育局 -->
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
            <ComponentSelectAddressMultitype
              label="家庭地址"
              placeholder="请选择或输入家庭地址"
              :isShowBtn="renderObj.permanentAddress"
              @clickBtn="projectDeclareInfo.chb0go = basicInfo.permanentAddress"
              v-model="projectDeclareInfo.chb0go"
            >
            </ComponentSelectAddressMultitype>

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
              <div class="key">现就读学校</div>
              <div class="value">
                <input
                  type="text"
                  v-model="projectDeclareInfo.j00001"
                  placeholder="请输入现就读学校"
                />
              </div>
            </div>

            <div class="cell-item required">
              <div class="key">专业</div>
              <div class="value">
                <input
                  type="text"
                  v-model="projectDeclareInfo.j00023"
                  placeholder="请输入专业"
                />
              </div>
            </div>
            <ComponentDeclarePicker
              label="学历层次"
              idName="j51001"
              :range="codeMap.j00074"
              placeholder="请选择学历层次"
              v-model="projectDeclareInfo.j51001"
            >
            </ComponentDeclarePicker>
          </div>
        </div>
      </ComponentPanel>
    </div>

    <!-- 家庭成员信息 -->
    <div class="space-top-wrapper">
      <ComponentPanel title="主要家庭成员信息">
        <ComponentDeclareCard
          :renderData="cardList"
          type="20300"
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
import ComponentSelectAddressMultitype from '@/components/project/ez-select-address-multitype/ez-select-address-multitype.vue'
import { useDeclare } from '@/mixins'

import { getIsDev } from '@/utils/get'
import { getCodeListByCodeName } from '@/utils/custom-api'
import { showModal } from '@/utils/uni-api'

export default {
  name: 'pageDeclare20300',
  data() {
    return {
      // 基本信息 渲染配置
      renderObj: {
        idCard: true, // 身份证
        userName: true, // 姓名
        tel: true, // 联系电话
        gender: true, // 性别
        birthday: true, // 出生年月
        nation: true, // 民族
        permanentAddress: true, // 户籍地址
      },
      projectDeclareInfo: {
        chb0go: '',
      },
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
    // 获取该申报项目的所需要的码表数据
    // aaz502、aac011、dac009、aac004、aac005、aae008、yesorno 不用再次获取
    // 编写格式参考达州20033项目
    async getCodeTableCacheData() {
      const isDev = getIsDev() // 当前环境是否是开发环境
      let j00074 = [] // 申请人当前学历

      try {
        j00074 = await getCodeListByCodeName('j00074')
      } catch (err) {
        if (isDev) {
          console.log('code table j00074 error：', err)
        }
      }

      this.codeMap = {
        ...this.codeMap,
        j00074,
      }
    },
    // 捕获 cardList 不用修改
    handleChangeCardList(type, data) {
      this.cardList = [...data]
    },
    // 检测数据输入格式是否正确 须根据项目需求更改
    handleCheckInput() {
      const {
        aac004, // 性别
        aac005, // 民族
        j00059, // 出生年月

        chb0go, // 家庭地址
        j00001, // 现就读学校
        j00023, // 专业名称
        j51001, // 学历层次
        j00051, // 高中毕业学校
      } = this.projectDeclareInfo
      const cardList = this.cardList
      if (!chb0go) {
        showModal('请选择或输入家庭地址')
        return false
      }
      if (!j00051) {
        showModal('请选择高中毕业学校')
        return false
      }
      if (!j00001) {
        showModal('请输入现就读学校')
        return false
      }
      if (!j00023) {
        showModal('请输入专业名称')
        return false
      }
      if (!j51001) {
        showModal('请选择学历层次')
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
      const {
        gender, // 性别
        birthday, // 出生年月
        nation, // 民族
      } = this.basicInfo

      const {
        chb0go, // 家庭地址
        j00001, // 现就读学校
        j00023, // 专业名称
        j51001, // 学历层次
        j00051, // 高中毕业学校
      } = this.projectDeclareInfo

      // 扩展字段
      const hb00BizMap = {
        aac004: gender, // 性别
        aac005: nation, // 民族
        j00059: birthday, // 出生年月

        chb0go, // 家庭地址
        j00001, // 现就读学校
        j00023, // 专业名称
        j51001, // 学历层次
        j00051, // 高中毕业学校
      }
      let hp03List = []
      cardList.map((item) => {
        hp03List.push({
          aac002: item.idCard, // 身份证
          aac003: item.name, // 姓名
          chp034: item.age, // 年龄
          chp031: item.relationship_desc, // 关系
          aac111: item.job, // 职业
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
