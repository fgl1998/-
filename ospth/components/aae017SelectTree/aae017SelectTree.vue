<template>
	<view class="select-tree-wrapper">
		<mini-popup :isShowPopup="isShowPopup&& !disabled" :maskCloseable="true" @clickMask="clickMask">
			<view class="popup-content-wrapper">
				<view class="toolbar">
					<view class="cancel-btn" @click.stop="handleCancel">取消</view>
					<view class="title">选择地区</view>
					<view class="confirm-btn" @click.stop="handleConfirm">确定</view>
				</view>
				<scroll-view class="tree-scroll-view" scroll-y="true">
					<ul class="select-tree-list">
						<li v-for="item in data" :key="item.value" class="tree-node">
							<view class="node-content" :class="{ 'selected': tempSelectedValue === item.value }"
								@click.stop="handleNodeClick(item)">
								<i class="expand-icon" v-if="item.children && item.children.length > 0"
									:class="{ expanded: expandedKeys.includes(item.value) }"
									@click.stop="toggleExpand(item.value)"></i>
								<span class="node-label">{{ item.label }}</span>
								<i class="check-icon" v-if="tempSelectedValue === item.value"></i>
							</view>

							<template
								v-if="item.children && item.children.length > 0 && expandedKeys.includes(item.value)">
								<ul class="tree-children">
									<li v-for="child in item.children" :key="child.value" class="tree-node">
										<view class="node-content"
											:class="{ 'selected': tempSelectedValue === child.value }"
											@click.stop="handleNodeClick(child)">
											<i class="expand-icon" v-if="child.children && child.children.length > 0"
												:class="{ expanded: expandedKeys.includes(child.value) }"
												@click.stop="toggleExpand(child.value)"></i>
											<span class="node-label">{{ child.label }}</span>
											<i class="check-icon" v-if="tempSelectedValue === child.value"></i>
										</view>

										<template
											v-if="child.children && child.children.length > 0 && expandedKeys.includes(child.value)">
											<ul class="tree-children">
												<li v-for="third in child.children" :key="third.value"
													class="tree-node">
													<view class="node-content"
														:class="{ 'selected': tempSelectedValue === third.value }"
														@click.stop="handleNodeClick(third)">
														<i class="expand-icon"
															v-if="third.children && third.children.length > 0"
															:class="{ expanded: expandedKeys.includes(third.value) }"
															@click.stop="toggleExpand(third.value)"></i>
														<span class="node-label">{{ third.label }}</span>
														<i class="check-icon"
															v-if="tempSelectedValue === third.value"></i>
													</view>

													<template
														v-if="third.children && third.children.length > 0 && expandedKeys.includes(third.value)">
														<ul class="tree-children">
															<li v-for="fourth in third.children" :key="fourth.value"
																class="tree-node">
																<view class="node-content"
																	:class="{ 'selected': tempSelectedValue === fourth.value }"
																	@click.stop="handleNodeClick(fourth)">
																	<span class="node-label">{{ fourth.label }}</span>
																	<i class="check-icon"
																		v-if="tempSelectedValue === fourth.value"></i>
																</view>
															</li>
														</ul>
													</template>
												</li>
											</ul>
										</template>
									</li>
								</ul>
							</template>
						</li>
					</ul>
				</scroll-view>
			</view>
		</mini-popup>
	</view>
</template>

