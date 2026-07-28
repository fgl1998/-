<!-- 残疾儿童康复救助 残联 -->
<template>
  <view class="declare">
    <!-- 当前申报流程 -->
    <div class="progress-wrapper">
      <ComponentDeclareStep :current="2"></ComponentDeclareStep>
    </div>

    <!-- 申报人或者代办人基本信息 -->
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
        currentAddressLabel="家庭地址"
        currentAddressPlaceholder="请选择家庭地址"
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
              label="婚姻状况"
              idName="c00214"
              :range="codeMap.c00214"
              v-model="projectDeclareInfo.c00214"
              placeholder="请选择婚姻状况"
            ></ComponentDeclarePicker>

            <ComponentDeclarePicker
              label="婚姻变动状况"
              idName="c00253"
              :range="codeMap.yesorno"
              v-model="projectDeclareInfo.c00253"
              placeholder="请选择婚姻变动状况"
            ></ComponentDeclarePicker>

            <ComponentDeclarePicker
              v-if="isShowC00251"
              label="婚姻变动时间"
              idName="c00251"
              mode="date"
              fields="day"
              :endTime="today"
              v-model="projectDeclareInfo.c00251"
              placeholder="请选择婚姻变动时间"
            ></ComponentDeclarePicker>

            <ComponentDeclarePicker
              label="是否再生育"
              idName="c00254"
              :range="codeMap.yesorno"
              v-model="projectDeclareInfo.c00254"
              placeholder="请选择是否再生育"
            ></ComponentDeclarePicker>
          </div>
        </div>
      </ComponentPanel>
    </div>

    <div class="space-top-wrapper">
      <ComponentPanel title="配偶信息">
        <div class="panel-content">
          <div class="cell-items">
            <div class="cell-item required">
              <div class="key">配偶姓名</div>
              <div class="value">
                <input
                  type="text"
                  v-model="projectDeclareInfo.c00262"
                  placeholder="请输入配偶姓名"
                />
              </div>
            </div>

            <div class="cell-item required">
              <div class="key">配偶身份证号</div>
              <div class="value">
                <input
                  type="text"
                  maxlength="18"
                  v-model="projectDeclareInfo.c00265"
                  placeholder="请输入配偶身份证号"
                  @blur="handleBlurM00004"
                />
              </div>
            </div>

            <!-- 性别 -->
            <div class="cell-item required disabled">
              <div class="key">性别</div>
              <div class="value">
                {{ projectDeclareInfo.c00263_desc || '暂无' }}
              </div>
            </div>
            <!-- 出生日期 -->
            <div class="cell-item required disabled">
              <div class="key">出生日期</div>
              <div class="value">{{ projectDeclareInfo.c00264 || '暂无' }}</div>
            </div>

            <!-- 户口性质 -->
            <ComponentDeclarePicker
              label="户口性质"
              idName="c00266"
              placeholder="请选择户口性质"
              :range="codeMap.dac009"
              v-model="projectDeclareInfo.c00266"
            >
            </ComponentDeclarePicker>

            <ComponentDeclarePicker
              label="配偶婚姻状况"
              idName="c00267"
              :range="codeMap.c00214"
              v-model="projectDeclareInfo.c00267"
              placeholder="请选择婚姻状况"
            ></ComponentDeclarePicker>

            <ComponentDeclarePicker
              label="配偶婚姻变动状况"
              idName="c00268"
              :range="codeMap.yesorno"
              v-model="projectDeclareInfo.c00268"
              placeholder="请选择变动状况"
            ></ComponentDeclarePicker>

            <ComponentDeclarePicker
              v-if="isShowC00269"
              label="配偶婚姻变动时间"
              idName="c00269"
              mode="date"
              fields="day"
              :endTime="today"
              v-model="projectDeclareInfo.c00269"
              placeholder="请选择婚姻变动时间"
            ></ComponentDeclarePicker>
          </div>
        </div>
      </ComponentPanel>
    </div>

    <div class="space-top-wrapper">
      <ComponentPanel title="残疾子女信息">
        <div class="panel-content">
          <div class="cell-items">
            <div class="cell-item required">
              <div class="key">二代残疾证号</div>
              <div class="value">
                <input
                  type="text"
                  maxlength="20"
                  v-model="projectDeclareInfo.c03601"
                  placeholder="请输入残疾证号"
                  @change="handleCheckDisability"
                />
              </div>
            </div>

            <ComponentDeclarePicker
              label="残疾类别"
              idName="chb0h1"
              :range="codeMap.chb0h1"
              v-model="projectDeclareInfo.chb0h1"
              placeholder="请选择残疾类别"
            ></ComponentDeclarePicker>

            <ComponentDeclarePicker
              label="残疾等级"
              idName="chb0h2"
              :range="codeMap.chb0h2"
              v-model="projectDeclareInfo.chb0h2"
              placeholder="请选择残疾等级"
            ></ComponentDeclarePicker>
          </div>
        </div>
      </ComponentPanel>
    </div>

    <!-- 添加夫妻曾经生育子女信息 -->
    <div class="space-top-wrapper">
      <ComponentPanel title="曾经生育子女信息">
        <ComponentDeclareCard
          :renderData="cardList1"
          type="20518_1"
          addButtonName="添加曾经生育子女信息"
          @change="handleChangeCardList1"
        ></ComponentDeclareCard>
      </ComponentPanel>
    </div>

    <div class="space-top-wrapper">
      <ComponentPanel title="曾经收养子女信息">
        <ComponentDeclareCard
          :renderData="cardList2"
          type="20518_2"
          addButtonName="添加曾经收养子女信息"
          @change="handleChangeCardList2"
        ></ComponentDeclareCard>
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

