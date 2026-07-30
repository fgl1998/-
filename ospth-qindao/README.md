# 配置说明
配置文件在根目录的config文件下,可对开发环境、测试环境以及生产环境进行区分配置，也可进行通用配置

## 启动及打包
package.json文件下已预定义测试及生成环境快速启动及打包配置

## 基础配置
包括接口请求地址、资源请求地址、办事页面地址、是否加密等

## 自定义scss变量处理
移除uni.scss中的变量配置，统一配置到config文件中，在vue.config.js对scss变量进行处理，如果新增scss变量，需在vue.config.js的appScssVar方法中进行判断

## scss变量使用
```
scss中使用变量进行图片地址拼接
	通用图片：#{$image_src}/static/newImages/index/auth.png
	个性化图片： #{$image_src}/static/newImages/#{$image-replace-directory}/backgroundImg.png
```