# pages.json 的作用

## 1. 页面路由配置

通过 `pages` 数组注册应用中所有页面的路径和窗口表现，第一项为应用启动页。

## 2. 全局窗口样式

通过 `globalStyle` 设置默认导航栏样式、背景色等全局窗口表现。

## 3. 底部 tabBar 配置

通过 `tabBar` 字段配置底部 tab 栏：

| 字段 | 说明 |
|------|------|
| `tabBar.list` | tab 项数组，最少 2 个、最多 5 个 |
| `pagePath` | 必须与 `pages` 中已注册的页面路径一致 |
| `iconPath` / `selectedIconPath` | 图标路径，建议 40kb 以内，尺寸 81×81 px |
| `position` | `bottom`（默认）或 `top`（仅微信小程序支持顶部 tab） |
