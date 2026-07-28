<!-- 贫困学生引领表彰计划（教育局） -->
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
        permanentAddressLabel="就读学校"
        permanentAddressPlaceholder="请选择就读学校"
        @changeDeclareType="handleChangeDeclareType"
        @changeBasicInfo="handleChangeBasicInfo"
        @changeCodeMap="handleChangeCodeMap"
        @changeAgentInfo="handleChangeAgentInfo"
        @changeDataByIdCard="handleChangeDataByIdCard"
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

    <!-- 申报信息 -->
    <div class="space-top-wrapper">
      <ComponentPanel title="申报信息">
        <div class="panel-content">
          <div class="cell-items">
            <div class="cell-item required">
              <div class="key">监护人姓名</div>
              <div class="value">
                <input
                  type="text"
                  v-model="projectDeclareInfo.j00019"
                  placeholder="请输入监护人姓名"
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
              <div class="key">班级</div>
              <div class="value">
                <input
                  type="text"
                  v-model="projectDeclareInfo.j00012"
                  placeholder="请输入班级"
                />
              </div>
            </div>
            <div class="cell-item">
              <div class="key">学籍号</div>
              <div class="value">
                <input
                  type="number"
                  v-model="projectDeclareInfo.j00018"
                  placeholder="请输入学籍号"
                />
              </div>
            </div>
            <ComponentDeclarePicker
              label="贫困类型"
              idName="j00097"
              :range="codeMap.J00097_1"
              placeholder="请选择贫困类型"
              v-model="projectDeclareInfo.j00097"
              @change="getPickerValueDesc"
            ></ComponentDeclarePicker>
            <ComponentDeclarePicker
              label="表彰级别"
              idName="j00099"
              :range="codeMap.j00099"
              placeholder="请选择表彰级别"
              v-model="projectDeclareInfo.j00099"
              @change="getPickerValueDesc"
            ></ComponentDeclarePicker>
            <ComponentDeclarePicker
              label="表彰等次"
              idName="j00100"
              :range="codeMap.j00100"
              placeholder="请选择表彰等次"
              v-model="projectDeclareInfo.j00100"
              @change="getPickerValueDesc"
            ></ComponentDeclarePicker>
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
import ComponentDeclarePersonnel from '@/components/project/ez-declare-personnel/ez-declare-personnel.vue'
import ComponentDeclarePicker from '@/components/project/ez-declare-picker/ez-declare-picker.vue'

import { useDeclare } from '@/mixins'
import { getCodeListByCodeName } from '@/utils/custom-api'
import { showModal } from '@/utils/uni-api'
export default {
  name: 'pageDeclare20686',
  data() {
    return {
      // 基本信息 渲染配置
      renderObj: {
        idCard: true, // 身份证
        userName: true, // 姓名
        tel: true, // 联系电话
        gender: true, // 性别
        permanentAddress: true, // 户籍地址
      },
      // 自定义添加一些属性 防止双向绑定失败 例如 picker组件之类
      projectDeclareInfo: {},
    }
  },
  components: {
    ComponentButton,
    ComponentPanel,
    ComponentDeclare,
    ComponentDeclareStep,
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
      let J00097_1 = [] // 贫困类型
      let j00099 = [] // 表彰级别
      let j00100 = [] // 表彰等次
      try {
        J00097_1 = await getCodeListByCodeName('J00097_1')
      } catch (err) {
        console.error('code table J00097_1 error：', err)
      }
      try {
        j00099 = await getCodeListByCodeName('j00099')
      } catch (err) {
        console.error('code table j00099 error：', err)
      }
      try {
        j00100 = await getCodeListByCodeName('j00100')
      } catch (err) {
        console.error('code table j00100 error：', err)
      }

      this.codeMap = {
        ...this.codeMap,
        J00097_1,
        j00099,
        j00100,
      }
    },
    // 检测数据输入格式是否正确 须根据项目需求更改
    handleCheckInput() {
      const {
        j00019, // 监护人（受托人）姓名
        j00001, // 就读学校名称
        j00012, // 班级
        j00018, // 学籍号
        j00097, // 贫困类型
        j00099, // 表彰级别
        j00100, // 表彰等次
      } = this.projectDeclareInfo

      if (!j00019) {
        showModal('请输入监护人姓名')
        return false
      }
      if (!j00001) {
        showModal('请输入就读学校')
        return false
      }

      if (!j00012) {
        showModal('请输入班级')
        return false
      }
      if (!j00097) {
        showModal('请选择贫困类型')
        return false
      }
      if (!j00099) {
        showModal('请选择表彰级别')
        return false
      }
      if (!j00100) {
        showModal('请选择表彰等次')
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
        gender,
      } = this.basicInfo

      const {
        j00019, // 监护人（受托人）姓名
        j00001, // 就读学校名称
        j00012, // 班级
        j00018, // 学籍号
        j00097, // 贫困类型
        j00099, // 表彰级别
        j00100, // 表彰等次
      } = this.projectDeclareInfo

      // 扩展字段
      const hb00BizMap = {
        j00019, // 监护人（受托人）姓名
        j00001, // 就读学校名称
        j00012, // 班级
        j00018, // 学籍号
        j00097, // 贫困类型
        j00099, // 表彰级别
        j00100, // 表彰等次
        aac004: gender,
        aae006: permanentAddress,
      }

      this.handleDeclareData(hb00BizMap, '0')
    },
  },
  computed: {},
  watch: {},
}
</script>

<style lang="scss" scoped></style>
