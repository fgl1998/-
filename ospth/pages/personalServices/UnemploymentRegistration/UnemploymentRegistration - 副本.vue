<template>
  <div>
    <div class="main">
      <div class="title">
        失业登记
      </div>
      <div class="content-box">
        <div class="sub-title">基本信息</div>
        <ta-form :autoFormCreate="(form) => { this.infoForm = form}" :formLayout="true" label-width="120px"
          layout="horizontal">
          <ta-form-item fieldDecoratorId="aac003" label="姓名">
            <ta-input disabled style="width: 240px" />
          </ta-form-item>
          <ta-form-item fieldDecoratorId="yac002" label="身份证号">
            <ta-input disabled style="width: 240px" />
          </ta-form-item>
          <ta-form-item fieldDecoratorId="aae005" label="联系电话">
            <ta-input disabled style="width: 240px" />
          </ta-form-item>
          <div class="btn-box">
            <div class="btn" @click="handleSearch">
              <ta-icon type="search" />
              查询
            </div>
            <div class="btn" @click="openAddPage">
              <ta-icon type="plus" />
              新增
            </div>
          </div>
        </ta-form>
        <div class="sub-title">申请记录</div>
        <ta-big-table :data="tableData" border="inner" height="530" show-overflow>
          <ta-big-table-column title="" type="seq" width="40" />
          <ta-big-table-column field="ycc020" title="主键流水号" v-if="false" />
          <ta-big-table-column field="aac001" title="个人编号" v-if="false" />
          <ta-big-table-column field="aac003" title="姓名" />
          <ta-big-table-column field="yac002" title="身份证号" />
          <ta-big-table-column field="aae100" title="有效标识" v-if="false" collection-type="AAE100" />
          <ta-big-table-column collection-type="AAC012" field="ycc022" title="个人身份" />
          <ta-big-table-column field="aac021" title="就失业证号码" v-if="false" />
          <ta-big-table-column field="aac026" title="现住地址" />
          <ta-big-table-column field="aab004" show-overflow title="原工作单位" />
          <ta-big-table-column field="ycc024" title="失业时间" v-if="false" />
          <ta-big-table-column field="ycc025" title="失业前月收入情况" v-if="false" />
          <ta-big-table-column collection-type="YCC020" field="ycc027" show-overflow title="失业类型" />
          <ta-big-table-column collection-type="AJC093" field="ycc028" show-overflow title="失业原因" />
          <ta-big-table-column field="ycc02h" title="有无求职意愿" v-if="false" />
          <ta-big-table-column field="aae043" show-overflow title="失业登记日期" />
          <ta-big-table-column field="ycc02n" title="是否有培训意愿" v-if="false" />
          <ta-big-table-column field="aae011" show-overflow title="经办人" />
          <ta-big-table-column field="aae036" show-overflow title="经办时间" />
          <ta-big-table-column collection-type="AAE017" field="aae017" show-overflow title="经办机构" />
          <ta-big-table-column collection-type="YAE421" field="yae421" show-overflow title="审批状态" />
          <ta-big-table-column collection-type="YESORNO" field="ajc174" show-overflow title="是否申领失业保险金" />
          <template #bottomBar>
            <ta-pagination ref="gridPager" v-model="current" :data-source.sync="tableData" :page-size.sync="pageSize"
              style="text-align: right;" url="" />
          </template>
        </ta-big-table>
      </div>
    </div>

  </div>
</template>

<script>
  export default {
    name: 'UnemploymentRegistration',
    data() {
      return {
        userInfo: {},
        infoForm: {},
        tableData: [],
        current: 1,
        pageSize: 10,
      }
    },
    components: {},
    created() {

    },
    mounted() {
      // 获取用户信息
      try {
        const info = Base.getUserInfo()
        if (info && info.naturalBo) {
          this.userInfo = info.naturalBo
          this.init()
          this.queryPageList()
        } else {
          this.$message.error('获取用户信息失败，请重新登录')
        }
      } catch (error) {
        console.error('获取用户信息异常:', error)
        this.$message.error('系统异常，请稍后重试')
      }

    },
    methods: {
      init() {
        const param = {
          no: '000-0016',
          data: JSON.stringify({
            yac002: this.userInfo.certNo,
          }),
        }
        this.Base.sendRequest('', param, (res) => {
          if (res.serviceSuccess) {
            if (!res.data) {
              this.$message.error('查询失败,未找到数据！')
              return
            } else {
              let info = res.data || {}
              this.infoForm.setFieldsValue({
                aac003: info.aac003,
                yac002: info.aac002,
                aae005: info.aae005,
              })
            }

          }
        })
      },
      queryPageList() {
        const param = {
          no: '404-0006',
          data: JSON.stringify({
            aac001: this.userInfo.ext03
          }),
        }
        this.Base.sendRequest('', param, (res) => {
          if (res.serviceSuccess) {
            this.tableData = res.data || []
            if (this.tableData.length === 0) {
              this.$message.success('查询完毕，没有找到数据!')
            }
          } else {
            this.$message.error(res.message || '查询失败')
          }
        })
      },
      openAddPage() {
        if (!this.userInfo || !this.userInfo.certNo) {
          this.$message.error('用户信息不完整，无法新增')
          return
        }
        try {
          this.$router.push({
            name: "UnemploymentRegistrationAdd",
            params: {
              ...this.userInfo
            }
          })
        } catch (error) {
          console.error('导航到新增页面失败:', error)
          this.$message.error('无法打开新增页面，请稍后重试')
        }
      },
      handleSearch() {
        this.queryPageList()
      },



    }
  }
</script>

<style lang="less" scoped>
  .main {
    width: 1200px;
    margin: 0 auto;

    // padding-top: 50px;
    .title {
      font-size: 34px;
      font-family: "pingFangSC-Bold";
      font-weight: bold;
      color: #333333;
      margin-top: 33px;
    }
  }

  .content-box {
    margin: 20px 0 33px;
    border: 1px solid #afd2f0;
    border-radius: 2px;
  }

  .sub-title {
    padding: 8px 16px;
    font-size: 22px;
    color: #666668;
    font-weight: bold;
    background-color: #afd2f0;
  }

  .ant-form {
    margin-top: 16px;

    .btn-box {
      width: 220px;
      height: 32px;
      display: flex;
      justify-content: flex-end;
      align-items: center;
      cursor: pointer;

      .btn:last-child {
        margin: 0 30px;
      }
    }
  }

  /deep/ .ant-modal-title {
    font-size: 24px;
    font-family: "pingFangSC-Bold";
    // font-weight: bold;
    color: #333333;
  }


  /deep/ .ant-modal-body {
    padding-top: 0px;
    padding-bottom: 0px;

    .ant-form {
      margin-top: 0px;
    }

    .form-box {
      margin-top: 24px;
    }
  }

  /deep/ .ant-upload {
    margin: 20px 8px;
  }

  /deep/ .col--last {
    .ant-upload {
      margin: 0;
    }
  }

  .modal-btn {
    margin-top: 20px;
    text-align: center;

    .ant-btn:first-child {
      margin-right: 20px;
    }
  }

  .tips {
    color: red;
    font-size: 22px;
    font-weight: bold;
    margin-top: -33px;
  }
</style>