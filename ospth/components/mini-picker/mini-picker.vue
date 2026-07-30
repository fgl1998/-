<template>
	<view :key="componentKey" style="width: 100%;">
		<view v-if="isStop" class="mini-picker-wrapper" @click.stop="handleShowPopup">
			<view class="left">
				<span style="color: red" v-show="required">*</span><span v-if="label">{{ label }}</span>
			</view>
			<view class="right">
				<view class="pos"></view>
				<u-input type="text" :placeholder="placeholder" :value="resetValue" disabled readonly />
			</view>
			<i class="icon" :class="isShowPopup ? 'select' : ''"></i>
		</view>
		<view v-if="!isStop" class="mini-picker-wrapper" @click="handleShowPopup">
			<view class="left">
				<span style="color: red" v-show="required">*</span><span v-if="label">{{ label }}</span>
			</view>
			<view class="right">
				<view class="pos"></view>
				<u-input type="text" :placeholder="placeholder" :value="resetValue" disabled readonly />
			</view>
			<i class="icon" :class="isShowPopup ? 'select' : ''"></i>
		</view>
		<mini-popup :isShowPopup="isShowPopup&& !disabled" @clickMask="clickMask">
			<view class="mini-picker-content">
				<view class="mini-picker-toolbar">
					<mini-button name="取消" inline :styles="{ border: '0', color: '#999', padding: '10rpx 30rpx' }"
						@click="handleShowPopup"></mini-button>
					<mini-button name="确定" inline
						:styles="{ border: '0', color: 'rgb(254, 145, 14)', padding: '10rpx 30rpx' }"
						@click.stop="change">
					</mini-button>
					<view class="text">{{ selectPrompt }}</view>
				</view>
				<picker-view class="mini-picker-view" indicatorStyle="height:40px" :style="pickerViewStyle"
					@change="pickerChange" :value="currentItem">
					<picker-view-column class="mini-picker-view-column">
						<block v-for="(item, index) in data" :key="index">
							<view class="mini-picker-item" :style="pickerItemStyle">
								{{ rangeKey ? item[rangeLabel] : item }}
							</view>
						</block>
					</picker-view-column>
				</picker-view>
			</view>
		</mini-popup>
	</view>
