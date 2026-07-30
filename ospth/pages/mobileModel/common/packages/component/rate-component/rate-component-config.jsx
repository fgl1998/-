import baseConfig from '../../commonComponentConfig/base-config'
import componentConfigMixin from '../../../mixin/componentConfigMixin'
import dataTabs from '../../commonComponentConfig/dataTabs'

export default {
  name: 'rate-component-config',
  mixins: [componentConfigMixin],
  props: {
    config: {
      type: Object,
      required: true,
    },
  },
  components: { baseConfig, dataTabs},
  model: {
    prop: 'config',
    event: 'change',
  },
  data () {
    return {
      defaultConfigNameList: [
        'name',
        'css',
        'display',
        'disabled',
        'required',
        'label',
      ],
    }
  },
  render () {
    return (
      <base-config
        config={this.config}
        configNameList={this.getConfigNameList}
      >
        <ta-label-con label="图标总数">
          <ta-input-number placeholder="请输入图标总数" vModel={this.config.count} min={0}/>
        </ta-label-con>
        <ta-label-con label="允许半选">
          <ta-switch vModel={this.config.allowHalf}/>
        </ta-label-con>
        <ta-label-con label="选中颜色">
          <ta-input placeholder="如：#e5e5e5" vModel={this.config.color}/>
        </ta-label-con>
        <ta-label-con label="未选中颜色">
          <ta-input placeholder="如：#e5e5e5" vModel={this.config.voidColor}/>
        </ta-label-con>
        <ta-label-con label="是否只读">
          <ta-switch vModel={this.config.readonly}/>
        </ta-label-con>
      </base-config>
    )
  },
}
