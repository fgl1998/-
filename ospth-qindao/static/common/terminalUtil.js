/**
 * 添加工具类
 */
(function () {
    const terminalUtil = {
        /**
         * 广播消息处理
         * @param e
         * @private
         */
        _receivePostMessage (e) {
            if (!e) {
                return
            }
            const obj = e.data// 消息字符串结构:消息头 分隔字符串 消息体
            // 如果是请求消息
            if (typeof obj.callFn != 'undefined' && obj.callFn != null && obj.callFn != '') {
                try {
                    // 使用正则表达式对传入的代码参数进行约束，限制外界传入 eval 的参数中只包含字母和数字
                    if (!/^[a-zA-Z0-9_]+$/.test(obj.callFn)){
                        console.warn("不安全的函数名称，拒绝执行。");
                        return;
                    }
                    if (obj.callFn == '_getIframeHeight') {
                        let iHeight = document.body.scrollHeight || document.documentElement.scrollHeight
                        const callBack = obj.callBackFn// 是否反馈结果
                        if (callBack) {
                            terminalUtil._sendPostMessage(e.source, callBack, iHeight, null)
                        }
                        return
                    }
                    const callFn = eval(obj.callFn)// 消息请求的函数
                    const param = obj.param
                    if (typeof callFn != 'function') {
                        return
                    }// 请求的函数不存在
                    const resultArg = callFn.call(callFn, param)// 请求执行
                    const callBack = obj.callBackFn// 是否反馈结果
                    if (callBack) {
                        terminalUtil._sendPostMessage(e.source, callBack, resultArg, null)
                    }
                } catch (e) {
                    console.log(e)
                }
            }
        },
        /**
         * sendMessage主动发送广播消息
         * target string（iframe控件的ID）/object（iframe window,eq:如果是向父页面发送消息,则传window.parent）
         * callFn string 要访问目标iframe的方法名
         * arg 要访问目标iframe的方法的参数
         * callBackFn 消息反馈时调用的方法名
         */
        _sendPostMessage (target, callFn, param, callBackFn) {
            try {
                let source
                if (typeof target == 'string') {
                    source = document.getElementById(target)?.contentWindow || window.top.frames[target]
                    if (source === undefined) throw '无法获取目标页面'
                } else if (typeof target == 'object' && target != null) {
                    source = target
                } else {
                    source = window.top
                }
                if (typeof param == 'undefined' || param == null) {
                    param = ''
                }
                const callMessage = {}
                callMessage['callFn'] = callFn
                callMessage['param'] = param
                callMessage['callBackFn'] = callBackFn
                source.postMessage(callMessage, '*')
            } catch (e) {
                console.log(e)
            }
        },
        /**
         * 添加消息监听
         * @private
         */
        _addMessageListener () {
            terminalUtil._removeMessageListener()
            if (window.attachEvent && !terminalUtil._isIE10()) {
                window.attachEvent('onmessage', terminalUtil._receivePostMessage)
            } else {
                window.addEventListener('message', terminalUtil._receivePostMessage, true)
            }
        },
        /**
         * 移除页面消息监听
         * @private
         */
        _removeMessageListener () {
            window.removeEventListener('message', terminalUtil._receivePostMessage, false)
        },
        /**
         * 判断是否ie浏览器
         * @returns {boolean}
         * @private
         */
        _isIE () {
            return !!window.ActiveXObject || 'ActiveXObject' in window
        },
        /**
         * 获取ie浏览器版本好
         * @returns {number}
         * @private
         */
        _ieVersion () {
            // 取得浏览器的userAgent字符串
            // 判断是否IE浏览器
            const reIE = new RegExp('MSIE (\\d+\\.\\d+);')
            reIE.test(navigator.userAgent)
            return parseFloat(RegExp['$1'])
        },
        /**
         * 判断是否ie10
         * @returns {boolean}
         * @private
         */
        _isIE10 () {
            return terminalUtil._isIE() && terminalUtil._ieVersion() === 10
        },
        /**
         * 获取iframe高度（提供给父页面调用子页面方法）
         * 子页面getIframeHeight方法需要返回iframe高度，不带单位，默认px
         * @param iframe
         * @private
         */
        _getIframeHeight (iframe) {
            try {
                let height = iframe.document.body.scrollHeight || iframe.document.documentElement.scrollHeight
                window._setIframeHeight(height)
            } catch (e) {
                terminalUtil._sendPostMessage(iframe, '_getIframeHeight', null, '_setIframeHeight')
            }
        },
        /**
         * 设置iframe高度（提供给子页面调用父页面方法）
         * @param height
         * @private
         */
        _setIframeHeight (height) {
            try {
                window.parent._setIframeHeight(height)
            } catch (e) {
                terminalUtil._sendPostMessage(window.parent, '_setIframeHeight', height, null)
            }
        },
        /**
         * 设置下一步按钮不可用（提供给子页面调用父页面方法）
         * @param disabled true不可点击/false可以点击
         * @private
         */
        _setNextDisabled (disabled) {
            try {
                window.parent._setNextDisabled(disabled)
            } catch (e) {
                terminalUtil._sendPostMessage(window.parent, '_setNextDisabled', disabled, null)
            }
        },
        /**
         * 设置表单不可编辑 （提供给父页面调用子页面方法）
         * @param iframe
         * @param disabled  true不可编辑/false可编辑
         * @private
         */
        _setFormDisabled (iframe, disabled) {
            try {
                iframe._setFormDisabled(disabled)
            } catch (e) {
                terminalUtil._sendPostMessage(iframe, '_setFormDisabled', disabled, null)
            }
        },
        /**
         * 点击下一步时校验表单数据是否按要求填写（提供给父页面调用子页面方法）
         * 子页面checkFormData方法需要返回boolean值，true校验通过会进入下一步/false校验不通过，停留在当前页面
         * 子页面校验方法中同步校验时使用，异步校验时先返回false，然后异步校验完成后单独调用进入材料上传方法
         * @param iframe
         * @private
         */
        _checkFormData (iframe) {
            try {
                let flag = iframe._checkFormData()
            } catch (e) {
                terminalUtil._sendPostMessage(iframe, '_checkFormData', null, null)
            }
        },
        /**
         * 调用子页面上一步
         * @param iframe
         * @private
         */
        _toPreFormData (iframe) {
            try {
                let flag = iframe._toPreFormData()
            } catch (e) {
                terminalUtil._sendPostMessage(iframe, '_toPreFormData', null, null)
            }
        },

        /**
         * 进入材料上传步骤（提供给子页面调用父页面方法）
         * @private
         */
        _toUploadMaterials () {
            try {
                window.parent._toUploadMaterials(true)
            } catch (e) {
                terminalUtil._sendPostMessage(window.parent, '_toUploadMaterials', true, null)
            }
        },
        /**
         * 提交业务数据（提供给父页面调用子页面方法）
         * @param iframe
         * @private
         */
        _saveFormData (iframe) {
            try {
                iframe._saveFormData()
            } catch (e) {
                terminalUtil._sendPostMessage(iframe, '_saveFormData', null, null)
            }
        },
        /**
         * 跳转到办理完成界面
         * @private
         */
        _toCompletePage () {
            try {
                window.parent._toCompletePage()
            } catch (e) {
                terminalUtil._sendPostMessage(window.parent, '_toCompletePage', true, null)
            }
        },
        /**
         * 跳转到下一个页面
         * @private
         */
        _toNextPage (param) {
            try {
                window.parent._toNextPage(param)
            } catch (e) {
                terminalUtil._sendPostMessage(window.parent, '_toNextPage', param, null)
            }
        },
		/**
         * 设置材料信息
         * @private
         */
        _setMaterials (param) {
            try {
                window.parent._setMaterials(param)
            } catch (e) {
                terminalUtil._sendPostMessage(window.parent, '_setMaterials', param, null)
            }
        },
        /**
         * 消息弹窗
         * @param title 标题
         * @param message 消息内容
         * @param type 弹窗类型： info 消息提示，success 成功，error 失败，warning 警告，confirm 确认
         * @param okBack 确定回调方法名，成功回调方法需要注册到window上
         * @param cancleBack 取消成功回调方法名，成功回调方法需要注册到window上
         * @param okText  确定按钮名称
         * @param cancelText  取消按钮名称
         * @private
         */
        _alertMsgWindow (title, message, type, okBack, cancleBack, okText, cancelText) {
            let option = {
                title: title,
                content: message,
                type: type,
                okText: okText,
                cancelText: cancelText,
                okBack: okBack,
                cancleBack: cancleBack
            }
            try {
                window.parent._alertMsgWindow(option)
            } catch (e) {
                terminalUtil._sendPostMessage(window.parent, '_alertMsgWindow', option, null)
            }
        },
		/**
		 * 调用原生方法
		 * @param {Object} method 调用方法名
		 * @param {Object} callBack 回调方法名，回调方法需要注册到window上
		 * @param {Object} param
		 */
		_originalMethod (method, param, callBack) {
			let option = {
				method: method,
				param: param,
				callBack: callBack
			}
			try {
			    window.parent._originalMethod(option)
			} catch (e) {
			    terminalUtil._sendPostMessage(window.parent, '_originalMethod', option, null)
			}
		}
    }
    if (!window.terminalUtil) {
        window.terminalUtil = terminalUtil
        terminalUtil._addMessageListener()
    }
})()
