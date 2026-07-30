import baseConfig from '../../commonComponentConfig/base-config'
import componentConfigMixin from '../../../mixin/componentConfigMixin'
import dataTabs from '../../commonComponentConfig/dataTabs'

export default {
  name: 'password-input-component-config',
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
        'display',
        'css',
      ],
    }
  },
  render () {
    return (
        <base-config
            config={this.config}
            configNameList={this.getConfigNameList}
        >
          <ta-label-con label="文字提示">
            <ta-input placeholder="请输入文字提示" vModel={this.config.info}/>
          </ta-label-con>
          <ta-label-con label="错误提示">
            <ta-input placeholder="请输入错误提示" vModel={this.config.errorInfo}/>
          </ta-label-con>
          <ta-label-con label="最大长度">
            <ta-input-number placeholder="请输入最大长度" vModel={this.config.length} min={0}/>
          </ta-label-con>
          <ta-label-con label="隐藏密码">
            <ta-switch vModel={this.config.mask}/>
          </ta-label-con>
          <ta-label-con label="是否聚焦">
            <ta-switch vModel={this.config.focused}/>
          </ta-label-con>
        </base-config>
    )
  },
}
