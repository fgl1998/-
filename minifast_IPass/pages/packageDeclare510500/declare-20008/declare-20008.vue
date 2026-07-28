<template>
  <!-- 雨露计划 -->
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
        :renderData="personnelList"
        :isOpenCategoryNotes="true"
        @change="handleChangePersonnelInfo"
      ></ComponentDeclarePersonnel>
    </div>

    <!-- start 需要修改的地方开始 在以下代码中根据项目需求更改 上面代码勿动 -->
    <div class="declare-info-wrapper">
      <ComponentPanel title="申报信息">
        <div class="panel-content">
          <div class="cell-items">
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
            <ComponentDeclarePicker
              label="学制"
              idName="f00072"
              :range="codeMap.f00072"
              placeholder="请选择学制"
              v-model="projectDeclareInfo.f00072"
              @change="getPickerValueDesc"
            >
            </ComponentDeclarePicker>
            <ComponentDeclarePicker
              label="学历"
              idName="f00025"
              :range="codeMap.f00025"
              placeholder="请选择学历"
              v-model="projectDeclareInfo.f00025"
              @change="getPickerValueDesc"
            >
            </ComponentDeclarePicker>


            <ComponentSelectAddressMultitype
              label="家庭住址"
              placeholder="请选择或输入家庭住址"
              :isShowBtn="renderObj.permanentAddress"
              @clickBtn="projectDeclareInfo.f04201 = basicInfo.permanentAddress"
              v-model="projectDeclareInfo.f04201"
            >
            </ComponentSelectAddressMultitype>

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
                  @change="handleBlurF00022"
                  v-model="projectDeclareInfo.f00022"
                  placeholder="请输入户主身份证号"
                />
              </div>
            </div>
            <ComponentDeclarePicker
              label="与学生关系"
              idName="f00024"
              :range="codeMap.f00024"
              placeholder="请选择与学生关系"
              v-model="projectDeclareInfo.f00024"
              @change="getPickerValueDesc"
            >
            </ComponentDeclarePicker>
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
import ComponentSelectAddressMultitype from '@/components/project/ez-select-address-multitype/ez-select-address-multitype.vue'
import ComponentDeclareCard from '@/components/project/ez-declare-card/ez-declare-card.vue'
import ComponentDeclarePersonnel from '@/components/project/ez-declare-personnel/ez-declare-personnel.vue'
import ComponentDeclareRadio from '@/components/project/ez-declare-radio/ez-declare-radio.vue'
import ComponentDeclarePicker from '@/components/project/ez-declare-picker/ez-declare-picker.vue'

import { useDeclare } from '@/mixins'

import { getIsDev } from '@/utils/get'
import { checkIDCard, checkPhoneNumber } from '@/utils/check'
import { getCodeListByCodeName } from '@/utils/custom-api'
import { showModal } from '@/utils/uni-api'

export default {
  name: 'pageDeclare20021',

  data() {
    return {
      renderObj: {
        idCard: true, // 身份证
        userName: true, // 姓名
        tel: true, // 联系电话
        permanentAddress: true, // 户籍地址
        gender: true, //性别
        age: true // 年龄
      },

      projectDeclareInfo: {
        aac004: '', //性别
        f00018: '', //学校名称
        f00072: '', //学制
        f00025: '', //学历
        f04201: '', //家庭住址
        f00023: '', //户主名称
        f00022: '', //户主身份证号码
        f00024: '' //与学生关系
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
    ComponentSelectAddressMultitype,
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
  // 监听页面显示
  onShow() {},
  // 监听页面隐藏
  onHide() {},
  methods: {
    // 获取该申报项目的所需要的码表数据
    // aaz502、aac011、dac009、aac004、aac005、aae008、yesorno 不用再次获取
    // 编写格式参考达州20033项目
    async getCodeTableCacheData() {
      const isDev = getIsDev() // 当前环境是否是开发环境
      //let SEX = [] //性别
      let f00072 = [] // 学制
      let f00025 = [] //学历
      let f00024 = [] //与学生关系

      // try {
      //   SEX = await getCodeListByCodeName('SEX')
      // } catch (err) {
      //   if (isDev) {
      //     console.log('code table SEX error：', err)
      //   }
      // }

      try {
        f00072 = await getCodeListByCodeName('f00072')
      } catch (err) {
        if (isDev) {
          console.log('code table f00072 error：', err)
        }
      }

      try {
        f00025 = await getCodeListByCodeName('f00025')
      } catch (err) {
        if (isDev) {
          console.log('code table f00025 error：', err)
        }
      }

      try {
        f00024 = await getCodeListByCodeName('f00024')
      } catch (err) {
        if (isDev) {
          console.log('code table f00024 error：', err)
        }
      }

      this.codeMap = {
        ...this.codeMap,
        f00072,
        f00025,
        f00024
      }
    },
    // 手动输入身份证号 失去焦点监听
    handleBlurF00022(e) {
      const { value } = e.target
      const checkResult = checkIDCard(value)
      if (checkResult.status === '0') {
        showModal(checkResult.msg)
        this.projectDeclareInfo.f00022 = ''
      }
    },
    handleChangeDataByIdCard(value) {
      this.seDataByIdCard(value)
    },
    // 检测数据输入格式是否正确 须根据项目需求更改
    handleCheckInput() {
      const { aac004, f00018, f00072, f00025, f04201, f00023, f00022, f00024 } =
        this.projectDeclareInfo
        console.log('this.projectDeclareInfo',this.projectDeclareInfo)
      if (!f00018) {
        showModal('请填写学校名称')
        return false
      }
      if (!f00072) {
        showModal('请选择学制')
        return false
      }
      if (!f00025) {
        showModal('请选择学历')
        return false
      }
      if (!f04201) {
        showModal('请填写家庭住址')
        return false
      }
      if (!f00023) {
        showModal('请填写户主名称')
        return false
      }
      if (!f00022) {
        showModal('请填写户主身份证号码')
        return false
      }
      if (!f00024) {
        showModal('请选择与学生关系')
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

      const { gender } = this.basicInfo
      const { f00018, f00072, f00025, f04201, f00023, f00022, f00024 } =
        this.projectDeclareInfo
      let hb00BizMap = {}
      // 扩展字段
      hb00BizMap = {
        aac004: gender,
        f00018,
        f00072,
        f00025,
        f04201,
        f00023,
        f00022,
        f00024
      }
      this.handleDeclareData(hb00BizMap, '0')
    }
  },
  computed: {},
  watch: {}
}
</script>
  
  <style lang="scss" scoped>
.declare-info-wrapper {
  margin-top: 30rpx;
}
</style>
  