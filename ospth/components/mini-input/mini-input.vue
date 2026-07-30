/**
* 组件详解：具体使用请请考 /pages/mini-input/index.vue。 注：本文件注释代码中的示例只列举了某一个参数
* 参数：
必填参数：
value: 输入框绑定的值。使用组件时请使用 v-model 绑定
可选参数：
label： 左边标题，输入框输入提示。
className： 自定义类名，利用css层叠改变样式。 注：在使用该参数时必须去除父组件 style 标签上的 scoped 属性。
placeholder： 输入框输入提示。
placeholderClass：输入框输入提示 placeholder 的类名，该类名在父组件的style标签中定义。
示例：<mini-input placeholderClass="placeholderClass"></mini-input>
placeholderStyle：输入框输入提示 placeholder 的样式定义。
示例：<mini-input placeholderStyle="color:#f00;"></mini-input>

type： 输入框类型。目前支持的类型： idcard text number digit
text： 文本输入键盘（默认）
number： 数字输入键盘
idcard： 身份证输入键盘
digit： 带小数点的数字键盘
password： 是否是密码类型输入。默认值为 false
disabled： 是否禁用。默认值为 false
focus： 是否自动获取焦点。默认值为 false
clear： 是否显示输入框清除按钮。 默认值为 false
code： 是否是验证码输入框。 默认值为 false
codeData： 验证码输入框获取验证码按钮数据，即button组件上的参数参入：
示例：{
name: '获取验证码',
disabled: false
}
codeStyle： 验证码输入框获取验证码按钮样式，参入参数的数据根据css样式：
示例：{
// 宽度的单位设计到逻辑计算 请使用 rpx 或者 px 为单位
width: '100px'
}
noBottomBorder： 是否输入框没有下边框线。 默认值为 false
holdKeyboard： focus 时点击页面是否收起键盘。默认值为 false
required： 输入框是否为必须输入。默认值为 false
id： label标签for属性与输入框input标签id属性的绑定。
confirmType： 设置键盘右下角按钮的文字，仅在type='text'时生效。支持的类型：send search done go next
next: 右下角按钮为“下一个”
search: 右下角按钮为“搜索”
send: 右下角按钮为“发送”
go: 右下角按钮为“前往”
done: 右下角按钮为“完成” （默认）
maxlength： 最大输入长度，设置为 -1 的时候不限制最大长度。 默认值为 100
height： input输入框的高度。 默认值为 84 单位 rpx
labelWidth： label标签的宽度。 默认值为 140 单位 rpx
align: 输入框的文字方向。目前支持的类型： right left center
right: 向右 (默认)
center: 居中
left: 向左
reg：正则表达式。用于验证表单输入验证。传递的值必须为正则表达式
errMsg：验证输入框输入的值提示的错误信息。必须要传入reg或者verificationType的几种类型参数时输入错误才会提示
verificationType：验证输入框输入的值。目前支持：tel email
formatType：格式化输入的值。目前支持：amount 用于输入金额时保留最后两位小数
事件：
input： 键盘 输入 时触发
foucs： 键盘 聚焦 时触发
blur： 键盘 失去焦点 时触发
confirm： 点击 键盘完成按钮 时触发
keyboardheightchange：键盘高度发生变化时触发
getCode： 点击 发送验证码按钮 时触发
*/
<template>
    <view class="mini-input-wrapper" :class="[className?className:'']">
        <view class="hint" v-if="isError">
            <span>{{errMsg||'请输入正确的格式'}}</span>
        </view>
        <view class="input-hint" v-if="type==='idcard' && isShowInputHint">
            <span>{{idcardValue}}</span>
        </view>
        <view class="mini-input"
            :class="[noBottomBorder?'no-bottom-border':'', align?align:'',code?'code':'']">
            <view class="left" v-if="label" :style="{height: height+'rpx', width: labelWidth+'rpx'}">
                <span v-if="required" style="color: red;">*</span>
                <label :for="id" class="label">{{label}}</label>
            </view>
            <view class="right" :style="{height: height+'rpx'}">
                <!-- 自动聚焦带有bug 所有根据focus条件分开写 -->
                <block v-if="focus">
                    <input :type="type" :disabled="disabled" :value="idMsg" :id="id" focus :hold-keyboard="holdKeyboard"
                        :placeholder="placeholder" :confirm-type="confirmType" :maxlength="maxlength"
                        :password="password" :placeholder-class="placeholderClass" :placeholder-style="placeholderStyle"
                        @focus="inputFocus" @blur="inputBlur" @confirm="$emit('confirm', $event)"
                        @keyboardheightchange="$emit('keyboardheightchange', $event)" @input="inputInput" />
                </block>
                <block v-else>
                    <input :type="type" :disabled="disabled" :value="idMsg" :id="id" :hold-keyboard="holdKeyboard"
                        :placeholder="placeholder" :confirm-type="confirmType" :maxlength="maxlength"
                        :password="password" :placeholder-class="placeholderClass" :placeholder-style="placeholderStyle"
                        @focus="inputFocus" @blur="inputBlur" @confirm="$emit('confirm', $event)"
                        @keyboardheightchange="$emit('keyboardheightchange', $event)" @input="inputInput" />
                </block>
                <!-- 是否显示清除按钮 默认不显示 -->
                <block v-if="clear">
                    <view class="clear" @click="clearValue"
                        :style="{display:isShowClearButton?'flex':'none',right:iconClearStyle }">
                        <i class="icon"></i>
                    </view>
                </block>
                <!--验证码按钮 -->
                <block v-if="code">
                    <view class="code-wrapper">
                        <mini-button :name="codeData.name" :disabled="codeData.disabled" type="code" :styles="codeStyle"
                            @click.stop="getCode"></mini-button>
                    </view>
                </block>
            </view>
        </view>
    </view>
