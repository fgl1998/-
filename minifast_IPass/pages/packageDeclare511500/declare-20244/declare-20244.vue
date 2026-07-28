<!-- 脱贫家庭（含监测帮扶对象家庭）雨露计划补助（乡村振兴局） -->
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
              <div class="key">学校名称</div>
              <div class="value">
                <input
                  type="text"
                  v-model="projectDeclareInfo.f00018"
                  placeholder="请输入学校名称"
                />
              </div>
            </div>

            <div class="cell-item required">
              <div class="key">学制</div>
              <div class="value">
                <input
                  type="text"
                  v-model="projectDeclareInfo.f00020"
                  placeholder="请输入学制"
                />
              </div>
            </div>

            <ComponentDeclarePicker
              label="学历"
              idName="r00165"
              :range="codeMap.F00094"
              placeholder="请选择学历"
              v-model="projectDeclareInfo.f00025"
            >
            </ComponentDeclarePicker>

            <div class="cell-item required">
              <div class="key">入学时间</div>
              <div class="value">
                <input
                  type="text"
                  v-model="projectDeclareInfo.f00021"
                  placeholder="请输入入学时间"
                />
              </div>
            </div>

            <ComponentDeclarePicker
              label="农户类型"
              idName="r00165"
              :range="codeMap.F00092"
              placeholder="请选择农户类型"
              v-model="projectDeclareInfo.f00092"
            >
            </ComponentDeclarePicker>
          </div>
        </div>
      </ComponentPanel>
    </div>

    <!-- 监护人信息 -->
    <div class="declare-info-wrapper">
      <ComponentPanel title="家长信息">
        <div class="panel-content">
          <div class="cell-items">
            <div class="cell-item required">
              <div class="key">家长姓名</div>
              <div class="value">
                <input
                  type="text"
                  maxlength="12"
                  v-model="projectDeclareInfo.f00051"
                  placeholder="请输入家长姓名"
                />
              </div>
            </div>
            <div class="cell-item required">
              <div class="key">家长身份证号</div>
              <div class="value">
                <input
                  type="idcard"
                  maxlength="18"
                  v-model="projectDeclareInfo.f00052"
                  placeholder="请输入家长身份证号"
                />
              </div>
            </div>
            <div class="cell-item">
              <div class="key">家长联系电话</div>
              <div class="value">
                <input
                  type="number"
                  maxlength="11"
                  v-model="projectDeclareInfo.f00053"
                  placeholder="请输入家长联系电话"
                />
              </div>
            </div>
            <ComponentDeclarePicker
              label="与学生关系"
              :range="codeMap.f00024"
              placeholder="请选择与学生关系"
              v-model="projectDeclareInfo.f00024"
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
  name: 'pageDeclare20244',
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
      projectDeclareInfo: {
        f00025: '', // 学历
        f00092: '', // 农户类型
      },
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
      let F00094 = [] // 学历
      let F00092 = [] // 农户类型
      try {
        F00094 = await getCodeListByCodeName('F00094')
      } catch (err) {
        console.error('code table F00094 error：', err)
      }
      try {
        F00092 = await getCodeListByCodeName('F00092')
      } catch (err) {
        console.error('code table F00092 error：', err)
      }
      this.codeMap = {
        ...this.codeMap,
        F00094,
        F00092,
      }
    },
    // 检测数据输入格式是否正确 须根据项目需求更改
    handleCheckInput() {
      const {
        f00018, // 学校名称
        f00020, // 学制
        f00025, // 学历
        f00021, // 入学时间
        f00092, // 农户类型
        f00051, // 家长姓名
        f00052, // 家长身份证号
        f00053, // 家长联系电话
        f00024, // 与学生关系
      } = this.projectDeclareInfo

      if (!f00018) {
        showModal('请输入学校名称')
        return false
      }
      if (!f00020) {
        showModal('请输入学制')
        return false
      }
      if (!f00025) {
        showModal('请选择学历')
        return false
      }
      if (!f00021) {
        showModal('请输入入学时间')
        return false
      }
      if (!f00092) {
        showModal('请选择农户类型')
        return false
      }
      if (!f00051) {
        showModal('请输入家长姓名')
        return false
      }
      if (!f00052) {
        showModal('请输入家长身份证号')
        return false
      }
      if (!f00053) {
        showModal('请输入家长联系电话')
        return false
      }
      if (!f00024) {
        showModal('请选择与学生关系')
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

      const { permanentAddress, gender } = this.basicInfo

      const {
        f00018, // 学校名称
        f00020, // 学制
        f00025, // 学历
        f00021, // 入学时间
        f00092, // 农户类型
        f00051, // 家长姓名
        f00052, // 家长身份证号
        f00053, // 家长联系电话
        f00024, // 与学生关系
      } = this.projectDeclareInfo

      // 扩展字段
      const hb00BizMap = {
        aae006: permanentAddress,
        aac004: gender,
        f00018, // 学校名称
        f00020, // 学制
        f00025, // 学历
        f00021, // 入学时间
        f00092, // 农户类型
        f00051, // 家长姓名
        f00052, // 家长身份证号
        f00053, // 家长联系电话
        f00024, // 与学生关系
      }

      this.handleDeclareData(hb00BizMap, '0')
    },
  },
  computed: {},
  watch: {},
}
</script>

<style lang="scss" scoped></style>
