<template>
  <div class="rent-extract-container">
    <!-- 第一步：不动产信息协查 -->
    <div class="dead-first-page" v-if="step === 1">
      <van-nav-bar title="新建商品房首付款提取" fixed class="custom-nav-bar">
        <template #left>
          <div class="back-btn" @click="backToHome">
            <van-icon name="arrow-left" size="18" color="#fff"/>
            <span>首页</span>
          </div>
        </template>
      </van-nav-bar>

      <div class="form-content" style="padding-top: 46px;">
        <!-- 购房人信息 -->
        <van-cell-group title="购房人信息">
          <van-field
              v-model="buyerForm.name"
              label="购房人姓名"
              placeholder="请输入购房人姓名"
              required
              input-align="right"
          />
          <van-field
              v-model="buyerForm.idCard"
              label="证件号码"
              placeholder="请输入购房人证件号码"
              required
              input-align="right"
          />
          <van-field
              v-model="buyerForm.houseAddressKey"
              label="房屋坐落(路名)"
              placeholder="请输入房屋坐落(路名)"
              required
              input-align="right"
          />
        </van-cell-group>

        <!-- 房屋信息 -->
        <van-cell-group title="房屋信息" v-if="houseInfoLoaded">
          <van-field v-model="houseInfo.projectName" label="项目名称" readonly input-align="right"/>
          <van-field v-model="houseInfo.building" label="楼栋" readonly input-align="right"/>
          <van-field v-model="houseInfo.unit" label="单元" readonly input-align="right"/>
          <van-field v-model="houseInfo.floor" label="楼层" readonly input-align="right"/>
          <van-field v-model="houseInfo.roomNo" label="房间号" readonly input-align="right"/>
          <van-field v-model="houseInfo.payProtocolNo" label="首付款支付协议编号" readonly input-align="right"/>
          <van-field v-model="houseInfo.province" label="省" readonly input-align="right"/>
          <van-field v-model="houseInfo.city" label="市" readonly input-align="right"/>
          <van-field v-model="houseInfo.area" label="区" placeholder="请选择/录入区" required input-align="right"/>
          <van-field v-model="houseInfo.houseAddress" label="房屋坐落" placeholder="请输入详细房屋坐落" required input-align="right"/>
          <van-field v-model="houseInfo.housePropertyText" label="房屋性质" placeholder="请选择房屋性质（非必填）" readonly clickable input-align="right" @click="showHouseProperty = true"/>
          <van-field v-model="houseInfo.realEstateHouseNo" label="不动产房屋编号" placeholder="系统自动填充（非必填）" readonly input-align="right"/>
          <van-field v-model="houseInfo.realEstateUnitNo" label="不动产单元号" placeholder="请输入不动产单元号（非必填）" input-align="right"/>
          <van-field v-model="houseInfo.buildYearMonth" label="建成年月" placeholder="请输入建成年月（非必填）" input-align="right"/>
          <van-field v-model="houseInfo.buildArea" label="建筑面积" placeholder="请输入建筑面积（㎡）" required input-align="right"/>
          <van-field v-model="houseInfo.totalPrice" label="房屋总价" placeholder="请输入房屋总价（元）" required input-align="right"/>
          <van-field v-model="houseInfo.downPayment" label="首付金额" placeholder="请输入首付金额（元）" required input-align="right"/>
          <van-field v-model="houseInfo.buyDate" label="购房日期" placeholder="请选择购房日期" required input-align="right"/>
          <van-field v-model="houseInfo.networkContractNo" label="网签合同编号" placeholder="请输入网签合同编号（非必填）" input-align="right"/>
          <van-field v-model="houseInfo.remark" label="备注" placeholder="请输入备注信息（非必填）" type="textarea" rows="2" input-align="left"/>
          <van-field v-model="houseInfo.isSecurityHouse" label="是否为保障性住房" readonly clickable input-align="right" @click="showIsSecurityHouse = true"/>
        </van-cell-group>

        <!-- 项目信息选择（级联版：项目+楼栋+单元+房号） -->
        <van-cell-group title="项目信息选择" v-if="houseInfoLoaded">
          <van-field
              v-model="projectQuery.name"
              label="项目名称"
              placeholder="请输入项目名称模糊查询"
              required
              input-align="right"
              @change="queryProjectList"
              :readonly="projectLoading"
          />
          <van-field
              label="楼栋-单元-房号"
              placeholder="请点击选择"
              readonly
              clickable
              input-align="right"
              :value="cascaderText"
              @click="showCascader = true"
              :disabled="!selectedProject.id"
          >
            <template #right-icon>
              <van-icon name="arrow-down" size="16" color="#999" />
            </template>
          </van-field>

          <!-- 级联选择器弹窗 -->
          <van-popup
              v-model="showCascader"
              position="bottom"
              :style="{ height: '50%' }"
              round
          >
            <van-cascader
                v-model="cascaderValue"
                :options="cascaderOptions"
                @change="onCascaderChange"
                @close="showCascader = false"
                @finish="onCascaderFinish"
                title="选择房屋信息"
            />
          </van-popup>
        </van-cell-group>
      </div>

      <div class="bottom-btn-bar">
        <van-button type="primary" block size="large" color="#1677ff" @click="goToStep3FromHouse" :loading="queryLoading">
          下一步
        </van-button>
      </div>
    </div>

    <!-- 第二步：提取人信息列表（共用一套档案） -->
    <div v-if="step === 2" class="extract-page">
      <van-nav-bar title="提取人信息" fixed class="custom-nav-bar">
        <template #left>
          <div class="back-btn" @click="goToStep1">
            <van-icon name="arrow-left" size="18" color="#fff"/>
            <span>返回</span>
          </div>
        </template>
      </van-nav-bar>

      <div class="extractor-content">
        <!-- 收款账户选择（所有提取人公共） -->
        <van-cell-group title="收款账户信息" class="account-group" v-if="houseInfoLoaded">
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

        <!-- 新增提取人按钮 -->
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

        <!-- 提取人列表 -->
        <div class="extractor-list">
          <div
              v-for="(item, idx) in extractorList"
              :key="idx"
              class="extractor-card"
          >
            <!-- 提取人卡片头部 -->
            <div class="card-header">
              <span class="card-index">提取人 {{ idx + 1 }}</span>

              <!-- 右侧按钮组：保存/修改 + 授权 + 删除 -->
              <div class="header-buttons">
                <!-- 未保存 → 显示保存按钮 -->
                <van-button
                    v-if="!item.saved"
                    type="primary"
                    size="mini"
                    @click="saveExtractor(idx)"
                    class="header-btn save-btn"
                >
                  保存
                </van-button>

                <!-- 已保存 → 显示修改按钮 -->
                <van-button
                    v-else
                    type="default"
                    size="mini"
                    @click="editExtractor(idx)"
                    class="header-btn edit-btn"
                >
                  修改
                </van-button>

                <!-- 授权按钮：非本人 + 已保存 -->
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

              <!-- 仅本人显示最大可提取金额 -->
              <van-field
                  v-if="item.relation === '本人'"
                  v-model="item.maxExtractAmount"
                  label="最大可提取金额"
                  placeholder="系统自动计算"
                  readonly
                  class="form-item"
              />

              <!-- 授权完成后显示授权金额 -->
              <van-field
                  v-if="item.authorized && item.relation !== '本人'"
                  v-model="item.extractAmount"
                  label="授权提取金额"
                  readonly
                  class="form-item"
              />

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

        <!-- 全局共用档案材料 -->
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

      <!-- 提交按钮 -->
      <div class="submit-btn-bar">
        <van-button
            type="primary"
            block
            size="large"
            color="#1677ff"
            @click="toSubmitExtract"
            :disabled="!extractorList.length || !allExtractorsSaved || hasUnauthorizedExtractors || commonFileList.length === 0 || !selectedAccount.accountNo"
            class="submit-btn"
        >
          提交办理
        </van-button>
      </div>
    </div>

    <!-- 第三步：办理结果 -->
    <div v-if="step === 3" class="result-page">
      <van-nav-bar title="办理结果" fixed class="custom-nav-bar" />
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

    <!-- 收款账户选择弹窗 -->
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
            v-for="(account, index) in accountList"
            :key="index"
            :title="account.accountName"
            :label="`${account.bankName} | ${account.accountNo}`"
            @click="selectAccount(account)"
        >
          <template #right-icon>
            <van-icon
                name="checked"
                color="#1989fa"
                v-if="selectedAccount.accountNo === account.accountNo"
            />
          </template>
        </van-cell>
      </van-list>
    </van-dialog>

    <!-- 各类弹窗 -->
    <van-dialog v-model="showHouseSelect" title="选择房屋信息" width="90%">
      <van-list v-model="houseListLoading" :finished="houseListFinished" finished-text="没有更多了">
        <van-cell v-for="item in houseList" :key="item.id" :title="`${item.projectName}(${item.roomNo})`" :label="`${item.houseAddress}`" @click="selectHouse(item)"/>
      </van-list>
    </van-dialog>

    <van-dialog v-model="showProjectSelect" title="选择项目" width="90%">
      <van-list v-model="loading" :finished="finished" finished-text="没有更多了" @load="loadMoreProjects">
        <van-cell v-for="item in projectList" :key="item.id" :title="item.name" @click="selectProject(item)"/>
      </van-list>
    </van-dialog>

    <van-action-sheet v-model="showHouseProperty" :actions="housePropertyList" @select="onHousePropertySelect" cancel-text="取消" title="选择房屋性质"/>
    <van-action-sheet v-model="showIsSecurityHouse" :actions="yesNoList" @select="onIsSecurityHouseSelect" cancel-text="取消" title="是否为保障性住房"/>
    <van-action-sheet v-model="showRelation" :actions="relationOptions" @select="onSelectRelation" cancel-text="取消" title="选择与购房人关系"/>
    <van-action-sheet v-model="showIdType" :actions="idTypeOptions" @select="onSelectIdType" cancel-text="取消" title="选择证件类型"/>

    <!-- 授权确认弹窗 -->
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
            <!-- 正确授权方向：提取人 → 授权给 → 购房人（本人） -->
            <div class="auth-relation">
              本人（{{ currentAuthExtractor.name }}）自愿授权<br/>
              授权给购房人：{{ buyerForm.name || '未填写' }}
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
            <!-- 授权弹窗中仍显示最大可提取金额（供授权人参考） -->
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
            <van-button type="primary" block @click="confirmAuth">
              确认授权
            </van-button>
          </div>
        </div>
      </div>
    </van-popup>
  </div>
