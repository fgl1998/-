<template>
  <div class="appraisalSubsidyAdd">
    <div class="modal-btn">
      <ta-button type="primary" @click="handleConfirm">确认</ta-button>
      <ta-button @click="handleReset">重置</ta-button>
      <ta-button @click="$router.go(-1)">返回</ta-button>
    </div>
    <div class="content-box">
      <ta-form :autoFormCreate="(form) => { this.queryForm = form}" :formLayout="true" label-width="150px"
        layout="inline">
        <div class="sub-title">信息填写</div>
        <div class="form-box">
          <ta-form-item fieldDecoratorId="ysv010" label="主键流水号" v-show="false" />
          <ta-form-item fieldDecoratorId="aac001" label="人员编号" v-show="false" />
          <ta-form-item :fieldDecoratorOptions="{ rules: [{ idCard: '2', message: '输入的身份证号不合法' }] }"
            :require="{ message: '请输入身份证号!' }" fieldDecoratorId="ysv021" label="身份证号">
            <ta-input :disabled="isDisabledYsv021" @mouseleave="fnCheck" @keyup.enter="fnCheck" v-model="idCard" />
          </ta-form-item>
          <ta-form-item :require="{ message: '请输入姓名!' }" fieldDecoratorId="ysv011" label="姓名">
            <ta-input :disabled="isDisabled" />
          </ta-form-item>
          <ta-form-item :require="{ message: '请选择性别!' }" fieldDecoratorId="ysv012" label="性别">
            <ta-select :disabled="isDisabled" collection-type="sex" style="width: 178px" />
          </ta-form-item>
          <ta-form-item :require="{ message: '请选择出生年月!' }" fieldDecoratorId="ysv013" label="出生年月">
            <ta-month-picker :disabled="isDisabled" :key="2" />
          </ta-form-item>
          <ta-form-item :require="{ message: '请选择享受补贴人员范围!' }" fieldDecoratorId="ysv022" label="享受补贴人员范围">
            <ta-select :disabled="isDisabled" collection-type="YHC462" style="width: 178px" />
          </ta-form-item>
          <ta-form-item :require="{ message: '请输入证书编号!' }" fieldDecoratorId="ysv028" label="证书编号">
            <ta-input :disabled="isDisabled" @mouseleave="fnChange" @keyup.enter="fnChange" v-model="ysv028Value" />
          </ta-form-item>
          <ta-form-item :require="{ message: '请选择工种类型!' }" fieldDecoratorId="ysv023" label="工种类型">
            <ta-select :disabled="isDisabled" style="width: 178px">
              <ta-select-option v-for="item in ysv023ListOptions" :key="item.id" :value="item.id">{{ item.name }}
              </ta-select-option>
            </ta-select>
          </ta-form-item>
          <ta-form-item :require="{ message: '请选择工种等级!' }" fieldDecoratorId="ysv024" label="工种等级">
            <ta-select :disabled="isDisabled" style="width: 178px" @change="fnSelect">
              <ta-select-option value="401">高级技师</ta-select-option>
              <ta-select-option value="402">技师</ta-select-option>
              <ta-select-option value="403">高级</ta-select-option>
              <ta-select-option value="404">中级</ta-select-option>
              <ta-select-option value="405">初级</ta-select-option>
            </ta-select>
          </ta-form-item>
          <ta-form-item :fieldDecoratorOptions="{ rules: [{ phone: 'mobile', message: '输入的联系电话不合法' }] }"
            :require="{ message: '请输入联系电话!' }" fieldDecoratorId="ysv025" label="联系电话">
            <ta-input :disabled="isDisabled" />
          </ta-form-item>
          <ta-form-item :require="{ message: '请选择证书类型!' }" fieldDecoratorId="ysv026" label="证书类型">
            <ta-select :disabled="isDisabled" style="width: 178px">
              <ta-select-option value="4">专项能力资格证书</ta-select-option>
              <ta-select-option value="6">职业技能等级认定证书</ta-select-option>
            </ta-select>
          </ta-form-item>
          <ta-form-item :require="{ message: '请选择证书取得时间!' }" fieldDecoratorId="ysv027" label="证书取得时间">
            <ta-month-picker :disabled="isDisabled" :key="1" />
          </ta-form-item>
          <ta-form-item :require="{ message: '请输入开户行支行全称!' }" fieldDecoratorId="yhk032" label="开户行支行全称">
            <ta-input :disabled="isDisabled" />
          </ta-form-item>
          <ta-form-item :require="{ message: '请输入银行卡号!' }" fieldDecoratorId="yhk030" label="银行卡号">
            <ta-input :disabled="isDisabled" />
          </ta-form-item>
          <ta-form-item :require="{ message: '籍贯在哪儿就填哪儿!' }" fieldDecoratorId="location" label="审核地">
            <ta-select :disabled="isDisabled" style="width: 178px">
              <ta-select-option value="5499">省本级</ta-select-option>
              <ta-select-option value="5401">拉萨</ta-select-option>
              <ta-select-option value="5404">林芝</ta-select-option>
              <ta-select-option value="5403">昌都</ta-select-option>
              <ta-select-option value="5424">那曲</ta-select-option>
              <ta-select-option value="5422">山南</ta-select-option>
              <ta-select-option value="5425">阿里</ta-select-option>
              <ta-select-option value="5402">日喀则</ta-select-option>
            </ta-select>
          </ta-form-item>
          <ta-form-item :require="{ message: '请输入发证机构!' }" fieldDecoratorId="aab004" label="发证机构">
            <ta-input :disabled="isDisabled" />
          </ta-form-item>
          <ta-form-item fieldDecoratorId="ysv045" label="补贴金额合计">
            <ta-input :disabled="true" />
          </ta-form-item>
        </div>
      </ta-form>
      <div class="sub-title">材料上传</div>
      <div style="margin-bottom: 10px;color: red;cursor: pointer;" @click="downloadTemplate">点击此处下载补贴申报表模板</div>
      <materialUploadTable ref="materialUploadTable" yda020="505" :yda031="yda031Value" />
    </div>
  </div>
