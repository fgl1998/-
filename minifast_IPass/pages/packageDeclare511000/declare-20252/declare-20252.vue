<!-- 严重精神障碍患者监护责任以奖代补项目 民政局 -->
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

    <!-- start 需要修改的地方 在以下代码中根据项目需求更改 -->
    <div class="personnel-type-wrapper space-top-wrapper">
      <ComponentDeclarePersonnel
        :renderData="personnelList"
        :isOpenCategoryNotes="true"
        @change="handleChangePersonnelInfo"
      ></ComponentDeclarePersonnel>
    </div>
    <div class="declare-info-wrapper">
      <ComponentPanel title="申报信息">
        <div class="panel-content">
          <div class="cell-items">
            <!-- 患者身份证号 -->
            <div class="cell-item required">
              <div class="key">患者身份证号</div>
              <div class="value">
                <input
                  type="idcard"
                  maxlength="18"
                  v-model="projectDeclareInfo.m00028"
                  placeholder="请输入患者的身份证号"
                  @blur="handleBlurM00028"
                />
              </div>
            </div>
            <!-- 患者姓名 -->
            <div class="cell-item required">
              <div class="key">患者姓名</div>
              <div class="value">
                <input
                  type="text"
                  maxlength="10"
                  v-model="projectDeclareInfo.m00049"
                  placeholder="请输入患者姓名"
                />
              </div>
            </div>
            <div class="cell-item required">
              <div class="key">监护人与患者关系</div>
              <div class="value">
                <input
                  type="text"
                  maxlength="6"
                  v-model="projectDeclareInfo.m00050"
                  placeholder="例如：父子"
                />
              </div>
            </div>
            <!-- 患者精神状况 -->
            <ComponentDeclarePicker
              label="患者精神状况"
              idName="m00029"
              :range="codeMap.m00029"
              rangeKey="aaa103"
              valueKey="aaa102"
              placeholder="请选择患者精神状况"
              v-model="projectDeclareInfo.m00029"
              @change="getPickerValueDesc"
            ></ComponentDeclarePicker>
            <!-- 子女或亲属联系人 -->
            <div class="cell-item required">
              <div class="key">患者子女或亲属联系人</div>
              <div class="value">
                <input
                  type="text"
                  maxlength="8"
                  v-model="projectDeclareInfo.chb0a1"
                  placeholder="请输入联系人姓名"
                />
              </div>
            </div>
            <!-- 子女或亲属联系电话 -->
            <div class="cell-item required">
              <div class="key">患者子女或亲属联系电话</div>
              <div class="value">
                <input
                  type="number"
                  maxlength="11"
                  @blur="handleBlurChb0a2"
                  v-model="projectDeclareInfo.chb0a2"
                  placeholder="请输入联系电话"
                />
              </div>
            </div>
            <div class="cell-item textarea required">
              <div class="key">监护情况</div>
              <div class="value">
                <textarea
                  maxlength="100"
                  v-model="projectDeclareInfo.m00053"
                  placeholder="请输入监护情况"
                >
                </textarea>
              </div>
            </div>
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

import ComponentDeclarePersonnel from '@/components/project/ez-declare-personnel/ez-declare-personnel.vue'
import ComponentDeclareStep from '@/components/project/ez-declare-step/ez-declare-step.vue'
import ComponentDeclare from '@/components/project/ez-declare/ez-declare.vue'
import ComponentSelectPermanentAddress from '@/components/project/ez-select-permanent-address/ez-select-permanent-address.vue'
import ComponentDeclareCard from '../components/ez-declare-card/ez-declare-card.vue'
import ComponentDeclareRadio from '@/components/project/ez-declare-radio/ez-declare-radio.vue'
import ComponentDeclarePicker from '@/components/project/ez-declare-picker/ez-declare-picker.vue'

import { useDeclare } from '@/mixins'

import { getIsDev } from '@/utils/get'
import { checkIDCard, checkPhoneNumber } from '@/utils/check'
import { getCodeListByCodeName } from '@/utils/custom-api'
import { showModal } from '@/utils/uni-api'