</template>
<script>
	export default {
		name: 'mini-picker',
		props: {
			isStop: {
				type: Boolean,
				default: true,
			},
			disabled: {
				type: Boolean,
				default: false,
			},
			required: {
				type: Boolean,
				default: false,
			},
			label: {
				type: String,
				default: '',
			},
			placeholder: {
				type: String,
				default: '',
			},
			value: {
				type: String | Number,
				default: '',
			},
			mode: {
				type: String,
				default: 'selector',
			},
			range: {
				type: Array,
				default () {
					return []
				},
			},
			rangeKey: {
				type: String,
				default: 'value',
			},
			rangeLabel: {
				type: String,
				default: 'label',
			},
			// 选择提示
			selectPrompt: {
				type: String,
				default: '请选择',
			},
			// 集 传入该值 可用于内部处理获取数据
			collection: {
				type: String,
				default: '',
			},
			filterArr: {
				//  码值过滤 reverseFilter关联
				type: [Array, String],
				default () {
					return []
				},
			},
			reverseFilter: {
				// 码值过滤 true为显示的 false为剔除的
				type: Boolean,
				default: true,
			},
		},
		data() {
			return {
				componentKey: 0,
				// 渲染数据
				data: [],
				// 每一个选择项的高度
				itemHeight: 40,
				// 可视选择的数目 必须为基数 目前没有兼容偶数
				itemNumber: 6,
				// 记录当前位置 从0开始
				currentItem: [],
				index: 0,
				// 是否显示选择弹窗
				isShowPopup: false,
				resetValue: '',
			}
		},
		components: {},
		watch: {
			value: function(e) {
				if (e == '') {
					this.resetValue = ''
				} else {
					this.init()
				}
			},
			range: {
				handler(newName, oldName) {
					this.init()
				},
				immediate: true,
				deep: true,
			},
			filterArr: {
				handler(newName, oldName) {
					this.init()
				},
				immediate: true,
				deep: true,
			},
			reverseFilter() {
				this.init()
			},
		},
		mounted() {
			this.init()
		},
		methods: {
			init() {
				// 存在过滤属性 进行筛选
				// this.filterArr.length ? this.filterArr = JSON.parse(this.filterArr) : ''
				// console.log(this.filterArr,'过滤数组')
				const _this = this
				const rangeKey = this.rangeKey
				const collection = this.collection
				const value = this.value
				// 检测 range 是否合格
				const isExistRange = this.range && this.range.length > 0
				// 如果存在 collection 不为空 并且 range 不存在
				this.data = []
				if (collection && !isExistRange) {
					_this.$dict.getDictList(collection, function(res) {
						// 最后将获取到的数据赋值于 data
						if (_this.filterArr.length) {
							// 存在过滤属性 参与过滤
							let filterArr = []
							typeof _this.filterArr[0] == 'number' ?
								(filterArr = JSON.parse(JSON.stringify(_this.filterArr.map(String)))) :
								(filterArr = JSON.parse(JSON.stringify(_this.filterArr)))
							if (_this.reverseFilter) {
								if (res) {
									_this.data = res.filter((item, index) => {
										return filterArr.includes(item.value)
									})
								}
							} else {
								_this.data = res.filter((item, index) => {
									return filterArr.indexOf(item.value) < 0
								})
							}
						} else {
							_this.data = res
						}
						if (_this.data) {
							_this.data.forEach((item, index) => {
								if (_this.value == item.value) {
									_this.resetValue = item.label
								}
							})
						}
					})
				}
				if (isExistRange) {
					let res = this.range
					if (this.filterArr.length) {
						// 存在过滤属性 参与过滤
						let filterArr = []
						typeof _this.filterArr[0] == 'number' ?
							(filterArr = JSON.parse(JSON.stringify(_this.filterArr.map(String)))) :
							(filterArr = JSON.parse(JSON.stringify(_this.filterArr)))
						if (_this.reverseFilter) {
							_this.data = res.filter((item, index) => {
								return filterArr.includes(Number(item.value))
							})
						} else {
							_this.data = res.filter((item, index) => {
								return filterArr.indexOf(item.value) < 0
							})
						}
					} else {
						this.data = this.range
					}
					if (_this.data) {
						_this.data.forEach((item, index) => {
							if (typeof item == 'object') {
								if (_this.value == item.value) {
									_this.resetValue = item.label
								}
							}
						})
					}
				}

				const data = this.data
				data.map((item, index) => {
					if (value === item[rangeKey] && rangeKey) {
						this.currentItem = [index]
					}
					if (value === item && !rangeKey) {
						this.currentItem = [index]
					}
				})
			},
			pickerChange(e) {
				// console.log(e.target.value);
				this.index = e.target.value[0]
				this.currentItem = [this.index]
			},
			handleShowPopup() {
				if (!this.disabled) {
					this.isShowPopup = !this.isShowPopup
				}
			},
			// 返回结果
			returnResult() {
				const index = this.index
				const data = this.data
				const rangeKey = this.rangeKey
				let value = ''
				if (!rangeKey) {
					value = data[index]
				} else {
					value = data[index][rangeKey]
				}
				this.currentItem = [index]
				// this.value = value;
				if (rangeKey) {
					this.resetValue = data[index][this.rangeLabel]
				}
				this.$emit('input', value)
				this.$emit('change', data[index])
				this.$emit('onChange', value)
				this.componentKey += 1
			},
			// 点击确定按钮触发的事件
			change() {
				this.returnResult()
				this.handleShowPopup()
			},
			clickMask(e) {
				this.isShowPopup = e
			},
		},
		computed: {
			pickerViewStyle() {
				const itemHeight = this.itemHeight
				const itemNumber = this.itemNumber
				let str = ''
				str += `height: ${itemNumber * itemHeight}px;`
				return str
			},
			pickerItemStyle() {
				const itemHeight = this.itemHeight
				let str = ''
				str += `line-height: ${itemHeight}px;`
				str += `height: ${itemHeight}px;`
				return str
			},
		},
	}
</script>

<style lang="scss" scoped>
	@import '@/static/css/sass/mini-picker.scss';

	.mini-picker-item {
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	.right {
		position: relative;

		.pos {
			position: absolute;
			top: 0;
			left: 0;
			width: 100%;
			height: 100%;
			// background-color: red;
			z-index: 99;
		}
	}
</style>