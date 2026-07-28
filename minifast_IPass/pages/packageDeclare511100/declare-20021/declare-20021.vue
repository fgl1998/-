<!-- 残疾人机动轮椅车燃油补贴 -->
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
              <div class="key">子女或亲属联系人</div>
              <div class="value">
                <input
                  type="text"
                  maxlength="19"
                  v-model="projectDeclareInfo.c00013"
                  placeholder="请输入子女或亲属联系人"
                />
              </div>
            </div>
            <div class="cell-item required">
              <div class="key">子女或亲属联系电话</div>
              <div class="value">
                <input
                  type="number"
                  maxlength="11"
                  v-model="projectDeclareInfo.c00014"
                  placeholder="请输入子女或亲属联系电话"
                />
              </div>
            </div>

            <block>
              <ComponentDeclarePicker
                label="残疾人类别"
                idName="chb0h1"
                :range="codeMap.chb0h1"
                rangeKey="aaa103"
                valueKey="aaa102"
                placeholder="请选择残疾人类别"
                v-model="projectDeclareInfo.chb0h1"
              ></ComponentDeclarePicker>
            </block>
            <ComponentDeclarePicker
              label="购车时间"
              idName="c00028"
              mode="date"
              fields="day"
              :endTime="new Date().getTime()"
              v-model="projectDeclareInfo.c00028"
              placeholder="请选择购车时间"
            ></ComponentDeclarePicker>

            <div class="cell-item required">
              <div class="key">购车原始发票号码</div>
              <div class="value">
                <input
                  type="text"
                  v-model="projectDeclareInfo.c00029"
                  placeholder="请输入购车原始发票号码"
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
import { useGetCurrentDate } from '@/hooks/common'
import { checkPhoneNumber } from '@/utils/check'
import { showModal } from '@/utils/uni-api'
import { getCodeListByCodeName } from '@/utils/custom-api'
export default {
  name: 'pageDeclare20021',
  data() {
    return {
      isMultipleChoicesPersonnel: false,
      renderObj: {
        idCard: true, // 身份证
        userName: true, // 姓名
        tel: true, // 联系电话
        age: true, // 年龄
        gender: true, // 性别
        birthday: true, // 出生年月
        permanentAddress: true, // 户籍地址
        currentAddress: true, // 现居住地址
      },
      // 申报信息
      projectDeclareInfo: {
        c00013: '', // 子女或亲属联系人
        chb0h1: '',
        c00029: '',
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
      let chb0h1 = [] // 残疾人类别

      try {
        chb0h1 = await getCodeListByCodeName('chb0h1')
      } catch (err) {
        console.error('code table chb0h1 error：', err)
      }

      this.codeMap = {
        ...this.codeMap,
        chb0h1,
      }
    },
    // 检测数据输入格式是否正确 须根据项目需求修改
    handleCheckInput() {
      const { c00013, c00014, chb0h1, c00028, c00029 } = this.projectDeclareInfo
      const { status, msg } = checkPhoneNumber(c00014)
      if (!c00013) {
        showModal('请输入子女或亲属联系人')
        return false
      }
      if (status === '0') {
        showModal(msg)
        return false
      }
      if (!chb0h1) {
        showModal('请选择残疾人类别')
        return false
      }
      if (!c00028) {
        showModal('请选择购车时间')
        return false
      }
      if (!c00029) {
        showModal('请输入购车原始发票号码')
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
      const { c00013, c00014, chb0h1, c00028, c00029 } = this.projectDeclareInfo

      const { age, permanentAddress, currentAddress } = this.basicInfo

      // 扩展字段
      let hb00BizMap = {
        c00013, // 子女或亲属联系人
        c00014, // 子女或亲属联系电话
        chb0h1, // 残疾人类别
        c00028, // 购车时间
        c00029, // 购车原始发票号码
        chb00l: age, // 年龄
        c00015: currentAddress, // 现居住地址
        c00008: permanentAddress, // 户籍地址
        aae019: 0, // 发放金额
        chb01m: '1', // 发放类型 正常发放
        aae209: useGetCurrentDate('month', ''), // 发放期号 当前申报年月
      }

      this.handleDeclareData(hb00BizMap, '0')
    },
  },
}
</script>

<style lang="scss" scoped></style>
