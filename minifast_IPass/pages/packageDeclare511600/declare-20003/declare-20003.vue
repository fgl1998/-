<!-- 县级扶贫教育救助基金（教育局） -->
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
        :isOpenOCR="true"
		permanentAddressLabel='受理地址'
		permanentAddressPlaceholder='请选择申报受理地址'
        :projectName="chi031_desc"
        @changeDeclareType="handleChangeDeclareType"
        @changeBasicInfo="handleChangeBasicInfo"
        @changeCodeMap="handleChangeCodeMap"
        @changeAgentInfo="handleChangeAgentInfo"
        @changeDataByIdCard="handleChangeDataByIdCard"
        :addressFilter="['511621']"
      >
      </ComponentDeclare>
    </div>

    <!-- 申报信息 -->
    <div class="space-top-wrapper">
      <ComponentPanel title="申报信息">
        <div class="panel-content">
          <div class="cell-items">
            <ComponentDeclarePicker
              label="入学时间"
              mode="date"
              fields="day"
              :endTime="today_d"
              placeholder="请选择入学时间"
              v-model="projectDeclareInfo.chb0g1"
            ></ComponentDeclarePicker>

            <ComponentDeclarePicker
              label="学段"
              idName="j00010"
              :range="codeMap.j00010"
              placeholder="请选择学段"
              v-model="projectDeclareInfo.j00010"
              @change="getPickerValueDesc"
            ></ComponentDeclarePicker>

            <div class="cell-item required">
              <div class="key">学籍号</div>
              <div class="value">
                <input
                  type="text"
                  maxlength="20"
                  v-model="projectDeclareInfo.j00018"
                  placeholder="请输入学籍号"
                />
              </div>
            </div>

            <ComponentDeclarePicker
              label="受助年度"
              mode="date"
              fields="year"
              :startTime="today_y"
              placeholder="请选择受助年度"
              v-model="projectDeclareInfo.j00161"
            ></ComponentDeclarePicker>

            <ComponentDeclarePicker
              label="贫困类型"
              idName="j00162"
              :range="codeMap.j00162"
              placeholder="请选择贫困类型"
              v-model="projectDeclareInfo.j00162"
              @change="getPickerValueDesc"
            ></ComponentDeclarePicker>

            <ComponentDeclarePicker
              label="与户主关系"
              idName="j00160"
              :range="codeMap.l00037"
              placeholder="请选择与户主关系"
              v-model="projectDeclareInfo.j00160"
              @change="getPickerValueDesc"
            ></ComponentDeclarePicker>
          </div>
        </div>
      </ComponentPanel>
    </div>

    <!-- 户主信息 -->
    <div class="space-top-wrapper">
      <ComponentPanel title="户主信息">
        <div class="panel-content">
          <div class="cell-items">
            <div class="cell-item required">
              <div class="key">姓名</div>
              <div class="value">
                <input
                  type="text"
                  v-model="projectDeclareInfo.j03501"
                  placeholder="请输入户主的姓名"
                />
              </div>
            </div>
            <div class="cell-item required">
              <div class="key">身份证号</div>
              <div class="value">
                <input
                  type="idcard"
                  maxlength="18"
                  v-model="projectDeclareInfo.j03502"
                  @blur="handleBlur01"
                  placeholder="请输入户主的身份证号"
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
import ComponentDeclarePicker from '@/components/project/ez-declare-picker/ez-declare-picker.vue'

import { useDeclare } from '@/mixins'

