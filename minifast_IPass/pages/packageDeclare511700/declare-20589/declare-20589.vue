<!-- 残疾儿童康复训练生活费补贴 -->
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
        isOpenOCR
        :labelPrefix="labelPrefix"
        :projectNumber="chi031"
        :projectName="chi031_desc"
        addressFilter="1569457,1569460,1569463,1569466,1569472,1569475,1569469,1569481,2095930"
        permanentAddressLabel="监护人户籍地址"
        :permanentAddressPlaceholder="permanentAddressPlaceholder"
        currentAddressLabel="监护人现居住地址"
        :currentAddressPlaceholder="currentAddressPlaceholder"
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

    <!-- 申报信息 -->
    <div class="space-top-wrapper">
      <ComponentPanel title="申报信息">
        <div class="panel-content">
          <div class="cell-items">
            <ComponentDeclarePicker
              label="监护人与儿童关系"
              idName="c00066"
              :range="codeMap.c00066"
              placeholder="请选择关系"
              v-model="projectDeclareInfo.c00066"
              @change="getPickerValueDesc"
            >
            </ComponentDeclarePicker>
            <div class="cell-item required">
              <div class="key">儿童姓名</div>
              <div class="value">
                <input
                  type="text"
                  v-model="projectDeclareInfo.c00064"
                  placeholder="请输入儿童姓名"
                />
              </div>
            </div>
            <div class="cell-item required">
              <div class="key">儿童身份证号</div>
              <div class="value">
                <input
                  type="idcard"
                  maxlength="18"
                  @blur="handleBlurC00065"
                  v-model="projectDeclareInfo.c00065"
                  placeholder="请输入儿童身份证号"
                />
              </div>
            </div>
            <div class="cell-item required disabled">
              <div class="key">儿童户籍</div>
              <div class="value">
                {{ projectDeclareInfo.c00063_desc || '暂无' }}
              </div>
            </div>
            <block v-if="isLocalPerson">
              <ComponentSelectAddressMultitype
                label="儿童户籍地址"
                placeholder="请选择或输入儿童户籍地址"
                @clickBtn="
                  projectDeclareInfo.c00008 = basicInfo.permanentAddress
                "
                v-model="projectDeclareInfo.c00008"
              >
              </ComponentSelectAddressMultitype>
            </block>
            <block v-else>
              <ComponentSelectAddressMultitype
                label="儿童现居住地址"
                placeholder="请选择或输入儿童现居住地址"
                :isShowBtn="renderObj.permanentAddress"
                @clickBtn="
                  projectDeclareInfo.chb0he = basicInfo.permanentAddress
                "
                v-model="projectDeclareInfo.chb0he"
              >
              </ComponentSelectAddressMultitype>
            </block>
            <div class="cell-item required">
              <div class="key">康复机构</div>
              <div class="value">
                <input
                  type="text"
                  v-model="projectDeclareInfo.c00060"
                  placeholder="请输入康复机构名称"
                />
              </div>
            </div>
            <ComponentDeclarePicker
              label="康复训练开始时间"
              idName="c00067"
              mode="date"
              fields="day"
              :startTime="today_y"
              :endTime="today"
              placeholder="请选择开始时间"
              v-model="projectDeclareInfo.c00067"
            ></ComponentDeclarePicker>
            <div class="cell-item required">
              <div class="key">康复训练天数</div>
              <div class="value">
                <input
                  type="number"
                  maxlength="3"
                  v-model="projectDeclareInfo.c00068"
                  placeholder="请输入康复训练天数"
                />
              </div>
            </div>
            <div class="cell-item required disabled">
              <div class="key">补贴申报年度</div>
              <div class="value">
                {{ projectDeclareInfo.c00069 }}
              </div>
            </div>
          </div>
        </div>
      </ComponentPanel>
    </div>

    <!--    <div class="space-top-wrapper">
      <ComponentPanel title="儿童残疾信息">
        <div class="panel-content">
          <div class="cell-items">
            <div class="cell-item required disabled">
              <div class="key">残疾人类别</div>
              <div class="value">
                {{ projectDeclareInfo.chb0h1Desc || '暂无' }}
              </div>
            </div>
            <div class="cell-item required disabled">
              <div class="key">残疾等级</div>
              <div class="value">
                {{ projectDeclareInfo.chb0h2Desc || '暂无' }}
              </div>
            </div>
            <div class="cell-item required disabled">
              <div class="key">残疾证号</div>
              <div class="value">{{ projectDeclareInfo.c03601 || '暂无' }}</div>
            </div>
            <div class="cell-item required disabled">
              <div class="key">办证时间</div>
              <div class="value">{{ projectDeclareInfo.chb0h9 || '暂无' }}</div>
            </div>
          </div>
        </div>
      </ComponentPanel>
    </div> -->

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

