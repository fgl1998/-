<!-- 县级贫困残疾人大学生及特困残疾人子女大学生助学金 -->
<template>
  <view class="declare">
    <div class="progress-wrapper">
      <ComponentDeclareStep :current="2"></ComponentDeclareStep>
    </div>
    <!-- addressFilter="1569472" -->
    <div class="basic-info-wrapper">
      <ComponentDeclare
        :declareType="declareType"
        :fixedDeclareType="fixedDeclareType"
        :renderObj="renderObj"
        isOpenOCR
        addressFilter="1569472,1569481,1569469"
        :projectNumber="chi031"
        :projectName="chi031_desc"
        :declareConfig="declareConfig"
        @changeDeclareType="handleChangeDeclareType"
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
    <!-- 申报信息 -->
    <div class="space-top-wrapper">
      <ComponentPanel title="申报信息">
        <div class="panel-content">
          <div class="cell-items">
            <ComponentDeclarePicker
              label="教育层次"
              idName="c00053"
              :range="codeMap.c00053"
              placeholder="请选择教育层次"
              v-model="projectDeclareInfo.c00053"
              @change="getPickerValueDescC00053"></ComponentDeclarePicker>
          </div>
        </div>
      </ComponentPanel>
    </div>

    <div class="space-top-wrapper" v-if="showOhtherInput">
      <ComponentPanel title="父亲或母亲信息">
        <div class="panel-content">
          <div class="cell-items">
            <div class="cell-item required">
              <div class="key">父亲或母亲姓名</div>
              <div class="value">
                <input type="text" v-model="projectDeclareInfo.c00006" placeholder="请输入姓名" />
              </div>
            </div>
            <div class="cell-item required">
              <div class="key">父亲或母亲身份证号</div>
              <div class="value">
                <input
                  type="idcard"
                  maxlength="18"
                  @blur="handleBlurC00007"
                  v-model="projectDeclareInfo.c00007"
                  placeholder="请输入身份证号" />
              </div>
            </div>
            <ComponentDeclarePicker
              label="与子女关系"
              :range="codeMap.c00186"
              placeholder="请选择与子女关系"
              v-model="projectDeclareInfo.c00186"></ComponentDeclarePicker>
          </div>
        </div>
      </ComponentPanel>
    </div>

    <div class="space-top-wrapper">
      <ComponentPanel :title="showOhtherInput ? '父亲或母亲残疾信息' : '残疾信息'">
        <div class="panel-content">
          <div class="cell-items">
            <div class="cell-item required disabled">
              <div class="key">残疾人类别</div>
              <div class="value">
                {{ projectDeclareInfo.chb0h1Desc || '暂无' }}
              </div>
            </div>
            <div class="cell-item required disabled">
              <div class="key">残疾等级</div>
              <div class="value">
                {{ projectDeclareInfo.chb0h2Desc || '暂无' }}
              </div>
            </div>
            <div class="cell-item required disabled">
              <div class="key">残疾证号</div>
              <div class="value">{{ projectDeclareInfo.c03601 || '暂无' }}</div>
            </div>
            <div class="cell-item required disabled">
              <div class="key">办证时间</div>
              <div class="value">{{ projectDeclareInfo.chb0h9 || '暂无' }}</div>
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
  import ComponentDeclarePersonnel from '@/components/project/ez-declare-personnel/ez-declare-personnel.vue'
  import ComponentDeclarePicker from '@/components/project/ez-declare-picker/ez-declare-picker.vue'

  import { useDeclare } from '@/mixins'

  import { getIsDev } from '@/utils/get'
  import { checkIDCard } from '@/utils/check'
  import { getCodeListByCodeName } from '@/utils/custom-api'
  import { requestSPGetHo08 } from '@/service/api'
  import { showModal } from '@/utils/uni-api'

  export default {
    name: 'pageDeclare20023',
    data() {
      return {
        // 默认选中第一个人员类别
        selectFirst: true,
        // 基本信息 渲染配置
        renderObj: {
          idCard: true, // 身份证
          userName: true, // 姓名
          tel: true, // 联系电话
          permanentAddress: true // 户籍地址
        },
        // 自定义添加一些属性 防止双向绑定失败 例如 picker组件之类
        projectDeclareInfo: {
          c00006: '', // 父亲或母亲身份姓名
          c00007: '', // 父亲或母亲身份证号
          c00053: '', // 教育层次
          c00073: '', // 残疾学生类别
          chb0h6: '' // 补贴金额
        }
      }
    },
    components: {
      ComponentButton,
      ComponentPanel,
      ComponentDeclare,
      ComponentDeclareStep,
      ComponentDeclarePersonnel,
      ComponentDeclarePicker
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
        let c00053 = [] // 教育层次
        let c00186 = [] // 与子女关系

        try {
          c00053 = await getCodeListByCodeName('c00053')
        } catch (err) {
          if (isDev) {
            console.log('code table c00053 error：', err)
          }
        }

        try {
          c00186 = await getCodeListByCodeName('c00186')
        } catch (err) {
          if (isDev) {
            console.log('code table c00186 error：', err)
          }
        }

        this.codeMap = {
          ...this.codeMap,
          c00053,
          c00186
        }
      },
      // 捕获申报基本信息改变 不用修改
      handleChangeBasicInfo(e) {
        this.basicInfo = {
          ...e
        }
        const data = this.personnelList_old
        // 户籍地址为大竹县时
        if (e.district == '1569469') {
          if (data && data.length > 0) {
            let arr = []
            data.forEach((item) => {
              item.checked = false
              if (item.cac102 == '142') {
                item.checked = true
                this.personnelInfo = {
                  ...item
                }
                arr.push(item)
              }
            })
            this.personnelList = [...arr]
          } else {
            this.personnelList = [...data]
          }
        } else {
          this.personnelList = [...data]
        }
      },
      // 获取 picker 选择组件 的中文值
      getPickerValueDescC00053(id, val_desc, val) {
        let str = ''
        if (id === 'c00053') {
          if (val === '1') {
            str = '6000元/年'
          }
          if (val === '2') {
            str = '2000元'
          }
          if (val === '3') {
            str = '5000元'
          }
          if (val === '4') {
            str = '10000元'
          }
          this.projectDeclareInfo = {
            ...this.projectDeclareInfo,
            c00096_desc: val_desc,
            chb0h6: str
          }
        }
      },
      // 人员信息改变
      changePersonnelInfo(type) {
        // 残疾学生
        if (type === '142') {
          this.declareConfig = {
            ...this.declareConfig,
            isCheckDisability: true
          }
        }
        // 残疾人子女学生
        else if (type === '3185') {
          this.declareConfig = {
            ...this.declareConfig,
            isCheckDisability: false
          }
          this.projectDeclareInfo = {
            ...this.projectDeclareInfo,
            c00006: '', // 父母姓名
            c00007: '' // 父母身份证号
          }
        } else {
          this.declareConfig = {
            ...this.declareConfig,
            isCheckDisability: false
          }
        }
      },
      // 手动输入父母身份证号 校验
      handleBlurC00007(e) {
        let { value } = e.target
        value = value.trim()
        const checkResult = checkIDCard(value, '父亲或母亲身份证号')
        if (checkResult.status === '0') {
          this.projectDeclareInfo = {
            ...this.projectDeclareInfo,
            c03601: '',
            chb0h1: '',
            chb0h1Desc: '',
            chb0h2: '',
            chb0h2Desc: '',
            chb0h9: '',
            chb0hf: ''
          }
          showModal(checkResult.msg)
        } else {
          requestSPGetHo08(value, true, false)
            .then((res) => {
              this.projectDeclareInfo = {
                ...this.projectDeclareInfo,
                ...res
              }
            })
            .catch((err) => {
              this.projectDeclareInfo = {
                ...this.projectDeclareInfo,
                c03601: '',
                chb0h1: '',
                chb0h1Desc: '',
                chb0h2: '',
                chb0h2Desc: '',
                chb0h9: '',
                chb0hf: ''
              }
              showModal('系统检测到父亲或母亲不是残疾人，无法申报该补贴项目！')
            })
        }
      },
      // 设置残疾人信息
      setDisabledData(declareType) {
        // 残疾人数据返回格式
        // c03601: "51392219961015741053"
        // chb0h1: "5"
        // chb0h1Desc: "智力"
        // chb0h2: "3"
        // chb0h2Desc: "三级"
        // chb0h9: "2019-01-31"
        // chb0hf: "智力三级"

        const { c03601, chb0h1, chb0h1Desc, chb0h9, chb0h2, chb0h2Desc } = this.userInfo
        const { cac102 } = this.personnelInfo
        // 残疾学生
        if (cac102 === '142') {
          if (declareType === '01') {
            // 存在残疾证号
            if (c03601) {
              this.projectDeclareInfo = {
                ...this.projectDeclareInfo,
                chb0h1, // 残疾人类别
                chb0h1Desc,
                chb0h2, // 残疾等级
                chb0h2Desc,
                chb0h9, // 办证时间
                c03601 // 残疾证号
              }
            } else {
              this.projectDeclareInfo = {
                ...this.projectDeclareInfo,
                chb0h1: '', // 残疾人类别
                chb0h1Desc: '',
                chb0h2: '', // 残疾等级
                chb0h2Desc: '',
                chb0h9: '', // 办证时间
                c03601: '' // 残疾证号
              }
            }
          } else {
            this.projectDeclareInfo = {
              ...this.projectDeclareInfo,
              chb0h1: '', // 残疾人类别
              chb0h1Desc: '',
              chb0h2: '', // 残疾等级
              chb0h2Desc: '',
              chb0h9: '', // 办证时间
              c03601: '' // 残疾证号
            }
          }
        } else {
          this.projectDeclareInfo = {
            ...this.projectDeclareInfo,
            chb0h1: '', // 残疾人类别
            chb0h1Desc: '',
            chb0h2: '', // 残疾等级
            chb0h2Desc: '',
            chb0h9: '', // 办证时间
            c03601: '' // 残疾证号
          }
        }
      },
      // 设置数据 通过身份证获取的数据
      seDataByIdCard(data) {
        const { c03601, chb0h1, chb0h1Desc, chb0h9, chb0h2, chb0h2Desc } = data.disabledInfo
        if (c03601) {
          this.projectDeclareInfo = {
            ...this.projectDeclareInfo,
            chb0h1, // 残疾人类别
            chb0h1Desc, // 残疾人类别
            chb0h2, // 残疾等级
            chb0h2Desc,
            chb0h9, // 办证时间
            c03601 // 残疾证号
          }
        } else {
          this.projectDeclareInfo = {
            ...this.projectDeclareInfo,
            chb0h1: '', // 残疾人类别
            chb0h1Desc: '',
            chb0h2: '', // 残疾等级
            chb0h2Desc: '',
            chb0h9: '', // 办证时间
            c03601: '' // 残疾证号
          }
        }
      },
      // 检测数据输入格式是否正确 须根据项目需求更改
      handleCheckInput() {
        const {
          c03601, // 残疾证号
          c00006, // 父亲或母亲姓名
          c00007, // 父亲或母亲身份证
          c00053, // 教育层次
          c00186 // 与子女关系
        } = this.projectDeclareInfo
        const showOhtherInput = this.showOhtherInput

        if (!c00053) {
          showModal('请选择教育层次')
          return false
        }
        if (showOhtherInput) {
          if (!c00006) {
            showModal('请输入父亲或母亲姓名')
            return false
          }

          if (!c00007) {
            showModal('请输入父亲或母亲身份证号')
            return false
          } else {
            const checkResult = checkIDCard(c00007, '父亲或母亲身份证号')
            if (checkResult.status === '0') {
              showModal(checkResult.msg)
              return false
            }
          }
          if (!c00186) {
            showModal('请选择与子女关系')
            return false
          }
        }

        if (showOhtherInput) {
          if (!c03601) {
            showModal('申报人父亲或母亲不是残疾人，无法申报该补贴项目！')
            return false
          }
        } else {
          if (!c03601) {
            showModal('申报人不是残疾人，无法申报该补贴项目！')
            return false
          }
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
          currentAddress, // 现居住地址
          permanentAddress // 户籍地址
        } = this.basicInfo

        const {
          chb0h1, // 残疾人类别
          chb0h2, // 残疾等级
          chb0h9, // 办证时间
          c03601, // 残疾证号

          c00053, // 教育层次
          chb0h6, // 补贴金额
          c00006, // 父亲(母亲)姓名
          c00007, // 父亲(母亲)身份证号
          c00186 // 与子女关系
        } = this.projectDeclareInfo

        // 扩展字段
        const hb00BizMap = {
          chb0h1, // 残疾人类别
          chb0h2, // 残疾等级
          chb0h9, // 办证时间
          c03601, // 残疾证号

          c00053, // 教育层次
          // chb0h6: parseInt(chb0h6), // 补贴金额
          c00006, // 父亲(母亲)姓名
          c00007, // 父亲(母亲)身份证号
          c00186 // 与子女关系
        }

        this.handleDeclareData(hb00BizMap, '0')
      }
    },
    computed: {
      // 是否显示父母信息输入
      showOhtherInput() {
        const { cac102 } = this.personnelInfo
        let result = false
        if (cac102 === '3312' || cac102 === '3314' || cac102 === '3315') {
          result = true
        }
        return result
      }
    },
    watch: {
      'personnelInfo.cac102': {
        handler(val) {
          this.changePersonnelInfo(val)
          const declareType = this.declareType
          this.setDisabledData(declareType)
        },
        immediate: true
      },
      declareType(val) {
        if (val && val !== '00') {
          this.setDisabledData(val)
        }
      }
    }
  }
</script>

<style lang="scss" scoped></style>
