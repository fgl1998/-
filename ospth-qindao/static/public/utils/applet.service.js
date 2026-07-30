/**
 * 事项相关js
 */
let base = require('./applet.base.js');

/**
 * 获取栏目
 * @param {Object} params
 * siteId:站点id 或 ids:栏目id集合['xxx','xxx']
 * parentId:父栏目id
 * count:显示条数
 * @param {Object} onSuccess
 * @param {Object} onFailure
 */
function getChannelList(params, onSuccess, onFailure) {
	let apiUrl = '/channel/queryChannelList.do';
	base.post(apiUrl, params, onSuccess, onFailure);
}

/**
 * 获取单个栏目
 * @param {Object} params
 * siteId:站点id + name:栏目名称
 * id:栏目id
 * @param {Object} onSuccess
 * @param {Object} onFailure
 */
function getSinChannel(params, onSuccess, onFailure) {
	let apiUrl = '/channel/queryChannelSingle.do';
	base.post(apiUrl, params, onSuccess, onFailure);
}

/**
 * 获取栏目分页
 * @param {Object} params
 * ids:栏目id集合['xxx']
 * siteId:站点id
 * parentId:父栏目id
 * pageNo:页码
 * count:每页条数
 * @param {Object} onSuccess
 * @param {Object} onFailure
 */
function getChannelPage(params, onSuccess, onFailure) {
	let apiUrl = '/channel/queryChannelPage.do';
	base.post(apiUrl, params, onSuccess, onFailure);
}

/**
 * 获取批量专题信息
 * @param {Object} params
 * 必传：siteId:站点id 或 ids:专题id集合['xxx','xxx']
 * isRecommend:是否推荐 1.是,2.否
 * count:显示条数
 * @param {Object} onSuccess 成功回调
 * @param {Object} onFailure 失败回调
 */
function getTopicList(params, onSuccess, onFailure) {
	let apiUrl = '/topic/queryTopicList.do';
	base.post(apiUrl, params, onSuccess, onFailure);
}

/**
 * 获取单挑专题信息
 * @param {Object} params
 * topicId:专题id
 * siteId:站点id + topicName:专题名称 同时传入
 * @param {Object} onSuccess 成功回调
 * @param {Object} onFailure 失败回调
 */
function getSinTopic(params, onSuccess, onFailure) {
	let apiUrl = '/topic/queryTopicSingle.do';
	base.post(apiUrl, params, onSuccess, onFailure);
}

/**
 * 获取专题分页
 * @param {Object} params
 * topicIds:专题id集合['xxx']
 * siteId:站点id
 * isRecommend:是否推荐 1.是 2.否
 * pageSize:显示条数
 * pageNumber:页码
 * @param {Object} onSuccess
 * @param {Object} onFailure
 */
function getTopicPage(params, onSuccess, onFailure) {
	let apiUrl = '/topic/queryTopicPage.do';
	base.post(apiUrl, params, onSuccess, onFailure);
}
/**
 * 获取内容列表
 * @param {Object} params
 * ids:内容id集合
 * siteId:站点id集合
 * channelId:栏目id集合
 * includeChannel:用于单栏目情况下，0：自身栏目(默认)，1：包含副栏目，2：包含自身栏目和副栏目
 * topicId:专题id集合
 * title:内容标题 支持模糊查询
 * isTop:true置顶内容查询
 * isHot:true热点内容查询
 * isRecommend:true推荐内容查询
 * count:显示条数
 * isSimple:true简单内容模式
 * @param {Object} onSuccess
 * @param {Object} onFailure
 */
function getContentList(params, onSuccess, onFailure) {
	let apiUrl = '/content/queryContentList.do';
	base.post(apiUrl, params, onSuccess, onFailure);
}

/**
 * 获取单条内容
 * @param {Object} params
 * id:内容id
 * next:当前内容的下一篇true或者上一篇false
 * channelId:栏目id
 * isSimple:true 简单内容模式
 * @param {Object} onSuccess
 * @param {Object} onFailure
 */
function getSinContent(params, onSuccess, onFailure) {
	let apiUrl = '/content/queryContentSingle.do';
	base.post(apiUrl, params, onSuccess, onFailure);
}

/**
 * 获取内容分页
 * @param {Object} params
 * ids:内容id集合
 * siteId:站点id集合
 * channelId:栏目id集合
 * includeChannel:用于单栏目情况下，0：自身栏目(默认)，1：包含副栏目，2：包含自身栏目和副栏目
 * topicId:专题id集合
 * title:内容标题 支持模糊查询
 * isTop:true置顶内容查询
 * isHot:true热点内容查询
 * isRecommend:true推荐内容查询
 * count:显示条数
 * pageNo:页码
 * isSimple:true简单内容模式
 * @param {Object} onSuccess
 * @param {Object} onFailure
 */
function getContentPage(params, onSuccess, onFailure) {
	let apiUrl = '/content/queryContentPage.do';
	base.post(apiUrl, params, onSuccess, onFailure);
}
/*
 *获取服务列表
 */
function getServiceList(params, onSuccess, onFailure) {
	let address = uni.getStorageSync("address")
	params.executorCode = address.socialCode
	let apiUrl = '/service/queryServiceList.do';
	base.post(apiUrl, params, onSuccess, onFailure);
}
/*
 *获取单个服务
 */
function getSinService(params, onSuccess, onFailure) {
	let apiUrl = '/service/queryServiceSingle.do';
	base.post(apiUrl, params, onSuccess, onFailure);
}
/*
 *获取服务分页
 */
function getServicePage(params, onSuccess, onFailure) {
	let address = uni.getStorageSync("address")
	params.executorCode = address.socialCode
	let apiUrl = '/service/queryServicePage.do';
	base.post(apiUrl, params, onSuccess, onFailure);
}


module.exports = {
	getChannelList: getChannelList,
	getSinChannel: getSinChannel,
	getChannelPage: getChannelPage,
	getTopicList: getTopicList,
	getSinTopic: getSinTopic,
	getTopicPage: getTopicPage,
	getContentList: getContentList,
	getSinContent: getSinContent,
	getContentPage: getContentPage,
	getServiceList: getServiceList,
	getSinService: getSinService,
	getServicePage: getServicePage,
}
