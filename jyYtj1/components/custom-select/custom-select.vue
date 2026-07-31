<template>
	<div class='custom-data-select' :style="{width:width,height:height}" >
		<uni-data-select @change="PickerMode" :disabled="disabled" :localdata="data" :value="rangeIndex" :clear="false" :placeholder="placeholder" :ref="refs"></uni-data-select>
	</div>
</template>

<script>
	export default {
		name: 'custom-select',
		data() {
			return {
				isShow: false,
				rangeIndex: '',
				data: [],
				dataSave: []
			}
		},
		props: {
			refs:{
				type: String,
				default: ''
			},
			// 码表 数组
			range: {
				type: Array,
				default: function() {
					return []
				}
			},

			value: {
				type: String,
				default: ''
			},
			id: {
				type: String,
				default: '',
				//required: true
			},

			label: {
				type: String,
				default: '左边标题'
			},
			placeholder: {
				type: String,
				default: '请选择'
			},

			disabled: {
				type: Boolean,
				default: false
			},
			filterCode: { // 码值过滤 reverseFilter关联
				type: Array,
				default: function() {
					return []
				}
			},

			collect: {
				type: String,
				default: ''
			},
			width: {
				type: String,
				default: '100%'
			},
			height: {
				type: String,
				default: '48px'
			},
			reverseFilter: { // 码值过滤 true为显示的 false为剔除的
				type: Boolean,
				default: true
			},
			isEdit: { // 不编辑置灰
				type: Boolean,
				default: true
			},
			trainType:{ //展示培训树
				type: Boolean,
				default: false
			}
		},
		created() {
			this.init()
		},
			watch: {
				value:{
					handler(val){
						//console.log(val)
						this.rangeIndex = val
						this.$emit('change',val,this.collect)
						this.$emit('input', val)
						//console.log(this.range)
					},
					// /immediate:true
				},
				trainType:{
					handler(val){
						if(val){
							this.initTrain()
						}
					},
					immediate:true
				},

				filterCode:{
					handler(val){
						this.filterCodeMothod()
					},
				},

			},
			methods: {
				init() {
					// 码表查询或赋值自定义range
					if (this.collect) { // collect存在 查码表
						this.data = []
						let collect = this.collect.toUpperCase()
						let codeCacheMap = uni.getStorageSync('codeCacheMap')
						if (codeCacheMap && codeCacheMap[collect]) {
							// 先过滤 在赋值
							let temp = codeCacheMap[collect];
							if (this.filterCode.length > 0) {
								if (this.reverseFilter) {
									temp = temp.filter((item, index) => {
										return this.filterCode.indexOf(item.value) >= 0
									})
								} else {
									temp = temp.filter((item, index) => {
										return this.filterCode.indexOf(item.value) < 0
									})
								}
							}

							this.setDefaultLabel(temp)

						} else { // 没有缓存或缓存中没有 重新缓存
							this.$utils.appStorage((res) => {
								if (res[collect]) {
									let temp = res[collect];
									if (this.filterCode.length > 0) {
										if (this.reverseFilter) {
											temp = temp.filter((item, index) => {
												return this.filterCode.indexOf(item.value) >= 0
											})
										} else {
											temp = temp.filter((item, index) => {
												return this.filterCode.indexOf(item.value) < 0
											})
										}
									}

									this.setDefaultLabel(temp)

								} else {
									this.data = []
									//this.$utils.showToast('码表中没有' + this.collect + '该码值')
								}
							})
						}
					} else { // 自定义码值数组
						this.data = this.range
					}
				},

				async initTrain(){
					this.trainTypeTree = await this.$utils.getTrainTypeTree()
					this.setTrainLabel(this.trainTypeTree )
				},

				// 修改label字段
				setDefaultLabel(listData) {
					// 设置默认值 不考虑传错误码值的情况
					if (listData.length>0) {
						listData.forEach((item, index) => {
							item.text = item.label
						})
						this.data = listData
						this.dataSave = listData
					} else {
						// 如果没有默认值 默认弹出框为第一项
						this.data = []
						this.dataSave = []
					}
				},
				setTrainLabel(listData) {
					// 设置默认值 不考虑传错误码值的情况
					if (listData.length>0) {
						listData.forEach((item, index) => {
							item.value = item.aca111
							item.text = item.aca112
						})
						this.data = listData
						this.dataSave = listData
					} else {
						// 如果没有默认值 默认弹出框为第一项
						this.data = []
						this.dataSave = []
					}
				},

				filterCodeMothod(){
					let temp = this.dataSave
					if (this.reverseFilter.length>0) {
						this.data = temp.filter((item, index) => {
							return this.filterCode.indexOf(item.value) >= 0
						})
					} else {
						this.data = temp.filter((item, index) => {
							return this.filterCode.indexOf(item.value) < 0
						})
					}
				},

				// 确定 改变rangeIndex
				PickerMode(e) {
					this.rangeIndex = e
					this.$emit('change', e,this.collect)
					this.$emit('input', this.rangeIndex)

				},

				// 编辑状态下付值rangeIndex
				PickerValue(name,value) {
					if(name == this.id){
						this.rangeIndex = value
						this.$emit('change', value,this.collect)
						this.$emit('input', this.rangeIndex)
					}
				},



				// 选择取消时重新设置显示的默认列
				// pickerCancel(e) {

				// 	if (this.value) {
				// 		this.data.forEach((item, index) => {
				// 			if (item.code == this.value) {
				// 				this.rangeIndex = 0
				// 				this.$nextTick(() => {
				// 					this.rangeIndex = index
				// 				})
				// 			}
				// 		})
				// 	} else {
				// 		// 如果没有默认值 默认弹出框为第一项
				// 		this.rangeIndex = 1
				// 		this.$nextTick(() => {
				// 			this.rangeIndex = 0
				// 		})
				// 	}
				// }
			},


		};
		</script>

		<style lang="scss" scoped>



		</style>
