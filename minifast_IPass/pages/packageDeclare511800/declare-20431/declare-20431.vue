<!-- 市本级中职技工院校国家助学金（人社局） -->
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
        :isMultipleChoicesPersonnel="true"
        @change="handleChangePersonnelInfo"
      ></ComponentDeclarePersonnel>
    </div>
    <!-- 申报信息 -->
    <div class="space-top-wrapper">
      <ComponentPanel title="申报信息">
        <div class="panel-content">
          <div class="cell-items">
            <!--            学校所属区县
            <ComponentDeclarePicker
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
            <block>
              <ComponentDeclarePicker
                label="学校"
                idName="r00017"
                :range="schoolRange"
                rangeKey="cht212"
                valueKey="cht210"
                placeholder="请选择学校"
                v-model="projectDeclareInfo.r00017"
                @change="handlePickerChange"
              ></ComponentDeclarePicker>
            </block>

            <!-- 年级 -->
            <block v-if="projectDeclareInfo.r00017">
              <ComponentDeclarePicker
                label="年级"
                idName="r47905"
                :range="gradeRange"
                rangeKey="orgname"
                valueKey="orgid"
                placeholder="请选择年级"
                v-model="projectDeclareInfo.r47905"
                @change="handlePickerChange"
              ></ComponentDeclarePicker>
            </block>

            <!-- 班级 -->
            <block v-if="projectDeclareInfo.r47905">
              <ComponentDeclarePicker
                label="班级"
                idName="r00018"
                :range="classRange"
                rangeKey="orgname"
                valueKey="orgid"
                placeholder="请选择班级"
                v-model="projectDeclareInfo.r00018"
                @change="handlePickerChange"
              ></ComponentDeclarePicker>
            </block>
            <ComponentDeclarePicker
              label="申报档次"
              idName="r00092"
              :range="codeMap.r00092"
              placeholder="请选择申报档次"
              v-model="projectDeclareInfo.r00092"
              @change="getPickerValueDesc"
            ></ComponentDeclarePicker>
            <ComponentDeclarePicker
              label="申报季度"
              idName="r00093"
              :range="codeMap.r00093"
              placeholder="请选择申报季度"
              v-model="projectDeclareInfo.r00093"
              @change="getPickerValueDesc"
            ></ComponentDeclarePicker>
            <!-- 家长手机号 -->
            <div class="cell-item required">
              <div class="key">家长手机号</div>
              <div class="value">
                <input
                  type="number"
                  maxlength="11"
                  v-model="projectDeclareInfo.r00091"
                  @blur="handleBlurR00091"
                  placeholder="请输入家长手机号"
                />
              </div>
            </div>

            <!-- 邮政编码 -->
            <div class="cell-item required">
              <div class="key">邮政编码</div>
              <div class="value">
                <input
                  type="number"
                  maxlength="6"
                  v-model="projectDeclareInfo.r00090"
                  placeholder="请输入邮政编码"
                />
              </div>
            </div>
            <div class="cell-item required disabled">
              <div class="key">家庭人均年收入(元)</div>
              <div class="value">
                {{ getR00094 }}
              </div>
            </div>
            <div class="cell-item required disabled">
              <div class="key">家庭人口数</div>
              <div class="value">
                {{ getR00089 }}
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
          :renderData="familyMemberList"
          type="20014"
          addButtonName="添加家庭成员"
          @change="handleChangeCardList"
        ></ComponentDeclareCard>
      </ComponentPanel>
    </div>

    <!-- 影响家庭信息的其他情况 -->
    <div class="space-top-wrapper">
      <ComponentPanel title="影响家庭信息的其他情况">
        <div class="panel-content">
          <div class="input-tip">
            <div class="icon"></div>
            <div>
              以下为非必填项，你可根据自身实际情况进行填写。如有佐证材料，请在申报材料列表处上传。
            </div>
          </div>
          <div class="cell-items">
            <div class="cell-item textarea last">
              <div class="key">家庭遭受自然灾害情况</div>
              <div class="value">
                <textarea
                  maxlength="100"
                  placeholder="请输入家庭遭受自然灾害情况"
                  v-model="projectDeclareInfo.r00095"
                ></textarea>
              </div>
            </div>

            <div class="cell-item textarea last">
              <div class="key">家庭遭受突发意外事件</div>
              <div class="value">
                <textarea
                  maxlength="100"
                  placeholder="请输入家庭遭受突发意外事件"
                  v-model="projectDeclareInfo.r00096"
                ></textarea>
              </div>
            </div>

            <div class="cell-item textarea last">
              <div class="key">家庭成员因残疾、年迈而劳动力弱的情况</div>
              <div class="value">
                <textarea
                  maxlength="100"
                  placeholder="请输入家庭成员因残疾、年迈而劳动力弱的情况"
                  v-model="projectDeclareInfo.r00097"
                ></textarea>
              </div>
            </div>

            <div class="cell-item textarea last">
              <div class="key">家庭成员失业情况</div>
              <div class="value">
                <textarea
                  maxlength="100"
                  placeholder="请输入家庭成员失业情况"
                  v-model="projectDeclareInfo.r00100"
                ></textarea>
              </div>
            </div>

            <div class="cell-item textarea last">
              <div class="key">家庭欠债情况</div>
              <div class="value">
                <textarea
                  maxlength="100"
                  placeholder="请输入家庭欠债情况"
                  v-model="projectDeclareInfo.r00098"
                ></textarea>
              </div>
            </div>

            <div class="cell-item textarea last">
              <div class="key">其它情况说明</div>
              <div class="value">
                <textarea
                  maxlength="100"
                  placeholder="请输入其它情况说明"
                  v-model="projectDeclareInfo.r00099"
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

