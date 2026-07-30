<template>
  <div class="house-buy-extract-container">
    <!-- 第一步：基础信息 -->
    <van-nav-bar
        title="购房提取"
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
      </van-cell-group>

      <!-- 配偶信息 -->
      <van-cell-group title="配偶信息" v-if="form.familyRelation === '配偶'">
        <van-field
            label="配偶姓名"
            v-model="mateInfo.name"
            placeholder="请输入配偶姓名"
            input-align="right"
        />
        <van-field
            label="证件类型"
            v-model="mateInfo.cardType"
            placeholder="请选择"
            readonly
            @click="showCardType = true"
            input-align="right"
        />
        <van-field
            label="证件号码"
            v-model="mateInfo.idNo"
            placeholder="请输入证件号码"
            input-align="right"
        />
      </van-cell-group>
    </div>

    <div class="bottom-btn-bar" v-if="currentStep === 1">
      <van-button type="default" size="large" @click="showManual = true" class="manual-btn" icon="question-o">操作手册</van-button>
      <van-button type="primary" size="large" @click="toSecondPage" class="next-btn">下一步</van-button>
    </div>

    <!-- 第二步：房屋信息（页面内直接新增，无弹窗、无单独保存） -->
    <div v-if="currentStep === 2" class="self-extract-page">
      <van-nav-bar title="房屋信息" fixed class="custom-nav-bar">
        <template #left>
          <div class="back-btn" @click="currentStep = 1">
            <van-icon name="arrow-left" size="18" color="#fff" />
            <span>上一步</span>
          </div>
        </template>
      </van-nav-bar>

      <div class="form-content self-form-content">
        <!-- 选择/切换房屋 -->
        <van-cell-group style="margin-bottom:12px;">
          <van-cell
              title="选择/切换房屋"
              :value="selectedIndex>=0 ?`房屋${selectedIndex+1}`:'请选择'"
              is-link
              @click="showHouseSelect = true"
          />
        </van-cell-group>

        <!-- 新增/删除操作 -->
        <div class="house-action-row">
          <span class="add-house" @click="addNewHouse">+ 新增房屋信息</span>
          <span
              class="del-house"
              v-if="selectedIndex >= 0 && houseList[selectedIndex].isAdd"
              @click="handleDeleteHouse"
          >
            删除房屋信息
          </span>
        </div>

        <!-- 已选房屋信息展示 -->
        <div v-if="selectedIndex >= 0 && houseList.length > 0 && !isAddingHouse">
          <van-cell-group title="产权人信息" style="margin-bottom:12px;">
            <van-field label="姓名" :value="currentHouse.owners[0].name" readonly input-align="right" />
            <van-field label="证件号码" :value="currentHouse.owners[0].idNo" readonly input-align="right" />
          </van-cell-group>

          <van-cell-group title="房屋信息" style="margin-bottom:12px;">
            <van-field label="房屋坐落" :value="currentHouse.address" readonly input-align="right" />
            <van-field label="不动产单元号" :value="currentHouse.unitNo" readonly input-align="right" />
            <van-field label="建成年月" :value="currentHouse.buildTime" readonly input-align="right" />
            <van-field label="建筑面积" :value="currentHouse.buildArea" readonly input-align="right" />
            <van-field label="房屋总价" :value="currentHouse.houseTotalPrice" readonly input-align="right" />
            <van-field label="购房时间" :value="currentHouse.buyTime" readonly input-align="right" />
            <van-field label="房屋类型" :value="currentHouse.houseType" readonly input-align="right" />
            <van-field v-if="currentHouse.city !== '青岛市'" label="是否有贷款" :value="currentHouse.hasLoan" readonly input-align="right" />
            <van-field v-if="currentHouse.city !== '青岛市' && currentHouse.hasLoan === '否'" label="是否满六个月" :value="currentHouse.isSixMonth" readonly input-align="right" />
            <van-field v-if="currentHouse.city !== '青岛市' && currentHouse.hasLoan === '是'" label="贷款银行行别" :value="currentHouse.bankType" readonly input-align="right" />
            <van-field v-if="currentHouse.city !== '青岛市' && currentHouse.hasLoan === '是'" label="贷款金额" :value="currentHouse.loanAmount" readonly input-align="right" />
            <van-field v-if="currentHouse.city !== '青岛市' && currentHouse.hasLoan === '是'" label="商贷合同编号" :value="currentHouse.contractNo" readonly input-align="right" />
          </van-cell-group>
        </div>

        <!-- 新增房屋表单（页面内直接展示，无按钮） -->
        <div v-if="isAddingHouse" class="add-house-form">
          <van-cell-group title="新增房屋信息" style="margin-bottom:12px;">
            <van-field
                label="产权人姓名"
                v-model="queryParams.name"
                readonly
                placeholder="自动获取"
                input-align="right"
            />
            <van-field
                label="证件号码"
                v-model="queryParams.idNo"
                readonly
                placeholder="自动获取"
                input-align="right"
            />
            <van-field
                label="房屋坐落"
                v-model="queryParams.houseAddress"
                placeholder="请输入详细地址"
                type="textarea"
                rows="2"
                input-align="right"
            />
          </van-cell-group>

          <!-- 查询不动产信息 -->
          <div style="text-align:center; margin:10px 0;">
            <span
                class="query-link"
                @click="queryHouseInfo"
                :style="{color: !queryParams.houseAddress ? '#999' : '#1677ff'}"
            >
              查询不动产信息
            </span>
          </div>

          <!-- 查不到数据时显示：省市区选择 -->
          <div v-if="showHouseDetail && noDataFlag" style="margin-top:15px;">
            <van-cell-group>
              <van-field
                  label="省份"
                  v-model="area.province"
                  placeholder="请选择"
                  readonly
                  @click="showProvince = true"
                  input-align="right"
              />
              <van-field
                  label="城市"
                  v-model="area.city"
                  placeholder="请选择"
                  readonly
                  :disabled="!area.province"
                  @click="showCity = true"
                  input-align="right"
              />
              <van-field
                  label="区县"
                  v-model="area.area"
                  placeholder="请选择"
                  readonly
                  :disabled="!area.city"
                  @click="showArea = true"
                  input-align="right"
              />
            </van-cell-group>
          </div>

          <!-- 非青岛市 → 显示是否有贷款 -->
          <van-cell-group v-if="showHouseDetail && noDataFlag && area.city !== '青岛市' && area.city">
            <van-field
                label="是否有贷款"
                v-model="hasLoan"
                placeholder="请选择"
                readonly
                @click="showLoanSelect = true"
                input-align="right"
            />

            <!-- 无贷款 → 显示是否满六个月 -->
            <van-field
                label="是否满六个月"
                v-model="isSixMonth"
                placeholder="请选择"
                readonly
                v-if="hasLoan === '否'"
                @click="showSixMonthSelect = true"
                input-align="right"
            />

            <!-- 有贷款 → 显示：贷款银行行别、贷款金额、商贷合同编号 -->
            <van-field
                label="贷款银行行别"
                v-model="bankType"
                placeholder="请选择"
                readonly
                v-if="hasLoan === '是'"
                @click="showBankSelect = true"
                input-align="right"
            />
            <van-field
                label="贷款金额"
                v-model="loanAmount"
                placeholder="请输入贷款金额"
                v-if="hasLoan === '是'"
                input-align="right"
            />
            <van-field
                label="商贷合同编号"
                v-model="contractNo"
                placeholder="非必填；查不到信息可填写本项重试"
                v-if="hasLoan === '是'"
                input-align="right"
            />
          </van-cell-group>

          <!-- 房屋详细信息 -->
          <div v-if="showHouseDetail && canContinue" style="margin-top:15px;">
            <van-cell-group>
              <van-field label="不动产单元号" v-model="addForm.unitNo" placeholder="请手动录入" input-align="right" />
              <van-field label="建成年月" v-model="addForm.buildTime" placeholder="请手动录入" input-align="right" />
              <van-field label="建筑面积(㎡)" v-model="addForm.buildArea" placeholder="请手动录入" input-align="right" />
              <van-field label="房屋总价(元)" v-model="addForm.houseTotalPrice" placeholder="请手动录入" input-align="right" />
              <van-field label="购房时间" v-model="addForm.buyTime" placeholder="请手动录入" input-align="right" />
              <van-field label="房屋类型" v-model="addForm.houseType" placeholder="请手动录入" input-align="right" />
            </van-cell-group>
          </div>
        </div>
      </div>

      <!-- 底部固定：只保留 操作手册 + 下一步 -->
      <div class="bottom-btn-bar">
        <van-button type="default" size="large" @click="showManual = true" class="manual-btn" icon="question-o">操作手册</van-button>
        <van-button type="primary" size="large" @click="toThirdPage" class="next-btn">下一步</van-button>
      </div>
    </div>

    <!-- 第三步：提取信息 -->
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
        <van-cell-group title="提取金额">