<script>
	import miniPopup from '../mini-popup/mini-popup.vue'

	export default {
		name: 'aae017SelectTree',
		components: {
			miniPopup
		},
		props: {
			// 数据源
			data: {
				type: Array,
				default: () => [],
			},
			// 默认选中值
			value: {
				type: [String, Object],
				default: '',
			},
			// 是否禁用
			disabled: {
				type: Boolean,
				default: false,
			},
			// 占位符
			placeholder: {
				type: String,
				default: '',
			},
		},
		data() {
			return {
				isShowPopup: false,
				expandedKeys: [], // 展开的节点键
				selectedValue: this.value,
				tempSelectedValue: this.value,
				selectedLabel: '',
				selectedLabelDisplay: '',
				tempSelectedLabel: ''
			}
		},
		watch: {
			// 监听外部value变化
			value: {
				handler(newVal) {
					this.selectedValue = newVal
					this.tempSelectedValue = newVal
					this.updateSelectedLabel()
				},
				immediate: true,
			},
			// 监听外部data变化，data=[]时，无法更新label
			data: {
				handler(newVal) {
					this.updateSelectedLabel()
				},
				immediate: true,
			},
			// 监听选中标签变化，同步到显示值
			selectedLabel: {
				handler(newVal) {
					this.selectedLabelDisplay = newVal
				},
			},
		},
		mounted() {
			this.updateSelectedLabel()
		},
		methods: {
			// 查询aae017数据 - 发起API请求并转换为树形结构
			async queryAae017Data(certNo) {
				// 如果传入的是数据数组，直接进行转换（兼容旧的调用方式）
				if (Array.isArray(certNo)) {
					return this.convertToListTreeData(certNo)
				}

				// 发起API请求获取数据
				const param = {
					no: '000-0018',
					data: JSON.stringify({
						yac002: certNo,
					}),
				}

				try {
					const res = await this.sendRequest(param)
					if (res && res.serviceSuccess && res.data.code === '1' && res.data.listtree) {
						// 转换数据为树形结构
						return this.convertToListTreeData(res.data.listtree)
					}
					return []
				} catch (error) {
					console.error('查询aae017数据失败:', error)
					return []
				}
			},

			// 发送请求的工具方法
			sendRequest(param) {
				return new Promise((resolve, reject) => {
					if (this.$base.post) {
						this.$base.post(
							'',
							param,
							(res) => {
								resolve(res)
							},
							(error) => {
								reject(error)
							}
						)
					} else {
						reject(new Error('this.$base.post方法不存在'))
					}
				})
			},

			// 将扁平数据转换为树形结构
			convertToListTreeData(listtree) {
				if (!listtree || !Array.isArray(listtree)) return []

				// 将扁平数据转换为树形结构
				const treeMap = {}
				const roots = []

				// 第一步：创建所有节点的映射
				listtree.forEach((item) => {
					treeMap[item.id] = {
						value: item.id.toString(),
						label: item.name,
						children: [],
					}
				})

				// 第二步：构建树形结构
				listtree.forEach((item) => {
					const node = treeMap[item.id]
					if (item.pid === 1) {
						// 根节点
						roots.push(node)
					} else {
						// 子节点，添加到父节点的children中
						if (treeMap[item.pid]) {
							treeMap[item.pid].children.push(node)
						}
					}
				})

				return roots
			},

			// 将扁平数据转换为树形结构（别名方法，保持兼容性）
			buildTree(listtree) {
				return this.convertToListTreeData(listtree)
			},

			// 更新选中的标签
			updateSelectedLabel() {
				if (!this.selectedValue || this.data.length === 0) {
					this.selectedLabel = ''
					this.selectedLabelDisplay = ''
					return
				}

				const findNode = (items) => {
					for (const item of items) {
						if (item.value === this.selectedValue) {
							return item.label
						}
						if (item.children && item.children.length > 0) {
							const result = findNode(item.children)
							if (result) return result
						}
					}
					return null
				}
				this.selectedLabel = findNode(this.data) || ''
				this.selectedLabelDisplay = this.selectedLabel
			},

			// 显示弹窗
			handleShowPopup() {
				if (!this.disabled) {
					this.isShowPopup = true
					// 重置临时选中值
					this.tempSelectedValue = this.selectedValue
					this.tempSelectedLabel = this.selectedLabel
					// 如果打开树，默认展开第一层
					if (this.data.length > 0 && this.expandedKeys.length === 0) {
						this.expandedKeys.push(this.data[0].value)
					}
				}
			},

			// 处理节点点击
			handleNodeClick(node) {
				this.tempSelectedValue = node.value
				this.tempSelectedLabel = node.label
			},

			// 切换展开/折叠
			toggleExpand(key) {
				const index = this.expandedKeys.indexOf(key)
				if (index > -1) {
					this.expandedKeys.splice(index, 1)
				} else {
					this.expandedKeys.push(key)
				}
			},

			// 点击遮罩层关闭
			clickMask(e) {
				this.isShowPopup = e
			},

			// 取消选择
			handleCancel() {
				this.isShowPopup = false
				// 重置临时值
				this.tempSelectedValue = this.selectedValue
				this.tempSelectedLabel = this.selectedLabel
			},

			// 确认选择
			handleConfirm() {
				this.selectedValue = this.tempSelectedValue
				this.selectedLabel = this.tempSelectedLabel
				this.selectedLabelDisplay = this.tempSelectedLabel
				this.$emit('input', this.tempSelectedValue)
				this.$emit('change', {
					value: this.tempSelectedValue,
					label: this.tempSelectedLabel,
				})
				this.isShowPopup = false
			},
		},
	}