</template>

<script>
import Vue from 'vue'
import {
  NavBar, Icon, CellGroup, Cell, Field, Uploader,
  ActionSheet, Button, Toast, Dialog, RadioGroup, Radio,
  List, Popup, DatetimePicker, Empty, Tag, Cascader
} from 'vant'

// 注册级联选择器
Vue.use(NavBar).use(Icon).use(CellGroup).use(Cell).use(Field)
    .use(Uploader).use(ActionSheet).use(Button).use(Toast).use(Dialog)
    .use(RadioGroup).use(Radio).use(List).use(Popup).use(DatetimePicker)
    .use(Empty).use(Tag).use(Cascader)

export default {
  data() {
    return {
      step: 1,
      queryLoading: false,
      houseInfoLoaded: false,

      buyerForm: {name: '', idCard: '', houseAddressKey: ''},

      houseInfo: {
        projectName: '', building: '', unit: '', floor: '', roomNo: '', payProtocolNo: '',
        province: '山东省', city: '青岛市', area: '', houseAddress: '',
        houseProperty: '', housePropertyText: '', realEstateHouseNo: '', realEstateUnitNo: '',
        buildYearMonth: '', buildArea: '', totalPrice: '', downPayment: '', buyDate: '',
        networkContractNo: '', remark: '', isSecurityHouse: '否'
      },

      // 收款账户相关
      showAccountSelect: false,
      accountList: [],
      accountListLoading: false,
      accountListFinished: false,
      selectedAccount: {
        accountName: '', // 账户名称（楼盘监管账户名称）
        bankName: '',    // 开户银行
        accountNo: ''    // 银行账号
      },

      // 级联选择相关
      showCascader: false,
      cascaderValue: [],
      cascaderText: '',
      cascaderOptions: [],

      housePropertyList: [
        {name: '01-商品房', value: '01'}, {name: '02-保障性住房', value: '02'},
        {name: '03-自建房', value: '03'}, {name: '04-两限房', value: '04'},
        {name: '05-集资房', value: '05'}, {name: '06-危改房', value: '06'},
        {name: '07-经济适用房', value: '07'}, {name: '08-房改房', value: '08'},
        {name: '99-其他', value: '99'}
      ],
      yesNoList: [{name: '是', value: '是'}, {name: '否', value: '否'}],
      relationOptions: [
        {name: '本人', value: '本人'}, {name: '配偶', value: '配偶'},
        {name: '父亲', value: '父亲'}, {name: '母亲', value: '母亲'},
        {name: '子', value: '子'}, {name: '女', value: '女'},
        {name: '配偶父亲', value: '配偶父亲'}, {name: '配偶母亲', value: '配偶母亲'}
      ],
      idTypeOptions: [
        {name: '居民身份证', value: '居民身份证'},
        {name: '护照', value: '护照'},
        {name: '军官证', value: '军官证'},
        {name: '户口簿', value: '户口簿'}
      ],

      showHouseProperty: false, showIsSecurityHouse: false,
      showHouseSelect: false, showProjectSelect: false,
      showRelation: false, showIdType: false,

      houseList: [], houseListLoading: false, houseListFinished: false,
      projectQuery: {name: ''}, projectLoading: false, projectList: [],
      loading: false, finished: false, selectedProject: {id: '', name: ''},
      selectedRoom: {id: '', name: '', payProtocolNo: '', buildArea: '', totalPrice: '', downPayment: ''},

      extractorList: [],
      currentIdx: 0,

      commonFileList: [],

      // 授权弹窗
      showAuthPopup: false,
      currentAuthIdx: null,
      currentAuthExtractor: null,
      authExtractAmount: ''
    }
  },
  computed: {
    allExtractorsSaved() {
      if (this.extractorList.length === 0) return false
      return this.extractorList.every(item => item.saved)
    },
    hasUnauthorizedExtractors() {
      return this.extractorList.some(item => item.relation !== '本人' && item.saved && !item.authorized)
    }
  },
  methods: {
    backToHome() {
      this.step = 1
      this.resetForm()
    },
    goToStep1() {
      this.step = 1
    },
    resetForm() {
      this.buyerForm = {name: '', idCard: '', houseAddressKey: ''}
      this.houseInfoLoaded = false
      this.houseInfo = {
        projectName: '', building: '', unit: '', floor: '', roomNo: '', payProtocolNo: '',
        province: '山东省', city: '青岛市', area: '', houseAddress: '',
        houseProperty: '', housePropertyText: '', realEstateHouseNo: '', realEstateUnitNo: '',
        buildYearMonth: '', buildArea: '', totalPrice: '', downPayment: '', buyDate: '',
        networkContractNo: '', remark: '', isSecurityHouse: '否'
      }
      // 重置收款账户
      this.selectedAccount = {accountName: '', bankName: '', accountNo: ''}
      this.accountList = []
      this.accountListFinished = false
      // 重置级联选择
      this.cascaderValue = []
      this.cascaderText = ''
      this.cascaderOptions = []

      this.extractorList = []
      this.commonFileList = []
      this.projectQuery = {name: ''}
      this.selectedProject = {id: '', name: ''}
      this.selectedRoom = {id: '', name: '', payProtocolNo: '', buildArea: '', totalPrice: '', downPayment: ''}
    },

    async goToStep3FromHouse() {
      const {name, idCard, houseAddressKey} = this.buyerForm
      if (!name.trim()) {
        Toast('请输入购房人姓名')
        return
      }
      if (!idCard.trim()) {
        Toast('请输入购房人证件号码')
        return
      }
      if (!houseAddressKey.trim()) {
        Toast('请输入房屋坐落(路名)')
        return
      }

      if (this.houseInfoLoaded) {
        // 进入提取人页面时加载收款账户列表
        this.loadAccountList()
        this.step = 2
        return
      }

      this.queryLoading = true
      Toast.loading('查询网签合同信息中...')

      try {
        await new Promise(resolve => setTimeout(resolve, 1200))
        const mockHouseList = [
          {
            id: '1',
            projectName: 'XX花园小区', building: '1栋', unit: '2单元', floor: '10层', roomNo: '1001',
            payProtocolNo: 'XY20250317001', province: '山东省', city: '青岛市', area: '市南区',
            houseAddress: '市南区XX路123号', houseProperty: '01', housePropertyText: '01-商品房',
            realEstateHouseNo: 'BD20230001', realEstateUnitNo: 'DY20230001', buildYearMonth: '2023-05',
            buildArea: '125.6', totalPrice: '2560000', downPayment: '768000', buyDate: '2024-01-15',
            networkContractNo: 'WQ20240115007', remark: '', isSecurityHouse: '否'
          },
          {
            id: '2',
            projectName: 'XX花园小区', building: '2栋', unit: '3单元', floor: '8层', roomNo: '802',
            payProtocolNo: 'XY20250317002', province: '山东省', city: '青岛市', area: '市南区',
            houseAddress: '市南区XX路125号', houseProperty: '01', housePropertyText: '01-商品房',
            realEstateHouseNo: 'BD20230002', realEstateUnitNo: 'DY20230002', buildYearMonth: '2023-06',
            buildArea: '95.8', totalPrice: '1980000', downPayment: '594000', buyDate: '2024-02-20',
            networkContractNo: 'WQ20240220008', remark: '', isSecurityHouse: '否'
          }
        ]

        this.houseList = mockHouseList
        this.queryLoading = false
        Toast.clear()

        if (mockHouseList.length === 0) {
          Toast('未查询到相关房屋信息')
        } else if (mockHouseList.length === 1) {
          this.selectHouse(mockHouseList[0])
          // 加载收款账户列表
          this.loadAccountList()
          this.step = 2
        } else {
          this.showHouseSelect = true
        }
      } catch (error) {
        this.queryLoading = false
        Toast.error('网签合同信息查询失败：' + (error.message || '请稍后重试'))
        console.error('查询失败：', error)
      }
    },

    selectHouse(item) {
      this.houseInfo = {...this.houseInfo, ...item}
      this.houseInfoLoaded = true
      this.showHouseSelect = false
      Toast.success('已选择房屋信息')
    },

    async queryProjectList() {
      if (!this.projectQuery.name.trim()) {
        Toast('请输入项目名称')
        return
      }

      this.projectLoading = true
      Toast.loading('查询项目信息中...')

      try {
        await new Promise(resolve => setTimeout(resolve, 800))
        const mockProjects = [
          {id: '1', name: 'XX花园小区'},
          {id: '2', name: 'XX花园二期'},
          {id: '3', name: 'XX花园三期'}
        ]
        const filteredProjects = mockProjects.filter(item =>
            item.name.includes(this.projectQuery.name.trim())
        )

        this.projectList = filteredProjects
        this.projectLoading = false
        Toast.clear()

        if (filteredProjects.length === 0) {
          Toast('未查询到相关项目信息')
        } else if (filteredProjects.length === 1) {
          this.selectProject(filteredProjects[0])
        } else {
          this.showProjectSelect = true
        }
      } catch (error) {
        this.projectLoading = false
        Toast.error('项目查询失败：' + (error.message || '请稍后重试'))
      }
    },

    loadMoreProjects() {
      setTimeout(() => {
        this.loading = false
        this.finished = true
      }, 500)
    },

    // 选择项目时加载级联选项
    selectProject(item) {
      this.selectedProject = item
      this.houseInfo.projectName = item.name
      this.showProjectSelect = false
      this.loadCascaderOptions(item.id)
    },

    // 加载级联选项：楼栋 → 单元 → 房号
    async loadCascaderOptions(projectId) {
      try {
        this.cascaderOptions = []
        // 模拟接口请求延迟
        await new Promise(resolve => setTimeout(resolve, 500))

        // 模拟从后端获取的楼盘楼栋/单元/房号数据
        this.cascaderOptions = [
          {
            text: '1栋',
            value: 'building_1',
            children: [
              {
                text: '1单元',
                value: 'unit_1_1',
                children: [
                  {text: '101室', value: 'room_1_1_101', floor: '1层'},
                  {text: '102室', value: 'room_1_1_102', floor: '1层'},
                  {text: '201室', value: 'room_1_1_201', floor: '2层'},
                  {text: '202室', value: 'room_1_1_202', floor: '2层'},
                  {text: '1001室', value: 'room_1_1_1001', floor: '10层'},
                  {text: '1002室', value: 'room_1_1_1002', floor: '10层'}
                ]
              },
              {
                text: '2单元',
                value: 'unit_1_2',
                children: [
                  {text: '101室', value: 'room_1_2_101', floor: '1层'},
                  {text: '102室', value: 'room_1_2_102', floor: '1层'},
                  {text: '1001室', value: 'room_1_2_1001', floor: '10层'}
                ]
              }
            ]
          },
          {
            text: '2栋',
            value: 'building_2',
            children: [
              {
                text: '1单元',
                value: 'unit_2_1',
                children: [
                  {text: '801室', value: 'room_2_1_801', floor: '8层'},
                  {text: '802室', value: 'room_2_1_802', floor: '8层'}
                ]
              },
              {
                text: '2单元',
                value: 'unit_2_2',
                children: [
                  {text: '901室', value: 'room_2_2_901', floor: '9层'},
                  {text: '902室', value: 'room_2_2_902', floor: '9层'}
                ]
              }
            ]
          },
          {
            text: '3栋',
            value: 'building_3',
            children: [
              {
                text: '1单元',
                value: 'unit_3_1',
                children: [
                  {text: '501室', value: 'room_3_1_501', floor: '5层'},
                  {text: '502室', value: 'room_3_1_502', floor: '5层'}
                ]
              }
            ]
          }
        ]

        Toast.success('楼栋信息加载完成')
      } catch (error) {
        Toast.error('加载楼栋单元房号失败，请稍后重试')
        console.error('级联数据加载失败：', error)
      }
    },

    // 级联选择变化时
    onCascaderChange({value, selectedOptions}) {
      this.cascaderValue = value
    },

    // 级联选择完成确认
    onCascaderFinish({value, selectedOptions}) {
      this.showCascader = false

      // 拼接显示文本（楼栋 · 单元 · 房号）
      this.cascaderText = selectedOptions.map(o => o.text).join(' · ')

      // 解析选择结果
      const building = selectedOptions[0]?.text || ''
      const unit = selectedOptions[1]?.text || ''
      const room = selectedOptions[2]?.text || ''
      const floor = selectedOptions[2]?.floor || ''
      const roomValue = selectedOptions[2]?.value || ''

      // 模拟生成房间相关信息
      const roomInfoMap = {
        'room_1_1_1001': {
          payProtocolNo: 'XY20250317001',
          buildArea: '125.6',
          totalPrice: '2560000',
          downPayment: '768000'
        },
        'room_1_1_1002': {
          payProtocolNo: 'XY20250317002',
          buildArea: '89.5',
          totalPrice: '1800000',
          downPayment: '540000'
        },
        'room_2_1_801': {
          payProtocolNo: 'XY20250317003',
          buildArea: '95.8',
          totalPrice: '1980000',
          downPayment: '594000'
        },
        'room_2_1_802': {
          payProtocolNo: 'XY20250317004',
          buildArea: '110.2',
          totalPrice: '2200000',
          downPayment: '660000'
        }
      }

      const roomInfo = roomInfoMap[roomValue] || {
        payProtocolNo: `XY${Date.now()}`,
        buildArea: '100.0',
        totalPrice: '2000000',
        downPayment: '600000'
      }

      // 更新选中房间信息
      this.selectedRoom = {
        id: roomValue,
        name: room,
        payProtocolNo: roomInfo.payProtocolNo,
        buildArea: roomInfo.buildArea,
        totalPrice: roomInfo.totalPrice,
        downPayment: roomInfo.downPayment
      }

      // 回填到房屋信息表单
      this.houseInfo.building = building
      this.houseInfo.unit = unit
      this.houseInfo.floor = floor
      this.houseInfo.roomNo = room
      this.houseInfo.payProtocolNo = roomInfo.payProtocolNo
      this.houseInfo.buildArea = roomInfo.buildArea
      this.houseInfo.totalPrice = roomInfo.totalPrice
      this.houseInfo.downPayment = roomInfo.downPayment

      Toast.success(`已选择：${this.cascaderText}`)
    },

    onHousePropertySelect(item) {
      this.houseInfo.houseProperty = item.value
      this.houseInfo.housePropertyText = item.name
      this.showHouseProperty = false
    },

    onIsSecurityHouseSelect(item) {
      this.houseInfo.isSecurityHouse = item.name
      this.showIsSecurityHouse = false
    },

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
        this.extractorList[idx].name = this.buyerForm.name || ''
        this.extractorList[idx].idNo = this.buyerForm.idCard || ''
        this.extractorList[idx].maxExtractAmount = '256000'
        this.extractorList[idx].extractAmount = ''
      } else {
        this.extractorList[idx].maxExtractAmount = '256000'
        this.extractorList[idx].extractAmount = ''
      }
      this.showRelation = false
    },
    onSelectIdType(item) {
      this.extractorList[this.currentIdx].idType = item.name
      this.showIdType = false
    },

    saveExtractor(idx) {
      const extractor = this.extractorList[idx]
      if (!extractor.relation) {
        Toast(`第${idx + 1}位提取人请选择与购房人关系`)
        return
      }
      if (!extractor.idType) {
        Toast(`第${idx + 1}位提取人请选择证件类型`)
        return
      }
      if (!extractor.name.trim()) {
        Toast(`第${idx + 1}位提取人请填写姓名`)
        return
      }
      if (!extractor.idNo.trim()) {
        Toast(`第${idx + 1}位提取人请填写证件号码`)
        return
      }
      if (extractor.relation === '本人' && !extractor.extractAmount.trim()) {
        Toast(`第${idx + 1}位提取人（本人）请填写提取金额`)
        return
      }

      this.$set(this.extractorList[idx], 'saved', true)
      Toast(`第${idx + 1}位提取人信息保存成功`)
    },

    editExtractor(idx) {
      this.$set(this.extractorList[idx], 'saved', false)
      this.$set(this.extractorList[idx], 'authorized', false)
      Toast(`已允许修改第${idx + 1}位提取人信息`)
    },

    // 打开授权弹窗
    authorizeExtractor(idx) {
      this.currentAuthIdx = idx
      this.currentAuthExtractor = this.extractorList[idx]
      this.authExtractAmount = this.extractorList[idx].extractAmount || ''
      this.showAuthPopup = true
    },

    // 确认授权
    confirmAuth() {
      const idx = this.currentAuthIdx
      if (!this.authExtractAmount) {
        Toast('请输入授权提取金额')
        return
      }
      // 保存授权金额与状态
      this.$set(this.extractorList[idx], 'extractAmount', this.authExtractAmount)
      this.$set(this.extractorList[idx], 'authorized', true)
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
      const maxSize = 5 * 1024 * 1024
      if (file.size > maxSize) {
        Toast('文件大小不能超过5MB')
        return false
      }
      return true
    },

    toSubmitExtract() {
      // 校验收款账户是否选择
      if (!this.selectedAccount.accountNo) {
        Toast('请先选择收款账户')
        return
      }

      Toast.loading('提交办理中...')
      setTimeout(() => {
        this.step = 3
        Toast.clear()
      }, 800)
    },

    toQueryRecord() {
      Toast('前往办理记录页面')
    },

    // 加载收款账户列表（模拟楼盘备案监管账户）
    async loadAccountList() {
      if (this.accountListFinished) return

      this.accountListLoading = true
      try {
        await new Promise(resolve => setTimeout(resolve, 800))
        // 模拟从后端获取的楼盘备案监管账户列表
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
          },
          {
            accountName: 'XX花园小区监管账户3',
            bankName: '中国银行青岛市南支行',
            accountNo: '45635123456789012345'
          }
        ]

        this.accountListLoading = false
        this.accountListFinished = true

        // 默认选中第一个账户（反显）
        if (this.accountList.length > 0) {
          this.selectedAccount = {...this.accountList[0]}
        }
      } catch (error) {
        this.accountListLoading = false
        Toast.error('加载收款账户失败，请稍后重试')
        console.error('加载账户失败：', error)
      }
    },

    // 选择收款账户
    selectAccount(account) {
      this.selectedAccount = {...account}
      this.showAccountSelect = false
      Toast.success('收款账户选择成功')
    }
  }
}
</script>