<!--          <van-field label="累计提取金额" :value="formatAmount(totalExtractAmount)" readonly input-align="right" />-->
<!--          <van-field label="可提取金额" :value="formatAmount(availableAmount)" readonly input-align="right" />-->
          <van-field v-model="extractAmount" label="本次提取金额" placeholder="请输入" type="number" input-align="right">
            <template #right-icon><span style="color:#666">元</span></template>
          </van-field>
        </van-cell-group>

        <van-cell-group title="收款账户" style="margin-top:12px;">
          <van-field label="选择银行卡" :value="bankCard" placeholder="请选择" readonly @click="showBankList = true" input-align="right" />
        </van-cell-group>

        <van-cell-group title="证明材料" style="margin-top:12px;">
          <div class="upload-item">
            <div class="upload-label">购房合同/房产证</div>
            <van-uploader v-model="fileList" :max-count="3" />
          </div>
          <div class="upload-item" style="margin-top:12px;">
            <div class="upload-label">购房发票</div>
            <van-uploader v-model="invoiceFileList" :max-count="2" />
          </div>
        </van-cell-group>
      </div>

      <!-- 底部固定：操作手册 + 提交 -->
      <div class="bottom-btn-bar">
        <van-button type="default" size="large" @click="showManual = true" class="manual-btn" icon="question-o">操作手册</van-button>
        <van-button type="primary" size="large" @click="handleSubmitCheck" class="next-btn">提交</van-button>
      </div>
    </div>

    <!-- 第四步：办理结果展示 -->
    <div v-if="currentStep === 4" class="self-extract-page">
      <van-nav-bar title="办理结果" fixed class="custom-nav-bar">
        <template #left>
          <div class="back-btn" @click="goBack">
            <van-icon name="arrow-left" size="18" color="#fff" />
            <span>返回</span>
          </div>
        </template>
      </van-nav-bar>

      <div class="form-content self-form-content" style="padding-top: 60px;">
        <!-- 办理结果卡片 -->
        <div class="result-card">
          <!-- 结果状态图标 -->
          <div class="result-icon" :class="handleResult.status === '00' ? 'success' : 'fail'">
            <van-icon name="success" v-if="handleResult.status === '00'" size="60" color="#07c160" />
            <van-icon name="cross" v-else size="60" color="#f53f3f" />
          </div>

          <!-- 结果标题 -->
          <div class="result-title">{{ handleResult.status === '00' ? '办理成功' : '办理失败' }}</div>

          <!-- 结果详情 -->
          <van-cell-group class="result-detail" style="margin-top: 20px;">
            <van-field label="业务编号" :value="handleResult.bizNo || '无'" readonly input-align="right" />
            <van-field label="办理时间" :value="handleResult.handleTime || formatDate(new Date())" readonly input-align="right" />
            <van-field label="结果代码" :value="handleResult.status || '无'" readonly input-align="right" />
            <van-field label="结果描述" :value="handleResult.msg || getResultMsg(handleResult.status)" readonly input-align="right" />
            <van-field label="提取金额" :value="formatAmount(handleResult.extractAmount || extractAmount)" readonly input-align="right" />
          </van-cell-group>
        </div>

        <!-- 操作按钮 -->
        <div class="result-btns" style="margin-top: 40px; padding: 0 15px;">
          <van-button type="primary" block size="large" @click="queryResultAgain">
            查看办理记录
          </van-button>
          <van-button type="default" block size="large" style="margin-top: 10px;" @click="resetProcess">
            返回首页
          </van-button>
        </div>
      </div>
    </div>

    <!-- 选择器弹窗 -->
    <van-action-sheet v-model="showExtractType" :actions="extractTypeList" @select="onExtractTypeSelect" cancel-text="取消" />
    <van-action-sheet v-model="showFamilyRelation" :actions="familyRelationList" @select="onFamilyRelationSelect" cancel-text="取消" />
    <van-action-sheet v-model="showCardType" :actions="cardTypeList" @select="onCardTypeSelect" cancel-text="取消" />
    <van-action-sheet v-model="showBankList" :actions="bankList" @select="onSelectBank" cancel-text="取消" />
    <van-action-sheet v-model="showProvince" :actions="provinceList" @select="onProvinceSelect" cancel-text="取消" />
    <van-action-sheet v-model="showCity" :actions="cityList" @select="onCitySelect" cancel-text="取消" />
    <van-action-sheet v-model="showArea" :actions="currentAreaList" @select="onAreaSelect" cancel-text="取消" />
    <van-action-sheet v-model="showLoanSelect" :actions="yesNoList" @select="onLoanChange" cancel-text="取消" />
    <van-action-sheet v-model="showSixMonthSelect" :actions="yesNoList" @select="onSixMonthChange" cancel-text="取消" />
    <van-action-sheet v-model="showBankSelect" :actions="bankTypeList" @select="onBankTypeChange" cancel-text="取消" />

    <van-popup v-model="showHouseSelect" position="bottom" :style="{height:'40%'}">
      <div class="popup-content">
        <div style="font-size:16px; font-weight:bold; margin-bottom:12px;">选择房屋</div>
        <van-cell-group style="flex:1;overflow-y:auto">
          <van-cell v-for="(item,i) in houseList" :key="i" :title="`房屋${i+1}`" :sub-title="item.address" is-link @click="selectHouse(i)" />
        </van-cell-group>
        <div class="popup-footer">
          <van-button type="primary" block @click="showHouseSelect=false">取消</van-button>
        </div>
      </div>
    </van-popup>
  </div>
