<template>
  <div class="rent-extract-container">
    <van-nav-bar
        title="租赁提取"
        fixed
        class="custom-nav-bar"
        v-if="!showSelfPage && !showResultPage"
    >
      <template #left>
        <div class="back-btn" @click="goBack">
          <van-icon name="arrow-left" size="18" color="#fff"/>
          <span>返回</span>
        </div>
      </template>
    </van-nav-bar>

    <!-- 第一页：租赁提取 -->
    <div class="form-content" v-if="!showSelfPage && !showResultPage">
      <van-cell-group title="提取类型">
        <van-field
            v-model="form.extractType"
            label="提取类型"
            placeholder="请选择提取类型"
            readonly
            clickable
            @click="showExtractType = true"
            input-align="right"
        />
      </van-cell-group>

      <van-cell-group title="婚姻状况">
        <van-field
            v-model="form.maritalStatus"
            label="婚姻状况"
            placeholder="请选择婚姻状况"
            readonly
            clickable
            @click="showMaritalStatus = true"
            input-align="right"
        />

        <div v-if="form.maritalStatus === '结婚'">
          <van-field
              v-model="form.spouse.name"
              label="配偶姓名"
              placeholder="请输入配偶姓名"
              input-align="right"
          />
          <van-field
              v-model="form.spouse.idType"
              label="配偶证件类型"
              placeholder="请选择"
              readonly
              clickable
              @click="showSpouseIdType = true"
              input-align="right"
          />
          <van-field
              v-model="form.spouse.idCard"
              label="配偶证件号码"
              placeholder="请输入证件号码"
              input-align="right"
          />
        </div>
      </van-cell-group>
    </div>

    <!-- 第一页底部按钮 -->
    <div class="bottom-btn-bar" v-if="!showSelfPage && !showResultPage">
      <van-button
          type="default"
          size="large"
          @click="showManual = true"
          class="manual-btn custom-btn"
          icon="question-o"
      >操作手册</van-button>
      <van-button
          type="primary"
          size="large"
          @click="submitForm"
          class="next-btn custom-btn"
      >下一步</van-button>
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
          为办理本次租赁提取业务，需协查以下信息：
        </div>
        <div class="check-info-list">
          <div>• 婚姻信息</div>
          <div>• 房屋信息</div>
        </div>
        <div class="qrcode-tip-bottom">
          我们将严格保护您的个人信息安全，仅用于本次业务办理
        </div>
      </div>
    </van-dialog>

    <van-dialog
        v-model="showManual"
        title="租赁提取操作指引"
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
            <p>查看租赁提取详细填写说明</p>
          </div>
          <van-icon name="arrow-right" size="18" class="card-arrow" />
        </div>
        <div class="manual-card" @click="openVideo">
          <div class="card-icon video-icon">
            <van-icon name="play-circle-o" size="24" />
          </div>
          <div class="card-content">
            <h3>操作视频</h3>
            <p>观看租赁提取实操演示视频</p>
          </div>
          <van-icon name="arrow-right" size="18" class="card-arrow" />
        </div>
      </div>
    </van-dialog>

    <van-action-sheet
        v-model="showExtractType"
        :actions="extractTypeList"
        @select="onExtractTypeSelect"
        cancel-text="取消"
        title="选择提取类型"
    />

    <van-action-sheet
        v-model="showMaritalStatus"
        :actions="maritalStatusList"
        @select="onMaritalStatusSelect"
        cancel-text="取消"
        title="选择婚姻状况"
    />

    <van-action-sheet
        v-model="showSpouseIdType"
        :actions="spouseIdTypeList"
        @select="onSpouseIdTypeSelect"
        cancel-text="取消"
        title="选择证件类型"
    />

    <!-- 提取信息页 -->
    <div v-if="showSelfPage && !showResultPage" class="self-extract-page">
      <van-nav-bar
          title="提取信息"
          fixed
          class="custom-nav-bar"
      >
        <template #left>
          <div class="back-btn" @click="backToMainPage">
            <van-icon name="arrow-left" size="18" color="#fff"/>
            <span>返回</span>
          </div>
        </template>
      </van-nav-bar>

      <div class="form-content self-form-content">
        <van-cell-group title="提取身份">
          <van-field
              v-model="extractInfo.identityType"
              label="提取身份"
              placeholder="请选择提取身份"
              readonly
              clickable
              @click="showIdentity = true"
              input-align="right"
          />
        </van-cell-group>

        <van-cell-group title="提取金额信息">
          <van-field
              v-model="extractInfo.maxAmount"
              label="可提取金额"
              readonly
              input-align="right"
          />
          <van-field
              v-model="extractInfo.alreadyAmount"
              label="已提取金额"
              readonly
              input-align="right"
          />
          <van-field
              v-model="extractInfo.currentAmount"
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

        <!-- 银行卡 -->
        <van-cell-group title="银行卡信息">
          <van-field
              v-model="extractInfo.bankCard"
              label="银行卡"
              placeholder="请选择或新增银行卡"
              readonly
              clickable
              @click="showBankCardSelect"
              input-align="right"
          />
        </van-cell-group>

        <!-- 仅新市民需要上传户口本 -->
        <van-cell-group v-if="extractInfo.identityType === '新市民'" title="上传材料">
          <div class="upload-group">
            <div class="upload-item">
              <div class="upload-label">户口本</div>
              <van-uploader
                  v-model="extractInfo.householdBook"
                  :max-count="2"
                  upload-text="上传"
              />
            </div>
          </div>
        </van-cell-group>
      </div>

      <div class="bottom-btn-bar">
        <van-button
            type="default"
            size="large"
            @click="showManual = true"
            class="manual-btn custom-btn"
            icon="question-o"
        >操作手册</van-button>
        <van-button
            type="primary"
            size="large"
            @click="preSubmit"
            class="next-btn custom-btn"
        >提交</van-button>
      </div>

      <van-action-sheet
          v-model="showIdentity"
          :actions="identityList"
          @select="onIdentitySelect"
          cancel-text="取消"
          title="选择提取身份"
      />

      <!-- 银行卡选择 + 新增 -->
      <van-action-sheet
          v-model="showBankActionSheet"
          cancel-text="取消"
          title="选择银行卡"
          :actions="bankCardActions"
          @select="onBankSelect"
      />

      <!-- 新增银行卡弹窗 -->
      <van-dialog
          v-model="showAddBankDialog"
          title="新增银行卡"
          width="85%"
          show-cancel-button
          cancel-text="取消"
          confirm-text="确定"
          @confirm="saveNewBank"
      >
        <van-field
            v-model="newBankName"
            placeholder="请输入银行名称"
            style="margin-top:10px;"
            label="银行"
        />
        <van-field
            v-model="newBankCardNo"
            placeholder="请输入银行卡号"
            style="margin-top:10px;"
            label="卡号"
        />
      </van-dialog>
    </div>

    <!-- 认证方式选择 -->
    <van-action-sheet
        v-model="showAuthActionSheet"
        cancel-text="取消"
        title="请选择认证方式"
        :actions="authActions"
        @select="onAuthSelect"
    />

    <!-- 短信验证码弹窗 -->
    <van-dialog
        v-model="showSmsDialog"
        title="短信验证"
        width="85%"
        show-cancel-button
        cancel-text="取消"
        confirm-text="确定"
        @confirm="confirmSmsAuth"
    >
      <van-field
          v-model="smsCode"
          placeholder="请输入6位验证码"
          maxlength="6"
          style="margin-top:10px;"
      />
      <van-button
          type="primary"
          size="small"
          plain
          @click="sendSmsCode"
          :disabled="countdown > 0"
          style="margin-top:10px;"
      >
        {{ countdown > 0 ? `${countdown}秒后重发` : '发送验证码' }}
      </van-button>
    </van-dialog>

    <!-- 办结结果页面 -->
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
          您的租赁提取已提交成功，我们将尽快处理，请耐心等待
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
                <span>{{ extractInfo.currentAmount || '0' }}元</span>
              </div>
            </van-cell>
            <van-cell>
              <div style="display:flex; justify-content:space-between; width:100%">
                <span>银行卡：</span>
                <span>{{ extractInfo.bankCard || '未选择' }}</span>
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
  </div>
