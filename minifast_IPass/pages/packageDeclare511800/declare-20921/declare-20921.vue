<!-- 学院奖学金（教育局） -->
<template>
  <view class="declare" v-if="userInfo.token">
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
        @changeDataByIdCard="handleChangeDataByIdCard">
      </ComponentDeclare>
    </div>

    <!-- start 需要修改的地方开始 在以下代码中根据项目需求更改 上面代码勿动 -->
    <!-- 人员类别 -->
    <div class="personnel-type-wrapper space-top-wrapper">
      <ComponentDeclarePersonnel
        :renderData="personnelList"
        :isOpenCategoryNotes="true"
        @change="handleChangePersonnelInfo"></ComponentDeclarePersonnel>
    </div>
    <!-- 申报信息 -->
    <div class="space-top-wrapper">
      <ComponentPanel title="申报信息">
        <div class="panel-content">
          <div class="cell-items">
            <ComponentSelectPermanentAddress
              label="学校信息"
              placeholder="请选择学校信息"
              :addressFilter="['101238']"
              :addressParams="{ orgid: '101167', orglevel: '3', costomno: 'school' }"
              v-model="schoolDetail"
              @change="handleSchoolChange">
            </ComponentSelectPermanentAddress>

            <ComponentDeclarePicker
              label="申报阶段"
              idName="j00191"
              :range="codeMap.j00191"
              placeholder="请选择申报阶段"
              v-model="projectDeclareInfo.j00191"></ComponentDeclarePicker>

            <div class="cell-item required">
              <div class="key">专业年级排名</div>
              <div class="value">
                <input
                  type="number"
                  maxlength="4"
                  v-model="grade.one"
                  placeholder="请输入专业年级排名" />
              </div>
            </div>

            <div class="cell-item required">
              <div class="key">专业年级总人数</div>
              <div class="value">
                <input
                  type="number"
                  maxlength="4"
                  v-model="grade.all"
                  placeholder="请输入专业年级总人数" />
              </div>
            </div>

            <div class="cell-item required disabled">
              <div class="key">成绩排名</div>
              <div class="value">
                {{ grade.one && grade.all ? grade.one + '/' + grade.all : '暂无' }}
              </div>
            </div>
<!-- <div class="cell-item required disabled">
            <ComponentDeclarePicker
              label="获奖档次"
              idName="j00193"
              :range="codeMap.j00193"
              placeholder="请选择获奖档次"
              v-model="projectDeclareInfo.j00193"></ComponentDeclarePicker>
   </div> -->
            						<div class="cell-item required disabled">
						  <div class="key">获奖档次</div>
						  <div class="value">
						    {{ projectDeclareInfo.j00193 || '暂无' }}
						  </div>
						</div>

            <div class="cell-item required disabled">
              <div class="key">申请时间</div>
              <div class="value">
                {{ projectDeclareInfo.j00158 || '暂无' }}
              </div>
            </div>

            <div class="cell-item required disabled">
              <div class="key">补贴金额</div>
              <div class="value">
                {{ aae019 || '暂无' }}
              </div>
            </div>
          </div>
        </div>
      </ComponentPanel>
    </div>

    <!-- end  需要修改的地方结束 在以下代码中根据项目需求更改 下面代码勿动-->
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
import ComponentSelectCurrentAddress from '@/components/project/ez-select-current-address/ez-select-current-address.vue'

import ComponentDeclarePersonnel from '@/components/project/ez-declare-personnel/ez-declare-personnel.vue'
import ComponentDeclareRadio from '@/components/project/ez-declare-radio/ez-declare-radio.vue'
import ComponentDeclarePicker from '@/components/project/ez-declare-picker/ez-declare-picker.vue'

import { useDeclare } from '@/mixins'

import { getDate } from '@/utils/get'
import { getCodeListByCodeName } from '@/utils/custom-api'
import { showModal } from '@/utils/uni-api'

