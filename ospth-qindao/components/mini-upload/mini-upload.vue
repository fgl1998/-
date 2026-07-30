<template>
	<view style="width: 100%;height: 100%;">
		<!-- 默认上传 -->
		<view class="uploadPage" v-show="!pdfUrl">
			<view class="titleBox">
				<view class="icon"></view>
				<view class="title">{{name}}</view>
				<view v-show='isRequired == 1' style="color: red;">*</view>
			</view>
			<view class="line"></view>
			<view v-show="imgList.length == 0">
				<!-- <view class="imgBox" v-if="!readOnly" @click="uploadImage"> -->
				<!-- <view class="imgBox" v-if="!readOnly" @click="uploadFile">
					<view class="icon"></view>
					<view class="text">本地上传</view>
				</view> -->
				<view class="imgBox" v-if="!readOnly" @click="changeUploadType">
					<view class="icon"></view>
					<view class="text">{{computedUpload(moreInfo)?'上传':'本地上传'}}</view>
				</view>
				<!-- <view class="tips">
					<view>
						温馨提示：仅支持<text class="tip">jpg、png、jpeg</text>三种图片格式
					</view>
					<view style="margin-top: 12rpx;">
						图片大小不能超过<text class="tip">500KB</text>
					</view>
				</view> -->
			</view>

			<view class="showImg" v-show="imgList.length>0">
				<view class="imageBox" v-for="(item, index) in imgList" :key="index">
					<image v-show="index == 0" class="fstImg" :src="fnShowImage(item)" mode="scaleToFill"
						@click="previewImage(item,index)">
						<view v-show="index == 0" v-if="!readOnly" class="fstDelIcon" @click="deleteImage(index)">
						</view>
					</image>
					<view v-show="imgList.length>0">
						<image v-show='index != 0' class="img" :src="fnShowImage(item)" mode="scaleToFill"
							@click="previewImage(item,index)">
							<view v-show='index != 0' v-if="!readOnly" class="delIcon" @click="deleteImage(index)">
							</view>
						</image>
					</view>
				</view>
				<!-- <view class="addSmallImg" v-if="!readOnly" @click="uploadImage"> -->
				<!-- <view class="addSmallImg" v-if="!readOnly" @click="uploadFile">
					<view class="add"></view>
					<view class="tip">添加图片</view>
				</view> -->
				<view class="imgBox" v-if="!readOnly" @click="changeUploadType">
					<view class="icon"></view>
					<view class="text">{{computedUpload(moreInfo)?'上传':'本地上传'}}</view>
				</view>
				<view class="tips">
					<view>
						温馨提示：仅支持<text class="tip">JPG、JPEG</text>格式上传
					</view>
					<view style="margin-top: 12rpx;">
						图片大小不能超过<text class="tip">10M</text>
					</view>
				</view>
			</view>
			<view style="display: flex;flex-direction:column; align-items: center;justify-content: center;margin-top: 40px;;">
				<button type="primary" style="width: 100%;height: 40px;line-height: 40px;" @click="fnBack">确定</button>
				<view style="font-size: 24rpx;padding: 20rpx;color: coral;">
					温馨提示:<text class="tip">点击确定按钮可返回材料界面继续选择上传</text>
				</view>
			</view>
		</view>
		<van-popup v-model="showPopup" position="bottom" round :style="{ height: '22%' }">
			<view style="text-align: center;margin: 24rpx 0;">请选择上传方式</view>
			<view class="showPopup">
				<view class="selectBox" @click="isAppUpload('camera')">
					<view class="icon photo"></view>
					<view>相机</view>
				</view>
				<view class="selectBox" @click="isAppUpload('album')">
					<view class="icon image"></view>
					<view>相册</view>
				</view>
			</view>
		</van-popup>
		<van-popup class="uploadType" v-model="showTypePopup" position="bottom" round closeable>
			<view style="text-align: center;margin: 24rpx 0;">请选择上传方式</view>
			<view class="showType">
				<view class="typeItem" @click="uploadSelet(1)">本地上传</view>
				<view class="typeItem" @click="uploadSelet(2)" v-if="moreInfo.readECard == '1'">证照共享</view>
				<!-- <view class="typeItem" @click="uploadSelet(3)" v-if="moreInfo.fromShared == '1'">数据共享</view> -->
				<view class="typeItem" @click="uploadSelet(3)" v-if="moreInfo.fromShared == '1'">数据共享</view>
				<view class="typeItem" @click="uploadSelet(4)" v-if="moreInfo.reusable == '1'">材料复用</view>
			</view>
		</van-popup>
		<van-popup class="licenseShare" v-model="dataDis" closeable position="bottom" round :style="{ height: '90%' }">
			<view style="text-align: center;margin: 24rpx 0;">{{uploadName}}</view>
			<scroll-view scroll-y="true" scroll-x="false">
				<view class="fileSelect" v-if="licenseData && Array.isArray(licenseData) && licenseData.length > 0">
					<van-checkbox-group v-model="checkedLicense" :value="checkedLicense" @change="changeCheck">
						<view class="fileItem" v-for="(item,index) in licenseType" :key="index">
							<view class="itemItlm">
								<view class="head_title">
									<view class="icon_bg"></view>
									<view class="">{{item}}</view>
								</view>

								<view class="itemCon" v-for="(v,i) in licenseData.filter(v=>v.type==item)" :key="v.id">
									<view class="checkItem">
										<image :src="fnShowImage(v)" mode="" style="width: 100%;">
											<view class="checkItemBox">
												<van-checkbox :name="v.fileId" shape="square"></van-checkbox>
											</view>
										</image>
									</view>
									<view class="fileName">文件名：<text>{{ v.fileName }}</text></view>
									<view class="uploadTime">上传时间：<text>{{ v.uploadTime }}</text></view>
								</view>
							</view>
						</view>
					</van-checkbox-group>
					<view class="btnBox">
						<van-button round type="info" block @click="licenseSeleted">确定</van-button>
					</view>
				</view>
			</scroll-view>
		</van-popup>
		<van-popup class="dataShare" v-model="showShareForm" position="bottom" round closeable>
			<view style="text-align: center;margin: 24rpx 0;">数据共享</view>
			<view class="form_item_wrap">
				<view class="formBox">
					<view class="label"><span class="required">*</span>姓名：</view>
					<view class="input_wrap">
						<input type="text" v-model="form.aac003" placeholder="请填写姓名" />
					</view>
				</view>
				<view class="formBox">
					<view class="label"><span class="required">*</span>证件号码：</view>
					<view class="input_wrap">
						<input type="text" v-model="form.aac002" placeholder="请填写证件号码" />
					</view>
				</view>
				<view class="formBox1">
					<view class="label"><span class="required">*</span>性别：</view>
					<view class="input_wrap">
						<van-radio-group v-model="form.aac004" :value="form.aac004" direction="horizontal">
							<van-radio name="1">男</van-radio>
							<van-radio name="2">女</van-radio>
						</van-radio-group>
					</view>
				</view>
				<view class="btnBox" style="margin: 20rpx 0;margin-top: 40rpx;">
					<van-button round type="info" block @click="checkShareParam">确定</van-button>
				</view>

			</view>
		</van-popup>
		<view class="pdfContent" v-if="pdfUrl">
			<view class="closePdf" @click="pdfUrl=''"><van-icon name="cross" size="25" /></view>
			<!-- #ifdef H5 -->
			<iframe ref="pdfIframe" :src="pdfUrl" style="width: 100%;height: 100%;border: none;"></iframe>
			<!-- #endif -->
			<!-- #ifdef MP -->
			<web-view ref="pdfIframe" :src="pdfUrl" style="width: 100%;height: 100%;"></web-view>
			<!-- #endif -->
		</view>
	</view>

