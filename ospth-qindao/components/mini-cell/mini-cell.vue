<template>
    <view class="mini-cell-wrapper" :class="[label?'exist-label':'',className]">
        <view class="left">
            <view>
                <p class="title" v-if="title"><span style="color: red" v-if="required">*</span>{{title}}</p>
                <p class="label" v-if="label">{{label}}</p>
            </view>
        </view>
        <view class="right">
            <p class="value" v-if="value">{{value}}</p>
            <span v-if="clear&&value!='请选择'&&value!=''" class="close-icon" @click.stop="handleClear">×</span>
        </view>
        <i class="icon icon-arrow-right" v-show="!hideCircle"></i>
    </view>
</template>
<script>
    export default {
        name: 'mini-cell',
        props: {
            title: {
                type: String,
                default: ''
            },
            label: {
                type: String,
                default: ''
            },
            value: {
                type: String,
                default: ''
            },
            required: {
                type: Boolean,
                default: false
            },
            clear: {
                type: Boolean,
                default: false
            },
            hideCircle: { // 右边箭头
                type: Boolean,
                default: false
            },
            className: { // 修改样式
                type: String,
                default: ''
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
            handleClear () {
                this.$emit('handleClear')
            }
        },
        onLoad(options) {

        }
    };
</script>
<style lang="scss" scoped>
    @import '@/static/common/css/sass/mini-cell.scss';
    .icon {
      background-repeat: no-repeat;
      background-position: center center;
      background-size: 100%;
    }
    /* 右箭头*/
    .icon-arrow-right {
      top: 50%;
      right: 30rpx;
      width: 16rpx;
      height: 26rpx;
      margin-right: 10rpx;
      background: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAZCAYAAAA4/K6pAAABgElEQVQ4jY3Uv0tWURzH8Zc/SEhIKCTTIQlEqqHCKQk1gzJwKmhqqRaHFmnrj2joP6ippcEQa8jSxQfCKKEIKeShwbIIaWqoyOGeaw9fHz33u1z4nPN+ny+Xc74ttdqyVFMYxg38VbHa0/c27qMFHbiO31UErZhugOEaHmFfVUF3A1zWFTxO3WQFd3EH/8LaJGawPyeAe4qf9yesX8IsOnMCeICr+BX2nMczHMgJ4Aku42fIzyVJV04AixjDRsjPYh4HcwJ4m06th3woSbpzAvikuJnvQn4aC+jJCeALRlAL+Ykk6csJYBM37Xwfg3hYRdCPp2gLeR23coJjilb7Q76GUdT3Egwk+GjIPyb4M/+fc6xBvEBvyFcxjvUyaNbBcbxsAn9QXLD1xjAKTib4SMjfJ/hrPK1RcCrBh8OeFcWD+tak223BGeGKpnqDC/jeDC4FQ3iOQ2HtdYJ/7AaXgjhE4FWCN/eCS8GKYvKUM2AJF+2cCbsKYBkTmEvfSjBsAUBDSM+F/dUVAAAAAElFTkSuQmCC)
        no-repeat center center;
      background-size: 100%;
      transition: transform 0.3s;
	  &.select {
	    transform: rotate(90deg);
	  }
    }
    .value {
        min-width: 100rpx !important;
        max-width: 400rpx !important;
        text-align: center !important;
    }
    .cell-li {
        margin-bottom: 0 !important;
        border-top: none !important;
    }
    
    .cell-li .right{
        color: #333333 !important;
    }
    .close-icon {
        display: inline-block;
        border-radius: 50%;
        width: 30rpx;
        height: 30rpx;
        line-height: 30rpx;
        text-align: center;
        margin-left: 12rpx;
        background: red;
        color: white;
    }
    // 超出两行隐藏
    .title{
        overflow : hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
    }
</style>
