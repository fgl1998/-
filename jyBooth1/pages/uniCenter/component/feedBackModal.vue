<template>
  <div class="feedBack" v-if="feedBackVisible">
    <div style="  display: flex;justify-content: space-between;align-items: center;margin-bottom: 30px">
      <div><span class="title">招聘会反馈</span></div>
      <div><span style="cursor: pointer" @click="onCancel">X</span></div>
    </div>
  <el-form ref="form" :model="form" :rules="rules" label-width="auto" style="max-width: 600px">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>现场收到的简历数：{{form.acb3d1}}</span>
      </div>
      <el-form-item label="初步达成意愿人数" prop="acb3d1" v-show="false">
        <el-input-number v-model="form.acb3d1" :min="0" :disabled="true"></el-input-number>
      </el-form-item>
      <el-form-item label="本科及以上简历数" prop="acb3d4">
         <el-input-number v-model="form.acb3d4" :min="0" ></el-input-number>
      </el-form-item>
      <el-form-item label="大专及以下简历数" prop="acb3d5">
        <el-input-number v-model="form.acb3d5" :min="0" ></el-input-number>
      </el-form-item>
    </el-card>
     <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>达成求职意向数：{{form.acb3d2}}</span>
      </div>
      <el-form-item label="初步达成意愿人数" prop="acb3d2" v-show="false">
        <el-input-number v-model="form.acb3d2" :min="0" :disabled="true"></el-input-number>
      </el-form-item>
      <el-form-item label="博士人数" prop="acb3d6">
        <el-input-number v-model="form.acb3d6" :min="0" ></el-input-number>
      </el-form-item>
      <el-form-item label="硕士人数" prop="acb3d7">
        <el-input-number v-model="form.acb3d7" :min="0" ></el-input-number>
      </el-form-item>
      <el-form-item label="本科人数" prop="acb3d8">
        <el-input-number v-model="form.acb3d8" :min="0" ></el-input-number>
      </el-form-item>
      <el-form-item label="大专人数" prop="acb3d9">
        <el-input-number v-model="form.acb3d9" :min="0" ></el-input-number>
      </el-form-item>
      <el-form-item label="中专及以下" prop="acb3da">
        <el-input-number v-model="form.acb3da" :min="0" ></el-input-number>
      </el-form-item>
    </el-card>
    <el-form-item class="btns">
      <el-button type="primary" :disabled="feedBackButton" @click="onSubmit">确认</el-button>
      <el-button @click="onCancel">取消</el-button>
    </el-form-item>
  </el-form>
  </div>
</template>

