/**
 * @projectName mobileMakerWeb
 * @author zhang wei
 * @date 2022-11-14 09:19
 */
export const e_click = "click";
export const e_blur = "blur";
export const e_change = "change";
export const e_delete = "delete";
export const e_afterRead = "afterRead";
export const e_beforeRead = "beforeRead";
export const e_beforeDelete = "beforeDelete";
export const e_finish = "finish";
export const e_close = 'close';
export const e_confirm = 'confirm';
export const e_cancel = 'cancel';
export const e_focus = 'focus';
export const e_input = 'input';
export const e_search = 'search';
export const e_clear = 'clear';
export const e_select = 'select';
export const e_input_keyboard = 'input';
export const e_input_search = 'input';
export const e_plus = "plus";
export const e_minus = "minus";
export const e_replay = "replay";
export const e_click_step = "click_step";

const map = new Map([
	[e_click, "click:点击事件"],
	[e_blur, "blur:失去焦点"],
	[e_focus, "focus:获得焦点"],
	[e_change, "change:值变化"],
	[e_delete, "delete:删除回调"],
	[e_finish, "finish:全部选择完成"],
	[e_close, "close:点击关闭图标"],
	[e_confirm, "confirm:点击完成按钮"],
	[e_cancel, "cancel:点击取消按钮"],
	[e_afterRead, "afterRead:读取回调"],
	[e_beforeRead, "beforeRead:读取前置回调"],
	[e_beforeDelete, "beforeDelete:删除回调"],
	[e_input, "input:输入框内容变化"],
	[e_search, "search:确定搜索"],
	[e_clear, "clear:点击清除按钮"],
	[e_select, "select:点击并选中任意日期"],
	[e_minus, "minus:点击减少按钮时"],
	[e_plus, "plus:点击增加按钮时"],
	[e_input_keyboard, "input:点击按键"],
	[e_input_search, "input:输入框内容变化"],
	[e_replay, "replay:重新开始滚动"],
	[e_click_step, "click_step: 点击步骤的标题或图标"]
]);
export const getEventTypeLabel = (type) => {
	return map.get(type) || `${type}`;
};
