<template>
  <!-- 残疾人居家灵活就业（创业）直补资金	 -->
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
        :addressFilter="[
          '510524',
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

    <!-- start 需要修改的地方开始 在以下代码中根据项目需求更改 上面代码勿动 -->
    <div class="declare-info-wrapper">
      <ComponentPanel title="申报信息">
        <div class="panel-content">
          <div class="cell-items">
            <div class="cell-item required">
              <div class="key">项目规模</div>
              <div class="value">
                <input
                  type="text"
                  v-model="projectDeclareInfo.c00231"
                  placeholder="请输入项目规模"
                />
              </div>
            </div>

            <div class="cell-item required">
              <div class="key">项目名称</div>
              <div class="value">
                <input
                  type="text"
                  v-model="projectDeclareInfo.c00234"
                  placeholder="请输入项目名称"
                />
              </div>
            </div>

            <ComponentSelectAddressMultitype
              label="项目地址"
              placeholder="请选择或输入项目地址"
              :isShowBtn="renderObj.permanentAddress"
              @clickBtn="projectDeclareInfo.c00038 = basicInfo.permanentAddress"
              v-model="projectDeclareInfo.c00038"
            >
            </ComponentSelectAddressMultitype>

            <ComponentDeclarePicker
              label="填报时间"
              idName="c00200"
              mode="date"
              fields="day"
              :endTime="new Date().getTime()"
              placeholder="请选择填报时间"
              v-model="projectDeclareInfo.c00200"
            ></ComponentDeclarePicker>

            <ComponentDeclarePicker
              label="项目类别"
              idName="c00233"
              :range="codeMap.c00233"
              placeholder="请选择项目类别"
              v-model="projectDeclareInfo.c00233"
            >
            </ComponentDeclarePicker>
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
import ComponentSelectAddressMultitype from '@/components/project/ez-select-address-multitype/ez-select-address-multitype.vue'
import ComponentDeclarePersonnel from '@/components/project/ez-declare-personnel/ez-declare-personnel.vue'
import ComponentDeclarePicker from '@/components/project/ez-declare-picker/ez-declare-picker.vue'

import { useDeclare } from '@/mixins'

import { checkIDCard } from '@/utils/check'
import { getCodeListByCodeName } from '@/utils/custom-api'
import { showModal } from '@/utils/uni-api'

export default {
  name: 'pageDeclare20062',

  data() {
    return {
      renderObj: {
        idCard: true, // 身份证
        userName: true, // 姓名
        tel: true, // 联系电话
        permanentAddress: true, // 户籍地址
        gender: true, // 性别
        nation: true, // 民族
        currentAddress: true, // 现居地址
        nature: true, // 户口性质
        age: true, // 年龄
      },

      projectDeclareInfo: {
        c00038: '',
      },
    }
  },
  components: {
    ComponentButton,
    ComponentPanel,
    ComponentDeclare,
    ComponentDeclareStep,
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
      let c00233 = [] // 项目类型

      try {
        c00233 = await getCodeListByCodeName('c00233')
      } catch (err) {
        console.error('code table c00233 error：', err)
      }

      this.codeMap = {
        ...this.codeMap,
        c00233,
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
        c03601, // 二代残疾证号
        chb0h1, // 残疾人类别
        chb0h2, // 残疾等级

        aac004, // 性别
        chb00l, // 年龄
        aac005, // 民族
        c00106, // 户籍类别
        aae006, // 户籍地址

        c00231, // 项目规模
        c00234, // 项目名称
        c00038, // 项目地址
        c00200, // 填报时间
        c00233, // 项目类别
      } = this.projectDeclareInfo
      if (!c00231) {
        showModal('请输入项目规模')
        return false
      }
      if (!c00234) {
        showModal('请输入项目名称')
        return false
      }
      if (!c00038) {
        showModal('请选择项目地址')
        return false
      }
      if (!c00200) {
        showModal('请选择填报时间')
        return false
      }
      if (!c00233) {
        showModal('请选择项目类别')
        return false
      }

      if (!c03601) {
        showModal('申报人不是残疾人，无法申报该补贴项目，请检查申报人信息！')
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
        age, // 年龄
        nation, // 民族
        permanentAddress, // 户籍地址
        nature, // 户口性质
      } = this.basicInfo

      const {
        c03601, // 二代残疾证号
        chb0h1, // 残疾人类别
        chb0h2, // 残疾等级

        aac004, // 性别
        chb00l, // 年龄
        aac005, // 民族
        c00106, // 户籍类别
        aae006, // 户籍地址

        c00231, // 项目规模
        c00234, // 项目名称
        c00038, // 项目地址
        c00200, // 填报时间
        c00233, // 项目类别
      } = this.projectDeclareInfo
      // 扩展字段
      const hb00BizMap = {
        c03601, // 二代残疾证号
        chb0h1, // 残疾人类别
        chb0h2, // 残疾等级

        aac004: gender, // 性别
        chb00l: age, // 年龄
        aac005: nation, // 民族
        c00106: nature, // 户籍类别
        aae006: permanentAddress, // 户籍地址

        c00231, // 项目规模
        c00234, // 项目名称
        c00038, // 项目地址
        c00200, // 填报时间
        c00233, // 项目类别
        aae019: '0', // 发放金额
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
</style>
