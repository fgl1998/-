/**
* 组件详解：具体使用请请考 /pages/mini-area/index.vue。 注：本文件注释代码中的示例只列举了某一个参数
* 参数：
必填参数：
可选参数：
round： 顶部圆角样式。默认值 false
maskCloseable：点击遮罩层关闭。默认值 false
tabNum： 控制可选择数量。
label： 选择框左边标题。
value： 选择的值，即最终结果。当传入带'-'符号的地址时，会自动解析，默认选中
selected： 默认选中省市级等，减少操作。例如：'四川省-遂宁市' 则会默认选中，下一次选择从遂宁市的区县开始选择
事件：
click: 点击按钮时触发,
change: 选择完成过后触发。返回一个数组，依次为选择的值[];
*/
<template>
	<view class="mini-area-wrapper">
		<!-- <mini-select :required="required" :label="label" :select="isShowPopup"
			:value="tempObj.namepath ? tempObj.namepath : tempObj.areaname ? tempObj.areaname : defaultValue"
			@click="handleShow"></mini-select>
		<view @click="handleShow" class="pickYz resumePicker">
			<span class="resume-label">{{lastObj.areaname ? lastObj.areaname : '必选'}}</span>
			<img src="/static/images/arrow-d.png" class="arrow">
		</view> -->
		<mini-popup :isShowPopup="isShowPopup&& !disabled" :maskCloseable="maskCloseable" @clickMask="clickMask">
			<view class="popup-content-wrapper" :class="round?'round':''">
				<view class="toolbar">
					<view @click="resetChoosed" class="reset-btn">清空选择</view>
					<view class="left">地区选择</view>
					<view class="right" @click.stop="closePopup">
						确认选择
					</view>
				</view>
				<view class="tabs">
					<span v-show="isShowProviceTab" :class="currentSelectedStep===1?'active':''"
						@click="clickProvinceTab">{{selectedProvice.aac010}}</span>
					<span v-show="isShowCityTab" :class="currentSelectedStep===2?'active':''"
						@click="clickCityTab">{{selectedCity.aac010}}</span>
					<span v-show="isShowAreaTab" :class="currentSelectedStep===3?'active':''"
						@click="clickAreaTab">{{selectedArea.aac010}}</span>
					<span v-show="isShowTownTab" :class="currentSelectedStep===4?'active':''"
						@click="clickTownTab">{{selectedTown.aac010}}</span>
					<span v-show="isShowTreeTab" :class="currentSelectedStep===5?'active':''"
						@click="clickTreeTab">{{selectedTree.aac010}}</span>
				</view>
				<scroll-view class="tab-content" scroll-y>
					<!-- 省份选择 -->
					<view class="province" v-show="currentSelectedStep===1" :class="currentSelectedStep===1?'':'out'">
						<ul>
							<block v-for="(item,index) in province" :key="index">
								<li @click.stop="clickProvinceItem(item,index)" :class="item.selected?'active':''">
									<span>{{item.areaname}}</span>
									<i class="icon icon-hook" v-show="item.selected"></i>
								</li>
							</block>
						</ul>
					</view>
					<!-- 市区选择 -->
					<view class="city" v-show="currentSelectedStep===2" :class="currentSelectedStep===2?'':'out'">
						<ul>
							<block v-for="(item, index) in city" :key="index">
								<li @click="clickCityItem(item,index)" :class="item.selected?'active':''">
									<span>{{item.areaname}}</span>
									<i class="icon icon-hook" v-show="item.selected"></i>
								</li>
							</block>
						</ul>
					</view>
					<!-- 区县选择 -->
					<view class="area" v-show="currentSelectedStep===3" :class="currentSelectedStep===3?'':'out'">
						<ul>
							<block v-for="(item, index) in area" :key="index">
								<li @click="clickAreaItem(item,index)" :class="item.selected?'active':''">
									<span>{{item.areaname}}</span>
									<i class="icon icon-hook" v-show="item.selected"></i>
								</li>
							</block>
						</ul>
					</view>
					<!-- 乡镇选择 -->
					<view class="town" v-show="currentSelectedStep===4" :class="currentSelectedStep===4?'':'out'">
						<ul>
							<block v-for="(item, index) in town" :key="index">
								<li @click="clickTownItem(item,index)" :class="item.selected?'active':''">
									<span>{{item.areaname}}</span>
									<i class="icon icon-hook" v-show="item.selected"></i>
								</li>
							</block>
						</ul>
					</view>
					<!-- 街道选择 -->
					<view class="town" v-show="currentSelectedStep===5" :class="currentSelectedStep===5?'':'out'">
						<ul>
							<block v-for="(item, index) in tree" :key="index">
								<li @click="clickTreeItem(item,index)" :class="item.selected?'active':''">
									<span>{{item.areaname}}</span>
									<i class="icon icon-hook" v-show="item.selected"></i>
								</li>
							</block>
						</ul>
					</view>
					<!-- 加载中 -->
					<view class="loading" :style="{display:isShowLoading?'flex':'none'}">
						<i class="icon icon-loading"></i>
					</view>
				</scroll-view>
			</view>
		</mini-popup>
	</view>
