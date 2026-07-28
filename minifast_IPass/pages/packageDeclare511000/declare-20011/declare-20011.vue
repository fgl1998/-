<!-- 大学新生入学资助 (市级和县级) (教育局) -->
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
        currentAddressLabel="家庭住址"
        currentAddressPlaceholder="请输入家庭住址"
        :projectNumber="chi031"
        :projectName="chi031_desc"
        @changeDeclareType="handleChangeDeclareType"
        @changeBasicInfo="handleChangeBasicInfo"
        @changeCodeMap="handleChangeCodeMap"
        @changeAgentInfo="handleChangeAgentInfo"
        @changeDataByIdCard="handleChangeDataByIdCard">
      </ComponentDeclare>
    </div>

    <!-- 人员类别 -->
    <div class="space-top-wrapper">
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

            <!-- 录取院校名称 -->
            <div class="cell-item required">
              <div class="key">录取院校名称</div>
              <div class="value">
                <input type="text" v-model="projectDeclareInfo.j00008" placeholder="请输入录取院校名称" />
              </div>
            </div>

            <!-- 专业名称 -->
            <div class="cell-item required">
              <div class="key">专业名称</div>
              <div class="value">
                <input type="text" v-model="projectDeclareInfo.j00023" placeholder="请输入专业名称" />
              </div>
            </div>

            <ComponentSelectAddressMultitype
              label="录取院校位置"
              placeholder="请选择或输入录取院校位置"
              :isShowBtn="renderObj.permanentAddress"
              @clickBtn="projectDeclareInfo.j51002 = basicInfo.permanentAddress"
              v-model="projectDeclareInfo.j51002">
            </ComponentSelectAddressMultitype>

            <ComponentDeclarePicker
              label="学历层次"
              idName="j00074"
              :range="codeMap.c00116"
              placeholder="请选择学历层次"
              v-model="projectDeclareInfo.j00074"></ComponentDeclarePicker>

            <ComponentDeclarePicker
              label="政治面貌"
              idName="j00056"
              :range="codeMap.aac024"
              placeholder="请选择政治面貌"
              v-model="projectDeclareInfo.j00056"></ComponentDeclarePicker>

            <!-- 家庭人均收入 -->
            <div class="cell-item required">
              <div class="key">家庭人均收入</div>
              <div class="value">
                <input type="text" v-model="projectDeclareInfo.chb0g3" placeholder="请输入家庭人均收入" />
              </div>
            </div>

            <!-- 主要收入来源 -->
            <div class="cell-item required">
              <div class="key">主要收入来源</div>
              <div class="value">
                <input type="text" v-model="projectDeclareInfo.j00036" placeholder="请输入主要收入来源" />
              </div>
            </div>
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
  import ComponentSelectAddressMultitype from '@/components/project/ez-select-address-multitype/ez-select-address-multitype.vue'
  import ComponentDeclareCard from '../components/ez-declare-card/ez-declare-card.vue'
  import ComponentDeclarePersonnel from '@/components/project/ez-declare-personnel/ez-declare-personnel.vue'
  import ComponentDeclareRadio from '@/components/project/ez-declare-radio/ez-declare-radio.vue'
  import ComponentDeclarePicker from '@/components/project/ez-declare-picker/ez-declare-picker.vue'

  import { useDeclare } from '@/mixins'

  import { getCodeListByCodeName } from '@/utils/custom-api/index'
  import { showModal } from '@/utils/uni-api'
  import { requestSPGetSchoolOrgByPid, requestSPGetOrgListByOrgId } from '@/service/api'
  import { M_UPDATE_USER_LIST } from '@/store/constants'
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
          currentAddress: true, // 现居住地址
          permanentAddress: true // 户籍地址
        },
        // 自定义添加一些属性 防止双向绑定失败 例如 picker组件之类
        projectDeclareInfo: {
          aae019: 0,
          j51002: ''
        },
        districtRange: [],
        schoolRange: []
      }
    },
    components: {
      ComponentButton,
      ComponentPanel,
      ComponentDeclare,
      ComponentDeclareStep,
      ComponentSelectPermanentAddress,
      ComponentSelectAddressMultitype,
      ComponentDeclareCard,
      ComponentDeclareRadio,
      ComponentDeclarePersonnel,
      ComponentDeclarePicker
    },
    mixins: [useDeclare],
    // 监听页面加载，其参数为上个页面传递的数据，参数类型为Object（用于页面传参）
    onLoad(e) {
      this.handleOnLoad(e)
    },

    // 监听页面初次渲染完成
    onReady() {
      // this.requestSchoolOrgByPid().then((res) => {
      //   this.districtRange = [...res]
      // })
      this.requestSPGetOrgListByOrgIdData().then((res) => {
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
      async getCodeTableCacheData() {
        let c00116 = [] // 学历层次
        let aac024 = [] // 政治面貌

        try {
          c00116 = await getCodeListByCodeName('c00116')
        } catch (err) {
          console.error('code table c00116 error', err)
        }
        try {
          aac024 = await getCodeListByCodeName('aac024')
        } catch (err) {
          console.error('code table aac024 error', err)
        }
        this.codeMap = {
          ...this.codeMap,
          c00116,
          aac024
        }
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
            this.chi031 = '20011' // 申报项目编码
            this.chi031_desc = '市本级大学新生入学资助' // 申报项目中文
          } else {
            // 县级
            this.chi031 = '20012' // 申报项目编码
            this.chi031_desc = '县级大学新生入学资助' // 申报项目中文
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
      // 检测数据输入格式是否正确 须根据项目需求更改
      handleCheckInput() {
        const {
          aac004, //性别
          aac005, //民族
          j00046, //家庭住址

          j00000, // 区县
          j00001, // 学校
          chb017, //毕业学校名称
          j00008, //录取院校名称
          j00023, //专业名称
          j51002, //录取院校位置
          j00074, //学历层次
          j00056, //政治面貌
          chb0g3, //家庭人均年收入(元)
          j00036, //主要收入来源

          aae019 //发放金额
        } = this.projectDeclareInfo
        if (!j00000) {
          showModal('请选择学校所属区县')
          return false
        }
        if (!j00001) {
          showModal('请选择所属学校')
          return false
        }

        if (!j00008) {
          showModal('请输入录取院校名称')
          return false
        }

        if (!j00008) {
          showModal('请输入录取院校名称')
          return false
        }

        if (!j00023) {
          showModal('请输入专业名称')
          return false
        }

        if (!j51002) {
          showModal('请选择或输入录取院校位置')
          return false
        }

        if (!j00074) {
          showModal('请选择学历层次')
          return false
        }

        if (!j00056) {
          showModal('请选择政治面貌')
          return false
        }

        if (!chb0g3) {
          showModal('请输入家庭人均年收入')
          return false
        }

        if (!j00036) {
          showModal('请输入主要收入来源')
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
          nation, // 民族
          currentAddress // 现居住地址
        } = this.basicInfo

        const {
          aac004, //性别
          aac005, //民族
          j00046, //家庭住址

          chb017, //毕业学校名称
          j00008, //录取院校名称
          j00023, //专业名称
          j51002, //录取院校位置
          j00074, //学历层次
          j00056, //政治面貌
          chb0g3, //家庭人均年收入(元)
          j00036, //主要收入来源

          aae019 //发放金额
        } = this.projectDeclareInfo

        // 扩展字段
        const hb00BizMap = {
          aac004: gender, //性别
          aac005: nation, //民族
          j00046: currentAddress, //家庭住址

          chb017, //毕业学校名称
          j00008, //录取院校名称
          j00023, //专业名称
          j51002, //录取院校位置
          j00074, //学历层次
          j00056, //政治面貌
          chb0g3, //家庭人均年收入(元)
          j00036, //主要收入来源

          aae019 //发放金额
        }
        const addressInfo = {
          chb015: j00000,
          chb017: j00001
        }
        this.handleDeclareData(hb00BizMap, '0', null, null, addressInfo)
      }
    },
    computed: {},
    watch: {}
  }
</script>

<style lang="scss" scoped></style>
