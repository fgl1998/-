import {form as componentType} from "../../../const/componentType";
import {e_change} from "../../../const/eventType";

/**
 * @projectName mobileMakerWeb
 * @author zhang wei
 * @date 2022-11-23 15:17
 */
export default {
  componentType,
  componentConfig: {
    type: 'rate',
    label: '评分',
    display: 'true',
    count: 5,
    color: '#ee0a24',
    voidColor: '#c8c9cc',
    eventTypeList: [e_change], // 允许定义的事件列表
  }, // 相关配置
}
