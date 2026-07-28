<!-- 县级大学生创业指导补贴（人社局） -->
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
        isOpenOCR
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
                <div class="cell-item required">
                  <div class="key">指导活动名称</div>
                  <div class="value">
                    <input
                      type="text"
                      maxlength="12"
                      v-model="projectDeclareInfo.r00130"
                      placeholder="请输入指导活动名称"
                    />
                  </div>
                </div>
                <ComponentDeclarePicker
                  label="指导时间"
                  idName="a00027"
                  mode="date"
                  fields="day"
                  :endTime="today"
                  v-model="projectDeclareInfo.r06801"
                  placeholder="请选择指导时间"
                ></ComponentDeclarePicker>
                <div class="cell-item required">
                  <div class="key">指导对象数</div>
                  <div class="value">
                    <input
                      type="number"
                      maxlength="6"
                      v-model="projectDeclareInfo.r00131"
                      placeholder="请输入指导对象数"
                    />
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
      <ComponentPanel title="指导对象信息">
        <ComponentDeclareCard
          :renderData="cardList"
          type="20970"
          addButtonName="添加指导对象"
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
import ComponentDeclarePersonnel from '@/components/project/ez-declare-personnel/ez-declare-personnel.vue'
import ComponentDeclarePicker from '@/components/project/ez-declare-picker/ez-declare-picker.vue'

import { useDeclare } from '@/mixins'

import { getDate } from '@/utils/get'
import { showModal } from '@/utils/uni-api'
export default {
  name: 'pageDeclare20034',
  data() {
    return {
      today: getDate(),
      // 基本信息 渲染配置
      renderObj: {
        idCard: true, // 身份证
        userName: true, // 姓名
        tel: true, // 联系电话
        permanentAddress: true, // 户籍地址
      },
      // 自定义添加一些属性 防止双向绑定失败 例如 picker组件之类
      projectDeclareInfo: {
        r06801: '',
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
    // 捕获 cardList 不用修改
    handleChangeCardList(type, data) {
      this.cardList = [...data]
    },

    handleCheckInput() {
      const {
        r00130, // 指导活动
        r00131, // 指导对象数
        r06801, // 指导时间

        aae019, // 发放金额
      } = this.projectDeclareInfo
      if (!r00130) {
        showModal('请输入指导活动名称')
        return false
      }
      if (!r06801) {
        showModal('请选择指导时间')
        return false
      }

      if (!r00131) {
        showModal('请输入指导对象数')
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
        r00130, // 指导活动
        r00131, // 指导对象数
        r06801, // 指导时间

        aae019, // 发放金额
      } = this.projectDeclareInfo

      // 扩展字段
      let hb00BizMap = {
        r00130, // 指导活动
        r00131, // 指导对象数
        r06801, // 指导时间

        aae019: '', // 发放金额
      }

      const hp03List = []

      cardList.map((item) => {
        hp03List.push({
          aac003: item.name,
          aac002: item.idCard,
        })
      })

      this.handleDeclareData(hb00BizMap, '1', null, hp03List)
    },
  },
  computed: {},
  watch: {},
}
</script>

<style lang="scss" scoped></style>
