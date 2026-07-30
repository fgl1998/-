import {form as componentType} from "../../../const/componentType";
/**
 * @projectName mobileMakerWeb
 * @author zhang wei
 * @date 2022-11-11 17:03
 */
import {e_change, e_click} from "../../../const/eventType";

export default {
	componentType,
	componentConfig: {
		type: "field",
		label: "输入框",
		display: "true",
		fieldType: 'text',
		placeholder: "请输入",
		size:'',
		eventTypeList:[e_change, e_click],
	}//相关配置
};
