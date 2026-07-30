<template>
  <div class="house-payment-extract-container">
    <!-- 顶部导航栏 -->
    <van-nav-bar
        title="二手房首付款提取办理"
        fixed
        class="custom-nav-bar"
        v-if="!showResultPage"
    >
      <template #left>
        <div class="back-btn" @click="goBack">
          <van-icon name="arrow-left" size="18" color="#fff"/>
          <span>返回</span>
        </div>
      </template>
    </van-nav-bar>

    <!-- 步骤容器 -->
    <div class="step-container">
      <!-- 步骤1：购房信息录入（完全保留原有逻辑） -->
      <div v-show="currentStep === 0" class="step-content">
        <van-cell-group title="购房信息录入">
          <van-field
              v-model="form1.buyerName"
              label="购房人姓名"
              placeholder="请输入购房人姓名"
              required
              input-align="right"
          />
          <van-field
              v-model="form1.buyerIdCard"
              label="购房人证件号码"
              placeholder="请输入证件号码"
              required
              input-align="right"
          />
          <van-field
              v-model="form1.houseAddress"
              label="房屋坐落"
              placeholder="请输入房屋坐落"
              required
              input-align="right"
              rows="2"
              type="textarea"
          />
        </van-cell-group>
      </div>

      <!-- 步骤2：房屋信息 + 托管信息（移除托管账号选择，展示完整托管字段） -->
      <div v-show="currentStep === 1" class="step-content">
        <van-cell-group title="房屋信息">
          <van-field
              v-model="form2.sellerName"
              label="卖方姓名"
              readonly
              input-align="right"
          />
          <van-field
              v-model="form2.sellerIdCard"
              label="卖方证件号码"
              readonly
              input-align="right"
          />
          <van-field
              v-model="form2.province"
              label="省"
              readonly
              input-align="right"
          />
          <van-field
              v-model="form2.city"
              label="市"
              readonly
              input-align="right"
          />
          <van-field
              v-model="form2.area"
              label="区"
              readonly
              input-align="right"
          />
          <van-field
              v-model="form2.houseAddress"
              label="房屋坐落"
              readonly
              input-align="right"
          />
          <van-field
              v-model="form2.houseType"
              label="房屋性质"
              readonly
              input-align="right"
          />
          <van-field
              v-model="form2.houseCode"
              label="不动产编号"
              readonly
              input-align="right"
          />
          <van-field
              v-model="form2.buildYear"
              label="建成年月"
              readonly
              input-align="right"
          />
          <van-field
              v-model="form2.areaSize"
              label="建筑面积"
              readonly
              input-align="right"
          >
            <template #right-icon>
              <span style="color: #666;">㎡</span>
            </template>
          </van-field>
          <van-field
              v-model="form2.houseTotalPrice"
              label="房屋总价"
              readonly
              input-align="right"
          >
            <template #right-icon>
              <span style="color: #666;">元</span>
            </template>
          </van-field>
          <van-field
              v-model="form2.downPayment"
              label="首付金额"
              readonly
              input-align="right"
          >
            <template #right-icon>
              <span style="color: #666;">元</span>
            </template>
          </van-field>
          <van-field
              v-model="form2.buyDate"
              label="购房日期"
              readonly
              input-align="right"
          />
          <van-field
              v-model="form2.netSignNo"
              label="网签合同编号"
              readonly
              input-align="right"
          />
        </van-cell-group>

        <!-- 托管信息（展示完整字段，移除选择功能） -->
        <van-cell-group title="托管信息">
          <van-field
              label="托管人姓名"
              value="张*"
              readonly
              input-align="right"
          />
          <van-field
              label="托管人证件类型"
              value="居民身份证"
              readonly
              input-align="right"
          />
          <van-field
              label="托管人证件号码"
              value="370211****1234"
              readonly
              input-align="right"
          />
          <van-field
              label="托管账号"
              value="6222********1234"
              readonly
              input-align="right"
          />
          <van-field
              label="账户类别"
              value="资金托管账户"
              readonly
              input-align="right"
          />
          <van-field
              v-model="form2.downPayment"
              label="托管金额"
              readonly
              input-align="right"
          >
            <template #right-icon>
              <span style="color: #666;">元</span>
            </template>
          </van-field>
          <van-field
              label="协议签订日期"
              value="2025-10-20"
              readonly
              input-align="right"
          />
        </van-cell-group>
      </div>

      <!-- 步骤3：提取人信息（替换为新建商品房逻辑） -->
      <div v-show="currentStep === 2" class="step-content extract-step">
        <!-- 收款账户信息（保留原有） -->
        <van-cell-group title="收款账户信息" class="account-group">
          <van-field
              v-model="selectedAccount.accountName"
              label="收款账户"
              placeholder="请选择收款账户"
              readonly
              clickable
              input-align="right"
              @click="showAccountSelect = true"
          >
            <template #right-icon>
              <van-icon name="arrow-right" size="16" color="#999" />
            </template>
          </van-field>
          <van-field
              v-model="selectedAccount.bankName"
              label="开户银行"
              readonly
              input-align="right"
          />
          <van-field
              v-model="selectedAccount.accountNo"
              label="银行账号"
              readonly
              input-align="right"
          />
        </van-cell-group>

        <!-- 新增提取人按钮（新建商品房样式） -->
        <div class="add-btn-wrapper">
          <van-button
              type="primary"
              plain
              block
              @click="addExtractor"
              class="add-extractor-btn"
          >
            <van-icon name="plus" class="btn-icon" /> 新增提取人
          </van-button>
        </div>

        <!-- 提取人列表标题 -->
        <div class="list-title" v-if="extractorList.length">
          <span class="title-text">提取人列表</span>
          <span class="count-text">{{ extractorList.length }}人</span>
        </div>

        <!-- 提取人列表（新建商品房核心逻辑） -->
        <div class="extractor-list">
          <div
              v-for="(item, idx) in extractorList"
              :key="idx"
              class="extractor-card"
          >
            <!-- 提取人卡片头部 -->
            <div class="card-header">
              <span class="card-index">提取人 {{ idx + 1 }}</span>
              <div class="header-buttons">
                <!-- 保存/修改按钮 -->
                <van-button
                    v-if="!item.saved"
                    type="primary"
                    size="mini"
                    @click="saveExtractor(idx)"
                    class="header-btn save-btn"
                >
                  保存
                </van-button>
                <van-button
                    v-else
                    type="default"
                    size="mini"
                    @click="editExtractor(idx)"
                    class="header-btn edit-btn"
                >
                  修改
                </van-button>

                <!-- 授权按钮 -->
                <van-button
                    v-if="item.saved && item.relation !== '本人'"
                    type="warning"
                    size="mini"
                    @click="authorizeExtractor(idx)"
                    class="header-btn authorize-btn"
                >
                  {{ item.authorized ? '重新授权' : '授权' }}
                </van-button>

                <!-- 删除按钮 -->
                <van-button
                    type="danger"
                    size="mini"
                    @click="delExtractor(idx)"
                    class="header-btn delete-btn"
                >
                  删除
                </van-button>
              </div>
            </div>

            <!-- 提取人表单 -->
            <van-cell-group class="card-form">
              <van-field
                  v-model="item.relation"
                  label="与购房人关系"
                  placeholder="请选择"
                  readonly
                  clickable
                  class="form-item"
                  @click="showRelation = true; currentIdx = idx"
              >
                <template #right-icon>
                  <van-icon name="arrow-right" size="16" color="#999" />
                </template>
              </van-field>

              <van-field
                  v-model="item.idType"
                  label="证件类型"
                  placeholder="请选择"
                  readonly
                  clickable
                  class="form-item"
                  :disabled="item.relation === '本人'"
                  @click="showIdType = true; currentIdx = idx"
              >
                <template #right-icon>
                  <van-icon name="arrow-right" size="16" color="#999" />
                </template>
              </van-field>

              <van-field
                  v-model="item.name"
                  label="提取人姓名"
                  placeholder="请输入姓名"
                  required
                  class="form-item"
                  :disabled="item.relation === '本人'"
              />

              <van-field
                  v-model="item.idNo"
                  label="证件号码"
                  placeholder="请输入证件号码"
                  required
                  class="form-item"
                  :disabled="item.relation === '本人'"
              />

              <!-- 本人显示最大可提取金额 -->
              <van-field
                  v-if="item.relation === '本人'"
                  v-model="item.maxExtractAmount"
                  label="最大可提取金额"
                  placeholder="系统自动计算"
                  readonly
                  class="form-item"
              />

              <!-- 授权后显示授权金额 -->
              <van-field
                  v-if="item.authorized && item.relation !== '本人'"
                  v-model="item.extractAmount"
                  label="授权提取金额"
                  readonly
                  class="form-item"
              />

              <!-- 本人需填写提取金额 -->
              <van-field
                  v-else-if="item.relation === '本人'"
                  v-model="item.extractAmount"
                  label="提取金额"
                  placeholder="请输入提取金额"
                  required
                  class="form-item"
              />
            </van-cell-group>
          </div>
        </div>

        <!-- 空状态 -->
        <div class="empty-state" v-if="!extractorList.length">
          <van-empty
              image="https://img.yzcdn.cn/vant/empty-image.png"
              description="暂无提取人信息，请点击新增按钮添加"
              class="empty-component"
          >
            <van-button
                type="primary"
                size="small"
                @click="addExtractor"
                class="empty-add-btn"
            >
              立即添加
            </van-button>
          </van-empty>
        </div>

        <!-- 档案材料上传 -->
        <div class="global-upload-section" v-if="extractorList.length && allExtractorsSaved">
          <van-cell-group class="upload-group">
            <div class="upload-title">
              <span>档案材料上传</span>
              <span class="required">*</span>
            </div>
            <van-uploader
                v-model="commonFileList"
                :max-count="3"
                :before-read="beforeRead"
                upload-text="点击上传"
                preview-text="查看"
                delete-text="删除"
            />
            <div class="upload-tip">
              支持上传 jpg、jpeg、png、pdf 格式文件，最多上传3个，所有提取人共用此套材料
            </div>
          </van-cell-group>
        </div>
      </div>
    </div>

    <!-- 步骤1/2 底部按钮（移除第二步托管账号校验） -->
    <div class="bottom-btn-bar" v-if="!showResultPage && currentStep < 2">
      <van-button
          type="primary"
          block
          size="large"
          color="#1677ff"
          @click="nextStep"
          :disabled="!canNext()"
      >
        {{ currentStep === 1 ? '进入提取人信息' : '下一步' }}
      </van-button>
    </div>

    <!-- 步骤3 提交按钮（更新禁用逻辑） -->
    <div class="submit-btn-bar" v-if="!showResultPage && currentStep === 2">
      <van-button
          type="primary"
          block
          size="large"
          color="#1677ff"
          @click="submitAll"
          :disabled="!extractorList.length || !allExtractorsSaved || hasUnauthorizedExtractors || commonFileList.length === 0 || !selectedAccount.accountNo"
      >
        提交办理
      </van-button>
    </div>

    <!-- 收款账户选择弹窗（保留原有） -->
    <van-dialog
        v-model="showAccountSelect"
        title="选择收款账户"
        width="90%"
    >
      <van-list
          v-model="accountListLoading"
          :finished="accountListFinished"
          finished-text="没有更多账户了"
          @load="loadAccountList"
      >
        <van-cell
            v-for="(item, idx) in accountList"
            :key="idx"
            :title="item.accountName"
            :label="`${item.bankName} | ${item.accountNo}`"
            @click="selectAccount(item)"
        >
          <template #right-icon>
            <van-icon
                name="checked"
                color="#1677ff"
                v-if="selectedAccount.accountNo === item.accountNo"
            />
          </template>
        </van-cell>
      </van-list>
    </van-dialog>

    <!-- 提取人相关弹窗（新建商品房逻辑） -->
    <van-action-sheet
        v-model="showRelation"
        title="选择与购房人关系"
        cancel-text="取消"
        :actions="relationOptions"
        @select="onSelectRelation"
    />
    <van-action-sheet
        v-model="showIdType"
        title="选择证件类型"
        cancel-text="取消"
        :actions="idTypeOptions"
        @select="onSelectIdType"
    />

    <!-- 授权弹窗（新建商品房逻辑） -->
    <van-popup
        v-model="showAuthPopup"
        position="bottom"
        :style="{ height: '75%' }"
        round
        closeable
    >
      <div class="auth-popup">
        <div class="auth-title">提取授权确认</div>
        <div class="auth-info" v-if="currentAuthExtractor">
          <van-cell-group border="false" class="auth-group">
            <div class="auth-relation">
              本人（{{ currentAuthExtractor.name }}）自愿授权<br/>
              授权给购房人：{{ form1.buyerName || '未填写' }}
            </div>
            <van-field
                v-model="currentAuthExtractor.name"
                label="授权人姓名"
                readonly
                input-align="right"
            />
            <van-field
                v-model="currentAuthExtractor.idType"
                label="证件类型"
                readonly
                input-align="right"
            />
            <van-field
                v-model="currentAuthExtractor.idNo"
                label="证件号码"
                readonly
                input-align="right"
            />
            <van-field
                v-model="currentAuthExtractor.maxExtractAmount"
                label="最大可提取金额（元）"
                readonly
                input-align="right"
            />
            <van-field
                v-model="authExtractAmount"
                label="本次授权提取金额（元）"
                placeholder="请输入授权提取金额"
                input-align="right"
                type="number"
            />
          </van-cell-group>
          <div class="auth-tip">
            本人确认以上信息真实有效，自愿授权购房人代为办理本次公积金提取。
          </div>
          <div class="auth-btn-wrapper">
            <van-button type="primary" block color="#1677ff" @click="confirmAuth">
              确认授权
            </van-button>
          </div>
        </div>
      </div>
    </van-popup>

    <!-- 办理结果页（保留原有） -->
    <div v-if="showResultPage" class="result-page">
      <van-nav-bar
          title="办理结果"
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
        <van-icon name="success-circle" size="80" color="#07c160"/>
        <div class="result-title">提交成功</div>
        <div class="result-desc">该业务需要审核，请耐心等待通知</div>
        <div class="result-link" @click="toQueryRecord">查询办理记录</div>
      </div>
      <div class="result-bottom-bar">
        <van-button type="primary" block color="#1677ff" @click="backToHome">返回首页</van-button>
      </div>
    </div>
  </div>