export default {
  name: 'pageDeclare20252',
  data() {
    return {
      renderObj: {
        idCard: true, // 身份证
        userName: true, // 姓名
        tel: true, // 联系电话
        permanentAddress: true, // 户籍地址
        currentAddress: true, // 现居住地址
      },
      projectDeclareInfo: {
        aae006: '',
        chb0a3: '',
      },
    }
  },
  components: {
    ComponentButton,
    ComponentPanel,
    ComponentDeclare,
    ComponentDeclareStep,
    ComponentSelectPermanentAddress,
    ComponentDeclareCard,
    ComponentDeclareRadio,
    ComponentDeclarePicker,
    ComponentDeclarePersonnel,
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
      let m00029 = [] // 患者精神状况

      try {
        m00029 = await getCodeListByCodeName('m00029')
      } catch (err) {
        if (isDev) {
          console.log('code table m00029 error：', err)
        }
      }

      this.codeMap = {
        ...this.codeMap,
        m00029,
      }
    },
    // 手动输入患者身份证号进行校验
    handleBlurM00028(e) {
      const { idCard } = this.basicInfo
      let { value } = e.target
      value = value.trim()
      if (idCard === value) {
        showModal('申报人和患者的身份证号不能相同')
        this.projectDeclareInfo = {
          ...this.projectDeclareInfo,
          m00028: '',
        }
        return
      }
      const checkResult = checkIDCard(value, '患者身份证号')
      if (checkResult.status === '0') {
        showModal(checkResult.msg)
      }
    },
    // 手动输入子女或亲属联系电话进行校验
    handleBlurChb0a2(e) {
      let { value } = e.target
      value = value.trim()
      const checkResult = checkPhoneNumber(value, '子女或亲属联系电话')
      if (checkResult.status === '0') {
        showModal(checkResult.msg)
      }
    },
    // 检测数据输入格式是否正确
    handleCheckInput() {
      const {
        m00029, // 患者精神状况
        m00050, // 与患者关系
        m00028, // 患者身份证号
        m00049, // 患者姓名
        m00053, // 监护情况
        chb0a1, // 子女或亲属联系人
        chb0a2, // 子女或亲属联系电话
      } = this.projectDeclareInfo

      if (!m00028) {
        showModal('请输入患者身份证号')
        return false
      } else {
        const { idCard } = this.basicInfo
        if (idCard === m00028) {
          showModal('申报人和患者的身份证号不能相同')
          return false
        }
        const checkResult = checkIDCard(m00028, '患者身份证号')
        if (checkResult.status === '0') {
          showModal(checkResult.msg)
          return false
        }
      }
      if (!m00049) {
        showModal('请输入患者姓名')
        return false
      }
      if (!m00050) {
        showModal('请输入监护人与患者关系')
        return false
      }
      if (!m00029) {
        showModal('请选择患者精神状况')
        return false
      }
      if (!chb0a1) {
        showModal('请输患者入子女或亲属联系人姓名')
        return false
      }

      if (!chb0a2) {
        showModal('请输入患者子女或亲属联系电话')
        return false
      } else {
        const checkResult = checkPhoneNumber(chb0a2, '患者子女或亲属联系电话')
        if (checkResult.status === '0') {
          showModal(checkResult.msg)
          return false
        }
      }

      if (!m00053) {
        showModal('请输入监护情况')
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
      } = this.basicInfo

      const {
        m00050, // 与患者关系
        m00028, // 患者身份证号码
        m00049, // 患者名称
        m00029, // 患者精神状况
        m00053, // 监护情况
        chb0a3, // 现居住地
        chb0a2, // 子女或亲属联系电话
        chb0a1, // 子女或亲属姓名
      } = this.projectDeclareInfo

      // 扩展字段
      const hb00BizMap = {
        m00050, // 与患者关系
        m00028, // 患者身份证号码
        m00049, // 患者名称
        m00029, // 患者精神状况
        m00053, // 监护情况
        chb0a3: currentAddress, // 现居住地
        chb0a2, // 子女或亲属联系电话
        chb0a1, // 子女或亲属姓名
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
