<!-- 巩固拓展脱贫攻坚成果公益性岗位补贴 扶贫开发局 -->
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
        :isOpenOCR="true"
		permanentAddressLabel='受理地址'
		permanentAddressPlaceholder='请选择申报受理地址'
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

    <!-- 申报信息 -->
    <div class="space-top-wrapper">
      <ComponentPanel title="申报信息">
        <div class="panel-content">
          <div class="cell-items">
            <div class="cell-item required">
              <div class="key">劳动能力</div>
              <div class="value">
                <input
                  type="text"
                  v-model="projectDeclareInfo.f00082"
                  placeholder="请输入劳动能力"
                />
              </div>
            </div>

            <div class="cell-item required">
              <div class="key">家庭人均收入(元)</div>
              <div class="value">
                <input
                  type="number"
                  maxlength="20"
                  v-model="projectDeclareInfo.f00083"
                  placeholder="请输入家庭人均收入"
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
  name: 'pageDeclare20842',
  data() {
    return {
      // 基本信息 渲染配置
      renderObj: {
        idCard: true, // 身份证
        userName: true, // 姓名
        tel: true, // 联系电话
        permanentAddress: true, // 户籍地址
      },
      projectDeclareInfo: {},
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
        f00082, // 劳动能力
        f00083, // 家庭人均收入（元）
      } = this.projectDeclareInfo

      if (!f00082) {
        showModal('请输入劳动能力')
        return false
      }
      if (!f00083) {
        showModal('请输入家庭人均收入')
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

      const { permanentAddress } = this.basicInfo

      const {
        f00039, //户籍地址

        f00082, // 劳动能力
        f00083, // 家庭人均收入（元）
      } = this.projectDeclareInfo

      // 扩展字段
      const hb00BizMap = {
        f00039: permanentAddress, //户籍地址

        f00082, // 劳动能力
        f00083, // 家庭人均收入（元）
      }

      this.handleDeclareData(hb00BizMap, '0')
    },
  },
  computed: {},
  watch: {},
}
</script>

<style lang="scss" scoped></style>
