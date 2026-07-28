<!-- 乡村医生生活补贴及在岗保险缴纳补助 卫生健康委 -->
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
            <block v-if="isWorking">
              <div class="cell-item required">
                <div class="key">当年缴费金额(元)</div>
                <div class="value">
                  <input
                    type="number"
                    maxlength="6"
                    v-model="projectDeclareInfo.w00018"
                    placeholder="请输入当年缴费金额"
                  />
                </div>
              </div>
              <div class="cell-item required">
                <div class="key">申请养老保险缴费补助(元)</div>
                <div class="value">
                  <input
                    type="number"
                    maxlength="6"
                    v-model="projectDeclareInfo.w00013"
                    placeholder="请输入补助金额"
                  />
                </div>
              </div>
            </block>
            <block v-else>
              <ComponentDeclareRadio
                label="国家机关(含企事业单位)录聘用情况"
                v-model="projectDeclareInfo.w00026"
                :range="codeMap.yesorno"
              ></ComponentDeclareRadio>

              <div class="cell-item required">
                <div class="key">申请补助金额(元)</div>
                <div class="value">
                  <input
                    type="number"
                    maxlength="6"
                    v-model="projectDeclareInfo.w00017"
                    placeholder="请输入补助金额"
                  />
                </div>
              </div>
              <div class="cell-item required disabled">
                <div class="key">从事乡村医生工作累计年限</div>
                <div class="value">
                  {{ projectDeclareInfo.w00031 || '暂无' }}
                </div>
              </div>
              <div class="cell-item required disabled">
                <div class="key">折算工作年限</div>
                <div class="value">
                  {{ projectDeclareInfo.w00022 || '暂无' }}
                </div>
              </div>
            </block>
          </div>
        </div>
      </ComponentPanel>
    </div>

    <!-- 在岗 简历 -->
    <div class="space-top-wrapper" v-if="isWorking">
      <ComponentPanel title="从事乡村医生工作简历">
        <ComponentDeclareCard
          :renderData="workExperienceOnDutyList"
          type="20457_o"
          addButtonName="添加工作简历"
          @change="handleChangeCardList"
        ></ComponentDeclareCard>
      </ComponentPanel>
    </div>

    <!-- 离岗 简历 -->
    <div class="space-top-wrapper" v-else>
      <ComponentPanel title="从事乡村医生工作简历">
        <ComponentDeclareCard
          :renderData="workExperienceLeaveList"
          type="20457_l"
          addButtonName="添加工作简历"
          @change="handleChangeCardList"
        ></ComponentDeclareCard>
      </ComponentPanel>
    </div>

    <!-- 有效从业证件 -->
    <div class="space-top-wrapper">
      <ComponentPanel title="有效从业证件">
        <div class="panel-content">
          <div class="cell-items">
            <ComponentDeclarePicker
              label="证件类型"
              idName="w00027"
              :range="employmentCertificateRange"
              placeholder="请选择证件类型"
              rangeKey="name"
              valueKey="value"
              v-model="projectDeclareInfo.w00027"
              @change="getPickerValueDesc"
            ></ComponentDeclarePicker>
            <div
              class="cell-item required"
              v-if="isShowEmploymentCertificateNameInput"
            >
              <div class="key">证件名称</div>
              <div class="value">
                <input
                  type="text"
                  maxlength="10"
                  v-model="projectDeclareInfo.w00027_name"
                  placeholder="请输入证件名称"
                />
              </div>
            </div>
            <div class="cell-item required">
              <div class="key">发证机关</div>
              <div class="value">
                <input
                  type="text"
                  maxlength="10"
                  v-model="projectDeclareInfo.w00023"
                  placeholder="请输入发证机关，例如：民政局"
                />
              </div>
            </div>
            <ComponentDeclarePicker
              label="发证日期"
              mode="date"
              placeholder="请选择发证日期"
              v-model="projectDeclareInfo.w00024"
            ></ComponentDeclarePicker>
            <div class="cell-item required">
              <div class="key">证书编号</div>
              <div class="value">
                <input
                  type="text"
                  maxlength="20"
                  v-model="projectDeclareInfo.w00025"
                  placeholder="请输入证书编号"
                />
              </div>
            </div>
          </div>
        </div>
      </ComponentPanel>
    </div>

    <!-- 养老保险参保情况 -->
    <div class="space-top-wrapper" v-if="isWorking">
      <ComponentPanel title="养老保险参保情况">
        <div class="panel-content">
          <div class="cell-items">
            <ComponentDeclarePicker
              label="参加养老保险情况"
              idName="w00032"
              :range="codeMap.yesorno"
              placeholder="请选择"
              v-model="projectDeclareInfo.w00032"
              @change="getPickerValueDesc"
            ></ComponentDeclarePicker>
            <block v-if="isAddEndowmentInsurance">
              <ComponentDeclarePicker
                label="养老保险种类"
                idName="w00012"
                :range="endowmentInsuranceRange"
                rangeKey="name"
                valueKey="name"
                placeholder="请选择养老保险种类"
                v-model="projectDeclareInfo.w00012"
                @change="getPickerValueDesc"
              ></ComponentDeclarePicker>
            </block>

            <block v-if="isAddEndowmentInsurance">
              <ComponentDeclarePicker
                label="缴费方式"
                idName="w00033"
                :range="paymentMethodRange"
                rangeKey="name"
                valueKey="name"
                placeholder="请选择缴费方式"
                v-model="projectDeclareInfo.w00033"
                @change="getPickerValueDesc"
              ></ComponentDeclarePicker>
            </block>
            <div class="cell-item required" v-if="isAddEndowmentInsurance">
              <div class="key">已缴费年限(年)</div>
              <div class="value">
                <input
                  type="number"
                  maxlength="6"
                  v-model="projectDeclareInfo.w00014"
                  placeholder="请输入已缴费年限"
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
import ComponentDeclareCard from '../components/ez-declare-card/ez-declare-card.vue'
import ComponentDeclarePersonnel from '@/components/project/ez-declare-personnel/ez-declare-personnel.vue'
import ComponentDeclareRadio from '@/components/project/ez-declare-radio/ez-declare-radio.vue'
import ComponentDeclarePicker from '@/components/project/ez-declare-picker/ez-declare-picker.vue'

