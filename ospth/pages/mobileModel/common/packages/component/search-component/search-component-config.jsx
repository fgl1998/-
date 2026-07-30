import baseConfig from "../../commonComponentConfig/base-config";
import componentConfigMixin from "../../../mixin/componentConfigMixin";

export default {
	name: "search-component-config",
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
				'initialValue',
				'placeholder',
			],
		}
	},
	render() {
		return (
			<base-config
				config={this.config}
				configNameList={this.getConfigNameList}
			>
				<ta-label-con label="是否清除">
					<ta-switch vModel={this.config.clearable}/>
				</ta-label-con>
				<ta-label-con label="是否只读">
					<ta-switch vModel={this.config.readonly}/>
				</ta-label-con>
				<ta-label-con label="最大字符数">
					<ta-input-number placeholder="请输入最大字符数" vModel={this.config.maxlength} min={0}/>
				</ta-label-con>
				<ta-label-con label="取消按钮">
					<ta-switch vModel={this.config.showAction}/>
				</ta-label-con>
			</base-config>
		);
	}
};
