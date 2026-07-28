<!-- 求职补贴 -->
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
    <div class="personnel-type-wrapper space-top-wrapper">
      <ComponentDeclarePersonnel
        :isMultipleChoicesPersonnel="isMultipleChoicesPersonnel"
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
                  maxlength="19"
                  v-model="projectDeclareInfo.r00017"
                  placeholder="请输入学校名称"
                />
              </div>
            </div>
            <ComponentDeclarePicker
              label="文化程度"
              idName="r00167"
              :required="false"
              :range="codeMap.r00167"
              rangeKey="aaa103"
              valueKey="aaa102"
              placeholder="请选择文化程度"
              v-model="projectDeclareInfo.r00167"
            ></ComponentDeclarePicker>
          </div>
        </div>
      </ComponentPanel>
    </div>

    <!-- end  在以上代码中根据项目需求更改-->
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
import ComponentDeclareCard from '@/components/project/ez-declare-card/ez-declare-card.vue'
import ComponentDeclarePersonnel from '@/components/project/ez-declare-personnel/ez-declare-personnel.vue'
import ComponentDeclarePicker from '@/components/project/ez-declare-picker/ez-declare-picker.vue'

import { useDeclare } from '@/mixins'

import { useGetCurrentDate } from '@/hooks/common'
import { showModal } from '@/utils/uni-api'
import { getCodeListByCodeName } from '@/utils/custom-api'
export default {
  name: 'pageDeclare20617',
  data() {
    return {
      isMultipleChoicesPersonnel: false,
      renderObj: {
        idCard: true, // 身份证
        userName: true, // 姓名
        tel: true, // 联系电话
        age: true, // 年龄
        gender: true, // 性别
        birthday: true, // 出生年月
        permanentAddress: true, // 户籍地址
      },
      // 申报信息
      projectDeclareInfo: {
        aj0021: '',
        aj61201: '',
      },
    }
  },
  components: {
    ComponentButton,
    ComponentPanel,
    ComponentDeclare,
    ComponentDeclareStep,
    ComponentDeclareCard,
    ComponentDeclarePersonnel,
    ComponentDeclarePicker,
  },
  mixins: [useDeclare],
  // 监听页面加载，其参数为上个页面传递的数据，参数类型为Object（用于页面传参）
  onLoad(e) {
    this.handleOnLoad(e)
  },
  methods: {
    // 获取该申报项目的所需要的码表数据
    // aaz502、aac011、dac009、aac004、aac005、aae008、yesorno 不用再次获取
    // 编写格式参考达州20033项目
    async getCodeTableCacheData() {
      let r00167 = [] // 文化程度
      try {
        r00167 = await getCodeListByCodeName('AAC011')
      } catch (err) {
        console.error('code table error：', err)
      }

      this.codeMap = {
        ...this.codeMap,
        r00167,
      }
    },
    // 检测数据输入格式是否正确 须根据项目需求修改
    handleCheckInput() {
      const { r00017, aae209 } = this.projectDeclareInfo

      if (!r00017) {
        showModal('请输入学校名称')
        return false
      }

      return true
    },

    // 下一步 须根据项目需求修改
    handleJumpNextStep() {
      if (!this.handleCheckComponentInput()) {
        return
      }
      if (!this.handleCheckInput()) {
        return
      }
      const { r00017, r00167 } = this.projectDeclareInfo

      // 扩展字段
      let hb00BizMap = {
        r00017, //学校名称
        r00167, //文化程度
        aae019: 0,
        chb01m: '1', // 发放类型 正常发放
        aae209: useGetCurrentDate('month', ''), // 发放期号 当前申报年月
      }
      this.handleDeclareData(hb00BizMap, '0')
    },
  },
}
</script>

<style lang="scss" scoped></style>
