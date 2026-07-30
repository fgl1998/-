<template>
	<view class="fit" v-if="viewVisible">
	    <van-form style="height: 93%;overflow: auto" ref="baseForm" @submit="onSubmit" scroll-to-error>
	      <template v-for="(column,index) in pageColumns">
	        <van-col v-if="column.type === 'tabs'"
	                 :span=24
	                 class="widget-item"
	                 :style="{textAlign:column.textAlign||'left'}"
	                 v-show="initDisplay(column)"
	        >
	          <van-tabs :type="column.tabsType"
	                    :border="column.border"
	                    :sticky="column.sticky"
	                    :background="column.background"
	                    :lineWidth="column.lineWidth"
	                    :lineHeight="column.lineHeight"
	                    :lazyRender="column.lazyRender"
	                    :initObjMap="initObjMap(column)"
	                    :ref="column.name+'_col'"
	                    :color="column.color"
	                    :setFun="setTabsFun(column)"
	                    @change="(name,title)=>{evalTabsFun(name,title,column,'change')}"
	                    @click="(name,title)=>{evalTabsFun(name,title,column,'click')}"
	          >
	            <van-tab v-for="(pane, index_) in column.staticData" :disabled="pane.disabled" :key="index_" :name="pane.name" :title="pane.title">
	              <template v-for="(item,index__) in pane.columns">
	                <van-col :span=column.span||24
	                         class="widget-item"
	                         :style="{textAlign:item.textAlign||'left'}"
	                         v-show="initDisplay(item)"
	                >
	                  <common-widget :componentConfig="item"
	                                 :initObjMap="initObjMap(item)"
	                                 :ref="item.name+'_col'"
	                  ></common-widget>
	                </van-col>
	              </template>
	            </van-tab>
	          </van-tabs>
	        </van-col>
	        <van-col v-else-if="column.type === 'collapse'"
	                 :span=24
	                 class="widget-item"
	                 :style="{textAlign:column.textAlign||'left'}"
	                 v-show="initDisplay(column)"
	        >
	          <van-collapse :accordion="column.accordion" v-model="column.activeNames">
	            <van-collapse-item v-for="(pane, index_) in column.staticData" :key="index_" :name="pane.name" :title="pane.title">
	              <template v-for="(item,index__) in pane.columns">
	                <van-col :span=column.span||24
	                         class="widget-item"
	                         :style="{textAlign:item.textAlign||'left'}"
	                         v-show="initDisplay(item)"
	                >
	                  <common-widget :componentConfig="item"
	                                 :initObjMap="initObjMap(item)"
	                                 :ref="item.name+'_col'"
	                  ></common-widget>
	                </van-col>
	              </template>
	            </van-collapse-item>
	          </van-collapse>
	        </van-col>
	        <van-col v-else
	                 :span=column.span||24
	                 class="widget-item"
	                 :style="{textAlign:column.textAlign||'left'}"
	                 v-show="initDisplay(column)"
	        >
	          <common-widget :componentConfig="column"
	                         :initObjMap="initObjMap(column)"
	                         :ref="column.name+'_col'"
	          ></common-widget>
	        </van-col>
	      </template>
	    </van-form>
	    <view style="height: 7%">
	      <view  style="right: 20px;display: inline-block;float: right;position: relative;">
	        <view v-for="(button, buttonIndex) in pageConfig.buttons" v-show="button.display" style="display: inline-block">
	          <common-widget
	              :componentConfig="button"
	              :ref="button.name+'_col'"
	          ></common-widget>
	        </view>
	      </view>
	    </view>
	  </view>
</template>

