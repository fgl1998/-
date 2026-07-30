import {form as componentType} from "../../../const/componentType";
import {e_input_keyboard, e_delete, e_close, e_blur} from "../../../const/eventType";

export default {
  componentType,
  componentConfig: {
    type: 'number-keyboard',
    label: '数字键盘',
    display: 'true',
    theme: 'default',
    closeButtonText: '完成',
    transition: true,
    eventTypeList: [e_input_keyboard, e_delete, e_close], // 允许定义的事件列表
  }, // 相关配置
}
