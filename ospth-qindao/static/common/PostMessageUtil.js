(function () {
  const PostMessageUtil = window.PostMessageUtil = {}
  PostMessageUtil.messageType = 'yinhaiMessage'// 消息类型，固定常量
  // 处理接收到的消息
  PostMessageUtil.receiveMessage = function (event) {
    if (!event) {
      // 防止失误调用
      return
    }
    PostMessageUtil.messageSourceObject = event.source// 消息来源窗口对象
    PostMessageUtil.messageData = event.data // 消息数据（未解析）
    if (typeof PostMessageUtil.messageData !== 'string') {
      return
    }
    PostMessageUtil.messageData = PostMessageUtil.messageData.trim()
    if (!PostMessageUtil.messageData.startsWith('{')) {
      return
    }
    // 解析消息
    try {
      const messageObj = JSON.parse(PostMessageUtil.messageData)
      if (messageObj.messageType !== PostMessageUtil.messageType) {
        return
      }
      // 使用正则表达式对传入的代码参数进行约束，限制外界传入 eval 的参数中只包含字母和数字
      if (!/^[a-zA-Z0-9_]+$/.test(messageObj.callFunction)){
        console.warn("不安全的函数名称，拒绝执行。");
        return;
      }
	  console.log(messageObj.callFunction);
      PostMessageUtil.callFunction = eval('(' + messageObj.callFunction + ')')// 消息通知要调用执行的函数
      PostMessageUtil.parameter = messageObj.parameter// 消息通知要调用的执行的函数的入参，默认不传参数
      PostMessageUtil.callbackFunctionName = messageObj.callbackFunctionName// 消息处理完成后的回调方法
      PostMessageUtil.callFunction(PostMessageUtil.parameter)// 执行调用方法
    } catch (e) {
      console.log(e)
    }
  }
  // 消息回执调用工具类
  PostMessageUtil.receiveMessageCallback = function (parameter) {
    if (!PostMessageUtil.callbackFunctionName) {
      return
    }
    const callbackFunctionName = PostMessageUtil.callbackFunctionName
    PostMessageUtil.callbackFunctionName = ''// 回执消息执行完成，清理回执函数
    PostMessageUtil.sendMessage(PostMessageUtil.messageSourceObject, callbackFunctionName, parameter, null)
  }
  //成功消息回调，resultCode为'1'
  PostMessageUtil.successCallback = function () {
    PostMessageUtil.receiveMessageCallback({resultCode: '1'})
  }
  //失败消息回调，resultCode为'0'
  PostMessageUtil.failCallback = function () {
    PostMessageUtil.receiveMessageCallback({resultCode: '0'})
  }
  // 发送消息（targetFrameObject目标窗口对象，例如frame.contentWindow）
  PostMessageUtil.sendMessage = function (targetFrameObject, callFunction, parameter, callbackFunction, enforceSend) {
    if (enforceSend) {
      // 强行推送消息
      PostMessageUtil.callbackFunctionName = ''
    }
    if (PostMessageUtil.callbackFunctionName) {
      alert('接收的消息回执还没处理完成，无法发送消息')
      return
    }
    if (!targetFrameObject) {
      alert('无法确定要发送消息的目标窗口')
    }
    const messageObj = {}
    messageObj.messageType = PostMessageUtil.messageType
    messageObj.callFunction = callFunction
    messageObj.parameter = parameter
    messageObj.callbackFunctionName = callbackFunction || ''
    targetFrameObject.postMessage(JSON.stringify(messageObj), '*')
  }
  // 注册消息接收监听器
  if (window.attachEvent) {
    window.attachEvent('onmessage', PostMessageUtil.receiveMessage)
  } else {
    window.addEventListener('message', PostMessageUtil.receiveMessage)
  }

  // 后面的代码是，风控工具实现代码逻辑
  // 后面的代码是，风控工具实现代码逻辑
  // 后面的代码是，风控工具实现代码逻辑
  // 后面的代码是，风控工具实现代码逻辑
  // 后面的代码是，风控工具实现代码逻辑
  PostMessageUtil.needRiskValid = true // 是否需要风控
  PostMessageUtil.riskOperateState = 0 // 风控操作状态（0 初始状态-允许触发风控操作，1 风控操作过程中-不允许再触发风控操作，2 已有风险操作结果）
  PostMessageUtil.riskResultType = '1' // 风险校验结果（1没风险，2风险警告，3风险提级审核，4风险阻断）
  // 重置风控状态
  PostMessageUtil.resetRiskState = function () {
    PostMessageUtil.riskOperateState = 0
  }
  // 风控初始化方法，this_ vue对象，sourceFunction 调用风控逻辑的函数引用，args调用风控逻辑的函数的参数列表（最多支持4个）
  PostMessageUtil.initRisk = function (this_, sourceFunction, args0, args1, args2, args3) {
    PostMessageUtil.this_ = this_
    PostMessageUtil.sourceFunction = sourceFunction
    PostMessageUtil.args0 = args0
    PostMessageUtil.args1 = args1
    PostMessageUtil.args2 = args2
    PostMessageUtil.args3 = args3
  }
  // 风控结束根据结果回调触发风控的方法
  PostMessageUtil.callSourceFunction = function () {
    PostMessageUtil.sourceFunction(PostMessageUtil.args0, PostMessageUtil.args1, PostMessageUtil.args2, PostMessageUtil.args3)
  }
  // 本地风控，即不跨域的实现
  PostMessageUtil.riskValidLocal = function (flowNo, taskId, riskRule) {
    if (!PostMessageUtil.needRiskValid) {
      return true
    }
    if (PostMessageUtil.riskOperateState === 2) {
      PostMessageUtil.riskOperateState = 0 // 重新设置为初始状态，允许重新触发风控校验
      if (PostMessageUtil.riskResultType === '1') {
        // 没有风险，继续执行
        return true
      } else if (PostMessageUtil.riskResultType === '2') {
        // 风险警告，继续执行
        return true
      } else if (PostMessageUtil.riskResultType === '3') {
        // 风险提级审核，风险校验过程中在流程中新增了特定流程变量，此处继续执行
        return true
      } else if (PostMessageUtil.riskResultType === '4') {
        // 风险阻断，不执行后续逻辑
        return false
      }
      return false
    }
    if (PostMessageUtil.riskOperateState !== 0) {
      // 如果不是处于风控操作过程中状态，该方法不做任何反应
      return
    }
    PostMessageUtil.riskOperateState = 1
    PostMessageUtil.flowNo = flowNo
    PostMessageUtil.taskId = taskId
    PostMessageUtil.riskRule = riskRule
    // PostMessageUtil.riskValidCallback(JSON.stringify(riskValidParameter()))
    // return false
	return true
  }
  PostMessageUtil.riskValid = function (targetFrameObject, flowNo, taskId) {
    if (!PostMessageUtil.needRiskValid) {
      return true
    }
    if (PostMessageUtil.riskOperateState === 2) {
      PostMessageUtil.riskOperateState = 0 // 重新设置为初始状态，允许重新触发风控校验
      if (PostMessageUtil.riskResultType === '1') {
        return true // 没有风险，继续执行
      } else if (PostMessageUtil.riskResultType === '2') {
        return true // 风险警告，继续执行
      } else if (PostMessageUtil.riskResultType === '3') {
        return true // 风险提级审核，风险校验过程中在流程中新增了特定流程变量，此处继续执行
      } else if (PostMessageUtil.riskResultType === '4') {
        return false // 风险阻断，不执行后续逻辑
      }
      return false
    }
    if (PostMessageUtil.riskOperateState !== 0) {
      // 风控操作不是初始化状态，不触发风控校验
      return false
    }
    PostMessageUtil.riskOperateState = 1
    PostMessageUtil.flowNo = flowNo
    PostMessageUtil.taskId = taskId
    PostMessageUtil.sendMessage(targetFrameObject, 'riskValidParameterGet', null, 'riskValidCallback')
    return false
  }
  // 风控获取业务参数的方法(工具封装)
  PostMessageUtil.riskValidParameterGet = window.riskValidParameterGet = function () {
    const param = riskValidParameter() // 获取风控参数
    PostMessageUtil.receiveMessageCallback(param)
  }
  // 风控获取业务参数的方法(业务页面示例写法)
  // PostMessageUtil.riskValidParameter = window.riskValidParameter = function () {
  //   const param = {}
  //   param.aac001 = '20111111'
  //   return param
  // }
  // 风控获取参数后的回调方法
  PostMessageUtil.riskValidCallback = window.riskValidCallback = function (riskParameter) {
    if (PostMessageUtil.riskOperateState !== 1) {
      // 如果不是处于风控操作过程中状态，该方法不做任何反应
      return
    }
    const param = {}
    param.riskParameter = typeof riskParameter === 'object' ? JSON.stringify(riskParameter) : riskParameter
    param.flowNo = PostMessageUtil.flowNo
    param.taskId = PostMessageUtil.taskId
    param.riskRule = PostMessageUtil.riskRule
    try {
      Base.submit(null, { url: '/ospfs/business/web/riskValidRestApi/riskValid', data: param, }, {
        successCallback: (data) => {
          PostMessageUtil.riskOperateState = 2
          PostMessageUtil.riskResultType = data.data.resultData.riskResultType
          if (PostMessageUtil.riskResultType === '1') {
          // 没有风险
            PostMessageUtil.callSourceFunction() // 调用原方法
          } else if (PostMessageUtil.riskResultType === '2') {
          // 风险警告
            PostMessageUtil.this_.$confirm({
              title: '风险警告',
              content: data.data.resultData.riskResultMessage,
              onOk: () => {
                PostMessageUtil.callSourceFunction() // 调用原方法
              },
              onCancel: () => {
                PostMessageUtil.riskResultType = '4' // 如果选择的是取消按钮，效果和风险阻断一样
                PostMessageUtil.callSourceFunction() // 调用原方法，重置风控逻辑，允许重新触发风控
              },
            })
            // Modal.warning({ title: '风险警告', content: data.data.resultData.riskResultMessage, })
            // PostMessageUtil.sourceFunction() // 调用原方法
          } else if (PostMessageUtil.riskResultType === '3') {
          // 风险提级审核
            Modal.warning({ title: '风险警告', content: data.data.resultData.riskResultMessage, })
            PostMessageUtil.callSourceFunction() // 调用原方法
          } else if (PostMessageUtil.riskResultType === '4') {
          // 风险阻断，不执行后续逻辑
            Modal.error({ title: '风险警告', content: data.data.resultData.riskResultMessage, })
          }
        },
        failCallback: (data) => {
        },
      })
    } catch (e) {
      // 如果出现异常，默认为风险阻断
      PostMessageUtil.riskOperateState = 2
      PostMessageUtil.riskResultType = 4
      console.log(e)
    }
  }
})()
