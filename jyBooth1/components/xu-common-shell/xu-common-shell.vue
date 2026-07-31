<template>
	<div class="xu-common-shell">
		<common-header :aab004="title" :type="type"/>
		<div class="content">
		  <slot></slot>
		</div>
	</div>
</template>
<script>
import commonHeader from "../common-header/common-header.vue";
import feedBackModal from "../../pages/uniCenter/component/feedBackModal";
export default {
  props: {
    type: {
      type: String,
      default: "1",
    },
    title: {
      type: String,
      default: "",
    },
    navTypeIndex: {
      type: Number,
      default: 1,
    },
  },
  components: {
    commonHeader,
    feedBackModal
  },
  mounted() {
	this.userInfo=uni.getStorageSync("loginInfo")
  },
  data() {
    return {
      isFlag: false,
      feedBackVisible:false, // 反馈弹窗显示
      feedBackData: null, // 反馈数据
      feedBackButton:false, //反馈按钮置灰
      userInfo:null
    };
  },
  methods: {
    checkRotate() {
      if (this.isFlag) {
        this.isFlag = false;
      } else {
        this.isFlag = true;
      }
    },
    // 展示招聘会反馈弹窗
    showFeedback(){
      const params = {}
      params.aab001 = this.userInfo.aab001
      params.acb330 = this.userInfo.acb330
      params.apiCode = 'jy204_hrm133'
      params.method = 'jy204_hrm133'
      this.$http.request('/api/business/getData.do','post',params,true).then((data)=> {
        if (data.errors.length > 0) {
          uni.showToast({
            title: data.errors[0].msg,
            icon: 'error',
          })
        } else {
          //console.log('进入',data)
          this.feedBackData=data.data.cb3dVo
          this.feedBackVisible=true
        }
      })
    },
    // 提交招聘会反馈
    submitFeedBack(data){
      const params = data
      params.aab001 = this.userInfo.aab001
      params.acb330 = this.userInfo.acb330
      if(params.acb3d0){
        params.apiCode = 'jy204_hrm135'
        params.method = 'jy204_hrm135'
      }else {
        params.apiCode = 'jy204_hrm134'
        params.method = 'jy204_hrm134'
      }
      this.$http.request('/api/business/getData.do','post',params,true).then((data)=> {
        if (data.errors.length > 0) {
          uni.showToast({
            title: data.errors[0].msg,
            icon: 'error',
          })
        } else {
        uni.showToast({
            title: '反馈成功',
            icon: 'success',
          })
        }
        this.feedBackButton=true
      })
    },
    // 关闭招聘会反馈弹窗
    cancelFeedBack(){
      this.feedBackData=null
      this.feedBackVisible=false
      this.feedBackButton=false
    },
  },
};
</script>
<style lang="less" scoped>
.xu-common-shell {
  width: 1920px;
  height: 1080px;
  position: relative;
  overflow: hidden;
  z-index: 0;
  background: url('../../static/images/bg_login.png') 100% no-repeat;
  background-size: 100% 100%;
}
.content {
	position: absolute;
	width: 1836px;
	height: 892px;
	top: 156px;
	left: 42px;
}
</style>
