<template>
	<view>

		<uni-popup ref="popup" type="center">
			<div class="screen-box">
				<div class="screen-top">
					<div class="screen-lt">
						<div class="screen-tab">
							<div :class="['tab-item',item.type==screenType ? 'active' : '']"
								v-for="(item,index) in screenArr" :key="index" @click="changeType(item.type)">
								{{item.name}}
							</div>
						</div>
					</div>
					<div class="screen-rt">
						<div class="screen-term">
							<div class="screen-item" v-if="screenType == 1">
								<div class="sitem-group">
									<div class="sitem-title">单位类型</div>
									<div class="sitem-box">
										<div class="tags-box">
											<span :class="{'tag-item':true,'active':parseFloat(aab019Index) == index}"
												v-for="(item,index) in aab019Arr" :key="index"
												@click="changeAab019(item,index)">{{item.label}}</span>
										</div>
									</div>
								</div>
							</div>
							<div class="screen-item" v-else-if="screenType == 2">
								<div class="sitem-group">
									<div class="sitem-title">经济类型</div>
									<div class="sitem-box">
										<div class="tags-box">
											<span :class="{'tag-item':true,'active': parseFloat(aab020Index) == index}"
												v-for="(item,index) in aab020Arr" :key="index"
												@click="changeAab020(item,index)">{{item.label}}</span>
										</div>
									</div>
								</div>
							</div>
							<div class="screen-item" v-else>
								<div class="sitem-group">
									<div class="sitem-title">单位地址</div>
									<div class="sitem-box">
										<input class="uni-input" v-model="aae006" placeholder="请输入单位地址" />
										<!-- <common-keyboard placeholder="请输入单位联系地址" :classStyle="classStyle" :key="key" :record="recordAddress" @getSearchValue="(val)=>{ aae006 = val}" idName='inputAddress' > </common-keyboard> -->
									</div>
								</div>
								<div class="sitem-group">
									<div class="sitem-title">单位名称</div>
									<div class="sitem-box">
										<input class="uni-input" v-model="companyName" placeholder="请输入单位名称" />
										<!-- <common-keyboard placeholder="请输入单位名称" :classStyle="classStyle" :key="key" :record="recordCompanyName" @getSearchValue="(val)=>{ companyName = val}" idName='inputCompanyName' > </common-keyboard> -->
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>

				<div class="screen-bottom">
					<div class="bottom-lt">
						<!-- <button class="btn-more" @click="screenMore">更多选择</button> -->
					</div>
					<div class="bottom-rt">
						<button class="btn-save" @click="saveScreen">确 认</button>
						<button class="btn-clear" @click="clearScreen">清 空</button>
					</div>
				</div>
			</div>
		</uni-popup>


	</view>
</template>

<script>
	export default {
		name: "screen-findUnit",
		props: {
			firstClick: {
				type: Boolean,
				default: false
			},
		},
		data() {
			return {
				screenType: 1,
				screenArr: [{
					name: '单位类型',
					type: 1
				}, {
					name: '经济类型',
					type: 2
				}, {
					name: '更多选择',
					type: 0
				}],
				aab019Index: '',
				aab019Arr: uni.getStorageSync('codeCacheMap')['AAB019'],
				aab019: '',
				aab019_dsc: '',

				aab020Index: '',
				aab020Arr: uni.getStorageSync('codeCacheMap')['AAB020'],
				aab020: '',
				aab020_dsc: '',

				//更多
				aae006: '',//单位联系地址
				companyName: '',//单位名称
				//选中
				screenInfo: {},
				// 传递给键盘组件值
				recordAddress: '',
				recordCompanyName: '',
				key: 0,
				// 传递给输入框及键盘组件，输入框样式
				classStyle: 'inputArea'
			}
		},
		methods: {
			open: function() {
				if(this.firstClick){
					this.reset();
				}
				this.$refs.popup.open()
			},
			close: function() {
				this.$refs.popup.close()
			},
			changeType: function(type) {
				this.screenType = type
				this.recordAddress = this.aae006
				this.recordCompanyName = this.companyName
			},
			changeAab019: function(item, index) {
				if (!isNaN(parseFloat(this.aab019Index)) && index == parseFloat(this.aab019Index)) {
					this.aab019Index = ''
					this.aab019 = ''
					this.aab019_dsc = ''
				} else {
					this.aab019Index = index
					this.aab019 = item.value
					this.aab019_dsc = item.label
				}
			},
			changeAab020: function(item, index) {
				if (!isNaN(parseFloat(this.aab020Index)) && index == parseFloat(this.aab020Index)) {
					this.aab020Index = ''
					this.aab020 = ''
					this.aab020_dsc = ''
				} else {
					this.aab020Index = index
					this.aab020 = item.value
					this.aab020_dsc = item.label
				}
			},
			// //更多
			// screenMore: function(){
			// 	this.screenType = 0
			// },
			//重置数据
			reset: function() {
				// this.screenType = 1
				this.aab019Index = ''
				this.aab019 = ''
				this.aab019_dsc = ''
				this.aab020Index = ''
				this.aab020 = ''
				this.aab020_dsc = ''
				this.aae006 = ''
				this.companyName = ''
				this.screenInfo = {}
				this.recordAddress = ''
				this.recordCompanyName = ''
				if(this.screenType == 0){
					this.key ++
				}
			},
			//清空
			clearScreen: function() {
				this.reset()
			},
			//保存
			saveScreen: function() {
				this.screenInfo.aab019 = this.aab019
				this.screenInfo.aab019_dsc = this.aab019_dsc
				this.screenInfo.aab020 = this.aab020
				this.screenInfo.aab020_dsc = this.aab020_dsc
				this.screenInfo.aae006 = this.aae006
				this.screenInfo.companyName = this.companyName
				this.recordAddress = this.aae006
				this.recordCompanyName = this.companyName
				this.$emit('getScreen', this.screenInfo)
			},
		}
	}