import { useDeclare } from '@/mixins'

import { showModal } from '@/utils/uni-api'

export default {
  name: 'pageDeclare20457',
  data() {
    return {
      // 基本信息 渲染配置
      renderObj: {
        idCard: true, // 身份证
        userName: true, // 姓名
        tel: true, // 联系电话
        education: true, // 学历
        gender: true, // 性别
        nation: true, // 民族
        birthday: true, // 出生日期
        currentAddress: true, // 现居住地址
        permanentAddress: true, // 户籍地址
      },
      // 自定义添加一些属性 防止双向绑定失败 例如 picker组件之类
      projectDeclareInfo: {
        w00026: '',
        aae006: '',
        w00034: '',
      },
      employmentCertificateRange: [], // 从业证件类型
      workExperienceOnDutyList: [], // 在岗工作简历
      workExperienceLeaveList: [], // 离岗工作简历
      // 养老保险种类
      endowmentInsuranceRange: [
        {
          id: '1',
          value: '1',
          name: '城乡居民保险',
        },
        {
          id: '2',
          value: '2',
          name: '企业职工保险',
        },
      ],
      // 养老保险缴纳方式
      paymentMethodRange: [
        {
          id: '1',
          value: '1',
          name: '个人全额缴纳',
        },
        {
          id: '2',
          value: '2',
          name: '单位缴纳',
        },
      ],
    }
  },
  components: {
    ComponentButton,
    ComponentPanel,
    ComponentDeclare,
    ComponentDeclareStep,
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
    // 根据开始时间和结束时间计算累计年月
    getTotalTime(startTime, endTime) {
      let str = ''
      let s = startTime.split('-')
      let e = endTime.split('-')
      let y = parseInt(e[0]) - parseInt(s[0])
      let m = parseInt(e[1]) - parseInt(s[1])
      if (m < 0) {
        m = 12 + m
        y = y - 1
      }

      str = y + '年' + m + '月'
      return str
    },
    // card 组件 change
    handleChangeCardList(type, data) {
      if (type === '20457_o') {
        this.workExperienceOnDutyList = [...data]
      }
      if (type === '20457_l') {
        this.workExperienceLeaveList = [...data]
      }
    },
    // 获取 从业 证件类型
    getEmploymentCertificateTypes(type) {
      // 在岗
      if (type === '3248') {
        this.employmentCertificateRange = [
          {
            id: '01',
            value: '01',
            name: '医师资格证书',
          },
          {
            id: '02',
            value: '02',
            name: '执业（助理）医师证书',
          },
          {
            id: '03',
            value: '03',
            name: '乡村医生证',
          },
        ]
      }
      // 离岗
      if (type === '3249') {
        this.employmentCertificateRange = [
          {
            id: '01',
            value: '01',
            name: '医师资格证书',
          },
          {
            id: '02',
            value: '02',
            name: '执业（助理）医师证书',
          },
          {
            id: '03',
            value: '03',
            name: '乡村医生执业证',
          },
          {
            id: '04',
            value: '04',
            name: '其他',
          },
        ]
      }
    },
    // 检测数据输入格式是否正确 须根据项目需求更改
    handleCheckInput() {
      // 是否在岗
      const isWorking = this.isWorking
      // 在岗 工作简历
      const workExperienceOnDutyList = this.workExperienceOnDutyList
      // 离岗 工作简历
      const workExperienceLeaveList = this.workExperienceLeaveList
      // 是否显示从业证件名称输入框
      const isShowEmploymentCertificateNameInput =
        this.isShowEmploymentCertificateNameInput
      // 是否参加养老保险
      const isAddEndowmentInsurance = this.isAddEndowmentInsurance

      const {
        w00018, // 当年缴费金额
        w00013, // 养老金补助金额

        w00026, // 录聘用情况
        w00017, // 申请补助金额

        w00012, // 养老保险种类
        w00032, // 参加养老保险情况
        w00033, // 缴费方式
        w00014, // 已缴费年限

        w00027, // 有效从业证件类型
        w00027_name, // 有效从业证件名称
        w00023, // 发证机关
        w00024, // 发证日期
        w00025, // 证书编号
      } = this.projectDeclareInfo

      if (isWorking) {
        if (!w00018) {
          showModal('请输入当年缴费金额')
          return false
        }
        if (!w00013) {
          showModal('请输入申请养老保险缴费补助金额')
          return false
        }
        if (!workExperienceOnDutyList || workExperienceOnDutyList.length < 1) {
          showModal('请添加从事乡村医生工作简历')
          return false
        }
      } else {
        if (!w00026) {
          showModal('请选择国家机关（含企事业单位）录聘用情况')
          return false
        }
        if (!w00017) {
          showModal('请输入申请补助金额')
          return false
        }
        if (!workExperienceLeaveList || workExperienceLeaveList.length < 1) {
          showModal('请添加从事乡村医生工作简历')
          return false
        }
      }

      // 验证有效从业证件
      if (!w00027) {
        showModal('请选择证件类型')
        return false
      }
      if (isShowEmploymentCertificateNameInput && !w00027_name) {
        showModal('请输入证件名称')
        return false
      }
      if (!w00023) {
        showModal('请输入发证机关')
        return false
      }
      if (!w00024) {
        showModal('请输入发证日期')
        return false
      }
      if (!w00025) {
        showModal('请输入证书编号')
        return false
      }

      // 养老保险情况验证
      if (isWorking) {
        if (!w00032) {
          showModal('请选择参加养老保险情况')
          return false
        }
        if (!w00012 && isAddEndowmentInsurance) {
          showModal('请选择养老保险种类')
          return false
        }
        if (!w00033 && isAddEndowmentInsurance) {
          showModal('请选择缴费方式')
          return false
        }
        if (!w00014 && isAddEndowmentInsurance) {
          showModal('请输入缴费年限')
          return false
        }
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
      const isWorking = this.isWorking
      const declareType = this.declareType
      const workExperienceOnDutyList = this.workExperienceOnDutyList
      const workExperienceLeaveList = this.workExperienceLeaveList

      const {
        currentAddress, // 现居住地址
        nation,
        education,
        birthday,
      } = this.basicInfo

      const {
        w00034, // 现居住地址
        aac005, // 民族
        w00016, // 学历
        w00030, // 出生日期

        w00023, // 发证机关
        w00024, // 发证日期
        w00025, // 证书编号
        w00027, // 证件名称类型
        w00027_name, // 证件名称

        w00018, // 当年缴费金额
        w00013, // 养老金补助金额

        w00026, // 录聘用情况
        w00031, // 工作累计年限
        w00017, // 申请补助金额
        w00022, // 折算工作年限

        w00012, // 养老保险种类
        w00032, // 参加养老保险情况
        w00033, // 缴费方式
        w00014, // 已缴费年限
      } = this.projectDeclareInfo

      // 扩展字段
      const hb00BizMap = {
        w00034: currentAddress, // 现居住地址
        aac005: nation, // 民族
        w00016: education, // 学历
        w00030: birthday, // 出生日期
        w00003: '四川省内江市', // 籍贯

        w00023, // 发证机关
        w00024, // 发证日期
        w00025, // 证书编号
        w00027: this.isShowEmploymentCertificateNameInput
          ? w00027_name
          : w00027, // 证件名称

        w00018, // 当年缴费金额
        w00013, // 养老金补助金额

        w00026, // 录聘用情况
        w00031, // 工作累计年限
        w00017, // 申请补助金额
        w00022, // 折算工作年限

        w00012, // 养老保险种类
        w00032, // 参加养老保险情况
        w00033, // 缴费方式
        w00014, // 已缴费年限
      }

      // 工作经历
      let workExperienceList = []
      if (isWorking) {
        let arr = []
        workExperienceOnDutyList.map((item) => {
          arr.push({
            chp023: item.address, // 单位地点
            chp027: item.person, // 证明人
            chp024: item.start,
            chp025: item.end,
          })
        })
        workExperienceList = [...arr]
      } else {
        let arr = []
        workExperienceLeaveList.map((item) => {
          arr.push({
            chp023: item.address, // 单位地点
            chp027: item.person, // 证明人
            chp024: item.start,
            chp025: item.end,
            chp026: item.totalTime,
          })
        })
        workExperienceList = [...arr]
      }

      this.handleDeclareData(hb00BizMap, '1', workExperienceList)
    },
  },
  computed: {
    // 是否为在岗医生
    isWorking() {
      let result = false
      const personnelInfo = this.personnelInfo
      const personnelList = this.personnelList
      personnelList.map((item, index) => {
        if (item.cac102 === personnelInfo.cac102) {
          if (index === 0) {
            result = true
          } else {
            result = false
          }
        }
      })
      return result
    },
    // 是否显示证件名称输入框
    isShowEmploymentCertificateNameInput() {
      let result = false
      const projectDeclareInfo = this.projectDeclareInfo
      if (projectDeclareInfo.w00027 === '04') {
        result = true
      }
      return result
    },
    // 是否参加养老保险
    isAddEndowmentInsurance() {
      let result = false
      const projectDeclareInfo = this.projectDeclareInfo
      if (projectDeclareInfo.w00032_desc === '是') {
        result = true
      }
      return result
    },
  },
  watch: {
    // 监听人员类别改变 获取不同的从业类型
    'personnelInfo.cac102': {
      handler(val) {
        if (val) {
          this.getEmploymentCertificateTypes(val)
        }
      },
      immediate: true,
    },
    // 监听离岗乡村医生工作简历改变 计算工作年限
    workExperienceLeaveList: {
      handler(val) {
        let year = 0
        let month = 0
        if (val && val.length > 0) {
          val.map((item) => {
            let s = item.start.split('-')
            let e = item.end.split('-')
            let y = parseInt(e[0]) - parseInt(s[0])
            let m = parseInt(e[1]) - parseInt(s[1]) + 1
            if (m < 0) {
              m = 12 + m
              y = y - 1
            }
            if (m >= 12) {
              m = 0
              y = y + 1
            }
            year += y
            month += m
          })
        }
        year = year + Math.floor(month / 12)
        month = month - Math.floor(month / 12) * 12
        this.projectDeclareInfo = {
          ...this.projectDeclareInfo,
          w00031: `${year}年${month}月`,
          w00022: `${(year + month / 12).toFixed(2)}年`,
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
