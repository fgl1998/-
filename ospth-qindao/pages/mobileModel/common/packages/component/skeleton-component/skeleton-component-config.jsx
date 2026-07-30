import baseConfig from '../../commonComponentConfig/base-config'
import componentConfigMixin from '../../../mixin/componentConfigMixin'

export default {
  name: 'skeleton-component-config',
  mixins: [componentConfigMixin],
  props: {
    config: {
      type: Object,
      required: true,
    },
  },
  components: { baseConfig, },
  model: {
    prop: 'config',
    event: 'click',
  },
  render () {
    return (
      <base-config
        config={this.config}
        configNameList={this.getConfigNameList}
      >
        <ta-label-con label="段落行数">
          <ta-input placeholder="请输入段落占位图行数" vModel={this.config.row}/>
        </ta-label-con>
        <ta-label-con label="段落宽度">
          <ta-input placeholder="请输入段落占位图宽度,可传数组来设置每一行的宽度" vModel={this.config.rowWidth}/>
        </ta-label-con>
        <ta-label-con label="标题宽度">
          <ta-input placeholder="请输入标题占位图宽度" vModel={this.config.titleWidth}/>
        </ta-label-con>
        <ta-label-con label="头像大小">
          <ta-input placeholder="请输入头像占位图大小" vModel={this.config.avatarSize}/>
        </ta-label-con>
        <ta-label-con label="头像形状">
          <ta-select vModel={this.config.avatarShape} style={{ width: '100%', }}>
            <ta-select-option value="round">圆形</ta-select-option>
            <ta-select-option value="square">方形</ta-select-option>
          </ta-select>
        </ta-label-con>
        <ta-label-con label="显示标题">
          <ta-switch vModel={this.config.title}/>
        </ta-label-con>
        <ta-label-con label="显示头像">
          <ta-switch vModel={this.config.avatar}/>
        </ta-label-con>
        <ta-label-con label="显示骨架屏">
          <ta-switch vModel={this.config.loading}/>
        </ta-label-con>
        <ta-label-con label="开启动画">
          <ta-switch vModel={this.config.animate}/>
        </ta-label-con>
      </base-config>
    )
  },
}
