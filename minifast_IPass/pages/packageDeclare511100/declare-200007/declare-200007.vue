<!-- 圆梦工程 -->
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
        @changeDataByIdCard="handleChangeDataByIdCard">
      </ComponentDeclare>
    </div>

    <div class="personnel-type-wrapper space-top-wrapper">
      <ComponentDeclarePersonnel
        :renderData="personnelList"
        :isOpenCategoryNotes="true"
        @change="handleChangePersonnelInfo"></ComponentDeclarePersonnel>
    </div>
    <!-- 申报信息 -->
    <div class="space-top-wrapper">
      <ComponentPanel title="申报信息">
        <div class="panel-content">
          <div class="cell-items">
            <div class="cell-item required">
              <div class="key">就读学校名称</div>
              <div class="value">
                <input type="text" v-model="projectDeclareInfo.j00001" placeholder="请输入就读学校名称" />
              </div>
            </div>
            <ComponentDeclarePicker
              label="入学时间"
              idName="chb0g1"
              mode="date"
              fields="day"
              :endTime="new Date().getTime()"
              v-model="projectDeclareInfo.chb0g1"
              placeholder="请选择入学时间"></ComponentDeclarePicker>
            <ComponentDeclarePicker
              label="申请时间"
              idName="j00158"
              mode="date"
              fields="day"
              :endTime="new Date().getTime()"
              v-model="projectDeclareInfo.j00158"
              placeholder="请选择申请时间"></ComponentDeclarePicker>
            <ComponentDeclarePicker
              label="困难类型"
              idName="j00163"
              :range="codeMap.j00163"
              rangeKey="aaa103"
              valueKey="aaa102"
              placeholder="请选择困难类型"
              v-model="projectDeclareInfo.j00163"></ComponentDeclarePicker>
            <div class="cell-item required">
              <div class="key">发放期号</div>
              <div class="value">
                <input type="number" v-model="projectDeclareInfo.aae209" placeholder="请输入发放期号" />
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
  import ComponentSelectPermanentAddress from '@/components/project/ez-select-permanent-address/ez-select-permanent-address.vue'
  import ComponentSelectCurrentAddress from '@/components/project/ez-select-current-address/ez-select-current-address.vue'
  import ComponentDeclareCard from '@/components/project/ez-declare-card/ez-declare-card.vue'
  import ComponentDeclarePersonnel from '@/components/project/ez-declare-personnel/ez-declare-personnel.vue'
  import ComponentDeclareRadio from '@/components/project/ez-declare-radio/ez-declare-radio.vue'
  import ComponentDeclarePicker from '@/components/project/ez-declare-picker/ez-declare-picker.vue'

  import { useDeclare } from '@/mixins'
  import { useGetCurrentDate } from '@/hooks/common'
  import { getCodeListByCodeName } from '@/utils/custom-api'
  import { showModal } from '@/utils/uni-api'
  export default {
    name: 'pageDeclare200007',
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
          permanentAddress: true // 户籍地址
        },
        // 自定义添加一些属性 防止双向绑定失败 例如 picker组件之类
        projectDeclareInfo: {
          j00001: '',
          j00163: ''
        }
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
      ComponentDeclarePicker
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
        let j00163 = [] // 学历类型

        try {
          j00163 = await getCodeListByCodeName('J00163')
        } catch (err) {
          console.error('code table j00163 error：', err)
        }

        this.codeMap = {
          ...this.codeMap,
          j00163
        }
      },
      // 检测数据输入格式是否正确 须根据项目需求更改
      handleCheckInput() {
        const { chb0g1, j00001, j00158, j00163, aae209 } = this.projectDeclareInfo
        if (!j00001) {
          showModal('请输入就读学校名称')
          return false
        }
        if (!chb0g1) {
          showModal('请选择入学时间')
          return false
        }
        if (!j00158) {
          showModal('请选择申请时间')
          return false
        }
        if (!j00163) {
          showModal('请选择困难类型')
          return false
        }
        if (!aae209) {
          showModal('请输入发放期号')
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

        const {} = this.basicInfo

        const { chb0g1, j00001, j00158, j00163 } = this.projectDeclareInfo
        // 扩展字段
        const hb00BizMap = {
          chb0g1, // 入学时间
          j00001, // 就读学校名称
          j00158, // 申请时间
          j00163, // 困难类型
          aae019: 0,
          chb01m: '1', // 发放类型 正常发放
          aae209: useGetCurrentDate('month', '') // 发放期号 当前申报年月
        }
        this.handleDeclareData(hb00BizMap, '0')
      }
    }
  }
</script>

<style lang="scss" scoped></style>
