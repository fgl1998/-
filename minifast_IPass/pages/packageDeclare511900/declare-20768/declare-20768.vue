<!-- 政府助学奖学金（教育局） -->
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
            <!-- 学历 -->
            <ComponentDeclarePicker
              label="学历"
              idName="j00000"
              :range="codeMap.j00101"
              placeholder="请选择学历"
              v-model="projectDeclareInfo.j00101"
            ></ComponentDeclarePicker>
            <div class="cell-item required">
              <div class="key">学校</div>
              <div class="value">
                <input
                  type="text"
                  v-model="projectDeclareInfo.j00001desc"
                  placeholder="请输入现目前就读学校"
                />
              </div>
            </div>
            <div class="cell-item required">
              <div class="key">年级</div>
              <div class="value">
                <input
                  type="text"
                  v-model="projectDeclareInfo.j00011desc"
                  placeholder="请输入年级"
                />
              </div>
            </div>
            <div class="cell-item required">
              <div class="key">班级</div>
              <div class="value">
                <input
                  type="text"
                  v-model="projectDeclareInfo.j00012desc"
                  placeholder="请输入班级"
                />
              </div>
            </div>

            <div class="cell-item required disabled">
              <div class="key">申报年度</div>
              <div class="value">
                {{ projectDeclareInfo.chb0ge || '暂无' }}
              </div>
            </div>

            <div class="cell-item required disabled">
              <div class="key">申报季度</div>
              <div class="value">
                {{ projectDeclareInfo.j00095_desc || '暂无' }}
              </div>
            </div>
            <!-- <ComponentDeclarePicker
              label="贫困人员类型"
              idName="j00094"
              :range="codeMap.j00094"
              placeholder="请选择贫困人员类型"
              v-model="projectDeclareInfo.j00094"
            ></ComponentDeclarePicker> -->
            <div class="cell-item textarea required">
              <div class="key">贫困举要（贫困缘由）</div>
              <div class="value">
                <textarea
                  maxlength="500"
                  placeholder="请输入贫困缘由"
                  v-model="projectDeclareInfo.j00096"
                ></textarea>
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

import Big from '@/utils/big.min.js'

import { useDeclare } from '@/mixins'

import { getDate, getIsDev, getAge } from '@/utils/get'
import { checkIDCard, checkPhoneNumber } from '@/utils/check'
import { getCodeListByCodeName } from '@/utils/custom-api'
import { showModal } from '@/utils/uni-api'

import { mapGetters } from 'vuex'
export default {
  name: 'pageDeclare20768',
  data() {
    return {
      // 基本信息 渲染配置
      renderObj: {
        idCard: true, // 身份证
        userName: true, // 姓名
        gender: true, // 性别
        // education: true, // 学历
        age: true, // 年龄
        permanentAddress: true, // 户籍地址
        tel: true, // 联系电话
      },
      projectDeclareInfo: {
        chb0ge: getDate('year'), // 申报年度
        j00095: '', // 申报季度
        j00095_desc: '', // 申报季度中文
        j00000: '',
        j00001: '',
        j000011: '',
        j000012: '',
        j00101: '', // 学历
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
    const month = new Date().getMonth() + 1
    if (month >= 1 && month <= 6) {
      this.projectDeclareInfo = {
        ...this.projectDeclareInfo,
        j00095: '1',
        j00095_desc: '春季',
      }
    } else {
      this.projectDeclareInfo = {
        ...this.projectDeclareInfo,
        j00095: '2',
        j00095_desc: '秋季',
      }
    }
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
      let j00101 = [] // 学历
      try {
        j00101 = await getCodeListByCodeName('j00101')
      } catch (err) {
        if (isDev) {
          console.log('code table j00101 error：', err)
        }
      }
      this.codeMap = {
        ...this.codeMap,
        j00101,
      }
    },

    // 检测数据输入格式是否正确 须根据项目需求更改
    handleCheckInput() {
      const {
        j00001desc, // 学校
        j00011desc, // 年级
        j00012desc, // 班级
        chb019, // 组

        j00101, // 学历

        chb0ge, // 申报年度
        j00095, // 申报季度

        aac004, // 性别
        j00044, // 年龄

        chb0go, // 家庭地址

        j00094, // 贫困人员类型
        j00096, // 贫困举要（贫困缘由）
      } = this.projectDeclareInfo
      if (!chb019) {
        showModal('请输入组（社）')
        return false
      }

      if (!j00101) {
        showModal('请选择学历')
        return false
      }
      if (!j00001desc) {
        showModal('请输入现目前就读学校')
        return false
      }
      if (!j00011desc) {
        showModal('请输入年级')
        return false
      }
      if (!j00012desc) {
        showModal('请选择班级')
        return false
      }
      // if (!j00094) {
      //   showModal('请选择贫困人员类型')
      //   return false
      // }
      if (!j00096) {
        showModal('请输入贫困缘由')
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
      const { gender, age, permanentAddress } = this.basicInfo
      const {
        chb019, // 组
        j00000, // 学校所属区县
        j00001, // 学校
        j00001desc, // 学校名称
        j00011, // 年级
        j00011desc, // 年级名称
        j00012, // 班级
        j00012desc, // 班级名称

        chb0ge, // 申报年度
        j00095, // 申报季度
        j00101, // 学历

        aac004, // 性别
        j00044, // 年龄
        chb0go, // 家庭地址

        j00094, // 贫困人员类型
        j00096, // 贫困举要（贫困缘由）
      } = this.projectDeclareInfo

      // 扩展字段
      const hb00BizMap = {
        chb019, // 组
        j00001desc, // 学校名称
        j00011desc, // 年级名称
        j00012desc, // 班级名称

        j00101, // 学历
        chb0ge, // 申报年度
        j00095, // 申报季度

        aac004: gender, // 性别
        j00044: age, // 年龄

        chb0go: permanentAddress, // 家庭地址

        // j00094, // 贫困人员类型
        j00096, // 贫困举要（贫困缘由）
      }

      this.handleDeclareData(hb00BizMap, '0')
    },
  },
  computed: {},
  watch: {},
}
</script>

<style lang="scss" scoped>
.declare-info-wrapper {
  margin-top: 30rpx;
}
.input-tip {
  background-color: #fff7e7;
  border-radius: 4rpx;
  padding: 12rpx;
  font-size: 24rpx;
  line-height: 32rpx;
  color: #e49904;
  position: relative;
}
</style>
