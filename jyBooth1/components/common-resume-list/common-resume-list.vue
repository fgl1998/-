<template>
	<div class="resume-list">
		<div class="result-list-item" @click="commonResumeVisible = true" v-for="(item,index) in data" :key="index">
			<div class="top">
				<view>简历名称：</view>
				<view>{{item.acc201}}</view>
			</div>
			<div class="center">
				<div class="center-left">
					<image :src="item.aae707">
				</div>
				<div class="center-center">
					<view>{{item.aac003}}</view>
					<view>{{item.acc04t_dsc ? item.acc04t_dsc : '未知状态'}}</view>
					<view>{{item.aac004_dsc}}</view>
					<view>{{item.acc217 ? $codeConfig.getCodeLabel("ACC217", item.acc217) : '未知工作年限'}}</view>
					<view>{{item.aac011 ? $codeConfig.getCodeLabel("AAC011", item.aac011) : '未知学历'}}</view>
				</div>
				<div class="center-right">
					<view @click="positionApply(item)">投递简历</view>
				</div>
			</div>
			<div class="bottom">
				<div class="bottom-left">
					<view>{{item.acb241 ? (item.acb241 + '').split('0').join('') + 'K' : 0}}-{{item.acb242 ? (item.acb242 + '').split('0').join('') + 'K' : 0}}</view>
				</div>
				<div class="bottom-right">
					<view>优势：</view>
					<view>{{item.acc209 ? item.acc209 : '暂无描述'}}</view>
				</div>
			</div>
		</div>
		<common-resume :visible="commonResumeVisible" @close="closeCommonResume"></common-resume>
	</div>
</template>

<script>
	import commonResume from '../common-resume/common-resume.vue'
	export default {
		props:{
			data: {
				type: Array,
				default: () => []
			},
			job: {
				type: Object,
				default: ()=>{}
			}
		},
		components: {
			commonResume
		},
		data() {
			return {
				commonResumeVisible: false,
			}
		},
		methods: {
			closeCommonResume() {
				this.commonResumeVisible = false
			},
			positionApply(item) {
				let param = {
					apiCode: "jy202_hrm100",
					method: "jy202_hrm100",
					aac001: item.aac001,
					acc200: item.acc200,
					acb210: this.job.acb210,
					yae100: '19'
				}
				this.$http.request('/api/business/getData.do', 'post', param, true).then((data) => {
				  if (data.errors.length > 0) {
						 this.$message({
						   message: data.errors[0].msg,
						   type: 'error'
						 });
				  } else {
					  this.$message({
					    message: '职位投递成功，七天内不允许重复投递！',
					    type: 'success'
					  });
				  }
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.resume-list {
		width: 100%;
		height: 372px;
		padding: 12px 12px 0;
		overflow: auto;
		display: flex;
		gap: 8px;
		flex-wrap: wrap;
		justify-content: space-between;
		> div {
			cursor: pointer;
			width: 49%;
			height: 190px;
			border: 1px solid #EEEEEE;
			border-radius: 8px;
			.top {
				width: calc(100% - 23px);
				height: 37px;
				background: #E7F2FC;
				border-radius: 7px 7px 0px 0px;
				display: flex;
				padding: 19px 0 0 23px;
				>view:last-child {
					font-family: SourceHanSansCN, SourceHanSansCN;
					font-weight: 400;
					font-size: 18px;
					color: #333333;
					line-height: 18px;
					text-align: left;
					font-style: normal;
				}
			}
			.center {
				width: calc(100% - 30px);
				height: 68px;
				margin: 12px 0 0 30px;
				display: flex;
				.center-left {
					width: 85px;
					height: 68px;
					>image {
						width: 100%;
						height: 100%;
					}
				}
				.center-center {
					display: flex;
					width: calc(100% - 100px);
					height: 68px;
					margin-left: 5px;
					margin-top: 12px;
					flex-wrap: wrap;
					>view:first-child {
						// width: 100px;
						margin-right: 12px;
						height: 20px;
						font-family: SourceHanSansCNBold, SourceHanSansCNBold;
						font-weight: bold;
						font-size: 20px;
						color: #333333;
						line-height: 20px;
						text-align: left;
						font-style: normal;
					}
					>view:nth-child(2) {
						width: calc(100% - 100px);
						height: 18px;
						font-family: SourceHanSansCN, SourceHanSansCN;
						font-weight: 400;
						font-size: 18px;
						color: #666666;
						line-height: 18px;
						text-align: left;
						font-style: normal;
					}
					>view:nth-child(3) {
						width: 70px;
						height: 18px;
						font-family: SourceHanSansCN, SourceHanSansCN;
						font-weight: 400;
						font-size: 18px;
						color: #666666;
						line-height: 18px;
						text-align: left;
						font-style: normal;
					}
					>view:nth-child(4) {
						width: 90px;
						height: 18px;
						font-family: SourceHanSansCN, SourceHanSansCN;
						font-weight: 400;
						font-size: 18px;
						color: #666666;
						line-height: 18px;
						text-align: left;
						font-style: normal;
					}
					>view:nth-child(5) {
						width: 100px;
						height: 18px;
						font-family: SourceHanSansCN, SourceHanSansCN;
						font-weight: 400;
						font-size: 18px;
						color: #666666;
						line-height: 18px;
						text-align: left;
						font-style: normal;
					}
				}
				.center-right {
					width: 94px;
					height: 32px;
					background: #0682FE;
					border-radius: 4px;
					margin: 12px 12px 0 0;
					> view {
						// width: 72px;
						height: 18px;
						font-family: SourceHanSansCN, SourceHanSansCN;
						font-weight: 400;
						font-size: 18px;
						color: #FFFFFF;
						line-height: 30px;
						text-align: center;
						font-style: normal;
					}
				}
			}
			.bottom {
				padding: 10px 0 0 23px;
				display: flex;
				.bottom-left {
					// width: 80px;
					height: 28px;
					background: #FF4645;
					border-radius: 14px;
					padding: 0 12px;
					>view {
						// width: 48px;
						height: 18px;
						font-family: SourceHanSansCN, SourceHanSansCN;
						font-weight: 400;
						font-size: 18px;
						color: #FFFFFF;
						line-height: 27px;
						text-align: center;
						font-style: normal;
					}
					
				}
				.bottom-right {
					width: calc(100% - 100px);
					display: flex;
					>view:first-child {
						width: 54px;
						height: 18px;
						font-family: SourceHanSansCN, SourceHanSansCN;
						font-weight: 400;
						font-size: 18px;
						color: #999999;
						line-height: 27px;
						text-align: left;
						font-style: normal;
					}
					> view:last-child {
						width: 350px;
						height: 25px;
						font-family: SourceHanSansCN, SourceHanSansCN;
						font-weight: 400;
						font-size: 18px;
						color: #666666;
						line-height: 27px;
						text-align: left;
						font-style: normal;
						overflow: hidden;
						text-overflow: ellipsis;
						white-space: nowrap;
					}
				}
			}
		}
		
	}
</style>