<!-- 村级公益性岗位补贴 就业局 -->
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

    <!-- start 需要修改的地方开始 在以下代码中根据项目需求更改 上面代码勿动 -->

    <!-- 申报信息 -->
    <div class="space-top-wrapper">
      <ComponentPanel title="申报信息">
        <div class="panel-content">
          <div class="cell-items">
            <div class="cell-item required">
              <div class="key">岗位类别</div>
              <div class="value">
                <input
                  type="text"
                  v-model="projectDeclareInfo.aj0052"
                  placeholder="请输入岗位类别"
                />
              </div>
            </div>

            <div class="cell-item required">
              <div class="key">累计上岗时间</div>
              <div class="value">
                <input
                  type="text"
                  v-model="projectDeclareInfo.aj0053"
                  placeholder="请输入累计上岗时间"
                />
              </div>
            </div>

            <ComponentDeclarePicker
              mode="date"
              fields="year"
              label="申报年度"
              align="right"
              placeholder="请选择申报年度"
              v-model="projectDeclareInfo.aj0054"
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
import ComponentDeclarePicker from '@/components/project/ez-declare-picker/ez-declare-picker.vue'

import { useDeclare } from '@/mixins'

import { getDate } from '@/utils/get'
import { showModal } from '@/utils/uni-api'

export default {
  name: 'pageDeclare20074',
  data() {
    return {
      // 基本信息 渲染配置
      renderObj: {
        idCard: true, // 身份证
        userName: true, // 姓名
        tel: true, // 联系电话
        permanentAddress: true, // 户籍地址
        currentAddress: true, // 现居地址
      },
      today_y: getDate('year'),
      projectDeclareInfo: {},
    }
  },
  components: {
    ComponentButton,
    ComponentPanel,
    ComponentDeclare,
    ComponentDeclareStep,
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
    async getCodeTableCacheData() {},
    // 检测数据输入格式是否正确 须根据项目需求更改
    handleCheckInput() {
      const {
        aj0007, //户籍地址
        aj0016, //现居地址

        aj0052, //岗位类别
        aj0053, //累计上岗时间
        aj0054, //申报年度
      } = this.projectDeclareInfo

      if (!aj0052) {
        showModal('请输入岗位类别')
        return false
      }
      if (!aj0053) {
        showModal('请输入累计上岗时间')
        return false
      }
      if (!aj0054) {
        showModal('请选择申报年度')
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

      const { permanentAddress, currentAddress } = this.basicInfo

      const {
        aj0007, //户籍地址
        aj0016, //现居地址

        aj0052, //岗位类别
        aj0053, //累计上岗时间
        aj0054, //申报年度
      } = this.projectDeclareInfo

      // 扩展字段
      const hb00BizMap = {
        aj0007: permanentAddress, //户籍地址
        aj0016: currentAddress, //现居地址

        aj0052, //岗位类别
        aj0053, //累计上岗时间
        aj0054, //申报年度
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
