<template>
	<!-- 劳务派遣电子证照 扫码直接跳转 无事项配置 无需登录-->
	<view>
		<iframe id="iframePage" ref="iframePage" :src="iframeUrl" width="100%" :height="iframeHeight"
			frameborder="0" :style="{height: iframeHeight + 'px'}"></iframe>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				iframeUrl: '',
				iframeHeight: 320,
			}
		},
		onLoad(options) {
			if(options.codeparam){
				const codeparam = options.codeparam
				uni.setNavigationBarTitle({
					title: '劳务派遣电子证照验签'
				});
				this.iframeUrl = this.$base.BASE_IP + '/template/h5/index.html#/pagesUnit/certificate/companyCertificate?codeparam=' + codeparam
			}else if(options.hrparam){
				const hrparam = options.hrparam
				uni.setNavigationBarTitle({
					title: '人力资源电子证照验签'
				});
				this.iframeUrl = this.$base.BASE_IP + '/template/h5/index.html#/pagesUnit/certificate/hrCertificate?hrparam=' + hrparam
			}
			
			//3.监听iframe加载完成
			this.fnPageLoading()
		},
		methods: {
			// iframe加载时添加蒙层效果或其他操作
			fnPageLoading() {
				const _this = this
				try {
					let iframe = this.$refs.iframePage
					if (typeof iframe.attachEvent != 'undefined') {
						// 兼容IE写法
						iframe.attachEvent('onload', function() {
							_this.getIframeHeight()
						})
					} else {
						iframe.onload = function() {
							// iframe加载完成后要进行的操作
							_this.getIframeHeight()
						}
					}
				} catch(e) {
					this.iframeHeight = 600
				}
			},
			//获取iframe高度
			getIframeHeight() {
				setTimeout(() => {
					const iframe = this.$refs.iframePage.contentWindow
					const height = iframe.document.documentElement.scrollHeight
					this.iframeHeight = height + 80
				}, 300)
			},
		}
	}
</script>

<style>

</style>