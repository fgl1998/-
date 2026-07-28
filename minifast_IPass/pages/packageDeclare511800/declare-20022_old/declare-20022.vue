<template>
  <!-- 残疾人灵活就业 -->
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
    <div class="declare-info-wrapper">
      <ComponentPanel title="申报信息">
        <div class="panel-content">
          <div class="cell-items">
            <div class="cell-item required">
              <div class="key">经营项目和规模</div>
              <div class="value">
                <input
                  type="text"
                  v-model="projectDeclareInfo.c00258"
                  placeholder="请输入经营项目和规模"
                />
              </div>
            </div>

            <div class="cell-item required">
              <div class="key">投资规模</div>
              <div class="value">
                <input
                  type="text"
                  v-model="projectDeclareInfo.c00259"
                  placeholder="请输入投资规模"
                />
              </div>
            </div>

            <div class="cell-item required">
              <div class="key">营业执照号码</div>
              <div class="value">
                <input
                  type="text"
                  v-model="projectDeclareInfo.c00261"
                  placeholder="请输入营业执照号码"
                />
              </div>
            </div>
            <ComponentSelectAddressMultitype
              label="经营地点"
              placeholder="请选择或输入经营地点"
              :isShowBtn="renderObj.permanentAddress"
              @clickBtn="projectDeclareInfo.c00260 = basicInfo.permanentAddress"
              v-model="projectDeclareInfo.c00260"
            >
            </ComponentSelectAddressMultitype>
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

import ComponentDeclarePersonnel from '@/components/project/ez-declare-personnel/ez-declare-personnel.vue'
import ComponentDeclareRadio from '@/components/project/ez-declare-radio/ez-declare-radio.vue'
import ComponentDeclarePicker from '@/components/project/ez-declare-picker/ez-declare-picker.vue'
import ComponentSelectAddressMultitype from '@/components/project/ez-select-address-multitype/ez-select-address-multitype.vue'
import { useDeclare } from '@/mixins'

import { getIsDev } from '@/utils/get'
import { checkIDCard, checkPhoneNumber } from '@/utils/check'
import { getCodeListByCodeName } from '@/utils/custom-api'
import { showModal } from '@/utils/uni-api'

export default {
  name: 'pageDeclare20022',
  data() {
    return {
      renderObj: {
        idCard: true, // 身份证
        userName: true, // 姓名
        tel: true, // 联系电话
        permanentAddress: true, // 户籍地址
        gender: true, //性别
        age: true, // 年龄
      },

      projectDeclareInfo: {
        c00260: '',
        c00258: '',
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
    // async getCodeTableCacheData() {
    //   const isDev = getIsDev(); // 当前环境是否是开发环境
    //   let C00233_1 = []; // 申请项目类别
    //   let c00258 = []; // 经营项目
    //   try {
    //     C00233_1 = await getCodeListByCodeName("C00233_1");
    //   } catch (err) {
    //     if (isDev) {
    //       console.log("code table C00233_1 error：", err);
    //     }
    //   }
    //   try {
    //     c00258 = await getCodeListByCodeName("c00258");
    //   } catch (err) {
    //     if (isDev) {
    //       console.log("code table c00258 error：", err);
    //     }
    //   }
    //   this.codeMap = {
    //     ...this.codeMap,
    //     C00233_1,
    //     c00258,
    //   };
    // },
    // 数字验证
    // handleCheckNumber(e, id) {
    //   let { value } = e.target;
    //   if (value) {
    //     let res = value.replace(/\D+/g, "");
    //     let _this = this;
    //     this.$nextTick(function () {
    //       _this.projectDeclareInfo[id] = res;
    //     });
    //   }
    // },
    // handleChangeDataByIdCard(value){
    // 	this.seDataByIdCard(value)
    // },
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
        c00258, //经营项目和规模
        c00259, //投资规模
        c00261, //营业执照号
        c00260, //经营地点
        c03601, //二代残疾证号
        c00298,
        c00299,
        c00300,
        c00301,
        c00302,
      } = this.projectDeclareInfo
      if (!c00258) {
        showModal('请输入经营项目', '提示', false)
        return false
      }
      if (!c00259) {
        showModal('请输入投资规模', '提示', false)
        return false
      }
      if (!c00261) {
        showModal('请输入营业执照号', '提示', false)
        return false
      }
      if (!c00260) {
        showModal('请选择或输入经营地点', '提示', false)
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
      const { permanentAddress, gender, age } = this.basicInfo

      const {
        c00258, //经营项目和规模
        c00259, //投资规模
        c00261, //营业执照号
        c00260, //经营地点
        chb0h1, //残疾类别
        chb0h2, //残疾等级
        c03601, //二代残疾证号
      } = this.projectDeclareInfo
      let hb00BizMap = {}
      // 扩展字段
      hb00BizMap = {
        aac004: gender, //性别,
        chb00l: age, //年龄,
        c00008: permanentAddress, //户籍地址
        c00258, //经营项目和规模
        c00259, //投资规模
        c00261, //营业执照号
        c00260, //经营地点
        chb0h1, //残疾类别
        chb0h2, //残疾等级
        c03601, //二代残疾证号
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
