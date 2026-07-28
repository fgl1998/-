<template>
  <!-- 残疾人辅具适配补助 残联 -->
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
        :declareConfig="declareConfig"
        :addressFilter="[
          '510525',
          '510503',
          '510521',
          '510504',
          '510502',
          '510522',
        ]"
        @changeDeclareType="handleChangeDeclareType"
        @changeBasicInfo="handleChangeBasicInfo"
        @changeCodeMap="handleChangeCodeMap"
        @changeAgentInfo="handleChangeAgentInfo"
        @changeDataByIdCard="handleChangeDataByIdCard"
        currentAddressLabel="家庭地址"
        currentAddressPlaceholder="请输入家庭地址"
      >
      </ComponentDeclare>
    </div>

    <!-- start 需要修改的地方开始 在以下代码中根据项目需求更改 上面代码勿动 -->
    <div class="declare-info-wrapper">
      <ComponentPanel title="申报信息">
        <div class="panel-content">
          <div class="cell-items">
            <!-- 家庭经济情况 -->
            <div class="noquire">
              <ComponentDeclarePicker
                label="家庭经济情况"
                :range="codeMap.c00213"
                placeholder="请选择家庭经济情况"
                v-model="projectDeclareInfo.c00213"
              ></ComponentDeclarePicker>
            </div>
            <ComponentDeclarePicker
              label="辅助器具类型"
              :range="codeMap.c00188_1"
              placeholder="请选择辅助器具类型"
              v-model="projectDeclareInfo.c00188"
            ></ComponentDeclarePicker>

            <div class="cell-item textarea last">
              <div class="key">残疾状况简要描述</div>
              <div class="value">
                <textarea
                  maxlength="100"
                  placeholder="请输入残疾状况简要描述"
                  v-model="projectDeclareInfo.c00279"
                ></textarea>
              </div>
            </div>

            <div class="cell-item required">
              <div class="key">申请金额</div>
              <div class="value">
                <input
                  type="text"
                  v-model="projectDeclareInfo.aae019"
                  placeholder="请输入申请金额"
                />
              </div>
            </div>
          </div>
        </div>
      </ComponentPanel>
    </div>

    <!-- 监护人信息 -->
    <div class="space-top-wrapper">
      <ComponentPanel title="监护人信息">
        <div class="panel-content">
          <div class="cell-items">
            <div class="cell-item">
              <div class="key">监护人姓名</div>
              <div class="value">
                <input
                  type="text"
                  v-model="projectDeclareInfo.c77501"
                  placeholder="请输入监护人姓名"
                />
              </div>
            </div>
            <div class="cell-item">
              <div class="key">监护人身份证号</div>
              <div class="value">
                <input
                  type="idcard"
                  maxlength="18"
                  v-model="projectDeclareInfo.c77502"
                  placeholder="请输入监护人身份证号"
                  @blur="handleBlur01"
                />
              </div>
            </div>
            <div class="cell-item">
              <div class="key">监护人电话号码</div>
              <div class="value">
                <input
                  type="number"
                  maxlength="11"
                  v-model="projectDeclareInfo.chb0ha"
                  placeholder="请输入监护人电话号码"
                  @blur="handleAae005Blur"
                />
              </div>
            </div>
            <div class="noquire">
              <ComponentDeclarePicker
                label="与残疾人关系"
                :range="codeMap.f00024"
                placeholder="请选择与残疾人关系"
                v-model="projectDeclareInfo.c00056"
              ></ComponentDeclarePicker>
            </div>
          </div>
        </div>
      </ComponentPanel>
    </div>

    <div class="space-top-wrapper">
      <ComponentPanel title="残疾信息">
        <div class="panel-content">
          <div class="cell-items">
            <div class="cell-item required disabled">
              <div class="key">残疾类别</div>
              <div class="value">
                {{ projectDeclareInfo.chb0h1Desc || '暂无' }}
              </div>
            </div>
            <div class="cell-item required disabled">
              <div class="key">残疾等级</div>
              <div class="value">
                {{ projectDeclareInfo.chb0h2Desc || '暂无' }}
              </div>
            </div>
            <div class="cell-item required disabled">
              <div class="key">残疾证号</div>
              <div class="value">{{ projectDeclareInfo.c03601 || '暂无' }}</div>
            </div>
            <div class="cell-item required disabled">
              <div class="key">办证时间</div>
              <div class="value">{{ projectDeclareInfo.chb0h9 || '暂无' }}</div>
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

