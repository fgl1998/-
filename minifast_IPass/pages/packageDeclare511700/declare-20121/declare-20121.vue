<!-- 火灾补贴（民政局） -->
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
        addressFilter="1569469"
        permanentAddressLabel="申报地址"
        :permanentAddressPlaceholder="permanentAddressPlaceholder"
        isOpenOCR
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

    <!-- 申报信息 -->
    <div class="space-top-wrapper">
      <ComponentPanel title="申报信息">
        <div class="panel-content">
          <div class="cell-items">
            <div class="panel-content">
              <div class="cell-items">
                <div class="cell-item required">
                  <div class="key">户主姓名</div>
                  <div class="value">
                    <input
                      type="text"
                      v-model="projectDeclareInfo.m00003"
                      placeholder="请输入户主姓名"
                    />
                  </div>
                </div>
                <div class="cell-item required">
                  <div class="key">户主身份证号</div>
                  <div class="value">
                    <input
                      type="idcard"
                      maxlength="18"
                      v-model="projectDeclareInfo.m00004"
                      @blur="handleBlurM00004"
                      placeholder="请输入户主身份证号"
                    />
                  </div>
                </div>

                <div class="cell-item required">
                  <div class="key">户口家庭人数</div>
                  <div class="value">
                    <input
                      type="number"
                      v-model="projectDeclareInfo.m00007"
                      placeholder="请输入户口家庭人数"
                    />
                  </div>
                </div>

                <ComponentDeclarePicker
                  label="家庭户类别"
                  idName="m00062"
                  :range="codeMap.m00062"
                  placeholder="请选择家庭户类别"
                  v-model="projectDeclareInfo.m00062"
                >
                </ComponentDeclarePicker>

                <ComponentDeclarePicker
                  label="受损程度"
                  idName="m00063"
                  :range="codeMap.m00063"
                  placeholder="请选择受损程度"
                  v-model="projectDeclareInfo.m00063"
                >
                </ComponentDeclarePicker>

                <ComponentDeclarePicker
                  label="火灾原因"
                  idName="m00164"
                  :range="codeMap.m00164"
                  placeholder="请选择火灾原因"
                  v-model="projectDeclareInfo.m00164"
                >
                </ComponentDeclarePicker>

                <ComponentSelectAddressMultitype
                  label="房租具体位置"
                  placeholder="请选择或输入房租具体位置"
                  buttonName="复用申报地址"
                  :isShowBtn="renderObj.permanentAddress"
                  @clickBtn="
                    projectDeclareInfo.m00066 = basicInfo.permanentAddress
                  "
                  v-model="projectDeclareInfo.m00066"
                >
                </ComponentSelectAddressMultitype>
                <div class="cell-item required">
                  <div class="key">家庭房产数量</div>
                  <div class="value">
                    <input
                      type="number"
                      maxlength="3"
                      v-model="projectDeclareInfo.m00067"
                      placeholder="请输入家庭房产数量"
                    />
                  </div>
                </div>
                <ComponentDeclarePicker
                  label="受灾时间"
                  idName="c00028"
                  mode="date"
                  fields="day"
                  :startTime="startday"
                  :endTime="today"
                  v-model="projectDeclareInfo.m00086"
                  placeholder="请选择受灾时间"
                ></ComponentDeclarePicker>
                <div class="cell-item required disabled">
                  <div class="key">补贴金额</div>
                  <div class="value">
                    {{ projectDeclareInfo.chb0a7 || '暂无' }}
                  </div>
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

import ComponentDeclareStep from '@/components/project/ez-declare-step/ez-declare-step.vue'
import ComponentDeclare from '@/components/project/ez-declare/ez-declare.vue'
import ComponentDeclareCard from '../components/ez-declare-card/ez-declare-card.vue'
import ComponentDeclarePicker from '@/components/project/ez-declare-picker/ez-declare-picker.vue'
import ComponentSelectAddressMultitype from '@/components/project/ez-select-address-multitype/ez-select-address-multitype.vue'
import { useDeclare } from '@/mixins'

