<template>
  <div class="subsidy-box">
    <div class="main">
      <div class="title">就业困难人员灵活就业补贴</div>
      <div class="content-box">
        <div class="sub-title">个人基本信息</div>
        <ta-form :autoFormCreate="(form) => { this.infoForm = form}" :formLayout="true" label-width="80px"
          layout="inline" style="margin-top: 20px;">
          <ta-form-item fieldDecoratorId="aac003" label="姓名">
            <ta-input disabled style="width: 180px" />
          </ta-form-item>
          <ta-form-item fieldDecoratorId="yac002" label="身份证号">
            <ta-input disabled style="width: 180px" />
          </ta-form-item>
          <ta-form-item fieldDecoratorId="aac004" label="性别">
            <ta-select disabled collection-type="AAC004" style="width: 180px" />
          </ta-form-item>
          <ta-form-item fieldDecoratorId="aac011" label="文化程度">
            <ta-select disabled collection-type="AAC011" style="width: 180px" />
          </ta-form-item>
          <div class="btn-box">
            <div class="btn" @click="handleSearch">
              <ta-icon type="search" style="color: #007AFF;" />
              查询
            </div>
            <div class="btn" @click="openAddPage">
              <ta-icon type="plus" style="color: green;" />
              补贴申请
            </div>
            <div class="btn" @click="handleReset">
              <ta-icon type="sync" />
              页面重置
            </div>
          </div>
        </ta-form>
        <div class="sub-title">申请记录信息</div>
        <ta-big-table :data="tableData" border="inner" height="530" show-header-overflow>
          <ta-big-table-column field="aac001" title="个人编号" width="80" v-if="false" />
          <ta-big-table-column field="hyy001" title="就业困难灵活就业补贴明细流水号" width="80" v-if="false" />
          <ta-big-table-column field="yac002" title="身份证号" />
          <ta-big-table-column field="aac003" title="姓名" />
          <ta-big-table-column collection-type="AAC004" field="aac004" title="性别" />
          <ta-big-table-column collection-type="AAC005" field="aae005" show-overflow title="民族" />
          <ta-big-table-column collection-type="YCC131" field="hyy012" show-overflow title="就业困难人员类别" />
          <ta-big-table-column collection-type="AAE017" field="hyy002" show-overflow title="户口所在地" />
          <ta-big-table-column field="hyy003" show-overflow title="灵活就业地" />
          <ta-big-table-column field="hyy010" show-overflow title="银行账号" />
          <ta-big-table-column field="hyy102" show-overflow title="补贴开始月" />
          <ta-big-table-column field="hyy103" show-overflow title="补贴结束月" />
          <ta-big-table-column field="hyy200" show-overflow title="补贴总金额" />
          <ta-big-table-column field="hyy104" show-overflow title="养老保险金额" />
          <ta-big-table-column field="hyy114" show-overflow title="医疗保险金额" />
          <ta-big-table-column field="months" show-overflow title="补贴总月数" />
          <ta-big-table-column field="aae036" show-overflow title="申请日期" />
          <ta-big-table-column collection-type="YAE421" field="yae421" show-overflow title="审核状态" />
          <!-- <ta-big-table-column field="sbDetail" title="社保明细" width="50">
            <template #default="{}">
              <ta-icon type="schedule" @click="visibleCancel = true" />
            </template>
          </ta-big-table-column> -->
          <ta-big-table-column field="btDetail" title="申请明细" width="50">
            <template #default="{ row }">
              <ta-icon type="eye" @click="handleDetail(row)" />
            </template>
          </ta-big-table-column>
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
    name: '',
    data() {
      return {
        info:{},
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
              this.info = res.data || {}
              this.infoForm.setFieldsValue({
                aac003: this.info.aac003,
                yac002: this.info.aac002,
                aac004: this.info.aae005,
                aac011: this.info.aac011,
              })
              this.queryPageList()
            }
          }
        })
      },
      queryPageList() {
        if (!this.info) {
          this.$message.error('查询失败,未找到数据！')
          return
        }
        const param = {
          no: '478-0002',
          data: JSON.stringify({
            aac003: this.info.aac003,
            yav002: this.info.aac002,
            aac004: this.info.aae005,
            aac011: this.info.aac011, 
          }),
        }
        this.Base.sendRequest('', param, (res) => {
          if (res.serviceSuccess && res.data) {
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
            name: "empEntreFlexibleEmpSubsidyApply",
            params: {
              ...this.userInfo
            }
          })
        } catch (error) {
          console.error('导航到新增页面失败:', error)
          this.$message.error('无法打开新增页面，请稍后重试')
        }
      },
      handleReset() {
        this.infoForm.resetFields()
        this.current = 1
        this.pageSize = 10
        this.init()
        this.queryPageList()
      },
      handleDetail(row) {
        if (!row) {
          this.$message.error('数据异常，无法操作');
          return;
        }
        try {
          this.$router.push({
            name: "empEntreFlexibleEmpSubsidyDetail",
            params: {
              ...row
            }
          })
        } catch (error) {
          console.error('导航到新增页面失败:', error)
          this.$message.error('无法打开新增页面，请稍后重试')
        }
      }

    },
  }
</script>

<style lang="less" scoped>
  .subsidy-box {
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