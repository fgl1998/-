<template>
  <view class="ez-declare-wrapper">
    <!-- 代办人基本信息 -->
    <div class="declare" v-if="currentDeclareType === '02'">
      <ComponentPanel title="代办人基本信息" :buttonText="agentPanelButtonText" @click="handleChangeDeclareType('01')">
        <div class="cell-items">
          <div class="cell-item required disabled">
            <div class="key">身份证号</div>
            <div class="value">{{ agentInfo.idCard }}</div>
          </div>
          <div class="cell-item required disabled">
            <div class="key">姓名</div>
            <div class="value">{{ agentInfo.userName }}</div>
          </div>
          <div class="cell-item required">
            <div class="key">联系电话</div>
            <div class="value">
              <input
                type="number"
                maxlength="11"
                @blur="handleAgentTelBlur"
                v-model="agentInfo.tel"
                placeholder="请输入联系电话" />
            </div>
          </div>
        </div>
      </ComponentPanel>
    </div>
    <!-- 申报人基本信息 -->
    <div class="declare">
      <ComponentPanel
        :title="labelPrefix ? labelPrefix + '基本信息' : '申报人基本信息'"
        :buttonText="panelButtonText"
        icon="double_arrow"
        @click="handleChangeDeclareType('02')">
        <div class="cell-items">
          <block v-if="currentDeclareType === '01'">
            <div class="cell-item required disabled" v-if="renderObj.idCard">
              <div class="key">
                {{ labelPrefix ? labelPrefix + '身份证号' : '身份证号' }}
              </div>
              <div class="value">{{ basicInfo.idCard }}</div>
            </div>
            <div class="cell-item required disabled" v-if="renderObj.userName">
              <div class="key">
                {{ labelPrefix ? labelPrefix + '姓名' : '姓名' }}
              </div>
              <div class="value">{{ basicInfo.userName }}</div>
            </div>
            <div class="cell-item required" v-if="renderObj.tel">
              <div class="key">
                {{ labelPrefix ? labelPrefix + '联系电话' : '联系电话' }}
              </div>
              <div class="value">
                <input type="number" maxlength="11" v-model="basicInfo.tel" placeholder="请输入联系电话" />
              </div>
            </div>
          </block>
          <block v-else>
            <div class="cell-item required" v-if="renderObj.idCard" :class="[isOpenOCR ? 'camera' : '']">
              <div class="key">
                {{ labelPrefix ? labelPrefix + '身份证号' : '身份证号' }}
              </div>
              <div class="value">
                <input
                  type="idcard"
                  maxlength="18"
                  v-model="basicInfo.idCard"
                  @blur="handleIdcardBlur"
                  @focus="handleIdcardFocus"
                  placeholder="请输入身份证号" />
                <div class="iconfont iconfont-camera" @click="handleJumpRouteOCR" v-if="isOpenOCR"></div>
              </div>
            </div>
            <div class="cell-item required" v-if="renderObj.userName">
              <div class="key">
                {{ labelPrefix ? labelPrefix + '姓名' : '姓名' }}
              </div>
              <div class="value">
                <input type="text" v-model="basicInfo.userName" @blur="handleUserNameBlur" placeholder="请输入姓名" />
              </div>
            </div>
            <div class="cell-item required" v-if="renderObj.tel">
              <div class="key">
                {{ labelPrefix ? labelPrefix + '联系电话' : '联系电话' }}
              </div>
              <div class="value">
                <input
                  type="number"
                  maxlength="11"
                  @blur="handleDeclareTelBlur"
                  v-model="basicInfo.tel"
                  placeholder="请输入联系电话" />
              </div>
            </div>
          </block>

          <!-- 性别 -->
          <div class="cell-item required disabled" v-if="renderObj.gender">
            <div class="key">性别</div>
            <div class="value">{{ basicInfo.gender_desc || '暂无' }}</div>
          </div>
          <!-- 年龄 -->
          <div class="cell-item required disabled" v-if="renderObj.age">
            <div class="key">年龄</div>
            <div class="value">{{ basicInfo.age || '暂无' }}</div>
          </div>
          <!-- 出生日期 -->
          <div class="cell-item required disabled" v-if="renderObj.birthday">
            <div class="key">出生日期</div>
            <div class="value">{{ basicInfo.birthday || '暂无' }}</div>
          </div>
          <!-- 民族 -->
          <block v-if="renderObj.nation">
            <ComponentDeclarePicker
              label="民族"
              idName="nation"
              placeholder="请选择民族"
              :range="codeMap.aac005"
              v-model="basicInfo.nation"
              @change="getPickerValueDesc"></ComponentDeclarePicker>
          </block>
          <!-- 户口性质 -->
          <block v-if="renderObj.nature">
            <ComponentDeclarePicker
              label="户口性质"
              idName="nature"
              placeholder="请选择户口性质"
              :range="codeMap.dac009"
              v-model="basicInfo.nature"
              @change="getPickerValueDesc">
            </ComponentDeclarePicker>
          </block>
          <!-- 学历 -->
          <block v-if="renderObj.education">
            <ComponentDeclarePicker
              label="学历"
              idName="education"
              :range="codeMap.aac011"
              placeholder="请选择学历"
              v-model="basicInfo.education"
              @change="getPickerValueDesc">
            </ComponentDeclarePicker>
          </block>
          <!-- 籍贯 -->
          <block v-if="renderObj.nativePlace">
            <ComponentSelectCurrentAddress
              label="籍贯"
              placeholder="请选择籍贯"
              :level="2"
              v-model="basicInfo.nativePlace">
            </ComponentSelectCurrentAddress>
          </block>
          <!-- 户籍地址 -->
          <block v-if="renderObj.permanentAddress">
            <block v-if="permanentAddressType === 'city'">
              <ComponentSelectPermanentAddress
                :addressFilter="addressFilter"
                :addressRemove="addressRemove"
                :disabled="!!customAddressObj"
                :label="permanentAddressLabel"
                :placeholder="permanentAddressPlaceholder"
                v-model="basicInfo.permanentAddress"
                @change="handleChangePermanentAddress"
                :level="level">
              </ComponentSelectPermanentAddress>
            </block>
            <block v-else>
              <ComponentSelectAddressMultitype
                v-model="basicInfo.permanentAddress"
                :isShowBtn="false"
                :label="permanentAddressLabel"
                :placeholder="permanentAddressPlaceholder"></ComponentSelectAddressMultitype>
            </block>
          </block>
          <!-- 现居住地址 -->
          <block v-if="renderObj.currentAddress">
            <ComponentSelectAddressMultitype
              :label="currentAddressLabel"
              :isShowBtn="renderObj.permanentAddress"
              :placeholder="currentAddressPlaceholder"
              :buttonName="buttonName"
              @clickBtn="basicInfo.currentAddress = basicInfo.permanentAddress"
              v-model="basicInfo.currentAddress"></ComponentSelectAddressMultitype>
          </block>
          <!-- 社保卡金融状态 -->
          <div class="cell-item disabled" v-if="renderObj.SSCState">
            <div class="key">社保卡金融状态</div>
            <div class="value">{{ basicInfo.SSCState_desc || '暂无' }}</div>
          </div>
          <!-- 社保卡银行类别 -->
          <div class="cell-item disabled" v-if="renderObj.SSCBankCardCategory">
            <div class="key">社保卡银行类别</div>
            <div class="value">
              {{ basicInfo.SSCBankCardCategory_desc || '暂无' }}
            </div>
          </div>
          <!-- 社保卡银行卡号 -->
          <div class="cell-item disabled" v-if="renderObj.SSCNumber">
            <div class="key">社保卡编号</div>
            <div class="value">{{ basicInfo.SSCNumber || '暂无' }}</div>
          </div>
          <!-- 社保卡银行卡号 -->
          <div class="cell-item disabled" v-if="renderObj.SSCBankCardNumber">
            <div class="key">社保卡银行卡号</div>
            <div class="value">
              {{ basicInfo.SSCBankCardNumber || '暂无' }}
            </div>
          </div>
          <!-- 健康状况 -->
          <!-- <block>
            <div class="declare-tip">
              健康状况是针对吃饭、穿衣、上下床、如厕、室内行走、洗澡能力等6项指标进行评估。6项指标都能自主完成的，认定为“自理”；有1～3项不能自主完成的，认定为“半自理”；有4项及以上不能自主完成的，认定为“失能”。
            </div>
          </block> -->
        </div>
      </ComponentPanel>
    </div>
  </view>
