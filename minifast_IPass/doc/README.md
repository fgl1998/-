## 框架说明

> **注意：该项目中公用的代码文件请不要随意更改提交到 SVN，提交前请确认。**
>
> **svn 地址：**[http://192.168.10.70:8090/svn/JY20SR00600/minifast/minifast_IPass](http://192.168.10.70:8090/svn/JY20SR00600/minifast/minifast_IPass)
>
> tip：说明文档采用 `markdown` 语法编写，推荐使用软件 `typora` 浏览阅读 。[软件下载地址：https://www.typora.io/](https://www.typora.io/)



### 1、项目启动步骤

1. 从 [svn](http://118.112.188.108:8090/svn/JY13GC99900/惠民惠农基础版本/applet_demo_uniapp) 上下载或者拉取代码

2. 将代码放至软件 `HBuilderX` IDE（[软件下载地址](https://www.dcloud.io/hbuilderx.html)）中，如下图所示：

   <img src="https://www.hualigs.cn/image/6062d77e78622.jpg" alt=""  />

   

3. 打开 `HBuilderX` 设置页面。选择 `运行配置`，找到小程序运行配置中的 `微信开发者工具路径`。点击 `浏览` 按钮。选择自己电脑微信开发者工具的安装目录，点击 `打开` 按钮。如下图所示：

   <img src="https://www.hualigs.cn/image/6062e6b2af80a.jpg" alt=""  />

   

4. 选中项目，点击`运行按钮` ，选择 `微信开发者工具` ，如下图所示：

   <img src="https://www.hualigs.cn/image/6062d7802ea98.jpg" alt=""  />
   
   

### 2、第一次启动常见问题

1、**预编译器错误。代码使用了 scss/sass 语言，但未安装相应的编译器插件，请前往插件市场安装该插件: [https://ext.dcloud.net.cn/plugin?name=compile-node-sass](https://ext.dcloud.net.cn/plugin?name=compile-node-sass)。**

**如图所示**：

<img src="https://www.hualigs.cn/image/6062e441b315c.jpg" alt=""  />



**解决方法**：点击上面提示的[链接](https://ext.dcloud.net.cn/plugin?name=compile-node-sass)，前往插件市场。点击 `使用 HBuilderX 导入插件` 按钮。（注意：未登录会提示你登录，登录后再访问）。如图所示：



<img src="https://www.hualigs.cn/image/6062e43d2685b.jpg" alt=""  />



待插件安装完成之后，再重复 `项目启动步骤` 中的 `步骤3`。



2、**[error] Error: Fail to open IDE。**

**如图所示**：

<img src="https://www.hualigs.cn/image/6062f06ab0d78.jpg" alt=""  />



**解决方法**：在此微信小程序 `AppId` 中，请确定你是否属于**开发者**。如果不是，请联系管理员进行添加或者更改微信小程序 `AppId`。修改流程如图所示：



![12](https://www.hualigs.cn/image/6062f068d92d1.jpg)



待确定或修改后，再重复 `项目启动步骤` 中的 `步骤3`。



3、**工具的服务端口已关闭。要使用命令行调用工具，请在下方输入 y 以确认开启，或手动打开工具 -> 设置 -> 安全设置，将服务端口开启。**

**如图所示**：

![](https://www.hualigs.cn/image/60b9dfbfeb255.jpg)



**解决方法**：打开微信开发者工具，点击`设置`，选择`安全设置`，将服务端口开启。如图所示：

![](https://www.hualigs.cn/image/60b9dfbd72fcc.jpg)



### 3、目录结构说明

框架默认包含如下目录及文件：

```javascript
├── App_ydjd.vue ------------- 移动监督小程序使用
├── App_ydsh.vue ------------- 移动审核小程序使用
├── App_ykt.vue -------------- 一卡通小程序使用
├── App.vue ------------------ 应用配置，用来配置App全局样式以及监听应用生命周期
├── README.md ---------------- 框架说明文档，md格式
├── README.pdf --------------- 框架说明文档，pdf格式
├── README.docx -------------- 框架说明文档，word格式
├── common ------------------- 存放应用引用的资源（如scss、字体文件等）的目录
├── components --------------- 符合vue组件规范的uni-app组件目录
├── config ------------------- 自定义配置文件（配置请求路径、腾讯地图密钥等）
├── doc ---------------------- 说明文档存放位置
├── jsconfig.json
├── main.js ------------------- Vue初始化入口文件
├── manifestJson -------------- 存放manifest.json文件的文件夹 配置 应用名称、appid、logo、版本等打包信息
├── mixins -------------------- vue mixins
├── package.json
├── pages --------------------- 业务页面文件存放的目录
├── pagesJson ----------------- 配置页面路由、导航条、选项卡等页面类信息
├── static -------------------- 存放应用引用的本地静态资源（如图片、视频等）的目录
├── store --------------------- vuex store
├── uni.scss ------------------ 全局scss变量
├── unpackage ----------------- 项目打包后的目录
└── utils --------------------- 工具包
```

**注意：静态资源存放于 `static` 文件夹，请谨慎考虑存放文件是否有必要存放于该文件夹下，为防止打包体积过大，无法上传，非必要文件不要存放于 `static` 文件夹下。**



### 4、地市切换

各地市第一次更新代码后，切换到自己项目所在地开发，具体步骤（以**内江** `511000` 为例）如下：

#### 4.1、修改`config/city.js`  文件

[![RWzkvD.png](https://z3.ax1x.com/2021/07/04/RWzkvD.png)](https://imgtu.com/i/RWzkvD)

如上图所示，将 `areaCode` 更换为内江的行政区划代码 `511000`。将测试地址 `testRequestUrl` 和正式地址 `formalRequestUrl` 变量更换。

**注意：采用 `发行` 模式打包，使用的是  `formalRequestUrl` 变量地址。采用 `运行` 模式编译，使用的是  `testRequestUrl` 变量地址。**



#### 4.2、更换 `minifest.json` 文件

将 `/minifestJSON/ykt/511000.json` 文件里的内容全部复制到 `minifest.json` 文件里面。 **若文件夹 `/minifestJSON/ykt` 下没有该地市的文件，请联系管理员添加**。如图所示：

![](https://www.hualigs.cn/image/60c86f6a44d02.jpg)



#### 4.3、更换 `pages.json` 文件

将 `/pagesJSON/ykt/511000.json` 文件里的内容全部复制到 `pages.json` 文件里面。 **若文件夹`/pagesJSON/ykt`下没有该地市的后缀文件，请联系管理员添加**。如图所示：

![](https://www.hualigs.cn/image/60c86f6a650b2.jpg)



按照上面步骤更改完成之后，在根据 `1、项目启动步骤` 重新启动程序。

**说明：**`config/city.js` 、`mainfest.json` 、`pages.json`  这三个文件为项目运行时各地市自定义配置文件。`mainfest.json` 和`pages.json`  **文件的修改要及时同步到地市配置文件中**。例如：在项目开发过程中  `pages.json`  文件有修改，将其内容拷贝到  `pagesJSON/ykt/511000.json` 文件中，将  `pagesJSON/ykt/511000.json`  提交到 `svn`。 `pages.json`  则可以不用提交，防止其他地市更新代码冲突。`mainfest.json` 文件同理。



### 5、新增地市

在第一次拉取代码没有该地市的配置文件时，如何新增该地市的配置文件？（以**阿坝** 地市为例）具体操作步骤如下：

1、添加的 ` 513200.js` 文件**（513200为阿坝州行政区划代码，不要随意添加为123456.js之类的文件。如不知本地市行政区划代码，请参考 `config/city.js`）**。在 `config/ykt` 文件夹下添加 ` 513200.js` 文件，可拷贝同目录下的 ` 511700.js` 文件，然后修改文件名进行添加。添加之后在 `index.js` 中引入并且导出配置文件。  如图所示：

[![RWXyNV.png](https://z3.ax1x.com/2021/07/04/RWXyNV.png)](https://imgtu.com/i/RWXyNV)

2、修改添加的 ` 513200.js` 文件。 如图所示：

[![RWX5H1.png](https://z3.ax1x.com/2021/07/04/RWX5H1.png)](https://imgtu.com/i/RWX5H1)

以拷贝 `511700.js` 为例。把文件中的出现的 `config511700`  变量修改为 `config513200` 。然后再修改 `config513200`  变量中的值，如下图所示，请对比两个文件。

[![RWviIx.png](https://z3.ax1x.com/2021/07/04/RWviIx.png)](https://imgtu.com/i/RWviIx)

修改上图中带红色横线的地方，将其值修改为本地市特有值。



3、在 `pages` 文件夹下添加 ` packageDeclare513200` 文件夹。如图所示：

![](https://z3.ax1x.com/2021/06/16/2X66Cn.png)



4、在 `manifestJSON` 目录下添加 `513200 .json` 文件，可拷贝 `manifestJSON` 目录下的其他文件，然后修改文件名进行添加。如图所示：

![](https://z3.ax1x.com/2021/06/16/2X6DEQ.png)

添加文件过后将 `name` 处的名称更改，方便识别。最后将 `appid` 修改为本地市的，此处 `appid` 的修改登录[**微信公众平台**](https://mp.weixin.qq.com/)在`开发管理 => 开发设置` 中进行查看。**不要随意更改**。



5、在 `pagesJSON` 目录下添加 ` 513200.json` 文件，可拷贝 `pagesJSON` 目录下的其他文件，然后修改文件名进行添加。如图所示：

![](https://z3.ax1x.com/2021/06/16/2X6WuT.png)

添加文件过后将 `navigationBarTitleText` 处的名称更改本地市名称。

![](https://z3.ax1x.com/2021/06/16/2X6gg0.png)

找到 `pages/packageDeclareDazhou` 处的名称更改为  `pages/packageDeclare513200` ，将下面的 `pages` 清空为空数组。再找到 `condition`  处将下面的 `list` 清空为空数组。如上图所示。



新增完成后，再按照 `4、地市切换` 进行操作，即可。



### 6、打包发行

**注意：打包发行之后设置为体验版，先使用体验版测试，待无问题后再提交审核。**



以**达州**为例，具体步骤如下：

1、打开 `HBuilderX` 工具，选中项目，然后选择 `发行 => 小程序-微信`。如图所示：

![](https://www.hualigs.cn/image/60c89a4389a39.jpg)



2、检查 `微信小程序Appid` 是否正确，确定后点击 `发行`。如图所示：

![](https://www.hualigs.cn/image/60c89a440e1a8.jpg)



3、 `HBuilderX` 工具编译完成后，自动打开 `微信小程序开发者工具`，点击 `详情 `，**再次检查基本信息是否正确**。如图所示：

![](https://www.hualigs.cn/image/60c89a42ac699.jpg)



4、点击 `上传` 按钮后，再点击 `确定` 按钮。如图所示：

![](https://www.hualigs.cn/image/60c89a4392c21.jpg)



5、根据修改内容选择 `更新类型` ，再输入 `版本号` 和 `项目备注`，点击 `上传` 按钮。如图所示：

![](https://www.hualigs.cn/image/60c89a4378950.jpg)



6、上传成功后点击 `确定` 按钮 。如图所示：

![](https://www.hualigs.cn/image/60c89a43732f2.jpg)



7、打开浏览器，输入[https://mp.weixin.qq.com/](https://mp.weixin.qq.com/) ，手机微信扫码选择刚才上传的小程序账号进行登录。登录成功后点击 `版本管理` 按钮 。如图所示：

![](https://www.hualigs.cn/image/60c89a3dc7802.jpg)



8、找到刚才上传的版本。点击 `提交审核` 按钮 。如图所示：

![](https://www.hualigs.cn/image/60c89a3e43c52.jpg)



9、勾选 `已阅读并了解平台审核规则` ，点击 `下一步` 按钮 。如图所示：

![](https://www.hualigs.cn/image/60c89a3e64ea7.jpg)


10、点击 `继续提交` 按钮 。如图所示：

![](https://www.hualigs.cn/image/60c89a3e79b8c.jpg)



11、输入 `版本描述` 信息 。如图所示：

![](https://www.hualigs.cn/image/60c89a3e1b1f3.jpg)



12、选择 `审核加急` 单选框，选择 `不加急`，特殊情况 `加急` 。如图所示：

![](https://www.hualigs.cn/image/60c89a3e39b9d.jpg)



### 7、服务端说明

#### 7.1、主配置文件为 `application.yml` 文件

改配置文件主要是引入其他配置文件，如下图所示，我本机引入的就是：

`application-mybatis_gs.yml（公司数据库配置）`

`application-ucm_gs.yml（公司统一存储）`

`application-webservice_gs.yml（公司webservice地址）`

`application-gs.yml（公司业务配置）`

各个地市开发和发布过程中只需修改主文件`（application.yml）`，引入对应的配置文件就行

 

注意：搭建地市项目时，我们会默认创建这些配置文件

测试环境：**命名规则为主文件名+地市编码**

正式环境：**命名规则为主文件名+地市编码+zs**

例如：

南充数据库测试环境配置文件为：`application-mybatis_511300.yml`

南充正式环境数据库配置文件：`application-mybatis_511300_zs.yml`

[![WFAjVe.png](https://z3.ax1x.com/2021/07/12/WFAjVe.png)](https://imgtu.com/i/WFAjVe)





#### 7.2、业务配置文件 `（application-地市编码.yml）` 说明



以公司配置文件 `application-gs.yml` 为例：

+ `appId`：这个 appId 现在默认有三个配置，第一个为**群众小程序**，第二个为**领导小程序**，第三个为**经办人小程序**。

+ `appSecret`：与 `appId` 相对应。

+ `mpAppId`：公众号 `id`（主要针对于微信消息推送时使用）。



[![WFEu2q.png](https://z3.ax1x.com/2021/07/12/WFEu2q.png)](https://imgtu.com/i/WFEu2q)



#### 7.3、新增码表配置

修改业务配置文件**（application-地市编码.yml）**：

发放系统：`codetable-->collectionKeyList`

阳光审批系统：`codetableygsp-->collectionKeyList`

注意：例如小程序前端添加下拉框文化程度`（AAC011）`,首先去阳光审批数据库去查看 `aa10a1` 中是否存在该码值，若存在，则在对应的业务配置文件中添加key`（AAC011）`，然后重启服务，系统会将码值加载到缓存中。



[![WFEti9.png](https://z3.ax1x.com/2021/07/12/WFEti9.png)](https://imgtu.com/i/WFEti9)



### 8、移动监督小程序启动

如何启动移动监督小程序，请按照如下步骤进行操作：

**注意：以下操作中更改的文件（`config/city.js`、`config/index.js`、`App.vue`、`manifest.json`、`pages.json`）在本地保存即可，不要提交到SVN仓库！！！！！**

**注意：以下操作中更改的文件（`config/city.js`、`config/index.js`、`App.vue`、`manifest.json`、`pages.json`）在本地保存即可，不要提交到SVN仓库！！！！！**

**注意：以下操作中更改的文件（`config/city.js`、`config/index.js`、`App.vue`、`manifest.json`、`pages.json`）在本地保存即可，不要提交到SVN仓库！！！！！**



#### 8.1、更改 `config/city.js`

![](https://www.hualigs.cn/image/616f82f704a2c.jpg)

如上图所示，修改areaCode、testRequestUrl、formalRequestUrl处的值，改为当前地市所使用的值。



#### 8.2、更改 `config/index.js`

![](https://www.hualigs.cn/image/616f82f6c32ea.jpg)

如上图所示，根据相应的注释放开或者注释相应的文件。

 

#### 8.3、更改 `App.vue`

![](https://www.hualigs.cn/image/616f870e260df.jpg)

如上图所示，将 `App_ydjd.vue` 里面的内容全部拷贝替换 `App.vue` 的内容。



#### 8.4、更改 `mainfest.json`

![](https://www.hualigs.cn/image/616f870cdc193.jpg)

如上图所示，将  `manifestJSON/ydjd/地市行政区划编码.json` 里面的内容全部拷贝替换 `manifest.json` 的内容。



#### 8.5、更改 `pages.json`

![](https://www.hualigs.cn/image/616f870b6d989.jpg)

如上图所示，将  `pagesJSON/ydjd/地市行政区划编码.json` 里面的内容全部拷贝替换 `pages.json` 的内容。

