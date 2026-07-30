/**
 * @projectName mobileMakerWeb
 * @author zhang wei
 * @date 2022-11-16 10:49
 */
export default {
	data() {
		return {
			defaultConfigNameList: [
				"name",
				"span",
				"display"
			]
		};
	},
	computed: {
		getConfigNameList() {
			return this.defaultConfigNameList;
		}
	}
};
