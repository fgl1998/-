<!-- 中等职业学校国家助学金 -->
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
        :isMultipleChoicesPersonnel="isMultipleChoicesPersonnel"
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
              @change="handlePickerChange"
            ></ComponentDeclarePicker>
            <!-- 学校 -->
            <block v-if="projectDeclareInfo.j00000">
              <ComponentDeclarePicker
                label="学校"
                idName="j00001"
                :range="schoolRange"
                rangeKey="orgname"
                valueKey="orgid"
                placeholder="请选择学校"
                v-model="projectDeclareInfo.j00001"
                @change="handlePickerChange"
              ></ComponentDeclarePicker>
            </block>

            <!-- 年级 -->
            <block v-if="projectDeclareInfo.j00001">
              <ComponentDeclarePicker
                label="年级"
                idName="j00011"
                :range="gradeRange"
                rangeKey="orgname"
                valueKey="orgid"
                placeholder="请选择年级"
                v-model="projectDeclareInfo.j00011"
                @change="handlePickerChange"
              ></ComponentDeclarePicker>
            </block>

            <!-- 班级 -->
            <block v-if="projectDeclareInfo.j00011">
              <ComponentDeclarePicker
                label="班级"
                idName="j00012"
                :range="classRange"
                rangeKey="orgname"
                valueKey="orgid"
                placeholder="请选择班级"
                v-model="projectDeclareInfo.j00012"
                @change="handlePickerChange"
              ></ComponentDeclarePicker>
            </block>

            <div class="cell-item required">
              <div class="key">家庭人口数</div>
              <div class="value">
                <input
                  type="number"
                  maxlength="3"
                  v-model="projectDeclareInfo.chb0gk"
                  placeholder="请输入家庭人口数"
                />
              </div>
            </div>

            <div class="cell-item required">
              <div class="key">监护人联系电话</div>
              <div class="value">
                <input
                  type="number"
                  maxlength="11"
                  v-model="projectDeclareInfo.j00064"
                  placeholder="请输入监护人联系电话"
                  @blur="handlerCheckJ00064"
                />
              </div>
            </div>
          </div>
        </div>
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
                  v-model="projectDeclareInfo.chb0g8"
                ></textarea>
              </div>
            </div>

            <div class="cell-item textarea last">
              <div class="key">家庭遭受突发意外事件</div>
              <div class="value">
                <textarea
                  maxlength="100"
                  placeholder="请输入家庭遭受突发意外事件"
                  v-model="projectDeclareInfo.chb0g9"
                ></textarea>
              </div>
            </div>

            <div class="cell-item textarea last">
              <div class="key">家庭成员因残疾、年迈而劳动力弱的情况</div>
              <div class="value">
                <textarea
                  maxlength="100"
                  placeholder="请输入家庭成员因残疾、年迈而劳动力弱的情况"
                  v-model="projectDeclareInfo.chb0ga"
                ></textarea>
              </div>
            </div>

            <div class="cell-item textarea last">
              <div class="key">家庭成员失业情况</div>
              <div class="value">
                <textarea
                  maxlength="100"
                  placeholder="请输入家庭成员失业情况"
                  v-model="projectDeclareInfo.chb0gb"
                ></textarea>
              </div>
            </div>

            <div class="cell-item textarea last">
              <div class="key">家庭欠债情况</div>
              <div class="value">
                <textarea
                  maxlength="100"
                  placeholder="请输入家庭欠债情况"
                  v-model="projectDeclareInfo.chb0gc"
                ></textarea>
              </div>
            </div>

            <div class="cell-item textarea last">
              <div class="key">其它情况说明</div>
              <div class="value">
                <textarea
                  maxlength="100"
                  placeholder="请输入其它情况说明"
                  v-model="projectDeclareInfo.j00043"
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
          type="20014"
          addButtonName="添加家庭成员"
          @change="handleChangeCardList"
        ></ComponentDeclareCard>
      </ComponentPanel>
    </div>

    <!-- end  在以上代码中根据项目需求更改-->
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
import ComponentDeclarePicker from '@/components/project/ez-declare-picker/ez-declare-picker.vue'

import { useDeclare } from '@/mixins'

