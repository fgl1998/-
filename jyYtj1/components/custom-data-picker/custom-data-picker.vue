<!-- 级联拉下组件（用于树状数据） -->
<template>
	<div class='custom-data-picker' :style="{width:width}" >
		<uni-data-picker :localdata="treeData" v-slot:default="{data, error, options}" v-model="newVal"
			:readonly="disabled" :map="{text:labelKey,value:valueKey}" clearIcon="" :popup-title="placeholder" @change="onChange"
			@nodeclick="nodeclick" @stepsearch="(res) => $emit('stepsearch',res)"
			@popupopened="(res) => $emit('popupopened',res)" @popupclosed="popupclosed">
			<view class="picker-box" :class="{disabled:disabled}" >
				<view v-if="error" class="error">
					<text>{{error}}</text>
				</view>
				<view v-else-if="data.length && showValueType=='all'" class="selected">
					<view v-for="(item,index) in data" :key="index" class="selected-item">
						<text>{{item.text}}</text>
					</view>
				</view>
				<view v-else-if="data.length  && showValueType=='last'" class="selected" >
					{{data[data.length - 1].text}}
				</view>
				<view v-else>
					<text style="color: #999;">请选择</text>
				</view>
			</view>
		</uni-data-picker>
	</div>
</template>

<script>
	export default {
		name: 'customDataPicker',
		props: {
			// 树数据
			treeData: {
				type: Array,
				default: () => []
			},
			// 显示值的key
			labelKey: {
				type: String,
				default: 'label'
			},
			// 码值的key
			valueKey: {
				type: String,
				default: 'value'
			},
			// 提示
			placeholder: {
				type: String,
				default: '请选择'
			},
			// 禁用
			disabled: {
				type: Boolean,
				default: false
			},
			// v-model绑定值
			value: {
				default: ''
			},
			// 展示数据方式 （last: 只展示最后一项，all:展示所有）
			showValueType: {
				type: String,
				default: 'all'
			},
			width: {
				type: String,
				default: '100%'
			},
			// 是否必须选择完所以数据才返回
			isCheckAll: {
				type: Boolean,
				default: true
			}
		},
		data() {
			return {
				newVal: '',
				checkArr: [],//选中数据集
			}
		},
		watch: {
			value:{
				handler(val) {
					this.newVal = val
				},
				immediate:true,
				deep: true,
			}
		},
		methods: {
			onChange(res) {
				if(this.isCheckAll){
					let arr = res.detail.value
					this.$emit('change', res)
					this.$emit('input', arr[arr.length - 1].value)
				}
			},
			// 递归查找数据中的值
			setArrData(arr,val,backArr=[]){
				arr.forEach(item => {
					if(item[this.valueKey]== val ){
						this.checkArr = [...backArr,{text:item[this.labelKey],value:item[this.valueKey]}]
					} else {
						if(item.children){
							let newBackArr = [...backArr,{text:item[this.labelKey],value:item[this.valueKey]}]
							this.setArrData(item.children,val,newBackArr)
						}
					}
				})
			},
			// 点击时设置数据
			nodeclick(item){
				if(!this.isCheckAll){
					this.setArrData(this.treeData,item[this.valueKey])
				}
				this.$emit('nodeclick',item)
			},
			// 关闭时传输数据
			popupclosed(){
				if(!this.isCheckAll){
					this.$nextTick(() => {
						this.$emit('change', this.checkArr)
						if(this.checkArr.length !== 0) {
							this.$emit('input', this.checkArr[this.checkArr.length - 1].value)
						} else {
							this.$emit('input', '')
						}
					})
				}
				this.$emit('popupclosed')
			}
		}
	}
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
		cursor: pointer;
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
		
		.selected{
			display: flex;
			text-align: center;
			width: 100%;
			overflow: hidden;
			white-space: nowrap;
			overflow: hidden;
			text-overflow: ellipsis;
			.selected-item{
				overflow: hidden;
				white-space: nowrap;
				overflow: hidden;
				text-overflow: ellipsis;
			}
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
