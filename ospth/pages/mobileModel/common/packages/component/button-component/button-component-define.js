import {e_click, e_blur} from "../../../const/eventType";

/**
 * @projectName mobileMakerWeb
 * @author zhang wei
 * @date 2022-11-23 15:17
 */
export default {
	componentType: "",
	componentConfig: {
		type: "button",
		label: "按钮",
		display: "true",
		title: "按钮",
		textAlign: "left",
		buttonType: "default",
		size: "small",
		icon: "",
		eventTypeList: [e_click]//允许定义的事件列表
	}//相关配置
};
