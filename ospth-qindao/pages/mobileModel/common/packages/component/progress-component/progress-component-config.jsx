import baseConfig from '../../commonComponentConfig/base-config'
import componentConfigMixin from '../../../mixin/componentConfigMixin'

export default {
  name: 'progress-component-config',
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
        <ta-label-con label="进度百分比">
          <ta-input placeholder="如：0" vModel={this.config.percentage}/>
        </ta-label-con>
        <ta-label-con label="进度条粗细">
          <ta-input placeholder="如：4px" vModel={this.config.strokeWidth}/>
        </ta-label-con>
        <ta-label-con label="进度条颜色">
          <ta-input placeholder="如：#1989fa" vModel={this.config.color}/>
        </ta-label-con>
        <ta-label-con label="轨道颜色">
          <ta-input placeholder="如：#e5e5e5" vModel={this.config.trackColor}/>
        </ta-label-con>
        <ta-label-con label="显示进度文字">
          <ta-switch vModel={this.config.showPivot}/>
        </ta-label-con>
        {
          this.config.showPivot &&
          <div>
            <ta-label-con label="文字内容">
              <ta-input placeholder="如：#1989fa" vModel={this.config.pivotText}/>
            </ta-label-con>
            <ta-label-con label="文字背景色">
              <ta-input placeholder="如：#1989fa" vModel={this.config.pivotColor}/>
            </ta-label-con>
            <ta-label-con label="文字颜色">
              <ta-input placeholder="如：#1989fa" vModel={this.config.textColor}/>
            </ta-label-con>
          </div>
        }
        <ta-label-con label="是否置灰">
          <ta-switch vModel={this.config.inactive}/>
        </ta-label-con>`
      </base-config>
    )
  }
}
