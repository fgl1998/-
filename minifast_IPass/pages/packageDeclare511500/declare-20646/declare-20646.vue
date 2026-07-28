<!-- 离岗乡村医生生活困难补助 卫健委-->
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
        @changeDataByIdCardBank="handleChangeDataByIdCardBank"
        currentAddressLabel="家庭地址"
        currentAddressPlaceholder="请选择家庭地址"
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
            <div class="panel-content">
              <div class="cell-items">
                <ComponentSelectAddressMultitype
                  label="工作地点（村）"
                  placeholder="请选择工作地点（村）"
                  :isShowBtn="renderObj.permanentAddress"
                  @clickBtn="
                    projectDeclareInfo.w00020 = basicInfo.permanentAddress
                  "
                  v-model="projectDeclareInfo.w00020"
                >
                </ComponentSelectAddressMultitype>

                <ComponentDeclarePicker
                  label="工作开始时间"
                  mode="date"
                  fields="day"
                  :endTime="today_d"
                  placeholder="请选择工作开始时间"
                  v-model="projectDeclareInfo.w00019"
                ></ComponentDeclarePicker>

                <div class="cell-item required">
                  <div class="key">累计工作年限</div>
                  <div class="value">
                    <input
                      type="number"
                      maxlength="3"
                      v-model="projectDeclareInfo.w00031"
                      placeholder="请输入累计工作年限"
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
import ComponentDeclarePersonnel from '@/components/project/ez-declare-personnel/ez-declare-personnel.vue'
import ComponentDeclarePicker from '@/components/project/ez-declare-picker/ez-declare-picker.vue'
import ComponentSelectAddressMultitype from '@/components/project/ez-select-address-multitype/ez-select-address-multitype.vue'

import { useDeclare } from '@/mixins'
import { useGetCurrentDate } from '@/hooks/common'
import { showModal } from '@/utils/uni-api'
export default {
  name: 'pageDeclare20646',
  data() {
    return {
      // 基本信息 渲染配置
      renderObj: {
        idCard: true, // 身份证
        userName: true, // 姓名
        tel: true, // 联系电话
        gender: true, //性别
        permanentAddress: true, // 户籍地
        currentAddress: true, // 家庭地址
        birthday: true, // 出生年月
      },
      today_d: useGetCurrentDate(),
      // 自定义添加一些属性 防止双向绑定失败 例如 picker组件之类
      projectDeclareInfo: {
        w00020: '', // 工作地点
      },
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
    async getCodeTableCacheData() {},
    handleCheckInput() {
      const {
        aac004, //性别
        w00030, //出生日期
        w00131, //家庭地址

        w00020, //工作地点（村）
        w00019, //工作开始时间
        w00031, //累计工作年限
      } = this.projectDeclareInfo

      if (!w00020) {
        showModal('请选择或输入工作地点（村）')
        return false
      }
      if (!w00019) {
        showModal('请选择工作开始时间')
        return false
      }
      if (!w00031) {
        showModal('请输入累计工作年限')
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
        gender, //性别
        currentAddress, // 家庭地址
        birthday, // 出生年月
      } = this.basicInfo

      const {
        w00020, //工作地点（村）
        w00019, //工作开始时间
        w00031, //累计工作年限
      } = this.projectDeclareInfo

      // 扩展字段
      const hb00BizMap = {
        aac004: gender, //性别
        w00030: birthday, //出生日期
        w00131: currentAddress, //家庭地址

        w00020, //工作地点（村）
        w00019, //工作开始时间
        w00031, //累计工作年限
      }
      this.handleDeclareData(hb00BizMap, '0')
    },
  },
  computed: {},
  watch: {},
}
</script>

<style lang="scss" scoped></style>