<script>
	import commonWidget from "./common/widgets/commonWidget.vue";
	import defaultMixins from './common/mixin/defaultMixins'
	import extendsMixins from './common/mixin/extendsMixins'
	import cryptUtil from '../../static/public/crypto/cryptUtil.js'
	import "./common/js/mobileModel.js"
	import { Dialog } from 'vant';
	export default {
		data() {
			return {
				pageData: {},
				params: {},
				viewVisible: false,
				displayParams:{},
				disabledParams:{},
				app_no: '',
				objMap: {},
				service: {},
				templateCode: '',
				projectNo: '',
				handleItemName: '',
				taskBasicCode: '',
				handleItemCode: '',
				ticket: '',
				creditCode: '',
				sceneCode: '',
				pageEcho: ''
			}
		},
		mixins: [defaultMixins,extendsMixins],
		components: {commonWidget},
		onShow(){

		},
		onLoad(option) {
			this.templateCode = option.templateCode
			if(option.param) {
				option = cryptUtil.doDecrypt(decodeURIComponent(option.param))
			}
			window._checkFormData = this.checkFormData
			window._saveFormData = this.saveFormData

			this.projectNo = option.projectNo
			this.handleItemName = decodeURIComponent(option.handleItemName)
			this.taskBasicCode = option.taskBasicCode
			this.handleItemCode = option.handleItemCode
			this.ticket = option.ticket
			this.creditCode = option.creditCode
			this.sceneCode = option.sceneCode
			this.pageEcho = option.pageEcho

			this.initVue(this);
			this.fnInit();
		},
		computed: {
			pageConfig() {
				return this.pageData.pageConfig || {};
			},
			pageColumns() {
				return this.pageData.pageColumns || [];
			}
		},
		methods: {
			checkFormData() {
				//校验必填项
				if(this.pageEcho == '1') {
					return
				}
				let formData = this.getValues();
				this.$refs.baseForm.validate().then(res=>{
					terminalUtil._toNextPage()
				}).catch(err=>{
					
				})
			},
			saveFormData () {
				this.service = uni.getStorageSync("service_"+this.handleItemCode)
				if(this.service) {
					this.service = JSON.parse(this.service)
				}
				let userInfo = this.$base.getUser();
				let loginUser = this.$base.getUser(false);
				let formData = this.getValues();
				this.pageData.pageColumns.forEach(item => {
					for(let key in formData){
						if(item.remoteData && key == item.name){
							item.remoteData.forEach(val => {
								if(val.label == formData[key]){
									formData[key] = val.value;
								}
							})
						}
					}
				})
				//调用受理接口
				let param = {
					"id": this.projectNo,
					"projectNo": this.projectNo,
					"taskBasicCode": this.taskBasicCode,
					"taskBasicGuid": this.service.taskBasicGuid,
					"handleItemName": this.handleItemName,
					"applyerType": userInfo.userType == 'UT02'?'1':'2',
					"channelType": uni.getStorageSync("channelCode"),
					"appNo": uni.getStorageSync("channelCode"),
					"channelMode":  this.service.handleItemType,
					"pushOrg": uni.getStorageSync("areaCode"),
					"formCode": this.templateCode,
					"creditCode": this.creditCode,
					"pushCreditCode": this.creditCode,
					"formData": JSON.stringify(formData)
				}
				let ospOperator = {
					userId: userInfo.accountBo.accountId,
					tenantAppId: "applet001",
					divisionCode: uni.getStorageSync("areaCode")
				}
				let accountId = userInfo.accountBo.accountId
				if(accountId.length > 20) {
					accountId = accountId.substring(accountId.length-20)
				}
				if (userInfo.userType == "UT02") {
					param.applyerNo = accountId;
					if(user.userType == "UT02") {
						param.applyerName = loginUser.legalBo.legalRepresentativeName;
						param.contactName = loginUser.legalBo.legalRepresentativeName;
						param.contactMobile = loginUser.legalBo.legalRepresentativeMobile;
						param.contactPageCode = loginUser.legalBo.legalRepresentativeCertNo;
					} else {
						param.applyerName = loginUser.naturalBo.name;
						param.contactName = loginUser.naturalBo.name;
						param.contactMobile = loginUser.naturalBo.mobile;
						param.contactPageCode = loginUser.naturalBo.certNo;
					}
					param.applyUnitNo = accountId;
					param.applyUnitName = userInfo.legalBo.legalName;
					param.applyUnitCode = userInfo.legalBo.legalCertNo;
					ospOperator.userName = param.contactName;
				} else {
					param.applyerNo = accountId;
					param.applyerName = userInfo.naturalBo.name;
					param.applyerPageType = userInfo.naturalBo.certType;
					param.applyerPageCode = userInfo.naturalBo.certNo;
					param.contactName = loginUser.naturalBo.name;
					param.contactMobile = loginUser.naturalBo.mobile;
					param.contactPageCode = loginUser.naturalBo.certNo;
					ospOperator.userName = param.contactName;
				}
				param.channelMode = uni.getStorageSync("channelMode")
				param.ospOperator = JSON.stringify(ospOperator)
				this.$base.post("/flowgine/acceptOnline", param, (res) => {
					if(res.projectNo) {
						//提交完成，调用父页面方法进入办理完成页面
						terminalUtil._toNextPage()
					} else {
						terminalUtil._alertMsgWindow("提示", "受理失败："+res.message, 'error')
					}
				}, (err)=> {
					terminalUtil._alertMsgWindow("提示", "受理失败："+err.message, 'error')
				})
			},
			fnInit(){
				if (!this.templateCode) {
				    return
				}
				let params = {
					templateCode: this.templateCode
				}
				this.$base.post('/formcenter/getRuTemplateForm', params, res=>{
					if(!res || !res.templateForm) {
						Dialog.alert({
							title: '提示',
							message: '未获取到表单信息！'
						});
						return
					}
					this.pageData = JSON.parse(res.templateForm);
					this.initPage();
					if(this.pageEcho == '1') {
						this.setAllDisable(true)
						this.setFormData();
					}
				})
			},
			setFormData(){
				let param = {
                    projectNo: this.projectNo
				}

				this.$base.post('/osa/getAcceptData', param, res => {
					let formData = JSON.parse(res.formData);
					this.pageData.pageColumns.forEach(item => {
						for(let key in formData){
							if(item.remoteData && key == item.name){
								item.remoteData.forEach(val => {
									if(val.value == formData[key]){
										formData[key] = val.label;
									}
								})
							}
						}
					})

					this.setValues(formData);
				})
			},
			setTabsFun(column){
			    if (!column.eventList||column.eventList.length<1){
			        return
			    }
			    column.eventList.forEach((item)=>{
			        column[item.eventType]=item.textarea
			    })
			},
			evalTabsFun(name,title,column,type){
				if (!column[type]){
					return
				}
			    const this_ = this
			    eval(column[type])
			},
			initObjMap(column){
				this.objMap[column.name] = column
			},

			initDisplay (column) {
			    const this_ = this
			    const value = column.display
			    if (this.displayParams[column.name] != null) {
			        if (this.params[value]!=null){
						return this.params[value]
			        }
			        return this.displayParams[column.name]
			    }
			    if (value==null||value === ''){
			        this.$set(this.displayParams,column.name,true)
			        return this.displayParams[column.name];
			    }
			    if (typeof value === "boolean") {
			        this.$set(this.displayParams,column.name,value)
			        return this.displayParams[column.name];
			    }
			    if (!value || value === "true") {
			        this.$set(this.displayParams,column.name,true)
			        return this.displayParams[column.name];
			    } else if (value === "false") {
			        this.$set(this.displayParams,column.name,false)
			        return this.displayParams[column.name];
			    } else if (this.params[value] == null) {
			        this.$set(this.displayParams,column.name,true)
			        return this.displayParams[column.name];
			    }
			    Object.defineProperty(this.displayParams,column.name, {//设置双向绑定
			        get () {
			          return this_.params[value]
			        },
			        set (newVal) {
			          this_.params[value]=newVal
			        }
			    })
			    return this.displayParams[column.name];
			},
			initPage() {
			    this.viewVisible = true;
			    if (this.pageConfig.params) {
			        this.params = { ...this.params, ...this.pageConfig.params }
			    }
			    const this_ = this
			    this.$nextTick(() => {
			        //执行初始化方法
			        if (this.pageConfig?.initMethod) {
						try {
							eval(this.pageConfig.initMethod);
						} catch (e) {
							Dialog.alert({
								title: '提示',
								message: e.message || e
							});
						}
			        }
				});
			},
			onSubmit(){
				const this_ = this.getVue()
				if (this_.pageConfig && this_.pageConfig.submitMethod){
				    eval(this_.pageConfig.submitMethod)
				}
			},
			setAllDisable(flag) {
				const ids = [];
				for (const key_ in this.pageData) {
					if (Array.isArray(this.pageData[key_])) {
						this.pageData[key_].forEach((item) => {
							ids.push(item.name);
						});
					}
				}
				if(flag) {
					this.setDisable(ids.join(","))
				} else {
					this.setEnable(ids.join(","))
				}
			}
		}
	}
</script>

<style>

</style>
