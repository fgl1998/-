<!-- 残疾人就业(创业)补贴（残联） -->
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
        @changeDataByIdCard="seDataByIdCard"
      >
      </ComponentDeclare>
    </div>
    <div class="space-top-wrapper">
      <ComponentPanel title="申请补贴类型">
        <div class="panel-content">
          <div class="cell-items">
            <ComponentDeclarePersonnel
              :renderData="personnelList"
              @change="handleChangePersonnelInfo"
            >
            </ComponentDeclarePersonnel>
          </div>
        </div>
      </ComponentPanel>
    </div>
    <!-- start 需要修改的地方开始 在以下代码中根据项目需求更改 上面代码勿动 -->
    <div class="space-top-wrapper">
      <ComponentPanel title="申报信息">
        <div class="panel-content">
          <div class="cell-items">
            <div class="cell-item required">
              <div class="key">就业(创业)项目名称</div>
              <div class="value">
                <input
                  type="text"
                  v-model="projectDeclareInfo.c00046"
                  placeholder="请输入项目名称"
                />
              </div>
            </div>
            <ComponentSelectAddressMultitype
              label="就业（创业）地点"
              placeholder="请选择项目地点"
              :isShowBtn="renderObj.permanentAddress"
              @clickBtn="projectDeclareInfo.c00047 = basicInfo.permanentAddress"
              v-model="projectDeclareInfo.c00047"
            >
            </ComponentSelectAddressMultitype>

            <div class="cell-item required">
              <div class="key">扶持带动残疾人数（含本人）</div>
              <div class="value">
                <input
                  type="number"
                  maxlength="6"
                  v-model="projectDeclareInfo.c00037"
                  placeholder="请输入人数"
                />
              </div>
            </div>
            <div class="cell-item required">
              <div class="key">申请补助金额</div>
              <div class="value">
                <input
                  type="digit"
                  maxlength="10"
                  v-model="projectDeclareInfo.c00045"
                  placeholder="请输入申请补助金额"
                />
              </div>
            </div>
            <ComponentDeclarePicker
              label="户籍类别"
              idName="c00128"
              :range="codeMap.c00128"
              placeholder="请选择户籍类别"
              v-model="projectDeclareInfo.c00128"
            >
            </ComponentDeclarePicker>
            <ComponentDeclarePicker
              label="家庭经济状况"
              idName="c00129"
              :range="codeMap.c00129"
              placeholder="请选择家庭经济状况"
              v-model="projectDeclareInfo.c00129"
            >
            </ComponentDeclarePicker>

            <block v-if="personnelInfo.cac102 === '463'">
              <div class="cell-item required">
                <div class="key">出勤天数</div>
                <div class="value">
                  <input
                    type="number"
                    maxlength="3"
                    v-model="projectDeclareInfo.c00132"
                    placeholder="请输入出勤天数"
                  />
                </div>
              </div>
            </block>
            <block v-if="personnelInfo.cac102 === '179'">
              <ComponentDeclarePicker
                label="灵活就业类型"
                idName="c00131"
                :range="codeMap.c00131"
                placeholder="请选择灵活就业类型"
                v-model="projectDeclareInfo.c00131"
              >
              </ComponentDeclarePicker>
            </block>

            <div class="cell-item required">
              <div class="key">二代残疾证号</div>
              <div class="value">
                <input
                  type="text"
                  maxlength="20"
                  v-model="projectDeclareInfo.c03601"
                  placeholder="请输入残疾证号"
                  @change="handleCheckDisability"
                />
              </div>
            </div>

            <ComponentDeclarePicker
              label="残疾类别"
              idName="chb0h1"
              :range="codeMap.chb0h1"
              v-model="projectDeclareInfo.chb0h1"
              placeholder="请选择残疾类别"
            ></ComponentDeclarePicker>

            <ComponentDeclarePicker
              label="残疾等级"
              idName="chb0h2"
              :range="codeMap.chb0h2"
              v-model="projectDeclareInfo.chb0h2"
              placeholder="请选择残疾等级"
            ></ComponentDeclarePicker>
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

import ComponentSelectAddressMultitype from '@/components/project/ez-select-address-multitype/ez-select-address-multitype.vue'
import ComponentDeclareStep from '@/components/project/ez-declare-step/ez-declare-step.vue'
import ComponentDeclare from '@/components/project/ez-declare/ez-declare.vue'
import ComponentSelectPermanentAddress from '@/components/project/ez-select-permanent-address/ez-select-permanent-address.vue'
import ComponentSelectCurrentAddress from '@/components/project/ez-select-current-address/ez-select-current-address.vue'
import ComponentDeclareCard from '../components/ez-declare-card/ez-declare-card.vue'
import ComponentDeclarePersonnel from '@/components/project/ez-declare-personnel/ez-declare-personnel.vue'
import ComponentDeclareRadio from '@/components/project/ez-declare-radio/ez-declare-radio.vue'
import ComponentDeclarePicker from '@/components/project/ez-declare-picker/ez-declare-picker.vue'

import { useDeclare } from '@/mixins'

