<template>
  <ta-modal :footer="null" :get-container="setContainer" :mask-closable="false" :visible="visible" height="550px"
    title="银行账户信息" width="70%" wrap-class-name="publicStyle" @cancel="handleCancel">
    <ta-tabs class="fit" default-active-key="query" type="card" @change="tabChange">
      <!-- 银行账户查询标签页 -->
      <ta-tab-pane key="query" tab="银行账户查询">
        <ta-border-layout :center-cfg="{layoutConStyle:{padding:0}}" :layout="{header:'70px'}" :show-border="false">
          <ta-card slot="header" :body-style="{padding:0}" :bordered="false">
            <ta-form :auto-form-create="(form)=>{this.perBankForm = form}" :form-layout="true" layout="horizontal">
              <ta-form-item :span="16" field-decorator-id="aaf200" label="总行选择">
                <ta-select v-model="selectedBankValue" :show-search="true" allow-clear show-search style="width: 100%"
                  @change="handleChangeBank">
                  <ta-select-option v-for="item in CollectionData('BANKID')" :key="item.value" :value="item.value">
                    {{ item.label }}
                  </ta-select-option>
                </ta-select>
              </ta-form-item>

              <ta-form-item :colon="false" :label-col="{span:10}" :span="8" :wrapper-col="{span:14}" label=" ">
                <ta-button type="primary" @click="handleQuery">
                  查询
                </ta-button>
              </ta-form-item>
            </ta-form>
          </ta-card>
          <ta-card :bordered="false" class="fit">
            <ta-button slot="extra" :disabled="bankCheck" style="color: #FFF;" type="primary" @click="configData">
              确认选择
            </ta-button>
            <ta-big-table ref="tableQuery" :data="dataSourceQuery" :radio-config="{highlight: true,}" border
              height="100%" highlight-hover-row resizable row-id="aae46z" size="small" @radio-change="radioChangeQuery">
              <ta-big-table-column type="radio" width="50" />
              <ta-big-table-column align="center" field="aae044" show-overflow title="银行名称" />
              <ta-big-table-column align="center" field="aae009" show-overflow title="开户户名" />
              <ta-big-table-column align="center" field="aae010" show-overflow title="银行卡号" />
              <template #bottomBar>
                <ta-pagination v-model="pageDown.current" :page-size="pageDown.pageSize" :total="pageDown.total"
                  size="small" style="text-align:right;padding-right: 10px" @change="onChangePageNumber" />
              </template>
            </ta-big-table>
          </ta-card>
        </ta-border-layout>
      </ta-tab-pane>

      <!-- 银行账户添加标签页 -->
      <ta-tab-pane v-if="isShow" key="add" :force-render="true" tab="银行账户添加">
        <ta-border-layout :center-cfg="{layoutConStyle:{padding:0}}" :layout="{right:'400px'}" :show-border="false">
          <ta-border-layout :center-cfg="{layoutConStyle:{padding:0,border:0}}" :layout="{header:'70px'}"
            :show-border="false">
            <ta-card slot="header" :body-style="{padding:0}" :bordered="false">
              <ta-form :auto-form-create="(form)=>{this.perBankForm = form}" :form-layout="true" layout="horizontal">
                <ta-form-item :field-decorator-options="{rules:[{required:true,message:'请选择总行信息！'}]}" :span="16"
                  field-decorator-id="aaf200" label="总行选择">
                  <ta-select v-model="selectedBankValue" :show-search="true" allow-clear show-search style="width: 100%"
                    @change="handleChangeBank">
                    <ta-select-option v-for="item in CollectionData('BANKID')" :key="item.value" :value="item.value">
                      {{ item.label }}
                    </ta-select-option>
                  </ta-select>
                </ta-form-item>

                <ta-form-item :colon="false" :label-col="{span:10}" :span="8" :wrapper-col="{span:14}" label=" ">
                  <ta-button type="primary" @click="queryPerBankBranchList">
                    查询
                  </ta-button>
                </ta-form-item>
              </ta-form>
            </ta-card>
            <ta-card :bordered="false" class="fit" title="支行选择">
              <ta-big-table ref="table" :data="dataSourceAdd" :radio-config="{highlight: true,}" border height="100%"
                highlight-hover-row resizable row-id="aaf002" size="small" @radio-change="radioChangeEvent">
                <ta-big-table-column type="radio" width="50" />
                <ta-big-table-column align="center" field="bankbranchname" show-overflow title="支行名称" width="100%">
                  <template slot="header" slot-scope="{ row }">
                    <span>支行名称：</span>
                    <ta-input v-model="filterName" placeholder="请输入搜索关键字后回车进行搜索"
                      style="display: inline-block;width: 70%;" @keyup.enter="searchEvent" />
                  </template>
                </ta-big-table-column>
                <template #bottomBar>
                  <ta-pagination v-model="pageDown2.current" :page-size="pageDown2.pageSize" :total="pageDown2.total"
                    size="small" style="text-align:right;padding-right: 10px" @change="onChangePageNumber2" />
                </template>
              </ta-big-table>
            </ta-card>
          </ta-border-layout>
          <ta-card slot="right" :bordered="false">
            <ta-form :auto-form-create="(form)=>{this.form = form}" :form-layout="true" layout="horizontal">
              <ta-form-item v-show="false" :span="24" field-decorator-id="aae732" label="用户对象">
                <ta-input />
              </ta-form-item>
              <ta-form-item v-show="false" :span="24" field-decorator-id="aae733" label="用户编号">
                <ta-input />
              </ta-form-item>
              <ta-form-item :span="24" field-decorator-id="aaf200Desc" label="总行名称" required>
                <ta-input :disabled="true" />
              </ta-form-item>
              <ta-form-item :span="24" field-decorator-id="bankbranchname" label="支行名称" required>
                <ta-input :disabled="true" />
              </ta-form-item>
              <ta-form-item :span="24" field-decorator-id="bankbranchid" label="银行联行号" required>
                <ta-input :disabled="true" />
              </ta-form-item>
              <ta-form-item
                :field-decorator-options="{ rules: [{required:true, message: '请输入开户户名' }, {validator: chinese}]}"
                :span="24" field-decorator-id="aae009" label="开户户名">
                <ta-input placeholder="请输入开户户名" />
              </ta-form-item>
              <ta-form-item
                :field-decorator-options="{ rules: [{required:true, message: '请输入银行账号' }, {validator: account}]}"
                :span="24" field-decorator-id="aae010" label="银行账号">
                <ta-input placeholder="请输入银行账号" />
              </ta-form-item>
              <ta-form-item :colon="false" :label-col="{span:10}" :span="24" :wrapper-col="{span:14}" label=" ">
                <ta-button style="margin-right: 20px" type="primary" @click="confirm">
                  确认
                </ta-button>
                <ta-button @click="reset">
                  清空
                </ta-button>
              </ta-form-item>
            </ta-form>
          </ta-card>
        </ta-border-layout>
      </ta-tab-pane>
    </ta-tabs>
  </ta-modal>
