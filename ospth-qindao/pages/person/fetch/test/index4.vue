<template>
  <div class="rent-extract-container">
    <!-- 第一步：基础信息 -->
    <van-nav-bar
        title="偿还贷提取"
        fixed
        class="custom-nav-bar"
        v-if="currentStep === 1"
    >
      <template #left>
        <div class="back-btn" @click="goBack">
          <van-icon name="arrow-left" size="18" color="#fff" />
          <span>返回</span>
        </div>
      </template>
    </van-nav-bar>

    <div class="form-content" v-if="currentStep === 1">
      <van-cell-group title="提取类型">
        <van-field
            label="提取类型"
            :value="form.extractType"
            placeholder="请选择提取类型"
            readonly
            @click="showExtractType = true"
            input-align="right"
        />
      </van-cell-group>

      <van-cell-group title="家庭成员">
        <van-field
            label="与申请人关系"
            :value="form.familyRelation"
            placeholder="请选择"
            readonly
            @click="showFamilyRelation = true"
            input-align="right"
        />
        <div v-if="form.familyRelation && form.familyRelation !== '本人'">
          <van-field v-model="form.familyName" label="姓名" placeholder="请输入姓名" input-align="right" />
          <van-field
              label="证件类型"
              :value="form.familyIdType"
              placeholder="请选择"
              readonly
              @click="showFamilyIdType = true"
              input-align="right"
          />
          <van-field v-model="form.familyIdCard" label="证件号码" placeholder="请输入证件号码" input-align="right" />
        </div>
      </van-cell-group>
    </div>

    <!-- 第一步底部按钮 -->
    <div class="bottom-btn-bar" v-if="currentStep === 1">
      <van-button type="default" size="large" @click="showManual = true" class="manual-btn custom-btn" icon="question-o">操作手册</van-button>
      <van-button type="primary" size="large" @click="toSecondPage" class="next-btn custom-btn">下一步</van-button>
    </div>

    <!-- 第二步：房屋贷款信息 -->
    <div v-if="currentStep === 2" class="self-extract-page">
      <van-nav-bar title="房屋贷款信息" fixed class="custom-nav-bar">
        <template #left>
          <div class="back-btn" @click="currentStep = 1">
            <van-icon name="arrow-left" size="18" color="#fff" />
            <span>上一步</span>
          </div>
        </template>
      </van-nav-bar>

      <div class="form-content self-form-content">
        <van-cell-group style="margin-bottom:12px;">
          <van-cell
              title="选择/切换房屋"
              :value="selectedIndex>=0 ?`房屋${selectedIndex+1}`:'请选择'"
              is-link
              @click="showHouseSelect = true"
          />
        </van-cell-group>

        <div class="house-action-row">
          <span class="add-house" @click="addNewHouse">+ 新增房屋信息</span>
          <span
              class="del-house"
              v-if="selectedIndex >= 0 && houseLoanList[selectedIndex].isAdd"
              @click="handleDeleteHouse"
          >
            删除房屋信息
          </span>
        </div>

        <div v-if="selectedIndex >= 0 && houseLoanList.length > 0">
          <van-cell-group title="产权人/借款人信息" style="margin-bottom:12px;">
            <van-field label="姓名" :value="currentHouse.owners[0].name" readonly input-align="right" />
            <van-field label="证件类型" :value="currentHouse.owners[0].idType" readonly input-align="right" />
            <van-field label="证件号码" :value="currentHouse.owners[0].idNo" readonly input-align="right" />
          </van-cell-group>

          <van-cell-group title="房屋信息" style="margin-bottom:12px;">
            <van-field label="房屋坐落" :value="currentHouse.address" readonly input-align="right" />
            <van-field label="不动产单元号" :value="currentHouse.unitNo" readonly input-align="right" />
            <van-field label="建成年月" :value="currentHouse.buildTime" readonly input-align="right" />
            <van-field label="建筑面积" :value="currentHouse.buildArea" readonly input-align="right" />
            <van-field label="房屋总价" :value="currentHouse.houseTotalPrice" readonly input-align="right" />
          </van-cell-group>

          <van-cell-group title="贷款信息" style="margin-bottom:12px;">
            <van-field label="贷款银行" :value="currentLoan.bankType" readonly input-align="right" />
            <van-field label="贷款金额" :value="currentLoan.loanAmount" readonly input-align="right" />
            <van-field label="合同编号" :value="currentLoan.contractNo" readonly input-align="right" />
            <van-field label="贷款起止" :value="`${currentLoan.loanStartDate} ~ ${currentLoan.loanEndDate}`" readonly input-align="right" />
          </van-cell-group>
        </div>
      </div>

      <div class="bottom-btn-bar">
        <van-button type="default" size="large" @click="showManual = true" class="manual-btn custom-btn" icon="question-o">操作手册</van-button>
        <van-button type="primary" size="large" @click="toThirdPage" class="next-btn custom-btn">下一步</van-button>
      </div>
    </div>

    <!-- 第三步：提取金额 & 上传材料 -->
    <div v-if="currentStep === 3" class="self-extract-page">
      <van-nav-bar title="提取信息" fixed class="custom-nav-bar">
        <template #left>
          <div class="back-btn" @click="currentStep = 2">
            <van-icon name="arrow-left" size="18" color="#fff" />
            <span>上一步</span>
          </div>
        </template>
      </van-nav-bar>

      <div class="form-content self-form-content">
        <van-cell-group title="提取金额" style="margin-bottom:12px;">
          <van-field
              label="累计提取金额"
              :value="`¥ ${totalExtractAmount}`"
              readonly
              input-align="right"
          />
          <van-field
              label="可提取金额"
              :value="`¥ ${availableAmount}`"
              readonly
              input-align="right"
          />
          <van-field
              v-model="extractAmount"
              label="本次提取金额"
              placeholder="请输入本次提取金额"
              type="number"
              input-align="right"
          >
            <template #right-icon>
              <span style="color: #666; margin-left: 4px;">元</span>
            </template>
          </van-field>
        </van-cell-group>

        <van-cell-group title="收款账户" style="margin-bottom:12px;">
          <van-field
              label="选择银行卡"
              :value="bankCard"
              placeholder="请选择银行卡"
              readonly
              input-align="right"
              @click="showBankList = true"
          />
        </van-cell-group>

        <van-cell-group title="证明材料" style="margin-bottom:12px;">
          <div class="upload-item">
            <div class="upload-label">还款流水</div>
            <van-uploader v-model="fileList" :max-count="3" />
            <div style="font-size:12px;color:#999;margin-top:4px;">最多上传3张，支持jpg/png</div>
          </div>
        </van-cell-group>
      </div>

      <div class="bottom-btn-bar">
        <van-button type="default" size="large" @click="showManual = true" class="manual-btn custom-btn" icon="question-o">操作手册</van-button>
        <van-button type="primary" size="large" @click="handleSubmitCheck" class="next-btn custom-btn">提交</van-button>
      </div>
    </div>

    <!-- 新增：完整的办理结果页面 -->
    <div v-if="showResultPage" class="result-page">
      <van-nav-bar
          title="办结结果"
          fixed
          class="custom-nav-bar"
      >
        <template #left>
          <div class="back-btn" @click="backToHome">
            <van-icon name="arrow-left" size="18" color="#fff"/>
            <span>首页</span>
          </div>
        </template>
      </van-nav-bar>

      <div class="result-content">
        <div class="result-icon">
          <van-icon name="success-circle" size="60" color="#1677ff" />
        </div>
        <div class="result-title">办理成功</div>
        <div class="result-desc">
          您的偿还贷提取已提交成功，我们将尽快处理，请耐心等待
        </div>

        <div class="result-info">
          <van-cell-group title="申请信息">
            <van-cell>
              <div style="display:flex; justify-content:space-between; width:100%">
                <span>提取类型：</span>
                <span>{{ form.extractType || '未选择' }}</span>
              </div>
            </van-cell>
            <van-cell>
              <div style="display:flex; justify-content:space-between; width:100%">
                <span>提取金额：</span>
                <span>{{ extractAmount || '0' }}元</span>
              </div>
            </van-cell>
            <van-cell>
              <div style="display:flex; justify-content:space-between; width:100%">
                <span>银行卡：</span>
                <span>{{ bankCard || '未选择' }}</span>
              </div>
            </van-cell>
          </van-cell-group>

          <!-- 查看办理记录 链接 -->
          <div style="text-align: center; margin-top: 16px;">
            <span
                style="color: #1677ff; cursor: pointer;"
                @click="toRecordPage"
            >
              查看办理记录
            </span>
          </div>
        </div>
      </div>

      <!-- 固定底部蓝色返回首页按钮 -->
      <div class="result-btns">
        <van-button type="primary" size="large" @click="backToHome" block>返回首页</van-button>
      </div>
    </div>

    <!-- 信息协查授权弹窗 -->
    <van-dialog
        v-model="showAuthQrCodeDialog"
        title="信息协查授权"
        width="85%"
        show-cancel-button
        cancel-text="关闭"
        confirm-text="确认授权"
        @confirm="onAuthConfirm"
        @cancel="onAuthCancel"
        class="custom-qrcode-dialog"
    >
      <div class="qrcode-content">
        <div class="user-name-tip">
          请<span style="color: #1677ff; font-weight: 500;">{{ desensitizeName }}</span>完成信息协查授权
        </div>

        <img
            src="https://picsum.photos/200/200"
            class="qrcode-image"
            alt="授权二维码"
        >

        <div class="qrcode-desc">
          为办理本次偿还贷提取业务，需协查以下信息：
        </div>
        <div class="check-info-list">
          <div>• 婚姻信息</div>
          <div>• 房屋信息</div>
          <div>• 贷款信息</div>
        </div>
        <div class="qrcode-tip-bottom">
          我们将严格保护您的个人信息安全，仅用于本次业务办理
        </div>
      </div>
    </van-dialog>

    <!-- 操作手册弹窗 -->
    <van-dialog
        v-model="showManual"
        title="偿还贷提取操作指引"
        width="85%"
        cancel-text="关闭"
        class="custom-manual-dialog"
        title-class="dialog-title"
    >
      <div class="manual-content">
        <div class="manual-card" @click="openDoc">
          <div class="card-icon doc-icon">
            <van-icon name="file-text-o" size="24" />
          </div>
          <div class="card-content">
            <h3>操作文档</h3>
            <p>查看偿还贷提取详细填写说明</p>
          </div>
          <van-icon name="arrow-right" size="18" class="card-arrow" />
        </div>
        <div class="manual-card" @click="openVideo">
          <div class="card-icon video-icon">
            <van-icon name="play-circle-o" size="24" />
          </div>
          <div class="card-content">
            <h3>操作视频</h3>
            <p>观看偿还贷提取实操演示视频</p>
          </div>
          <van-icon name="arrow-right" size="18" class="card-arrow" />
        </div>
      </div>
    </van-dialog>

    <!-- 原有弹窗/选择器 -->
    <van-action-sheet v-model="showExtractType" :actions="extractTypeList" @select="onExtractTypeSelect" cancel-text="取消" />
    <van-action-sheet v-model="showFamilyRelation" :actions="familyRelationList" @select="onFamilyRelationSelect" cancel-text="取消" />
    <van-action-sheet v-model="showFamilyIdType" :actions="idTypeList" @select="onFamilyIdTypeSelect" cancel-text="取消" />
    <van-popup v-model="showHouseSelect" position="bottom" :style="{ height: '40%' }">
      <div class="popup-content">
        <div style="font-size:16px; font-weight:bold; margin-bottom:12px;">选择房屋贷款信息</div>
        <van-cell-group style="flex: 1; overflow-y: auto;">
          <van-cell
              v-for="(item, index) in houseLoanList"
              :key="index"
              :title="`房屋贷款-${index + 1}`"
              :sub-title="item.house.address"
              is-link
              @click="selectHouse(index)"
          />
        </van-cell-group>
        <div class="popup-footer fixed-bottom">
          <van-button type="primary" block style="background:#1677ff; border-color:#1677ff;" @click="showHouseSelect = false">取消</van-button>
        </div>
      </div>
    </van-popup>
    <van-popup v-model="showAddHouse" position="bottom" :style="{ height: '80%' }">
      <div class="popup-content">
        <div style="font-size:16px; font-weight:bold; margin-bottom:12px;">录入房屋贷款信息</div>
        <van-cell-group style="margin-bottom:16px;">
          <van-field label="姓名" v-model="queryParams.name" :disabled="form.familyRelation !== '本人'" />
          <van-field label="证件类型" :value="queryParams.idType" readonly is-link @click="showIdTypeSelect=true" :disabled="form.familyRelation !== '本人'" />
          <van-field label="证件号码" v-model="queryParams.idNo" :disabled="form.familyRelation !== '本人'" />
          <van-field label="房屋坐落" v-model="queryParams.houseAddress" rows="2" type="textarea" />
          <van-field label="贷款银行" :value="queryParams.bankType" readonly is-link @click="showBankTypeSelect=true" />
          <van-field label="贷款金额" v-model="queryParams.loanAmount" type="number" />
        </van-cell-group>
        <div class="query-link" @click="queryHouseAndLoan">
          <a href="javascript:;" style="color:#1677ff;">查询房屋及贷款信息</a>
        </div>
        <van-cell-group style="flex:1; overflow-y:auto; margin-top:16px;" v-if="infoFetched">
          <van-field label="不动产单元号" :value="addForm.unitNo" readonly />
          <van-field label="建成年月" :value="addForm.buildTime" readonly />
          <van-field label="建筑面积" :value="addForm.buildArea" readonly />
          <van-field label="房屋总价" :value="addForm.houseTotalPrice" readonly />
          <van-field label="合同编号" :value="addForm.contractNo" readonly />
          <van-field label="贷款起止日期" :value="`${addForm.loanStartDate} 至 ${addForm.loanEndDate}`" readonly />
        </van-cell-group>
        <div class="popup-footer fixed-bottom">
          <van-button type="primary" block @click="saveHouseAndLoan" :disabled="!infoFetched">保存并使用</van-button>
        </div>
      </div>
    </van-popup>
    <van-action-sheet v-model="showBankTypeSelect" :actions="bankTypeList" @select="setBankType" cancel-text="取消" />
    <van-action-sheet v-model="showIdTypeSelect" :actions="idTypeList" @select="setIdType" cancel-text="取消" />
    <van-action-sheet v-model="showBankList" :actions="bankList" @select="onSelectBank" cancel-text="取消" />
  </div>
