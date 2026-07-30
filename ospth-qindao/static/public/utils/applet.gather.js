/**
 * 数据采集js
 */
const base = require('./applet.base.js');
const pageData = require('../../page.json')
let BehaviorGather = {
    /**
     * 发送ajax请求
     * @param url 请求地址
     * @param param 入参
     * @param successCallback 成功回调
     * @param failCallback 失败回调
     * @param async 是否同步异步
     */
    go_send:function(url, param, successCallback, failCallback, async) {
        base.post(base.BASE_URL.replace('api', 'rest/api/gather'), param, data=> {
        	uni.setStorageSync("visitId", data.resultData.visitId)
        	if(typeof successCallback == 'function') successCallback(data);
        }, failCallback)
        return;
    },
    /**
     * 获取浏览器窗口宽度
     * @returns {number}
     */
    getClientWidth: function() {
		if(typeof document == "undefined") {
			let windowInfo = uni.getWindowInfo()
			return windowInfo.screenWidth
		}
        let clientWidth;
        if (document.documentElement && document.documentElement.clientWidth) {
            clientWidth = document.documentElement.clientWidth;
        } else if (document.body) {
            clientWidth = document.body.clientWidth;
        } else if (window.pageYOffset) {
            clientWidth = window.pageYOffset;
        }
        return clientWidth;
    },
    /**
     * 获取字符串中指定字符的最后出现位置
     * @param str 字符串
     * @param c 需要查找的字符
     * @returns {*}
     */
    lastIndexOf: function(str, c) {
        let x = str.indexOf(c);
        if (x == -1) {
            return x;
        }
        for (let i = 0; i < str.length - x; i++) {
            let index = str.indexOf(c, x + 1);
            if (index == -1) {
                break;
            }
            x = index;
        }
        return x;
    },
    /**
     * 获取页面唯一标识
     */
    getMenuId: function() {
        let url = BehaviorGather.getUrl();
        if(!url) {
            return "";
        }
		if(url.indexOf("#") != -1) {
			url = url.split("#")[0]
		}
        if (url.indexOf("rest/authorize") != -1) {
            return BehaviorGather.requestParam(url, "serviceNo");
        }
        let index = BehaviorGather.lastIndexOf(url, "/");
        let suffix = url;
        if(index != -1) {
            suffix = url.substring(index+1);
        }
        if(suffix.indexOf(".") == -1) {
            return suffix;
        }
        return suffix.substring(0, suffix.indexOf("."));
    },
    /**
     * 获取搜索引擎的关键字
     * @param url 地址
     * @returns {string|string|*}
     */
    getKeyWord: function(url) {
        if (url.toString().indexOf("baidu") > 0) {
            return BehaviorGather.requestParam(url, "wd");
        } else if (url.toString().indexOf("google") > 0) {
            return BehaviorGather.requestParam(url, "q");
        } else if (url.toString().indexOf("sogou") > 0) {
            return BehaviorGather.requestParam(url, "query");
        } else if (url.toString().indexOf("soso") > 0) {
            return BehaviorGather.requestParam(url, "w");
        } else if (url.toString().indexOf("so") > 0) {
            return BehaviorGather.requestParam(url, "q");
        } else {
            return "";
        }
    },
    /**
     * 获取连接地址某个参数的值
     * @param url 地址
     * @param key 参数名称
     * @returns {string|*}
     */
    requestParam: function(url, key) {
        let paraString = url.substring(url.indexOf("?") + 1, url.length).split("&");
        let paraObj = {};
        for (let i = 0; i<paraString.length; i++) {
            let j = paraString[i];
            paraObj[j.substring(0, j.indexOf("="))] = j.substring(j.indexOf("=") + 1, j.length);
        }
        let returnValue = paraObj[key];
        if (typeof (returnValue) == "undefined") {
            return "";
        } else {
            return returnValue;
        }
    },
    /**
     * 获取系统信息
     * @returns {string}
     */
    getOSInfo: function() {
		if(typeof navigator == "undefined") {
			try {
				let deviceInfo = uni.getDeviceInfo();
				let system = deviceInfo.system.toLowerCase();
				if(system.indexOf('ios') > -1) {
					return "Iphone";
				} else if(system.indexOf('android') > -1) {
					return "Android";
				} else {
					return "";
				}
			} catch(e) {
				console.log(e)
				return "";
			}
		}
		let userAgent = navigator.userAgent;
		if(!userAgent) {
			userAgent = navigator.swuserAgent;
		}
		if(!userAgent) {
			return;
		}
        userAgent = userAgent.toLowerCase();
        let name = "Unknown";
        if(userAgent.indexOf("win") > -1) {
            name = "Windows";
            if(userAgent.indexOf("windows nt 5.0") > -1) {
                name = "Windows 2000";
            } else if(userAgent.indexOf("windows nt 5.1") > -1 || userAgent.indexOf("windows nt 5.2") > -1) {
                name = "Windows XP";
            } else if(userAgent.indexOf("windows nt 6.0") > -1) {
                name = "Windows Vista";
            } else if(userAgent.indexOf("windows nt 6.1") > -1 || userAgent.indexOf("windows 7") > -1) {
                name = "Windows 7";
            } else if(userAgent.indexOf("windows nt 6.2") > -1 || userAgent.indexOf("windows 8") > -1) {
                name = "Windows 8";
            } else if(userAgent.indexOf("windows nt 6.3") > -1) {
                name = "Windows 8.1";
            } else if(userAgent.indexOf("windows nt 6.2") > -1 || userAgent.indexOf("windows nt 10.0") > -1) {
                name = "Windows 10";
            }
        } else if(userAgent.indexOf("iphone") > -1) {
            name = "Iphone";
        } else if(userAgent.indexOf("mac") > -1) {
            name = "Mac";
        } else if(userAgent.indexOf("x11") > -1 || userAgent.indexOf("unix") > -1 || userAgent.indexOf("sunname") > -1 || userAgent.indexOf("bsd") > -1) {
            name = "Unix";
        } else if(userAgent.indexOf("linux") > -1) {
            if(userAgent.indexOf("android") > -1) {
                name = "Android"
            } else {
                name = "Linux";
            }
        } else if (userAgent.indexOf("adobeair") != -1) {
            name = "Adobeair";
        }  else {
            name = "Unknown";
        }
        return name;
    },
    /**
     * 获取浏览器类型
     * @returns {string}
     */
    getBrowerInfo: function() {
		let systemInfo = uni.getSystemInfoSync();
		let swuserAgent;
		if(typeof navigator != "undefined" && typeof navigator.swuserAgent != "undefined") {
			swuserAgent = navigator.swuserAgent;
		}
        let Browser = (function (window) {
			if(typeof window == "undefined") {
				let name = '未知';
				let desc = '未知';
				let version = '';
				if(typeof systemInfo != "undefined" && systemInfo != "" && systemInfo != null) {
					let uniPlatform = systemInfo.uniPlatform
					version = systemInfo.version;
					if(uniPlatform == "mp-alipay") {
						name = "alipay";
						desc = "支付宝客户端";
					} else if(uniPlatform == "mp-weixin") {
						name = "weixin";
						desc = "微信客户端";
					}
				} else if(typeof swuserAgent != "undefined") {
					if(swuserAgent.indexOf("AlipayClient") != -1) {
						version = swuserAgent.match(/AlipayClient\/([\d.]+)/)[1];
						name = "alipay";
						desc = "支付宝客户端";
					}
				}
				return {"name": name, "desc": desc, "version": version}
			}
            let document = window.document,
                navigator = window.navigator,
                agent = navigator.userAgent.toLowerCase(),
                //IE8+支持.返回浏览器渲染当前文档所用的模式
                //IE6,IE7:undefined.IE8:8(兼容模式返回7).IE9:9(兼容模式返回7||8)
                //IE10:10(兼容模式7||8||9)
                IEMode = document.documentMode,
                //chorme
                chrome = window.chrome || false,
                System = {
                    agent: agent,
                    //是否为IE
                    isIE: /trident/.test(agent),
                    //Gecko内核
                    isGecko: agent.indexOf("gecko") > 0 && agent.indexOf("like gecko") < 0,
                    //webkit内核
                    isWebkit: agent.indexOf("webkit") > 0,
                    //是否为标准模式
                    isStrict: document.compatMode === "CSS1Compat",
                    //是否支持subtitle
                    supportSubTitle: function () {
                        return "track" in document.createElement("track");
                    },
                    //是否支持scoped
                    supportScope: function () {
                        return "scoped" in document.createElement("style");
                    },

                    //获取IE的版本号
                    ieVersion: function () {
                        let rMsie = /(msie\s|trident.*rv:)([\w.]+)/;
                        let ma = window.navigator.userAgent.toLowerCase()
                        let match = rMsie.exec(ma);
                        try {
                            return match[2];
                        } catch (e) {
                            return IEMode;
                        }
                    },
                    //Opera版本号
                    operaVersion: function () {
                        try {
                            if (window.opera) {
                                return agent.match(/opera.([\d.]+)/)[1];
                            } else if (agent.indexOf("opr") > 0) {
                                return agent.match(/opr\/([\d.]+)/)[1];
                            }
                        } catch (e) {
                            return 0;
                        }
                    }
                };

            try {
                //浏览器类型(IE、Opera、Chrome、Safari、Firefox)
                System.type = System.isIE ? "IE" :
                    window.opera || (agent.indexOf("opr") > 0) ? "Opera" :
                        (agent.indexOf("chrome") > 0) ? "Chrome" :
                            //safari也提供了专门的判定方式
                            window.openDatabase ? "Safari" :
                                (agent.indexOf("firefox") > 0) ? "Firefox" :
                                    'unknow';

                //版本号
                System.version = (System.type === "IE") ? System.ieVersion() :
                    (System.type === "Firefox") ? agent.match(/firefox\/([\d.]+)/)[1] :
                        (System.type === "Chrome") ? agent.match(/chrome\/([\d.]+)/)[1] :
                            (System.type === "Opera") ? System.operaVersion() :
                                (System.type === "Safari") ? agent.match(/version\/([\d.]+)/)[1] :
                                    "0";

                //浏览器外壳
                System.shell = function () {
                    //edge浏览器
                    if (agent.indexOf("edge") > 0) {
                        System.version = agent.match(/edge\/([\d.]+)/)[1] || System.version;
                        return {"name": "edge", "desc": "edge浏览器"};
                    }
                    //edge浏览器(谷歌内核)
                    if (agent.indexOf("edg") > 0) {
                        System.version = agent.match(/edg\/([\d.]+)/)[1] || System.version;
                        return {"name": "edge", "desc": "edge浏览器"};
                    }
                    //遨游浏览器
                    if (agent.indexOf("maxthon") > 0) {
                        System.version = agent.match(/maxthon\/([\d.]+)/)[1] || System.version;
                        return {"name": "maxthon", "desc": "傲游浏览器"};
                    }
                    //QQ浏览器
                    if (agent.indexOf("qqbrowser") > 0) {
                        System.version = agent.match(/qqbrowser\/([\d.]+)/)[1] || System.version;
                        return {"name": "qqbrowser", "desc": "QQ浏览器"};
                    }
                    //搜狗浏览器
                    if (agent.indexOf("se 2.x") > 0) {
                        return {"name": "sogou", "desc": "搜狗浏览器"};
                    }
                    //opera浏览器
                    if (agent.indexOf('opera') > 0) {
                        return {"name": "opera", "desc": "opera浏览器"};
                    }
                    //msie浏览器
                    if (agent.indexOf('msie') > 0) {
                        System.version = agent.match(/msie\/([\d.]+)/)[1] || System.version;
                        return {"name": "msie", "desc": "msie浏览器"};
                    }
                    //火狐浏览器
                    if (agent.indexOf('firefox') > 0) {
                        System.version = agent.match(/firefox\/([\d.]+)/)[1] || System.version;
                        return {"name": "firefox", "desc": "火狐浏览器"};
                    }
                    //Chrome:也可以使用window.chrome && window.chrome.webstore判断
                    if (chrome && System.type !== "Opera") {
                        let external = window.external,
                            clientInfo = window.clientInformation,
                            //客户端语言:zh-cn,zh.360下面会返回undefined
                            clientLanguage = clientInfo.languages;

                        //猎豹浏览器:或者agent.indexOf("lbbrowser")>0
                        if (external && 'LiebaoGetVersion' in external) {
                            return {"name": "liebaobrowser", "desc": "猎豹浏览器"};
                        }
                        //百度浏览器
                        if (agent.indexOf("bidubrowser") > 0) {
                            System.version = agent.match(/bidubrowser\/([\d.]+)/)[1] || agent.match(/chrome\/([\d.]+)/)[1];
                            return {"name": "bidubrowser", "desc": "百度浏览器"};
                        }
                        //360极速浏览器和360安全浏览器
                        if (System.supportSubTitle() && typeof clientLanguage === "undefined") {
                            //object.key()返回一个数组.包含可枚举属性和方法名称
                            let storeKeyLen = Object.keys(chrome.webstore).length;
                            return {"name": "360se", "desc": storeKeyLen > 1 ? '360极速浏览器' : '360安全浏览器'};
                        }
                        //UC浏览器
                        if (agent.indexOf('ubrowser') > 0) {
                            System.version = agent.match(/ubrowser\/([\d.]+)/)[1] || System.version;
                            return {"name": "ubrowser", "desc": "UC浏览器"};
                        }
                        return {"name": System.type, "desc": System.type == "unknow"? "未知": System.type};
                    }
                    return {"name": System.type, "desc": System.type == "unknow"? "未知": System.type};
                };
                //浏览器名称(如果是壳浏览器,则返回壳名称)
                let shell = System.shell();
                System.name = shell.name;
                System.desc = shell.desc;
            } catch (e) {}
            return System;
        })(window);
        if (Browser.name == undefined || Browser.name == "") {
            Browser.name = "Unknown";
            Browser.version = "Unknown";
        } else if (Browser.version == undefined) {
            Browser.version = "Unknown";
        }
        return Browser;
    },
    /**
     * 获取页面标题
     * @returns {string}
     */
    getTitle: function() {
		if(typeof document == "undefined") {
			let title = '';
			let url = BehaviorGather.getUrl();
			if(pageData && pageData.length>0) {
				let pageInfo = pageData.find(item=>item.path == url);
				if(pageInfo && pageInfo.title) {
					title = pageInfo.title;
				} else {
					title = url;
				}
			}
			return title;
		}
        return document.title.replace(/['"]/g, '');
    },
    /**
     * 获取屏幕分辨率
     * @returns {string}
     */
    getScreenSize: function () {
		if(typeof document == "undefined") {
			let windowInfo = uni.getWindowInfo()
			return windowInfo.screenWidth + '*' + windowInfo.screenHeight;
		}
        if (self.screen) {
            return window.screen.width + '*' + window.screen.height;
        } else if (self.java) {
            let screenSize = java.awt.Toolkit.getDefaultToolkit().getScreenSize();
            return screenSize.width + '*' + screenSize.height;
        }
    },
    /**
     * 获取上一页地址
     * @returns {string}
     */
    getReferrer: function () {
		if(typeof document == "undefined") {
			let pages = getCurrentPages()
			let referrer = ''
			if(pages.length > 1) {
				referrer = pages[pages.length-2].route
			}
			return referrer;
		}
		return document.referrer;
    },
    /**
     * 获取当前页地址
     * @returns {string}
     */
    getUrl: function () {
		if(typeof document == "undefined") {
			let pages = getCurrentPages()
			let url = ''
			if(pages.length > 0) {
				url = pages[pages.length-1].route
			}
			return url;
		}
		return document.URL;
    },
    /**
     * 获取数据采集后台地址
     */
    getBehaviorPath: function(){
		let result = {}
        result["path"] = "";
        result["sysflag"] = base.CHANNEL_CODE;
        return result;
    },
    /**
     * 发送采集数据请求
     * @param param
     */
    sendGatherData: function (param) {
        let behaviorPath = BehaviorGather.getBehaviorPath();
        //上一页地址
        let oldlink = BehaviorGather.getReferrer();
        //获取浏览器信息
        let browerInfo = BehaviorGather.getBrowerInfo();
		let visitId = uni.getStorageSync("visitId")
        //加载浏览器信息到服务器缓存中
        let gatherData = {
			"visitId": visitId,
            "sysFlag": behaviorPath.sysflag,
            "link": BehaviorGather.getUrl(),
            "menuId": BehaviorGather.getMenuId(),
            "oldLink": oldlink,
            "sysOs": BehaviorGather.getOSInfo(),
            "title": BehaviorGather.getTitle(),
            "screen": BehaviorGather.getScreenSize(),
            "browserType": browerInfo.desc,
            "browserVersion": browerInfo.version,
            "keyword": BehaviorGather.getKeyWord(oldlink)
        };
		if(typeof document == "undefined" && gatherData.link == "pages/scopes/psmp/service/service") {
			//业务办理页面，替换为真实事项页面
			let pages = getCurrentPages();
			if(pages.length > 0) {
				let page = pages[pages.length-1];
				if(page.options && page.options.param) {
					let option = JSON.parse(decodeURIComponent(page.options.param));
					gatherData.link = option.url;
					gatherData.title = option.handleItemName;
					gatherData.menuId = option.handleItemCode;
				}
			}
		}
		
        if(typeof returnCitySN != "undefined") {
            gatherData["ip"] = returnCitySN["cip"];
        }
		Object.assign(gatherData, param)
        BehaviorGather.go_send(behaviorPath.path + "/rest/api/gather", gatherData);
    }
};

function saveGatherData() {
	BehaviorGather.sendGatherData({});
}
/**
 * 通过module.exports方式提供给外部调用
 */
module.exports = {
	saveGatherData: saveGatherData
}