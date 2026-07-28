<!-- 地质灾害避险搬迁安置 自然资源和规划局 -->
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
        permanentAddressLabel="家庭地址"
        permanentAddressPlaceholder="请选择家庭地址"
        @changeDeclareType="handleChangeDeclareType"
        @changeBasicInfo="handleChangeBasicInfo"
        @changeCodeMap="handleChangeCodeMap"
        @changeAgentInfo="handleChangeAgentInfo"
        @changeDataByIdCard="handleChangeDataByIdCard"
        @changeDataByIdCardBank="handleChangeDataByIdCardBank"
      >
      </ComponentDeclare>
    </div>

    <!-- start 需要修改的地方开始 在以下代码中根据项目需求更改 上面代码勿动 -->
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
            <div class="panel-content">
              <div class="cell-items">
                <!-- 组 -->
                <div class="cell-item required">
                  <div class="key">组</div>
                  <div class="value">
                    <input
                      type="text"
                      v-model="projectDeclareInfo.chb019"
                      placeholder="请输入组"
                    />
                  </div>
                </div>
                <ComponentSelectAddressMultitype
                  label="申报地址"
                  placeholder="请选择申报地址"
                  :isShowBtn="renderObj.permanentAddress"
                  @clickBtn="
                    projectDeclareInfo.f00045 = basicInfo.permanentAddress
                  "
                  v-model="projectDeclareInfo.f00045"
                >
                </ComponentSelectAddressMultitype>
                <ComponentDeclarePicker
                  label="入学时间"
                  idName="f00021"
                  mode="date"
                  fields="day"
                  :endTime="today"
                  v-model="projectDeclareInfo.f00021"
                  placeholder="请选择入学时间"
                ></ComponentDeclarePicker>
                <div class="cell-item required">
                  <div class="key">学校名称</div>
                  <div class="value">
                    <input
                      type="text"
                      v-model="projectDeclareInfo.f00018"
                      placeholder="请输入学校名称"
                    />
                  </div>
                </div>
                <div class="cell-item required">
                  <div class="key">学制</div>
                  <div class="value">
                    <input
                      type="text"
                      v-model="projectDeclareInfo.f00020"
                      placeholder="请输入学制"
                    />
                  </div>
                </div>
                <div class="cell-item required">
                  <div class="key">学历</div>
                  <div class="value">
                    <input
                      type="text"
                      v-model="projectDeclareInfo.f00025"
                      placeholder="请输入学历"
                    />
                  </div>
                </div>
                <div class="cell-item required">
                  <div class="key">学籍编号</div>
                  <div class="value">
                    <input
                      type="text"
                      v-model="projectDeclareInfo.f00026"
                      placeholder="请输入学籍编号"
                    />
                  </div>
                </div>
                <div class="cell-item required">
                  <div class="key">专业</div>
                  <div class="value">
                    <input
                      type="text"
                      v-model="projectDeclareInfo.f00019"
                      placeholder="请输入专业"
                    />
                  </div>
                </div>
                <div class="cell-item required">
                  <div class="key">户主名称</div>
                  <div class="value">
                    <input
                      type="text"
                      v-model="projectDeclareInfo.f00023"
                      placeholder="请输入户主名称"
                    />
                  </div>
                </div>
                <div class="cell-item required">
                  <div class="key">户主身份证号</div>
                  <div class="value">
                    <input
                      type="idcard"
                      maxlength="18"
                      v-model="projectDeclareInfo.f00022"
                      placeholder="请输入户主身份证号"
                    />
                  </div>
                </div>
                <div class="cell-item required">
                  <div class="key">与学生关系</div>
                  <div class="value">
                    <input
                      type="text"
                      v-model="projectDeclareInfo.f00024"
                      placeholder="请输入与学生关系"
                    />
                  </div>
                </div>
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
import ComponentDeclareCard from '../components/ez-declare-card/ez-declare-card.vue'
import ComponentDeclarePersonnel from '@/components/project/ez-declare-personnel/ez-declare-personnel.vue'
import ComponentDeclareRadio from '@/components/project/ez-declare-radio/ez-declare-radio.vue'
import ComponentDeclarePicker from '@/components/project/ez-declare-picker/ez-declare-picker.vue'

import { useDeclare } from '@/mixins'
import ComponentSelectAddressMultitype from '@/components/project/ez-select-address-multitype/ez-select-address-multitype.vue'
import { getIsDev, getDate } from '@/utils/get'
import { checkIDCard, checkPhoneNumber } from '@/utils/check'
import { getCodeListByCodeName } from '@/utils/custom-api'
import { showModal } from '@/utils/uni-api'
export default {
  name: 'pageDeclare20121',
  data() {
    return {
      today: getDate('day'),
      // 基本信息 渲染配置
      renderObj: {
        idCard: true, // 身份证
        userName: true, // 姓名
        tel: true, // 联系电话
        permanentAddress: true, // 户籍地址
        nation: true, // 民族
        // SSCBankCardNumber: true, // 社保卡银行卡号
        // SSCBankCardCategory: true, // 社保卡银行卡类别
      },
      // 自定义添加一些属性 防止双向绑定失败 例如 picker组件之类
      projectDeclareInfo: {
        f00045: '', // 申报地址
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
    async getCodeTableCacheData() {},

    handleCheckInput() {
      const {
        f00045, // 申报地址
        f00018, // 学校名称
        f00020, // 学制
        f00025, // 学历
        f00026, // 学籍账号
        f00019, // 专业
        f00023, // 户主名称
        f00022, // 户主身份证号码
        f00024, // 与学生关系
        chb019, //组
        f00021, //入学时间
      } = this.projectDeclareInfo

      if (!chb019) {
        showModal('请输入组（社）')
        return false
      }

      if (!f00045) {
        showModal('请选择或输入申报地址')
        return false
      }
      if (!f00021) {
        showModal('请选择入学时间')
        return false
      }
      if (!f00021) {
        showModal('请输入学校名称')
        return false
      }
      if (!f00020) {
        showModal('请输入学制')
        return false
      }
      if (!f00025) {
        showModal('请输入学历')
        return false
      }
      if (!f00026) {
        showModal('请输入学籍账号')
        return false
      }
      if (!f00019) {
        showModal('请输入专业')
        return false
      }
      if (!f00023) {
        showModal('请输入户主名称')
        return false
      }
      if (!f00022) {
        showModal('请输入户主身份证号码')
        return false
      }
      if (!f00024) {
        showModal('请输入与学生关系')
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
        permanentAddress, // 户籍地址
        nation, // 民族
      } = this.basicInfo

      const {
        f00021, //入学时间
        f00045, // 申报地址
        f00018, // 学校名称
        f00020, // 学制
        f00025, // 学历
        f00026, // 学籍账号
        f00019, // 专业
        f00023, // 户主名称
        f00022, // 户主身份证号码
        f00024, // 与学生关系
        chb019, //组
      } = this.projectDeclareInfo

      // 扩展字段
      const hb00BizMap = {
        f00021, //入学时间
        chb0a9: permanentAddress, // 户籍地址
        aac005: nation, // 民族
        f00045, // 申报地址
        f00018, // 学校名称
        f00020, // 学制
        f00025, // 学历
        f00026, // 学籍账号
        f00019, // 专业
        f00023, // 户主名称
        f00022, // 户主身份证号码
        f00024, // 与学生关系
        chb019, //组
      }
      this.handleDeclareData(hb00BizMap, '0')
    },
  },
  computed: {},
  watch: {},
}
</script>

<style lang="scss" scoped></style>
