import { e_change, e_click, } from '../../../const/eventType'

/**
 * @projectName mobileMakerWeb
 * @author zhang wei
 * @date 2022-11-23 15:17
 */
export default {
  componentType: 'layout',
  componentConfig: {
    type: 'collapse',
    label: '折叠面板',
    dataType: 'static',
    activeNames: ['1'],
    staticData: [
      {
        title: '标题1',
        name: '1',
        columns:[],
        disabled: false,
      },
      {
        title: '标题2',
        name: '2',
        columns:[],
        disabled: false,
      },
      {
        title: '标题3',
        name: '3',
        columns:[],
        disabled: false,
      }
    ],
    size: 'normal',
    eventTypeList: [e_change, e_click], // 允许定义的事件列表
  }, // 相关配置
}
