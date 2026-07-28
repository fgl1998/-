<!-- 地方政府济困助学（教育局） -->
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
        currentAddressType="city"
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
            <ComponentDeclarePicker
              label="学校所属区县"
              idName="chb015"
              :range="districtRange"
              rangeKey="orgname"
              valueKey="orgid"
              placeholder="请选择学校所属区县"
              v-model="projectDeclareInfo.chb015"
              @change="handlePickerChange"
            ></ComponentDeclarePicker>

            <block v-if="Teacher && projectDeclareInfo.chb015">
              <div class="cell-item required">
                <div class="key">学校</div>
                <div class="value">
                  <input type="text" v-model="projectDeclareInfo.j00001desc" placeholder="请输入学校" />
                </div>
              </div>
            </block>

            <block v-if="!Teacher && projectDeclareInfo.chb015">
              <ComponentDeclarePicker
                label="学校"
                idName="chb017"
                :range="schoolRange"
                rangeKey="orgname"
                valueKey="orgid"
                placeholder="请选择学校"
                v-model="projectDeclareInfo.chb017"
                @change="handlePickerChange"
              ></ComponentDeclarePicker>
            </block>

            <!-- 年级 -->
            <block v-if="!Teacher && projectDeclareInfo.chb017">
              <ComponentDeclarePicker
                label="年级"
                idName="chb018"
                :range="gradeRange"
                rangeKey="orgname"
                valueKey="orgid"
                placeholder="请选择年级"
                v-model="projectDeclareInfo.chb018"
                @change="handlePickerChange"
              ></ComponentDeclarePicker>
            </block>

            <!-- 班级 -->
            <block v-if="!Teacher && projectDeclareInfo.chb018">
              <ComponentDeclarePicker
                label="班级"
                idName="chb019"
                :range="classRange"
                rangeKey="orgname"
                valueKey="orgid"
                placeholder="请选择班级"
                v-model="projectDeclareInfo.chb019"
                @change="handlePickerChange"
              ></ComponentDeclarePicker>
            </block>

            <ComponentDeclarePicker
              label="家庭经济情况"
              idName="j00047"
              :range="codeMap.c00050"
              placeholder="请选择家庭经济情况"
              v-model="projectDeclareInfo.j00047"
              @change="getPickerValueDesc"
            ></ComponentDeclarePicker>

            <div class="cell-item textarea last">
              <div class="key">申请理由描述</div>
              <div class="value">
                <textarea
                  maxlength="100"
                  placeholder="请输入申请理由描述"
                  v-model="projectDeclareInfo.j00177"
                ></textarea>
              </div>
            </div>
          </div>
        </div>
      </ComponentPanel>
    </div>

    <!-- 家庭成员信息 -->
    <div class="space-top-wrapper">
      <ComponentPanel title="家庭成员信息">
        <ComponentDeclareCard
          :renderData="cardList"
          type="20607"
          addButtonName="添加家庭成员"
          @change="handleChangeCardList"
        ></ComponentDeclareCard>
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
import ComponentDeclareCard from '../components/ez-declare-card/ez-declare-card.vue'
import ComponentDeclarePersonnel from '@/components/project/ez-declare-personnel/ez-declare-personnel.vue'
import ComponentDeclarePicker from '@/components/project/ez-declare-picker/ez-declare-picker.vue'

import config from '@/config'
import { useDeclare } from '@/mixins'

