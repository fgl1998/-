<!-- 种粮大户补贴 农业农村局 -->
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
        permanentAddressLabel="申报地址"
        :permanentAddressPlaceholder="permanentAddressPlaceholder"
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
            <block v-if="isBusiness">
              <div class="cell-item required">
                <div class="key">单位名称</div>
                <div class="value">
                  <input
                    type="text"
                    v-model="projectDeclareInfo.chb0bk"
                    placeholder="请输入单位名称"
                  />
                </div>
              </div>
              <div class="cell-item required">
                <div class="key">机构代码</div>
                <div class="value">
                  <input
                    type="text"
                    v-model="projectDeclareInfo.chb0bl"
                    placeholder="请输入机构代码"
                  />
                </div>
              </div>
              <ComponentDeclarePicker
                label="是否含有对公账户"
                idName="n00264"
                :range="codeMap.yesorno"
                placeholder="请选择"
                v-model="projectDeclareInfo.n00264"
              >
              </ComponentDeclarePicker>
              <div
                class="cell-item required"
                v-if="projectDeclareInfo.n00264 == '1'"
              >
                <div class="key">对公账户</div>
                <div class="value">
                  <input
                    type="text"
                    v-model="projectDeclareInfo.n00265"
                    placeholder="请输入对公账户"
                  />
                </div>
              </div>
            </block>
            <div class="cell-item required">
              <div class="key">小麦种植面积(亩)</div>
              <div class="value">
                <input
                  type="digit"
                  maxlength="8"
                  v-model="projectDeclareInfo.n00001"
                  placeholder="请输入小麦种植面积"
                  @input="handleCheckNumber($event, 'n00001')"
                />
              </div>
            </div>
            <div class="cell-item required">
              <div class="key">水稻种植面积(亩)</div>
              <div class="value">
                <input
                  type="digit"
                  maxlength="8"
                  v-model="projectDeclareInfo.n00002"
                  placeholder="请输入水稻种植面积"
                  @input="handleCheckNumber($event, 'n00002')"
                />
              </div>
            </div>
            <div class="cell-item required">
              <div class="key">玉米种植面积(亩)</div>
              <div class="value">
                <input
                  type="digit"
                  maxlength="8"
                  v-model="projectDeclareInfo.n00003"
                  placeholder="请输入玉米种植面积"
                  @input="handleCheckNumber($event, 'n00003')"
                />
              </div>
            </div>
            <div class="cell-item required disabled">
              <div class="key">种植面积合计(亩)</div>
              <div class="value">{{ getn00051 }}</div>
            </div>
            <div class="cell-item required">
              <div class="key">承包耕地面积(亩)</div>
              <div class="value">
                <input
                  type="digit"
                  maxlength="8"
                  v-model="projectDeclareInfo.n00049"
                  placeholder="请输入承包耕地面积"
                  @input="handleCheckNumber($event, 'n00049')"
                />
              </div>
            </div>
            <div class="cell-item required">
              <div class="key">租种耕地面积(亩)</div>
              <div class="value">
                <input
                  type="digit"
                  maxlength="8"
                  v-model="projectDeclareInfo.n00050"
                  placeholder="请输入租种耕地面积"
                  @input="handleCheckNumber($event, 'n00050')"
                />
              </div>
            </div>

            <div class="cell-item required disabled">
              <div class="key">耕地面积合计(亩)</div>
              <div class="value">{{ getn00048 }}</div>
            </div>
            <div class="cell-item required">
              <div class="key">补贴面积(亩)</div>
              <div class="value">
                <input
                  type="digit"
                  v-model="projectDeclareInfo.n00006"
                  placeholder="请输入补贴面积"
                  @input="handleCheckNumber($event, 'n00006')"
                />
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
import { showModal } from '@/utils/uni-api'

import Big from '@/utils/big.min.js'