</template>

<script>
  import moment from 'moment'
  import materialUploadTable from 'common/components/materialUploadTable.vue'
  export default {
    name: 'appraisalSubsidyAdd',
    props: {},
    components: {
      materialUploadTable

    },
    data() {
      return {
        idCard: '',
        ysv028Value: '',
        yda031Value: '',
        queryForm: {},
        visitShow: false,
        isDisabled: false,
        isEditMode: false,
        isDisabledYsv021: false,
        ysv023ListOptions: []
      }
    },
    created() {
      this.userInfo = this.$route.params || {}
      if (this.userInfo.ysv010) {
        this.yda031Value = this.userInfo.ysv010
      }
    },
    mounted() {
      this.$nextTick(() => {
        this.init()
      })
    },
    methods: {
      init() {
        // 根据是否存在ysv010判断是编辑模式还是新增模式
        const isEditMode = !!this.userInfo.ysv010;
        // 构建请求参数
        const requestData = {};
        if (isEditMode) {
          // 编辑模式：传递ysv021和ysv010
          requestData.ysv021 = this.userInfo.ysv021;
          requestData.ysv010 = this.userInfo.ysv010;
        } else {
          // 新增模式：只传递certNo
          requestData.ysv021 = this.userInfo.certNo;
        }

        const param = {
          no: '496-0009',
          data: JSON.stringify(requestData)
        };
        this.Base.sendRequest('', param, (res) => {
          if (res.serviceSuccess) {
            if (res.data.code === '1') {
              this.ysv023ListOptions = res.data.ysv023List || []
              if (isEditMode && res.data.dataMap) {
                const arr = res.data.dataMap
                this.queryForm.setFieldsValue(arr)
              }
            }
            if (res.data.code === '0') {
              this.$message.error(res.data.msg || '查询失败')
            }
          } else {
            this.$message.error(res.data.msg)
          }
        })
      },
      // 身份证号校验
      fnCheck() {
        // 优先使用v-model绑定的值
        let idCard = this.idCard || this.queryForm.getFieldValue('ysv021');
        if (!idCard) {
          return false; // 不提示，让用户继续输入
        }
        // 只有当身份证号长度为18位时才进行校验
        if (idCard.length !== 18) {
          return false; // 不提示，让用户继续输入
        }
        // 基本格式校验：18位，最后一位可能是X
        const reg = /(^\d{18}$)|(^\d{17}(\d|X|x)$)/;
        if (!reg.test(idCard)) {
          this.$message.error('身份证号格式不正确，请输入18位数字，最后一位可能为X');
          return false;
        }

        // 校验码验证
        const weights = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2];
        const codes = ['1', '0', 'X', '9', '8', '7', '6', '5', '4', '3', '2'];

        let sum = 0;
        for (let i = 0; i < 17; i++) {
          sum += parseInt(idCard[i]) * weights[i];
        }

        const checkCode = codes[sum % 11];
        if (checkCode !== idCard[17].toUpperCase()) {
          this.$message.error('身份证号校验码错误，不是有效的身份证号');
          return false;
        }

        // 出生日期校验
        const year = parseInt(idCard.substr(6, 4));
        const month = parseInt(idCard.substr(10, 2));
        const day = parseInt(idCard.substr(12, 2));

        const date = new Date(year, month - 1, day);
        if (date.getFullYear() !== year || date.getMonth() + 1 !== month || date.getDate() !== day) {
          this.$message.error('身份证号中出生日期无效');
          return false;
        }
        //身份证验证成功后调用接口
        let param = {
          no: '496-0010',
          data: JSON.stringify({
            ysv021: idCard,
            yac002: this.userInfo.certNo
          }),
        };
        this.Base.sendRequest('', param, (res) => {
          if (res.serviceSuccess) {
            // 添加安全检查
            if (!res.data || typeof res.data.code === 'undefined') {
              this.$message.error('系统异常，响应数据格式错误');
              return;
            }

            if (res.data.code === '1') {
              // 验证成功：设置字段只读并填充表单
              this.isDisabledYsv021 = true;
              this.queryForm.setFieldsValue({
                ysv021: idCard
              });
              this.$message.success('身份证号验证通过');
            } else if (res.data.code === '0') {
              // 验证失败：显示错误信息，清空相关字段并解除禁用
              this.$message.error(res.data.msg || '身份证号验证失败');
              this.queryForm.setFieldsValue({
                ysv021: '' // 清空表单中的身份证号字段
              });
              // 清空v-model绑定的变量
              this.idCard = ''
              // 失败时需要解除身份证号的禁用，允许用户重新输入
              this.isDisabledYsv021 = false;
            } else {
              // 处理其他未知状态码
              this.$message.error(`系统返回未知状态：${res.data.code}`);
              this.isDisabledYsv021 = false;
            }
          } else {
            this.$message.error(res.data.msg)
          }
        })
      },
      fnChange() {
        // 获取身份证号和证书编号
        let ysv021Number = this.queryForm.getFieldValue('ysv021');
        let ysv028Number = this.queryForm.getFieldValue('ysv028');

        // 验证必要参数
        if (!ysv021Number) {
          this.$message.error('请先输入身份证号');
          return;
        }
        if (!ysv028Number) {
          this.$message.error('请输入证书编号');
          return;
        }
        let param = {
          no: '496-0012',
          data: JSON.stringify({
            ysv028: ysv028Number,
          }),
        };
        this.Base.sendRequest('', param, (res) => {
          if (res.serviceSuccess) {
            // 添加安全检查
            if (!res.data || typeof res.data.code === 'undefined') {
              this.$message.error('系统异常，响应数据格式错误');
              return;
            }

            if (res.data.code === '1') {
              if (res.data.cerInfo) {
                const arr = res.data.cerInfo
                // 移除连字符并保留数字
                const processedYsv023 = (arr.ysv023 || '').toString().replace(/-/g, '');
                // 在选项列表中查找匹配项（根据实际数据结构使用id属性匹配）
                const matchingOption = this.ysv023ListOptions && Array.isArray(this.ysv023ListOptions) ?
                  this.ysv023ListOptions.find(option => option.id === processedYsv023) :
                  null;
                // 如果找到匹配项，回显中文名称；否则置空工种类型
                if (matchingOption) {
                  arr.ysv023 = matchingOption.name; // 使用name字段回显中文
                } else {
                  // 未找到匹配项，置空工种类型
                  arr.ysv023 = '';
                }
                const ysv024 = arr.ysv024
                switch (ysv024) {
                  case '401':
                    arr.ysv045 = '250'
                    break;
                  case '402':
                    arr.ysv045 = '250'
                    break;
                  case '403':
                    arr.ysv045 = '220'
                    break;
                  case '404':
                    arr.ysv045 = '200'
                    break;
                  case '405':
                    arr.ysv045 = '180'
                    break;
                  default:
                    arr.ysv045 = '0'
                    break;
                }
                if (arr.ysv026 !== '4' && arr.ysv026 !== '6') {
                  arr.ysv026 = ''
                }
                this.queryForm.setFieldsValue(arr)
              }
            } else if (res.data.code === '0') {
              this.$message.error(res.data.msg);
              this.queryForm.setFieldsValue({
                ysv028: '' // 清空表单中的证书编号字段
              });
            }
          } else {
            this.$message.error(res.data.msg)
          }
        })
      },
      fnSelect(val) {
        switch (val) {
          case '401':
            this.queryForm.setFieldsValue({
              ysv045: '250'
            })
            break;
          case '402':
            this.queryForm.setFieldsValue({
              ysv045: '250'
            })
            break;
          case '403':
            this.queryForm.setFieldsValue({
              ysv045: '220'
            })
            break;
          case '404':
            this.queryForm.setFieldsValue({
              ysv045: '200'
            })
            break;
          case '405':
            this.queryForm.setFieldsValue({
              ysv045: '180'
            })
            break;
          default:
            this.queryForm.setFieldsValue({
              ysv045: '0'
            })
            break;
        }
      },
      handleReset() {
        // 重置表单所有字段
        if (this.queryForm && this.queryForm.resetFields) {
          this.queryForm.resetFields();
        }

        // 重置v-model绑定的变量
        this.idCard = '';
        this.ysv028Value = '';

        // 重置禁用状态
        this.isDisabled = false;
        this.isDisabledYsv021 = false;
      },
      handleConfirm() {
        this.queryForm.validateFields((errors, values) => {
          if (errors) {
            return
          }
          // 获取表单数据
          const formData = this.queryForm.getFieldsValue()
          if (!formData) {
            this.$message.error('表单数据获取失败')
            return
          }
          formData.ysv013 = moment(formData.ysv013).format('YYYY-MM-DD')

          // 根据是否存在ysv010判断是编辑模式还是新增模式
          const isEditMode = !!this.userInfo.ysv010;
          if (isEditMode) {
            // 编辑模式：多传一个ysv010参数
            formData.ysv010 = this.userInfo.ysv010;
          }
          formData.ysv027 = moment(formData.ysv027).format('YYYY-MM-DD')
          formData.aac001 = this.userInfo.ext03
          formData.aae017 = formData.location
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
            no: '496-0011',
            data: JSON.stringify({
              ...formData,
              fileList: JSON.stringify(fileList)
            })
          }
          this.Base.sendRequest('', param, (res) => {
            if (res.serviceSuccess && res.data.code === '1') {
              this.$message.success(res.data.msg || '保存成功')
              setTimeout(() => {
                this.$router.go(-1)
              }, 8000)
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
      downloadTemplate() {
        // 调用通用下载方法，使用POST请求下载认定表
        this.Base.commonDownload({
          method: 'get',
          url: '/api/file/downLoadWord',
          options: {
            fileName: '职业技能等级认定补贴申请表.xls',
          },
          fileName: '职业技能等级认定补贴申请表.xls'
        }).then(() => {
          console.log('职业技能等级认定补贴申请表下载成功')
        }).catch((error) => {
          console.error('下载职业技能等级认定补贴申请表失败', error)
          this.$message.error('下载失败，请重试')
        })
      }

    },
  }
</script>

<style scoped>
  .appraisalSubsidyAdd {
    width: 1200px;
    margin: 0 auto;
    padding: 20px;
  }

  .content-box {
    margin-top: 20px;
  }

  .sub-title {
    font-size: 16px;
    font-weight: bold;
    color: #333;
    padding: 10px 0;
    background-color: #afd2f0;
    border-bottom: 2px solid #e8e8e8;
    margin-bottom: 20px;
  }

  .form-box {
    margin-bottom: 30px;
  }

  .modal-btn {
    margin-bottom: 20px;
    display: flex;
    justify-content: flex-end;
  }

  .modal-btn .ta-button {
    margin-left: 10px;
  }

  .btn-box {
    display: flex;
    justify-content: space-around;

    .btn {
      cursor: pointer;
    }
  }

  .tips {
    color: red;
    font-size: 16px;
    font-weight: bold;
    margin-top: -33px;
  }

  /* 统一输入框和下拉框宽度，确保对齐 */
  .ta-form-item .ta-input,
  .ta-form-item .ta-select {
    width: 180px;
  }

  /* 针对特定长标签的输入框，保持一致的宽度 */
  .ta-form-item[label-width="220px"] .ta-input {
    width: 180px;
  }
</style>