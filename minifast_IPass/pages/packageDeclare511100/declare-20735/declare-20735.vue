<!-- 养殖环节病死生猪无害化处理补助资金 -->
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
            <ComponentSelectAddressMultitype
              label="养殖场地址"
              placeholder="请选择或输入养殖场地址"
              :isShowBtn="renderObj.permanentAddress"
              @clickBtn="projectDeclareInfo.n00012 = basicInfo.permanentAddress"
              v-model="projectDeclareInfo.n00012"
            >
            </ComponentSelectAddressMultitype>

            <ComponentDeclarePicker
              label="畜别"
              idName="n00221"
              :range="codeMap.n00221"
              rangeKey="aaa103"
              valueKey="aaa102"
              placeholder="请选择畜别"
              v-model="projectDeclareInfo.n00221"
            ></ComponentDeclarePicker>

            <div class="cell-item required">
              <div class="key">病害生猪无害化处理数量</div>
              <div class="value">
                <input
                  type="number"
                  maxlength="19"
                  v-model="projectDeclareInfo.n00212"
                  placeholder="请输入病害生猪无害化处理数量"
                />
              </div>
            </div>

            <ComponentDeclarePicker
              label="无害化处理方式"
              idName="n00183"
              :range="codeMap.n00183"
              rangeKey="aaa103"
              valueKey="aaa102"
              placeholder="请选择无害化处理方式"
              v-model="projectDeclareInfo.n00183"
            ></ComponentDeclarePicker>

            <ComponentDeclarePicker
              label="生猪无害化处理时间"
              idName="n00215"
              mode="date"
              fields="day"
              :endTime="today_d"
              :required="false"
              v-model="projectDeclareInfo.n00215"
              placeholder="请选择处理时间"
            ></ComponentDeclarePicker>

            <ComponentSelectAddressMultitype
              label="处理地点"
              placeholder="请选择或输入处理地点"
              :isShowBtn="renderObj.permanentAddress"
              @clickBtn="projectDeclareInfo.n00222 = basicInfo.permanentAddress"
              v-model="projectDeclareInfo.n00222"
            >
            </ComponentSelectAddressMultitype>

            <div class="cell-item required">
              <div class="key">存栏量</div>
              <div class="value">
                <input
                  type="number"
                  maxlength="18"
                  v-model="projectDeclareInfo.n00223"
                  placeholder="请输入存栏量"
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
import ComponentSelectPermanentAddress from '@/components/project/ez-select-permanent-address/ez-select-permanent-address.vue'
import ComponentDeclareCard from '@/components/project/ez-declare-card/ez-declare-card.vue'
import ComponentDeclarePersonnel from '@/components/project/ez-declare-personnel/ez-declare-personnel.vue'
import ComponentDeclarePicker from '@/components/project/ez-declare-picker/ez-declare-picker.vue'
import ComponentSelectAddressMultitype from '@/components/project/ez-select-address-multitype/ez-select-address-multitype.vue'

import { useDeclare } from '@/mixins'
import { useGetCurrentDate } from '@/hooks/common'
import { showModal } from '@/utils/uni-api'
import { getCodeListByCodeName } from '@/utils/custom-api'
export default {
  name: 'pageDeclare20735',
  data() {
    return {
      isMultipleChoicesPersonnel: false,
      today_d: useGetCurrentDate(''),
      renderObj: {
        idCard: true, // 身份证
        userName: true, // 姓名
        tel: true, // 联系电话
        permanentAddress: true, // 户籍地址
      },
      // 申报信息
      projectDeclareInfo: {
        n00012: '',
        n00222: '',
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
    ComponentSelectPermanentAddress,
    ComponentSelectAddressMultitype,
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
      let n00183 = [] // 无害化处理方式
      let n00221 = [] // 畜别

      try {
        n00183 = await getCodeListByCodeName('n00183')
      } catch (err) {
        console.error('code table n00183 error：', err)
      }

      try {
        n00221 = await getCodeListByCodeName('n00221')
      } catch (err) {
        console.error('code table n00221 error：', err)
      }

      this.codeMap = {
        ...this.codeMap,
        n00183,
        n00221,
      }
    },
    // 检测数据输入格式是否正确 须根据项目需求修改
    handleCheckInput() {
      const {
        aae005, //联系电话
        n00012, //养殖场地址
        n00221, //畜别
        n00212, //病害生猪无害化处理数量
        n00183, //无害化处理方式
        n00222, //处理地点
        n00223, //存栏量
      } = this.projectDeclareInfo
      if (!n00012) {
        showModal('请输入养殖场地址')
        return false
      }
      if (!n00221) {
        showModal('请选择畜别')
        return false
      }
      if (!n00212) {
        showModal('请输入病害生猪无害化处理数量')
        return false
      }
      if (!n00183) {
        showModal('请选择无害化处理方式')
        return false
      }
      if (!n00222) {
        showModal('请选择处理地点')
        return false
      }
      if (!n00223) {
        showModal('请输入存栏量')
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
        aae005, //联系电话
        n00012, //养殖场地址
        n00221, //畜别
        n00212, //病害生猪无害化处理数量
        n00183, //无害化处理方式
        n00215, //生猪无害化处理时间
        n00222, //处理地点
        n00223, //存栏量
      } = this.projectDeclareInfo

      const {
        tel, //联系电话
      } = this.basicInfo

      // 扩展字段
      let hb00BizMap = {
        aae005: tel, // 联系电话
        n00012, // 养殖场地址
        n00221, // 畜别
        n00212, // 病害生猪无害化处理数量
        n00183, // 无害化处理方式
        n00215, // 生猪无害化处理时间
        n00222, // 处理地点
        n00223, // 存栏量
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
