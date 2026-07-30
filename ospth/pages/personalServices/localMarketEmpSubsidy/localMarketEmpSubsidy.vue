<template>
	<view class="service-page" id="contrainer">
		<view class="service-box">
			<view class="form-page">
				<view class="uform" v-show="headerIndex == 0">
					<view class="title-line-blue">
						<view class="title">补贴人员信息</view>
					</view>
					<u-form ref="infoForm" :model="infoForm" :rules="rules" label-width="120px">
						<u-form-item label="公民身份证号码" prop="yac002" required>
							<u-input v-model="infoForm.yac002" disabled />
						</u-form-item>
						<u-form-item label="姓名" prop="aac003" required>
							<u-input v-model="infoForm.aac003" disabled />
						</u-form-item>
						<u-form-item label="性别" prop="aac004" required>
							<mini-picker disabled placeholder="请选择性别" selectPrompt="请选择性别" collection="SEX"
								v-model="infoForm.aac004" disabled></mini-picker>
						</u-form-item>
						<u-form-item label="民族" prop="aac005" required>
							<mini-picker disabled placeholder="请选择民族" selectPrompt="请选择民族" collection="AAC005"
								v-model="infoForm.aac005" disabled></mini-picker>
						</u-form-item>
						<u-form-item label="毕业院校" prop="yau002" required>
							<u-input v-model="infoForm.yau002" disabled />
						</u-form-item>
						<u-form-item label="专业名称" prop="aac184" required>
							<u-input v-model="infoForm.aac184" disabled />
						</u-form-item>
						<u-form-item label="毕业时间" prop="aac181" required>
							<u-input v-model="infoForm.aac181" :border="false" placeholder="请选择毕业日期"
								@click="aac181Show = true" :disabled="isDisabled" />
							<u-calendar max-date="2099-12-31" v-model="aac181Show" mode="date"
								@change="dateConfirmAac181"></u-calendar>
						</u-form-item>
						<u-form-item label="高考时户籍所在县" prop="gkhj" required label-width="140px">
							<mini-picker :range="areaOptions" v-model="infoForm.gkhj" :disabled="isDisabled" />
						</u-form-item>
						<!-- 就业信息 -->
						<view class="title-line-blue" style="display: flex;align-items: center;">
							<view class="title">就业信息</view>
							<!-- 新增就业信息按钮 -->
							<van-button type="primary" size="small" :disabled="isDisabled" @click="openAddPage">
								新增
							</van-button>
						</view>
						<view class="common-section">
							<view class="common-card" v-for="(record, index) in tableData" :key="index">
								<view class="common-content">
									<view class="common-item">
										<span class="common-label">就职单位：</span>
										<span class="common-value">{{ record.jzdw }}</span>
									</view>
									<view class="common-item">
										<span class="common-label">职位：</span>
										<span class="common-value">{{ record.zhiwu }}</span>
									</view>
									<view class="common-item">
										<span class="common-label">就业地：</span>
										<span class="common-value">{{ record.jyd }}</span>
									</view>
									<view class="common-item">
										<span class="common-label">劳动合同签订时间：</span>
										<span class="common-value">{{ record.htqdsj }}</span>
									</view>
									<view class="common-item">
										<span class="common-label">劳动合同期限：</span>
										<span class="common-value">{{ record.htqx }}</span>
									</view>
									<view class="common-item">
										<span class="common-label">社保缴纳开始时间：</span>
										<span class="common-value">{{ record.sbs }}</span>
									</view>
									<view class="common-item">
										<span class="common-label">社保缴纳结束时间：</span>
										<span class="common-value">{{ record.sbe }}</span>
									</view>
								</view>
								<view class="common-actions">
									<van-button class="btnStyle" type="info"
										@click="handleDelete(record)">删除</van-button>
									<van-button class="btnStyle" type="info"
										@click="openEditPage(index)">编辑</van-button>
								</view>
							</view>
							<div class="employment-record-empty" v-if="tableData.length === 0">
								暂无申请记录
							</div>
							<uni-pagination :total="tableData.length" pageSize="5" />

						</view>
						<!-- 银行账户信息 -->
						<view class="title-line-blue">
							<view class="title">银行账户信息</view>
						</view>
						<u-form-item label="开户银行" prop="yhk032" required>
							<u-input v-model="infoForm.yhk032" :border="false" placeholder="请选择开户银行"
								@click="visibleBank = true" :disabled="isDisabled" />
						</u-form-item>
						<u-form-item label="银行类别" prop="yhk031" required>
							<mini-picker disabled placeholder="请选择银行类别" selectPrompt="请选择银行类别" collection="BANKID"
								v-model="infoForm.yhk031" disabled></mini-picker>
						</u-form-item>

						<u-form-item label="银行联行号" prop="yhk033" required>
							<u-input v-model="infoForm.yhk033" disabled />
						</u-form-item>
						<u-form-item label="银行卡号" prop="yhkh" required>
							<u-input v-model="infoForm.yhkh" disabled />
						</u-form-item>
						<u-form-item label="银行账户名称" prop="yhzh" required>
							<u-input v-model="infoForm.yhzh" disabled />
						</u-form-item>

					</u-form>
					<view class="title-line-blue">
						<view class="title">材料上传</view>
					</view>
					<service-upload ref="materialUploadTable" :yda031="yda031Value" :yda020="showUploadFile" />
					<view class="btn-box">
						<!-- <u-button @click="--headerIndex" style="width: 45%;">上一步</u-button> -->
						<u-button type="primary" @click="confirmSave" :disabled="isDisabled"
							style="width: 45%;">申请</u-button>
					</view>
				</view>
				<service-complete v-show="headerIndex == 1" />
			</view>
		</view>
		<view v-show="!showAreaModal">
			<mini-address class="mask" required label="期望工作地点" @addressBack="expectWorkPlaceChange"
				@clickMaskClose="clickMaskClose" ref="addressRef"></mini-address>
		</view>
		<!-- 地址选择器弹窗-西藏 -->
		<aae017-select-tree ref="aae017SelectTree" :data="aae017Data" :showSearch="true" placeholder="请选择审核人社机构"
			:disabled="isDisabled" @change="handleAae017Change" />
		<!-- 树状选择器-所属行业 -->
		<tki-tree ref="tkitree" :range="treeData" rangeKey="title" confirmColor="#4e8af7" @confirm="confirmFn"
			:disabled="isDisabled" />
		<bankCard ref="bankCardRef" :allow-add="true" :params="paramsBankCard" :visible="visibleBank"
			:disabled="isDisabled" @onClose="closeBank" />
		<!-- 新增就业信息弹窗 -->
		<u-popup v-model="visibleAdd" mode="bottom" round height="65%">
			<view class="popup-content">
				<view class="popup-header">
					<text class="popup-title">{{ isEditMode ? '编辑就业信息' : '新增就业信息' }}</text>
					<text class="popup-close" @click="handleCloseModal">×</text>
				</view>
				<view class="popup-body">
					<u-form ref="addForm" :model="formData" label-width="140px">
						<u-form-item label="就业地" required>
							<u-input v-model="formData.jyd_desc" :border="false" placeholder="点击选择就业地"
								@click="openAreaSelector('formData','jyd')" />
						</u-form-item>
						<u-form-item label="就职单位" required>
							<u-input v-model="formData.jzdw" placeholder="请输入就职单位" />
						</u-form-item>
						<u-form-item label="职务" required>
							<u-input v-model="formData.zhiwu" placeholder="请输入职务" />
						</u-form-item>
						<u-form-item label="劳动合同签订时间" required>
							<u-input v-model="formData.htqdsj" @click="htqdsjShow = true" placeholder="请选择时间" />
							<u-calendar max-date="2099-12-31" v-model="htqdsjShow" mode="date"
								@change="dateConfirmHtqdsj"></u-calendar>
						</u-form-item>
						<u-form-item label="劳动合同期限" required>
							<u-input v-model="formData.htqx" @click="htqxShow = true" placeholder="请选择时间" />
							<u-calendar max-date="2099-12-31" v-model="htqxShow" mode="date"
								@change="dateConfirmHtqx"></u-calendar>
						</u-form-item>
						<u-form-item label="社保缴纳开始时间" required>
							<u-input v-model="formData.sbs" @click="sbsShow = true" placeholder="请选择时间" />
							<u-calendar max-date="2099-12-31" v-model="sbsShow" mode="date"
								@change="dateConfirmSbs"></u-calendar>
						</u-form-item>
						<u-form-item label="社保缴纳结束时间" required>
							<u-input v-model="formData.sbe" @click="sbeShow = true" placeholder="请选择时间" />
							<u-calendar max-date="2099-12-31" v-model="sbeShow" mode="date"
								@change="dateConfirmSbe"></u-calendar>
						</u-form-item>
					</u-form>
				</view>
				<view class="popup-footer">
					<u-button type="default" @click="handleCloseModal" style="margin-right: 10px;">关闭</u-button>
					<u-button type="primary" @click="handleAddSubmit">{{ isEditMode ? '保存' : '新增' }}</u-button>
				</view>
			</view>
		</u-popup>
	</view>


