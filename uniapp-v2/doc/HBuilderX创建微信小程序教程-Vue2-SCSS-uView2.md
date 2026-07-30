# HBuilderX 创建微信小程序详细教程

> 技术栈：HBuilderX + uni-app + Vue2 + SCSS + uView2  
> 目标平台：微信小程序  
> 项目类型：HBuilderX 可视化创建的 uni-app 项目，不是 Vue CLI 项目

## 一、先理解整个开发流程

使用这套技术栈时，真正编辑的是 uni-app 源码，微信开发者工具主要负责预览、调试和上传：

```text
在 HBuilderX 中编写 .vue 文件
            ↓
HBuilderX 将 uni-app 编译成微信小程序代码
            ↓
生成 unpackage/dist/dev/mp-weixin
            ↓
微信开发者工具打开编译结果
            ↓
预览、真机调试、上传
```

因此需要安装两个开发工具：

1. HBuilderX：编写和编译 uni-app。
2. 微信开发者工具：运行和上传微信小程序。

官方资料：

- [HBuilderX 下载](https://www.dcloud.io/hbuilderx.html)
- [uni-app：通过 HBuilderX 创建项目](https://uniapp.dcloud.net.cn/quickstart-hx.html)
- [uView2 官方安装说明](https://uviewui.com/components/install.html)

---

## 二、安装开发工具

### 2.1 安装 HBuilderX

进入 [HBuilderX 官网](https://www.dcloud.io/hbuilderx.html)，下载适合当前操作系统的正式版。

Windows 版通常是压缩包，解压后直接运行：

```text
HBuilderX.exe
```

建议：

- 使用正式版，不使用 Alpha 版。
- HBuilderX 安装目录不要过深。
- 项目路径不要包含中文、特殊字符和过多空格。

推荐项目路径：

```text
D:\code\uniapp\my-wechat-app
```

不推荐：

```text
D:\我的代码\微信小程序项目
```

### 2.2 安装微信开发者工具

从微信官方下载安装微信开发者工具：

[微信开发者工具下载](https://developers.weixin.qq.com/miniprogram/dev/devtools/download.html)

安装完成后，使用微信扫码登录。

### 2.3 准备 Node.js

仅使用 HBuilderX 创建、运行项目时，可以不单独安装 Node.js，因为 HBuilderX 自带 uni-app 编译环境。

但是，只要项目需要安装普通 npm 第三方包，就必须准备 Node.js 和 npm。

在命令行检查：

```bash
node -v
npm -v
```

Node.js 20 可以正常用于本教程中的 npm 依赖管理。

---

## 三、创建 uni-app Vue2 项目

打开 HBuilderX，依次选择：

```text
文件
→ 新建
→ 项目
→ uni-app
```

创建时建议填写：

```text
项目名称：my-wechat-app
项目目录：D:\code\uniapp
项目模板：默认模板
Vue 版本：Vue2
```

注意不要误选：

- `uni-app x`
- Vue3
- Vue3/Vite
- Hello uni-app 示例项目

本教程使用的是：

```text
普通 uni-app + Vue2
```

### 3.1 创建后再次确认 Vue 版本

打开项目根目录的：

```text
manifest.json
```

在 HBuilderX 可视化配置界面中找到：

```text
基础配置
→ Vue 版本选择
```

确认选择的是：

```text
Vue 2
```

切换到源码视图后，一般可以看到：

```json
{
  "vueVersion": "2"
}
```

不要完全依赖创建项目时的默认选项，创建完成后再检查一次。

---

## 四、认识项目目录

HBuilderX 可视化创建的项目，源码就在项目根目录下，没有 `src` 目录：

```text
my-wechat-app
├─ pages
│  └─ index
│     └─ index.vue
├─ static
├─ uni_modules
├─ utils
├─ unpackage
├─ App.vue
├─ main.js
├─ manifest.json
├─ pages.json
└─ uni.scss
```

主要目录和文件：

| 文件或目录 | 作用 |
| --- | --- |
| `main.js` | Vue2 项目入口，在这里注册 uView2、Vuex 等插件 |
| `App.vue` | 应用入口、应用生命周期、全局基础样式 |
| `pages.json` | 页面路由、导航栏、tabBar、分包配置 |
| `manifest.json` | Vue 版本、微信 AppID、平台能力配置 |
| `uni.scss` | 自动注入到页面 SCSS 中的全局变量 |
| `pages/` | 页面目录 |
| `components/` | 自己封装的公共 Vue 组件 |
| `static/` | 图片、字体等静态资源 |
| `utils/` | 请求、日期、校验等工具代码 |
| `uni_modules/` | uni-app 插件和组件 |
| `node_modules/` | npm 安装的第三方依赖 |
| `unpackage/` | HBuilderX 编译结果，不要手动修改 |

`@` 在 HBuilderX 创建的项目中通常指向项目根目录，例如：

```javascript
import { request } from '@/utils/request'
```

---

## 五、安装 SCSS 编译支持

项目业务样式和 uView2 都使用 SCSS。

在 HBuilderX 中选择：

```text
工具
→ 插件安装
```

找到并安装：

```text
scss/sass 编译
```

有些 HBuilderX 版本会在首次编译 SCSS 时自动提示安装，此时按照提示安装即可。

安装完成后建议重启 HBuilderX。

页面样式统一写成：

```vue
<style lang="scss" scoped>
.page {
  padding: 30rpx;

  &__title {
    color: #303133;
  }
}
</style>
```

---

## 六、安装 uView2

### 6.1 推荐使用 uni_modules 安装

uView2 支持 npm 和 `uni_modules` 两种安装方式。

对于 HBuilderX 可视化项目，推荐使用：

```text
uni_modules
```

优点：

- 不需要通过 npm 安装 uView2。
- 目录结构直观。
- 方便在 HBuilderX 中升级。
- easycom 可以自动识别组件。
- 不容易混淆 HBuilderX 项目和 Vue CLI 项目的路径。

打开：

[uView2 插件市场页面](https://ext.dcloud.net.cn/plugin?id=1593)

点击：

```text
使用 HBuilderX 导入插件
```

然后选择刚刚创建的项目。

导入成功后应该出现：

```text
uni_modules
└─ uview-ui
   ├─ components
   ├─ libs
   ├─ index.scss
   ├─ theme.scss
   └─ package.json
```

本项目是 Vue2，所以使用 uView2。不要安装面向 Vue3 的 uView Plus。

### 6.2 在 main.js 中注册 uView2

打开项目根目录的 `main.js`：

```javascript
import Vue from 'vue'
import App from './App'
import uView from '@/uni_modules/uview-ui'

Vue.use(uView)

Vue.config.productionTip = false

App.mpType = 'app'

const app = new Vue({
  ...App
})

app.$mount()
```

核心代码是：

```javascript
import uView from '@/uni_modules/uview-ui'

Vue.use(uView)
```

这两行要放在 `import Vue from 'vue'` 之后。

### 6.3 在 uni.scss 中引入 uView2 主题

打开项目根目录的 `uni.scss`，在前面加入：

```scss
@import '@/uni_modules/uview-ui/theme.scss';

$app-primary-color: #3c9cff;
$app-success-color: #5ac725;
$app-warning-color: #f9ae3d;
$app-danger-color: #f56c6c;
$app-text-color: #303133;
$app-secondary-text-color: #909399;
$app-background-color: #f5f7fa;
```

`uni.scss` 是 uni-app 特殊处理的全局 SCSS 文件。

在页面的 SCSS 中可以直接使用这里声明的变量，不需要每个页面重复导入：

```vue
<style lang="scss" scoped>
.page {
  color: $app-text-color;
  background-color: $app-background-color;
}
</style>
```

### 6.4 在 App.vue 中引入 uView2 基础样式

修改 `App.vue`：

```vue
<script>
export default {
  onLaunch() {
    console.log('App Launch')
  },

  onShow() {
    console.log('App Show')
  },

  onHide() {
    console.log('App Hide')
  }
}
</script>

<style lang="scss">
@import '@/uni_modules/uview-ui/index.scss';

page {
  box-sizing: border-box;
  min-height: 100%;
  background-color: $app-background-color;
}

view,
text,
image,
button,
input,
textarea {
  box-sizing: border-box;
}
</style>
```

`@import '@/uni_modules/uview-ui/index.scss';` 应放在这个样式块的前面。

### 6.5 easycom 是否需要手动配置

通过 `uni_modules` 安装 uView2 时，一般不需要在 `pages.json` 中手动添加 easycom。

页面里可以直接写：

```vue
<u-button text="确定"></u-button>
```

不需要：

```javascript
import UButton from '...'
```

也不需要在 `components` 中注册。

如果组件确实无法识别，可以在 `pages.json` 中增加：

```json
{
  "easycom": {
    "^u-(.*)": "@/uni_modules/uview-ui/components/u-$1/u-$1.vue"
  },
  "pages": [
    {
      "path": "pages/index/index",
      "style": {
        "navigationBarTitleText": "首页"
      }
    }
  ]
}
```

注意：

- `pages.json` 只能有一个 `easycom` 字段。
- 如果原来已经存在，就合并配置。
- 修改 easycom 后要停止运行并重新编译，热更新可能不会生效。

uView2 官方配置说明：

[uView2 下载方式配置](https://uviewui.com/components/downloadSetting.html)

---

## 七、配置 pages.json

项目初期可以使用下面的配置：

```json
{
  "pages": [
    {
      "path": "pages/index/index",
      "style": {
        "navigationBarTitleText": "首页"
      }
    }
  ],
  "globalStyle": {
    "navigationBarTextStyle": "black",
    "navigationBarTitleText": "微信小程序",
    "navigationBarBackgroundColor": "#ffffff",
    "backgroundColor": "#f5f7fa"
  }
}
```

新增页面时，例如：

```text
pages/login/login.vue
```

必须在 `pages.json` 中注册：

```json
{
  "pages": [
    {
      "path": "pages/index/index",
      "style": {
        "navigationBarTitleText": "首页"
      }
    },
    {
      "path": "pages/login/login",
      "style": {
        "navigationBarTitleText": "登录"
      }
    }
  ]
}
```

也可以在 HBuilderX 中右键项目：

```text
新建
→ 页面
```

勾选“在 pages.json 中注册”，让 HBuilderX 自动完成。

---

## 八、编写第一个测试页面

修改 `pages/index/index.vue`：

```vue
<template>
  <view class="index-page">
    <view class="index-card">
      <view class="index-card__title">
        uni-app 项目创建成功
      </view>

      <view class="index-card__description">
        Vue2 + SCSS + uView2
      </view>

      <u-button
        type="primary"
        text="测试 uView2"
        @click="handleTest"
      ></u-button>

      <view class="status">
        <u-icon
          name="checkmark-circle-fill"
          color="#5ac725"
          size="42"
        ></u-icon>

        <text class="status__text">
          uView2 和 SCSS 均已生效
        </text>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  name: 'IndexPage',

  data() {
    return {
      title: '微信小程序'
    }
  },

  onLoad() {
    console.log('首页加载完成')
  },

  methods: {
    handleTest() {
      uni.showToast({
        title: '运行成功',
        icon: 'success'
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.index-page {
  min-height: 100vh;
  padding: 30rpx;
  background-color: $app-background-color;
}

.index-card {
  padding: 40rpx;
  background-color: #ffffff;
  border-radius: 20rpx;
  box-shadow: 0 10rpx 40rpx rgba(0, 0, 0, 0.06);

  &__title {
    margin-bottom: 20rpx;
    color: $app-text-color;
    font-size: 36rpx;
    font-weight: 600;
  }

  &__description {
    margin-bottom: 40rpx;
    color: $app-secondary-text-color;
    font-size: 28rpx;
  }
}

.status {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 40rpx;

  &__text {
    margin-left: 12rpx;
    color: $app-success-color;
    font-size: 28rpx;
  }
}
</style>
```

这个页面会同时验证：

1. Vue2 Options API 是否生效。
2. SCSS 变量和嵌套语法是否生效。
3. uView2 的 `u-button` 和 `u-icon` 是否生效。

---

## 九、配置微信小程序 AppID

### 9.1 获取 AppID

登录：

[微信公众平台](https://mp.weixin.qq.com/)

进入小程序后台，在开发设置中找到：

```text
AppID（小程序 ID）
```

格式类似：

```text
wx1234567890abcdef
```

### 9.2 配置 manifest.json

在 HBuilderX 中打开 `manifest.json`，进入：

```text
微信小程序配置
→ 微信小程序 AppID
```

填入真实 AppID。

源码结构对应：

```json
{
  "mp-weixin": {
    "appid": "wx1234567890abcdef",
    "setting": {
      "urlCheck": false
    },
    "usingComponents": true
  }
}
```

需要区分：

| 配置 | 作用 |
| --- | --- |
| uni-app 应用标识 | DCloud 服务使用 |
| `mp-weixin.appid` | 微信小程序运行、登录、上传和发布使用 |

微信小程序 AppID 应配置在：

```text
manifest.json
→ mp-weixin
→ appid
```

官方参考：

[uni-app manifest.json 配置](https://uniapp.dcloud.net.cn/collocation/manifest.html)

---

## 十、连接微信开发者工具

### 10.1 开启服务端口

打开微信开发者工具：

```text
设置
→ 安全设置
→ 服务端口
→ 开启
```

HBuilderX 需要通过这个端口自动启动微信开发者工具并打开编译结果。

### 10.2 配置微信开发者工具安装路径

在 HBuilderX 中进入：

```text
运行
→ 运行到小程序模拟器
→ 运行设置
```

设置微信开发者工具的安装目录。

Windows 常见路径：

```text
C:\Program Files (x86)\Tencent\微信web开发者工具
```

也可能是自定义路径：

```text
D:\software\微信web开发者工具
```

### 10.3 运行项目

在 HBuilderX 左侧选中项目，然后选择：

```text
运行
→ 运行到小程序模拟器
→ 微信开发者工具
```

HBuilderX 会生成：

```text
unpackage/dist/dev/mp-weixin
```

如果微信开发者工具没有自动打开，可以手动导入这个目录。

不要把 uni-app 项目根目录直接导入微信开发者工具，因为微信开发者工具不能直接编译 `.vue` 文件。

---

## 十一、项目需要第三方包怎么办

第三方能力主要分成三类，安装方式不能混淆。

| 类型 | 例子 | 推荐安装方式 |
| --- | --- | --- |
| 普通 JavaScript 工具库 | dayjs、decimal.js | npm |
| uni-app 组件或插件 | uView2、uni-popup | `uni_modules` |
| 微信原生小程序组件 | 只提供 WXML/WXSS 的组件 | 优先寻找 uni-app 版本，必要时放入 `wxcomponents` |

### 11.1 安装普通 npm 包

HBuilderX 可视化创建的项目，初始可能没有 `package.json`。

打开 PowerShell、CMD 或 HBuilderX 终端，进入项目根目录：

```bash
cd D:\code\uniapp\my-wechat-app
```

如果没有 `package.json`，先执行：

```bash
npm init -y
```

然后安装第三方包，例如安装 dayjs：

```bash
npm install dayjs
```

安装后会出现：

```text
my-wechat-app
├─ node_modules
├─ package-lock.json
└─ package.json
```

`package.json` 示例：

```json
{
  "name": "my-wechat-app",
  "version": "1.0.0",
  "private": true,
  "dependencies": {
    "dayjs": "^1.11.0"
  }
}
```

版本号以实际安装结果为准，不需要手动照抄示例。

### 11.2 在代码中使用 npm 包

新建：

```text
utils/date.js
```

代码：

```javascript
import dayjs from 'dayjs'

export function formatDate(value, format = 'YYYY-MM-DD HH:mm:ss') {
  if (!value) {
    return ''
  }

  return dayjs(value).format(format)
}
```

页面中使用：

```vue
<template>
  <view class="page">
    {{ currentTime }}
  </view>
</template>

<script>
import { formatDate } from '@/utils/date'

export default {
  data() {
    return {
      currentTime: ''
    }
  },

  onLoad() {
    this.currentTime = formatDate(Date.now())
  }
}
</script>

<style lang="scss" scoped>
.page {
  padding: 30rpx;
}
</style>
```

安装普通 JavaScript 包以后，仍然通过 HBuilderX 的“运行到微信开发者工具”进行编译。

HBuilderX 可视化项目不需要因为安装了依赖就改成：

```bash
npm run dev:mp-weixin
```

这个命令主要属于 Vue CLI 创建的 uni-app 项目。

### 11.3 不要默认给 uni-app 安装 Axios

传统 Vue Web 项目经常使用 Axios，但微信小程序没有浏览器的 `XMLHttpRequest` 环境。

因此不要直接照搬 Web 项目的 Axios 请求封装。更稳妥的方式是使用：

```javascript
uni.request()
```

可以自己封装一个 Promise 请求工具。

新建：

```text
utils/request.js
```

```javascript
const BASE_URL = 'https://api.example.com'

export function request(options = {}) {
  const token = uni.getStorageSync('token')

  return new Promise((resolve, reject) => {
    uni.request({
      url: `${BASE_URL}${options.url}`,
      method: options.method || 'GET',
      data: options.data || {},
      header: {
        'content-type': 'application/json',
        Authorization: token ? `Bearer ${token}` : '',
        ...(options.header || {})
      },
      success(response) {
        const { statusCode, data } = response

        if (statusCode >= 200 && statusCode < 300) {
          resolve(data)
          return
        }

        reject(new Error(data.message || '请求失败'))
      },
      fail(error) {
        reject(error)
      }
    })
  })
}
```

业务接口：

```text
api/user.js
```

```javascript
import { request } from '@/utils/request'

export function getUserInfo() {
  return request({
    url: '/user/info',
    method: 'GET'
  })
}
```

页面调用：

```javascript
import { getUserInfo } from '@/api/user'

export default {
  data() {
    return {
      userInfo: null
    }
  },

  async onLoad() {
    try {
      this.userInfo = await getUserInfo()
    } catch (error) {
      uni.showToast({
        title: error.message || '加载失败',
        icon: 'none'
      })
    }
  }
}
```

### 11.4 Vue2 状态管理要注意版本

当前项目是 Vue2，如果需要 Vuex，应安装 Vuex 3：

```bash
npm install vuex@3
```

不要直接安装只面向新版本 Vue 的依赖。

版本关系可以先这样记：

```text
Vue2 → uView2 → Vuex 3
Vue3 → Vue3 生态组件 → Vuex 4 或 Pinia
```

每次安装 Vue 插件前，都要先检查它是否支持 Vue2。

### 11.5 安装 uni-app 插件

如果第三方功能在 DCloud 插件市场提供 `uni_modules` 版本，优先使用：

```text
使用 HBuilderX 导入插件
```

导入后通常位于：

```text
uni_modules/插件名称
```

这种方式特别适合：

- uni-app UI 组件。
- 上传组件。
- 日期选择器。
- 富文本组件。
- 地图封装。
- 跨端 API 插件。

使用前必须检查插件市场的“平台兼容性”，确认至少支持：

```text
Vue2
微信小程序
```

不能只看到“支持 uni-app”就直接安装，因为有些插件只支持 Vue3、App 或 Web。

### 11.6 微信原生小程序组件怎么办

有些库只有：

```text
.wxml
.wxss
.js
.json
```

这类组件不是 Vue 组件，不能直接复制到 `components` 后用 Vue 的方式导入。

处理顺序：

1. 先找该组件的 uni-app 或 `uni_modules` 版本。
2. 找不到时，再考虑使用 uni-app 的微信原生组件支持。
3. 微信原生组件一般放在项目根目录的 `wxcomponents` 中。
4. 这类代码通常只支持微信小程序，不再具备完整跨端能力。

例如：

```text
wxcomponents
└─ custom-map
   ├─ index.js
   ├─ index.json
   ├─ index.wxml
   └─ index.wxss
```

如果某个原生微信 npm 组件明确要求生成 `miniprogram_npm`，才按照它的文档在微信开发者工具中执行“构建 npm”。

普通 JavaScript npm 包由 uni-app 编译器处理时，通常不需要额外点击微信开发者工具的“构建 npm”。

不要把下面三种方式混为一谈：

```text
普通 npm JavaScript 包
uni_modules 插件
微信原生 npm 组件
```

### 11.7 判断 npm 包能不能用于微信小程序

安装前检查下面几个问题。

#### 检查一：是否依赖浏览器对象

如果源码大量使用以下对象，通常不能直接用于微信小程序：

```javascript
window
document
navigator
localStorage
sessionStorage
XMLHttpRequest
HTMLElement
```

uni-app 官方明确说明，非 H5 平台不能使用依赖 DOM、`window` 等浏览器环境的普通 Web 模块。

官方参考：

[uni-app：JS 文件和第三方模块引入](https://uniapp.dcloud.net.cn/tutorial/page-script.html)

#### 检查二：是否依赖 Node.js 服务端模块

如果包依赖以下模块，也不能直接运行在微信小程序前端：

```javascript
fs
path
net
tls
child_process
```

这些属于 Node.js 服务端能力，不是小程序运行时能力。

#### 检查三：是否支持 Vue2

组件库需要明确支持 Vue2。

例如：

- uView2：适合本项目。
- 只支持 Vue3 的组件库：不能直接使用。
- Element UI：面向 Web DOM，不适合微信小程序。
- Element Plus：面向 Vue3 Web，不适合当前项目。

#### 检查四：包体积是否过大

微信小程序对代码包体积有限制。

建议：

- 优先选择体积小的库。
- 只导入需要的方法。
- 不要为了一个简单函数引入完整的大型工具库。
- 大型功能考虑分包。

例如不要无脑：

```javascript
import _ from 'lodash'
```

可以选择更小的单方法导入，或者直接写一个简单工具函数。

#### 检查五：有没有跨端说明

优先级建议：

```text
明确支持 uni-app 和微信小程序
        >
纯 JavaScript、无平台依赖
        >
只写“支持浏览器”
        >
依赖 DOM 的 Web 组件
```

### 11.8 npm 常用命令

安装生产依赖：

```bash
npm install dayjs
```

安装开发依赖：

```bash
npm install eslint --save-dev
```

卸载依赖：

```bash
npm uninstall dayjs
```

根据 `package.json` 安装全部依赖：

```bash
npm install
```

查看已安装的直接依赖：

```bash
npm list --depth=0
```

检查过期依赖：

```bash
npm outdated
```

不要在项目进行到一半时随意执行：

```bash
npm update
```

批量升级可能导致 Vue2 兼容性问题。重要项目应先在独立分支升级并重新测试。

### 11.9 Git 应该提交哪些依赖文件

应该提交：

```text
package.json
package-lock.json
uni_modules
```

一般不要提交：

```text
node_modules
unpackage
```

`.gitignore` 可以配置：

```gitignore
node_modules/
unpackage/
.DS_Store
```

其他开发者拉取项目后执行：

```bash
npm install
```

就可以根据 `package-lock.json` 恢复依赖。

如果项目完全没有 npm 依赖，则不需要为了形式强行生成 `package.json`。

---

## 十二、请求后端接口时的微信配置

本地开发阶段，可以在微信开发者工具中临时关闭域名校验：

```text
详情
→ 本地设置
→ 不校验合法域名、web-view、TLS 版本以及 HTTPS 证书
```

这个设置仅用于本地调试。

正式上传前，需要在微信公众平台配置合法的 HTTPS 请求域名。

同时注意：

- 正式环境接口必须使用 HTTPS。
- 不能把 `localhost` 当成线上接口地址。
- 手机真机中的 `localhost` 指手机自己，不是电脑。
- 开发、测试、生产环境最好分别配置接口地址。

---

## 十三、开发和发布

### 13.1 开发运行

HBuilderX 中选择：

```text
运行
→ 运行到小程序模拟器
→ 微信开发者工具
```

开发输出目录：

```text
unpackage/dist/dev/mp-weixin
```

### 13.2 发行微信小程序

HBuilderX 中选择：

```text
发行
→ 小程序-微信
```

发行输出目录：

```text
unpackage/dist/build/mp-weixin
```

然后在微信开发者工具中：

```text
上传
→ 填写版本号和项目备注
→ 微信公众平台提交审核
→ 审核通过后发布
```

不要把 `dev/mp-weixin` 当成正式发行目录上传。

---

## 十四、常见报错

### 14.1 未安装 SCSS 编译器

报错类似：

```text
代码使用了 scss 语言，但未安装相应的编译器插件
```

解决：

```text
工具
→ 插件安装
→ 安装 scss/sass 编译插件
→ 重启 HBuilderX
```

### 14.2 找不到 uView2

报错类似：

```text
Cannot find module '@/uni_modules/uview-ui'
```

检查：

```text
uni_modules/uview-ui
```

是否真实存在。

### 14.3 u-button 无法识别

检查以下配置：

```javascript
import uView from '@/uni_modules/uview-ui'

Vue.use(uView)
```

然后停止运行并重新编译。

仍然无效时，再检查 `pages.json` 的 easycom 配置。

### 14.4 找不到 uView2 的 SCSS 文件

检查 `uni.scss`：

```scss
@import '@/uni_modules/uview-ui/theme.scss';
```

检查 `App.vue`：

```scss
@import '@/uni_modules/uview-ui/index.scss';
```

### 14.5 npm 安装后仍然找不到模块

确认命令是在项目根目录执行：

```bash
npm install
```

检查：

```text
package.json
node_modules
```

是否与 `manifest.json` 位于同一级目录。

然后停止 HBuilderX 当前运行任务并重新编译。

### 14.6 报错 window is not defined

这通常不是 HBuilderX 配置问题，而是第三方包依赖浏览器环境。

处理方式：

1. 查看该包是否有 uni-app 或微信小程序版本。
2. 更换为纯 JavaScript 实现。
3. 如果只在 H5 使用，通过条件编译限制平台。

```javascript
// #ifdef H5
// 仅 H5 端执行的代码
// #endif
```

不能用一堆空对象伪造 `window`、`document` 来强行绕过，因为包的真实功能仍然依赖 DOM。

### 14.7 HBuilderX 无法打开微信开发者工具

依次检查：

1. 微信开发者工具是否已经登录。
2. 服务端口是否开启。
3. HBuilderX 中的微信开发者工具路径是否正确。
4. `manifest.json` 是否填写微信小程序 AppID。

仍然不能自动打开时，手动导入：

```text
unpackage/dist/dev/mp-weixin
```

### 14.8 修改配置后一直使用旧结果

可以按以下顺序处理：

```text
停止运行
→ 重新运行
→ 清除微信开发者工具缓存
→ 重启 HBuilderX
```

如果仍然异常，再删除编译产物中的对应开发目录后重新运行。不要删除自己的源码目录。

---

## 十五、最终项目结构建议

随着项目变大，可以整理成：

```text
my-wechat-app
├─ api
│  ├─ user.js
│  └─ order.js
├─ components
│  └─ cus-empty
│     └─ cus-empty.vue
├─ pages
│  ├─ index
│  │  └─ index.vue
│  └─ login
│     └─ login.vue
├─ static
│  ├─ images
│  └─ icons
├─ store
│  └─ index.js
├─ uni_modules
│  └─ uview-ui
├─ utils
│  ├─ date.js
│  ├─ request.js
│  └─ validate.js
├─ App.vue
├─ main.js
├─ manifest.json
├─ package-lock.json
├─ package.json
├─ pages.json
└─ uni.scss
```

职责划分：

```text
pages       页面
components  自己封装的公共组件
api         后端接口定义
utils       通用工具
store       全局状态
static      静态资源
uni_modules uni-app 插件
```

---

## 十六、最终检查表

```text
[ ] 安装 HBuilderX 正式版
[ ] 安装微信开发者工具
[ ] 创建普通 uni-app 项目
[ ] manifest.json 确认为 Vue2
[ ] 安装 scss/sass 编译插件
[ ] 通过 uni_modules 导入 uView2
[ ] main.js 注册 uView2
[ ] uni.scss 引入 uView2 theme.scss
[ ] App.vue 引入 uView2 index.scss
[ ] 页面使用 <style lang="scss" scoped>
[ ] manifest.json 配置微信小程序 AppID
[ ] 微信开发者工具开启服务端口
[ ] HBuilderX 配置微信开发者工具路径
[ ] 成功运行到微信开发者工具
[ ] npm 包安装在项目根目录
[ ] 安装前检查第三方包是否支持 Vue2 和微信小程序
[ ] Git 提交 package.json 和 package-lock.json
[ ] Git 忽略 node_modules 和 unpackage
```

完成以上检查后，这个项目的基础技术栈就是：

```text
Vue2
+ uni-app
+ SCSS
+ uView2
+ npm 第三方依赖
+ 微信小程序
```
