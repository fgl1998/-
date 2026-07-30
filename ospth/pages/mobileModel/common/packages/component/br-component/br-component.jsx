import {isNumber} from "lodash";

export default {
	name: "br-component",
	props: {
		componentConfig: {
			type: Object,
			required: true,
			default: () => {
				return {
					height:0
				};
			}
		},
		value: undefined,
		modulePartId: String
	},
	data() {
		return {};
	},
	render() {
		const {$props} = this;
		let {
			componentConfig: {
				height
			}
		} = $props;
		height = isNumber(height * 1) && height * 1 > 0 ? height + "px" : 0;

		return (
			<div style={{height: height}}/>
		);
	}
}
;
