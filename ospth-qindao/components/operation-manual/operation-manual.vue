<template>
	<view>
		<u-popup v-model="showPopup" mode="center" border-radius="14"  width="90%" height="auto">
			<view class="popup-content">
				<view class="popup-title">
					操作手册
				</view>
				<view class="popup-box" @click="openThePop('file')">
					<view class="img-bg">
						<img src="./images/file.png" alt=""  />
					</view>
					<view class="popup-name">
						<view>操作文档</view>
						<view>查看偿还贷提取详细填写说明</view>
					</view>
				</view>

				<view class="popup-box" @click="openThePop('video')">
					<view class="img-bg2">
						<img src="./images/video.png" alt=""  />
					</view>
					<view class="popup-name">
						<view>操作视频</view>
						<view>观看偿还贷提取实搡演示视频</view>
					</view>
				</view>
			</view>
		</u-popup>

		<u-popup v-model="showModalFile" mode="center" border-radius="14"  width="90%" height="80%">
			<view class="pdfContent" v-if="allUrl">
				<iframe ref="pdfIframe" :src="allUrl" @load="fnLoad" ></iframe>
			</view>
		</u-popup>

		<!-- 视频弹窗 -->
		<view class="modal" v-show="showModalVideo">
		  <view class="modal-box" @click.stop>
		    <video
		      class="video"
		      src="https://www.w3school.com.cn/i/movie.mp4"
		      controls
		      playsinline
		      webkit-playsinline="true"
		      x5-video-player-type="h5-page"
			  @fullscreenchange="fullscreenchange"
			  @error="videoErrorCallback"
		    ></video>
		    <view class="close" @click="showModalVideo=false">关闭</view>
		  </view>
		</view>
	</view>
</template>

<script>
	export default {
		name: '',
		props: {
			showManual: {
				type: Boolean,
				default: false
			},
		},
		data(){
			return {
				showPopup: false,
				showModalFile: false,
				showModalVideo: false,
				previewUrl: '',
				// https://wty-1318311083.cos.ap-chengdu.myqcloud.com/test.doc
				allUrl: '',
				viewerUrl: '/static/pdf/web/viewer.html', // 就是我们web目录下的viewer.html文件路径，注意路径不要错了
				pdf: '/static/document.pdf',
			}
		},
		watch: {
			showManual(newVal) {
				this.showPopup = newVal
			},
			showPopup(newVal) {
				if (!newVal) {
					this.$emit('closePop')
				}
			}
		},
		created() {
			this.allUrl = this.viewerUrl + '?file=' + this.pdf
		},
		methods:{
			openThePop(type){
				if(type == 'file'){
					this.showModalFile = true
				}else{
					this.showModalVideo = true
				}
			},
			fnLoad() {
				//检查pdf是否加载完成
				if(this.checkInterval) {
					clearInterval(this.checkInterval)
				}
				this.checkInterval = setInterval(() => {
					if (this.$refs.pdfIframe && this.$refs.pdfIframe.contentDocument) {
						let element = this.$refs.pdfIframe.contentDocument;
						if (element.getElementById("viewer")) {
							//预览成功
							let pdfViewer = element.getElementById("viewer");
							if (pdfViewer.getElementsByClassName("page") && pdfViewer.getElementsByClassName("page").length > 0) {
								clearInterval(this.checkInterval);
							}
						}
						if (element.getElementById("errorMessage") && element.getElementById("errorMessage").innerText) {
							clearInterval(this.checkInterval);
							Dialog.alert({
								title: '提示',
								message: '预览文件加载失败！'
							})
							element.getElementById("errorWrapper").removeAttribute("hidden")
						}
					}
				}, 200);
			},
			fullscreenchange(e){
				console.log(e)
				if(e.detail.fullScreen){
					this.showModalVideo = false
					this.$emit('closePop')
				} else {
					this.showModalVideo = true
					this.$emit('showPop')
				}

			},
		}
	}
</script>

<style scoped lang="less">
	.popup-content {
		padding: 36rpx 0 36rpx 0;

		.popup-title {
			text-align: center;
			font-size: 32rpx;
			color: #646464;
		}

		.popup-box {
			background: #F8F9FA;
			padding: 24rpx;
			margin-top: 24rpx;
			display: flex;
			align-items: center;

			.img-bg {
				background: #E8F4FF;
				border-radius: 50%;
				width: 100rpx;
				height: 100rpx;
				display: flex;
				align-items: center;
				justify-content: center;

				img {
					width: 60rpx;
					height: 60rpx;
				}
			}

			.img-bg2 {
				background: #FDF2E8;
				border-radius: 50%;
				width: 100rpx;
				height: 100rpx;
				display: flex;
				align-items: center;
				justify-content: center;

				img {
					width: 60rpx;
					height: 60rpx;
				}
			}

			.popup-name {
				margin-left: 24rpx;

				>view:nth-child(1){
					font-size: 30rpx;
					font-weight: bold;
				}

				>view:nth-child(2){
					color: #909191;
					margin-top: 18rpx;
					font-size: 26rpx;
				}
			}
		}
	}

	.pdfContent {
			height: 100%;
			overflow: hidden; /* 隐藏滚动条 */
			iframe {
				height: 100%;
				width: 100%;
				border: none;
			}

			.video-box {
			  width: 100vw;
			  height: 100vh;
			  background: #000;
			  display: flex;
			  align-items: center;
			  justify-content: center;
			}
			.video-player {
			  width: 100%;
			  height: auto;
			  object-fit: contain;
			}
	}

	/* 全屏必须用全局样式 */
	.modal {
	  position: fixed;
	  top: 0;
	  left: 0;
	  width: 100vw;
	  height: 100vh;
	  background: rgba(0, 0, 0, 0.8);
	  z-index: 999999 !important;
	  display: flex;
	  align-items: center;
	  justify-content: center;
	}
	.modal-box {
	  width: 90%;
	  background: #000;
	  position: relative;
	  z-index: 9999999 !important;
	}
	.video {
	  width: 100%;
	  height: 240px;
	  object-fit: cover;
	}
	.close {
	  position: absolute;
	  top: -40px;
	  right: 0;
	  color: #fff;
	  font-size: 16px;
	  padding: 5px 10px;
	}
	.btn {
	  padding: 10px 20px;
	  background: #1677ff;
	  color: #fff;
	  margin: 20px;
	}
</style>
