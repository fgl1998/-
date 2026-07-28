<!-- 地质灾害避险搬迁安置 自然资源和规划局 -->
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
        @changeDataByIdCardBank="handleChangeDataByIdCardBank"
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

    <!-- 申报信息 -->
    <div class="space-top-wrapper">
      <ComponentPanel title="申报信息">
        <div class="panel-content">
          <div class="cell-items">
            <div class="panel-content">
              <div class="cell-items">
                <!-- 社保卡银行类别 -->
                <div class="cell-item disabled">
                  <div class="key">社保卡银行类别</div>
                  <div class="value">
                    {{ projectDeclareInfo.aae008 || '暂无' }}
                  </div>
                </div>
                <!-- 社保卡银行卡号 -->
                <div class="cell-item disabled">
                  <div class="key">社保卡编号</div>
                  <div class="value">
                    {{ projectDeclareInfo.aae010 || '暂无' }}
                  </div>
                </div>

                <!-- 组 -->
                <div class="cell-item required">
                  <div class="key">组</div>
                  <div class="value">
                    <input
                      type="text"
                      v-model="projectDeclareInfo.chb019"
                      placeholder="请输入组"
                    />
                  </div>
                </div>

                <ComponentSelectAddressMultitype
                  label="原居住地址"
                  placeholder="请选择原居住地址"
                  :isShowBtn="renderObj.permanentAddress"
                  @clickBtn="
                    projectDeclareInfo.a00032 = basicInfo.permanentAddress
                  "
                  v-model="projectDeclareInfo.a00032"
                >
                </ComponentSelectAddressMultitype>

                <ComponentSelectAddressMultitype
                  label="搬迁后居住地址"
                  placeholder="请选择搬迁后居住地址"
                  :isShowBtn="renderObj.permanentAddress"
                  @clickBtn="
                    projectDeclareInfo.a00004 = basicInfo.permanentAddress
                  "
                  v-model="projectDeclareInfo.a00004"
                >
                </ComponentSelectAddressMultitype>

                <ComponentDeclarePicker
                  label="搬迁开始时间"
                  idName="a00020"
                  mode="date"
                  fields="day"
                  :endTime="today"
                  v-model="projectDeclareInfo.a00020"
                  placeholder="请选择您的搬迁开始时间"
                ></ComponentDeclarePicker>
                <ComponentDeclarePicker
                  v-if="projectDeclareInfo.a00020"
                  label="搬迁完成时间"
                  idName="a00021"
                  mode="date"
                  fields="day"
                  :startTime="projectDeclareInfo.a00020"
                  v-model="projectDeclareInfo.a00021"
                  placeholder="请选择您的搬迁完成时间"
                ></ComponentDeclarePicker>

                <div class="cell-item required">
                  <div class="key">家庭人数</div>
                  <div class="value">
                    <input
                      type="number"
                      maxlength="3"
                      v-model="projectDeclareInfo.a00010"
                      placeholder="请输入家庭人数"
                    />
                  </div>
                </div>
                <ComponentDeclarePicker
                  label="基础设施安置"
                  idName="a00051"
                  :range="codeMap.a00051"
                  v-model="projectDeclareInfo.a00051"
                  placeholder="请选择基础设施安置"
                ></ComponentDeclarePicker>
                <ComponentDeclarePicker
                  label="原房屋是否已拆"
                  idName="a00030"
                  :range="codeMap.yesorno"
                  v-model="projectDeclareInfo.a00030"
                  placeholder="请选择原房屋是否已拆"
                ></ComponentDeclarePicker>
                <ComponentDeclarePicker
                  label="是否已退耕复耕"
                  idName="a00031"
                  :range="codeMap.yesorno"
                  v-model="projectDeclareInfo.a00031"
                  placeholder="请选择是否已退耕复耕"
                ></ComponentDeclarePicker>
                <ComponentDeclarePicker
                  label="是否自愿搬迁"
                  idName="a00033"
                  :range="codeMap.yesorno"
                  v-model="projectDeclareInfo.a00033"
                  placeholder="请选择是否自愿搬迁"
                ></ComponentDeclarePicker>

                <div class="cell-item required disabled">
                  <div class="key">补贴金额</div>
                  <div class="value">{{ getAae019 }}元</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </ComponentPanel>
    </div>

    <!-- 家庭成员信息 -->
    <div class="space-top-wrapper">
      <ComponentPanel title="家庭成员信息">
        <ComponentDeclareCard
          :renderData="cardList"
          type="20044"
          addButtonName="添加家庭成员"
          @change="handleChangeCardList"
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
import ComponentSelectAddressMultitype from '@/components/project/ez-select-address-multitype/ez-select-address-multitype.vue'
import ComponentDeclareStep from '@/components/project/ez-declare-step/ez-declare-step.vue'
import ComponentDeclare from '@/components/project/ez-declare/ez-declare.vue'
import ComponentSelectPermanentAddress from '@/components/project/ez-select-permanent-address/ez-select-permanent-address.vue'
import ComponentSelectCurrentAddress from '@/components/project/ez-select-current-address/ez-select-current-address.vue'
import ComponentDeclareCard from '../components/ez-declare-card/ez-declare-card.vue'
import ComponentDeclarePersonnel from '@/components/project/ez-declare-personnel/ez-declare-personnel.vue'
import ComponentDeclareRadio from '@/components/project/ez-declare-radio/ez-declare-radio.vue'
import ComponentDeclarePicker from '@/components/project/ez-declare-picker/ez-declare-picker.vue'

