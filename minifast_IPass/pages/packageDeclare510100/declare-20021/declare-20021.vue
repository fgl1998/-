<!-- 残疾人机动轮椅车燃油补贴 残联 -->
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
        @changeDataByIdCard="seDataByIdCard">
      </ComponentDeclare>
    </div>

    <!-- start 需要修改的地方开始 在以下代码中根据项目需求更改 上面代码勿动 -->

    <!-- 申报信息 -->
    <div class="space-top-wrapper">
      <ComponentPanel title="申报信息">
        <div class="panel-content">
          <div class="cell-items">
            <ComponentSelectAddressMultitype
              label="家庭地址"
              placeholder="请选择家庭地址"
              :isShowBtn="renderObj.permanentAddress"
              @clickBtn="projectDeclareInfo.c00033 = basicInfo.permanentAddress"
              v-model="projectDeclareInfo.c00033">
            </ComponentSelectAddressMultitype>
            <div class="cell-item required">
              <div class="key">机动车品牌</div>
              <div class="value">
                <input type="text" v-model="projectDeclareInfo.c00072" placeholder="请输入机动车品牌" />
              </div>
            </div>
            <div class="cell-item required">
              <div class="key">购车车型</div>
              <div class="value">
                <input type="text" v-model="projectDeclareInfo.c00126" placeholder="请输入购车车型" />
              </div>
            </div>

            <div class="cell-item required">
              <div class="key">购车原始发票号码</div>
              <div class="value">
                <input type="text" v-model="projectDeclareInfo.c00029" placeholder="请输入购车原始发票号码" />
              </div>
            </div>

            <ComponentDeclarePicker
              label="购车时间"
              idName="c00028"
              mode="date"
              fields="day"
              :endTime="new Date().getTime()"
              v-model="projectDeclareInfo.c00028"
              placeholder="请选择购车时间"></ComponentDeclarePicker>

            <div class="cell-item required">
              <div class="key">车架号</div>
              <div class="value">
                <input type="text" v-model="projectDeclareInfo.c00127" placeholder="请输入车架号" />
              </div>
            </div>

            <div class="cell-item required">
              <div class="key">二代残疾证号</div>
              <div class="value">
                <input
                  type="text"
                  maxlength="20"
                  v-model="projectDeclareInfo.c03601"
                  placeholder="请输入残疾证号"
                  @change="handleCheckDisability" />
              </div>
            </div>

            <ComponentDeclarePicker
              label="残疾类别"
              idName="chb0h1"
              :range="codeMap.chb0h1"
              v-model="projectDeclareInfo.chb0h1"
              placeholder="请选择残疾类别"></ComponentDeclarePicker>
          </div>
        </div>
      </ComponentPanel>
    </div>

    <!--    <div class="space-top-wrapper">
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
              <div class="key">残疾证号</div>
              <div class="value">{{ projectDeclareInfo.c03601 || '暂无' }}</div>
            </div>

          </div>
        </div>
      </ComponentPanel>
    </div> -->

    <!-- end  需要修改的地方结束 在以下代码中根据项目需求更改 下面代码勿动-->
    <div class="button-wrapper">
      <ComponentButton @click="handleJumpNextStep" name="下一步" type="primary"></ComponentButton>
    </div>
  </view>
</template>

<script>
  import ComponentButton from '@/components/common/ez-button/ez-button.vue'
  import ComponentPanel from '@/components/common/ez-panel/ez-panel.vue'

  import ComponentSelectAddressMultitype from '@/components/project/ez-select-address-multitype/ez-select-address-multitype.vue'
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
  import { getCodeListByCodeName } from '@/utils/custom-api'
  import { showModal } from '@/utils/uni-api'

  export default {
    name: 'pageDeclare20457',
    data() {
      return {
        // 基本信息 渲染配置
        renderObj: {
          idCard: true, // 身份证
          userName: true, // 姓名
          tel: true, // 联系电话
          age: true, // 年龄
          gender: true, // 性别
          nation: true, //民族
          permanentAddress: true // 户籍地址
        },
        projectDeclareInfo: {
          c00033: ''
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
      ComponentDeclarePicker,
      ComponentSelectAddressMultitype
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
        let chb0h1 = [] // 户籍类别
        try {
          chb0h1 = await getCodeListByCodeName('chb0h1')
        } catch (err) {
          if (isDev) {
            console.log('code table chb0h1 error', err)
          }
        }

        this.codeMap = {
          ...this.codeMap,
          chb0h1
        }
      },
      handleCheckDisability(e) {
        const { value } = e.target
        if (value && !this.CheckDisability(value)) {
          showModal('请输入正确的残疾证号')
        }
      },
      // 校验残疾人证
      CheckDisability(value) {
        console.log(value)
        let str = /[\d]{17}[\dX][1-7][1-4]/.test(value)
        console.log(str)
        return str
      },
      // 检测数据输入格式是否正确 须根据项目需求更改
      handleCheckInput() {
        const {
          c00033, // 家庭地址
          c00072, // 机动车品牌
          c00126, // 购车车型
          c00029, // 购车原始发票号码
          c00028, // 购车时间
          c00127, // 车架号
          c03601, // 残疾证号
          chb0h1 // 残疾类别
        } = this.projectDeclareInfo

        if (!c00033) {
          showModal('请选择或输入家庭地址')
          return false
        }
        if (!c00072) {
          showModal('请输入机动车品牌')
          return false
        }
        if (!c00126) {
          showModal('请输入购车车型')
          return false
        }
        if (!c00029) {
          showModal('请输入购车原始发票号码')
          return false
        }
        if (!c00028) {
          showModal('请选择购车时间')
          return false
        }
        if (!c00127) {
          showModal('请输入车架号')
          return false
        }
        if (!c03601) {
          showModal('请输入残疾证号')
          return false
        } else if (!this.CheckDisability(c03601)) {
          showModal('请输入正确的残疾证号')
          return false
        }

        if (!chb0h1) {
          showModal('请选择残疾类别')
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
          age, // 年龄
          nation, // 民族
          gender // 性别
        } = this.basicInfo

        const {
          c00033, // 家庭地址
          c00072, // 机动车品牌
          c00126, // 购车车型
          c00029, // 购车原始发票号码
          c00028, // 购车时间
          c00127, // 车架号
          c03601, // 残疾证号
          chb0h1 //残疾类别
        } = this.projectDeclareInfo

        // 扩展字段
        const hb00BizMap = {
          c00033, // 家庭地址
          c00072, // 机动车品牌
          c00126, // 购车车型
          c00029, // 购车原始发票号码
          c00028, // 购车时间
          c00127, // 车架号
          c03601, // 残疾证号
          chb00l: age, // 年龄
          aac005: nation, // 民族
          aac004: gender, // 性别
          chb0h1 //残疾类别
        }

        this.handleDeclareData(hb00BizMap, '0')
      }
    },
    computed: {},
    watch: {}
  }
</script>

<style lang="scss" scoped></style>
