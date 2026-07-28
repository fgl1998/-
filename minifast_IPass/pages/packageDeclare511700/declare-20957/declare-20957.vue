<!-- 地质灾害隐患点监测人员工资补贴 -->
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
        addressFilter="1569457,1569460,1569463,1569466,1569472,1569475,1569469,1569481,2095930"
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
        title="逝者人员类别"
        @change="handleChangePersonnelInfo"
      ></ComponentDeclarePersonnel>
    </div>

    <!-- 申报信息 -->
    <div class="space-top-wrapper">
      <ComponentPanel title="申报信息">
        <div class="panel-content">
          <div class="cell-items">
            <!-- 未上户口婴儿无身份证 -->
            <div class="cell-item required" v-if="showDeadIdcard">
              <div class="key">逝者身份证号码</div>
              <div class="value">
                <input
                  type="idcard"
                  maxlength="18"
                  v-model="projectDeclareInfo.m00058"
                  @blur="handleBlurM00058"
                  placeholder="请输入逝者身份证号码"
                />
              </div>
            </div>

            <div class="cell-item required">
              <div class="key">逝者姓名</div>
              <div class="value">
                <input type="text" v-model="projectDeclareInfo.m00059" placeholder="请输入逝者姓名" />
              </div>
            </div>

            <ComponentDeclarePicker
              label="逝者死亡时间"
              idName="m00060"
              placeholder="请选择逝者死亡时间"
              mode="date"
              fields="day"
              startTime="2019-01-01"
              :endTime="today"
              v-model="projectDeclareInfo.m00060"
            ></ComponentDeclarePicker>

            <ComponentSelectPermanentAddress
              placeholder="请选择逝者户籍地址"
              label="逝者户籍地址"
              v-model="projectDeclareInfo.m00098"
              @change="changeAddress"
              addressFilter="1569457,1569481"
            >
            </ComponentSelectPermanentAddress>

            <div class="cell-item required">
              <div class="key">火化地点</div>
              <div class="value">
                <input type="text" v-model="projectDeclareInfo.m00156" placeholder="请输入逝者火化地点" />
              </div>
            </div>
          </div>
        </div>
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
import { checkIDCard } from '@/utils/check'
import ComponentDeclareStep from '@/components/project/ez-declare-step/ez-declare-step.vue'
import ComponentDeclare from '@/components/project/ez-declare/ez-declare.vue'
import ComponentDeclarePersonnel from '@/components/project/ez-declare-personnel/ez-declare-personnel.vue'
import ComponentDeclarePicker from '@/components/project/ez-declare-picker/ez-declare-picker.vue'
import ComponentSelectPermanentAddress from '@/components/project/ez-select-permanent-address/ez-select-permanent-address.vue'
import { useDeclare } from '@/mixins'

import { getDate } from '@/utils/get'
import { showModal } from '@/utils/uni-api'
export default {
  name: 'pageDeclare20957',
  data() {
    return {
      renderObj: {
        idCard: true, // 身份证
        userName: true, // 姓名
        tel: true, // 联系电话
        permanentAddress: true, // 户籍地址
      },
      today: getDate('day'),
    }
  },
  components: {
    ComponentButton,
    ComponentPanel,
    ComponentDeclare,
    ComponentDeclareStep,
    ComponentDeclarePersonnel,
    ComponentDeclarePicker,
    ComponentSelectPermanentAddress,
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
    // 校验身份证
    handleBlurM00058(e) {
      const { value } = e.target
      const checkResult = checkIDCard(value, '逝者身份证号')
      if (checkResult.status === '0') {
        showModal(checkResult.msg)
      }
    },
    // 检测数据输入格式是否正确 须根据项目需求修改
    handleCheckInput() {
      const { district } = this.basicInfo
      const { m00058, m00059, m00060, m00098,m00156 } = this.projectDeclareInfo
      const showDeadIdcard = this.showDeadIdcard

      if (showDeadIdcard) {
        if (!m00058) {
          showModal('请输入逝者身份证号码')
          return false
        } else {
          const checkResult = checkIDCard(m00058, '逝者身份证号')
          if (checkResult.status === '0') {
            showModal(checkResult.msg)
            return false
          }
        }
      }
      if (!m00059) {
        showModal('请输入逝者姓名')
        return false
      }
      if (!m00060) {
        showModal('请选择逝者死亡时间')
        return false
      }
      if (!m00098) {
        showModal('请选择逝者户籍地址')
        return false
      }
      if (!m00156) {
        showModal('请输入逝者火化地点')
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
      const {
        m00058, // 逝者身份证号
        m00059, // 逝者姓名
        m00060, // 逝者去世时间
        m00098, // 逝者户籍地址
        m00156,
        chb015,
        chb017,
        chb018,
      } = this.projectDeclareInfo
      // 扩展字段
      const hb00BizMap = {
        m00058, // 逝者身份证号
        m00059, // 逝者姓名
        m00060, // 逝者去世时间
        m00098, // 逝者户籍地址
        m00156,
        chb015,
        chb017,
        chb018,
      }
      this.handleDeclareData(hb00BizMap, '1')
    },

    changeAddress(value) {
      this.projectDeclareInfo.chb015 = value[0].orgid
      this.projectDeclareInfo.chb017 = value[1].orgid
      this.projectDeclareInfo.chb018 = value[2].orgid
    },
  },
  computed: {
    // 是否显示逝者身份证号输入
    showDeadIdcard() {
      let result = true
      const { cac102 } = this.personnelInfo
      if (cac102 === '3271') {
        result = false
      }
      return result
    },
  },
  watch: {},
}
</script>

<style lang="scss" scoped></style>
