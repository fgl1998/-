import {form as componentType} from "../../../const/componentType";
import {e_finish, e_close, e_change} from "../../../const/eventType";

/**
 * @projectName mobileMakerWeb
 * @author zhang wei
 * @date 2022-11-23 15:17
 */
export default {
  componentType,
  componentConfig: {
    type: 'cascader',
    title: '请选择',
    label: '级联选择',
    display: 'true',
    dataType: 'static',
    staticData:
          [
            {
              text: '选项一',
              value: '1',
              children: [{ text: '选项1-1', value: '1-1'},
                         { text: '选项1-2', value: '1-2'}],
            },
        { text: '选项二', value: '2' },
        { text: '选项三', value: '3' }
      ],
    placeholder: '请选择',
    closeable: true,
    showHeader: true,
    eventTypeList: [e_change, e_finish], // 允许定义的事件列表
  }, // 相关配置
}
