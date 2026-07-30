import {e_click, e_close, e_replay} from "../../../const/eventType";

/**
 * @projectName mobileMakerWeb
 * @author zhang wei
 * @date 2022-11-23 15:17
 */
export default {
	componentType: "show",
	componentConfig: {
		type: "notice-bar",
    label: "通知栏",
    text: '技术是开发它的人的共同灵魂',
    mode: 'default',
    color: '',
    background: '',
    leftIcon: 'volume-o',
    delay: '1',
    speed: '60',
    scrollable: false,
    wrapable: false,
    dataType: 'scroll',
    tabsName: ['static', 'scroll'],
    staticData: [
      { value: '通知文本内容1', },
      { value: '通知文本内容2', },
      { value: '通知文本内容3', }
    ],
    eventTypeList: [e_click, e_close, e_replay]//允许定义的事件列表
	}//相关配置
};
