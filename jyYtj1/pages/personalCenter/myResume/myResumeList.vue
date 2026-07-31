<template>
	<div class="page">
		<!-- 简历列表 -->
		<common-header></common-header>

		<div class="page-wrap">
			<div class="wrap-center">
				<div class="wrap-box">
					<div class="wrap-con">
						<div class="wrap-title">
							<div class="title-lt">
								点击下方列表可查看<span>简历详情</span>
							</div>
						</div>
						<div class="wrap-list">
							<div class="list-con">
								<table class="table">
									<tr>
										<th>简历名称</th>
										<th>求职意向</th>
									</tr>
									<tr v-for="(item,index) in resumeList" :key="index" @click="toPage(item)">
										<td>{{item.acc201}}</td>
										<td>{{item.aca112}}</td>
										</td>
									</tr>
								</table>
							</div>
						</div>
					</div>
					<div class="wrap-page">
						<common-pager :totals="pageTotal" :currentPage="currentPage" :pageSize="pageSize"
							@currentChange="currentChange"></common-pager>
					</div>
				</div>
			</div>
		</div>
		<common-footer :userName="userInfo.aac003" :isLogin="isLogin" @login="login"></common-footer>
	</div>
</template>

<script>
	export default {
		onLoad: function() {
			this.userInfo = uni.getStorageSync("userInfo");
			if (this.userInfo) {
				this.isLogin = true;
			} else {
				this.isLogin = false;
				this.$utils.showToast("请先登录")
			}
			this.init();
		},
		data() {
			return {
				userInfo: {},
				isLogin: false,
				currentPage: 1,
				pageSize: 7,
				pageTotal: 0,
				resumeList: []
			}
		},
		methods: {
			init() {
				this.currentPage = 1;
				let param = {};
				param.method = "getResumeListByUser";
				param.start = this.currentPage;
				param.rows = this.pageSize;
				param.aac001 = this.userInfo.aac001;
				this.toShowToast()
			},
			//分页返回页码
			currentChange(val) {
				//console.log("翻到第" + val + "页了");
				this.currentPage = val;
				let param = {};
				param.method = "getResumeListByUser";
				param.start = val;
				param.rows = this.pageSize;
				param.aac001 = this.userInfo.aac001;
				this.toShowToast()
			},
			toShowToast(){
				this.$utils.request(param, res => {
					if (res.code === "-1") {
						this.$utils.showToast("调用服务异常")
						return
					} else {
						if (res.data.resumeList) {
							this.resumeList = res.data.resumeList.list;
							this.pageTotal = res.data.resumeList.total;
						}
					}
				})
			},
			toPage(item) {
				this.$utils.navigateTo('/pages/personalCenter/myResume/myResume?item=' +
					encodeURIComponent(JSON.stringify(item)))
			}
		},

	}
</script>

<style lang="scss" scoped>
	.btn-blue {
		margin-left: 14px;
	}

	.status {
		display: inline-block;
		width: 84px;
		height: 40px;
		line-height: 40px;
		border-radius: 4px;
		font-size: 18px;
		text-align: center;

		&.status0 {
			color: #ff5a00;
			background: #fff7f2;
			border: 2px solid rgba(255, 90, 0, 0.24);
		}

		&.status1 {
			color: #1194ff;
			background: #f3faff;
			border: 2px solid rgba(17, 148, 255, 0.24);
		}

		&.status2 {
			color: #929292;
			background: #eeeeee;
			border: 2px solid rgba(176, 176, 176, 0.36);
		}
	}
</style>