</script>

<style lang="scss" scoped>
	// 公共变量
	$active-color: #3b93f7;
	$border-color: #e5e5e5;

	.select-tree-wrapper {
		display: block;
		width: 100%;

		.mini-popup-wrapper {
			position: fixed;
			top: 0;
			left: 0;
			bottom: 0;
			right: 0;
			z-index: 9991;
		}
	}

	.select-tree-trigger {
		position: relative;
		display: flex;
		justify-content: space-between;
		align-items: center;
		height: 88rpx;
		padding: 0 30rpx;
		background-color: #fff;
		border-bottom: 2rpx solid $border-color;
		box-sizing: border-box;

		&.disabled {
			opacity: 0.5;
			pointer-events: none;
		}
	}

	.select-tree-value {
		flex: 1;
		font-size: 28rpx;
		color: #333;
		text-align: left;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;

		.select-tree-trigger.disabled & {
			background-color: #f5f5f5;
		}
	}

	.select-tree-arrow {
		width: 20rpx;
		height: 20rpx;
		background-size: contain;
		background-repeat: no-repeat;
		background-position: center;
		transform: rotate(0deg);

		&::after {
			content: "▼";
			font-size: 20rpx;
			color: #999;
		}
	}

	// 弹窗相关样式
	.popup-content-wrapper {
		width: 100%;
		height: 80vh;
		background-color: #fff;
		display: flex;
		flex-direction: column;
		overflow: hidden;
	}

	.toolbar {
		position: relative;
		height: 88rpx;
		font-size: 28rpx;
		line-height: 88rpx;
		box-sizing: border-box;
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 0 30rpx;
		border-bottom: 2rpx solid $border-color;
		background-color: #fff;

		.cancel-btn,
		.confirm-btn {
			font-size: 28rpx;
			padding: 0 20rpx;
		}

		.cancel-btn {
			color: #999;
		}

		.confirm-btn {
			color: $active-color;
			font-weight: 500;
		}

		.title {
			font-size: 32rpx;
			color: #333;
			flex: 1;
			text-align: center;
		}
	}

	.tree-scroll-view {
		flex: 1;
		width: 100%;
		overflow-y: auto;
	}

	.select-tree-list {
		margin: 0;
		padding: 0;
		list-style: none;
	}

	.tree-node {
		margin: 0;
		padding: 0;
	}

	.node-content {
		position: relative;
		height: 88rpx;
		padding: 0 30rpx;
		line-height: 88rpx;
		cursor: pointer;
		font-size: 28rpx;
		color: #333;
		box-sizing: border-box;

		&:hover {
			background-color: #f8f8f8;
		}

		&.selected {
			background-color: #f0f7ff;
			color: $active-color;
		}
	}

	.expand-icon {
		position: absolute;
		left: 30rpx;
		top: 50%;
		transform: translateY(-50%);
		width: 24rpx;
		height: 24rpx;
		line-height: 24rpx;
		text-align: center;
		color: #999;
		cursor: pointer;

		&::before {
			content: "▶";
			display: inline-block;
			font-size: 20rpx;
			transition: transform 0.2s;
		}

		&.expanded::before {
			content: "▼";
		}
	}

	.node-label {
		display: inline-block;
		margin-left: 54rpx;
		vertical-align: middle;
	}

	.check-icon {
		position: absolute;
		right: 30rpx;
		top: 50%;
		transform: translateY(-50%);
		color: $active-color;
		font-size: 32rpx;
		font-weight: bold;

		&::before {
			content: "✓";
		}
	}

	// 树形结构缩进
	.tree-children {
		margin: 0;
		padding: 0;
		list-style: none;

		.node-content {
			padding-left: 70rpx;

			.node-label {
				margin-left: 54rpx;
			}
		}

		& .tree-children .node-content {
			padding-left: 110rpx;

			.node-label {
				margin-left: 54rpx;
			}
		}

		& .tree-children .tree-children .node-content {
			padding-left: 150rpx;

			.node-label {
				margin-left: 54rpx;
			}
		}
	}
</style>