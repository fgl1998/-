<!-- 育儿补贴金（卫生健康委） -->
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
        @changeDataByIdCard="handleChangeDataByIdCard">
      </ComponentDeclare>
    </div>

    <!-- start 需要修改的地方开始 在以下代码中根据项目需求更改 上面代码勿动 -->
    <div class="personnel-type-wrapper space-top-wrapper">
      <ComponentDeclarePersonnel
        :renderData="personnelList"
        :isOpenCategoryNotes="true"
        @change="handleChangePersonnelInfo"></ComponentDeclarePersonnel>
    </div>

    <!-- 申报信息 -->
    <div class="space-top-wrapper">
      <ComponentPanel title="申报信息">
        <div class="panel-content">
          <div class="cell-items">
            <ComponentDeclarePicker
              idName="w00089"
              label="婚姻状况"
              :range="codeMap.w00089"
              placeholder="请选择婚姻状况"
              v-model="projectDeclareInfo.w00089"></ComponentDeclarePicker>
            <div class="cell-item required">
              <div class="key">配偶姓名</div>
              <div class="value">
                <input type="text" v-model="projectDeclareInfo.w03006" placeholder="请输入配偶姓名" />
              </div>
            </div>

            <div class="cell-item required">
              <div class="key">配偶身份证号码</div>
              <div class="value">
                <input
                  type="idcard"
                  maxlength="18"
                  @blur="handleBlur01"
                  v-model="projectDeclareInfo.w00038"
                  placeholder="请输入配偶身份证号码" />
              </div>
            </div>
            <ComponentSelectPermanentAddress
              label="配偶社保(医保)所在地"
              placeholder="请选择或输入配偶社保(医保)所在地"
              level="1"
              v-model="projectDeclareInfo.w00093">
            </ComponentSelectPermanentAddress>
            <div class="cell-item required" v-if="personnelInfo.cac100 == '541'">
              <div class="key">子女人数</div>
              <div class="value">
                <input type="number" maxlength="2" v-model="projectDeclareInfo.w00085" placeholder="请输入子女人数" />
              </div>
            </div>
            <div class="cell-item required">
              <div class="key">享受补贴子女姓名</div>
              <div class="value">
                <input type="text" v-model="projectDeclareInfo.w00086" placeholder="请输入姓名" />
              </div>
            </div>
            <div class="cell-item wrap-220 required">
              <div class="key">享受补贴子女身份证号码</div>
              <div class="value">
                <input
                  type="idcard"
                  maxlength="18"
                  @blur="handleBlur02"
                  v-model="projectDeclareInfo.w00087"
                  placeholder="请输入身份证号码" />
              </div>
            </div>

            <ComponentSelectAddressMultitype
              label="享受补贴子女户籍地址"
              placeholder="请选择或输入享受补贴子女户籍地址"
              v-model="projectDeclareInfo.w00088"
              :isShowBtn="false">
            </ComponentSelectAddressMultitype>

            <ComponentDeclarePicker
              label="开始享受年月"
              idName="aae310"
              mode="date"
              fields="month"
              placeholder="请选择开始享受年月"
              :startTime="today"
              v-model="projectDeclareInfo.aae310"></ComponentDeclarePicker>
          </div>
        </div>
      </ComponentPanel>
    </div>

    <div class="space-top-wrapper">
      <ComponentPanel title="其他子女成员">
        <ComponentDeclareCard
          :renderData="cardList"
          type="20407"
          addButtonName="添加其他子女成员"
          @change="handleChangeCardList"></ComponentDeclareCard>
      </ComponentPanel>
    </div>

    <!-- end  需要修改的地方结束 在以下代码中根据项目需求更改 下面代码勿动-->
    <div class="button-wrapper">
      <ComponentButton @click="handleJumpNextStep" name="下一步" type="primary"></ComponentButton>
    </div>
  </view>
</template>

<script>
import ComponentButton from '@/components/common/ez-button/ez-button.vue'
import ComponentPanel from '@/components/common/ez-panel/ez-panel.vue'

import ComponentDeclareStep from '@/components/project/ez-declare-step/ez-declare-step.vue'
import ComponentDeclare from '@/components/project/ez-declare/ez-declare.vue'
import ComponentDeclareCard from '../components/ez-declare-card/ez-declare-card.vue'
import ComponentDeclarePersonnel from '@/components/project/ez-declare-personnel/ez-declare-personnel.vue'
import ComponentDeclarePicker from '@/components/project/ez-declare-picker/ez-declare-picker.vue'
import ComponentSelectAddressMultitype from '@/components/project/ez-select-address-multitype/ez-select-address-multitype.vue'
import ComponentSelectPermanentAddress from '@/components/project/ez-select-permanent-address/ez-select-permanent-address.vue'

import { useDeclare } from '@/mixins'