import { getIsDev, getDate } from '@/utils/get'
import { checkIDCard } from '@/utils/check'
import { getCodeListByCodeName } from '@/utils/custom-api'
import { showModal } from '@/utils/uni-api'
import { getBirthday, getGender } from '@/utils/get'

export default {
  name: 'pageDeclare20518',
  data() {
    return {
      today: getDate('day'),
      // 基本信息 渲染配置
      renderObj: {
        idCard: true, // 身份证
        userName: true, // 姓名
        tel: true, // 联系电话
        gender: true, // 性别
        birthday: true, // 出生日期
        nature: true, // 戶口性質
        permanentAddress: true, // 户籍地址
        currentAddress: true, // 现居地址
      },
      projectDeclareInfo: {
        c00266: '',
        c00268: '',
        c00269: '',
        c00251: '',
        c00253: '',
      },
      cardList1: [],
      cardList2: [],
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
      let c00214 = [] // 婚姻狀況
      let dac009 = [] // 戶籍狀況
      let chb0h1 = [] // 残疾人类别
      let chb0h2 = [] // 残疾人等级
      try {
        c00214 = await getCodeListByCodeName('c00214')
      } catch (err) {
        if (isDev) {
          console.log('code table c00214 error：', err)
        }
      }

      try {
        dac009 = await getCodeListByCodeName('dac009')
      } catch (err) {
        if (isDev) {
          console.log('code table dac009 error：', err)
        }
      }

      try {
        chb0h1 = await getCodeListByCodeName('chb0h1')
      } catch (err) {
        if (isDev) {
          console.log('code table chb0h1 error：', err)
        }
      }

      try {
        chb0h2 = await getCodeListByCodeName('chb0h2')
      } catch (err) {
        if (isDev) {
          console.log('code table chb0h2 error：', err)
        }
      }

      this.codeMap = {
        ...this.codeMap,
        c00214,
        dac009,
        chb0h1,
        chb0h2,
      }
    },
    // 手动输入户主身份证号 失去焦点监听
    handleBlurM00004(e) {
      const { value } = e.target
      const checkResult = checkIDCard(value)
      if (checkResult.status === '0') {
        showModal(checkResult.msg)
      } else {
        this.projectDeclareInfo = {
          ...this.projectDeclareInfo,
          c00264: getBirthday(value),
          c00263: getGender(value) == '男' ? '1' : '2',
          c00263_desc: getGender(value),
        }
      }
    },
    // 捕获 cardList 不用修改
    handleChangeCardList1(type, data) {
      this.cardList1 = [...data]
    },
    handleChangeCardList2(type, data) {
      this.cardList2 = [...data]
    },
    handleCheckDisability(e) {
      const { value } = e.target
      if (value && !this.CheckDisability(value)) {
        showModal('请输入正确的残疾证号')
      }
    },
    // 校验残疾人证
    CheckDisability(value) {
      console.log(value)
      let str = /[\d]{17}[\dX][1-7][1-4]/.test(value)
      console.log(str)
      return str
    },
    // 检测数据输入格式是否正确 须根据项目需求更改
    handleCheckInput() {
      const {
        aac004, // 性别
        c00062, // 出生年月
        c00106, // 户口类别
        aae005, // 联系电话
        c00033, // 家庭地址

        c00214, // 婚姻状况
        c00253, // 婚姻变动情况
        c00251, // 婚姻变动时间
        c00254, //是否再生育

        c00262, // 配偶姓名
        c00263, //配偶性别
        c00264, //配偶出生年月
        c00265, //配偶身份证号码
        c00266, //配偶户口性质
        c00267, //配偶婚姻状况
        c00268, //配偶婚姻变动情况
        c00269, //配偶婚姻变动时间

        c03601, //二代残疾证号
        chb0h1, //残疾人类别
        chb0h2, //残疾等级 4

        // c00270, //子女姓名
        // c00271, //子女性别
        // c00272, //子女出生年月
        // c00256, //是否亲生
        // c00252, //死残日期

        // c00273, //收养子女姓名
        // c00274, //收养子女性别
        // c00275, //收养子女出生年月
        // c00257, //收养年月
        // c00276, //收养子女死残日期
        // c00255, //是否具有法律手续
      } = this.projectDeclareInfo
      const isShowC00269 = this.isShowC00269
      const isShowC00251 = this.isShowC00251
      if (!c00214) {
        showModal('请选择婚姻状况')
        return false
      }
      if (!c00253) {
        showModal('请选择婚姻变动情况')
        return false
      }
      if (!c00251 && isShowC00251) {
        showModal('请选择婚姻变动时间')
        return false
      }
      if (!c00254) {
        showModal('请选择是否再生育')
        return false
      }
      if (!c00262) {
        showModal('请输入配偶姓名')
        return false
      }
      if (!c00265) {
        showModal('请输入配偶身份证号码')
        return false
      } else {
        const checkResult = checkIDCard(c00265, '配偶身份证号码')
        if (checkResult.status === '0') {
          showModal(checkResult.msg)
          return false
        }
      }
      if (!c00263) {
        showModal('请选择配偶性别')
        return false
      }
      if (!c00264) {
        showModal('请选择配偶出生年月')
        return false
      }
      if (!c00266) {
        showModal('请选择配偶户口性质')
        return false
      }
      if (!c00267) {
        showModal('请选择配偶婚姻状况')
        return false
      }
      if (!c00268) {
        showModal('请选择配偶婚姻变动情况')
        return false
      }
      if (!c00269 && isShowC00269) {
        showModal('请选择配偶婚姻变动时间')
        return false
      }
      if (!c03601) {
        showModal('请输入残疾证号')
        return false
      } else if (!this.CheckDisability(c03601)) {
        showModal('请输入正确的残疾证号')
        return false
      }

      if (!chb0h1) {
        showModal('请选择残疾类别')
        return false
      }

      if (!chb0h2) {
        showModal('请选择残疾等级')
        return false
      }

      if (this.cardList1.length == 0) {
        showModal('请添加曾生育子女信息')
        return false
      }
      // if (cardList2.length == 0) {
      //   showModal('请添加家庭成员')
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

      const cardList1 = this.cardList1
      const cardList2 = this.cardList2

      const {
        tel, // 联系电话
        gender, // 性别
        birthday, // 出生日期
        nature, // 戶口性質
        currentAddress, // 现居地址
      } = this.basicInfo

      const {
        aac004, // 性别
        c00062, // 出生年月
        c00106, // 户口类别
        aae005, //联系电话
        c00033, //家庭地址

        c00214, // 婚姻状况
        c00253, // 婚姻变动情况
        c00251, // 婚姻变动时间
        c00254, //是否再生育

        c00262, // 配偶姓名
        c00263, //配偶性别
        c00264, //配偶出生年月
        c00265, //配偶身份证号码
        c00266, //配偶户口性质
        c00267, //配偶婚姻状况
        c00268, //配偶婚姻变动情况
        c00269, //配偶婚姻变动时间

        c03601, //二代残疾证号
        chb0h1, //残疾人类别
        chb0h2, //残疾等级 4
      } = this.projectDeclareInfo

      // 扩展字段
      const hb00BizMap = {
        aac004: gender, // 性别
        c00062: birthday, // 出生年月
        c00106: nature, // 户口类别
        aae005: tel, //联系电话
        c00033: currentAddress, //家庭地址

        c00214, // 婚姻状况
        c00253, // 婚姻变动情况
        c00251, // 婚姻变动时间
        c00254, //是否再生育

        c00262, // 配偶姓名
        c00263, //配偶性别
        c00264, //配偶出生年月
        c00265, //配偶身份证号码
        c00266, //配偶户口性质
        c00267, //配偶婚姻状况
        c00268, //配偶婚姻变动情况
        c00269, //配偶婚姻变动时间

        c03601, //二代残疾证号
        chb0h1, //残疾人类别
        chb0h2, //残疾等级 4
      }

      const hp03List = []

      cardList1.map((item) => {
        hp03List.push({
          aac003: item.name,
          aac004: item.gender,
          aac006: item.birth,
          chp036: item.own,
          chp035: item.die,
        })
      })

      cardList2.map((item) => {
        hp03List.push({
          aac003: item.name,
          aac004: item.gender,
          aac006: item.birth,
          chp035: item.die,
          chp037: item.adoption,
          chp038: item.proce,
        })
      })

      this.handleDeclareData(hb00BizMap, '1', null, hp03List)
    },
  },
  computed: {
    // 是否显示配偶婚姻变动时间
    isShowC00269() {
      const { c00268 } = this.projectDeclareInfo
      let result = false
      if (c00268 === '1') {
        result = true
      }
      return result
    },
    // 是否显示婚姻变动时间
    isShowC00251() {
      const { c00253 } = this.projectDeclareInfo
      let result = false
      if (c00253 === '1') {
        result = true
      }
      return result
    },
    c00269Ness: function () {
      return (
        this.projectDeclareInfo.c00268 &&
        (this.projectDeclareInfo.c00268 == '1' ||
          this.projectDeclareInfo.c00268 == 1)
      )
    },
  },
  watch: {
    projectDeclareInfo: {
      handler() {},
      deep: true,
    },
  },
}
</script>

<style lang="scss" scoped></style>
