/**
 * @projectName mobileMakerWeb
 * @author zhang wei
 * @date 2022-11-18 14:33
 */
import {cloneDeep} from "@yh/ta-utils";

const getDataType = function (data) {
	let typeString = "";
	try {
		typeString = Object.prototype.toString.call(data).slice(8, -1);
	} catch (e) {
		throw new Error(`get type of data failed ：${e.message}`);
	}
	if (typeString === "Number" && isNaN(Number(data))) typeString = "NaN";
	return typeString;
};
export {
	cloneDeep,
	getDataType
};