</template>

<script>
import Vue from 'vue'
import {
  NavBar, Icon, CellGroup, Cell, Field, Uploader,
  ActionSheet, Button, Toast, Dialog, List,
  Popup, Empty
} from 'vant'

Vue.use(NavBar).use(Icon).use(CellGroup).use(Cell).use(Field)
    .use(Uploader).use(ActionSheet).use(Button).use(Toast).use(Dialog)
    .use(List).use(Popup).use(Empty)

export default {
  name: 'HousePaymentExtract',
  data() {
    return {
      // 步骤控制（保留原有）
      currentStep: 0,
      showResultPage: false,

      // 步骤1：购房人信息（保留原有）
      form1: {
        buyerName: '',
        buyerIdCard: '',
        houseAddress: ''
      },

      // 步骤2：房屋信息（移除托管账号字段）
      form2: {
        sellerName: '',
        sellerIdCard: '',
        province: '山东省',
        city: '青岛市',
        area: '',
        houseAddress: '',
        houseType: '',
        houseCode: '',
        buildYear: '',
        areaSize: '',
        houseTotalPrice: '',
        downPayment: '',
        buyDate: '',
        netSignNo: ''
      },

      // 收款账户相关（保留原有）
      showAccountSelect: false,
      accountList: [],
      accountListLoading: false,
      accountListFinished: false,
      selectedAccount: {
        accountName: '',
        bankName: '',
        accountNo: ''
      },

      // 提取人相关（替换为新建商品房逻辑）
      extractorList: [],
      currentIdx: 0,
      showRelation: false,
      showIdType: false,
      relationOptions: [
        { name: '本人', value: '本人' }, { name: '配偶', value: '配偶' },
        { name: '父亲', value: '父亲' }, { name: '母亲', value: '母亲' },
        { name: '子', value: '子' }, { name: '女', value: '女' },
        { name: '配偶父亲', value: '配偶父亲' }, { name: '配偶母亲', value: '配偶母亲' }
      ],
      idTypeOptions: [
        { name: '居民身份证', value: '居民身份证' },
        { name: '护照', value: '护照' },
        { name: '军官证', value: '军官证' },
        { name: '户口簿', value: '户口簿' }
      ],

      // 授权相关（新建商品房逻辑）
      showAuthPopup: false,
      currentAuthIdx: null,
      currentAuthExtractor: null,
      authExtractAmount: '',

      // 文件上传（新建商品房逻辑）
      commonFileList: []
    }
  },
  computed: {
    // 提取人相关计算属性（新建商品房逻辑）
    allExtractorsSaved() {
      if (this.extractorList.length === 0) return false
      return this.extractorList.every(item => item.saved)
    },
    hasUnauthorizedExtractors() {
      return this.extractorList.some(item => item.relation !== '本人' && item.saved && !item.authorized)
    }
  },
  methods: {
    // 原有方法完全保留（移除托管账号相关逻辑）
    goBack() {
      if (this.currentStep > 0) {
        this.currentStep--
      } else {
        this.backToHome()
      }
    },
    backToHome() {
      this.currentStep = 1
      this.resetForm()
    },
    resetForm() {
      this.form1 = { buyerName: '', buyerIdCard: '', houseAddress: '' }
      this.form2 = {
        sellerName: '',
        sellerIdCard: '',
        province: '山东省',
        city: '青岛市',
        area: '',
        houseAddress: '',
        houseType: '',
        houseCode: '',
        buildYear: '',
        areaSize: '',
        houseTotalPrice: '',
        downPayment: '',
        buyDate: '',
        netSignNo: ''
      }
      this.extractorList = []
      this.commonFileList = []
      this.selectedAccount = { accountName: '', bankName: '', accountNo: '' }
      this.showResultPage = false
    },
    nextStep() {
      if (this.currentStep === 0) {
        // 步骤1验证
        const { buyerName, buyerIdCard, houseAddress } = this.form1
        if (!buyerName) return Toast('请输入购房人姓名')
        if (!buyerIdCard) return Toast('请输入购房人证件号码')
        if (!houseAddress) return Toast('请输入房屋坐落')

        // 模拟查询房屋信息
        this.mockQueryHouseInfo()
        this.currentStep = 1
      } else if (this.currentStep === 1) {
        // 步骤2：直接进入下一步（无托管账号校验）
        this.loadAccountList()
        this.currentStep = 2
      }
    },
    mockQueryHouseInfo() {
      this.form2 = {
        ...this.form2,
        sellerName: '李四',
        sellerIdCard: '370211********1234',
        area: '市南区',
        houseAddress: this.form1.houseAddress,
        houseType: '商品房',
        houseCode: '370202001********',
        buildYear: '2015年',
        areaSize: '98.5',
        houseTotalPrice: '2680000',
        downPayment: '800000',
        buyDate: '2023-06-18',
        netSignNo: '20230618001'
      }
    },
    canNext() {
      if (this.currentStep === 0) {
        return !!this.form1.buyerName && !!this.form1.buyerIdCard && !!this.form1.houseAddress
      } else if (this.currentStep === 1) {
        // 第二步无校验，直接返回true
        return true
      }
      return true
    },
    loadAccountList() {
      if (this.accountListFinished) return
      this.accountListLoading = true

      // 模拟接口请求
      setTimeout(() => {
        this.accountList = [
          {
            accountName: 'XX花园小区监管账户1',
            bankName: '中国建设银行青岛市南支行',
            accountNo: '37001234567890123456'
          },
          {
            accountName: 'XX花园小区监管账户2',
            bankName: '中国工商银行青岛市南支行',
            accountNo: '16020012345678901234'
          }
        ]
        this.accountListLoading = false
        this.accountListFinished = true

        // 默认选中第一个
        if (this.accountList.length > 0) {
          this.selectedAccount = { ...this.accountList[0] }
        }
      }, 800)
    },
    selectAccount(account) {
      this.selectedAccount = { ...account }
      this.showAccountSelect = false
      Toast.success('收款账户选择成功')
    },
    submitAll() {
      Toast.loading('提交办理中...')
      setTimeout(() => {
        this.showResultPage = true
        Toast.clear()
      }, 1000)
    },
    toQueryRecord() {
      Toast('前往办理记录页面')
    },

    // 提取人相关方法（替换为新建商品房逻辑）
    addExtractor() {
      this.extractorList.push({
        relation: '',
        idType: '',
        name: '',
        idNo: '',
        maxExtractAmount: '256000',
        extractAmount: '',
        saved: false,
        authorized: false
      })
    },
    delExtractor(idx) {
      this.extractorList.splice(idx, 1)
      Toast('已删除该提取人')
    },
    onSelectRelation(item) {
      const idx = this.currentIdx
      this.extractorList[idx].relation = item.name

      if (item.name === '本人') {
        this.extractorList[idx].idType = '居民身份证'
        this.extractorList[idx].name = this.form1.buyerName || ''
        this.extractorList[idx].idNo = this.form1.buyerIdCard || ''
        this.extractorList[idx].maxExtractAmount = '256000'
      }
      this.showRelation = false
    },
    onSelectIdType(item) {
      this.extractorList[this.currentIdx].idType = item.name
      this.showIdType = false
    },
    saveExtractor(idx) {
      const extractor = this.extractorList[idx]
      // 验证
      if (!extractor.relation) return Toast(`第${idx+1}位提取人请选择与购房人关系`)
      if (!extractor.idType && extractor.relation !== '本人') return Toast(`第${idx+1}位提取人请选择证件类型`)
      if (!extractor.name.trim() && extractor.relation !== '本人') return Toast(`第${idx+1}位提取人请填写姓名`)
      if (!extractor.idNo.trim() && extractor.relation !== '本人') return Toast(`第${idx+1}位提取人请填写证件号码`)
      if (extractor.relation === '本人' && !extractor.extractAmount.trim()) return Toast(`第${idx+1}位提取人（本人）请填写提取金额`)

      // 标记为已保存
      this.$set(this.extractorList[idx], 'saved', true)
      Toast(`第${idx+1}位提取人信息保存成功`)
    },
    editExtractor(idx) {
      this.$set(this.extractorList[idx], 'saved', false)
      this.$set(this.extractorList[idx], 'authorized', false)
      Toast(`已允许修改第${idx+1}位提取人信息`)
    },
    authorizeExtractor(idx) {
      this.currentAuthIdx = idx
      this.currentAuthExtractor = this.extractorList[idx]
      this.authExtractAmount = this.extractorList[idx].extractAmount || ''
      this.showAuthPopup = true
    },
    confirmAuth() {
      if (!this.authExtractAmount) return Toast('请输入授权提取金额')
      // 保存授权信息
      this.$set(this.extractorList[this.currentAuthIdx], 'extractAmount', this.authExtractAmount)
      this.$set(this.extractorList[this.currentAuthIdx], 'authorized', true)
      this.showAuthPopup = false
      Toast.success('授权成功')
    },
    beforeRead(file) {
      const suffix = file.name.split('.').pop().toLowerCase()
      const allowTypes = ['jpg', 'jpeg', 'png', 'pdf']
      if (!allowTypes.includes(suffix)) {
        Toast('仅支持上传jpg、jpeg、png、pdf格式的文件')
        return false
      }
      if (file.size > 5 * 1024 * 1024) {
        Toast('文件大小不能超过5MB')
        return false
      }
      return true
    }
  }
}
</script>

