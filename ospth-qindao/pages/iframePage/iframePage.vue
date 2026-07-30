<template>
	<view class="pages">
<!--		<steps ref="steps" :steps="steps" :showSteps="serverType === 1" :current='curStep' :userInfo="userInfo"></steps>-->
		<view class="main" v-show="stepKeys[current1-1] === 'step1'">
			<view class="main-body">
				<view class="titleBox" v-if="serviceTip !== ''">
					<view class="title_text">
						<view class="title_icon"></view>
						<view class="title">申报须知</view>
					</view>
					<view class="line"></view>
				</view>
				<view class="content" v-if="serviceTip !== ''">
					<view v-html="serviceTip"></view>
				</view>
				<view class="titleBox" v-if="businessSceneVos.length > 1">
					<view class="title_text">
						<view class="title_icon"></view>
						<view class="title">情形选择</view>
					</view>
					<view class="line"></view>
				</view>
				<view class="content" v-if="businessSceneVos.length > 1">
<!--					<van-radio-group :disabled="pageEcho == '1'" v-model="sceneCode" @change="fnSceneChange">-->
<!--						<van-radio v-for="item in businessSceneVos" :id="item.sceneCode" :name="item.sceneCode"-->
<!--							:key="item.sceneCode">{{ item.sceneName }}</van-radio>-->
<!--					</van-radio-group>-->
          <van-checkbox-group name="checkBoxGroup" v-model="checkedScenes" @change="fnSceneChange">
            <van-row v-for="item in businessSceneVos" :key="item.sceneCode">
              <van-col :span="24">
                <van-checkbox :name="item.sceneCode">{{ item.sceneName }}</van-checkbox>
              </van-col>
            </van-row>
          </van-checkbox-group>
				</view>
			</view>
			<view class="btnBox">
				<view class="setBtn">
<!--					<van-button type="default" class='btnStyle' v-if="reportList.length>0"-->
<!--						@click="fnToPrint()">打&nbsp;&nbsp;&nbsp;&nbsp;印</van-button>-->
<!--					<van-button color='#1492ff' class='btnStyle' type="info" @click="fnToIframe()">下一步</van-button>-->
				</view>
			</view>
		</view>
<!--		<view v-show="stepKeys[current1-1] == 'step2'" class="mt20">-->
<!--			<view>-->
<!--				<iframe id="iframePage" ref="iframePage" :src="iframeUrl" width="100%" scrolling="no" :height="iframeHeight"-->
<!--					frameborder="0" :style="{height: iframeHeight + 'px'}"></iframe>-->

<!--        <view class="uploadBox" v-if="materialVosCopy.length > 0">-->
<!--          <upload :materialList="materialVosCopy" :taskBasicGuid="taskBasicGuid" :projectNo="projectNo" :handleItemCode="handleItemCode"-->
<!--                  @handleBack="handleBack" :pageEcho='pageEcho' :shareParam="shareParam" :materialData="materialData" />-->
<!--        </view>-->
<!--			</view>-->
<!--			<view v-if="serverType === 1">-->
<!--				<view class="btnBox">-->
<!--					<view class="setBtn">-->
<!--						<van-button type="default" class='btnStyle' v-if="showPre || serviceTip || businessSceneVos.length > 1" @click="fnToPre()">上一步</van-button>-->
<!--						<van-button type="info" class='btnStyle' @click="fnToValidata()" :disabled="disableNext || (pageEcho == '1' && materialVosCopy.length == 0)">{{ materialVosCopy.length > 0 ? '下一步' : '提&nbsp;&nbsp;&nbsp;&nbsp;交' }}</van-button>-->
<!--					</view>-->
<!--				</view>-->
<!--			</view>-->
<!--		</view>-->
<!--		<view v-if="stepKeys[current1-1] === 'step3'" class="mt12">-->
<!--			<view class="data-loading" v-if="showDataLoading">-->
<!--				<van-loading type="spinner">数据提交中...</van-loading>-->
<!--			</view>-->
<!--			<view class="uploadBox">-->
<!--				<upload :materialList="materialVosCopy" :taskBasicGuid="taskBasicGuid" :projectNo="projectNo" :handleItemCode="handleItemCode"-->
<!--					@handleBack="handleBack" :pageEcho='pageEcho' :shareParam="shareParam" :materialData="materialData" />-->
<!--			</view>-->
<!--			<view class="btnBox">-->
<!--				<view class="setBtn">-->
<!--					<van-button type="default" @click="fnToPre()" class='btnStyle'>上一步</van-button>-->
<!--					<van-button type="info" class='btnStyle' @click="fnToSave()"-->
<!--						:disabled="pageEcho === '1'">提&nbsp;&nbsp;&nbsp;&nbsp;交</van-button>-->
<!--				</view>-->
<!--			</view>-->
<!--		</view>-->
		<view v-show="stepKeys[current1-1] === 'step4'" class="mt12">
			<view>
				<view class="bgImg"></view>
				<view>
					<view class="success_text">申报成功！</view>
					<view class="tips_content" style="text-align: center;">
						<p style="width: 80%;margin: 0 auto;">
							<span style="font-family: 'Arial Normal', 'Arial'; font-weight: 400">您的本次办件的业务统一办件编号为</span>
							<span style="font-family: 'Arial Normal', 'Arial'; font-weight: 400; color: #f59a23"></span>
							<span style="font-family: 'Arial Negreta', 'Arial Normal', 'Arial'; font-weight: 700; color: #f59a23">{{ projectNo }}</span>
							<span style="font-family: 'Arial Normal', 'Arial'; font-weight: 400">，后续可通过办件号在公共服务平台各渠道上进行自助查询，也可在各渠道的【我的-我的办件】进行查询。</span>
						</p>
					</view>
				</view>
				<view class="btnBox" v-if="false">
					<view class="setBtn">
						<van-button color='#1492ff' class='btnStyle' :disabled="disableCancle" type="info"
							@click="showReason = true">撤销</van-button>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
import steps from '@/components/regis-top/regis-top.vue'
import upload from '@/components/upload-last/upload-last.vue'
import {Dialog, Toast} from 'vant'

