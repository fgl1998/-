<template>
	<!-- <view class="uni-list-cell">
		<view class="uni-list-cell-left"><text v-show="required" class="sup">*</text>{{label}}</view>
		<view class="uni-list-cell-db">
			<picker :mode="mode" :fields="fields" @change="PickerMode" @cancel="pickerCancel" name="mode" :disabled="disabled" :value="rangeIndex"
				range-key="name" :range="data">
				<view v-if="fields != 'year'">
					<view class="uni-input" v-if="!disabled">
						{{value ? (data[rangeIndex] ? data[rangeIndex].name : '---') : '请选择'}}
					</view>
					<view class="uni-input" v-else>
						{{value ? (data[rangeIndex] ? data[rangeIndex].name : '---') : '---'}}
					</view>
				</view>
				<view v-else>
					<view class="uni-input">
						{{value ? value : '---'}}
					</view>
				</view>
			</picker>
		</view>
	</view> -->
	<picker :mode="mode" :fields="fields" @change="PickerMode" @cancel="pickerCancel" name="mode" :disabled="!isEdit"
		:value="rangeIndex" :range-key="collect?'label':'name'" :range="data">
		<div class="picker-box" :class="!isEdit?'disabled':''">
			{{value ? (data[rangeIndex] ? data[rangeIndex].label : '---') : '请选择'}}
		</div>
		<uni-easyinput style="display: none;" v-model='value'/>
	</picker>
	
</template>

<script>
	export default {
		name: 'customPicker',
		props: {
			// 码表 数组
			range: {
				type: Array,
				default: function() {
					return []
				}
			},
			
			//粒度
			fields: {
				type: String,
				default: ''
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
			collect: {
				type: String,
				default: ''
			},
			label: {
				type: String,
				default: '左边标题'
			},
			required: {
				type: Boolean,
				default: false
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
			reverseFilter: { // 码值过滤 true为显示的 false为剔除的
				type: Boolean,
				default: true
			},
			isEdit: { // 不编辑置灰
				type: Boolean,
				default: true
			}
		},
		created() {
			this.init()
		},
		data() {
			return {
				rangeIndex: '',
				data: []
			};
		},
		watch: {
			// 筛选深度监听 发生变化重新初始化组件
			filterCode: {
				handler(newVal, oldVal) {
					this.init()
				},
				deep: true
			},
			range: {
				handler(newVal, oldVal) {
					this.init()
				},
				deep: true
			},
			// value监听改变
			value(oldVal, newVal) {
				this.init()
			},
			collect() {
				this.init()
			},
			reverseFilter() {
				this.init()
			}
		},
		methods: {
			init() {
				// 码表查询或赋值自定义range
				if (this.collect) { // collect存在 查码表
					this.data = []
					let collect = this.collect.toUpperCase()
					let codeCacheMap = uni.getStorageSync('codeCacheMap')
					//console.log(codeCacheMap)
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
						this.data = temp
						//console.log(this.data)
						//this.setDefaultValue()
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
								this.data = temp
								this.setDefaultValue()
							} else {
								this.data = []
								this.$utils.showToast('码表中没有' + this.collect + '该码值')
							}
						})
					}
				} else { // 自定义码值数组
					this.data = this.range
					this.setDefaultValue()
				}
			},
			// 设置默认值
			setDefaultValue() {
				// 设置默认值 不考虑传错误码值的情况
				if (this.value) {
					this.data.forEach((item, index) => {
						if (item.value == this.value) {
							this.rangeIndex = index
						}
					})
				} else {
					// 如果没有默认值 默认弹出框为第一项
					this.rangeIndex = ''
				}
			},
			// 确定 改变rangeIndex
			PickerMode(e) {
				if (this.fields == 'year') {
					let info = {
						code: ''
					};
					info.code = e.detail.value;
					this.$emit('pickerChange', info, this.id)
				} else {
					this.rangeIndex = e.detail.value
					this.$emit('pickerChange', this.data[this.rangeIndex], this.id)
					this.$emit('input',this.data[this.rangeIndex].value)
				}

			},
			// 选择取消时重新设置显示的默认列
			pickerCancel(e) {
				//console.log("取消");
				if (this.value) {
					this.data.forEach((item, index) => {
						if (item.code == this.value) {
							this.rangeIndex = 0
							this.$nextTick(() => {
								this.rangeIndex = index
							})
						}
					})
				} else {
					// 如果没有默认值 默认弹出框为第一项
					this.rangeIndex = 1
					this.$nextTick(() => {
						this.rangeIndex = 0
					})
				}
			}
		},


	};
</script>

<style lang="scss" scoped>
	.picker-box {
		height: 48px;
		line-height: 48px;
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

		&.text-org {
			color: #ff7e00;
		}

	}

	.text-blue {
		/deep/ .uni-date-x {
			color: #2778ff;
		}
	}


	.input-box {
		color: #404040;
		font-size: 18px;
	}
</style>