</template>
<script>
import {
  RadioGroup,
  Radio, Dialog
} from 'vant';
	import {
		img1,
		img2,
		img3,
		img4
	} from "./images/materialsUpload/ImgBase64.js";

	export default {
		name: 'mini-upload',
		props: {
			shareParam: {
				type: Object,
				default: function() {
					return {};
				},
			},
			name: {
				type: String,
				default: '',
			},
			type: {
				type: String,
				default: '',
			},
			taskBasicGuid: {
				type: String,
				default: '',
			},
			// 修改 应为Number类型
			totalNumber: {
				type: Number,
				default: 0,
			},
			meterUpload: {
				type: Boolean,
				default: false,
			},
			isRequired: {
				type: String,
				default: '0',
			},
			projectNo: {
				type: String,
				default: '',
			},
			materialCode: {
				type: String,
				default: '',
			},
			fileList: {
				type: Array,
				default: () => {
					return []
				}
			},
			scsfz: {
				type: String,
				default: ''
			},
			readOnly: {
				type: Boolean,
				default: false
			},
			maxIndex: {
				type: Number,
				default: 1
			},
			moreInfo: {
				type: Object,
				default: () => {
					return {}
				}
			},
			cardCode: {
				type: String,
				default: ""
			}
		},
		data() {
			return {
				addImg: '',
				imgList: [],
				showImg: false,
				compressNum: 0,
				showPopup: false,
				showTypePopup: false,
				dataDis: false, //证照共享弹窗
				showShareForm: false, //数据共享
				preViewUrl: this.$base.BASE_URL + "/bmc/download", // 预览地址

				licenseData: [],
				licenseType: [],
				checkedLicense: [],
				file: {}, //文件参数，可以是文件数组
				shareData: {},
				uploadName: '',
				form: {
					aac002: "",
					aac003: "",
					aac004: "",
				}, //数据共享所需信息
				pdfUrl: '',
			};
		},
		watch: {
			fileList: {
				deep: true,
				handler: function(newVal, oldVal) {
					this.imgList = JSON.parse(JSON.stringify(this.fileList))
				}
			}
		},
		mounted() {},
		computed: {

		},
		components: {},
		methods: {
			fnBack () {
				this.$emit('fnBack')
			},
			uploadSelet(type) {
				if (type == 1) {
					this.showTypePopup = false;
					this.uploadFile()
				}
				if (type == 2) {
					this.licenseShareFn()
				}
				if (type == 3) {
					// this.dataDis = true;
					this.dataShare()
				}
				if (type == 4) {
					// this.dataDis = true;
					this.documentShare()
				}
			},
			checkShareParam() {
				if (!this.form.aac003) {
					uni.showToast({
						icon: 'none',
						title: '请填写姓名！'
					})
					return
				}
				if (!this.form.aac002) {
					uni.showToast({
						icon: 'none',
						title: '请填写证件号码！'
					})
					return
				}
				if (!this.form.aac004) {
					uni.showToast({
						icon: 'none',
						title: '请选择性别！'
					})
					return
				}
				this.shareData = this.form
				this.uploadShareData()
			},
			//证照共享
			licenseShareFn() {
				this.showTypePopup = false;
				this.dataDis = true;
				this.uploadName = "证照共享";
				this.checkedLicense = [];
				this.licenseData = [{
						id: 1,
						showImg: img2,
						fileName: "身份证正面",
						checked: false,
						uploadTime: "2023/04/14",
						type: '身份证'
					},
					{
						id: 2,
						showImg: img1,
						fileName: "身份证背面",
						checked: false,
						uploadTime: "2023/04/14",
						type: '身份证'
					},
					{
						id: 3,
						showImg: img4,
						fileName: "户口簿",
						checked: false,
						uploadTime: "2023/04/14",
						type: '户口簿'
					},
					{
						id: 4,
						showImg: img3,
						fileName: "结婚证",
						checked: false,
						uploadTime: "2023/04/14",
						type: '结婚证'
					},
				];
				this.licenseType = ['身份证', '户口簿', '结婚证']
			},
			// 数据共享
			dataShare() {
				if (!this.shareParam?.aac002) {
					this.showTypePopup = false;
					this.showShareForm = true;
					return
				}

				this.shareData = {
					...this.shareParam
				}
				this.uploadShareData()
			},
			// 材料复用
			documentShare() {
				this.$nextTick(() => {
					this.showTypePopup = false;
					this.dataDis = true;
					this.uploadName = "材料复用";
					this.checkedLicense = [];
          let param = {
            projectNo: this.projectNo ,
            materialCode: this.materialCode
          }
          this.$base.post('/bmc/initEffectListPc', param, res => {
            this.licenseData = res.resultSet
            this.licenseData = this.licenseData.map(item => ({
              ...item,
              type: '材料复用'
            }));
          },data => {
            Dialog.alert({
              title: '提示',
              message: '获取复用材料失败！'
            }).then(() => {
              this.errorMsg = '获取复用材料失败！'
            });
            return
          })
					this.licenseType = ['材料复用']
				})
			},
			// 证照选中与否
			changeCheck(e) {
				this.licenseData.forEach(item => {
					if (e.includes(item.fileId)) {
						item.checked = true
					} else {
						item.checked = false
					}
				})
			},
			licenseSeleted() {
        debugger
				let maxIndex = this.getImgIndex();
				let flag = false;
				this.licenseData.forEach((v) => {
					if (v.checked) {
						flag = true;
						// // base64图片转Blob
						// let imgBlob = this.dataURLtoBlob(
						// 	"data:image/png;base64," + v.showImg
						// );
						// let fileName = v.name;
						// // 图片转文件
						// this.file = this.blobToFile(imgBlob, fileName);
						// this.file.uid = Date.now();
						maxIndex++;
						this.licenseUpload(v);
					}
				});
				if (!flag) {
					this.dataDis = false;
				}
			},
      licenseUpload(item) {
        //大于指定上传数量，则不允许上传
        if (this.totalNumber != null && this.totalNumber != 0 && this.imgList.length >= this.totalNumber) {
          uni.showToast({
            title: '当前材料已上传完，无需继续上传，如需补传请删除原上传材料后再上传',
            icon: 'none',
            duration: 2000
          });
          return;
        }
        let _this = this;
        uni.showLoading({
          title: '上传中'
        })
        let channelCode = "osp-02-006-app"
        if (!channelCode) {
          channelCode = "osp-02-006-app"
        }
        let index = this.getImgIndex() + 1
        let maxIndex = this.maxIndex < index ? index : this.maxIndex + 1
        this.$emit('max-change', maxIndex)
        let submitParameter = {
          stogId: item.stogId, //文件参数，可以是文件数组
          projectNo: this.projectNo,
          materialCode: this.materialCode
        };
        this.$base.post("/bmc/insertRepeatFilePc", submitParameter, (res) => {
          if (item.fileSufx == '.pdf' || item.fileSufx == '.ofd') {
            item.base64 =
              'data:image/png;base64,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'
          }
          if (item.fileSufx == '.xml') {
            item.base64 =
              'data:image/jpeg;base64,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'
          }
          item.down = true
          _this.imgList.push(item);
          _this.returnResult(_this.imgList);
          uni.showToast({
            title: '上传成功',
            icon: 'none',
            duration: 2000
          })
          _this.dataDis = false;
        }, (err) => {
          uni.showToast({
            title: '上传出错',
            icon: 'none',
            duration: 2000
          })
          _this.dataDis = false;
        }).then(() => {
          uni.hideLoading()
          this.dataDis = false;
        })
      },
			//证照上传
			// licenseUpload() {
			// 	//大于指定上传数量，则不允许上传
			// 	if (this.totalNumber != null && this.totalNumber != 0 && this.imgList.length >= this.totalNumber) {
			// 		uni.showToast({
			// 			title: '当前材料已上传完，无需继续上传，如需补传请删除原上传材料后再上传',
			// 			icon: 'none',
			// 			duration: 2000
			// 		});
			// 		return;
			// 	}
				// let _this = this;
				// uni.showLoading({
				// 	title: '上传中'
				// })
				// let channelCode = "osp-02-006-app"
				// if (!channelCode) {
				// 	channelCode = "osp-02-006-app"
				// }
				// let index = this.getImgIndex() + 1
				// let maxIndex = this.maxIndex < index ? index : this.maxIndex + 1
				// this.$emit('max-change', maxIndex)
				// uni.uploadFile({
				// 	url: _this.$base.BASE_URL + '/bmc/insertFile',
				// 	file: this.file, //文件参数，可以是文件数组,
				// 	name: 'files',
				// 	formData: {
				// 		projectNo: this.projectNo,
				// 		materialCode: this.materialCode,
				// 		orderNo: this.maxIndex,
				// 		materialVerNo: this.maxIndex,
				// 		taskBasicGuid: this.taskBasicGuid,
				// 		cardCode: this.cardCode
				// 	},
				// 	header: {
				// 		"channelCode": channelCode
				// 	},
				// 	success(data) {
				// 		let result = JSON.parse(data.data);
				// 		try {
				// 			if (result.data.resultSet && result.data.resultSet.length > 0) {
				// 				let fileObj = result.data.resultSet[0];
				// 				let data = {
				// 					...fileObj,
				// 					fileId: fileObj.objectid,
				// 					fileName: fileObj.objectKey,
				// 					base64: fileObj.base64,
				// 					index: Number(fileObj.index),
				// 					materialCode: fileObj.materialCode,
				// 					xmlStr: fileObj.xmlStr,
				// 					down: true,
				// 				}
        //
				// 				if (data.fileSufx == '.pdf' || data.fileSufx == '.ofd') {
				// 					data.base64 =
				// 						'data:image/png;base64,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'
				// 				}
				// 				if (data.fileSufx == '.xml') {
				// 					data.base64 =
				// 						'data:image/jpeg;base64,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'
				// 				}
				// 				_this.imgList.push(data);
				// 				_this.returnResult(_this.imgList);
				// 				uni.showToast({
				// 					// title: '上传成功',
				// 					title: '上传出错',
				// 					icon: 'none',
				// 					duration: 2000
				// 				})
				// 				_this.dataDis = false;
				// 			} else {
				// 				uni.showToast({
				// 					// title: '上传成功',
				// 					title: '上传出错',
				// 					icon: 'none',
				// 					duration: 2000
				// 				})
				// 				_this.dataDis = false;
				// 			}
				// 		} catch (e) {
				// 			uni.showToast({
				// 				// title: '上传成功！',
				// 				title: '上传失败,请重新上传！',
				// 				icon: 'none',
				// 				duration: 2000
				// 			})
				// 			_this.dataDis = false;
				// 		}
				// 	},
				// 	fail(res) {
				// 		uni.hideLoading()
				// 		uni.showToast({
				// 			// title: '上传成功',
				// 			title: '上传失败',
				// 			icon: 'none',
				// 			duration: 2000
				// 		})
				// 		_this.dataDis = false;
				// 	},
				// 	complete() {
				// 		uni.hideLoading()
				// 		this.dataDis = false;
				// 	}
				// })
			// },
			uploadShareData() {
				let handleItemName = uni.getStorageSync('service_handleItemName');
				let maxIndex = this.getImgIndex() + 1;
				let content = "";
				if (materialCode === 'M0005') {
					content = '办理项名称: ' + handleItemName + '\n' +
						'材料名称: ' + this.name + '\n' +
						'姓名: ' + this.shareData.aac003 + '\n' +
						'身份证: ' + this.shareData.aac002 + '\n' +
						'性别: ' + this.shareData.aac004 + '\n' +
						'就业登记时间: ' + '20230606' + '\n' +
						'岗位性质: ' + '操作岗'
				} else {
					content = '办理项名称: ' + handleItemName + '\n' +
						'材料名称: ' + this.name + '\n' +
						'姓名: ' + this.shareData.aac003 + '\n' +
						'身份证: ' + this.shareData.aac002 + '\n' +
						'性别: ' + this.shareData.aac004 + '\n' +
						'民族: ' + '汉族' + '\n' +
						'户口性质: ' + '城镇户口' + '\n' +
						'户口所在地详细地址: ' + '天津市和平区鞍山道154号'
				}
				let param = {
					content: content,
					projectNo: this.projectNo,
					taskBasicGuid: this.taskBasicGuid,
					materialCode: this.materialCode,
					orderNo: maxIndex,
					materialVerNo: maxIndex,
					index: maxIndex,
					cardCode: this.cardCode
				};
				this.$base.post("/bmc/uploadXml", param, (res) => {
					if (res.code == 200) {
						let result = res;
						let resultSet = [];
						resultSet.push(result);
						let matrialsInfo = {
							resultSet: resultSet,
						};
						this.insertList(matrialsInfo);
						this.showShareForm = false;
					}
				});
			},

			//先将base64转换为blob
			dataURLtoBlob(dataurl) {
				let arr = dataurl.split(","),
					mime = arr[0].match(/:(.*?);/)[1],
					bstr = atob(arr[1]),
					n = bstr.length,
					u8arr = new Uint8Array(n);
				while (n--) {
					u8arr[n] = bstr.charCodeAt(n);
				}
				return new Blob([u8arr], {
					type: mime
				});
			},
			//再将blob转换为file
			blobToFile(theBlob, fileName) {
				theBlob.lastModifiedDate = new Date(); // 文件最后的修改日期
				theBlob.name = fileName; // 文件名
				return new File([theBlob], fileName, {
					type: theBlob.type,
					lastModified: Date.now(),
				});
			},
			// 本地上传或其他上传
			computedUpload(moreInfo) {
				return moreInfo.readECard == '1' || moreInfo.fromShared == '1' || moreInfo.reusable == '1'
			},
			// 选择上传类型
			changeUploadType() {
				let flag = this.computedUpload(this.moreInfo);
				if (flag) {
					this.showTypePopup = true;
				} else {
					this.uploadFile()
				}

			},
			returnResult(_data) {
				this.$emit('change', _data);
			},
			isAppUpload(type) {
				let _this = this;
				_this.showPopup = false;
				md.getMedia({
					sourceType: type,
					encodingType: 'jpg',
					mediaType: 'pic',
					destinationType: 'base64',
					allowEdit: false,
					saveToPhotoAlbum: false
				}, function(ret, err) {
					if (ret) {
						let base64Codes = 'data:image/jpeg;base64,' + JSON.parse(JSON.stringify(ret))
							.base64Data
						let name = JSON.parse(JSON.stringify(ret)).data;
						let imageName = name.slice(name.indexOf('photoImgCom')).slice(name.slice(name
							.indexOf(
								'photoImgCom')).indexOf('/') + 1);
						let imgFile = _this.dataURLtoFile(base64Codes, imageName);
						if (imgFile.size / 1024 > 10240) {
							uni.showToast({
								title: '上传图片大小不能超过10M!',
								icon: 'none',
								duration: 2000
							});
							return
						} else {
							_this.fnCompress(imgFile, imageName);
						}
					} else {
						uni.showToast({
							title: '上传图片失败！请重试！',
							icon: 'none',
							duration: 2000
						});
						return
					}
				});
			},

			//判断是否是回显
			fnShowImage(data) {
        console.log('fnShowImage681', data)
				if (data.fileSufx == '.pdf' || data.fileSufx == '.ofd' || data.fileName.split('.')[1] == 'pdf') {
					return 'data:image/png;base64,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';
				}
				if (data.fileSufx == '.xml' || data.fileName.split('.')[1] == 'xml') {
					return 'data:image/jpeg;base64,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';
				}
				if (data.stogId) {
					let viewUrl = ""
					if (this.$base.BASE_URL.startsWith("/")) {
						let url = window.location.href
						viewUrl = url.split("/template")[0]
					}
					return viewUrl + this.preViewUrl + `?stogId=${data.stogId}&fileSufx=${data.fileSufx}`;
				}
				if (data.showImg) {
					return "data:image/jpeg;base64," + data.showImg;
				}
				return 'data:image/jpeg;base64,' + data.base64;
			},
			// 上传文件
			uploadFile(index) {
				//大于指定上传数量，则不允许上传
				if (this.totalNumber != null && this.totalNumber != 0 && this.imgList.length >= this.totalNumber) {
					uni.showToast({
						title: '当前材料已上传完，无需继续上传，如需补传请删除原上传材料后再上传',
						icon: 'none',
						duration: 2000
					});
					return;
				}
				let _this = this;
				if (_this.$base.isApp()) {
					_this.showPopup = true;
				} else {
					uni.chooseFile({
						count: 6, //默认9
						extension: ['jpeg', 'jpg'],
						success: function(res) {
							// 图片
							let type = res.tempFiles[0].type.split('/')[0]
							if (type == 'image') {
								const imgSize = res.tempFiles[0] && res.tempFiles[0].size ? res
									.tempFiles[0]
									.size :
									0;
								const imgName = res.tempFiles[0] && res.tempFiles[0].name ? res
									.tempFiles[0]
									.name :
									'';
								if (res.tempFiles[0].size / 1024 > 10240) {
									uni.showToast({
										title: '上传图片大小不能超过10M!',
										icon: 'none',
										duration: 2000
									});
									return
								} else {
									_this.fnCompress(res.tempFiles[0], imgName);
								}
								// pdf文件
								// } else if (res.tempFiles[0].type == 'application/pdf') {
								// 	_this.fnUpLoadImg(res.tempFiles[0])
								// 	// xml等文件
								// } else if (res.tempFiles[0].type == 'text/xml') {
								// 	_this.fnUpLoadImg(res.tempFiles[0])
							} else {
								_this.fnUpLoadImg(res.tempFiles[0]);
							}
						}
					});
				}
			},

			// 上传图片
			uploadImage(index) {
				//大于指定上传数量，则不允许上传
				if (this.totalNumber != null && this.totalNumber != 0 && this.imgList.length >= this.totalNumber) {
					uni.showToast({
						title: '当前材料已上传完，无需继续上传，如需补传请删除原上传材料后再上传',
						icon: 'none',
						duration: 2000
					});
					return;
				}
				let _this = this;
				if (_this.$base.isApp()) {
					_this.showPopup = true;
				} else {
					uni.chooseImage({
						count: 6, //默认9
						sizeType: ['original', 'compressed'], //可以指定是原图还是压缩图，默认二者都有
						sourceType: ['album'], //从相册选择
						success: function(res) {
							const imgSize = res.tempFiles[0] && res.tempFiles[0].size ? res.tempFiles[
									0]
								.size :
								0;
							const imgName = res.tempFiles[0] && res.tempFiles[0].name ? res.tempFiles[
									0]
								.name :
								'';
							if (res.tempFiles[0].size / 1024 > 10240) {
								uni.showToast({
									title: '上传图片大小不能超过10M!',
									icon: 'none',
									duration: 2000
								});
								return
							} else {
								_this.fnCompress(res.tempFiles[0], imgName);
							}
						}
					});
				}
			},

			fnCompress(file, imgName) {
				if (file.size / 1024 <= 500) {
					this.fnUpLoadImg(file)
					return;
				};
				if (this.compressNum > 10) {
					uni.showToast({
						title: '图片上传失败！',
						icon: 'none',
						duration: 2000
					});
					this.compressNum = 0;
					return
				}
				this.photoCompress(file, (base64Codes) => {
					this.fnCompress(this.dataURLtoFile(base64Codes, imgName), imgName);
				})
				this.compressNum++;
			},

			// 预览图片
			previewImage(data, index) {
				let url = ''
				if (data.fileSufx == '.pdf' || data.fileSufx == '.ofd' || data.fileName.split('.')[1] == 'pdf') {
					if(data.base64) {
						uni.setStorageSync("pdfBase64", "data:application/pdf;base64," + data.base64)
						this.pdfUrl = "../../template/h5/static/pdf/web/viewer.html?showBase64=1&isSimpleShowMode=true&isDownload=false&isPrint=false"
					} else {
						let param = {
							stogId: data.stogId,
							fileSufx: data.fileSufx
						}
						this.$base.post("/bmc/downloadPdf", param, (res) => {
							if (!res.data) {
								Dialog.alert({
									title: '提示',
									message: '未获取上传文件信息！'
								})
								return
							}
							data.base64 = res.data
							uni.setStorageSync("pdfBase64", "data:application/pdf;base64," + res.data)
							this.pdfUrl = "../../template/h5/static/pdf/web/viewer.html?showBase64=1&isSimpleShowMode=true&isDownload=false&isPrint=false"
						}, (err) => {
							Dialog.alert({
								title: '提示',
								message: '未获取上传文件信息！'
							})
						})
					}
				} else {
					let preImgList = [];
					let viewUrl = ""
					if (this.$base.BASE_URL.startsWith("/")) {
						let url = window.location.href
						viewUrl = url.split("/template")[0]
					}
					this.imgList.forEach((item, index) => {
						if (item.stogId) {
							if (item.fileSufx == '.pdf' || item.fileSufx == '.xml') {
								preImgList[index] = item.base64;
								return
							}
							preImgList[index] = viewUrl +
								`${this.preViewUrl}?stogId=${item.stogId}&fileSufx=${item.fileSufx}`;
						} else {
							if (item.fileSufx == '.pdf' || item.fileName.split('.')[1] == 'pdf') {
								preImgList[index] = item.base64;
								return
							}
							if (item.fileSufx == '.xml' || item.fileName.split('.')[1] == 'xml') {
								preImgList[index] = item.base64;
								return
							}
							preImgList[index] = 'data:image/jpeg;base64,' + item.base64;
						}
					})
					uni.previewImage({
						urls: preImgList,
						current: index
					})
				}


			},
			// 删除图片
			deleteImage(idx) {
				let param = {
					projectNo: this.projectNo,
					materialCode: this.materialCode,
					taskBasicGuid: this.taskBasicGuid,
					stogId: this.imgList[idx].stogId,
					// materialVerNo: this.imgList[idx].index,
					// fileId: this.imgList[idx].fileId,
					fileSize: this.imgList[idx].fileSize,
				}
				this.$base.post("/bmc/deleteFilesNew", param, (res) => {
					this.imgList.splice(idx, 1);
					this.returnResult(this.imgList);
				})
			},
			getImgIndex() {
				let index = 0;
				for (let i in this.imgList) {
					if (this.imgList[i].index) {
						if (this.imgList[i].index > index) {
							index = this.imgList[i].index
						}
					} else {
						index = this.imgList.length
					}

				}
				return index;
			},
			fnUpLoadImg(item) {
				let _this = this;
				uni.showLoading({
					title: '上传中'
				})
				let channelCode = "osp-02-006-app"
				if (!channelCode) {
					channelCode = "osp-02-006-app"
				}
				let index = this.getImgIndex() + 1
				let maxIndex = this.maxIndex < index ? index : this.maxIndex + 1
				this.$emit('max-change', maxIndex)
				uni.uploadFile({
					url: _this.$base.BASE_URL + '/bmc/insertFile',
					file: item,
					name: 'files',
					formData: {
						projectNo: this.projectNo,
						materialCode: this.materialCode,
						orderNo: this.maxIndex,
						materialVerNo: this.maxIndex,
						taskBasicGuid: this.taskBasicGuid,
						cardCode: this.cardCode
					},
					header: {
						"channelCode": channelCode
					},
					success(data) {
						
            console.log('942success',data)
						_this.insertList(data);
					},
					fail(res) {
						uni.hideLoading()
						uni.showToast({
							// title: '上传成功',
							title: '上传失败',
							icon: 'none',
							duration: 2000
						})
					},
					complete() {
						uni.hideLoading()
					}
				})
			},
			insertList(res) {
				let result = JSON.parse(res.data);
				try {
					if (result.data.resultSet && result.data.resultSet.length > 0) {
						let fileObj = result.data.resultSet[0];
						let suffix = fileObj.objectKey.split(".")[1];
						let data = {
							...fileObj,
							fileSufx: suffix,
							fileId: fileObj.objectid,
							fileName: fileObj.objectKey,
							base64: fileObj.base64,
							index: Number(fileObj.index),
							materialCode: fileObj.materialCode,
							xmlStr: fileObj.xmlStr,
							down: true,
						}
						this.imgList.push(data);
						this.returnResult(this.imgList);
					} else {
						uni.showToast({
							title: result.message,
							icon: 'none',
							duration: 2000
						})
					}
				} catch (e) {
					uni.showToast({
						title: result.message,
						icon: 'none',
						duration: 2000
					})
				}
			},
			// 压缩图片
			photoCompress(file, objDiv) {
				var ready = new FileReader();
				ready.readAsDataURL(file);
				const _this = this;
				ready.onload = function() {
					var fileResult = this.result;
					_this.canvasDataURL(fileResult, objDiv)
				}
			},
			canvasDataURL(path, callback) {
				var img = new Image();
				img.src = path;
				var objCompressed = {}
				img.onload = function() {
					let that = this;
					//默认压缩后图片规格
					let quality = 0.8;
					let w = that.width;
					let h = that.height;
					if (w > h) {
						let scale = h / w
						h = 1300;
						w = h / scale;
					} else {
						let scale = w / h
						w = 1300;
						h = w / scale;
					}
					//生成canvas
					var canvas = document.createElement('canvas');
					var ctx = canvas.getContext('2d');
					// 创建属性节点
					var anw = document.createAttribute("width");
					anw.nodeValue = w;
					var anh = document.createAttribute("height");
					anh.nodeValue = h;
					canvas.setAttributeNode(anw);
					canvas.setAttributeNode(anh);
					ctx.drawImage(that, 0, 0, w, h);

					var base64 = canvas.toDataURL('image/jpeg', quality);
					// 回调函数返回base64的值
					callback(base64);
				}
			},
			dataURLtoFile(dataurl, filename) {
				var arr = dataurl.split(","),
					mime = arr[0].match(/:(.*?);/)[1],
					bstr = atob(arr[1]),
					n = bstr.length,
					u8arr = new Uint8Array(n);
				while (n--) {
					u8arr[n] = bstr.charCodeAt(n);
				}
				return new File([u8arr], filename, {
					type: mime
				});
			}
		},
		computed: {

		},
		onLoad(options) {}
	};
