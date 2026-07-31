// 正式地址
// const ltDefaultUrl = 'https://192.168.10.5/template/uimChatLive/index.html#'
const ltDefaultUrl = 'https://192.168.3.10:8082/index.html#'

// 测试地址
// const ltDefaultUrl='https://127.0.0.1:8082/#'

export default {
    // 聊天包跳转页面地址
    singleCommunication: ltDefaultUrl + '/uim', //单聊页面接口
    singleChatList: ltDefaultUrl + '/singleChatList', //个人消息列表
    companyChatList: ltDefaultUrl + '/companyChatList', //单位消息列表
    liveAddress: ltDefaultUrl + '/videoPull', //直播页面接口--拉流
    livePushAddress: ltDefaultUrl + '/videoStreaming', //直播页面接口--推流
    toSendPersonInfo: (this_, data) => {
        // 获取登录人信息----jy202_hrm120（个人）   jy002_base104（单位）
        // jy001_base102 (对无user_id的数据生成user_id并查询基本信息)
        let param = {}
        if (data.aac001) {
            param = {
                // method: 'jy202_hrm120',
                method: 'jy001_base102',
                aac001: data.aac001,
            }
        } else if (data.aab001) {
            param = {
                // method: 'jy002_base104',
                method: 'jy001_base102',
                aab001: data.aab001,
            }
        }
        return new Promise((resolve, reject) => {
            this_.$appRequest.post({
                data: param
            }).then(res => {
                //console.log('res', res);
                if (res.serviceSuccess) {
                    let result = res.data.result
                    let info = {}
                    if (result.ab01Info && result.ab01MemberInfo) {
                        info = {
                            ...res.data.result.ab01Info,
                            ...res.data.result.ab01MemberInfo
                        }
                    }
                    if (result.ac01Info && result.ac01MemberInfo) {
                        info = {
                            ...res.data.result.ac01Info,
                            ...res.data.result.ac01MemberInfo
                        }
                    }
                    // let info = res.data.data
                    // if (info.aab001) {
                    // 	// 人员规模aab056 所属行业aab022  单位类型 aab019
                    // 	info.aab056 = info.aab056 ? this_.$utils.getLableByValue("AAB056", info
                    // 			.aab056) :
                    // 		'--'
                    // 	info.aab022 = info.aab022 ? this_.$utils.getLableByValue("AAB022", info
                    // 			.aab022) :
                    // 		'--'
                    // 	info.aab019 = info.aab019 ? this_.$utils.getLableByValue("AAB019", info
                    // 			.aab019) :
                    // 		'--'
                    // } else {
                    // 	info.age = info.aac006 ? this_.$utils.getAge(info.aac006.substr(0, 10)) : ''
                    // 	info.acc217_dsc = this_.$utils.getLableByValue('ACC217', info.acc217)
                    // 	info.aac011_dsc = this_.$utils.getLableByValue('AAC011', info.aac011)
                    // 	info.user_id = info.aac301 ? info.aac301 : ''
                    // }
                    resolve(info)
                } else {
                    this_.$utils.showToast("请求异常")
                    reject(false)
                }
            }).catch(err => {
                reject(false)
            })
        })
    },
    // 单位跳转聊天列表
    toChatList(nowUser) {
        if (nowUser.aab001 && nowUser.aac001) {
            uni.navigateTo({
                url: '/pages/find/other/outterPage?url=' + this.companyChatList + '&from=chatList'
            })
        } else if (!nowUser.aab001 && nowUser.aac001) {
            uni.navigateTo({
                url: '/pages/find/other/outterPage?url=' + this.singleChatList + '&from=chatList'
            })
        }
    },
    /**
     * @param {this_ }全局Vue对象
     * @param {msg}  包含聊天信息 {isCompany:boolean,aac001,aab001,commInfo}
     *
     */
    toOpenUimPage: (this_, userInfo, comuInfo) => {
        //console.log('userInfo', userInfo);
        //console.log('comuInfo', comuInfo);
        let comInfo = {}
        // hr
        if (userInfo.aab001 && userInfo.aac001) {
            comInfo = {
                nowUser: {
                    aab001: userInfo.aab001,
                    aac001: userInfo.aac001,
                    aab004: userInfo.aab004,
                    aac003: userInfo.aac003,
                    user_id: userInfo.user_id
                },
                communicator: {
                    aac001: comuInfo.aac001,
                    aac003: comuInfo.aac003,
                    user_id: comuInfo.user_id,
                },
                about: {
                    comuInfo: {
                        ...comuInfo
                    }
                }
            }
        }
        // 求职者
        if (!userInfo.aab001 && userInfo.aac001) {
            comInfo = {
                nowUser: {
                    aac001: userInfo.aac001,
                    aac003: userInfo.aac003,
                    user_id: userInfo.user_id,
                },
                communicator: {
                    aab001: comuInfo.aab001,
                    aac001: comuInfo.aac001,
                    aab004: comuInfo.aab004,
                    aac003: comuInfo.aac003,
                    user_id: comuInfo.user_id
                },
                about: {
                    comuInfo: {
                        ...comuInfo
                    }
                }
            }
        }
        //console.log('comInfo', comInfo);
        uni.navigateTo({
            url: '/pages/find/other/outterPage?url=' + this_.$outerNeed.singleCommunication +
                '&commInfo=' + encodeURIComponent(JSON.stringify({
                    // from: from,
                    comInfo: comInfo
                }).replace(/\%/g, '%25').replace(/\&/g, '%26').replace(/\?/g, '%3F').replace(/\#/g, '%23'))
        })

        // let nowParam = null,
        // 	communicateParam = null
        // if (msg.isCompany) {
        // 	nowParam = {
        // 		aab001: msg.aab001
        // 	}
        // 	communicateParam = {
        // 		aac001: msg.aac001
        // 	}
        // } else {
        // 	nowParam = {
        // 		aac001: msg.aac001
        // 	}
        // 	communicateParam = {
        // 		aab001: msg.aab001
        // 	}
        // }
        // Promise.all([this_.$outerNeed.toSendPersonInfo(this_, nowParam), this_.$outerNeed.toSendPersonInfo(this_,
        // 	communicateParam)]).then((data) => {
        // 	//console.log('data', data);
        // 	msg.commInfo.nowUser = data[0]
        // 	msg.commInfo.communicator = data[1]
        // 	uni.navigateTo({
        // 		url: '/pages/find/other/outterPage?url=' + this_.$outerNeed.singleCommunication +
        // 			'&commInfo=' + encodeURIComponent(JSON.stringify({
        // 				from: msg.from,
        // 				comInfo: msg.commInfo
        // 			}).replace(/\%/g,'%25').replace(/\&/g,'%26').replace(/\?/g,'%3F').replace(/\#/g,'%23'))
        // 	})
        // }).catch(err => {
        // 	//console.log('err', err);
        // 	this_.$utils.showToast('信息查询失败')
        // })
    },
    toTrtcPage: (this_, msg) => {
        let address = ''
        if (msg.isLiveStream) {
            address = this_.$outerNeed.livePushAddress
        } else {
            address = this_.$outerNeed.liveAddress
            msg.loginId = msg.userid
            // msg.nickName = msg.nickName
            // if(msg.aab001) {
            // 	msg.liveRoomInfo.aab001 = msg.aab001
            // }
            // if(msg.aac001) {
            // 	msg.liveRoomInfo.aac001 = msg.aac001
            // }
        }
        //console.log('msg', msg);
        uni.navigateTo({
            url: '/pages/find/other/outterPage?url=' + address + '&liveRoomInfo=' + encodeURIComponent(JSON
                .stringify(msg))
        })
    },
    // 查询单位编号和资质认证结果
    /**
     * type:'query' 查询   'add' 资质认证
     * data:object  资质认证时的入参
     */
    // 前往登录页面
    toLoginPage(this_) {
        uni.showModal({
            title: '温馨提示',
            content: '您还未登录，请先登录！',
            showCancel: true,
            success: (e) => {
                if (e.confirm) {
                    uni.navigateTo({
                        url: '/pages/personPages/logins/login/login'
                    })
                }
            }
        })

    },
    // 查询字符串转对象
    reverseToObj(url) {
        let res = {};
        const regex = /^([^\?]*)\?(.*)$/;
        let result = regex.exec(url) || null
        // 若无问号 数据则为空
        const query = (result ? result[2] : '').trim()

        // //console.log(query)
        // > id=xxx&name=xxx?&sex=1
        if (!query) {
            return {
                params: JSON.stringify({
                    from: ''
                })
            }
        }
        query.split('&').forEach(param => {
            const parts = param.replace(/\+/g, '').split('=');
            const key = decodeURIComponent(parts.shift())
            const value = parts.length > 0 ? decodeURIComponent(parts.join('=')) : null
            if (res[key] === undefined) {
                res[key] = value
            }
        })
        return res
    },
}
