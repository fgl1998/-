<template>
	<view style="height: 100%;">
		<!-- <van-nav-bar title="证明验真" @click-left="onClickLeft" left-text="返回" left-arrow>
			<template #title>
				<van-dropdown-menu>
					<van-dropdown-item :title="reportName" v-model="reportId" @change="fnToPrint" :options="reportList" />
				</van-dropdown-menu>
			</template>
		</van-nav-bar> -->
		<h-navbar v-if="showHeader == '1'" :title="type == '1'?'证明验真':'结果物打印'" :border-bottom="false" title-color="#fff" back-icon-color="#fff"
			:background="{ background: '#4092ff' }" zIndex='999'></h-navbar>
		<van-dropdown-menu>
			<van-dropdown-item :title="reportName" v-model="reportId" @change="fnToPrint" :options="reportList" />
		</van-dropdown-menu>
		<view class="pdfContent" v-if="pdfUrl">
			<iframe ref="pdfIframe" :src="pdfUrl" @load="fnLoad"></iframe>
		</view>
	</view>
</template>

<script>
	import { Dialog } from 'vant';
	export default {
		data() {
			return {
				pdfUrl: '',
				projectNo: '',
				reportList: [],
				reportId: '',
				reportName: '表单',
				checkInterval: null,
				showHeader: '1',
				type: '1'
			}
		},
		onLoad(option) {
			this.projectNo = option.projectNo
			this.type = option.type
			if(typeof option.showHeader != 'undefined') {
				this.showHeader = option.showHeader
			}
			this.queryReport()
			if(this.checkInterval) {
				clearInterval(this.checkInterval)
			}
		},
		methods: {
			onClickLeft() {
				uni.navigateTo({
					url:'/pages/servicePage/servicePage'
				})
			},
			queryReport() {
				let param = {
					acceptId: this.projectNo
				}
				this.$base.post("/osa/queryReportByProjectNo", param, (res)=> {
					if(res.resultSet && res.resultSet.length > 0) {
						let list = res.resultSet
						list.forEach((item)=>{
							item.text = item.reportName
							item.value = item.reportId
							if(item.reportName.indexOf("受理单") != -1) {
								this.reportId = item.reportId
								this.reportName = item.reportName
							}
						})
						this.reportList = list
						if(!this.reportId) {
							this.reportId = this.reportList[0].reportId
							this.reportName = this.reportList[0].reportName
						}
						this.fnToPrint()
					} else {
						Dialog.alert({
							title: '提示',
							message: '未获取报表信息！'
						})
					}
				})
			},
			fnToPrint() {
				for(let i in this.reportList) {
					if(this.reportList[i].reportId == this.reportId) {
						this.reportName = this.reportList[i].reportName
						break
					}
				}
				let param = {
					reportId: this.reportId
				}
				this.$base.post("/osa/exportReportAsString", param, (res)=> {
					if(!res.data) {
						Dialog.alert({
							title: '提示',
							message: '未获取报表信息！'
						})
						return
					}
					uni.setStorageSync("pdfBase64", "data:application/pdf;base64,"+res.data)
					this.pdfUrl = "../../template/h5/static/pdf/web/viewer.html?showBase64=1&isSimpleShowMode=true&isDownload=false&isPrint=false"
				},(err)=> {
					Dialog.alert({
						title: '提示',
						message: '未获取报表信息！'
					})
				})
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
			}
		}
	}
</script>

<style scoped lang="less">
	/deep/ .van-dropdown-menu__title--active {
		color: #4092ff;
	}
	/deep/ .van-dropdown-item__option--active {
		color: #4092ff;
	}
	/deep/ .van-dropdown-item__option--active .van-dropdown-item__icon {
		color: #4092ff;
	}
	.pdfContent {
		height: calc(100% - 92px);
		iframe {
			height: 100%;
			width: 100%;
			border: none;
		}
	}
</style>
