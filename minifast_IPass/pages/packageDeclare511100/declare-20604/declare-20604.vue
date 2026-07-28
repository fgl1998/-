<!-- 中职国家奖学金 -->
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
        permanentAddressLabel="就读学校"
        permanentAddressPlaceholder="请选择就读学校"
        addressFilter="186722,186725,186728,186741,186745,145452,104042,104047,104036,104045,104040"
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
    <!-- 申报信息 -->
    <div class="space-top-wrapper">
      <ComponentPanel title="申报信息">
        <div class="panel-content">
          <div class="cell-items">
            <ComponentDeclarePicker
              label="学校隶属"
              idName="j00190"
              :range="codeMap.j00190"
              rangeKey="aaa103"
              valueKey="aaa102"
              placeholder="请选择学校隶属"
              v-model="projectDeclareInfo.j00190"
            ></ComponentDeclarePicker>
            <div class="cell-item required">
              <div class="key">政治面貌</div>
              <div class="value">
                <input
                  type="text"
                  v-model="projectDeclareInfo.j00056"
                  placeholder="请输入政治面貌"
                />
              </div>
            </div>
            <ComponentDeclarePicker
              label="入学时间"
              idName="chb0g1"
              mode="date"
              fields="day"
              :endTime="new Date().getTime()"
              v-model="projectDeclareInfo.chb0g1"
              placeholder="请选择入学时间"
            ></ComponentDeclarePicker>

            <div class="cell-item required">
              <div class="key">年级</div>
              <div class="value">
                <input
                  type="text"
                  v-model="projectDeclareInfo.j00011"
                  placeholder="请输入年级"
                />
              </div>
            </div>
            <div class="cell-item required">
              <div class="key">班级</div>
              <div class="value">
                <input
                  type="text"
                  v-model="projectDeclareInfo.j00012"
                  placeholder="请输入班级"
                />
              </div>
            </div>

            <div class="cell-item required">
              <div class="key">专业名称</div>
              <div class="value">
                <input
                  type="text"
                  v-model="projectDeclareInfo.j00023"
                  placeholder="请输入专业名称"
                />
              </div>
            </div>
            <div class="cell-item required">
              <div class="key">学制</div>
              <div class="value">
                <input
                  type="text"
                  v-model="projectDeclareInfo.j00057"
                  placeholder="请输入学制"
                />
              </div>
            </div>
            <div class="cell-item required">
              <div class="key">成绩排名（名次/总人数）</div>
              <div class="value">
                <input
                  type="text"
                  v-model="projectDeclareInfo.j00154"
                  placeholder="请输入成绩排名"
                />
              </div>
            </div>
          </div>
        </div>
      </ComponentPanel>
    </div>

    <!-- 添加获奖情况 -->
    <div class="space-top-wrapper">
      <ComponentPanel title="获奖情况">
        <ComponentDeclareCard
          :renderData="cardList"
          type="20604"
          addButtonName="添加获奖情况"
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
import ComponentSelectPermanentAddress from '@/components/project/ez-select-permanent-address/ez-select-permanent-address.vue'
import ComponentSelectCurrentAddress from '@/components/project/ez-select-current-address/ez-select-current-address.vue'
import ComponentDeclareCard from '@/components/project/ez-declare-card/ez-declare-card.vue'
import ComponentDeclarePersonnel from '@/components/project/ez-declare-personnel/ez-declare-personnel.vue'
import ComponentDeclareRadio from '@/components/project/ez-declare-radio/ez-declare-radio.vue'
import ComponentDeclarePicker from '@/components/project/ez-declare-picker/ez-declare-picker.vue'

import { useDeclare } from '@/mixins'
import { useGetCurrentDate, useGetBirthdayByIDCard } from '@/hooks/common'
import { getCodeListByCodeName } from '@/utils/custom-api'
import { showModal } from '@/utils/uni-api'
export default {
  name: 'pageDeclare20604',
  data() {
    return {
      // 基本信息 渲染配置
      renderObj: {
        idCard: true, // 身份证
        userName: true, // 姓名
        tel: true, // 联系电话
        age: true, // 年龄
        gender: true, // 性别
        birthday: true, // 出生年月
        permanentAddress: true, // 就读学校
      },
      // 自定义添加一些属性 防止双向绑定失败 例如 picker组件之类
      projectDeclareInfo: {
        j00190: '',
        j00056: '',
        j00023: '',
        j00057: '',
        j00154: '',
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
  },
  mixins: [useDeclare],
  // 监听页面加载，其参数为上个页面传递的数据，参数类型为Object（用于页面传参）
  onLoad(e) {
    this.handleOnLoad(e)
  },
  methods: {
    // 获取该申报项目的所需要的码表数据
    // aaz502、aac011、dac009、aac004、aac005、aae008、yesorno 不用再次获取
    // 编写格式参考达州20033项目
    async getCodeTableCacheData() {
      let j00190 = [] // 学校隶属

      try {
        j00190 = await getCodeListByCodeName('J00190')
      } catch (err) {
        console.error('code table j00190 error：', err)
      }

      this.codeMap = {
        ...this.codeMap,
        j00190,
      }
    },
    // 捕获 cardList 不用修改
    handleChangeCardList(type, data) {
      this.cardList = [...data]
    },
    // 检测数据输入格式是否正确 须根据项目需求更改
    handleCheckInput() {
      const { j00190, j00056, j00023, j00057, j00154, chb0g1, j00011, j00012 } =
        this.projectDeclareInfo
      const cardList = this.cardList
      if (!j00190) {
        showModal('请选择学校隶属')
        return false
      }
      if (!j00056) {
        showModal('请输入政治面貌')
        return false
      }
      if (!chb0g1) {
        showModal('请选择入学时间')
        return false
      }
      if (!j00011) {
        showModal('请输入年级')
        return false
      }
      if (!j00012) {
        showModal('请输入班级')
        return false
      }
      if (!j00023) {
        showModal('请输入专业名称')
        return false
      }
      if (!j00057) {
        showModal('请输入学制')
        return false
      }
      if (!j00154) {
        showModal('请输入成绩排名')
        return false
      }
      if (cardList.length == 0) {
        showModal('请添加获奖情况')
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

      const { idCard, township } = this.basicInfo

      const { j00190, j00056, j00023, j00057, j00154, chb0g1, j00011, j00012 } =
        this.projectDeclareInfo
      const birthday = useGetBirthdayByIDCard(idCard)
      const cardList = this.cardList
      const hp02List = []

      cardList.map((item) => {
        hp02List.push({
          hp0203: item.name,
          hp0202: item.time,
          hp0204: item.company,
        })
      })
      // 扩展字段
      const hb00BizMap = {
        j00059: birthday, // 出生年月
        j00190, // 学校隶属
        j00056, // 政治面貌
        j00023, // 专业名称
        j00057, // 学制
        j00154, // 成绩排名（名次/总人数）
        chb0g1, // 入学时间
        chb017: township, // 就读学校
        j00011, // 年级
        j00012, // 班级
        chb01m: '1', // 发放类型 正常发放
        aae209: useGetCurrentDate('month', ''), // 发放期号 当前申报年月
      }
      this.handleDeclareData(hb00BizMap, '0', hp02List)
    },
  },
}
</script>

<style lang="scss" scoped></style>
