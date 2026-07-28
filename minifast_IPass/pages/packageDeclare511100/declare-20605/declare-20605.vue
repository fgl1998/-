<!-- 深度贫困县高职技术技能人才免费定向生生活补贴资金 -->
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
        :level="4"
        addressFilter="161116"
        permanentAddressLabel="班级"
        permanentAddressPlaceholder="请选择班级"
        currentAddressLabel="家庭地址"
        currentAddressPlaceholder="请选择或输入家庭地址"
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
            <ComponentDeclarePicker
              label="入学时间"
              idName="chb0g1"
              mode="date"
              fields="day"
              :endTime="new Date().getTime()"
              v-model="projectDeclareInfo.chb0g1"
              placeholder="请选择入学时间"
            ></ComponentDeclarePicker>
            <div class="cell-item required">
              <div class="key">学号</div>
              <div class="value">
                <input
                  type="text"
                  v-model="projectDeclareInfo.j00124"
                  placeholder="请输入学号"
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
              <div class="key">家庭月总收入</div>
              <div class="value">
                <input
                  type="number"
                  v-model="projectDeclareInfo.j00125"
                  placeholder="请输入家庭月总收入"
                />
              </div>
            </div>
            <div class="cell-item required">
              <div class="key">人均月收入</div>
              <div class="value">
                <input
                  type="number"
                  v-model="projectDeclareInfo.j00126"
                  placeholder="请输入人均月收入"
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
import { showModal } from '@/utils/uni-api'
export default {
  name: 'pageDeclare20605',
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
        currentAddress: true, // 家庭地址
        permanentAddress: true, // 户籍地址
      },
      // 自定义添加一些属性 防止双向绑定失败 例如 picker组件之类
      projectDeclareInfo: {
        j00124: '',
        j00023: '',
        chb0gk: '',
        j00036: '',
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
    async getCodeTableCacheData() {},
    // 检测数据输入格式是否正确 须根据项目需求更改
    handleCheckInput() {
      const { chb0g1, j00124, j00023, chb0gk, j00036, j00125, j00126 } =
        this.projectDeclareInfo

      const { group } = this.basicInfo

      if (!group) {
        showModal('请选择到班级！')
        return false
      }

      if (!chb0g1) {
        showModal('请选择入学时间')
        return false
      }
      if (!j00124) {
        showModal('请输入学号')
        return false
      }
      if (!j00023) {
        showModal('请输入专业名称')
        return false
      }
      if (!chb0gk) {
        showModal('请输入家庭人口')
        return false
      }
      if (!j00036) {
        showModal('请输入主要收入来源')
        return false
      }
      if (!j00125) {
        showModal('请输入家庭月总收入')
        return false
      }
      if (!j00126) {
        showModal('请输入人均月收入')
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

      const { currentAddress, idCard, district, township, village } =
        this.basicInfo

      const { chb0g1, j00124, j00023, chb0gk, j00036, j00125, j00126 } =
        this.projectDeclareInfo
      const birthday = useGetBirthdayByIDCard(idCard)

      // 扩展字段
      const hb00BizMap = {
        chb0go: currentAddress, //家庭地址
        j00059: birthday, //出生年月
        chb0g1, //入学时间
        j00124, //学号
        j00023, //专业名称
        chb0gk, //家庭人口
        j00036, //主要收入来源
        j00125, //家庭月总收入
        j00126, //人均月收入
        chb015: district, // 学校
        chb017: township, // 系
        chb018: village, // 年级
        chb01m: '1', // 发放类型 正常发放
        aae209: useGetCurrentDate('month', ''), // 发放期号 当前申报年月
      }
      this.handleDeclareData(hb00BizMap, '0')
    },
  },
}
</script>

<style lang="scss" scoped></style>