import { M_UPDATE_USER_LIST } from '@/store/constants'
import { getDate } from '@/utils/get'
import { checkPhoneNumber } from '@/utils/check'
import { showModal } from '@/utils/uni-api'
import { requestSPGetSchoolOrgByPid } from '@/service/api'
export default {
  name: 'pageDeclare20080',
  data() {
    return {
      isMultipleChoicesPersonnel: true,
      today_y: getDate('year'),
      today_d: getDate('day'),
      renderObj: {
        idCard: true, // 身份证
        userName: true, // 姓名
        tel: true, // 联系电话
        gender: true, // 性别
        birthday: true, // 出生年月
        nature: true, // 户口性质
        permanentAddress: true, // 户籍地址
        currentAddress: true, // 现居地址
      },
      districtRange: [], // 区县
      schoolRange: [], // 学校
      gradeRange: [], // 年级
      classRange: [], // 班级
      // 申报信息
      projectDeclareInfo: {
        aae006: '',
        j00000: '',
        j00001: '',
        j00011: '',
        j00012: '',
      },
      cardList: [],
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
  },
  // 监听页面初次渲染完成
  onReady() {
    this.requestSchoolOrgByPid().then((res) => {
      this.districtRange = [...res]
    })
  },
  // 监听页面显示
  onShow() {},
  // 监听页面隐藏
  onHide() {},
  methods: {
    // 获取该申报项目的所需要的码表数据
    // aaz502、aac011、dac009、aac004、aac005、aae008、yesorno 不用再次获取
    // 编写格式参考达州20033项目
    async getCodeTableCacheData() {},
    // 捕获 cardList 不用修改
    handleChangeCardList(type, data) {
      this.cardList = [...data]
    },
    // 剔除3年级
    removeThree(arr = []) {
      let res = []
      if (arr.length !== 0) {
        arr.filter((item) => item.orgname)
      }
    },
    // 请求学校所属地区
    requestSchoolOrgByPid(porgid = '110386') {
      return new Promise((resolve, reject) => {
        requestSPGetSchoolOrgByPid(porgid, false)
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
    // 捕获学校/年级/班级改变
    handlePickerChange(id, val_desc, val) {
      if (id === 'j00000') {
        this.$store.commit(M_UPDATE_USER_LIST, {
          chb015: val,
        })
        this.projectDeclareInfo = {
          ...this.projectDeclareInfo,
          j00000desc: val_desc,
          j00001: '',
          j00001desc: '',
          j00011: '',
          j00011desc: '',
          j00012: '',
          j00012desc: '',
        }
        this.requestSchoolOrgByPid(val).then((res) => {
          this.schoolRange = [...res]
        })
      }
      if (id === 'j00001') {
        this.$store.commit(M_UPDATE_USER_LIST, {
          chb017: val,
        })
        this.projectDeclareInfo = {
          ...this.projectDeclareInfo,
          j00001desc: val_desc,
          j00011: '',
          j00011desc: '',
          j00012: '',
          j00012desc: '',
        }
        this.requestSchoolOrgByPid(val).then((res) => {
          this.removeThree(res)
          let arr = res.filter(
            (item) =>
              parseInt(item.orgname.replace('高', '').replace('级', '')) >
              parseInt(getDate('year')) - 3
          )
          this.gradeRange = [...arr]
        })
      }
      if (id === 'j00011') {
        this.$store.commit(M_UPDATE_USER_LIST, {
          chb018: val,
        })
        this.projectDeclareInfo = {
          ...this.projectDeclareInfo,
          j00011desc: val_desc,
          j00012: '',
          j00012desc: '',
        }
        this.requestSchoolOrgByPid(val).then((res) => {
          this.classRange = [...res]
        })
      }
      if (id === 'j00012') {
        this.$store.commit(M_UPDATE_USER_LIST, {
          chb019: val,
        })
        this.projectDeclareInfo = {
          ...this.projectDeclareInfo,
          j00012desc: val_desc,
        }
      }
    },
    handlerCheckJ00064(e) {
      let { value } = e.target
      const checkResult = checkPhoneNumber(value, '监护人联系电话')
      if (checkResult.status === '0') {
        showModal(checkResult.msg)
        this.projectDeclareInfo = {
          ...this.projectDeclareInfo,
          j00064: '',
        }
      }
    },
    // 检测数据输入格式是否正确 须根据项目需求修改
    handleCheckInput() {
      const {
        j00000, // 学校所属区县
        j00001, // 学校名称
        j00011, // 年级
        j00012, // 班级
        // aac004, // 性别
        // j00059, // 出生年月
        chb0gk, // 家庭人口
        // j00046, // 现居地址
        j00064, // 监护人联系电话
        // j00045, // 户口性质
        j00069, // 影响家庭经济情况的其他信息
      } = this.projectDeclareInfo
      const cardList = this.cardList
      const {
        gender, // 性别
        birthday, // 出生年月
        nature, // 户口性质
        currentAddress, // 现居地址
      } = this.basicInfo
      if (!j00000) {
        showModal('请选择学校所属区县')
        return false
      }
      if (!j00001) {
        showModal('请选择学校')
        return false
      }
      if (!j00011) {
        showModal('请选择年级')
        return false
      }
      if (!j00012) {
        showModal('请选择班级')
        return false
      }
      if (!chb0gk) {
        showModal('请输入家庭人口')
        return false
      }

      if (!j00064) {
        showModal('请输入监护人联系方式')
        return false
      } else {
        const checkResult = checkPhoneNumber(j00064, '监护人联系电话')
        if (checkResult.status === '0') {
          showModal(checkResult.msg)
          return false
        }
      }
      if (cardList.length == 0) {
        showModal('请添加家庭成员')
        return false
      }
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
        j00001, // 学校名称
        j00011, // 年级
        j00012, // 班级
        aac004, // 性别
        j00059, // 出生年月
        chb0gk, // 家庭人口
        j00046, // 现居地址
        j00064, // 监护人联系电话
        j00045, // 户口性质
        j00069, // 影响家庭经济情况的其他信息

        chb0g3, // 家庭人均收入
        chb0g8, // 家庭遭受自然灾害情况
        chb0g9, // 家庭遭受突发意外事件
        chb0ga, // 家庭成员因残疾、年迈而劳动力弱的情况
        chb0gb, // 家庭成员失业情况
        chb0gc, // 家庭欠债情况
        j00043, // 其它情况说明
      } = this.projectDeclareInfo

      const {
        gender, // 性别
        birthday, // 出生年月
        nature, // 户口性质
        currentAddress, // 现居地址
      } = this.basicInfo

      // 扩展字段
      let hb00BizMap = {
        j00001, // 学校名称
        j00011, // 年级
        j00012, // 班级
        aac004: gender, // 性别
        j00059: birthday, // 出生年月
        chb0gk, // 家庭人口
        j00046: currentAddress, // 现居地址
        j00064, // 监护人联系电话
        j00045: nature, // 户口性质
        j00069, // 影响家庭经济情况的其他信息

        chb0g3, // 家庭人均收入
        chb0g8, // 家庭遭受自然灾害情况
        chb0g9, // 家庭遭受突发意外事件
        chb0ga, // 家庭成员因残疾、年迈而劳动力弱的情况
        chb0gb, // 家庭成员失业情况
        chb0gc, // 家庭欠债情况
        j00043, // 其它情况说明
      }
      let hp03List = []
      cardList.map((item) => {
        hp03List.push({
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
      this.handleDeclareData(hb00BizMap, '0')
    },
  },
  computed: {},
  watch: {
    // 防止特殊群体与非特殊群体冲突
    personnelInfo: {
      handler(val, old) {
        if (old && old.length > 0 && val && val.length > 0) {
          let nowhas = val.find((item) => item.cac102 == '682')
          let oldhas = old.find((item) => item.cac102 == '682')
          if (nowhas && !oldhas) {
            this.personnelList.map((item) => {
              let res = item
              res = Object.assign(res, { checked: false })
              if (item.cac102 == '682') {
                res = Object.assign(res, { checked: true })
                let arr = []
                arr.push(item)
                this.personnelInfo = arr
              }
              return res
            })
          }
          if (nowhas && oldhas && val.length > 1) {
            this.personnelList.map((item) => {
              let res = item
              if (item.cac102 == '682') {
                res = Object.assign(res, { checked: false })
              }
              return res
            })
            this.personnelInfo = this.personnelInfo.filter(
              (item) => item.cac102 !== '682'
            )
          }
        }
      },
      deep: true,
      immediate: true,
    },
  },
}
</script>

<style lang="scss" scoped>
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
