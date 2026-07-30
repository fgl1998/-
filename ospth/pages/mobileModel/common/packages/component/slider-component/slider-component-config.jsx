import baseConfig from "../../commonComponentConfig/base-config";
import componentConfigMixin from "../../../mixin/componentConfigMixin";

export default {
	name: "slider-component-config",
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
				<ta-label-con label="激活态颜色">
					<ta-input vModel={this.config.activeColor}/>
				</ta-label-con>
				<ta-label-con label="非激活态颜色">
					<ta-input vModel={this.config.inactiveColor}/>
				</ta-label-con>
				<ta-label-con label="进度条高度">
					<ta-input-number min={0} vModel={this.config.barHeight}/>
				</ta-label-con>
				<ta-label-con label="滑块按钮大小">
					<ta-input-number min={0} vModel={this.config.buttonSize}/>
				</ta-label-con>
			</base-config>
		);
	}
};