<script>
export default {
  name: "feedBackModal",
  props:{
    feedBackVisible:{
      type:Boolean,
      default:false
    },
    feedBackData:{
      type:Object,
      default: {}
    },
    feedBackButton:{
      type:Boolean,
      default:false
    },
  },
  data(){
    return{
      form:{
        acb3d1: null,
        acb3d4: null,
        acb3d5: null,
        acb3d2: null,
        acb3d6: null,
        acb3d7: null,
        acb3d8: null,
        acb3d9: null,
        acb3da: null,
      },
      rules: {
        acb3d4: [
          { required: true, message: "请输入本科及以上简历数", trigger: "change" },
          { pattern:  /^([0]|[1-9][0-9]*)$/, message: '请输入大于0的整数', trigger: ['blur','change'] },
        ],
        acb3d5: [
          { required: true, message: "请输入大专及以下简历数", trigger: "change" },
          { pattern:  /^([0]|[1-9][0-9]*)$/, message: '请输入大于0的整数', trigger: ['blur','change'] },
        ],
        acb3d2: [
          { required: true, message: "请输入初步达成意愿人数", trigger: "change" },
          { pattern:  /^([0]|[1-9][0-9]*)$/, message: '请输入大于0的整数', trigger: ['blur','change'] },
        ],
        acb3d6: [
          { required: true, message: "请输入博士人数", trigger: "change" },
          { pattern:  /^([0]|[1-9][0-9]*)$/, message: '请输入大于0的整数', trigger: ['blur','change'] },
        ],
        acb3d7: [
          { required: true, message: "请输入硕士人数", trigger: "change" },
          { pattern:  /^([0]|[1-9][0-9]*)$/, message: '请输入大于0的整数', trigger: ['blur','change'] },
        ],
        acb3d8: [
          { required: true, message: "请输入本科人数", trigger: "change" },
          { pattern:  /^([0]|[1-9][0-9]*)$/, message: '请输入大于0的整数', trigger: ['blur','change'] },
        ],
        acb3d9: [
          { required: true, message: "请输入大专人数", trigger: "change" },
          { pattern:  /^([0]|[1-9][0-9]*)$/, message: '请输入大于0的整数', trigger: ['blur','change'] },
        ],
        acb3da: [
          { required: true, message: "请输入中专及以下", trigger: "change" },
          { pattern:  /^([0]|[1-9][0-9]*)$/, message: '请输入整数', trigger: ['blur','change'] }
        ],
      }
    }
  },
  watch:{
    feedBackVisible(val) {
      if(val){
        if(this.feedBackData.acb3d0){
          //console.log('feedBackData.acb3d0',this.feedBackData.acb3d0)
          this.form=this.feedBackData
        }else {
          this.form={
            acb3d1:null,
            acb3d4:null,
            acb3d5:null,
            acb3d2:null,
            acb3d6:null,
            acb3d7:null,
            acb3d8:null,
            acb3d9:null,
            acb3da:null,
          }
        }
      }
    },
    acb3d1: {
      handler(newVal, oldVal) {
        if (newVal) {
          this.form.acb3d1 = newVal
        }
      },
      deep: true,
      immediate: true
    },
    acb3d2: {
      handler(newVal, oldVal) {
        if (newVal) {
          this.form.acb3d2 = newVal
        }
      },
      deep: true,
      immediate: true
    },
  },
  computed: {
    acb3d1() {
      if (this.form.acb3d4 == 0 && this.form.acb3d5 == 0) {
        return 0
      } else {
        return Number(this.form.acb3d4) + Number(this.form.acb3d5)
      }
    },
    acb3d2() {
      if (this.form.acb3d6 == 0 && this.form.acb3d7 == 0 && this.form.acb3d8 == 0 && this.form.acb3d9 == 0 && this.form.acb3da == 0) {
        return 0
      } else {
        return Number(this.form.acb3d6) + Number(this.form.acb3d7) + Number(this.form.acb3d8) + Number(this.form.acb3d9) + Number(this.form.acb3da)
      }
    }
  },
  methods:{
    onSubmit(){
      this.$refs.form.validate((valid) => {
        if (valid) {
          let data = this.form
          if(this.feedBackData.acb3d0){
            data.acb3d0=this.feedBackData.acb3d0
          }
          if (data.acb3d2 || data.acb3d2 == 0) {
            data.acb3d2=String(data.acb3d2)
          }
          // data.acb3d1 = String(Number(data.acb3d4) + Number(data.acb3d5))
          if (data.acb3d1 && data.acb3d2 && Number(data.acb3d1) < Number(data.acb3d2)) {
            uni.showToast({title:'【现场收到简历总数】低于【初步达成意愿人数】，请检查输入数据是否正确',icon: "error",})
            return;
          }
          this.$emit('submitFeedBack',data)
        }
        
      });
    },
    changeNum(value) {
      // console.log('value', value);
    },
    onCancel(){
      this.$emit('cancel')
    },
  }
}
</script>

<style scoped>
.feedBack{
  width: 30%;
  height: 75%;
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: white;
  padding: 30px;
  padding-top: 15px;
  box-shadow: 2px 2px 2px 1px rgba(0, 0, 0, 0.3);
  z-index: 999;
  overflow: auto;
}
.title{
  font-size: 18px;
  font-family: Source Han Sans CN;
  font-weight: 500;
  color: #333333;
}

/deep/ .btns .el-form-item__content{
   margin-left: 0px !important;
   text-align: center;
}
.box-card{
  margin-bottom: 16px;
}

.el-input-number{
  width: 100%;
}
</style>
