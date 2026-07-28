<!-- 失地农民失业保险金（就业局）-->
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
        currentAddressType="city"
        addressFilter="1569469,1569472"
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
    <!-- <div class="personnel-type-wrapper space-top-wrapper">
      <ComponentPanel title="人员类别">
        <div class="panel-content">
          <div class="cell-items">
            <ComponentDeclarePersonnel
              :renderData="personnelList"
              @change="handleChangePersonnelInfo"
            ></ComponentDeclarePersonnel>
          </div>
        </div>
      </ComponentPanel>
    </div> -->

    <div class="space-top-wrapper">
      <ComponentPanel title="补贴信息">
        <div class="panel-content">
          <div class="cell-items">
            <div class="cell-item required disabled">
              <div class="key">补贴金额</div>
              <div class="value">1773元/月</div>
            </div>
          </div>
        </div>
      </ComponentPanel>
    </div>

    <div class="space-top-wrapper">
      <ComponentPanel title="申报信息">
        <div class="panel-content">
          <div class="cell-items">
            <div class="cell-item required">
              <div class="key">征地项目名称</div>
              <div class="value">
                <input
                  type="text"
                  v-model="projectDeclareInfo.aj0060"
                  placeholder="请输入征地项目名称"
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

import { useDeclare } from '@/mixins'

import { showModal } from '@/utils/uni-api'

export default {
  name: 'pageDeclare20666',
  data() {
    return {
      // 基本信息 渲染配置
      renderObj: {
        idCard: true, // 身份证
        userName: true, // 姓名
        tel: true, // 联系电话
        gender: true, // 性别
        age: true,
        birthday: false, // 出生日期
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

    // 检测数据输入格式是否正确 须根据项目需求修改
    handleCheckInput() {
      const {
        aj0060, // 征地项目名称
      } = this.projectDeclareInfo
      if (!aj0060) {
        showModal('请输入征地项目名称')
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
        currentAddress, // 现居地址
      } = this.basicInfo

      const {
        aj0007, // 户籍地址
        aj0013, // 补贴金额
        aj0016, // 现居地址
        aj0060, // 征地项目名称
      } = this.projectDeclareInfo

      // 扩展字段
      const hb00BizMap = {
        aj0007: permanentAddress, // 户籍地址
        aj0013: '1773',
        aj0016: permanentAddress, // 现居地址
        aj0060, // 征地项目名称
      }

      this.handleDeclareData(hb00BizMap, '0')
    },
  },
  computed: {},
  watch: {},
}
</script>
<style lang="scss" scoped>
</style>
