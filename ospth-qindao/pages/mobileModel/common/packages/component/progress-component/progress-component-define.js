import {e_click} from "../../../const/eventType";

/**
 * @projectName mobileMakerWeb
 * @author zhang wei
 * @date 2022-11-23 15:17
 */
export default {
	componentType: "show",
	componentConfig: {
		type: "progress",
    label: "进度条",
    percentage: 0,
    strokeWidth: '4px',
    color: '#1989fa',
    trackColor: '#e5e5e5',
    pivotText: 'blue',
    pivotColor: '#1989fa',
    textColor: 'white',
    inactive: false,
    showPivot: true,
    eventTypeList: [e_click]//允许定义的事件列表
	}//相关配置
};
