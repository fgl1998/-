<template>
  <!-- “福彩圆梦·孤儿助学工程”助学金发放（民政局） -->
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
        addressRemove="102419"
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
            <div class="cell-item required">
              <div class="key">就读学校</div>
              <div class="value">
                <input
                  type="text"
                  v-model="projectDeclareInfo.m00068"
                  placeholder="请输入您的就读学校"
                />
              </div>
            </div>

            <div class="cell-item required">
              <div class="key">录取专业</div>
              <div class="value">
                <input
                  type="text"
                  v-model="projectDeclareInfo.m00037"
                  placeholder="请输入录取专业"
                />
              </div>
            </div>

            <ComponentSelectAddressMultitype
              label="院校所在地"
              placeholder="请选择或输入院校所在地"
              :isShowBtn="renderObj.permanentAddress"
              @clickBtn="projectDeclareInfo.m00038 = basicInfo.permanentAddress"
              v-model="projectDeclareInfo.m00038"
            >
            </ComponentSelectAddressMultitype>

            <ComponentDeclarePicker
              label="入学时间"
              idName="m00056"
              placeholder="请选择入学时间"
              mode="date"
              fields="day"
              :endTime="today"
              v-model="projectDeclareInfo.m00056"
            ></ComponentDeclarePicker>

            <div class="cell-item required">
              <div class="key">就读年限</div>
              <div class="value">
                <input
                  type="text"
                  v-model="projectDeclareInfo.m00099"
                  placeholder="请输入就读年限"
                />
              </div>
            </div>

            <div class="cell-item required">
              <div class="key">学历类别</div>
              <div class="value">
                <input
                  type="text"
                  v-model="projectDeclareInfo.m00100"
                  placeholder="请输入学历类别"
                />
              </div>
            </div>

            <div class="cell-item required">
              <div class="key">学籍部门管理电话</div>
              <div class="value">
                <input
                  type="text"
                  v-model="projectDeclareInfo.m00055"
                  placeholder="请输入学籍部门管理电话"
                  @change="handleAae005Blur"
                />
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
import ComponentSelectAddressMultitype from '@/components/project/ez-select-address-multitype/ez-select-address-multitype.vue'
import { useDeclare } from '@/mixins'

import { getDate } from '@/utils/get'
import { checkPhoneNumber } from '@/utils/check'
import { showModal } from '@/utils/uni-api'

export default {
  name: 'pageDeclare20003',
  data() {
    return {
      renderObj: {
        idCard: true, // 身份证
        userName: true, // 姓名
        tel: true, // 联系电话
        nation: true, //民族
        birthday: true, //出生日期
        permanentAddress: true, // 户籍地址
      },
      today: getDate(),
      projectDeclareInfo: {
        m00038: '', //地院校所在地
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
    ComponentSelectAddressMultitype,
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
    async getCodeTableCacheData() {},
    // 检测数据输入格式是否正确 须根据项目需求更改
    handleCheckInput() {
      const {
        aac005, //民族
        m00079, //出生日期
        chb018, //受理村

        m00068, //就读学校
        m00037, //录取专业
        m00038, //院校所在地
        m00056, //入学时间
        m00099, //就读年限
        m00100, //学历类别
        m00055, //学籍部门管理电话
      } = this.projectDeclareInfo

      if (!m00068) {
        showModal('请输入就读学校')
        return false
      }
      if (!m00037) {
        showModal('请输入录取专业')
        return false
      }
      if (!m00038) {
        showModal('请选择院校所在地')
        return false
      }
      if (!m00056) {
        showModal('请选择入学时间')
        return false
      }
      if (!m00099) {
        showModal('请输入就读年限')
        return false
      }
      if (!m00100) {
        showModal('请输入学历类别')
        return false
      }
      if (!m00055) {
        showModal('请输入学籍部门管理电话')
        return false
      } else {
        const checkResult = checkPhoneNumber(m00055, '学籍部门管理电话')
        if (checkResult.status === '0') {
          showModal(checkResult.msg)
          return false
        }
      }
      return true
    },
    // 手动输入手机号 失去焦点监听
    handleAae005Blur(e) {
      const { value } = e.target
      const checkIDCardResult = checkPhoneNumber(value)
      if (checkIDCardResult.status === '0') {
        showModal(checkIDCardResult.msg, '提示', false)
      }
    },
    // 下一步
    handleJumpNextStep() {
      // if (!this.handleCheckComponentInput()) {
      //   return;
      // }
      if (!this.handleCheckInput()) {
        return
      }

      const {
        nation, //民族
        birthday, //出生日期
      } = this.basicInfo

      const {
        // chb018, //受理村

        m00068, //就读学校
        m00037, //录取专业
        m00038, //院校所在地
        m00056, //入学时间
        m00099, //就读年限
        m00100, //学历类别
        m00055, //学籍部门管理电话
      } = this.projectDeclareInfo
      // 扩展字段
      var hb00BizMap = {
        aac005: nation, //民族
        m00079: birthday, //出生日期
        // chb018, //受理村

        m00068, //就读学校
        m00037, //录取专业
        m00038, //院校所在地
        m00056, //入学时间
        m00099, //就读年限
        m00100, //学历类别
        m00055, //学籍部门管理电话
      }

      this.handleDeclareData(hb00BizMap, '0')
    },
  },
  computed: {},
}
</script>

<style lang="scss" scoped>
.declare-info-wrapper {
  margin-top: 30rpx;
}
</style>
