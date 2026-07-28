<!-- 县级大学生创业吸纳就业奖励 -->
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
        :projectName="chi031_desc"
        @changeDeclareType="handleChangeDeclareType"
        @changeBasicInfo="handleChangeBasicInfo"
        @changeCodeMap="handleChangeCodeMap"
      >
      </ComponentDeclare>
    </div>

    <div class="personnel-type-wrapper space-top-wrapper">
      <ComponentDeclarePersonnel
        :renderData="personnelList"
        :isOpenCategoryNotes="true"
        @change="handleChangePersonnelInfo"
      ></ComponentDeclarePersonnel>
    </div>

    <!-- start 需要修改的地方 在以下代码中根据项目需求更改 -->
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

            <ComponentSelectAddressMultitype
              label="灵活就业详细地点"
              placeholder="请选择或输入灵活就业详细地点"
              :isShowBtn="renderObj.permanentAddress"
              @clickBtn="projectDeclareInfo.r00033 = basicInfo.permanentAddress"
              v-model="projectDeclareInfo.r00033"
            ></ComponentSelectAddressMultitype>

            <!-- 现居地址 -->
            <ComponentSelectAddressMultitype
              label="现居住地址"
              placeholder="请选择或输入现居住地址"
              :isShowBtn="renderObj.permanentAddress"
              @clickBtn="projectDeclareInfo.r00049 = basicInfo.permanentAddress"
              v-model="projectDeclareInfo.r00049"
            ></ComponentSelectAddressMultitype>

            <!-- 就业创业证书编号 -->
            <div class="cell-item required">
              <div class="key">就业创业证书编号</div>
              <div class="value">
                <input
                  type="text"
                  v-model="projectDeclareInfo.r00035"
                  placeholder="请输入就业创业证书编号"
                />
              </div>
            </div>

            <ComponentDeclarePicker
              label="文化程度"
              idName="r43701"
              placeholder="请选择文化程度"
              :range="codeMap.aac011"
              v-model="projectDeclareInfo.r43701"
              @change="getPickerValueDesc"
            ></ComponentDeclarePicker>

            <div class="cell-item required">
              <div class="key">灵活就业具体情况</div>
              <div class="value">
                <input
                  type="text"
                  v-model="projectDeclareInfo.r00040"
                  placeholder="请输入灵活就业具体情况"
                />
              </div>
            </div>

            <ComponentDeclarePicker
              label="就业时间"
              idName="r00036"
              mode="date"
              :required="false"
              fields="day"
              :endTime="new Date().getTime()"
              placeholder="请选择就业时间"
              v-model="projectDeclareInfo.r00036"
              @change="getPickerValueDesc"
            ></ComponentDeclarePicker>

            <div class="cell-item required">
              <div class="key">月收入(元)</div>
              <div class="value">
                <input
                  type="number"
                  v-model="projectDeclareInfo.r00037"
                  placeholder="请输入您的月收入"
                />
              </div>
            </div>

            <div class="cell-item">
              <div class="key">就业岗位类型</div>
              <div class="value">
                <input
                  type="text"
                  v-model="projectDeclareInfo.r00039"
                  placeholder="请输入您的就业岗位类型"
                />
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

import ComponentDeclareStep from '@/components/project/ez-declare-step/ez-declare-step.vue'
import ComponentDeclare from '@/components/project/ez-declare/ez-declare.vue'
import ComponentSelectPermanentAddress from '@/components/project/ez-select-permanent-address/ez-select-permanent-address.vue'
import ComponentSelectAddressMultitype from '@/components/project/ez-select-address-multitype/ez-select-address-multitype.vue'
import ComponentDeclareCard from '../components/ez-declare-card/ez-declare-card.vue'
import ComponentDeclarePersonnel from '@/components/project/ez-declare-personnel/ez-declare-personnel.vue'
import ComponentDeclareRadio from '@/components/project/ez-declare-radio/ez-declare-radio.vue'
import ComponentDeclarePicker from '@/components/project/ez-declare-picker/ez-declare-picker.vue'

