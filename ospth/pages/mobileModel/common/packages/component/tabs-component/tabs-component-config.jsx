import baseConfig from "../../commonComponentConfig/base-config";
import componentConfigMixin from "../../../mixin/componentConfigMixin";

export default {
	name: "tabs-component-config",
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
	methods: {
		// static默认数据添加item
		fnOnAddStaticData () {
			let len = this.config.staticData.length + 1;
			this.config.staticData.push({
				title: '默认tab-'+len,
				name: len,
				columns: [],
				disabled: false,
			})
		},
		// static默认数据删除item
		fnOnDeleteStaticData (index) {
			this.config.staticData.forEach(data => {
				if (index < data.name) {
					data.tab = '默认tab-' + --data.name;
				}
			});
			this.config.staticData.splice(index, 1)
		}
	},
	computed: {
		// staticTab渲染的数据，作用域插槽内有static插槽的话就渲染插槽，否则渲染默认数据
		staticTab () {
			if (this.$scopedSlots.static) {
				return this.$scopedSlots.static({
					config: this.config
				})
			} else {
				return <div>
					{/* 默认数据头 */}
					<ta-row gutter={16} style={{ marginBottom: '10px' }}>
						<ta-col span={8}>
							<span style={{ fontWeight: 800, marginLeft: '5px', lineHeight: '32px' }}>tab标签</span>
						</ta-col>
						<ta-col span={8}>
							<span style={{ fontWeight: 800, marginLeft: '5px', lineHeight: '32px' }}>标签key</span>
						</ta-col>
						<ta-col span={6}>
							<ta-button
								type={'primary'}
								shape={'circle'}
								icon={'plus'}
								onclick={this.fnOnAddStaticData}/>
						</ta-col>
					</ta-row>
					{/* 默认数据List */}
					{this.config.staticData.map((item, index) =>
						<ta-row key={index} gutter={16} style={{ marginBottom: '10px' }}>
							<ta-col span={8}>
								<ta-input vModel_trim={item.title}/>
							</ta-col>
							<ta-col span={8}>
								<ta-input vModel_trim={item.name}/>
							</ta-col>
							<ta-col span={6}>
								<ta-button type={'danger'} shape={'circle'} icon={'minus'}
										   onclick={this.fnOnDeleteStaticData.bind(this, index)}/>
							</ta-col>
						</ta-row>
					)}
				</div>
			}
		}
	},
	render() {
		const { staticTab } = this
		return (
			<base-config
				config={this.config}
				configNameList={this.getConfigNameList}
			>
				<ta-tabs>
					<ta-tab-pane tab={'添加TabPane组件'} key={'static'}>
						{staticTab}
					</ta-tab-pane>
				</ta-tabs>
				<ta-label-con label="样式风格">
					<ta-select placeholder="请选择样式风格" vModel={this.config.tabsType} style="width:100%">
						<ta-select-option value="line">line</ta-select-option>
						<ta-select-option value="card">card</ta-select-option>
					</ta-select>
				</ta-label-con>
				{this.config.tabsType== 'line'&&
					<ta-label-con label="显示外边框">
						<ta-switch vModel={this.config.border}/>
					</ta-label-con>
				}
				<ta-label-con label="使用粘性定位">
					<ta-switch vModel={this.config.sticky}/>
				</ta-label-con>
				<ta-label-con label="延迟渲染">
					<ta-switch vModel={this.config.lazyRender}/>
				</ta-label-con>
				<ta-label-con label="背景色">
					<ta-input placeholder="请输入背景色" vModel={this.config.background}/>
				</ta-label-con>
				<ta-label-con label="标签主题色">
					<ta-input placeholder="请输入标签主题色" vModel={this.config.color}/>
				</ta-label-con>
				<ta-label-con label="底部条宽度">
					<ta-input-number placeholder="请输入底部条宽度" vModel={this.config.lineWidth}/>
				</ta-label-con>
				<ta-label-con label="底部条高度">
					<ta-input-number placeholder="请输入底部条高度" vModel={this.config.lineHeight}/>
				</ta-label-con>
			</base-config>
		);
	}
};