</script>
<style lang="scss" scoped>
	@import '@/static/common/css/sass/mini-upload.scss';

	.icon-clear {
		width: 32rpx;
		height: 32rpx;
		display: inline-block;
		text-align: center;
		line-height: 28rpx;
		// padding: 5rpx;
		border-radius: 50%;
		color: white !important;
		background: red;
	}

	.uploadPage {
		background-color: #fff;
		padding: 32rpx;
		margin: 32rpx;
		height: 1120rpx;
		overflow-y: auto;

		.titleBox {
			display: flex;
			align-items: center;
			margin-bottom: 32rpx;

			.icon {
				width: 36rpx;
				height: 36rpx;
				background: url('../mini-upload/images/icon.png') no-repeat;
				background-size: 100% 100%;
			}

			.title {
				font-size: 32rpx;
				color: "#333333";
				font-family: 'PingFangSC-Medium';
				margin: 0 12rpx;
			}
		}

		.line {
			width: 100%;
			height: 2rpx;
			border-top: 2rpx solid #f5f5f5;
			margin-bottom: 40rpx;
		}

		.imgBox {
			width: 300rpx;
			height: 340rpx;
			box-sizing: border-box;
			border: 2rpx solid rgba(27, 122, 247, 0.2);
			background: rgba(27, 122, 247, 0.06);
			margin: 0 auto;
			display: flex;
			flex-direction: column;

			.icon {
				width: 62rpx;
				height: 62rpx;
				border-radius: 50%;
				background: url('./images/innerUpload.png') no-repeat;
				background-size: 100% 100%;
				margin: 0 auto;
				margin-top: 112rpx;
			}

			.text {
				font-size: 28rpx;
				color: #1b7af7;
				margin-top: 24rpx;
				text-align: center;
			}
		}

		.tips {
			margin-top: 24rpx;
			margin-bottom: 56rpx;
			text-align: center;
			font-family: 'PingFangSC-Regular';
			font-size: 26rpx;

			.tip {
				color: rgb(255, 159, 64);
			}
		}

		.showImg {
			width: 100%;
			display: flex;
			flex-wrap: wrap;
			padding: 40rpx 0;
			.imageBox {
				position: relative;

				.fstImg {
					width: 600rpx;
					height: 340rpx;
					object-fit: contain;
					position: relative;
				}

				.fstDelIcon {
					width: 26rpx;
					height: 26rpx;
					background: url('./images/del.png') no-repeat;
					background-size: 100% 100%;
					position: absolute;
					top: -8rpx;
					right: -8rpx;
				}

				.img {
					width: 182rpx;
					height: 200rpx;
					margin-right: 26rpx;
					margin-bottom: 12rpx;
					object-fit: contain;
					position: relative;
				}

				.delIcon {
					width: 26rpx;
					height: 26rpx;
					background: url('./images/del.png') no-repeat;
					background-size: 100% 100%;
					position: absolute;
					top: -8rpx;
					left: 164rpx;
				}
			}

			.addSmallImg {
				width: 182rpx;
				height: 200rpx;
				border: 2rpx dashed #1492FF;
				border-radius: 4rpx;
				box-sizing: border-box;

				.add {
					width: 50rpx;
					height: 50rpx;
					background: url('./images/add_s.png') no-repeat;
					background-size: 100% 100%;
					margin: 0 auto;
					margin-top: 50rpx;
					margin-bottom: 12rpx;
				}

				.tip {
					font-size: 26rpx;
					color: #1492FF;
					text-align: center;
				}
			}
		}
	}

	.showPopup {
		display: flex;
		justify-content: space-around;
		align-items: center;
		box-sizing: border-box;
		padding: 16rpx;

		.selectBox {
			display: flex;
			flex-direction: column;
			align-items: center;

			.icon {
				width: 80rpx;
				height: 70rpx;
				margin-bottom: 12rpx;
			}

			.photo {
				background: url('./images/photo.png') no-repeat;
				background-size: 100% 100%;
			}

			.image {
				background: url('./images/image.png') no-repeat;
				background-size: 100% 100%;
			}
		}
	}

	.uploadType {
		.typeItem {
			text-align: center;
			padding: 34rpx 0;
			border-bottom: 2rpx solid #dee
		}
	}

	.licenseShare {

		.fileSelect {
			width: 90%;
			margin: 0 auto;

			.head_title {
				height: 108rpx;
				background: #FFFFFF;
				border-radius: 8rpx 8rpx 0rpx 0rpx;
				display: flex;
				align-items: center;
				// padding: 36rpx 32rpx;
				font-weight: bold;

				.icon_bg {
					width: 8rpx;
					height: 36rpx;
					background: #1492FF;
					margin-right: 12rpx;
				}
			}

			.itemCon {
				font-size: 24rpx;
				color: #999999;
				padding-bottom: 20rpx;
				position: relative;

				.checkItem {

					/deep/.uni-image {
						margin: 0 auto;
					}
				}

				.checkItemBox {
					position: absolute;
					top: 0;
					right: 0;
				}

				.fileName {
					padding-top: 20rpx;
				}

				.uploadTime {
					padding-top: 20rpx;
				}
			}
		}

		.btnBox {
			margin: 20rpx 0;
		}
	}

	.dataShare {
		.form_item_wrap {
			width: 90%;
			margin: 0 auto;

			.formBox {
				display: flex;
				align-items: center;
				width: 100%;
				height: 104rpx;
				border-bottom: 1px solid #E6E6E6;

				.label {
					width: 200rpx;
					color: rgba($color: #000000, $alpha: 0.85);
					font-size: 28rpx;

					.required {
						color: red;
						margin-right: 10rpx;
					}
				}

				.input_wrap {
					width: calc(100% - 200rpx);
					height: 88rpx;
					border-radius: 8rpx;
					position: relative;
					box-sizing: border-box;
					display: flex;
					align-items: center;

					input,
					textarea {
						box-sizing: border-box;
						width: 100%;
						height: 100%;
						font-size: 28rpx;
						padding-left: 20rpx;
					}

					.disabled {
						background-color: #F5F7FA;
						cursor: not-allowed;
					}
				}

				/deep/.van-icon {
					position: absolute;
					right: 10px;
					top: 50%;
					transform: translateY(-50%);
				}
			}

			.formBox1 {
				display: flex;
				align-items: center;
				width: 100%;
				height: 104rpx;
				border-bottom: 1px solid #E6E6E6;

				.label {
					width: 200rpx;
					color: rgba($color: #000000, $alpha: 0.85);
					font-size: 28rpx;

					.required {
						color: red;
						margin-right: 10rpx;
					}
				}

				.input_wrap {
					width: calc(100% - 200rpx);
					height: 88rpx;
					border-radius: 8rpx;
					position: relative;
					box-sizing: border-box;
					display: flex;
					align-items: center;

					input,
					textarea {
						box-sizing: border-box;
						width: 100%;
						height: 100%;
						font-size: 28rpx;
						padding-left: 20rpx;
					}

					.disabled {
						background-color: #F5F7FA;
						cursor: not-allowed;
					}
				}
			}
		}
	}

	.pdfContent {
		height: 100%;
		width: 100%;
		position: relative;

		.closePdf {
			position: absolute;
			top: 0rpx;
			right: 0rpx;
			width: 20rpx;
			width: 50rpx;
			height: 50rpx;
		}
	}
</style>
