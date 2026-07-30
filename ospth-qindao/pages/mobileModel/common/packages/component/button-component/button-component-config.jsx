import baseConfig from "../../commonComponentConfig/base-config";
import componentConfigMixin from "../../../mixin/componentConfigMixin";

export default {
	name: "button-component-config",
	mixins: [componentConfigMixin],
	props: {
		config: {
			type: Object,
			required: true
		}
	},
	components: {baseConfig},
	model: {
		prop: "config",
		event: "change"
	},
	render() {
		return (
			<base-config
				config={this.config}
				configNameList={this.getConfigNameList}
			>
				<ta-label-con label="title">
					<ta-input placeholder="请输入title" vModel={this.config.title}/>
				</ta-label-con>
				<ta-label-con label="span">
					<ta-input placeholder="请输入span" vModel={this.config.span}/>
				</ta-label-con>
				<ta-label-con label="行内对齐">
					<ta-select vModel={this.config.textAlign} style={{width:'100%'}}>
						<ta-select-option value="left">左对齐</ta-select-option>
						<ta-select-option value="center">居中</ta-select-option>
						<ta-select-option value="right">右对齐</ta-select-option>
					</ta-select>
				</ta-label-con>
				<ta-label-con label="按钮类型">
					<ta-select vModel={this.config.buttonType} style={{width:'100%'}}>
						<ta-select-option value="default">default</ta-select-option>
						<ta-select-option value="primary">primary</ta-select-option>
						<ta-select-option value="info">info</ta-select-option>
						<ta-select-option value="warning">warning</ta-select-option>
						<ta-select-option value="danger">danger</ta-select-option>
					</ta-select>
				</ta-label-con>
				<ta-label-con label="按钮尺寸">
					<ta-select vModel={this.config.size} style={{width:'100%'}}>
						<ta-select-option value="large">大号按钮</ta-select-option>
						<ta-select-option value="normal">普通按钮</ta-select-option>
						<ta-select-option value="small">小型按钮</ta-select-option>
						<ta-select-option value="mini">迷你按钮</ta-select-option>
					</ta-select>
				</ta-label-con>
				<ta-label-con label="样式">
					<ta-textarea placeholder="例如：color:red;padding:12px" vModel={this.config.style}/>
				</ta-label-con>
				<ta-label-con label="icon">
					<ta-input  vModel={this.config.icon}/>
				</ta-label-con>
			</base-config>
		);
	}
};