export default {
  name: 'pageDeclare20055',
  data() {
    return {
      permanentAddressPlaceholder: '请选择申报地址',
      // 基本信息 渲染配置
      renderObj: {
        idCard: true, // 身份证
        userName: true, // 姓名
        tel: true, // 联系电话
        gender: true, // 性别
        age: true, // 年龄
        permanentAddress: true, // 户籍地址
      },
      // 自定义添加一些属性 防止双向绑定失败 例如 picker组件之类
      projectDeclareInfo: {
        n00001: '', // 小麦补贴面积
        n00002: '', // 水稻补贴面积
        n00003: '', // 玉米补贴面积

        n00049: '', // 承包面积
        n00050: '', // 租种面积
        n00264: '',
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

    handleCheckNumber(e, id) {
      let { value } = e.target
      if (value) {
        let res = value
          .replace(/[^\d+(\.\d+)?$]/, '')
          .replace('.', '$#$')
          .replace(/\./g, '')
          .replace('$#$', '.')
        let index = res.indexOf('.')
        if (index > 0 && index + 3 < res.length) {
          res = res.slice(0, index + 3)
        }
        let _this = this
        this.$nextTick(function () {
          _this.projectDeclareInfo[id] = res
        })
      }
    },
    // 检测数据输入格式是否正确 须根据项目需求更改
    handleCheckInput() {
      const {
        chb0bl, // 机构代码
        chb0bk, // 单位名称
        n00264,
        n00265,

        n00001, // 小麦补贴面积
        n00002, // 水稻补贴面积
        n00003, // 玉米补贴面积
        n00051, // 种植面积合计

        n00006, // 补贴面积

        n00049, // 承包面积
        n00050, // 租种面积
        n00048, // 耕种面积合计
      } = this.projectDeclareInfo
      const isBusiness = this.isBusiness
      if (isBusiness) {
        if (!chb0bk) {
          showModal('请输入单位名称')
          return false
        }
        if (!chb0bl) {
          showModal('请输入机构代码')
          return false
        }
        if (!n00264) {
          showModal('请选择是否含有对公账户')
          return false
        }
        if (n00264 == '1' && !n00265) {
          showModal('请输入对公账户')
          return false
        }
      }

      if (!n00001) {
        showModal('请输入小麦种植面积，如没有种植就填0！')
        return false
      }
      if (!n00002) {
        showModal('请输入水稻种植面积，如没有种植就填0！')
        return false
      }
      if (!n00003) {
        showModal('请输入玉米种植面积，如没有种植就填0！')
        return false
      }

      if (!n00049) {
        showModal('请输入承包耕地面积')
        return false
      }
      if (!n00050) {
        showModal('请输入租种耕地面积')
        return false
      }

      if (!n00006) {
        showModal('请输入补贴面积')
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
      const getn00048 = this.getn00048
      const getn00051 = this.getn00051
      const { gender, age } = this.basicInfo

      const {
        chb0bl, // 机构代码
        chb0bk, // 单位名称
        n00264,
        n00265,

        n00001, // 小麦补贴面积
        n00002, // 水稻补贴面积
        n00003, // 玉米补贴面积
        n00051, // 种植面积合计

        n00006, // 补贴面积

        n00049, // 承包面积
        n00050, // 租种面积
        n00048, // 耕种面积合计
      } = this.projectDeclareInfo

      // 扩展字段
      const hb00BizMap = {
        chb00l: age, // 年龄
        aac004: gender, // 性别

        chb0bl, // 机构代码
        chb0bk, // 单位名称
        n00264,
        n00265,

        n00001, // 小麦补贴面积
        n00002, // 水稻补贴面积
        n00003, // 玉米补贴面积
        n00051: getn00051, // 种植面积合计

        n00006, // 补贴面积

        n00049, // 承包面积
        n00050, // 租种面积
        n00048: getn00048, // 耕种面积合计
      }
      this.handleDeclareData(hb00BizMap, '0')
    },
  },
  computed: {
    // 人员类别是否为企业
    isBusiness() {
      let result = false
      const { cac102 } = this.personnelInfo
      if (cac102 !== '3281') {
        result = true
      }
      return result
    },
    // 获取耕种面积
    getn00051() {
      let num = 0
      const { n00001, n00002, n00003 } = this.projectDeclareInfo
      num = new Big(num)
        .plus(n00001 || 0)
        .plus(n00002 || 0)
        .plus(n00003 || 0)
      return num
    },
    // 获取种植面积
    getn00048() {
      let num = 0
      const { n00049, n00050 } = this.projectDeclareInfo
      num = new Big(num).plus(n00049 || 0).plus(n00050 || 0)
      return num
    },
  },
  watch: {},
}
</script>

<style lang="scss" scoped></style>