import { getIsDev } from '@/utils/get'
import { checkIDCard, checkPhoneNumber } from '@/utils/check'
import { getCodeListByCodeName } from '@/utils/custom-api'
import { navigateBack, showModal } from '@/utils/uni-api'
export default {
  name: 'pageDeclare20201',
  data() {
    return {
      // 基本信息 渲染配置
      renderObj: {
        idCard: true, // 身份证
        userName: true, // 姓名
        tel: true, // 联系电话
        gender: true, // 性别
        currentAddress: true, // 现居住地址
        permanentAddress: true, // 户籍地址
      },
      // 自定义添加一些属性 防止双向绑定失败 例如 picker组件之类
      projectDeclareInfo: {
        c00130: '', // 申请补贴类型
        c00047: '', // 就业（创业）地址
        c00131: '', // 灵活就业类型
        c00128: '', // 户籍类别
        c00129: '', // 家庭经济状况
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
    async getCodeTableCacheData() {
      const isDev = getIsDev //当前环境是否是开发环境
      let c00128 = [] // 户籍类别
      let c00129 = [] // 家庭经济状况
      let c00130 = [] // 申请补贴类型
      let c00131 = [] // 灵活就业类型
      let chb0h1 = [] // 残疾人类别
      let chb0h2 = [] // 残疾人等级
      try {
        c00128 = await getCodeListByCodeName('c00128')
      } catch (err) {
        if (isDev) {
          console.log('code table c00128 error', err)
        }
      }
      try {
        c00129 = await getCodeListByCodeName('c00129')
      } catch (err) {
        if (isDev) {
          console.log('code table c00129 error', err)
        }
      }
      try {
        c00130 = await getCodeListByCodeName('c00130')
      } catch (err) {
        if (isDev) {
          console.log('code table c00130 error', err)
        }
      }
      try {
        c00131 = await getCodeListByCodeName('c00131')
      } catch (err) {
        if (isDev) {
          console.log('code table c00131 error', err)
        }
      }

      try {
        chb0h1 = await getCodeListByCodeName('chb0h1')
      } catch (err) {
        if (isDev) {
          console.log('code table chb0h1 error：', err)
        }
      }

      try {
        chb0h2 = await getCodeListByCodeName('chb0h2')
      } catch (err) {
        if (isDev) {
          console.log('code table chb0h2 error：', err)
        }
      }

      this.codeMap = {
        ...this.codeMap,
        c00128,
        c00129,
        c00130,
        c00131,
        chb0h1,
        chb0h2,
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
    // 检测数据输入格式是否正确 须根据项目需求更改
    handleCheckInput() {
      const {
        c00046, // 就业创业项目名称
        c00047, // 就业创业地点
        c00037, // 扶持人数

        chb0h1, // 残疾人类别
        chb0h2, // 残疾等级
        chb0h9, // 办证时间
        c03601, // 残疾证号

        c00128, // 户籍类别
        c00129, // 家庭经济状况
        c00045, // 申请补助金额
        c00130, // 申请补贴类型
        c00131, // 灵活就业类型
        c00132, // 出勤天数
      } = this.projectDeclareInfo

      if (!c00046) {
        showModal('请输入就业创业项目名称')
        return false
      }

      if (!c00047) {
        showModal('请选择或输入就业创业地点')
        return false
      }

      if (!c00037) {
        showModal('请输入扶持人数')
        return false
      }

      if (!c00045) {
        showModal('请输入申请补贴金额')
        return false
      }

      if (!c00128) {
        showModal('户籍类型不能为空，请选择户籍类型')
        return false
      }
      if (!c00129) {
        showModal('家庭经济状况不能为空，请选择家庭经济状况')
        return false
      }

      if (!c03601) {
        showModal('请输入残疾证号')
        return false
      } else if (!this.CheckDisability(c03601)) {
        showModal('请输入正确的残疾证号')
        return false
      }

      if (!chb0h1) {
        showModal('请选择残疾类别')
        return false
      }

      if (!chb0h2) {
        showModal('请选择残疾等级')
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
        currentAddress, // 现居住地址
        permanentAddress, //户籍地址
        gender, //性别
      } = this.basicInfo

      const {
        chb0h1, // 残疾人类别
        chb0h2, // 残疾等级
        chb0h9, // 办证时间
        c03601, // 残疾证号
        c00128, // 户籍类别
        c00129, // 家庭经济状况
        c00130, // 申请补贴类型
        c00131, // 灵活就业类型
        c00046, // 就业(创业)项目名称
        c00047, // 就业（创业）地址
        c00037, // 扶持带动人数
        c00132, // 出勤天数
        c00045,
      } = this.projectDeclareInfo

      // 扩展字段
      const hb00BizMap = {
        c00015: currentAddress, // 现居住地址
        c00008: permanentAddress, // 户籍地址
        aac004: gender, // 性别

        chb0h1, // 残疾人类别
        chb0h2, // 残疾等级
        chb0h9, // 办证时间
        c03601, // 残疾证号
        c00128, // 户籍类别
        c00129, // 家庭经济状况
        c00130, // 申请补贴类型
        c00131, // 灵活就业类型
        c00046, // 就业(创业)项目名称
        c00047, // 就业（创业）地址
        c00037, // 扶持带动人数
        c00132, // 出勤天数
        c00045,
      }
      this.handleDeclareData(hb00BizMap, '0')
    },
  },
  computed: {},
  watch: {},
}
</script>

<style lang="scss" scoped></style>
