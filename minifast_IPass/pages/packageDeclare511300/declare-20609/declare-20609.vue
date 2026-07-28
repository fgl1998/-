<!-- 残疾联 人工耳蜗 -->
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
        @changePermanentAddress="handleChangePermanentAddress">
      </ComponentDeclare>
    </div>

    <!-- start 需要修改的地方开始 在以下代码中根据项目需求更改 上面代码勿动 -->
    <div class="declare-info-wrapper">
      <ComponentPanel title="申报信息" titleSpace="32rpx" titleSpaceTop="16rpx" borderRadius="16rpx">
        <div class="panel-content">
          <div class="cell-items">
            <!--   <div class="cell-item required">
              <div class="key">享受补贴金额</div>
              <div class="value">{{ money || '0.00' }}元</div>
            </div> -->
            <div class="cell-item required">
              <div class="key">监护人身份证号码</div>
              <div class="value">
                <input
                  type="idcard"
                  v-model="projectDeclareInfo.c00007"
                  placeholder="请输入监护人身份证号码"
                  @blur="checkParent()" />
              </div>
            </div>
            <div class="cell-item required">
              <div class="key">监护人姓名</div>
              <div class="value">
                <input type="text" v-model="projectDeclareInfo.c00006" placeholder="请输入监护人姓名" />
              </div>
            </div>

            <ComponentDeclarePicker
              label="与受助人关系"
              idName="c00024"
              :range="codeMap.f00024"
              placeholder="请选择与受助人关系"
              v-model="projectDeclareInfo.c00024"></ComponentDeclarePicker>
          </div>
        </div>
      </ComponentPanel>
    </div>

    <div class="space-top-wrapper">
      <ComponentPanel title="残疾信息">
        <div class="panel-content">
          <div class="cell-items">
            <div class="cell-item required disabled">
              <div class="key">残疾类别</div>
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
  import ComponentDeclarePicker from '@/components/project/ez-declare-picker/ez-declare-picker.vue'

  import { useDeclare } from '@/mixins'

  import { getIsDev } from '@/utils/get'
  import { getCodeListByCodeName } from '@/utils/custom-api'
  import { showModal } from '@/utils/uni-api'

  export default {
    name: 'pageDeclare20609',

    data() {
      return {
        renderObj: {
          idCard: true, // 身份证
          userName: true, // 姓名
          tel: true, // 联系电话
          permanentAddress: true, // 户籍地址
          currentAddress: true, // 现居住地址
          gender: true // 性别
        },

        projectDeclareInfo: {
          chbaac: '',
          aae006: '',
          c00033: ''
        },
        money: null
      }
    },
    components: {
      ComponentButton,
      ComponentPanel,
      ComponentDeclare,
      ComponentDeclareStep,
      ComponentDeclarePicker
    },
    mixins: [useDeclare],
    // 监听页面加载，其参数为上个页面传递的数据，参数类型为Object（用于页面传参）
    onLoad(e) {
      this.handleOnLoad(e)
    },
    // 监听页面显示
    onShow() {},
    // 监听页面隐藏
    onHide() {},
    methods: {
      async getCodeTableCacheData() {
        const isDev = getIsDev() // 当前环境是否是开发环境
        let f00024 = [] // 申请人当前学历

        try {
          f00024 = await getCodeListByCodeName('f00024')
        } catch (err) {
          if (isDev) {
            console.log('code table f00024 error：', err)
          }
        }

        this.codeMap = {
          ...this.codeMap,
          f00024
        }
      },
      handleChangeDataByIdCard(value) {
        this.seDataByIdCard(value)
      },
      // 设置残疾人信息
      setDisabledData(declareType) {
        const { c03601, chb0h1, chb0h1Desc, chb0h9, chb0h2, chb0h2Desc } = this.userInfo
        // 残疾人数据返回格式
        // c03601: "51392219961015741053"
        // chb0h1: "5"
        // chb0h1Desc: "智力"
        // chb0h2: "3"
        // chb0h2Desc: "三级"
        // chb0h9: "2019-01-31"
        // chb0hf: "智力三级"
        // code: "1"
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
            // showModal('系统检测到申报人不是残疾人，无法申报该补贴项目！').then(
            //   () => {
            //     navigateBack(1)
            //   }
            // )
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
      // 户籍地址改变
      handleChangePermanentAddress() {
        const chb015 = this.basicInfo.district
        const chb017 = this.basicInfo.township
        const chb018 = this.basicInfo.village
        if (
          chb015 == '511303' ||
          chb015 == '511399' ||
          chb015 == '511304' ||
          chb015 == '511302' ||
          chb015 == '511381'
        ) {
          this.money = 30000 + '.00'
        }
        if (
          chb015 == '511321' ||
          chb015 == '511325' ||
          chb015 == '511322' ||
          chb015 == '511323' ||
          chb015 == '511324'
        ) {
          this.money = 10000 + '.00'
        }
      },
      // 检测数据输入格式是否正确 须根据项目需求更改
      handleCheckInput() {
        let declareType = this.declareType
        const {
          aac002, // 身份证号
          aac003, // 姓名
          aac004, // 性别
          aae005, // 联系电话
          aae006, // 户籍地址

          c00033, //家庭地址
          c03601, // 残疾证号
          chb0h1, // 残疾类别
          c00006, // 监护人姓名
          c00007, // 监护人身份证号码
          c00024 // 与受助人关系
        } = this.projectDeclareInfo

        if (!c03601) {
          showModal('请输入残疾证号', '提示', false)
          return false
        }
        if (!chb0h1) {
          showModal('请选择残疾类别', '提示', false)
          return false
        }
        if (!c00006) {
          showModal('请输入监护人姓名', '提示', false)
          return false
        }
        if (!c00007) {
          showModal('请输入监护人身份证号码', '提示', false)
          return false
        }
        if (!c00024) {
          showModal('请选择监护人与受助人关系', '提示', false)
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
          currentAddress // 现居住地址
        } = this.basicInfo

        const {
          aac002, // 身份证号
          aac003, // 姓名
          aac004, // 性别
          aae005, // 联系电话
          aae006, // 户籍地址
          chb015, // 区县编码
          chb017, // 乡镇编码
          chb018 // 村编码
        } = this.projectDeclareInfo

        const {
          c03601, // 残疾证号
          chb0h1, // 残疾类别
          c00006, // 监护人姓名
          c00007, // 监护人身份证号码
          c00024 // 与受助人关系
        } = this.projectDeclareInfo

        // 扩展字段
        let hb00BizMap = {
          c03601, // 残疾证号
          chb0h1, // 残疾类别
          c00006, // 监护人姓名
          c00007, // 监护人身份证号码
          c00024, // 与受助人关系
          aac004: gender,
          c00033: currentAddress //家庭住址
        }

        this.handleDeclareData(hb00BizMap, '0')
      }
    },
    computed: {},
    watch: {
      userInfo: {
        handler(val) {
          const declareType = this.declareType
          if (val.user_id && declareType !== '00') {
            this.setDisabledData(declareType)
          }
        },
        immediate: true,
        deep: true
      },
      declareType(val) {
        const { user_id } = this.userInfo
        if (val && user_id && val !== '00') {
          this.setDisabledData(val)
        }
      },
      'basicInfo.village': {
        handler(val) {
          if (val) {
            this.handleChangePermanentAddress()
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
</style>
