<!-- 城镇住房保障家庭租赁补贴资金（房管局） -->
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
        :initData="initBasicInfo"
        permanentAddressLabel="申报地址"
        permanentAddressPlaceholder="请选择申报地址"
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

    <!-- 申报信息 -->
    <div class="space-top-wrapper">
      <ComponentPanel title="申报信息">
        <div class="panel-content">
          <div class="cell-items">
            <ComponentSelectAddressMultitype
              label="户籍地址"
              :isShowBtn="false"
              placeholder="请输入或选择户籍地址"
              v-model="projectDeclareInfo.aae006"
            ></ComponentSelectAddressMultitype>
            <ComponentSelectAddressMultitype
              label="现居地址"
              :isShowBtn="true"
              placeholder="请输入或选择现居地址"
              @clickBtn="projectDeclareInfo.x00009 = projectDeclareInfo.aae006"
              v-model="projectDeclareInfo.x00009"
            ></ComponentSelectAddressMultitype>
            <div class="cell-item required">
              <div class="key">家庭人数</div>
              <div class="value">
                <input
                  type="number"
                  maxlength="3"
                  v-model="projectDeclareInfo.x00012"
                  placeholder="请输入家庭人数"
                />
              </div>
            </div>
            <ComponentDeclarePicker
              label="婚姻情况"
              idName="x00024"
              :range="codeMap.x00024"
              placeholder="请选择婚姻情况"
              v-model="projectDeclareInfo.x00024"
            ></ComponentDeclarePicker>
            <ComponentDeclarePicker
              label="健康状况"
              idName="x00025"
              :range="codeMap.x00025"
              placeholder="请选择健康状况"
              v-model="projectDeclareInfo.x00025"
            ></ComponentDeclarePicker>
            <ComponentDeclarePicker
              label="从业行业"
              idName="x00026"
              :range="codeMap.x00026"
              placeholder="请选择从业行业"
              v-model="projectDeclareInfo.x00026"
            ></ComponentDeclarePicker>
            <ComponentDeclarePicker
              label="租房开始时间"
              mode="date"
              placeholder="请选择租房开始时间"
              v-model="projectDeclareInfo.x00010"
            ></ComponentDeclarePicker>
            <ComponentDeclarePicker
              label="租房结束时间"
              mode="date"
              :startTime="projectDeclareInfo.x00010"
              placeholder="请选择租房结束时间"
              v-model="projectDeclareInfo.x00011"
            ></ComponentDeclarePicker>
            <ComponentDeclarePicker
              label="补贴开始享受时间"
              mode="date"
              :startTime="today_m"
              fields="month"
              placeholder="请选择时间"
              v-model="projectDeclareInfo.aae209"
            ></ComponentDeclarePicker>
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

    <!-- end  在以上代码中根据项目需求更改-->
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
import ComponentDeclarePersonnel from '@/components/project/ez-declare-personnel/ez-declare-personnel.vue'
import ComponentDeclarePicker from '@/components/project/ez-declare-picker/ez-declare-picker.vue'
import ComponentSelectAddressMultitype from '@/components/project/ez-select-address-multitype/ez-select-address-multitype.vue'

import { mapGetters } from 'vuex'

import { useDeclare } from '@/mixins'
import { showModal, showLoading, hideLoading } from '@/utils/uni-api'
import { requestB029 } from '@/service/api'
import { getCodeListByCodeName } from '@/utils/custom-api'
import { getDate, getAge } from '@/utils/get'
import { EDIT_SUBSIDY_INFO, UPDATE_EDIT_SUBSIDY_INFO } from '@/store/constants'

