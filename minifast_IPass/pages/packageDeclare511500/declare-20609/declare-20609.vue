<!-- 财政衔接推进乡村振兴补助资金到人到户项目补助（乡村振兴局） -->
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
              <div class="key">家庭人口数</div>
              <div class="value">
                <input
                  type="text"
                  v-model="projectDeclareInfo.chb0e2"
                  placeholder="请输入家庭人口数"
                />
              </div>
            </div>

            <ComponentDeclarePicker
              label="农户类型"
              idName="r00165"
              :range="codeMap.F00094"
              placeholder="请选择农户类型"
              v-model="projectDeclareInfo.f00054"
            >
            </ComponentDeclarePicker>

            <ComponentDeclarePicker
              label="建设类别"
              idName="r00165"
              :range="codeMap.f00055"
              placeholder="请选择建设类别"
              v-model="projectDeclareInfo.F00055"
            >
            </ComponentDeclarePicker>

            <div class="cell-item required">
              <div class="key">建设内容</div>
              <div class="value">
                <input
                  type="text"
                  v-model="projectDeclareInfo.f00056"
                  placeholder="请输入建设内容"
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
import { getCodeListByCodeName } from '@/utils/custom-api'
import { showModal } from '@/utils/uni-api'
export default {
  name: 'pageDeclare20609',
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
        f00054: '', // 农户类型
        f00055: '', // 建设类别
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
      let F00054 = [] // 农户类型
      let F00055 = [] // 建设类别
      try {
        F00054 = await getCodeListByCodeName('F00054')
      } catch (err) {
        console.error('code table F00054 error：', err)
      }
      try {
        F00055 = await getCodeListByCodeName('F00055')
      } catch (err) {
        console.error('code table F00055 error：', err)
      }
      this.codeMap = {
        ...this.codeMap,
        F00054,
        F00055,
      }
    },
    // 检测数据输入格式是否正确 须根据项目需求更改
    handleCheckInput() {
      const {
        chb0e2, // 家庭人口数
        f00054, // 农户类型
        f00055, // 建设类别
        f00056, // 建设内容
      } = this.projectDeclareInfo

      if (!chb0e2) {
        showModal('请输入家庭人口数')
        return false
      }
      if (!f00054) {
        showModal('请选择农户类型')
        return false
      }
      if (!f00055) {
        showModal('请选择建设类别')
        return false
      }
      if (!f00056) {
        showModal('请输入建设内容')
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
        chb0e2, // 家庭人口数
        f00054, // 农户类型
        f00055, // 建设类别
        f00056, // 建设内容
      } = this.projectDeclareInfo

      // 扩展字段
      const hb00BizMap = {
        aae006: permanentAddress,
        aac004: gender,
        chb0e2, // 家庭人口数
        f00054, // 农户类型
        f00055, // 建设类别
        f00056, // 建设内容
      }

      this.handleDeclareData(hb00BizMap, '0')
    },
  },
  computed: {},
  watch: {},
}
</script>

<style lang="scss" scoped></style>
