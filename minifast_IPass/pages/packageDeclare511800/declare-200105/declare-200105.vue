<template>
  <!-- 养老护理员岗位补贴及从业年限补贴 -->
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
            <!-- 养老机构 -->
            <div class="cell-item required">
              <div class="key">养老机构</div>
              <div class="value">
                <input type="text" v-model="projectDeclareInfo.chb018" placeholder="请输入养老机构" />
              </div>
            </div>

            <!-- 护理类别 -->
            <ComponentDeclarePicker
              label="护理类别"
              idName="M00102_1"
              :range="codeMap.M00102_1"
              v-model="projectDeclareInfo.m00102"
              placeholder="请选择护理类别"></ComponentDeclarePicker>

            <ComponentDeclarePicker
              label="入职日期"
              idName="m00081"
              mode="date"
              fields="day"
              :endTime="new Date().getTime()"
              placeholder="请选择入职日期"
              v-model="projectDeclareInfo.m00081"
              @change="getPickerValueDesc"></ComponentDeclarePicker>

            <div class="cell-item required disabled">
              <div class="key">发放期号</div>
              <div class="value">
                {{ projectDeclareInfo.aae209 || '暂无' }}
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
    name: 'pageDeclare200105',
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
          chb018: '', //养老机构
          m00102: '', //护理类别
          m00081: '', //入职日期
          aae209: '' //发放期号
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
      getPickerValueDesc(value) {
        //入职日期改变，设置期号
        console.log(value, 999)
        const arr = value.split('-')
        this.projectDeclareInfo.aae209 = arr[0] + arr[1]
      },
      async getCodeTableCacheData() {
        const isDev = getIsDev() // 当前环境是否是开发环境
        let M00102_1 = [] // 护理类别
        try {
          M00102_1 = await getCodeListByCodeName('M00102_1')
        } catch (err) {
          if (isDev) {
            console.log('code table M00102_1 error：', err)
          }
        }
        this.codeMap = {
          ...this.codeMap,
          M00102_1
        }
      },
      // 检测数据输入格式是否正确 须根据项目需求更改
      handleCheckInput() {
        const {
          chb018, //养老机构
          m00102, //护理类别
          m00081 //入职日期
        } = this.projectDeclareInfo

        if (!chb018) {
          showModal('请输入养老机构', '提示', false)
          return false
        }
        if (!m00102) {
          showModal('请选择护理类别', '提示', false)
          return false
        }
        if (!m00081) {
          showModal('请选择入职日期', '提示', false)
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
        const { userName } = this.basicInfo

        const {
          chb018, //养老机构
          m00102, //护理类别
          m00081, //入职日期
          aae209 //发放期号
        } = this.projectDeclareInfo
        let hb00BizMap = {}
        // 扩展字段
        hb00BizMap = {
          aac003: userName, //姓名
          chb018, //养老机构
          m00102, //护理类别
          m00081, //入职日期
          aae209 //发放期号
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
