import {form as componentType} from "../../../const/componentType";
import {e_confirm, e_select} from "../../../const/eventType";

export default {
  componentType,
  componentConfig: {
    type: 'calendar',
    label: '日历',
    display: 'true',
    calendarType: 'single',
    showConfirm: true,
    position: 'bottom',
    dateRange: [],
    eventTypeList: [e_confirm, e_select], // 允许定义的事件列表
  }, // 相关配置
}