<style scoped>
.house-payment-extract-container {
  background-color: #f5f7fa;
  min-height: 100vh;
}

/* 导航栏样式（保留原有） */
.custom-nav-bar {
  background-color: #1677ff !important;
}
.back-btn {
  display: flex;
  align-items: center;
  color: #fff;
  height: 46px;
  cursor: pointer;
}
.back-btn span {
  margin-left: 4px;
}

/* 步骤容器（保留原有） */
.step-container {
  padding: 46px 15px 80px;
}
.step-content {
  width: 100%;
}

/* 提取人步骤样式（新建商品房样式） */
.extract-step {
  padding-bottom: 20px;
}
.account-group {
  margin-bottom: 20px;
}
.add-btn-wrapper {
  margin-bottom: 20px;
}
.add-extractor-btn {
  height: 48px;
  border-radius: 8px;
  font-size: 16px;
  border: 1px solid #1677ff;
  background-color: #f0f7ff;
}
.btn-icon {
  margin-right: 6px;
}
.list-title {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
  padding: 0 5px;
}
.title-text {
  font-size: 18px;
  font-weight: 600;
  color: #333;
}
.count-text {
  font-size: 14px;
  color: #666;
  background-color: #e8f3ff;
  padding: 2px 8px;
  border-radius: 10px;
}
.extractor-list {
  display: flex;
  flex-direction: column;
  gap: 15px;
}
.extractor-card {
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  overflow: hidden;
}
.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 15px;
  border-bottom: 1px solid #f0f0f0;
}
.card-index {
  font-size: 16px;
  font-weight: 600;
  color: #333;
}
.header-buttons {
  display: flex;
  gap: 6px;
  align-items: center;
}
.header-btn {
  padding: 0 8px;
  height: 28px;
  font-size: 12px;
  border-radius: 4px;
}
.card-form {
  margin: 0;
  background: transparent;
  box-shadow: none;
}
.form-item {
  padding: 12px 15px;
  border-bottom: 1px solid #f8f8f8;
  font-size: 15px;
}
.form-item:last-child {
  border-bottom: none;
}
.van-field__label {
  width: 120px;
  color: #666;
}
.empty-state {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 300px;
  margin-top: 20px;
}
.empty-component {
  --empty-image-size: 120px;
  --empty-description-color: #999;
  --empty-description-font-size: 15px;
}
.empty-add-btn {
  margin-top: 15px;
  width: 120px;
}
.global-upload-section {
  margin-top: 20px;
}
.upload-group {
  background: #fff;
  border-radius: 12px;
  padding: 15px;
}
.upload-title {
  font-size: 16px;
  color: #333;
  margin-bottom: 10px;
  display: flex;
  align-items: center;
}
.required {
  color: #f56c6c;
  margin-left: 4px;
}
.upload-tip {
  font-size: 12px;
  color: #999;
  margin-top: 8px;
  line-height: 1.4;
}

