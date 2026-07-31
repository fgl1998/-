/**
 * 社保卡读取
 */

const url = "ws://127.0.0.1:47903";
// 渠道ID
const strak = "51160102GF";
// 密钥
const strkey = "8a18c83178424a1eb86def537085c500";

let isOpen = false;
let sbktimer = undefined;

// 开启 webSocket
function SbkWebSocket(options) {
	this.ws = undefined;
	if (!isOpen) {
		this.reConnect(options);
	}
}

SbkWebSocket.prototype.reConnect = function(options) {
	if ('WebSocket' in window) {
		this.ws = new WebSocket(url);
	} else if ('MozWebSocket' in window) {
		this.ws = new MozWebSocket(url);
	}
	if (this.ws) {
		this.ws.onopen = function() {
			isOpen = true;
			console.log("Open WebSocket Success！");
		};

		this.ws.onmessage = function(message) {
			console.log(message);
		};

		this.ws.onerror = function(error) {
			console.log("Open WebSocket Error");
		}

		this.ws.onclose = function() {
			isOpen = false;
			console.log("Close WebSocket！");
			if (sbktimer) {
				window.clearTimeout(sbktimer);
			}
			sbktimer = setTimeout(() => {
				if (this.reConnect) {
					this.reConnect();
				}
			}, 5000);
		};
	}
}

SbkWebSocket.prototype.closeSocket = function() {
	if (this.ws) {
		this.ws.close();
	}
}

SbkWebSocket.prototype.onmessage = function(callback) {
	if (this.ws) {
		this.ws.onmessage = function(message) {
			callback(message);
		};
	}
}

SbkWebSocket.prototype.sendWsMessage = function(message) {
	if (this.ws) {
		this.ws.send(message);
	}
}

SbkWebSocket.prototype.iReadCard = function(iType, iAuthType, pCardInfo, pFileAddr) {
	this.sendWsMessage("{\"function\":\"iReadCard\",\"iType\":\"" + iType + "\",\"iAuthType\":\"" + iAuthType +
		"\",\"pCardInfo\":\"" + pCardInfo + "\",\"pFileAddr\":\"" + pFileAddr + "\"}");
}

SbkWebSocket.prototype.iReadCardBasSc = function(strak, strkey) {
	this.sendWsMessage("{\"func\":\"iReadCardBasSc\",\"in\":[\"3\",\"" + strak + "\",\"" + strkey + "\",\"\"]}");
}

let ows = new SbkWebSocket({});

/**
 * 回调传入读取的对象
 * @param callback(obj)
 */
export function readSbCard(callback) {
	if (!callback) {
		callback = function(msg) {
			console.log("log", msg);
		}
	}
	let startDt = new Date();
	if (callback) {
		if (ows.ws.readyState != '1') {
			callback({
				resultFlag: -1,
				errorMsg: '读卡失败，设备WebSocket服务连接异常[' + ows.ws.readyState + ']'
			});
		} else {
			ows.onmessage(function(msg) {
				let endDt = new Date();
				if (msg.data) {
					let data;
					try {
						data = JSON.parse(msg.data);
					} catch (e) {
						data = {
							code: -1,
							msg: "数据转换错误:" + msg.data
						};
					}
					if (data.code == 1 && data.biz_data && data.biz_data.pOutInfo) {
						let pOutInfo = data.biz_data.pOutInfo.split("|");
						let result = {
							resultFlag: 0,
							errorMsg: "读卡成功",
							certOrg: pOutInfo[0],
							certNumber: pOutInfo[1],
							partyName: pOutInfo[4],
							timeElapsed: (endDt.getTime() - startDt.getTime())
						};
						callback(result);
					} else {
						let result = {
							resultFlag: -1,
							errorMsg: data.msg,
							timeElapsed: (endDt.getTime() - startDt.getTime())
						};
						callback(result);
					}
				} else {
					let result = {
						resultFlag: -1,
						errorMsg: "读卡失败",
						timeElapsed: (endDt.getTime() - startDt.getTime())
					};
					callback(result);
				}
			});
		}
	}
	ows.iReadCardBasSc(strak, strkey);
}