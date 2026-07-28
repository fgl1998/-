<template>
  <!-- 建档立卡贫困家庭技校学生资助（人社局） -->
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
        @changeDeclareType="handleChangeDeclareType"
        @changeBasicInfo="handleChangeBasicInfo"
        @changeCodeMap="handleChangeCodeMap"
        @changeAgentInfo="handleChangeAgentInfo"
        @changeDataByIdCard="handleChangeDataByIdCard"
      >
      </ComponentDeclare>
    </div>

    <!-- start 需要修改的地方开始 在以下代码中根据项目需求更改 上面代码勿动 -->
    <div class="space-top-wrapper">
      <ComponentPanel title="申报信息">
        <div class="panel-content">
          <div class="cell-items">
            <div class="cell-item required">
              <div class="key">就读学校</div>
              <div class="value">
                <input
                  type="text"
                  v-model="projectDeclareInfo.r00017"
                  placeholder="请输入就读学校"
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

import { useDeclare } from '@/mixins'

import { showModal } from '@/utils/uni-api'

export default {
  name: 'pageDeclare20906',

  data() {
    return {
      renderObj: {
        idCard: true, // 身份证
        userName: true, // 姓名
        tel: true, // 联系电话
        age: true, // 年龄
        permanentAddress: true, // 户籍地址
        gender: true, //性别
      },
      projectDeclareInfo: {
        aae006: '',
      },
    }
  },
  components: {
    ComponentButton,
    ComponentPanel,
    ComponentDeclare,
    ComponentDeclareStep,
  },
  mixins: [useDeclare],
  // 监听页面加载，其参数为上个页面传递的数据，参数类型为Object（用于页面传参）
  onLoad(e) {
    this.handleOnLoad(e)
    this.projectDeclareInfo.aae019 = '365'
  },
  // 监听页面显示
  onShow() {},
  // 监听页面隐藏
  onHide() {},
  methods: {
    getCodeTableCacheData() {},
    // 检测数据输入格式是否正确 须根据项目需求更改
    handleCheckInput() {
      const { isCheckFileAndRegister } = this.declareConfig
      // if (!this.isFileAndRegister && isCheckFileAndRegister) {
      //   showModal('申报人不是建档立卡贫困户，无法申报该补贴项目！')
      //   return false
      // }
      const { r00017 } = this.projectDeclareInfo
      if (!r00017) {
        showModal('请输入就读学校')
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
        aac002, // 身份证号
        aac003, // 姓名
        aac004, // 性别
        aae005, // 联系电话
        aae006, // 户籍地址
        chb015, // 区县编码
        chb017, // 乡镇编码
        chb018, // 村编码

        r00017,
      } = this.projectDeclareInfo
      const {
        currentAddress, // 先居住地址
      } = this.basicInfo

      // const {} = this.projectDeclareInfo

      // 扩展字段
      var hb00BizMap = {
        time: +new Date(),
        r00017,
      }

      this.handleDeclareData(hb00BizMap, '0')
    },
  },
  computed: {},
  watch: {},
}
</script>

<style lang="scss" scoped></style>
