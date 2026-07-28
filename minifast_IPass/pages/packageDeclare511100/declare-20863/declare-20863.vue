<!-- 动物强制免疫应激反应补助 -->
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
      ></ComponentDeclare>
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
              <div class="key">畜禽种类</div>
              <div class="value">
                <input
                  type="text"
                  maxlength="19"
                  v-model="projectDeclareInfo.n00177"
                  placeholder="请输入畜禽种类"
                />
              </div>
            </div>

            <div class="cell-item required">
              <div class="key">养殖规模</div>
              <div class="value">
                <input type="text" v-model="projectDeclareInfo.n00180" placeholder="请输入养殖规模" />
              </div>
            </div>

            <div class="cell-item required">
              <div class="key">免疫头数</div>
              <div class="value">
                <input
                  type="number"
                  maxlength="19"
                  v-model="projectDeclareInfo.n00161"
                  placeholder="请输入免疫头数"
                />
              </div>
            </div>

            <div class="cell-item required">
              <div class="key">疫苗种类</div>
              <div class="value">
                <input
                  type="text"
                  maxlength="19"
                  v-model="projectDeclareInfo.n00197"
                  placeholder="请输入疫苗种类"
                />
              </div>
            </div>

            <div class="cell-item required">
              <div class="key">疫苗批号</div>
              <div class="value">
                <input
                  type="text"
                  maxlength="19"
                  v-model="projectDeclareInfo.n00199"
                  placeholder="请输入疫苗批号"
                />
              </div>
            </div>

            <div class="cell-item required">
              <div class="key">免疫剂量</div>
              <div class="value">
                <input
                  type="number"
                  maxlength="19"
                  v-model="projectDeclareInfo.n00200"
                  placeholder="请输入免疫剂量"
                />
              </div>
            </div>

            <div class="cell-item required">
              <div class="key">防疫员</div>
              <div class="value">
                <input
                  type="text"
                  maxlength="19"
                  v-model="projectDeclareInfo.n00205"
                  placeholder="请输入防疫员"
                />
              </div>
            </div>

            <ComponentDeclarePicker
              label="申请补助项目"
              idName="n00204"
              :range="codeMap.n00204"
              rangeKey="aaa103"
              valueKey="aaa102"
              placeholder="请选择申请补助项目"
              v-model="projectDeclareInfo.n00204"
            ></ComponentDeclarePicker>
            <div class="cell-item required" v-if="projectDeclareInfo.n00204 == '1'">
              <div class="key">治疗情况</div>
              <div class="value">
                <input
                  type="text"
                  maxlength="19"
                  v-model="projectDeclareInfo.n00198"
                  placeholder="请输入治疗情况"
                />
              </div>
            </div>
            <div class="cell-item required" v-if="projectDeclareInfo.n00204 == '2'">
              <div class="key">死亡数量</div>
              <div class="value">
                <input
                  type="number"
                  maxlength="19"
                  v-model="projectDeclareInfo.n00109"
                  placeholder="请输入死亡数量"
                />
              </div>
            </div>
            <div class="cell-item required">
              <div class="key">补助标准</div>
              <div class="value">
                <input type="number" v-model="projectDeclareInfo.n00241" placeholder="请输入补助标准" />
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
  name: 'pageDeclare20863',
  data() {
    return {
      isMultipleChoicesPersonnel: false,
      renderObj: {
        idCard: true, // 身份证
        userName: true, // 姓名
        tel: true, // 联系电话
        permanentAddress: true, // 户籍地址
        currentAddress: true //现居地址
      },
      // 申报信息
      projectDeclareInfo: {
        n00204: ''
      }
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
    ComponentSelectAddressMultitype
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
      let n00204 = [] // 申请补助项目

      try {
        n00204 = await getCodeListByCodeName('n00204')
      } catch (err) {
        console.error('code table n00204 error：', err)
      }

      this.codeMap = {
        ...this.codeMap,
        n00204
      }
    },
    // 检测数据输入格式是否正确 须根据项目需求修改
    handleCheckInput() {
      const {
        n00177, // 畜禽种类
        n00180, // 养殖规模
        n00161, // 免疫头数
        n00109, // 死亡数量
        n00197, // 疫苗种类
        n00199, // 疫苗批号
        n00198, // 治疗情况
        n00200, // 免疫剂量
        n00205, // 防疫员
        n00204, // 申请补助项目
        n00241, // 补助标准
        aae019 // 发放金额
      } = this.projectDeclareInfo
      if (!n00177) {
        showModal('请输入畜禽种类')
        return false
      }
      if (!n00180) {
        showModal('请输入养殖规模')
        return false
      }
      if (!n00161) {
        showModal('请输入免疫头数')
        return false
      }
      if (!n00197) {
        showModal('请输入疫苗种类')
        return false
      }
      if (!n00199) {
        showModal('请输入疫苗批号')
        return false
      }
      if (!n00200) {
        showModal('请输入免疫剂量')
        return false
      }
      if (!n00205) {
        showModal('请输入防疫员')
        return false
      }
      if (!n00204) {
        showModal('请选择申请补助项目')
        return false
      }
      if (!n00198 && n00204 == '1') {
        showModal('请输入治疗情况')
        return false
      }
      if (!n00109 && n00204 == '2') {
        showModal('请输入死亡数量')
        return false
      }
      if (!n00241) {
        showModal('请输入补助标准')
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
        n00177, //畜禽种类
        n00180, //养殖规模
        n00161, //免疫头数
        n00109, //死亡数量
        n00197, //疫苗种类
        n00199, //疫苗批号
        n00198, //治疗情况
        n00200, //免疫剂量
        n00205, //防疫员
        n00204, //申请补助项目
        n00241, // 补助标准
        aae019 //发放金额
      } = this.projectDeclareInfo

      const {
        currentAddress //现居地址
      } = this.basicInfo

      // 扩展字段
      let hb00BizMap = {
        n00041: currentAddress, //现居住地址
        n00177, // 畜禽种类
        n00180, // 养殖规模
        n00161, // 免疫头数
        n00109: n00204 === '2' ? n00109 : '0', // 死亡数量
        n00197, // 疫苗种类
        n00199, // 疫苗批号
        n00198: n00204 === '1' ? n00198 : '无', // 治疗情况
        n00200, // 免疫剂量
        n00205, // 防疫员
        n00204, // 申请补助项目
        n00241, // 补助标准
        aae019: 0, // 发放金额
        chb01m: '1', // 发放类型 正常发放
        aae209: useGetCurrentDate('month', '') // 发放期号 当前申报年月
      }

      this.handleDeclareData(hb00BizMap, '0')
    }
  }
}
</script>

<style lang="scss" scoped></style>