export default {
  name: 'pageDeclare20921',
  data() {
    return {
      // 基本信息 渲染配置
      renderObj: {
        idCard: true, // 身份证
        userName: true, // 姓名
        gender: true, // 性别
        nation: true, // 民族
        permanentAddress: false, // 户籍地址
        tel: true, // 联系电话
      },
      projectDeclareInfo: {
        j00158: getDate('day'), // 申报时间
        j00191: '', //申报阶段
        j00193: '', //获奖档次
      },
      grade: {
        one: '',
        all: '',
      },
      schoolRange: [], // 学校
      gradeRange: [], // 二级学院
      classRange: [], // 班级
      // 学校信息
      school: {
        j00000: '', // 学校所属区县
        chb017: '', // 学校名称
        chb018: '', // 二级院系名称
        chb019: '', // 班级
      },
      schoolDetail: '',
    }
  },
  components: {
    ComponentButton,
    ComponentPanel,
    ComponentDeclare,
    ComponentDeclareStep,
    ComponentSelectPermanentAddress,
    ComponentSelectCurrentAddress,
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
      let j00191 = [] // 申报阶段
      let j00193 = [] // 获奖档次
      try {
        j00191 = await getCodeListByCodeName('j00191')
      } catch (err) {
        console.error('code table j00191 error：', err)
      }

      try {
        j00193 = await getCodeListByCodeName('j00193')
      } catch (err) {
        console.error('code table j00193 error：', err)
      }
      this.codeMap = {
        ...this.codeMap,
        j00191,
        j00193,
      }
    },
    // 处理学校获取值
    handleSchoolChange(value) {
      this.school = {
        ...this.school,
        chb017: value[0].orgid,
        chb018: value[1].orgid,
        chb019: value[2].orgid,
      }
    },

    // 检测数据输入格式是否正确 须根据项目需求更改
    handleCheckInput() {
      const {
        aac004, //性别
        aac005, //民族

        j00191, //申报阶段
        j00192, //二级学院名称
        j00012desc, //班级
        j00154, //成绩排名
        j00193, //获奖档次
        j00158, //申请时间
      } = this.projectDeclareInfo

      const { j00000, chb017, chb018, chb019 } = this.school

      if (!chb017) {
        showModal('请选择完整的学校信息')
        return false
      }

      if (!chb018) {
        showModal('请选择完整的学校信息')
        return false
      }

      if (!chb019) {
        showModal('请选择完整的学校信息')
        return false
      }

      if (!j00191) {
        showModal('请选择申报阶段')
        return false
      }

      // if (!j00192) {
      //   showModal('请输入二级学院名称')
      //   return false
      // }
      // if (!j00012desc) {
      //   showModal('请输入班级')
      //   return false
      // }
      if (!this.grade.one) {
        showModal('请输入专业年级排名')
        return false
      }
      if (!this.grade.one) {
        showModal('请输入专业年级总人数')
        return false
      }
      // if (!j00154) {
      //   showModal('请输入成绩排名')
      //   return false
      // }
      if (!j00193) {
        showModal('获奖等级不足以申报奖学金')
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
      const { gender, nation, permanentAddress } = this.basicInfo
      const {
        j00191, //申报阶段
        j00192, //二级学院名称
        j00012desc, //班级
        j00154, //成绩排名
        j00193, //获奖档次
        j00158, //申请时间
      } = this.projectDeclareInfo

      const { j00000, chb017, chb018, chb019 } = this.school

      const addressInfo = {
        chb015: '101167',
        chb017,
        chb018,
        chb019,
      }

      // 扩展字段
      const hb00BizMap = {
        aac004: gender, //性别
        aac005: nation, //民族
        aae006: permanentAddress,

        j00191, //申报阶段
        j00154: this.grade.one + '/' + this.grade.all, //成绩排名
        j00193, //获奖档次
        j00158, //申请时间
        aae019: this.aae019,
      }

      this.handleDeclareData(hb00BizMap, '0', null, null, addressInfo)
    },
  },
  computed: {
    aae019() {
      let { j00191, j00193 } = this.projectDeclareInfo
      if (j00191 && j00193) {
        // 中职
        if (j00191 == '1') {
          if (j00193 == '1') {
            return 500
          }
          if (j00193 == '2') {
            return 300
          }
          if (j00193 == '3') {
            return 200
          }
        }
        if (j00191 == '2') {
          if (j00193 == '1') {
            return 800
          }
          if (j00193 == '2') {
            return 500
          }
          if (j00193 == '3') {
            return 300
          }
        }
      }
      return 0
    },
    getJ00193() {
      let j00193 = ''
      let { one, all } = this.grade
      if (one && all) {
        if (0 < all && all < 50) {
          if (one == 1) {
            j00193 = 1
          } else if (one == 2) {
            j00193 = 2
          } else if (one == 3 ) {
            j00193 = 3
          } else {
            j00193 = ''
          }
        } else {
          if (one / all <= 0.02) {
            j00193 = 1
          } else if (one / all <= 0.05) {
            j00193 = 2
          } else if (one / all <= 0.1) {
            j00193 = 3
          } else {
            j00193 = ''
          }
        }
      }
      this.projectDeclareInfo = {
        ...this.projectDeclareInfo,
        j00193: j00193 + '',
      }
      return j00193
    },
  },
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
