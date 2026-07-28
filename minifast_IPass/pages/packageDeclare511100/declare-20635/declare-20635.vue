<!-- 东西部扶贫资金-劳务协作就业帮扶补助 -->
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
            <div class="cell-item">
              <div class="key">务工地点</div>
              <div class="value">
                <input
                  type="text"
                  v-model="projectDeclareInfo.r00083"
                  placeholder="请输入务工地点"
                />
              </div>
            </div>
            <div class="cell-item required">
              <div class="key">务工时间</div>
              <div class="value">
                <input
                  type="text"
                  v-model="projectDeclareInfo.r00082"
                  placeholder="请输入务工时间"
                />
              </div>
            </div>
            <div class="cell-item">
              <div class="key">务工单位名称</div>
              <div class="value">
                <input
                  type="text"
                  v-model="projectDeclareInfo.r00015"
                  placeholder="请输入务工单位名称"
                />
              </div>
            </div>
            <div class="cell-item">
              <div class="key">单位(雇主)电话</div>
              <div class="value">
                <input
                  type="number"
                  maxlength="11"
                  v-model="projectDeclareInfo.r00173"
                  placeholder="请输入单位(雇主)电话"
                />
              </div>
            </div>
            <ComponentDeclarePicker
              label="是否签署劳动合同"
              idName="r00174"
              :range="codeMap.yesorno"
              rangeKey="aaa103"
              valueKey="aaa102"
              :required="false"
              placeholder="请选择是否签署劳动合同"
              v-model="projectDeclareInfo.r00174"
            ></ComponentDeclarePicker>
            <ComponentDeclarePicker
              label="是否脱贫户"
              idName="r00175"
              :range="codeMap.yesorno"
              rangeKey="aaa103"
              valueKey="aaa102"
              placeholder="请选择是否脱贫户"
              v-model="projectDeclareInfo.r00175"
            ></ComponentDeclarePicker>
            <ComponentDeclarePicker
              label="所在单位是否购买社保"
              idName="r00177"
              :range="codeMap.yesorno"
              rangeKey="aaa103"
              valueKey="aaa102"
              placeholder="请选择所在单位是否购买社保"
              v-model="projectDeclareInfo.r00177"
            ></ComponentDeclarePicker>
            <div class="cell-item required">
              <div class="key">务工总收入</div>
              <div class="value">
                <input
                  type="number"
                  maxlength="11"
                  v-model="projectDeclareInfo.r00176"
                  placeholder="请输入务工总收入"
                />
              </div>
            </div>
            <div class="cell-item required">
              <div class="key">交通补助</div>
              <div class="value">
                <input
                  type="number"
                  maxlength="11"
                  v-model="projectDeclareInfo.r00192"
                  placeholder="请输入交通补助"
                />
              </div>
            </div>
            <div class="cell-item required">
              <div class="key">体检补助</div>
              <div class="value">
                <input
                  type="number"
                  maxlength="11"
                  v-model="projectDeclareInfo.r00193"
                  placeholder="请输入体检补助"
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
import { useGetCurrentDate } from '@/hooks/common'
import { showModal } from '@/utils/uni-api'
export default {
  name: 'pageDeclare20635',
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
        r00174: '',
        r00175: '',
        r00177: '',
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
      const { r00082, r00175, r00177, r00176, r00192, r00193 } =
        this.projectDeclareInfo
      if (!r00082) {
        showModal('请输入务工时间')
        return false
      }
      if (!r00175) {
        showModal('请选择是否脱贫户')
        return false
      }
      if (!r00177) {
        showModal('请选择所在单位是否购买社保')
        return false
      }
      if (!r00176) {
        showModal('请输入务工总收入')
        return false
      }
      if (!r00192) {
        showModal('请输入交通补助')
        return false
      }
      if (!r00193) {
        showModal('请输入体检补助')
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
        r00083,
        r00082,
        r00173,
        r00015,
        r00174,
        r00175,
        r00177,
        r00176,
        r00192,
        r00193,
      } = this.projectDeclareInfo
      // 扩展字段
      const hb00BizMap = {
        r00083, //务工地点
        r00082, //务工时间
        r00015, //务工单位名称
        r00173, //单位(雇主)电话
        r00174, //是否签署劳动合同
        r00175, //是否脱贫户
        r00177, //所在单位是否购买社保
        r00176, //务工总收入
        r00192, // 交通补助
        r00193, // 体检补助
        aae006: permanentAddress, //户籍地址/详细地址
        aae019: 0, //发放金额
        chb01m: '1', // 发放类型 正常发放
        aae209: useGetCurrentDate('month', ''), // 发放期号 当前申报年月
      }
      this.handleDeclareData(hb00BizMap, '0')
    },
  },
}
</script>

<style lang="scss" scoped></style>
