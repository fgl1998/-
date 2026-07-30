import baseConfig from '../../commonComponentConfig/base-config'
import componentConfigMixin from '../../../mixin/componentConfigMixin'

export default {
  name: 'badge-component-config',
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
        <ta-label-con label="徽标内容">
          <ta-input placeholder="请输入徽标内容" vModel={this.config.content}/>
        </ta-label-con>
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
        <ta-label-con label="徽标背景颜色">
          <ta-input placeholder="直接输入样式" vModel={this.config.color}/>
        </ta-label-con>
        <ta-label-con label="展示为小红点">
          <ta-switch vModel={this.config.dot}/>
        </ta-label-con>
        <ta-label-con label="最大值">
          <ta-input placeholder="请输入最大值，content 为数字时有效" vModel={this.config.max}/>
        </ta-label-con>
      </base-config>
    )
  },
}
