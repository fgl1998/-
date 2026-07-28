<!-- 义务教育家庭经济困难非寄宿生生活补助（教育局） -->
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
            <!-- 学校所属区县 -->
            <ComponentDeclarePicker
              label="学校所属区县"
              idName="j00000"
              :range="districtRange"
              rangeKey="orgname"
              valueKey="orgid"
              placeholder="请选择学校所属区县"
              v-model="projectDeclareInfo.j00000"
              @change="handleDistrictChange"
            ></ComponentDeclarePicker>

            <!-- 学校 -->
            <ComponentDeclarePicker
              V-if="projectDeclareInfo.j00000"
              label="学校"
              idName="j00118"
              :range="schoolRange"
              rangeKey="cht212"
              valueKey="cht210"
              placeholder="请选择学校"
              v-model="projectDeclareInfo.j00118"
            ></ComponentDeclarePicker>

            <!-- 年级 -->
            <ComponentDeclarePicker
              label="年级"
              idName="j00121"
              :range="codeMap.c00144"
              placeholder="请选择年级"
              v-model="projectDeclareInfo.j00121"
            ></ComponentDeclarePicker>

            <div class="cell-item required">
              <div class="key">班级</div>
              <div class="value">
                <input
                  type="number"
                  v-model="projectDeclareInfo.j00122"
                  placeholder="请输入班级"
                  @input="handleCheckNumber($event, 'j00122')"
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
import ComponentDeclareCard from '../components/ez-declare-card/ez-declare-card.vue'
import ComponentDeclarePersonnel from '@/components/project/ez-declare-personnel/ez-declare-personnel.vue'
import ComponentDeclareRadio from '@/components/project/ez-declare-radio/ez-declare-radio.vue'
import ComponentDeclarePicker from '@/components/project/ez-declare-picker/ez-declare-picker.vue'

import config from '@/config'
import { useDeclare } from '@/mixins'

import { checkIDCard } from '@/utils/check'
import { getCodeListByCodeName } from '@/utils/custom-api'
import { showModal, hideLoading, showLoading } from '@/utils/uni-api'
import { requestB069, requestSPGetOrgListByOrgId } from '@/service/api'
export default {
  name: 'pageDeclare20375',
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
      projectDeclareInfo: {
        j00000: '',
        j00118: '',
        j00122: '',
      },
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
    let { orgid, orglevel } = config.SPAddressRequestParams

    this.requestSchoolOrgByPid(orgid, orglevel).then((res) => {
      this.districtRange = [...res]
    })
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
      let c00144 = [] // 年级
      try {
        c00144 = await getCodeListByCodeName('c00144')
      } catch (err) {
        console.error('code table c00144 error：', err)
      }
      this.codeMap = {
        ...this.codeMap,
        c00144,
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
    // 请求学校所属地区
    requestSchoolOrgByPid(orgid, orglevel) {
      const data = {
        orgid,
        orglevel,
      }
      return new Promise((resolve, reject) => {
        requestSPGetOrgListByOrgId(data)
          .then((res) => {
            const { list } = res.lists.orgList
            if (list && list.length > 0) {
              resolve(list)
            } else {
              reject(res)
            }
          })
          .catch((err) => {
            reject(err)
          })
      })
    },
    // 区县选择变换
    handleDistrictChange() {
      let { j00000 } = this.projectDeclareInfo
      showLoading()
      Promise.all([
        this.requestSchoolData(j00000, '05'),
        this.requestSchoolData(j00000, '06'),
      ])
        .then((res) => {
          this.schoolRange = [...res[0], ...res[1]]
          hideLoading()
        })
        .catch((err) => {
          hideLoading()
        })
    },
    // 请求学校
    requestSchoolData(value, cht214) {
      return new Promise((resolve, reject) => {
        requestB069(value, cht214)
          .then((res) => {
            const { list } = res.lists.ht21List
            if (list) {
              resolve(list)
            } else {
              reject(res)
            }
          })
          .catch((err) => {
            reject(err)
          })
      })
    },
    // 数字验证
    handleCheckNumber(e, id) {
      let { value } = e.target
      if (value) {
        let res = value.replace(/\D+/g, '')
        let _this = this
        if (parseInt(res) > 50) {
          res = '50'
        }
        this.$nextTick(function () {
          _this.projectDeclareInfo[id] = res
        })
      }
    },
    // 检测数据输入格式是否正确 须根据项目需求更改
    handleCheckInput() {
      const {
        j00118, //就读学校名称
        j00121, //年级
        j00122, //班级
        j00000,
      } = this.projectDeclareInfo

      if (!j00000) {
        showModal('请选择就读学校区县')
        return false
      }

      if (!j00118) {
        showModal('请选择就读学校名称')
        return false
      }
      if (!j00121) {
        showModal('请选择年级')
        return false
      }
      if (!j00122) {
        showModal('请输入班级')
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
        j00118, //就读学校名称
        j00121, //年级
        j00122, //班级
      } = this.projectDeclareInfo

      // 扩展字段
      const hb00BizMap = {
        aac004: gender, // 性别
        j00118, //就读学校名称
        j00121, //年级
        j00122, //班级
      }

      this.handleDeclareData(hb00BizMap, '0')
    },
  },
  computed: {},
  watch: {},
}
</script>

<style lang="scss" scoped></style>
