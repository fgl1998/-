/**
 * @projectName mobileMakerWeb
 * @author zhang wei
 * @date 2022-11-14 11:12
 */
import {getComponentTypeTitle} from "../const/componentType";

const requireCon = require.context("./component", true, /\w+-component-define\.(js)$/);
let conMap = {};
let list = [];
requireCon.keys().forEach(fileName => {
	let module = requireCon(fileName).default;
	if (!module.componentConfig || typeof module.componentConfig !== "object") {
		console.error(`component config has error at：${fileName}`);
	} else {
		if (!conMap.hasOwnProperty(module.componentType)) {
			conMap[module.componentType] = [];
		}
		conMap[module.componentType].push(module);
	}
});
for (let key in conMap) {
	let label = getComponentTypeTitle(key);
	let list_ = conMap[key].map(item => item.componentConfig);
	let obj = {
		title: label,
		list: list_
	};
	list.push(obj);
}
export default list;