import { getCodeListByCodeName } from '@/utils/custom-api'
import { showModal, showLoading, hideLoading } from '@/utils/uni-api'
import { requestSPGetSchoolOrgByPid, requestSPGetOrgListByOrgId } from '@/service/api'
import { M_UPDATE_USER_LIST } from '@/store/constants' // 常量
export default {
  name: 'pageDeclare20607',
  data() {
    return {
      renderObj: {
        idCard: true, // 身份证
        userName: true, // 姓名
        tel: true, // 联系电话
        nation: true,
        age: true,
        gender: true,
        currentAddress: true, // 现居住地址
        permanentAddress: false, // 户籍地址
      },
      // 申报信息
      projectDeclareInfo: {
        j00046: '', // 现居住地址
        chb015: '',
        chb017: '',
        chb018: '',
        chb019: '',
      },
      // 卡片列表数据
      cardList: [],
      //
      districtRange: [],
      schoolRange: [],
      gradeRange: [],
      classRange: [],
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
  },
  mixins: [useDeclare],
  // 监听页面加载，其参数为上个页面传递的数据，参数类型为Object（用于页面传参）
  onLoad(e) {
    this.handleOnLoad(e)
    let { orgid, orglevel } = config.SPAddressRequestParams
    this.requestSchoolOrgByOrgId(orgid, orglevel).then((res) => {
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
    async getCodeTableCacheData() {
      let c00050 = [] // 申请人当前学历

      try {
        c00050 = await getCodeListByCodeName('c00050')
      } catch (err) {
        console.error('code table c00050 error：', err)
      }

      this.codeMap = {
        ...this.codeMap,
        c00050,
      }
    },
    // 请求学校所属地区
    requestSchoolOrgByPid(porgid = '511300') {
      return new Promise((resolve, reject) => {
        requestSPGetSchoolOrgByPid(porgid)
          .then((res) => {
            const { list } = res.lists.resultList
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
    // 请求学校所属地区
    requestSchoolOrgByOrgId(orgid, orglevel) {
      const data = {
        orgid,
        orglevel,
      }
      showLoading()
      return new Promise((resolve, reject) => {
        requestSPGetOrgListByOrgId(data)
          .then((res) => {
            const { list } = res.lists.orgList
            if (list && list.length > 0) {
              resolve(list)
            } else {
              reject(res)
            }
            hideLoading()
          })
          .catch((err) => {
            reject(err)
            hideLoading()
          })
      })
    },
    // 捕获学校/年级/班级改变
    handlePickerChange(id, val_desc, val) {
      if (id === 'chb015') {
        this.$store.commit(M_UPDATE_USER_LIST, {
          chb015: val,
        })
        this.projectDeclareInfo = {
          ...this.projectDeclareInfo,
          chb015desc: val_desc,
          // chb015:val,
          chb017: '',
          chb017desc: '',
          chb018: '',
          chb018desc: '',
          chb019: '',
          chb019desc: '',
        }
        this.requestSchoolOrgByPid(val).then((res) => {
          this.schoolRange = [...res]
        })
      }
      if (id === 'chb017') {
        this.$store.commit(M_UPDATE_USER_LIST, {
          chb017: val,
        })
        this.projectDeclareInfo = {
          ...this.projectDeclareInfo,
          chb017desc: val_desc,
          chb018: '',
          chb018desc: '',
          chb019: '',
          chb019desc: '',
        }
        this.requestSchoolOrgByPid(val).then((res) => {
          this.gradeRange = [...res]
        })
      }
      if (id === 'chb018') {
        this.$store.commit(M_UPDATE_USER_LIST, {
          chb018: val,
        })
        this.projectDeclareInfo = {
          ...this.projectDeclareInfo,
          chb018desc: val_desc,
          chb019: '',
          chb019desc: '',
        }
        this.requestSchoolOrgByPid(val).then((res) => {
          this.classRange = [...res]
        })
      }
      if (id === 'chb019') {
        this.$store.commit(M_UPDATE_USER_LIST, {
          chb019: val,
        })
        this.projectDeclareInfo = {
          ...this.projectDeclareInfo,
          chb019desc: val_desc,
        }
      }
    },
    // 捕获 cardList 不用修改
    handleChangeCardList(type, data) {
      this.cardList = [...data]
    },
    // 检测数据输入格式是否正确 须根据项目需求修改
    handleCheckInput() {
      const {
        j00047, // 家庭经济情况
        chb015, // 学校所属区县
        chb017, // 学校（学生）
        chb018, // 年级（学生）
        chb019, // 班级（学生）
        j00001desc, //学校（教师）
        j00177, // 申请理由描述
      } = this.projectDeclareInfo
      if (!chb015) {
        showModal('请选择学校所属区县')
        return false
      }
      let { cac102 } = this.personnelInfo
      if (cac102 == '3299' || cac102 == '3300' || cac102 == '3301') {
        if (!this.Teacher && !chb017) {
          showModal('请选择学校')
          return false
        }
        if (!this.Teacher && !chb018) {
          showModal('请选择年级')
          return false
        }
        if (!this.Teacher && !chb019) {
          showModal('请选择班级')
          return false
        }
      } else {
        if (this.Teacher && !j00001desc) {
          showModal('请输入学校')
          return false
        }
      }

      if (!j00047) {
        showModal('请选择家庭经济情况')
        return false
      }
      // if (!j00177) {
      //   showModal('请输入申请理由描述')
      //   return false
      // }
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
      const cardList = this.cardList
      const {
        nation, // 民族
        currentAddress, //现居住地址
      } = this.basicInfo
      const {
        j00046, // 现居住地址
        aac005, // 民族
        j00047, // 家庭经济情况
        chb015,
        chb017, // 学校名称
        j00001desc, //学校（教师）
        chb018, // 年级
        chb019, // 班级
        j00177, // 申请理由描述
      } = this.projectDeclareInfo
      // 扩展字段
      let hb00BizMap = {
        j00046: currentAddress, // 现居住地址
        aac005: nation, // 民族
        j00047, // 家庭经济情况
        chb015, // 区县
        chb017: this.Teacher ? '暂无' : chb017, // 学校名称
        j00001desc: !this.Teacher ? '' : j00001desc, //学校（教师）
        chb018: this.Teacher ? '' : chb018, // 年级
        chb019: this.Teacher ? '' : chb019, // 班级
        j00177, // 申请理由描述
      }
      const hp03List = []
      cardList.map((item) => {
        hp03List.push({
          aac003: item.name,
          aac002: item.idCard,
          aac016: item.work,
          j00044: item.age,
          chp031: item.relationship,
        })
      })
      this.handleDeclareData(hb00BizMap, '1', null, hp03List, {
        chb015: this.chb015,
        chb017: this.chb017,
        chb018: '9999',
      })
    },
  },
  computed: {
    Teacher() {
      let { cac102 } = this.personnelInfo
      if (cac102) {
        if (cac102 == '3298' || cac102 == '3302') {
          return true
        }
      }
      return false
    },
  },
  watch: {},
}
</script>

<style lang="scss" scoped></style>