import { mapGetters } from 'vuex'
import Big from '@/utils/big.min.js'
import { useDeclare } from '@/mixins'

import { getDate } from '@/utils/get'
import { checkPhoneNumber } from '@/utils/check'
import { getCodeListByCodeName } from '@/utils/custom-api'
import { showModal } from '@/utils/uni-api'
import { requestB069, requestSPGetSchoolOrgByPid } from '@/service/api'
import { EDIT_SUBSIDY_INFO, M_UPDATE_USER_LIST } from '@/store/constants'

export default {
  name: 'pageDeclare20431',
  data() {
    return {
      isMultipleChoicesPersonnel: true,
      // 基本信息 渲染配置
      renderObj: {
        idCard: true, // 身份证
        userName: true, // 姓名
        gender: true, // 性别
        birthday: true, // 出生年月
        currentAddress: true, // 现居住地址
        nativePlace: true, // 籍贯
        tel: true, // 联系电话
      },
      districtRange: [], // 区县
      schoolRange: [], // 学校
      gradeRange: [], // 年级
      classRange: [], // 班级
      projectDeclareInfo: {
        r00101: getDate('year'), // 申报年度
        r00093: '', // 申报季度
        j00000: '',
        r00017: '',
        j000011: '',
        j000012: '',
      },
      familyMemberList: [], // 家庭成员
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
    // 申报
    this.requestSchoolData().then((res) => {
      this.schoolRange = [...res]
    })
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
      let r00092 = [] // 申报档次
      let r00093 = [] // 申报季度

      try {
        r00092 = await getCodeListByCodeName('r00092')
      } catch (err) {
        console.error('code table r00092 error：', err)
      }

      try {
        r00093 = await getCodeListByCodeName('r00093')
      } catch (err) {
        console.error('code table r00093 error：', err)
      }

      this.codeMap = {
        ...this.codeMap,
        r00093,
        r00092,
      }
    },
    // 捕获 familyMemberList 不用修改
    handleChangeCardList(type, data) {
      this.familyMemberList = [...data]
      console.log(type, data, 1234567789)
    },
    // 请求学校所属地区
    requestSchoolOrgByPid(porgid = '101167') {
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
    // 请求学校
    requestSchoolData(value = '101167') {
      return new Promise((resolve, reject) => {
        requestB069(value, '7')
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
    // 捕获学校/年级/班级改变
    handlePickerChange(id, val_desc, val) {
      if (id === 'j00000') {
        this.$store.commit(M_UPDATE_USER_LIST, {
          chb015: val,
        })
        this.projectDeclareInfo = {
          ...this.projectDeclareInfo,
          j00000desc: val_desc,
          r00017: '',
          r00017desc: '',
          r47905: '',
          r47905desc: '',
          r00018: '',
          r00018desc: '',
        }
        this.requestSchoolOrgByPid(val).then((res) => {
          this.schoolRange = [...res]
        })
      }
      if (id === 'r00017') {
        this.$store.commit(M_UPDATE_USER_LIST, {
          chb017: val,
        })
        this.projectDeclareInfo = {
          ...this.projectDeclareInfo,
          r00017desc: val_desc,
          r47905: '',
          r47905desc: '',
          r00018: '',
          r00018desc: '',
        }
        this.requestSchoolOrgByPid(val).then((res) => {
          this.gradeRange = [...res]
        })
      }
      if (id === 'r47905') {
        this.$store.commit(M_UPDATE_USER_LIST, {
          chb018: val,
        })
        this.projectDeclareInfo = {
          ...this.projectDeclareInfo,
          r47905desc: val_desc,
          r00018: '',
          r00018desc: '',
        }
        this.requestSchoolOrgByPid(val).then((res) => {
          this.classRange = [...res]
        })
      }
      if (id === 'r00018') {
        this.$store.commit(M_UPDATE_USER_LIST, {
          chb019: val,
        })
        this.projectDeclareInfo = {
          ...this.projectDeclareInfo,
          r00018desc: val_desc,
        }
      }
    },
    // 手动输入手机号 失去焦点监听
    handleBlurR00091(e) {
      const { value } = e.target
      const checkResult = checkPhoneNumber(value)
      if (checkResult.status === '0') {
        showModal(checkResult.msg)
      }
    },
    // 检测数据输入格式是否正确 须根据项目需求更改
    handleCheckInput() {
      const {
        j00000, // 学校所属区县
        r00017, // 学校
        r47905, // 年级
        r00018, // 班级

        r00090, // 邮政编码
        r00091, // 家长手机号

        r00092, // 申报档次
        r00093,
      } = this.projectDeclareInfo
      const r00089 = this.getR00089
      if (!j00000) {
        showModal('请选择学校所属区县')
        return false
      }
      if (!r00017) {
        showModal('请选择所属学校')
        return false
      }
      if (!r47905) {
        showModal('请选择年级')
        return false
      }
      if (!r00018) {
        showModal('请选择班级')
        return false
      }
      if (!r00092) {
        showModal('请选择申报档次')
        return false
      }
      if (!r00093) {
        showModal('请选择申报季度')
        return false
      }
      if (!r00091) {
        showModal('请输入家长手机号')
        return false
      } else {
        const checkResult = checkPhoneNumber(r00091, '家长手机号')
        if (checkResult.status === '0') {
          showModal(checkResult.msg)
          return false
        }
      }
      if (!r00090) {
        showModal('请输入邮政编码')
        return false
      } else {
        if (r00090.length !== 6) {
          showModal('邮政编码格式错误，请重新输入6位邮政编码！')
          return false
        }
      }

      if (!r00089 || r00089 == 0) {
        showModal('请添加家庭成员')
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
      const familyMemberList = this.familyMemberList
      const { gender, nativePlace, birthday, currentAddress } = this.basicInfo
      const r00089 = this.getR00089
      const r00094 = this.getR00094
      const {
        j00000, // 学校所属区县
        r00017, // 学校
        r00017desc, // 学校
        r47905, // 年级
        r47905desc, // 年级
        r00018, // 班级
        r00018desc, // 班级

        r00090, // 邮政编码
        r00091, // 家长手机号
        r00101, // 申报年度
        r00093, // 申报季度
        r00092,

        r00104, // 籍贯
        aac004, // 性别

        r00095, // 家庭遭受自然灾害情况
        r00096, // 家庭遭受突发意外事件
        r00097, // 家庭成员因残疾、年迈而劳动力弱的情况
        r00100, // 家庭成员失业情况
        r00098, // 家庭欠债情况
        r00099, // 其它情况说明
      } = this.projectDeclareInfo

      const addressInfo = {
        chb015: j00000,
        chb017: r00017,
        chb018: r47905,
        chb019: r00018,
      }

      // 扩展字段
      const hb00BizMap = {
        // chb015, // 学校所属区县
        r00017: r00017desc, // 学校名称
        r47905: r47905desc, // 年级名称
        r00018: r00018desc, // 班级名称

        r00090, // 邮政编码
        r00091, // 家长手机号
        r00101, // 申报年度
        r00093, // 申报学期
        r00089, // 家庭人口数
        r00094, // 家庭人均收入
        r00092,

        r00049: currentAddress, // 家庭地址
        r00104: nativePlace, // 籍贯
        aac004: gender, // 性别
        r00105: birthday, // 出生日期

        r00095, // 家庭遭受自然灾害情况
        r00096, // 家庭遭受突发意外事件
        r00097, // 家庭成员因残疾、年迈而劳动力弱的情况
        r00100, // 家庭成员失业情况
        r00098, // 家庭欠债情况
        r00099, // 其它情况说明
      }

      // 家庭成员
      let familyMember = []
      let arr = []
      familyMemberList.map((item) => {
        arr.push({
          aac003: item.name, // 姓名
          aac004: item.gender_desc, // 性别
          chp034: item.age, // 年龄
          chp031: item.relationship_desc, // 关系
          chb48b: item.workAdress, // 工作学习单位
          aac111: item.job, // 职业
          chb485: item.healthy_desc, // 健康状况
          chp032: item.wages, // 年收入
        })
      })
      familyMember = [...arr]
      this.handleDeclareData(hb00BizMap, '0', null, familyMember, addressInfo)
    },
  },
  computed: {
    ...mapGetters([EDIT_SUBSIDY_INFO]),
    getR00089() {
      const familyMemberList = this.familyMemberList
      const len = familyMemberList.length
      let result = 1
      let tag = false
      familyMemberList.map((item) => {
        if (item.relationship_desc === '本人') {
          tag = true
        }
      })
      if (tag) {
        result = len
      } else {
        result = len + 1
      }
      return result
    },
    getR00094() {
      const familyMemberList = this.familyMemberList
      const getR00089 = this.getR00089
      let len = familyMemberList.length
      let num = 0
      if (len > 0) {
        for (let i = 0; i < len; i++) {
          const item = familyMemberList[i]
          num = new Big(num).plus(item.wages || 0)
        }
        num = new Big(num).div(new Big(getR00089))
      }
      return num.toFixed(2)
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
