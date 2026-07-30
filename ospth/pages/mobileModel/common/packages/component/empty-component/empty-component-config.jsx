import baseConfig from '../../commonComponentConfig/base-config'
import componentConfigMixin from '../../../mixin/componentConfigMixin'

export default {
  name: 'empty-component-config',
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
        <ta-label-con label="图片类型">
          <ta-input placeholder="如：error、network、search或图片链接" vModel={this.config.image}/>
        </ta-label-con>
        <ta-label-con label="图片大小">
          <ta-input placeholder="默认单位为 px" vModel={this.config.imageSize}/>
        </ta-label-con>
        <ta-label-con label="描述文字">
          <ta-input placeholder="图片下方的描述文字" vModel={this.config.description}/>
        </ta-label-con>
      </base-config>
    )
  },
}