/* 底部按钮（保留原有） */
.bottom-btn-bar {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 10px 15px;
  background: #fff;
  box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.05);
  z-index: 101;
}
.submit-btn-bar {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 15px;
  background: #fff;
  box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.05);
  z-index: 101;
}

/* 授权弹窗样式（新建商品房） */
.auth-popup {
  padding: 20px 15px;
  height: 100%;
  box-sizing: border-box;
}
.auth-title {
  font-size: 18px;
  font-weight: 600;
  text-align: center;
  margin-bottom: 20px;
  color: #333;
}
.auth-relation {
  font-size: 14px;
  color: #1677ff;
  text-align: center;
  margin-bottom: 15px;
  line-height: 1.5;
}
.auth-group {
  background: #f7f8fa;
  border-radius: 12px;
  padding: 15px;
}
.auth-tip {
  font-size: 14px;
  color: #666;
  margin: 20px 0;
  line-height: 1.6;
  text-align: center;
}

/* 结果页样式（保留原有） */
.result-page {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: #f5f7fa;
  z-index: 200;
}
.result-content {
  padding-top: 120px;
  text-align: center;
}
.result-title {
  font-size: 24px;
  font-weight: bold;
  color: #333;
  margin-bottom: 10px;
}
.result-desc {
  font-size: 15px;
  color: #666;
  margin-bottom: 20px;
}
.result-link {
  font-size: 15px;
  color: #1677ff;
  cursor: pointer;
}
.result-bottom-bar {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  padding: 15px;
  background: #fff;
  z-index: 201;
}

/* 全局样式（保留原有） */
.van-cell-group {
  margin-bottom: 15px;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
}
.van-field--disabled {
  color: #999;
  background-color: #fafafa;
}
/deep/ .van-nav-bar__title {
  color: #ffffff;
  font-weight: 600;
}
</style>
