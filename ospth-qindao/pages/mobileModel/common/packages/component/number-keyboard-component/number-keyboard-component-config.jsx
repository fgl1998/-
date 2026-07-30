import baseConfig from '../../commonComponentConfig/base-config'
import componentConfigMixin from '../../../mixin/componentConfigMixin'
import dataTabs from '../../commonComponentConfig/dataTabs'

export default {
  name: 'number-keyboard-component-config',
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
        'display',
        'css',
        'required',
        'title',
        'placeholder',
        'disabled'
      ],
    }
  },
  render () {
    return (
        <base-config
            config={this.config}
            configNameList={this.getConfigNameList}
        >
          <ta-label-con label="最大字符数">
            <ta-input-number placeholder="请输入最大字符数" vModel={this.config.maxlength} min={0}/>
          </ta-label-con>
          <ta-label-con label="右侧栏">
            <ta-select vModel={this.config.theme} style={{width:'100%'}}>
              <ta-select-option value="default">default</ta-select-option>
              <ta-select-option value="custom">custom</ta-select-option>
            </ta-select>
          </ta-label-con>
          <ta-label-con label="底部额外按钮">
            <ta-input placeholder="请输入按键内容" vModel={this.config.extraKey}/>
          </ta-label-con>
          <ta-label-con label="关闭按钮文字">
            <ta-input placeholder="请输入按键内容" vModel={this.config.closeButtonText}/>
          </ta-label-con>
          <ta-label-con label="删除按钮文字">
            <ta-input placeholder="请输入按键内容" vModel={this.config.deleteButtonText}/>
          </ta-label-con>
          <ta-label-con label="随机数字">
            <ta-switch vModel={this.config.randomKeyOrder}/>
          </ta-label-con>
          <ta-label-con label="过场动画">
            <ta-switch vModel={this.config.transition}/>
          </ta-label-con>
        </base-config>
    )
  },
}
