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
									<div class="sitem-title">热门职位</div>
									<div class="sitem-box">
										<div class="tags-box">
											<span :class="{'tag-item':true,'active':parseFloat(aab022Index) == index}"
												v-for="(item,index) in aab022Arr" :key="index"
												@click="changeAab022(item,index)">{{item.aaa103}}</span>
										</div>
									</div>
								</div>
							</div>
							<div class="screen-item" v-else-if="screenType == 2">
								<div class="sitem-group">
									<div class="sitem-title">薪资福利</div>
									<div class="sitem-box">
										<div class="tags-box">
											<span :class="{'tag-item':true,'active': parseFloat(acb117Index) == index}"
												v-for="(item,index) in acb117List" :key="index"
												@click="changeAcb117(item,index)">{{item}}</span>
										</div>
									</div>
								</div>
								<div class="sitem-group">
									<div class="sitem-title">自定义薪资范围</div>
									<div class="sitem-box">
										<div class="salary-item">
											<input class="uni-input" type="number" v-model="acb21l" placeholder="最低薪资"
												@blur="changeSalary(0,$event)" />
											<span>~</span>
											<input class="uni-input" type="number" v-model="acb21h" placeholder="最高薪资"
												@blur="changeSalary(1,$event)" />
										</div>
									</div>
								</div>
							</div>
							<div class="screen-item" v-else>
								<div class="sitem-group" >
									<div class="sitem-title">单位名称</div>
									<div class="sitem-box">
									<input class="uni-input" placeholder="请输入单位名称" @click="keyboardBox1=true;keyboardBox2=false" id='inputUnit' v-model ='aab004'/>
									<common-keyboard @getSearchValue="(val)=>{ aab004 = val}" :keyboardBox="keyboardBox1" @hiddenKeys="keyboardBox1=false"> </common-keyboard>
									</div>
								</div>
								<div class="sitem-group" >
									<div class="sitem-title">招聘地址</div>
									<div class="sitem-box" >
										<input class="uni-input" placeholder="请输入招聘地址" v-model ='ab01Place' @click="keyboardBox2=true;keyboardBox1=false" id='inputAddress'/>
										<common-keyboard @getSearchValue="(val)=>{ ab01Place= val}" :keyboardBox="keyboardBox2" @hiddenKeys="keyboardBox2=false"> </common-keyboard>
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
		name: "screen-findWork",

		data() {
			return {
			keyboardBox1:false,
			keyboardBox2:false,
				screenType: 1,
				screenArr: [{
					name: '热门职位',
					type: 1
				}, {
					name: '薪酬福利',
					type: 2
				}, {
					name: '更多选择',
					type: 0
				}],
				//热门职位
				aab022Arr: [{
						aaa102: "10041028",
						aaa103: "搬运工"
					},
					{
						aaa102: "10040415",
						aaa103: "木工"
					},
					{
						aaa102: "10040400",
						aaa103: "技工"
					},
					{
						aaa102: "10040401",
						aaa103: "焊工"
					},
					{
						aaa102: "10040402",
						aaa103: "电工"
					},
					{
						aaa102: "10040403",
						aaa103: "叉车/铲车工"
					},
					{
						aaa102: "10040404",
						aaa103: "空调工"
					},
					{
						aaa102: "10040405",
						aaa103: "水工"
					},
					{
						aaa102: "10040406",
						aaa103: "普工/操作工"
					},
					{
						aaa102: "10040407",
						aaa103: "组装工"
					},
					{
						aaa102: "10040408",
						aaa103: "包装工"
					},
					{
						aaa102: "10040419",
						aaa103: "学徒工"
					},
					{
						aaa102: "10040502",
						aaa103: "机修工"
					},
					{
						aaa102: "10040613",
						aaa103: "裁剪工"
					},
					{
						aaa102: "10040614",
						aaa103: "缝纫工"
					},
					{
						aaa102: "10040615",
						aaa103: "手缝工"
					},
					{
						aaa102: "10040618",
						aaa103: "纺织工"
					},
					{
						aaa102: "10070209",
						aaa103: "保安人员"
					},
					{
						aaa102: "10070210",
						aaa103: "保洁"
					},
					{
						aaa102: "10070211",
						aaa103: "绿化工"
					},
					{
						aaa102: "10100705",
						aaa103: "育婴师/保育师"
					},
					{
						aaa102: "10100706",
						aaa103: "护工"
					},
					{
						aaa102: "10100707",
						aaa103: "钟点工"
					},
					{
						aaa102: "10100708",
						aaa103: "洗衣工"
					}, {
						aaa102: "10010101",
						aaa103: "软件工程师"
					}, {
						aaa102: "10010301",
						aaa103: "网店/淘宝运营"
					},
					{
						aaa102: "10010300",
						aaa103: "网店/淘宝店主"
					}
				],
				aab022Index: '',
				aab022: '',
				aab022_dsc: '',
				//薪酬福利
				acb117: '',
				acb117Index: '',
				acb117List: ['带薪年假', '餐费补助', '五险一金', '年度旅游'],
				// acb117Arr: ['10010', '10011', '10007', '10120'],
				//最低薪资
				acb21l: '',
				//最高薪资
				acb21h: '',
				//更多
				aab004: '',
				ab01Place: '',
				//选中
				screenInfo: {},
			}
		},
		watch:{
			placeholder(){

			}
		},
		mounted(){

		},
		methods: {

			// _onFocus(){
			// 	this.visibleKeyboard=true
			// },
			// _onBlur(){
			// 	this.visibleKeyboard=false
			// },
			setSearchValue(val){
			       // //console.log(val)
			   },
			open: function() {
				this.$refs.popup.open()
			},
			close: function() {
				this.$refs.popup.close()
			},
			changeType: function(type) {
				this.screenType = type
			},
			changeAab022: function(item, index) {
				if (!isNaN(parseFloat(this.aab022Index)) && index == parseFloat(this.aab022Index)) {
					this.aab022Index = '';
					this.aab022 = '';
					this.aab022_dsc = '';
				} else {
					this.aab022Index = index;
					this.aab022 = item.aaa102;
					this.aab022_dsc = item.aaa103;
				}
			},
			changeAcb117: function(item, index) {
				if (!isNaN(parseFloat(this.acb117Index)) && index == parseFloat(this.acb117Index)) {
					this.acb117Index = ''
					this.acb117 = ''
				} else {
					this.acb117Index = index
					this.acb117 = item //this.acb117Arr[index]
				}
			},
			changeSalary: function(type, e) {
				let val = parseFloat(e.target.value)
				if (val >= 0) {
					switch (type) {
						case 0: //最低
							if (this.acb21h != '') {
								if (val < parseFloat(this.acb21h)) {
									this.acb21l = val
								} else {
									this.acb21l = ''
									this.$utils.showToast("最低薪资必须小于最高薪资！")
								}
							} else {
								this.acb21l = val
							}
							break;
						default: //最高
							if (this.acb21l != '') {
								if (val > parseFloat(this.acb21l)) {
									this.acb21h = val
								} else {
									this.acb21h = ''
									this.$utils.showToast("最高薪资必须大于最低薪资！")
								}
							} else {
								this.acb21h = val
							}
							break;
					}
				} else {
					this.$utils.showToast("薪资必须大于等于0！")
				}
			},
			// //更多
			// screenMore: function(){
			// 	this.screenType = 0
			// },
			//重置数据
			reset: function() {
				// this.screenType = 1
				this.aab022 = ''
				this.aab022_dsc = ''
				this.aab022Index = ''
				this.acb117 = ''
				this.acb117Index = ''
				this.acb21l = ''
				this.acb21h = ''
				this.aab004 = ''
				this.ab01Place = ''
				this.screenInfo = {}
			},
			//清空
			clearScreen: function() {
				this.reset()
			},
			//保存
			saveScreen: function() {
				this.screenInfo.aab022 = this.aab022;
				this.screenInfo.aab022_dsc = this.aab022_dsc;
				this.screenInfo.acb117 = this.acb117;
				this.screenInfo.acb21l = this.acb21l
				this.screenInfo.acb21h = this.acb21h
				this.screenInfo.aab004 = this.aab004
				this.screenInfo.ab01Place = this.ab01Place
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
