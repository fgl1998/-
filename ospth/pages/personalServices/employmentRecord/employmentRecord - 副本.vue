<template>
  <div class="employment-record">
    <div class="main">
      <div class="title">
        就业登记(新)
      </div>
      <div class="content-box">
        <div class="sub-title">基本信息</div>
        <ta-form :autoFormCreate="(form) => { this.infoForm = form}" :formLayout="true" label-width="120px"
          layout="inline" style="margin-top: 20px;">
          <ta-form-item fieldDecoratorId="aac003" label="姓名">
            <ta-input disabled style="width: 220px" />
          </ta-form-item>
          <ta-form-item fieldDecoratorId="yav002" label="身份证号">
            <ta-input disabled style="width: 220px" />
          </ta-form-item>
          <ta-form-item fieldDecoratorId="aae005" label="联系电话">
            <ta-input disabled style="width: 220px" />
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
          <ta-big-table-column title="" type="seq" width="40"></ta-big-table-column>
          <ta-big-table-column field="operate" title="操作" width="50">
            <template #default="{ row }">
              <a v-if="row.yae421 === '01' && row.aae100 === '1' && (row.ycc045 === undefined || row.ycc045 === '00')"
                @click="handleCancel(row)" style="color:#208fdd;cursor:pointer;">
                注销
              </a>
            </template>
          </ta-big-table-column>
          <ta-big-table-column field="aac003" title="姓名" width="50"></ta-big-table-column>
          <ta-big-table-column collection-type="AAC004" field="aac004" title="性别" width="50"></ta-big-table-column>
          <ta-big-table-column collection-type="AAC011" field="aac011" title="文化程度" width="80"></ta-big-table-column>
          <ta-big-table-column field="yac002" title="身份证号" width="80"></ta-big-table-column>
          <ta-big-table-column field="aac026" title="现住地址" width="80"></ta-big-table-column>
          <ta-big-table-column field="aae005" show-overflow title="联系电话" width="80" />
          <ta-big-table-column field="aab004" show-overflow title="现工作单位" />
          <ta-big-table-column field="ycc039" show-overflow title="就业日期" width="80" />
          <ta-big-table-column collection-type="ADC111" field="yhc407" show-overflow title="就业方式" width="80" />
          <ta-big-table-column field="aae036" show-overflow title="经办时间" />
          <ta-big-table-column collection-type="AAE017" field="aae017" show-overflow title="经办机构" />
          <ta-big-table-column collection-type="YAE421" field="yae421" show-overflow title="录入审批状态" />
          <ta-big-table-column collection-type="YAE421" field="ycc045" show-overflow title="注销审批状态" />
          <template #bottomBar>
            <ta-pagination ref="gridPager" v-model="current" :data-source.sync="tableData" :page-size.sync="pageSize"
              style="text-align: right" url="" />
          </template>
        </ta-big-table>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'employmentRecord',
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
    created() {},
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
                yav002: info.aac002,
                aae005: info.aae005,
              })
            }

          }
        })
      },
      queryPageList() {
        const param = {
          no: '403-0006',
          data: JSON.stringify({
            aac001: this.userInfo.ext03
          }),
        }
        this.Base.sendRequest('', param, (res) => {
          if (res.serviceSuccess) {
            this.tableData = res.data || []
            // 判断数据是否为空
            if (!this.tableData || this.tableData.length === 0) {
              this.$message.success('查询成功，数据为空！')
            } else {
              // 有数据时显示后台返回的提示
              this.$message.success('查询成功')
            }
            this.showAddButton = res.data.butAdd
          } else {
            this.$message.error(res.message || '查询失败')
          }
        })
      },
      handleSearch() {
        this.queryPageList()
      },
      openAddPage() {
        if (!this.userInfo || !this.userInfo.certNo) {
          this.$message.error('用户信息不完整，无法新增')
          return
        }
        try {
          this.$router.push({
            name: "employmentRecordAdd",
            params: {
              ...this.userInfo
            }
          })
        } catch (error) {
          console.error('导航到新增页面失败:', error)
          this.$message.error('无法打开新增页面，请稍后重试')
        }
      },
      handleCancel(row) {
        // 确保row不为空
        if (!row) {
          this.$message.error('数据异常，无法操作');
          return;
        }
        try {
          this.$router.push({
            name: "employmentRecordDelete",
            params: {
              ...row
            }
          })
        } catch (error) {
          console.error('导航到新增页面失败:', error)
          this.$message.error('无法打开新增页面，请稍后重试')
        }

      }
    }
  }
</script>

<style lang="less" scoped>
  .employment-record {
    width: 1200px;
    margin: 0 auto;
    padding: 20px;
  }

  .main {
    width: 100%;

    .title {
      color: #2f54eb;
      font-size: 24px;
      font-weight: bold;
      margin-bottom: 20px;
    }

    .content-box {
      padding: 20px;
      background-color: #ffffff;
      margin-top: 16px;
      border: 1px solid #afd2f0;
      border-radius: 2px;
    }

    .btn-box {
      height: 35px;

      .btn {
        margin-right: 30px;
      }
    }
  }

  .sub-title {
    padding: 8px 16px;
    font-size: 22px;
    color: #666668;
    font-weight: bold;
    background-color: #afd2f0;
  }

  .btn-box {
    height: 32px;
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
    // margin-top: 16px;

    .btn {
      margin-right: 30px;
    }
  }
</style>