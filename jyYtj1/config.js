let Config = {}

// ----------太原测试环境外网暴露地址 ---------
// Config.extranetUimSocketServer = `https://yinhaijy.cn:9001/gamsg`;
// Config.extranetUimSocketServer = "http://10.164.10.134:42003/gamsg";
// Config.extranetUimServerUrl = `https://yinhaijy.cn:9001/gauim`;
// Config.extranetUimServerUrl = "http://10.164.10.134:42002/gauim"
// Config.wxAuthServer = `https://yinhaijy.cn:9001/gauim/wx/api/sign`;
// Config.extranetUimFileServer = `http://172.20.21.203:8007`;

Config.uimFileServer = Config.extranetUimFileServer // 文件服务地址
Config.uimServer = Config.extranetUimSocketServer // 消息服务地址
Config.serverUrl = Config.extranetUimServerUrl // 业务服务地址
Config.fileServer = Config.extranetUimFileServer // 文件服务地址
Config.SecretId = 'dWltMTYyMjEwNTM0ODk2MA==' // 统一存储SecretId
Config.SecretKey = '4GxD0iXE3C4lSom-VF5_F2Itmm7lhOO77BNp6EZA' // 统一存储SecretKey
Config.Bucketid = 'uim' // 统一存储Bucketid
Config.msgFileIsFs = true

Config.avatar =
  'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAFoAAABaCAIAAAC3ytZVAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAA2ZpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMC1jMDYwIDYxLjEzNDc3NywgMjAxMC8wMi8xMi0xNzozMjowMCAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0UmVmPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VSZWYjIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtcE1NOk9yaWdpbmFsRG9jdW1lbnRJRD0ieG1wLmRpZDpGQjkxOEUxNTE2MjA2ODExODcxRkRGRTJFNjg3RDQ5QiIgeG1wTU06RG9jdW1lbnRJRD0ieG1wLmRpZDpFMEI4OTI0QjE1MTMxMUUyOUE4RkM5NENCNjA2RkE3OSIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDpFMEI4OTI0QTE1MTMxMUUyOUE4RkM5NENCNjA2RkE3OSIgeG1wOkNyZWF0b3JUb29sPSJBZG9iZSBQaG90b3Nob3AgQ1M1IE1hY2ludG9zaCI+IDx4bXBNTTpEZXJpdmVkRnJvbSBzdFJlZjppbnN0YW5jZUlEPSJ4bXAuaWlkOjAxNDM4OEZEMTgyMDY4MTE4OEM2QTFDQjI3QzJBQjA3IiBzdFJlZjpkb2N1bWVudElEPSJ4bXAuZGlkOkZCOTE4RTE1MTYyMDY4MTE4NzFGREZFMkU2ODdENDlCIi8+IDwvcmRmOkRlc2NyaXB0aW9uPiA8L3JkZjpSREY+IDwveDp4bXBtZXRhPiA8P3hwYWNrZXQgZW5kPSJyIj8++N51KwAABI1JREFUeNrsm21T20YQx3WSJesJyZZxFAqhhIY0SR++/wfo275op2nKJA4BGvD4WViybMuWuw0pZTqNsaXbs09zO3oBjJFPP+3t/nfvjvz087kk7B+TBQKBQ+AQOAQOgUPgEDgEDoFD4BA4BA6BQ+AQOAQOgUPgYGmaqmwJjtKmvtg2NX/X9lzjjsV4OguG4+tWGMXTTY2KsG8dVxz9wHfcHf1LH7gJJ81O2OlHi0VxcRAi1avWvu+YhrrK56fJvNWNJtPZ7a+zedoL4jRdFGGy1D3raL+yVoyADx88du7/JR4nr9+17wBxGUrVkvziePf5US1/vDR09eSoxrF3mLr6/XMfiNC6oWuXbUsLoyl/3qEo8qtndYosPs+7qsXlZDncc8safe9z7DJ/OGSZPN61Me5sGSqBLMUXDpjkQAQnYRO9XOIMB2QBPJcuawpnONQSYhlSUmTOcCwwBTZeyYeFYzqbC++4L6gRpbTCIY4EUR1wl2ihHoVL4s0QVWkUYzmIrBD+cEwTrPBBePQOvYylxPCSOAqO2x6Hi1ZrVRwdoziUMJqDIM9/oNrj+F9L00W7HzUu+nT1Hv1BPz2oYrO4rZj9mu3XrK2eLCCQKl9ukW9/74MyjrKqEMKMhlSiXSjS9mqGLDAKRco4ZrOUJQ7qiwyUcSSzFHtl6L4NabfUZereGwzHbFjM00UviLddhrV6ERsc163hfJ5uO47uYIS3LHRnN+HkshlwINIh2P9x1hlPsOq3eJycXw1+e9vCCFIo8hEC/i+nTeoT+zPr950/mzdIvVgsNQ0Z902jPaLdE4M6ZYTaZ8OOdnTLtvOPA9xSCPXuzU5IMe9etYbYDUf00vPN+w6VRANz5OI6wB4tOg6QBq8brXCUiwgEzrcfugv8vWIsNlJCWP31tAnZMfPzfPg4yAl0i3DcJkjIjqdn3QwoG5e9K6ohefM4MhegIF6a7ZDZCJniSNefLCzrY9Y4COPu0JbjUBSB457p6y+OELm4ODLskMLbyrF5HO7O2usASKttm8dhGuqOtTYOy1CRdiBuEgch5PiJl+0fq45RNBwnX3uZV7CfHXq1islmnOgzEyg8fVK1DC37ED/tB+gORudXAeoeKywcmqo4dhmcHGInrVgIDgJXP4g7/dFgOEZqfFDDoSgyOIK7o1cdHW/LcdU14JI+HZxLknkUJ5O/f0ijeDoaJ/kVfV4ckC/gpQGCDFkjp6KD6z9fCox6g7jdizJ3A7JsdyFEqoAXuIbnGox1wYoGznJ22Q/CCS4OmBF7dfurRw6DDS35DaLMu4veWit1a7xbCA0vjuulEjcHs3erpqmrvzfWOE246rP5Nfu7k0ccsbgLbT9+669+/mWlx4N88c2hRwiRODTI+i+P6ysq/YdxAAXQlHyi+NdHQNrSweHXrO1MH2tZ3bNsS6OAY993pELY4V4lLw5wM7xzeIwNtKJtarlweK4hFchgyuTC8SBO7hwkFw7U85/sDR5nuXSSH6yUpGKZufQFy8sVB8s+JbNSOCOO4rGQHjo4tgxHmqbFw7F84eYvAQYAV3GSDCN4gToAAAAASUVORK5CYII=' // 人员默认头像base64字符串
