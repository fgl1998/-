<!-- 地区选择组件 -->
<template>
	<div class='custom-address' :style="{maxWidth:maxWidth,width:maxWidth}" >
		<uni-data-picker ref="picker" :localdata="addressData" v-slot:default="{data, error, options}" v-model="newVal"
			:disabled="disabled" :map="{text:labelKey,value:valueKey}" :popup-title="placeholder" @change="onChange"
			@nodeclick="nodeclick" 
			@popupopened="(res) => $emit('popupopened',res)" @popupclosed="(res) => $emit('popupclosed',res)">
			<view class="picker-box" :class="{disabled:disabled}" >
				<view v-if="error" class="error">
					<text>{{error}}</text>
				</view>
				<view v-else-if="data.length" class="selected">
					<view v-for="(item,index) in data" :key="index" class="selected-item">
						<text>{{item.text}}</text>
					</view>
				</view>	
				<view v-else-if="initText" class="selected" >
					{{initText}}
				</view>
				<view v-else>
					<text style="color: #999;">{{placeholder}}</text>
				</view>
			</view>

		</uni-data-picker>
	</div>
</template>

<script>
	export default {
		name: 'customAddress',
		props: {
			// 显示值的key
			labelKey: {
				type: String,
				default: 'areaname'
			},
			// 码值的key
			valueKey: {
				type: String,
				default: 'areacode'
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
			maxWidth: {
				type: String,
				default: '100%'
			},
			// 查询层级
			level:{
				type: Number,
				default: 2
			},
			// 初始化展示地区
			initText: {
				type: String,
				default: ''
			},
			
		},
		data() {
			return {
				newVal: '',
				addressData: [], //地址数据
				arrLiast: [], //初选数据
			}
		},
		watch: {
			value:{
				handler(val) {
					this.newVal = val
					
				},
				immediate:true,
				deep: true,
			},
			initText:{
				handler(val) {
			
					
				},
			
				immediate:true,
				deep: true,
			}
		},
		async created() {
			await this.handleGetAddress()
		},
		methods: {
			onChange(res) {
				this.arrLiast = res.detail.value
				this.$emit('change', this.arrLiast[this.arrLiast.length - 1].value, this.arrLiast[this.arrLiast.length - 1])
				this.$emit('input', this.arrLiast[this.arrLiast.length - 1].value)			
			},
		
			nodeclick(val){
				let that = this
				if(val.arealevel == 0){
					this.addressData.map(item => {
					if(item.areaid == val.areaid){
						if(item.children && item.children.length > 0){
							this.$emit('change', this.arrLiast[this.arrLiast.length - 1].value, this.arrLiast[this.arrLiast.length - 1])
								this.$emit('input', this.arrLiast[this.arrLiast.length - 1].value)	
						}else{
							this.handleGetAddress(val,false)
						}
						} 
					})
				}else if(val.arealevel == 1){
					this.addressData.map(item => {
					if(item.areaid == val.parentid){
						item.children.map(todo => {
						if(todo.areaid == val.areaid){
							if(todo.children && todo.children.length > 0){
								this.$emit('change', this.arrLiast[this.arrLiast.length - 1].value)
									this.$emit('input', this.arrLiast[this.arrLiast.length - 1].value)	
							}else{
								that.handleGetAddress(val,false)
							}
							} 
						})
						} 
					})
				}

				
			},
			
			handleSetNewAddress(arr,value,data){
				if(!arr || arr.length == 0) {
					return []
				}
			
				arr = arr.map(item => {
					if(item.areaid == value){
						return {...item,children:data}
					} else {
						return {...item,children:this.handleSetNewAddress(item.children,value,data)}
					}
				})
				//console.log(arr)
				return arr
			},
			handleGetAddress(_item={},isFirst=true){
				//console.log('this.addressData')
				if(this.level == _item.arealevel){
					return
				}
				let param = {
				  method: "jy007_com01",
					root: _item.areaid,
					areacode: _item.areaid,//四川省
				}
				this.$utils.request(null,param,true).then(res => {
					
					if(res.serviceSuccess) {
						if(!isFirst){
							//console.log(res.data.resultData)
							if(res.data.resultData.length > 0 ){
								this.$refs.picker.show()
							}

							this.addressData = this.handleSetNewAddress(this.addressData,_item.areaid,res.data.resultData)
						
						} else {
							this.addressData = res.data.resultData
							
							//this.$refs.picker.show()
						}
					} else {
						this.$utils.showToast("查询区划错误！")
					}
				})
			},
			// 关闭时传输数据
			// popupclosed(){
			// 	if(!this.isCheckAll){
			// 		this.$nextTick(() => {
			// 			this.$emit('change', this.checkArr)
			// 			if(this.checkArr.length !== 0) {
			// 				this.$emit('input', this.checkArr[this.checkArr.length - 1].value)
			// 			} else {
			// 				this.$emit('input', '')
			// 			}
			// 		})
			// 	}
			// 	this.$emit('popupclosed')
			// }
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
		max-width: 100%;

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
