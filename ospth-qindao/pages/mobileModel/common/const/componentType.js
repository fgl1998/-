/**
 * @projectName mobileMakerWeb
 * @author zhang wei
 * @date 2022-11-14 09:19
 */
export const layout = "layout";
export const nav = "nav";
export const form = "form";
export const show = "show";

const map = new Map([
	[layout, "布局"],
	[nav, "导航"],
	[form,"表单"],
	[show,"展示"]
]);
export const getComponentTypeTitle = (type) => {
	return map.get(type) || "其它";
};
