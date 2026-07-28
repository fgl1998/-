<template>
  <!-- 事实无人抚养儿童基本生活补贴 -->
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
    <div class="declare-info-wrapper">
      <ComponentPanel title="申报信息">
        <div class="panel-content">
          <div class="cell-items">
            <ComponentDeclarePicker
              label="健康状况"
              idName="m00092"
              :range="codeMap.m00092"
              placeholder="请选择儿童身体状况"
              v-model="projectDeclareInfo.m00092"
            >
            </ComponentDeclarePicker>

            <ComponentDeclarePicker
              label="儿童学工状况"
              idName="m00093"
              :range="codeMap.m00093"
              placeholder="请选择儿童学工状况"
              v-model="projectDeclareInfo.m00093"
            >
            </ComponentDeclarePicker>

            <ComponentDeclarePicker
              label="与监护人关系"
              idName="m00107"
              :range="codeMap.chp031_1"
              placeholder="请选择与监护人关系"
              v-model="projectDeclareInfo.m00107"
            >
            </ComponentDeclarePicker>
          </div>
        </div>
      </ComponentPanel>
    </div>

    <div class="declare-info-wrapper">
      <ComponentPanel title="父亲信息">
        <div class="panel-content">
          <div class="cell-items">
            <div class="cell-item required">
              <div class="key">父亲姓名</div>
              <div class="value">
                <input
                  type="text"
                  v-model="projectDeclareInfo.m01301"
                  placeholder="请输入父亲姓名"
                />
              </div>
            </div>

            <div class="cell-item required">
              <div class="key">父亲身份证号</div>
              <div class="value">
                <input
                  type="idcard"
                  maxlength="18"
                  v-model="projectDeclareInfo.m01302"
                  placeholder="请输入父亲身份证号"
                  @change="handleBlurW00038"
                />
              </div>
            </div>

            <ComponentDeclarePicker
              label="父亲现状况"
              idName="m00084"
              :range="codeMap.m00084"
              placeholder="请选择父亲现状况"
              v-model="projectDeclareInfo.m00084"
            >
            </ComponentDeclarePicker>

            <div class="cell-item required">
              <div class="key">父亲联系电话</div>
              <div class="value">
                <input
                  type="number"
                  maxlength="11"
                  v-model="projectDeclareInfo.m00088"
                  placeholder="请输入父亲联系电话"
                  @change="handleAae005Blur"
                />
              </div>
            </div>
          </div>
        </div>
      </ComponentPanel>
    </div>

    <div class="declare-info-wrapper">
      <ComponentPanel title="母亲信息">
        <div class="panel-content">
          <div class="cell-items">
            <div class="cell-item required">
              <div class="key">母亲姓名</div>
              <div class="value">
                <input
                  type="text"
                  v-model="projectDeclareInfo.m01303"
                  placeholder="请输入母亲姓名"
                />
              </div>
            </div>

            <div class="cell-item required">
              <div class="key">母亲身份证</div>
              <div class="value">
                <input
                  type="idcard"
                  maxlength="18"
                  v-model="projectDeclareInfo.m01304"
                  placeholder="请输入母亲身份证"
                  @change="handleBlurW00038"
                />
              </div>
            </div>

            <ComponentDeclarePicker
              label="母亲现状况"
              idName="m00085"
              :range="codeMap.m00084"
              placeholder="请选择母亲现状况"
              v-model="projectDeclareInfo.m00085"
            >
            </ComponentDeclarePicker>

            <div class="cell-item required">
              <div class="key">母亲联系电话</div>
              <div class="value">
                <input
                  type="number"
                  maxlength="11"
                  v-model="projectDeclareInfo.m00089"
                  placeholder="请输入母亲联系电话"
                  @change="handleAae005Blur"
                />
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
              <div class="key">监护人姓名</div>
              <div class="value">
                <input
                  type="text"
                  v-model="projectDeclareInfo.m00021"
                  placeholder="请输入监护人姓名"
                />
              </div>
            </div>

            <div class="cell-item required">
              <div class="key">监护人身份证号</div>
              <div class="value">
                <input
                  type="idcard"
                  maxlength="18"
                  v-model="projectDeclareInfo.m00022"
                  placeholder="请输入监护人身份证号"
                  @change="handleBlurW00038"
                />
              </div>
            </div>

            <div class="cell-item required">
              <div class="key">监护人联系电话</div>
              <div class="value">
                <input
                  type="number"
                  maxlength="11"
                  v-model="projectDeclareInfo.m00023"
                  placeholder="请输入监护人联系电话"
                  @change="handleAae005Blur"
                />
              </div>
            </div>

            <ComponentSelectAddressMultitype
              label="监护人现居地址"
              placeholder="请选择或输入监护人现居地址"
              v-model="projectDeclareInfo.m00105"
              :isShowBtn="false"
            >
            </ComponentSelectAddressMultitype>
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
import ComponentSelectAddressMultitype from '@/components/project/ez-select-address-multitype/ez-select-address-multitype.vue'
import { useDeclare } from '@/mixins'