import { getIsDev, getDate } from '@/utils/get'
import { checkIDCard } from '@/utils/check'
import { getCodeListByCodeName } from '@/utils/custom-api'
import { showModal } from '@/utils/uni-api'
export default {
  name: 'pageDeclare20407',
  data() {
    return {
      // 基本信息 渲染配置
      renderObj: {
        idCard: true, // 身份证
        userName: true, // 姓名
        tel: true, // 联系电话
        gender: true, // 性别
        permanentAddress: true, // 户籍地址
        nation: true // 民族
      },
      today_m: getDate('month'),
      // 自定义添加一些属性 防止双向绑定失败 例如 picker组件之类
      projectDeclareInfo: {
        w00088: '', //户籍地址
        w00093: '',
        w00089: ''
      },
      // 卡片列表数据
      cardList: []
    }
  },
  components: {
    ComponentButton,
    ComponentPanel,
    ComponentDeclare,
    ComponentDeclareStep,
    ComponentDeclareCard,
    ComponentDeclarePersonnel,
    ComponentDeclarePicker,
    ComponentSelectAddressMultitype,
    ComponentSelectPermanentAddress
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
    // 捕获 cardList 不用修改
    handleChangeCardList(type, data) {
      this.cardList = [...data]
    },
    // 身份证号 失去焦点监听
    handleBlur01(e) {
      const { value } = e.target
      const checkResult = checkIDCard(value, '配偶身份证号码')
      if (checkResult.status === '0') {
        showModal(checkResult.msg)
      }
    },
    // 身份证号 失去焦点监听
    handleBlur02(e) {
      const { value } = e.target
      const checkResult = checkIDCard(value, '享受补贴子女身份证号码')
      if (checkResult.status === '0') {
        showModal(checkResult.msg)
      }
    },
    // 获取该申报项目的所需要的码表数据
    // aaz502、aac011、dac009、aac004、aac005、aae008、yesorno 不用再次获取
    // 编写格式参考达州20033项目
    async getCodeTableCacheData() {
      const isDev = getIsDev() // 当前环境是否是开发环境
      let w00089 = [] // 婚姻状况

      try {
        w00089 = await getCodeListByCodeName('w00089')
      } catch (err) {
        if (isDev) {
          console.log('code table w00089 error：', err)
        }
      }

      this.codeMap = {
        ...this.codeMap,
        w00089
      }
    },
    // 检测数据输入格式是否正确 须根据项目需求更改
    handleCheckInput() {
      const {
        w03006, // 配偶姓名
        w00038, // 配偶身份证号
        w00085, // 子女人数
        w00086, // 享受补贴子女姓名
        w00087, // 享受补贴子女身份证号
        w00088, // 享受补贴子女户籍地址
        aae310, // 开始享受年月
        w00089, // 婚姻状况
        w00093 // 配偶就业地址
      } = this.projectDeclareInfo

      const cardList = this.cardList
      if (!w00089) {
        showModal('请选择婚姻状况')
        return false
      }
      if (!w03006) {
        showModal('请输入配偶姓名')
        return false
      }

      if (!w00038) {
        showModal('请输入配偶身份证号')
        return false
      } else {
        const checkResult = checkIDCard(w00038, '配偶身份证号')
        if (checkResult.status === '0') {
          showModal(checkResult.msg)
          return false
        }
      }
      if (!w00093) {
        showModal('请选择或输入配偶社保(医保)所在地')
        return false
      }
      if (!w00085 && this.personnelInfo.cac100 == '541') {
        showModal('请输入子女人数')
        return false
      }
      if (!w00086) {
        showModal('请输入享受补贴子女姓名')
        return false
      }

      if (!w00087) {
        showModal('请输入享受补贴子女身份证号')
        return false
      } else {
        const checkResult = checkIDCard(w00087, '享受补贴子女身份证号')
        if (checkResult.status === '0') {
          showModal(checkResult.msg)
          return false
        }
      }

      if (!w00088) {
        showModal('请选择或输入享受补贴子女户籍地址')
        return false
      }

      if (!aae310) {
        showModal('请选择开始享受年月')
        return false
      }

      if (cardList.length == 0) {
        showModal('请添加其他子女')
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
      const cardList = this.cardList
      const {
        permanentAddress, // 户籍地址
        nation, // 民族
        gender //性别
      } = this.basicInfo

      const {
        w03006, // 配偶姓名
        w00038, // 配偶身份证号
        w00085, // 子女人数
        w00086, // 享受补贴子女姓名
        w00087, // 享受补贴子女身份证号
        w00088, // 享受补贴子女户籍地址
        aae310, // 开始享受年月
        w00089, // 婚姻状况
        w00093 // 配偶就业地址
      } = this.projectDeclareInfo
      console.log(typeof w00089, w00089, '婚姻状况')
      // 扩展字段
      const hb00BizMap = {
        w03006, // 配偶姓名
        w00038, // 配偶身份证号
        w00085: w00085 || 2, // 子女人数
        w00086, // 享受补贴子女姓名
        w00087, // 享受补贴子女身份证号
        w00088, // 享受补贴子女户籍地址
        w00069: permanentAddress, // 户籍地址
        aae310: parseInt(aae310.replace('-', '')), // 开始享受年月
        w00089,
        w00093, // 配偶就业地址
        aac005: nation, //民族
        aac004: gender //性别
      }
      let hp03List = []
      cardList.map((item) => {
        hp03List.push({
          aac003: item.name,
          aac002: item.idCard
        })
      })
      this.handleDeclareData(hb00BizMap, '1', null, hp03List)
    }
  },
  // computed: {},
  computed: {
    numcheck() {
      let res = {}
      if (this.cardList && this.cardList.length > 1) {
        this.personnelList = this.personnelList.map((item) => {
          res = Object.assign(item, { checked: false })
          if (item.cac100 == '541') {
            res = Object.assign(item, { checked: true })
            this.personnelInfo = res
          }
          return res
        })
      }
      return res
    },
    // 限定下月开始
    today() {
      let res = `${parseInt(this.today_m.replace('-', '')) + 1}`
      var newStr = res.slice(0, 4) + '-' + res.slice(4)
      return newStr
    }
  }
}
</script>

<style lang="scss" scoped></style>
