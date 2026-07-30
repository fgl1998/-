/**
 * @projectName mobileMakerWeb
 * @author lixx
 * @date 2023-01-05 14:03
 */
import {form as componentType} from "../../../const/componentType";
import { e_afterRead, e_beforeRead, e_delete, e_beforeDelete } from '../../../const/eventType'
export default {
	componentType,
	componentConfig: {
		type: "uploader",
		label: "文件上传",
		display: "true",
		imageFit: "cover",
		previewSize: 80,
		previewImage: true,
		previewFullImage: true,
		deletable: true,
		showUpload: true,
		eventTypeList: [e_afterRead, e_beforeRead, e_delete, e_beforeDelete]//允许定义的事件列表
	}//相关配置
};
