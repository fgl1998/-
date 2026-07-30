import { e_click_step } from '../../../const/eventType'

/**
 * @projectName mobileMakerWeb
 * @author zhang wei
 * @date 2022-11-23 15:17
 */
export default {
  componentType: 'show',
  componentConfig: {
    type: 'steps',
    label: '步骤条',
    direction: 'horizontal',
    activeColor: "",
    activeIcon: "",
    inactiveIcon: "",
    finishIcon: "",
    center: false,
    dataType: 'static',
    active: 1,
    staticData: [
      { value: '步骤1', time: '2016-07-12 12:40'},
      { value: '步骤2', time: '2016-08-12 12:40'},
      { value: '步骤3', time: '2016-09-12 12:40'}
    ],
    eventTypeList: [e_click_step], // 允许定义的事件列表
  }, // 相关配置
}
