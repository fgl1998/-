<!-- 市本级大学生创业吸纳就业奖励 -->
<template>
  <view class="declare">
    <div class="progress-wrapper">
      <ComponentDeclareStep :current="2"></ComponentDeclareStep>
    </div>

    <div class="basic-info-wrapper">
      <ComponentDeclare
        :declareType="declareType"
        fixedDeclareType="01"
        :renderObj="renderObj"
        :projectName="chi031_desc"
        @changeDeclareType="handleChangeDeclareType"
        @changeBasicInfo="handleChangeBasicInfo"
        @changeCodeMap="handleChangeCodeMap"
      >
      </ComponentDeclare>
    </div>

    <!-- start 需要修改的地方 在以下代码中根据项目需求更改 -->
    <div class="personnel-type-wrapper space-top-wrapper">
      <ComponentDeclarePersonnel
        :renderData="personnelList"
        isOpenCategoryNotes
        @change="handleChangePersonnelInfo"
      >
      </ComponentDeclarePersonnel>
    </div>

    <div class="declare-info-wrapper">
      <ComponentPanel title="申报信息">
        <div class="panel-content">
          <div class="cell-items">
            <block v-if="declareType === '02'">
              <div class="cell-item required">
                <div class="key">身份证号</div>
                <div class="value">
                  <input
                    type="idcard"
                    maxlength="18"
                    v-model="projectDeclareInfo.aac002"
                    @blur="handleAac002Blur"
                    placeholder="请输入申报人的身份证号"
                  />
                </div>
              </div>
              <div class="cell-item required">
                <div class="key">姓名</div>
                <div class="value">
                  <input
                    type="text"
                    v-model="projectDeclareInfo.aac003"
                    placeholder="请输入申报人的姓名"
                  />
                </div>
              </div>
              <div class="cell-item required">
                <div class="key">联系电话</div>
                <div class="value">
                  <input
                    type="number"
                    maxlength="11"
                    v-model="projectDeclareInfo.aae005"
                    placeholder="请输入联系电话"
                    @blur="handleAae005Blur"
                  />
                </div>
              </div>
              <!-- 户籍地址 -->
              <ComponentSelectPermanentAddress
                v-model="projectDeclareInfo.aae006"
                @change="handleChangePermanentAddress"
              ></ComponentSelectPermanentAddress>
            </block>

            <!-- 工商注册地 -->
            <ComponentSelectPermanentAddress
              placeholder="请选择工商注册地"
              label="工商注册地"
              v-model="projectDeclareInfo.r00043"
            >
            </ComponentSelectPermanentAddress>

            <!-- 申请企业名称 -->
            <div class="cell-item required">
              <div class="key">申请企业名称</div>
              <div class="value">
                <input
                  type="text"
                  v-model="projectDeclareInfo.r00042"
                  placeholder="请输入申请企业名称"
                />
              </div>
            </div>

            <!-- 法人代表 -->
            <div class="cell-item required">
              <div class="key">法人代表</div>
              <div class="value">
                <input
                  type="text"
                  v-model="projectDeclareInfo.r00044"
                  placeholder="请输入法人代表"
                />
              </div>
            </div>

            <!-- 法人代表联系电话 -->
            <div class="cell-item required">
              <div class="key">法人代表联系电话</div>
              <div class="value">
                <input
                  type="number"
                  v-model="projectDeclareInfo.r00045"
                  placeholder="请输入法人代表联系电话"
                  @blur="handleAae005Blur"
                />
              </div>
            </div>

            <!-- 企业吸纳劳动者人数 -->
            <div class="cell-item required">
              <div class="key">企业吸纳劳动者人数</div>
              <div class="value">
                <input
                  type="text"
                  v-model="projectDeclareInfo.r00046"
                  placeholder="请输入吸纳人数"
                />
              </div>
            </div>

            <!-- 申请金额 -->
            <div class="cell-item required">
              <div class="key">申请金额</div>
              <div class="value">
                <input
                  type="number"
                  v-model="projectDeclareInfo.r00047"
                  placeholder="请输入申请金额"
                />
              </div>
            </div>

            <!-- 开户银行 -->
            <ComponentDeclarePicker
              label="开户银行"
              idName="r00029"
              placeholder="请选择开户银行"
              :range="codeMap.aae008"
              v-model="projectDeclareInfo.r00029"
              @change="getPickerValueDesc"
            >
            </ComponentDeclarePicker>

            <!-- 银行账号 -->
            <div class="cell-item required">
              <div class="key">银行账号</div>
              <div class="value">
                <input
                  type="text"
                  v-model="projectDeclareInfo.r00032"
                  placeholder="请输入银行账号"
                />
              </div>
            </div>
          </div>
        </div>
      </ComponentPanel>
    </div>

    <!-- start 需要修改的地方开始 在以下代码中根据项目需求更改 上面代码勿动 -->

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
import ComponentDeclareCard from '../components/ez-declare-card/ez-declare-card.vue'
import ComponentDeclarePersonnel from '@/components/project/ez-declare-personnel/ez-declare-personnel.vue'
import ComponentDeclareRadio from '@/components/project/ez-declare-radio/ez-declare-radio.vue'
import ComponentDeclarePicker from '@/components/project/ez-declare-picker/ez-declare-picker.vue'

