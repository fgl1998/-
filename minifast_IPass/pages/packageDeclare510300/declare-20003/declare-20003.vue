<template>
  <!-- 县级教育扶贫救助基金（教育局） -->
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
        permanentAddressType="country"
        addressRemove="102419"
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
              label="所属学段"
              idName="j00010"
              :range="codeMap.j00010"
              placeholder="请选择您的学段"
              v-model="projectDeclareInfo.j00010"
            ></ComponentDeclarePicker>
            <div class="cell-item required">
              <div class="key">就读学校名称</div>
              <div class="value">
                <input
                  type="text"
                  v-model="projectDeclareInfo.j00001"
                  placeholder="请输入您的就读学校名称"
                />
              </div>
            </div>
            <div class="cell-item required">
              <div class="key">年级班级</div>
              <div class="value">
                <input
                  type="text"
                  v-model="projectDeclareInfo.j00002"
                  placeholder="请输入您的年纪班级"
                />
              </div>
            </div>

            <ComponentDeclareRadio
              label="享受的国家资助"
              type="checkbox"
              :range="cropsData"
              valueKey="value"
              renderKey="name"
              aglin=""
              v-model="projectDeclareInfo.j00038"
            ></ComponentDeclareRadio>

            <div class="cell-item">
              <div class="key">自购保险费用</div>
              <div class="value">
                <input
                  type="number"
                  v-model="projectDeclareInfo.j00039"
                  placeholder="请输入您的自购保险费用"
                />
              </div>
            </div>
            <div class="cell-item">
              <div class="key">自购教辅材料费用</div>
              <div class="value">
                <input
                  type="number"
                  v-model="projectDeclareInfo.j00040"
                  placeholder="请输入您的自购教辅材料费用"
                />
              </div>
            </div>
            <div class="cell-item">
              <div class="key">自购校服费用</div>
              <div class="value">
                <input
                  type="number"
                  v-model="projectDeclareInfo.j00041"
                  placeholder="请输入您的自购校服费用"
                />
              </div>
            </div>
            <div class="cell-item">
              <div class="key">校内营养补充费用</div>
              <div class="value">
                <input
                  type="number"
                  v-model="projectDeclareInfo.j00042"
                  placeholder="请输入您的校内营养补充费用"
                />
              </div>
            </div>
            <div class="cell-item">
              <div class="key">其他费用</div>
              <div class="value">
                <input
                  type="number"
                  v-model="projectDeclareInfo.j00043"
                  placeholder="请输入您的其他费用"
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
              <div class="key">姓名</div>
              <div class="value">
                <input
                  type="text"
                  maxlength="12"
                  v-model="projectDeclareInfo.j00019"
                  placeholder="请输入监护人姓名"
                />
              </div>
            </div>
            <div class="cell-item required">
              <div class="key">身份证号</div>
              <div class="value">
                <input
                  type="idcard"
                  maxlength="18"
                  v-model="projectDeclareInfo.j00020"
                  placeholder="请输入监护人身份证号"
                />
              </div>
            </div>
            <div class="cell-item">
              <div class="key">联系电话</div>
              <div class="value">
                <input
                  type="number"
                  maxlength="11"
                  v-model="projectDeclareInfo.j00064"
                  placeholder="请输入监护人联系电话"
                />
              </div>
            </div>
            <ComponentDeclarePicker
              label="监护人与申请人关系"
              :range="codeMap.c00066"
              placeholder="请选择监护人与申请人关系"
              v-model="projectDeclareInfo.chb0gh"
            ></ComponentDeclarePicker>

            <ComponentSelectAddressMultitype
              label="现居住地址"
              placeholder="请选择或输入现居住地址"
              :isShowBtn="renderObj.permanentAddress"
              @clickBtn="projectDeclareInfo.j00063 = basicInfo.permanentAddress"
              v-model="projectDeclareInfo.j00063"
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
import { getCodeListByCodeName } from '@/utils/custom-api'

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
        nation: true, // 民族
        currentAddress: true, // 现居住地址
        permanentAddress: true, // 户籍地址
      },

      projectDeclareInfo: {
        j00063: '', // 监护人现居住地址
        chb0gh: '', // 监护人与申请人关系
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
      let c00066 = [] // 儿童与监护人关系

      try {
        c00066 = await getCodeListByCodeName('c00066')
      } catch (err) {
        if (isDev) {
          console.log('code table c00066 error：', err)
        }
      }

      this.codeMap = {
        ...this.codeMap,
        c00066,
      }
    },
    // 检测数据输入格式是否正确 须根据项目需求更改
    handleCheckInput() {
      const {
        aac002, // 身份证号
        aac003, // 姓名
        aae005, // 联系电话
        aae006, // 户籍地址
        j00010, //学段
        j00001, //就读学校名称
        j00003, //学年班级

        j00038, //享受国家资助
        // j00039, //自购保险费用
        // j00040, //自购教材费用
        // j00041, //自购校服费用
        // j00042, // 校内营养补充费用
        // j00043, // 其他费用
      } = this.projectDeclareInfo
      if (!j00010) {
        showModal('请选择学段')
        return false
      }
      if (!j00001) {
        showModal('请输入就读学校名称')
        return false
      }
      if (!j00038 || j00038.length < 1) {
        showModal('请选择已享受的国家资助项目名称')
        return false
      }
      if (!j00003) {
        showModal('请输入学年班级')
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
        aac002, // 身份证号
        aac003, // 姓名
        aae005, // 联系电话

        j00010, //学段
        j00001, //就读学校名称
        j00038, //享受的国家资助
        j00039, //自购保险费用
        j00040, //自购教辅材料费用
        j00041, //自购校服费用
        j00042, //校内营养补充费用
        j00043, //其他
        aae006, //户籍地址
        j00003, //学年班级
      } = this.projectDeclareInfo
      // 扩展字段
      var hb00BizMap = {
        j00010, //学段
        j00001, //就读学校名称
        j00038, //享受的国家资助
        j00039, //自购保险费用
        j00040, //自购教辅材料费用
        j00041, //自购校服费用
        j00042, //校内营养补充费用
        j00043, //其他
        j00003, //学年班级
        aae006, //户籍地址
      }

      this.handleDeclareData(hb00BizMap, '0')
    },
  },
  computed: {},
}
</script>

<style lang="scss" scoped>
.declare-info-wrapper {
  margin-top: 30rpx;
}
</style>