</template>
<script>
	export default {
		name: 'mini-area',
		props: {
			label: {
				type: String,
				default: ''
			},
			provinceName: {
				type: String,
				default: ''
			},
			// 多余
			// value: {
			//     type: String,
			//     default: ''
			// },
			defaultValue: {
				type: String,
				default: ''
			},
			isAreacode: { // 传入码值
				type: Boolean,
				default: false
			},
			limitProvinceCode: { // 限制省
				type: String,
				default: ''
			},
			limitCityCode: { // 限制市
				type: String,
				default: ''
			},
			limitAreaCode: { // 限制区
				type: String,
				default: ''
			},
			limitFloor: { // 限制选择层级 默认3级
				type: Boolean,
				default: true
			},
			minFloor: { //最小选择层级
				type: Number,
				default: 3
			},
			// 点击遮罩层是否可关闭
			maskCloseable: {
				type: Boolean,
				default: true
			},
			round: {
				type: Boolean,
				default: false
			},
			tabNum: {
				type: Number,
				default: 4
			},
			// 默认地区 进入之后自动选择
			selected: {
				type: String,
				default: ''
			},
			required: {
				type: Boolean,
				default: false
			},
			disabled: {
				type: Boolean,
				default: false
			}
		},
		data() {
			return {
				// 是否显示该组件
				isShowPopup: false,
				isShowLoading: true,
				isShowProviceTab: true,
				isShowCityTab: false,
				isShowAreaTab: false,
				isShowTownTab: false,
				isShowTreeTab: false,
				// 省份数据
				province: '',
				// 市区数据
				city: [],
				// 区县数据
				area: [],
				// 乡镇数据
				town: [],
				// 街道数据
				tree: [],
				// 选择的省份数据
				selectedProvice: {
					aac010: '省级'
				},
				// 选择的市区数据
				selectedCity: {
					aac010: '市级'
				},
				// 选择的区县数据
				selectedArea: {
					aac010: '区(市)县'
				},
				// 选择的乡镇数据
				selectedTown: {
					aac010: '街道/乡镇'
				},
				selectedTree: {
					aac010: '社区/村'
				},
				// 当前选择步骤 1选择省份 2选择城市 3选择区县 4选择乡镇
				currentSelectedStep: 1,
				// 设置默认值
				defaultValueArr: [],
				lastObj: {}, // 最后的数据
				tempObj: {}
			};
		},
		created() {

		},
		watch: {
			'defaultValue': { //总行改变监听
				handler(newValue, oldvalue) {
					if (this.isAreacode && this.defaultValue) {
						let areaCode = this.defaultValue
						if (this.defaultValue.length == 6) {
							areaCode = this.defaultValue + '000000'
						}
						if (this.defaultValue.length > 12) {
							areaCode = this.defaultValue.substr(0, 12)
						}
						this.getAreaname(areaCode)
					}
				},
				immediate: true
			},
		},
		mounted() {
			// console.log(this.province)
			this.currentSelectedStep = 1
			let province = []
			let temp = []
			let tempCode = [];
			let param = {
				no: '000-0017',
				data: JSON.stringify({
					parentid: '1'
				}),
			}
			this.$base.post('', param, data => {
				try {
					if (data.serviceSuccess) {
						// data.qhList
						temp = data.data.qhList.map(item => item.aaa021)
						tempCode = data.data.qhList.map(item => item.childid)
						if (!this.limitProvinceCode) {
							temp.forEach((item, index) => { // 加选中属性
								province.push({
									areaname: item,
									areaid: tempCode[index],
									selected: index == 0 ? true : false
								})
							})
						} else {
							let tempCode = [this.limitProvinceCode]
							tempCode.forEach((item, index) => { // 加选中属性
								province.push({
									areaname: temp[index],
									areaid: item,
									selected: index == 0 ? true : false
								})
							})
						}
						this.province = province
						if (this.minFloor == 1) {
							this.lastObj = province[0];
							this.selectedArea['selectObj'] = province[0]
						}
						if (this.provinceName != '') { // 默认省
							this.province.forEach((item, index) => {
								item.selected = false
								if (item.areaname == this.provinceName) {
									item.selected = true
									this.clickProvinceItem(item, index)
								}
							})
						}
						if (this.limitProvinceCode) {
							this.clickProvinceItem(this.province[0], 0)
						}
					} else {
						this.$message.error('查询地区出错！请稍后重试')
					}
				} catch (e) {
					this.$message.error('查询地区出错！请稍后重试')
				}
			})


		},
		methods: {
			getAreaname(childid) {
				let param = {
					no: '000-0017',
					data: JSON.stringify({
						parentid: childid
					}),
				}
				this.$base.post('', param, data => {
					try {
						let result = data.resultData
						if (result.data.serviceSuccess) {
							// 查询成功
							this.tempObj = result.data.data.list
						} else {
							result.data.errors ? this.$message.error(result.data.errors[0].msg) : this.$message
								.error('查询地区出错！请稍后重试')
						}
					} catch (e) {
						this.$message.error('查询地区出错！请稍后重试')
					}
				})
			},
			// 点击灰色遮罩层
			clickMask(e) {
				// console.log('遮罩层点击', e)
				this.isShowPopup = e;
				this.$emit('clickMaskClose')
			},
			handleShow() {
				if (this.disabled) {
					return
				}
				this.isShowPopup = !this.isShowPopup;
				this.isShowLoading = false
			},
			// 省点击
			clickProvinceItem(item, index) { // 省点击
				let _this = this
				this.clearSelected(this.province, index) // 清空选中
				if (item.isLeaf == true) { //改节点没有子节点
					_this.lastObj = item;
					return;
				}
				if (this.minFloor == 1) {
					_this.lastObj = item;
					_this.selectedArea['selectObj'] = item
				}
				let param = {
					no: '000-0017',
					data: JSON.stringify({
						parentid: item.areaid
					}),
				}
				this.$base.post('', param, data => {
					if (_this.limitCityCode) {
						_this.chageCity(data.data.qhList);
					} else {
						_this.city = _this.addSelected(data.data.qhList)
					}
					_this.currentSelectedStep = 2
					_this.isShowCityTab = true
				})
			},
			// 市点击
			clickCityItem(item, index) { // 市点击
				let _this = this;
				this.clearSelected(this.city, index) // 清空选中
				if (item.isLeaf == true) { //改节点没有子节点
					return;
				}
				if (this.minFloor == 2) {
					_this.lastObj = item;
					_this.selectedArea['selectObj'] = item
				}
				let param = {
					no: '000-0017',
					data: JSON.stringify({
						parentid: item.areaid
					}),
				}
				this.$base.post('', param, data => {
					if (_this.limitAreaCode) {
						_this.area = [];
						_this.chageArea(data.data.qhList)
					} else {
						_this.area = _this.addSelected(data.data.qhList)
					}
					_this.currentSelectedStep = 3
					_this.isShowAreaTab = true
				})
			},
			// 区点击
			clickAreaItem(item, index) {
				let _this = this
				this.clearSelected(this.area, index) // 清空选中
				_this.lastObj = item;
				_this.selectedArea['selectObj'] = item
				if (item.isLeaf == true) { //改节点没有子节点
					return;
				}
				if (!this.limitFloor) {
					return
				}
				let param = {
					no: '000-0017',
					data: JSON.stringify({
						parentid: item.areaid
					}),
				}
				this.$base.post('', param, data => {
					_this.town = _this.addSelected(data.data.qhList)
					_this.currentSelectedStep = 4
					_this.isShowTownTab = true
				})
			},
			// 县点击
			clickTownItem(item, index) {
				let _this = this
				this.clearSelected(this.town, index) // 清空选中
				_this.lastObj = item;
				_this.selectedTown['selectObj'] = item
				if (item.isLeaf == true) { //改节点没有子节点
					return;
				}
				let param = {
					no: '000-0017',
					data: JSON.stringify({
						parentid: item.areaid
					}),
				}
				this.$base.post('', param, data => {
					if (data.serviceSuccess) {
						_this.tree = _this.addSelected(data.data.qhList)
						_this.currentSelectedStep = 5
						_this.isShowTreeTab = true
					} else {
						_this.lastObj = item
					}
				})
			},
			// 街道，点击，最后数据确定
			clickTreeItem(item, index) {
				this.clearSelected(this.tree, index) // 清空选中
				this.lastObj = item
			},
			clickProvinceTab() { // 头部省点击
				this.isShowCityTab = false
				this.isShowAreaTab = false
				this.isShowTownTab = false
				this.isShowTreeTab = false
				this.currentSelectedStep = 1
				this.lastObj = {}
				// this.clearSelected(this.province, -1) // 清空选中
			},
			clickCityTab() { // 头部市点击
				this.isShowAreaTab = false
				this.isShowTownTab = false
				this.isShowTreeTab = false
				this.currentSelectedStep = 2
				this.lastObj = {}
				// this.clearSelected(this.city, -1) // 清空选中
			},
			clickAreaTab() { // 头部区点击
				this.isShowTownTab = false
				this.isShowTreeTab = false
				this.currentSelectedStep = 3
				this.lastObj = this.selectedArea['selectObj']
				// this.clearSelected(this.area, -1) // 清空选中
			},
			clickTownTab() { // 头部县点击
				this.isShowTreeTab = false
				this.currentSelectedStep = 4
				this.lastObj = this.selectedTown['selectObj']
				// this.clearSelected(this.town, -1) // 清空选中
			},
			addSelected(arr) {
				if (arr.length == 0) {
					this.$message.error('该区域下暂无数据，请重新选择！')
					return []
				}
				arr.forEach((item, index) => {
					item['selected'] = false;
					item.areaname = item.aaa021
					item.areaid = item.childid
				})
				return arr
			},
			chageCity(arr) {
				if (!arr) {
					return
				}
				this.city = []
				this.city.push(arr.find(item => item.childid == this.limitCityCode))
			},
			chageArea(arr) {
				let length = arr.length;
				let temp = []
				arr.forEach((item, index) => {
					if (item.areaname != '市辖区' && index != length - 1) {
						item['selected'] = false
						temp.push(item)
					}
				})
				this.area = []
				this.area.push(temp.find(item => item.childid == this.limitAreaCode))
			},
			clearSelected(arr, _index) {
				// console.log(_index,arr[_index])
				arr.forEach(item => {
					item['selected'] = false
				})
				arr[_index]['selected'] = true
			},
			resetChoosed() { // 清空选择
				this.isShowCityTab = false
				this.isShowAreaTab = false
				this.isShowTownTab = false
				this.isShowTreeTab = false
				this.currentSelectedStep = 1
				this.tempObj = {}
				this.lastObj = {}
				this.$emit('addressBack', this.lastObj)
			},
			// 确认按钮
			closePopup() { // 点击确定
				// console.log(this.lastObj, 'ssss')
				if (!this.limitFloor && this.lastObj.aae007) {
					this.isShowPopup = false;
					// this.value = this.lastObj
					this.tempObj = this.lastObj
					this.$emit('addressBack', this.lastObj)
					return
				}
				if (this.lastObj.areaname) {
					this.isShowPopup = false;
					// this.value = this.lastObj
					this.tempObj = this.lastObj
					this.$emit('addressBack', this.lastObj)
				} else {
					this.$toast('请继续选择');
				}
			},
		},
	};