</template>

<script>
import Vue from 'vue'
import {
  NavBar, CellGroup, Cell, Field, ActionSheet, Button, Toast, Dialog, Icon, Popup, Uploader, Tabs, Tab
} from 'vant'

Vue.use(NavBar)
Vue.use(CellGroup)
Vue.use(Cell)
Vue.use(Field)
Vue.use(ActionSheet)
Vue.use(Button)
Vue.use(Toast)
Vue.use(Dialog)
Vue.use(Icon)
Vue.use(Popup)
Vue.use(Uploader)
Vue.use(Tabs)
Vue.use(Tab)

export default {
  name: 'RentExtract',
  data() {
    return {
      currentStep: 1,
      showResultPage: false,
      showManual: false,
      manualActiveTab: 0,
      showHouseSelect: false,
      showAddHouse: false,
      selectedIndex: -1,

      showExtractType: false,
      showFamilyRelation: false,
      showFamilyIdType: false,
      showBankTypeSelect: false,
      showIdTypeSelect: false,
      showBankList: false,

      // 新增：授权弹窗相关
      showAuthQrCodeDialog: false,
      userName: '张三',
      desensitizeName: '',

      totalExtractAmount: 5000,
      availableAmount: 20000,

      queryParams: { idType: '身份证', idNo: '', name: '', houseAddress: '', bankType: '', loanAmount: '' },
      infoFetched: false,

      form: {
        extractType: '',
        familyRelation: '',
        familyName: '',
        familyIdType: '',
        familyIdCard: ''
      },

      houseLoanList: [
        {
          house: { address: '解放路102号花园小区1-3-201', unitNo: '370102001001030201', buildTime: '2019-01', buildArea: '98.5', houseTotalPrice: '1500000', owners: [{ idType: '身份证', idNo: '370102199011223344', name: '张三' }] },
          loan: { bankType: '工商银行', loanAmount: '1050000', contractNo: 'HT2025001', loanStartDate: '2019-10-01', loanEndDate: '2049-10-01' },
          isAdd: false
        }
      ],

      addForm: {
        houseRelation: '本人', province: '山东省', city: '济南市', district: '历下区', houseAddress: '',
        houseType: '商品住宅', unitNo: '', buildTime: '', buildArea: '', houseTotalPrice: '', firstPay: '', buyTime: '',
        owners: [], bankType: '', borrowerIdType: '身份证', borrowerIdNo: '', borrowerName: '', loanAmount: '', contractNo: '', loanStartDate: '', loanEndDate: ''
      },

      extractAmount: '',
      bankCard: '',
      fileList: []
    }
  },
  created() {
    // 初始化姓名脱敏
    this.desensitizeName = this.getDesensitizeName(this.userName)
  },
  computed: {
    currentHouse() { return this.houseLoanList[this.selectedIndex]?.house || {} },
    currentLoan() { return this.houseLoanList[this.selectedIndex]?.loan || {} },

    extractTypeList() {
      return [
        { text: '商业贷款', name: '商业贷款' },
        { text: '异地公积金贷款', name: '异地公积金贷款' },
        { text: '公积金贷款', name: '公积金贷款' }
      ]
    },
    familyRelationList() {
      return [
        { text: '本人', name: '本人' },
        { text: '配偶', name: '配偶' },
        { text: '父母', name: '父母' },
        { text: '子女', name: '子女' }
      ]
    },
    idTypeList() {
      return [
        { text: '身份证', name: '身份证' },
        { text: '护照', name: '护照' }
      ]
    },
    bankTypeList() {
      return [
        { text: '工商银行', name: '工商银行' },
        { text: '农业银行', name: '农业银行' },
        { text: '建设银行', name: '建设银行' },
        { text: '中国银行', name: '中国银行' }
      ]
    },
    bankList() {
      return [
        { text: '工商银行(6222 **** 1234)', name: '工商银行(6222 **** 1234)' },
        { text: '建设银行(6227 **** 5678)', name: '建设银行(6227 **** 5678)' }
      ]
    }
  },
  methods: {
    // 新增：姓名脱敏方法
    getDesensitizeName(name) {
      if (!name) return '未知用户'
      if (name.length === 1) return name
      if (name.length === 2) return name.charAt(0) + '*'
      return name.charAt(0) + '*' + name.slice(-1)
    },

    // 新增：授权弹窗关闭
    onAuthCancel() {
      this.showAuthQrCodeDialog = false
    },

    // 新增：确认授权
    onAuthConfirm() {
      this.showAuthQrCodeDialog = false

      // 👉 新增：如果是公积金贷款，直接提示未查询到房屋信息
      if (this.form.extractType === '公积金贷款') {
        Toast.fail('未查询到房屋信息');
        return;
      }

      Toast.success('授权成功，进入下一步')
      this.currentStep = 2
      this.selectedIndex = this.houseLoanList.length > 0 ? 0 : -1
    },

    // 新增：操作手册弹窗方法
    openDoc() {
      Toast.success('打开偿还贷提取操作文档')
      this.showManual = false
    },
    openVideo() {
      Toast.success('打开偿还贷提取操作视频')
      this.showManual = false
    },

    // 新增：查看办理记录
    toRecordPage() {
      Toast('跳转到办理记录页面')
    },

    goBack() { this.$router.back() },
    toSecondPage() {
      // 表单校验
      if (!this.form.extractType) {
        Toast('请选择提取类型')
        return
      }
      if (!this.form.familyRelation) {
        Toast('请选择与申请人关系')
        return
      }
      if (this.form.familyRelation !== '本人') {
        if (!this.form.familyName) {
          Toast('请输入家庭成员姓名')
          return
        }
        if (!this.form.familyIdType) {
          Toast('请选择证件类型')
          return
        }
        if (!this.form.familyIdCard) {
          Toast('请输入证件号码')
          return
        }
      }

      // 弹出信息协查授权弹窗
      this.showAuthQrCodeDialog = true
    },
    toThirdPage() {
      if (this.selectedIndex < 0) {
        Toast('请选择房屋信息')
        return
      }
      this.currentStep = 3
    },

    // 提交前校验 + 直接提交成功
    handleSubmitCheck() {
      if (!this.extractAmount) {
        Toast('请输入提取金额')
        return
      }
      const amount = Number(this.extractAmount)
      if (isNaN(amount) || amount <= 0) {
        Toast('提取金额必须为正数')
        return
      }
      if (amount > this.availableAmount) {
        Toast(`提取金额不能超过可提取金额¥${this.availableAmount}`)
        return
      }
      if (!this.bankCard) {
        Toast('请选择银行卡')
        return
      }
      if (this.fileList.length === 0) {
        Toast('请上传还款流水')
        return
      }

      // 直接提交成功
      this.doRealSubmit()
    },

    // 直接提交成功
    doRealSubmit() {
      Toast.loading({ message: '提交中...', duration: 0 })
      setTimeout(() => {
        Toast.clear()
        Toast.success('提交成功')
        this.showResultPage = true
        this.currentStep = 1
      }, 1000)
    },

    backToHome() {
      this.showResultPage = false
      this.currentStep = 1
      // 重置表单数据
      this.form = {
        extractType: '',
        familyRelation: '',
        familyName: '',
        familyIdType: '',
        familyIdCard: ''
      }
      this.extractAmount = ''
      this.bankCard = ''
      this.fileList = []
      this.selectedIndex = -1
    },

    onExtractTypeSelect(e) {
      this.showExtractType = false
      this.form.extractType = e.name
    },
    onFamilyRelationSelect(e) {
      this.showFamilyRelation = false
      this.form.familyRelation = e.name
      if (e.name === '本人') {
        this.form.familyName = ''
        this.form.familyIdType = ''
        this.form.familyIdCard = ''
      }
    },
    onFamilyIdTypeSelect(e) {
      this.showFamilyIdType = false
      this.form.familyIdType = e.name
    },

    selectHouse(index) {
      this.selectedIndex = index
      this.showHouseSelect = false
    },
    addNewHouse() { this.showAddHouse = true },
    queryHouseAndLoan() {
      const p = this.queryParams
      if (!p.idType || !p.idNo || !p.name || !p.houseAddress || !p.bankType || !p.loanAmount) {
        Toast('请完善信息')
        return
      }
      Toast.loading({ message: '查询中...', duration: 0 })
      setTimeout(() => {
        this.addForm.unitNo = '3701' + Date.now().toString().slice(-8)
        this.addForm.buildTime = '2020-01'
        this.addForm.buildArea = '105.2'
        this.addForm.houseTotalPrice = '1850000'
        this.addForm.contractNo = 'HT' + Date.now()
        this.addForm.loanStartDate = '2020-05-01'
        this.addForm.loanEndDate = '2050-04-30'
        this.addForm.bankType = p.bankType
        this.addForm.loanAmount = p.loanAmount
        this.infoFetched = true
        Toast.clear()
        Toast.success('查询成功')
      }, 1000)
    },
    saveHouseAndLoan() {
      const newItem = {
        house: {
          address: this.queryParams.houseAddress,
          unitNo: this.addForm.unitNo,
          buildTime: this.addForm.buildTime,
          buildArea: this.addForm.buildArea,
          houseTotalPrice: this.addForm.houseTotalPrice,
          owners: [{
            idType: this.queryParams.idType,
            idNo: this.queryParams.idNo,
            name: this.queryParams.name
          }]
        },
        loan: {
          bankType: this.addForm.bankType,
          loanAmount: this.addForm.loanAmount,
          contractNo: this.addForm.contractNo,
          loanStartDate: this.addForm.loanStartDate,
          loanEndDate: this.addForm.loanEndDate
        },
        isAdd: true
      }
      this.houseLoanList.push(newItem)
      this.selectedIndex = this.houseLoanList.length - 1
      this.showAddHouse = false
      this.infoFetched = false
      this.queryParams = { idType: '身份证', idNo: '', name: '', houseAddress: '', bankType: '', loanAmount: '' }
      Toast.success('保存成功')
    },
    handleDeleteHouse() {
      Dialog.confirm({
        title: '确认删除',
        message: '确定删除当前房屋信息吗？删除后无法恢复。'
      }).then(() => {
        this.houseLoanList.splice(this.selectedIndex, 1)
        this.selectedIndex = this.houseLoanList.length > 0 ? 0 : -1
        Toast.success('删除成功')
      })
    },
    onSelectBank(item) {
      this.showBankList = false
      this.bankCard = item.name
    },
    setBankType(item) {
      this.showBankTypeSelect = false
      this.queryParams.bankType = item.name
    },
    setIdType(item) {
      this.showIdTypeSelect = false
      if (this.form.familyRelation !== '本人') return
      this.queryParams.idType = item.name
      this.addForm.borrowerIdType = item.name
    }
  }
}
</script>