import { getIsDev, getDate } from '@/utils/get'
import { checkIDCard } from '@/utils/check'
import { getCodeListByCodeName } from '@/utils/custom-api'
import { showModal } from '@/utils/uni-api'
export default {
  name: 'pageDeclare20003',
  data() {
    return {
      // 基本信息 渲染配置
      renderObj: {
        idCard: true, // 身份证
        userName: true, // 姓名
        tel: true, // 联系电话
        gender: true, // 性别
        nation: true, // 民族
        permanentAddress: true, // 户籍地址
      },
      // 自定义添加一些属性 防止双向绑定失败 例如 picker组件之类
      projectDeclareInfo: {
        j03501: '',
      },
      today_d: getDate('day'),
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
      let j00010 = [] // 学段
      let j00162 = [] // 贫困类型
      let l00037 = [] // 与户主关系

      try {
        j00010 = await getCodeListByCodeName('j00010')
      } catch (err) {
        if (isDev) {
          console.log('code table j00010 error：', err)
        }
      }

      try {
        j00162 = await getCodeListByCodeName('j00162')
      } catch (err) {
        if (isDev) {
          console.log('code table j00162 error：', err)
        }
      }

      try {
        l00037 = await getCodeListByCodeName('l00037')
      } catch (err) {
        if (isDev) {
          console.log('code table l00037 error：', err)
        }
      }

      this.codeMap = {
        ...this.codeMap,
        j00162,
        j00010,
        l00037,
      }
    },
    // 手动输入户主身份证号 失去焦点监听
    handleBlur01(e) {
      const { value } = e.target
      const checkResult = checkIDCard(value)
      if (checkResult.status === '0') {
        showModal(checkResult.msg)
      }
    },
    // 手动输入户主身份证号 失去焦点监听
    handleBlurM00004(e) {
      const { value } = e.target
      const checkResult = checkIDCard(value)
      if (checkResult.status === '0') {
        showModal(checkResult.msg)
      }
    },
    // 两位小数数字验证
    handleCheckNumber(e, id) {
      let { value } = e.target
      if (value) {
        let res = value
          .replace(/[^\d+(\.\d+)?$]/, '')
          .replace('.', '$#$')
          .replace(/\./g, '')
          .replace('$#$', '.')
        let index = res.indexOf('.')
        if (index > 0 && index + 3 < res.length) {
          res = res.slice(0, index + 3)
        }
        let _this = this
        this.$nextTick(function () {
          _this.projectDeclareInfo[id] = res
        })
      }
    },
    // 检测数据输入格式是否正确 须根据项目需求更改
    handleCheckInput() {
      const {
        aac004, //性别
        aac005, //民族
        j00004, //学生户籍所在地

        chb0g1, //入学时间
        j00010, //学段
        j00018, //学生完整学籍号
        j00161, //受助年度
        j00162, //贫困类型
        j00160, //与户主关系

        j03501, //户主名
        j03502, //户主身份证号
      } = this.projectDeclareInfo

      if (!chb0g1) {
        showModal('请选择入学时间')
        return false
      }

      if (!j00010) {
        showModal('请选择学段')
        return false
      }
      if (!j00018) {
        showModal('请输入学生完整学籍号')
        return false
      }
      if (!j00161) {
        showModal('请选择受助年度')
        return false
      }
      if (!j00162) {
        showModal('请选择贫困类型')
        return false
      }
      if (!j00160) {
        showModal('请选择与户主关系')
        return false
      }
      if (!j03501) {
        showModal('请输入户主名')
        return false
      }
      if (!j03502) {
        showModal('请输入户主身份证号')
        return false
      } else {
        const checkResult = checkIDCard(j03502, '户主身份证号')
        if (checkResult.status === '0') {
          showModal(checkResult.msg)
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

      const {
        gender, // 性别
        nation,
        permanentAddress,
      } = this.basicInfo

      const {
        aac004, //性别
        aac005, //民族
        j00004, //学生户籍所在地

        chb0g1, //入学时间
        j00010, //学段
        j00018, //学生完整学籍号
        j00161, //受助年度
        j00162, //贫困类型

        j03501, //户主名
        j03502, //户主身份证号
        j00160, //与户主关系
      } = this.projectDeclareInfo

      // 扩展字段
      const hb00BizMap = {
        aac004: gender, //性别
        aac005: nation, //民族
        j00004: permanentAddress, //学生户籍所在地

        chb0g1, //入学时间
        j00010, //学段
        j00018, //学生完整学籍号
        j00161, //受助年度
        j00162, //贫困类型
        j00160, //与户主关系

        j03501, //户主名
        j03502, //户主身份证号
      }

      this.handleDeclareData(hb00BizMap, '0')
    },
  },
  computed: {},
  watch: {},
}
</script>

<style lang="scss" scoped></style>
