import {e_finish, e_change} from "../../../const/eventType";

/**
 * @projectName mobileMakerWeb
 * @author zhang wei
 * @date 2022-11-23 15:17
 */
export default {
	componentType: "show",
	componentConfig: {
		type: "countdown",
    label: "倒计时",
    time: 180000,
    format: 'HH:mm:ss',
    autoStart: true,
    manualStart: false,
    millisecond: false,
    eventTypeList: [e_finish, e_change]//允许定义的事件列表
	}//相关配置
};
