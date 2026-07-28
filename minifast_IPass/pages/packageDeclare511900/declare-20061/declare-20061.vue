<!-- 生态护林员补贴 林业局 -->
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

    <!-- 申报信息 -->
    <div class="space-top-wrapper">
      <ComponentPanel title="申报信息">
        <div class="panel-content">
          <div class="cell-items">
            <!-- 组 -->
            <div class="cell-item required">
              <div class="key">组（社）</div>
              <div class="value">
                <input
                  type="text"
                  v-model="projectDeclareInfo.chb019"
                  placeholder="请输入组（社）"
                />
              </div>
            </div>

            <div class="cell-item required">
              <div class="key">家庭人口数</div>
              <div class="value">
                <input
                  type="number"
                  maxlength="3"
                  v-model="projectDeclareInfo.chb0c2"
                  placeholder="请输入家庭人口数"
                />
              </div>
            </div>
            <div class="cell-item required">
              <div class="key">户主姓名</div>
              <div class="value">
                <input
                  type="text"
                  v-model="projectDeclareInfo.l00058"
                  placeholder="请输入户主姓名"
                />
              </div>
            </div>
            <div class="cell-item required">
              <div class="key">户主身份证号</div>
              <div class="value">
                <input
                  type="idcard"
                  maxlength="18"
                  v-model="projectDeclareInfo.l00060"
                  placeholder="请输入户主身份证号"
                />
              </div>
            </div>
            <ComponentDeclarePicker
              label="申请人与户主关系"
              idName="l00028"
              rangeKey="name"
              valueKey="name"
              :range="relationshipRange"
              placeholder="请选择"
              v-model="projectDeclareInfo.l00059"
            >
            </ComponentDeclarePicker>
            <div class="cell-item required">
              <div class="key">管护面积</div>
              <div class="value">
                <input
                  type="digit"
                  maxlength="10"
                  v-model="projectDeclareInfo.l00051"
                  placeholder="请输入管护面积"
                />
              </div>
            </div>
            <ComponentDeclarePicker
              label="是否自愿申请护林员"
              idName="l00028"
              :range="codeMap.yesorno"
              placeholder="请选择"
              v-model="projectDeclareInfo.l00028"
              @change="getPickerValueDesc"
            >
            </ComponentDeclarePicker>
            <ComponentDeclarePicker
              label="聘用时间"
              idName="l00066"
              mode="date"
              fields="day"
              :endTime="today_d"
              v-model="projectDeclareInfo.l00066"
              placeholder="请选择聘用时间"
            ></ComponentDeclarePicker>
            <ComponentDeclarePicker
              label="解聘时间"
              idName="l00067"
              mode="date"
              fields="day"
              :endTime="today_d"
              v-model="projectDeclareInfo.l00067"
              placeholder="请选择解聘时间"
            ></ComponentDeclarePicker>
            <ComponentDeclarePicker
              label="聘用状态"
              idName="l00068"
              :range="codeMap.l00068"
              placeholder="请选择聘用状态"
              v-model="projectDeclareInfo.l00068"
              @change="getPickerValueDesc"
            >
            </ComponentDeclarePicker>
            <div class="cell-item required">
              <div class="key">基本工资</div>
              <div class="value">
                <input
                  type="number"
                  maxlength="8"
                  v-model="projectDeclareInfo.l00072"
                  placeholder="请输入基本工资"
                />
              </div>
            </div>
            <div class="cell-item required">
              <div class="key">奖励金额</div>
              <div class="value">
                <input
                  type="number"
                  maxlength="8"
                  v-model="projectDeclareInfo.l00073"
                  placeholder="请输入奖励金额"
                />
              </div>
            </div>
            <div class="cell-item required">
              <div class="key">惩罚金额</div>
              <div class="value">
                <input
                  type="number"
                  maxlength="8"
                  v-model="projectDeclareInfo.l00074"
                  placeholder="请输入惩罚金额"
                />
              </div>
            </div>
            <div class="cell-item required">
              <div class="key">应兑金额</div>
              <div class="value">
                <input
                  type="number"
                  maxlength="8"
                  v-model="projectDeclareInfo.l00070"
                  placeholder="请输入应兑金额"
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
import ComponentDeclareCard from '@/components/project/ez-declare-card/ez-declare-card.vue'
import ComponentDeclarePersonnel from '@/components/project/ez-declare-personnel/ez-declare-personnel.vue'
import ComponentDeclareRadio from '@/components/project/ez-declare-radio/ez-declare-radio.vue'
import ComponentDeclarePicker from '@/components/project/ez-declare-picker/ez-declare-picker.vue'

