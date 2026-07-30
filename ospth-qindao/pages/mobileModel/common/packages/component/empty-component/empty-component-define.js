import {e_click} from "../../../const/eventType";

/**
 * @projectName mobileMakerWeb
 * @author zhang wei
 * @date 2022-11-23 15:17
 */
export default {
	componentType: "show",
	componentConfig: {
		type: "empty",
    label: "空状态",
    image: 'network',
    imageSize: '',
    description: '描述文字',
    eventTypeList: [e_click]//允许定义的事件列表
	}//相关配置
};
