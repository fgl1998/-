import baseConfig from "../../commonComponentConfig/base-config";
import componentConfigMixin from "../../../mixin/componentConfigMixin";

export default {
	name: "stepper-component-config",
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
					<ta-input-number vModel={this.config.initialValue}/>
				</ta-label-con>
				<ta-label-con label="步长">
					<ta-input-number min={0} vModel={this.config.step}/>
				</ta-label-con>
				<ta-label-con label="最大值">
					<ta-input-number vModel={this.config.max}/>
				</ta-label-con>
				<ta-label-con label="最小值">
					<ta-input-number vModel={this.config.min}/>
				</ta-label-con>
				<ta-label-con label="小数位数">
					<ta-input-number min={0} vModel={this.config.decimalLength}/>
				</ta-label-con>
				<ta-label-con label="禁用输入框">
					<ta-switch vModel={this.config.disableInput}/>
				</ta-label-con>
				<ta-label-con label="禁用增加按钮">
					<ta-switch vModel={this.config.disablePlus}/>
				</ta-label-con>
				<ta-label-con label="禁用增加按钮">
					<ta-switch vModel={this.config.disableMinus}/>
				</ta-label-con>
			</base-config>
		);
	}
};
