import {form as componentType} from "../../../const/componentType";
import {e_change, e_confirm, e_cancel} from "../../../const/eventType";

/**
 * @projectName mobileMakerWeb
 * @author zhang wei
 * @date 2022-11-23 15:17
 */
export default {
  componentType,
  componentConfig: {
    type: 'date-time-picker',
    label: '时间选择',
    timeType: 'datetime',
    display: 'true',
    title: '请选择',
    dateRange: [],
    showToolbar: true,
    eventTypeList: [e_change, e_confirm], // 允许定义的事件列表
  }, // 相关配置
}