import { getIsDev, getDate } from '@/utils/get'
import { checkIDCard } from '@/utils/check'
import { getCodeListByCodeName } from '@/utils/custom-api'
import { showModal } from '@/utils/uni-api'
export default {
  name: 'pageDeclare20121',
  data() {
    return {
      permanentAddressPlaceholder: '请选择申报地址',
      // 基本信息 渲染配置
      renderObj: {
        idCard: true, // 身份证
        userName: true, // 姓名
        tel: true, // 联系电话
        permanentAddress: true, // 户籍地址
      },
      today: getDate(),
      // 自定义添加一些属性 防止双向绑定失败 例如 picker组件之类
      projectDeclareInfo: {
        m00062: '', // 家庭户类别
        aae006: '', // 户籍地址
        m00063: '', // 受损程度
        m00003: '', // 户主姓名
        m00004: '', // 户主身份证号
        m00066: '', // 房子具体位置
        m00007: '', // 户口家庭人数
        m00064: '', // 家庭成员姓名
        m00065: '', // 家庭成员身份证
        m00001: '', // 与户主关系
        m00067: '', // 家庭户房产数
        chb0a7: '', // 补贴金额
        m00164: '', // 火灾原因
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
    ComponentDeclareCard,
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
      let m00062 = [] // 家庭户类别
      let m00063 = [] // 受损程度
      let m00164 = [] // 火灾原因

      try {
        m00062 = await getCodeListByCodeName('m00062')
      } catch (err) {
        if (isDev) {
          console.log('code table m00062 error：', err)
        }
      }
      try {
        m00063 = await getCodeListByCodeName('m00063')
      } catch (err) {
        if (isDev) {
          console.log('code table m00063 error：', err)
        }
      }
      try {
        m00164 = await getCodeListByCodeName('m00164')
      } catch (err) {
        if (isDev) {
          console.log('code table m00164 error：', err)
        }
      }

      this.codeMap = {
        ...this.codeMap,
        m00062,
        m00063,
        m00164,
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
    // 捕获 cardList 不用修改
    handleChangeCardList(type, data) {
      this.cardList = [...data]
    },
    handleCheckInput() {
      const {
        m00062, // 家庭户类别
        aae006, // 户籍地址
        m00063, // 受损程度
        m00003, // 户主姓名
        m00004, // 户主身份证号
        m00066, // 房子具体位置
        m00007, // 户口家庭人数
        m00067, // 家庭户房产数
        chb0a7, // 补贴金额
        m00164, // 火灾原因
        m00086, // 受灾时间
      } = this.projectDeclareInfo
      const cardList = this.cardList
      if (!m00003) {
        showModal('请填写户主姓名')
        return false
      }
      if (!m00004) {
        showModal('请填写户主身份证号')
        return false
      } else {
        const checkResult = checkIDCard(m00004)
        if (checkResult.status === '0') {
          showModal(checkResult.msg)
          return false
        }
      }
      if (!m00007) {
        showModal('请填写户口家庭人数')
        return false
      }
      if (!m00062) {
        showModal('请选择家庭户类别')
        return false
      }
      if (!m00063) {
        showModal('请选择受损程度')
        return false
      }
      if (!m00164) {
        showModal('请选择火灾原因')
        return false
      }
      if (!m00066) {
        showModal('请选择或输入房租具体位置')
        return false
      }
      if (!m00067) {
        showModal('请填写家庭户房产数')
        return false
      }
      if (!m00086) {
        showModal('请选择受灾时间')
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

      const {
        idCard,
        userName,
        tel,
        permanentAddress, // 户籍地址
      } = this.basicInfo

      const {
        aac002, // 身份证
        aac003, // 姓名
        aae005, // 联系电话

        m00062, // 家庭户类别
        aae006, // 户籍地址
        m00063, // 受损程度
        m00003, // 户主姓名
        m00004, // 户主身份证号
        m00066, // 房租具体位置
        m00007, // 户口家庭人数
        m00064, // 家庭成员姓名
        m00065, // 家庭成员身份证
        m00001, // 与户主关系
        m00067, // 家庭户房产数
        chb0a7, // 补贴金额
        m00086, // 受灾时间
        m00164, // 火灾原因
      } = this.projectDeclareInfo

      // 扩展字段
      let hb00BizMap = {
        aac002: idCard, // 身份证
        aac003: userName, // 姓名
        aae005: tel, // 联系电话

        m00062, // 家庭户类别
        aae006: permanentAddress, // 户籍地址
        m00063, // 受损程度
        m00003, // 户主姓名
        m00004, // 户主身份证号
        m00066, // 房租具体位置
        m00007, // 户口家庭人数
        m00064, // 家庭成员姓名
        m00065, // 家庭成员身份证
        m00001, // 与户主关系
        m00067, // 家庭户房产数
        chb0a7, // 补贴金额
        m00086, // 受灾时间
        m00164, // 火灾原因
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
    momey() {
      let { m00067, m00063 } = this.projectDeclareInfo
      let chb0a7 = 0
      if (m00067 == '1') {
        if (m00063 == '2') {
          if (m00063 == '1') {
            chb0a7 = 5000 + m00007 * 500
          } else if (m00062 == '2' || m00062 == '3' || m00062 == '4') {
            chb0a7 = 3000 + m00007 * 500
          } else if (m00062 == '5') {
            chb0a7 = 2000 + m00007 * 500
          }
        } else if (m00063 == '1') {
          chb0a7 = 1000
        }
        chb0a7 = chb0a7 + 500
      }
      return chb0a7
    },
    startday() {
      if (this.today) {
        let day = this.today.split('-')
        day[0] = parseInt(day[0]) - 1
        return day.join('-')
      } else {
        return ''
      }
    },
  },
  watch: {
    momey: {
      handler(val) {
        this.projectDeclareInfo.chb0a7 = val
      },
      immediate: true,
    },
  },
}
</script>

<style lang="scss" scoped></style>