<style scoped>
.rent-extract-container {
  background-color: #f5f5f5;
  min-height: 100vh;
  padding-bottom: 80px;
}

.self-extract-page {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: #f5f5f5;
  z-index: 100;
  display: flex;
  flex-direction: column;
}

.form-content {
  padding: 61px 15px 15px;
}

.self-form-content {
  flex: 1;
  overflow-y: auto;
  padding-top: 46px;
  padding-bottom: 80px;
}

.van-cell-group {
  margin-bottom: 15px;
  background-color: #fff;
}

.upload-group {
  padding: 0;
}

.upload-item {
  padding: 12px 15px;
}

.upload-label {
  font-size: 15px;
  font-weight: 500;
  margin-bottom: 10px;
}

.upload-item >>> .van-uploader__upload {
  background-color: #f8f9fa;
  border: 1px dashed #dcdee0;
  border-radius: 8px;
  width: 70px;
  height: 70px;
}

.bottom-btn-bar {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  display: flex;
  padding: 10px 15px;
  background: transparent;
  border-top: none;
  z-index: 99;
}

.custom-btn {
  background-color: transparent !important;
  border: none !important;
  box-shadow: none !important;
}

.manual-btn {
  flex: 1;
  margin-right: 10px;
  background: #fff !important;
  border: 1px solid #eee !important;
  color: #1677ff !important;
}