</template>

<script>
import Vue from 'vue'
import {
  NavBar, CellGroup, Cell, Field, Uploader,
  ActionSheet, Button, Toast, Dialog, Icon
} from 'vant'

Vue.use(NavBar)
Vue.use(CellGroup)
Vue.use(Cell)
Vue.use(Field)
Vue.use(Uploader)
Vue.use(ActionSheet)
Vue.use(Button)
Vue.use(Toast)
Vue.use(Dialog)
Vue.use(Icon)

export default {
  name: 'RentExtract',
  data() {
    return {
      form: {
        extractType: '租赁自住住房',
        maritalStatus: '',
        spouse: { name: '', idType: '', idCard: '' }
      },
      extractTypeList: [
        { name: '租赁保障性住房', value: 'guaranteed' },
        { name: '租赁自住住房', value: 'self-occupied' },
        { name: '困难家庭租房提取', value: 'difficult-family' }
      ],
      maritalStatusList: [
        { name: '未婚', value: 'unmarried' },
        { name: '结婚', value: 'married' },
        { name: '离婚', value: 'divorced' },
        { name: '丧偶', value: 'widowed' }
      ],
      spouseIdTypeList: [
        { name: '身份证', value: 'idCard' },
        { name: '护照', value: 'passport' },
        { name: '军官证', value: 'military' }
      ],
      identityList: [
        { name: '普通', value: '1' },
        { name: '青年人', value: '2' },
        { name: '新市民', value: '3' }
      ],
      bankCardList: [
        { name: '工商银行(6222****1234)', value: 'ICBC-1234' },
        { name: '建设银行(6227****5678)', value: 'CCB-5678' }
      ],
      authActions: [
        { name: '短信认证', value: 'sms' },
        { name: '人脸认证', value: 'face' }
      ],
      showExtractType: false,
      showMaritalStatus: false,
      showManual: false,
      showSpouseIdType: false,
      showIdentity: false,
      showSelfPage: false,
      showResultPage: false,

      // 授权弹窗
      showAuthQrCodeDialog: false,
      userName: '张三',
      desensitizeName: '',

      showBankActionSheet: false,
      showAddBankDialog: false,
      newBankName: '',
      newBankCardNo: '',

      showAuthActionSheet: false,
      showSmsDialog: false,
      smsCode: '',
      countdown: 0,

      extractInfo: {
        identityType: '普通',
        maxAmount: '18000元',
        alreadyAmount: '0元',
        currentAmount: '',
        bankCard: '',
        householdBook: []
      }
    }
  },
  created() {
    this.desensitizeName = this.getDesensitizeName(this.userName)
  },
  computed: {
    bankCardActions() {
      return [
        ...this.bankCardList,
        { name: '➕ 新增银行卡', value: 'add' }
      ]
    }
  },
  methods: {
    // 姓名脱敏
    getDesensitizeName(name) {
      if (!name) return '未知用户'
      if (name.length === 1) return name
      if (name.length === 2) return name.charAt(0) + '*'
      return name.charAt(0) + '*' + name.slice(-1)
    },
    // 关闭授权
    onAuthCancel() {
      this.showAuthQrCodeDialog = false
    },
    // 确认授权 → 下一步
    onAuthConfirm() {
      this.showAuthQrCodeDialog = false
      if (this.form.extractType === '困难家庭租房提取') {
        return Toast.fail('你不符合办理要求')
      }
      if (this.form.extractType === '租赁自住住房') {
        this.openSelfPage()
        return
      }
      Toast.success('授权成功，进入下一步')
    },
    goBack() {
      Toast.info('返回')
    },
    backToMainPage() {
      this.showSelfPage = false
    },
    backToHome() {
      this.showResultPage = false
      this.showSelfPage = false
      this.form = {
        extractType: '租赁自住住房',
        maritalStatus: '',
        spouse: {name: '', idType: '', idCard: ''}
      }
      this.extractInfo = {
        identityType: '普通',
        maxAmount: '18000元',
        alreadyAmount: '0元',
        currentAmount: '',
        bankCard: '',
        householdBook: []
      }
    },
    toRecordPage() {
      Toast('跳转到办理记录')
    },
    onExtractTypeSelect(item) {
      this.form.extractType = item.name
      this.showExtractType = false
    },
    onMaritalStatusSelect(item) {
      this.form.maritalStatus = item.name
      this.showMaritalStatus = false
      if (item.name !== '结婚') this.form.spouse = {name: '', idType: '', idCard: ''}
    },
    onSpouseIdTypeSelect(item) {
      this.form.spouse.idType = item.name
      this.showSpouseIdType = false
    },
    onIdentitySelect(item) {
      this.extractInfo.identityType = item.name
      if (item.name === '普通' || item.name === '青年人') {
        this.extractInfo.maxAmount = '18000元'
      } else if (item.name === '新市民') {
        this.extractInfo.maxAmount = '24000元'
      }
      this.showIdentity = false
    },
    showBankCardSelect() {
      this.showBankActionSheet = true
    },
    onBankSelect(item) {
      this.showBankActionSheet = false
      if (item.value === 'add') {
        this.showAddBankDialog = true
        this.newBankName = ''
        this.newBankCardNo = ''
        return
      }
      this.extractInfo.bankCard = item.name
    },
    saveNewBank() {
      if (!this.newBankName || !this.newBankCardNo) {
        return Toast.fail('请填写完整信息')
      }
      const bankName = `${this.newBankName}(${this.newBankCardNo.slice(-4)})`
      this.bankCardList.push({
        name: bankName,
        value: this.newBankCardNo
      })
      this.extractInfo.bankCard = bankName
      Toast.success('新增成功')
    },
    validateForm() {
      if (!this.form.extractType) return Toast.fail('请选择提取类型'), false
      if (!this.form.maritalStatus) return Toast.fail('请选择婚姻状况'), false
      if (this.form.maritalStatus === '结婚') {
        if (!this.form.spouse.name) return Toast.fail('请输入配偶姓名'), false
        if (!this.form.spouse.idType) return Toast.fail('请选择配偶证件类型'), false
        if (!this.form.spouse.idCard) return Toast.fail('请输入配偶证件号码'), false
      }
      return true
    },
    submitForm() {
      const valid = this.validateForm()
      if (!valid) return
      // 弹出协查授权框
      this.showAuthQrCodeDialog = true
    },
    openSelfPage() {
      this.extractInfo = {
        identityType: '普通',
        maxAmount: '18000元',
        alreadyAmount: '0元',
        currentAmount: '',
        bankCard: '',
        householdBook: []
      }
      this.showSelfPage = true
    },
    preSubmit() {
      if (!this.extractInfo.identityType) return Toast.fail('请选择提取身份')
      if (!this.extractInfo.currentAmount) return Toast.fail('请输入本次提取金额')
      if (!this.extractInfo.bankCard) return Toast.fail('请选择或新增银行卡')
      // 仅新市民需要校验户口本上传
      if (this.extractInfo.identityType === '新市民' && this.extractInfo.householdBook.length === 0) {
        return Toast.fail('请上传户口本')
      }
      const max = parseInt(this.extractInfo.maxAmount)
      const current = parseInt(this.extractInfo.currentAmount)
      if (current > max) return Toast.fail(`不能超过${this.extractInfo.maxAmount}`)

      this.showAuthActionSheet = true
    },
    onAuthSelect(item) {
      this.showAuthActionSheet = false
      if (item.value === 'sms') {
        this.showSmsDialog = true
        this.smsCode = ''
      }
      if (item.value === 'face') {
        Toast.loading('正在调起人脸认证...')
        setTimeout(() => {
          Toast.success('人脸认证成功')
          this.showResultPage = true
        }, 1500)
      }
    },
    sendSmsCode() {
      this.countdown = 60
      const timer = setInterval(() => {
        this.countdown--
        if (this.countdown <= 0) clearInterval(timer)
      }, 1000)
      Toast.success('验证码已发送')
    },
    confirmSmsAuth() {
      if (!this.smsCode || this.smsCode.length !== 6) {
        return Toast.fail('请输入6位验证码')
      }
      Toast.success('短信认证成功')
      this.showResultPage = true
    },
    openDoc() {
      Toast.success('打开文档')
      this.showManual = false
    },
    openVideo() {
      Toast.success('打开视频')
      this.showManual = false
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

/deep/ .van-nav-bar__title {
  color: #ffffff;
}

/deep/ .van-nav-bar__left {
  padding: 0;
}
</style>
