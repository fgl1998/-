<template>
  <!-- 独生子女父母奖励 -->
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
              label="婚姻状况"
              idName="w00041"
              :range="codeMap.aac017"
              placeholder="请选择婚姻状况"
              v-model="projectDeclareInfo.w00041"
            >
            </ComponentDeclarePicker>

            <div class="cell-item required">
              <div class="key">子女姓名</div>
              <div class="value">
                <input
                  type="text"
                  v-model="projectDeclareInfo.w00004"
                  placeholder="请输入子女姓名"
                />
              </div>
            </div>

            <ComponentDeclarePicker
              label="子女性别"
              idName="w00067"
              :range="codeMap.w00067"
              placeholder="请选择子女性别"
              v-model="projectDeclareInfo.w00067"
            >
            </ComponentDeclarePicker>

            <ComponentDeclarePicker
              label="子女出生时间"
              idName="w00068"
              mode="date"
              fields="day"
              :endTime="new Date().getTime()"
              placeholder="请选择子女出生时间"
              v-model="projectDeclareInfo.w00068"
            ></ComponentDeclarePicker>

            <div class="cell-item required disabled">
              <div class="key">子女年龄</div>
              <div class="value">{{ projectDeclareInfo.w00108 || '暂无' }}</div>
            </div>

            <div class="cell-item required">
              <div class="key">配偶姓名</div>
              <div class="value">
                <input
                  type="text"
                  v-model="projectDeclareInfo.w03006"
                  placeholder="请输入配偶姓名"
                />
              </div>
            </div>

            <div class="cell-item required">
              <div class="key">配偶身份证号码</div>
              <div class="value">
                <input
                  type="idcard"
                  maxlength="18"
                  v-model="projectDeclareInfo.w00038"
                  placeholder="配偶身份证号码"
                  @change="handleBlurM00004"
                />
              </div>
            </div>

            <ComponentSelectAddressMultitype
              label="配偶户籍地址"
              placeholder="请选择配偶户籍地址"
              :isShowBtn="renderObj.permanentAddress"
              @clickBtn="projectDeclareInfo.w00060 = basicInfo.permanentAddress"
              v-model="projectDeclareInfo.w00060"
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
import { checkIDCard } from '@/utils/check'
import { getCodeListByCodeName } from '@/utils/custom-api'
import { showModal } from '@/utils/uni-api'
export default {
  name: 'pageDeclare20599',

  data() {
    return {
      renderObj: {
        idCard: true, // 身份证
        userName: true, // 姓名
        tel: true, // 联系电话
        permanentAddress: true, // 户籍地址
        currentAddress: true, //现居地址
        gender: true, //性别
        nation: true, //民族
      },

      projectDeclareInfo: {
        w00068: '',
        w00108: '',
        w00060: '',
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
      let w00067 = [] // 子女性别
      let aac017 = [] // 婚姻状况

      try {
        w00067 = await getCodeListByCodeName('w00067')
      } catch (err) {
        if (isDev) {
          console.log('code table w00067 error：', err)
        }
      }
      try {
        aac017 = await getCodeListByCodeName('aac017')
      } catch (err) {
        if (isDev) {
          console.log('code table aac017 error：', err)
        }
      }

      this.codeMap = {
        ...this.codeMap,
        w00067,
        aac017,
      }
    },
    // 手动输入户主身份证号 失去焦点监听
    handleBlurM00004(e) {
      const { value } = e.target
      const checkResult = checkIDCard(value)
      if (checkResult.status === '0') {
        showModal(checkResult.msg)
      }
    },
    ages(str) {
      var r = str.match(/^(\d{1,4})(-|\/)(\d{1,2})\2(\d{1,2})$/)
      if (r == null) {
        return false
      }
      var d = new Date(r[1], r[3] - 1, r[4])
      if (
        d.getFullYear() == r[1] &&
        d.getMonth() + 1 == r[3] &&
        d.getDate() == r[4]
      ) {
        var Y = new Date().getFullYear()
        return Y - r[1]
      }
      return false
    },
    // 检测数据输入格式是否正确 须根据项目需求更改
    handleCheckInput() {
      const {
        aac004, //性别
        aac005, //民族
        w00069, //户籍地址
        w00034, //现居住地址

        w00041, //婚姻状况
        w00004, //子女姓名
        w00067, //子女性别
        w00068, //子女出生时间
        w00108, //子女年龄
        w03006, //配偶姓名
        w00038, //配偶身份证号码
        w00060, //配偶户籍地址
      } = this.projectDeclareInfo

      if (!w00041) {
        showModal('请选择婚姻状况')
        return false
      }
      if (!w00004) {
        showModal('请输入子女姓名')
        return false
      }
      if (!w00067) {
        showModal('请选择子女性别')
        return false
      }
      if (!w00068) {
        showModal('请选择子女出生时间')
        return false
      }
      if (!w00108) {
        showModal('请输入子女年龄')
        return false
      }
      if (!w03006) {
        showModal('请输入配偶姓名')
        return false
      }
      if (!w00038) {
        showModal('请输入配偶身份证号码')
        return false
      } else {
        const checkResult = checkIDCard(w00038, '配偶身份证号码')
        if (checkResult.status === '0') {
          showModal(checkResult.msg)
          return false
        }
      }
      if (!w00060) {
        showModal('请输入配偶户籍地址')
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
        currentAddress, //现居地址
        gender, //性别
        nation, //民族
      } = this.basicInfo

      const {
        aac004, //性别
        aac005, //民族
        w00069, //户籍地址
        w00034, //现居住地址

        w00041, //婚姻状况
        w00004, //子女姓名
        w00067, //子女性别
        w00068, //子女出生时间
        w00108, //子女年龄
        w03006, //配偶姓名
        w00038, //配偶身份证号码
        w00060, //配偶户籍地址
      } = this.projectDeclareInfo
      // 扩展字段
      const hb00BizMap = {
        aac004: gender, //性别
        aac005: nation, //民族
        w00069: permanentAddress, //户籍地址
        w00034: currentAddress, //现居住地址

        w00041, //婚姻状况
        w00004, //子女姓名
        w00067, //子女性别
        w00068, //子女出生时间
        w00108, //子女年龄
        w03006, //配偶姓名
        w00038, //配偶身份证号码
        w00060, //配偶户籍地址
      }

      this.handleDeclareData(hb00BizMap, '0')
    },
  },
  computed: {},
  watch: {
    'projectDeclareInfo.w00068': {
      handler(val) {
        if (val) {
          let res = this.ages(val)
          // console.log(res,typeof res,res == 0)
          if (res === 0 || res) {
            this.projectDeclareInfo.w00108 = res + ''
          }
        }
      },
      immediate: true,
      deep: true,
    },
  },
}
</script>

<style lang="scss" scoped>
.declare-info-wrapper {
  margin-top: 30rpx;
}
</style>
