<template>
    <view class="mini-select-wrapper" @click.stop="$emit('click',$event)" :class="[select?'select':'']">
        <block v-if="!picker">
            <view class="left" v-if="label" style="width: 250rpx;">
				<span v-show="required" style="color: red;float: left;">*</span>
				<span>{{label}}</span>
            </view>
            <view class="right">{{value||'请选择'}}</view>
            <i class="icon icon-select"></i>
        </block>
    </view>
</template>
<script>
    export default {
        name: 'mini-select',
        props: {
            className: {
                type: String,
                default: ''
            },
            picker: {
                type: Boolean,
                default: false,
            },
            label: {
                type: String,
                default: ''
            },
            value: {
                type: String,
                default: '',
                required: true
            },
            select: {
                type: Boolean,
                default: false,
            },
            //必填项
            required: {
                type: Boolean,
                default: false,
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

        },
        onLoad(options) {

        }
    };
</script>
<style lang="scss" scoped>
    @import '@/static/css/sass/mini-select.scss';
</style>
