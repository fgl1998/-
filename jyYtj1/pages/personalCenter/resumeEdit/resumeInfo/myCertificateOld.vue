<template>
	<div class="form-group-box">
		<div class="form-group-list">
			<uni-forms ref="form">
				<div class="form-group" v-for="(item,index) in certInfoList" :key="index">
					<div class="group-index">{{ index+ 1 < 10 ? '0'+(index+1) : index }}</div>
					<uni-row class="uni-row">
						<uni-col :span="8">
							<div class="form-item">
								<uni-forms-item label="证书名称:" name="certName" labelWidth="120">
									<div class="input-box">
										<uni-easyinput type="text" v-model="item.certName" :disabled="item.certName != ''" />
									</div>
								</uni-forms-item>
							</div>
						</uni-col>
						<uni-col :span="8">
							<div class="form-item">
								<uni-forms-item label="颁发时间:" name="certDate" labelWidth="120">
									<uni-datetime-picker class="datePicker" v-model="item.certDate" type="date"
										:start="startDate" :end="endDate" rangeSeparator="~" />
								</uni-forms-item>
							</div>
						</uni-col>
						<uni-col :span="8">
							<div class="form-item">
								<uni-forms-item label="颁发机构:" name="orgName" labelWidth="120">
									<div class="input-box">
										<uni-easyinput type="text" v-model="item.orgName" :disabled="item.orgName != ''" />
									</div>
								</uni-forms-item>
							</div>
						</uni-col>
					</uni-row>
					<div class="group-del">
						<button class="btn btn-del" @click="delGroup(index)">删除</button>
					</div>
				</div>
			</uni-forms>
		</div>
		<div class="form-group-add">
			<button class="btn btn-dblue" @click="addGroup"><i class="ic ic-add"></i><span>新增一条</span></button>
		</div>
	</div>
</template>

<script>
	export default {
		name: 'work',
		components: {

		},
		data() {
			return {
				certInfoList: [{
					certName: '某某某大赛一等奖',
					certDate: "2021-03-8",
					orgName: 'XXX机构'
				}, ],
			}
		},
		computed: {
			startDate() {
				return this.$utils.getDate('start')
			},
			endDate() {
				return this.$utils.getDate('end')
			}
		},
		methods: {
			bindPickerChange(e, index, type) {
				switch (type) {
					case 1:
						this.certInfoList[index].certDate = e
						break;
					default:
						break;
				}
			},
			//新增
			addGroup() {
				let obj = {}
				obj.certDate = ''
				obj.certName = ''
				obj.orgName = ''

				this.certInfoList.push(obj)
			},
			//删除
			delGroup(index) {
				this.certInfoList.splice(index, 1)
			}
		},
	}
</script>

<style lang="scss" scoped>
	/deep/ .uni-forms-item__label{
		height: 42px;
		line-height: 42px;
		.label-text{
			font-size:18px;
		}
	}
	
	/deep/ .uni-input-input{
		font-size: 18px;
		height: 42px;
		line-height: 42px;
	}
	
	/deep/ .uni-easyinput__content-input{
		height: 42px;
		line-height: 42px;
	}

	.form-group-box {
		.form-group-list {
			.form-group {
				border-bottom: 1px dashed #dddddd;
				position: relative;
				margin-top: 20px;
				&:last-child{
					border-bottom: 0;
				}
				
				
				.group-index {
					position: absolute;
					left: -50px;
					top: 0;
					height: 34px;
					line-height: 34px;
					background: #f0f7ff;
					color: #2778ff;
					font-size: 18px;
					padding: 0 10px;
				}

				.form-item {
					padding: 0 20px;

					.picker-box {
						height: 40px;
						line-height: 40px;
						display: flex;
						box-sizing: border-box;
						flex-direction: row;
						align-items: center;
						border: 1px solid #dcdfe6;
						border-radius: 4px;
						padding-left: 10px;
						color: #404040;
						font-size: 18px;
						padding-left: 16px;
						padding-right: 50px;
						position: relative;
						box-sizing: border-box;

						&:after {
							content: '';
							position: absolute;
							right: 16px;
							top: 50%;
							transform: translateY(-50%);
							background: url('../../../../static/images/ic_down.png') right center no-repeat;
							background-size: 20px 10px;
							width: 20px;
							height: 10px;
						}

						&.disabled {
							background: #fafafa;
							color: #999999;
						}

						&.text-org {
							color: #ff7e00;
						}

						&.text-blue {
							color: #2778ff;
							font-size: 18px;
						}

					}

					.input-box {
						color: #404040;
						font-size: 18px;
					}

				}

				.group-del {
					position: absolute;
					right: -50px;
					top: 0;

					.btn-del {
						width: 36px;
						background: #FFF3F2;
						border-radius: 2px;
						border: solid 1px rgba(255, 21, 0, 0.51);
						color: #ff1500;
						font-size: 18px;
						line-height: 20px;
						text-align: center;
						padding: 12px 0;
					}
				}

			}
		}

		.form-group-add {
			padding: 20px 20px 0;
			display: flex;
			justify-content: center;
			align-items: center;
			position: relative;

			&:before {
				content: '';
				position: absolute;
				top: 38px;
				left: 0;
				width: 100%;
				height: 1px;
				border-bottom: 1px dashed #DDDDDD;
			}

			button {
				display: inline-block;
				height: 36px;
				line-height: 34px;
				font-size: 16px;
				color: #2778ff;
			}
		}
	}
</style>
