<!-- 普通高校家庭经济困难新生入学资助金 -->
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
              <div class="key">录取院校名称</div>
              <div class="value">
                <input
                  type="text"
                  v-model="projectDeclareInfo.j00008"
                  placeholder="请输入录取院校名称"
                />
              </div>
            </div>
            <div class="cell-item required">
              <div class="key">专业名称</div>
              <div class="value">
                <input
                  type="text"
                  v-model="projectDeclareInfo.j00023"
                  placeholder="请输入专业名称"
                />
              </div>
            </div>
            <ComponentDeclarePicker
              label="户口性质"
              idName="j00045"
              :range="codeMap.j00045"
              rangeKey="aaa103"
              valueKey="aaa102"
              placeholder="请选择户口性质"
              v-model="projectDeclareInfo.j00045"
            ></ComponentDeclarePicker>
            <div class="cell-item required">
              <div class="key">家庭人口</div>
              <div class="value">
                <input
                  type="text"
                  v-model="projectDeclareInfo.chb0gk"
                  placeholder="请输入家庭人口"
                />
              </div>
            </div>
            <div class="cell-item required">
              <div class="key">家庭年收入</div>
              <div class="value">
                <input
                  type="number"
                  v-model="projectDeclareInfo.chb0gl"
                  placeholder="请输入家庭年收入"
                />
              </div>
            </div>
            <div class="cell-item required">
              <div class="key">家庭地址</div>
              <div class="value">
                <input
                  type="text"
                  v-model="projectDeclareInfo.chb0go"
                  placeholder="请输入家庭地址"
                />
              </div>
            </div>
            <div class="cell-item required">
              <div class="key">主要收入来源</div>
              <div class="value">
                <input
                  type="text"
                  v-model="projectDeclareInfo.j00036"
                  placeholder="请输入主要收入来源"
                />
              </div>
            </div>
            <div class="cell-item required">
              <div class="key">毕业院校</div>
              <div class="value">
                <input
                  type="text"
                  v-model="projectDeclareInfo.j00051"
                  placeholder="请输入毕业院校"
                />
              </div>
            </div>
            <ComponentDeclarePicker
              label="录取学历层次"
              idName="j51001"
              :range="codeMap.j51001"
              rangeKey="aaa103"
              valueKey="aaa102"
              placeholder="请选择录取学历层次"
              v-model="projectDeclareInfo.j51001"
            ></ComponentDeclarePicker>
            <div class="cell-item required">
              <div class="key">家庭人均年收入(元)</div>
              <div class="value">
                <input
                  type="text"
                  v-model="projectDeclareInfo.chb0g3"
                  placeholder="请输入家庭人均年收入(元)"
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
import ComponentSelectPermanentAddress from '@/components/project/ez-select-permanent-address/ez-select-permanent-address.vue'
import ComponentSelectCurrentAddress from '@/components/project/ez-select-current-address/ez-select-current-address.vue'
import ComponentDeclareCard from '@/components/project/ez-declare-card/ez-declare-card.vue'
import ComponentDeclarePersonnel from '@/components/project/ez-declare-personnel/ez-declare-personnel.vue'
import ComponentDeclareRadio from '@/components/project/ez-declare-radio/ez-declare-radio.vue'
import ComponentDeclarePicker from '@/components/project/ez-declare-picker/ez-declare-picker.vue'

import { useDeclare } from '@/mixins'
import { useGetCurrentDate, useGetBirthdayByIDCard } from '@/hooks/common'
import { getCodeListByCodeName } from '@/utils/custom-api'
import { showModal } from '@/utils/uni-api'
export default {
  name: 'pageDeclare20580',
  data() {
    return {
      // 基本信息 渲染配置
      renderObj: {
        idCard: true, // 身份证
        userName: true, // 姓名
        tel: true, // 联系电话
        age: true, // 年龄
        gender: true, // 性别
        birthday: true, // 出生年月
        permanentAddress: true, // 户籍地址
      },
      // 自定义添加一些属性 防止双向绑定失败 例如 picker组件之类
      projectDeclareInfo: {
        aj0050: '',
      },
    }
  },
  components: {
    ComponentButton,
    ComponentPanel,
    ComponentDeclare,
    ComponentDeclareStep,
    ComponentSelectPermanentAddress,
    ComponentSelectCurrentAddress,
    ComponentDeclareCard,
    ComponentDeclareRadio,
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
      let j51001 = [] // 学历
      let j00045 = [] // 学历

      try {
        j00045 = await getCodeListByCodeName('A00022')
      } catch (err) {
        console.error('code A00022 table error：', err)
      }

      try {
        j51001 = await getCodeListByCodeName('J51001')
      } catch (err) {
        console.error('code J51001 table error：', err)
      }

      this.codeMap = {
        ...this.codeMap,
        j51001,
        j00045,
      }
    },
    // 检测数据输入格式是否正确 须根据项目需求更改
    handleCheckInput() {
      const {
        j00008,
        j00023,
        j00045,
        chb0gk,
        chb0gl,
        chb0go,
        j00036,
        j00051,
        j51001,
        chb0g3,
      } = this.projectDeclareInfo
      if (!j00008) {
        showModal('请输入录取院校名称')
        return false
      }
      if (!j00023) {
        showModal('请输入专业名称')
        return false
      }
      if (!j00045) {
        showModal('请选择户口性质')
        return false
      }
      if (!j00008) {
        showModal('请输入录取院校名称')
        return false
      }
      if (!chb0gk) {
        showModal('请输入家庭人口')
        return false
      }
      if (!chb0gl) {
        showModal('请输入家庭年收入')
        return false
      }
      if (!chb0go) {
        showModal('请输入家庭地址')
        return false
      }
      if (!j00036) {
        showModal('请输入主要收入来源')
        return false
      }
      if (!j00051) {
        showModal('请输入毕业院校')
        return false
      }
      if (!j51001) {
        showModal('请选择录取学历层次')
        return false
      }
      if (!chb0g3) {
        showModal('请输入家庭人均年收入')
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

      const { idCard } = this.basicInfo

      const {
        j00008,
        j00023,
        j00045,
        chb0gk,
        chb0gl,
        chb0go,
        j00036,
        j00051,
        j51001,
        chb0g3,
      } = this.projectDeclareInfo
      const birthday = useGetBirthdayByIDCard(idCard)
      // 扩展字段
      const hb00BizMap = {
        j00008,
        j00023,
        j00045,
        chb0gk,
        chb0gl,
        chb0go,
        j00036,
        j00051,
        j51001,
        chb0g3,
        j00059: birthday, // 出生日期
        chb01m: '1', // 发放类型 正常发放
        aae209: useGetCurrentDate('month', ''), // 发放期号 当前申报年月
      }
      this.handleDeclareData(hb00BizMap, '0')
    },
  },
}
</script>

<style lang="scss" scoped></style>