import { useDeclare } from '@/mixins'

import { getDate, getIsDev } from '@/utils/get'
import { checkIDCard, checkPhoneNumber } from '@/utils/check'
import { getCodeListByCodeName } from '@/utils/custom-api'
import { showModal } from '@/utils/uni-api'

export default {
  name: 'pageDeclare20121',
  data() {
    return {
      today: getDate(),
      // 基本信息 渲染配置
      renderObj: {
        idCard: true, // 身份证
        userName: true, // 姓名
        tel: true, // 联系电话
        permanentAddress: true, // 户籍地址
        // SSCBankCardNumber: true, // 社保卡银行卡号
        // SSCBankCardCategory: true, // 社保卡银行卡类别
      },
      // 自定义添加一些属性 防止双向绑定失败 例如 picker组件之类
      projectDeclareInfo: {
        a00032: '',
        a00004: '',
        a00020: '',
        a00030: '',
        a0003: '',
        a00033: '',
        a00051: '',
      },
      // 卡片列表数据
      cardList: [],
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
      let aae008 = [] // 申请人当前学历
      let a00051 = [] // 基础设施安置

      try {
        aae008 = await getCodeListByCodeName('aae008')
        a00051 = await getCodeListByCodeName('a00051')
      } catch (err) {
        if (isDev) {
          console.log('code table aae008 error：', err)
        }
      }

      this.codeMap = {
        ...this.codeMap,
        aae008,
        a00051,
      }
    },
    // 捕获 cardList 不用修改
    handleChangeCardList(type, data) {
      this.cardList = [...data]
    },
    // 输入身份证获取社保卡信息
    handleChangeDataByIdCardBank(val) {
      let aae008CodeArr = this.codeMap.aae008
      let aaf002desc = ''
      let { aaf002, aac203 } = val
      for (let i = 0, len = aae008CodeArr.length; i < len; i++) {
        const item = aae008CodeArr[i]
        if (item.aaa102 === aaf002) {
          aaf002desc = item.aaa103
          break
        }
      }
      this.projectDeclareInfo = {
        ...this.projectDeclareInfo,
        aae008: aaf002desc, // 社保卡银行类别
        aae010: aac203, // 社保卡银行账号
      }
    },
    handleCheckInput() {
      const {
        a00032, // 原居住地址
        a00004, // 搬迁后居住地址
        a00020, // 搬迁开始时间
        a00021, // 搬迁完成时间
        a00051,
        chb019, //组

        aae008, // 社保卡银行类别
        aae010, // 社保卡银行账号

        aae019, // 发放金额
        a00010, // 家庭人口数
        a00030, // 房屋是否已拆
        a00031, // 是否退耕复耕
        a00033, // 是否自愿拆迁
      } = this.projectDeclareInfo
      const cardList = this.cardList
      if (!chb019) {
        showModal('请输入组（社）')
        return false
      }

      if (!a00032) {
        showModal('请选择或输入原居住地址')
        return false
      }
      if (!a00004) {
        showModal('请选择或输入搬迁后居住地址')
        return false
      }
      if (!a00020) {
        showModal('请选择搬迁开始时间')
        return false
      }
      if (!a00021) {
        showModal('请选择搬迁完成时间')
        return false
      }
      if (!a00010) {
        showModal('请输入家庭人口数')
        return false
      }
      if (!a00051) {
        showModal('请选择基础设施安置')
        return false
      }
      if (!a00030) {
        showModal('请选择房屋是否已拆')
        return false
      }
      if (!a00031) {
        showModal('请选择是否退耕复耕')
        return false
      }
      if (!a00033) {
        showModal('请选择是否自愿拆迁')
        return false
      }
      if (a00030 != '1' || a00031 != '1' || a00033 != '1') {
        showModal(
          '您选择的房屋是否已拆、是否已经退耕复耕和是否自愿搬迁不满足申报条件，请重新选择！'
        )
        return false
      }
      if (cardList.length == 0) {
        showModal('请添加家庭成员')
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
      const getAae019 = this.getAae019

      const {
        SSCBankCardNumber, // 社保卡银行卡号
        SSCBankCardCategory, // 社保卡银行卡类别
      } = this.basicInfo

      const {
        a00032, // 原居住地址
        a00004, // 搬迁后居住地址
        a00020, // 搬迁开始时间
        a00021, // 搬迁完成时间
        chb019, //组

        aae008, // 社保卡银行类别
        aae010, // 社保卡银行账号

        aae019, // 发放金额
        a00051, //
        a00010, // 家庭人口数
        a00030, // 房屋是否已拆
        a00031, // 是否退耕复耕
        a00033, // 是否自愿拆迁
      } = this.projectDeclareInfo

      // 扩展字段
      let hb00BizMap = {
        a00032, // 原居住地址
        a00004, // 搬迁后居住地址
        a00020, // 搬迁开始时间
        a00021, // 搬迁完成时间
        chb019, //组

        aae008, // 社保卡银行类别
        aae010, // 社保卡银行账号

        aae019: getAae019, // 发放金额
        a00051,
        a00010, // 家庭人口数
        a00030, // 房屋是否已拆
        a00031, // 是否退耕复耕
        a00033, // 是否自愿拆迁
      }

      const hp03List = []

      cardList.map((item) => {
        hp03List.push({
          aac003: item.name,
          aac002: item.idCard,
          chp031: item.relationship,
        })
      })

      this.handleDeclareData(hb00BizMap, '1', null, hp03List)
    },
  },
  computed: {
    getAae019() {
      let str = 0
      let { cac100 } = this.personnelInfo
      let { a00051 } = this.projectDeclareInfo
      if (cac100 == '429') {
        switch (a00051) {
          case '1':
            str = 35000
            break
          case '2':
            str = 25000
            break
          case '3':
            str = 35000
            break
          default:
            str = 0
            break
        }
      }
      if (cac100 == '1163') {
        switch (a00051) {
          case '1':
            str = 40000
            break
          case '2':
            str = 30000
            break
          case '3':
            str = 40000
            break
          default:
            str = 0
            break
        }
      }
      return str
    },
  },
  watch: {
    userInfo: {
      handler(val) {
        if (val && val.user_id) {
          let { aac203, aaf002Desc } = val
          this.projectDeclareInfo = {
            ...this.projectDeclareInfo,
            aae008: aaf002Desc, // 社保卡银行类别
            aae010: aac203, // 社保卡银行账号
          }
        }
      },
      immediate: true,
    },
    // 监听申报类别改变
    declareType: {
      handler(val) {
        if (val && val == '01') {
          let { aac203, aaf002Desc } = this.userInfo
          this.projectDeclareInfo = {
            ...this.projectDeclareInfo,
            aae008: aaf002Desc, // 社保卡银行类别
            aae010: aac203, // 社保卡银行账号
          }
        } else {
          this.projectDeclareInfo = {
            ...this.projectDeclareInfo,
            aae008: '', // 社保卡银行类别
            aae010: '', // 社保卡银行账号
          }
        }
      },
      immediate: true,
    },
  },
}
</script>

<style lang="scss" scoped></style>