</template>

<script>
  export default {
    name: 'bankCard',
    props: {
      visible: {
        type: Boolean,
        /**
         * 组件销毁时清理资源
         */
        beforeDestroy() {
          // 取消未完成的请求
          if (this.currentRequest) {
            this.currentRequest.cancel && this.currentRequest.cancel()
            this.currentRequest = null
          }
          // 清理定时器等
          this.clearTimers && this.clearTimers()
        },
      },
      params: {
        type: Object,
        default: () => ({}),
      },
      isAdd: {
        type: Boolean,
        default: true,
      },
      cardType: {
        type: String,
        default: 'query',
      },
      getPopupPublic: {
        type: String,
        default: 'app',
      },
    },
    data() {
      return {
        perBankForm: {},
        form: {},
        selectedBankValue: '', // 统一管理选中的银行值
        selectedBankLabel: '', // 存储选中的银行label
        filterName: '',
        isShow: true,
        bankCheck: true,

        dataSourceQuery: [],
        dataSourceAdd: [],
        cardType1: 'query',
        currentRequest: null, // 当前请求引用，用于取消操作
        // 分页配置
        pageDown: {
          current: 1,
          pageSize: 10,
          total: 0,
        },
        pageDown2: {
          current: 1,
          pageSize: 10,
          total: 0,
        },
        loading: false, // 加载状态
      }
    },
    watch: {
      visible(val) {
        if (val) {
          this.initData()
        } else {
          this.resetAll()
        }
      },
    },
    mounted() { },
    methods: {
      /**
       * 初始化数据
       */
      initData() {
        this.cardType1 = this.cardType
        if (this.cardType1 === 'query') {
          this.queryPerBankList()
        }
      },
      /**
       * 重置所有状态和数据
       */
      resetAll() {
        this.cardType1 = 'query'
        this.selectedBankValue = ''
        this.selectedBankLabel = ''
        this.bankCheck = true
        this.pageDown.current = 1
        this.pageDown2.current = 1

        // 清空数据源
        this.dataSourceQuery = []
        this.dataSourceAdd = []
        this.filterName = ''

        // 重置表单
        try {
          if (this.form && typeof this.form.resetFields === 'function') {
            this.form.resetFields()
          }
          if (this.perBankForm && typeof this.perBankForm.resetFields === 'function') {
            this.perBankForm.resetFields()
          }
        } catch (error) {
          console.error('表单重置失败:', error)
        }

        // 清除表格选中状态
        if (this.$refs.table && typeof this.$refs.table.clearRadioRow === 'function') {
          this.$refs.table.clearRadioRow()
        }
        if (this.$refs.tableQuery && typeof this.$refs.tableQuery.clearRadioRow === 'function') {
          this.$refs.tableQuery.clearRadioRow()
        }
      },

      /**
       * tab切换
       */
      tabChange(key) {
        this.cardType1 = key
        switch (key) {
          case 'query':
            this.queryPerBankList()
            break
          case 'add':
            this.$nextTick(() => {
              // 可以在这里初始化添加页面的数据
            })
            break
          default:
            break
        }
      },

      /**
       * 总行选择下拉选
       */
      handleChangeBank(value, option) {
        this.selectedBankValue = value
        // 获取选中的银行label
        const allData = this.CollectionData('BANKID')
        const selectedItem = allData.find(item => item.value === value)
        if (selectedItem) {
          this.selectedBankLabel = selectedItem.label
          // 更新表单中的总行名称显示
          this.form.setFieldsValue({
            aaf200Desc: selectedItem.label,
          })
        } else {
          this.selectedBankLabel = ''
          this.form.setFieldsValue({
            aaf200Desc: '',
          })
        }

        // 清空支行相关数据
        this.dataSourceAdd = []
        this.form.setFieldsValue({
          bankbranchname: '',
          bankbranchid: '',
        })
      },

      /**
       * 统一查询处理
       */
      handleQuery() {
        if (this.cardType1 === 'query') {
          this.queryPerBankList()
        } else {
          this.queryPerBankBranchList()
        }
      },
      /**
       * 查询个人银行信息列表
       */
      queryPerBankList() {
        // 取消之前可能未完成的请求
        if (this.currentRequest) {
          this.currentRequest.cancel && this.currentRequest.cancel()
        }

        if (!this.validateUserParams()) return
        this.loading = true

        const userCode = this.getUserCode()
        if (!userCode) {
          this.loading = false
          this.$message.warning('用户编号缺失，无法查询')
          return
        }

        const requestParam = {
          no: '000-0013',
          data: JSON.stringify({
            aae732: this.getUserTypeCode(), // 用户对象
            aae733: userCode, // 用户编号
            aaf200: this.selectedBankValue, // 总行名称
            pageSize: this.pageDown.pageSize,
            pageNum: this.pageDown.current,
          }),
        }
        this.currentRequest = this.Base.sendRequest('', requestParam, (res) => {
          this.loading = false
          if (res && res.serviceSuccess) {
            try {
              const bankArr = res.data.list || []
              if (bankArr.length === 0) {
                this.$message.info('暂无数据！')
                this.dataSourceQuery = []
                this.pageDown.total = 0
              } else {
                this.dataSourceQuery = bankArr
                this.pageDown.total = res.data.total || 0
              }
            } catch (error) {
              console.error('处理银行列表数据出错:', error)
              this.$message.error('数据处理异常，请重试')
            }
          } else {
            this.$message.error(res.msg || '查询失败，请重试')
            this.dataSourceQuery = []
            this.pageDown.total = 0
          }
        }, (error) => {
          this.loading = false
          console.error('银行列表请求错误:', error)
          this.$message.error('网络异常，请稍后重试')
          this.dataSourceQuery = []
          this.pageDown.total = 0
        })
      },

      /**
       * 根据银行类别查询银行支行数据
       */
      queryPerBankBranchList() {
        if (!this.selectedBankValue) {
          this.$message.warning('请先选择总行信息！')
          return
        }

        this.loading = true
        const requestParam = {
          no: '000-0014',
          data: JSON.stringify({
            aaf200: this.selectedBankValue,
            pageSize: this.pageDown2.pageSize,
            pageNum: this.pageDown2.current,
            aae044: this.filterName.trim() || '', // 支行名称搜索
          }),
        }

        this.Base.sendRequest('', requestParam, (res) => {
          this.loading = false
          if (res.serviceSuccess) {
            const bankBranchData = res.data.list || []
            if (bankBranchData.length === 0) {
              this.$message.info('查询成功，暂无数据！')
              this.dataSourceAdd = []
              this.pageDown2.total = 0
            } else {
              this.dataSourceAdd = bankBranchData
              this.pageDown2.total = res.data.total || 0
            }
          } else {
            this.$message.error('查询失败，请重试')
            this.dataSourceAdd = []
            this.pageDown2.total = 0
          }
        })
      },

      /**
       * 选择支行
       */
      radioChangeEvent({
        row
      }) {
        this.form.setFieldsValue({
          bankbranchname: row.bankbranchname,
          bankbranchid: row.bankbranchid,
        })
      },

      /**
       * 分页变化事件
       */
      onChangePageNumber(page) {
        this.pageDown.current = page
        this.queryPerBankList()
      },

      onChangePageNumber2(page) {
        this.pageDown2.current = page
        this.queryPerBankBranchList()
      },

      /**
       * 搜索事件
       */
      searchEvent() {
        this.pageDown2.current = 1 // 搜索时重置到第一页
        this.queryPerBankBranchList()
      },

      /**
       * 验证用户参数
       */
      /**
       * 验证用户参数
       * @returns {boolean} 参数验证结果
       */
      validateUserParams() {
        if (!this.params || !this.params.userType) {
          this.$message.warning('用户类型参数缺失')
          return false
        }
        return true
      },

      /**
       * 获取用户类型代码
       */
      getUserTypeCode() {
        const typeMap = {
          'UT01': '1',
          'UT02': '2',
          'UT03': '3'
        }
        return typeMap[this.params.userType] || '1'
      },

      /**
       * 获取用户编号 - 需要根据实际情况补充逻辑
       */
      /**
       * 获取用户编号
       * @returns {string} 用户编号
       */
      getUserCode() {
        // 避免使用硬编码的默认值，确保组件依赖外部参数
        if (!this.params || !this.params.ext03) {
          console.warn('用户编号参数缺失')
          return ''
        }
        return this.params.ext03
      },

      /**
       * 验证开户户名（只能输入汉字）
       */
      chinese(rule, value, callback) {
        if (!value) {
          callback()
          return
        }
        const result = /^[\u4e00-\u9fa5\s·（）()]+$/.test(value)
        if (!result) {
          callback('开户户名只能输入汉字')
        } else {
          callback()
        }
      },

      /**
       * 验证银行账号（2-40位数字）
       */
      account(rule, value, callback) {
        if (!value) {
          callback()
          return
        }
        const result = /^[0-9]{2,40}$/.test(value)
        if (!result) {
          callback('开户账号只能输入2-40位数字')
        } else {
          callback()
        }
      },
      /**
       * 确定添加银行
       */
      confirm() {
        this.form.validateFields((err, values) => {
          if (err) {
            const firstError = Object.values(err)[0]
            if (firstError && firstError.errors && firstError.errors[0]) {
              this.$message.error(firstError.errors[0].message)
            } else {
              this.$message.error('请完善表单信息')
            }
            return
          }
          const validationResult = this.validateBeforeSubmit(values)
          if (!validationResult.isValid) {
            this.$message.warning(validationResult.message)
            return
          }
          this.submitBankData(values)
        })
      },
      /**
       * 提交前的综合校验
       */
      /**
       * 提交前的综合校验
       * @param {Object} values 表单值
       * @returns {Object} 校验结果
       */
      validateBeforeSubmit(values) {
        // 参数存在性检查
        if (!values) {
          return {
            isValid: false,
            message: '表单数据异常'
          }
        }

        // 校验总行选择
        if (!this.selectedBankValue) {
          return {
            isValid: false,
            message: '请选择总行信息'
          }
        }

        // 校验支行选择
        if (!values.bankbranchname || !values.bankbranchid) {
          return {
            isValid: false,
            message: '请选择支行信息'
          }
        }

        // 校验用户参数
        if (!this.params || !this.params.userType) {
          return {
            isValid: false,
            message: '用户类型参数缺失'
          }
        }

        // 校验关键字段
        const requiredFields = [{
            field: 'aae009',
            name: '开户户名'
          },
          {
            field: 'aae010',
            name: '银行账号'
          }
        ]

        for (let item of requiredFields) {
          if (!values[item.field] || (typeof values[item.field] === 'string' && values[item.field].trim() === '')) {
            return {
              isValid: false,
              message: `${item.name}不能为空`
            }
          }
        }

        // 账号格式二次验证
        if (values.aae010 && !/^[0-9]{2,40}$/.test(values.aae010)) {
          return {
            isValid: false,
            message: '银行账号格式不正确'
          }
        }

        return {
          isValid: true,
          message: '校验通过'
        }
      },
      /**
       * 提交银行数据到接口
       */
      /**
       * 提交银行数据到接口
       * @param {Object} values 表单值
       */
      submitBankData(values) {
        try {
          const userCode = this.getUserCode()

          if (!userCode) {
            this.$message.warning('用户编号缺失，无法提交')
            return
          }

          const submitData = {
            ...values,
            aae732: this.getUserTypeCode(),
            aae733: userCode,
            aae044: values.bankbranchname,
            aae008: values.bankbranchid,
            aae021: '1',
            aaf200: this.selectedBankValue,
          }

          console.log('提交银行数据:', submitData)
          this.loading = true

          const requestParam = {
            no: '000-0015',
            data: JSON.stringify(submitData)
          }

          this.Base.sendRequest('', requestParam, (res) => {
            this.loading = false
            if (res && res.serviceSuccess) {
              if (res.data && res.data.code === '1') {
                this.$message.success(res.data.msg || '添加成功')
                this.$emit('onClose', {
                  ...submitData
                }) // 传递副本避免后续修改影响
                this.reset()
              } else {
                this.$message.error(res.data.msg || '添加失败')
              }
            } else {
              this.$message.error(res.msg || '请求失败，请重试')
            }
          }, (error) => {
            this.loading = false
            console.error('提交银行数据错误:', error)
            this.$message.error('网络异常，请稍后重试')
          })
        } catch (error) {
          this.loading = false
          console.error('处理提交数据时出错:', error)
          this.$message.error('提交数据异常，请重试')
        }
      },
      /**
       * 确定选择已存在的银行账户
       */
      configData() {
        const rows = this.$refs.tableQuery.getRadioRecord()
        if (!rows) {
          this.$message.warning('请选择一条银行账户信息')
          return
        }
        this.$emit('onClose', rows)
      },
      /**
       * 查询表格单选变化
       */
      radioChangeQuery({
        row
      }) {
        this.bankCheck = false
      },
      /**
       * 重置表单
       */
      reset() {
        if (this.$refs.table) {
          this.$refs.table.clearRadioRow()
        }
        this.form.resetFields()
        // 保留总行选择
        if (this.selectedBankValue) {
          this.form.setFieldsValue({
            aaf200Desc: this.selectedBankLabel,
          })
        }
      },
      handleCancel() {
        this.$emit('onClose', null)
      },
      setContainer() {
        return document.getElementById(this.getPopupPublic)
      },
    },
  }
</script>

<style lang="less" scoped type="text/less">
  /deep/ .ant-tabs-top.fit > .ant-tabs-content {
  height: 450px;
}
</style>