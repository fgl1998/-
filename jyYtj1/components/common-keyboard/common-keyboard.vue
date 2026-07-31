<template>
	<div class="vitualKeyboard">


		<div class="search">
			<!-- <input name="inputArea" class="inputArea" @input='inputValue' :placeholder="placeholder" :value="value"
				:id='idName' key="" @click="createKeyboard" /> -->
			<input name="inputArea" :class="classType" :type="type" @input='inputValue' :placeholder="placeholder" :value="value"
				:id='idName' key="" @click="createKeyboard" />
			<!-- <input type="button" @click="searchAseetesProd"/> -->
		</div>

		<div class="keyboardBox" v-show="keyboardBox">
			<p class="showInput"></p>
			<hr>
			<div class="chinesePrompt">

				<div class="arrow">
					<i class="up"></i>
					<i class="down"></i>
				</div>

				<div class="chinesePrompt-box">

					<span class="span" v-for="(item,index) in chinese" :key="index">{{item}}</span>


				</div>
			</div>
			<div class="line gap_t">
				<div class="keys_d t-a-l" data-kid="192">
					<div>~</div>
					<div>`</div>
				</div>
				<div class="keys_d t-a-l" data-kid="49">
					<div>!</div>
					<div>1</div>
				</div>
				<div class="keys_d t-a-l" data-kid="50">
					<div>@</div>
					<div>2</div>
				</div>
				<div class="keys_d t-a-l" data-kid="51">
					<div>#</div>
					<div>3</div>
				</div>
				<div class="keys_d t-a-l" data-kid="52">
					<div>$</div>
					<div>4</div>
				</div>
				<div class="keys_d t-a-l" data-kid="53">
					<div>%</div>
					<div>5</div>
				</div>
				<div class="keys_d t-a-l" data-kid="54">
					<div>^</div>
					<div>6</div>
				</div>
				<div class="keys_d t-a-l" data-kid="55">
					<div>&</div>
					<div>7</div>
				</div>
				<div class="keys_d t-a-l" data-kid="56">
					<div>*</div>
					<div>8</div>
				</div>
				<div class="keys_d t-a-l" data-kid="57">
					<div>(</div>
					<div>9</div>
				</div>
				<div class="keys_d t-a-l" data-kid="48">
					<div>)</div>
					<div>0</div>
				</div>
				<div class="keys_d t-a-l" data-kid="189">
					<div>_</div>
					<div>-</div>
				</div>
				<div class="keys_d t-a-l" data-kid="187">
					<div>+</div>
					<div>=</div>
				</div>
				<div class="keysCmd k-w-80 l-h-40 f-s-14" data-kid="8">删除</div>
			</div>
			<div class="line">
				<div class="keysCmd k-w-50" data-kid="9">空格</div>
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
				<div class="keys_d t-a-l" data-kid="219">
					<div>{</div>
					<div>[</div>
				</div>
				<div class="keys_d t-a-l" data-kid="221">
					<div>}</div>
					<div>]</div>
				</div>
				<div class="keys_d k-w-75 t-a-l" data-kid="220">
					<div>|</div>
					<div>\</div>
				</div>
			</div>
			<div class="line">
				<div class="keysCmd k-w-70 f-s-14" data-kid="20">大/小写</div>
				<div class="keys" data-kid="65">A</div>
				<div class="keys" data-kid="83">S</div>
				<div class="keys" data-kid="68">D</div>
				<div class="keys" data-kid="70">F</div>
				<div class="keys" data-kid="71">G</div>
				<div class="keys" data-kid="72">H</div>
				<div class="keys" data-kid="74">J</div>
				<div class="keys" data-kid="75">K</div>
				<div class="keys" data-kid="76">L</div>
				<div class="keys_d t-a-l" data-kid="186">
					<div>:</div>
					<div>;</div>
				</div>
				<div class="keys_d t-a-l" data-kid="222">
					<div>"</div>
					<div>'</div>
				</div>
				<div class="keysCmd key_enter" data-kid="13">确定</div>
			</div>
			<div class="line">
				<div class="keysCmd k-w-100" data-kid="16">中英文转换</div>
				<div class="keys" data-kid="90">Z</div>
				<div class="keys" data-kid="88">X</div>
				<div class="keys" data-kid="67">C</div>
				<div class="keys" data-kid="86">V</div>
				<div class="keys" data-kid="66">B</div>
				<div class="keys" data-kid="78">N</div>
				<div class="keys" data-kid="77">M</div>
				<div class="keys_d t-a-l" data-kid="188">
					<div></div>
					<div>,</div>
				</div>
				<div class="keys_d t-a-l" data-kid="190">
					<div>></div>
					<div>.</div>
				</div>
				<div class="keys_d t-a-l" data-kid="191">
					<div>?</div>
					<div>/</div>
				</div>
				<div class="keysCmd k-w-120" data-kid="16">中英文转换</div>
			</div>
			<!-- <div class="line">
            <div class="keysCmd k-w-704" data-kid="32"></div>
        </div> -->

		</div>

	</div>
</template>

<script>
	import _dictionary from "./dictionary.js";
	//import keyboard from "./keyboard.js";
	var myWindow = window
	export default {
		components: {},
		props: {
			placeholder: {
				type: String,
				default: ""
			},
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
			}
		},
		data() {
			return {
				classType: this.classStyle,
				type: this.inputType,
				chinese: [],
				value: this.record,
				keyboardBox: false,
				_shiftStatus: false,
				_capsLock: false,
				cStr: "",
				isShowAll: false,
				height: 0,
				_inputID: '',
				top: 0,
				innerText: "",
				keyboardObj: '',
				pathBox: ''
				// showNumber = 0;
				// path.innerHTML = "";

			};
		},
		watch: {
			value(value) {


			},

		},
		mounted() {
			//this.$set(this.obj,属性名，属性值)
			//createKeyboard(){
			/* 	let fn = this.keyboard();
				let func = new fn;
			//	console.log(this.id);
				//func.dataInit();
				func.addKeyboard(this.idName); */

			//},
			/* window['getComputedStyle'] = (val) => {
			       this.heightGet(val)
			    } */
		},

		// 光标移开输入框后需要   this.$emit("getSearchValue", value);

		methods: {
			inputValue(e) {
				this.value = e.target.value

			},

			createKeyboard() {
				this.dataInit()
				this.keyboardBox = true
				this.keyboardObj = document.getElementsByClassName('keyboardBox')[0]
				this.pathBox = document.getElementsByClassName("chinesePrompt-box")[0]
				this.keyboard()
				/* 	let fn = this.keyboard();
					let func = new fn;
					func.addKeyboard(this.idName); */

			},

			/* arrowUp(e) {
			
				if (this.top) {
					this.top += 40;
					this.top = this.top + "px";
				} else return false;
			},
			arrowDown(e) {
				//e.stopPropagation();
						
				if (Math.abs(this.top) >= this.height - 40) {
					return false;
				} else {
					this.top -= 40;
					this.top = this.top + "px";
				}
			}, */
			dataInit() {
				// console.log('重新触发了一下！！！！！')
				
				this.cStr = "";
				this.isShowAll = false;
				this.top = 0;
				this.height = 0;
				this.innerText = "";
				// showNumber = 0;
				// path.innerHTML = "";
				this.chinese = [];
				this._shiftStatus = false;
				this._capsLock = false;
				this.cSt = "";
				this.isShowAll = false;
				this.height = 0;
				
				document.getElementsByClassName('showInput')[0].innerText = ''
				this._removeCapsLock()
				this._removeShift()
			},

			// 显示虚拟键盘
			_showKeyboard(id) {
				this.keyboardBox = true
				//this._bindEvent();
			},
			// 隐藏虚拟键盘
			_hideKeyboard() {
				this.keyboardBox = false
			},




			_getInputContent() {
				// var inputContent = document.getElementById(_inputID).value;
				var inputContent = this.value;
				return inputContent;
			},
			// 输入新内容
			_inputNewContent(str) {
				document.getElementById(this.idName).value = str;
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
				document.getElementsByClassName('showInput')[0].innerText = ''
				this.chinese = []
				return (this._shiftStatus = false);
			},

			// 添加CapsLock状态
			_addCapsLock() {
				//console.log('触发大小写')
				this._addActive("keysCmd", 20);
				return (this._capsLock = true);
			},
			// 取消CapsLock状态
			_removeCapsLock() {
				this._removeActive("keysCmd", 20);
				this.chinese = []
				document.getElementsByClassName('showInput')[0].innerText = ''
				return (this._capsLock = false);
			},
			_changeChinese(str) {

				str ? (this.cStr += str) : (this.cStr = this.cStr.substring(0, this.cStr.length - 1));
				this.chinese = _dictionary[this.cStr];
				/* 	if (this.cStr.length === 0) {
						alert(1)
						this.dataInit();
						return;
					} */
				document.getElementById(this.idName).parentNode.parentNode.getElementsByClassName('showInput')[0]
					.innerText = this.cStr;
				if (!this.chinese) {
					this.isShowAll = true;
				} else {
					this.isShowAll = false;
				}
				if (!this.isShowAll) {
					let arr = this.chinese.split("");
					this.chinese = arr

					let self = this
					setTimeout(function() {
						self.height = myWindow.getComputedStyle(self.pathBox, null)["height"].replace("px", "");
					})

				}
			},

			/* path(e) {
				var strArr = this._getInputContent().split("");
				strArr.push(e.target.innerText.slice(-1));
				cStr = "";
				this._inputNewContent(strArr.join(""));
				this.dataInit();
				}, */
			keyboard() {
				/* this.keyboardObj = document.getElementsByClassName('keyboardBox')[0],
					_inputID,
					_shiftStatus = false,
					_capsLock = false,
					cStr = "",
					isShowAll = false,
					top = 0,
					height = 0; */
				//汉字提示区
				/* 	var path = document.getElementsByClassName("chinesePrompt-box")[0],
						arrowUp = document.querySelector(".up"),
						arrowDown = document.querySelector(".down"),
						showInput = document.querySelector(".showInput"); */
				let self = this
				let arrowUp = document.querySelector(".up"),
					arrowDown = document.querySelector(".down"),
					showInput = document.querySelector(".showInput");
				this.dataInit()
				this._bindEvent()
				//给中文区域添加点击事件
				this.pathBox.onclick = function(e) {
					var strArr = self._getInputContent().split("");
					strArr.push(e.target.innerText.slice(-1));

					this.cStr = "";
					self._inputNewContent(strArr.join(""));
					// self.dataInit();
				};
				arrowUp.onclick = function(e) {
					if (self.top) {
						self.top += 40;
						self.pathBox.style.top = self.top + "px";
					} else return false;
				};
				arrowDown.onclick = function(e) {

					if (Math.abs(self.top) >= self.height - 40) {
						return false;
					} else {
						self.top -= 40;
						self.pathBox.style.top = self.top + "px";
					}
				};

				//数据初始化
				/* function dataInit() {
					cStr = "";
					isShowAll = false;
					top = 0;
					height = 0;
					showInput.innerText = "";
					// showNumber = 0;
					// path.innerHTML = "";
					self.chinese = []
					path.style.top = "0px";
				} */
				// 显示虚拟键盘
				/* var _showKeyboard = function(id) {
					self.keyboardBox = true
					_bindEvent();
				};
				// 隐藏虚拟键盘
				var _hideKeyboard = function() {
							self.keyboardBox = false
				}; */
				//音转字
				/* var _changeChinese = function(str) {
					str ? (cStr += str) : (cStr = cStr.substring(0, cStr.length - 1));
					let chinese = _dictionary[cStr];
					if (cStr.length === 0) {
						dataInit();
						return;
					}
					showInput.innerText = cStr;
					if (!chinese) {
						isShowAll = true;
					} else {
						isShowAll = false;
					}
					if (!isShowAll) {

						let arr = chinese.split("");
						self.chinese = arr


						setTimeout(function() {
							height = window.getComputedStyle(path, null)["height"].replace("px", "");
						})

					}
				}; */
				// 获取输入框的内容
				/* 
								var _getInputContent = function() {
							
									// var inputContent = document.getElementById(_inputID).value;
									var inputContent = self.value;
									return inputContent;
								};
								// 输入新内容
								var _inputNewContent = function(str) {
									document.getElementById(_inputID).value = str;
									self.value = str
								}; 

								// 添加classname
								function _addClass(obj, cls) {
									var obj_class = obj.className,
										blank = obj_class != "" ? " " : "";
									var added = obj_class + blank + cls;
									obj.className = added;
								}
								// 删除classname
								function _removeClass(obj, cls) {
									var obj_class = " " + obj.className + " ";
									obj_class = obj_class.replace(/(\s+)/gi, " ");
									var removed = obj_class.replace(" " + cls + " ", " ");
									removed = removed.replace(/(^\s+)|(\s+$)/g, "");
									obj.className = removed;
								}
								// 为按钮添加active
								function _addActive(cls, keycode) {
									var keys = document.getElementsByClassName(cls);
									for (var o of keys) {
										if (o.getAttribute("data-kid") == keycode) {
											_addClass(o, "active");
										}
									}
								}
								// 为按钮取消active
								function _removeActive(cls, keycode) {
									var keys = document.getElementsByClassName(cls);
									for (var o of keys) {
										if (o.getAttribute("data-kid") == keycode) {
											_removeClass(o, "active");
										}
									}
				
			}
				*/
				// 添加shift状态
				/* var _addShift = function() {
					_addActive("keysCmd", 16);
					return (_shiftStatus = true);
				};
				// 取消shift状态
				var _removeShift = function() {
					_removeActive("keysCmd", 16);
					return (_shiftStatus = false);
				};

				// 添加CapsLock状态
				var _addCapsLock = function() {
					_addActive("keysCmd", 20);
					return (_capsLock = true);
				};
				// 取消CapsLock状态
				var _removeCapsLock = function() {
					_removeActive("keysCmd", 20);
					return (_capsLock = false);
				}; */

				//给中文区域添加点击事件
				/* 	path.onclick = function(e) {
						var strArr = _getInputContent().split("");
						strArr.push(e.target.innerText.slice(-1));
					
						cStr = "";
						_inputNewContent(strArr.join(""));
						dataInit();
					}; */
				// 给按钮绑定触发键盘事件的事件
				/* var _bindEvent = function() {
					// 字母按键
				
					var keys = keyboardObj.getElementsByClassName("keys");
		
					for (var o of keys) {
				
						o.onclick = function() {
					
							if (_shiftStatus && !_capsLock) {
								var str = this.innerText.toLowerCase();
								_changeChinese(str);
							} else {
								dataInit();
								var strArr = _getInputContent().split("");
								if (_capsLock) {
									strArr.push(this.innerHTML.toUpperCase());
									_inputNewContent(strArr.join(""));
								} else {
									strArr.push(this.innerHTML.toLowerCase());
									_inputNewContent(strArr.join(""));
								}
							}

						};
					}
					// 数字及特殊符号按键
					var keys_d = document.getElementsByClassName("keys_d");
					for (var o of keys_d) {
						o.onclick = function() {
							dataInit();
							var strArr = _getInputContent().split("");
							var key1 = this.getElementsByTagName("div")[0].innerText;
							var key2 = this.getElementsByTagName("div")[1].innerText;
							if (_shiftStatus) {
									strArr.push(key1);
							} else {
								strArr.push(key2);
							}
							_inputNewContent(strArr.join(""));
						};
					}

					// shift、capslock、enter、tab、backspace 按钮
					var keysCmd = document.getElementsByClassName("keysCmd");
					for (var o of keysCmd) {
						o.onclick = function(e) {
							var strArr = _getInputContent().split("");
							var keyCode = this.getAttribute("data-kid");
					
							if (keyCode == 8) {
								if (_shiftStatus && !_capsLock) {
									_changeChinese();
									if (showInput.innerText == '') {
										_removeShift();
									}
								} else {
									strArr.pop();
									_inputNewContent(strArr.join(""));

								}
							} else if (keyCode == 9) {
								strArr.push(" ");
								_inputNewContent(strArr.join(""));
							} else if (keyCode == 13) {
								//strArr.push("\n");
								//_inputNewContent(strArr.join(""));
								_hideKeyboard()
								 self.$emit("getSearchValue", self.value);
							} else if (keyCode == 32) {
								strArr.push(" ");
								_inputNewContent(strArr.join(""));
							} else if (keyCode == 16) {
								if (!_shiftStatus) {
									_addShift();
								} else {
									_removeShift();
								}
							} else if (keyCode == 20) {
								if (!_capsLock) {
									_addCapsLock();
								} else {
									_removeCapsLock();
								}
							}
						};
					}
				}; */
				document.getElementsByClassName('vitualKeyboard')[0].onclick = function(e) {
					e.stopPropagation();
				}
				/* 	document.addEventListener('click', function(e) {
						_hideKeyboard()
					})
					var keyboard = function() {

					}; */

				// 输入框绑定键盘
				/* 	keyboard.prototype.addKeyboard = function(id) {
						_inputID = id;
						var inputObj = document.getElementById(id);
						console.log(inputObj)
						//inputObj.onclick = _showKeyboard;
						_bindEvent();
					};
					return keyboard; */
			},

			_bindEvent() {
				let self = this
				// 字母按键
				var keys = document.getElementsByClassName("keys");
				for (var o of keys) {
					o.onclick = function() {
						// console.log('================')
						// console.log(self._shiftStatus)
						// console.log(self._capsLock)
						
						if (self._shiftStatus) {
							var str = this.innerText.toLowerCase();
							self._changeChinese(str);
						} else {
							// self.dataInit();
							var strArr = self._getInputContent().split("");
							if (self._capsLock) {
								strArr.push(this.innerText.toUpperCase());
								self._inputNewContent(strArr.join(""));
							} else {
								strArr.push(this.innerText.toLowerCase());
								self._inputNewContent(strArr.join(""));
							}
						}

					};
				}
				// 数字及特殊符号按键
				var keys_d = document.getElementsByClassName("keys_d");
				for (var o of keys_d) {
					o.onclick = function() {
						self.dataInit();
						var strArr = self._getInputContent().split("");
						var key1 = this.getElementsByTagName("div")[0].innerText;
						var key2 = this.getElementsByTagName("div")[1].innerText;
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
							if (self._shiftStatus) {
								self._changeChinese();
								let showInput = document.getElementsByClassName('showInput')[0].innerText
								if (showInput == '') {
									self._removeShift();
								}
							} else {
								strArr.pop();
								self._inputNewContent(strArr.join(""));

							}
						} else if (keyCode == 9) {
							strArr.push(" ");
							self._inputNewContent(strArr.join(""));
						} else if (keyCode == 13) {
							//strArr.push("\n");
							//_inputNewContent(strArr.join(""));
							self.dataInit()
							document.getElementsByClassName('showInput')[0].innerText = ''
							self._hideKeyboard()
							self.$emit("getSearchValue", self.value);
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
		/* 	mounted() {
				let fn = this.keyboard();
				let func = new fn;
				console.log(this.id)
				func.addKeyboard(this.id);
			} */
	};
</script>
<style scoped>
	.vitualKeyboard {
		/* width: 800px; */

	}

	.search {
		width: 650px;
		height: 50px;
		/* position: absolute; */
	}

	.inputArea {
		width: 650px;
		height: 100%;
		border-radius: 4px;
		font-size: 22px;
		background-color: #ffffff;
		border: 1px solid #eeeeee;
		font-family: "STHeitiSC";
		text-indent: 16px;
		padding-right: 64px;
		box-sizing: border-box;
	}
	
	.input-box {
		width: 480px;
		height: 65px;
		line-height: 65px;
		border: solid 2px #bed4e9;
		box-sizing: border-box;
	}

	input[type="button"] {
		position: absolute;
		width: 64px;
		height: 100%;
		top: 0;
		right: 0;
		border-top-right-radius: 4px;
		border-bottom-right-radius: 4px;
		background-color: #d24364;
		/* background-image: url(../../assets/images/search_btn.png); */
		background-position: center center;
		background-repeat: no-repeat;
		cursor: pointer;
		z-index: 2;
	}

	.chinesePrompt {
		width: 680px;
		height: 50px;
		overflow: hidden;
		position: relative;
		box-sizing: border-box;
	}

	.arrow {
		position: absolute;
		right: 0px;
		z-index: 2999;
		display: flex;
		justify-content: flex-start;
		align-items: center;
	}

	.arrow i {
		display: block;
		width: 48px;
		height: 48px;
		margin-left: 20px;
	}

	.up {
		background: url("img_arrow_up.png") no-repeat;
		background-size: 48px 48px;
		/* margin-top: 5px; */
	}

	.down {
		background: url("img_arrow_down.png") no-repeat;
		background-size: 48px 48px;
		/* margin-top: 10px; */
	}

	.chinesePrompt .chinesePrompt-box {
		font-size: 0;
		position: relative;
		top: 0;
		box-sizing: border-box;
		width: 520px;

	}

	.span {
		font-size: 20px;
		margin: 0;
		padding: 0;
		display: inline-block;
		line-height: 50px;
		cursor: pointer;
		width: 100px;
		height: 50px;
		text-align: center;
	}

	.keyboardBox {
		position: absolute;
		width: 708px;
		height: 310px;
		margin-top: 30px;
		right: 15px;
		padding: 10px;
		z-index: 2018;
		background: #188bed;

		font-size: 16px;
	}

	.line {
		position: relative;
		height: 50px;
		line-height: 50px;
	}

	.showInput {
		margin: 0;
		padding: 0 20px;
		/* position: absolute; */
		/* bottom: 0; */
		color: #333333;
		line-height: 40px;
		height: 40px;
		width: 500px;
		overflow: hidden;
		/* background: #fff; */
		/* border-bottom: 1px solid #fff; */
		text-overflow: ellipsis;
		white-space: nowrap;
		font-size: 20px;
	}

	.keys,
	.keysCmd,
	.keys_d {
		box-sizing: border-box;
		float: left;
		width: 45px;
		color: #5a5a5a;
		height: 45px;
		line-height: 45px;
		margin: 0 0 3px 3px;
		border-radius: 4px;
		border: 1px solid #fff;
		text-align: center;
		cursor: pointer;
		background: #fff;
	}

	.keys:hover,
	.keysCmd:hover,
	.keys_d:hover {
		box-shadow: 0px 0px 3px #a2deda inset;
		background: #69b7ff;
		color: #fff;
	}

	.active {
		background: #69b7ff;
		color: #fff;
		box-shadow: 0px 0px 3px #a2deda inset;
	}

	.keys_d {
		height: 45px;
		line-height: 20px;
	}

	.key_enter {
		width: 102px;
	}

	.k-w-50 {
		width: 50px;
	}

	.k-w-70 {
		width: 70px;
	}

	.k-w-75 {
		width: 75px;
	}

	.k-w-80 {
		width: 80px;
	}

	.k-w-100 {
		width: 100px;
	}

	.k-w-120 {
		width: 120px;
	}

	.k-w-704 {
		width: 704px;
	}

	.gap {
		margin-left: 30px;
	}

	.gap_t {
		margin-top: 10px;
	}

	.line .l-h-40 {
		line-height: 40px;
	}

	.f-s-14 {
		font-size: 14px;
	}

	.t-a-l {
		padding-left: 15px;
		text-align: left;
	}
</style>
