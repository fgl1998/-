<!-- 面试邀请 -->
<template>
  <div class="invitateInterview">
	  <div class="form">
		  <el-form
			ref="form"
			:model="invitateForm"
			layout="vertical"
			:col="2"
		  :rules="rules"
			:form-layout="true"
			id="invitateInterview"
		  >
			<!-- <el-form-item label="选择模板" fieldDecoratorId="acb220">
			  <el-select
				placeholder="请选择"
				:getPopupContainer="getPopupContainer"
				@change="getContactsMsg"
			  >
				<el-select-option
				  v-for="(item, index) in cb22Vos"
				  :value="item.acb220"
				  :key="index"
				>
				  {{ item.acb227 }}
				</el-select-option>
			  </el-select>
			</el-form-item> -->
	  
			<el-form-item
			  label="面试职位"
			  prop="acb210"
			  :fieldDecoratorOptions="{
				rules: [{ required: true, message: '请选择面试职位' }],
			  }"
			>
			  <el-select
				  v-model="invitateForm.acb210"
				placeholder="请选择"
				@change="cb21Select"
			  >
				<el-option
				  v-for="(item, index) in cb21Vos"
				  :value="item.acb210"
				  :label="item.acb213"
				  :key="index"
				>
				</el-option>
			  </el-select>
			</el-form-item>
	  
			<el-form-item
			  label="被邀请人"
			  prop="aac003"
			  :fieldDecoratorOptions="{
				rules: [{ required: true, message: '请填写被邀请人' }],
			  }"
			  :initValue="aac003"
			>
			  <el-input disabled v-model="invitateForm.aac003" placeholder="请输入" />
			</el-form-item>
	  
			<el-form-item
			  label="面试方式"
			  prop="acc315"
			  :fieldDecoratorOptions="{
				rules: [{ required: true, message: '请选择面试方式' }],
			  }"
			>
			  <el-radio-group v-model="invitateForm.acc315" @change="changeRadio">
				<el-radio :label="0">线下面试</el-radio>
				<el-radio :label="1">线上面试</el-radio>
			  </el-radio-group>
			</el-form-item>
	  
			<el-form-item
			  label="面试时间"
			  prop="acb222"
			>
			  <el-date-picker
				showTime
				placeholder="选择面试时间"
				:getCalendarContainer="getPopupContainer"
				:disabledDate="disabledDate"
				:disabledTime="disabledDateTime"
				v-model="invitateForm.acb222"
				:editable="false"
			  />
			</el-form-item>
	  
			<el-form-item
			  label="面试地址"
			  prop="acb223"
			  v-if="adressFlag"
			>
	  <!--        <region-area @getValue="getWorkArea" class="special"></region-area>-->
			  <el-input v-model="invitateForm.acb223" placeholder="请输入面试地址"></el-input>
			</el-form-item>
	  
			<el-form-item
			  label="联系人"
			  prop="acb224">
			  <el-input v-model="invitateForm.acb224" placeholder="请输入" />
			</el-form-item>
	  
			<el-form-item
			  label="联系电话"
			  prop="acb225" >
			  <el-input v-model="invitateForm.acb225" placeholder="请输入" />
			</el-form-item>
	  
			<el-form-item
			  label="邀请说明"
			  prop="acb221"
			  :fieldDecoratorOptions="{
				rules: [{ required: true, message: '请填写邀请说明' }],
			  }"
			  :span="24"
			  class="textArea"
			>
			  <el-input
				  v-model="invitateForm.acb221"
				type="textarea"
				placeholder="请填写邀请说明"
				:rows="4"
				:show-length="true"
				width="100%"
			  />
			</el-form-item>
		  </el-form>
	</div>
    
    <div class="footer">
      <el-button style="margin-right: 16px" @click="handleCancel"
        >取消</el-button
      >
      <el-button type="primary" @click="fnSubmit" :disabled="submitDisabled"
        >确定</el-button
      >
    </div>
  </div>
</template>

<script>
import moment from "moment";
// import regionArea from "../../common/part/regionArea.vue";