</script>

<style lang="scss" scoped>
	.screen-box {
		width: 1100px;
		height: 700px;
		background: #ffffff;

		.screen-top {
			height: calc(100% - 80px);
			display: flex;
			justify-content: flex-start;
			align-items: center;
			box-sizing: border-box;
			background: url('../../static/images/service_rt_bg.png') left bottom repeat-x;
			background-size: 20px 12px;

			.screen-lt {
				width: 370px;
				height: 100%;

				.screen-tab {
					padding: 24px;

					.tab-item {
						margin-bottom: 24px;
						width: 100%;
						height: 88px;
						line-height: 88px;
						text-align: center;
						font-size: 24px;
						color: #53A3FF;
						background: #E1F1FF;
						border-radius: 4px;

						&:nth-child(2) {
							color: #FF8928;
							background: #FFEFDF;
						}

						&:nth-child(3) {
							color: #33BDA1;
							background: #D3F3ED;
						}
					}
				}
			}

			.screen-rt {
				width: calc(100% - 370px);
				height: 100%;
				background: #FBFCFD;

				.screen-term {
					padding: 24px;

					.sitem-group {
						margin-bottom: 24px;

						.sitem-title {
							margin-bottom: 16px;
							font-size: 20px;
							color: #666666;
						}

						.sitem-box {
							.tags-box {
								display: flex;
								justify-content: flex-start;
								align-items: flex-start;
								flex-wrap: wrap;

								.tag-item {
									color: #999999;
									border: 1px solid #cccccc;
									min-width: 120px;
									text-align: center;
									height: 40px;
									line-height: 40px;
									padding: 0 10px;
									box-sizing: border-box;
									margin-right: 16px;
									margin-bottom: 16px;
									border-radius: 6px;

									&.active {
										border: 1px solid #4BAAFE;
										color: #4DABFD;
									}
								}
							}

							.uni-input {
								width: 100%;
								height: 40px;
								line-height: 40px;
								border: 1px solid #eeeeee;
								background: #ffffff;
								padding: 0 16px;
								box-sizing: border-box;
								font-size: 16px;
							}

							.salary-item {
								display: flex;
								justify-content: flex-start;
								align-items: center;

								.uni-input {
									width: 140px;
								}

								span {
									margin: 0 16px;
									color: #999999;
								}
							}

						}
					}
				}
			}
		}

		.screen-bottom {
			padding: 0 20px;
			height: 80px;
			display: flex;
			justify-content: space-between;
			align-items: center;

			.bottom-rt {
				display: flex;
				justify-content: flex-start;
				align-items: center;

				button {
					width: 150px;
					height: 58px;
					text-align: center;
					font-size: 24px;
					color: #ffffff;
					margin-left: 20px;

					&:after {
						border: none;
					}

					&.btn-save {
						background: url(../../static/images/screen_save.png) left center no-repeat;
						background-size: 150px 58px;
					}

					&.btn-clear {
						background: url(../../static/images/screen_clear.png) left center no-repeat;
						background-size: 150px 58px;
					}
				}
			}

		}



	}
</style>