import { getDate, getIsDev } from '@/utils/get'
import { checkIDCard } from '@/utils/check'
import { getCodeListByCodeName } from '@/utils/custom-api'
import { showModal } from '@/utils/uni-api'

export default {
  name: 'pageDeclare20589',
  data() {
    return {
      labelPrefix: '监护人',
      permanentAddressPlaceholder: '请选择监护人户籍地址',
      currentAddressPlaceholder: '请选择监护人现居住地址',
      today: getDate(),
      today_y: getDate('yearInterval'),
      // 基本信息 渲染配置
      renderObj: {
        idCard: true, // 身份证
        userName: true, // 姓名
        tel: true, // 联系电话
        currentAddress: true, // 现居住地址
        permanentAddress: true // 户籍地址
      },
      // 自定义添加一些属性 防止双向绑定失败 例如 picker组件之类
      projectDeclareInfo: {
        c77501: '', // 监护人姓名
        c77502: '', // 监护人身份证号
        aae005: '', // 监护人联系电话
        aae006: '', // 监护人户籍地址

        c00066: '', // 监护人与儿童关系
        c00063: '', // 儿童户籍类型

        c00064: '', // 儿童姓名
        c00065: '', // 儿童身份证号

        c00008: '', // 儿童户籍地址
        chb0he: '', // 儿童现居地址

        c00060: '', // 康复训练机构
        c00067: '', // 康复训练开始时间
        c00068: '', // 一年康复训练天数

        c00069: getDate('year') // 补贴申报年度

        // chb0h1: '', // 残疾人类别
        // chb0h2: '', // 残疾人等级
      }
    }
  },
  components: {
    ComponentButton,
    ComponentPanel,
    ComponentDeclare,
    ComponentDeclareStep,
    ComponentDeclarePersonnel,
    ComponentDeclarePicker,
    ComponentSelectAddressMultitype
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
    async getCodeTableCacheData() {
      const isDev = getIsDev() // 当前环境是否是开发环境
      let c00063 = [] // 儿童户籍类型
      let c00066 = [] // 监护人与儿童关系

      try {
        c00063 = await getCodeListByCodeName('c00063')
      } catch (err) {
        if (isDev) {
          console.log('code table c00063 error：', err)
        }
      }

      try {
        c00066 = await getCodeListByCodeName('c00066')
      } catch (err) {
        if (isDev) {
          console.log('code table c00066 error：', err)
        }
      }

      this.codeMap = {
        ...this.codeMap,
        c00063,
        c00066
      }
    },
    // 人员信息改变
    changePersonnelInfo(type) {
      // 本地
      if (type === '701') {
        this.projectDeclareInfo = {
          ...this.projectDeclareInfo,
          c00008: '',
          c00063: '1',
          c00063_desc: '本地'
        }
      }
      // 外地
      if (type === '702') {
        this.projectDeclareInfo = {
          ...this.projectDeclareInfo,
          c00008: '',
          c00063: '2',
          c00063_desc: '外地'
        }
      }
    },
    // 手动输入儿童身份证号校验
    handleBlurC00065(e) {
      let { value } = e.target
      value = value.trim()
      const checkResult = checkIDCard(value, '儿童身份证号')
      if (checkResult.status === '0') {
        showModal(checkResult.msg)
      }
    },
    // 检测数据输入格式是否正确 须根据项目需求更改
    handleCheckInput() {
      const {
        c77501, // 监护人姓名
        c77502, // 监护人身份证号
        aae005, // 监护人联系电话
        aae006, // 监护人户籍地址

        c00066, // 监护人与儿童关系
        c00063, // 儿童户籍类型

        c00064, // 儿童姓名
        c00065, // 儿童身份证号

        c00008, // 儿童户籍地址
        chb0he, // 儿童现居地址

        c00060, // 康复训练机构
        c00067, // 康复训练开始时间
        c00068, // 一年康复训练天数

        c00069 // 补贴申报年度

        // chb0h1, // 残疾人类别
        // chb0h2, // 残疾人等级
        // c03601, // 残疾证号
      } = this.projectDeclareInfo

      if (!c00066) {
        showModal('请选择监护人与儿童关系')
        return false
      }
      if (!c00064) {
        showModal('请输入儿童姓名')
        return false
      }

      if (!c00065) {
        showModal('请输入儿童身份证号')
        return false
      } else {
        const checkResult = checkIDCard(c00065, '儿童身份证号')
        if (checkResult.status === '0') {
          showModal(checkResult.msg)
          return false
        }
      }
      if (!c00008 && this.isLocalPerson) {
        showModal('请输入或选择儿童户籍地址')
        return false
      }
      if (!chb0he && !this.isLocalPerson) {
        showModal('请输入或选择儿童现居地址')
        return false
      }

      if (!c00060) {
        showModal('请输入康复训练机构')
        return false
      }

      if (!c00067) {
        showModal('请选择康复训练开始时间')
        return false
      }

      if (c00068 < 1 || c00068 > 365) {
        showModal(
          '康复训练天数输入错误，请重新输入训练天数（康复训练天数在1天到365天之间）'
        )
        return false
      }

      // if (!c03601) {
      //   showModal('申报人不是残疾人，无法申报该补贴项目！')
      //   return false
      // }

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
      const { idCard, tel, permanentAddress, userName, currentAddress } =
        this.basicInfo

      const {
        c77501, // 监护人姓名
        c77502, // 监护人身份证号
        aae005, // 监护人联系电话
        aae006, // 监护人户籍地址

        c00066, // 监护人与儿童关系
        c00063, // 儿童户籍类型

        c00064, // 儿童姓名
        c00065, // 儿童身份证号

        c00008, // 儿童户籍地址
        chb0he, // 儿童现居地址

        c00060, // 康复训练机构
        c00067, // 康复训练开始时间
        c00068, // 一年康复训练天数

        c00069 // 补贴申报年度

        // chb0h1, // 残疾人类别
        // chb0h2, // 残疾人等级
        // c03601, // 残疾证号
      } = this.projectDeclareInfo

      // 扩展字段
      const hb00BizMap = {
        c77501: userName, // 监护人姓名
        c77502: idCard, // 监护人身份证号
        aae005: tel, // 监护人联系电话
        aae006: currentAddress, // 监护人现居住地址
        c00008: permanentAddress, // 监护人户籍地址

        c00066, // 监护人与儿童关系
        c00063, // 儿童户籍类型

        aac003: c00064, // 儿童姓名
        aac002: c00065, // 儿童身份证号

        // c00008, // 儿童户籍地址
        chb0he, // 儿童现居地址

        c00060, // 康复训练机构
        c00067, // 康复训练开始时间
        c00068, // 一年康复训练天数

        c00069 // 补贴申报年度

        // chb0h1, // 残疾人类别
        // chb0h2, // 残疾人等级
        // c03601, // 残疾证号
      }

      this.basicInfo = {
        ...this.basicInfo,
        userName: c00064,
        idCard: c00065
      }

      this.handleDeclareData(hb00BizMap, '0')
    }
  },
  computed: {
    isLocalPerson() {
      const personnelInfo = this.personnelInfo
      let result = false
      if (personnelInfo.cac102 === '701') {
        result = true
      }
      return result
    }
  },
  watch: {
    'personnelInfo.cac102': {
      handler(val) {
        this.changePersonnelInfo(val)
      },
      immediate: true
    },
    'projectDeclareInfo.c00067': {
      handler(val) {
        if (val) {
          this.projectDeclareInfo = {
            ...this.projectDeclareInfo,
            c00069: val.split('-')[0]
          }
        }
      },
      immediate: true
    }
  }
}
</script>

<style lang="scss" scoped></style>
