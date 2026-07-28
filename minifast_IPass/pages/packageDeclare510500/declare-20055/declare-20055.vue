<template>
  <!-- 种粮大户 -->
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
            <ComponentDeclareRadio
              label="作物种类"
              type="checkbox"
              :range="codeMap.n00039"
              aglin=""
              v-model="projectDeclareInfo.n00039"
            ></ComponentDeclareRadio>

            <div class="cell-item required" v-if="n00231">
              <div class="key">其他作物说明</div>
              <div class="value">
                <input
                  type="text"
                  v-model="projectDeclareInfo.n00231"
                  placeholder="请输入其他作物说明"
                />
              </div>
            </div>

            <div class="cell-item required">
              <div class="key">种植面积</div>
              <div class="value">
                <input
                  type="digit"
                  maxlength="12"
                  v-model="projectDeclareInfo.n00040"
                  placeholder="请输入种植面积"
                />
              </div>
            </div>

            <div class="cell-item">
              <div class="key">公司名称</div>
              <div class="value">
                <input
                  type="text"
                  v-model="projectDeclareInfo.n00158"
                  placeholder="请输入公司名称"
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
import ComponentSelectAddressMultitype from '@/components/project/ez-select-address-multitype/ez-select-address-multitype.vue'
import { useDeclare } from '@/mixins'

import { getIsDev } from '@/utils/get'
import { getCodeListByCodeName } from '@/utils/custom-api'
import { showModal } from '@/utils/uni-api'
export default {
  name: 'pageDeclare20215',

  data() {
    return {
      renderObj: {
        idCard: true, // 身份证
        userName: true, // 姓名
        tel: true, // 联系电话
        permanentAddress: true, // 户籍地址
        currentAddress: true, // 现居地址
        gender: true, //性别
        age: true, // 年龄
      },

      projectDeclareInfo: {
        n00039: '',
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
    // 编写格式参考达州20033项目
    async getCodeTableCacheData() {
      const isDev = getIsDev() // 当前环境是否是开发环境
      let n00039 = [] // 粮食种类

      try {
        n00039 = await getCodeListByCodeName('n00039')
      } catch (err) {
        if (isDev) {
          console.log('code table n00039 error：', err)
        }
      }

      this.codeMap = {
        ...this.codeMap,
        n00039,
      }
    },
    checkisornot(value, arr) {
      let res = arr.find((item) => item == value)
      if (res) {
        return '1'
      }
      return '0'
    },
    // 检测数据输入格式是否正确 须根据项目需求更改
    handleCheckInput() {
      const {
        aac004, //性别
        chb00l, //年龄
        aae006, //户籍地址/详细地址
        n00041, //现居住地址

        n00039, //主要粮食作物种类
        n00231, // 其他作物说明
        n00040, //种植面积
        n00158, //公司名称
        // aae019发放金额
      } = this.projectDeclareInfo
      if (!n00039) {
        showModal('请选择主要粮食作物种类')
        return false
      }
      if (this.n00231 && !n00231) {
        showModal('请输入其他作物说明')
        return false
      }
      if (!n00040) {
        showModal('请输入种植面积')
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
        gender, // 性别
        permanentAddress,
        age,
        currentAddress,
      } = this.basicInfo

      const {
        n00039, //主要粮食作物种类
        n00040, //种植面积
        n00231, //其他作物说明
        n00158, //公司名称
      } = this.projectDeclareInfo
      // 扩展字段
      const hb00BizMap = {
        aac004: gender, //性别
        chb00l: age, //年龄
        aae006: permanentAddress, //户籍地址/详细地址
        n00041: currentAddress, //现居住地址

        n00039, //主要粮食作物种类
        n00040, //种植面积
        n00158, //公司名称

        n00224: this.checkisornot('1', n00039), //玉米
        n00225: this.checkisornot('2', n00039), //水稻
        n00226: this.checkisornot('3', n00039), //大豆
        n00227: this.checkisornot('4', n00039), //马铃薯
        n00228: this.checkisornot('6', n00039), //小麦
        n00229: this.checkisornot('7', n00039), //青稞
        n00230: this.checkisornot('8', n00039), //荞麦
        n00231, //其他：（需注明）
      }

      this.handleDeclareData(hb00BizMap, '0')
    },
  },
  computed: {
    n00231() {
      let { n00039 } = this.projectDeclareInfo
      if (n00039 && n00039.length !== 0) {
        if (this.checkisornot('5', n00039) == '1') {
          return true
        }
      }
      return false
    },
  },
  watch: {},
}
</script>

<style lang="scss" scoped>
.declare-info-wrapper {
  margin-top: 30rpx;
}
</style>
