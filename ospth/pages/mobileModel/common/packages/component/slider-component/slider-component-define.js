import {form as componentType} from "../../../const/componentType";

import {e_change,e_input} from "../../../const/eventType";

export default {
	componentType,
	componentConfig: {
		type: "slider",
		label: "滑块",
		display: "true",
		initialValue: 0,
		min: 0,
		max: 100,
		step: 1,
		barHeight: 2,
		buttonSize: 24,
		activeColor: "#1989fa",
		inactiveColor: "#e5e5e5",
		eventTypeList:[e_change,e_input],
	}//相关配置
};
