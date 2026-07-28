<!-- 市直发残疾人临时救助、紧急救助 残联 -->
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

    <!-- start 需要修改的地方开始 在以下代码中根据项目需求更改 上面代码勿动 -->
    <div class="declare-info-wrapper">
      <ComponentPanel title="申报信息">
        <div class="panel-content">
          <div class="cell-items">
            <!-- 申请事由 -->
            <div class="cell-item textarea last required">
              <div class="key">申请事由</div>
              <div class="value">
                <textarea
                  placeholder="请输入您的申请事由"
                  maxlength="100"
                  v-model="projectDeclareInfo.c00018"
                ></textarea>
              </div>
            </div>
          </div>
        </div>
      </ComponentPanel>
    </div>
    <!-- end  需要修改的地方结束 在以下代码中根据项目需求更改 下面代码勿动-->

    <div class="space-top-wrapper">
      <ComponentPanel title="残疾信息">
        <div class="panel-content">
          <div class="cell-items">
            <div class="cell-item required disabled">
              <div class="key">残疾类别</div>
              <div class="value">
                {{ projectDeclareInfo.chb0h1Desc || '暂无' }}
              </div>
            </div>
            <div class="cell-item required disabled">
              <div class="key">残疾等级</div>
              <div class="value">
                {{ projectDeclareInfo.chb0h2Desc || '暂无' }}
              </div>
            </div>
            <div class="cell-item required disabled">
              <div class="key">残疾证号</div>
              <div class="value">{{ projectDeclareInfo.c03601 || '暂无' }}</div>
            </div>
            <div class="cell-item required disabled">
              <div class="key">办证时间</div>
              <div class="value">{{ projectDeclareInfo.chb0h9 || '暂无' }}</div>
            </div>
          </div>
        </div>
      </ComponentPanel>
    </div>

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

import { useDeclare } from '@/mixins'

import { showModal, navigateBack } from '@/utils/uni-api'
import { requestSPGetUserInfoByAac002 } from '@/service/api'

