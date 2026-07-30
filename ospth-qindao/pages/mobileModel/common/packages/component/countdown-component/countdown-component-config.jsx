import baseConfig from '../../commonComponentConfig/base-config'
import componentConfigMixin from '../../../mixin/componentConfigMixin'

export default {
  name: 'countdown-component-config',
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
        <ta-label-con label="行内对齐">
          <ta-select vModel={this.config.textAlign} style={{width:'100%'}}>
            <ta-select-option value="left">左对齐</ta-select-option>
            <ta-select-option value="center">居中</ta-select-option>
            <ta-select-option value="right">右对齐</ta-select-option>
          </ta-select>
        </ta-label-con>
        <ta-label-con label="span">
          <ta-input placeholder="请输入span" vModel={this.config.span}/>
        </ta-label-con>
        <ta-label-con label="倒计时时长">
          <ta-input placeholder="请输入倒计时时长，单位毫秒" vModel={this.config.time}/>
        </ta-label-con>
        <ta-label-con label="时间格式">
          <ta-input placeholder="请输入时间格式，如HH:mm:ss" vModel={this.config.format}/>
        </ta-label-con>
        <ta-label-con label="自动开始">
          <ta-switch vModel={this.config.autoStart} />
        </ta-label-con>
        <ta-label-con label="毫秒级渲染">
          <ta-switch vModel={this.config.millisecond} />
        </ta-label-con>
        <ta-label-con label="手动控制">
          <ta-switch vModel={this.config.manualStart} />
        </ta-label-con>
      </base-config>
    )
  },
}
