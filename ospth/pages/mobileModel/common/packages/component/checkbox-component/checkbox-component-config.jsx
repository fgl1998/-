import baseConfig from '../../commonComponentConfig/base-config'
import componentConfigMixin from '../../../mixin/componentConfigMixin'
import dataTabs from '../../commonComponentConfig/dataTabs'

export default {
  name: 'checkbox-component-config',
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
          'label',
          'disabled',
          'initialValue',
          'css',
          'required'
      ],
    }
  },
  render () {
    return (
      <base-config
        config={this.config}
        configNameList={this.getConfigNameList}
      >
        <ta-label-con label="排列方向">
          <ta-select vModel={this.config.direction} style={{width:'100%'}}>
            <ta-select-option value="horizontal">水平</ta-select-option>
            <ta-select-option value="vertical">垂直</ta-select-option>
          </ta-select>
        </ta-label-con>
        <ta-label-con label="最大可选">
          <ta-input-number placeholder="请输入最大可选数" vModel={this.config.max} min={0}/>
        </ta-label-con>
        <div style={{ marginBottom: '24px' }}>
          <data-tabs tabsName={['static', 'remote', 'dict']} vModel={this.config}/>
        </div>
      </base-config>
    )
  },
}