export default {
  name: 'pageDeclare20194',

  data() {
    return {
      renderObj: {
        idCard: true, // 身份证
        userName: true, // 姓名
        tel: true, // 联系电话
        education: false, // 学历
        gender: true, // 性别
        nation: true, // 民族
        birthday: false, // 出生日期
        nativePlace: false, // 籍贯 四川省南充市
        chb0a3: false, // 现居住地址
        permanentAddress: true, // 户籍地址
        age: true,
      },

      projectDeclareInfo: {
        chbaac: '',
        aae006: '',
      },
    }
  },
  components: {
    ComponentButton,
    ComponentPanel,
    ComponentDeclare,
    ComponentDeclareStep,
  },
  mixins: [useDeclare],
  // 监听页面加载，其参数为上个页面传递的数据，参数类型为Object（用于页面传参）
  onLoad(e) {
    this.handleOnLoad(e)
  },
  // 监听页面显示
  onShow() {},
  // 监听页面隐藏
  onHide() {},
  methods: {
    getCodeTableCacheData() {},
    handleChangeDataByIdCard(value) {
      this.seDataByIdCard(value)
    },
    // 设置残疾人信息
    setDisabledData(declareType) {
      const { c03601, chb0h1, chb0h1Desc, chb0h9, chb0h2, chb0h2Desc } =
        this.userInfo
      // 残疾人数据返回格式
      // c03601: "51392219961015741053"
      // chb0h1: "5"
      // chb0h1Desc: "智力"
      // chb0h2: "3"
      // chb0h2Desc: "三级"
      // chb0h9: "2019-01-31"
      // chb0hf: "智力三级"
      // code: "1"
      if (declareType === '01') {
        // 存在残疾证号
        if (c03601) {
          this.projectDeclareInfo = {
            ...this.projectDeclareInfo,
            chb0h1, // 残疾人类别
            chb0h1Desc,
            chb0h2, // 残疾等级
            chb0h2Desc,
            chb0h9, // 办证时间
            c03601, // 残疾证号
          }
        } else {
          this.projectDeclareInfo = {
            ...this.projectDeclareInfo,
            chb0h1: '', // 残疾人类别
            chb0h1Desc: '',
            chb0h2: '', // 残疾等级
            chb0h2Desc: '',
            chb0h9: '', // 办证时间
            c03601: '', // 残疾证号
          }
        }
      } else {
        this.projectDeclareInfo = {
          ...this.projectDeclareInfo,
          chb0h1: '', // 残疾人类别
          chb0h1Desc: '',
          chb0h2: '', // 残疾等级
          chb0h2Desc: '',
          chb0h9: '', // 办证时间
          c03601: '', // 残疾证号
        }
      }
    },
    // 设置数据 通过身份证获取的数据
    seDataByIdCard(data) {
      const { c03601, chb0h1, chb0h1Desc, chb0h9, chb0h2, chb0h2Desc } =
        data.disabledInfo
      if (c03601) {
        this.projectDeclareInfo = {
          ...this.projectDeclareInfo,
          chb0h1, // 残疾人类别
          chb0h1Desc, // 残疾人类别
          chb0h2, // 残疾等级
          chb0h2Desc,
          chb0h9, // 办证时间
          c03601, // 残疾证号
        }
      } else {
        this.projectDeclareInfo = {
          ...this.projectDeclareInfo,
          chb0h1: '', // 残疾人类别
          chb0h1Desc: '',
          chb0h2: '', // 残疾等级
          chb0h2Desc: '',
          chb0h9: '', // 办证时间
          c03601: '', // 残疾证号
        }
      }
    },
    // 检测数据输入格式是否正确 须根据项目需求更改
    handleCheckInput() {
      const {
        c00018, //申请事由
        c03601,
      } = this.projectDeclareInfo

      if (!c00018) {
        showModal('请输入申请事由', '提示', false)
        return false
      }
      if (!c03601) {
        showModal('申报人不是残疾人，无法申报该补贴项目，请检查申报人信息！')
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
        idCard, // 身份证号
        userName, // 姓名
        tel, // 电话号码
      } = this.agentInfo

      const {
        chb0h1, //残疾类别
        chb0h2, //残疾等级
        c03601, //二代残疾证号
        c00018, //申请事由

        aaz502, //社保卡状态
        aae008, //社保卡银行类别
        aae010, //社保卡银行卡号
      } = this.projectDeclareInfo

      // 扩展字段
      let hb00BizMap = {
        chb0h1, //残疾类别
        chb0h2, //残疾等级
        c03601, //二代残疾证号
        c00018, //申请事由

        c00030: userName, // 代办人姓名
        c00032: idCard, // 代办人身份证
        c00031: tel, // 代办人联系电话
        c00024: '村干部',
      }
      this.handleDeclareData(hb00BizMap, '0')
    },
  },
  computed: {},
  watch: {
    'userInfo.user_id': {
      handler(val) {
        if (val) {
          let idCard = this.userInfo.idCard
          requestSPGetUserInfoByAac002(idCard, true, false) //获取经办人员信息
            .then(
              (res) => {
                if (
                  res.job.split(',').indexOf('村业务受理') > -1 ||
                  res.job.split(',').indexOf('村受理') > -1
                ) {
                  this.basicInfo.map((item) => {
                    if (
                      item.id != 'c00008' ||
                      item.id != 'aaz502' ||
                      item.id != 'aae010' ||
                      item.id != 'aae008'
                    ) {
                      item.disabled = false
                    }
                    if (item.id == 'c00008') {
                      item.value = res.orgnamepath.split(',').join('-')
                      let orgids = res.orgidpath.split('/')
                      this.chb015 = orgids[2]
                      this.chb017 = orgids[3]
                      this.chb018 = orgids[4]
                    }
                  })
                } else {
                  showModal('该补贴新项目只供村经办人员使用').then(() => {
                    navigateBack(1)
                  })
                }
              },
              (err) => {
                showModal(err.message).then(() => {
                  navigateBack(1)
                })
              }
            )
        }
      },
      immediate: true,
      deep: true,
    },
  },
}
</script>

<style lang="scss" scoped>
.declare-info-wrapper {
  margin-top: 30rpx;
}
</style>
