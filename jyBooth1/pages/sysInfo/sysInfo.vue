<template>
	<view style="width: 1920px,height: 1080px;">
		<image src="../../static/images/loginBack.png" class="loginBack"></image>

		<view class="content">
			<el-form ref="form" :model="form" label-width="160px">
			  <el-form-item label="场地编号">
			    <el-input v-model="form.acb300"></el-input>
			  </el-form-item>
			  <el-form-item label="场地名称">
			    <el-input v-model="form.acb301"></el-input>
			  </el-form-item>

			  <el-form-item label="设备唯一码">
			    <el-input v-model="form.ace711"></el-input>
			  </el-form-item>

			  <el-form-item label="分区">
			    <el-select v-model="form.acb3e1">
			    		<el-option
			    		  v-for="item in cb3eList"
			    		  :label="item.acb3e1"
			    		  :value="item.acb3e1">
			    		</el-option>
			    	</el-select>
			  </el-form-item>

			  <el-form-item label="展位号码">
			    <el-input v-model="form.acb32b"></el-input>
			  </el-form-item>

			  <el-form-item>
			    <el-button type="primary" @click="onSubmit" :disabled="btnDisabled">绑定</el-button>
			  </el-form-item>
			</el-form>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {

				form: {
				  acb300: '1281071',
				  acb301: '自治区公共就业服务中心二楼',
				  ace711: uni.getSystemInfoSync().deviceId,
				  acb32b: '',
				  acb3e1: '',
				},

				cb3eList: [], //分区列表
				btnDisabled:false,
			}
		},

		mounted() {
			this.jy204_hrm141()
		},

		methods: {
			jy204_hrm141(){
				this.$http
				  .request(
				    "/api/business/getData.do",
				    "post",
				    {
				      apiCode: "jy204_hrm141",
				      method: "jy204_hrm141",
					  acb330: this.form.acb300
				    },
				    true
				  )
				  .then((res) => {
					//console.log(res);
				    if (res.data.data) {
				       this.cb3eList = res.data.data
					   this.form.acb3e1 = this.cb3eList[0].acb3e1
				    } else {
				      this.$utils.showToast(res.errors[0].msg);
				    }
				  });
			},

			onSubmit(){
				this.form.acb32b = this.form.acb32b +'-'+ this.form.acb3e1
				this.$http
				  .request(
				    "/api/business/getData.do",
				    "post",
				    {
				      apiCode: "jy204_hrm260",
				      method: "jy204_hrm260",
					  ace769: "1",
				      ...this.form
				    },
				    true
				  )
				  .then((res) => {
				    if (res.data.data) {
				       this.$utils.showToast("绑定成功")
					   let result = res.data.data
					   uni.setStorageSync("ace711",result.ace711)
					   uni.setStorageSync("ace711s",result.ace711s)
					   this.btnDisabled = true
				    } else {
				      this.$utils.showToast(res.errors[0].msg);
				    }
				  });
			}
		}
	}
</script>

<style lang="scss" scoped>
	.loginBack{
		position: absolute;
		z-index: -1;
		top: 0;
		left: 0;
		bottom: 0;
		right: 0;
		width: 1920px;
		height: 1080px;
	}

  .content{
	  position: absolute;
	  top: 98px;
	  bottom: 36px;
	  left: 100px;
	  right: 100px;
	  background: #FFFFFF;
	  border-radius: 8px;
	  padding: 28px;
	  overflow: auto;
	  .key {
	  	font-size: 28px;
	  	color: #999999;
	  	line-height: 28px;
		width: 50%;
		float: left;
	  	text {
	  		color: #FE2C2C;
	  		padding-right: 8px;
	  	}
	  }
  }
</style>
