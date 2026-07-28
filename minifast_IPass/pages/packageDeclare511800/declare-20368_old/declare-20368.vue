<!-- 义务教育家庭经济困难补助生活费 -->
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
        @changeUserNameAndIdCard="onChangeUserNameAndIdCard">
      </ComponentDeclare>
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
              @change="handlePickerChange"></ComponentDeclarePicker>

            <!-- 学校 -->
            <block>
              <ComponentDeclarePicker
                label="学校"
                idName="j00001"
                pickerType="combox"
                :range="schoolRange"
                rangeKey="orgname"
                valueKey="orgid"
                placeholder="请选择学校"
                v-model="projectDeclareInfo.j00001"
                @change="handlePickerChange">
              </ComponentDeclarePicker>
            </block>

            <!-- 年级 -->
            <!-- <block v-if="projectDeclareInfo.j00001">
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
            </block> -->
            <div class="cell-item required">
              <div class="key">年级</div>
              <div class="value">
                <input type="text" maxlength="19" v-model="projectDeclareInfo.j00011" placeholder="请输入年级" />
              </div>
            </div>

            <!-- 班级 -->
            <!-- <block v-if="projectDeclareInfo.j00011">
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
            </block> -->
            <div class="cell-item required">
              <div class="key">班级</div>
              <div class="value">
                <input type="text" maxlength="19" v-model="projectDeclareInfo.j00012" placeholder="请输入班级" />
              </div>
            </div>

            <ComponentInputAddress
              label="学生户籍地址"
              placeholder="请输入学生户籍地址"
              v-model="projectDeclareInfo.j00004">
            </ComponentInputAddress>

            <div class="cell-item required">
              <div class="key">家长手机号</div>
              <div class="value">
                <input type="text" maxlength="11" v-model="projectDeclareInfo.j00049" placeholder="请输入家长手机号" />
              </div>
            </div>

            <div class="cell-item required disabled">
              <div class="key">申报年度</div>
              <div class="value">
                {{ projectDeclareInfo.chb0ge || '暂无' }}
              </div>
            </div>

            <div class="cell-item required disabled">
              <div class="key">申报学期</div>
              <div class="value">
                {{ projectDeclareInfo.chb0gf_desc }}
              </div>
            </div>

            <!-- 学生完整学籍号 -->
            <div class="cell-item required">
              <div class="key">学生完整学籍号</div>
              <div class="value">
                <input
                  type="text"
                  maxlength="19"
                  v-model="projectDeclareInfo.j00018"
                  placeholder="请输入学生完整学籍号" />
              </div>
            </div>
            <div class="cell-item textarea last">
              <div class="key">备注</div>
              <div class="value">
                <textarea maxlength="100" placeholder="请输入备注" v-model="projectDeclareInfo.chb00q"></textarea>
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
          @change="handleChangeCardList"></ComponentDeclareCard>
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
  import ComponentDeclareCard from '../components/ez-declare-card/ez-declare-card.vue'
  import ComponentDeclarePersonnel from '@/components/project/ez-declare-personnel/ez-declare-personnel.vue'
  import ComponentDeclareRadio from '@/components/project/ez-declare-radio/ez-declare-radio.vue'
  import ComponentDeclarePicker from '@/components/project/ez-declare-picker/ez-declare-picker.vue'
  import ComponentInputAddress from '@/components/project/ez-input-address/ez-input-address.vue'

  import { mapGetters } from 'vuex'
  import Big from '@/utils/big.min.js'
  import config from '@/config'
  import { useDeclare } from '@/mixins'

  import { getDate } from '@/utils/get'
  import { checkPhoneNumber } from '@/utils/check'
  import { getCodeListByCodeName } from '@/utils/custom-api'
  import { showModal, showLoading, hideLoading, navigateBack } from '@/utils/uni-api'
  import { requestB126, requestSPGetOrgListByOrgId } from '@/service/api'
  import { EDIT_SUBSIDY_INFO, M_UPDATE_USER_LIST } from '@/store/constants'

  export default {
    name: 'pageDeclare20013',
    data() {
      return {
        // 基本信息 渲染配置

        renderObj: {
          idCard: true, // 身份证
          userName: true, // 姓名
          gender: true, // 性别
          birthday: true, // 出生年月
          // currentAddress: true, // 现居住地址
          nature: true, // 户口性质
          // permanentAddress: true, //户籍地址
          tel: true, // 联系电话
          nativePlace: true // 籍贯
        },
        districtRange: [], // 区县
        schoolRange: [], // 学校
        gradeRange: [], // 年级
        classRange: [], // 班级
        projectDeclareInfo: {
          j00000: '',
          r00001: '',
          j000011: '',
          j000012: '',
          j00004: '',
          j00049: '',
          chb0ge: '',
          j00018: '',
          chb00q: ''
        },
        familyMemberList: [] // 家庭成员
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
      ComponentInputAddress
    },
    mixins: [useDeclare],
    // 监听页面加载，其参数为上个页面传递的数据，参数类型为Object（用于页面传参）
    onLoad(e) {
      let { chi037 } = e
      this.chi037 = chi037
      // 申报
      let { orgid, orglevel } = config.SPAddressRequestParams
      this.requestSchoolOrgByPid(orgid, orglevel).then((res) => {
        this.districtRange = [...res]
      })
      this.schoolDate()
      this.handleOnLoad(e)
      if (this.declareType == '01') {
        this.$nextTick(() => {
          this.handleBeforeCheck()
        })
      }
    },

    // 监听页面初次渲染完成
    onReady() {},
    // 监听页面显示
    onShow() {},
    // 监听页面隐藏
    onHide() {},
    methods: {
      /**
       * 申报人姓名或者身份证号发生改变(两者同时存在才会触发)
       */
      onChangeUserNameAndIdCard(idCard, userName) {
        this.handleBeforeCheck()
      },
      // 获取该申报项目的所需要的码表数据
      // aaz502、aac011、dac009、aac004、aac005、aae008、yesorno 不用再次获取
      // 编写格式参考达州20033项目
      async getCodeTableCacheData() {
        let r00093 = [] // 申报学期
        // let f00024 = [] // 监护人与学生关系
        // let chb0a8 = [] // 监护人健康状况

        // try {
        //   chbbi8 = await getCodeListByCodeName('chbbi8')
        // } catch (err) {
        //   console.error('code table chbbi8 error：', err)
        // }

        try {
          r00093 = await getCodeListByCodeName('r00093')
        } catch (err) {
          console.error('code table r00093 error：', err)
        }

        // try {
        //   f00024 = await getCodeListByCodeName('f00024')
        // } catch (err) {
        //   console.error('code table f00024 error：', err)
        // }

        // try {
        //   chb0a8 = await getCodeListByCodeName('chb0a8')
        // } catch (err) {
        //   console.error('code table chb0a8 error：', err)
        // }

        this.codeMap = {
          ...this.codeMap,
          // chbbi8,
          r00093
          // f00024,
          // chb0a8,
        }
      },
      // 将日期转换为学校用季度和年度
      schoolDate() {
        const month = new Date().getMonth() + 1
        const myDate = new Date()
        const tYear = myDate.getFullYear()
        if (month >= 3 && month <= 7) {
          this.projectDeclareInfo = {
            ...this.projectDeclareInfo,
            chb0gf: '1',
            chb0gf_desc: '春季',
            chb0ge: tYear
          }
        } else if (month >= 9 && month <= 12) {
          this.projectDeclareInfo = {
            ...this.projectDeclareInfo,
            chb0gf: '2',
            chb0gf_desc: '秋季',
            chb0ge: tYear
          }
        } else if (month == 1) {
          this.projectDeclareInfo = {
            ...this.projectDeclareInfo,
            chb0gf: '2',
            chb0gf_desc: '秋季',
            chb0ge: tYear - 1
          }
        } else {
          this.projectDeclareInfo = {
            ...this.projectDeclareInfo,
            chb0gf: '0',
            chb0gf_desc: '假期',
            chb0ge: tYear
          }
        }
      },
      // 捕获 familyMemberList 不用修改
      handleChangeCardList(type, data) {
        this.familyMemberList = [...data]
      },
      // 请求学校所属地区
      requestSchoolOrgByPid(orgid, orglevel) {
        showLoading()
        let params = {
          orgid,
          orglevel,
          costomno: 'school',
          schoolQuery: '1'
        }
        return new Promise((resolve, reject) => {
          requestSPGetOrgListByOrgId(params, false)
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
        if (id === 'j00000') {
          this.$store.commit(M_UPDATE_USER_LIST, {
            chb015: val
          })
          this.projectDeclareInfo = {
            ...this.projectDeclareInfo,
            j00000desc: val_desc,
            j00001: '',
            j00001desc: '',
            j00011: '',
            j00011desc: '',
            j00012: '',
            j00012desc: ''
          }
          this.requestSchoolOrgByPid(val).then((res) => {
            this.schoolRange = [...res]
          })
        }
        if (id === 'j00001') {
          this.$store.commit(M_UPDATE_USER_LIST, {
            chb017: val
          })
          this.projectDeclareInfo = {
            ...this.projectDeclareInfo,
            j00001desc: val_desc,
            j00011: '',
            j00011desc: '',
            j00012: '',
            j00012desc: ''
          }
          this.requestSchoolOrgByPid(val).then((res) => {
            this.gradeRange = [...res]
          })
        }
        if (id === 'j00011') {
          this.$store.commit(M_UPDATE_USER_LIST, {
            chb018: val
          })
          this.projectDeclareInfo = {
            ...this.projectDeclareInfo,
            j00011desc: val_desc,
            j00012: '',
            j00012desc: ''
          }
          this.requestSchoolOrgByPid(val).then((res) => {
            this.classRange = [...res]
          })
        }
        if (id === 'j00012') {
          this.$store.commit(M_UPDATE_USER_LIST, {
            chb019: val
          })
          this.projectDeclareInfo = {
            ...this.projectDeclareInfo,
            j00012desc: val_desc
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
          j00000,
          chb017, //受理乡镇
          aac002, //身份证号
          j00059, // 出生年月
          aae006, //户籍地址
          j00045, //户口性质

          j00001, //就读学校名称
          j00001desc, //就读学校名称
          j00011desc, //年级名称
          j00011, //年级
          j00012desc, //班级名称
          j00012, //班级

          chb018, //受理村
          j00004, //学生户籍所在地
          j00049, //家长手机号

          chb0gf, //申报学期
          j00018, //学生完整学籍号
          chb00q //备注
        } = this.projectDeclareInfo
        if (!j00000) {
          showModal('请选择学校所属区县')
          return false
        }
        if (!j00001) {
          showModal('请选择所属学校')
          return false
        }
        if (!j00011) {
          showModal('请输入年级')
          return false
        }
        if (!j00012) {
          showModal('请输入班级')
          return false
        }

        if (!j00004 || j00004 == '///') {
          showModal('请输入学生户籍所在地')
          return false
        }
        if (!j00049) {
          showModal('请输入家长手机号')
          return false
        }
        if (!j00018) {
          showModal('请输入学生完整学籍号')
          return false
        }

        if (!this.familyMemberList || this.familyMemberList == 0) {
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
        const { idCard, birthday, nature, currentAddress, permanentAddress, nativePlace } = this.basicInfo
        // const chb0gk = this.getChb0gk
        // const chb0g3 = this.getChb0g3
        const {
          j00000,

          j00001, //就读学校名称
          j00001desc, //就读学校名称
          j00011desc, //年级名称
          j00011, //年级
          j00012desc, //班级名称
          j00012, //班级

          j00049, //家长手机号
          j00004, //学生户籍所在地
          chb0gf, //申报学期
          j00018, //学生完整学籍号
          chb00q //备注
        } = this.projectDeclareInfo

        const addressInfo = {
          chb015: j00000,
          chb017: j00001,
          chb018: j00011,
          chb019: j00012
        }

        // 扩展字段
        const hb00BizMap = {
          chb017: j00001,
          chb018: j00011,

          aac002: idCard, //身份证号
          j00059: birthday, // 出生年月
          aae006: permanentAddress, //户籍地址
          j00045: nature, //户口性质
          chb0g2: nativePlace, //籍贯

          // j00001, //就读学校名称
          // j00001desc, //就读学校名称
          // j00011desc, //年级名称
          // j00011, //年级
          // j00012desc, //班级名称
          j00012, //班级

          j00049, //家长手机号
          j00004, //学生户籍所在地
          chb0gf, //申报学期
          j00018, //学生完整学籍号
          chb00q //备注
        }

        // 家庭成员
        let familyMember = []
        let arr = []
        familyMemberList.map((item) => {
          arr.push({
            aac003: item.name, // 姓名
            aac004: item.gender, // 性别
            chp034: item.age, // 年龄
            chp031: item.relationship_desc, // 关系
            chb48b: item.workAdress, // 工作学习单位
            aac111: item.job, // 职业
            chb485: item.healthy_desc, // 健康状况
            chp032: item.wages // 年收入
          })
        })
        familyMember = [...arr]
        this.handleDeclareData(hb00BizMap, '0', null, familyMember, null)
      },
      handleBeforeCheck() {
        let { idCard, userName, tel } = this.basicInfo
        if (!idCard || !userName) {
          showModal('未获取到个人信息')
          return
        }
        let date_m = getDate('month')
        let aae209 = date_m.replace('-', '')

        requestB126(idCard, userName, this.chi031, aae209, tel, this.chi037, this.projectDeclareInfo.chb0gf)
          .then((res) => {
            let { list } = res.lists.validateResultList ? res.lists.validateResultList : {}
            if (list && list.length !== 0) {
              list.forEach((item) => {
                if (item.message) {
                  showModal(item.message).then(() => {
                    navigateBack(1)
                  })
                }
              })
            }
            hideLoading()
          })
          .catch(() => {
            hideLoading()
          })
      }
    },
    computed: {
      ...mapGetters([EDIT_SUBSIDY_INFO])
      // getChbbi8Map() {
      //   let { chbbi8 } = this.codeMap
      //   if (chbbi8 && chbbi8.length !== 0) {
      //     return chbbi8.filter((item) => item.aaa102 !== '4')
      //   }
      //   return []
      // },
      // getF00024Map() {
      //   let { f00024 } = this.codeMap
      //   if (f00024 && f00024.length !== 0) {
      //     return f00024
      //   }
      //   return []
      // },
      // getChb0a8Map() {
      //   let { chb0a8 } = this.codeMap
      //   if (chb0a8 && chb0a8.length !== 0) {
      //     return chb0a8
      //   }
      //   return []
      // },
      // getChb0gk() {
      //   const familyMemberList = this.familyMemberList
      //   const len = familyMemberList.length
      //   let result = 1
      //   let tag = false
      //   familyMemberList.map((item) => {
      //     if (item.relationship_desc === '本人') {
      //       tag = true
      //     }
      //   })
      //   if (tag) {
      //     result = len
      //   } else {
      //     result = len + 1
      //   }
      //   return result
      // },
      // getChb0g3() {
      //   const familyMemberList = this.familyMemberList
      //   const getChb0gk = this.getChb0gk
      //   let len = familyMemberList.length
      //   let num = 0
      //   if (len > 0) {
      //     for (let i = 0; i < len; i++) {
      //       const item = familyMemberList[i]
      //       num = new Big(num).plus(item.wages || 0)
      //     }
      //     num = new Big(num).div(new Big(getChb0gk))
      //   }
      //   return num.toFixed(2)
      // },
    },
    watch: {
      declareType(val, old) {
        // 切换申报模式时重新获取/校验数据
        if (val == '01' && old == '02') {
          this.handleBeforeCheck()
        }
      }
    }
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
