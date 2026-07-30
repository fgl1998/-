# 独生子女父母奖励金申报流程文档

> **项目背景**：成都市（510100）惠民惠农财政补贴"一卡通"小程序  
> **项目编号**：declare-20002（独生子女父母奖励金）  
> **主管部门**：卫生健康委  
> **技术栈**：uni-app (Vue 2) + Vuex + 微信小程序/H5/支付宝多端  
> **参与时间**：约 2022 年  
> **支持城市**：成都、内江、达州、广安、泸州、自贡、攀枝花、遂宁、乐山、南充、宜宾、雅安、巴中、资阳、阿坝、甘孜、凉山等 18+ 个城市

---

## 〇、申报完整路线图（7 个页面，含多条分支路径）

用户从看到项目列表到申报完成，最多经过 7 个页面。中间有多个条件分支决定实际路径。

### 0.1 简化总览

```
① 阳光申报首页 ──▶ ② 申报须知 ──▶ ③ 选择申报类型 ──▶ ④ 业务填报
                                                          │
                                     ┌────────────────────┘
                                     ▼
                              ⑤ 生存认证 (人脸识别)
                                     │
                                     ▼
                              ⑥ 材料上传 ──▶ ⑦ 申报结果
```

### 0.2 完整流程图（含所有分支）

```
① 阳光申报首页 (tabbar/sunshine-declare)
  │  展示所有可申报的补贴项目列表
  │  用户点击「独生子女父母奖励金」
  ▼
② 申报须知 (notice.vue)
  │  ┌─────────────────────────────────────────────┐
  │  │ API: requestB017(chi031)                    │
  │  │  → 服务对象列表 (ac10List)                  │
  │  │  → 申报材料清单 (he11List)                  │
  │  │  → 补贴标准 (hi03DomianList)                │
  │  │  → 政策解答员 (hi03DomianList)              │
  │  │ API: requestSPGetHi05List(chi031)           │
  │  │  → 相关政策文件列表                         │
  │  └─────────────────────────────────────────────┘
  │  用户点击「立即申报」
  │  ├── isFixedDeclareType && isJumpDeclareTypeSelect
  │  │   → 直接跳④ (跳过类型选择)
  │  └── 正常 → 进入③
  ▼
③ 选择申报类型 (type.vue)
  │  ┌─────────────────────────────────────────────┐
  │  │ API: requestB060(chi031)                    │
  │  │  → 检查该项目是否在开放时间段内             │
  │  │  → 若未开放，弹窗显示开放时间段             │
  │  └─────────────────────────────────────────────┘
  │  用户选择：
  │  ├── 「为自己申报」(declareType='01')
  │  │   → name='declare-20002'
  │  │   → url=/pages/packageDeclare510100/declare-20002/declare-20002
  │  │   → 参数: chi031=20002, declareType=01
  │  └── 「为他人申报」(declareType='02')
  │      → 同上，declareType=02
  ▼
④ 业务填报 (declare-20002.vue) ★ 本页
  │  ┌─────────────────────────────────────────────┐
  │  │ onLoad 初始化：                             │
  │  │  ├── getPersonnelList(chi031)  人员类别列表 │
  │  │  ├── getDeclareConfig(chi031)  项目配置     │
  │  │  └── getCodeTableCacheData()   码表数据     │
  │  └─────────────────────────────────────────────┘
  │  用户填写：
  │  ├── 申报人基本信息 (ComponentDeclare)
  │  │   ├── 自主申报(01): 自动填充当前用户信息
  │  │   │   ├── 身份证 → 自动算性别/年龄/生日
  │  │   │   ├── 可选：查询残疾人/建档立卡/社保卡
  │  │   │   └── 选择户籍地址
  │  │   └── 代办申报(02): 手动输入申报人信息
  │  │       └── 还需填写代办人联系电话
  │  ├── 申报信息（婚姻状况、光荣证号、办证时间）
  │  ├── 配偶信息（姓名、身份证、性别、年龄、婚姻状况、户口性质）
  │  └── 独生子女信息（姓名、身份证、性别、出生时间）
  │
  │  用户点击「下一步」
  │  ├── handleCheckComponentInput()  校验基础信息
  │  ├── handleCheckInput()           校验项目特有字段
  │  └── handleDeclareData(hb00BizMap, '0')
  │       │
  │       ├── 组装完整 data 对象
  │       ├── $store.commit(UPDATE_DECLARE_INFO, data)
  │       │
  │       └── ★ 路由决策 ★
  │            │
  │            ├── 无 closeAuth 配置
  │            │   └── navigateTo('survival-certification') ──▶ ⑤
  │            │
  │            ├── closeAuth = [] (空数组，全员跳过)
  │            │   └── chb006='1' → navigateTo('file') ──▶ ⑥
  │            │
  │            ├── closeAuth 包含当前人员类别
  │            │   └── chb006='1' → navigateTo('file') ──▶ ⑥
  │            │
  │            └── chooseAuth 配置 (可选择验证方式)
  │                └── 弹窗询问「是否使用人脸认证」
  │                    ├── 是 → navigateTo('survival-certification') ──▶ ⑤
  │                    └── 否 → chb006='1' → navigateTo('file') ──▶ ⑥
  │
  ▼
⑤ 生存认证 (survival-certification.vue)  [可跳过]
  │  ┌─────────────────────────────────────────────┐
  │  │ 从 Vuex declareInfo 读取：                  │
  │  │  ├── aac002 (身份证号)                      │
  │  │  └── aac003 (姓名)                          │
  │  └─────────────────────────────────────────────┘
  │  用户点击「开始生存认证」
  │  ├── startFacialRecognitionVerify(姓名, 身份证号)
  │  │   (调用微信原生人脸识别)
  │  ├── 成功 → requestWXGetFaceInfo(code)
  │  │   ├── errcode=0 && identify_ret=0
  │  │   │   → chb006='1' (认证成功)
  │  │   │   → redirectTo('file') ──▶ ⑥
  │  │   └── 否则 → 弹窗「认证出错，是否跳过？」
  │  │       ├── 是 → navigateTo('tip') ──▶ ⑥ (跳过认证)
  │  │       └── 否 → 重新认证
  │  └── 失败 → 弹窗「是否跳过？」
  │      ├── 是 → navigateTo('tip') ──▶ ⑥
  │      └── 否 → 重新认证
  │
  │  [可选] 若 isOpenSign=true
  │  └── redirectTo('sign') → 电子签名 ──▶ ⑥
  │
  ▼
⑥ 材料上传 (file.vue)
  │  ┌─────────────────────────────────────────────┐
  │  │ ComponentUploadFiles 加载：                 │
  │  │  ├── 根据 chi031 + aka131 请求材料列表      │
  │  │  └── 展示每个材料的上传入口                 │
  │  └─────────────────────────────────────────────┘
  │  用户上传材料后点击「下一步」
  │  ├── checkFilesUploadStatus()  检查全部上传成功
  │  ├── 组装 hi21List (文件ID/名称/类型)
  │  ├── $store.commit(UPDATE_DECLARE_INFO, { hi21List })
  │  │
  │  ├── chb006 === '0' (未认证)
  │  │   └── redirectTo('apply') ──▶ 放行申请页
  │  │        │  用户填写申请原因+说明+补充材料
  │  │        │  requestSPSaveAc16ForWX() 提交放行申请
  │  │        └── switchTab('home')  回到首页等待审核
  │  │
  │  └── chb006 === '1' (已认证)
  │      ├── requestB001(declareInfo)  提交申报
  │      │   返回: chb000(业务主键), chb01b(校验状态), cpb100(流程主键)
  │      │
  │      ├── 同时申报多个项目？
  │      │   └── Promise.all([requestB001(A), requestB001(B)])
  │      │
  │      └── redirectTo('result', { info: JSON.stringify([res]) }) ──▶ ⑦
  │
  ▼
⑦ 申报结果 (result.vue)
  │  进度条 current=5 (全部三步激活)
  │  ├── 解析 result 数据
  │  │   ├── chb01b='1' → ✅ 申报成功
  │  │   └── chb01b='2' → ❌ 申报失败
  │  │
  │  ├── requestB013(chb000)  获取资格核验详情
  │  │   └── 展示各项核验结果（通过/失败+原因）
  │  │
  │  ├── 代办模式(declareType='02')
  │  │   ├── [继续申报] → reLaunch 回业务填报页
  │  │   └── [完成] → switchTab('home')
  │  │
  │  └── 自主模式
  │      └── [完成] → switchTab('home')
  │
  │  快捷导航：
  │  └── 「业务申报进度查询」→ navigateTo('my-declare')
```

