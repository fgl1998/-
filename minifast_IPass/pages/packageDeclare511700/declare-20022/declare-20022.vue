<!-- 残疾人灵活就业补贴（残联） -->
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
        isOpenOCR
        :projectNumber="chi031"
        currentAddressType="city"
        :projectName="chi031_desc"
        addressFilter="1569457,1569460,1569463,1569466,1569472,1569475,1569469,1569481,2095930"
        @changeDeclareType="handleChangeDeclareType"
        @changeBasicInfo="handleChangeBasicInfo"
        @changeCodeMap="handleChangeCodeMap"
        @changeAgentInfo="handleChangeAgentInfo"
        @changeDataByIdCard="handleChangeDataByIdCard"
      >
      </ComponentDeclare>
    </div>

    <!-- start 需要修改的地方开始 在以下代码中根据项目需求更改 上面代码勿动 -->

    <!-- 申报信息 -->
    <div class="space-top-wrapper">
      <ComponentPanel title="申报信息">
        <div class="panel-content">
          <div class="cell-items">
            <ComponentDeclarePicker
              label="从事的职业或副业"
              idName="c00071"
              :range="codeMap.c00071"
              placeholder="请选择"
              v-model="projectDeclareInfo.c00071"
            ></ComponentDeclarePicker>
            <div class="cell-item required">
              <div class="key">子女或亲属联系人</div>
              <div class="value">
                <input
                  type="text"
                  v-model="projectDeclareInfo.c00013"
                  placeholder="请输入联系人姓名"
                />
              </div>
            </div>
            <div class="cell-item required">
              <div class="key">子女或亲属联系电话</div>
              <div class="value">
                <input
                  type="number"
                  maxlength="11"
                  v-model="projectDeclareInfo.c00014"
                  placeholder="请输入联系电话"
                />
              </div>
            </div>
          </div>
        </div>
      </ComponentPanel>
    </div>

    <!--残疾信息 -->
    <div class="space-top-wrapper">
      <ComponentPanel title="残疾信息">
        <div class="panel-content">
          <div class="cell-items">
            <div class="cell-item required disabled">
              <div class="key">残疾人类别</div>
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
import ComponentDeclarePicker from '@/components/project/ez-declare-picker/ez-declare-picker.vue'

import { useDeclare } from '@/mixins'

import { getIsDev } from '@/utils/get'
import { getCodeListByCodeName } from '@/utils/custom-api'
import { navigateBack, showModal } from '@/utils/uni-api'
export default {
  name: 'pageDeclare20022',
  data() {
    return {
      // 基本信息 渲染配置
      renderObj: {
        idCard: true, // 身份证
        userName: true, // 姓名
        tel: true, // 联系电话
        gender: true, // 性别
        age: true, //年龄
        birthday: true, // 出生日期
        currentAddress: true, // 现居住地址
        permanentAddress: true, // 户籍地址
      },

      // 自定义添加一些属性 防止双向绑定失败 例如 picker组件之类

      projectDeclareInfo: {
        c00008: '', // 户籍地址
        c00015: '', // 现居住地址
        chb00l: '', // 年龄
        aac004: '', // 性别
        chb0h1: '', // 残疾人类别
        chb0h2: '', // 残疾等级
        c03601: '', // 残疾证号
        chb0h9: '', // 办证时间
        c00071: '', // 从事职业或副业
        c00013: '', // 子女或亲属联系人
        c00014: '', // 子女或亲属联系电话
      },
    }
  },
  components: {
    ComponentButton,
    ComponentPanel,
    ComponentDeclare,
    ComponentDeclareStep,
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
    // 获取该申报项目的所需要的码表数据
    // aaz502、aac011、dac009、aac004、aac005、aae008、yesorno 不用再次获取
    // 编写格式参考达州20033项目
    async getCodeTableCacheData() {
      const isDev = getIsDev //当前环境是否是开发环境
      let c00071 = [] // 从事的职业或副业

      try {
        c00071 = await getCodeListByCodeName('c00071')
      } catch (err) {
        if (isDev) {
          console.log('code table c00071 error', err)
        }
      }
      this.codeMap = {
        ...this.codeMap,
        c00071,
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
          showModal('系统检测到申报人不是残疾人，无法申报该补贴项目！').then(
            () => {
              navigateBack(1)
            }
          )
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
        chb0h1, // 残疾人类别
        chb0h2, // 残疾等级
        c03601, // 残疾证号
        chb0h9, // 办证时间
        c00071, // 从事职业或副业
        c00013, // 儿女或亲属联系人
        c00014, // 儿女或亲属联系电话
        chb00l, // 年龄
        aac004, // 性别
      } = this.projectDeclareInfo
      if (!c00071) {
        showModal('请输入从事的职业或副业')
        return false
      }
      if (!c00013) {
        showModal('请输入儿女或亲属联系人')
        return false
      }
      if (!c00014) {
        showModal('请输入儿女或亲属联系电话')
        return false
      }
      if (!c03601) {
        showModal('申报人不是残疾人，无法申报该补贴项目！')
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
        permanentAddress, //户籍地址
        currentAddress, // 现居住地址
        age, //年龄
        gender, //性别
      } = this.basicInfo

      const {
        c00008, // 户籍地址
        c00015, // 现居住地址
        chb00l, // 年龄
        aac004, // 性别
        chb0h1, // 残疾人类别
        chb0h2, // 残疾等级
        c03601, // 残疾证号
        chb0h9, // 办证时间
        c00071, // 从事职业或副业
        c00013, // 儿女或亲属联系人
        c00014, // 儿女或亲属联系电话
      } = this.projectDeclareInfo

      // 扩展字段

      const hb00BizMap = {
        c00015: currentAddress,
        chb00l: age, //年龄
        aac004: gender, // 性别
        c00008: permanentAddress, // 户籍地址
        che0hf: chb0h1, // 残疾人类别
        chb0h2: chb0h2, // 残疾等级
        c03601: c03601, // 残疾证号
        chb0h9: chb0h9, // 办证时间
        c00071: c00071, // 从事职业或副业
        c00013: c00013, // 儿女或亲属联系人
        c00014: c00014, // 儿女或亲属联系电话
      }
      this.handleDeclareData(hb00BizMap, '0')
    },
  },
  computed: {},
  watch: {
    'userInfo.user_id': {
      handler(val) {
        const declareType = this.declareType
        if (val && declareType !== '00') {
          this.setDisabledData(declareType)
        }
      },
      immediate: true,
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
</style>
