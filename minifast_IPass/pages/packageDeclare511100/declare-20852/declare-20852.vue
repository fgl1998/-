<!-- 特困人员护理费 -->
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
    <div class="personnel-type-wrapper space-top-wrapper">
      <ComponentDeclarePersonnel
        :isMultipleChoicesPersonnel="isMultipleChoicesPersonnel"
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
              <div class="key">被护理人姓名</div>
              <div class="value">
                <input
                  type="text"
                  maxlength="19"
                  v-model="projectDeclareInfo.m00051"
                  placeholder="请输入被护理人姓名"
                />
              </div>
            </div>

            <div class="cell-item required">
              <div class="key">被护理人身份证</div>
              <div class="value">
                <input
                  type="idcard"
                  maxlength="18"
                  v-model="projectDeclareInfo.m35807"
                  placeholder="请输入被护理人身份证"
                />
              </div>
            </div>

            <ComponentDeclarePicker
              label="护理等级"
              idName="m00160"
              :range="codeMap.m00160"
              rangeKey="aaa103"
              valueKey="aaa102"
              placeholder="请选择护理等级"
              v-model="projectDeclareInfo.m00160"
            ></ComponentDeclarePicker>

            <ComponentDeclarePicker
              label="户籍类别"
              idName="m00002"
              :range="codeMap.w00070"
              rangeKey="aaa103"
              valueKey="aaa102"
              placeholder="请选择户籍类别"
              v-model="projectDeclareInfo.m00002"
            ></ComponentDeclarePicker>

            <div class="cell-item required">
              <div class="key">发放金额</div>
              <div class="value">
                <input
                  type="number"
                  v-model="projectDeclareInfo.aae019"
                  disabled
                />
              </div>
            </div>
          </div>
        </div>
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
import ComponentDeclareCard from '@/components/project/ez-declare-card/ez-declare-card.vue'
import ComponentDeclarePersonnel from '@/components/project/ez-declare-personnel/ez-declare-personnel.vue'
import ComponentDeclarePicker from '@/components/project/ez-declare-picker/ez-declare-picker.vue'

import { useDeclare } from '@/mixins'

import { getIsDev } from '@/utils/get'
import { useGetCurrentDate, useCheckIDCard } from '@/hooks/common'
import { showModal } from '@/utils/uni-api'
import { getCodeListByCodeName } from '@/utils/custom-api'
export default {
  name: 'pageDeclare20852',
  data() {
    return {
      isMultipleChoicesPersonnel: false,
      renderObj: {
        idCard: true, // 身份证
        userName: true, // 姓名
        tel: true, // 联系电话
        age: true, // 年龄
        nation: true,
        gender: true, // 性别
        permanentAddress: true, // 户籍地址
      },
      // 申报信息
      projectDeclareInfo: {
        c00013: '', // 子女或亲属联系人
        chb0h1: '',
        c00029: '',
        aae019: '',
      },
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
  methods: {
    // 获取该申报项目的所需要的码表数据
    // aaz502、aac011、dac009、aac004、aac005、aae008、yesorno 不用再次获取
    // 编写格式参考达州20033项目
    async getCodeTableCacheData() {
      const isDev = getIsDev() // 当前环境是否是开发环境
      let w00070 = [] // 户籍类别
      let m00160 = [] // 护理等级

      try {
        w00070 = await getCodeListByCodeName('w00070')
      } catch (err) {
        if (isDev) {
          console.error('code table w00070 error：', err)
        }
      }

      try {
        m00160 = await getCodeListByCodeName('m00160')
      } catch (err) {
        if (isDev) {
          console.error('code table m00160 error：', err)
        }
      }

      this.codeMap = {
        ...this.codeMap,
        w00070,
        m00160,
      }
    },
    // 检测数据输入格式是否正确 须根据项目需求修改
    handleCheckInput() {
      const {
        aac005, //民族
        chb00l, //年龄
        aac004, //性别
        chb0a9, //户籍地址
        m00051, //被护理人姓名
        m35807, //被护理人身份证
        m00160, //护理等级
        m00002, //户籍类别
        aae019, //发放金额
      } = this.projectDeclareInfo
      const { status, msg } = useCheckIDCard(m35807)
      if (!m00051) {
        showModal('请输入被护理人姓名')
        return false
      }
      if (status === '0') {
        showModal(msg)
        return false
      }
      if (!m00160) {
        showModal('请选择护理等级')
        return false
      }
      if (!m00002) {
        showModal('请选择户籍类别')
        return false
      }
      if (!aae019) {
        showModal('发放金额不能为空')
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
        aac005, //民族
        chb00l, //年龄
        aac004, //性别
        chb0a9, //户籍地址
        m00051, //被护理人姓名
        m35807, //被护理人身份证
        m00160, //护理等级
        m00002, //户籍类别
        aae019, //发放金额
      } = this.projectDeclareInfo

      const { nation, age, gender, permanentAddress } = this.basicInfo

      // 扩展字段
      let hb00BizMap = {
        aac005: nation, // 民族
        chb00l: age, // 年龄
        aac004: gender, // 性别
        chb0a9: permanentAddress, // 户籍地址
        m00051, // 被护理人姓名
        m35807, // 被护理人身份证
        m00160, // 护理等级
        m00002, // 户籍类别
        aae019, // 发放金额
        chb01m: '1', // 发放类型 正常发放
        aae209: useGetCurrentDate('month', ''), // 发放期号 当前申报年月
      }

      this.handleDeclareData(hb00BizMap, '0')
    },
  },
  watch: {
    'projectDeclareInfo.m00160': {
      handler(newVal) {
        if (newVal) {
          this.projectDeclareInfo.aae019 =
            newVal == '1' ? '100' : newVal == '2' ? '200' : '300'
        }
      },
    },
  },
}
</script>

<style lang="scss" scoped></style>
