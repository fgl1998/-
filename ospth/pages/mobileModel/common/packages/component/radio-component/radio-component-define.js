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
    type: 'radio',
    label: '单选框',
    display: 'true',
    dataType: 'static',
    title: '标题',
    staticData: [
      { label: '选项一', name: '0', },
      { label: '选项二', name: '1', }
    ],
    direction: 'horizontal',
    eventTypeList: [e_change], // 允许定义的事件列表
  }, // 相关配置
}
