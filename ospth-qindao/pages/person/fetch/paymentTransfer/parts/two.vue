<!-- 提取人身份 -->
<template>
	<div>
    <view>
      <box-title title="项目信息选择"/>
      <van-form ref="form3" :scroll-to-error="true">
        <van-field v-model="formData.gfrxm" name="gfrxm" label="项目名称" placeholder="请输入项目名称"
                   required input-align="right" :rules="[{ required: true}]" @input="getXmmcSearch" />
        <van-field v-model="formData.lddyfh" name="lddyfh" label="楼栋-单元-房号" placeholder="请选择楼栋-单元-房号"
                   required input-align="right" readonly :rules="[{ required: true }]" @click="openCascader" />
      </van-form>
    </view>

    <!-- 级联选择器弹窗 -->
    <van-popup v-model="showCascader" position="bottom" :style="{ height: '50%' }" round>
      <van-cascader v-model="cascaderValue" :options="cascaderOptions" @change="onCascaderChange"
                    @close="showCascader = false" @finish="onCascaderFinish" title="选择房屋信息" />
    </van-popup>
		<box-title title="房屋信息" />
    <van-form ref="form" :scroll-to-error="true">
      <van-form-item-map
          v-for="(item, index) in formConfig.fields2"
          :key="index"
          v-if="item.if"
          :formItemConfig.sync="item"
          :formData="formData"
      />
    </van-form>
	</div>
</template>
<script>
	import mixin from '@osppm/store/person/fetch/paymentTransfer/two/mixin'

	import {
		Toast,
	} from 'vant'
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
				// 级联选择相关
				showCascader: false,
				cascaderValue: [],
				cascaderOptions: [{
						text: '1栋',
						value: 'building_1',
						children: [{
								text: '1单元',
								value: 'unit_1_1',
								children: [{
										text: '101室',
										value: 'room_1_1_101',
										floor: '1层'
									},
									{
										text: '102室',
										value: 'room_1_1_102',
										floor: '1层'
									},
									{
										text: '201室',
										value: 'room_1_1_201',
										floor: '2层'
									},
									{
										text: '202室',
										value: 'room_1_1_202',
										floor: '2层'
									},
									{
										text: '1001室',
										value: 'room_1_1_1001',
										floor: '10层'
									},
									{
										text: '1002室',
										value: 'room_1_1_1002',
										floor: '10层'
									}
								]
							},
							{
								text: '2单元',
								value: 'unit_1_2',
								children: [{
										text: '101室',
										value: 'room_1_2_101',
										floor: '1层'
									},
									{
										text: '102室',
										value: 'room_1_2_102',
										floor: '1层'
									},
									{
										text: '1001室',
										value: 'room_1_2_1001',
										floor: '10层'
									}
								]
							}
						]
					},
					{
						text: '2栋',
						value: 'building_2',
						children: [{
								text: '1单元',
								value: 'unit_2_1',
								children: [{
										text: '801室',
										value: 'room_2_1_801',
										floor: '8层'
									},
									{
										text: '802室',
										value: 'room_2_1_802',
										floor: '8层'
									}
								]
							},
							{
								text: '2单元',
								value: 'unit_2_2',
								children: [{
										text: '901室',
										value: 'room_2_2_901',
										floor: '9层'
									},
									{
										text: '902室',
										value: 'room_2_2_902',
										floor: '9层'
									}
								]
							}
						]
					},
					{
						text: '3栋',
						value: 'building_3',
						children: [{
							text: '1单元',
							value: 'unit_3_1',
							children: [{
									text: '501室',
									value: 'room_3_1_501',
									floor: '5层'
								},
								{
									text: '502室',
									value: 'room_3_1_502',
									floor: '5层'
								}
							]
						}]
					}
				],
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
			// await this.getXmmc()
			this.getFormFromVuex()
		},
		methods: {
			getFormFromVuex() {
				// 页面初始化赋值
				this.formData = this.oneformData
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
			//项目名称模糊查询
			getXmmcSearch(val) {
				clearTimeout(this.inputTimer)
				this.inputTimer = setTimeout(() => {
					// 你原来的逻辑
					console.log('项目名称模糊查询')
					uni.showLoading({
						icon: 'none',
						title: '查询项目中...'
					})
					setTimeout(() => {
						this.allowClickLd = true
						uni.hideLoading()
					}, 1000)
				}, 1500)
			},
			saveToVuex() {
				this.setFormData({
					formKey: 'oneformData',
					data: this.formData
				})
				this.setFormData({
					formKey: 'twoformData',
					data: {
						'formData2': this.formData2,
						'formData3': this.formData3
					}
				})
			},
			async formValidate() {
				try {
					const tasks = [
						this.$refs.form.validate(),
						this.$refs.form3.validate()
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

			openCascader() {
				if (!this.formData.gfrxm) {
					Toast('请先填写项目名称')
					return
				}

				if(this.allowClickLd){
					this.showCascader = true
				}
			},
			// 级联选择变化时
			onCascaderChange({value, selectedOptions}) {
				this.cascaderValue = value
			},
			// 级联选择完成确认
			onCascaderFinish({value, selectedOptions}) {
				this.showCascader = false
				this.formData.lddyfh = selectedOptions.map(o => o.text).join(' · ')
				this.formData.lddyfhLabel = selectedOptions.map(o => o.value).join(' · ')
			},
		}
	}
</script>
<style scoped lang="scss">

</style>
