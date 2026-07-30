import {form as componentType} from "../../../const/componentType";
import {e_focus} from "../../../const/eventType";

export default {
  componentType,
  componentConfig: {
    type: 'password-input',
    label: '密码输入框',
    display: 'true',
    mask: true,
    eventTypeList: [e_focus], // 允许定义的事件列表
  }, // 相关配置
}