### 0.3 每条路径总结

| 场景 | 实际路径 |
|------|---------|
| 需要人脸认证（默认） | ①→②→③→④→⑤→⑥→⑦ (7页) |
| 配置跳过认证(closeAuth=[]) | ①→②→③→④→⑥→⑦ (6页) |
| 固定申报+跳过类型选择 | ①→②→④→⑤→⑥→⑦ (6页) |
| 人脸认证失败→跳过 | ①→②→③→④→⑤→tip→⑥→⑦ (8页) |
| 未认证→放行申请 | ①→②→③→④→⑤→⑥→apply→首页 (不走结果页) |

### 0.4 各页面涉及的 API 汇总

| 页面 | API | 说明 |
|------|-----|------|
| ② notice | `requestB017` | 获取服务对象、申报材料、补贴标准 |
| ② notice | `requestSPGetHi05List` | 获取相关政策文件 |
| ③ type | `requestB060` | 检查项目开放时间段 |
| ④ declare | `requestB017` | 获取人员类别列表 |
| ④ declare | `requestWXGetCodeTableCache` | 获取码表（首次） |
| ④ declare | `requestSPGetHo08` | 查询残疾人信息(可选) |
| ④ declare | `requestSPGetHo07Info` | 查询建档立卡信息(可选) |
| ④ declare | `requestB043` | 查询社保卡信息(可选) |
| ⑤ certification | `startFacialRecognitionVerify` | 微信原生人脸识别 |
| ⑤ certification | `requestWXGetFaceInfo` | 验证人脸识别结果 |
| ⑥ file | `requestB001` | **提交申报**（核心） |
| ⑥ file | `requestB009` | 作废旧申报(重新申报时) |
| ⑦ result | `requestB013` | 查询资格核验结果 |

---

## 一、项目整体架构

### 1.1 技术架构

```
┌─────────────────────────────────────────────────┐
│                 uni-app 跨端框架                  │
├─────────────────────────────────────────────────┤
│  Vue 2.x  │  Vuex 状态管理  │  Mixins 共享逻辑   │
├─────────────────────────────────────────────────┤
│  微信小程序 (MP-WEIXIN) │ 支付宝 (MP-ALIPAY) │ H5 │
├─────────────────────────────────────────────────┤
│          AES 加密传输  │  JWT Token 认证         │
└─────────────────────────────────────────────────┘
```

