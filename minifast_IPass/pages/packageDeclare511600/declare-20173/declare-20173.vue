<!-- 屠宰环节病害猪损失财政补助 农业农村局 -->
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
        :isOpenOCR="true"
		permanentAddressLabel='受理地址'
		permanentAddressPlaceholder='请选择申报受理地址'
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
            <div class="cell-item required">
              <div class="key">生猪饲养头数</div>
              <div class="value">
                <input
                  type="number"
                  maxlength="11"
                  v-model="projectDeclareInfo.n00149"
                  placeholder="请输入生猪饲养头数" />
              </div>
            </div>
            <div class="cell-item required">
              <div class="key">无害化处理数量</div>
              <div class="value">
                <input
                  type="number"
                  maxlength="11"
                  v-model="projectDeclareInfo.n00212"
                  placeholder="请输入无害化处理数量" />
              </div>
            </div>
            <ComponentDeclarePicker
              label="无害化处理方式"
              idName="n00217"
              :range="codeMap.n00217"
              placeholder="请选择处理方式"
              v-model="projectDeclareInfo.n00217"
              @change="getPickerValueDesc">
            </ComponentDeclarePicker>
          </div>
        </div>
      </ComponentPanel>
    </div>

    <div class="space-top-wrapper">
      <ComponentPanel title="动物标识号码">
        <ComponentDeclareCard
          :renderData="cardList"
          type="20173"
          addButtonName="添加动物标识号码"
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
  import ComponentDeclareCard from '../components/ez-declare-card/ez-declare-card.vue'
  import ComponentDeclarePicker from '@/components/project/ez-declare-picker/ez-declare-picker.vue'

  import { useDeclare } from '@/mixins'

  import { getIsDev, getDate } from '@/utils/get'
  import { getCodeListByCodeName } from '@/utils/custom-api'
  import { showModal } from '@/utils/uni-api'

  export default {
    name: 'pageDeclare20173',
    data() {
      return {
        // 基本信息 渲染配置
        renderObj: {
          idCard: true, // 身份证
          userName: true, // 姓名
          tel: true, // 联系电话
          permanentAddress: true // 户籍地址
        },
        today_d: getDate('day'),
        projectDeclareInfo: {
          n00217: ''
        },
        // 卡片列表数据
        cardList: []
      }
    },
    components: {
      ComponentButton,
      ComponentPanel,
      ComponentDeclare,
      ComponentDeclareStep,
      ComponentDeclareCard,
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
      // 捕获 cardList 不用修改
      handleChangeCardList(type, data) {
        this.cardList = [...data]
      },
      // 获取该申报项目的所需要的码表数据
      // aaz502、aac011、dac009、aac004、aac005、aae008、yesorno 不用再次获取
      // 编写格式参考达州20033项目
      async getCodeTableCacheData() {
        const isDev = getIsDev() // 当前环境是否是开发环境
        let n00217 = [] // 无害化处理方式
        try {
          n00217 = await getCodeListByCodeName('n00217')
        } catch (err) {
          if (isDev) {
            console.log('code table n00217 error：', err)
          }
        }
        this.codeMap = {
          ...this.codeMap,
          n00217
        }
      },
      // 检测数据输入格式是否正确 须根据项目需求更改
      handleCheckInput() {
        const {
          n00149, // 生猪头数
          n00212, // 病猪生猪无害化处理数量
          n00217 // 无害化处理方式
        } = this.projectDeclareInfo

        const cardList = this.cardList

        if (!n00149) {
          showModal('请输入生猪头数')
          return false
        }
        if (!n00212) {
          showModal('请输入病猪生猪无害化处理数量')
          return false
        }
        if (!n00217) {
          showModal('请选择无害化处理方式')
          return false
        }
        if (cardList.length == 0) {
          showModal('请添加动物标识号码')
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
        const cardList = this.cardList
        const { permanentAddress } = this.basicInfo

        const {
          n00149, // 生猪头数
          n00212, // 病猪生猪无害化处理数量
          n00217 // 无害化处理方式
        } = this.projectDeclareInfo

        // 扩展字段
        const hb00BizMap = {
          aae006: permanentAddress, // 户籍地址
          n00149, // 生猪头数
          n00212, // 病猪生猪无害化处理数量
          n00217 // 无害化处理方式
        }

        let hp15List = []
        cardList.map((item) => {
          hp15List.push({
            chp15l: item.number
          })
        })
        this.handleDeclareData(hb00BizMap, '1', null, null, null, hp15List)
      }
    },
    computed: {},
    watch: {}
  }
</script>

<style lang="scss" scoped></style>