</script>
<style lang="scss" scoped>
	/*
        共用 全局属性 
    */
	// 左右间距
	$space-LR: 30rpx;
	$fontSize: 30rpx;


	// 主色调
	$color-primary: #2d8cf0;
	// Light Primary 常用于 hover
	$color-light-primary: #5cadff;
	// Dark Primary 常用于 active。
	$color-dark-primary: #2b85e4;

	// 辅助色
	$color-info: #2db7f5;
	$color-success: #19be6b;
	$color-wraning: #ff9900;
	$color-error: #ed4014;

	// 标题 
	$color-title: #464c5b;
	// 正文
	$color-content: #657180;
	// 辅助
	$color-sub: #9ea7b4;
	// 失效
	$color-disabled: #c5c8ce;
	// 边框
	$color-border: #dcdee2;
	// 背景
	$color-background: #f8f8f9;
	// 分割线
	$color-divider: #e8eaec;

	// 标题 
	$font-size-title: 28rpx;
	// 正文
	$font-size-content: 28rpx;
	// 辅助
	$font-size-sub: 24rpx;

	/* 
        input 组件变量
    */
	$mini-input-label-width: 180rpx;
	$mini-input-label-fontSize: 28rpx;
	$mini-input-input-fontSize: 26rpx;
	$mini-input-height: 84rpx;
	$mini-input-borderColor: #e5e5e5;
	$mini-input-backgroundColor: #fff;
	$mini-input-color: #36404a;
	$mini-input-paddingLeft: 0rpx;
	$mini-input-clear-backgroundColor: #999;
	$mini-input-clear-size: 16px;
	$mini-input-clear-color: #fff;

	/* 
        radio 组件变量
    */
	$mini-radio-height: 84rpx;
	$mini-radio-borderColor: #e5e5e5;
	$mini-radio-backgroundColor: #fff;
	$mini-radio-iconSize: 48rpx;
	$mini-radio-fontSize: 28rpx;


	/* 
        checkbox 组件变量
    */
	$mini-checkbox-height: 84rpx;
	$mini-checkbox-borderColor: #e5e5e5;
	$mini-checkbox-backgroundColor: #fff;
	$mini-checkbox-iconSize: 48rpx;
	$mini-checkbox-fontSize: 28rpx;

	/* 
        swiperOut 组件变量
    */

	ul {
		padding-left: 0;
	}

	.arrow {
		width: 8px;
		height: 5px;
	}

	.pickYz {
		background: #f8f8f8;
		display: flex;
		justify-content: center;
		align-items: center;
		height: 84rpx;
		border: 1px solid #eeeeee;
		border-bottom: 2rpx solid whitesmoke;
		background: white;
	}

	.mini-area-wrapper {
		position: relative;
	}

	.mini-area-wrapper:after {
		content: '';
		position: absolute;
		width: calc(100% - 30rpx);
		height: 2rpx;
		background: #e5e5e5;
		bottom: 0;
		left: 30rpx;
	}

	$space-left: 40rpx;
	$active-color: #3b93f7;

	.mini-area-wrapper {
		// height: 88rpx;
		display: block;
		width: 100%;
		overflow: hidden;
	}

	.popup-content-wrapper {
		width: 100%;
		display: flex;
		flex-direction: column;
		height: 80vh;
		background-color: #fff;
		overflow: hidden;

		&.round {
			border-top-right-radius: 30rpx;
			border-top-left-radius: 30rpx;
		}
	}

	.toolbar {
		position: relative;
		font-size: 28rpx;
		line-height: 50rpx;
		padding: 20rpx 0;
		box-sizing: border-box;
		display: flex;
		justify-content: space-around;
		border-bottom: 1px solid whitesmoke;

		.left {
			// color: $active-color;
		}

		.right {
			border: 1px solid $active-color;
			color: $active-color;
			padding: 0 12rpx;
		}

		.reset-btn {
			background: $active-color;
			color: white;
			padding: 0 12rpx;
		}

		// .icon-close {
		//     background: $active-color;
		//     color: white;
		// }
	}

	.tabs {
		border-bottom: 1px solid #eee;
		font-size: 30rpx;
		padding-left: $space-left;
		display: flex;
		flex-wrap: wrap;

		span {
			color: #000;
			line-height: 80rpx;
			position: relative;
			margin-right: 40rpx;

			&::after {
				content: "";
				width: 100%;
				height: 1px;
				position: absolute;
				left: 0;
				bottom: -1px;
				opacity: 0;
				transition: all 0.3s;
				background-color: $active-color;
			}

			&.active {
				color: $active-color;

				&::after {
					opacity: 1;
				}
			}
		}
	}

	.tab-content {
		flex: 1;
		overflow: hidden;
		position: relative;

		.province,
		.city,
		.area,
		.town {
			min-height: 100%;
			transform: translateX(0);
			animation: rightIn 0.5s;
		}
	}

	li {
		font-size: 28rpx;
		line-height: 70rpx;
		padding-left: $space-left;
		color: #333;
		display: flex;
		justify-content: space-between;

		&.active {
			color: $active-color;
		}
	}

	.icon-hook {
		line-height: 60rpx;
		color: $active-color;
		margin-right: 20rpx;
		font-size: 30rpx;
		font-weight: 700;
	}

	.loading {
		background-color: #fff;
		width: 100%;
		height: 100%;
		color: #000;
		animation: none;
		display: flex;
		position: absolute;
		top: 0;
		left: 0;
		overflow: hidden;
		align-items: center;
		justify-content: center;
		animation: none;

		.icon {
			width: auto;
			height: auto;
			font-size: 100rpx;
			line-height: 1;
			animation: rotate 1.5s linear infinite;
			color: #f00;
		}
	}
</style>