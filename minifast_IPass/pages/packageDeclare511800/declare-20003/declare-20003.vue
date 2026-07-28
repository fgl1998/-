<template>
  <!-- 县级教育扶贫救助基金（教育局） -->
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
        permanentAddressLabel="学生所在地"
        :customAddressObj="customAddressObj"
        @changeBasicInfo="handleChangeBasicInfo"
        @changeCodeMap="handleChangeCodeMap"
        @changeAgentInfo="handleChangeAgentInfo"
        @changeDataByIdCard="handleChangeDataByIdCard">
      </ComponentDeclare>
    </div>

    <!-- start 需要修改的地方开始 在以下代码中根据项目需求更改 上面代码勿动 -->
    <div class="personnel-type-wrapper space-top-wrapper">
      <ComponentDeclarePersonnel
        :renderData="personnelList"
        :isOpenCategoryNotes="true"
        @change="handleChangePersonnelInfo"></ComponentDeclarePersonnel>
    </div>

    <div class="declare-info-wrapper">
      <ComponentPanel title="申报信息">
        <div class="panel-content">
          <div class="cell-items">
            <!-- 学段 -->
            <ComponentDeclarePicker
              label="学段"
              idName="j00010"
              :range="codeMap.j00010_3"
              placeholder="请选择学段"
              v-model="projectDeclareInfo.j00010"
              @change="handlerSchoolData">
            </ComponentDeclarePicker>
            <!-- 学校所属区县 -->
            <ComponentDeclarePicker
              v-if="select"
              label="学校所属区县"
              idName="j00000"
              :range="districtRange"
              rangeKey="orgname"
              valueKey="orgid"
              placeholder="请选择学校所属区县"
              v-model="projectDeclareInfo.j00000"
              @change="handlerSchoolData">
            </ComponentDeclarePicker>
            <!-- 学校 -->
            <ComponentDeclarePicker
              v-if="select && projectDeclareInfo.j00000 && projectDeclareInfo.j00010"
              label="学校名称"
              idName="j00118"
              :range="schoolRange"
              rangeKey="cht212"
              valueKey="cht210"
              placeholder="请选择学校名称"
              v-model="projectDeclareInfo.j00118"></ComponentDeclarePicker>
            <div class="cell-item required" v-if="!select">
              <div class="key">学校名称</div>
              <div class="value">
                <input type="text" v-model="projectDeclareInfo.j00001" placeholder="请输入学校名称" />
              </div>
            </div>
            <ComponentDeclarePicker
              label="项目名称"
              idName="j00117"
              :range="j00117"
              placeholder="请选择项目名称"
              v-model="projectDeclareInfo.j00117"
              :renderValue="projectDeclareInfo.j00117desc"
              :isDemo="userInfo.idCard == '510124199111053218'"></ComponentDeclarePicker>

            <ComponentDeclarePicker
              label="申请年度"
              mode="date"
              fields="year"
              idName="chb0ge"
              placeholder="请选择申请年度"
              v-model="projectDeclareInfo.chb0ge"></ComponentDeclarePicker>
            <ComponentDeclarePicker
              label="申报学期"
              idName="j00095"
              :range="codeMap.r00093"
              placeholder="请选择申报学期"
              v-model="projectDeclareInfo.j00095"
              @change="getPickerValueDesc"></ComponentDeclarePicker>
            <ComponentDeclarePicker
              label="救助用途"
              idName="j00112"
              :range="codeMap.j00112"
              placeholder="请选择救助用途"
              v-model="projectDeclareInfo.j00112"
              @change="getPickerValueDesc"></ComponentDeclarePicker>
          </div>
        </div>
      </ComponentPanel>
    </div>
    <div class="declare-info-wrapper">
      <ComponentPanel title="监护人信息">
        <div class="panel-content">
          <div class="cell-items">
            <div class="cell-item required">
              <div class="key">姓名</div>
              <div class="value">
                <input type="text" maxlength="12" v-model="projectDeclareInfo.j00019" placeholder="请输入监护人姓名" />
              </div>
            </div>
            <div class="cell-item required">
              <div class="key">身份证号</div>
              <div class="value">
                <input
                  type="idcard"
                  maxlength="18"
                  v-model="projectDeclareInfo.j00020"
                  placeholder="请输入监护人身份证号" />
              </div>
            </div>
            <div class="cell-item required">
              <div class="key">家庭人口数</div>
              <div class="value">
                <input
                  type="number"
                  maxlength="18"
                  v-model="projectDeclareInfo.chb0gk"
                  placeholder="请输入家庭人口数" />
              </div>
            </div>

            <ComponentDeclarePicker
              label="监护人与本人关系"
              idName="j00092"
              :range="codeMap.chp031_1"
              placeholder="请选择"
              v-model="projectDeclareInfo.j00092"
              @change="getPickerValueDesc"></ComponentDeclarePicker>
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

  import ComponentDeclarePersonnel from '@/components/project/ez-declare-personnel/ez-declare-personnel.vue'
  import ComponentDeclareRadio from '@/components/project/ez-declare-radio/ez-declare-radio.vue'
  import ComponentDeclarePicker from '@/components/project/ez-declare-picker/ez-declare-picker.vue'

  import config from '@/config'
  import { useDeclare } from '@/mixins'
  import { useGetCurrentDate, useCheckIDCard } from '@/hooks/common'
  import { getCodeListByCodeName } from '@/utils/custom-api'
  import { checkIDCard } from '@/utils/check'
  import { showModal } from '@/utils/uni-api'
  import { requestB069, requestB135, requestSPGetOrgListByOrgId } from '@/service/api'
  export default {
    name: 'pageDeclare20003',
    data() {
      return {
        renderObj: {
          idCard: true, // 身份证
          userName: true, // 姓名
          tel: true, // 联系电话
          age: true, // 年龄
          gender: true, // 性别
          nation: true, // 民族
          permanentAddress: true // 户籍地址
        },

        projectDeclareInfo: {
          j00000: '',
          j00112: '', // 救助用途
          j00063: '',
          chb0ge: useGetCurrentDate('year', ''), // 申报年度
          j00095: new Date().getMonth() + 1 > 6 ? '2' : '1' // 申报季节
        },
        districtRange: [], // 区县
        schoolRange: [], // 学校
        j00117: [], // 项目名称数组
        select: false, // 学校是否下拉
        // 自定义户籍地址信息
        customAddressObj: null,
        // 接口是发在请求中
        isRequestNow: false
      }
    },
    components: {
      ComponentButton,
      ComponentPanel,
      ComponentDeclare,
      ComponentDeclareStep,
      ComponentSelectPermanentAddress,
      ComponentDeclareRadio,
      ComponentDeclarePersonnel,
      ComponentDeclarePicker
    },
    mixins: [useDeclare],
    // 监听页面加载，其参数为上个页面传递的数据，参数类型为Object（用于页面传参）
    onLoad(e) {
      this.handleOnLoad(e)

      // 获取学校所属地区
      requestSPGetOrgListByOrgId(null, false).then((res) => {
        const { list } = res.lists.orgList
        if (list && list.length > 0) {
          this.districtRange = [...list]
        }
      })

      this.$nextTick(() => {
        this.j00117 = this.codeMap.j00117
      })

      this.setDefaultData()
    },
    // 监听页面显示
    onShow() {},
    // 监听页面隐藏
    onHide() {},
    methods: {
      /**
       * 设置默认信息 用于演示
       */
      setDefaultData() {
        const { idCard } = this.userInfo
        if (idCard == '510124199111053218') {
          this.projectDeclareInfo = {
            ...this.projectDeclareInfo,
            j00010: '7',
            j00001: '西华大学',
            chb0gk: '3',
            j00019: '杨乃万',
            j00020: '510902199507236534',

            j00117: '9',
            j00117_desc: '大学本科通用',
            j00117desc: '大学本科通用',
            j00092: '05',
            // j00092_desc: '其他',
            // j00092desc: '其他',
            j00112: '4',
            j00092_desc: '高等教育学费、住宿、交通、生活',
            j00092desc: '高等教育学费、住宿、交通、生活'
          }
        }
      },
      /**
       * 获取码值数据
       */
      async getCodeTableCacheData() {
        let c00066 = [] // 儿童与监护人关系
        let j00010_3 = [] // 学段
        let j00112 = [] //救助用途
        let j00117 = [] //项目名称
        let r00093 = [] //申报季度
        let chp031_1 = [] // 与监护人关系

        try {
          c00066 = await getCodeListByCodeName('c00066')
        } catch (err) {
          console.error('code table c00066 error：', err)
        }
        try {
          j00112 = await getCodeListByCodeName('j00112')
        } catch (err) {
          console.error('code table j00112 error：', err)
        }
        try {
          j00117 = await getCodeListByCodeName('j00117')
        } catch (err) {
          console.error('code table j00117 error：', err)
        }
        try {
          r00093 = await getCodeListByCodeName('r00093')
        } catch (err) {
          console.error('code table r00093 error：', err)
        }
        try {
          j00010_3 = await getCodeListByCodeName('j00010_3')
        } catch (err) {
          console.error('code table j00010_3 error：', err)
        }
        try {
          chp031_1 = await getCodeListByCodeName('chp031_1')
        } catch (err) {
          console.error('code table chp031_1 error：', err)
        }

        this.codeMap = {
          ...this.codeMap,
          c00066,
          j00112,
          j00117,
          r00093,
          j00010_3,
          chp031_1
        }
      },
      /**
       * 请求获取学校数据
       */
      requestSchoolData(value = '165003', cht214) {
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
      /**
       * 条件改变 重新获取学校数据
       */
      handlerSchoolData() {
        let { j00010, j00000 } = this.projectDeclareInfo
        let isLSX = this.isLSX
        let res = this.codeMap.j00010_3.find((item) => item.aaa102 == j00010)
        let value = ''
        let arr = []
        if (res) {
          value = j00010
          this.projectDeclareInfo.j00112 = '4'
          switch (j00010) {
            // 学前教育
            case '1':
              arr = ['1']
              this.projectDeclareInfo.j00112 = '1'
              this.select = true
              break
            // 小学教育
            case '2':
              if (isLSX) {
                arr = ['2', '3']
              } else {
                arr = ['2']
              }
              this.projectDeclareInfo.j00112 = '2'
              this.select = true
              break
            // 初中教育
            case '3':
              if (isLSX) {
                arr = ['4', '5']
              } else {
                arr = ['4']
              }
              this.projectDeclareInfo.j00112 = '2'
              this.select = true
              break
            // 高中教育
            case '4':
              arr = ['6']
              this.projectDeclareInfo.j00112 = '3'
              this.select = true
              break
            // 中职教育
            case '5':
              arr = ['7']
              this.projectDeclareInfo.j00112 = '3'
              this.select = true
              break
            // 大学专科（含高职）
            case '6':
              arr = ['8']
              this.select = false
              break
            // 大学本科
            case '7':
              arr = ['9']
              this.select = false
              break
            // 研究生及以上
            case '8':
              arr = ['10']
              this.select = false
              break
            // 非雅安市学校
            case '9':
              if (isLSX) {
                arr = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11']
              } else {
                arr = ['1', '2', '4', '6', '7', '8', '9', '10', '11']
              }

              this.select = false
              break
            case '10':
              arr = ['12']
              this.select = false
              break
            default:
              arr = []
              this.select = false
          }
        }

        this.j00117 = this.codeMap.j00117.filter((item) => arr.find((one) => one == item.aaa102))
        if (this.j00117.length == 0) {
          this.j00117 = this.codeMap.j00117
        }
        if (!j00000) {
          return
        }
        this.requestSchoolData(j00000, value).then((res) => {
          this.schoolRange = [...res]
        })
      },
      /**
       * 检测数据输入格式是否正确 须根据项目需求更改
       */
      handleCheckInput() {
        const {
          aac002, // 身份证号
          aac003, // 姓名
          aae005, // 联系电话
          aae006, // 户籍地址
          j00010, //学段
          j00117, //项目名称
          j00118, //就读学校名称
          j00019, // 监护人（受托人）姓名
          chb0ge, //申报年度
          j00095, //申报季度
          j00112, //救助用途
          j00020, // 监护人（受托人）身份证号
          chb0gk, // 家庭人口
          j00092, // 监护人与本人关系
          j00001 // 就读学校
        } = this.projectDeclareInfo

        if (!j00010) {
          showModal('请输入学段')
          return false
        }
        if (this.select && !j00118) {
          showModal('请选择就读学校名称')
          return false
        }
        if (!this.select && !j00001) {
          showModal('请输入就读学校名称')
          return false
        }
        if (!j00117) {
          showModal('请输入项目名称')
          return false
        }

        if (!chb0ge) {
          showModal('请选择申报学期')
          return false
        }
        if (!j00095) {
          showModal('请选择申报')
          return false
        }
        if (!j00112) {
          showmodal('请选择救助用途')
          return false
        }

        if (!j00019) {
          showModal('请输入监护人姓名')
          return false
        }

        if (!j00020) {
          showModal('请输入监护人身份证号')
          return false
        } else {
          const checkResult = useCheckIDCard(j00020, '监护人身份证号')
          if (checkResult.status === '0') {
            showModal(checkResult.msg)
            return false
          }
        }
        if (!chb0gk) {
          showModal('请输入家庭人口数')
          return false
        }
        if (!j00092) {
          showModal('请选择监护人与本人关系')
          return false
        }

        return true
      },
      /**
       * 下一步
       */
      handleJumpNextStep() {
        if (!this.customAddressObj || !this.customAddressObj.district) {
          showModal('该补贴项目非建档立卡贫困户不允许申报！')
          return
        }
        if (!this.handleCheckComponentInput()) {
          return
        }
        if (!this.handleCheckInput()) {
          return
        }
        const {
          gender, //性别
          nation, //民族
          birthday //出生年月
        } = this.basicInfo
        const {
          aac002, // 身份证号
          aac003, // 姓名
          aae005, // 联系电话
          j00112, //救助用途
          j00010, //学段
          j00118, //就读学校名称
          aae006, //户籍地址
          j00095, // 申报季度
          j00019, // 监护人（受托人）姓名
          j00020, // 监护人（受托人）身份证号
          chb0gk, // 家庭人口
          j00092, // 监护人与本人关系
          chb0ge, //申报年度
          j00117, //项目名称
          j00001 // 就读学校
        } = this.projectDeclareInfo
        // 扩展字段
        var hb00BizMap = {
          j00010, //学段
          j00118, //就读学校名称
          aae006, //户籍地址
          j00095, // 申报季度
          j00112, //救助用途
          chb0ge, //申报年度
          j00019, // 监护人（受托人）姓名
          j00020, // 监护人（受托人）身份证号
          chb0gk, // 家庭人口
          aac004: gender, // 性别
          aac005: nation, //民族
          j00059: birthday, //出生年月
          j00092, //监护人与本人关系
          j00117 //项目名称
        }

        if (!this.select) {
          hb00BizMap = {
            ...hb00BizMap,
            j00001
          }
        } else {
          let res = this.schoolRange.find((item) => item.cht210 === j00118)
          hb00BizMap = {
            ...hb00BizMap,
            j00118,
            j00001: res.cht212
          }
        }

        this.handleDeclareData(hb00BizMap, '0')
      },
      /**
       * 获取用户建党立卡贫困户信息
       */
      getDataByIdCardAndUserName(aac002, aac003) {
        if (aac002 && aac003) {
          const check = checkIDCard(aac002)
          if (!this.isRequestNow && check.status == '1') {
            this.isRequestNow = true
            requestB135(aac002, aac003)
              .then((res) => {
                const { isHo07Message, cho073, cho074, cho075, chb015_desc, chb017_desc, chb018_desc } = res

                if (isHo07Message == '1') {
                  const permanentAddress = chb015_desc + '-' + chb017_desc + '-' + chb018_desc

                  this.customAddressObj = {
                    permanentAddress,
                    district: cho073,
                    township: cho074,
                    village: cho075
                  }
                } else {
                  showModal('该补贴项目非建档立卡贫困户不允许申报！')
                }
              })
              .catch(() => {
                showModal('该补贴项目非建档立卡贫困户不允许申报！')
              })
              .finally(() => {
                this.isRequestNow = false
              })
          }
        } else {
          this.customAddressObj = null
        }
      }
    },
    computed: {
      isLSX() {
        let result = false
        const data = this.customAddressObj
        if (data && data.district === '101174') {
          result = true
        }

        return result
      }
    },
    watch: {
      declareType: {
        handler(val) {
          if (val === '01') {
            let { idCard, userName } = this.userInfo
            this.getDataByIdCardAndUserName(idCard, userName)
          } else {
            this.customAddressObj = null
          }
        },
        immediate: true,
        deep: true
      },
      'basicInfo.userName': {
        handler(val) {
          if (val) {
            const { userName, idCard } = this.basicInfo
            this.getDataByIdCardAndUserName(idCard, userName)
          }
        },
        immediate: true,
        deep: true
      },
      'basicInfo.idCard': {
        handler(val) {
          if (val) {
            const { userName, idCard } = this.basicInfo
            this.getDataByIdCardAndUserName(idCard, userName)
          }
        },
        immediate: true,
        deep: true
      }
    }
  }
</script>

<style lang="scss" scoped>
  .declare-info-wrapper {
    margin-top: 30rpx;
  }
</style>
