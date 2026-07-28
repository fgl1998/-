<!-- 独生子女父母奖励金 卫生健康委 -->
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
      >
      </ComponentDeclare>
    </div>

    <!-- start 需要修改的地方开始 在以下代码中根据项目需求更改 上面代码勿动 -->
    <!-- 人员类别 -->
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
              <div class="key">学校名称</div>
              <div class="value">
                <input
                  type="text"
                  maxlength="20"
                  v-model="projectDeclareInfo.ak0009"
                  placeholder="请输入学校名称"
                />
              </div>
            </div>
            <div class="cell-item required">
              <div class="key">学院班级</div>
              <div class="value">
                <input
                  type="text"
                  maxlength="20"
                  v-model="projectDeclareInfo.ak0013"
                  placeholder="请输入学院班级"
                />
              </div>
            </div>
            <div class="cell-item required disabled">
              <div class="key">水库名称</div>
              <div class="value">
                {{ projectDeclareInfo.ak0014 || '暂无' }}
              </div>
            </div>
            <div class="cell-item required disabled">
              <div class="key">是否建档立卡</div>
              <div class="value">
                {{ projectDeclareInfo.ak0015 == '1' ? '是' : '否' }}
              </div>
            </div>
            <div class="cell-item required disabled">
              <div class="key">发放金额</div>
              <div class="value">
                {{ projectDeclareInfo.aae019 }}
              </div>
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
import ComponentSelectPermanentAddress from '@/components/project/ez-select-permanent-address/ez-select-permanent-address.vue'
import ComponentSelectCurrentAddress from '@/components/project/ez-select-current-address/ez-select-current-address.vue'
import ComponentDeclareCard from '../components/ez-declare-card/ez-declare-card.vue'
import ComponentDeclarePersonnel from '@/components/project/ez-declare-personnel/ez-declare-personnel.vue'
import ComponentDeclareRadio from '@/components/project/ez-declare-radio/ez-declare-radio.vue'
import ComponentDeclarePicker from '@/components/project/ez-declare-picker/ez-declare-picker.vue'

import { useDeclare } from '@/mixins'

import { requestB135, requestB136 } from '@/service/api'
import { showModal } from '@/utils/uni-api'
import { checkIDCard } from '@/utils/check'

export default {
  name: 'pageDeclare987654',
  data() {
    return {
      // 基本信息 渲染配置
      renderObj: {
        idCard: true, // 身份证
        userName: true, // 姓名
        tel: true, // 联系电话
        permanentAddress: true, // 户籍地址
      },
      projectDeclareInfo: {
        ak0009: '', // 学校名称
        ak0013: '', // 学院班级
        ak0014: '', // 水库名称
        ak0015: '0', // 是否建档立卡
        aae019: '4000',
      },
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
    async getCodeTableCacheData() {},
    getOtherInfo(idCard, userName) {
      if (idCard && userName) {
        requestB135(idCard, userName).then((res) => {
          const { isHo07Message } = res
          this.projectDeclareInfo.ak0015 = isHo07Message
          this.projectDeclareInfo.aae019 = 4000
          if (isHo07Message == '1') {
            this.projectDeclareInfo.aae019 = 6000
          }
        })
        requestB136(idCard, userName).then((res) => {
          this.projectDeclareInfo.ak0014 = res
        })
      }
    },

    // 检测数据输入格式是否正确 须根据项目需求更改
    handleCheckInput() {
      const {
        ak0009, // 学校名称
        ak0013, // 学院班级
        ak0014, // 水库名称
        ak0015, // 是否建档立卡
      } = this.projectDeclareInfo

      if (!ak0009) {
        showModal('请输入学校名称')
        return false
      }
      if (!ak0013) {
        showModal('请输入学院班级')
        return false
      }
      // if (!ak0014) {
      //   showModal('查询不到水库信息，请确认该人员为大中型水库人员！!')
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

      const {
        ak0009, // 学校名称
        ak0013, // 学院班级
        ak0014, // 水库名称
        ak0015, // 是否建档立卡
        aae019,
      } = this.projectDeclareInfo

      // 扩展字段
      const hb00BizMap = {
        ak0009, // 学校名称
        ak0013, // 学院班级
        ak0014: ak0014 ? ak0014 : '暂无', // 水库名称
        ak0015, // 是否建档立卡
        aae019,
      }

      this.handleDeclareData(hb00BizMap, '0')
    },
  },
  computed: {},
  watch: {
    'basicInfo.idCard': {
      handler(val) {
        if (val) {
          const { idCard, userName } = this.basicInfo
          this.projectDeclareInfo.ak0014 = ''
          this.projectDeclareInfo.ak0015 = '0'
          this.projectDeclareInfo.aae019 = 4000
          if (idCard && userName) {
            const checkResult = checkIDCard(idCard)
            if (checkResult.status == '1') {
              this.getOtherInfo(idCard, userName)
            } else {
              showModal(checkResult.msg)
            }
          }
        } else {
          this.projectDeclareInfo.ak0014 = ''
          this.projectDeclareInfo.ak0015 = '0'
          this.projectDeclareInfo.aae019 = 4000
        }
      },
      immediate: true,
    },
    'basicInfo.userName': {
      handler(val) {
        if (val) {
          const { idCard, userName } = this.basicInfo
          this.projectDeclareInfo.ak0014 = ''
          this.projectDeclareInfo.ak0015 = '0'
          this.projectDeclareInfo.aae019 = 4000
          if (idCard && userName) {
            const checkResult = checkIDCard(idCard)
            if (checkResult.status == '1') {
              this.getOtherInfo(idCard, userName)
            } else {
              showModal(checkResult.msg)
            }
          }
        } else {
          this.projectDeclareInfo.ak0014 = ''
          this.projectDeclareInfo.ak0015 = '0'
          this.projectDeclareInfo.aae019 = 4000
        }
      },
      immediate: true,
    },
  },
}
</script>

<style lang="scss" scoped></style>
