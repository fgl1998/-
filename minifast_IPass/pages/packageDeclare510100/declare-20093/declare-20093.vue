<!-- 送温暖工程及帮困扶贫 总工会 -->
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
            <div class="cell-item">
              <div class="key">政治面貌</div>
              <div class="value">
                <input type="text" v-model="projectDeclareInfo.s00015" placeholder="请输入申报人的政治面貌" />
              </div>
            </div>
            <ComponentDeclarePicker
              label="户口类型"
              idName="s00016"
              :range="codeMap.C00128"
              placeholder="请选择户口类型"
              v-model="projectDeclareInfo.s00016"
              @change="getPickerValueDesc">
            </ComponentDeclarePicker>
            <ComponentDeclarePicker
              label="劳模类型"
              idName="s00017"
              :range="codeMap.s00017"
              placeholder="请选择劳模类型"
              v-model="projectDeclareInfo.s00017"
              @change="getPickerValueDesc">
            </ComponentDeclarePicker>

            <ComponentDeclarePicker
              label="婚姻状况"
              idName="aac017"
              :range="codeMap.AAC017"
              placeholder="请选择婚姻状况"
              v-model="projectDeclareInfo.s00018"
              @change="getPickerValueDesc">
            </ComponentDeclarePicker>

            <div class="cell-item required">
              <div class="key">医保状况</div>
              <div class="value">
                <input type="text" v-model="projectDeclareInfo.s00019" placeholder="请输入申报人的医保状况" />
              </div>
            </div>
            <div class="cell-item required">
              <div class="key">工作单位</div>
              <div class="value">
                <input type="text" v-model="projectDeclareInfo.chbaaa" placeholder="请输入申报人的工作单位" />
              </div>
            </div>
            <div class="cell-item required">
              <div class="key">单位性质</div>
              <div class="value">
                <input type="text" v-model="projectDeclareInfo.s00020" placeholder="请输入申报人的单位性质" />
              </div>
            </div>
            <div class="cell-item">
              <div class="key">企业状况</div>
              <div class="value">
                <input type="text" v-model="projectDeclareInfo.s00021" placeholder="请输入申报人的企业状况" />
              </div>
            </div>
            <div class="cell-item">
              <div class="key">企业所属行业</div>
              <div class="value">
                <input type="text" v-model="projectDeclareInfo.s00022" placeholder="请输入企业所属行业" />
              </div>
            </div>
            <div class="cell-item">
              <div class="key">单位联系人</div>
              <div class="value">
                <input type="text" v-model="projectDeclareInfo.s00023" placeholder="请输入单位联系人" />
              </div>
            </div>
            <div class="cell-item">
              <div class="key">单位联系人电话</div>
              <div class="value">
                <input
                  type="number"
                  maxlength="11"
                  v-model="projectDeclareInfo.s00024"
                  placeholder="请输入单位联系人电话" />
              </div>
            </div>
            <div class="cell-item required">
              <div class="key">月平均收入</div>
              <div class="value">
                <input type="digit" v-model="projectDeclareInfo.s00025" placeholder="请输入月平均收入" />
              </div>
            </div>
            <div class="cell-item required">
              <div class="key">家庭其他非薪资年收入</div>
              <div class="value">
                <input type="digit" v-model="projectDeclareInfo.s00026" placeholder="请输入家庭其他非薪资年收入" />
              </div>
            </div>
            <div class="cell-item required">
              <div class="key">家庭年度总收入</div>
              <div class="value">
                <input type="digit" v-model="projectDeclareInfo.s00027" placeholder="请输入家庭年度总收入" />
              </div>
            </div>
            <div class="cell-item required">
              <div class="key">家庭人口</div>
              <div class="value">
                <input type="digit" v-model="projectDeclareInfo.s00012" placeholder="请输入家庭人口" />
              </div>
            </div>
            <div class="cell-item required">
              <div class="key">家庭月人均收入</div>
              <div class="value">
                <input type="digit" v-model="projectDeclareInfo.s00028" placeholder="请输入家庭月人均收入" />
              </div>
            </div>
            <ComponentDeclarePicker
              label="困难类别"
              idName="s00029"
              :range="codeMap.c00129"
              placeholder="请选择困难类别"
              v-model="projectDeclareInfo.s00029"
              @change="getPickerValueDesc">
            </ComponentDeclarePicker>
            <div class="cell-item required">
              <div class="key">致困原因</div>
              <div class="value">
                <input type="text" v-model="projectDeclareInfo.s00030" placeholder="请输入致困原因" />
              </div>
            </div>
            <ComponentDeclarePicker
              label="是否产业工会"
              idName="s00038"
              :range="codeMap.yesorno"
              placeholder="请选择是否产业工会"
              v-model="projectDeclareInfo.s00038"
              @change="getPickerValueDesc">
            </ComponentDeclarePicker>
            <block v-if="projectDeclareInfo.s00038 == '1'">
              <ComponentDeclarePicker
                label="所属产业工会"
                idName="s00039"
                :range="codeMap.s00039"
                placeholder="请选择所属产业工会"
                v-model="projectDeclareInfo.s00039"
                @change="getPickerValueDesc">
              </ComponentDeclarePicker>
            </block>
          </div>
        </div>
      </ComponentPanel>
    </div>
    <!-- 添加家庭其他成员 -->
    <div class="space-top-wrapper">
      <ComponentPanel title="添加家庭其他成员">
        <ComponentDeclareCard
          :renderData="cardList1"
          type="20093"
          addButtonName="添加家庭其他成员"
          @change="handleChangeCardList1"></ComponentDeclareCard>
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

  import { getIsDev } from '@/utils/get'
  import { checkIDCard, checkPhoneNumber } from '@/utils/check'
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
          birthday: true, // 出生日期
          nation: true, // 民族
          permanentAddress: true, // 户籍地址
          currentAddress: true // 现居住地址
        },
        cardList1: []
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
        const isDev = getIsDev() // 当前环境是否是开发环境
        let C00128 = [] // 户口类型
        let s00017 = [] // 劳模类型
        let c00129 = [] // 困难类别
        let s00039 = [] // 所属产业工会
        let AAC017 = [] // 婚姻状况
        try {
          C00128 = await getCodeListByCodeName('C00128')
        } catch (err) {
          if (isDev) {
            console.log('code table C00128 error：', err)
          }
        }
        try {
          s00017 = await getCodeListByCodeName('s00017')
        } catch (err) {
          if (isDev) {
            console.log('code table s00017 error：', err)
          }
        }
        try {
          c00129 = await getCodeListByCodeName('c00129')
        } catch (err) {
          if (isDev) {
            console.log('code table c00129 error：', err)
          }
        }
        try {
          s00039 = await getCodeListByCodeName('s00039')
        } catch (err) {
          if (isDev) {
            console.log('code table s00039 error：', err)
          }
        }
        try {
          AAC017 = await getCodeListByCodeName('AAC017')
        } catch (err) {
          if (isDev) {
            console.log('code table AAC017 error：', err)
          }
        }
        this.codeMap = {
          ...this.codeMap,
          C00128, // 户口类型
          s00017, // 劳模类型
          c00129, // 困难类别
          s00039, // 所属产业工会
          AAC017 // AAC017
        }
      },
      // 捕获 cardList 不用修改
      handleChangeCardList1(type, data) {
        this.cardList1 = [...data]
      },
      // 检测数据输入格式是否正确 须根据项目需求更改
      handleCheckInput() {
        const {
          s00016, // 户口类型
          s00017, // 劳模类型
          s00018, // 婚姻状况
          s00019, // 医保状况
          chbaaa, // 工作单位
          s00020, // 单位性质
          s00025, // 月平均收入
          s00026, // 家庭其他非薪资年收入
          s00027, // 家庭年度总收入
          s00012, // 家庭人口
          s00028, // 家庭月人均收入
          s00029, // 困难类别
          s00030, // 致困原因
          s00038 // 是否产业工会
        } = this.projectDeclareInfo

        if (!s00016) {
          showModal('请选择户口类型')
          return false
        }
        if (!s00017) {
          showModal('请选择劳模类型')
          return false
        }
        if (!s00018) {
          showModal('请输入婚姻状况')
          return false
        }
        if (!s00019) {
          showModal('请输入医保状况')
          return false
        }
        if (!chbaaa) {
          showModal('请输入工作单位')
          return false
        }
        if (!s00020) {
          showModal('请输入单位性质')
          return false
        }
        if (!s00025) {
          showModal('请输入月平均收入')
          return false
        }
        if (!s00026) {
          showModal('请输入家庭其他非薪资年收入')
          return false
        }
        if (!s00027) {
          showModal('请输入家庭年度总收入')
          return false
        }
        if (!s00012) {
          showModal('请输入家庭人口')
          return false
        }
        if (!s00028) {
          showModal('请输入家庭月人均收入')
          return false
        }
        if (!s00029) {
          showModal('请选择困难类别')
          return false
        }
        if (!s00030) {
          showModal('请输入致困原因')
          return false
        }
        if (!s00038) {
          showModal('请选择是否产业工会')
          return false
        }
        if (this.cardList1.length == 0 && parseInt(s00012) > 1) {
          showModal('请添加其他家庭成员信息')
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
        const cardList1 = this.cardList1
        const {
          age, // 年龄
          gender, // 性别
          birthday, // 出生日期
          nation, // 民族
          tel, // 联系电话
          currentAddress // 现居住地址
        } = this.basicInfo

        const {
          s00016, // 户口类型
          s00017, // 劳模类型
          s00018, // 婚姻状况
          s00019, // 医保状况
          chbaaa, // 工作单位
          s00020, // 单位性质
          s00021, // 企业状况
          s00022, // 企业所属行业
          s00023, // 单位联系人
          s00024, // 单位联系人电话
          s00025, // 月平均收入
          s00026, // 家庭其他非薪资年收入
          s00027, // 家庭年度总收入
          s00012, // 家庭人口
          s00028, // 家庭月人均收入
          s00029, // 困难类别
          s00030, // 致困原因
          s00038 // 是否产业工会
        } = this.projectDeclareInfo

        // 扩展字段
        const hb00BizMap = {
          chb00l: age, // 年龄
          aac005: nation, // 名族
          aac004: gender, //性别
          chbaa2: birthday, // 出生年月
          aae005: tel, // 联系电话
          s00005: currentAddress, // 现居住地址
          s00021, // 企业状况
          s00022, // 企业所属行业
          s00023, // 单位联系人
          s00024, // 单位联系人电话
          s00016, // 户口类型
          s00017, // 劳模类型
          s00018, // 婚姻状况
          s00019, // 医保状况
          chbaaa, // 工作单位
          s00020, // 单位性质
          s00025: parseInt(s00025), // 月平均收入
          s00026: parseInt(s00026), // 家庭其他非薪资年收入
          s00027: parseInt(s00027), // 家庭年度总收入
          s00012: parseInt(s00012), // 家庭人口
          s00028: parseInt(s00028), // 家庭月人均收入
          s00029, // 困难类别
          s00030, // 致困原因
          s00038 // 是否产业工会
        }
        const hp03List = []

        // 新加其他家庭成员信息
        cardList1.map((item) => {
          hp03List.push({
            aac057: item.relationship_desc, // 与申请人关系
            aac003: item.name, // 姓名
            aac006: item.birthday, // 出生日期
            aac004: item.gender, // 性别
            aac005: item.nation, // 民族
            aac002: item.idCard, // 身份证号
            aae005: item.tel, // 联系方式
            dac009: item.dac009, // 户口类型
            aac017: item.marrige, // 婚姻状况
            chb485: item.healthy, // 健康状况
            chb48b: item.workorschool, // 单位或学校
            aac011: item.education, // 当前学历
            chp044: item.political_climate, // 政治面貌
            chp045: item.study, // 学习年制
            chp048: item.remark, // 备注
            chp046: item.year, // 入学年份
            chp047: item.people // 人员身份
          })
        })
        this.handleDeclareData(hb00BizMap, '1', null, hp03List)
      }
    },
    computed: {},
    watch: {}
  }
</script>

<style lang="scss" scoped></style>
