import baseConfig from '../../commonComponentConfig/base-config'
import componentConfigMixin from '../../../mixin/componentConfigMixin'

export default {
  name: 'divider-component-config',
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
        <ta-label-con label="span">
          <ta-input placeholder="请输入span" vModel={this.config.span}/>
        </ta-label-con>
        <ta-label-con label="行内对齐">
          <ta-select vModel={this.config.textAlign} style={{width:'100%'}}>
            <ta-select-option value="left">左对齐</ta-select-option>
            <ta-select-option value="center">居中</ta-select-option>
            <ta-select-option value="right">右对齐</ta-select-option>
          </ta-select>
        </ta-label-con>
        <ta-label-con label="内容位置">
          <ta-select vModel={this.config.contentPosition} style={{width:'100%'}}>
            <ta-select-option value="left">左对齐</ta-select-option>
            <ta-select-option value="center">居中</ta-select-option>
            <ta-select-option value="right">右对齐</ta-select-option>
          </ta-select>
        </ta-label-con>
        <ta-label-con label="样式">
          <ta-textarea placeholder="例如：color:red;padding:12px" vModel={this.config.style}/>
        </ta-label-con>
        <ta-label-con label="是否使用虚线">
          <ta-switch vModel={this.config.dashed}/>
        </ta-label-con>
        <ta-label-con label="是否使用 0.5px 线">
          <ta-switch vModel={this.config.hairline}/>
        </ta-label-con>
      </base-config>
    )
  },
}
