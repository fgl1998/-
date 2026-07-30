import {e_click} from "../../../const/eventType";

/**
 * @projectName mobileMakerWeb
 * @author zhang wei
 * @date 2022-11-23 15:17
 */
export default {
	componentType: "show",
	componentConfig: {
		type: "divider",
    label: "分割线",
    value: '分割线',
    dashed: true,
    hairline: false,
    contentPosition: 'center',
    eventTypeList: [e_click]//允许定义的事件列表
	}//相关配置
};
