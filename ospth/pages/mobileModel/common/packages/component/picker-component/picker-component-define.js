import {form as componentType} from "../../../const/componentType";
import {e_change, e_cancel, e_confirm} from "../../../const/eventType";

/**
 * @projectName mobileMakerWeb
 * @author zhang wei
 * @date 2022-11-23 15:17
 */
export default {
  componentType,
  componentConfig: {
    type: 'picker',
    label: '选择器',
    display: 'true',
    dataType: 'static',
    title: '标题',
    staticData: [
      { name:'HangZhou',label: '杭州'},
      { name:'NingBo',label: '宁波' },
      { name:'WenZhou',label: '温州' },
    ],
    showToolbar: true,
    eventTypeList: [e_confirm, e_change], // 允许定义的事件列表
  }, // 相关配置
}
