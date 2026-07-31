/*
* 身份证读取
*/

const url_readCard = "http://127.0.0.1:19196/readcard"; // 开发地址

const url_openDevice = "http://127.0.0.1:19196/OpenDevice";

const url_closeDevice = "http://127.0.0.1:19196/CloseDevice";

const timeout = 5000;

function ajax(options) {
    if (options.type == null) {
        options.type = "POST";
    }
    if (options.url == null) {
        options.url = "";
    }
    if (options.timeout == null) {
        options.timeout = timeout;
    }
    if (options.onComplate == null) {
        options.onComplate = function () {

        }
    }
    if (options.onError == null) {
        options.onError = function () {

        }
    }
    if (options.onSuccess == null) {
        options.onSuccess = function (str) {
            console.log(str);
        }
    }
    if (options.data) {
        options.data = "";
    }

    let xml;
    if (typeof ActiveXObject != 'undefined') {
        let aVersions = ["Microsoft.XMLHTTP", "Msxml2.XMLHttp.6.0", "Msxml2.XMLHttp.5.0", "Msxml2.XMLHttp.4.0",
            "Msxml2.XMLHttp.3.0"
        ];
        for (let i = 0; i < aVersions.length; i++) {
            try {
                xml = new ActiveXObject(aVersions[i]);
            } catch (e) {
                console.log(e);
            }
        }
    } else if (typeof XMLHttpRequest != 'undefined') {
        xml = new XMLHttpRequest();
    }

    xml.open(options.type, options.url, true);
    let timeoutLength = options.timeout;
    let requestDone = false;
    setTimeout(function () {
        requestDone = true;
    }, timeoutLength);

    xml.responseType = "text";
    xml.onreadystatechange = function () {
        if (xml.readyState == 4 && !requestDone) {
            if (httpSuccess(xml)) {
                options.onSuccess(httpData(xml));
            } else {
				options.onError({resultFlag: -1,errorMsg: '读卡失败'})
            }
        	options.onComplate();
        	xml = null;
        }
    };
	xml.send();
    function httpSuccess(r) {
        try {
            return !r.status && location.protocol == "file:" ||
                (r.status >= 200 && r.status <= 300) || r.status == 304 || navigator.userAgent.indexOf("Safari") >= 0 &&
                typeof r.status == "undefined";
        } catch (e) {
            console.log(e);
        }
        return false;
    }

    function httpData(r) {
        try {
            let ct = r.getResponseHeader("responseType");
            if (ct) {
                if (ct == "script") {
                    eval.call(window, data);
                }
                if (ct == "xml") {
                    return r.responseXML;
                }
                if (ct == "json") {
                    return JSON.parse(r.responseText);
                }
            }
            return r.responseText;
        } catch (e) {
            console.log(e);
        }
        return null;
    }
}

function connect(callback) {
    function onSuccess(data) {
        console.log(data);
    }
	function onError(data) {
		callback(JSON.stringify(data));
	}
	try {
		let options = new Object();
		options.type = "GET";
		options.url = url_openDevice + "&t=" + Math.random();  // URL后面加一个随机参数的目的是为了防止IE内核浏览器的数据缓存
		options.timeout = timeout;
		options.onSuccess = callback || onSuccess;
		options.onError = onError;
		ajax(options);
	} catch (e) {
		console.log("读卡失败");
	}
}

function disconnect(callback) {
    function onSuccess(data) {
        console.log(data);
    }

    let options = new Object();
    options.type = "GET";
    options.url = url_closeDevice + "&t=" + Math.random();  // URL后面加一个随机参数的目的是为了防止IE内核浏览器的数据缓存
    options.timeout = timeout;
    options.onSuccess = callback || onSuccess;
    ajax(options);
}

function readCert(callback) {
    if (!callback) {
        callback = function (msg) {
            console.log("log", msg);
        }
    }

    let startDt = new Date();

    function onSuccess(data) {
        let endDt = new Date();

        let result = JSON.parse(data);
        let certType = result.certType;
        if (certType == " ") {
            certType = "身份证";
        } else if (certType == "I") {
            certType = "外国人居住证";
        } else if (certType == "J") {
            certType = "港澳台居住证";
        } else {
            certType = "未知";
        }
        result.certType = certType;
        if (result.identityPic && result.identityPic.length > 0) {
            result.identityPic = 'data:image/jpeg;base64,' + result.identityPic;
        }
        result.timeElapsed = (endDt.getTime() - startDt.getTime())

        // certType // 证件类别
        // partyName // 姓名
        // gender // 性别
        // nation // 民族
        // bornDay // 出生日期
        // certAddress // 住址
        // certNumber // 身份证号
        // certOrg // 签发机关
        // effDate // 开始期限
        // expDate // 结束期限
        // photoDisplay // 照片
        // timeElapsed // 毫秒
        // errorMsg // 读取结果
        // resultFlag // 读取结果标志
        if (callback) {
            callback(result);
        }
    }

    let options = new Object();
    options.type = "GET";
    options.url = url_readCard + "&t=" + Math.random();  // URL后面加一个随机参数的目的是为了防止IE内核浏览器的数据缓存
    options.timeout = timeout;
    options.onSuccess = onSuccess;
    ajax(options);
}

/**
 * 回调传入读取的对象
 * @param callback(obj)
 */
export function readIDCard(callback) {
    if (!callback) {
        callback = function (msg) {
            console.log("log", msg);
        }
    }
	connect(function (dataStr) {
		let data = JSON.parse(dataStr);
		if (data.resultFlag == 0) {
		    readCert(callback);
		} else {
		    let result = {
		        resultFlag: -1,
		        errorMsg: data.errorMsg,
		    };
		    callback(result);
		}
	});
    
}