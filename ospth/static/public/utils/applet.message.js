import Vue from 'vue'

// #ifdef APP-PLUS || H5 || MP-WEIXIN || MP-QQ
// 封装 uni-app 的 showToast 为类似 this.$message 的用法
const message = {
	success(options) {
		if (typeof options === 'string') {
			options = {
				message: options
			};
		}
		uni.showToast({
			title: options.message || options.title, // 兼容 title 和 message 两种传参
			// icon: 'success',
			icon: 'none',
			duration: options.duration || 2000
		});
	},
	info(options) {
		if (typeof options === 'string') {
			options = {
				message: options
			};
		}
		uni.showToast({
			title: options.message || options.title,
			icon: 'none',
			duration: options.duration || 2000
		});
	},
	warning(options) {
		if (typeof options === 'string') {
			options = {
				message: options
			};
		}
		// 这里我们用 none，并可以在文字前加个警示符号，或者后续考虑用自定义组件
		uni.showToast({
			title: (options.message || options.title), // 简单加个符号强调
			icon: 'none',
			duration: options.duration || 2000
		});
		// 或者，如果有引入 uView 等UI库：
		// this.$u.toast({ title: options.message || options.title, type: 'warning' });
	},
	error(options) {
		if (typeof options === 'string') {
			options = {
				message: options
			};
		}
		uni.showToast({
			title: options.message || options.title,
			// icon: 'error', // 注意兼容性
			icon: 'none',
			duration: options.duration || 2000
		});
	}
};

// 挂载到 Vue.prototype 上，使得所有组件可以通过 this.$message 访问
Vue.prototype.$message = message;
// #endif

// ... 其他 main.js 逻辑