</template>

<script>
  import ComponentPanel from '@/components/common/ez-panel/ez-panel.vue'
  import ComponentDeclarePicker from '@/components/project/ez-declare-picker/ez-declare-picker.vue'
  import ComponentSelectPermanentAddress from '@/components/project/ez-select-permanent-address/ez-select-permanent-address.vue'
  import ComponentSelectAddressMultitype from '@/components/project/ez-select-address-multitype/ez-select-address-multitype.vue'
  import ComponentSelectCurrentAddress from '@/components/project/ez-select-current-address/ez-select-current-address.vue'
  import config from '@/config/index'

  import { requestSPGetHo08, requestSPGetHo07Info, requestB043, requestSPGetAc01AddressByAac002 } from '@/service/api'
  import { getBirthday, getAge, getGender, getIsDev, getDeclareConfig } from '@/utils/get'
  import { checkIDCard, checkPhoneNumber } from '@/utils/check'
  import { getCodeListByCodeName } from '@/utils/custom-api'
  import { setNavigationBarTitle, hideLoading, showLoading, navigateTo, showModal } from '@/utils/uni-api'

  import { OCR_INFO, USER_INFO } from '@/store/constants' // 常量
  import { mapGetters } from 'vuex'
  /**
userName // 姓名
tel // 电话号码
idCard // 身份证号
age // 年龄
gender // 性别 码值
gender_desc // 性别 中文
birthday // 出生年月
SSCNumber // 社保卡编码
SSCBankCardNumber // 社保卡银行卡卡号
SSCState // 社保卡状态
SSCState_desc // 社保卡状态 中文
SSCBankCardCategory // 社保卡银行种类 码值
SSCBankCardCategory_desc // 社保卡银行种类 中文
nation // 民族
education // 学历
nativePlace // 籍贯
nature // 户口性质
permanentAddress // 户籍地址
currentAddress // 现居住地址
district // 受理区县编码
township // 受理乡镇编码
village // 受理村编码
*/
  /**
   * 申报组件
   * @description 申报组件
   */
  export default {
    name: 'ezDeclare',
    props: {
      // 渲染数据
      renderObj: {
        type: [Object],
        default: () => {
          return {
            idCard: true, // 身份证
            userName: true, // 姓名
            age: true, // 年龄
            tel: true, // 联系电话
            gender: true, // 性别
            nation: true, // 民族
            education: true, // 学历
            birthday: true, // 出生日期
            nativePlace: true, // 籍贯
            nature: true, // 户口性质
            permanentAddress: true, // 户籍地址
            currentAddress: true, // 现居住地址
            SSCBankCardNumber: true, // 社保卡银行卡号
            SSCNumber: true, // 社保卡编号
            SSCState: true, // 社保卡状态
            SSCBankCardCategory: true // 社保卡银行卡类别
          }
        }
      },
      // 自定义户籍地址信息
      customAddressObj: {
        type: Object,
        default: () => {
          return null
        }
      },
      // 补贴项目配置
      declareConfig: {
        type: [Object],
        default: () => {
          return null
        }
      },
      // 初始化数据
      initData: {
        type: [Object],
        default: () => {
          return null
        }
      },
      // 是否开启ocr识别 兼容达州
      isOpenOCR: {
        type: [Boolean],
        default: false
      },
      // 地址筛选
      addressFilter: {
        type: [String],
        default: ''
      },

      // 户籍地址类型 city 地级市 country 全国
      permanentAddressType: {
        type: [String],
        default: 'city'
      },
      // 申报类型 01 自主申报 02 代为申报
      declareType: {
        type: [String],
        default: ''
      },
      // 固定申报类型 01 自主申报 02 代为申报
      fixedDeclareType: {
        type: [String],
        default: ''
      },
      // 补贴项目编码
      projectNumber: {
        type: [Number],
        required: true
      },
      // 补贴项目名称
      projectName: {
        type: [String],
        default: ''
      },
      permanentAddressLabel: {
        type: [String],
        default: '户籍地址'
      },
      permanentAddressPlaceholder: {
        type: [String],
        default: '请选择户籍地址'
      },
      currentAddressLabel: {
        type: [String],
        default: '现居住地址'
      },
      currentAddressPlaceholder: {
        type: [String],
        default: '请选择或输入现居住地址'
      },
      buttonName: {
        type: [String],
        default: '复用户籍地址'
      },
      // 前缀
      labelPrefix: {
        type: [String],
        default: ''
      },
      notAutoGetPer: {
        type: [Boolean],
        default: false
      },
      // 地址移除
      addressRemove: {
        type: [String],
        default: ''
      },
      // 地址层级
      level: {
        type: [Number],
        default: 3
      }
    },
    data() {
      return {
        currentDeclareType: '', // 当前申报类型 自主申报 01 代为申报 02
        panelButtonText: '', // panel 右侧按钮文本
        agentPanelButtonText: '', // panel 右侧按钮文本 代办
        isOCR: false, // 是否为OCR识别
        // 经办人信息
        agentInfo: {
          userName: '',
          idCard: '',
          tel: ''
        },
        // 申报基本信息
        basicInfo: {
          currentAddress: '', // 现居住地址
          permanentAddress: '', // 户籍地址
          nativePlace: '', // 籍贯
          tel: '',
          gender_desc: ''
        },
        // 储存所有用到的码表
        codeMap: {
          aac011: [], // 学历
          aaz502: [], // 社保卡状态
          aac004: [], // 性别
          aac005: [], // 民族
          aae008: [], // 社保卡银行类别
          yesorno: [] // 是否
        },
        codeMapLoadingOver: false, // 码表是否加载完成
        // 申报配置
        declareConfig_local: {
          isCheckDisability: false, // 是否校验残疾人
          isCheckFileAndRegister: false // 是否校验建档立卡用户
        }
      }
    },
    components: {
      ComponentPanel,
      ComponentDeclarePicker,
      ComponentSelectPermanentAddress,
      ComponentSelectAddressMultitype,
      ComponentSelectCurrentAddress
    },
    created() {},
    mounted() {
      this.updateDeclareConfig()
    },
    methods: {
      // 设置默认信息 用于演示
      setDefaultData() {
        // 杨钰宁 511002198812031225
        const { idCard } = this.userInfo
        if (idCard == '511002198812031225') {
          this.basicInfo = {
            ...this.basicInfo,
            nativePlace: '四川省-内江市',
            nature: '01',
            nature_desc: '城镇户口',
            nation: '01',
            nation_desc: '汉族',
            permanentAddress: '四川省内江市东兴区田家镇'
          }
        }

        // if (idCard == '511526199912254218' || idCard == '511325199604210056' || idCard == '510124199111053218') {
        //   this.basicInfo = {
        //     ...this.basicInfo,
        //     nativePlace: '四川省-内江市-东兴区',
        //     nature: '01',
        //     nature_desc: '城镇户口',
        //     nation: '01',
        //     nation_desc: '汉族',
        //     permanentAddress: '四川省内江市东兴区田家镇',
        //     district: '165003',
        //     township: '165116'
        //   }
        // }
      },
      // 获取码表
      async getCollection() {
        const isDev = getIsDev() // 当前环境是否是开发环境
        let aaz502 = [], // 社保卡状态
          aae008 = [], // 社保卡银行类别
          aac011 = [], // 学历
          aac004 = [], // 性别
          aac005 = [], // 民族
          dac009 = [], // 户口性质
          yesorno = [] // 是否
        try {
          aaz502 = await getCodeListByCodeName('aaz502')
        } catch (err) {
          if (isDev) {
            console.log('code table aaz502 error：', err)
          }
        }
        try {
          aae008 = await getCodeListByCodeName('aae008')
        } catch (err) {
          if (isDev) {
            console.log('code table aae008 error：', err)
          }
        }
        try {
          aac011 = await getCodeListByCodeName('aac011')
        } catch (err) {
          if (isDev) {
            console.log('code table aac011 error：', err)
          }
        }
        try {
          aac004 = await getCodeListByCodeName('aac004')
        } catch (err) {
          if (isDev) {
            console.log('code table aac004 error：', err)
          }
        }
        try {
          aac005 = await getCodeListByCodeName('aac005')
        } catch (err) {
          if (isDev) {
            console.log('code table aac005 error：', err)
          }
        }

        try {
          dac009 = await getCodeListByCodeName('dac009')
        } catch (err) {
          if (isDev) {
            console.log('code table dac009 error：', err)
          }
        }
        try {
          yesorno = await getCodeListByCodeName('yesorno')
        } catch (err) {
          if (isDev) {
            console.log('code table yesorno error：', err)
          }
        }

        this.codeMap = {
          ...this.codeMap,
          aaz502,
          aac011,
          dac009,
          aac004,
          aac005,
          aae008,
          yesorno
        }
        this.codeMapLoadingOver = true
        this.$emit('changeCodeMap', this.codeMap)
      },
      // 固定申报模式改变
      changeFixedDeclareType(declareType) {
        const projectName = this.projectName
        this.panelButtonText = ''
        this.agentPanelButtonText = ''
        if (declareType === '01') {
          setNavigationBarTitle('自主申报' + projectName)
        }
        if (declareType === '02') {
          setNavigationBarTitle('为他人申报' + projectName)
        }
        this.updateData()
        this.currentDeclareType = declareType
      },
      // 设置经办人信息
      setAgentInfo() {
        const { idCard, userName, tel } = this.userInfo
        this.agentInfo = {
          ...this.agentInfo,
          idCard,
          userName,
          tel
        }
        this.$emit('changeAgentInfo', this.agentInfo)
      },
      // 设置申报人基本信息
      setBasicInfo() {
        showLoading()
        const addressFilter = this.addressFilter // 户籍地址地址过滤
        const addressRemove = this.addressRemove
        const initData = this.initData
        const codeMapLoadingOver = this.codeMapLoadingOver
        if (!codeMapLoadingOver) {
          this.getCollection()
        }

        const {
          idCard, // 身份证号
          userName, // 姓名
          tel, // 电话
          aac203: SSCBankCardNumber, // 社保卡银行卡卡号
          aaz502: SSCState, // 社保卡状态
          aaz502Desc: SSCState_desc,
          aaf002: SSCBankCardCategory, // 社保卡银行种类
          aaf002Desc: SSCBankCardCategory_desc,
          aaz500: SSCNumber,
          aaz702
        } = this.userInfo

        let tempObj = {}
        tempObj = {
          ...tempObj,
          userName,
          tel,
          idCard,
          age: getAge(idCard),
          gender_desc: getGender(idCard),
          birthday: getBirthday(idCard),
          SSCNumber,
          SSCBankCardNumber,
          SSCState,
          SSCState_desc,
          SSCBankCardCategory,
          SSCBankCardCategory_desc,
          aaz702,
          nation: '',
          education: '',
          nativePlace: '',
          nature: '',
          permanentAddress: '',
          currentAddress: ''
        }
        this.updateBasicInfo(tempObj)

        if (initData) {
          this.updateBasicInfo(initData)
        } else {
          if (this.notAutoGetPer) {
            this.updateBasicInfo(tempObj)
            return
          }
          return
          // 广安地市不使用 暂所有地市不使用
          if (config.areaCode !== '511600') {
            requestSPGetAc01AddressByAac002(idCard, true, false).then((res) => {
              const { aac021, chb015, chb017, chb018 } = res
              // 固定区县过滤
              if (addressFilter) {
                const addressFilterArr = addressFilter.split(',')
                if (addressFilterArr.includes(chb015)) {
                  tempObj = {
                    ...this.tempObj,
                    permanentAddress: aac021 || '',
                    district: chb015,
                    township: chb017,
                    village: chb018
                  }
                }
              } else if (addressRemove) {
                const addressRemoveArr = addressRemove.split(',')
                if (!addressRemoveArr.includes(chb015)) {
                  tempObj = {
                    ...this.tempObj,
                    permanentAddress: aac021 || '',
                    district: chb015,
                    township: chb017,
                    village: chb018
                  }
                }
              } else {
                tempObj = {
                  ...tempObj,
                  permanentAddress: aac021 || '',
                  district: chb015,
                  township: chb017,
                  village: chb018
                }
              }
              this.updateBasicInfo(tempObj)
            })
          }
        }
      },
      // 更新数据
      updateData() {
        const currentDeclareType = this.currentDeclareType
        const { user_id } = this.userInfo
        if (!user_id) {
          return
        }
        if (currentDeclareType === '02') {
          this.updateBasicInfo({
            idCard: '', // 身份证
            userName: '', // 姓名
            age: '', // 年龄
            tel: '', // 联系电话
            gender_desc: '', // 性别 中文
            nation: '', // 民族
            education: '', // 学历
            birthday: '', // 出生日期
            nativePlace: '', // 籍贯
            nature: '', // 户口性质
            permanentAddress: '', // 户籍地址
            currentAddress: '', // 现居住地址
            SSCBankCardNumber: '', // 社保卡银行卡号
            SSCNumber: '', // 社保卡编号
            SSCState: '', // 社保卡状态
            SSCState_desc: '',
            SSCBankCardCategory: '', // 社保卡银行卡类别
            SSCBankCardCategory_desc: '',
            district: '',
            township: '',
            village: ''
          })
          this.getCollection()
        }
        if (currentDeclareType === '01') {
          this.setBasicInfo()
        }
      },
      // 更新申报人基本信息
      updateBasicInfo(data = {}, isEmit = true) {
        if (config.areaCode !== '511300') {
          hideLoading()
        }
        this.basicInfo = {
          ...this.basicInfo,
          ...data
        }
        if (this.customAddressObj) {
          this.basicInfo = {
            ...this.basicInfo,
            ...this.customAddressObj
          }
        }
        if (isEmit) {
          this.$emit('changeBasicInfo', this.basicInfo)
        }
        this.setDefaultData()
      },
      // 更新页面配置
      updateDeclareConfig() {
        const declareConfig = this.declareConfig
        const declareConfig_local = getDeclareConfig(this.projectNumber)
        if (declareConfig) {
          this.declareConfig_local = { ...declareConfig }
        } else {
          this.declareConfig_local = { ...declareConfig_local }
        }
      },

      // 获取 picker 的中文
      getPickerValueDesc(id, val) {
        this.updateBasicInfo({
          [id + '_desc']: val
        })
      },
      // 通过身份证号查询一些信息
      getDataByIdCard(idCard) {
        const { isCheckDisability } = this.declareConfig_local
        let result = {}
        if (isCheckDisability) {
          // 查询残疾人信息
          requestSPGetHo08(idCard, true, false)
            .then((res) => {
              result.disabledInfo = res
              this.$emit('changeDataByIdCard', result)
            })
            .catch((err) => {
              result.disabledInfo = {
                c03601: '',
                chb0h1: '',
                chb0h1Desc: '',
                chb0h2: '',
                chb0h2Desc: '',
                chb0h9: '',
                chb0hf: ''
              }
              this.$emit('changeDataByIdCard', result)
              // showModal('系统检测到申报人不是残疾人，无法申报该补贴项目！')
            })
        }
      },
      // 通过身份证和姓名查询一些信息 未完全完善
      getDataByIdCardUserName(idCard, userName) {
        this.$emit('changeUserNameAndIdCard', idCard, userName)
        const { isCheckFileAndRegister, isShowSSCSInfo } = this.declareConfig_local
        const projectNumber = this.projectNumber
        if (isCheckFileAndRegister) {
          // 查询建档立卡信息
          requestSPGetHo07Info(idCard, userName, projectNumber, true, false)
            .then((res) => {
              const { code } = res
              if (code == '-1') {
                this.$emit('changeDataByIdCardUserName', false)
                showModal('系统检测到申报人不是建档立卡贫困户，无法申报该补贴项目！')
              } else {
                this.$emit('changeDataByIdCardUserName', true)
              }
            })
            .catch(() => {
              this.$emit('changeDataByIdCardUserName', false)
              showModal('系统检测到申报人不是建档立卡贫困户，无法申报该补贴项目！')
            })
        }
        if (isShowSSCSInfo && config.areaCode !== '511000') {
          // 查询申报人社保卡信息
          requestB043(idCard, userName, true, false)
            .then((res) => {
              this.SSCErrorTip()
              this.$emit('changeDataByIdCardBank', res)
            })
            .catch(() => {})
        }
      },
      // 社保卡错误提示
      SSCErrorTip(state, aaz702) {
        const { isOpenSSCStateDisabledTip } = this.declareConfig_local
        if (isOpenSSCStateDisabledTip) {
          if (state == '0') {
            showModal('您的社保卡或银行卡未激活，为了不影响补贴发放请尽快激活。')
          }
          if (state == '1') {
            if (aaz702 != '可代扣代发') {
              showModal('您的社保卡或银行卡' + aaz702 + '，为了不影响补贴发放请尽快处理。')
            }
          }
          if (state == '2') {
            showModal('您的社保卡或银行卡已挂失，为了不影响补贴发放请尽快处理。')
          }
          if (state == '9') {
            showModal('您的社保卡或银行卡已注销，为了不影响补贴发放请尽快处理。')
          }
        }
      },
      // 捕获户籍地址改变 不用修改
      handleChangePermanentAddress(arr) {
        // console.log(arr, 'arr====================================')
        const district = arr[0].orgid // 区县编码
        const township = arr[1].orgid // 乡镇编码
        const village = arr[2] ? arr[2].orgid : '' // 村编码
        const group = arr[3] ? arr[3].orgid : '' // 组编码
        this.updateBasicInfo({
          district,
          township,
          village,
          group
        })
      },
      // 申报模式改变
      handleChangeDeclareType(declareType) {
        const projectName = this.projectName
        this.agentPanelButtonText = '自主申报'
        if (declareType === '01') {
          this.panelButtonText = '为他人申报'
          setNavigationBarTitle('自主申报' + projectName)
        }
        if (declareType === '02') {
          this.panelButtonText = ''
          setNavigationBarTitle('为他人申报' + projectName)
        }
        this.currentDeclareType = declareType
        this.updateData()
        this.$emit('changeDeclareType', declareType)
      },
      // 跳转路由至ocr识别 不用修改
      handleJumpRouteOCR() {
        navigateTo('ocr', 'packageDeclare')
      },
      // 手动输入身份证号 获取焦点监听
      handleIdcardFocus() {
        this.isOCR = false
      },
      // 手动输入身份证号 失去焦点 回调函数
      handleIdcardBlur(e) {
        const labelPrefix = this.labelPrefix
        let tip = '申报人身份证号'
        let { value } = e.target
        value = value.trim()
        if (labelPrefix) {
          tip = labelPrefix + '身份证号'
        }
        const checkIDCardResult = checkIDCard(value, tip)
        if (checkIDCardResult.status === '0') {
          showModal(checkIDCardResult.msg)
          this.updateBasicInfo({
            birthday: '',
            gender_desc: '',
            age: ''
          })
        } else {
          // 身份证号输入正确
          this.updateBasicInfo({
            birthday: getBirthday(value),
            gender_desc: getGender(value),
            age: getAge(value)
          })
          this.getDataByIdCard(value)
          // 在先输入姓名的情况下
          if (this.basicInfo.userName) {
            this.getDataByIdCardUserName(value, this.basicInfo.userName)
          }
        }
      },
      // 手动输入联系方式 经办人 回调函数
      handleAgentTelBlur(e) {
        let { value } = e.target
        value = value.trim()
        const checkResult = checkPhoneNumber(value, '代办人联系电话')
        if (checkResult.status === '0') {
          showModal(checkResult.msg)
        }
      },
      // 手动输入联系方式 申报人 回调函数
      handleDeclareTelBlur(e) {
        const labelPrefix = this.labelPrefix
        let tip = '申报人联系电话'
        let { value } = e.target
        value = value.trim()
        if (labelPrefix) {
          tip = labelPrefix + '联系电话'
        }
        const checkResult = checkPhoneNumber(value, '申报人联系电话')
        if (checkResult.status === '0') {
          showModal(checkResult.msg)
        }
      },
      // 手动输入姓名 失去焦点监听
      handleUserNameBlur() {
        const { idCard, userName } = this.basicInfo
        this.updateBasicInfo({
          userName
        })
        if (idCard) {
          this.getDataByIdCardUserName(idCard, userName)
        }
      }
    },
    computed: {
      ...mapGetters([USER_INFO, OCR_INFO])
    },
    watch: {
      // 监听民族改变
      'basicInfo.nation': {
        handler() {
          this.updateBasicInfo()
        },
        immediate: true
      },
      // 监听户口性质改变
      'basicInfo.nature': {
        handler() {
          this.updateBasicInfo()
        },
        immediate: true
      },
      // 监听联系电话改变
      'basicInfo.tel': {
        handler() {
          this.updateBasicInfo()
        },
        immediate: true
      },
      // 监听现居住地址改变
      'basicInfo.currentAddress': {
        handler(val) {
          this.updateBasicInfo()
        },
        immediate: true
      },
      // 监听户籍地址改变
      'basicInfo.permanentAddress': {
        handler() {
          this.updateBasicInfo()
        },
        immediate: true
      },
      // 监听籍贯改变
      'basicInfo.nativePlace': {
        handler() {
          this.updateBasicInfo()
        },
        immediate: true
      },
      // 监听性别改变 获取性别的值
      'basicInfo.gender_desc': {
        handler(val) {
          // console.log('=======basicInfo.gender_desc=====', val)
          const { aac004 } = this.codeMap
          let gender = ''
          if (aac004.length > 0) {
            for (let i = 0, len = aac004.length; i < len; i++) {
              const item = aac004[i]
              if (val === item.aaa103) {
                gender = item.aaa102
                break
              }
            }
          } else {
            val === '男' ? (gender = '1') : (gender = '2')
          }
          this.updateBasicInfo({ gender })
        },
        immediate: true
      },
      // 监听页面配置变化
      declareConfig: {
        handler(val) {
          if (val) {
            this.updateDeclareConfig()
          }
        },
        immediate: true,
        deep: true
      },
      // 监听代办人联系电话改变
      'agentInfo.tel'() {
        this.$emit('changeAgentInfo', this.agentInfo)
      },
      // 监听补贴项目编码改变
      // projectNumber: {
      //   handler(val) {
      //     if (val) {
      //       const currentDeclareType = this.declareType || this.fixedDeclareType
      //       this.handleChangeDeclareType(currentDeclareType)
      //     }
      //   },
      //   immediate: true,
      // },
      // 监听申报类别改变
      declareType: {
        handler(val) {
          if (val && val !== '00') {
            // console.log('declareType change: ', val)
            this.handleChangeDeclareType(val)
          }
        },
        immediate: true
      },
      // 监听固定申报类别改变
      fixedDeclareType: {
        handler(val) {
          if (val && val !== '00') {
            // console.log('fixedDeclareType change: ', val)
            this.changeFixedDeclareType(val)
          }
        },
        immediate: true
      },
      // 监听用户id改变
      'userInfo.user_id': {
        handler(val) {
          if (val) {
            this.setAgentInfo()
            this.updateData()
            //展示使用
            // const { idCard } = this.userInfo
            // if(idCard == '511526199912254218' || idCard == '511325199604210056' || idCard == '510124199111053218'){
            //   this.agentInfo = {
            //   ...this.agentInfo,
            //     idCard: '511011200707284606',
            //     userName: '张强',
            //   }
            // }
          }
        },
        immediate: true
      },
      // 监听ocr识别信息改变 改变申报信息中的申报人信息
      // 此处只把ocr识别出的信息赋到basicInfo上
      'ocrInfo.aac002': {
        handler(val) {
          const currentDeclareType = this.declareType || this.fixedDeclareType
          if (currentDeclareType === '02' && val) {
            // aac002: "511902199708236534"
            // aac003: "张三"
            // aac005Desc: "汉族"
            // aac006: "1995-07-23"
            // aac010: "四川省遂宁市安居区白马镇长沟村2社"
            // filedata: {__ob__: Observer}
            // imgSrc: "http://tmp/LB5Tb07UBMUs15b3932664527d94a31867624a21a5c.jpg"
            // sac004_desc: "男
            const { aac002, aac003, aac005Desc, aac006, aac010, sac004_desc } = this.ocrInfo
            // console.log('======ocrInfo===', val)
            this.updateBasicInfo({
              idCard: aac002,
              userName: aac003,
              nation_desc: aac005Desc,
              gender_desc: sac004_desc,
              age: getAge(aac002),
              birthday: aac006,
              permanentAddress_ocr: aac010
            })
            this.getDataByIdCard(aac002)
            this.getDataByIdCardUserName(aac002, aac003)
          }
        },
        immediate: true,
        deep: true
      },
      customAddressObj: {
        handler(val) {
          if (val) {
            this.basicInfo = {
              ...this.basicInfo,
              ...val
            }
          }
        },
        immediate: true,
        deep: true
      }
    }
  }
</script>

<style lang="scss" scoped></style>
