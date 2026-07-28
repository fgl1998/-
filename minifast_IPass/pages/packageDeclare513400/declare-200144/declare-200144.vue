<!-- 产业发展激励奖补项目 （农业农村局） -->
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
        @changeDataByIdCard="handleChangeDataByIdCard"
      >
      </ComponentDeclare>
    </div>
    <div class="personnel-type-wrapper space-top-wrapper">
      <ComponentDeclarePersonnel
        :renderData="personnelList"
        @change="handleChangePersonnelInfo"
      ></ComponentDeclarePersonnel>
    </div>

    <!-- 申报信息 -->
    <div class="space-top-wrapper">
      <ComponentPanel title="申报信息">
        <div class="panel-content">
          <div class="cell-items">
            <ComponentDeclareRadio
              label="畜禽品种"
              type="checkbox"
              :range="animalRange"
              valueKey="name"
              renderKey="name"
              aglin=""
              :required="false"
              ref="cropsData"
              v-model="projectDeclareInfo.n00270"
            ></ComponentDeclareRadio>

            <block v-if="isOtherAnimal">
              <div class="cell-item required">
                <div class="key">其他养殖畜禽</div>
                <div class="value">
                  <input
                    type="text"
                    v-model="otherAnimal"
                    placeholder="请输入其他养殖畜禽"
                  />
                </div>
              </div>
            </block>

            <block
              v-if="
                projectDeclareInfo.n00270 &&
                projectDeclareInfo.n00270.length !== 0
              "
            >
              <div class="cell-item required">
                <div class="key">养殖畜禽数量</div>
                <div class="value">
                  <input
                    type="number"
                    maxlength="11"
                    v-model="projectDeclareInfo.n00169"
                    placeholder="请输入养殖畜禽数量"
                  />
                </div>
              </div>
            </block>

            <ComponentDeclareRadio
              label="作物种类"
              type="checkbox"
              :range="cropRange"
              valueKey="name"
              renderKey="name"
              aglin=""
              ref="cropsData"
              :required="false"
              v-model="projectDeclareInfo.n00271"
            ></ComponentDeclareRadio>

            <block v-if="isOtherCrop">
              <div class="cell-item required">
                <div class="key">其他作物种类</div>
                <div class="value">
                  <input
                    type="text"
                    v-model="crop"
                    placeholder="请输入其他作物种类"
                  />
                </div>
              </div>
            </block>

            <block
              v-if="
                projectDeclareInfo.n00271 &&
                projectDeclareInfo.n00271.length !== 0
              "
            >
              <div class="cell-item required">
                <div class="key">种植面积</div>
                <div class="value">
                  <input
                    type="number"
                    maxlength="11"
                    v-model="projectDeclareInfo.n00040"
                    placeholder="请输入种植面积"
                  />
                </div>
              </div>
            </block>
          </div>
        </div>
      </ComponentPanel>
    </div>
    <!-- end  在以上代码中根据项目需求更改-->
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

import { getIsDev, getDate } from '@/utils/get'
import { checkIDCard, checkPhoneNumber } from '@/utils/check'
import { getCodeListByCodeName } from '@/utils/custom-api'
import { showModal } from '@/utils/uni-api'

export default {
  name: 'pageDeclare20055',
  data() {
    return {
      renderObj: {
        idCard: true, // 身份证
        userName: true, // 姓名
        tel: true, // 联系电话
        permanentAddress: true, // 户籍地址
      },
      // 申报信息
      projectDeclareInfo: {
        n00270: '',
        n00271: '',
      },
      cropRange: [
        { name: '马铃薯' },
        { name: '荞麦' },
        { name: '蔬菜' },
        { name: '花生' },
        { name: '大豆' },
        { name: '甘蔗' },
        { name: '玉米' },
        { name: '其他' },
      ],
      animalRange: [
        { name: '猪' },
        { name: '牛' },
        { name: '羊' },
        { name: '鸡' },
        { name: '鸭' },
        { name: '鹅' },
        { name: '其他' },
      ],
      otherAnimal: '',
      crop: '',
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
    async getCodeTableCacheData() {},

    // 检测数据输入格式是否正确 须根据项目需求修改
    handleCheckInput() {
      const {
        n00270, // 畜禽品种
        n00169, // 养殖畜禽数量
        n00271, //种植类别
        n00040, //种植面积
      } = this.projectDeclareInfo

      if ((!n00270 || n00270.length == 0) && (!n00271 || n00271.length == 0)) {
        showModal('请选择畜禽品种或作物种类至少一种')
        return false
      }
      if (!this.otherAnimal && this.isOtherAnimal) {
        showModal('请输入其他畜禽品种')
        return false
      }
      if (n00270 && !n00169) {
        showModal('请输入养殖畜禽数量')
        return false
      }
      if (!this.crop && this.isOtherCrop) {
        showModal('请输入其他作物类别')
        return false
      }
      if (n00271 && !n00040) {
        showModal('请输入种植面积')
        return false
      }
      return true
    },

    // 下一步 须根据项目需求修改
    handleJumpNextStep() {
      // if (!this.handleCheckComponentInput()) {
      //   return
      // }
      if (!this.handleCheckInput()) {
        return
      }
      const {
        n00270, // 畜禽品种
        n00169, // 养殖畜禽数量
        n00271, //种植类别
        n00040, //种植面积
      } = this.projectDeclareInfo

      if (n00270 && n00270.length !== 0) {
        var newN00270 = n00270.filter((item) => item !== '其他')
      }
      if (n00271 && n00271.length !== 0) {
        var newN00271 = n00271.filter((item) => item !== '其他')
      }

      if (this.isOtherAnimal) {
        newN00270.push(this.otherAnimal)
      }

      if (this.isOtherCrop) {
        newN00271.push(this.crop)
      }

      // 扩展字段
      let hb00BizMap = {
        n00270: newN00270 ? newN00270.join(',') : '', // 畜禽品种
        n00169: newN00270 ? n00169 : '', // 养殖畜禽数量
        n00271: newN00271 ? newN00271.join(',') : '', //种植类别
        n00040: newN00271 ? n00040 : '', //种植面积
      }

      this.handleDeclareData(hb00BizMap, '0')
    },
  },
  computed: {
    isOtherAnimal() {
      let { n00270 } = this.projectDeclareInfo
      if (!n00270 || n00270.length == 0) {
        return false
      }
      let res = n00270.find((item) => item == '其他')
      if (res) {
        return true
      }
      return false
    },
    isOtherCrop() {
      let { n00271 } = this.projectDeclareInfo
      if (!n00271 || n00271.length == 0) {
        return false
      }
      let res = n00271.find((item) => item == '其他')
      if (res) {
        return true
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
