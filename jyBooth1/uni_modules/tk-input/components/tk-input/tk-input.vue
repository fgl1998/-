<template>
	<input :value="modelValue" type="password" v-bind="$attrs" @input="input.onInput" @tap="input.onTap"
		@confirm="input.onConfirm" :info="info" :change:info="input.infoChange">
</template>
<!--  -->
<script>
	/**
	 * Input 聚焦但是不弹出键盘
	 * 方案（此处采用前两个）：
	 * 1. 使用 input 新属性，inputmode
	 */
	export default {
		name: "tk-input",
		props: {
			modelValue: {
				type: [String, Number],
				default: ''
			},
			// 是否允许编辑，即点击的时候不弹出软键盘
			allowEdit: {
				type: Boolean,
				default: false
			}
		},
		model: {
			prop: 'modelValue',
			event: 'update:modelValue'
		},
		emits: ['input', 'update:modelValue', 'confirm'],
		data() {
			return {
				info: {
					cmd: '',
					allowEdit: false,
					random: Math.random()
				}
			}
		},
		watch: {
			allowEdit: {
				immediate: true,
				handler: function(newVal) {
					this.info.allowEdit = newVal;
				}
			}
		},
		created() {},
		computed: {},
		methods: {
			//获取焦点
			focus() {
				this.info = Object.assign({}, this.info, {
					cmd: 'focus',
					random: Math.random()
				});
			},
			showKeyboard() {
				this.focused = true;
				this.info = Object.assign({}, this.info, {
					cmd: 'showKeyboard',
					random: Math.random()
				});
			},
			hideKeyboard() {
				uni.hideKeyboard()
			},
			//设置文本
			onSetText(val) {
				this.$emit('update:modelValue', val);
			},
			// 重置
			onReset() {
				// //console.log('重置')
				this.$emit('update:modelValue', '');
				this.focus();
			},

			_input(val) {
				this.$emit('update:modelValue', val)
				this.$emit('input', val)
			},
			// 清除文本
			_onClear() {
				// //console.log('清除')
				this.$emit('update:modelValue', '');
			},
			_onConfirm(val) {
				this.$emit('confirm', val);
			},
		}
	}
</script>

<script module="input" lang="renderjs">
	let that;
	export default {
		data() {
			return {
				info: {
					cmd: '',
					allowEdit: false,
					random: ''
				}
			}
		},
		mounted() {
			that = this;
			// inputmode="none" 实现input聚焦但是不弹出键盘，浏览器兼容性不好
			this.$ownerInstance.$el.querySelector('input').setAttribute('inputmode', 'none')
			// this.$el.querySelector('input').setAttribute('focus', 'true')
		},
		methods: {
			//输入事件
			onInput(event, ownerInstance) {
				ownerInstance.callMethod('_input', event.detail.value)
			},
			//回车事件
			onConfirm: (event, ownerInstance) => {
				if (event.detail.value) {
					ownerInstance.callMethod('_onConfirm', event.detail.value)
				}
				ownerInstance.callMethod('focus');
			},
			/**
			 * 主动点击
			 */
			onTap(event, ownerInstance) {
				ownerInstance.$el.querySelector('input').setAttribute('inputmode', this.info.allowEdit ? null : 'none');
				// 当点击时，如果为none,会导致扫描无效
				setTimeout(() => {
					ownerInstance.$el.querySelector('input').setAttribute('inputmode', null)
				}, 10)
			},
			//清空
			onClear(event, ownerInstance) {
				ownerInstance.callMethod('_onClear');
				this.focusHideKeyboard(ownerInstance);
			},
			focusHideKeyboard(ownerInstance) {
				ownerInstance.$el.querySelector('input').setAttribute('inputmode', 'none')
				ownerInstance.$el.querySelector('input').focus();
				setTimeout(() => {
					ownerInstance.$el.querySelector('input').setAttribute('inputmode', null)
				}, 10)
			},
			/**
			 * @description 命令改变
			 * @param {Object} newValue
			 * @param {Object} oldValue
			 * @param {Object} ownerInstance
			 * @param {Object} instance
			 */
			infoChange(newValue, oldValue, ownerInstance, instance) {
				this.info = newValue;
				switch (newValue.cmd) {
					case 'focus':
						this.focusHideKeyboard(ownerInstance);
						break;
					case 'showKeyboard':
						ownerInstance.$el.querySelector('input').focus();
						ownerInstance.$el.querySelector('input').setAttribute('inputmode', 'text')
						break;
					default:
						break;
				}
				// //console.log('newValue', newValue)
				// //console.log('oldValue', oldValue)
				// //console.log('ownerInstance', ownerInstance)
				// //console.log('instance', instance)
			}
		}
	}
</script>

<style>

</style>
