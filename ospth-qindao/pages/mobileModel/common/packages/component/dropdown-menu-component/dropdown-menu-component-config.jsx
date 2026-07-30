import baseConfig from "../../commonComponentConfig/base-config";
import componentConfigMixin from "../../../mixin/componentConfigMixin";

export default {
	name: "dropdown-menu-component-config",
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
				<ta-label-con label="span">
					<ta-input placeholder="请输入span" vModel={this.config.span}/>
				</ta-label-con>
				<ta-label-con label="样式">
					<ta-textarea placeholder="例如：color:red;padding:12px" vModel={this.config.style}/>
				</ta-label-con>
			</base-config>
		);
	}
};