### 1.2 关键目录结构

```
├── pages/
│   ├── packageDeclare/          # 申报通用流程页面
│   │   ├── survival-certification/  # 人脸识别/生存认证
│   │   ├── file/                    # 材料上传
│   │   ├── apply/                   # 申报提交确认
│   │   ├── result/                  # 申报结果
│   │   └── tip/                     # 提示页（跳过认证时）
│   │
│   └── packageDeclare510100/    # 成都地区申报项目页面
│       ├── declare-20002/           # ★ 独生子女父母奖励金
│       ├── declare-20021/           # 其他补贴项目...
│       ├── declare-20061/
│       └── components/              # 成都地区专用组件
│
├── components/project/          # 项目通用组件
│   ├── ez-declare/              # ★ 申报基本信息组件
│   ├── ez-declare-step/         # ★ 步骤进度条组件
│   ├── ez-declare-picker/       # 选择器组件
│   ├── ez-declare-radio/        # 单选框组件
│   ├── ez-declare-personnel/    # 人员类别组件
│   └── ez-select-permanent-address/  # 户籍地址选择器
│
├── mixins/
│   ├── useDeclare.js            # ★ 核心申报 Mixin（所有申报页共用）
│   └── index.js
│
├── service/
│   ├── request.js               # ★ 统一请求封装（加密/Token/错误处理）
│   ├── aes.js                   # AES 加解密
│   └── api/                     # 180+ 个业务 API 文件
│       ├── requestB001.js       # 申报提交接口
│       ├── requestB017.js       # 获取人员类别接口
│       └── ...
│
├── store/                       # Vuex 状态管理
│   ├── state/index.js           # 全局状态定义
│   └── constants/               # Mutation/Getter 常量
│
├── utils/
│   ├── get/                     # 工具函数
│   │   ├── getGender.js         # 从身份证提取性别
│   │   ├── getAge.js            # 从身份证提取年龄
│   │   ├── getBirthday.js       # 从身份证提取出生日期
│   │   └── getDeclareConfig.js  # 获取申报配置
│   ├── check/                   # 校验函数
│   │   ├── checkIDCard.js       # 身份证格式校验
│   │   └── checkPhoneNumber.js  # 手机号格式校验
│   └── custom-api/              # 自定义业务 API
│       └── getCodeListByCodeName.js  # ★ 码表缓存获取
│
└── config/                      # 按城市划分的配置文件
    └── index.js                 # 配置入口（根据 areaCode 加载）
```

### 1.3 设计模式

| 模式 | 应用场景 |
|------|---------|
| **Mixin 复用** | `useDeclare.js` 是所有申报页面的核心 mixin，封装了 onLoad 处理、数据校验、数据组装、页面跳转等公共逻辑 |
| **组件化表单** | 每个表单字段类型（Picker、Radio、地址选择等）都有对应的通用组件 |
| **Vuex 跨页面通信** | 申报数据在「业务填报 → 人脸认证 → 材料上传 → 提交」各页面间通过 Vuex 传递 |
| **码表缓存** | 字典数据（性别、民族、婚姻状况等）先从本地 Storage 读，没有再请求后端并缓存 |
| **renderObj 渲染控制** | 通过 `renderObj` 配置对象控制每个项目需要展示/校验哪些字段 |
| **条件编译** | `#ifdef MP-WEIXIN` / `#ifdef MP-ALIPAY` 实现跨平台适配 |

---

## 二、前置页面说明

### 2.0.1 申报须知页 (notice.vue)

这是用户点击某个补贴项目后进入的第一个页面。核心功能：

```
onLoad 获取 chi031 (项目编码) 和 chi031_desc (项目名称)
    │
    ├── requestB017(chi031) → 获取申报须知数据
    │   返回数据包含：
    │   ├── ac10List → 人员类别列表
    │   ├── 服务对象说明
    │   ├── 申报材料清单
    │   ├── 补贴标准
    │   ├── 办理时限
    │   └── 政策解答员信息
    │
    ├── requestFFGetChi037ListForPolicyFile(chi031) → 获取相关政策文件
    │
    └── 页面展示：
        ├── 服务对象卡片
        ├── 申报材料卡片
        ├── 补贴标准卡片
        ├── 政策文件卡片
        ├── 申报入口卡片
        └── [立即申报] 按钮 (仅当 chi04z === '1' 时显示)
```

### 2.0.2 选择申报类型页 (type.vue)

用户点击"立即申报"后的页面：

```
┌──────────────────────────────────┐
│  服务事项：独生子女父母奖励金     │
├──────────────────────────────────┤
│  ┌─────────────────────────┐    │
│  │  👤                     │    │
│  │  为自己申报              │    │
│  │  自动带上身份信息...     │    │
│  │  [立即申请]              │    │
│  └─────────────────────────┘    │
│  ┌─────────────────────────┐    │
│  │  👥                     │    │
│  │  为他人申报              │    │
│  │  手动输入申报人信息...   │    │
│  │  [立即申请]              │    │
│  └─────────────────────────┘    │
└──────────────────────────────────┘

点击后：
  navigateTo('declare-20002', 'packageDeclare510100', {
    chi031: '20002',
    chi031_desc: '独生子女父母奖励金',
    declareType: '01' 或 '02'
  })
```

