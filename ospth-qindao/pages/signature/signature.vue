<template>
	<view>
		<h-signature @cancle="cancle" @complate="complate" :disabled="disabled"></h-signature>
		<van-overlay :show="show">
		    <div class="wrapper">
		        签名时请锁定手机的旋转功能
		    </div>
		</van-overlay>
	</view>
</template>

<script>
import { Dialog } from 'vant';
	export default {
		components:{},
		data() {
			return {
				show: false,
				projectNo: '',
				disabled: false
			}
		},
		onLoad(option) {
			this.projectNo = option.reportId;
			window.addEventListener("resize", this.renderResize, false);
		},
		onLaunch() {
			window.removeEventListener("resize", this.renderResize, false);
		},
		methods: {
			cancle() {
				
			},
			complate(base64) {
				if(!this.disabled){
					let param ={
						projectNo: this.projectNo,
						base64: base64
					}
					this.$base.post("/file/uploadBase64Sign",param, data =>{
						if(data.code!='200'){
							Dialog.alert({
							  message: '签名失败',
							}).then(() => {
							  // on close
							});
						}else{
							this.disabled = true
							Dialog.alert({
							  message: '签名成功',
							}).then(() => {
							  // on close
							});
						}
					})
				}
				
			},
			renderResize() {
				//获取当前窗口的长和高
			    let width = document.documentElement.clientWidth;
			    let height = document.documentElement.clientHeight;
			    if (width > height) {
					//长大于宽则表示横屏，弹出遮罩层
			        this.show = true;
			    } else {
					//竖屏则移除遮罩层
			        this.show = false;
			    }
			}
		}
	}
</script>

<style>
	.wrapper {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 100%;
		height: 100%;
		color: #ffffff;
	}
	.image {
		width: 100%;
	}
</style>