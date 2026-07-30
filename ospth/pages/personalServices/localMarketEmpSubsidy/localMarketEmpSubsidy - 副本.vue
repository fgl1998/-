<template>
  <div class="localMarketEmpSubsidy">
    <div class="main">
      <div class="title">区内市场稳定就业补贴奖励（拉萨）</div>
      <div class="content-box">
        <div class="btn-box">
          <ta-button type="primary" @click="handleApply" :disabled="isDisabled">
            <ta-icon type="plus" />
            申请
          </ta-button>
          <ta-button @click="handleReset">
            <ta-icon type="sync" />
            重置本页
          </ta-button>
        </div>
        <!-- 补贴人员信息 -->
        <div class="section-title">补贴人员信息</div>
        <ta-form :autoFormCreate="(form) => { this.infoForm = form }" :formLayout="true" label-width="120px"
          layout="horizontal">
          <div class="form-row">
            <ta-form-item fieldDecoratorId="serial" label="主键" v-show="false" />
            <ta-form-item fieldDecoratorId="yae421" label="审核状态" v-show="false" collection-type="yae421" />
            <ta-form-item fieldDecoratorId="yac002" label="公民身份证号码"
              :fieldDecoratorOptions="{ rules: [{ idCard: '2', message: '输入的身份证号不合法' }] }"
              :require="{ message: '请输入身份证号!' }">
              <ta-input disabled />
            </ta-form-item>
            <ta-form-item fieldDecoratorId="aac003" label="姓名" require>
              <ta-input disabled />
            </ta-form-item>
            <ta-form-item fieldDecoratorId="aac004" label="性别" require>
              <ta-select disabled collection-type="SEX" />
            </ta-form-item>
          </div>
          <div class="form-row">
            <ta-form-item fieldDecoratorId="aac005" label="民族" require>
              <ta-select disabled collection-type="AAC005" />
            </ta-form-item>
            <ta-form-item fieldDecoratorId="aac180" label="毕业院校_码值" v-show="false" />
            <ta-form-item fieldDecoratorId="yau002" label="毕业院校" require>
              <ta-input disabled />
            </ta-form-item>
            <ta-form-item fieldDecoratorId="aac183" label="专业_码值" v-show="false" />
            <ta-form-item fieldDecoratorId="aac184" label="专业名称" require>
              <ta-input disabled />
            </ta-form-item>
          </div>
          <div class="form-row">
            <ta-form-item fieldDecoratorId="aac181" label="毕业时间" require>
              <ta-date-picker disabled />
            </ta-form-item>
            <ta-form-item fieldDecoratorId="gkhj" label="高考时户籍所在县" require label-width="140px">
              <ta-select :options="areaOptions" :disabled="isDisabled" />
            </ta-form-item>
          </div>
          <!-- 就业信息 -->
          <!-- <div class="section-title">就业信息</div> -->
         <!-- <div class="section-header">
            <ta-button type="primary" @click="openAddPage" :disabled="isDisabled">新 增</ta-button>
          </div>
          <ta-big-table :data="tableData" border="inner" max-height="400px">
            <ta-big-table-column field="jzdw" title="就职单位"></ta-big-table-column>
            <ta-big-table-column field="zhiwu" title="职位"></ta-big-table-column>
            <ta-big-table-column field="jyd" title="就业地"></ta-big-table-column>
            <ta-big-table-column field="jyd_code" title="就业地代码" v-if="false" />
            <ta-big-table-column field="htqdsj" show-overflow title="劳动合同签订时间" />
            <ta-big-table-column field="htqx" show-overflow title="劳动合同期限" />
            <ta-big-table-column field="sbs" show-overflow title="社保缴纳开始时间" />
            <ta-big-table-column field="sbe" show-overflow title="社保缴纳结束时间" />
            <ta-big-table-column field="operate" title="操作" width="50">
              <template #default="{ row }">
                <ta-icon type="form" style="margin-right: 10px; cursor: pointer;" @click="handleEdit(row)" />
                <ta-icon type="delete" style="cursor: pointer;" @click="handleDelete(row)" />
              </template>
            </ta-big-table-column>
            <template #bottomBar>
              <ta-pagination ref="gridPager" v-model="current" :data-source.sync="tableData" :page-size.sync="pageSize"
                style="text-align: right" url="" />
            </template>
          </ta-big-table> -->
          <!-- 银行账户信息 -->
          <div class="section-title">银行账户信息</div>
          <div class="form-row">
            <ta-form-item fieldDecoratorId="yhk031" label="银行类别" require>
              <ta-input @click="visibleBank = true" collection-type="BANKID" v-if="!isDisabled" />
              <ta-select v-else collection-type="BANKID" :disabled="isDisabled" />
            </ta-form-item>
            <ta-form-item fieldDecoratorId="yhk032" label="开户银行" require>
              <ta-input :disabled="isDisabled" />
            </ta-form-item>
            <ta-form-item fieldDecoratorId="yhk033" label="银行联行号" require>
              <ta-input :disabled="isDisabled" />
            </ta-form-item>
          </div>
          <div class="form-row">
            <ta-form-item fieldDecoratorId="yhkh" label="银行卡号" require>
              <ta-input :disabled="isDisabled" />
            </ta-form-item>
            <ta-form-item fieldDecoratorId="yhzh" label="银行账户名称" require>
              <ta-input :disabled="isDisabled" />
            </ta-form-item>
          </div>
          <!-- 附件信息 -->
          <div class="section-title">附件信息</div>
          <div class="attachment-table">
            <!-- 材料只读 -->
            <materialUploadTable v-if="isDisabled || yda031Value !== ''" ref="materialUploadTable" yda020="493"
              :yda031="yda031Value" :visit="isDisabled" />
            <!-- 新增上传 -->
            <materialUploadTable v-else ref="materialUploadTable" yda020="493" />
          </div>
        </ta-form>
      </div>
    </div>
    <bankCard :allow-add="true" :params="paramsBankCard" :visible="visibleBank" @onClose="closeBank"></bankCard>
    <!-- 新增就业信息弹窗 -->
    <ta-modal v-model="visibleAdd" :title="isEditMode ? '编辑就业信息' : '新增就业信息'" @close="handleCloseModal"
      style="width: 1000px;">
      <ta-form :autoFormCreate="(form) => { this.addForm = form }" :formLayout="true" label-width="140px"
        layout="horizontal">
        <ta-form-item fieldDecoratorId="jyd" label="就业地" :require="{ message: '请输入就业地!' }">
          <ta-input v-model="formData.jyd" @click="showAreaModal = true" />
        </ta-form-item>
        <ta-form-item fieldDecoratorId="jzdw" label="就职单位" :require="{ message: '请输入就职单位!' }">
          <ta-input v-model="formData.jzdw" />
        </ta-form-item>
        <ta-form-item fieldDecoratorId="zhiwu" label="职务" :require="{ message: '请输入职务!' }">
          <ta-input v-model="formData.zhiwu" />
        </ta-form-item>
        <ta-form-item fieldDecoratorId="htqdsj" label="劳动合同签订时间" :require="{ message: '请选择劳动合同签订时间!' }">
          <ta-date-picker v-model="formData.htqdsj" format="YYYY-MM-DD" @change="handleDateChangeHtqdsj" />
        </ta-form-item>
        <ta-form-item fieldDecoratorId="htqx" label="劳动合同期限" :require="{ message: '请输入劳动合同期限!' }"
          v-if="formData.htqdsj">
          <ta-date-picker v-model="formData.htqx" format="YYYY-MM-DD" @change="handleDateChangeHtqx" />
        </ta-form-item>
        <ta-form-item fieldDecoratorId="sbs" label="社保缴纳开始时间" :require="{ message: '请选择社保缴纳开始时间!' }">
          <ta-date-picker v-model="formData.sbs" format="YYYY-MM-DD" @change="handleDateChangeSbs" />
        </ta-form-item>
        <ta-form-item fieldDecoratorId="sbe" label="社保缴纳结束时间" v-if="formData.sbs">
          <ta-date-picker v-model="formData.sbe" format="YYYY-MM-DD" @change="handleDateChangeSbe" />
        </ta-form-item>
      </ta-form>
      <template #footer>
        <ta-button @click="handleCloseModal">关闭</ta-button>
        <ta-button type="primary" @click="handleAddSubmit">{{ isEditMode ? '保存' : '新增' }}</ta-button>
      </template>
    </ta-modal>
    <area-selector-modal :visible="showAreaModal" :level="3" @confirm="handleAreaConfirm" :field-name="currentAreaField"
      @close="showAreaModal = false" />
  </div>
