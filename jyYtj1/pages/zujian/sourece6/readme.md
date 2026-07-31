先把这套方案收口成一个可落地的 `v1` 需求边界。目标不是低代码平台，而是**项目内可复用的 schema 表单引擎**。

**定位**

- 采用 `Vue2 + uView2 + 本地 JS Schema`
- `SchemaForm` 负责表单引擎
- 基础字段由引擎内置适配
- 复杂字段作为独立复合组件接入
- 不做后端纯 JSON 表达式引擎

**一、表单引擎 v1 必须支持**

- 根据 `schema` 渲染字段
- 维护统一的 `formData`
- 支持新增、编辑、详情三种模式
- 支持初始值、回显、重置
- 支持表单级禁用、字段级禁用
- 支持字段显示/隐藏
- 支持字段只读
- 支持同步校验
- 支持跨字段校验
- 支持字段变更后重新校验其他字段
- 支持外部调用 `validate / reset / setValue / getValue`
- 支持提交前统一取值和格式转换
- 支持插槽或自定义字段组件挂载

**二、基础字段 v1 建议内置**

- `input`
- `textarea`
- `select`
- `date`
- `radio`
- `checkbox`
- `switch`
- `number`

你当前最先做的可以只落：

- `input`
- `select`
- `date`

其他字段接口先预留，后面补不痛苦。

**三、复合字段组件单独封装**
这类不要塞进表单引擎内部逻辑：

- 地区级联选择
- 日期区间选择
- 人员/组织选择
- 地址选择
- 上传组件
- 自定义业务弹窗选择器

表单引擎只把它们当一个普通字段：

- 接收 `value`
- 接收 `disabled/readonly`
- 通过 `input` 输出值
- 可额外发 `change` 事件

也就是你说的“省市区级联”判断是对的，它应该和“日期选择器”同级，都是复合字段。

**四、Schema 字段配置建议**
每个字段至少有这些：

```js
{
  field: 'customerName',
  type: 'input',
  label: '客户名称',
  defaultValue: '',
  componentProps: {},
  formItemProps: {},
  rules: [],
  visible: true,
  disabled: false,
  readonly: false,
  required: false,
  dependencies: [],
  revalidateFields: [],
  clearOnHide: false,
  onChange: null,
  transformIn: null,
  transformOut: null
}
```

建议重点支持这些配置：

- `field`：字段名
- `type`：字段类型
- `label`：标题
- `defaultValue`：默认值
- `componentProps`：传给具体组件
- `rules`：校验规则
- `visible`：是否显示，支持布尔值或函数
- `disabled`：是否禁用，支持布尔值或函数
- `readonly`：只读
- `dependencies`：依赖哪些字段
- `revalidateFields`：当前字段变化后要重校验谁
- `clearOnHide`：隐藏时是否清空
- `onChange`：字段联动逻辑
- `transformIn`：回显转换
- `transformOut`：提交转换

**五、联动机制建议统一成一条链路**
任意字段变化后，统一走：

1. 更新 `formData`
2. 执行当前字段 `onChange`
3. 重新计算依赖它的字段状态
4. 更新 `visible / disabled / readonly / options`
5. 触发 `revalidateFields`
6. 对外抛出表单变更事件

这样联动不会散落在页面 watcher 里。

**六、常见业务场景要提前支持**
这些很常见，建议一开始就纳入设计：

- 新增和编辑模式下默认值不同
- 隐藏字段不参与校验
- 禁用字段不参与校验
- 字段隐藏时可配置是否清空值
- 上游字段变化后，下游字段自动清空
- 上游字段变化后，下游字段规则变化
- 上游字段变化后，下游字段重新校验
- 接口返回值与组件值结构不一致时可转换
- 同一字段在不同页面可被局部覆盖配置

**七、复合组件的统一协议**
所有复杂组件最好遵循同一套协议：

```js
props: {
  value, disabled, readonly, config
}
```

事件统一：

```js
this.$emit('input', value)
this.$emit('change', value)
```

这样 `SchemaForm` 不需要知道它内部是日期、地区还是人员选择。

**八、建议先不要做**
这些很容易把项目复杂度拉高，先别碰：

- 后端下发纯 JSON 联动表达式
- 表达式解析器
- 动态字段数组表单
- 表单设计器
- 完整异步校验体系
- 超复杂布局系统

**九、推荐的 v1 实现顺序**

1. 定义 `schema` 结构
2. 实现 `SchemaForm`
3. 实现 `SchemaField`
4. 接入 `input/select/date`
5. 做回显、校验、显示隐藏、禁用
6. 做 `onChange + dependencies + revalidateFields`
7. 接入一个复合组件示例，比如 `RegionPicker`

**十、我建议的最终边界**
你的第一版核心目标可以定成：

- 一套 `SchemaForm`
- 三个内置字段：`input/select/date`
- 一套统一联动机制
- 一套统一校验机制
- 一套复合组件接入协议

这版做完，已经够支撑大部分业务表单。

如果你要继续，我下一步可以直接给你一版：

- `schema` 最终字段类型定义
- `SchemaForm / SchemaField / 字段组件` 的组件拆分
- 一份最小代码骨架  
  这样你就能直接评估“这个方案怎么开始写”。
