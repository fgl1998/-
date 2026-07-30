import baseConfig from "../../commonComponentConfig/base-config";
import componentConfigMixin from "../../../mixin/componentConfigMixin";

export default {
	name: "switch-component-config",
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
	data () {
		return {
			defaultConfigNameList: [
				'label',
				'name',
				'disabled',
			],
		}
	},
	render() {
		return (
			<base-config
				config={this.config}
				configNameList={this.getConfigNameList}
			>
				<ta-label-con label="默认值">
					<ta-switch vModel={this.config.initialValue}/>
				</ta-label-con>
				<ta-label-con label="size">
					<ta-input vModel={this.config.size}/>
				</ta-label-con>
			</base-config>
		);
	}
};