</template>

<script>
  import moment from 'moment'
  import materialUploadTable from 'common/components/materialUploadTable.vue'
  import bankCard from 'common/components/bankCard.vue'
  import areaSelectorModal from 'common/components/areaSelectorModal.vue'
  export default {
    name: '',
    data() {
      return {
        infoForm: {},
        paramsBankCard: {},
        currentAreaField: 'jyd',
        tableData: [],
        current: 1,
        pageSize: 10,
        isDisabled: false,
        visibleBank: false,
        visibleCancel: false,
        showAreaModal: false,
        areaOptions: [], // 高考户籍地选项数据
        visibleAdd: false, // 新增就业信息弹窗可见状态
        isEditMode: false, // 是否处于编辑模式
        currentEditIndex: -1, // 当前编辑的行索引
        addForm: {}, // 新增就业信息表单实例
        formData: { // 新增就业信息表单数据
          jyd: '', // 就业地
          jyd_code: '',
          jzdw: '', // 就职单位
          zhiwu: '', // 职务
          htqdsj: '', // 劳动合同签订时间
          htqx: '', // 劳动合同期限
          sbs: '', // 社保缴纳开始时间
          sbe: '', // 社保缴纳结束时间
        },
        yhk031CollectionDataValue: '',
        yda031Value: '',
        userInfo: {} // 用户信息
      }
    },
    components: {
      materialUploadTable,
      bankCard,
      areaSelectorModal
    },
    created() {
      try {
        const info = Base.getUserInfo()
        if (info && info.naturalBo) {
          this.userInfo = info.naturalBo
          this.userInfo.userType = 'UT01'
          this.paramsBankCard = this.userInfo
          this.queryPageList()
          // 加载高考户籍地选项数据
          this.queryAreaData()
        } else {
          this.$message.error('获取用户信息失败，请重新登录')
        }
      } catch (error) {
        console.error('获取用户信息异常:', error)
        this.$message.error('系统异常，请稍后重试')
      }

    },
    watch: {
      // 监听yda031Value的变化，当值改变时更新材料组件
      yda031Value(newValue) {
        this.$nextTick(() => {
          if (this.$refs.materialUploadTable) {
            // 移除对newValue的判断，确保即使值为空也能更新组件
            this.$refs.materialUploadTable.yda031 = newValue || '';
            // 调用材料组件的getMaterailList方法重新加载数据
            if (this.$refs.materialUploadTable.getMaterailList) {
              this.$refs.materialUploadTable.getMaterailList();
            }
          }
        });
      }
    },
    mounted() {},
    methods: {
      //查询并校验区内市场稳定就业奖励申请
      queryPageList() {
        const param = {
          no: '602-0001',
          data: JSON.stringify({
            loginId: this.userInfo.certNo,
          }),
        }
        this.Base.sendRequest('', param, (res) => {
          if (res.serviceSuccess) {
            // 统一设置只读/新增模式
            const isDisabledType = res.data.applied;
            this.isDisabled = isDisabledType === 'true' ? true : false;
            // 无论code是'1'还是'0'，只要有数据就设置表单和材料参数
            if (res.data.data) {
              const arr = res.data.data;
              this.infoForm.setFieldsValue(arr);
              this.tableData = arr.jobs;
              this.yda031Value = arr.serial;
              // 立即尝试更新材料组件，不依赖watch
              this.$nextTick(() => {
                if (this.$refs.materialUploadTable) {
                  this.$refs.materialUploadTable.yda031 = arr.serial || '';
                  // 调用材料组件的getMaterailList方法重新加载数据
                  if (this.$refs.materialUploadTable.getMaterailList) {
                    this.$refs.materialUploadTable.getMaterailList();
                  }
                }
              });
            }
            // 只有在code为'1'时调用init方法
            if (res.data.code === '1') {
              this.init();
            }
          }
        })
      },
      //获取基础信息并校验
      init() {
        const param = {
          no: '602-0003',
          data: JSON.stringify({
            yac002: this.userInfo.certNo,
          }),
        }
        this.Base.sendRequest('', param, (res) => {
          if (res.serviceSuccess && res.data.code === '0') {
            this.$message.error(res.data.msg || '查询失败');
            this.isDisabled = res.data.sq === 'disabled' ? true : false
          }
          if (res.serviceSuccess && res.data.code === '1') {
            const info = res.data.data
            // 将日期字符串转换为日期格式
            if (info.aac181) {
              const date = new Date(info.aac181);
              // 格式化为YYYY-MM-DD格式
              const formattedDate =
                `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
              info.aac181 = formattedDate
            }
            this.infoForm.setFieldsValue(info)
          }

        })
      },
      closeBank(data) {
        this.visibleBank = false
        const allData = this.CollectionData('BANKID')
        if (data !== null) {
          const selectedItem = allData.find(item => item.value === data.aaf200)
          this.yhk031CollectionDataValue = data.aaf200
          let values = {
            'yhk031': selectedItem.label, //银行类别
            'yhk032': data.aae044, //开户银行
            'yhk033': data.aae008, //银行联行号
            'yhkh': data.aae010, //银行卡号
            'yhzh': data.aae009, //银行账户名称
          }
          this.infoForm.setFieldsValue(values);
        }
      },
      //高考户籍地
      queryAreaData() {
        const param = {
          no: '602-0002',
          data: JSON.stringify({
            yac002: this.userInfo.certNo,
          }),
        }
        this.Base.sendRequest('', param, (res) => {
          if (res.serviceSuccess && res.data.code === '1') {
            const areaData = res.data.list || []
            // 将区域数据格式化为选择器需要的格式 (value 和 label)
            this.areaOptions = areaData.map(item => ({
              value: item.id, // 使用id作为value
              label: item.name // 使用name作为显示文本
            }))
          }
        })
      },
      handleAreaConfirm(data) {
        const fieldName = data.fieldName || 'jyd'
        // 保存选中的地址信息
        this.selectedAreaCodes = data.codes
        this.selectedAreaText = data.names.join('')
        // 构建表单数据对象
        const formData = {}
        // 根据字段名设置对应的表单值
        formData[fieldName] = this.selectedAreaText
        this.formData.jyd_code = this.selectedAreaCodes[this.selectedAreaCodes.length - 1]
        // 设置代码字段
        this.addForm.setFieldsValue(formData)
        this.formData.jyd = formData.jyd
        // 关闭弹窗
        this.showAreaModal = false
      },
      handleDateChangeHtqdsj(date, dateString) {
        // 劳动合同签订时间不能超过当前时间
        const now = new Date();
        const currentDate =
          `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
        if (dateString > currentDate) {
          this.$message.error('劳动合同签订时间不能超过当前时间');
          this.formData.htqdsj = '';
          return;
        }
        this.formData.htqdsj = dateString;
        // 如果合同期限早于签订时间，清空合同期限
        if (this.formData.htqx && this.formData.htqx < dateString) {
          this.$message.warning('合同期限早于签订时间，已清空合同期限');
          this.formData.htqx = '';
        }
      },
      handleDateChangeHtqx(date, dateString) {
        // 合同期限不得早于合同签订时间
        if (this.formData.htqdsj && dateString < this.formData.htqdsj) {
          this.$message.error('合同期限不得早于合同签订时间');
          this.formData.htqx = '';
          return;
        }
        this.formData.htqx = dateString;
      },
      handleDateChangeSbs(date, dateString) {
        // 社保缴纳开始时间不能超过当前时间
        const now = new Date();
        const currentDate =
          `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;

        if (dateString > currentDate) {
          this.$message.error('社保缴纳开始时间不能超过当前时间');
          return;
        }
        this.formData.sbs = dateString;
        // 如果社保结束时间早于开始时间，清空社保结束时间
        if (this.formData.sbe && this.formData.sbe < dateString) {
          this.$message.warning('社保缴纳结束时间早于开始时间，已清空社保结束时间');
          this.formData.sbe = '';
        }
      },
      handleDateChangeSbe(date, dateString) {
        // 社保缴纳结束时间不得早于开始时间
        if (this.formData.sbs && dateString < this.formData.sbs) {
          this.$message.error('社保缴纳结束时间不得早于开始时间');
          return;
        }

        this.formData.sbe = dateString;
      },

      handleApply() {
        // 申请按钮点击事件
        this.infoForm.validateFields((errors, values) => {

          if (errors) {
            return
          }
          // 获取表单数据
          const formData = this.infoForm.getFieldsValue()
          formData.aac181 = moment(formData.aac181).format('YYYYMMDD')
          formData.yhk031 = this.yhk031CollectionDataValue
          formData.aae017 = formData.gkhj
          if (!formData) {
            this.$message.error('表单数据获取失败')
            return
          }
          if (!this.tableData || this.tableData.length === 0) {
            this.$message.error('请添加就业信息')
            return
          }
          // 安全地获取上传的文件列表
          let fileList = []
          if (this.$refs.materialUploadTable && this.$refs.materialUploadTable.check) {
            fileList = this.$refs.materialUploadTable.check() || []
          }
          // 安全地检查文件列表
          if (fileList && fileList.length > 0 && fileList[0] && fileList[0].files && fileList[0].files.length ===
            0) {
            this.$message.error('请上传必要的材料');
            return;
          }
          const param = {
            no: '602-0004',
            data: JSON.stringify({
              ...formData,
              ext: JSON.stringify({
                attachments: fileList,
                jobs: this.tableData
              }),
            })
          }
          this.Base.sendRequest('', param, (res) => {
            if (res.serviceSuccess && res.data.code === '1') {
              this.$message.success(res.data.msg || '保存成功')
              this.queryPageList()
            } else {
              this.$message.error(res.data.msg || '保存失败')
            }
          }, (error) => {
            // 添加失败回调，处理网络错误等情况
            console.error('接口调用失败:', error)
            this.$message.error('网络异常，请稍后重试')
          })

        });

      },
      handleReset() {
        this.queryPageList()
        // 重置表单数据
        this.resetFormData();
      },
      //新增就业信息
      openAddPage() {
        // 重置表单数据
        this.resetFormData();
        // 打开弹窗
        this.visibleAdd = true;
      },
      // 重置表单数据
      resetFormData() {
        this.formData = {
          jyd: '',
          jzdw: '',
          zhiwu: '',
          htqdsj: '',
          htqx: '',
          sbs: '',
          sbe: ''
        };
        if (this.addForm && this.addForm.resetFields) {
          this.addForm.resetFields();
        }
        // 重置编辑模式
        this.isEditMode = false;
        this.currentEditIndex = -1;
      },
      // 关闭弹窗
      handleCloseModal() {
        this.visibleAdd = false;
        this.resetFormData();
      },
      // 编辑就业信息
      handleEdit(row) {
        // 查找当前行在表格数据中的索引
        const index = this.tableData.findIndex(item =>
          item.jyd === row.jyd &&
          item.jzdw === row.jzdw &&
          item.htqdsj === row.htqdsj
        );

        if (index !== -1) {
          // 设置编辑模式
          this.isEditMode = true;
          this.currentEditIndex = index;

          // 先打开弹窗，确保DOM已经渲染
          this.visibleAdd = true;

          // 使用$nextTick确保表单组件已经渲染完成后再设置数据
          this.$nextTick(() => {
            // 填充表单数据
            this.formData = {
              jyd: row.jyd || '',
              jzdw: row.jzdw || '',
              zhiwu: row.zhiwu || '',
              htqdsj: row.htqdsj || '',
              htqx: row.htqx || '',
              sbs: row.sbs || '',
              sbe: row.sbe || ''
            };
            // 如果表单实例存在，手动设置表单值
            if (this.addForm && this.addForm.setFieldsValue) {
              this.addForm.setFieldsValue(this.formData);
            }
          });
        }
      },
      // 删除就业信息
      handleDelete(row) {
        // 显示确认对话框
        this.$confirm({
          title: '确认删除',
          content: '确定要删除这条就业信息吗？',
          onOk: () => {
            // 查找当前行在表格数据中的索引
            const index = this.tableData.findIndex(item =>
              item.jyd === row.jyd &&
              item.jzdw === row.jzdw &&
              item.htqdsj === row.htqdsj
            );

            if (index !== -1) {
              // 从表格数据中删除
              this.tableData.splice(index, 1);
              // 显示成功提示
              this.$message.success('删除成功');
            }
          }
        });
      },
      // 提交新增就业信息
      handleAddSubmit() {
        // 验证表单
        this.addForm.validateFields((errors, values) => {
          if (!errors) {
            // 准备提交数据（只在前端处理）
            const submitData = {
              ...this.formData,
              loginId: this.userInfo.certNo || ''
            };

            if (this.isEditMode) {
              // 编辑模式 - 更新现有记录
              if (this.currentEditIndex !== -1) {
                // 创建更新后的记录对象
                const updatedRecord = {
                  jyd: submitData.jyd,
                  jzdw: submitData.jzdw,
                  zhiwu: submitData.zhiwu,
                  htqdsj: submitData.htqdsj,
                  htqx: submitData.htqx,
                  sbs: submitData.sbs,
                  sbe: submitData.sbe || '持续缴纳中'
                };

                // 更新表格数据
                this.tableData[this.currentEditIndex] = updatedRecord;

                // 显示成功提示
                this.$message.success('保存成功');
              }
            } else {
              // 新增模式 - 添加新记录
              this.addNewRecordToTable(submitData);
              // 显示成功提示
              this.$message.success('新增成功');
            }

            // 关闭弹窗
            this.visibleAdd = false;

            // 重置表单
            this.resetFormData();
          }
        });
      },
      // 将新增记录添加到表格
      addNewRecordToTable(newRecord) {
        // 创建新记录对象，与表格字段匹配
        const tableRecord = {
          jyd: newRecord.jyd,
          jyd_code: newRecord.jyd_code,
          jzdw: newRecord.jzdw,
          zhiwu: newRecord.zhiwu,
          htqdsj: newRecord.htqdsj,
          htqx: newRecord.htqx,
          sbs: newRecord.sbs,
          sbe: newRecord.sbe || '持续缴纳中'
        };
        // 添加到表格数据中
        this.tableData.push(tableRecord);
        // 这里也可以选择重新调用查询接口获取最新数据
        // this.queryPageList();
      },
    },

  }
</script>

<style scoped lang="less">
  .localMarketEmpSubsidy {
    width: 1200px;
    margin: 0 auto;
    padding: 20px;
  }

  .title {
    color: #2f54eb;
    font-size: 24px;
    font-weight: bold;
    margin-bottom: 20px;
  }

  .content-box {
    margin-top: 20px;
  }

  /* 按钮盒样式 */
  .btn-box {
    display: flex;
    justify-content: flex-end;
    margin-bottom: 15px;

    .ta-button {
      margin-left: 10px;
    }
  }

  /* 区块标题样式 - 蓝色背景 */
  .section-title {
    font-size: 16px;
    font-weight: bold;
    color: #333;
    padding: 10px 0;
    background-color: #afd2f0;
    border-bottom: 2px solid #e8e8e8;
    margin-bottom: 20px;
  }

  /* 区块头部（如新增按钮区域） */
  .section-header {
    display: flex;
    justify-content: flex-end;
    margin-bottom: 10px;
    margin-top: -60px;
    margin-right: 5px;
  }

  /* 表单行布局 - 三列 */
  .form-row {
    display: flex;
    margin-bottom: 15px;
    padding-right: 10px;

    .ta-form-item {
      margin-right: 30px;
      margin-bottom: 0;
      flex: 0 0 auto;
    }
  }

  /* 统一输入框和下拉框宽度 */
  .ta-form-item .ta-input,
  .ta-form-item .ta-select,
  .ta-form-item .ta-date-picker {
    width: 220px;
  }

  /* 表格样式调整 */
  .ta-big-table {
    margin-bottom: 20px;
    border: 1px solid #e8e8e8;
    border-radius: 0 0 3px 3px;
  }

  /* 附件表格容器 */
  .attachment-table {
    border: 1px solid #e8e8e8;
    border-radius: 0 0 3px 3px;
    padding: 10px;
  }

  /* 调整必填项星号位置 */
  .ta-form-item[require] .ta-form-item-label::before {
    content: '*';
    color: #ff4d4f;
    margin-right: 4px;
  }

  /* 调整表单标签宽度 */
  .ta-form-item-label {
    text-align: right;
  }

  /* 分页器样式 */
  .ta-pagination {
    margin-top: 10px;
  }
</style>