</template>
<script>
    // import mini-button from '@/components/mini-button';
    export default {
        name: 'mini-input',
        props: {
            className: {
                type: String,
                default: ''
            },
            placeholderClass: {
                type: String,
                default: '',
            },
            placeholderStyle: {
                type: String,
                default: '',
            },
            value: {
                type:Number|String,
                default: '',
                required: true,
            },
            label: {
                type: String,
                default: ''
            },
            placeholder: {
                type: String,
                default: ''
            },
            type: {
                type: String,
                default: 'text'
            },
            id: {
                type: String,
                default: ''
            },
            align: {
                type: String,
                default: 'left'
            },
            disabled: {
                type: Boolean,
                default: false
            },
            focus: {
                type: Boolean,
                default: false
            },
            code: {
                type: Boolean,
                default: false
            },
            codeData: {
                type: Object,
                default() {
                	return {}
                }
            },
            codeStyle: {
                type: Object,
                default() {
                	return {}
                }
            },
            // focus 时点击页面是否收起键盘 暂时禁用
            holdKeyboard: {
                type: Boolean,
                default: false
            },
            // 设置键盘右下角按钮的文字，仅在type='text'时生效
            confirmType: {
                type: String,
                default: 'done'
            },
            maxlength: {
                type: [Number,String],
                default: 100
            },
            height: {
                type: Number,
                default: 84
            },
            labelWidth: {
                type: Number|String,
                default: 180
            },
            password: {
                type: Boolean,
                default: false
            },
            clear: {
                type: Boolean,
                default: false
            },
            // 输入框是否有边框线
            noBottomBorder: {
                type: Boolean,
                default: false
            },
            required: {
                type: Boolean,
                default: false
            },
            reg: {
                type: RegExp
            },
            errMsg: {
                type: String,
                default: ''
            },
            verificationType: {
                type: String,
                default: ''
            },
            format: {
                type: String,
                default: ''
            },
            idHide: {
                type: Boolean,
                default: false
            }
        },
        data() {
            return {
                // 是否显示清除按钮
                isShowClearButton: false,
                getCodeButtonDisabled: false,
                getCodeButtonLabel: '获取验证码',
                // 是否输入错误 控制错误提示
                isError: false,
                // 输入提示 控制显示 只限身份证号码输入
                isShowInputHint: false,
                // 身份证脱敏显示
                // idMsg: '',
            };
        },
        created() {
            // 如果是带有清除 防止点击清除按钮时失去焦点收起键盘
            if (this.clear) {
                // 暂时禁用
                // this.holdKeyboard = true
            }
            // 如果当type='idcard'时 没有知道placeholder时默认指定placeholder
            // if (this.type === 'idcard') {
            //     if (!this.placeholder) {
            //         this.placeholder = '请输入您的身份证号码';
            //     }
            //     this.maxlength = 18;
            // }
            // 传递类正则表达式验证 却没有传递 errMsg 初始化一个默认值
            if (this.reg && !this.errMsg) {
                this.errMsg = '格式错误';
            }
        },
        components: {
            // mini-button
        },
        methods: {
            // 控制错误提示显示隐藏
            handleHint(result) {
                if (result) {
                    this.isError = false;
                } else {
                    this.isError = true;
                    this.clearValue();
                }
            },
            // 验证结果
            getVerifyResult(reg) {
                const isRegExp = reg instanceof RegExp;
                const value = this.value;
                if (!isRegExp) {
                    // console.error(reg + ' 不是正则表达式，无法进行验证！')
                    return;
                }
                const isOk = reg.test(value);
                // console.log('isOK => ' + isOk);
                if (!reg.test(value)) {
                    this.handleHint(false);
                    return false;
                } else {
                    this.handleHint(true);
                    return true;
                }
            },
            // 设置错误信息
            setErrMsg(errMsg) {
                const propsErrMsg = this.errMsg;
                //  如果没有传入错误信息 并且内部传入了错误信息 则使用内部传入的错误信息进行必要的提示
                if (!propsErrMsg && errMsg) {
                    this.errMsg = errMsg;
                }
            },
            // 默认类型验证
            setDefaultVerifyType(type, value) {
                if (!value) {
                    value = this.value;
                }
                let errMsg;
                let testResult;
                let reg;
                if (!type) {
                    type = this.verificationType;
                }
                if (!type) {
                    return;
                }
                switch (type) {
                    case 'tel':
                        reg = /^[1][3,4,5,7,8][0-9]{9}$/;
                        if (!value) {
                            errMsg = '电话号码不能为空！'
                        }
                        testResult = this.getVerifyResult(reg, value);
                        if (!testResult && value) {
                            errMsg = '电话号码格式不正确！'
                        }
                        break;
                    case 'email':
                        reg =
                            /^(([^()[\]\\.,;:\s@\"]+(\.[^()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
                        if (!value) {
                            errMsg = '邮箱不能为空！'
                        }
                        testResult = this.getVerifyResult(reg, value);
                        if (!testResult && value) {
                            errMsg = '邮箱格式不正确！'
                        }
                        break;
                    default:
                        break;
                }
                this.setErrMsg(errMsg);
            },
            // 格式化字符串
            formatString(type) {
                const value = this.value;
                let result = '';
                if (!type) {
                    type = this.format;
                }
                if (!type) {
                    return;
                }
                switch (type) {
                    case 'amount':
                        if (value.indexOf(".") > -1) {
                            result = value.substring(0, value.indexOf(".") + 3);
                            //this.value = result;
                            this.$emit('input', result);
                        }
                        break;
                    default:
                        break;
                }
            },
            // 获取焦点 先执行组件内部逻辑 然后再执行父组件focus事件 以下同理
            inputFocus(e) {
                this.$emit('focus', e);
                // 获取焦点时关闭提示信息
                this.isError = false;
                if (this.value && this.clear) {
                    this.isShowClearButton = true;
                } else {
                    this.isShowClearButton = false;
                }
                // 身份证类型输入
                if (this.type === 'idcard') {
                    this.isShowInputHint = true
                }
            },
            inputBlur(e) {
                this.$emit('blur', e);
                this.isShowClearButton = false;
                const value = this.value;
                // 如果有正则传入验证
                if (!!this.reg) {
                    const isRegExp = this.reg instanceof RegExp;
                    if (!isRegExp) {
                        // console.error(reg + ' 不是正则表达式，无法进行验证！')
                        return;
                    }
                    this.getVerifyResult(this.reg);
                } else {
                    this.setDefaultVerifyType();
                }

                // 金额
                if (this.type === 'digit' && this.format === 'amount') {
                    this.formatString('amount');
                }
                // 身份证类型输入
                if (this.type === 'idcard') {
                    this.isShowInputHint = false
                }
            },
            inputInput(e) {
                const value = e.target.value;
                if (value) {
                    this.isShowClearButton = true;
                }
                this.$emit('input', value);
            },
            // 清空输入框的值
            clearValue() {
                this.$emit('input', '');
                this.isShowClearButton = false;
            },
            // 获取验证码
            getCode(e) {
                this.$emit('getCode', e);
            }
        },
        computed: {
            idMsg(){
                if(this.idHide){
                    return this.$utils.idHide(this.value)
                }else {
                    return this.value
                }
            },
            idcardValue() {
                const value = this.value + '';
                if (value != "") {
                    return value.substr(0, 6) + ' ' + value.substr(6, 4) + ' ' + value.substr(10, 4) + ' ' + value
                        .substr(14)
                } else {
                    return value
                }
            },
            iconClearStyle() {
                const data = this.codeStyle;
                let width = 220;
                let paddingRight = 30;
                if (!this.code) {
                    return 0;
                }
                if (!!data) {
                    const value = data.width;
                    if (value) {
                        if (value.indexOf('rpx') > -1) {
                            width = parseInt(data.width);
                            return (width + paddingRight) + +'rpx';
                        }
                        width = parseInt(data.width);
                        return (width * 2 + paddingRight) + 'rpx';
                    }
                }
                return (width + paddingRight) + 'rpx';
            }
        },
        onLoad(options) {}
    };
</script>
<style lang="scss" scoped>
    // @import '@/static/css/sass//mini-input.scss';
	/*
	    共用 全局属性 
	*/
	// 左右间距
	$space-LR: 30rpx;
	$fontSize: 30rpx;
	
	
	// 主色调
	$color-primary: #2d8cf0;
	// Light Primary 常用于 hover
	$color-light-primary: #5cadff;
	// Dark Primary 常用于 active。
	$color-dark-primary: #2b85e4;
	
	// 辅助色
	$color-info: #2db7f5;
	$color-success: #19be6b;
	$color-wraning: #ff9900;
	$color-error: #ed4014;
	
	// 标题 
	$color-title: #464c5b;
	// 正文
	$color-content: #657180;
	// 辅助
	$color-sub: #9ea7b4;
	// 失效
	$color-disabled: #c5c8ce;
	// 边框
	$color-border: #dcdee2;
	// 背景
	$color-background: #f8f8f9;
	// 分割线
	$color-divider: #e8eaec;
	
	// 标题 
	$font-size-title: 28rpx;
	// 正文
	$font-size-content: 28rpx;
	// 辅助
	$font-size-sub: 24rpx;
	
	/* 
	    input 组件变量
	*/
	$mini-input-label-width: 180rpx;
	$mini-input-label-fontSize: 28rpx;
	$mini-input-input-fontSize: 26rpx;
	$mini-input-height: 84rpx;
	$mini-input-borderColor: #e5e5e5;
	$mini-input-backgroundColor: #fff;
	$mini-input-color: #36404a;
	$mini-input-paddingLeft: 0rpx;
	$mini-input-clear-backgroundColor: #999;
	$mini-input-clear-size: 16px;
	$mini-input-clear-color: #fff;
	
	/* 
	    radio 组件变量
	*/
	$mini-radio-height: 84rpx;
	$mini-radio-borderColor: #e5e5e5;
	$mini-radio-backgroundColor: #fff;
	$mini-radio-iconSize: 48rpx;
	$mini-radio-fontSize: 28rpx;
	
	
	/* 
	    checkbox 组件变量
	*/
	$mini-checkbox-height: 84rpx;
	$mini-checkbox-borderColor: #e5e5e5;
	$mini-checkbox-backgroundColor: #fff;
	$mini-checkbox-iconSize: 48rpx;
	$mini-checkbox-fontSize: 28rpx;
	
	/* 
	    swiperOut 组件变量
	*/
   

    /deep/ .code-wrapper .mini-button-wrapper {
        padding: 0 !important;
    }

    /deep/ .mini-input-wrapper .mini-input.code ._input {
        padding-right: 250rpx;
    }
	

	input {
	  padding: 0;
	  outline: 0;
	  margin: 0;
	}
	
	.mini-input-wrapper {
	  display: block;
	  background-color: $mini-input-backgroundColor;
	  color: $mini-input-color;
	  // padding-left: $space-LR;
	  padding-left: 0;
	  width: 100%;
	  position: relative;
	  .mini-input {
	    width: 100%;
	    display: flex;
	    align-items: center;
	    border-bottom: 1px solid $mini-input-borderColor;
	    &.no-bottom-border {
	      border-bottom: 0;
	    }
	    &.required {
	      .label {
	        &::before {
	          content: "*";
	          color: #f00;
	          position: absolute;
	          left: -18rpx;
	          top: 50%;
	          font-size: 30rpx;
	          transform: translateY(-50%);
	        }
	      }
	    }
	    &.left {
	      width: 100%;
	      input {
	        text-align: left;
	      }
	    }
	    &.right {
	      input {
	        text-align: right;
	        padding-right: $space-LR;
	      }
	    }
	    &.center {
	      input {
	        text-align: center;
	      }
	    }
	    // 验证码
	    &.code {
	      input {
	        padding-right: 300rpx;
	      }
	      .clear {
	        right: 230rpx;
	      }
	    }
	  }
	  .left {
	    display: flex;
	    align-items: center;
	    font-size: $mini-input-label-fontSize;
	    width: $mini-input-label-width;
	    height: $mini-input-height;
	  }
	  .label {
	    position: relative;
	  }
	  .right {
	    display: flex;
	    height: $mini-input-height;
	    align-items: center;
	    flex: 1;
	    font-size: $mini-input-input-fontSize;
	    position: relative;
	  }
	  input {
	    width: 100%;
	    display: block;
	    position: relative;
	    line-height: 1.4;
	    height: 100%;
	    flex: 1;
	    padding-right: $space-LR;
	  }
	  .clear {
	    position: absolute;
	    top: 0;
	    right: 0;
	    height: 100%;
	    width: auto;
	    display: flex;
	    padding: 0 12rpx;
	    z-index: 999;
	    transition: all 0.3s;
	    .icon {
	      width: $mini-input-clear-size;
	      height: $mini-input-clear-size;
	      border-radius: 50%;
	      margin: auto;
	      background-color: $mini-input-clear-backgroundColor;
	      position: relative;
	      transition: all 0.3s;
	      &::before,
	      &::after {
	        content: "";
	        position: absolute;
	        width: 2px;
	        height: $mini-input-clear-size * 0.5;
	        top: 50%;
	        left: 50%;
	        margin-left: -1px;
	        margin-top: -$mini-input-clear-size * 0.25;
	        background-color: $mini-input-clear-color;
	        border-radius: 1px;
	      }
	      &::before {
	        transform: rotate(45deg);
	      }
	      &::after {
	        transform: rotate(-45deg);
	      }
	    }
	  }
	  .code-wrapper {
	    position: absolute;
	    top: 50%;
	    right: $space-LR;
	    transform: translateY(-50%);
	    display: flex;
	    z-index: 88;
	  }
	  .hint {
	    width: 100%;
	    display: flex;
	    padding: 10rpx $space-LR;
	    position: fixed;
	    justify-content: center;
	    top: 0;
	    left: 0;
	    background-color: #ff976a;
	    color: #fff;
	    font-size: 28rpx;
	    line-height: 1.4;
	    z-index: 100;
	  }
	  .input-hint {
	    position: absolute;
	    top: -100%;
	    left: 0;
	    width: 100%;
	    display: flex;
	    align-items: center;
	    justify-content: center;
	    z-index: 6;
	    span {
	      width: auto;
	      background-color: #ff976a;
	      color: #fff;
	      font-size: 52rpx;
	      font-weight: 500;
	      padding: 0 20rpx;
	      border-radius: 8rpx;
	    }
	  }
	}
	
</style>
