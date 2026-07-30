import { e_load } from '../../../const/eventType'

/**
 * @projectName mobileMakerWeb
 * @author zhang wei
 * @date 2022-11-23 15:17
 */
export default {
  componentType: 'business',
  componentConfig: {
    type: 'list-business',
    label: '列表',
    dataType: 'static',
    staticData: [
      {
        title: '默认业务名称',
        name: '1',
        children: [
          { label: '受理部门', title: '默认部门',key: '', value: '右侧数据', description: '默认描述信息', border: false, },
          { label: '受理时间', title: '2020-01-01',key: '', value: '', description: '', border: false, }
        ],
        disabled: false,
      },
      {
        title: '标题2',
        name: '2',
        children: [],
        disabled: false,
      },
      {
        title: '标题3',
        name: '3',
        children: [],
        disabled: false,
      }
    ],
    finishedText: '没有更多了',
    eventTypeList: [e_load], // 允许定义的事件列表
  }, // 相关配置
}
