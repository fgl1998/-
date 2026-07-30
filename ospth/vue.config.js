//由于小程序无法获取页面标题，所以拷贝page.json文件，用于数据采集获取页面标题
const path = require('path')
const fs = require('fs')

const fromFile = path.join(__filename, '../pages.json')
const toFile = path.join(__filename, '../static/page.json')

const fileData = fs.readFileSync(fromFile)

// 自定义scss变量处理
const styleVariables = require('./config.js')

// 转成可读的js, 正则删除注释， 不然JSON.parse会报错
const fileObj = JSON.parse(fileData.toString().replace(/\/\*/g, '').replace(/\*\//g, '').replace(/\/\/.*/g, ''))

// 遍历，只取路径和标题，其他的不要，已减小文件体积
const routes = fileObj.pages.map(e => {
	return {
		title: e.style ? e.style.navigationBarTitleText : '未知',
		path: e.path,
	}
})
// 如果有分包
if (fileObj.subPackages) {
	fileObj.subPackages.forEach(e => {
		e.pages.forEach(i => {
			routes.push({
				title: i.style ? i.style.navigationBarTitleText : '未知',
				path: e.root + '/' + i.path,
			})
		})
	})
}
fs.writeFileSync(toFile, Buffer.from(JSON.stringify(routes)))

// scss变量处理
function appScssVar(oldVarString) {
	const newData = Object.keys(styleVariables).filter(key => key == 'image_replace_directory' || key == 'image_src')
		.map(k => `\$${k}: '${styleVariables[k]}';`)
		.join('\n')
	// 添加样式到全局，这样不用每个页面import了
	oldVarString = oldVarString + '\n' + '@import \"@/uni.scss\";';
	if (!newData) {
		return oldVarString
	}

	return oldVarString + '\n' + newData
}
module.exports = {
	// 配置路径别名
	configureWebpack: {
		devServer: {
			disableHostCheck: true
		},
	},
	
	chainWebpack: (webpackConfig) => {
		
	    webpackConfig.module
	    .rule("mjs$")
	    .test(/.mjs$/)
	    .include.add(/node_modules/)
	    .end()
	    .type("javascript/auto");
		
		const cssTypes = ['vue-modules', 'vue', 'normal-modules', 'normal']
		cssTypes.forEach(type => {
			  webpackConfig.module.rule('scss').oneOf(type).use('sass-loader').tap(options => {
					if (!options.sassOptions) {
					  options.sassOptions = {}
					}
					options.prependData = appScssVar(options.prependData)
					return options
			  })
			  webpackConfig.module.rule('sass').oneOf(type).use('sass-loader').tap(options => {
					if (!options.sassOptions) {
					  options.sassOptions = {}
					}
					options.prependData = appScssVar(options.prependData)
					return options
			  })
		})
	},

}