.next-btn {
  flex: 2;
  color: #fff !important;
  background-color: #1677ff !important;
  border-radius: 4px;
}

.custom-nav-bar {
  background-color: #1677ff !important;
  height: 46px;
  padding: 0 15px;
}

.back-btn {
  display: flex;
  align-items: center;
  color: #fff;
  height: 46px;
  cursor: pointer;
  font-size: 16px;
}

.back-btn span {
  margin-left: 4px;
}

.custom-nav-bar .van-nav-bar__title {
  color: #fff !important;
  font-size: 16px;
}

.custom-manual-dialog {
  border-radius: 12px !important;
}

.dialog-title {
  font-size: 16px;
  font-weight: 600;
}

.manual-content {
  padding: 10px 0 5px 0;
}

.manual-card {
  display: flex;
  align-items: center;
  padding: 15px 10px;
  margin-bottom: 10px;
  background-color: #f8f9fa;
  border-radius: 8px;
}

.card-icon {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 12px;
}

.doc-icon {
  background-color: #e8f4ff;
  color: #1677ff;
}

.video-icon {
  background-color: #fdf2e8;
  color: #ff7d00;
}

.card-content {
  flex: 1;
}

.card-content h3 {
  font-size: 15px;
  color: #333;
  margin: 0 0 4px 0;
}

