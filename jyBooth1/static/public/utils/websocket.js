//是否已经连接上ws
let isOpenSocket = false
//心跳间隔，单位毫秒
let heartBeatDelay = 60000
let heartBeatInterval = null
//心跳时发送的消息文本
let heartBeatText = ''
//最大重连次数
let reconnectTimes = 10
let reconnectInterval = null
//重连间隔，单位毫秒
let reconnectDelay = 15000

let wsUrl = 'wss://echo.websocket.org' // 可以测试用
// let wsUrl = 'wss://192.168.130.115:8082/websocket/hardware' // 可以测试用

let socketTask = null

//这个参数是防止重连失败之后onClose方法会重复执行reconnect方法，导致重连定时器出问题
//连接并打开之后可重连，且只执行重连方法一次
let canReconnect = false

//封装的对象，最后以模块化向外暴露，
//init方法 初始化socketTask对象
//completeClose方法 完全将socketTask关闭（不重连）
//其他关于socketTask的方法与uniapp的socketTask api一致
let ws = {
  socketTask: null,
  init,
  send,
  completeClose,
  initData,
}

function init(userId, sourceType, messageCallback) {
  // 两个参数：发送不同的标识&处理接收消息
  socketTask = uni.connectSocket({
    url: wsUrl + '?websocketUserId=' + userId + '&messageSourceType=' + sourceType,
    complete: () => {},
  })
  socketTask.onOpen((res) => {
    //console.log("ws连接成功")
    clearInterval(heartBeatInterval)
    clearInterval(reconnectInterval)
    isOpenSocket = true
    canReconnect = true
    send(JSON.stringify({ messageType: 'HEARTBEAT', data: 'ping' }))

    initData()
    //开启心跳机制
    heartBeat()
  })
  socketTask.onMessage((res) => {
    //自定义处理onMessage方法
    // //console.log(res)
    messageCallback(res.data)
  })
  socketTask.onClose(() => {
    if (isOpenSocket) {
      //console.log("ws与服务器断开")
    } else {
      //console.log("连接失败")
    }
    isOpenSocket = false
    if (canReconnect) {
      reconnect()
      canReconnect = false
    }
  })
  ws.socketTask = socketTask
}

function heartBeat() {
  heartBeatInterval = setInterval(() => {
    send(JSON.stringify({ messageType: 'HEARTBEAT', data: 'ping' }))
  }, heartBeatDelay)
}

function onWsMessage(event, messageCallback) {
  // 处理接收消息
  const jsonStr = event.data
  console.log('onWsMessage接收到服务器的数据: ', jsonStr)
  messageCallback(jsonStr)
}
//{"fromUserId":"123","toUserId":"1234","data":"ni hao hello","messageSourceType":"XCX"}
function send(value) {
  ws.socketTask.send({
    data: value,
    async success() {
      console.log('消息标识发送成功', value)
    },
  })
}

function reconnect() {
  //停止发送心跳
  clearInterval(heartBeatInterval)
  //如果不是人为关闭的话，进行重连
  if (!isOpenSocket) {
    let count = 0
    reconnectInterval = setInterval(() => {
      //console.log("正在尝试重连")
      init()
      count++
      //重连一定次数后就不再重连
      if (count >= reconnectTimes) {
        clearInterval(reconnectInterval)
        //console.log("网络异常或服务器错误")
      }
    }, reconnectDelay)
  }
}

function completeClose() {
  //先将心跳与重连的定时器清除
  clearInterval(heartBeatInterval)
  clearInterval(reconnectInterval)
  canReconnect = false
  ws.socketTask.close()
}

function initData() {
  //初始化时向后台发送当前设备id信息，并获取绑定关系

  let systemInfo = uni.getStorageSync('systemInfo')
  let data = {
    ace711: systemInfo.mainBoardSN + systemInfo.cpuSerial, //摊位唯一硬件码使用主板序列号+cpu序列号
    ace769: '1', //硬件类型(1台式电脑、2移动平板、3电视屏)
    ace824: '1', //渠道类型（1摊位桌面系统、2摊位小屏）
    ace823: uni.getSystemInfoSync().osName, //操作系统类型
  }

  let param = {
    fromUserId: systemInfo.mainBoardSN + systemInfo.cpuSerial,
    data: data,
    toUserId: 'DEVELOPER',
    messageSourceType: 'TW',
    messageType: 'INITSMALLSCREEN',
  }
  send(JSON.stringify(param))
}

module.exports = ws