// Config.oogeAvatar = './xxx/xxx/xxx.png'; // 应用号默认头像
Config.oogeAvatar = './static/file/work_xw.png'
Config.isSyncAllUserDept = false // 是否同步所有用户或组织机构数据
Config.platformType = 'WCMiniWeb' // 平台
Config.canRecord = true // 是否可以录音
Config.hasDefaultMenu = true // 输入框是否有默认菜单，包括照片、文件、拍摄
Config.sendFileLimitSize = 50 * 1024 * 1024 // 发送文件大小限制
Config.showMsgReadStatus = true // 是否显示消息已读状态
Config.disablePasteFile = true // 是否禁止图片文件粘贴入输入框
Config.showMarkdownStyle = true // 是否显示代码块以及 markdown 格式化
Config.msgSetting = {
  // 消息显示风格
  leftMsg: {
    showName: true, // 是否显示左侧消息昵称，没有设置时时根据单聊或者群聊判断是否显示头像
    showAvatar: true, // 是否显示左侧消息头像，不设置时默认显示
  },
  rightMsg: {
    showName: false, // 是否显示右侧消息昵称，不设置时默认不显示
    showAvatar: false, // 是否显示右侧消息头像，不设置时默认显示
  },
}
if (Config.showMsgReadStatus)
  Config.timerConfig = {
    // 消息已读回执请求时间
    sendMsgReadIntervalTime: {
      min: 3000, // 消息已读回执最小间隔时间
      random: 500, // 消息已读回执附加随机时间
      resumeMin: 0, // 消息已读回执失败后重试最小间隔时间
      resumeRandom: 6000, // 消息已读回执失败后重试附加随机时间
    },
  }

export default Config
