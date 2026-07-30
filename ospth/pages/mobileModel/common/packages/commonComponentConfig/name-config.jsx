// "name" 配置项
export default {
	name: "name-config",
	props: {
		config: {
			type: Object,
			required: true
		}
	},
	model: {
		prop: "config",
		event: "change"
	},
	render() {
		return (
			<ta-label-con label="Name">
				<ta-input placeholder="请输入Name" disabled={false} vModel={this.config.name}/>
			</ta-label-con>
		);
	}
};
