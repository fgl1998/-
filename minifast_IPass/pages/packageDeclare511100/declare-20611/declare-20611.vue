<!-- 贫困母亲“两癌”救助 -->
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
        currentAddressLabel="家庭住址"
        currentAddressPlaceholder="请选择或输入家庭住址">
      </ComponentDeclare>
    </div>

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
            <div class="cell-item required">
              <div class="key">家庭人口总数</div>
              <div class="value">
                <input type="number" v-model="projectDeclareInfo.chab4" placeholder="请输入家庭人口总数" />
              </div>
            </div>
            <ComponentDeclarePicker
              label="文化程度"
              idName="chbab1"
              :range="codeMap.chbab1"
              rangeKey="aaa103"
              valueKey="aaa102"
              placeholder="请选择文化程度"
              v-model="projectDeclareInfo.chbab1"></ComponentDeclarePicker>
            <ComponentDeclarePicker
              label="户籍情况"
              idName="chbab2"
              :range="codeMap.chbab2"
              rangeKey="aaa103"
              valueKey="aaa102"
              placeholder="请选择户籍情况"
              v-model="projectDeclareInfo.chbab2"></ComponentDeclarePicker>
            <ComponentDeclarePicker
              label="是否女农民工"
              idName="chbab3"
              :range="codeMap.yesorno"
              rangeKey="aaa103"
              valueKey="aaa102"
              placeholder="请选择是否女农民工"
              v-model="projectDeclareInfo.chbab3"></ComponentDeclarePicker>
            <ComponentDeclarePicker
              label="是否接受过其他救助"
              idName="chbab4"
              :range="codeMap.yesorno"
              rangeKey="aaa103"
              valueKey="aaa102"
              placeholder="请选择是否接受过其他救助"
              v-model="projectDeclareInfo.chbab4"></ComponentDeclarePicker>
            <div class="cell-item" v-if="projectDeclareInfo.chbab4 === '1'">
              <div class="key">救助渠道</div>
              <div class="value">
                <input type="text" v-model="projectDeclareInfo.chbab5" placeholder="请输入救助渠道" />
              </div>
            </div>
            <div class="cell-item" v-if="projectDeclareInfo.chbab4 === '1'">
              <div class="key">救助金额</div>
              <div class="value">
                <input type="number" v-model="projectDeclareInfo.chbab6" placeholder="请输入救助金额" />
              </div>
            </div>
            <ComponentDeclarePicker
              label="贫困状态"
              idName="chbab7"
              :range="codeMap.chbab7"
              rangeKey="aaa103"
              valueKey="aaa102"
              placeholder="请选择贫困状态"
              v-model="projectDeclareInfo.chbab7"></ComponentDeclarePicker>
            <div class="cell-item required">
              <div class="key">家庭年人均可支配收入</div>
              <div class="value">
                <input
                  type="number"
                  maxlength="11"
                  v-model="projectDeclareInfo.chbab8"
                  placeholder="请输入家庭年人均可支配收入" />
              </div>
            </div>
            <ComponentDeclarePicker
              label="患病程度"
              idName="chbab9"
              :range="codeMap.chbab9"
              rangeKey="aaa103"
              valueKey="aaa102"
              placeholder="请选择患病程度"
              v-model="projectDeclareInfo.chbab9"></ComponentDeclarePicker>
            <div class="cell-item required">
              <div class="key">确诊医院名称</div>
              <div class="value">
                <input type="text" v-model="projectDeclareInfo.chbaba" placeholder="请输入确诊医院名称" />
              </div>
            </div>
            <div class="cell-item required">
              <div class="key">确诊医院等级</div>
              <div class="value">
                <input type="text" v-model="projectDeclareInfo.chbabb" placeholder="请输入确诊医院等级" />
              </div>
            </div>
            <ComponentDeclarePicker
              label="确诊时间"
              idName="chbabc"
              mode="date"
              fields="day"
              :endTime="new Date().getTime()"
              v-model="projectDeclareInfo.chbabc"
              placeholder="请选择确诊时间"></ComponentDeclarePicker>
            <ComponentDeclarePicker
              label="是否手术"
              idName="chbabd"
              :range="codeMap.yesorno"
              rangeKey="aaa103"
              valueKey="aaa102"
              placeholder="请选择是否手术工"
              v-model="projectDeclareInfo.chbabd"></ComponentDeclarePicker>
            <div class="cell-item required">
              <div class="key">实际治疗费用</div>
              <div class="value">
                <input type="number" v-model="projectDeclareInfo.chbabe" placeholder="请输入实际治疗费用" />
              </div>
            </div>
            <div class="cell-item required">
              <div class="key">城乡居民医疗保险等报销金额</div>
              <div class="value">
                <input
                  type="number"
                  v-model="projectDeclareInfo.chbabf"
                  placeholder="请输入城乡居民医疗保险等报销金额" />
              </div>
            </div>
            <div class="cell-item required">
              <div class="key">城乡居民医疗保险等报销比例</div>
              <div class="value">
                <input type="text" v-model="projectDeclareInfo.chbabg" placeholder="请输入城乡居民医疗保险等报销比例" />
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
  import ComponentSelectCurrentAddress from '@/components/project/ez-select-current-address/ez-select-current-address.vue'
  import ComponentDeclareCard from '@/components/project/ez-declare-card/ez-declare-card.vue'
  import ComponentDeclarePersonnel from '@/components/project/ez-declare-personnel/ez-declare-personnel.vue'
  import ComponentDeclareRadio from '@/components/project/ez-declare-radio/ez-declare-radio.vue'
  import ComponentDeclarePicker from '@/components/project/ez-declare-picker/ez-declare-picker.vue'

  import { useDeclare } from '@/mixins'
  import { useGetCurrentDate } from '@/hooks/common'
  import { getCodeListByCodeName } from '@/utils/custom-api'
  import { showModal } from '@/utils/uni-api'
  export default {
    name: 'pageDeclare20611',
    data() {
      return {
        // 基本信息 渲染配置
        renderObj: {
          idCard: true, // 身份证
          userName: true, // 姓名
          tel: true, // 联系电话
          age: true, // 年龄
          gender: true, // 性别
          birthday: true, // 出生年月
          permanentAddress: true, // 户籍地址
          currentAddress: true // 现居住地址
        },
        // 自定义添加一些属性 防止双向绑定失败 例如 picker组件之类
        projectDeclareInfo: {
          chbab1: '',
          chbab2: '',
          chbab3: '',
          chbab4: '',
          chbab5: '',
          chbab6: '',
          chbab7: '',
          chbab9: '',
          chbaba: '',
          chbabb: '',
          chbabd: '',
          chbabg: ''
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
    methods: {
      // 获取该申报项目的所需要的码表数据
      // aaz502、aac011、dac009、aac004、aac005、aae008、yesorno 不用再次获取
      // 编写格式参考达州20033项目
      async getCodeTableCacheData() {
        let chbab1 = [] // 文化程度
        let chbab2 = [] // 户籍情况
        let chbab7 = []
        let chbab9 = []
        try {
          chbab1 = await getCodeListByCodeName('aac011')
        } catch (err) {
          console.error('code aac011 table error：', err)
        }

        try {
          chbab2 = await getCodeListByCodeName('r00066')
        } catch (err) {
          console.error('code r00066 table error：', err)
        }

        try {
          chbab7 = await getCodeListByCodeName('CHBAB7')
        } catch (err) {
          console.error('code CHBAB7 table error：', err)
        }

        try {
          chbab9 = await getCodeListByCodeName('CHBAB9')
        } catch (err) {
          console.error('code CHBAB9 table error：', err)
        }
        this.codeMap = {
          ...this.codeMap,
          chbab1,
          chbab2,
          chbab7,
          chbab9
        }
      },
      // 检测数据输入格式是否正确 须根据项目需求更改
      handleCheckInput() {
        const {
          chab4, // 家庭人口数
          chbab1,
          chbab2,
          chbab3,
          chbab4,
          chbab7,
          chbab8,
          chbab9,
          chbaba,
          chbabb,
          chbabc,
          chbabd,
          chbabe,
          chbabf,
          chbabg
        } = this.projectDeclareInfo

        if (!chab4) {
          showModal('请输入家庭人口总数')
          return false
        }
        if (!chbab1) {
          showModal('请选择文化程度')
          return false
        }
        if (!chbab2) {
          showModal('请选择户籍情况')
          return false
        }
        if (!chbab3) {
          showModal('请选择是否女农民工')
          return false
        }
        if (!chbab4) {
          showModal('请选择是否接受过其他救助')
          return false
        }
        if (!chbab7) {
          showModal('请选择贫困状态')
          return false
        }
        if (!chbab8) {
          showModal('请输入家庭年人均可支配收入')
          return false
        }
        if (!chbab9) {
          showModal('请选择患病程度')
          return false
        }
        if (!chbaba) {
          showModal('请输入确诊医院名称')
          return false
        }
        if (!chbabb) {
          showModal('请输入确诊医院等级')
          return false
        }
        if (!chbabc) {
          showModal('请选择确诊时间')
          return false
        }
        if (!chbabd) {
          showModal('请选择是否手术')
          return false
        }
        if (!chbabe) {
          showModal('请输入实际治疗费用')
          return false
        }
        if (!chbabf) {
          showModal('请输入城乡居民医疗保险等报销金额')
          return false
        }
        if (!chbabg) {
          showModal('请输入城乡居民医疗保险等报销比例')
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

        const { currentAddress } = this.basicInfo

        const {
          chab4, // 家庭人口总数
          chbab1,
          chbab2,
          chbab3,
          chbab4,
          chbab5,
          chbab6,
          chbab7,
          chbab8,
          chbab9,
          chbaba,
          chbabb,
          chbabc,
          chbabd,
          chbabe,
          chbabf,
          chbabg
        } = this.projectDeclareInfo

        // 扩展字段
        const hb00BizMap = {
          chab2: currentAddress, // 家庭住址
          chab4, // 家庭人口总数
          chbab1, // 文化程度
          chbab2, // 户籍情况
          chbab3, // 是否女农民工
          chbab4, // 是否接受过其他救助
          chbab5, // 救助渠道
          chbab6, // 救助金额
          chbab7, // 贫困状态
          chbab8, // 家庭年人均可支配收入
          chbab9, // 患病程度
          chbaba, // 确诊医院名称
          chbabb, // 确诊医院等级
          chbabc, // 确诊时间
          chbabd, // 是否手术
          chbabe, // 实际治疗费用
          chbabf, // 城乡居民医疗保险等报销金额
          chbabg, // 城乡居民医疗保险等报销比例
          chb01m: '1', // 发放类型 正常发放
          aae209: useGetCurrentDate('month', '') // 发放期号 当前申报年月
        }
        this.handleDeclareData(hb00BizMap, '0')
      }
    }
  }
</script>

<style lang="scss" scoped></style>
