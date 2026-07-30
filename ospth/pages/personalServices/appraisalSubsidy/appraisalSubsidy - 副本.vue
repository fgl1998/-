<!-- 鉴定补贴 -->
<template>
  <div class="appraisalSubsidy">
    <div class="main">
      <div class="title">鉴定补贴(新)</div>
      <div class="content-box">
        <div class="sub-title">个人申请记录</div>
        <div class="btn-box">
          <div></div>
          <div style="display: flex">
            <div class="btn" @click="handleSearch">
              <ta-icon type="search" />
              查询
            </div>
            <div class="btn" @click="openAddPage">
              <ta-icon type="plus" />
              新增
            </div>
          </div>
        </div>
        <ta-big-table :data="tableData" border="inner" height="530" show-overflow>
          <ta-big-table-column title="" type="seq" width="40"></ta-big-table-column>
          <ta-big-table-column field="operate" title="操作" width="80">
            <template #default="{ row }">
              <a @click="onEdit(row)"> 编辑 </a>
            </template>
          </ta-big-table-column>
          <ta-big-table-column field="ysv010" title="主键流水号" v-if="false" />
          <ta-big-table-column field="aac001" title="个人编号" v-if="false" />
          <ta-big-table-column field="ysv021" title="身份证号"></ta-big-table-column>
          <ta-big-table-column field="ysv011" title="姓名" style="width: 60px;" />
          <ta-big-table-column collection-type="SEX" field="ysv012" title="性别"></ta-big-table-column>
          <ta-big-table-column field="ysv024" title="工种等级">
            <template v-slot="{ row }">
              <span v-if="row.ysv024=== '401'">高级技师</span>
              <span v-if="row.ysv024=== '402'">技师</span>
              <span v-if="row.ysv024=== '403'">高级</span>
              <span v-if="row.ysv024=== '404'">中级</span>
              <span v-if="row.ysv024=== '405'">初级</span>
            </template>
          </ta-big-table-column>
          <ta-big-table-column field="ysv026" title="证书类型">
            <template v-slot="{ row }">
              <span v-if="row.ysv026=== '4'">专项能力资格证书</span>
              <span v-if="row.ysv026=== '6'">职业技能等级认定证书</span>
            </template>
          </ta-big-table-column>
          <ta-big-table-column field="ysv028" title="证书编号"></ta-big-table-column>
          <ta-big-table-column field="fstatus" title="审核状态">
            <template v-slot="{ row }">
              <span v-if="row.fstatus=== '1'">未审核</span>
              <span v-if="row.fstatus=== '2'">初审通过</span>
              <span v-if="row.fstatus=== '3'">复审通过</span>
              <span v-if="row.fstatus=== '4'">终审通过</span>
              <span v-if="row.fstatus=== '9'">审核不通过</span>
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
    name: 'appraisalSubsidy',
    components: {},
    data() {
      return {
        userInfo: {},
        tableData: [],
        current: 1,
        pageSize: 10,
      }
    },
    computed: {},
    watch: {},
    created() {},
    mounted() {
      try {
        const info = Base.getUserInfo()
        if (info && info.naturalBo) {
          this.userInfo = info.naturalBo
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
      queryPageList() {
        const param = {
          no: '496-0008',
          data: JSON.stringify({
            ysv021: this.userInfo.certNo,
          }),
        }
        this.Base.sendRequest('', param, (res) => {
          if (res.serviceSuccess && res.data.code === '1') {
            this.tableData = res.data.list || []
            // 判断数据是否为空
            if (!this.tableData || this.tableData.length === 0) {
              this.$message.success('查询成功，数据为空！')
            } else {
              // 有数据时显示后台返回的提示
              this.$message.success(res.data.message || '查询成功')
            }
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
            name: "appraisalSubsidyAdd",
            params: {
              ...this.userInfo
            }
          })
        } catch (error) {
          console.error('导航到新增页面失败:', error)
          this.$message.error('无法打开新增页面，请稍后重试')
        }
      },
      onEdit(row) {
        if (!row || !row.ysv010) {
          this.$message.error('请选择要编辑的记录')
          return
        }
        if ( row.fstatus !== '1') {
         this.$message.error("该信息处于审核阶段，不可修改")
          return;
        }
        try {
          this.$router.push({
            name: "appraisalSubsidyAdd",
            params: {
              ...row,
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
  .appraisalSubsidy {
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
      display: flex;

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