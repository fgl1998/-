<script>
	export default {
		onLaunch: function() {
			console.log('App Launch')
		},
		onShow: function() {
			console.log('App Show')
		},
		onHide: function() {
			console.log('App Hide')
		}
	}
</script>

<style lang="scss">
@import '@/uni_modules/uview-ui/index.scss';

page {
  min-height: 100%;
  color: #303133;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  background: #f5f7fa;
}

view,
text,
button,
input,
textarea {
  box-sizing: border-box;
}

.safe-page {
  padding-bottom: calc(32rpx + constant(safe-area-inset-bottom)) !important;
  padding-bottom: calc(32rpx + env(safe-area-inset-bottom)) !important;
}
</style>
