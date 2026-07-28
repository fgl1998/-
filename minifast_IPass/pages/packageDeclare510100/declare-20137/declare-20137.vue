<!-- 城镇部分计划生育家庭奖励扶助制度 卫生健康委 -->
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
        @changeDataByIdCard="handleChangeDataByIdCard">
      </ComponentDeclare>
    </div>

    <!-- start 需要修改的地方开始 在以下代码中根据项目需求更改 上面代码勿动 -->
    <!-- 申报信息 -->
    <div class="space-top-wrapper">
      <ComponentPanel title="申报信息">
        <div class="panel-content">
          <div class="cell-items">
            <ComponentDeclarePicker
              label="婚姻状况"
              idName="w00041"
              :range="codeMap.aac017"
              placeholder="请选择婚姻状况"
              v-model="projectDeclareInfo.w00041">
            </ComponentDeclarePicker>

            <ComponentDeclarePicker
              label="婚姻变动年月"
              idName="w00072"
              mode="date"
              fields="month"
              :required="false"
              :endTime="today_m"
              placeholder="请选择婚姻变动年月"
              v-model="projectDeclareInfo.w00072">
            </ComponentDeclarePicker>
          </div>
        </div>
      </ComponentPanel>
    </div>

    <div class="space-top-wrapper">
      <ComponentPanel title="配偶信息">
        <div class="panel-content">
          <div class="cell-items">
            <div class="cell-item required">
              <div class="key">配偶姓名</div>
              <div class="value">
                <input type="text" v-model="projectDeclareInfo.w03006" placeholder="请输入配偶姓名" />
              </div>
            </div>

            <div class="cell-item required">
              <div class="key">配偶身份证号码</div>
              <div class="value">
                <input
                  type="idcard"
                  maxlength="18"
                  v-model="projectDeclareInfo.w00038"
                  placeholder="请输入配偶身份证号码"
                  @change="handleBlurW00038" />
              </div>
            </div>

            <ComponentDeclarePicker
              label="配偶户口性质"
              idName="w00044"
              :range="codeMap.dac009"
              placeholder="请选择配偶户口性质"
              v-model="projectDeclareInfo.w00044">
            </ComponentDeclarePicker>

            <ComponentDeclarePicker
              label="配偶的婚姻状况"
              idName="w00073"
              :range="codeMap.aac017"
              placeholder="请选择配偶的婚姻状况"
              v-model="projectDeclareInfo.w00073">
            </ComponentDeclarePicker>

            <ComponentDeclarePicker
              label="配偶的婚姻变动年月"
              idName="w00074"
              mode="date"
              fields="month"
              :required="false"
              :endTime="today_m"
              placeholder="请选择"
              v-model="projectDeclareInfo.w00074">
            </ComponentDeclarePicker>
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
  import ComponentSelectCurrentAddress from '@/components/project/ez-select-current-address/ez-select-current-address.vue'
  import ComponentDeclareCard from '../components/ez-declare-card/ez-declare-card.vue'
  import ComponentDeclarePersonnel from '@/components/project/ez-declare-personnel/ez-declare-personnel.vue'
  import ComponentDeclareRadio from '@/components/project/ez-declare-radio/ez-declare-radio.vue'
  import ComponentDeclarePicker from '@/components/project/ez-declare-picker/ez-declare-picker.vue'

  import { useDeclare } from '@/mixins'

  import { getIsDev, getDate } from '@/utils/get'
  import { checkIDCard } from '@/utils/check'
  import { getCodeListByCodeName } from '@/utils/custom-api'
  import { showModal } from '@/utils/uni-api'

  export default {
    name: 'pageDeclare20137',
    data() {
      return {
        // 基本信息 渲染配置
        renderObj: {
          idCard: true, // 身份证
          userName: true, // 姓名
          tel: true, // 联系电话
          nature: true, // 户口性质
          age: true, // 年龄
          gender: true, // 性别
          permanentAddress: true, // 现居住地址
          birthday: true // 出生年月
        },
        today_m: getDate('month'),
        projectDeclareInfo: {
          w00067: '',
          w00040: '',
          w00081: ''
        }
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
        const isDev = getIsDev //当前环境是否是开发环境
        let aac017 = [] // 婚姻状况

        try {
          aac017 = await getCodeListByCodeName('aac017')
        } catch (err) {
          if (isDev) {
            console.log('code table aac017 error', err)
          }
        }

        this.codeMap = {
          ...this.codeMap,
          aac017
        }
      },
      // 手动输入配偶身份证号 失去焦点监听
      handleBlurW00038(e) {
        const { value } = e.target
        const checkResult = checkIDCard(value)
        if (checkResult.status === '0') {
          showModal(checkResult.msg)
        }
      },
      // 检测数据输入格式是否正确 须根据项目需求更改
      handleCheckInput() {
        const {
          aac004, //性别
          chb00l, //年龄
          w00030, //出生日期
          w00045, //申请人户口性质

          w00041, //婚姻状况
          w00072, //婚姻变动年月

          w03006, //配偶姓名
          w00038, //配偶身份证号码
          w00044, //配偶户口性质
          w00073, //配偶的婚姻状况
          w00074 //配偶的婚姻变动年月
        } = this.projectDeclareInfo

        if (!w00041) {
          showModal('请选择婚姻状况')
          return false
        }

        if (!w00072) {
          showModal('请选择婚姻变动年月')
          return false
        }

        if (!w03006) {
          showModal('请输入配偶姓名')
          return false
        }

        if (!w00038) {
          showModal('请输入配偶身份证号码')
          return false
        } else {
          const checkResult = checkIDCard(w00038, '配偶身份证号码')
          if (checkResult.status === '0') {
            showModal(checkResult.msg)
            return false
          }
        }

        if (!w00044) {
          showModal('请选择配偶户口性质')
          return false
        }
        if (!w00073) {
          showModal('请选择配偶的婚姻状况')
          return false
        }
        if (!w00074) {
          showModal('请选择配偶的婚姻变动年月')
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
        const declareType = this.declareType

        const {
          nature, // 户口性质
          age, // 年龄
          birthday, // 出生年月
          gender // 性别
        } = this.basicInfo

        const {
          w00041, //婚姻状况
          w00072, //婚姻变动年月

          w03006, //配偶姓名
          w00038, //配偶身份证号码
          w00044, //配偶户口性质
          w00073, //配偶的婚姻状况
          w00074 //配偶的婚姻变动年月
        } = this.projectDeclareInfo

        // 扩展字段
        const hb00BizMap = {
          aac004: gender, //性别
          chb00l: age, //年龄
          w00030: birthday, //出生日期
          w00045: nature, //申请人户口性质

          w00041, //婚姻状况
          w00072, //婚姻变动年月

          w03006, //配偶姓名
          w00038, //配偶身份证号码
          w00044, //配偶户口性质
          w00073, //配偶的婚姻状况
          w00074 //配偶的婚姻变动年月
        }

        this.handleDeclareData(hb00BizMap, '0')
      }
    },
    computed: {},
    watch: {}
  }
</script>

<style lang="scss" scoped></style>
