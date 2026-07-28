<!-- 体育助学金 -->
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
      ></ComponentDeclare>
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
              <div class="key">学校</div>
              <div class="value">
                <input type="text" v-model="projectDeclareInfo.chb017" placeholder="请输入学校" />
              </div>
            </div>
            <div class="cell-item required">
              <div class="key">年级</div>
              <div class="value">
                <input type="number" v-model="projectDeclareInfo.chb018" placeholder="请输入年级" />
              </div>
            </div>
          </div>
        </div>
      </ComponentPanel>
    </div>

    <!-- end  需要修改的地方结束 在以下代码中根据项目需求更改 下面代码勿动-->
    <div class="button-wrapper">
      <ComponentButton @click="handleJumpNextStep" name="下一步" type="primary"></ComponentButton>
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
import { useGetCurrentDate } from '@/hooks/common'
import { showModal } from '@/utils/uni-api'
export default {
  name: 'pageDeclare20330',
  data() {
    return {
      // 基本信息 渲染配置
      renderObj: {
        idCard: true, // 身份证
        userName: true, // 姓名
        tel: true, // 联系电话
        age: true, // 年龄
        gender: true, // 性别
        permanentAddress: true, // 户籍地址
        currentAddress: true // 现居住地址
      },
      // 自定义添加一些属性 防止双向绑定失败 例如 picker组件之类
      projectDeclareInfo: {
        chb017: '',
        chb018: ''
      }
    }
  },
  components: {
    ComponentButton,
    ComponentPanel,
    ComponentDeclare,
    ComponentDeclareStep,
    ComponentDeclarePersonnel
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
    async getCodeTableCacheData() {},
    // 检测数据输入格式是否正确 须根据项目需求更改
    handleCheckInput() {
      const { chb017, chb018 } = this.projectDeclareInfo
      if (!chb017) {
        showModal('请输入学校')
        return false
      }
      if (!chb018) {
        showModal('请输入年级')
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

      const { currentAddress, gender, permanentAddress, age } = this.basicInfo

      const { chb017, chb018 } = this.projectDeclareInfo
      // 扩展字段
      const hb00BizMap = {
        chb017,
        chb018,
        chb00l: age, // 年龄
        aac004: gender, // 性别
        t00001: currentAddress, // 现居住地址
        aae006: permanentAddress, // 户籍地址
        chb01m: '1', // 发放类型 正常发放
        aae209: useGetCurrentDate('month', '') // 发放期号 当前申报年月
      }
      this.handleDeclareData(hb00BizMap, '0')
    }
  }
}
</script>

<style lang="scss" scoped></style>