export default {
  name: 'pageDeclare20072',
  data() {
    return {
      // 基本信息 渲染配置
      renderObj: {
        idCard: true, // 身份证
        userName: true, // 姓名
        tel: true, // 联系电话
        gender: true, // 性别
        age: true, // 年龄
        nation: true, // 民族
        permanentAddress: true, // 户籍地址
      },
      // 自定义添加一些属性 防止双向绑定失败 例如 picker组件之类
      projectDeclareInfo: {
        aae209: '', // 补贴开始享受时间
        aae006: '', // 户籍地址
        x00009: '', // 现居住地址
        x00010: '', // 租房开始时间
        x00011: '', // 租房结束时间
        x00012: '', // 家庭人数
        x00024: '', // 婚姻情况
        x00025: '', // 健康状况
        x00026: '', // 从业行业
      },
      // 卡片列表数据
      cardList: [],
      today_m: getDate('month'),
      isEditDeclareInfo: false, // 当前页面状态是否为修改申报信息
      initBasicInfo: null, // 初始化基本信息
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
    const { type, chb000, aae100 } = e
    // 编辑
    if (type && type === 'edit') {
      showLoading()
      this.isEditDeclareInfo = true
      requestB029(chb000, aae100, false)
        .then((res) => {
          this.setDeclareInfo(res, e)
        })
        .catch((err) => {
          hideLoading()
        })
    } else {
      this.handleOnLoad(e)
    }
  },
  // 监听页面初次渲染完成
  onReady() {},
  // 监听页面显示
  onShow() {},
  // 监听页面隐藏
  onHide() {},
  methods: {
    // 设置申报信息
    setDeclareInfo(data, e) {
      try {
        const { hb00BizMap, lists } = data
        const { chb06gList, chb0ggList, hp03List, hp02List, hi21List } = lists

        // const personnelInfo = { ...this.personnelInfo }

        // 上传的材料
        const hi21List_list = hi21List.list
        this.$store.commit(UPDATE_EDIT_SUBSIDY_INFO, {
          ...this.editSubsidyInfo,
          hi21List: hi21List_list,
        })

        // // 家庭成员信息
        const hp03List_list = hp03List.list

        const {
          aac002,
          aac003,
          aac004, // 性别
          aac004Desc,
          aac005, // 民族
          aac005Desc,
          aae005, // 电话

          chb015,
          chb015Desc,
          chb017,
          chb017Desc,
          chb018,
          chb018Desc,

          aae209, // 补贴开始享受时间
          aae006, // 户籍地址
          x00009, // 现居住地址
          x00010, // 租房开始时间
          x00011, // 租房结束时间
          x00012, // 家庭人数
          x00024, // 婚姻情况
          x00025, // 健康状况
          x00026, // 从业行业

          aka131, // 人员类别
        } = hb00BizMap

        this.aka131 = aka131
        // // ===== 基本信息设置 start ======
        this.initBasicInfo = {
          userName: aac003,
          tel: aae005,
          idCard: aac002,
          age: getAge(aac002),
          gender: aac004,
          nation: aac005,
          nation_desc: aac005Desc,
          district: chb015, // 区县编码
          township: chb017, // 乡镇编码
          village: chb018, // 村编码
          permanentAddress: chb015Desc + '-' + chb017Desc + '-' + chb018Desc,
        }
        // // ===== 基本信息设置 end ======

        // // ===== 家庭成员信息 start ======
        let familyMemberList = []

        hp03List_list.map((item, index) => {
          var obj = {
            id: index,
            name: item.aac003, // 姓名
            idCard: item.aac002,
            relationship: '',
            relationship_desc: item.chp031,
          }
          familyMemberList.push(obj)
        })
        this.cardList = [...familyMemberList]
        // // ===== 家庭成员信息 end ======

        // // ===== 申报信息 start ======
        let projectDeclareInfo = {
          aae209: aae209.substr(0, 4) + '-' + aae209.substr(4, 6), // 补贴开始享受时间
          aae006, // 户籍地址
          x00009, // 现居住地址
          x00010, // 租房开始时间
          x00011, // 租房结束时间
          x00012, // 家庭人数
          x00024, // 婚姻情况
          x00025, // 健康状况
          x00026, // 从业行业
        }

        this.projectDeclareInfo = {
          ...this.projectDeclareInfo,
          ...projectDeclareInfo,
        }

        // ===== 申报信息 end ======
        hideLoading()

        this.handleOnLoad(e)
      } catch (err) {
        console.error(err)
      }
    },

    async getCodeTableCacheData() {
      let x00024 = [] // 婚姻状况
      let x00025 = [] // 健康状况
      let x00026 = [] // 从业行业
      try {
        x00024 = await getCodeListByCodeName('x00024')
      } catch (err) {
        console.error('code table x00024 error：', err)
      }
      try {
        x00025 = await getCodeListByCodeName('x00025')
      } catch (err) {
        console.error('code table x00025 error：', err)
      }
      try {
        x00026 = await getCodeListByCodeName('x00026')
      } catch (err) {
        console.error('code table x00026 error：', err)
      }

      this.codeMap = {
        ...this.codeMap,
        x00024,
        x00026,
        x00025,
      }
    },

    // 捕获 cardList 不用修改
    handleChangeCardList(type, data) {
      this.cardList = [...data]
    },

    // 检测数据输入格式是否正确 须根据项目需求修改
    handleCheckInput() {
      const {
        aae006,
        x00009, // 现居住地址
        x00010, // 租房开始时间
        x00011, // 租房结束时间
        x00012, // 家庭人口总数
        x00024, // 婚姻状况
        x00026, // 从业行业
        x00025, // 健康状况
        aae209, // 享受补贴开始时间
      } = this.projectDeclareInfo
      const cardList = this.cardList
      if (!aae006) {
        showModal('请输入或选择户籍地址')
        return false
      }
      if (!x00009) {
        showModal('请输入或选择现居地址')
        return false
      }
      if (!x00012) {
        showModal('请输入家庭人口总数')
        return false
      }
      if (!x00010) {
        showModal('请选择租房开始时间')
        return false
      }
      if (!x00011) {
        showModal('请选择租房结束时间')
        return false
      }
      if (!x00024) {
        showModal('请选择婚姻状况')
        return false
      }
      if (!x00025) {
        showModal('请选择健康状况')
        return false
      }
      if (!x00026) {
        showModal('请选择从业行业')
        return false
      }
      if (!aae209) {
        showModal('享受补贴开始时间')
        return false
      }
      if (!this.cardList || this.cardList == 0) {
        showModal('请添加家庭成员')
        return false
      }
      return true
    },

    // 下一步 须根据项目需求修改
    handleJumpNextStep() {
      if (!this.handleCheckComponentInput()) {
        return
      }
      if (!this.handleCheckInput()) {
        return
      }
      const { nation } = this.basicInfo
      const cardList = this.cardList
      const {
        aae006,
        x00009, // 现居住地址
        x00010, // 租房开始时间
        x00011, // 租房结束时间
        x00012, // 家庭人口总数
        aac005, // 民族
        x00024, // 婚姻状况
        x00026, // 从业行业
        x00025, // 健康状况
        aae209, // 享受补贴开始时间
      } = this.projectDeclareInfo
      // 扩展字段
      let hb00BizMap = {
        aae006,
        x00009, // 现居住地址
        x00010, // 租房开始时间
        x00011, // 租房结束时间
        x00012, // 家庭人口总数
        aac005: nation,
        x00024, // 婚姻状况
        x00026, // 从业行业
        x00025, // 健康状况
        aae209: aae209.replace('-', ''), // 享受补贴开始时间
      }
      const hp03List = []
      cardList.map((item) => {
        hp03List.push({
          aac003: item.name,
          aac002: item.idCard,
          chp031: item.relationship_desc,
        })
      })
      this.handleDeclareData(hb00BizMap, '1', null, hp03List)
    },
  },
  computed: {
    ...mapGetters([EDIT_SUBSIDY_INFO]),
  },
  watch: {},
}
</script>

<style lang="scss" scoped></style>