### 2.0.3 从 type 页跳转到 declare-20002 的路由机制

这是理解整个项目路由架构的关键一环，核心代码在 `type.vue` 的 `handleJumpRoute` 方法中。

**第一步：type.vue 拼接页面名称**

`pages/packageDeclare/type/type.vue` 第 119-133 行：

```javascript
handleJumpRoute(declareType) {
  const chi031 = this.chi031                         // '20002'
  const chi031_desc = this.chi031_desc               // '独生子女父母奖励金'
  const { declarePackageName } = config              // ★ 从城市配置中读取包名

  const name = 'declare-' + chi031                   // ★ 拼接：'declare-20002'

  navigateTo(name, declarePackageName, {
    chi031,              // '20002'
    declareType,         // '01' 或 '02'
    fixedDeclareType,
    chi031_desc,
  })
}
```

**第二步：从城市配置文件获取包名**

`config/citys/510100.js` 第 11 行：

```javascript
declarePackageName: 'packageDeclare510100',  // 成都的申报页面分包名
```

每个城市有自己的分包，存放该城市专属的申报页面：

| 城市 | areaCode | declarePackageName |
|------|----------|-------------------|
| 成都 | 510100 | `packageDeclare510100` |
| 泸州 | 510500 | `packageDeclare510500` |
| 达州 | 511700 | `packageDeclare511700` |

**第三步：navigateTo 拼接最终 URL**

`utils/uni-api/navigateTo.js` 第 38-69 行：

```javascript
const navigateTo = (name, packageName, params) => {
  let url = `/pages/${name}/${name}`                  // 无包名时的默认路径

  if (packageName) {
    url = `/pages/${packageName}/${name}/${name}`      // ★ 有包名时拼接分包子路径
  }

  // 将 params 对象序列化为 URL 查询参数
  if (params 是对象) {
    for (const key in params) {
      paramStr += `${key}=${params[key]}&`             // 拼接：chi031=20002&declareType=01&...
    }
    url = `${url}?${paramStr}`
  }

  uni.navigateTo({ url })                              // 调用微信原生路由
}
```

**第四步：最终生成的实际 URL**

```
/pages/packageDeclare510100/declare-20002/declare-20002
  ?chi031=20002
  &declareType=01
  &fixedDeclareType=00
  &chi031_desc=独生子女父母奖励金
```

**第五步：declare-20002.vue 接收参数**

页面 `onLoad(e)` 接收到参数后，调用 mixin 的 `handleOnLoad(e)` 完成初始化：

```javascript
// e = { chi031: '20002', declareType: '01', chi031_desc: '独生子女父母奖励金' }

handleOnLoad(e) {
  this.chi031 = e.chi031              // '20002'
  this.chi031_desc = e.chi031_desc    // '独生子女父母奖励金'
  this.declareType = e.declareType    // '01'
  // 后续：获取人员类别、码表、申报配置...
}
```

**完整跳转链路图**

```
阳光申报列表 (tabbar/sunshine-declare)
  │  用户点击「独生子女父母奖励金」
  ▼
申报须知 (notice.vue)
  │  URL参数: ?chi031=20002&chi031_desc=独生子女父母奖励金
  │  展示服务对象、申报材料、补贴标准、政策文件
  │  用户点击「立即申报」→ navigateTo('type', 'packageDeclare', { chi031, chi031_desc })
  ▼
选择申报类型 (type.vue)
  │  URL参数: ?chi031=20002&chi031_desc=独生子女父母奖励金
  │  用户点击「为自己申报」(declareType='01')
  │
  │  ┌──────────────── 路由拼接核心逻辑 ────────────────┐
  │  │                                                │
  │  │  name = 'declare-' + '20002'                   │
  │  │       = 'declare-20002'                        │
  │  │                                                │
  │  │  declarePackageName = config.declarePackageName │
  │  │                     = 'packageDeclare510100'    │
  │  │                                                │
  │  │  url = '/pages/' + 'packageDeclare510100'      │
  │  │      + '/declare-20002/declare-20002'          │
  │  │      + '?chi031=20002&declareType=01&...'      │
  │  └────────────────────────────────────────────────┘
  │
  ▼  uni.navigateTo({ url })
业务填报 (declare-20002.vue)  ←── 本页
  onLoad(e) → handleOnLoad(e) → 初始化页面
```

> **为什么采用「城市分包 + 动态拼接」的路由架构？**
>
> 不同城市虽然都有"独生子女父母奖励金"(20002)，但每个城市的表单字段、校验规则、认证策略完全不同。通过城市分包隔离，同一项目编码在不同城市可以有不同的页面实现，互不干扰。type.vue 是通用的（不分城市），通过 `config.declarePackageName` 动态决定跳转到哪个城市的申报分包。

---

## 三、申报全流程详解 (3 步进度条)

```
┌──────────────┐     ┌──────────────┐     ┌──────────────┐
│  ① 业务填报   │ ──▶ │  ② 材料上传   │ ──▶ │  ③ 资格核验   │
│  (当前页)     │     │  (file.vue)  │     │  (后台自动)   │
│  current=2   │     │  current=3   │     │  current>4   │
└──────────────┘     └──────────────┘     └──────────────┘
        │                    │
        │  可能插入          │
        ▼                    │
  ┌──────────────┐           │
  │  生存认证     │ ─────────┘
  │  (人脸识别)   │
  └──────────────┘
```

### 3.1 第一步：业务填报（本页面 declare-20002）