<style scoped>
.rent-extract-container {
  background-color: #f5f7fa;
  min-height: 100vh;
}

.form-content {
  padding: 46px 15px 80px;
}

.bottom-btn-bar {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 10px 15px;
  background: #fff;
  z-index: 101;
  box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.05);
}

.custom-nav-bar {
  background-color: #1677ff !important;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.08);
}

.back-btn {
  display: flex;
  align-items: center;
  color: #fff;
  height: 46px;
}

.van-cell-group {
  margin-bottom: 15px;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
}

/* 收款账户样式 */
.account-group {
  margin-bottom: 20px;
}

.extract-page {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: #f5f7fa;
  z-index: 100;
  display: flex;
  flex-direction: column;
}

.extractor-content {
  flex: 1;
  overflow-y: auto;
  padding: 60px 15px 80px;
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

.submit-btn {
  height: 50px;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 600;
}

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

.van-dialog__content {
  padding: 10px;
  max-height: 400px;
  overflow-y: auto;
}

/* 授权弹窗样式 */
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

.auth-btn-wrapper {
  margin-top: 20px;
}

/* 级联选择器样式优化 */
/deep/ .van-cascader__title {
  font-weight: 600;
  color: #333;
}

/deep/ .van-cascader__option {
  font-size: 15px;
}

/deep/ .van-nav-bar__title {
  color: #ffffff;
  font-weight: 600;
}

/deep/ .van-nav-bar__left {
  color: #ffffff;
}

/deep/ .van-field--disabled {
  color: #999;
  background-color: #fafafa;
}
</style>
