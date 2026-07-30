import baseConfig from "../../commonComponentConfig/base-config";
import componentConfigMixin from "../../../mixin/componentConfigMixin";

export default {
	name: "uploader-component-config",
	mixins: [componentConfigMixin],
	props: {
		config: {
			type: Object,
			required: true
		}
	},
	components: {baseConfig},
	methods: {
		changeMaxType(value) {
			this.maxType = value
			this.config.maxType = value
		}
	},
	data () {
		return {
			defaultConfigNameList: [
				'label',
				'name',
				'disabled',
			],
			maxType: '1',
		}
	},
	model: {
		prop: "config",
		event: "change"
	},
	render() {
		if (this.config.maxType) {
			this.maxType = this.config.maxType
		}
		return (
			<base-config
				config={this.config}
				configNameList={this.getConfigNameList}
			>
				<ta-label-con label="span">
					<ta-input placeholder="请输入span" vModel={this.config.span}/>
				</ta-label-con>
				<ta-label-con label="上传地址">
					<ta-input vModel={this.config.uploadUrl}/>
				</ta-label-con>
				<ta-label-con label="预览尺寸">
					<ta-input-number placeholder="请输入预览尺寸" vModel={this.config.previewSize}/>
				</ta-label-con>
				<ta-label-con label="最大限制">
					<ta-input-number style="width:70%" vModel={this.config.maxSizeNum}/>
					<ta-select  style="width:30%" vModel={this.maxType} vOn:change={this.changeMaxType}>
						<ta-select-option value="1">
							KB
						</ta-select-option>
						<ta-select-option value="2">
							MB
						</ta-select-option>
					</ta-select>
				</ta-label-con>
				<ta-label-con label="展示预览图">
					<ta-switch vModel={this.config.previewImage}/>
				</ta-label-con>
				{
					this.config.previewImage&&<ta-label-con label="预览图全屏展示">
						<ta-switch vModel={this.config.previewFullImage}/>
					</ta-label-con>
				}
				<ta-label-con label="文件多选">
					<ta-switch vModel={this.config.multiple}/>
				</ta-label-con>
				<ta-label-con label="最大上传数量">
					<ta-input-number placeholder="请输入最大上传数量" vModel={this.config.maxCount}/>
				</ta-label-con>
				<ta-label-con label="图片懒加载">
					<ta-switch vModel={this.config.lazyLoad}/>
				</ta-label-con>
				<ta-label-con label="删除按钮">
					<ta-switch vModel={this.config.deletable}/>
				</ta-label-con>
			</base-config>
		);
	}
};