import { useDeclare } from '@/mixins'

import { getIsDev } from '@/utils/get'
import { checkIDCard, checkPhoneNumber } from '@/utils/check'
import { getCodeListByCodeName } from '@/utils/custom-api'
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
        age: true, // 年龄
        gender: true, // 性别
        birthday: true, // 出生日期
        permanentAddress: true, // 户籍地址
      },
      relationshipRange: [
        {
          id: '1',
          name: '本人',
        },
        {
          id: '2',
          name: '夫妻',
        },
        {
          id: '3',
          name: '父子',
        },
        {
          id: '4',
          name: '父女',
        },
        {
          id: '5',
          name: '祖孙',
        },
        {
          id: '6',
          name: '叔侄',
        },
        {
          id: '7',
          name: '兄弟',
        },
        {
          id: '8',
          name: '兄妹',
        },
        {
          id: '9',
          name: '姐妹',
        },
        {
          id: '10',
          name: '其他',
        },
      ],
      projectDeclareInfo: {
        l00059: '',
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
    async getCodeTableCacheData() {
      const isDev = getIsDev() // 当前环境是否是开发环境
      let l00068 = [] // 聘用状态
      try {
        l00068 = await getCodeListByCodeName('l00068')
      } catch (err) {
        if (isDev) {
          console.log('code table chb0gn error：', err)
        }
      }

      this.codeMap = {
        ...this.codeMap,
        l00068,
      }
    },
    // 检测数据输入格式是否正确 须根据项目需求更改
    handleCheckInput() {
      const {
        chb0c2, // 人口数
        l00028, // 是否自愿
        l00058, // 户主姓名
        l00060, // 户主身份证号
        l00059, // 申请人与户主关系
        l00051,
        chb019, // 组
        l00066,
        l00067,
        l00068,
        l00072,
        l00073,
        l00074,
        l00070,
      } = this.projectDeclareInfo

      if (!chb019) {
        showModal('请输入组（社）')
        return false
      }

      if (!chb0c2) {
        showModal('请输入家庭人口数')
        return false
      }
      if (!l00058) {
        showModal('请输入户主姓名')
        return false
      }
      if (!l00060) {
        showModal('请输入户主身份证号')
        return false
      } else {
        const checkResult = checkIDCard(l00060, '户主身份证号')
        if (checkResult.status === '0') {
          showModal(checkResult.msg)
          return false
        }
      }
      if (!l00059) {
        showModal('请选择申请人与户主关系')
        return false
      }
      if (!l00051) {
        showModal('请输入管护面积')
        return false
      }
      if (!l00028) {
        showModal('请选择是否自愿申请护林员')
        return false
      }
      if (!l00066) {
        showModal('请选择聘用时间')
        return false
      }
      if (!l00067) {
        showModal('请选择解聘时间')
        return false
      }
      if (!l00068) {
        showModal('请选择聘用状态')
        return false
      }
      if (!l00072) {
        showModal('请输入基本工资')
        return false
      }
      if (!l00073) {
        showModal('请输入奖励金额')
        return false
      }
      if (!l00074) {
        showModal('请输入惩罚金额')
        return false
      }
      if (!l00070) {
        showModal('请输入应兑金额')
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
        age, // 年龄
      } = this.basicInfo

      const {
        chb0c2, // 人口数
        l00028, // 是否自愿
        chb00l, // 年龄
        l00059, // 申请人与家庭成员关系
        l00060, // 户主身份证号
        l00058, // 户主姓名
        l00051,
        chb019, // 组
        l00066,
        l00067,
        l00068,
        l00072,
        l00073,
        l00074,
        l00070,
      } = this.projectDeclareInfo

      // 扩展字段
      const hb00BizMap = {
        chb0c2, // 人口数
        l00028, // 是否自愿
        chb00l: age, // 年龄
        l00059, //申请人与家庭成员关系
        l00060, // 户主身份证号
        l00058, // 户主姓名
        l00051,
        chb019, // 组
        l00066,
        l00067,
        l00068,
        l00072,
        l00073,
        l00074,
        l00070,
      }

      this.handleDeclareData(hb00BizMap, '0')
    },
  },
  computed: {},
  watch: {},
}
</script>

<style lang="scss" scoped></style>
