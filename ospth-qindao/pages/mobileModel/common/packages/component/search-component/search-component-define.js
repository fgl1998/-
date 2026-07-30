import {form as componentType} from "../../../const/componentType";

import {e_search, e_input_search, e_focus, e_blur, e_clear, e_cancel} from "../../../const/eventType";

export default {
	componentType,
	componentConfig: {
		type: "search",
		label: "搜索",
		display: "true",
		clearable: true,
		eventTypeList:[e_search, e_input_search, e_focus, e_blur, e_clear, e_cancel],
	}//相关配置
};