#### 3.1.1 页面初始化流程

```
用户点击申报入口
    │
    ▼
onLoad(e) 接收参数:
  ├── chi031 = '20002'        (补贴项目编码)
  ├── chi031_desc = '独生子女父母奖励金' (项目名称)
  ├── declareType             (申报类型: '01'自主 / '02'代办)
  └── fixedDeclareType        (固定申报类型，不可切换)
    │
    ▼
handleOnLoad(e) [来自 useDeclare mixin]:
  ├── 1. 保存 chi031、chi031_desc
  ├── 2. getPersonnelList(chi031) → 调用 requestB017 获取人员类别列表
  ├── 3. 设置 declareType / fixedDeclareType
  ├── 4. getDeclareConfig(chi031) → 读取该项目配置(是否跳过认证等)
  └── 5. getCodeTableCacheData() → 获取本项目需要的码表
       ├── aac017 (婚姻状况) 
       └── aac004 (性别)
```

#### 3.1.2 页面 UI 结构

```
┌──────────────────────────────────────┐
│  ① 业务填报 ──●── ② 材料上传 ─── ③ 资格核验  │  ← ez-declare-step 进度条
├──────────────────────────────────────┤
│  ┌ 申报人/代办人基本信息 ────────────┐  │  ← ComponentDeclare (通用组件)
│  │  身份证号：510xxx...              │  │
│  │  姓名：张三                       │  │
│  │  联系电话：138xxx                 │  │
│  │  性别：男（自动识别）             │  │
│  │  年龄：45（自动识别）             │  │
│  │  户口性质：[选择]                 │  │
│  │  户籍地址：[省/市/区/街道选择]    │  │
│  │  人员类别：[选择]                 │  │
│  └──────────────────────────────────┘  │
├──────────────────────────────────────┤
│  ┌ 申报信息 ────────────────────────┐  │  ← 项目特有字段
│  │  婚姻状况：[选择]                 │  │
│  │  独生子女父母光荣证号：[输入]     │  │
│  │  办理光荣证时间：[日期选择]       │  │
│  └──────────────────────────────────┘  │
├──────────────────────────────────────┤
│  ┌ 配偶信息 ────────────────────────┐  │
│  │  配偶姓名*：[输入]               │  │
│  │  配偶身份证号*：[输入]           │  │
│  │  配偶性别：[选择]                │  │
│  │  配偶年龄：[自动/输入]           │  │
│  │  配偶婚姻状况：[选择]            │  │
│  │  配偶户口性质：[选择]            │  │
│  └──────────────────────────────────┘  │
├──────────────────────────────────────┤
│  ┌ 独生子女信息 ────────────────────┐  │
│  │  子女姓名*：[输入]               │  │
│  │  子女身份证*：[输入]             │  │
│  │  子女性别：[选择/自动]           │  │
│  │  子女出生时间：[日期选择]        │  │
│  └──────────────────────────────────┘  │
├──────────────────────────────────────┤
│              [ 下一步 ]               │
└──────────────────────────────────────┘
```

#### 3.1.3 renderObj 渲染控制机制

每个申报页面通过 `renderObj` 控制 ComponentDeclare 组件显示哪些基础信息字段：

```javascript
// declare-20002 的 renderObj 配置
renderObj: {
  idCard: true,           // 显示身份证号
  userName: true,         // 显示姓名
  tel: true,              // 显示联系电话
  nature: true,           // 显示户口性质
  age: true,              // 显示年龄
  gender: true,           // 显示性别
  permanentAddress: true, // 显示户籍地址
  // 不显示：nation(民族), education(学历), currentAddress(现居住地址), 
  //         nativePlace(籍贯), SSCNumber(社保卡号) 等
}
```

#### 3.1.4 身份证自动识别机制

输入身份证号后，自动联动填充：

```
输入 18 位身份证号
    │
    ▼
blur 事件触发 checkIDCard() 校验
    │
    ▼ (校验通过)
┌─────────────────────────────────┐
│ getGender(idCard) → 第17位奇男偶女 │  → 自动填充性别
│ getAge(idCard) → 出生日期算年龄    │  → 自动填充年龄
│ getBirthday(idCard) → 第7-14位     │  → 自动填充出生日期
└─────────────────────────────────┘
    │
    ▼
额外校验（根据 declareConfig 配置）:
  ├── isCheckDisability → 查询是否残疾人
  └── isCheckFileAndRegister → 查询是否建档立卡贫困户
```

> **代码位置**：`components/project/ez-declare/ez-declare.vue` 中的 `handleIdcardBlur()` 方法

#### 3.1.5 本项目特有字段的 ID 卡联动

当用户输入**配偶身份证** (`w00038`) 时：
```javascript
handleBlurW00038(e) {
  // 1. 校验身份证格式
  // 2. 自动填充配偶年龄 (w00081) = getAge(value)
  // 3. 自动填充配偶性别 (w00040) = getGender(value) == '男' ? '1' : '2'
}
```

当用户输入**子女身份证** (`w00005`) 时：
```javascript
handleBlurW00005(e) {
  // 1. 校验身份证格式
  // 2. 自动填充子女性别 (w00067) = getGender(value) == '男' ? '1' : '2'
}
```

### 3.2 点击"下一步"后的完整流程

