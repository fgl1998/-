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
	import PostMessageUtil from '@/static/common/PostMessageUtil.js';
	import commonWidget from "./common/widgets/commonWidget.vue";
	import defaultMixins from './common/mixin/defaultMixins'
	import extendsMixins from './common/mixin/extendsMixins'
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
				pageEcho: '',
				option: {}
			}
		},
		mixins: [defaultMixins,extendsMixins],
		components: {commonWidget},
		onShow(){

		},
		onLoad(option) {
			this.templateCode = option.templateCode
			if(option.acceptJson) {
				option = JSON.parse(this.$base.sm4Decrypt(decodeURIComponent(option.acceptJson)))
			} 
			this.option = option
			window._setIframeHeight = this.setIframeHeight
			window.handle = this.handle
				
			this.projectNo = option.projectNo
			this.handleItemName = decodeURIComponent(option.handleItemName)
			this.taskBasicCode = option.taskBasicCode
			this.handleItemCode = option.handleItemCode
			this.ticket = option.ticket
			this.creditCode = option.creditCode
			this.sceneCode = option.sceneCode
			this.pageEcho = option.pageEcho
			this.taskId = option.taskId
			this.flowNo = option.flowNo

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
					this.$nextTick(()=>{
						let pageHeight = document.documentElement.scrollHeight;
						terminalUtil._setIframeHeight(pageHeight);
					})
					// if(this.pageEcho == '1') {
						/* this.setAllDisable(true)
						this.setFormData(); */
					// }
				})
			},
			setFormData(){
				let param = {
                    projectNo: this.projectNo
				}

				this.$base.post('/osa/getAcceptData', param, res => {
					if(!res.formData) {
						return
					}
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
				//初始化办理按钮方法
				if (this.pageConfig?.handleFunctions) {
					this.pageConfig.handleFunctions.forEach(item => {
						let handleFunction = 'this_.'+item.functionName+ '=function(){'+item.function+'}'
						eval(handleFunction)
						window[item.functionName]=this[item.functionName]
					})
				}
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
			},

			fnGetUrlParam (key) {
				/* const url = window.location.href
				const params = {}; let h
				const hash = url.slice(url.indexOf('?') + 1).split('&')
				for (let i = 0; i < hash.length; i++) {
					h = hash[i].split('=') //
					params[h[0]] = h[1]
				} */
				return this.option[key]
			},
		}
	}
</script>

<style>

</style>
