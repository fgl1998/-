<template>
  <!-- 卫生扶贫救助基金 -->
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
            <ComponentDeclarePicker
              label="婚姻状况"
              idName="w00089"
              :range="codeMap.w00089"
              placeholder="请选择婚姻状况"
              v-model="projectDeclareInfo.w00089"
            >
            </ComponentDeclarePicker>

            <ComponentDeclarePicker
              v-if="personnelInfo.cac102 == '1235'"
              label="房屋类型"
              idName="w00135"
              :range="codeMap.w00135"
              placeholder="请选择房屋类型"
              v-model="projectDeclareInfo.w00135"
            >
            </ComponentDeclarePicker>

            <div class="cell-item">
              <div class="key">配偶姓名</div>
              <div class="value">
                <input
                  type="text"
                  v-model="projectDeclareInfo.w03006"
                  placeholder="请输入配偶姓名"
                />
              </div>
            </div>

            <div class="cell-item">
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

            <div class="cell-item required">
              <div class="key">子女身份证</div>
              <div class="value">
                <input
                  type="idcard"
                  maxlength="18"
                  v-model="projectDeclareInfo.w00005"
                  placeholder="请输入子女身份证"
                  @change="handleBlurM00004"
                />
              </div>
            </div>

            <ComponentDeclarePicker
              label="子女出生时间"
              idName="w00068"
              mode="date"
              fields="day"
              :endTime="new Date().getTime()"
              placeholder="请选择子女出生时间"
              v-model="projectDeclareInfo.w00068"
            >
            </ComponentDeclarePicker>

            <ComponentDeclarePicker
              v-if="projectDeclareInfo.w00068"
              label="子女死亡日期"
              idName="w00076"
              mode="date"
              fields="day"
              :startTime="projectDeclareInfo.w00068"
              :endTime="new Date().getTime()"
              placeholder="请选择子女死亡日期"
              v-model="projectDeclareInfo.w00076"
            >
            </ComponentDeclarePicker>
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
  name: 'pageDeclare20600',

  data() {
    return {
      renderObj: {
        idCard: true, // 身份证
        userName: true, // 姓名
        tel: true, // 联系电话
        permanentAddress: true, // 户籍地址
        gender: true, //性别
      },

      projectDeclareInfo: {
        w00131: '',
        w00068: '',
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
      let w00089 = [] // 婚姻状况
      let w00135 = [] // 房屋类型

      try {
        w00089 = await getCodeListByCodeName('w00089')
      } catch (err) {
        if (isDev) {
          console.log('code table w00089 error：', err)
        }
      }
      try {
        w00135 = await getCodeListByCodeName('w00135')
      } catch (err) {
        if (isDev) {
          console.log('code table w00135 error：', err)
        }
      }

      this.codeMap = {
        ...this.codeMap,
        w00089,
        w00135,
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
    // 检测数据输入格式是否正确 须根据项目需求更改
    handleCheckInput() {
      const {
        aac004, //性别
        aae006, //户籍地址/详细地址

        w00089, //婚姻状况
        w00135, //房屋类型
        w03006, //配偶姓名
        w00038, //配偶身份证号码
        w00004, //子女姓名
        w00005, //子女身份证
        w00068, //子女出生时间
        w00076, //子女死亡日期
      } = this.projectDeclareInfo
      // if (!w00039 && this.declareType == '02') {
      //   showModal("请输入与受助人关系");
      //   return false;
      // }
      if (!w00089) {
        showModal('请选择婚姻状况')
        return false
      }
      if (!w00135 && this.personnelInfo.cac102 == '1235') {
        showModal('请选择房屋类型')
        return false
      }
      if (w00038) {
        const checkResult = checkIDCard(w00038, '配偶身份证号码')
        if (checkResult.status === '0') {
          showModal(checkResult.msg)
          return false
        }
      }
      if (!w00004) {
        showModal('请输入子女姓名')
        return false
      }
      if (!w00005) {
        showModal('请输入子女身份证')
        return false
      } else {
        const checkResult = checkIDCard(w00005, '子女身份证')
        if (checkResult.status === '0') {
          showModal(checkResult.msg)
          return false
        }
      }
      if (!w00068) {
        showModal('请选择子女出生时间')
        return false
      }
      if (!w00076) {
        showModal('请选择子女死亡日期')
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
      } = this.basicInfo

      const { idCard, userName, tel } = this.agentInfo

      const {
        aac004, //性别
        aae006, //户籍地址/详细地址

        w00089, //婚姻状况
        w00135, //房屋类型
        w03006, //配偶姓名
        w00038, //配偶身份证号码
        w00004, //子女姓名
        w00005, //子女身份证
        w00068, //子女出生时间
        w00076, //子女死亡日期
      } = this.projectDeclareInfo
      // 扩展字段
      const hb00BizMap = {
        aac004: gender, //性别
        aae006: permanentAddress, //户籍地址/详细地址

        w00089, //婚姻状况
        w00135: this.personnelInfo.cac102 == '1235' ? w00135 : '', //房屋类型
        w03006, //配偶姓名
        w00038, //配偶身份证号码
        w00004, //子女姓名
        w00005, //子女身份证
        w00068, //子女出生时间
        w00076, //子女死亡日期
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