```
handleJumpNextStep()
    │
    ├── Step 1: handleCheckComponentInput()
    │   │  (来自 useDeclare mixin，校验基础信息)
    │   │
    │   ├── 如果是代办('02')：
    │   │   ├── 代办人身份证号不能为空
    │   │   └── 代办人联系电话格式校验
    │   │
    │   ├── 根据 renderObj 逐项校验：
    │   │   ├── idCard_r=true → 身份证号非空 + 格式校验
    │   │   ├── userName_r=true → 姓名非空
    │   │   ├── tel_r=true → 联系电话非空 + 格式校验
    │   │   ├── nation_r → 民族已选择
    │   │   ├── nature_r → 户口性质已选择
    │   │   ├── education_r → 学历已选择
    │   │   ├── nativePlace_r → 籍贯已选择
    │   │   ├── permanentAddress_r → 户籍地址已选择
    │   │   └── currentAddress_r → 现居住地址已选择
    │   │
    │   └── 校验人员类别已选择
    │
    ├── Step 2: handleCheckInput()
    │   │  (本项目特有字段校验)
    │   │
    │   ├── 婚姻状况 (w00041) - 必填
    │   ├── 配偶姓名 (w03006) - 必填
    │   ├── 配偶身份证 (w00038) - 必填 + 格式校验
    │   ├── 配偶性别 (w00040) - 必填
    │   ├── 配偶年龄 (w00081) - 必填
    │   ├── 配偶婚姻状况 (w00073) - 必填
    │   ├── 配偶户口性质 (w00044) - 必填
    │   ├── 子女姓名 (w00004) - 必填
    │   ├── 子女身份证 (w00005) - 必填 + 格式校验
    │   ├── 子女性别 (w00067) - 必填
    │   ├── 子女出生时间 (w00068) - 必填
    │   └── 独生子女证号/办理时间 - 非必填(已注释)
    │
    └── Step 3: handleDeclareData(hb00BizMap, '0')
         │
         ├── 3.1 组装 hb00BizMap (项目扩展字段)
         │   {
         │     aac004: gender,     (性别)
         │     chb00l: age,        (年龄)
         │     w00070: nature,     (户口性质)
         │     w00041,             (婚姻状况)
         │     w03006,             (配偶姓名)
         │     w00038,             (配偶身份证)
         │     w00040,             (配偶性别)
         │     w00081,             (配偶年龄)
         │     w00073,             (配偶婚姻状况)
         │     w00044,             (配偶户口性质)
         │     w00004,             (子女姓名)
         │     w00067,             (子女性别)
         │     w00005,             (子女身份证)
         │     w00082,             (光荣证号)
         │     w00083,             (办证时间)
         │     w00068              (子女出生时间)
         │   }
         │
         ├── 3.2 组装完整申报数据 data 对象
         │   {
         │     aab301: '510100',     // 成都行政区划代码
         │     aac002: idCard,       // 申报人身份证
         │     aac003: userName,     // 申报人姓名
         │     aac004: gender,       // 性别
         │     aae005: tel,          // 联系电话
         │     aae006: address,      // 联系地址
         │     aac005: nation,       // 民族
         │     aka131: cac102,       // 人员类别编码
         │     chb00c: '1',          // 补贴对象类型: 1个人 2家庭 3单位
         │     chb00r: '01',         // 生存认证类型: 01人脸 02报纸
         │     chb004: '03',         // 申报渠道: 03微信 04支付宝
         │     chb006: '0',          // 认证状态: 0未认证 1已认证
         │     chb009: declareType,   // 申报模式: 01自主 02代办
         │     chb015: district,     // 区县编码
         │     chb017: township,     // 乡镇编码
         │     chb018: village,      // 村编码
         │     chi031,               // 项目编码
         │     hb00Bizmap: JSON.stringify(hb00BizMap),  // 扩展字段JSON
         │     userList: JSON.stringify([userList])      // 经办人信息
         │   }
         │
         ├── 3.3 提交到 Vuex Store
         │   $store.commit(UPDATE_REFRESH_FILE, false)  // 不清空已上传材料
         │   $store.commit(UPDATE_DECLARE_INFO, data)
         │
         └── 3.4 根据配置决定下一页跳转
              │
              ├── 无 closeAuth 配置 → navigateTo('survival-certification')
              ├── closeAuth=[] (空数组) → 跳过认证, chb006='1', → navigateTo('file')
              ├── closeAuth 包含当前人员类别 → 跳过认证 → navigateTo('file')
              └── 其他 → navigateTo('survival-certification')
```

---

## 四、申报模式详解

### 4.1 自主申报 (declareType='01')

- 使用当前登录用户的身份信息
- `basicInfo` 通过 `setBasicInfo()` 从 `userInfo` (Vuex) 自动填充
- 通过身份证查询社保卡信息、残疾人信息等
- `chb009 = '01'`

### 4.2 代为申报 (declareType='02')

- 申报人不是当前登录用户
- 清空 `basicInfo`，用户手动输入申报人信息
- 需要填写**代办人**信息（身份证、姓名、联系电话）
- 代办人信息从 `userInfo` (登录用户) 获取
- 数据中会增加：`chb00z`(代办人身份证)、`chb00y`(代办人姓名)、`chb00w`(代办人电话)
- `chb009 = '02'`

### 4.3 固定申报模式 (fixedDeclareType)

- 通过 URL 参数传入 `fixedDeclareType`
- 用户**无法切换**申报模式（自主/代办切换按钮不显示）
- 适用于某些只允许特定申报方式的项目

---

## 五、核心 Mixin：useDeclare.js 解析

