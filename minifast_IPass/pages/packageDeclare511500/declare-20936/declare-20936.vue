<!-- 造林补贴 林业局 -->
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
            <ComponentDeclarePicker
              label="政策文件下达时间"
              idName="l00048"
              mode="date"
              fields="year"
              :endTime="today_y"
              v-model="projectDeclareInfo.l00048"
              placeholder="请选择"
            ></ComponentDeclarePicker>

            <ComponentDeclarePicker
              label="县级验收合格时间"
              idName="l00049"
              mode="date"
              fields="day"
              :endTime="today_d"
              v-model="projectDeclareInfo.l00049"
              placeholder="请选择"
            ></ComponentDeclarePicker>

            <div class="cell-item required">
              <div class="key">补贴标准</div>
              <div class="value">
                <input
                  type="digit"
                  maxlength="10"
                  v-model="projectDeclareInfo.l00002"
                  placeholder="请输入补贴标准"
                />
              </div>
            </div>

            <div class="cell-item required">
              <div class="key">补贴面积</div>
              <div class="value">
                <input
                  type="digit"
                  maxlength="10"
                  v-model="projectDeclareInfo.l00004"
                  placeholder="请输入补贴面积"
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
import { showModal } from '@/utils/uni-api'
export default {
  name: 'pageDeclare20936',
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
    async getCodeTableCacheData() {},
    // 检测数据输入格式是否正确 须根据项目需求更改
    handleCheckInput() {
      const {
        aac004, //性别

        l00048, //政策文件下达时间（年
        l00049, //县级验收合格时间
        l00002, //补贴标准
        l00004, //补贴面积
      } = this.projectDeclareInfo

      if (!l00048) {
        showModal('请选择政策文件下达时间')
        return false
      }
      if (!l00049) {
        showModal('请选择县级验收合格时间')
        return false
      }
      if (!l00002) {
        showModal('请输入补贴标准')
        return false
      }
      if (!l00004) {
        showModal('请输入补贴面积')
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
      } = this.basicInfo

      const {
        l00048, //政策文件下达时间（年
        l00049, //县级验收合格时间
        l00002, //补贴标准
        l00004, //补贴面积
      } = this.projectDeclareInfo

      // 扩展字段
      const hb00BizMap = {
        aac004: gender, // 性别

        l00048, //政策文件下达时间（年
        l00049, //县级验收合格时间
        l00002, //补贴标准
        l00004, //补贴面积
      }

      this.handleDeclareData(hb00BizMap, '0')
    },
  },
  computed: {},
  watch: {},
}
</script>

<style lang="scss" scoped></style>
