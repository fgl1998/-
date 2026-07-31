<template>
	<div class="vitualKeyboard">
		<div class="keyboardBox" v-show="keyboardBox">
			<div class="one_and_two">
				<div class="line gap_t">
					<div class="keys_d" data-kid="49">
						<div>!</div>
						<div>1</div>
					</div>
					<div class="keys_d" data-kid="50">
						<div>@</div>
						<div>2</div>
					</div>
					<div class="keys_d" data-kid="51">
						<div>#</div>
						<div>3</div>
					</div>
					<div class="keys_d" data-kid="52">
						<div>$</div>
						<div>4</div>
					</div>
					<div class="keys_d" data-kid="53">
						<div>%</div>
						<div>5</div>
					</div>
					<div class="keys_d" data-kid="54">
						<div>^</div>
						<div>6</div>
					</div>
					<div class="keys_d" data-kid="55">
						<div>&</div>
						<div>7</div>
					</div>
					<div class="keys_d" data-kid="56">
						<div>*</div>
						<div>8</div>
					</div>
					<div class="keys_d" data-kid="57">
						<div>(</div>
						<div>9</div>
					</div>
					<div class="keys_d" data-kid="48">
						<div>)</div>
						<div>0</div>
					</div>
					<div class="keys_d" data-kid="189">
						<div>—</div>
						<div>-</div>
					</div>
				</div>
				<div class="line second">
					<div class="keys" data-kid="81">Q</div>
					<div class="keys" data-kid="87">W</div>
					<div class="keys" data-kid="69">E</div>
					<div class="keys" data-kid="82">R</div>
					<div class="keys" data-kid="84">T</div>
					<div class="keys" data-kid="89">Y</div>
					<div class="keys" data-kid="85">U</div>
					<div class="keys" data-kid="73">I</div>
					<div class="keys" data-kid="79">O</div>
					<div class="keys" data-kid="80">P</div>
					<div class="keysCmd k-w-60" data-kid="16">符号</div>
				</div>
			</div>
			
			<div class="line third">
				<div class="keys" data-kid="65">A</div>
				<div class="keys" data-kid="83">S</div>
				<div class="keys" data-kid="68">D</div>
				<div class="keys" data-kid="70">F</div>
				<div class="keys" data-kid="71">G</div>
				<div class="keys" data-kid="72">H</div>
				<div class="keys" data-kid="74">J</div>
				<div class="keys" data-kid="75">K</div>
				<div class="keys" data-kid="76">L</div>
				<div class="keysCmd k-w-200" data-kid="20">切换大写</div>
			</div>
			<div class="line fourth">
				<div class="keys" data-kid="90">Z</div>
				<div class="keys" data-kid="88">X</div>
				<div class="keys" data-kid="67">C</div>
				<div class="keys" data-kid="86">V</div>
				<div class="keys" data-kid="66">B</div>
				<div class="keys" data-kid="78">N</div>
				<div class="keys" data-kid="77">M</div>
				<div class="keysCmd k-w-200 f-s-32" data-kid="8">撤销</div>
				<div class="keysCmd k-w-200" data-kid="13">清除</div>
			</div>
		</div>
	</div>
</template>

