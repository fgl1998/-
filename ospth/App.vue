<script>
	export default {
		created() {
			// this.$user.getUser(data=> {})
			this.$dict.initDictCache()
		},
		onLaunch: function() {
			//手势密码
			uni.setStorageSync("once",true)
			//通知公告、极光推送
			uni.setStorageSync("one",true)
			//初始化md
			uni.setStorageSync("mdInit",true)
			//移除验证码倒计时缓存
			for(let i=1;i<15;i++){
				uni.removeStorageSync("countdown"+i)
			}
			//移出访问记录
			uni.removeStorageSync("visitId")
			let that = this;
			uni.addInterceptor('reLaunch', {//重加载
				success(e) {
					
				}
			})
			uni.addInterceptor('navigateTo', {//监听跳转
				success(e) {
					let pages = getCurrentPages()
					if(pages.length == 0) {
						return
					}
					let route1 = pages[pages.length-1].route
					let time = setInterval(data=> {
						pages = getCurrentPages()
						let route2 = pages[pages.length-1].route
						if(route1 != route2) {
							clearInterval(time)
							//tabBar底部菜单直接切换无法监听，所以此处排除单独进行调用
							if(route2 != 'pages/index/index' && route2 != 'pages/index/work'
								&& route2 != 'pages/social/social' && route2 != 'pages/find/find'
								&& route2 != 'pages/index/my') {
								// that.$gather.saveGatherData()
							}
						}
					}, 100)
				}
			})
			uni.addInterceptor('redirectTo', {//监听关闭本页面跳转
				success(e) {
					let pages = getCurrentPages()
					if(pages.length == 0) {
						return
					}
					let route1 = pages[pages.length-1].route
					let time = setInterval(data=> {
						pages = getCurrentPages()
						let route2 = pages[pages.length-1].route
						if(route1 != route2) {
							clearInterval(time)
							//tabBar底部菜单直接切换无法监听，所以此处排除单独进行调用
							if(route2 != 'pages/index/index' && route2 != 'pages/index/work'
								&& route2 != 'pages/social/social' && route2 != 'pages/find/find'
								&& route2 != 'pages/index/my') {
								// that.$gather.saveGatherData()
							}
						}
					}, 100)
				}
			})
			uni.addInterceptor('switchTab', {//监听tabBar跳转
				success(e) {
					let pages = getCurrentPages()
					if(pages.length == 0) {
						return
					}
					let route1 = pages[pages.length-1].route
					let time = setInterval(data=> {
						pages = getCurrentPages()
						let route2 = pages[pages.length-1].route
						if(route1 != route2) {
							clearInterval(time)
							//tabBar底部菜单直接切换无法监听，所以此处排除单独进行调用
							if(route2 != 'pages/index/index' && route2 != 'pages/index/work'
								&& route2 != 'pages/social/social' && route2 != 'pages/find/find'
								&& route2 != 'pages/index/my') {
								// that.$gather.saveGatherData()
							}
						}
					}, 100)
				}
			})
			uni.addInterceptor('navigateBack', {//监听返回
				success(e) {
					
				}
			})
		},
		onShow: function() {},
		onHide: function() {},
	}
</script>

<style lang="scss">
	@import './static/common/css/common.css';
	@import 'vant/lib/index.css';
	/*每个页面公共css */
</style>