import { getIsDev } from '@/utils/get'
import { checkIDCard, checkPhoneNumber } from '@/utils/check'
import { getCodeListByCodeName } from '@/utils/custom-api'
import { showModal } from '@/utils/uni-api'
export default {
  name: 'pageDeclare20447',

  data() {
    return {
      renderObj: {
        idCard: true, // 身份证
        userName: true, // 姓名
        tel: true, // 联系电话
        permanentAddress: true, // 户籍地址
        currentAddress: true, //现居地址
      },

      projectDeclareInfo: {
        m00105: '',
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
  // 监听页面显示
  onShow() {},
  // 监听页面隐藏
  onHide() {},
  methods: {
    async getCodeTableCacheData() {
      const isDev = getIsDev() // 当前环境是否是开发环境
      let m00092 = [] // 儿童身体状况
      let m00093 = [] // 儿童学工状况
      let chp031_1 = [] // 与监护人关系
      let m00084 = [] // 父母现状

      try {
        m00092 = await getCodeListByCodeName('m00092')
      } catch (err) {
        if (isDev) {
          console.log('code table m00092 error：', err)
        }
      }

      try {
        m00093 = await getCodeListByCodeName('m00093')
      } catch (err) {
        if (isDev) {
          console.log('code table m00093 error：', err)
        }
      }

      try {
        chp031_1 = await getCodeListByCodeName('chp031_1')
      } catch (err) {
        if (isDev) {
          console.log('code table chp031_1 error：', err)
        }
      }

      try {
        m00084 = await getCodeListByCodeName('m00084')
      } catch (err) {
        if (isDev) {
          console.log('code table m00084 error：', err)
        }
      }

      this.codeMap = {
        ...this.codeMap,
        m00092,
        m00093,
        chp031_1,
        m00084,
      }
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
        chb0a9, //户籍地址
        chb0a3, //现居住地址

        m00092, //儿童身体状况
        m00093, //儿童学工状况
        m00107, //与监护人关系

        m01301, //父亲姓名
        m01302, //父亲身份证号
        m00084, //父亲现状况
        m00088, //父亲联系电话

        m01303, //母亲姓名
        m01304, //母亲身份证
        m00085, //母亲现状况
        m00089, //母亲联系电话

        m00021, //监护人姓名
        m00022, //监护人身份证号
        m00023, //监护人联系电话
        m00105, //监护人现居住地址
      } = this.projectDeclareInfo
      if (!m00092) {
        showModal('请选择儿童身体状况')
        return false
      }
      if (!m00093) {
        showModal('请选择儿童学工状况')
        return false
      }
      if (!m00107) {
        showModal('请选择与监护人关系')
        return false
      }

      if (!m01301) {
        showModal('请输入父亲姓名')
        return false
      }
      if (!m01302) {
        showModal('请输入父亲身份证号')
        return false
      } else {
        const checkResult = checkIDCard(m01302, '父亲身份证号')
        if (checkResult.status === '0') {
          showModal(checkResult.msg)
          return false
        }
      }
      if (!m00084) {
        showModal('请选择父亲现状况')
        return false
      }
      if (!m00088) {
        showModal('请输入父亲联系电话')
        return false
      } else {
        const checkResult = checkPhoneNumber(m00088, '父亲联系电话')
        if (checkResult.status === '0') {
          showModal(checkResult.msg)
          return false
        }
      }

      if (!m01303) {
        showModal('请输入母亲姓名')
        return false
      }
      if (!m01304) {
        showModal('请输入母亲身份证号')
        return false
      } else {
        const checkResult = checkIDCard(m01304, '母亲身份证号')
        if (checkResult.status === '0') {
          showModal(checkResult.msg)
          return false
        }
      }
      if (!m00085) {
        showModal('请选择母亲现状况')
        return false
      }

      if (!m00089) {
        showModal('请输入母亲联系电话')
        return false
      } else {
        const checkResult = checkPhoneNumber(m00089, '母亲联系电话')
        if (checkResult.status === '0') {
          showModal(checkResult.msg)
          return false
        }
      }

      if (!m00021) {
        showModal('请输入监护人姓名')
        return false
      }
      if (!m00022) {
        showModal('请输入监护人身份证号')
        return false
      } else {
        const checkResult = checkIDCard(m00022, '监护人身份证号')
        if (checkResult.status === '0') {
          showModal(checkResult.msg)
          return false
        }
      }
      if (!m00023) {
        showModal('请输入监护人联系电话')
        return false
      } else {
        const checkResult = checkPhoneNumber(m00023, '监护人联系电话')
        if (checkResult.status === '0') {
          showModal(checkResult.msg)
          return false
        }
      }
      if (!m00105) {
        showModal('请选择监护人现居住地址')
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
        permanentAddress, //户籍地址
        currentAddress, //现居地址
      } = this.basicInfo

      const {
        m00092, //儿童身体状况
        m00093, //儿童学工状况
        m00107, //与监护人关系

        m01301, //父亲姓名
        m01302, //父亲身份证号
        m00084, //父亲现状况
        m00088, //父亲联系电话

        m01303, //母亲姓名
        m01304, //母亲身份证
        m00085, //母亲现状况
        m00089, //母亲联系电话

        m00021, //监护人姓名
        m00022, //监护人身份证号
        m00023, //监护人联系电话
        m00105, //监护人现居住地址
      } = this.projectDeclareInfo
      // 扩展字段
      const hb00BizMap = {
        chb0a9: permanentAddress, //户籍地址
        chb0a3: currentAddress, //现居住地址

        m00092, //儿童身体状况
        m00093, //儿童学工状况
        m00107, //与监护人关系

        m01301, //父亲姓名
        m01302, //父亲身份证号
        m00084, //父亲现状况
        m00088, //父亲联系电话

        m01303, //母亲姓名
        m01304, //母亲身份证
        m00085, //母亲现状况
        m00089, //母亲联系电话

        m00021, //监护人姓名
        m00022, //监护人身份证号
        m00023, //监护人联系电话
        m00105, //监护人现居住地址
      }

      this.handleDeclareData(hb00BizMap, '0')
    },
  },
  computed: {},
  watch: {},
}
</script>

<style lang="scss" scoped>
.declare-info-wrapper {
  margin-top: 30rpx;
}
</style>