</template>

<script>
import Vue from 'vue'
import {
  NavBar, CellGroup, Cell, Field, ActionSheet, Button, Toast, Dialog,
  Icon, Popup, Uploader
} from 'vant'

Vue.use(NavBar).use(CellGroup).use(Cell).use(Field).use(ActionSheet)
    .use(Button).use(Toast).use(Dialog).use(Icon).use(Popup).use(Uploader)

export default {
  name: 'HouseBuyExtract',
  data() {
    return {
      currentStep: 1, // 1-基础信息 2-房屋信息 3-提取信息 4-办理结果
      showManual: false,
      showHouseSelect: false,
      selectedIndex: 0,
      isAddingHouse: false,

      // 选择器开关
      showExtractType: false,
      showFamilyRelation: false,
      showCardType: false,
      showBankList: false,
      showProvince: false,
      showCity: false,
      showArea: false,
      showLoanSelect: false,
      showSixMonthSelect: false,
      showBankSelect: false,

      // 基础数据
      userInfo: { name: '张三', idNo: '110101199003011234' },
      mateInfo: { name: '', cardType: '', idNo: '' },
      queryParams: { name: '', idNo: '', houseAddress: '' },

      // 房屋信息
      area: { province: '', city: '', area: '' },
      showHouseDetail: false,
      noDataFlag: false,
      hasLoan: '',
      isSixMonth: '',
      canContinue: true,
      bankType: '',
      loanAmount: '',
      contractNo: '',

      // 表单数据
      form: { extractType: '', familyRelation: '' },
      houseList: [{
        address: '山东省青岛市市南区香港中路10号',
        unitNo: '3702020010010500123',
        buildTime: '2019-05',
        buildArea: '102.5',
        houseTotalPrice: '3200000',
        buyTime: '2020-03-10',
        houseType: '新建商品房',
        hasLoan: '',
        isSixMonth: '',
        bankType: '',
        loanAmount: '',
        contractNo: '',
        owners: [{ idType: '身份证', idNo: '110101199003011234', name: '张三' }],
        isAdd: false
      }],
      addForm: {
        unitNo: '', buildTime: '', buildArea: '', houseTotalPrice: '', buyTime: '', houseType: ''
      },

      // 提取金额相关
      totalExtractAmount: 0,
      availableAmount: 500000,
      extractAmount: '',
      bankCard: '',
      fileList: [],
      invoiceFileList: [],

      // 办理结果数据（核心：偿还贷提取的办理结果代码）
      handleResult: {
        status: '', // 结果代码：00-成功 01-失败 02-审核中 99-系统异常
        msg: '',    // 结果描述
        bizNo: '',  // 业务编号
        handleTime: '', // 办理时间
        extractAmount: '' // 实际提取金额
      },

      // 枚举列表
      extractTypeList: [
        { text: '新建商品房或保障性住房', name: '新建商品房或保障性住房' },
        { text: '二手房', name: '二手房' },
        { text: '取得经适完全产权', name: '取得经适完全产权' },
        { text: '拆迁安置房', name: '拆迁安置房' },
        { text: '拍卖住房', name: '拍卖住房' },
        { text: '军队安置住房', name: '军队安置住房' },
        { text: '公房', name: '公房' }
      ],
      familyRelationList: [
        { text: '本人', name: '本人' },
        { text: '配偶', name: '配偶' }
      ],
      cardTypeList: [
        { text: '身份证', name: '身份证' },
        { text: '护照', name: '护照' }
      ],
      yesNoList: [
        { text: '是', name: '是' },
        { text: '否', name: '否' }
      ],
      bankTypeList: [
        { text: '工商银行', name: '工商银行' },
        { text: '建设银行', name: '建设银行' },
        { text: '中国银行', name: '中国银行' },
        { text: '农业银行', name: '农业银行' },
        { text: '交通银行', name: '交通银行' },
        { text: '其他银行', name: '其他银行' }
      ],
      provinceList: [
        { text: '山东省', name: '山东省' },
        { text: '四川省', name: '四川省' }
      ],
      cityList: [],
      qingdaoAreaList: [
        { text: '市南区', name: '市南区' },{ text: '市北区', name: '市北区' },
        { text: '黄岛区', name: '黄岛区' },{ text: '崂山区', name: '崂山区' },
        { text: '李沧区', name: '李沧区' },{ text: '城阳区', name: '城阳区' },
        { text: '即墨区', name: '即墨区' }
      ],
      chengduAreaList: [
        { text: '锦江区', name: '锦江区' },{ text: '青羊区', name: '青羊区' },
        { text: '金牛区', name: '金牛区' },{ text: '武侯区', name: '武侯区' },
        { text: '成华区', name: '成华区' },{ text: '龙泉驿区', name: '龙泉驿区' },
        { text: '新都区', name: '新都区' }
      ],
      bankList: [
        { text: '工商银行(6222 **** 1234)', name: '工商银行(6222 **** 1234)' },
        { text: '建设银行(6227 **** 5678)', name: '建设银行(6227 **** 5678)' }
      ],

      // 办理结果代码映射（核心：偿还贷提取的结果码）
      resultCodeMap: {
        '00': '办理成功',
        '01': '材料不全，办理失败',
        '02': '申请已提交，审核中',
        '03': '提取金额超出可提取额度',
        '04': '银行卡信息错误',
        '99': '系统异常，请稍后重试'
      }
    }
  },
  computed: {
    currentHouse() {
      return this.houseList[this.selectedIndex] || {}
    },
    currentAreaList() {
      if (this.area.city === '青岛市') return this.qingdaoAreaList
      if (this.area.city === '成都市') return this.chengduAreaList
      return []
    }
  },
  watch: {
    'area.city'(val) {
      this.hasLoan = ''
      this.isSixMonth = ''
      this.bankType = ''
      this.loanAmount = ''
      this.contractNo = ''
      this.canContinue = true
    }
  },
  methods: {
    // 返回上一页
    goBack() {
      if (this.currentStep === 4) {
        this.currentStep = 3
      } else {
        this.$router.back()
      }
    },

    // 第一步→第二步
    toSecondPage() {
      if (!this.form.extractType) return Toast('请选择提取类型')
      if (!this.form.familyRelation) return Toast('请选择与申请人关系')

      this.currentStep = 2
      this.selectedIndex = 0
      this.isAddingHouse = false
    },

    // 第二步→第三步（自动保存新增房屋）
    async toThirdPage() {
      if (this.isAddingHouse) {
        const ok = await this.saveHouseInfo()
        if (!ok) return
      }

      if (this.selectedIndex < 0) {
        Toast('请选择或新增房屋信息')
        return
      }

      this.currentStep = 3
    },

    // 金额格式化
    formatAmount(amount) {
      if (amount === undefined || amount === null || amount === '') {
        return '¥ 0.00'
      }
      return `¥ ${Number(amount).toFixed(2)}`
    },

    // 日期格式化
    formatDate(date) {
      const year = date.getFullYear()
      const month = (date.getMonth() + 1).toString().padStart(2, '0')
      const day = date.getDate().toString().padStart(2, '0')
      const hour = date.getHours().toString().padStart(2, '0')
      const minute = date.getMinutes().toString().padStart(2, '0')
      const second = date.getSeconds().toString().padStart(2, '0')
      return `${year}-${month}-${day} ${hour}:${minute}:${second}`
    },

    // 获取结果描述
    getResultMsg(code) {
      return this.resultCodeMap[code] || '未知结果'
    },

    // 模拟提交办理（生成办理结果）- 修复核心BUG
    handleSubmitCheck() {
      // 1. 校验提取金额是否有效（大于0且不超过可提取金额）
      // if (!this.extractAmount || isNaN(Number(this.extractAmount))) {
      //   return Toast('请输入有效的提取金额')
      // }
      // const extractNum = Number(this.extractAmount)
      // if (extractNum <= 0) {
      //   return Toast('提取金额必须大于0')
      // }
      // if (extractNum > this.availableAmount) {
      //   return Toast(`提取金额不能超过可提取额度¥${this.availableAmount.toFixed(2)}`)
      // }

      // 2. 基础必填项校验
      // if (!this.bankCard) return Toast('请选择银行卡')
      // if (this.fileList.length === 0) return Toast('请上传购房合同/房产证')

      // 3. 修复Toast.loading阻塞问题（移除duration参数，手动关闭）
      const loading = Toast.loading({
        message: '提交中...',
        forbidClick: true, // 禁止点击背景
        duration: 0 // 手动关闭
      })

      // 4. 模拟接口请求
      setTimeout(() => {
        // 手动关闭loading
        loading.clear()

        // 随机生成办理结果
        const randomCode = '00'

        this.handleResult = {
          status: randomCode,
          msg: this.getResultMsg(randomCode),
          bizNo: 'BIZ' + Date.now(),
          handleTime: this.formatDate(new Date()),
          extractAmount: randomCode === '00' ? this.extractAmount : ''
        }

        // 跳转到办理结果页面
        this.currentStep = 4
      }, 1500)
    },

    // 重新查询办理结果
    queryResultAgain() {
      const loading = Toast.loading({
        message: '查询中...',
        forbidClick: true,
        duration: 0
      })

      setTimeout(() => {
        loading.clear()
        // 模拟重新查询（审核中→成功）
        if (this.handleResult.status === '02') {
          this.handleResult.status = '00'
          this.handleResult.msg = this.getResultMsg('00')
          this.handleResult.extractAmount = this.extractAmount
        }
        Toast.success('查询完成')
      }, 1000)
    },

    // 重置流程，重新办理
    resetProcess() {
      this.currentStep = 1
      this.form = { extractType: '', familyRelation: '' }
      this.extractAmount = ''
      this.bankCard = ''
      this.fileList = []
      this.invoiceFileList = []
      this.handleResult = { status: '', msg: '', bizNo: '', handleTime: '', extractAmount: '' }
    },

    // 选择器事件
    onExtractTypeSelect(e) { this.form.extractType = e.name; this.showExtractType = false },
    onFamilyRelationSelect(e) {
      this.form.familyRelation = e.name
      this.mateInfo = { name: '', cardType: '', idNo: '' }
      this.showFamilyRelation = false
    },
    onCardTypeSelect(e) { this.mateInfo.cardType = e.name; this.showCardType = false },
    onSelectBank(item) { this.bankCard = item.name; this.showBankList = false },

    onProvinceSelect(e) {
      this.area.province = e.name
      this.area.city = ''
      this.area.area = ''
      if (this.area.province === '山东省') {
        this.cityList = [{ text: '青岛市', name: '青岛市' }]
      } else if (this.area.province === '四川省') {
        this.cityList = [{ text: '成都市', name: '成都市' }]
      }
      this.showProvince = false
    },
    onCitySelect(e) {
      this.area.city = e.name
      this.area.area = ''
      this.showCity = false
    },
    onAreaSelect(e) { this.area.area = e.name; this.showArea = false },

    onLoanChange(e) {
      this.hasLoan = e.name
      this.isSixMonth = ''
      this.bankType = ''
      this.loanAmount = ''
      this.contractNo = ''
      this.canContinue = true
      this.showLoanSelect = false
    },
    onSixMonthChange(e) {
      this.isSixMonth = e.name
      this.canContinue = this.isSixMonth === '是'
      if (!this.canContinue) Toast('当前条件不允许办理')
      this.showSixMonthSelect = false
    },
    onBankTypeChange(e) {
      this.bankType = e.name
      this.showBankSelect = false
    },

    // 房屋操作
    selectHouse(i) {
      this.selectedIndex = i
      this.showHouseSelect = false
      this.isAddingHouse = false
    },
    addNewHouse() {
      this.queryParams = {
        name: this.form.familyRelation === '配偶' ? this.mateInfo.name : this.userInfo.name,
        idNo: this.form.familyRelation === '配偶' ? this.mateInfo.idNo : this.userInfo.idNo,
        houseAddress: ''
      }
      this.area = { province: '', city: '', area: '' }
      this.addForm = { unitNo: '', buildTime: '', buildArea: '', houseTotalPrice: '', buyTime: '', houseType: '' }
      this.showHouseDetail = false
      this.noDataFlag = false
      this.hasLoan = ''
      this.isSixMonth = ''
      this.bankType = ''
      this.loanAmount = ''
      this.contractNo = ''
      this.canContinue = true
      this.isAddingHouse = true
    },
    handleDeleteHouse() {
      Dialog.confirm({ title: '确认删除', message: '确定删除该房屋吗？' }).then(() => {
        this.houseList.splice(this.selectedIndex, 1)
        this.selectedIndex = this.houseList.length > 0 ? 0 : -1
        Toast.success('删除成功')
      })
    },

    queryHouseInfo() {
      if (!this.queryParams.houseAddress) return Toast('请输入房屋坐落')
      const loading = Toast.loading({
        message: '查询中...',
        forbidClick: true,
        duration: 0
      })
      setTimeout(() => {
        loading.clear()
        this.showHouseDetail = true
        this.noDataFlag = true
        Toast('未查询到数据，请手动录入房屋信息')
      }, 800)
    },

    // 保存房屋信息
    saveHouseInfo() {
      return new Promise(resolve => {
        if (!this.queryParams.name || !this.queryParams.idNo || !this.queryParams.houseAddress) {
          Toast('信息不完整')
          return resolve(false)
        }
        if (this.noDataFlag && (!this.area.province || !this.area.city || !this.area.area)) {
          Toast('请选择省市区')
          return resolve(false)
        }
        if (this.area.city !== '青岛市') {
          if (!this.hasLoan) {
            Toast('请选择是否有贷款')
            return resolve(false)
          }
          if (this.hasLoan === '否') {
            if (!this.isSixMonth) {
              Toast('请选择是否满六个月')
              return resolve(false)
            }
            if (this.isSixMonth === '否') {
              Toast('当前条件不允许办理')
              return resolve(false)
            }
          }
          if (this.hasLoan === '是') {
            if (!this.bankType) { Toast('请选择贷款银行行别'); return resolve(false) }
            if (!this.loanAmount) { Toast('请输入贷款金额'); return resolve(false) }
          }
        }

        const newHouse = {
          address: this.queryParams.houseAddress,
          province: this.area.province,
          city: this.area.city,
          area: this.area.area,
          hasLoan: this.hasLoan,
          isSixMonth: this.isSixMonth,
          bankType: this.bankType,
          loanAmount: this.loanAmount,
          contractNo: this.contractNo,
          unitNo: this.addForm.unitNo,
          buildTime: this.addForm.buildTime,
          buildArea: this.addForm.buildArea,
          houseTotalPrice: this.addForm.houseTotalPrice,
          buyTime: this.addForm.buyTime,
          houseType: this.addForm.houseType,
          owners: [{
            idType: this.form.familyRelation === '配偶' ? this.mateInfo.cardType : '身份证',
            idNo: this.queryParams.idNo,
            name: this.queryParams.name
          }],
          isAdd: true
        }

        this.houseList.push(newHouse)
        this.selectedIndex = this.houseList.length - 1
        this.isAddingHouse = false
        Toast.success('房屋信息已保存')
        resolve(true)
      })
    }
  }
}
</script>

