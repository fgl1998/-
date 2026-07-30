export default {
	name: "dropdown-menu-component",
	props: {
		componentConfig: {
			type: Object,
			required: true,
			default: () => {
				return {};
			}
		}
	},
	data() {
		return {
			option: [
				{text: "全部商品", value: 0},
				{text: "新款商品", value: 1},
				{text: "活动商品", value: 2}
			],
			value: ""
		};
	},
	methods:{
		setValue(v){
			this.value=v;
		}
	},
	render(h) {
		let {$listeners} = this;
		let buttonProps = {
			on: {
				...$listeners
			},
		};
		return (
			<van-dropdown-menu

			>
				<van-dropdown-item vModel={this.value}
								   {...buttonProps}
								   options={this.option}/>
			</van-dropdown-menu>
		);
	}
};
