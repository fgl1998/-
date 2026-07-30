export default {
	name: "formButton-component",
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
	methods:{
		onclick(){
			const this_ = this.getVue()
			eval(this.componentConfig.onclick)
		}
	},
	render() {
		let {$props,$listeners,$scopedSlots} = this;
		const {
			componentConfig: {
				type,
				icon,
				display,
				buttonName,
				css,
				buttonType,
				fieldType,
				...restItem
			},
			value,
			checked,
			modulePartId,
			...restProps
		} = $props
		const event = {}
		event.click=this.onclick
		let buttonProps = {
			props: {
				type: buttonType,
				icon,
				nativeType: 'button',
				...restItem
			},
			attrs: {
				style:css
			},
			on: {
				...$listeners,
				...event
			},
			scopedSlots: $scopedSlots,
		};
		return (
			<van-button
				{...buttonProps}
			>
				{buttonName}
			</van-button>
		);
	}
};