export default {
		components: {
			steps,
			upload
		},
		data() {
			return {
				showDataLoading: false,
				serviceTip: '',
				taskBasicCode: '', //事项编号
				taskBasicGuid: "",
				handleItemName: '办事页面',
				handleItemCode: '',
				creditCode: '',
				projectNo: '', //业务受理号
				isApp: false,
				iframeUrl: '',
				channelMode: '',
				serviceUrl: '',
				showPre: false,
				iframeHeight: 200,
				diffHeight: 0,
				name: '',
				current1: 1,
				curStep: 1,
				secondaryCatalogBool:'0',
				disableNext: true,
				serverType: 1, //1.经办 2.查询，查询页面不显示步骤条
				steps: ['申办须知', '信息填写', '材料上传', '办理完成'],
				stepKeys: ["step1", "step2", "step3", "step4"],
				dataChecked: false, //数据是否校验过
				fileList: [],
				businessSceneVos: [], //情形列表
				sceneCode:'', //情形选择码值
        checkedScenes: [], //情形选择码值
				materialVos: [], //材料列表
				materialVosCopy: [], //所需上传材料
				uploadList: [],
				userInfo: {}, //头部显示用户信息
				user: {}, //当前登录用户信息
				wholeUser: {}, //全部用户信息
				service: {},
				ywsqfw: false,
				firstLoad: true,
				miniprogram: false,
				showDialog: false,
				showPost: false,
				mailNames: [],
				pageEcho: '', //页面回显标识
				disableCancle: false,
				reason: '',
				showReason: false,
				postInfo: {
					name: '',
					phoneNum: '',
					address: ''
				},
				materialList: [],
				bgImg: './img/leaf.jpg',
				reportList: [],
				showPrint: false,
				reportId: '',
				shareParam: {},
				areaCode: '',
				materialData:{},
			};
		},
		watch: {
			current1() {
				this.curStep = this.getStepIndex();
			}
		},
		onLoad(option) {
      window.addEventListener('popstate', this.handleBack)

      //注册方法到window供terminalUtil使用
			window._setIframeHeight = this.setIframeHeight
			window._setNextDisabled = this.setNextDisabled
			window._toUploadMaterials = this.toUploadMaterials
			window._toCompletePage = this.toCompletePage
			window._toNextPage = this.toNextPage
			window._setPreDisabled= this.setPreDisabled
			window._setPreEnabled= this.setPreEnabled
			window._alertMsgWindow = this.alertMsgWindow
			window._originalMethod = this.originalMethod
			window._setDataLoading = this.setDataLoading
			window._setMaterials = this.setMaterials

      // 统一读取参数：option > 缓存
      const params = {
        handleItemName: option.handleItemName ?? uni.getStorageSync('service_handleItemName'),
        handleItemCode: option.handleItemCode ?? uni.getStorageSync('service_handleItemCode'),
        projectNo: option.projectNo || '',
        areaCode: option.areaCode ?? uni.getStorageSync('areaCode'),
        pageEcho: option.pageEcho || '',
        token: option.token || uni.getStorageSync('applet-token'),
        channelCode: option.channelCode || uni.getStorageSync('channelCode') || 'osp-02-006-app'
      }

      // 赋值到 data
      this.handleItemName = params.handleItemName
      this.handleItemCode = params.handleItemCode
      this.projectNo = params.projectNo
      this.areaCode = params.areaCode
      this.pageEcho = params.pageEcho
      this.channelMode = uni.getStorageSync('channelMode') || ''
      this.serviceUrl = this.$base.BASE_IP + '/template/h5/index.html#/pages/jumpPage/jumpPage'

      // 统一存缓存
      uni.setStorageSync('service_handleItemName', params.handleItemName)
      uni.setStorageSync('service_handleItemCode', params.handleItemCode)
      uni.setStorageSync('areaCode', params.areaCode)
      uni.setStorageSync('channelCode', params.channelCode)
      uni.setStorageSync('applet-token', params.token)

      // 设置标题
      if (this.handleItemName) {
        uni.setNavigationBarTitle({ title: this.handleItemName })
      }

      new Promise((resolve, reject) => {
        let param = {
          'taskBasicCode': this.handleItemCode,
          'type': 'service',
          'path': 'test',
        }
        this.$base.post('/auth/checkAuth', param, (res) => {
          if (res.taskBasicVo) {
            this.service = JSON.parse(JSON.stringify(res.taskBasicVo))
            this.projectNo = res.projectNo
            uni.setStorageSync('user', res.user)
            resolve(res.taskBasicVo)
          } else {
            reject()
            Dialog.alert({
              title: '提示',
              message: '未获取到事项信息！',
            })
          }
        }, null, null, false)
      }).then(() => {
        this.fnInit()
      }).catch(() => {
        console.error('未获取到事项信息')
      })

			this.user = this.$base.getUser()
			this.wholeUser = uni.getStorageSync("user")
			if (this.user && this.user.userType) {
				if (this.user.userType === "UT02") {
					this.userInfo.aac002 = this.user.legalBo.legalCertNo
					this.userInfo.aac003 = this.user.legalBo.legalName
					this.userInfo.aac010 = this.user.legalBo.localAreaAddress
				} else {
					this.userInfo.aac002 = this.user.naturalBo.certNo
					this.userInfo.aac003 = this.user.naturalBo.name
					this.userInfo.aac010 = this.user.naturalBo.address
				}
				let this_ = this
				//#ifdef MP-WEIXIN
				wx.miniProgram.getEnv(function(res) {
					if (res.miniprogram) {
						this_.miniprogram = true
						this_.$nextTick(() => {
							this_.initWebsocket()
						})
					}
				})
				// #endif
			}
			if (this.pageEcho == '1') {
				this.queryReport()
			}
		},
		onShow() {
			this.$nextTick(() => {
				let iHeight = document.body.scrollHeight || document.documentElement.scrollHeight
				this.diffHeight = iHeight - this.$refs?.steps?.$el.offsetHeight - 80
				this.setIframeHeight(this.diffHeight)
			})
      this.postInfo.name = this.user?.naturalBo?.name || '';
			this.postInfo.phoneNum = this.user?.naturalBo?.mobile || '';
		},
		onUnload() {
			if (this.miniprogram) {
				uni.closeSocket()
			}
      window.removeEventListener('popstate', this.handleBack)
    },
    onBackPress(){
      console.log(23)
      return false
    },
		methods: {
			//websocket方法，用于嵌入页面与小程序通讯，以便于拉起小程序部分方法
			initWebsocket() {
				let this_ = this
				const iframe = this.$refs.iframePage.contentWindow
				uni.connectSocket({
					url: this_.$base.BASE_URL.replace("http", "ws") + "/websocket/h5_" + this.user.accountBo
						.accountId
				});
				uni.onSocketOpen(function(res) {
					this_.$util.heartCheck.reset().start()
					console.log('WebSocket连接已打开！');
				});
				uni.onSocketError(function(res) {
					console.log('WebSocket连接打开失败，请检查！');
				});
				uni.onSocketMessage((res) => {
					console.log('WebSocket消息：', res);
					this_.$util.heartCheck.reset().start()
					let data = res.data
					if (data.startsWith("{") && data.endWith("}")) {
						data = JSON.parse(data)
						let callBack = data.callBack
						if (callBack) {
							//回调iframe方法，告知结果
							terminalUtil._sendPostMessage(iframe, callBack, data.result, null)
						}
					}
				});
			},
			//给小程序端发送消息
			sendSocketMessage(data) {
				let param = {
					systemCodeUserId: "wx_" + this.user.accountBo.accountId,
					message: JSON.stringify(data)
				}
				this.$base.post("/websocket/sendMsg", param, res => {

				})
			},
			//调用原生方法
			originalMethod(option) {
				//判断是否可以直接在当前页面调用
				//如果不能在当前页面调用，则发送消息给小程序调用
				this.sendSocketMessage(option)
			},
			getStepIndex() {
				let step = "办理须知";
				let stepKey = this.stepKeys[this.current1 - 1];
				if (stepKey == "step1") {
					step = "办理须知";
				} else if (stepKey == "step2") {
					step = "信息填写";
				} else if (stepKey == "step3") {
					step = "材料上传";
				} else if (stepKey == "step4") {
					step = "办理完成";
				}
				for (let i in this.steps) {
					if (this.steps[i] == step) {
						return Number(i) + 1;
					}
				}
				return 1;
			},
			fnInit() {
				// this.service = JSON.parse(uni.getStorageSync("service_" + this.handleItemCode))
				if (!this.handleItemName && this.service) {
					this.handleItemName = this.service.taskBasicName
				}
				this.taskBasicCode = this.service.taskBasicCode
				this.taskBasicGuid = this.service.taskBasicGuid;
				if (this.service.handleItemCodes) {
					this.handleItemCode = this.service.handleItemCode
				}
				this.secondaryCatalogBool = JSON.parse(this.service.archiveInfo).secondaryCatalogBool
				if (this.service.businessSceneVos) {
					let sceneVoList = this.service.businessSceneVos
					for (let i in sceneVoList) {
						if (sceneVoList[i].sceneCode.indexOf("S1111") == -1) {
							this.businessSceneVos.push(sceneVoList[i])
						}
					}
				} else {
					this.businessSceneVos = []
				}
				if (this.service.materialVos) {
					this.materialVos = this.service.materialVos
				} else {
					this.materialVos = []
				}
				if (this.checkForm()) {
					let formVo = this.service.taskBasicFormVos[0]
					this.serviceUrl = formVo.formUrl
					//低代码表单进入特定页面
					if (formVo && formVo.formType == "1") {
						this.serviceUrl = window.location.protocol + "//" + window.location.host +
							"/template/h5/index.html#/pages/mobileModel/mobileModel?templateCode=" + formVo.formCode
					}
				}
				this.creditCode = this.service.ssmReSubjectUnitVos[0].creditCode
				if (this.service.taskBasicExtendVos && this.service.taskBasicExtendVos.otherInfo) {
					let otherInfo = JSON.parse(this.service.taskBasicExtendVos.otherInfo)
					if (otherInfo.notice) {
						this.serviceTip = otherInfo.notice.replaceAll("\n", "<br>");
					}
				}
				if (this.businessSceneVos.length == 1) {
					this.sceneCode = this.businessSceneVos[0].sceneCode;
				} else if (this.service.businessSceneVos.length == 1) {
					this.sceneCode = this.service.businessSceneVos[0].sceneCode;
				} else {
					this.sceneCode = "";
				}

        // 判断是经办页面还是查询页面
				let moreInfo = this.service.moreInfo
				if (moreInfo) {
					moreInfo = JSON.parse(moreInfo)
					if (moreInfo.serveType != '' && moreInfo.serveType != null && typeof moreInfo.serveType !=
						'undefined') {
						this.serverType = Number(moreInfo.serveType);
					}
				}
				if (this.materialVos.length > 0 && this.pageEcho == '1') {
					this.fnGetMaterial();
				} else {
					this.fnSceneChange()
				}

				//不需要展示办理须知，则直接加载iframe
				if ((this.serviceTip == '' || this.serviceTip == null || typeof this.serviceTip == 'undefined') && this
					.businessSceneVos.length <= 1) {
					this.fnToIframe()
				}

        const url = this.serviceUrl.replace('/template/h5/#', '')
        console.log(url)
        uni.navigateTo({
          url: decodeURIComponent(`${url}?${window.location.href.split('?')?.[1]}`)
        })
			},
			//根据情形变更材料
      fnSceneChange(checkedValues) {
        if(checkedValues){
          this.sceneCode = checkedValues
        }
        this.materialVosCopy = [];
        var selectedCodes = []
		    this.sceneCode = "S1111"
        // if(this.materialVos.length > 0 && this.sceneCode) {
        //   this.sceneCode.forEach((sceneCode) => {
        //     this.materialVos.forEach((v) => {
        //       // 无情形、包含当前情形、包含共有情形
        //       if ((!v.sceneCode || v.sceneCode.indexOf(sceneCode) !== -1 || v.sceneCode.indexOf("S0000") !== -1) && (!selectedCodes.includes(v.materialCode))) {
        //         let total = 0;
        //         if (v.originalPageNum) {
        //           total += Number(v.originalPageNum)
        //         }
        //         if (v.copyPageNum) {
        //           total += Number(v.copyPageNum)
        //         }
        //         v.totalNumber = total
        //         this.materialVosCopy.push(v);
        //         selectedCodes.push(v.materialCode)
        //       }
        //     });
        //   })
        // }
		this.materialVos.forEach((v) => {
		  // 无情形、包含当前情形、包含共有情形
		  if ((!v.sceneCode || v.sceneCode.indexOf(this.sceneCode) !== -1 || v.sceneCode.indexOf("S1111") !== -1) && v.channelType.indexOf(uni.getStorageSync("channelCode")) !==-1) {
		    let total = 0;
		    if (v.originalPageNum) {
		      total += Number(v.originalPageNum)
		    }
		    if (v.copyPageNum) {
		      total += Number(v.copyPageNum)
		    }
		    v.totalNumber = total
		    this.materialVosCopy.push(v);
		    selectedCodes.push(v.materialCode)
		  }
		});
        this.fnChangeSteps();
      },
			//回显获取办件材料
			fnGetMaterial() {
				let param = {
					projectNo: this.projectNo,
					taskBasicGuid: this.taskBasicGuid
				}
				this.$base.post('/bmc/queryDigitalMaterial', param, res => {
					if (res.bmcMaterialVos && res.bmcMaterialVos.length > 0) {
						let list = res.bmcMaterialVos;
						let materialMap = this.getSceneCodeList()
						for (let key in materialMap) {
							let count = 0
							materialMap[key].forEach((item) => {
								for (let i in list) {
									if (list[i].materialCode.trim() == item.materialCode.trim()) {
										count++
									}
								}
							})
							if (count == list.length) {
								this.sceneCode = key
							}
						}
					}
					this.fnSceneChange()
					let bmcFilesVos = res.bmcFilesVos
					if (bmcFilesVos && bmcFilesVos.length > 0 && this.materialVosCopy.length > 0) {
						this.materialVosCopy.forEach(item => {
							item.list = [];
							bmcFilesVos.forEach(key => {
								if (key.materialCode == item.materialCode) {
									item.list.push(key);
								};
							})
						})
					}
				})
			},
			getSceneCodeList() {
				let materialMap = {};
				this.materialVos.forEach((item) => {
					let sceneCode = item.sceneCode
					if (materialMap[sceneCode]) {
						materialMap[sceneCode].push(item)
					} else {
						let list = []
						list.push(item)
						materialMap[sceneCode] = list
					}
				});
				for (let key in materialMap) {
					if (key != "S0000") {
						this.materialVos.forEach((item) => {
							if (item.sceneCode == "S0000") {
								materialMap[key].push(item)
							}
						})
					}
				}
				return materialMap;
			},
			//调整级别
			fnChangeSteps() {
				if (this.serverType != "1") {
					this.steps = [];
					this.fnToIframe();
					return;
				}
				let newStep = [];
				let newStepKey = [];
				if (this.checkTips()) {
					newStep.push("申办须知");
					newStepKey.push("step1");
				} else {
					if (this.checkForm()) {
						newStepKey.push("step2");
					} else if (this.checkMaterial()) {
						newStepKey.push("step3");
					} else {
						newStepKey.push("step4");
					}
				}
				if (this.checkForm()) {
					newStep.push("信息填写");
					newStepKey.push("step2");
				} else {
					if (this.checkTips()) {
						newStepKey.push("step1");
					} else if (this.checkMaterial()) {
						newStepKey.push("step3");
					} else {
						newStepKey.push("step4");
					}
				}
				if (this.checkMaterial()) {
					newStep.push("材料上传");
					newStepKey.push("step3");
				} else {
					if (this.checkTips()) {
						newStepKey.push("step1");
					} else if (this.checkForm()) {
						newStepKey.push("step2");
					} else {
						newStepKey.push("step4");
					}
				}
				newStep.push("办理完成");
				newStepKey.push("step4");

				this.steps = newStep;
				this.stepKeys = newStepKey
			},
			checkTips() {
				return (this.serviceTip && this.serviceTip.length > 0) || this.businessSceneVos.length > 1;
			},
			//检查是否存在材料
			checkMaterial() {
				return this.materialVosCopy.length > 0;
			},
			//是否存在表单
			checkForm() {
				return !(this.channelMode == '02' && this.service.taskBasicFormVos.length == 0);
			},
			fnToCancle() {
				if (!this.reason) {
					Dialog.confirm({
						title: '提示',
						message: '请输入撤销原因！',
					})
					return
				}
				let param = {
					projectNo: this.projectNo,
					reason: this.reason
				}
				this.showReason = false
				this.$base.post("/flowgine/cancelFlowById", param, (res) => {
					this.showReason = false
					this.disableCancle = true
					this.reason = ''
					Dialog.alert({
						title: '提示',
						message: '撤销成功',
					});
				}, (err) => {
					this.showReason = false
					Dialog.alert({
						title: '提示',
						message: err.message,
					});
				})
			},
			//显示iframe
			fnToIframe() {
				if (this.businessSceneVos.length > 0 && this.sceneCode == '') {
					Dialog.alert({
						title: '提示',
						message: '请选择情形！'
					});
					return
				}
				//情形变更后，需要刷新iframe
				if (this.firstLoad || this.sceneCode != this.oldSceneCode) {
					if (this.oldSceneCode && this.sceneCode != this.oldSceneCode) {
						Dialog.confirm({
							title: '提示',
							message: '情形已变更，已填写的数据会被清除，是否继续？',
						}).then(() => {
							this.fnChangeConfirm()
						}).catch(() => {
							this.sceneCode = this.oldSceneCode
							this.fnSceneChange()
						});
						return;
					} else {
						this.fnChangeConfirm()
					}
				} else {
					if (this.checkForm()) {
						this.current1 = 2;
					} else {
						this.current1 = 3;
					}
				}
			},
			fnChangeConfirm() {
				this.oldSceneCode = this.sceneCode;
				this.ywsqfw = true;
				// 判断是否有表单
				if (this.checkForm()) {
					//1.显示页面加载中
					this.iframeIsLoad = false;
					this.firstLoad = false;
					this.current1 = 2;
					this.fnGetTicket();
				} else {
					//无表单直接进入材料上传
					this.current1 = 3;
					this.toUploadMaterials()
				}
			},
			fnGetTicket() {
				//2.获取ticket
				let param = {
					divisionCode: this.areaCode,
					projectNo: this.projectNo,
					handleItemCode: this.handleItemCode,
					handleItemName: this.handleItemName,
					sceneCode: this.sceneCode,
					pageEcho: this.pageEcho,
					moreInfo: JSON.stringify(this.service.taskBasicFormVos[0]),
				}
				this.$base.post("/h5/getTicket", param, (res) => {
					if (res.data) {
						// let paramStr = "param=" + encodeURIComponent(res.data) + "&_modulePartId_=" + new Date()
						// 	.getTime();
            let paramStr = 'token=' + encodeURIComponent(uni.getStorageSync('applet-token')) + '&handleItemCode=' + this.handleItemCode +
                '&areaCode=' + this.areaCode + '&old=' + uni.getStorageSync("old")
                + '&channelCode='+ this.getChannelCode() + '&handleItemName=' + encodeURIComponent(this.handleItemName)
                + '&ticket='+ encodeURIComponent(res.data)
                + '&socialNo='+ encodeURIComponent("650542626")
                + '&projectNo='+ encodeURIComponent(this.projectNo)
				+ '&moreInfo='+ encodeURIComponent(this.service.taskBasicFormVos[0])

						if (this.serviceUrl.indexOf("?") !== -1) {
							this.iframeUrl = this.serviceUrl + "&" + paramStr
						} else {
							this.iframeUrl = this.serviceUrl + "?" + paramStr
						}

						//3.监听iframe加载完成
						// this.fnPageLoading()
					} else {
						Dialog.alert({
							title: '提示',
							message: '未获取到表单地址！',
						});
					}
				})
			},
      getChannelCode() {
        return this.$base.dealHeader('post').channelCode
      },
			//校验数据
			fnToValidata() {
				this.dataChecked = false
				//1.校验表单信息
				const iframe = this.$refs.iframePage.contentWindow
				if (this.materialVosCopy.length == 0) {
					this.current1 = 2;
				}
				terminalUtil._checkFormData(iframe)
				// 1. 通知内层“我要校验了”
				if (iframe && typeof iframe.postMessage === 'function') {
					iframe.postMessage({ action: 'check-form' }, '*')
				}
			},
			//显示材料页面
			toUploadMaterials() {
				//判断是否需要上传材料
				if (this.materialVosCopy.length > 0) {
					//材料中心业务申请，首次加载或者情形变更时才进行业务申请
					if (this.ywsqfw && this.pageEcho != '1') {
						this.fnYwsqfw()
					} else {
						//需要上传材料，则展示材料列表
						this.current1 = 3;
					}
				} else {
					//不需要上传材料，则直接调用保存方法
					this.fnToSave()
				}
			},
			//材料中心业务申请
			fnYwsqfw() {
				let applyerType = null;
				let recerId = null;
				let recer = null;
				let appyerCardCode = null;
				let conerMob = null;
				let cardCode = null;
				let appyerCode = null;
				let appyerCardType = null;
				let appyerName = null;
				let loginUser = this.$base.getUser(false);
				if (this.user && this.user.userType) {
					recerId = loginUser.accountBo.accountId;
					recer = loginUser.userType == "UT02" ? loginUser.legalBo.legalRepresentativeName : loginUser.naturalBo
						.name;
					conerMob = loginUser.userType == "UT02" ? loginUser.legalBo.legalRepresentativeMobile : loginUser
						.naturalBo.mobile;
					cardCode = loginUser.userType == "UT02" ? loginUser.legalBo.legalRepresentativeCertNo : loginUser
						.naturalBo.certNo;

					applyerType = this.user.userType == "UT02" ? "01" : "02";
					appyerCode = this.user.accountBo.accountId;
					appyerCardCode = this.user.userType == "UT02" ? this.user.legalBo.legalCertNo : this.user.naturalBo
						.certNo;
					appyerName = this.user.userType == "UT02" ? this.user.legalBo.legalName : this.user.naturalBo.name;
					appyerCardType = this.user.userType == "UT02" ? this.user.legalBo.legalCertType : this.user.naturalBo
						.certType;
				}
				if (recerId.length > 20) {
					recerId = recerId.substring(recerId.length - 20);
				}
				if (appyerCode.length > 20) {
					appyerCode = appyerCode.substring(appyerCode.length - 20);
				}
				let channelCode = uni.getStorageSync("channelCode");

				let bmcGeRecevieDTO = {
					projectNo: this.projectNo, //受理号
					isPackage: '0', //是否打包办
					channelMode: channelCode, //服务渠道代码
					channelType: channelCode == 'osp-02-007-wechat' ? '小程序' : (channelCode == 'osp-02-006-app' ? 'app' :
						'移动端'), //服务渠道名称（综柜、网厅等等）
					recerId: recerId, //受理人id
					recer: recer, //受理人姓名
					recDeptId: "", //受理人部门id
					recDept: "", //受理人部门名称
					// cityAdmdvsCode:acceptId,
					regionCode: uni.getStorageSync("areaCode"), //可忽略
					applyUnitNo: "", //申请人单位编号
				}

				let bmcGeProjectDTOS = [{
					taskBasicGuid: this.service.taskBasicGuid, //事项id
					projectId: this.service.taskBasicGuid + this.projectNo, //事项id+受理号
					projectNo: this.projectNo, //受理号
					sceneCode: this.sceneCode, //情形编码（数组形式）
				}]

				let bmcMaterialDTOS = this.getBmcMaterialDtos(appyerCardCode,appyerName)

				let bmcMetadataDTO = {
					projectNo: this.projectNo,
					appyerType: applyerType, //申请主体类型（单位、个人）
					appyerCode: appyerCode, //申请主体编号
					appyerName: appyerName, //申请主体姓名
					appyerCardType: "", //申请主体证件类型（身份证、组织机构代码证）
					appyerCardCode: appyerCardCode, //申请主体证件号码
					coner: recer, //联系人/代理人姓名
					// conerCardType: applyerInfo.applyerPageType,
					conerCardCode: cardCode, //联系人/代理人证件号码
					conerMob: conerMob //联系人手机号码
				}

				let param = {
					bmcGeRecevieDTO: JSON.stringify(bmcGeRecevieDTO),
					bmcGeProjectDTOS: JSON.stringify(bmcGeProjectDTOS),
					bmcMaterialDTOS: JSON.stringify(bmcMaterialDTOS),
					bmcMetadataDTO: JSON.stringify(bmcMetadataDTO),
					bmcMetadataExtendDTOList: JSON.stringify([]),
					bmcUnitPersonnelDTO: JSON.stringify({})
				}
				if(this.secondaryCatalogBool == '1') {
					param.bmcUnitPersonnelDTOS = JSON.stringify(bmcUnitPersonnelDTOS)
				}
				this.$base.post("/bmc/ywsqfw", param, (res) => {
					this.ywsqfw = false
					this.dataChecked = true
					//需要上传材料，则展示材料列表
					this.current1 = 3;
				})
			},
			getBmcMaterialDtos(appyerCardCode,appyerName) {
				let taskBasicGuid = this.service.taskBasicGuid
				let bmcMaterialDtos = [];
				for (let i in this.materialVosCopy) {
					let sinFlag = (this.materialVosCopy[i].needPaperMaterial == "1" && this.materialVosCopy[i]
						.needEMaterial == "1") == true ? "1" : "0" //需要纸质材料（needPaperMaterial）和 需要电子材料（需要电子材料）
					let paperCount = 0
					if (this.materialVosCopy[i].needPaperMaterial === '1') {
						if (this.materialVosCopy[i].provideOriginal === '1') {
							paperCount += 1
						}
						if (this.materialVosCopy[i].provideCopy === '1') {
							paperCount += 2
						}
					} else {
						if (this.materialVosCopy[i].provideOriginal === '1') {
							paperCount += 4
						}
						if (this.materialVosCopy[i].provideCopy === '1') {
							paperCount += 5
						}
					}
					let moreInfo = JSON.parse(this.materialVosCopy[i].moreInfo)
					bmcMaterialDtos.push({
						taskBasicGuid: taskBasicGuid, //事项id
						projectNo: this.projectNo, //受理号
						applyerPageCode: appyerCardCode,//申请证件号
						applyerName: appyerName,//申请证件号
						materialCode: this.materialVosCopy[i].materialCode, //材料编码
						materialName: this.materialVosCopy[i].materialName, //材料名称
						orderNo: this.materialVosCopy[i].orderNo, //材料顺序号
						required_: this.materialVosCopy[i].required, //材料必要性
						tolerance: moreInfo.tolerance ? moreInfo.tolerance : '0', //容缺状态（
						recCertFlag: moreInfo.readECard, // 是否可取证照
						paperCnt: paperCount, // 纸质材料收取形式；0-不收取；1-只收取原件；2-只收取复印件；3-收原件与复印件
						shareFlag: moreInfo.fromShared, //是否可取共享数据
						archiveMinPage: parseInt(moreInfo.archiveMinPage), //材料最小数字化文件数量
						materialType: this.materialVosCopy[i].materialType, //--材料类型(附表/主表/凭证)
						reusable_: this.materialVosCopy[i].reusable, //是否可复用
						sourceType: this.materialVosCopy[i].sourceType, //材料来源（参保人上传/柜台数字化/证照/共享数据/复用）
						sinFlag: sinFlag, //单套制
						isValid: '1',
						needSync: moreInfo.needSync,
					});
				}
				return bmcMaterialDtos
			},
			//跳转到下一步
			toNextPage(param) {
				if(this.dataChecked){
					this.current1 == 3
					this.toCompletePage()
					return;
				}
				if (this.current1 == 1) {
					//加载iframe
					this.fnToIframe()
				} else if (this.current1 == 2) {
					if (param) {
						this.shareParam = param
					}
					this.dataChecked = true;
					//展示材料上传页面
					this.toUploadMaterials()
				} else if (this.current1 == 3) {
					//展示完成页面
					this.toCompletePage()
				}
			},
      setPreDisabled(param){
        this.showPre = param ? true : false
      },
      setPreEnabled(param){
        this.showPre = param === false ? false : true
      },

	  setDataLoading(param){
	    this.showDataLoading = param
	  },
	  setMaterials(param) {
		  this.materialData = JSON.parse(param)
	  },
			//返回上一步
			fnToPre() {
        if (this.current1 === 2 && this.serviceTip === '' && this.showPre) {
            const iframe = this.$refs.iframePage.contentWindow;
            terminalUtil._toPreFormData(iframe)
            return
        }
				if (this.current1 == 3) {
					//记录已经上传的数据
					for (let i in this.materialVos) {
						for (let j in this.uploadList) {
							if (this.materialVos[i].materialCode == this.uploadList[j].materialCode) {
								this.materialVos[i].list = this.uploadList[j].list
								break
							}
						}
					}
				}
				this.dataChecked = false
				if (this.current1 != 1) {
					this.current1 = this.current1 - 1
				}
			},
			//提交数据
			fnToSave() {
				//需要上传材料，则校验材料是否上传
				if (this.materialVosCopy.length > 0) {
					//校验材料是否上传完成
					if (!this.fnValMaterials()) {
						return
					}
				}

				//如果支持快递，弹窗填写邮递信息
				this.mailNames = []
				/* if (this.service.taskBasicMaterialResultVos && this.service.taskBasicMaterialResultVos.length > 0) {
					let resultVos = this.service.taskBasicMaterialResultVos
					for (let i in resultVos) {
						if (resultVos[i].expressSupport == "1") {
							this.mailNames.push(resultVos[i].resultName)
						}
					}
				} */
				if (this.mailNames.length > 0) {
					//需要邮寄放开，屏蔽上面
					this.showDialog = true;
				} else {
					this.fnToSaveFormData()
				}
			},
			fnToSaveFormData() {
				// 有业务表单，则调业务表单的提交
				if (this.checkForm()) {
					const iframe = this.$refs.iframePage.contentWindow;
					this.showDataLoading = true;
					terminalUtil._saveFormData(iframe);
					// this.current1 = 3;
					//this.saveMaterialRepeat(this.projectNo)
				} else {
					// 没业务表单，则调页面提交方法
					this.fnAcceptOnline()
				}
			},
			//是否邮寄
			fnPost(flag) {
				this.showDialog = false;
				if (flag) {
					this.showPost = true;
				} else {
					this.fnToSaveFormData()
				}
			},
			fnAcceptOnline() {
				this.service = uni.getStorageSync("service_" + this.handleItemCode)
				if (this.service) {
					this.service = JSON.parse(this.service)
				}
				let userInfo = this.$base.getUser();
				let loginUser = this.$base.getUser(false);
				//调用受理接口
				let param = {
					"id": this.projectNo,
					"projectNo": this.projectNo,
					"taskBasicCode": this.taskBasicCode,
					"taskBasicGuid": this.service.taskBasicGuid,
					"handleItemName": this.handleItemName,
					"applyerType": userInfo.userType == 'UT02' ? '1' : '2',
					"channelType": uni.getStorageSync("channelCode"),
					"appNo": uni.getStorageSync("channelCode"),
					"channelMode": this.service.handleItemType,
					"pushOrg": uni.getStorageSync("areaCode"),
					"formCode": this.templateCode,
					"creditCode": this.creditCode,
					"pushCreditCode": this.creditCode
				}
				let ospOperator = {
					userId: userInfo.accountBo.accountId,
					tenantAppId: "applet001",
					divisionCode: uni.getStorageSync("areaCode")
				}
				let accountId = userInfo.accountBo.accountId
				if (accountId.length > 20) {
					accountId = accountId.substring(accountId.length - 20)
				}
				if (userInfo.userType == "UT02") {
					param.applyerNo = accountId;
					if (user.userType == "UT02") {
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
					if (res.projectNo) {
						this.saveMaterialRepeat(this.projectNo)
						//提交完成，调用父页面方法进入办理完成页面
						this.toCompletePage()
					} else {
						Dialog.alert({
							title: '提示',
							message: "受理失败：" + res.message
						});
					}
				}, (err) => {
					Dialog.alert({
						title: '提示',
						message: "受理失败：" + err.message
					});
				})
			},
			saveMaterialRepeat (projectNo) {
			  Base.submit(null, {
				url: '/api/bmc/saveMaterialRepeat',
				data: { projectNo: projectNo }
			  })
			},
			fnConfirmPost() {
				const phoneRegex = /^1[3-9]\d{9}$/;
				if (!phoneRegex.test(this.postInfo.phoneNum)) {
					Toast('手机格式不正确！');
					return
				}
				if (!this.postInfo.name) {
					Toast('请输入姓名！');
					return
				}
				if (!this.postInfo.phoneNum) {
					Toast('请输入手机号！');
					return
				}
				if (!this.postInfo.address) {
					Toast('请输入地址！');
					return
				}
				let param = {
					id: this.projectNo,
					zipAddr: this.postInfo.address,
					addresseeName: this.postInfo.name,
					addresseeMobile: this.postInfo.phoneNum
				}
				this.$base.post('/flowgine/saveMailInfo', param, data => {
					this.showPost = false;
					this.fnToSaveFormData()
				})
			},

			//展示办结页面
			toCompletePage() {
				this.showDataLoading = false
				this.current1 = 4
			},
			// iframe加载时添加蒙层效果或其他操作
			fnPageLoading() {
				const _this = this
				let iframe = this.$refs.iframePage
				if (typeof iframe?.attachEvent != 'undefined') {
					// 兼容IE写法
					iframe.attachEvent('onload', function() {
						_this.disableNext = false
						_this.getIframeHeight()
					})
				} else {
					iframe.onload = function() {
						_this.disableNext = false
						// iframe加载完成后要进行的操作
						_this.getIframeHeight()
					}
				}
			},
			//获取iframe高度
			getIframeHeight() {
				this.iframeIsLoad = true
				const iframe = this.$refs.iframePage.contentWindow
				terminalUtil._getIframeHeight(iframe)
			},
			//设置表单不可用
			fnSetFormDisabled() {
				const iframe = this.$refs.iframePage.contentWindow
				terminalUtil._setFormDisabled(iframe, true)
			},
			//设置iframe高度
			setIframeHeight(height) {
				this.iframeIsLoad = true
				this.iframeHeight = this.diffHeight
				if (this.serverType !== 1) {
					this.iframeHeight = this.iframeHeight + 80
				}
				 if (height && this.diffHeight < height) {
					this.iframeHeight = height
				}
			},
			//设置下一步按钮不可用
			setNextDisabled(disabled) {
				this.disableNext = disabled
			},
			//消息弹窗
			alertMsgWindow(data) {
				this.showDataLoading = false
				const iframe = this.$refs.iframePage.contentWindow
				let option = {
					...data,
					message: data.content,
					confirmButtonText: data.okText,
					cancelButtonText: data.cancelText
				}
				if (data.type == "confirm") {
					Dialog.confirm(option).then(() => {
						this.fnMsgCallBack(data.okBack)
					}).catch(() => {
						this.fnMsgCallBack(data.cancleBack)
					});
				} else {
					Dialog.alert(option).then(() => {
						this.fnMsgCallBack(data.okBack)
					});
				}
			},
			fnMsgCallBack(callBack) {
				if (!callBack) {
					return
				}
				const iframe = this.$refs.iframePage.contentWindow
				if (this.isCrossDomain()) {
					terminalUtil._sendPostMessage(iframe, callBack, null, null)
				} else {
					eval('iframe.' + callBack + '()')
				}
			},
			//判断是否跨域
			isCrossDomain() {
				let url = window.location.protocol + "//" + window.location.host
				let ifamePrefix = this.iframeUrl
				if (ifamePrefix.length > url.length) {
					ifamePrefix = ifamePrefix.substring(0, url.length)
				}
				if (ifamePrefix == url) {
					return false
				} else {
					return true
				}
			},
			message(e) {

			},
			handleBack(list) {
        window.parent.postMessage({type: 'previousStep',}, '*')
				// this.uploadList = list
			},
			fnGetUploadCount(materialCode) {
				for (let i in this.uploadList) {
					if (this.uploadList[i].materialCode == materialCode) {
						if (!this.uploadList[i].list) {
							return 0;
						}
						return this.uploadList[i].list.length;
					}
				}
				return 0;
			},
			fnValMaterials() {
				let flag = true;
				let errList = [];
				let dxyFlag = false;
				let dxyList = [];
				this.uploadList.forEach((item) => {
					if (item.required == "1") {
						if (!item.list || item.list.length == 0) {
							flag = false;
							errList.push(item.materialName);
						}
					} else if (item.required == "4") {
						dxyList.push(item.materialName);
						if (item.list && item.list.length > 0) {
							dxyFlag = true;
						}
					}
				});
				if (!flag || (dxyList.length > 0 && !dxyFlag)) {
					if (dxyList.length > 0 && !dxyFlag) {
						let msg = "";
						for (let i in dxyList) {
							if (!msg) {
								msg = dxyList[i];
							} else {
								msg = msg + "或" + dxyList[i];
							}
						}
						errList.push(msg)
					}
					Dialog.alert({
						title: '提示',
						message: errList.join("、") + "未上传附件，请上传后再保存！"
					});
				}
				return flag && (dxyList.length == 0 || (dxyList.length > 0 && dxyFlag));
			},
			//获取受理号
			getProjectNo(callBack) {
				this.$base.post("/flowgine/generateProjectNo", null, (res) => {
					this.projectNo = res.data
					if (callBack) {
						callBack()
					}
				})
			},
			queryReport() {
				let param = {
					acceptId: this.projectNo
				}
				this.$base.post("/osa/queryReportByProjectNo", param, (res) => {
					if (res.resultSet) {
						let list = res.resultSet
						list.forEach((item) => {
							item.name = item.reportName
						})
						this.reportList = list
					}
				})
			},
			fnToPrint() {
				uni.navigateTo({
					url: '/pages/servicePage/showPdf?showHeader=0&type=2&projectNo=' + this.projectNo
				});
			},
		}
	}