`useDeclare.js` 是所有申报页面的核心共享逻辑（约 630 行），作为 Vue mixin 混入。

### 5.1 数据定义 (data)

| 字段 | 说明 |
|------|------|
| `chi031` | 补贴项目编码（如 '20002'） |
| `chi031_desc` | 补贴项目名称 |
| `declareType` | 申报类型（'01'自主 / '02'代办） |
| `fixedDeclareType` | 固定申报模式 |
| `basicInfo` | 申报人基本信息（身份证、姓名、电话、地址等） |
| `agentInfo` | 代办人信息 |
| `projectDeclareInfo` | 项目特有申报信息（本项目相关字段） |
| `personnelInfo` | 已选择的人员类别 |
| `personnelList` | 人员类别列表 |
| `codeMap` | 码表数据缓存 |

### 5.2 关键方法

| 方法 | 说明 |
|------|------|
| `handleOnLoad(e)` | 页面初始化：保存参数、获取人员类别、获取码表 |
| `getPersonnelList(chi031)` | 调用 B017 接口获取人员类别列表，支持单选/多选 |
| `handleCheckComponentInput()` | 校验基础组件内申报数据（身份证、姓名、电话、地址、人员类别等） |
| `handleDeclareData(hb00BizMap, isRefreshFile, ...)` | **核心方法**：组装申报数据、存储到 Vuex、决定跳转路径 |
| `getCodeTableCacheData()` | 获取码表（由各页面覆写） |
| `handleCheckInput()` | 项目特有字段校验（由各页面覆写） |

---

## 六、数据流转图（跨页面）

```
                    ┌──────────────────────────────┐
                    │         Vuex Store            │
                    │  declareInfo: {               │
                    │    aac002, aac003, chb006,    │
                    │    chi031, hb00Bizmap, ...    │
                    │  }                            │
                    │  refreshFile: true/false      │
                    │  ocrInfo: {}                  │
                    └──────┬────────────┬───────────┘
                           │            │
         ┌─────────────────┘            └─────────────────┐
         ▼                                                ▼
┌─────────────────┐                            ┌─────────────────┐
│ declare-20002   │                            │ survival-cert   │
│ (业务填报)      │                            │ (生存认证)      │
│                 │                            │                 │
│ 用户填写表单     │                            │ 读取 aac002,     │
│ 点击"下一步"     │                            │ aac003 进行     │
│    │            │                            │ 人脸识别        │
│    ▼            │                            │    │            │
│ handleDeclare   │                            │    ▼            │
│ Data() 提交     │                            │ chb006='1' ────▶│
│ declareInfo     │                            │ navigateTo('file')
│ 到 Vuex ────────┼───────────────────────────▶│                 │
└─────────────────┘                            └─────────────────┘
                                                       │
         ┌─────────────────────────────────────────────┘
         ▼
┌─────────────────┐
│ file.vue        │
│ (材料上传)      │
│                 │
│ 读取 declareInfo │
│ 上传材料         │
│ 组装 hi21List    │
│    │            │
│    ▼            │
│ requestB001()   │──────▶ navigateTo('result')
│ 提交最终申报     │
└─────────────────┘
```

---

## 七、字段编码速查表

### 7.1 本项目特有字段 (w 开头)

| 编码 | 中文名称 | 类型 | 是否必填 | 说明 |
|------|---------|------|---------|------|
| w00041 | 婚姻状况 | picker | 是 | 码表 aac017 |
| w00082 | 独生子女父母光荣证号 | input | 否 | 18位 |
| w00083 | 办理光荣证时间 | date | 否 | |
| w03006 | 配偶姓名 | input | 是 | |
| w00038 | 配偶身份证号 | idcard | 是 | 18位，blur 时自动填性别和年龄 |
| w00040 | 配偶性别 | picker | 是 | 码表 aac004，身份证自动识别 |
| w00081 | 配偶年龄 | number | 是 | 身份证自动计算 |
| w00073 | 配偶婚姻状况 | picker | 是 | 码表 aac017 |
| w00044 | 配偶户口性质 | picker | 是 | 码表 dac009 |
| w00004 | 子女姓名 | input | 是 | |
| w00005 | 子女身份证 | idcard | 是 | 18位，blur 时自动填性别 |
| w00067 | 子女性别 | picker | 是 | 身份证自动识别 |
| w00068 | 子女出生时间 | date | 是 | |

### 7.2 系统标准字段编码

| 编码 | 中文名称 | 说明 |
|------|---------|------|
| aac002 | 身份证号 | 核心标识 |
| aac003 | 姓名 | |
| aac004 | 性别 | |
| aac005 | 民族 | |
| aae005 | 联系电话 | |
| aae006 | 联系地址 | |
| aka131 | 人员类别 | cac102 |
| chb004 | 申报渠道 | 02网厅 03微信 04支付宝 |
| chb006 | 生存认证状态 | 0未认证 1认证成功 |
| chb009 | 申报模式 | 01个人 02他人 03街道 |
| chb00c | 补贴对象类型 | 1个人 2家庭 3单位 |
| chb00r | 生存认证类型 | 01人脸 02报纸 |
| chb015 | 区县编码 | |
| chb017 | 乡镇编码 | |
| chb018 | 村编码 | |
| chi031 | 补贴项目编码 | 20002=独生子女父母奖励金 |
| hb00Bizmap | 业务扩展字段 | JSON字符串 |
| hi21List | 材料文件列表 | JSON字符串 |