export default {
  name: "invitateInterview",
  props: {
    aac001: {
      type: String,
    },
    aac003: {
      type: String,
    },
    acc200: {
      type: String,
    },
    acc300: {
      type: String,
    },
    acb210: {
      type: String,
    },
    showInvitate: {
      type: Boolean,
    },
  },
  components: {
    // regionArea,
  },
  data() {
    return {
      isShow: this.showInvitate,
      adressFlag: true,
      userInfo: {},
      //职位
      cb21Vos: [],
      //模板
      cb22Vos: [],
      faceTime: "",
      submitDisabled: false,
      invitateForm:{
        acb210: null,
        acb224: '',
        acb225: '',
        acb223: '',
        aac003: '',
        acb221: '',
        acb222: '',
        acc315: '',
      },
      rules: {
        acb210: [
          { required: true, message: "请选择面试职位", trigger: "change" },
        ],
        aac003: [
          { required: true, message: "请填写被邀请人", trigger: "change" },
        ],
        acc315: [
          { required: true, message: "请选择面试方式", trigger: "change" },
        ],
        acb222: [
          { required: true, message: "请选择面试时间", trigger: "change" },
        ],
        acb223: [
          { required: true, message: "请输入面试地址", trigger: "change" },
        ],
        acb224: [
          { required: true, message: "请输入联系人", trigger: "change" },
        ],
        acb225: [
          { required: true, message: "请输入联系电话", trigger: "change" },
        ],
        acb221: [
          { required: true, message: "请输入邀请说明", trigger: "change" },
        ],
      }
    };
  },

  watch: {
    showInvitate: {
      handler(val) {
        //console.log('val', val)
        if (val) {
          //console.log('进入')
          this.userInfo = JSON.parse(window.localStorage.getItem("loginInfo")).data;
          this.$nextTick(()=>{
            this.$refs.form.resetFields();
            if(this.aac003){
              this.invitateForm.aac003=this.aac003
            }
            this.searchEvent();
          })
        }
      },
      deep: true,
      immediate: true,
    },
  },

  methods: {
    moment,
    //查询职位信息
    searchEvent() {
      let params = {};
      params.aab001 = this.userInfo.aab001;
      params.aac001 = this.userInfo.aac001;
      params.acb228 = "0";
      params.apiCode = "jy201_hrm119";
      params.method = "jy201_hrm119";
      this.$http.request('/api/business/getData.do','post',params,true).then((data)=>{
            if(data.errors.length>0){
              uni.showToast({
                title: data.errors[0].msg,
                icon:'error',
              })
            }else{
              let resultData = data.data;
              this.cb21Vos = resultData.cb21Vos;
              this.cb22Vos = resultData.cb22Vos;
              //console.log('cb21Vos',this.cb21Vos)
              if(this.acb210){
                this.cb21Select(this.acb210)
              }
            }
      })
    },
    //职位选择
    cb21Select(value) {
      //console.log('cb21Vos',this.cb21Vos)
      //console.log('传入的值',value)
      let cb21Obj = this.cb21Vos.find((item) => {return item.acb210 == value+''});
      //console.log('获取的对象',cb21Obj)
      if(cb21Obj){
        this.invitateForm.acb210=cb21Obj.acb210;
        this.invitateForm.acb224=cb21Obj.aac003;
        this.invitateForm.acb225=cb21Obj.aac307;
        this.invitateForm.acb223=cb21Obj.acb261;
      }
    },
    // 获取说明
    getContactsMsg(value) {
      let record=this.invitateForm
      let cb22Obj = this.cb22Vos.find((item) => item.acb220 == value);
      this.invitateForm.acb221=cb22Obj.acb221
      this.invitateForm.acb224=cb22Obj.acb224
      this.invitateForm.acb225=cb22Obj.acb225
      if(record){
        this.invitateForm.acb210=record.acb210;
        this.invitateForm.acb224=record.acb224;
        this.invitateForm.acb225=record.acb225;
        this.invitateForm.acb223=record.acb223;
      }
    },
    // 确定
    //单位面试邀请(企业自己查询人才进行面试邀请)必传字:aab095: 是否人力资源机构(1是，0否); aab001; 单位或机构编号aab004: 单位或机构名称; aac001:个人编号， aCC200简历编号
    fnSubmit() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          this.invitateForm.acb222 = moment(this.invitateForm.acb222).format("YYYY-MM-DD HH:mm");
          let params = { ...this.invitateForm };
          params.aab095 = this.userInfo.aab095;
          params.aab001 = this.userInfo.aab001;
          params.aab004 = this.userInfo.aab004;
          params.acc300 = this.acc300
          params.hrAac001 = this.userInfo.aac001
          params.hrAac003 = this.userInfo.aac003

          params.aac001 = this.aac001;
          params.acc200 = this.acc200;
          params.acc04v = "0";
          params.yae100 = "25";
          params.apiCode = "jy201_hrm101";
          params.method = "jy201_hrm101";
          this.$http.request('/api/business/getData.do','post',params,true).then((data)=>{
            if(data.errors.length>0){
              uni.showToast({
                title: data.errors[0].msg,
                icon:'error',
              })
            }else{
              this.$message.success("邀请成功");
              this.submitDisabled = true;
              let invitateMesg = data.data.data;
              invitateMesg.state = true;
              this.$emit("getInvitateMesg", invitateMesg);
              // this.$eventBus.$emit('statistic')
            }
          })
        }
      });
    },
    // 取消
    handleCancel() {
      //console.log(222)
      this.isShow = false;
      this.submitDisabled = false;
      // this.form.resetFields()
      this.$refs.form.resetFields();
      this.$emit("colseInvitate", this.isShow);
    },
    changeRadio(value) {
      if (value === 1) {
        this.adressFlag = false;
        this.invitateForm.acb223=""
      } else {
        this.adressFlag = true;
      }
    },
    // 获取工作区域
    getWorkArea(value) {
      this.invitateForm.acb223=value.label
    },
    // 下拉框定位
    getPopupContainer() {
      return document.getElementById("invitateInterview");
    },
    // 限定面试时间
    range(start, end) {
      const result = [];
      for (let i = start; i < end; i++) {
        result.push(i);
      }
      return result;
    },
    disabledDate(current) {
      return current < moment().startOf("day");
    },
    disabledDateTime() {
      let chooseTime = moment(this.faceTime).format("YYYYMMDD");
      let nowDay = moment(new Date()).format("YYYYMMDD");
      let nowHour = moment(new Date()).format("HH");
      if (nowDay == chooseTime) {
        return {
          disabledHours: () => this.range(0, Number(nowHour) + 1),
        };
      } else {
        return;
      }
    },
  },
};
</script>
<style lang="less" scoped>
.invitateInterview {
  width: 100%;
  height: 500px;
  //padding: 50px;
  box-sizing: border-box;
  background-color: #fff;
  .form {
	  height: 460px;
	  overflow: auto;
  }
  // > form {
	 //  border: 1px solid red;
  //   width: 100%;
  //   display: flex;
  //   flex-wrap: wrap;
  //   justify-content: space-between;
  // }
//   .ant-row::before {
//     display: none;
//   }
//   > div {
//     display: flex;
//     justify-content: flex-end;
//     margin-top: 10px;
//     > button {
//       width: 100px;
//       height: 40px;
//       font-size: 16px;
//     }
//   }
// }
// /deep/.ant-form-item:not(.textArea) {
//   width: 47%;
// }
// /deep/ .ant-form label,
// /deep/.ant-form-item-info {
//   font-size: 16px;
// }
// /deep/.ant-form-item:nth-of-type(2n) {
//   // margin-left: 14px;
// }
// /deep/.ant-radio-wrapper-checked {
//   > .ant-radio-checked {
//     > .ant-radio-inner {
//       background-color: #007dee;
//     }
//     .ant-radio-inner::after {
//       top: 4px;
//       left: 4px;
//       width: 6px;
//       height: 6px;
//       background-color: #fff;
//     }
//   }
//   > span:nth-of-type(2) {
//     color: #007dee;
//   }
}
/deep/.ant-calendar-picker {
  width: 100%;
}
.footer {
	margin: 10px;
	text-align: right;
}
</style>
