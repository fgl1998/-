// @touchmove.stop="touchmove" 会阻断 overflow：auto 滚动
<template>
    <view class="mini-popup-wrapper" v-show="isShowPopup" @touchmove.stop="touchmove">
        <view v-if="align == 'bottom'" class="mini-popup-content" :class="isShowPopup?'':'out'">
            <slot />
        </view>
		<view v-else class="mini-popup-content-mid" :class="isShowPopup?'':'out'">
		    <slot />
		</view>
        <view class="mini-popup-mask" @click.stop.prevent="clickMask" :class="isShowPopup?'':'out'"></view>
    </view>
</template>
<script>
    export default {
        name: 'mini-popup',
        props: {
            // 弹层内容出现位置 默认底部
            align: {
                type: String,
                default: 'bottom'
            },
            // 是否显示弹层
            isShowPopup: {
                type: Boolean,
                default: false
            },
            // 点击弹窗遮罩层是否可关闭
            maskCloseable: {
                type: Boolean,
                default: true
            }
        },
        data() {
            return {

            };
        },
        created() {

        },
        components: {

        },
        methods: {
            // 点击遮罩层 关闭弹窗
            clickMask() {
                // console.log('popup maskCloseable: ', this.maskCloseable);
                if (this.maskCloseable) {
                    // console.log('popup maskCloseable 正在传递参数');
                    this.$emit('clickMask', false);
                }
            },
            touchmove() {
                return false;
            }
        },
        onLoad(options) {

        }
    };
</script>
<style lang="scss" scoped>
    // @import '@/static/css/sass/mini-popup.scss';
	.mini-popup-content-mid {
	  border-radius: 20rpx;
	  position: absolute;
	  width: 90%;
	  z-index: 1001;
	  height: auto;
	  left: 40rpx;
	  bottom: 200rpx;
	  background-color: white;
	  animation: bottomIn .5s ease-out;
	  &.out{
	    animation-name: bottomOut;
	  }
	}
	.mini-popup-wrapper {
	  position: fixed;
	  top: 0;
	  left: 0;
	  bottom: 0;
	  right: 0;
	  z-index: 999;
	}
	.mini-popup-content {
	  position: absolute;
	  width: 100%;
	  z-index: 1001;
	  height: auto;
	  left: 0;
	  bottom: 0;
	  animation: bottomIn .5s ease-out;
	  &.out{
	    animation-name: bottomOut;
	  }
	}
	.mini-popup-mask{
	  position: fixed;
	  top: 0;
	  left: 0;
	  bottom: 0;
	  right: 0;
	  z-index: 1000;
	  background-color: rgba(0,0,0,.3);
	  opacity: 1;
	  animation: fadeIn .5s ease-in-out;
	  &.out{
	    animation-name: fadeOut;
	  }
	}
	
</style>
