<!-- 分散特困人员照料护理费 民政局 -->
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
              <div class="key">被护理人姓名</div>
              <div class="value">
                <input
                  type="text"
                  v-model="projectDeclareInfo.m00051"
                  placeholder="请输入被护理人姓名"
                />
              </div>
            </div>
            <div class="cell-item required">
              <div class="key">被护理人身份证</div>
              <div class="value">
                <input
                  type="idcard"
                  maxlength="18"
                  v-model="projectDeclareInfo.m35807"
                  placeholder="请输入被护理人身份证"
                  @change="handleBlur01"
                />
              </div>
            </div>

            <ComponentDeclarePicker
              label="照料护理人与被照护人关系"
              idName="m00135"
              :range="codeMap.m00135"
              placeholder="请选择"
              v-model="projectDeclareInfo.m00135"
            >
            </ComponentDeclarePicker>

            <ComponentSelectAddressMultitype
              label="被护理人现居住地址"
              placeholder="请选择被护理人现居住地址"
              :isShowBtn="renderObj.permanentAddress"
              @clickBtn="projectDeclareInfo.m00154 = basicInfo.permanentAddress"
              v-model="projectDeclareInfo.m00154"
            >
            </ComponentSelectAddressMultitype>
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
import ComponentSelectAddressMultitype from '@/components/project/ez-select-address-multitype/ez-select-address-multitype.vue'

import { useDeclare } from '@/mixins'
import { getCodeListByCodeName } from '@/utils/custom-api'
import { showModal } from '@/utils/uni-api'
export default {
  name: 'pageDeclare20434',
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
    ComponentDeclarePersonnel,
    ComponentDeclarePicker,
    ComponentSelectAddressMultitype,
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
      let m00135 = [] // 照料护理人与被照护人关系

      try {
        m00135 = await getCodeListByCodeName('m00135')
      } catch (err) {
        console.error('code table m00135 error：', err)
      }

      this.codeMap = {
        ...this.codeMap,
        m00135,
      }
    },
    // 检测数据输入格式是否正确 须根据项目需求更改
    handleCheckInput() {
      const {
        m00051, //被护理人姓名
        m35807, //被护理人身份证
        m00135, //照料护理人与被照护人
        m00154, //被护理人现居住地址
      } = this.projectDeclareInfo

      if (!m00051) {
        showModal('请输入被护理人姓名')
        return false
      }
      if (!m35807) {
        showModal('请输入被护理人身份证')
        return false
      }
      if (!m00135) {
        showModal('请选择照料护理人与被照护人关系')
        return false
      }
      if (!m00154) {
        showModal('请选择被护理人现居住地址')
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
        m00051, //被护理人姓名
        m35807, //被护理人身份证
        m00135, //照料护理人与被照护人
        m00154, //被护理人现居住地址
      } = this.projectDeclareInfo

      // 扩展字段
      const hb00BizMap = {
        m00051, //被护理人姓名
        m35807, //被护理人身份证
        m00135, //照料护理人与被照护人
        m00154, //被护理人现居住地址
      }

      this.handleDeclareData(hb00BizMap, '0')
    },
  },
  computed: {},
  watch: {},
}
</script>

<style lang="scss" scoped></style>