export default {
  name: 'pageDeclare20291',

  data() {
    return {
      renderObj: {
        idCard: true, // 身份证
        userName: true, // 姓名
        tel: true, // 联系电话
        permanentAddress: true, // 户籍地址
        age: true, //年龄
        gender: true, // 性别
        nature: true, // 户口性质
        nation: true, // 民族
      },
      projectDeclareInfo: {
        aae019: 0,
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
  // 监听页面显示
  onShow() {},
  // 监听页面隐藏
  onHide() {},
  methods: {
    async getCodeTableCacheData() {
      const isDev = getIsDev() // 当前环境是否是开发环境
      let c00188_1 = [] // 辅助器具
      let f00024 = [] // 关系
      let c00213 = [] // 家庭经济状况

      try {
        c00188_1 = await getCodeListByCodeName('c00188_1')
        f00024 = await getCodeListByCodeName('f00024')
        c00213 = await getCodeListByCodeName('c00213')
      } catch (err) {
        if (isDev) {
          console.log('code table c00188_1 error：', err)
          console.log('code table f00024 error：', err)
          console.log('code table c00213 error：', err)
        }
      }

      this.codeMap = {
        ...this.codeMap,
        c00188_1,
        f00024,
        c00213,
      }
    },
    handleChangeDataByIdCard(value) {
      this.seDataByIdCard(value)
    },
    // 手动输入手机号 失去焦点监听
    handleAae005Blur(e) {
      const { value } = e.target
      const checkIDCardResult = checkPhoneNumber(value)
      if (checkIDCardResult.status === '0') {
        showModal(checkIDCardResult.msg, '提示', false)
      }
    },
    // 身份证号 失去焦点监听
    handleBlur01(e) {
      const { value } = e.target
      const checkResult = checkIDCard(value, '监护人身份证号')
      if (checkResult.status === '0') {
        showModal(checkResult.msg)
      }
    },
    // 设置残疾人信息
    setDisabledData(declareType) {
      const { c03601, chb0h1, chb0h1Desc, chb0h9, chb0h2, chb0h2Desc } =
        this.userInfo
      // 残疾人数据返回格式
      // c03601: "51392219961015741053"
      // chb0h1: "5"
      // chb0h1Desc: "智力"
      // chb0h2: "3"
      // chb0h2Desc: "三级"
      // chb0h9: "2019-01-31"
      // chb0hf: "智力三级"
      // code: "1"
      if (declareType === '01') {
        // 存在残疾证号
        if (c03601) {
          this.projectDeclareInfo = {
            ...this.projectDeclareInfo,
            chb0h1, // 残疾人类别
            chb0h1Desc,
            chb0h2, // 残疾等级
            chb0h2Desc,
            chb0h9, // 办证时间
            c03601, // 残疾证号
          }
        } else {
          this.projectDeclareInfo = {
            ...this.projectDeclareInfo,
            chb0h1: '', // 残疾人类别
            chb0h1Desc: '',
            chb0h2: '', // 残疾等级
            chb0h2Desc: '',
            chb0h9: '', // 办证时间
            c03601: '', // 残疾证号
          }
          // showModal('系统检测到申报人不是残疾人，无法申报该补贴项目！').then(
          //   () => {
          //     navigateBack(1)
          //   }
          // )
        }
      } else {
        this.projectDeclareInfo = {
          ...this.projectDeclareInfo,
          chb0h1: '', // 残疾人类别
          chb0h1Desc: '',
          chb0h2: '', // 残疾等级
          chb0h2Desc: '',
          chb0h9: '', // 办证时间
          c03601: '', // 残疾证号
        }
      }
    },
    // 设置数据 通过身份证获取的数据
    seDataByIdCard(data) {
      const { c03601, chb0h1, chb0h1Desc, chb0h9, chb0h2, chb0h2Desc } =
        data.disabledInfo
      if (c03601) {
        this.projectDeclareInfo = {
          ...this.projectDeclareInfo,
          chb0h1, // 残疾人类别
          chb0h1Desc, // 残疾人类别
          chb0h2, // 残疾等级
          chb0h2Desc,
          chb0h9, // 办证时间
          c03601, // 残疾证号
        }
      } else {
        this.projectDeclareInfo = {
          ...this.projectDeclareInfo,
          chb0h1: '', // 残疾人类别
          chb0h1Desc: '',
          chb0h2: '', // 残疾等级
          chb0h2Desc: '',
          chb0h9: '', // 办证时间
          c03601: '', // 残疾证号
        }
      }
    },
    // 检测数据输入格式是否正确 须根据项目需求更改
    handleCheckInput() {
      const {
        aac005, // 民族
        chb00l, // 年龄
        aac004, // 性别
        c00008, // 户籍地址
        c00106, // 户口类别

        c03601, // 二代残疾证号
        chb0h1, // 残疾人类别
        chb0h2, // 残疾等级

        c00213, // 家庭经济状况
        c00188, // 辅具类型
        c00279, // 残疾状况简要描述
        aae019, // 发放金额

        c77501, // 监护人姓名
        c77502, // 监护人身份证
        chb0ha, // 监护人联系电话
        c00056, // 与残疾人关系
      } = this.projectDeclareInfo

      if (!c00188) {
        showModal('请选择辅具类型', '提示', false)
        return false
      }
      if (!aae019) {
        showModal('请输入申请金额', '提示', false)
        return false
      }
      if (!c03601) {
        showModal('申报人不是残疾人，无法申报该补贴项目，请检查申报人信息！')
        return false
      }
      // if (!c77501) {
      //   showModal('请输入监护人姓名')
      //   return false
      // }
      // if (!c77502) {
      //   showModal('请输入监护人身份证号')
      //   return false
      // } else {
      //   const checkResult = checkIDCard(c77502, '监护人身份证号')
      //   if (checkResult.status === '0') {
      //     showModal(checkResult.msg)
      //     return false
      //   }
      // }
      // if (!chb0ha) {
      //   showModal('请输入监护人联系电话')
      //   return false
      // } else {
      //   const checkResult = checkPhoneNumber(chb0ha, '监护人联系电话')
      //   if (checkResult.status === '0') {
      //     showModal(checkResult.msg)
      //     return false
      //   }
      // }
      // if (!c00056) {
      //   showModal(`请输入监护人与残疾人关系`)
      //   return false
      // }
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
        permanentAddress, // 户籍地址
        age, //年龄
        gender, // 性别
        nature, // 户口性质
        nation, // 民族
      } = this.basicInfo

      const {
        aac005, // 民族
        chb00l, // 年龄
        aac004, // 性别
        c00008, // 户籍地址
        c00106, // 户口类别

        c03601, // 二代残疾证号
        chb0h1, // 残疾人类别
        chb0h2, // 残疾等级

        c00213, // 家庭经济状况
        c00188, // 辅具类型
        c00279, // 残疾状况简要描述
        aae019, // 发放金额

        c77501, // 监护人姓名
        c77502, // 监护人身份证
        chb0ha, // 监护人联系电话
        c00056, // 与残疾人关系
      } = this.projectDeclareInfo
      let hb00BizMap = {}
      // 扩展字段
      hb00BizMap = {
        aac005: nation, // 民族
        chb00l: age, // 年龄
        aac004: gender, // 性别
        c00008: permanentAddress, // 户籍地址
        c00106: nature, // 户口类别

        c03601, // 二代残疾证号
        chb0h1, // 残疾人类别
        chb0h2, // 残疾等级

        c00213, // 家庭经济状况
        c00188, // 辅具类型
        c00279, // 残疾状况简要描述
        aae019, // 发放金额

        c77501, // 监护人姓名
        c77502, // 监护人身份证
        chb0ha, // 监护人联系电话
        c00056, // 与残疾人关系
      }

      this.handleDeclareData(hb00BizMap, '0')
    },
  },
  computed: {},
  watch: {
    userInfo: {
      handler(val) {
        const declareType = this.declareType
        if (val.user_id && declareType !== '00') {
          this.setDisabledData(declareType)
        }
      },
      immediate: true,
      deep: true,
    },
    declareType(val) {
      const { user_id } = this.userInfo
      if (val && user_id && val !== '00') {
        this.setDisabledData(val)
      }
    },
  },
}
</script>

<style lang="scss" scoped>
.declare-info-wrapper {
  margin-top: 30rpx;
}

.noquire /deep/ .ez-declare-picker-wrapper .label.data-v-2c56183c::before {
  content: '';
}
</style>