.card-content p {
  font-size: 13px;
  color: #666;
  margin: 0;
}

.card-arrow {
  color: #999;
}

/* 授权弹窗样式 */
.custom-qrcode-dialog {
  border-radius: 12px !important;
}
.qrcode-content {
  text-align: center;
  padding: 10px 0;
}
.user-name-tip {
  font-size: 16px;
  color: #333;
  margin-bottom: 15px;
  font-weight: 400;
}
.qrcode-image {
  width: 200px;
  height: 200px;
  margin: 0 auto 15px;
  border-radius: 4px;
}
.qrcode-desc {
  font-size: 14px;
  color: #333;
  line-height: 1.5;
  margin-bottom: 8px;
}
.check-info-list {
  text-align: left;
  margin: 0 auto 12px;
  max-width: 200px;
  font-size: 14px;
  color: #333;
  line-height: 1.6;
}
.qrcode-tip-bottom {
  font-size: 12px;
  color: #999;
  line-height: 1.4;
}

/* 结果页 */
.result-page {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: #f5f5f5;
  z-index: 101;
  display: flex;
  flex-direction: column;
}

.result-content {
  flex: 1;
  padding: 100px 20px 20px;
  text-align: center;
  overflow-y: auto;
  padding-bottom: 100px;
}

.result-icon {
  margin-bottom: 20px;
}

