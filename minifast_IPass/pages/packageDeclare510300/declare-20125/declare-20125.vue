<template>
  <!-- 申报特校就读经济困难残疾学生生活费补助 -->
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
        addressRemove="102419"
        @changeDeclareType="handleChangeDeclareType"
        @changeBasicInfo="handleChangeBasicInfo"
        @changeCodeMap="handleChangeCodeMap"
        @changeAgentInfo="handleChangeAgentInfo"
        @changeDataByIdCard="seDataByIdCard">
      </ComponentDeclare>
    </div>

    <!-- start 需要修改的地方开始 在以下代码中根据项目需求更改 上面代码勿动 -->
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
            <ComponentDeclarePicker
              label="申请日期"
              idName="c00200"
              placeholder="请选择申请日期"
              mode="date"
              fields="day"
              :endTime="today_d"
              v-model="projectDeclareInfo.c00200"></ComponentDeclarePicker>

            <div class="cell-item required">
              <div class="key">二代残疾证号</div>
              <div class="value">
                <input
                  type="text"
                  maxlength="20"
                  v-model="projectDeclareInfo.c03601"
                  @change="handleCheckDisability"
                  placeholder="请输入二代残疾证号" />
              </div>
            </div>

            <div class="cell-item required">
              <div class="key">入读学校</div>
              <div class="value">
                <input type="text" v-model="projectDeclareInfo.c00025" placeholder="请输入入读学校" />
              </div>
            </div>

            <ComponentDeclarePicker
              label="就读学校区县"
              idName="c00210"
              :range="codeMap.chb015"
              placeholder="请选择就读学校区县"
              v-model="projectDeclareInfo.c00210"></ComponentDeclarePicker>

            <div class="cell-item required">
              <div class="key">专业</div>
              <div class="value">
                <input type="text" v-model="projectDeclareInfo.c00052" placeholder="请输入专业" />
              </div>
            </div>

            <ComponentDeclarePicker
              label="年级"
              idName="c00144"
              :range="codeMap.c00144"
              placeholder="请选择年级"
              v-model="projectDeclareInfo.c00144"></ComponentDeclarePicker>

            <div class="cell-item required">
              <div class="key">学制</div>
              <div class="value">
                <input type="text" v-model="projectDeclareInfo.c00201" placeholder="请输入学制" />
              </div>
            </div>

            <ComponentDeclarePicker
              label="入学时间"
              idName="c00103"
              placeholder="请选择入学时间"
              mode="date"
              fields="day"
              :endTime="today_d"
              v-model="projectDeclareInfo.c00103"></ComponentDeclarePicker>

            <div class="cell-item required">
              <div class="key">发放金额</div>
              <div class="value">
                <input type="digit" v-model="projectDeclareInfo.aae019" placeholder="请输入发放金额" />
              </div>
            </div>
          </div>
        </div>
      </ComponentPanel>
    </div>

    <div class="declare-info-wrapper">
      <ComponentPanel title="监护人信息">
        <div class="panel-content">
          <div class="cell-items">
            <div class="cell-item required">
              <div class="key">姓名</div>
              <div class="value">
                <input type="text" maxlength="12" v-model="projectDeclareInfo.c77501" placeholder="请输入监护人姓名" />
              </div>
            </div>
            <div class="cell-item required">
              <div class="key">身份证号</div>
              <div class="value">
                <input
                  type="idcard"
                  maxlength="18"
                  v-model="projectDeclareInfo.c77502"
                  placeholder="请输入监护人身份证号"
                  @change="handleBlurW00038" />
              </div>
            </div>
            <div class="cell-item required">
              <div class="key">联系电话</div>
              <div class="value">
                <input
                  type="number"
                  maxlength="11"
                  v-model="projectDeclareInfo.chb0ha"
                  placeholder="请输入监护人联系电话"
                  @change="handleAae005Blur" />
              </div>
            </div>
            <ComponentDeclarePicker
              label="与残疾学生关系"
              :range="codeMap.c00056"
              placeholder="请选择与残疾学生关系"
              v-model="projectDeclareInfo.c00187"></ComponentDeclarePicker>

            <ComponentSelectAddressMultitype
              label="户籍地址"
              placeholder="请选择或输入户籍地址"
              :isShowBtn="renderObj.permanentAddress"
              @clickBtn="projectDeclareInfo.chb0hb = basicInfo.permanentAddress"
              v-model="projectDeclareInfo.chb0hb">
            </ComponentSelectAddressMultitype>
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
  import ComponentDeclareCard from '../components/ez-declare-card/ez-declare-card.vue'
  import ComponentDeclarePersonnel from '@/components/project/ez-declare-personnel/ez-declare-personnel.vue'
  import ComponentDeclareRadio from '@/components/project/ez-declare-radio/ez-declare-radio.vue'
  import ComponentDeclarePicker from '@/components/project/ez-declare-picker/ez-declare-picker.vue'
  import ComponentSelectAddressMultitype from '@/components/project/ez-select-address-multitype/ez-select-address-multitype.vue'
  import { useDeclare } from '@/mixins'

  import { getIsDev, getDate } from '@/utils/get'
  import { checkIDCard, checkPhoneNumber } from '@/utils/check'
  import { getCodeListByCodeName } from '@/utils/custom-api'
  import { showModal } from '@/utils/uni-api'

  export default {
    name: 'pageDeclare20003',
    data() {
      return {
        renderObj: {
          idCard: true, // 身份证
          userName: true, // 姓名
          tel: true, // 联系电话
          age: true, // 年龄
          gender: true, // 性别
          nature: true, // 户口性质
          currentAddress: true, // 现居住地址
          permanentAddress: true // 户籍地址
        },
        today_d: getDate(),
        projectDeclareInfo: {
          j00063: '', // 监护人现居住地址
          chb0gh: '', // 监护人与申请人关系
          aae019: '' // 发放金额
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
      async getCodeTableCacheData() {
        const isDev = getIsDev() // 当前环境是否是开发环境
        let chb015 = [] // 就读区县
        let c00144 = [] // 年级
        let c00056 = [] // 监护人与学生关系

        try {
          chb015 = await getCodeListByCodeName('chb015')
        } catch (err) {
          if (isDev) {
            console.log('code table chb015 error：', err)
          }
        }

        try {
          c00144 = await getCodeListByCodeName('c00144')
        } catch (err) {
          if (isDev) {
            console.log('code table c00144 error：', err)
          }
        }

        try {
          c00056 = await getCodeListByCodeName('c00056')
        } catch (err) {
          if (isDev) {
            console.log('code table c00056 error：', err)
          }
        }

        this.codeMap = {
          ...this.codeMap,
          chb015,
          c00144,
          c00056
        }
      },
      handleCheckDisability(e) {
        const { value } = e.target
        if (value && !this.CheckDisability(value)) {
          showModal('请输入正确的残疾证号')
        }
      },
      // 校验残疾人证
      CheckDisability(value) {
        console.log(value)
        let str = /[\d]{17}[\dX][1-7][1-4]/.test(value)
        console.log(str)
        return str
      },
      // 手动输入手机号 失去焦点监听
      handleAae005Blur(e) {
        const { value } = e.target
        const checkIDCardResult = checkPhoneNumber(value)
        if (checkIDCardResult.status === '0') {
          showModal(checkIDCardResult.msg, '提示', false)
        }
      },
      // 手动输入身份证号 失去焦点监听
      handleBlurW00038(e) {
        const { value } = e.target
        const checkResult = checkIDCard(value)
        if (checkResult.status === '0') {
          showModal(checkResult.msg)
        }
      },
      // 检测数据输入格式是否正确 须根据项目需求更改
      handleCheckInput() {
        const {
          aac004, //性别
          c00015, //现居住地址
          c00106, //户口类别
          chb00l, //年龄
          c00008, //户籍地址

          c00200, //申请日期
          c03601, //二代残疾证号
          c00025, //入读学校
          c00210, //就读学校所属区县
          c00052, //专业
          c00144, //年级
          c00201, //学制
          c00103, //入学时间
          aae019, // 发放金额

          c77501, //监护人姓名
          c77502, //监护人身份证
          chb0ha, //监护人联系电话
          chb0hb, //监护人户籍地址
          c00187 //监护人与残疾学生关系
        } = this.projectDeclareInfo
        if (!c00200) {
          showModal('请选择申请日期')
          return false
        }
        if (!c03601) {
          showModal('请输入二代残疾证号')
          return false
        } else {
          const checkResult = this.CheckDisability(c03601)
          if (!checkResult) {
            showModal('请输入正确的残疾证号')
            return false
          }
        }
        if (!c00025) {
          showModal('请输入入读学校')
          return false
        }
        if (!c00210) {
          showModal('请输入就读学校所属区县')
          return false
        }
        if (!c00052) {
          showModal('请输入专业')
          return false
        }
        if (!c00144) {
          showModal('请输入年级')
          return false
        }
        if (!c00201) {
          showModal('请输入学制')
          return false
        }
        if (!c00103) {
          showModal('请选择入学时间')
          return false
        }
        if (!aae019) {
          showModal('请输入发放金额')
          return false
        }
        if (!c77501) {
          showModal('请输入监护人姓名')
          return false
        }
        if (!c77502) {
          showModal('请输入监护人身份证号码')
          return false
        } else {
          const checkResult = checkIDCard(c77502, '监护人身份证号码')
          if (checkResult.status === '0') {
            showModal(checkResult.msg)
            return false
          }
        }
        if (!chb0ha) {
          showModal('请输入监护人联系电话')
          return false
        } else {
          const checkResult = checkPhoneNumber(chb0ha, '监护人联系电话')
          if (checkResult.status === '0') {
            showModal(checkResult.msg)
            return false
          }
        }
        if (!c00187) {
          showModal('请选择监护人与残疾学生关系')
          return false
        }
        if (!chb0hb) {
          showModal('请输入或选择监护人户籍地址')
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
          age, // 年龄
          gender, // 性别
          nature, // 户口性质
          currentAddress, // 现居住地址
          permanentAddress // 户籍地址
        } = this.basicInfo

        const {
          c00200, //申请日期
          c03601, //二代残疾证号
          c00025, //入读学校
          c00210, //就读学校所属区县
          c00052, //专业
          c00144, //年级
          c00201, //学制
          c00103, //入学时间
          aae019, // 发放金额

          c77501, //监护人姓名
          c77502, //监护人身份证
          chb0ha, //监护人联系电话
          chb0hb, //监护人户籍地址
          c00187 //监护人与残疾学生关系
        } = this.projectDeclareInfo
        // 扩展字段
        var hb00BizMap = {
          aac004: gender, //性别
          c00015: currentAddress, //现居住地址
          c00106: nature, //户口类别
          chb00l: age, //年龄
          c00008: permanentAddress, //户籍地址

          c00200, //申请日期
          c03601, //二代残疾证号
          c00025, //入读学校
          c00210, //就读学校所属区县
          c00052, //专业
          c00144, //年级
          c00201, //学制
          c00103, //入学时间
          aae019, // 发放金额

          c77501, //监护人姓名
          c77502, //监护人身份证
          chb0ha, //监护人联系电话
          chb0hb, //监护人户籍地址
          c00187 //监护人与残疾学生关系
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
