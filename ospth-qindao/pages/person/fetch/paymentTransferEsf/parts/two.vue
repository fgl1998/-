<!-- 提取人身份 -->
<template>
	<div>
		<box-title title="房屋信息" />
    <van-form ref="form" :scroll-to-error="true">
      <van-form-item-map
          v-for="(item, index) in formConfig.fields"
          :key="index"
          :formItemConfig.sync="item"
          :formData="formData"
      />
    </van-form>

		<box-title title="托管信息" />
		<van-form ref="form2" :scroll-to-error="true">
			<van-field v-model="formData2.trusteeName" name="trusteeName" label="托管人姓名" placeholder="请输入托管人姓名" required input-align="right"
				:rules="[{ required: true, message: '请输入托管人姓名' }]" disabled />
			<van-field v-model="formData2.trusteeIdType" name="trusteeIdType" label="托管人证件类型" placeholder="请输入托管人证件类型" input-align="right"
				required :rules="[{ required: true, message: '请输入托管人证件类型' }]" disabled />
			<van-field v-model="formData2.trusteeIdCard" name="trusteeIdCard" label="托管人证件号码" placeholder="托管人证件号码" input-align="right"
				required :rules="[{ required: true, message: '请输入托管人证件号码' }]" disabled />
			<van-field v-model="formData2.escrowAccount" name="escrowAccount" label="托管账号" placeholder="请输入托管账号" input-align="right"
				required :rules="[{ required: true, message: '请输入托管账号' }]" disabled />
			<van-field v-model="formData2.accountType" name="accountType" label="账户类别" placeholder="请输入账户类别" required input-align="right"
				:rules="[{ required: true, message: '请输入账户类别' }]" disabled />
			<van-field v-model="formData2.escrowAmount" name="escrowAmount" label="托管金额" placeholder="请输入托管金额" required input-align="right"
				:rules="[{ required: true, message: '请输入托管金额' }]" disabled />
			<van-field v-model="formData2.agreementSignDate" name="agreementSignDate" label="协议签订日期" input-align="right"
				placeholder="请输入协议签订日期" required :rules="[{ required: true, message: '请输入协议签订日期' }]" disabled />
		</van-form>

		<!-- 选择器弹窗 -->
		<van-popup v-model="showPopup" position="bottom">
			<van-picker show-toolbar :title="finalPickerTitle" value-key="label" :columns="finalColumns"
				@confirm="confirm" @cancel="showPopup = false" />
		</van-popup>
		<!-- 时间选择器 -->
		<van-popup v-model="showCalendar" position="bottom">
			<van-datetime-picker type="date" title="选择年月日" v-model="currentDate" @cancel="showCalendar = false"
				@confirm="calendarConfirm" :type="yearType" />
		</van-popup>
	</div>
</template>
<script>
	import mixin from '@osppm/store/person/fetch/paymentTransferEsf/two/mixin'
	import moment from "moment";

	export default {
		name: 'two',
		mixins: [mixin],
		data() {
			return {
				// 选择器
				showPopup: false,
				finalPickerTitle: '', //title展示
				finalColumns: '', //数组列表
				formDataIndex: [], //哪一个数组存入数据
				fieldValue: '', //哪一个表单数据value
				inputTimer: null, //节流防抖
				allowClickLd: false, //是否允许点击楼栋单元房号
				showCalendar: false, //时间选择
				currentDate: new Date(),
				currentDateValue: '', //当前年份value值
				yearType: 'date', //选择类型
			}
		},
		async activated() {
			await this.init()
		},
		methods: {
			openPicker(title, arrType, codeType, valueType) {
				return
				this.showPopup = true
				this.finalPickerTitle = title
				let bigCodeType = codeType.toUpperCase();
				this.finalColumns = this.codeValues[bigCodeType + 'Columns']
				this.formDataIndex = arrType
				this.fieldValue = valueType
			},
			confirm(selected) {
				const value = selected.value ?? selected
				const label = selected.label ?? selected
				this[this.formDataIndex][this.fieldValue] = value
				this.showPopup = false
			},
			setShowText(arrType, val, codeType) {
				let bigCodeType = codeType.toUpperCase();
				let columns = this.codeValues[bigCodeType + 'Columns']
				if (columns && columns.length > 0 && val) {
					const theLabel = columns.find(item => item.value === val)
					return theLabel.label
				}
			},
			openCalendar(value, yearType) {
				return
				this.yearType = yearType
				this.currentDateValue = value
				this.showCalendar = true
			},
			calendarConfirm(value) {
				if (this.yearType == 'date') {
					this.formData2[this.currentDateValue] = moment(value).format('YYYY-MM-DD')
				} else if (this.yearType == 'year-month') {
					this.formData2[this.currentDateValue] = moment(value).format('YYYY-MM')
				}
				this.showCalendar = false
			},
			saveToVuex() {
				this.setFormData({
					formKey: 'twoformData',
					data: {
						'formData': this.formData,
						'formData2': this.formData2
					}
				})
			},
			async formValidate() {
				try {
					const tasks = [
						this.$refs.form.validate(),
						this.$refs.form2.validate(),
					]

					await Promise.all(tasks)

					return true
				} catch (err) {
					return false
				}
			},
			async beforeNext() {
				try {
					this.saveToVuex()
					return true
				} catch (e) {
					terminalUtil._alertMsgWindow('提示', '受理失败：' + e.message, 'error')
					return false
				}
			},
		}
	}
</script>
<style scoped lang="scss">

</style>
