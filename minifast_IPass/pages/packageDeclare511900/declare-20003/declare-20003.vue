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
        :projectName="chi031_desc"
        @changeDeclareType="handleChangeDeclareType"
        @changeBasicInfo="handleChangeBasicInfo"
        @changeCodeMap="handleChangeCodeMap"
        @changeAgentInfo="handleChangeAgentInfo"
        @changeDataByIdCard="handleChangeDataByIdCard"
      >
      </ComponentDeclare>
    </div>

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
            <!-- <div class="cell-item required">
              <div class="key">组</div>
              <div class="value">
                <input
                  type="text"
                  v-model="projectDeclareInfo.chb019"
                  placeholder="请输入组"
                />
              </div>
            </div> -->

            <ComponentDeclarePicker
              label="学段"
              idName="j00010"
              :range="codeMap.j00010"
              v-model="projectDeclareInfo.j00010"
              placeholder="请选择学段"
            ></ComponentDeclarePicker>

            <!-- 学校所属区县 -->
            <!-- 						<ComponentDeclarePicker
						  label="学校所属区县"
						  idName="j00000"
						  :range="districtRange"
						  rangeKey="orgname"
						  valueKey="orgid"
						  placeholder="请选择学校所属区县"
						  v-model="projectDeclareInfo.j00000"
						  @change="handlePickerChange"
						></ComponentDeclarePicker> -->

            <!-- 学校 -->

            <div class="cell-item required">
              <div class="key">学校</div>
              <div class="value">
                <input
                  type="text"
                  v-model="projectDeclareInfo.j00001"
                  placeholder="请输入学校"
                />
              </div>
            </div>

            <!-- 年级 -->
            <div class="cell-item required">
              <div class="key">年级</div>
              <div class="value">
                <input
                  type="text"
                  v-model="projectDeclareInfo.j00011"
                  placeholder="请输入年级"
                />
              </div>
            </div>

            <ComponentDeclarePicker
              label="是否巴中市内就读学校"
              idName="j00178"
              :range="codeMap.yesorno"
              v-model="projectDeclareInfo.j00178"
              placeholder="请选择"
            ></ComponentDeclarePicker>

            <div class="cell-item required">
              <div class="key">户主姓名</div>
              <div class="value">
                <input
                  type="text"
                  v-model="projectDeclareInfo.j03501"
                  placeholder="请输入户主姓名"
                />
              </div>
            </div>

            <div class="cell-item required">
              <div class="key">户主身份证号</div>
              <div class="value">
                <input
                  type="text"
                  maxlength="18"
                  v-model="projectDeclareInfo.j03502"
                  placeholder="请输入户主身份证号"
                  @blur="handleBlurM00004"
                />
              </div>
            </div>

            <!-- 						<ComponentDeclarePicker
						  label="申报缘由"
						  idName="j00098"
							:range="codeMap.j00098"
						  v-model="projectDeclareInfo.j00098"
							placeholder="请选择申报缘由"
						></ComponentDeclarePicker> -->
            <div class="cell-item required disabled">
              <div class="key">申报缘由</div>
              <div class="value">
                {{ projectDeclareInfo.j00098_desc || '暂无' }}
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

import { useDeclare } from '@/mixins'

import { getIsDev } from '@/utils/get'
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
        permanentAddress: true, // 户籍地址
      },
      // 自定义添加一些属性 防止双向绑定失败 例如 picker组件之类
      projectDeclareInfo: {},
      districtRange: [], // 区县
      schoolRange: [], // 学校
      gradeRange: [], // 年级
      classRange: [], // 班级
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
      let j00098 = [] // 申报缘由
      let j00010 = [] // 学段

      try {
        j00098 = await getCodeListByCodeName('j00098')
        j00010 = await getCodeListByCodeName('j00010')
      } catch (err) {
        if (isDev) {
          console.log('code table j00098 error：', err)
          console.log('code table j00010 error：', err)
        }
      }

      this.codeMap = {
        ...this.codeMap,
        j00098,
        j00010,
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
    // 检测数据输入格式是否正确 须根据项目需求更改
    handleCheckInput() {
      const {
        aac004, // 性别
        j00010, //学段
        j00001, //就读学校名称
        j03501, //户主名
        j03502, //户主身份证号
        j00011, //年级
        j00098, //申报缘由
        j00178, //是否巴中学校

        // chb019, //组
      } = this.projectDeclareInfo

      // if (!chb019) {
      //   showModal('请输入组')
      //   return false
      // }

      if (!j00010) {
        showModal('请选择学段')
        return false
      }

      if (!j00001) {
        showModal('请选择就读学校名称')
        return false
      }
      if (!j00011) {
        showModal('请选择年级')
        return false
      }
      if (!j00178) {
        showModal('请选择是否巴中学校')
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
      if (!j00098) {
        showModal('请选择申报缘由')
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
        gender, // 性别
      } = this.basicInfo

      const {
        aac004, // 性别
        j00010, //学段
        j00001, //就读学校名称
        j03501, //户主名
        j03502, //户主身份证号
        j00011, //年级
        j00098, //申报缘由
        // chb019, //组
        j00178, //是否巴中学校
      } = this.projectDeclareInfo

      // 扩展字段
      const hb00BizMap = {
        aac004: gender, // 性别
        j00010, //学段
        j00001, //就读学校名称
        j03501, //户主名
        j03502, //户主身份证号
        j00011, //年级
        j00098, //申报缘由
        // chb019, //组
        j00178, //是否巴中学校
      }

      this.handleDeclareData(hb00BizMap, '0')
    },
  },
  computed: {},
  watch: {
    'personnelInfo.cac10a': {
      handler(val) {
        console.log(val, 'val')
        if (val) {
          let res = val.split('（')[1]
          res = res.replace('）', '')
          let { aaa102 } = this.codeMap.j00098.find(
            (item) => item.aaa103 == res
          )
          this.projectDeclareInfo = {
            ...this.projectDeclareInfo,
            j00098: aaa102,
            j00098_desc: res,
          }
        }
      },
    },
  },
}
</script>

<style lang="scss" scoped></style>