</script>

<style lang="scss" scoped>
	/deep/.van-radio {
		margin-bottom: 20rpx;
	}
	.pages {
		width: 100%;
		height: 100vh;
	}
	.data-loading {
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		z-index: 999;

		div {
			text-align: center;
			margin-top: 70%;
		}
	}

	.main {}

	.main-body {
		margin: 24rpx 24rpx;
		// margin-bottom: 66px;
	}

	.line {
		width: 624rpx;
		height: 1rpx;
		background: #E6E6E6;
		margin: 0 auto;
		opacity: 0.4;
	}

	.content {
		background-color: #ffffff;
		padding: 0 40rpx;
		padding-bottom: 44rpx;
		font-size: 28rpx;
		color: #333;
		font-weight: 400;
		margin-bottom: 24rpx;
		padding-top: 10rpx;
	}

	.title-common {
		font-family: PingFang SC;
		font-size: 28rpx;
		font-weight: normal;
		font-stretch: normal;
		line-height: 80rpx;
		letter-spacing: 0;
		color: #333333
	}

	.title-head {
		font-size: 36rpx;
	}

	.title1-content {
		font-family: PingFang SC;
		font-size: 28rpx;
		font-weight: normal;
		font-stretch: normal;
		line-height: 44rpx;
		letter-spacing: 0px;
		color: #666666;
		text-indent: 2em;
	}

	.declareFile {
		text-indent: 0;
	}

	.processFlow {
		text-indent: 0;
	}

	.step-li {
		width: 100%;
		height: 36rpx;
		line-height: 36rpx;
	}

	.step-icon {
		display: inline-block;
		width: 34rpx;
		height: 34rpx;
		line-height: 30rpx;
		border-radius: 50%;
		text-align: center;
		font-size: 24rpx;
		border: 2rpx solid #666666;
		text-indent: 0;
		margin-right: 16rpx;
	}

	.left-line {
		height: 43rpx;
		width: 2rpx;
		margin-left: 18rpx;
		margin-top: 8rpx;
		background: #666666;
	}

	.agreeInfo {
		overflow: hidden;
		margin-top: 48rpx;
		margin-bottom: 48rpx;
		font-size: 28rpx;
		text-align: center;
	}

	.agree-icon {
		display: inline-block;
		/*float: left;*/
		width: 36rpx;
		height: 36rpx;
		font-size: 24rpx;
		text-align: center;
		line-height: 32rpx;
		border-radius: 50%;
		border: 2rpx solid #999999;
		margin-right: 16rpx;
		vertical-align: middle;
		color: #2e82f1;
	}

	.agree-text {
		display: inline-block;
		vertical-align: middle
	}

	.van-doc-demo-block__title {
		margin: 0;
		padding: 16px;
		color: rgba(69, 90, 100, 0.6);
		font-weight: normal;
		font-size: 14px;
		line-height: 16px;
	}

	.btnStyle {
		width: 100%;
		margin-top: 24rpx;
	}

	.mt20 {
		/* margin-top: 40rpx; */
		padding: 0 20rpx;
		background: #F3F5F9;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    height: 100%;
	}

	.uploadBox {
    margin-top: 18rpx;
	}

	.btnBox {
		// width: 100%;
		box-sizing: border-box;
		padding-bottom: 20rpx;

		.setBtn {
			display: flex;
			justify-content: space-evenly;
		}
	}

	.btnBox_wx {
		width: 100%;
		display: flex;
		justify-content: center;
	}

	.titleBox {
		background-color: #ffffff;

		.title_style {
			width: 6rpx;
			height: 32rpx;
			border-radius: 6rpx;
			background-color: #4092ff;
			margin-right: 16rpx;
		}

		.title_text {

			height: 88rpx;
			background: #FFFFFF;
			border-radius: 8rpx 8rpx 0rpx 0rpx;
			display: flex;
			align-items: center;
			padding: 0 32rpx;

			.title_icon {
				width: 6rpx;
				height: 32rpx;
				background: #1492FF;
				margin-right: 12rpx;
			}

			.title {
				height: 44rpx;
				font-size: 32rpx;
				font-weight: bold;
				color: #000000;
				line-height: 44rpx;
			}
		}
	}

	.success_text {
		text-align: center;
		font-size: 18px;
		line-height: 24px;
		color: #555555;
		font-weight: bold;
		margin: 20px 0;
	}

	.tips_content {
		width: 100%;
		/* float: left; */
		font-size: 14px;
		line-height: 24px;
		color: #333333;
		text-align: center;
		margin-bottom: 40rpx;
	}

	.showDialog {
		width: 600rpx;
		box-sizing: border-box;
		padding: 20rpx;

		.title {
			font-size: 40rpx;
			text-align: center;
			margin-bottom: 12rpx;
		}

		.dialog {
			text-align: center;
			margin: 24rpx;
		}

		.post {
			margin-bottom: 12rpx;
		}

		.showLine {
			border-top: 1px solid #f0f0f0;
		}

		.btnBox {
			padding-top: 24rpx;
			display: flex;
			justify-content: space-around;

			.comfirm {
				color: #ff0000;
			}
		}
	}

	.bgImg {
		width: 240rpx;
		height: 200rpx;
		background: url('./img/bgImg.png') no-repeat;
		background-size: 100% 100%;
		margin: 60rpx auto;
	}

	// /deep/.van-icon-success {
	// 	position: relative;
	// }

	// /deep/.van-icon-success:before {
	// 	position: absolute;
	// 	top: 50%;
	// 	left: 50%;
	// 	transform: translate(-50%, -50%);
	// 	width: 30rpx;
	// 	height: 30rpx;
	// 	display: inline-block;
	// 	content: '';
	// 	background: url('./img/ok.png') no-repeat;
	// 	background-size: 100% 100%;
	// }
</style>
