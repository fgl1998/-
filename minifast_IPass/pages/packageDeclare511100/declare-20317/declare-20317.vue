<!-- 高校毕业生艰苦边远地区基层就业学费奖补 -->
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
            <div class="cell-item required">
              <div class="key">毕业院校</div>
              <div class="value">
                <input
                  type="text"
                  v-model="projectDeclareInfo.j00051"
                  placeholder="请输入毕业院校"
                />
              </div>
            </div>
            <ComponentDeclarePicker
              label="毕业时间"
              idName="j00077"
              mode="date"
              fields="day"
              :endTime="today_d"
              v-model="projectDeclareInfo.j00077"
              placeholder="请选择毕业时间"
            ></ComponentDeclarePicker>
            <ComponentDeclarePicker
              label="学历"
              idName="j00101"
              :range="codeMap.j00101"
              rangeKey="aaa103"
              valueKey="aaa102"
              placeholder="请选择学历"
              v-model="projectDeclareInfo.j00101"
            ></ComponentDeclarePicker>
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
              <div class="key">工作单位</div>
              <div class="value">
                <input
                  type="text"
                  v-model="projectDeclareInfo.j00060"
                  placeholder="请输入工作单位"
                />
              </div>
            </div>
            <div class="cell-item required">
              <div class="key">工作地点</div>
              <div class="value">
                <input
                  type="text"
                  v-model="projectDeclareInfo.j00062"
                  placeholder="请输入工作地点"
                />
              </div>
            </div>
            <div class="cell-item required">
              <div class="key">工作单位联系电话</div>
              <div class="value">
                <input
                  type="tel"
                  v-model="projectDeclareInfo.j00068"
                  placeholder="请输入工作单位联系电话"
                />
              </div>
            </div>
            <div class="cell-item required">
              <div class="key">学历明细</div>
              <div class="value">
                <input
                  type="text"
                  v-model="projectDeclareInfo.j00137"
                  placeholder="请输入学历明细"
                />
              </div>
            </div>
            <div class="cell-item required">
              <div class="key">在校期间应交纳学费</div>
              <div class="value">
                <input
                  type="number"
                  v-model="projectDeclareInfo.j00138"
                  placeholder="请输入在校期间应交纳学费"
                />
              </div>
            </div>
            <div class="cell-item required">
              <div class="key">在校期间实际缴纳学费</div>
              <div class="value">
                <input
                  type="number"
                  v-model="projectDeclareInfo.j00141"
                  placeholder="请输入在校期间实际缴纳学费"
                />
              </div>
            </div>
            <div class="cell-item">
              <div class="key">享受学费减免</div>
              <div class="value">
                <input
                  type="number"
                  v-model="projectDeclareInfo.j00139"
                  placeholder="请输入享受学费减免"
                />
              </div>
            </div>
            <div class="cell-item">
              <div class="key">欠缴学费</div>
              <div class="value">
                <input
                  type="number"
                  v-model="projectDeclareInfo.j00140"
                  placeholder="请输入欠缴学费"
                />
              </div>
            </div>
            <div class="cell-item">
              <div class="key">国家助学贷款本金</div>
              <div class="value">
                <input
                  type="number"
                  v-model="projectDeclareInfo.j00142"
                  placeholder="请输入国家助学贷款本金"
                />
              </div>
            </div>
            <div class="cell-item">
              <div class="key">国家助学贷款利息</div>
              <div class="value">
                <input
                  type="number"
                  v-model="projectDeclareInfo.j00143"
                  placeholder="请输入国家助学贷款利息"
                />
              </div>
            </div>
            <div class="cell-item">
              <div class="key">已归还数</div>
              <div class="value">
                <input
                  type="number"
                  v-model="projectDeclareInfo.j00144"
                  placeholder="请输入已归还数"
                />
              </div>
            </div>
            <div class="cell-item">
              <div class="key">贷款余额</div>
              <div class="value">
                <input
                  type="number"
                  v-model="projectDeclareInfo.j00145"
                  placeholder="请输入贷款余额"
                />
              </div>
            </div>
            <div class="cell-item">
              <div class="key">申请学费奖补</div>
              <div class="value">
                <input
                  type="number"
                  v-model="projectDeclareInfo.j00146"
                  placeholder="请输入申请学费奖补"
                />
              </div>
            </div>
            <div class="cell-item">
              <div class="key">用于还贷</div>
              <div class="value">
                <input
                  type="number"
                  v-model="projectDeclareInfo.j00147"
                  placeholder="请输入用于还贷"
                />
              </div>
            </div>
            <div class="cell-item">
              <div class="key">补缴学费</div>
              <div class="value">
                <input
                  type="number"
                  v-model="projectDeclareInfo.j00148"
                  placeholder="请输入补缴学费"
                />
              </div>
            </div>
          </div>
        </div>
      </ComponentPanel>
    </div>

    <!-- 添加就业信息 -->
    <div class="space-top-wrapper">
      <ComponentPanel title="就业信息">
        <ComponentDeclareCard
          :renderData="cardList"
          type="20317"
          addButtonName="添加就业信息"
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
import { useGetCurrentDate } from '@/hooks/common'
import { checkPhoneNumber } from '@/utils/check'
import { getCodeListByCodeName } from '@/utils/custom-api'
import { showModal } from '@/utils/uni-api'
export default {
  name: 'pageDeclare20317',
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
        permanentAddress: true, // 户籍地址
      },
      // 自定义添加一些属性 防止双向绑定失败 例如 picker组件之类
      projectDeclareInfo: {},
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
      let j00101 = [] // 学历

      try {
        j00101 = await getCodeListByCodeName('AAC011')
      } catch (err) {
        console.error('code table AAC011 error：', err)
      }

      this.codeMap = {
        ...this.codeMap,
        j00101,
      }
    },
    // 捕获 cardList 不用修改
    handleChangeCardList(type, data) {
      this.cardList = [...data]
    },
    // 检测数据输入格式是否正确 须根据项目需求更改
    handleCheckInput() {
      const {
        j00051,
        j00077,
        j00101,
        j00057,
        j00060,
        j00062,
        j00068,
        j00137,
        j00138,
        j00141,
        j00149,
        j00150,
        j00151,
        j00152,
        j00153,
      } = this.projectDeclareInfo
      const cardList = this.cardList
      const { status, msg } = checkPhoneNumber(j00068)
      if (!j00051) {
        showModal('请输入毕业院校')
        return false
      }
      if (!j00077) {
        showModal('请选择毕业时间')
        return false
      }
      if (!j00101) {
        showModal('请选择学历')
        return false
      }
      if (!j00057) {
        showModal('请输入学制')
        return false
      }
      if (!j00060) {
        showModal('请输入工作单位')
        return false
      }
      if (!j00062) {
        showModal('请输入工作地点')
        return false
      }
      if (status === '0') {
        showModal(msg)
        return false
      }
      if (!j00137) {
        showModal('请输入学历明细')
        return false
      }
      if (!j00138) {
        showModal('请输入在校期间应交纳学费')
        return false
      }
      if (!j00141) {
        showModal('请输入在校期间实际缴纳学费')
        return false
      }
      if (cardList.length == 0) {
        showModal('请添加就业信息')
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
        j00051,
        j00077,
        j00101,
        j00057,
        j00060,
        j00062,
        j00068,
        j00137,
        j00138,
        j00139,
        j00140,
        j00141,
        j00142,
        j00143,
        j00144,
        j00145,
        j00146,
        j00147,
        j00148,
      } = this.projectDeclareInfo

      const cardList = this.cardList
      const hp02List = []

      cardList.map((item) => {
        hp02List.push({
          chp021: item.name,
          chp02c: item.job,
          chp023: item.address,
          chp022: item.tel,
          chp02y: item.superior,
          chp02z: item.superiorTel,
          chp026: item.time,
          hp0201: item.equality,
        })
      })
      // 扩展字段
      const hb00BizMap = {
        j00051,
        j00077,
        j00101,
        j00057,
        j00060,
        j00062,
        j00068,
        j00137,
        j00138,
        j00139,
        j00140,
        j00141,
        j00142,
        j00143,
        j00144,
        j00145,
        j00146,
        j00147,
        j00148,
        chb01m: '1', // 发放类型 正常发放
        aae209: useGetCurrentDate('month', ''), // 发放期号 当前申报年月
      }
      this.handleDeclareData(hb00BizMap, '0', hp02List)
    },
  },
}
</script>

<style lang="scss" scoped></style>
