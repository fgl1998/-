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

            <ComponentDeclarePicker
              label="政治面貌"
              idName="j00056"
              :range="codeMap.aac024"
              placeholder="请选择政治面貌"
              v-model="projectDeclareInfo.j00056"></ComponentDeclarePicker>

            <!-- 专业名称 -->
            <div class="cell-item required">
              <div class="key">专业名称</div>
              <div class="value">
                <input type="text" v-model="projectDeclareInfo.j00023" placeholder="请输入专业名称" />
              </div>
            </div>

            <!-- 学制 -->
            <div class="cell-item required">
              <div class="key">学制</div>
              <div class="value">
                <input type="text" v-model="projectDeclareInfo.j00057" placeholder="请输入学制" />
              </div>
            </div>

            <!-- 学籍号 -->
            <div class="cell-item required">
              <div class="key">学籍号</div>
              <div class="value">
                <input type="text" maxlength="20" v-model="projectDeclareInfo.j00018" placeholder="请输入学籍号" />
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
                {{ projectDeclareInfo.chb0gf_desc || '暂无' }}
              </div>
            </div>

            <!-- 家庭人均年收入 -->
            <div class="cell-item required">
              <div class="key">家庭人均年收入</div>
              <div class="value">
                <input type="text" v-model="projectDeclareInfo.chb0g3" placeholder="家庭人均年收入" />
              </div>
            </div>

            <!-- 学习情况 -->
            <div class="cell-item textarea last required">
              <div class="key">学习情况（成绩排名情况）</div>
              <div class="value">
                <textarea maxlength="100" placeholder="请输入学习情况" v-model="projectDeclareInfo.j00030"></textarea>
              </div>
            </div>

            <!-- 获奖情况 -->
            <div class="cell-item textarea last required">
              <div class="key">获奖情况（在校期间）</div>
              <div class="value">
                <textarea maxlength="100" placeholder="请输入获奖情况" v-model="projectDeclareInfo.j00031"></textarea>
              </div>
            </div>

            <!-- 申请理由 -->
            <div class="cell-item textarea last required">
              <div class="key">申请理由</div>
              <div class="value">
                <textarea maxlength="100" placeholder="请输入申请理由" v-model="projectDeclareInfo.j00032"></textarea>
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
  import ComponentDeclareCard from '../components/ez-declare-card/ez-declare-card.vue'
  import ComponentDeclarePersonnel from '@/components/project/ez-declare-personnel/ez-declare-personnel.vue'
  import ComponentDeclareRadio from '@/components/project/ez-declare-radio/ez-declare-radio.vue'
  import ComponentDeclarePicker from '@/components/project/ez-declare-picker/ez-declare-picker.vue'

  import { useDeclare } from '@/mixins'

  import { getDate } from '@/utils/get'
  import { getCodeListByCodeName } from '@/utils/custom-api'
  import { showModal, showLoading, hideLoading } from '@/utils/uni-api'
  import { requestSPGetSchoolOrgByPid, requestSPGetOrgListByOrgId } from '@/service/api'
  import { M_UPDATE_USER_LIST } from '@/store/constants'
  export default {
    name: 'pageDeclare20380',
    data() {
      return {
        // 基本信息 渲染配置
        renderObj: {
          idCard: true, // 身份证
          userName: true, // 姓名
          tel: true, // 联系电话
          nation: true, // 民族
          nativePlace: true, // 籍贯
          permanentAddress: true, // 户籍地址
          aac203: true, // 社保卡银行卡号
          aaz502: true, // 社保卡状态
          aaf002: true // 社保卡银行卡类别
        },
        // 自定义添加一些属性 防止双向绑定失败 例如 picker组件之类
        projectDeclareInfo: {
          chb0ge: getDate('year') // 申报年度
        },
        districtRange: [],
        schoolRange: [],
        gradeRange: [], // 年级
        classRange: [] // 班级
      }
    },
    components: {
      ComponentButton,
      ComponentPanel,
      ComponentDeclare,
      ComponentDeclareStep,
      ComponentDeclareCard,
      ComponentDeclareRadio,
      ComponentDeclarePersonnel,
      ComponentDeclarePicker
    },
    mixins: [useDeclare],
    // 监听页面加载，其参数为上个页面传递的数据，参数类型为Object（用于页面传参）
    onLoad(e) {
      const { type, chb000 } = e
      // 编辑
      if (type && type === 'edit') {
        showLoading()
        this.isEditDeclareInfo = true
        // this._requestB029(chb000, e)
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
    onReady() {
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
        let aac024 = [] // 政治面貌

        try {
          aac024 = await getCodeListByCodeName('aac024')
        } catch (err) {
          console.error('code table aac024 error', err)
        }
        this.codeMap = {
          ...this.codeMap,
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
            this.chi031 = '20380' // 申报项目编码
            this.chi031_desc = '市本级中等职业教育国家奖学金' // 申报项目中文
          } else {
            // 县级
            this.chi031 = '20379' // 申报项目编码
            this.chi031_desc = '中等职业教育国家奖学金' // 申报项目中文
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
          aac005, //民族

          j00000, // 区县
          j00001, // 学校
          j00011,
          j00012,

          j00030, //学习情况
          j00031, //获奖情况
          j00032, //申请理由
          j00056, //政治面貌
          j00023, //专业名称
          j00057, //学制
          j00018, //学籍号
          chb0g3 // 家庭人均年收入
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

        if (!j00012) {
          showModal('请选择班级')
          return false
        }

        if (!j00056) {
          showModal('请选择政治面貌')
          return false
        }

        if (!j00023) {
          showModal('请输入专业名称')
          return false
        }

        if (!j00057) {
          showModal('请输入学制')
          return false
        }

        if (!j00018) {
          showModal('请输入学籍号')
          return false
        }

        if (!chb0g3) {
          showModal('请输入家庭人均年收入')
          return false
        }

        if (!j00030) {
          showModal('请输入学习情况')
          return false
        }

        if (!j00031) {
          showModal('请输入获奖情况')
          return false
        }

        if (!j00032) {
          showModal('请输入申请理由')
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
          nation, // 民族
          nativePlace // 籍贯
        } = this.basicInfo

        const {
          aac005, //民族

          j00000, // 区县
          j00001, // 学校
          j00011, // 年级
          j00012, // 班级
          chb0gf,
          chb0ge,
          j00018, //学籍号

          j00030, //学习情况
          j00031, //获奖情况
          j00032, //申请理由
          j00056, //政治面貌
          j00023, //专业名称
          j00057, //学制
          chb0g3 // 家庭人均年收入
        } = this.projectDeclareInfo

        // 扩展字段
        const hb00BizMap = {
          aac005: nation, //民族
          chb0g2: nativePlace, //籍贯

          j00000, // 区县
          j00001, // 学校

          chb0gf,
          chb0ge,
          j00018, //学籍号
          j00030, //学习情况
          j00031, //获奖情况
          j00032, //申请理由
          j00056, //政治面貌
          j00023, //专业名称
          j00057, //学制
          chb0g3 // 家庭人均年收入
        }
        const addressInfo = {
          chb015: j00000,
          chb017: j00001,
          chb018: j00011,
          chb019: j00012
        }
        this.handleDeclareData(hb00BizMap, '0', null, null, addressInfo)
      }
    },
    computed: {},
    watch: {}
  }
</script>

<style lang="scss" scoped></style>
