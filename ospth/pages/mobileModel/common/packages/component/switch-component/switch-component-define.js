import {form as componentType} from "../../../const/componentType";

import {e_change, e_click} from "../../../const/eventType";

export default {
	componentType,
	componentConfig: {
		type: "switch",
		label: "开关",
		display: "true",
		size: "20px",
		initialValue: false,
		eventTypeList:[e_change],
	}//相关配置
};
