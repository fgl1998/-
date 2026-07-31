<template>
  <div class="page-register">
    <!-- 一体机注册启动页面 -->
    <common-header></common-header>
    <div class="page-content">
      <el-form ref="form" :model="form" label-width="360px">
        <el-form-item
          label="请选择一体机设备"
          prop="ace711_dsc"
          :rules="[{ required: true, message: '请选择一体机设备' }]"
        >
          <el-select ref="select" v-model="form.ace711_dsc" placeholder="请选择一体机设备" clearable>
            <el-option :value="treeDataValue" style="overflow-y: scroll; height: 100%; max-height: 300px">
              <el-tree
                default-expand-all
                ref="tree"
                :data="data"
                node-key="label"
                :props="defaultProps"
                @node-click="handleNodeClick"
              ></el-tree>
            </el-option>
          </el-select>
          <el-button style="margin-left: 20px" type="primary" @click="refresh">刷新</el-button>
        </el-form-item>
        <el-form-item
          label="请输入设备校验码"
          prop="ace772"
          :rules="[{ required: true, message: '设备校验码不能为空' }]"
        >
          <el-input v-model="form.ace772" clearable></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="success" @click="submit('form')">注册</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
export default {
  name: 'machineRegister',
  data() {
    return {
      form: {
        ace711: '', //设备编码
        ace772: '', //设备校验码
        ace711_dsc: '', //设备名称
        faceIp: '', //刷脸服务ip
      },
      treeDataValue: '',
      data: [],
    }
  },
  computed: {
    defaultProps() {
      return {
        children: 'children',
        label: 'label',
      }
    },
  },
  onShow: function () {
    // 在路由跳转到当前页面之前进行检查
    const ace711 = uni.getStorageSync('ace711')
    if (ace711) {
      this.$utils.navigateTo('/pages/index/index') // 到首页
    } else {
      this.getAce711()
    }
  },
  methods: {
    refresh() {
      this.getAce711()
    },
    //初始化设备编码
    getAce711() {
      let param = {
        ace769: '7',
        apiCode: 'jy204_hrm262',
        method: 'jy204_hrm262',
      }
      //  this.$utils.request(null, param, true, false, null)
      this.$utils.request(null, param, true, true, null).then((res) => {
        let result = res.ce31Pos
        this.data = result
      })
    },
    //点击树节点
    handleNodeClick(data, node, nodeData) {
      if (!data.children) data.children = []
      if (!data.children.length) {
        //第一层为城市，不可选为值
        this.treeDataValue = data
        this.form.ace711 = data.value
        this.form.ace711_dsc = data.label
        this.form.faceIp = data.faceIp
        this.form.faceLogin = data.faceLogin
        this.$refs.select.blur() //收起下拉框
      }
    },
    //提交
    submit(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          let param = {
            ace711: this.form.ace711,
            ace772: this.form.ace772,
            apiCode: 'jy204_hrm267',
            method: 'jy204_hrm267',
          }
          this.$utils.request(null, param, true, true, null).then((res) => {
            if (res.result.message) {
              this.$utils.showToast(res.result.message)
            }
            if (res.result.ace772) {
              // console.log('新检验码',res.data.ace772)
              //缓存设备编码ace711和设备校验码ace772,机器是否可扫脸登录，刷脸ip也放到缓存
              uni.setStorageSync('ace772', res.result.ace772)
              uni.setStorageSync('ace711', this.form.ace711)
              uni.setStorageSync('faceIp', this.form.faceIp)
              uni.setStorageSync('faceLogin', this.form.faceLogin)
              this.$utils.navigateTo('/pages/index/index') // 到首页
            }
          })
        } else {
          return false
        }
      })
    },
  },
}
</script>

<style lang="less" scoped>
.page-register {
  height: 1080px;
  width: 1920px;
  background: url('../../static/images/waitPage/bg@2x.png') center no-repeat;
  background-size: cover;
  font-family: MicrosoftYaHei;

  .page-content {
    height: 80%;
    width: 1920px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;

    /deep/.el-form {
      .el-form-item {
        margin-bottom: 60px;

        .el-form-item__label {
          font-size: 36px;
        }

        .el-form-item__content {
          .el-form-item__error {
            font-size: 30px;
          }

          .el-input {
            font-size: 32px;
          }

          .el-button {
            font-size: 30px;

            &.el-button--success {
              font-size: 50px;
              padding: 12px 40px;
            }
          }

          .el-input__inner {
            height: 50px;
          }
        }
      }
    }

    /deep/.el-tree {
      height: 100%;
    }
  }
}
</style>