<style scoped>
.house-buy-extract-container { background: #f5f5f5; min-height: 100vh; padding-bottom:80px; }
.self-extract-page { position: fixed; top:0; left:0; right:0; bottom:0; background:#f5f5f5; z-index:100; display:flex; flex-direction:column; }
.form-content { padding: 46px 15px 15px; }
.self-form-content { flex:1; overflow-y: auto; }

/* 办理结果样式 */
.result-card {
  background: #fff;
  border-radius: 12px;
  padding: 30px 20px;
  margin: 0 15px;
  text-align: center;
}
.result-icon {
  margin-bottom: 15px;
}
.result-title {
  font-size: 20px;
  font-weight: bold;
  color: #333;
  margin-bottom: 10px;
}
.result-detail {
  text-align: left;
}

/* 基础样式 */
.van-cell-group { margin-bottom:12px; background:#fff; }
.upload-item { padding:12px 15px; }
.upload-label { font-size:15px; font-weight:500; margin-bottom:10px; }
.upload-item >>> .van-uploader__upload { width:70px; height:70px; background:#f8f9fa; border:1px dashed #dcdee0; border-radius:8px; }

.bottom-btn-bar { position:fixed; bottom:0; left:0; right:0; display:flex; padding:10px 15px; z-index:99; }
.manual-btn { flex: 1; margin-right:10px; }
.next-btn {
  flex: 2;
  background-color: #1677ff !important;
  border-color: #1677ff !important;
  color: #fff !important;
}

.custom-nav-bar { background:#1677ff !important; }
.back-btn { display:flex; align-items:center; color:#fff; height:46px; font-size:16px; }
.back-btn span { margin-left:4px; }
.house-action-row { display:flex; justify-content:space-between; padding:0 15px 12px; font-size:14px; }
.add-house { color:#1677ff; cursor:pointer; }
.del-house { color:#ff5252; cursor:pointer; }

.popup-content { height:100%; display:flex; flex-direction:column; padding:16px; box-sizing:border-box; padding-bottom:80px; }
.popup-footer { position:absolute; bottom:0; left:0; right:0; padding:10px 16px; background:#fff; }
.query-link { font-size:15px; cursor:pointer; text-decoration:underline; }
.add-house-form { background: #fff; padding: 15px; border-radius: 8px; margin-bottom: 20px; }

/deep/ .van-nav-bar__title {
  color: #ffffff;
}
</style>
