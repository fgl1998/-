import {layout as componentType} from "../../../const/componentType";

import {e_change,e_click} from "../../../const/eventType";

export default {
	componentType,
	componentConfig: {
		type: "tabs",
		label: "标签页",
		display: "true",
		color: "#ee0a24",
		tabsType: 'line',
		background: 'white',
		lineWidth: 40,
		lineHeight: 3,
		staticData: [{
			name:'1',
			title: '默认tab-1',
			columns:[],
			disabled: false,
		},{
			name:'2',
			title: '默认tab-2',
			columns:[],
			disabled: false,
		}],
		eventTypeList:[e_change,e_click],
	}//相关配置
};
