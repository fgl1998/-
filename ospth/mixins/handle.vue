<template>
	<!-- 示例 -->
	<!-- 银行卡组件 -->
	<!-- 	<u-form-item label="银行卡" prop="acb202" label-width="150" required>
		<u-input v-model="infoForm.acb202_desc" :border="false" placeholder="请选择银行卡" disabled />
		<view class="addressBox" @click="visibleBank = true">
		</view>
	</u-form-item> -->
	<!-- 时间选择组件 -->
	<!-- <u-form-item label="请选择时间" prop="aae030" label-width="150" required>
		<picker ref="pickerRef" mode="date" start="1920-01-01" end="2050-09-01"
			@change="workStartDateChange($event,'infoForm','aae030')">
			<view class="conmmon-picker">
				<view v-if="infoForm.aae030">{{infoForm.aae030}}</view>
				<view class="placeholder" v-if="!infoForm.aae030">请选择时间</view>
			</view>
		</picker>
	</u-form-item> -->
	<!-- 时间组件-日历写法 -->
	<!-- <u-form-item label="毕业日期" prop="yac01g" label-width="150" required>
		<u-input v-model="infoForm.yac01g" :border="false" placeholder="请选择毕业日期"
			@click="yac01gShow = true" :disabled="isDisabled" />
		<u-calendar max-date="2099-12-31" v-model="yac01gShow" mode="date" @change="dateConfirmYac01g"></u-calendar>
	</u-form-item> -->
	<!-- 区域选择组件-西藏限定 -->
	<!-- <u-form-item label="期望工作地点" prop="acb202" label-width="150" required>
		<u-input v-model="infoForm.acb202_desc" :border="false" placeholder="期望工作地点" disabled />
		<view class="addressBox" @click="openArea('infoInfm','acb202_desc')"></view>
	</u-form-item> -->
	<!-- 区域选择组件-全国 -->
	<!-- <u-form-item label="期望工作地点" prop="acb202" label-width="150" required>
		<u-input v-model="infoForm.acb202_desc" :border="false" placeholder="请选择期望工作地点" disabled />
		<view class="addressBox" @click="handleAddress">
		</view>
	</u-form-item> -->
</template>

<script>
	import aae017SelectTree from '@/components/aae017SelectTree/aae017SelectTree.vue'
	import tkiTree from "@/components/tki-tree/tki-tree.vue"
	export default {
		components: {
			aae017SelectTree,
			tkiTree
		},
		data() {
			return {
				userInfo: {},
				showAreaModal: true,
				formName: '',
				fieldName: '',
				areaField: '',
			}
		},
		watch: {
			showUploadFile: {
				handler(newVal, oldVal) {
					this.$emit('changeUploadFile', newVal)
				},
				immediate: true,
			},

		},
		created() {
			// 获取用户信息
			try {
				const info = this.$base.getUser(true, true)
				if (info && info.naturalBo) {
					this.userInfo = info.naturalBo
					// 获取用户信息
					this.userInfo.name = info.naturalBo.name
					this.userInfo.userType = info.userType
					this.userInfo.ext03 = info.naturalBo.ext03 //主键
					this.userInfo.aab998 = info.naturalBo.certNo //统一社会信用代码
					this.paramsBankCard = this.userInfo
				} else {
					this.$message.error('获取用户信息失败，请重新登录')
				}
			} catch (error) {
				console.error('获取用户信息异常:', error)
				this.$message.error('系统异常，请稍后重试')
			}
		},
		methods: {
			clickMaskClose(e) {
				this.showAreaModal = true
			},
			// 设置期望工作地点
			expectWorkPlaceChange(lastObj) {
				this.showAreaModal = true
				this[this.formName][this.fieldName] = lastObj.areaid
				this[this.formName][this.fieldName + '_desc'] = lastObj.areaname
				this.$forceUpdate()
			},
			handleAae017Change(selected) {
				if (selected && selected.value && selected.label) {
					this[formName][this.areaField] = selected.label, //label
						this[formName][this.areaField.slice(0, -5)] = selected.value, //value--去除_desc
						this.$forceUpdate()
				}
			},
			openArea(formName = 'infoForm', fieldName = 'ycc299') {
				this.formName = formName;
				this.areaField = fieldName;
				this.$refs.aae017SelectTree.handleShowPopup()
			},
			openAreaSelector(formName = 'infoForm', fieldName = 'ycc299') {
				this.showAreaModal = false;
				this.$nextTick(() => {
					this.fieldName = fieldName;
					this.formName = formName;
					this.$refs.addressRef.handleShow()
				})
			},
			fromChange(e, formName, name, callback) {
				this[formName][name] = e.value
				this[formName][name + "_desc"] = e.name || e.label
				if (callback) {
					callback(e.value)
				}
			},
			workStartDateChange(e, formName, name) {
				this[formName][name] = e.detail.value
				this.$forceUpdate()
			},
		},
	}
</script>

<style scoped lang="scss">
	.u-form {
		height: 100%;
	}

	.user-info {
		height: 100%;
		padding-top: 30rpx;
		box-sizing: border-box;

		.container {
			width: 100%;
			height: 100%;
			display: flex;
			flex-direction: column;
		}

		.form-box {
			background: #fff;
			margin-bottom: 16rpx;
			padding: 32rpx;
			flex: 1;
		}

		.btns {
			height: 100rpx;
			display: flex;
			justify-content: center;
		}
	}

	/deep/.u-form-item__message {
		text-align: right;
	}

	.btnStyle {
		width: 40%;
	}

	.btnStyle:first-of-type {
		margin-right: 24rpx;
	}
</style>