<script>
	import _dictionary from "./dictionary.js";
	var myWindow = window
	export default {
		name:"common-keyboard",
		components: {},
		props: {
			idName: {
				type: String,
				default: ""
			},
			record: {
			    type: String,
				default: ""
			},
			classStyle: {
				type: String,
				default: ""
			},
			inputType: {
				type: String,
				default: ""
			},
			keyboardBox:{
				type:Boolean,
				default:true,
			},
		},
		data() {
			return {
				classType: this.classStyle,
				type: this.inputType,
				value: this.record,
				_capsLock: false,
				isShowAll: false,
				_shiftStatus: false,
				_inputID: '',
				innerText: "",
			};
		},
		watch: {
			idName(value) {
				this.value = this.record
				this.innerText = this.record
				this.createKeyboard()
			},

		},
		mounted() {
			this.createKeyboard()
		},
		methods: {
			createKeyboard() {
				this.dataInit()
				this.keyboard()
			},
			dataInit() {
				this.innerText = "";
				this._capsLock = false;
				this._removeCapsLock()
			},
			_getInputContent() {
				var inputContent = this.value;
				return inputContent;
			},
			// 输入新内容
			_inputNewContent(str) {
				this.$emit('getSearchValue',str)
				this.value = str
			},

			// 添加classname
			_addClass(obj, cls) {
				var obj_class = obj.className,
					blank = obj_class != "" ? " " : "";
				var added = obj_class + blank + cls;
				obj.className = added;
			},
			// 删除classname
			_removeClass(obj, cls) {
				var obj_class = " " + obj.className + " ";
				obj_class = obj_class.replace(/(\s+)/gi, " ");
				var removed = obj_class.replace(" " + cls + " ", " ");
				removed = removed.replace(/(^\s+)|(\s+$)/g, "");
				obj.className = removed;
			},
			// 为按钮添加active
			_addActive(cls, keycode) {
				let self = this
				var keys = document.getElementsByClassName(cls);
				for (var o of keys) {
					if (o.getAttribute("data-kid") == keycode) {
						self._addClass(o, "active");
					}
				}
			},
			// 为按钮取消active
			_removeActive(cls, keycode) {
				let self = this
				var keys = document.getElementsByClassName(cls);
				for (var o of keys) {
					if (o.getAttribute("data-kid") == keycode) {
						self._removeClass(o, "active");
					}
				}
			},
			_addShift() {
				this._addActive("keysCmd", 16);
				return (this._shiftStatus = true);
			},
			// 取消shift状态
			_removeShift() {
				this._removeActive("keysCmd", 16);
				return (this._shiftStatus = false);
			},
			// 添加CapsLock状态
			_addCapsLock() {
				this._addActive("keysCmd", 20);
				return (this._capsLock = true);
			},
			// 取消CapsLock状态
			_removeCapsLock() {
				this._removeActive("keysCmd", 20);
				return (this._capsLock = false);
			},
			keyboard() {
				let self = this
				this.dataInit()
				this._bindEvent()
				document.getElementsByClassName('vitualKeyboard')[0].onclick = function(e) {
					e.stopPropagation();
				}
			},

			_bindEvent() {
				let self = this
				// 字母按键
				var keys = document.getElementsByClassName("keys");
				for (var o of keys) {
					o.onclick = function() {
						// self.dataInit();
						var strArr = self._getInputContent().split("");
						if (self._capsLock) {
							strArr.push(this.innerText.toUpperCase());
							self._inputNewContent(strArr.join(""));
						} else {
							strArr.push(this.innerText.toLowerCase());
							self._inputNewContent(strArr.join(""));
						}
					};
				}
				// 数字及特殊符号按键
				var keys_d = document.getElementsByClassName("keys_d");
				for (var o of keys_d) {
					o.onclick = function(e) {
						self.dataInit();
						var strArr = self.value.split("");
						var key1 = this.getElementsByTagName("div")[0].innerText; //字符
						var key2 = this.getElementsByTagName("div")[1].innerText; //数字
						if (self._shiftStatus) {
							strArr.push(key1);
						} else {
							strArr.push(key2);
						}
						self._inputNewContent(strArr.join(""));
					};
				}

				// shift、capslock、enter、tab、backspace 按钮
				var keysCmd = document.getElementsByClassName("keysCmd");
				for (var o of keysCmd) {
					o.onclick = function(e) {
						var strArr = self._getInputContent().split("");
						var keyCode = this.getAttribute("data-kid");

						if (keyCode == 8) {
							strArr.pop();
							self._inputNewContent(strArr.join(""));
						} else if (keyCode == 9) {
							strArr.push(" ");
							self._inputNewContent(strArr.join(""));
						} else if (keyCode == 13) {
							strArr = []
							self._inputNewContent(strArr.join(""));
						} else if (keyCode == 32) {
							strArr.push(" ");
							self._inputNewContent(strArr.join(""));
						} else if (keyCode == 16) {
							if (!self._shiftStatus) {
								self._addShift();
							} else {
								self._removeShift();
							}
						} else if (keyCode == 20) {
							if (!self._capsLock) {
								self._addCapsLock();
							} else {
								self._removeCapsLock();
							}
						}
					};
				}
			},

		},
	};
</script>
<style scoped>
	.vitualKeyboard {
		/* width: 800px; */

	}

	.keyboardBox {
		position: static;
		width: 1158px;
		height: 372px;
		right: 15px;
		z-index: 2018;
		font-size: 32px;
	}

	.line {
		position: relative;
		height: 82px;
		line-height: 82px;
	}
	.keys,
	.keysCmd,
	.keys_d {
		box-sizing: border-box;
		float: left;
		width: 98px;
		color: #5a5a5a;
		height: 82px;
		line-height: 82px;
		margin: 0 0 3px 3px;
		border-radius: 4px;
		border: 1px solid #fff;
		text-align: center;
		cursor: pointer;
		background: linear-gradient(180deg, #FFFFFF 0%, #DDF4FF 100%);
	}

	.keys:hover,
	.keysCmd:hover,
	.keys_d:hover {
		box-shadow: 0px 0px 3px #a2deda inset;
		background: #69b7ff !important;
		color: #fff;
	}

	.active {
		background: #69b7ff;
		color: #fff;
		box-shadow: 0px 0px 3px #a2deda inset;
	}

	.keys_d {
		height: 82px;
		line-height: 35px;
	}
	
	.k-w-200 {
		width: 200px;
	}
	
	.k-w-110 {
		width: 106px;
	}

	.gap {
		margin-left: 30px;
	}

	.gap_t {
		margin-top: 10px;
	}

	.f-s-32 {
		font-size: 32px;
	}
</style>