### 7.3 常用码表

| 码表名 | 含义 | 使用场景 |
|--------|------|---------|
| aac017 | 婚姻状况 | 申报人+配偶 |
| aac004 | 性别 | 配偶+子女 |
| dac009 | 户口性质 | 申报人+配偶 |
| aac005 | 民族 | 申报人 |
| aac011 | 学历 | 申报人 |
| yesorno | 是否 | 通用 |

---

## 八、后端接口说明

### 8.1 通用请求封装 (service/request.js)

```
请求方式: POST
URL: requestUrl + '/frontRestService/frontBcpDataRestService/getWebServiceDataYgsp'
加密: AES 可配置 (isOpenDataEncrypt)
认证: JWT Token (Authorization: Bearer xxx)
渠道标识:
  - 微信: chm301='03', chb004='03'
  - 支付宝: chm301='07', chb004='03'
  - H5: chm301='02', chb004='02'
```

### 8.2 本流程涉及的关键接口

| 接口 | 方法名 | 说明 | 调用时机 |
|------|--------|------|---------|
| requestB017 | B017 | 获取人员类别列表 | 页面 onLoad |
| requestSPGetHo08 | - | 查询残疾人信息 | 输入身份证后（配置开启时） |
| requestSPGetHo07Info | - | 查询建档立卡信息 | 输入身份证+姓名后（配置开启时） |
| requestWXGetFaceInfo | - | 验证人脸识别结果 | 人脸识别完成后 |
| requestWXGetCodeTableCache | - | 获取码表缓存 | 码表本地缓存不存在时 |
| requestB001 | B001 | 提交申报数据 | 材料上传完成后 |
| requestB009 | B009 | 作废旧申报（重新申报时） | 修改申报重新提交时 |

---

## 九、关键技术要点

### 9.1 码表缓存策略

```
getCodeListByCodeName(codeName)
    │
    ├── 1. 从 Storage 读取 CODE_CACHE_MAP
    │       ├── 有 → 返回对应码表数据
    │       └── 无 → 步骤 2
    │
    └── 2. 调用 requestWXGetCodeTableCache()
            ├── 成功 → 存入 Storage，返回数据
            └── 失败 → 提示"获取码表失败"
```

### 9.2 ID 卡信息提取算法

```javascript
// 从 18 位身份证号提取信息
getGender(idCard)   → idCard.charAt(16) % 2 === 0 ? '女' : '男'
getAge(idCard)      → 当前年份 - parseInt(idCard.substr(6, 4))
getBirthday(idCard) → idCard.substr(6,4) + '-' + idCard.substr(10,2) + '-' + idCard.substr(12,2)
```

### 9.3 安全性设计

- **数据传输加密**：AES 加密整个请求体（可配置开关）
- **Token 自动刷新**：后端返回 402 时自动更新 token
- **登录超时处理**：收到 401 时弹窗提示并退出小程序
- **身份证 OCR**：支持拍照识别身份证信息（达州版本）

---

## 十、各城市差异化支持

项目通过 `config/index.js` 按 `areaCode` 加载不同城市配置，包含：

```javascript
configDeclarePages: {
  'declare_20002': {
    isCheckDisability: false,       // 是否校验残疾人
    isCheckFileAndRegister: false,  // 是否校验建档立卡
    closeAuth: [],                  // 跳过人脸认证的人员类别
    chooseAuth: '',                 // 可选择认证方式的人员类别
    isOpenSign: false,              // 是否需要电子签名
    isSkipSurvivalAuth: false,      // 是否跳过生存认证
  }
}
```

已支持城市包括：成都(510100)、内江(511000)、达州(511700)、广安(511600) 等。

---

## 十一、面试重点总结

如果面试中被问到这个项目，可以从以下角度回答：

### 项目定位
> 这是一个政府级"惠民惠农财政补贴一卡通"小程序，覆盖成都市 12 个区县，支持 30+ 种补贴项目的在线申报。我在其中负责前端架构设计和核心模块开发。

### 技术亮点

1. **Mixin 模式实现代码复用**：30+ 个申报页面共享同一套 `useDeclare` mixin，每个项目只需覆写自己的字段校验和码表获取，极大减少重复代码。

2. **renderObj 渲染控制**：通过配置对象控制表单字段的显示/隐藏/校验，而不是在每个页面写大量 v-if，实现了"配置即页面"的效果。

3. **Vuex 实现跨页面数据流**：申报数据在 3-4 个页面间流转（业务填报→人脸认证→材料上传→提交结果），Vuex 作为数据总线。

4. **码表缓存策略**：字典数据采用"本地 Storage → 服务端 → 缓存"三级策略，减少网络请求。

5. **跨端适配**：通过 uni-app 条件编译 + 渠道参数（chb004）实现微信/支付宝/H5 三端统一。

6. **安全性**：AES 加密传输 + JWT Token 认证 + 自动刷新 Token + 超时退出。

### 业务复杂度

- 支持「自主申报」和「代为申报」两种模式
- 支持「人脸认证」和「材料认证」两种认证方式
- 支持同时申报多个项目
- 不同城市有不同配置（城市级 config 文件）
- 身份证自动识别填充性别、年龄、出生日期
- 扩展字段通过 JSON 序列化传递

### 你负责的 20002 项目

独生子女父母奖励金申报，涉及申报人 + 配偶 + 子女三方信息校验，表单字段约 16 个，包含身份证联动、码表选择、日期选择等多种交互。
