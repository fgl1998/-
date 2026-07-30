<!-- 工考成绩 -->
<template>
  <div class="examresult">
    <div class="main">
      <div class="content-box">
        <div class="sub-title">工考成绩查询</div>
        <ta-form :autoFormCreate="(form) => { this.infoForm = form}" :labelCol="{ span: 6 }" :wrapperCol="{ span: 12 }">
          <ta-form-item fieldDecoratorId="aac003" label="姓名">
            <ta-input :disabled="true" />
          </ta-form-item>
          <ta-form-item fieldDecoratorId="aac147" label="身份证">
            <ta-input :disabled="true" />
          </ta-form-item>
          <ta-form-item :require="{ message: '请输入准考证号' }" fieldDecoratorId="ygcr41" label="准考证号">
            <ta-input placeholder="准考证号" />
          </ta-form-item>
          <ta-form-item :wrapperCol="{ span: 18, offset: 12 }">
            <ta-button type="primary" @click="onQuery">查询</ta-button>
          </ta-form-item>
        </ta-form>
      </div>
      <div class="content-box" style="padding-top: 30px;border-top: none">
        <ta-form :autoFormCreate="(form) => { this.queryForm = form}" :labelCol="{ span: 6 }"
          :wrapperCol="{ span: 12 }">
          <ta-form-item fieldDecoratorId="ygcr82_1" label="理论成绩">
            <ta-input :disabled="true" />
          </ta-form-item>
          <ta-form-item fieldDecoratorId="ygcr82_2" label="实操成绩">
            <ta-input :disabled="true" />
          </ta-form-item>
          <ta-form-item fieldDecoratorId="ygcr82_3" label="综合成绩">
            <ta-input :disabled="true" />
          </ta-form-item>
        </ta-form>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'examResult',

    data() {
      return {
        userInfo: {},
        infoForm: {},
        queryForm: {},

      }
    },
    computed: {},
    watch: {},
    created() {
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
              let info = res.data || {}
              this.infoForm.setFieldsValue({
                aac003: info.aac003,
                aac147: info.aac002,
              })
            }

          }
        })
      },
      onQuery() {
        this.infoForm.validateFields((err, values) => {
          if (err) {
            return
          }
          const param = {
            no: '496-0007',
            data: JSON.stringify({
              aac003: values.aac003,
              aac147: values.aac147,
              ygcr41: values.ygcr41,
            }),
          }
          this.Base.sendRequest('', param, (res) => {
            if (res.serviceSuccess && res.data.code === '1') {
              console.log(res, 'res---?');

              let info = res.data.info || {}
              // 检查info是否为空对象
              if (!info || Object.keys(info).length === 0) {
                this.$message.error('暂无成绩记录！')
                return
              } else {
                this.queryForm.setFieldsValue({
                  ygcr82_1: info.ygcr82_1,
                  ygcr82_2: info.ygcr82_2,
                  ygcr82_3: info.ygcr82_3,
                })
              }
            }
          })

        })

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
      font-family: 'pingFangSC-Bold';
      font-weight: bold;
      color: #333333;
      margin-top: 33px;
    }
  }

  .content-box {

    border: 1px solid #afd2f0;
    border-radius: 2px;
  }

  .sub-title {
    padding: 8px 16px;
    font-size: 22px;
    color: #666668;
    font-weight: bold;
    background-color: #afd2f0;
    margin-bottom: 30px;
  }
</style>