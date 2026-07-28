<!-- 困境儿童分类保障金 -->
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
            <div class="cell-item required">
              <div class="key">户籍状况</div>
              <div class="value">
                <input
                  type="text"
                  v-model="projectDeclareInfo.m00091"
                  placeholder="请输入户籍状况"
                />
              </div>
            </div>

            <div class="cell-item required">
              <div class="key">户籍所在地</div>
              <div class="value">
                <input
                  type="text"
                  v-model="projectDeclareInfo.m00175"
                  placeholder="请输入户籍所在地"
                />
              </div>
            </div>

            <ComponentDeclarePicker
              label="申请日期"
              mode="date"
              fields="day"
              align="right"
              placeholder="请选择申请日期"
              v-model="projectDeclareInfo.m00081"
            >
            </ComponentDeclarePicker>

            <ComponentDeclarePicker
              label="申请保障待遇类型"
              idName="m00176"
              :range="codeMap.m00176"
              placeholder="请选择申请保障待遇类型"
              v-model="projectDeclareInfo.m00176"
            >
            </ComponentDeclarePicker>

            <div class="cell-item required">
              <div class="key">儿童父母情况</div>
              <div class="value">
                <input
                  type="text"
                  v-model="projectDeclareInfo.m00177"
                  placeholder="请输入儿童父母情况"
                />
              </div>
            </div>

            <div class="cell-item required">
              <div class="key">健康状况</div>
              <div class="value">
                <input
                  type="text"
                  v-model="projectDeclareInfo.m00178"
                  placeholder="请输入健康状况"
                />
              </div>
            </div>

            <div class="cell-item required">
              <div class="key">儿童就业就学情况</div>
              <div class="value">
                <input
                  type="text"
                  v-model="projectDeclareInfo.m00179"
                  placeholder="请输入儿童就业就学情况"
                />
              </div>
            </div>

            <div class="cell-item required">
              <div class="key">履行监护责任人员情况</div>
              <div class="value">
                <input
                  type="text"
                  v-model="projectDeclareInfo.m00072"
                  placeholder="请输入履行监护责任人员情况"
                />
              </div>
            </div>

            <div class="cell-item required">
              <div class="key">基本生活补贴发放信息</div>
              <div class="value">
                <input
                  type="text"
                  v-model="projectDeclareInfo.m00074"
                  placeholder="请输入基本生活补贴发放信息"
                />
              </div>
            </div>

            <div class="cell-item required">
              <div class="key">纳入救助情况</div>
              <div class="value">
                <input
                  type="text"
                  v-model="projectDeclareInfo.m00180"
                  placeholder="请输入纳入救助情况"
                />
              </div>
            </div>

            <div class="cell-item required">
              <div class="key">诚信承诺情况</div>
              <div class="value">
                <input
                  type="text"
                  v-model="projectDeclareInfo.m00076"
                  placeholder="请输入诚信承诺情况"
                />
              </div>
            </div>
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
import { useGetCurrentDate } from '@/hooks/common'
import { getCodeListByCodeName } from '@/utils/custom-api'
import { showModal } from '@/utils/uni-api'

export default {
  name: 'pageDeclare20132',
  data() {
    return {
      // 基本信息 渲染配置
      renderObj: {
        idCard: true, // 身份证
        userName: true, // 姓名
        tel: true, // 联系电话
        gender: true, // 性别
        birthday: true, //出生日期
        nation: true, //民族
        permanentAddress: true, // 户籍地址
        currentAddress: true, //现居地址
      },
      projectDeclareInfo: {},
      today_d: useGetCurrentDate(),
      today_y: useGetCurrentDate('year', ''),
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
      let m00176 = [] // 申请保障待遇类型

      try {
        m00176 = await getCodeListByCodeName('M00176')
      } catch (err) {
        console.error('code table m00176 error：', err)
      }
      this.codeMap = {
        ...this.codeMap,
        m00176,
      }
    },
    // 检测数据输入格式是否正确 须根据项目需求更改
    handleCheckInput() {
      const {
        m00091, //户籍状况
        m00175, //户籍所在地
        m00081, //申请日期
        m00176, //申请保障待遇类型
        m00177, //儿童父母情况
        m00178, //健康状况
        m00179, //儿童就业就学情况
        m00072, //履行监护责任人员情况
        m00074, //基本生活补贴发放信息
        m00180, //纳入救助情况
        m00076, //诚信承诺情况
      } = this.projectDeclareInfo

      if (!m00091) {
        showModal('请输入户籍状况')
        return false
      }
      if (!m00175) {
        showModal('请输入户籍所在地')
        return false
      }
      if (!m00081) {
        showModal('请选择申请日期')
        return false
      }
      if (!m00176) {
        showModal('请选择申请保障待遇类型')
        return false
      }
      if (!m00177) {
        showModal('请输入履行监护责任人员情况')
        return false
      }
      if (!m00178) {
        showModal('请输入健康状况')
        return false
      }
      if (!m00179) {
        showModal('请输入儿童就业就学情况')
        return false
      }
      if (!m00072) {
        showModal('请输入儿童就业就学情况')
        return false
      }
      if (!m00074) {
        showModal('请输入基本生活补贴发放信息')
        return false
      }
      if (!m00180) {
        showModal('请输入纳入救助情况')
        return false
      }
      if (!m00076) {
        showModal('请输入诚信承诺情况')
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
        gender, // 性别
        birthday, //出生日期
        permanentAddress, // 户籍地址
        currentAddress, //现居地址
      } = this.basicInfo

      const {
        m00091, //户籍状况
        m00175, //户籍所在地
        m00081, //申请日期
        m00176, //申请保障待遇类型
        m00177, //儿童父母情况
        m00178, //健康状况
        m00179, //儿童就业就学情况
        m00072, //履行监护责任人员情况
        m00074, //基本生活补贴发放信息
        m00180, //纳入救助情况
        m00076, //诚信承诺情况
      } = this.projectDeclareInfo

      // 扩展字段
      const hb00BizMap = {
        aac004: gender, //性别
        m00079: birthday, //出生日期
        m00091, //户籍状况
        m00175, //户籍所在地
        m00081, //申请日期
        m00176, //申请保障待遇类型
        chb0a9: permanentAddress, //户籍地址
        m00082: currentAddress, //现居住地址

        m00177, //儿童父母情况
        m00178, //健康状况
        m00179, //儿童就业就学情况
        m00072, //履行监护责任人员情况
        m00074, //基本生活补贴发放信息
        m00180, //纳入救助情况
        m00076, //诚信承诺情况
      }

      this.handleDeclareData(hb00BizMap, '0')
    },
  },
  computed: {},
  watch: {},
}
</script>

<style lang="scss" scoped></style>
