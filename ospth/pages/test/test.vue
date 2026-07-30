<template>
	<view class="formList">
		<van-form validate-first input-align='right' @failed="onFailed">
			<van-field
			disabled
			  readonly
			  clickable
			  name="picker"
			  :value="value"
			  label="登记失业地"
			  placeholder="请选择"
			  @click="showPicker = true"
			/>
			<van-popup v-model="showPicker" position="bottom">
			  <van-picker
			    show-toolbar
			    :columns="columns"
			    @confirm="onConfirm"
			    @cancel="showPicker = false"
			  />
			</van-popup>
			<van-field
			disabled
			  readonly
			  clickable
			  name="picker"
			  :value="value2"
			  label="户籍地址"
			  placeholder="请选择"
			  @click="showPicker2 = true"
			/>
			<van-popup v-model="showPicker2" position="bottom">
			  <van-picker
			    show-toolbar
			    :columns="columns"
			    @confirm="onConfirm2"
			    @cancel="showPicker2 = false"
			  />
			</van-popup>
			<van-field
			  name="picker"
			  :value="value3"
			  label="失业原因"
			  placeholder="请选择"
			  @click="showPicker3 = true"
			  readonly
			/>
			<van-popup v-model="showPicker3" position="bottom">
			  <van-picker
			    show-toolbar
			    :columns="reason"
			    @confirm="onConfirm3"
			    @cancel="showPicker3 = false"
				readonly
			  />
			</van-popup><van-field
			disabled
			  readonly
			  clickable
			  name="picker"
			  :value="value4"
			  label="失业类型"
			  placeholder="请选择"
			  @click="showPicker4 = true"
			/>
			<van-popup v-model="showPicker4" position="bottom">
			  <van-picker
			    show-toolbar
			    :columns="type"
			    @confirm="onConfirm4"
			    @cancel="showPicker4 = false"
			  />
			</van-popup>
			<van-field
			disabled
			  readonly
			  clickable
			  name="picker"
			  :value="date"
			  label="失业日期"
			  placeholder="请选择"
			  @click="showDatePicker = true"
			/>
			<van-calendar v-model="showDatePicker" :show-confirm="false" @confirm="onConfirmDate" />
			<van-field
			  v-model="input1"
			  label="失业前月收入"
			  placeholder="(选填)请输入"
			  disabled
			/>
			<van-field
				readonly
			  v-model='input2'
			  label="备注"
			  placeholder="(选填)请输入"
			/>
			<van-field
			  v-model='input2'
			  label="备注"
			  placeholder="(选填)请输入"
			/>
			<van-field
			  v-model='input2'
			  label="备注"
			  placeholder="(选填)请输入"
			/>
			<van-field
			  v-model='input2'
			  label="备注"
			  placeholder="(选填)请输入"
			/>
			<van-field
			  v-model='input2'
			  label="备注"
			  placeholder="(选填)请输入"
			/>
			<van-field
			  v-model='input2'
			  label="备注"
			  placeholder="(选填)请输入"
			/>
			<van-field
			  v-model='input2'
			  label="备注"
			  placeholder="(选填)请输入"
			/>
			<van-field
			  v-model='input2'
			  label="备注"
			  placeholder="(选填)请输入"
			/>
			<van-field
			  v-model='input2'
			  label="备注"
			  placeholder="(选填)请输入"
			/>
		</van-form>
		<u-form :model="form" ref="uForm">
			<u-form-item label="姓名"><u-input v-model="form.name" /></u-form-item>
			<u-form-item label="简介"><u-input v-model="form.intro" /></u-form-item>
			<u-form-item label="性别"><u-input v-model="form.sex" type="select" /></u-form-item>
			<u-form-item label="水果">
				<u-checkbox-group>
					<u-checkbox v-model="item.checked" v-for="(item, index) in checkboxList" :key="index" :name="item.name">
						{{ item.name }}
					</u-checkbox>
				</u-checkbox-group>
			</u-form-item>
			<u-form-item label="味道">
				<u-radio-group v-model="radio">
					<u-radio v-for="(item, index) in radioList" :key="index" :name="item.name" :disabled="item.disabled">
						{{ item.name }}
					</u-radio>
				</u-radio-group>
			</u-form-item>
			<u-form-item label="开关"><u-switch slot="right" v-model="switchVal"></u-switch></u-form-item>
		</u-form>
		<view class="btnBox">
			<view class="setBtn">
				<van-button class='btnStyle' type="info" @click="test()">测试</van-button>
				<van-button class='btnStyle' type="info" @click="getUseInfo()">测试WX</van-button>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				username: '',
				password: '',
				switchChecked: false,
				checkbox: false,
				showDate:false,
				showDatePicker:false,
				checkboxGroup: [],
				pattern: /\d{6}/,
				radio: '1',
				baseInfoForm: {},
				value: '',
				value2: '',
				value3: '',
				value4: '',
				date:'',
				columns: ['杭州', '宁波', '温州', '嘉兴', '湖州'],
				reason:[
					'合同期满',
					'被单位解除劳动合同',
					'被单位解聘，迟退，或开除'
				],
				type:[
					'自愿型失业',
					'非自愿型失业'
				],
				showPicker: false,
				showPicker2: false,
				showPicker3: false,
				showPicker4: false,
				input1:'',
				input2:'',
				form: {
					name: '',
					intro: '',
					sex: ''
				},
				checkboxList: [
					{
						name: '苹果',
						checked: false,
						disabled: false
					},
					{
						name: '雪梨',
						checked: false,
						disabled: false
					},
					{
						name: '柠檬',
						checked: false,
						disabled: false
					}
				],
				radioList: [
					{
						name: '鲜甜',
						disabled: false
					},
					{
						name: '麻辣',
						disabled: false
					}
				],
				radio: '',
				switchVal: false
			};
		},
		onLoad(option) {
			//注册方法到window供terminalUtil使用
			window._setFormDisabled = this.setFormDisabled
			window._checkFormData = this.checkFormData
			window._saveFormData = this.saveFormData
	
			this.init()
			//设置导航栏标题
			uni.setNavigationBarTitle({
				title: "测试h5嵌入"
			});
		},
		methods: {
			test() {
				let websocket = new WebSocket("ws://localhost:1760")
				websocket.onopen = function(){
					console.log("我连接上了,并开始发送消息")
					let data = {
						type:'sendTo',
						userId:'123',
						msg:'给微信发消息'
					}
					websocket.send(JSON.stringify(data))
				}
			},
			getUseInfo(){
				wx.getUserProfile({
				  desc: '用于完善会员资料', // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写
				  success: (res) => {
					console.log(res);
					this.setData({
					  userInfo: res.userInfo,
					  hasUserInfo: true
					})
				  }
				})
			},
			onConfirm(value) {
			    this.value = value;
			    this.showPicker = false;
			},
			onConfirm2(value) {
			    this.value2 = value;
			    this.showPicker2 = false;
			},
			onConfirm3(value) {
			    this.value3 = value;
			    this.showPicker3 = false;
			},
			onConfirm4(value) {
			    this.value4 = value;
			    this.showPicker4 = false;
			},
			onConfirmDate(date){
				this.showDatePicker = false;
				this.date = this.formatDate(date);

			},
			formatDate(date) {
			  return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
			},
			//页面初始化
			init() {
				//页面加载完成，设置父页面iframe高度
				/* this.$nextTick(()=> {
					window.terminalUtil._setIframeHeight(document.documentElement.scrollHeight)
				}) */
				//初始化时若用户不满足办理条件可以调用父页面方法将下一步按钮设置为不可用，满足条件下设置可用
				//同域情况下
				// window.parent.setNextDisabled(true)
				//跨域情况下
				window.terminalUtil._setNextDisabled(false)
			},
			validator(val) {
			    return /1\d{10}/.test(val);
			},
			// 异步校验函数返回 Promise
			asyncValidator(val) {
				return new Promise((resolve) => {
					Toast.loading('验证中...');
		
					setTimeout(() => {
						Toast.clear();
						resolve(/\d{6}/.test(val));
					}, 1000);
				});
			},
			onFailed(errorInfo) {
				console.log('failed', errorInfo);
			},
			//设置表单不可用（供父页面全局设置表单不可编辑使用）
			setFormDisabled (disabled) {
				this.formDisabled = disabled
			},
			//校验表单信息 返回true，父页面触发下一步；返回false，父页面保持在当前步骤 （供父页面进行下一步操作前校验）
			checkFormData () {
				// 异步校验
				/* this.Base.sendRequest("queryUser", {aac002: this.aac002}, (data) => {
					//校验失败
					if (data.serviceSuccess) {
						Modal.error({
							title: "提示",
							content: "未查询到人员参保信息！",
						});
						return
					}
					//校验成功，调用跳转到材料上传步骤，并告知业务场景
					let ada120 = "情形1" //业务场景
					window.terminalUtil._toUploadMaterials(ada120)
				}) */

				// 同步校验
				let flag = true
				
				return {flag: flag, ada120: '情形1'}
			},
			//提交业务数据（供父页面点击提交时触发，会传入已上传材料列表）
			saveFormData (materials) {
				console.log(materials)
				//提交完成，调用父页面方法进入办理完成页面
				window.terminalUtil._toCompletePage()
			}
		}
	}
</script>

<style lang="scss">
	/deep/ .van-field--disabled .van-field__label{
		color: #646566;
	}
	
	/deep/ .van-calendar__popup.van-popup--bottom, .van-calendar__popup.van-popup--top{
		height: 100%;
	}
	.formList{
		padding: 12rpx 24rpx;
	}
</style>