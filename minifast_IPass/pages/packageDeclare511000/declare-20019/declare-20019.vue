<!-- 县级普通高中国家助学金 -->
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
        :initData="initBasicInfo"
        permanentAddressType="country"
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
            <block v-if="projectDeclareInfo.j00000">
              <ComponentDeclarePicker
                label="学校"
                idName="j00001"
                :range="schoolRange"
                rangeKey="orgname"
                valueKey="orgid"
                placeholder="请选择学校"
                v-model="projectDeclareInfo.j00001"
                @change="handlePickerChange"></ComponentDeclarePicker>
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
                @change="handlePickerChange"></ComponentDeclarePicker>
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
                @change="handlePickerChange"></ComponentDeclarePicker>
            </block>

            <!-- 学籍号 -->
            <div class="cell-item required">
              <div class="key">学籍号</div>
              <div class="value">
                <input type="text" maxlength="20" v-model="projectDeclareInfo.j00018" placeholder="请输入学籍号" />
              </div>
            </div>

            <!-- 户主身份证号 -->
            <div class="cell-item required">
              <div class="key">户主身份证号</div>
              <div class="value">
                <input
                  type="idcard"
                  v-model="projectDeclareInfo.j03502"
                  @blur="handleBlurIdcard"
                  placeholder="请输入户主身份证号" />
              </div>
            </div>

            <!-- 户主名字 -->
            <div class="cell-item required">
              <div class="key">户主名字</div>
              <div class="value">
                <input type="text" v-model="projectDeclareInfo.j03501" placeholder="请输入户主名字" />
              </div>
            </div>

            <!-- 父亲或者母亲姓名 -->
            <div class="cell-item required">
              <div class="key">父亲或者母亲姓名</div>
              <div class="value">
                <input type="text" v-model="projectDeclareInfo.j00243" placeholder="请输入姓名" />
              </div>
            </div>

            <!-- 家长手机号 -->
            <div class="cell-item required">
              <div class="key">家长手机号</div>
              <div class="value">
                <input
                  type="number"
                  maxlength="11"
                  v-model="projectDeclareInfo.j00049"
                  @blur="handleBlurJ00049"
                  placeholder="请输入家长手机号" />
              </div>
            </div>

            <!-- 保教费 -->
            <block>
              <ComponentDeclarePicker
                label="是否开校免收幼儿保教费"
                idName="j00088"
                :range="codeMap.yesorno"
                placeholder="请选择"
                v-model="projectDeclareInfo.j00088"></ComponentDeclarePicker>
            </block>

            <div class="cell-item required disabled">
              <div class="key">申报年度</div>
              <div class="value">
                {{ projectDeclareInfo.chb0ge || '暂无' }}
              </div>
            </div>

            <div class="cell-item required disabled">
              <div class="key">申报学期</div>
              <div class="value">
                {{ projectDeclareInfo.chb0gf_desc || '暂无' }}
              </div>
            </div>

            <div class="cell-item required">
              <div class="key">家庭人均年收入(元)</div>
              <div class="value">
                <input type="number" v-model="projectDeclareInfo.chb0g3" placeholder="请输入家庭人均年收入(元)" />
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

    <!-- 量化体系认定填报内容组件 -->
    <ComponentDeclareEducation ref="educationDeclareRef" />
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
  import ComponentDeclareCard from '../components/ez-declare-card/ez-declare-card.vue'
  import ComponentDeclarePersonnel from '@/components/project/ez-declare-personnel/ez-declare-personnel.vue'
  import ComponentDeclareRadio from '@/components/project/ez-declare-radio/ez-declare-radio.vue'
  import ComponentDeclarePicker from '@/components/project/ez-declare-picker/ez-declare-picker.vue'
  import ComponentDeclareEducation from '@/components/project/ez-declare-education/ez-declare-education.vue'

  import { mapGetters } from 'vuex'
  import Big from '@/utils/big.min.js'

  import { useDeclare } from '@/mixins'

  import { getDate, getAge } from '@/utils/get'
  import { checkIDCard, checkPhoneNumber } from '@/utils/check'
  import { showModal, showLoading, hideLoading } from '@/utils/uni-api'
  import { requestB029, requestSPGetSchoolOrgByPid, requestSPGetOrgListByOrgId } from '@/service/api'
  import { EDIT_SUBSIDY_INFO, UPDATE_EDIT_SUBSIDY_INFO, M_UPDATE_USER_LIST } from '@/store/constants'

  export default {
    name: 'pageDeclare20019',
    data() {
      return {
        // 基本信息 渲染配置
        renderObj: {
          idCard: true, // 身份证
          userName: true, // 姓名
          gender: true, // 性别
          permanentAddress: true, // 户籍地址
          nativePlace: true, // 籍贯
          nature: true, // 户口性质
          tel: true, // 联系电话
          nation: true, // 民族

          aac203: true, // 社保卡银行卡号
          aaz502: true, // 社保卡状态
          aaf002: true // 社保卡银行卡类别
        },
        districtRange: [], // 区县
        schoolRange: [], // 学校
        gradeRange: [], // 年级
        classRange: [], // 班级
        projectDeclareInfo: {
          chb0ge: getDate('year'), // 申报年度
          chb0gf: '', // 申报学期
          chb0gf_desc: '', // 申报学期中文
          j00000: '',
          j00001: '',
          j000011: '',
          j000012: '',
          j03502: '', //户主身份证号
          j03501: '', //户主姓名
          j00243: '' //父亲或母亲姓名
        },
        aka131: '', // 人员类别
        familyMemberList: [], // 家庭成员
        initBasicInfo: null, // 初始化基本信息
        isEditDeclareInfo: false // 当前页面状态是否为修改申报信息
      }
    },
    components: {
      ComponentButton,
      ComponentPanel,
      ComponentDeclare,
      ComponentDeclareStep,
      ComponentSelectPermanentAddress,
      ComponentDeclareCard,
      ComponentDeclareRadio,
      ComponentDeclarePersonnel,
      ComponentDeclarePicker,
      ComponentDeclareEducation
    },
    mixins: [useDeclare],
    // 监听页面加载，其参数为上个页面传递的数据，参数类型为Object（用于页面传参）
    onLoad(e) {
      const { type, chb000, aae100 } = e
      // 编辑
      if (type && type === 'edit') {
        showLoading()
        this.isEditDeclareInfo = true
        this._requestB029(chb000, aae100, e)
      } else {
        // 申报
        this.requestSPGetOrgListByOrgIdData().then((res) => {
          this.districtRange = [...res]
        })
        const month = new Date().getMonth() + 1
        if (month >= 3 && month <= 6) {
          this.projectDeclareInfo = {
            ...this.projectDeclareInfo,
            chb0gf: '1',
            chb0gf_desc: '春季'
          }
        } else if (month >= 9 && month <= 12) {
          this.projectDeclareInfo = {
            ...this.projectDeclareInfo,
            chb0gf: '2',
            chb0gf_desc: '秋季'
          }
        } else {
          this.projectDeclareInfo = {
            ...this.projectDeclareInfo,
            chb0gf: '0',
            chb0gf_desc: '假期'
          }
        }
        this.handleOnLoad(e)
      }
    },

    // 监听页面初次渲染完成
    onReady() {},
    // 监听页面显示
    onShow() {},
    // 监听页面隐藏
    onHide() {},
    methods: {
      // 请求申报详情
      _requestB029(chb000, aae100, e) {
        showLoading()
        requestB029(chb000, aae100, false)
          .then((res) => {
            this.setDeclareInfo(res, e)
          })
          .catch(() => {
            hideLoading()
          })
      },
      // 设置申报信息
      setDeclareInfo(data, e) {
        showLoading()
        // console.log(data, '===============')
        const { hb00BizMap, lists } = data
        const { chb06gList, chb0ggList, hp03List, hp02List, hi21List } = lists

        const personnelInfo = { ...this.personnelInfo }

        // 上传的材料
        const hi21List_list = hi21List.list
        this.$store.commit(UPDATE_EDIT_SUBSIDY_INFO, {
          ...this.editSubsidyInfo,
          hi21List: hi21List_list
        })
        // 家庭成员信息
        const hp03List_list = hp03List.list

        const {
          aac002,
          aac003,
          aac004, // 性别
          aac004Desc,
          aac005, // 民族
          aac005Desc,
          aae005, // 电话
          aae006, // 户籍地址
          chb0g2, // 籍贯
          j00045, // 户口性质
          j00045Desc, // 户口性质

          chb015,
          chb017,
          chb018,
          chb019,

          aka131, // 人员类别

          j00000, // 学校所属区县
          j00001, // 学校
          j00001desc, // 学校名称
          j00011, // 年级
          j00011desc, // 年级名称
          j00012, // 班级
          j00012desc, // 班级名称
          j00018, // 学生学籍号
          j00048, // 邮政编码
          j00088, // 是否保教费
          j00049, // 家长手机号
          j03502, //户主身份证号
          j03501, //户主姓名
          j00243, //父亲或母亲姓名
          chb0ge, // 申报年度
          chb0gf, // 申报学期
          chb0g1, // 入学时间

          chb0g3 // 家庭人均收入
        } = hb00BizMap
        this.aka131 = aka131
        // ===== 基本信息设置 start ======
        const basicInfo = {
          userName: aac003,
          tel: aae005,
          idCard: aac002,
          age: getAge(aac002),
          gender: aac004,
          gender_desc: aac004Desc,
          nation: aac005,
          nation_desc: aac005Desc,
          nativePlace: chb0g2,
          nature: j00045,
          nature_desc: j00045Desc,
          permanentAddress: aae006
        }
        this.initBasicInfo = {
          ...basicInfo
        }
        // console.log(basicInfo, 'initBasicInfo=========================')
        // ===== 基本信息设置 end ======

        // ===== 家庭成员信息 start ======
        let familyMemberList = []
        hp03List_list.map((item, index) => {
          var obj = {
            id: index,
            name: item.aac003, // 姓名
            gender: item.aac004 === '男' ? '1' : '2', // 性别
            gender_desc: item.aac004, // 性别
            age: item.chp034, // 年龄
            relationship: item.chp031, // 关系
            relationship_desc: item.chp031, // 关系
            workAdress: item.chb48b, // 工作学习单位
            job: item.aac111, // 职业
            healthy: item.chb485,
            healthy_desc: item.chb485, // 健康状况
            wages: item.chp032 // 年收入
          }
          familyMemberList.push(obj)
        })
        this.familyMemberList = [...familyMemberList]
        // ===== 家庭成员信息 end ======

        // ===== 申报信息 start ======
        let projectDeclareInfo = {
          j00018, // 学生学籍号
          j00048, // 邮政编码
          j00049, // 家长手机号
          j03502, //户主身份证号
          j03501, //户主姓名
          j00243, //父亲或母亲姓名
          chb0ge, // 申报年度
          chb0gf, // 申报学期
          chb0g1, // 入学时间
          j00088, // 是否保教费

          chb0g3 // 家庭人均收入
        }

        this.projectDeclareInfo = {
          ...projectDeclareInfo
        }

        Promise.all([
          this.requestSPGetOrgListByOrgIdData(),
          this.requestSchoolOrgByPid(chb015),
          this.requestSchoolOrgByPid(chb017),
          this.requestSchoolOrgByPid(chb018)
        ])
          .then((res) => {
            // console.log(res, 789)
            this.districtRange = [...res[0]]
            this.schoolRange = [...res[1]]
            this.gradeRange = [...res[2]]
            this.classRange = [...res[3]]

            projectDeclareInfo = {
              ...projectDeclareInfo,
              j00000: chb015, // 学校所属区县
              j00001: chb017, // 学校
              j00001desc, // 学校名称
              j00011: chb018, // 年级
              j00011desc, // 年级名称
              j00012: chb019, // 班级
              j00012desc // 班级名称
            }
            this.projectDeclareInfo = {
              ...projectDeclareInfo
            }
            hideLoading()
          })
          .catch((err) => {
            hideLoading()
          })
        // ===== 申报信息 end ======

        this.handleOnLoad(e)
      },
      // 捕获 familyMemberList 不用修改
      handleChangeCardList(type, data) {
        this.familyMemberList = [...data]
      },
      // 请求学校所属地区
      requestSPGetOrgListByOrgIdData() {
        return new Promise((resolve, reject) => {
          requestSPGetOrgListByOrgId()
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
      // 请求学校,班级，年级
      requestSchoolOrgByPid(porgid = '110386') {
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
          // 市本级
          if (val === '165015') {
            this.chi031 = '20019' // 申报项目编码
            this.chi031_desc = '市本级学前教育家庭经济困难儿童资助' // 申报项目中文
          } else {
            // 县级
            this.chi031 = '20020' // 申报项目编码
            this.chi031_desc = '县级学前教育家庭经济困难儿童资助' // 申报项目中文
          }
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
      // 手动输入身份证号 失去焦点监听
      handleBlurIdcard(e) {
        const { value } = e.target
        const checkResult = checkIDCard(value)
        if (checkResult.status === '0') {
          showModal(checkResult.msg)
        }
      },
      // 手动输入手机号 失去焦点监听
      handleBlurJ00049(e) {
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
          j00001, // 学校
          j00011, // 年级
          j00012, // 班级
          j00018, // 学生学籍号
          j00048, // 邮政编码
          j00049, // 家长手机号
          j03502, //户主身份证号
          j03501, //户主姓名
          j00243, //父亲或母亲姓名
          chb0ge, // 申报年度
          chb0gf, // 申报学期
          chb0g1, // 入学时间

          chb0g2, // 籍贯
          j00045, // 户口性质
          aac004, // 性别
          aac005, // 民族
          j00088, // 是否保教费

          chb0g3 // 家庭人均收入
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
          showModal('请选择年级')
          return false
        }

        if (!j00018) {
          showModal('请输入学籍号')
          return false
        } else {
          if (j00018.trim().length < 16) {
            showModal('学籍号格式错误，请重新输入大于16位的学籍号！')
            return false
          }
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

        if (!j03501) {
          showModal('请输入户主名字')
          return false
        }

        if (!j00243) {
          showModal('请输入父亲或母亲名字')
          return false
        }

        if (!j00049) {
          showModal('请输入家长手机号')
          return false
        } else {
          const checkResult = checkPhoneNumber(j00049, '家长手机号')
          if (checkResult.status === '0') {
            showModal(checkResult.msg)
            return false
          }
        }
        // if (!j00048) {
        //   showModal('请输入邮政编码')
        //   return false
        // } else {
        //   if (j00048.length !== 6) {
        //     showModal('邮政编码格式错误，请重新输入6位邮政编码！')
        //     return false
        //   }
        // }
        if (!j00088) {
          showModal('请选择是否保教费')
          return false
        }
        if (!chb0g3) {
          showModal('请输入家庭年收入')
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

        const educationResult = this.$refs.educationDeclareRef.handleCheckInput()
        if (!educationResult) {
          return
        }
        const familyMemberList = this.familyMemberList
        // const getChb0g3 = this.getChb0g3
        const { nation, gender, nativePlace, nature, district, township, village, permanentAddress } = this.basicInfo
        const {
          j00000, // 学校所属区县
          j00001, // 学校
          j00001desc, // 学校名称
          j00011, // 年级
          j00011desc, // 年级名称
          j00012, // 班级
          j00012desc, // 班级名称
          j00018, // 学生学籍号
          // j00048, // 邮政编码
          j00049, // 家长手机号
          j03502, //户主身份证号
          j03501, //户主姓名
          j00243, //父亲或母亲名字
          chb0ge, // 申报年度
          j00088, //是否报教费
          chb0gf, // 申报学期
          chb0g1, // 入学时间

          chb0g2, // 籍贯
          j00045, // 户口性质
          aac004, // 性别
          aac005, // 民族

          chb0g3 // 家庭人均收入
        } = this.projectDeclareInfo
        const addressInfo = {
          chb015: j00000,
          chb017: j00001,
          chb018: j00011,
          chb019: j00012
        }

        const {
          j00219, //家庭人均年收入（可支配收入）
          j00220, //家庭房产情况
          j00221, //车辆情况
          j00222, //经商办企业情况
          j00223, //债务状况
          j00224, //家庭户口所在区域
          j00225, //家庭所在城乡
          j00226, //家庭居住环境（家用电器使用）
          j00227, //重大自然灾害
          j00228, //重大突发意外事件
          j00229, //突发重大疾病状况
          j00230, //家庭居成员职业状况
          j00231, //家庭成员残疾情况
          j00232, //家庭成员健康状况
          j00233, //父母劳动能力状况
          j00234, //赡养60岁以上老人数
          j00235, //抚养未成年人数
          j00236, //家庭负担学生上学人数
          j00237, //家庭受教育程度
          j00238, //学生亲兄弟姐妹在高收费的非普惠性民办学校（含幼儿园）就读的
          j00239, //生活奢侈浪费，在校消费情况与其家庭经济困难状况不相符的其他高消费行为或不当消费行为的
          j00240, //家庭所在地交通情况
          j00242 //就读学校名称
        } = educationResult
        // 扩展字段
        const hb00BizMap = {
          // chb015, // 学校所属区县
          j00001desc, // 学校名称
          j00011desc, // 年级名称
          j00012desc, // 班级名称
          // chb017:j00001,
          // chb018:j00011,

          j00088, //是否报教费

          j00018, // 学生学籍号
          // j00048, // 邮政编码
          j00049, // 家长手机号
          j03502, //户主身份证号
          j03501, //户主姓名
          j00243, //父亲或母亲名字
          chb0ge, // 申报年度
          chb0gf, // 申报学期
          // chb0g1, // 入学时间

          chb0g2: nativePlace, // 籍贯
          j00045: nature, // 户口性质
          aac004: gender, // 性别
          aac005: nation, // 民族
          j00004: permanentAddress, //户籍所在地

          chb0g3, // 家庭人均收入

          j00219, //家庭人均年收入（可支配收入）
          j00220, //家庭房产情况
          j00221, //车辆情况
          j00222, //经商办企业情况
          j00223, //债务状况
          j00224, //家庭户口所在区域
          j00225, //家庭所在城乡
          j00226, //家庭居住环境（家用电器使用）
          j00227, //重大自然灾害
          j00228, //重大突发意外事件
          j00229, //突发重大疾病状况
          j00230, //家庭居成员职业状况
          j00231, //家庭成员残疾情况
          j00232, //家庭成员健康状况
          j00233, //父母劳动能力状况
          j00234, //赡养60岁以上老人数
          j00235, //抚养未成年人数
          j00236, //家庭负担学生上学人数
          j00237, //家庭受教育程度
          j00238, //学生亲兄弟姐妹在高收费的非普惠性民办学校（含幼儿园）就读的
          j00239, //生活奢侈浪费，在校消费情况与其家庭经济困难状况不相符的其他高消费行为或不当消费行为的
          j00240, //家庭所在地交通情况
          j00242 //就读学校名称
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
            chp032: item.wages // 年收入
          })
        })
        familyMember = [...arr]

        this.handleDeclareData(hb00BizMap, '0', null, familyMember, addressInfo)
      }
    },
    computed: {
      ...mapGetters([EDIT_SUBSIDY_INFO]),
      // 获取家庭人均年收入
      getChb0g3() {
        const familyMemberList = this.familyMemberList
        let len = familyMemberList.length
        let num = 0 // 总金额
        let result = 1 // 家庭总人数
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
        if (len > 0) {
          for (let i = 0; i < len; i++) {
            const item = familyMemberList[i]
            num = new Big(num).plus(item.wages || 0)
          }
          num = new Big(num).div(new Big(result))
        }
        return num.toFixed(2)
      }
    },
    watch: {
      'projectDeclareInfo.j00011desc': {
        handler(val) {
          let str = ''
          if (val) {
            str = val.substr(1, 4) + '年9月'
          }
          this.projectDeclareInfo = {
            ...this.projectDeclareInfo,
            chb0g1: str
          }
        },
        immediate: true
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
