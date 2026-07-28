<!-- 义务教育在读残疾儿童生活费补助（残联） -->
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

    <!-- 申报信息 -->
    <div class="space-top-wrapper">
      <ComponentPanel title="申报信息">
        <div class="panel-content">
          <div class="cell-items">
            <div class="cell-item required">
              <div class="key">入读学校</div>
              <div class="value">
                <input
                  type="text"
                  v-model="projectDeclareInfo.c00025"
                  placeholder="请输入入读学校"
                />
              </div>
            </div>
            <div class="cell-item required">
              <div class="key">年级</div>
              <div class="value">
                <input
                  type="text"
                  v-model="projectDeclareInfo.c00144"
                  placeholder="请输入年级"
                />
              </div>
            </div>
            <div class="cell-item required">
              <div class="key">残疾证号</div>
              <div class="value">
                <input
                  type="text"
                  maxlength="20"
                  v-model="projectDeclareInfo.c03601"
                  placeholder="请输入残疾证号"
                />
              </div>
            </div>
          </div>
        </div>
      </ComponentPanel>
    </div>
    <!-- 监护人信息 -->
    <div class="space-top-wrapper">
      <ComponentPanel title="监护人信息">
        <div class="panel-content">
          <div class="cell-items">
            <div class="cell-item required">
              <div class="key">监护人姓名</div>
              <div class="value">
                <input
                  type="text"
                  v-model="projectDeclareInfo.c77501"
                  placeholder="请输入监护人姓名"
                />
              </div>
            </div>
            <div class="cell-item required">
              <div class="key">监护人身份证号</div>
              <div class="value">
                <input
                  type="idcard"
                  maxlength="18"
                  v-model="projectDeclareInfo.c77502"
                  placeholder="请输入监护人身份证号"
                />
              </div>
            </div>
            <div class="cell-item required">
              <div class="key">监护人联系电话</div>
              <div class="value">
                <input
                  type="number"
                  maxlength="11"
                  v-model="projectDeclareInfo.chb0ha"
                  placeholder="请输入监护人联系电话"
                />
              </div>
            </div>
            <ComponentDeclarePicker
              label="监护人与残疾学生关系"
              idName="c00187"
              :range="codeMap.c00056"
              placeholder="请选择与学生关系"
              v-model="projectDeclareInfo.c00187"
              @change="getPickerValueDesc"
            ></ComponentDeclarePicker>
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
import ComponentDeclarePicker from '@/components/project/ez-declare-picker/ez-declare-picker.vue'

import { useDeclare } from '@/mixins'

import { getIsDev } from '@/utils/get'
import { getCodeListByCodeName } from '@/utils/custom-api'
import { showModal } from '@/utils/uni-api'
export default {
  name: 'pageDeclare20368',
  data() {
    return {
      // 基本信息 渲染配置
      renderObj: {
        idCard: true, // 身份证
        userName: true, // 姓名
        tel: true, // 联系电话
        gender: true, // 性别
        age: true, //年龄
        birthday: true, // 出生日期
        permanentAddress: true, // 户籍地址
        nation: true, // 民族
      },

      // 自定义添加一些属性 防止双向绑定失败 例如 picker组件之类

      projectDeclareInfo: {
        c00187: '', // 与申请人关系
      },
    }
  },
  components: {
    ComponentButton,
    ComponentPanel,
    ComponentDeclare,
    ComponentDeclareStep,
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
      let c00056 = [] // 与申请人关系
      try {
        c00056 = await getCodeListByCodeName('c00056')
      } catch (err) {
        if (isDev) {
          console.log('code table c00056 error：', err)
        }
      }
      this.codeMap = {
        ...this.codeMap,
        c00056,
      }
    },
    // 检测数据输入格式是否正确 须根据项目需求更改
    handleCheckInput() {
      const {
        c00025, // 入读学校
        c00144, // 年级
        c77501, // 监护人姓名
        c77502, // 监护人身份证
        chb0ha, // 监护人联系电话
        c00187, // 与申请人关系
        c03601, // 残疾证号
      } = this.projectDeclareInfo
      if (!c00025) {
        showModal('请输入入读学校')
        return false
      }
      if (!c00144) {
        showModal('请输入年级')
        return false
      }
      if (!c77501) {
        showModal('请输入监护人姓名')
        return false
      }
      if (!c77502) {
        showModal('请输入监护人身份证')
        return false
      }
      if (!chb0ha) {
        showModal('请输入监护人联系电话')
        return false
      }
      if (!c00187) {
        showModal('请选择与学生关系')
        return false
      }
      if (!c03601) {
        showModal('请输入残疾证号')
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
        permanentAddress, //户籍地址
        age, //年龄
        nation, // 民族
				gender,
      } = this.basicInfo
      const {
        c03601, // 残疾证号
        c00025, // 入读学校
        c00144, // 年级
        c77501, // 监护人姓名
        c77502, // 监护人身份证
        chb0ha, // 监护人联系电话
        c00187, // 与申请人关系
        aac005, // 民族
      } = this.projectDeclareInfo

      // 扩展字段

      const hb00BizMap = {
        chb00l: age, // 年龄
        c00008: permanentAddress, // 户籍地址
        c03601, // 残疾证号
        c00025, // 入读学校
        c00144, // 年级
        c77501, // 监护人姓名
        c77502, // 监护人身份证
        chb0ha, // 监护人联系电话
        c00187, // 与申请人关系
        aac005: nation, // 民族
				aac004: gender,
      }
      this.handleDeclareData(hb00BizMap, '0')
    },
  },
  computed: {},
  watch: {},
}
</script>

<style lang="scss" scoped>
</style>
