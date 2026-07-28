<!-- 残疾人“圆梦助学工程”（残联） -->
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
        :declareConfig="declareConfig"
        :addressFilter="[
          '510524',
          '510525',
          '510503',
          '510521',
          '510504',
          '510502',
          '510522',
        ]"
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
              label="录取学历"
              idName="c00116"
              :range="codeMap.c00116"
              placeholder="请选择录取学历"
              v-model="projectDeclareInfo.c00116"
            ></ComponentDeclarePicker>
            <div class="cell-item required">
              <div class="key">录取大学（学院）</div>
              <div class="value">
                <input
                  type="text"
                  v-model="projectDeclareInfo.c00114"
                  placeholder="请输入录取大学（学院）"
                />
              </div>
            </div>
            <div class="cell-item required">
              <div class="key">录取专业</div>
              <div class="value">
                <input
                  type="text"
                  v-model="projectDeclareInfo.c00115"
                  placeholder="请输入录取专业"
                />
              </div>
            </div>
            <div class="cell-item required">
              <div class="key">高中毕业学校</div>
              <div class="value">
                <input
                  type="text"
                  v-model="projectDeclareInfo.c00212"
                  placeholder="请输入高中毕业学校"
                />
              </div>
            </div>
            <div class="cell-item required">
              <div class="key">准考证号</div>
              <div class="value">
                <input
                  type="text"
                  v-model="projectDeclareInfo.c00117"
                  placeholder="请输入准考证号"
                />
              </div>
            </div>
            <ComponentDeclarePicker
              label="残疾人与本人关系"
              :range="codeMap.c00211"
              placeholder="请选择关系"
              v-model="projectDeclareInfo.c00211"
            ></ComponentDeclarePicker>
            <div class="cell-item required disabled">
              <div class="key">补贴金额</div>
              <div class="value">
                {{ projectDeclareInfo.aae019 || '暂无' }}
              </div>
            </div>
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
                <input
                  type="text"
                  v-model="projectDeclareInfo.c00006"
                  placeholder="请输入姓名"
                />
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
                  placeholder="请输入身份证号"
                />
              </div>
            </div>
          </div>
        </div>
      </ComponentPanel>
    </div>

    <div class="space-top-wrapper">
      <ComponentPanel
        :title="showOhtherInput ? '父亲或母亲残疾信息' : '残疾信息'"
      >
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
        permanentAddress: true, // 户籍地址
        gender: true, // 性别
        currentAddress: true, // 现居住地址
      },
      // 自定义添加一些属性 防止双向绑定失败 例如 picker组件之类
      projectDeclareInfo: {
        c00006: '', // 父亲或母亲身份姓名
        c00007: '', // 父亲或母亲身份证号
        c00053: '', // 教育层次
        c00073: '', // 残疾学生类别
        aae019: '', // 补贴金额
        c00211: '', // 与残疾人关系
        c00114: '',
        c00115: '',
        c00116: '',
        c00117: '',
      },
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
      let c00116 = [] // 录取学历
      let c00211 = [] // 残疾人与本人关系

      try {
        c00116 = await getCodeListByCodeName('c00116')
      } catch (err) {
        if (isDev) {
          console.log('code table c00116 error：', err)
        }
      }

      try {
        c00211 = await getCodeListByCodeName('c00211')
      } catch (err) {
        if (isDev) {
          console.log('code table c00211 error：', err)
        }
      }

      this.codeMap = {
        ...this.codeMap,
        c00116,
        c00211,
      }
    },
    // 人员信息改变
    changePersonnelInfo(type) {
      // 残疾学生
      if (type === '744') {
        this.declareConfig = {
          ...this.declareConfig,
          isCheckDisability: true,
        }
      }
      // 学生父母残疾人
      else if (type === '745') {
        this.declareConfig = {
          ...this.declareConfig,
          isCheckDisability: false,
        }
        this.projectDeclareInfo = {
          ...this.projectDeclareInfo,
          c00006: '', // 父母姓名
          c00007: '', // 父母身份证号
        }
      } else {
        this.declareConfig = {
          ...this.declareConfig,
          isCheckDisability: false,
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
          chb0hf: '',
        }
        showModal(checkResult.msg)
      } else {
        requestSPGetHo08(value, true, false)
          .then((res) => {
            this.projectDeclareInfo = {
              ...this.projectDeclareInfo,
              ...res,
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
              chb0hf: '',
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

      const { c03601, chb0h1, chb0h1Desc, chb0h9, chb0h2, chb0h2Desc } =
        this.userInfo
      const { cac102 } = this.personnelInfo
      // 残疾学生
      console.log(1111)
      if (cac102 === '744') {
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
              c03601, // 残疾证号
            }
          } else {
            this.projectDeclareInfo = {
              ...this.projectDeclareInfo,
              chb0h1: '', // 残疾人类别
              chb0h1Desc: '',
              chb0h2: '', // 残疾等级
              chb0h2Desc: '',
              chb0h9: '', // 办证时间
              c03601: '', // 残疾证号
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
            c03601: '', // 残疾证号
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
          c03601: '', // 残疾证号
        }
      }
    },
    // 设置数据 通过身份证获取的数据
    seDataByIdCard(data) {
      const { c03601, chb0h1, chb0h1Desc, chb0h9, chb0h2, chb0h2Desc } =
        data.disabledInfo
      if (c03601) {
        this.projectDeclareInfo = {
          ...this.projectDeclareInfo,
          chb0h1, // 残疾人类别
          chb0h1Desc, // 残疾人类别
          chb0h2, // 残疾等级
          chb0h2Desc,
          chb0h9, // 办证时间
          c03601, // 残疾证号
        }
      } else {
        this.projectDeclareInfo = {
          ...this.projectDeclareInfo,
          chb0h1: '', // 残疾人类别
          chb0h1Desc: '',
          chb0h2: '', // 残疾等级
          chb0h2Desc: '',
          chb0h9: '', // 办证时间
          c03601: '', // 残疾证号
        }
      }
    },
    // 检测数据输入格式是否正确 须根据项目需求更改
    handleCheckInput() {
      const {
        chb0h1, // 残疾人类别
        chb0h2, // 残疾等级
        chb0h9, // 办证时间
        c03601, // 残疾证号

        aac004, // 性别
        c00008, // 户籍地址
        c00015, // 现居地址
        c00211, // 残疾人与本人关系
        c00116, // 录取学历
        aae019, // 发放金额
        c00114, // 录取大学（学院）
        c00115, // 录取专业
        c00117, // 准考证号
        c00212, // 高中毕业学校

        c00006, // 父亲(母亲)姓名
        c00007, // 父亲(母亲)身份证号
      } = this.projectDeclareInfo
      const showOhtherInput = this.showOhtherInput

      if (!c00116) {
        showModal('请选择录取学历')
        return false
      }
      if (!c00114) {
        showModal('请输入录取大学（学院）')
        return false
      }
      if (!c00115) {
        showModal('请输入录取专业')
        return false
      }
      if (!c00212) {
        showModal('请输入高中毕业学校')
        return false
      }
      if (!c00117) {
        showModal('请输入准考证号')
        return false
      }
      if (!c00211) {
        showModal('请选择残疾人与本人关系')
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
        gender, // 性别
        currentAddress, // 现居住地址
        permanentAddress, // 户籍地址
      } = this.basicInfo

      const {
        chb0h1, // 残疾人类别
        chb0h2, // 残疾等级
        chb0h9, // 办证时间
        c03601, // 残疾证号

        aac004, // 性别
        c00008, // 户籍地址
        c00015, // 现居地址
        c00211, // 残疾人与本人关系
        c00116, // 录取学历
        aae019, // 发放金额
        c00114, // 录取大学（学院）
        c00115, // 录取专业
        c00117,
        c00212, // 高中毕业学校

        c00006, // 父亲(母亲)姓名
        c00007, // 父亲(母亲)身份证号
      } = this.projectDeclareInfo

      // 扩展字段
      const hb00BizMap = {
        chb0h1, // 残疾人类别
        chb0h2, // 残疾等级
        chb0h9, // 办证时间
        c03601, // 残疾证号

        aac004: gender, // 性别
        c00008: permanentAddress, // 户籍地址
        c00015: currentAddress, // 现居地址
        c00211, // 残疾人与本人关系
        c00116, // 录取学历
        aae019, // 发放金额
        c00114, // 录取大学（学院）
        c00115, // 录取专业
        c00117,
        c00212, // 高中毕业学校
        c00006, // 父亲(母亲)姓名
        c00007, // 父亲(母亲)身份证号
      }

      this.handleDeclareData(hb00BizMap, '0')
    },
  },
  computed: {
    // 是否显示父母信息输入
    showOhtherInput() {
      const personnelInfo = this.personnelInfo
      let result = false
      if (personnelInfo.cac102 === '745') {
        result = true
      }
      return result
    },
  },
  watch: {
    'personnelInfo.cac102': {
      handler(val) {
        this.changePersonnelInfo(val)
        const declareType = this.declareType
        this.setDisabledData(declareType)
      },
      immediate: true,
    },
    'projectDeclareInfo.c00211': {
      handler(val) {
        if (val) {
          if (val == '1') {
            this.personnelList.map((item) => {
              let res = item
              res = Object.assign(res, { checked: false })
              if (item.cac102 == '744') {
                res = Object.assign(res, { checked: true })
              }
              return res
            })
            this.personnelInfo = this.personnelList.find(
              (item) => item.cac102 == '744'
            )
          } else {
            this.personnelList.map((item) => {
              let res = item
              res = Object.assign(res, { checked: false })
              if (item.cac102 == '745') {
                res = Object.assign(res, { checked: true })
              }
              return res
            })
            this.personnelInfo = this.personnelList.find(
              (item) => item.cac102 == '745'
            )
          }
        }
      },
      immediate: true,
    },
    'projectDeclareInfo.c00116': {
      handler(val) {
        let aae019 = 0
        if (val == '1' || val == '3') {
          aae019 = 5000
        }
        if (val == '2') {
          aae019 = 3000
        }

        this.projectDeclareInfo = {
          ...this.projectDeclareInfo,
          aae019,
        }
      },
      immediate: true,
    },
    userInfo: {
      handler(val) {
        const declareType = this.declareType
        if (val.user_id && declareType !== '00') {
          this.setDisabledData(declareType)
        }
      },
      immediate: true,
      deep: true,
    },
    declareType(val) {
      if (val && val !== '00') {
        this.setDisabledData(val)
      }
    },
  },
}
</script>

<style lang="scss" scoped></style>