.result-title {
  font-size: 20px;
  font-weight: bold;
  color: #333;
  margin-bottom: 10px;
}

.result-desc {
  font-size: 14px;
  color: #666;
  margin-bottom: 30px;
  line-height: 1.5;
}

.result-info {
  margin-bottom: 30px;
  text-align: left;
}

.result-btns {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 15px 20px;
  background-color: #f5f5f5;
  border-top: 1px solid #eee;
  z-index: 102;
}

.result-btns .van-button--primary {
  background-color: #1677ff !important;
  border-color: #1677ff !important;
}

/* 房屋选择弹窗内部 */
.popup-content {
  height: 100%;
  display: flex;
  flex-direction: column;
  padding: 16px;
  box-sizing: border-box;
  padding-bottom: 80px;
}
.popup-footer {
  margin-top: 16px;
  padding-top: 12px;
  border-top: 1px solid #eee;
}
.query-link {
  text-align: center;
  margin-bottom: 10px;
  color: #1677ff;
  cursor: pointer;
}
.house-action-row {
  display: flex;
  justify-content: space-between;
  padding: 0 15px 12px;
  font-size: 14px;
}
.add-house {
  color: #1677ff;
  cursor: pointer;
}
.del-house {
  color: #ff5252;
  cursor: pointer;
}

/deep/ .van-nav-bar__title {
  color: #ffffff;
}

/deep/ .van-nav-bar__left {
  padding: 0;
}
</style>
