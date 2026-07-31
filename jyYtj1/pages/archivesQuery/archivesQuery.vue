<template>
	<view class="form-group">
		<uni-row class="archives-box">
			<uni-col :span="4" :push="8">
				<button :type="current==0? 'primary':'default'" @click="clickTab(0)">档案状态查询</button>
			</uni-col>
			<uni-col :span="4" :push="8">
				<button :type="current==1? 'primary':'default'" @click="clickTab(1)">档案到档查询</button>
			</uni-col>
		</uni-row>
		<uni-forms ref="form" :modelValue="formdata">
			<uni-row class="archives-box">
				<uni-col :span="18" :push="3">
					<uni-title type="h1" title="申请人信息" color="#027fff"></uni-title>
				</uni-col>
				<uni-col :span="18" :push="3">
					<uni-col :span="12">
						<div class="form-item">
							<uni-forms-item label="姓名:" required labelWidth="120" labelAlign="right">
								<div class="input-box">
									<uni-easyinput type="text" v-model="name" />
								</div>
							</uni-forms-item>
						</div>
					</uni-col>
					<uni-col :span="12" v-if="current==0">
						<div class="form-item">
							<uni-forms-item label="身份证号:" required labelWidth="120" labelAlign="right">
								<div class="input-box">
									<uni-easyinput type="text" maxlength="18" v-model="idCard" />
								</div>
							</uni-forms-item>
						</div>
					</uni-col>
					<uni-col :span="12" v-if="current==1">
						<div class="form-item">
							<uni-forms-item label="寄件单位:" labelWidth="120" labelAlign="right">
								<div class="input-box">
									<uni-easyinput type="text" maxlength="18" v-model="unitName" />
								</div>
							</uni-forms-item>
						</div>
					</uni-col>
				</uni-col>
			</uni-row>

			<uni-row class="archives-box">
				<uni-col :span="18" :push="3">
					<uni-title type="h1" title="受理机构" color="#027fff"></uni-title>
				</uni-col>
				<uni-col :span="18" :push="3">
					<uni-col :span="12">
						<div class="form-item">
							<uni-forms-item label="受理机构:" required labelWidth="120" labelAlign="right">
								<custom-picker id="aac011" label='最高学历' :range='AuditOrgList' v-model='foundId'
									@pickerChange="PickerMode" required>
								</custom-picker>
							</uni-forms-item>
						</div>
					</uni-col>
					<uni-col :span="12">
						<div class="form-item">
							<uni-forms-item label="受理地区:" labelWidth="120" labelAlign="right">
								<div class="">
									<text style="line-height: 36px;">{{areaName}}</text>
								</div>
							</uni-forms-item>
						</div>
					</uni-col>
				</uni-col>
			</uni-row>

			<uni-row class="archives-box">
				<uni-col :span="2" :push="11">
					<button class=" btn-blue" @click="query">查&nbsp;&nbsp;&nbsp;&nbsp;询</button>
				</uni-col>
			</uni-row>

			<uni-row class="archives-box">
				<uni-col :span="18" :push="3">
					<uni-title type="h1" title="查询结果" color="#027fff"></uni-title>
				</uni-col>
				<uni-col :span="18" :push="3">
					<rich-text :nodes="response"></rich-text>
				</uni-col>
			</uni-row>

			<uni-row class="archives-box" v-if="showTable">
				<uni-col :span="18" :push="3">若您的档案未查到，可联系相关档案管理服务机构查询</uni-col>
				<uni-col :span="18" :push="3">
					<uni-table>
						<uni-tr>
							<uni-th>
								单位名称
							</uni-th>
							<uni-th>
								联系电话
							</uni-th>
							<uni-th>
								办公地址
							</uni-th>
						</uni-tr>
						<uni-tr v-for="(item, index) in AuditOrgInfoList" :key="index">
							<uni-td>
								{{item.cName}}
							</uni-td>
							<uni-td>
								{{item.cTel}}
							</uni-td>
							<uni-td>
								{{item.cAreaName}}
							</uni-td>
						</uni-tr>
					</uni-table>
				</uni-col>

			</uni-row>
		</uni-forms>
	</view>
</template>

