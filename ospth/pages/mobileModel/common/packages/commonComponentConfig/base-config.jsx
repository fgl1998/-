import nameConfig from './name-config'
import disabledConfig from './disabled-config'
import displayConfig from './display-config'
import labelConfig from './label-config'
import placeholderConfig from './placeholder-config'
import requiredConfig from './required-config'
import initialValueConfig from './initial-value-config'
import cssConfig from './css-config'
import titleConfig from './title-config'
export default {
  name: 'base-config',
  components: {
    nameConfig,
    displayConfig,
    disabledConfig,
    labelConfig,
    placeholderConfig,
    requiredConfig,
    initialValueConfig,
    cssConfig,
    titleConfig,
  },
  // v-model属性配置
  model: {
    prop: 'config',
    event: 'change'
  },
  props: {
    // form-item的配置
    config: {
      type: Object,
      required: true
    },
    // 要渲染的配置项
    configNameList: {
      type: Array,
      required: true
    }
  },
  render () {
    return (
      <div>
        {this.configNameList.includes('label') && <label-config config={this.config}/>}
        {this.configNameList.includes('name') && <name-config config={this.config} />}
        {this.configNameList.includes('title') && <title-config config={this.config}/>}
        {this.configNameList.includes('initialValue') && <initial-value-config config={this.config}/>}
        {this.configNameList.includes('placeholder') && <placeholder-config config={this.config}/>}
        {this.configNameList.includes('css') && <css-config config={this.config}/>}
        {this.$slots.default}
        {this.configNameList.includes('required') && <required-config config={this.config}/>}
        {this.configNameList.includes('disabled') && <disabled-config config={this.config}/>}
        <display-config config={this.config}/>
      </div>
    )
  }
}
