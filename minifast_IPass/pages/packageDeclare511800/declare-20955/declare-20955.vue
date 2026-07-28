<template>
  <!-- 农村住房改造提升项目 -->
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

    <!-- start 需要修改的地方开始 在以下代码中根据项目需求更改 上面代码勿动 -->
    <div class="declare-info-wrapper">
      <ComponentPanel title="申报信息">
        <div class="panel-content">
          <div class="cell-items">

            <!-- 房屋结构 -->
            <div class="cell-item required">
              <div class="key">养老机构</div>
              <div class="value">
                <input type="text" v-model="projectDeclareInfo.z00035" placeholder="请输入房屋结构" />
              </div>
            </div>

            <!-- 安全鉴定或评定 -->
            <ComponentDeclarePicker
              label="安全鉴定或评定"
              idName="z00057"
              :range="codeMap.z00057"
              v-model="projectDeclareInfo.z00057"
              placeholder="请选择安全鉴定或评定"></ComponentDeclarePicker>

              <div class="cell-item textarea last">
              <div class="key">备注</div>
              <div class="value">
                <textarea
                  maxlength="100"
                  placeholder="请输入备注"
                  v-model="projectDeclareInfo.chb00q"></textarea>
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

  import ComponentDeclarePersonnel from '@/components/project/ez-declare-personnel/ez-declare-personnel.vue'
  import ComponentDeclareRadio from '@/components/project/ez-declare-radio/ez-declare-radio.vue'
  import ComponentDeclarePicker from '@/components/project/ez-declare-picker/ez-declare-picker.vue'
  import ComponentSelectAddressMultitype from '@/components/project/ez-select-address-multitype/ez-select-address-multitype.vue'
  import { useDeclare } from '@/mixins'

  import { getIsDev } from '@/utils/get'
  import { checkIDCard, checkPhoneNumber } from '@/utils/check'
  import { getCodeListByCodeName } from '@/utils/custom-api'
  import { showModal } from '@/utils/uni-api'

  export default {
    name: 'pageDeclare20955',
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
          z00035: '',//房屋结构
          z00057: '',//安全鉴定或评定
          chb00q: '' //备注
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
      ComponentDeclareRadio,
      ComponentDeclarePersonnel,
      ComponentDeclarePicker,
      ComponentSelectAddressMultitype
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
      getPickerValueDesc(value){ //入职日期改变，设置期号
        console.log(value,999) 
      },
      async getCodeTableCacheData() {
        const isDev = getIsDev() // 当前环境是否是开发环境
        let z00057 = [] // 安全鉴定或评定
        try {
          z00057 = await getCodeListByCodeName('z00057')
        } catch (err) {
          if (isDev) {
            console.log('code table z00057 error：', err)
          }
        }
        this.codeMap = {
          ...this.codeMap,
          z00057
        }
      },
      // 检测数据输入格式是否正确 须根据项目需求更改
      handleCheckInput() {
        const {
          z00035,//房屋结构
          z00057,//安全鉴定或评定
          chb00q//备注
        } = this.projectDeclareInfo

        if (!z00035) {
          showModal('请输入房屋结构', '提示', false)
          return false
        }
        if (!z00057) {
          showModal('请选择安全鉴定或评定', '提示', false)
          return false
        }
        if (!chb00q) {
          showModal('请输入备注', '提示', false)
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
          z00035,//房屋结构
          z00057,//安全鉴定或评定
          chb00q//备注
        } = this.projectDeclareInfo
        let hb00BizMap = {}
        // 扩展字段
        hb00BizMap = {
          aae006: permanentAddress, //户籍地址
          z00035,//房屋结构
          z00057,//安全鉴定或评定
          chb00q//备注
        }

        this.handleDeclareData(hb00BizMap, '0')
      }
    },
    computed: {}
  }
</script>

<style lang="scss" scoped>
  .declare-info-wrapper {
    margin-top: 30rpx;
  }
</style>