<script>
	export default {
		onLoad(options) {
			//console.log("getAuditOrg");
			this.getAuditOrg();
		},
		data() {
			return {
				customStyle: {
					color: '#999999',
				},
				archivesNav: [{
					name: '档案状态查询',
				}, {
					name: '档案到档查询',
				}],
				formdata: {},
				current: 0,
				show: false,
				AuditOrgList: [],
				AuditOrgInfoList: [],
				cCode: '',
				cName: '',
				name: '',
				idCard: '',
				unitName: '',
				foundId: '',
				areaName: '',
				response: '',
				showTable: false,
			}
		},
		methods: {
			//获取受理机构
			getAuditOrg() {

				let param = {};
				param.method = "getAuditOrg";
				this.$utils.request(param, res => {
					//console.log(res);
					if (res.code === "-1") {
						this.$utils.showToast("调用服务异常")
					} else {
						let data = res.data;
						if (data.code == '-1') {
							this.$utils.showToast(data.msg)
						} else {
							let resultList = data.response;
							resultList.forEach((item, index) => {
								this.AuditOrgList.push({
									code: item.cCode,
									name: item.cName,
								});
								this.AuditOrgInfoList.push({
									cName: item.cName,
									cAreaName: item.cAreaName,
									cCode: item.cCode,
									cFondsId: item.cFondsId,
									cTel: item.cTel,
								});
							});
						}
					}
				})
			},

			PickerMode: function(e) {
				this.checkAuditOrg(e);
			},

			// 查询存档机构是否可以办理
			checkAuditOrg(item) {

				let param = {};
				param.code = item.code;
				param.typeId = 'WB14';
				param.method = "checkAuditOrg";
				this.$utils.request(param, res => {
					if (res.code === "-1") {
						this.$utils.showToast("调用服务异常")
					} else {
						let data = res.data;
						if (data.code == '-1') {
							this.$utils.showToast(data.msg)
						} else if (data.code == '-16') {
							this.$utils.showToast(data.msg)
							this.cCode = '';
							this.cName = '';
							this.foundId = '';
							this.areaName = '';
						} else {
							this.cCode = item.code;
							this.cName = item.name;
							this.AuditOrgInfoList.forEach((item2, index) => {
								if (item2.cCode == item.code) {
									this.foundId = item2.cFondsId;
									this.areaName = item2.cAreaName;
								}
							})

						}
					}
				})
			},

			query() {
				if (this.current == '0') {
					this.queryReceive();
				} else if (this.current == '1') {
					this.queryPreReceive();
				}
			},

			queryReceive() {
				if (!this.checkFields()) {
					return
				}
				this.showTable = false;

				let param = {};
				param.name = this.name;
				param.idCard = this.idCard;
				param.foundId = this.foundId;
				param.method = "queryReceive";
				this.$utils.request(param, res => {
					if (res.code === "-1") {
						this.$utils.showToast("调用服务异常")
					} else {
						let data = res.data;
						if (data.code == '-1') {
							this.$utils.showToast(data.msg)
							this.response = data.msg;
							this.showTable = true;
						} else {
							this.response = data.response;
						}
					}
				})
			},

			queryPreReceive() {
				if (!this.checkFields()) {
					return
				}
				this.showTable = false;

				let param = {};
				param.name = this.name;
				param.unitName = this.unitName;
				param.foundId = this.foundId;
				param.method = "queryPreReceive";
				this.$utils.request(param, res => {
					if (res.code === "-1") {
						this.$utils.showToast("调用服务异常")
					} else {
						let data = res.data;
						if (data.code == '-1') {
							this.$utils.showToast(data.msg)
							this.response = data.msg;
							this.showTable = true;
						} else {
							this.response = data.response[0];
						}
					}
				})
			},

			checkFields() {
				if (!this.name) {
					this.$utils.showToast("请输入姓名信息");
					return false;
				}

				if (this.current == 0 && !this.idCard) {
					this.$utils.showToast("请输入身份证号");
					return false;
				}

				let idCardMsg = this.$check.getIdCardMsg(this.idCard)
				if (this.current == 0 && !idCardMsg.pass) {
					this.$utils.showToast("身份证号码不合法");
					return false;
				}


				if (!this.foundId) {
					this.$utils.showToast("请选择受理机构");
					return false;
				}

				return true;
			},

			fnAac002Blur(e) {
				if (!e) return
				let idCardMsg = this.$check.getIdCardMsg(e)
				if (idCardMsg.pass) { //如果身份证校验成功

				} else {
					this.$utils.showToast("身份证号码不合法");
				}
			},

			clickTab(index) {
				if (this.current == index) {
					return
				}
				this.current = index;
				//重置
				this.cCode = '';
				this.cName = '';
				this.name = '';
				this.idCard = '';
				this.unitName = '';
				this.foundId = '';
				this.areaName = '';
				this.response = '';
				this.showTable = false;
			},







		}
	}
</script>

<style lang="scss" scoped>
	.archives {}

	.onFlex {
		display: flex;
	}

	.archives-box {
		margin-top: 16px;
		padding: 0 16px;
		background: #fff;
	}

	.form-group {

		.form-item {
			padding: 0 20px;

			.datePicker {
				font-size: 18px;
			}

			.picker-box {
				height: 42px;
				line-height: 42px;
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
					background: url('../../static/images/ic_down.png') right center no-repeat;
					background-size: 20px 10px;
					width: 20px;
					height: 10px;
				}

				&.disabled {
					background: #fafafa;
					color: #999999;
				}
			}

			.input-box {
				color: #404040;
				font-size: 18px;
				height: 42px;
				line-height: 42px;

				textarea {
					border: 1px solid #EEEEEE;
					width: 100%;

					&.disabled {
						background: #fafafa;
						color: #999999;
					}
				}
			}

			.base-name {
				font-size: 32px;
				color: #333333;
				font-weight: bold;
				margin-bottom: 20px;
				box-sizing: border-box;
			}

			.personal-head {
				width: 170px;
				height: 220px;
				margin: 30px auto 0;
				vertical-align: middle;

				.head-img {
					width: 100%;
					height: 100%;
				}
			}
		}
	}

	.btn {
		display: inline-block;
		margin: 0 10px;
	}
</style>
