<!-- 宜宾籍农民工首次市内就业补助（就业局） -->
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
              <div class="key">企业名称</div>
              <div class="value">
                <input
                  type="text"
                  v-model="projectDeclareInfo.r00163"
                  placeholder="请输入企业名称"
                />
              </div>
            </div>

            <div class="cell-item required">
              <div class="key">企业统一信用代码</div>
              <div class="value">
                <input
                  type="text"
                  v-model="projectDeclareInfo.r00164"
                  placeholder="请输入企业统一信用代码"
                />
              </div>
            </div>

            <ComponentSelectPermanentAddress
              label="务工地址"
              placeholder="请选择务工地址"
              :isShowBtn="false"
              v-model="projectDeclareInfo.r00162"
              @change="changeAddress"
            >
            </ComponentSelectPermanentAddress>

            <ComponentDeclarePicker
              label="申报年度"
              idName="r00165"
              :range="codeMap.R00165"
              placeholder="请选择申报年度"
              v-model="projectDeclareInfo.r00165"
            >
            </ComponentDeclarePicker>

            <ComponentDeclarePicker
              mode="date"
              fields="day"
              label="合同时间"
              align="right"
              placeholder="请选择合同时间"
              v-model="projectDeclareInfo.r00166"
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
import ComponentSelectPermanentAddress from '@/components/project/ez-select-permanent-address/ez-select-permanent-address.vue'
import ComponentDeclarePersonnel from '@/components/project/ez-declare-personnel/ez-declare-personnel.vue'
import ComponentDeclarePicker from '@/components/project/ez-declare-picker/ez-declare-picker.vue'

import { useDeclare } from '@/mixins'
import { getCodeListByCodeName } from '@/utils/custom-api'
import { showModal } from '@/utils/uni-api'
export default {
  name: 'pageDeclare20606',
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
    ComponentSelectPermanentAddress,
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
    // 将数据推送地址改为务工地址
    changeAddress(value) {
      //  console.log('xcxcsdswswswfsf',value)
      this.projectDeclareInfo.chb015 = value[0].orgid
      this.projectDeclareInfo.chb017 = value[1].orgid
      this.projectDeclareInfo.chb018 = value[2].orgid
    },
    // 获取该申报项目的所需要的码表数据
    // aaz502、aac011、dac009、aac004、aac005、aae008、yesorno 不用再次获取
    // 编写格式参考达州20033项目
    async getCodeTableCacheData() {
      let R00165 = [] // 申报年度
      try {
        R00165 = await getCodeListByCodeName('R00165')
      } catch (err) {
        console.error('code table R00165 error：', err)
      }
      this.codeMap = {
        ...this.codeMap,
        R00165,
      }
    },
    // 检测数据输入格式是否正确 须根据项目需求更改
    handleCheckInput() {
      const {
        r00162, // 务工地址
        r00163, // 企业名称
        r00164, // 信用代码
        r00165, // 申报年度
        r00166, // 合同时间
      } = this.projectDeclareInfo

      if (!r00163) {
        showModal('请输入企业名称')
        return false
      }
      if (!r00164) {
        showModal('请输入企业统一信用代码')
        return false
      }
      if (!r00162) {
        showModal('请选择务工地址')
        return false
      }
      if (!r00165) {
        showModal('请选择申报年度')
        return false
      }
      if (!r00166) {
        showModal('请选择合同时间')
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
        r00162, // 务工地址
        r00163, // 企业名称
        r00164, // 信用代码
        r00165, // 申报年度
        r00166, // 合同时间
        chb015,
        chb017,
        chb018,
      } = this.projectDeclareInfo

      // 扩展字段
      const hb00BizMap = {
        aae006: permanentAddress,
        aac004: gender,
        r00162, // 务工地址
        r00163, // 企业名称
        r00164, // 信用代码
        r00165, // 申报年度
        r00166, // 合同时间
        chb015,
        chb017,
        chb018,
      }

      this.handleDeclareData(hb00BizMap, '0')
    },
  },
  computed: {},
  watch: {},
}
</script>

<style lang="scss" scoped></style>
