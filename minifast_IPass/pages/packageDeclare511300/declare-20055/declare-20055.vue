<!-- 种植大户 -->
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
        permanentAddressPlaceholder="请选择申报地址"
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
            <ComponentDeclareRadio
              label="作物类型"
              type="radio"
              :range="cropsTypeDada"
              valueKey="value"
              renderKey="name"
              :value="cropsChecked"
              @input="cropsTypecheck"
            ></ComponentDeclareRadio>
            <ComponentDeclareRadio
              label="作物种类"
              type="checkbox"
              :range="cropsData"
              valueKey="value"
              renderKey="name"
              ref="cropsData"
              aglin=""
              @input="typecheck"
            ></ComponentDeclareRadio>
            <div class="cell-item required">
              <div class="key">种植面积(亩)</div>
              <div class="value">
                <input
                  type="digit"
                  maxlength="12"
                  v-model="projectDeclareInfo.n00040"
                  placeholder="请输入您的种植面积"
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
import ComponentDeclareRadio from '@/components/project/ez-declare-radio/ez-declare-radio.vue'

import { useDeclare } from '@/mixins'

import { showModal } from '@/utils/uni-api'

export default {
  name: 'pageDeclare20055',

  data() {
    return {
      renderObj: {
        idCard: true, // 身份证
        userName: true, // 姓名
        tel: true, // 联系电话
        education: false, // 学历
        gender: true, // 性别
        nation: false, // 民族
        birthday: false, // 出生日期
        nativePlace: false, // 籍贯 四川省内江市
        currentAddress: true, // 现居住地址
        permanentAddress: true, // 户籍地址
        age: true, // 年龄
      },

      projectDeclareInfo: {
        chbaac: '',
        aae006: '',
        n00041: '',
      },
      cropsData: [],
      // 大春作物种类
      daChunCropsData: [
        {
          id: 'd3',
          value: '玉米',
          name: '玉米',
          checked: false,
        },
        {
          id: 'd2',
          value: '水稻',
          name: '水稻',
          checked: false,
        },
        {
          id: 'd5',
          value: '大豆',
          name: '大豆',
          checked: false,
        },
        {
          id: 'd4',
          value: '马铃薯',
          name: '马铃薯',
          checked: false,
        },
        {
          id: 'd8',
          value: '其他',
          name: '其他',
          checked: false,
        },
      ],
      // 小春作物种类
      xiaoChunCropsData: [
        {
          id: 'x1',
          value: '小麦',
          name: '小麦',
          checked: false,
        },

        {
          id: 'x6',
          value: '青稞',
          name: '青稞',
          checked: false,
        },
        {
          id: 'x7',
          value: '荞麦',
          name: '荞麦',
          checked: false,
        },
        {
          id: 'x4',
          value: '马铃薯',
          name: '马铃薯',
          checked: false,
        },
        {
          id: 'x5',
          value: '其他',
          name: '其他',
          checked: false,
        },
      ],
      // 作物类型
      cropsTypeDada: [
        {
          id: '01',
          value: '1',
          name: '大春作物',
          disabled: false,
          checked: true,
        },
        {
          id: '02',
          value: '2',
          name: '小春作物',
          disabled: false,
          checked: false,
        },
      ],
      //
      cropsChecked: '1',
    }
  },
  components: {
    ComponentButton,
    ComponentPanel,
    ComponentDeclare,
    ComponentDeclareStep,
    ComponentDeclareRadio,
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
    getCodeTableCacheData() {},
    // 作物类型
    cropsTypecheck(value) {
      this.cropsChecked = value
    },
    typecheck(value) {
      this.projectDeclareInfo.n00039 = value.join(',')
    },
    // 检测数据输入格式是否正确 须根据项目需求更改
    handleCheckInput() {
      const {
        // n00039, //主要粮食作物种类
        n00039, //作物类型
        n00040, //种植面积
        n00041, //现居住地址
        n00042, //作物种类
      } = this.projectDeclareInfo
      if (!n00042) {
        showModal('请选择作物类型')
        return false
      }
      if (!n00039) {
        showModal('请选择作物种类')
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

      const { currentAddress } = this.basicInfo
      const {
        // n00039, // 主要粮食作物种类
        n00039, // 作物类型
        n00040, // 种植面积
        n00041, // 现居住地址
        n00042, // 作物种类
      } = this.projectDeclareInfo
      // 扩展字段
      const hb00BizMap = {
        n00039, // 作物类型
        n00040, // 种植面积
        n00041: currentAddress, // 现居住地址
        n00042, // 作物种类
      }
      this.handleDeclareData(hb00BizMap, '0')
    },
  },
  computed: {},
  watch: {
    cropsChecked: {
      handler(val) {
        if (val) {
          if (val === '1') {
            this.cropsData = this.daChunCropsData
          }
          if (val === '2') {
            this.cropsData = this.xiaoChunCropsData
          }
          this.$nextTick(function () {
            this.projectDeclareInfo.n00042 = val
            this.projectDeclareInfo.n00039 = null
            this.$refs.cropsData.init()
          })
        }
      },
      immediate: true,
    },
  },
}
</script>

<style lang="scss" scoped>
.declare-info-wrapper {
  margin-top: 30rpx;
}
</style>
