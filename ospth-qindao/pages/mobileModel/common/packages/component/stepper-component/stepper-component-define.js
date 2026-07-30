import {form as componentType} from "../../../const/componentType";

import {e_change,e_plus,e_minus} from "../../../const/eventType";

export default {
	componentType,
	componentConfig: {
		type: "stepper",
		label: "步进器",
		display: "true",
		min: 1,
		step: 1,
		decimalLength: 0,
		inputWidth: "32px",
		buttonSize: "28px",
		initialValue: 1,
		showPlus: true,
		showMinus: true,
		showInput : true,
		eventTypeList:[e_change,e_plus,e_minus],
	}//相关配置
};
