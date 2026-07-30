import baseConfig from "../../commonComponentConfig/base-config";
import componentConfigMixin from "../../../mixin/componentConfigMixin";

export default {
	name: "field-component-config",
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
				'css',
				'disabled',
				'initialValue',
				'required'
			],
		}
	},
	render() {
		return (
			<base-config
				config={this.config}
				configNameList={this.getConfigNameList}
			>
				<ta-label-con label="输入类型">
					<ta-select vModel={this.config.fieldType} style={{width:'100%'}}>
						<ta-select-option value="text">text</ta-select-option>
						<ta-select-option value="tel">tel</ta-select-option>
						<ta-select-option value="digit">digit</ta-select-option>
						<ta-select-option value="number">number</ta-select-option>
						<ta-select-option value="textarea">textarea</ta-select-option>
						<ta-select-option value="password">password</ta-select-option>
					</ta-select>
				</ta-label-con>
				<ta-label-con label="输入框尺寸">
					<ta-select vModel={this.config.size} style={{width:'100%'}}>
						<ta-select-option value="">default</ta-select-option>
						<ta-select-option value="large">large</ta-select-option>
					</ta-select>
				</ta-label-con>
				<ta-label-con label="是否只读">
					<ta-switch vModel={this.config.readonly}/>
				</ta-label-con>
				<ta-label-con label="最大字符数">
					<ta-input-number placeholder="请输入最大字符数" vModel={this.config.maxlength} min={0}/>
				</ta-label-con>
			</base-config>
		);
	}
};
