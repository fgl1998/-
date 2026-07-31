import api from './api.js'
let time = 5; //默认5秒请求时间
let header = {
	"content-type": "application/x-www-form-urlencoded"
}
let url = "http://127.0.0.1:18889/api/";
//1.连接 2.读卡 3.获取状态 4 断开连接
let requestUrl = [{
	id: 1,
	requestUrl: "connect"
}, {
	id: 2,
	requestUrl: "readCert"
}, {
	id: 3,
	requestUrl: "getStatus"
}, {
	id: 4,
	requestUrl: "disconnect"
}];

export default {
	callCard: function(id, param, callback) {
		uni.request({
			url: url + requestUrl.filter(x=>x.id==id)[0].requestUrl,
			method: "POST",
			timeout: time * 1000,
			header: header,
			data: param,
			success: (res) => {
				callback(res)
			},
			fail: (err) => {
				api.showToast("调用超时")
				callback(err)
			}
		});
	}

}
