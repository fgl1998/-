import baseConfig from "../../commonComponentConfig/base-config";
import componentConfigMixin from "../../../mixin/componentConfigMixin";

export default {
	name: "br-component-config",
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
				<ta-label-con label="高度">
					<ta-input placeholder="请输入高度" vModel={this.config.height}/>
				</ta-label-con>
			</base-config>
		);
	}
};
