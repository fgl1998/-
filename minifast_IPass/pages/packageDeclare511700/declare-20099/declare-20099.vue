<!-- 新型职业农民参加城镇职工养老保险补助 -->
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
        :projectName="chi031_desc"
        permanentAddressLabel="申报地址"
        permanentAddressPlaceholder="请选择申报地址"
        addressFilter="1569457"
        @changeDeclareType="handleChangeDeclareType"
        @changeBasicInfo="handleChangeBasicInfo"
        @changeCodeMap="handleChangeCodeMap"
        @changeAgentInfo="handleChangeAgentInfo"
        @changeDataByIdCard="handleChangeDataByIdCard">
      </ComponentDeclare>
    </div>
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
            <ComponentSelectAddressMultitype
              label="农场地址"
              placeholder="请选择或输入农场地址"
              buttonName="复用申报地址"
              :isShowBtn="renderObj.permanentAddress"
              @clickBtn="projectDeclareInfo.n00061 = basicInfo.permanentAddress"
              v-model="projectDeclareInfo.n00061">
            </ComponentSelectAddressMultitype>

            <ComponentDeclarePicker
              label="申报年度"
              mode="date"
              fields="year"
              startTime="2019"
              :endTime="today_y"
              placeholder="请选择申报年度"
              v-model="projectDeclareInfo.r00016"></ComponentDeclarePicker>

            <div class="cell-item required">
              <div class="key">农场名称</div>
              <div class="value">
                <input
                  type="text"
                  v-model="projectDeclareInfo.n00085"
                  placeholder="请输入农场名称" />
              </div>
            </div>

            <div class="cell-item">
              <div class="key">当年社保缴纳金额</div>
              <div class="value">
                <input
                  type="digit"
                  maxlength="15"
                  v-model="projectDeclareInfo.n00063"
                  placeholder="请输入缴纳金额" />
              </div>
            </div>
            <div class="cell-item">
              <div class="key">当年居保缴纳金额</div>
              <div class="value">
                <input
                  type="digit"
                  maxlength="15"
                  v-model="projectDeclareInfo.chb0b2009901"
                  placeholder="请输入缴纳金额" />
              </div>
            </div>
            <div class="cell-item">
              <div class="key">当年医保缴纳金额</div>
              <div class="value">
                <input
                  type="digit"
                  maxlength="15"
                  v-model="projectDeclareInfo.chb0b2009902"
                  placeholder="请输入缴纳金额" />
              </div>
            </div>
            <div class="cell-item">
              <div class="key">当年农业保险缴纳金额</div>
              <div class="value">
                <input
                  type="digit"
                  maxlength="15"
                  v-model="projectDeclareInfo.chb0b2009904"
                  placeholder="请输入缴纳金额" />
              </div>
            </div>
            <div class="cell-item">
              <div class="key">当年雇主责任保险缴纳金额</div>
              <div class="value">
                <input
                  type="digit"
                  maxlength="15"
                  v-model="projectDeclareInfo.chb0b2009903"
                  placeholder="请输入金额" />
              </div>
            </div>
          </div>
        </div>
      </ComponentPanel>
    </div>

    <div class="space-top-wrapper">
      <ComponentPanel title="农产品信息">
        <ComponentDeclareCard
          :renderData="cardList"
          type="20106"
          addButtonName="添加农产品"
          @change="handleChangeCardList"></ComponentDeclareCard>
      </ComponentPanel>
    </div>

    <!-- end  在以上代码中根据项目需求更改-->
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
import { useDeclare } from '@/mixins'

import { useGetCurrentDate } from '@/hooks/common'
import { showModal } from '@/utils/uni-api'

export default {
  name: 'pageDeclare20099',
  data() {
    return {
      renderObj: {
        idCard: true, // 身份证
        userName: true, // 姓名
        tel: true, // 联系电话
        education: true, // 学历
        permanentAddress: true, // 户籍地址
        age: true, // 年龄
        gender: true, // 性别
      },
      today_y: useGetCurrentDate('year'),
      // 申报信息
      projectDeclareInfo: {
        n23901: 10,
        aae006: '',
        n00061: '',
        chb0b2009901: '',
        chb0b2009902: '',
        chb0b2009903: '',
        chb0b2009904: '',
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
    async getCodeTableCacheData() {},
    // 检测数据输入格式是否正确 须根据项目需求修改
    handleCheckInput() {
      const {
        n00061, // 农场地址
        n00063, // 当年缴纳社保金
        n00085, // 农场名称
        r00016, // 申报年度
        chb0b2009901,
        chb0b2009902,
        chb0b2009903,
        chb0b2009904,
      } = this.projectDeclareInfo
      const cardList = this.cardList
      if (!n00061) {
        showModal('请选择或输入农场地址')
        return false
      }

      if (!r00016) {
        showModal('请输入申报年度')
        return false
      }
      if (!n00085) {
        showModal('请输入农场名称')
        return false
      }

      if (!n00063 && !chb0b2009901 && !chb0b2009902 && !chb0b2009903 && !chb0b2009904) {
        showModal('至少要填写一个缴纳金额')
        return false
      }

      if (n00063 && chb0b2009901) {
        showModal('当年社保缴纳金额和当年居保缴费金额只能填写其中一个，请重新输入！')
        return false
      }

      if (cardList.length == 0) {
        showModal('请添加农产品')
        return false
      }

      return true
    },
    // 捕获 cardList 不用修改
    handleChangeCardList(type, data) {
      if (type === '20044') {
      } else {
        this.cardList = [...data]
      }
    },
    // 下一步 须根据项目需求修改
    handleJumpNextStep() {
      if (!this.handleCheckComponentInput()) {
        return
      }
      if (!this.handleCheckInput()) {
        return
      }
      const cardList = this.cardList
      const {
        age, // 年龄
        gender, // 性别
        education, // 学历
      } = this.basicInfo
      const {
        n00061, // 农场地址
        n00063, // 当年缴纳社保金
        n00085, // 农场名称
        r00016, // 申报年度
        chb0b2009901,
        chb0b2009902,
        chb0b2009903,
        chb0b2009904,
      } = this.projectDeclareInfo

      // 扩展字段
      let hb00BizMap = {
        n00061, // 农场地址
        n00062: education, // 学历
        n00063, // 当年缴纳社保金
        n00085, // 农场名称
        r00016, // 申报年度
        aac004: gender, // 性别
        chb00l: age, // 年龄
        chb0b2009901,
        chb0b2009902,
        chb0b2009903,
        chb0b2009904,
      }

      const hp02List = []
      cardList.map((item) => {
        hp02List.push({
          chp02e: item.type,
          chp02f: item.botany || item.breed,
          chp02g:
            item.n00068 ||
            item.n00069 ||
            item.n00070 ||
            item.n00071 ||
            item.n00072 ||
            item.n00073 ||
            item.n00074 ||
            item.n00075,
        })
      })

      this.handleDeclareData(hb00BizMap, '1', hp02List)
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
