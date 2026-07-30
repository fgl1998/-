<!-- 提取人身份 -->
<template>
	<div>
		<box-title title="购房人信息" />
		<van-form ref="form" :scroll-to-error="true">
			<van-field v-model="formData.gfrxm" name="gfrxm" label="购房人姓名" placeholder="请输入购房人姓名"
				:rules="[{ required: true, message: '请输入购房人姓名' }]" />
			<van-field v-model="formData.gfrzjhm" name="gfrzjhm" label="购房人证件号码" placeholder="请输入购房人证件号码"
				:rules="[{ required: true, message: '请输入购房人证件号码' }]" />
			<van-field v-model="formData.fwzl" name="fwzl" label="房屋坐落(路名)" placeholder="请输入房屋坐落"
				:rules="[{ required: true, message: '请输入房屋坐落' }]" />
		</van-form>
	</div>
</template>
<script>
	import mixin from '@osppm/store/person/fetch/paymentTransferEsf/one/mixin'
	import {
		mapActions,
		mapMutations,
		mapState
	} from "vuex";

	export default {
		name: 'one',
		mixins: [mixin],
		// computed: {
		// 	...mapState('paymentTransferEsf', ['oneformData'])
		// },
		data() {
			return {
				showPickerPopup: false,
				currentPicker: '',
				xmbhOptions: [],
				ldbhOptions: [],
				dybhOptions: [],
				lcbhOptions: [],
				fjbhOptions: []
			}
		},
		async mounted() {
			this.getFormFromVuex()
		},
		methods: {
			...mapMutations('paymentTransferEsf', ['setFormData']),
			...mapActions('paymentTransferEsf', ['saveForm']),

			saveToVuex() {
				this.setFormData({
					formKey: 'oneformData',
					data: this.formData
				})
			},

			getFormFromVuex() {
				this.formData = {
					...this.formData,
					...this.oneformData
				}
			},

			async formValidate() {
				return await new Promise((resolve) => {
					this.$refs.form.validate().then(async () => {
						resolve(true)
					}).catch(errorList => {
						console.log('错误列表：', errorList)
						resolve(false)
					})
				})
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