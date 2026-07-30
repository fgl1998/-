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
    type: 'checkbox',
    label: '复选框组',
    display: 'true',
    dataType: 'static',
    staticData: [
      { label: '选项一', name: '0', },
      { label: '选项二', name: '1', }
    ],
    direction: 'horizontal',
    eventTypeList: [e_change], // 允许定义的事件列表
  }, // 相关配置
}
