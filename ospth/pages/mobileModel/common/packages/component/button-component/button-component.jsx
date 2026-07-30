export default {
	name: "button-component",
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
		return {};
	},
	render() {
		let {title, style, buttonType, size, icon} = this.$props.componentConfig;
		let {$listeners,$scopedSlots} = this;
		let buttonProps = {
			props: {
				type: buttonType,
				size,
				icon,
				nativeType: 'button'
			},
			attrs: {
				style
			},
			on: {
				...$listeners
			},
			scopedSlots: $scopedSlots,
		};
		return (
			<van-button
				{...buttonProps}
			>
				{title}
			</van-button>
		);
	}
};