import { useDeclare } from '@/mixins'
import { showModal } from '@/utils/uni-api'
import { checkIDCard, checkPhoneNumber } from '@/utils/check'

export default {
  name: 'pageDeclare20030',
  data() {
    return {
      renderObj: {
        idCard: true, // 身份证
        userName: true, // 姓名
        age: true, // 年龄
        tel: true, // 联系电话
        gender: true, // 性别
        nation: true, // 民族
        education: false, // 学历
        birthday: false, // 出生日期
        nativePlace: false, // 籍贯
        permanentAddress: true, // 户籍地址
        currentAddress: false, // 现居住地址
        aac203: true, // 社保卡银行卡号
        aaz500: false, // 社保卡编号
        aaz502: true, // 社保卡状态
        aaf002: true, // 社保卡银行卡类别
        chb0a7: false, // 补贴金额
        chb0a8: false, // 健康状况
      },
      projectDeclareInfo: {
        r00033: '',
        r00049: '',
      },
    }
  },
  components: {
    ComponentButton,
    ComponentPanel,
    ComponentDeclare,
    ComponentDeclareStep,
    ComponentSelectPermanentAddress,
    ComponentSelectAddressMultitype,
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
      const checkResult = checkPhoneNumber(value)
      if (checkResult.status === '0') {
        showModal(checkResult.msg)
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
        aac002,
        aac003,
        aae005,
        aae006,

        r00033, // 灵活就业地址
        r00049, // 家庭住址
        r00035, // 就业创业证书编号
        r43701, // 文化程度
        r00040, // 灵活就业具体情况
        r00036, // 灵活就业时间
        r00037, // 月收入（元）
        r00039, // 就业岗位类型 （非必填）
      } = this.projectDeclareInfo
      if (!idCard) {
        showModal('系统出了点小问题，无法获取到经办人身份信息，请稍后重试！')
        return false
      }

      // 代为申报
      if (declareType === '02') {
        if (!aac002) {
          showModal('请输入申报人身份证号')
          return false
        } else {
          const checkIDCardResult = checkIDCard(aac002, '身份证号')
          if (checkIDCardResult.status === '0') {
            showModal(checkIDCardResult.msg)
            return false
          }
        }

        if (!aac003) {
          showModal('请输入申报人的姓名')
          return false
        }
        if (!aae005) {
          showModal('请输入申报人联系电话')
          return false
        } else {
          const checkPhoneNumberResult = checkPhoneNumber(
            aae005,
            '申报人联系电话'
          )
          if (checkPhoneNumberResult.status === '0') {
            showModal(checkPhoneNumberResult.msg)
            return false
          }
        }

        if (!aae006) {
          showModal('请选择户籍地址')
          return false
        }
      }

      if (!r00033) {
        showModal('请选择或输入灵活就业地址')
        return false
      }

      if (!r00049) {
        showModal('请选择或输入现居住住址')
        return false
      }

      if (!r00035) {
        showModal('请输入就业创业编号')
        return false
      }

      if (!r43701) {
        showModal('请输入文化程度')
        return false
      }

      if (!r00040) {
        showModal('请输入灵活就业具体情况')
        return false
      }

      if (!r00036) {
        showModal('请输入灵活就业时间')
        return false
      }

      if (!r00037) {
        showModal('请输入您的月收入')
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
        r00033, // 灵活就业地址
        r00049, // 家庭住址
        r00035, // 就业创业证书编号
        r43701, // 文化程度
        r00040, // 灵活就业具体情况
        r00036, // 灵活就业时间
        r00037, // 月收入（元）
        r00039, // 就业岗位类型 （非必填）
      } = this.projectDeclareInfo
      // 扩展字段
      const hb00BizMap = {
        r00033, // 灵活就业地址
        r00049, // 家庭住址
        r00035, // 就业创业证书编号
        r43701, // 文化程度
        r00040, // 灵活就业具体情况
        r00036, // 灵活就业时间
        r00037, // 月收入（元）
        r00039, // 就业岗位类型 （非必填）
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