import { useDeclare } from '@/mixins'
import { showModal } from '@/utils/uni-api'
import { checkPhoneNumber } from '@/utils/check'

export default {
  name: 'pageDeclare20028',
  data() {
    return {
      renderObj: {
        idCard: true, // 身份证
        userName: true, // 姓名
        age: false, // 年龄
        tel: true, // 联系电话
        gender: true, // 性别
        nation: false, // 民族
        education: false, // 学历
        birthday: false, // 出生日期
        nativePlace: false, // 籍贯
        permanentAddress: false, // 户籍地址
        currentAddress: false, // 现居住地址
        aac203: true, // 社保卡银行卡号
        aaz500: false, // 社保卡编号
        aaz502: true, // 社保卡状态
        aaf002: true, // 社保卡银行卡类别
        chb0a7: false, // 补贴金额
        chb0a8: false, // 健康状况
      },
      projectDeclareInfo: {
        chbaac: '',
        r00043: '',
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
    // 手动输入手机号 失去焦点监听
    handleAae005Blur(e) {
      const { value } = e.target
      const checkIDCardResult = checkPhoneNumber(value)
      if (checkIDCardResult.status === '0') {
        showModal(checkIDCardResult.msg, '提示', false)
        this.projectDeclareInfo = {
          ...this.projectDeclareInfo,
          aae005: '',
        }
      }
    },
    // 检测数据输入格式是否正确 须根据项目需求修改
    handleCheckInput() {
      const declareType = this.declareType
      const personnelInfo = this.personnelInfo
      const { permanentAddress, tel, idCard } = this.basicInfo
      const {
        aac002, // 身份证号
        aac003, // 姓名
        sac004, // 性别
        pac067, // 手机号码
        aae005, // 联系电话
        // aae006, // 户籍地址

        r00043, // 工商注册地
        r00042, // 申请企业名称
        r00044, // 法人代表
        r00045, // 法人代表联系电话
        r00046, // 企业吸纳劳动者人数
        r00047, // 申请金额
        r00029, // 开户银行
        r00032, // 银行账号
      } = this.projectDeclareInfo
      if (!idCard) {
        showModal('系统出了点小问题，无法获取到经办人身份信息，请稍后重试！')
        return false
      }
      if (!tel) {
        showModal(
          declareType === '01' ? '请输入申报人联系电话' : '请输入代办人联系电话'
        )
        return false
      } else {
        const checkPhoneNumberResult = checkPhoneNumber(
          tel,
          declareType === '01' ? '申报人联系电话' : '代办人联系电话'
        )
        if (checkPhoneNumberResult.status === '0') {
          showModal(checkPhoneNumberResult.msg)
          return false
        }
      }

      if (!r00043) {
        showModal('工商注册地')
        return false
      }

      if (!r00042) {
        showModal('申请企业名称')
        return false
      }

      if (!r00044) {
        showModal('法人代表')
        return false
      }

      if (!r00045) {
        showModal('法人代表联系电话')
        return false
      } else {
        const checkPhoneNumberResult = checkPhoneNumber(
          r00045,
          '申报人联系电话'
        )
        if (checkPhoneNumberResult.status === '0') {
          showModal(checkPhoneNumberResult.msg)
          return false
        }
      }

      if (!r00046) {
        showModal('企业吸纳劳动者人数')
        return false
      }

      if (!r00047) {
        showModal('申请金额')
        return false
      }

      if (!r00029) {
        showModal('开户银行')
        return false
      }

      if (!r00032) {
        showModal('银行账号')
        return false
      }

      return true
    },

    // 下一步 须根据项目需求修改
    handleJumpNextStep() {
      if (!this.handleCheckComponentInput()) {
        return
      }
      const checkResult = this.handleCheckInput()
      if (!checkResult) {
        return
      }

      const {
        r00043, // 工商注册地
        r00042, // 申请企业名称
        r00044, // 法人代表
        r00045, // 法人代表联系电话
        r00046, // 企业吸纳劳动者人数
        r00047, // 申请金额
        r00029, // 开户银行
        r00032, // 银行账号
      } = this.projectDeclareInfo

      // 扩展字段
      const hb00BizMap = {
        r00043, // 工商注册地
        r00042, // 申请企业名称
        r00044, // 法人代表
        r00045, // 法人代表联系电话
        r00046, // 企业吸纳劳动者人数
        r00047, // 申请金额
        r00029, // 开户银行
        r00032, // 银行账号
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