</template>

<script>
	import moment from 'moment'
	import aae017SelectTree from '@/components/aae017SelectTree/aae017SelectTree.vue'
	import tkiTree from "@/components/tki-tree/tki-tree.vue"
	import uniPagination from "@/uni_modules/uni-pagination/components/uni-pagination/uni-pagination.vue"
	export default {
		name: 'UnemploymentRegistrationAdd',
		components: {
			aae017SelectTree,
			tkiTree,
			uniPagination,
		},
		data() {
			return {
				aac181Show: false,
				htqdsjShow: false,
				sbsShow: false,
				htqxShow: false,
				sbeShow: false,
				headerIndex: 0,
				isDisabled: false,
				currentAreaField: 'ycc299',
				showAreaModal: true,
				userInfo: {},
				paramsBankCard: {},
				visibleBank: false,
				areaOptions: [],
				// 新增就业信息相关字段
				visibleAdd: false, // 新增就业信息弹窗可见状态
				isEditMode: false, // 是否处于编辑模式
				currentEditIndex: -1, // 当前编辑的行索引
				addForm: {}, // 新增就业信息表单实例
				formData: { // 新增就业信息表单数据
					jyd: '', // 就业地
					jyd_code: '',
					jzdw: '', // 就职单位
					zhiwu: '', // 职务
					htqdsj: '', // 劳动合同签订时间
					htqx: '', // 劳动合同期限
					sbs: '', // 社保缴纳开始时间
					sbe: '', // 社保缴纳结束时间
				},
				// 表单数据
				infoForm: {
					yac002: '', // 公民身份证号码
					aac003: '', // 姓名
					aac004: '', // 性别
					aac005: '', // 民族
					yau002: '', // 毕业院校
					aac184: '', // 专业名称
					aac181: '', // 毕业时间
					gkhj: '', // 高考时户籍所在县
					yhk031: '', // 银行类别
					yhk032: '', // 开户银行
					yhk033: '', // 银行联行号
					yhkh: '', // 银行卡号
					yhzh: '', // 银行账户名称
					gkhj_code: '' // 高考时户籍所在县代码
				},
				rules: {
					yac002: [{
							required: true,
							message: '请输入公民身份证号码',
							trigger: 'blur'
						},
						{
							pattern: /^\d{17}[\dXx]$/,
							message: '请输入正确的身份证号',
							trigger: 'blur'
						}
					],
					aac003: [{
						required: true,
						message: '请输入姓名',
						trigger: 'blur'
					}],
					aac004: [{
						required: true,
						message: '请选择性别',
						trigger: 'change'
					}],
					aac005: [{
						required: true,
						message: '请选择民族',
						trigger: 'change'
					}],
					yau002: [{
						required: true,
						message: '请输入毕业院校',
						trigger: 'blur'
					}],
					aac184: [{
						required: true,
						message: '请输入专业名称',
						trigger: 'blur'
					}],
					aac181: [{
						required: true,
						message: '请选择毕业时间',
						trigger: 'change'
					}],
					gkhj: [{
						required: true,
						message: '请选择高考时户籍所在县',
						trigger: 'change'
					}],
					yhk031: [{
						required: true,
						message: '请选择银行类别',
						trigger: 'blur'
					}],
					yhk032: [{
						required: true,
						message: '请输入开户银行',
						trigger: 'blur'
					}],
					yhk033: [{
						required: true,
						message: '请输入银行联行号',
						trigger: 'blur'
					}],
					yhkh: [{
						required: true,
						message: '请输入银行卡号',
						trigger: 'blur'
					}],
					yhzh: [{
						required: true,
						message: '请输入银行账户名称',
						trigger: 'blur'
					}]
				},

				// 通用
				aae017Data: [],
				aae017Value: '',
				treeData: [],
				paramsBankCard: {},
				visibleBank: false,
				showUploadFile: '493',
				yda031Value: '',
				tableData: [],
				yhk031CollectionDataValue: '',

			}
		},
		watch: {
			// 监听yda031Value的变化，当值改变时更新材料组件
			yda031Value(newValue) {
				this.$nextTick(() => {
					if (this.$refs.materialUploadTable) {
						// 移除对newValue的判断，确保即使值为空也能更新组件
						this.$refs.materialUploadTable.yda031 = newValue || '';
						// 调用材料组件的getMaterailList方法重新加载数据
						if (this.$refs.materialUploadTable.getMaterailList) {
							this.$refs.materialUploadTable.getMaterailList();
						}
					}
				});
			},
			headerIndex: {
				handler: function(newVal, oldVal) {
					console.log('newVal, oldVal: ', newVal, oldVal);
					this.$nextTick(() => {
						this.setHeight()
					})
				}
			}
		},
		mounted() {
			// 获取用户信息
			try {
				const info = this.$base.getUser(true, true)
				if (info && info.naturalBo) {
					this.userInfo = info.naturalBo
					this.userInfo.userType = 'UT01'
					this.paramsBankCard = this.userInfo
					console.log('11111111111: ', 11111111111);
					this.init()
					this.queryPageList()
					// 加载高考户籍地选项数据
					this.queryAreaData()
				} else {
					this.$message.error('获取用户信息失败，请重新登录')
				}
			} catch (error) {
				console.error('获取用户信息异常:', error)
				this.$message.error('系统异常，请稍后重试')
			}
			setTimeout(() => {
				this.setHeight()
			}, 500)
		},
		onLoad(options) {
			console.log('接收到的options:', options) // 调试用
		},
		onReady() {
			console.log('页面初次渲染完成 - onReady')
			this.$nextTick(() => {
				this.setHeight()
				this.init()
				this.$refs.infoForm.setRules(this.rules);
			})
		},
		onShow() {
			this.$nextTick(() => {
				this.setHeight()
			})
		},

		methods: {
			// 关闭银行选择器
			closeBank(data) {
				console.log('data: ', data);
				this.visibleBank = false
				let allData = []
				this.$dict.getDictList("BANKID", res => {
					allData = res
					console.log('银行列表数据: ', res);
					if (data !== null) {
						const selectedItem = allData.find(item => item.value == data.aaf200)
						this.yhk031CollectionDataValue = data.aaf200

						console.log('selectedItem: ', selectedItem);
						let values = {
							'yhk031': selectedItem.value, //银行类别
							'yhk032': data.aae044, //开户银行
							'yhk033': data.aae008, //银行联行号
							'yhkh': data.aae010, //银行卡号
							'yhzh': data.aae009, //银行账户名称
						}
						console.log('values: ', values);
						this.infoForm = {
							...this.infoForm,
							...values
						}
					}
				})

			},

			// 编辑就业信息
			handleEdit(row) {
				// 查找当前行在表格数据中的索引
				const index = this.tableData.findIndex(item =>
					item.jyd === row.jyd &&
					item.jzdw === row.jzdw &&
					item.htqdsj === row.htqdsj
				);
				console.log('index: ', index);
				if (index !== -1) {
					// 设置编辑模式
					this.isEditMode = true;
					this.currentEditIndex = index;

					// 先打开弹窗，确保DOM已经渲染
					this.visibleAdd = true;

					// 使用$nextTick确保表单组件已经渲染完成后再设置数据
					this.$nextTick(() => {
						// 填充表单数据
						this.formData = {
							jyd: row.jyd || '',
							jyd_desc: row.jyd || '',
							jzdw: row.jzdw || '',
							zhiwu: row.zhiwu || '',
							htqdsj: row.htqdsj || '',
							htqx: row.htqx || '',
							sbs: row.sbs || '',
							sbe: row.sbe || ''
						};
						console.log('this.formData : ', this.formData);
						// 如果表单实例存在，手动设置表单值
						if (this.addForm && this.addForm.setFieldsValue) {
							this.addForm.setFieldsValue(this.formData);
						}
					});
				}
			},
			// 删除就业信息
			handleDelete(row) {
				uni.showModal({
					title: '确认删除',
					content: '确定要删除这条就业信息吗？',
					success: (res) => {
						if (res.confirm) {
							// 查找当前行在表格数据中的索引
							const index = this.tableData.findIndex(item =>
								item.jyd === row.jyd &&
								item.jzdw === row.jzdw &&
								item.htqdsj === row.htqdsj
							);

							if (index !== -1) {
								// 从表格数据中删除
								this.tableData.splice(index, 1);
								// 显示成功提示
								this.$message.success('删除成功');
								this.$forceUpdate()
							}
						} else if (res.cancel) {
							console.log('用户点击取消');
						}
					}
				});
			},
			dateConfirmAac181(e) {
				this.infoForm.aac181 = e.result;
				this.aac181Show = false
				this.$forceUpdate()
			},

			dateConfirmYcc024(e) {
				this.infoForm.ycc024 = e.result;
				this.ycc024Show = false
				this.fnCheckTime(e.result)
				this.$forceUpdate()
			},
			query() {
				const param = {
					no: '602-0003',
					data: JSON.stringify({
						yac002: this.userInfo.certNo,
					}),
				}
				this.$base.post('', param, (res) => {
					if (res.serviceSuccess && res.data.code === '0') {
						this.$message.error(res.data.msg || '查询失败');
						this.isDisabled = res.data.sq === 'disabled' ? true : false
					}
					if (res.serviceSuccess && res.data.code === '1') {
						const info = res.data.data
						// 将日期字符串转换为日期格式
						if (info.aac181) {
							const date = new Date(info.aac181);
							// 格式化为YYYY-MM-DD格式
							const formattedDate =
								`${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
							info.aac181 = formattedDate
						}
						console.log('info.aac181: ', info.aac181);
						this.infoForm = {
							...this.infoForm,
							...info
						}
					}

				})
			},
			init() {
				// 组件挂载后，检查是否有初始的就业困难人员类别值，如果有则更新材料列表
				setTimeout(() => {
					// 初始化就业地数据
					this.initAae017Data();
					this.query()
					// this.showUploadFile = ''
				}, 100);
			},
			//高考户籍地
			queryAreaData() {
				const param = {
					no: '602-0002',
					data: JSON.stringify({
						yac002: this.userInfo.certNo,
					}),
				}
				this.$base.post('', param, (res) => {
					if (res.serviceSuccess && res.data.code === '1') {
						const areaData = res.data.list || []
						// 将区域数据格式化为选择器需要的格式 (value 和 label)
						this.areaOptions = areaData.map(item => ({
							value: item.id, // 使用id作为value
							label: item.name // 使用name作为显示文本
						}))
					}
				})
			},
			//查询并校验区内市场稳定就业奖励申请
			queryPageList() {
				const param = {
					no: '602-0001',
					data: JSON.stringify({
						loginId: this.userInfo.certNo,
					}),
				}
				this.$base.post('', param, (res) => {
					if (res.serviceSuccess) {
						// 统一设置只读/新增模式
						const isDisabledType = res.data.applied;
						this.isDisabled = isDisabledType === 'true' ? true : false;
						// 无论code是'1'还是'0'，只要有数据就设置表单和材料参数
						if (res.data.data) {
							const arr = res.data.data;
							this.infoForm = {
								...this.infoForm,
								...arr
							}
							this.tableData = arr.jobs;
							this.yda031Value = arr.serial;
							if (res.data.msg) {
								this.$message.error(res.data.msg)
							}
							// 立即尝试更新材料组件，不依赖watch
							this.$nextTick(() => {
								if (this.$refs.materialUploadTable) {
									this.$refs.materialUploadTable.yda031 = arr.serial || '';
									// 调用材料组件的getMaterailList方法重新加载数据
									if (this.$refs.materialUploadTable.getMaterailList) {
										this.$refs.materialUploadTable.getMaterailList();
									}
								}
							});
						}
						// 只有在code为'1'时调用init方法
						if (res.data.code === '1') {
							this.init();
						}
					}
				})
			},


			//失业时间
			fnCheckTime(dateString) {
				// 使用传入的dateString直接进行日期比较
				let endTime = this.infoForm.aae043
				// 使用moment库进行日期比较
				if (moment(dateString).isAfter(moment(endTime))) {
					this.$message.error('失业日期不能大于失业登记日期')
					this.infoForm.ycc024 = ''
					return
				}
			},

			// 选择文化程度时的校验
			fnselect() {
				let value = this.infoForm.aac011;
				console.log('value: ', value);
				if (value == '11' || value == '14' || value == '20' || value == '30' || value == '40' || value ==
					'41') {
					// 设置为必填
					this.showRequiredFields = true;
					console.log('11: ', 11);
				} else {
					// 设置为非必填
					this.showRequiredFields = false;
					console.log('22: ', 22);
				}
				let changeRueList = ['ycc03q', 'yau002', 'yac01f', 'yac01g'];
				changeRueList.forEach(v => {
					this.rules[v][0].required = this.showRequiredFields
				})
				// 重新设置必填项
				this.$nextTick(() => {
					this.$refs.infoForm.setRules(this.rules);
				});
				this.fnSelects();
			},
			//失业原因
			fnSelects() {
				let value = this.infoForm.ycc028;
				console.log(value, '失业原因');
				if (value == '24' || value == '21' || value == '23' || value == '22' || value == '31') {
					this.infoForm.ycc027 = "10"
				} else if (value == '60' || value == '70' || value == '52' || value == '51' || value == '33' ||
					value ==
					'40' ||
					value == '32' || value == '90') {
					this.infoForm.ycc027 = "30"
				} else if (value == '10') {
					this.infoForm.ycc027 = "20"
				}
				if (value == '90') {
					this.ycc02mShow = true
					this.rules.ycc02m[0].required = true
				} else {
					this.ycc02mShow = false
					this.rules.ycc02m[0].required = false
				}

				// 重新设置必填项
				this.$nextTick(() => {
					this.$refs.infoForm.setRules(this.rules);
				});
			},
			handleConfirm() {
				// 显示确认弹窗
				// uni.showModal({
				// 	title: '提示',
				// 	content: '本人承诺填报的以上内容均真实、准确、有效，如有实际情况不一致，本人愿意承担相应责任，同时纳入人社信用记录。',
				// 	showCancel: true,
				// 	success: (res) => {
				// 		if (res.confirm) {
				// 			this.headerIndex++
				// 		}
				// 	}
				// })
				// 先进行表单验证
				this.$refs.infoForm.validate((valid) => {
					console.log('valid: ', valid);
					if (!valid) {
						return
					}

					// 获取表单数据
					const formData = this.infoForm

					// 获取当前日期作为经办日期
					const currentDate = moment()

					// 失业登记日期不能晚于经办日期
					if (formData.aae043) {
						const registerDate = moment(formData.aae043)
						// 添加isValid检查确保日期格式正确
						if (!registerDate.isValid()) {
							this.$message.error('失业登记日期格式不正确')
							return
						}
						if (registerDate.isAfter(currentDate, 'day')) {
							this.$message.error('失业登记日期不能晚于经办日期')
							return
						}
					}
					uni.showModal({
						title: '提示',
						content: '本人承诺填报的以上内容均真实、准确、有效，如有实际情况不一致，本人愿意承担相应责任，同时纳入人社信用记录。',
						showCancel: true,
						success: (res) => {
							if (res.confirm) {
								this.headerIndex++
							}
						}
					})
				})
			},
			// 确认保存
			confirmSave() {

				// 申请按钮点击事件
				this.$refs.infoForm.validate((errors, values) => {
					console.log('11: ', 11);
					if (!errors) {
						return
					}
					// 获取表单数据
					const formData = this.infoForm
					formData.aac181 = moment(formData.aac181).format('YYYYMMDD')
					formData.yhk031 = this.yhk031CollectionDataValue
					formData.aae017 = formData.gkhj
					if (!formData) {
						this.$message.error('表单数据获取失败')
						return
					}
					if (!this.tableData || this.tableData.length === 0) {
						this.$message.error('请添加就业信息')
						return
					}
					// 安全地获取上传的文件列表
					let fileList = []
					if (this.$refs.materialUploadTable && this.$refs.materialUploadTable.check) {
						fileList = this.$refs.materialUploadTable.check() || []
					}
					console.log('fileList: ', fileList);
					// 安全地检查文件列表
					if (fileList.length === 0) {
						this.$message.error('请上传必要的材料');
						return;
					}
					const param = {
						no: '602-0004',
						data: JSON.stringify({
							...formData,
							ext: JSON.stringify({
								attachments: fileList,
								jobs: this.tableData
							}),
						})
					}
					this.$base.post('', param, (res) => {
						if (res.serviceSuccess && res.data.code === '1') {
							this.$message.success(res.data.msg || '保存成功')
							// setTimeout(() => {
							// 	this.queryPageList()
							// })
							this.isDisabled =true
						} else {
							console.log('111: ', 111);
							this.$message.error(res.data.msg || '保存失败')
						}
					}, (error) => {
						// 添加失败回调，处理网络错误等情况
						console.error('接口调用失败:', error)
						this.$message.error(error.message || '网络异常，请稍后重试')
					})

				});
			},




			// 通用函数
			// 初始化就业地数据
			async initAae017Data() {
				const selectTree = this.$refs.aae017SelectTree;
				if (selectTree && selectTree.queryAae017Data) {
					try {
						// 调用组件内置的查询方法，传入证件号码
						this.aae017Data = await selectTree.queryAae017Data(this.userInfo.certNo);
					} catch (error) {
						console.error('初始化就业地数据失败:', error);
						this.$message.error('获取就业地数据失败，请重试');
					}
				}
			},
			setHeight() {
				const query = uni.createSelectorQuery().in(this)
				query.select('#contrainer').boundingClientRect(data => {
					if (data) {
						this.componentHeight = data.height
						terminalUtil._setIframeHeight(data.height)
					}
				}).exec()
			},
			clickMaskClose(e) {
				this.showAreaModal = true
				console.log('this.showAreaModal: ', this.showAreaModal);
				this.visibleAdd = true
			},
			// 设置期望工作地点
			expectWorkPlaceChange(lastObj) {
				this.showAreaModal = true
				this.visibleAdd = true
				this[this.formName][this.fieldName] = lastObj.areaid
				this[this.formName][this.fieldName + '_desc'] = lastObj.areaname
				this.$forceUpdate()
			},
			handleAae017Change(selected) {
				if (selected && selected.value && selected.label) {
					this[this.formName][this.areaField] = selected.label; //label
					this[this.formName][this.areaField.slice(0, -5)] = selected.value; //value--去除_desc
					this.$forceUpdate()
				}
			},
			openArea(formName = 'infoForm', fieldName = 'ycc299') {
				this.formName = formName;
				this.areaField = fieldName;
				this.$refs.aae017SelectTree.handleShowPopup()
			},
			openAreaSelector(formName = 'infoForm', fieldName = 'ycc299') {
				this.showAreaModal = false;
				this.visibleAdd = false
				console.log('this.showAreaModal: ', this.showAreaModal);
				this.$nextTick(() => {
					this.fieldName = fieldName;
					this.formName = formName;
					console.log('this.$refs.addressRef: ', this.$refs.addressRef.handleShow);
					this.$refs.addressRef.handleShow()
				})
			},
			fromChange(e, formName, name, callback) {
				console.log('e, formName, name, : ', e, formName, name, );
				this[formName][name] = e.value
				this[formName][name + "_desc"] = e.name || e.label
				if (callback && typeof callback === 'function') {
					callback(e.value)
				}
			},
			workStartDateChange(e, formName, name) {
				this[formName][name] = e.detail.value
				this.$forceUpdate()
			},
			// 打开新增就业信息弹窗
			openAddPage() {
				this.isEditMode = false;
				this.currentEditIndex = -1;
				this.formData = {
					jyd: '',
					jzdw: '',
					zhiwu: '',
					htqdsj: '',
					htqx: '',
					sbs: '',
					sbe: ''
				};
				this.visibleAdd = true;
				console.log('this.visibleAdd: ', this.visibleAdd);
			},
			// 处理编辑模式的打开
			openEditPage(index) {
				this.isEditMode = true;
				this.currentEditIndex = index;
				const item = this.tableData[index];
				this.formData = {
					jyd: item.jyd || '',
					jyd_desc: item.jyd || '',
					jzdw: item.jzdw || '',
					zhiwu: item.zhiwu || '',
					htqdsj: item.htqdsj || '',
					htqx: item.htqx || '',
					sbs: item.sbs || '',
					sbe: item.sbe || ''
				};
				this.visibleAdd = true;
			},
			// 关闭弹窗
			handleCloseModal() {
				this.visibleAdd = false;
				this.showAreaModal = false;
				this.htqdsjShow = false;
				this.htqxShow = false;
				this.sbsShow = false;
				this.sbeShow = false;
			},
			// 处理区域选择确认
			handleAreaConfirm(e) {
				this.formData.jyd = e.fullName;
				this.showAreaModal = false;
			},
			// 处理日期选择 - 劳动合同签订时间
			dateConfirmHtqdsj(e) {
				this.formData.htqdsj = e.result;
				this.htqdsjShow = false;
			},
			// 处理日期选择 - 劳动合同期限
			dateConfirmHtqx(e) {
				this.formData.htqx = e.result;
				this.htqxShow = false;
			},
			// 处理日期选择 - 社保缴纳开始时间
			dateConfirmSbs(e) {
				this.formData.sbs = e.result;
				this.sbsShow = false;
			},
			// 处理日期选择 - 社保缴纳结束时间
			dateConfirmSbe(e) {
				this.formData.sbe = e.result;
				this.sbeShow = false;
			},
			// 处理新增/编辑提交
			handleAddSubmit() {

				// 表单验证
				if (!this.formData.jyd) {
					uni.showToast({
						title: '请选择就业地',
						icon: 'none'
					});
					return;
				}
				if (!this.formData.jzdw) {
					uni.showToast({
						title: '请输入就职单位',
						icon: 'none'
					});
					return;
				}
				if (!this.formData.zhiwu) {
					uni.showToast({
						title: '请输入职务',
						icon: 'none'
					});
					return;
				}
				if (!this.formData.htqdsj) {
					uni.showToast({
						title: '请选择劳动合同签订时间',
						icon: 'none'
					});
					return;
				}
				if (!this.formData.htqx) {
					uni.showToast({
						title: '请选择劳动合同期限',
						icon: 'none'
					});
					return;
				}
				if (!this.formData.sbs) {
					uni.showToast({
						title: '请选择社保缴纳开始时间',
						icon: 'none'
					});
					return;
				}
				if (!this.formData.sbe) {
					uni.showToast({
						title: '请选择社保缴纳结束时间',
						icon: 'none'
					});
					return;
				}
				console.log('this.formData: ', this.formData);
				// 检查日期逻辑
				if (this.formData.htqx && this.formData.htqdsj && moment(this.formData.htqx).isBefore(moment(this
						.formData
						.htqdsj))) {
					uni.showToast({
						title: '劳动合同期限不能早于签订时间',
						icon: 'none'
					});
					return;
				}

				if (this.formData.sbe && this.formData.sbs && moment(this.formData.sbe).isBefore(moment(this
						.formData
						.sbs))) {
					console.log('1111: ', 1111);
					uni.showToast({
						title: '社保缴纳结束时间不能早于开始时间',
						icon: 'none'
					});
					return;
				}

				// 处理数据提交
				if (this.isEditMode && this.currentEditIndex !== -1) {
					// 编辑模式 - 更新现有数据
					this.tableData.splice(this.currentEditIndex, 1, {
						...this.formData,
						jyd: this.formData.jyd_desc,
					});
					uni.showToast({
						title: '保存成功',
						icon: 'success'
					});
				} else {
					// 新增模式 - 添加新数据
					this.tableData.push({
						...this.formData
					});
					uni.showToast({
						title: '新增成功',
						icon: 'success'
					});
				}

				// 关闭弹窗
				this.handleCloseModal();
			},
		}

	};
</script>

<style lang="scss" scoped>
	@import url("@/static/css/sass/record.scss");
	@import url("../../../static/css/sass/form.scss");

	// 新增就业信息弹窗样式
	.popup-content {
		padding: 20px;
	}

	.popup-header {
		padding-bottom: 15px;
		border-bottom: 1px solid #f0f0f0;
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 20px;
	}

	.popup-title {
		font-size: 18px;
		font-weight: 600;
		color: #333;
	}

	.popup-close {
		font-size: 24px;
		color: #999;
		cursor: pointer;
	}

	.popup-body {
		margin-bottom: 20px;
	}

	.popup-footer {
		text-align: center;
		display: flex;
		justify-content: center;
		align-items: center;
		margin-top: 20px;
	}

	// .mask {
	// 	/deep/.mini-popup-mask {
	// 		z-index: 999998;
	// 	}

	// 	/deep/.mini-popup-content {
	// 		z-index: 999999;
	// 	}
	// }
</style>