import { e_click, } from '../../../const/eventType'

/**
 * @projectName mobileMakerWeb
 * @author zhang wei
 * @date 2022-11-23 15:17
 */
export default {
  componentType: 'show',
  componentConfig: {
    type: 'skeleton',
    label: '骨架屏',
    row: "4",
    rowWidth: "100%",
    title: false,
    titleWidth: "40%",
    avatar: false,
    loading: true,
    animate: true,
    avatarSize: "32px",
    avatarShape: "round",
    eventTypeList: [e_click], // 允许定义的事件列表
  }, // 相关配置
}
