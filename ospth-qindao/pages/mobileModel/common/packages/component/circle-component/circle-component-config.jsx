import baseConfig from '../../commonComponentConfig/base-config'
import componentConfigMixin from '../../../mixin/componentConfigMixin'

export default {
  name: 'circle-component-config',
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
        <ta-label-con label="当前进度" >
          <ta-input-number  style={{width:'100%'}} min={0} max={100} placeholder="请输入当前进度" vModel={this.config.currentRate}/>
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
        <ta-label-con label="目标进度">
          <ta-input placeholder="请输入目标进度" vModel={this.config.rate}/>
        </ta-label-con>
        <ta-label-con label="圆环直径">
          <ta-input placeholder="请输入圆环直径，默认单位为 px" vModel={this.config.size}/>
        </ta-label-con>
        <ta-label-con label="进度条颜色">
          <ta-input placeholder="请输入进度条颜色，传入对象格式可以定义渐变色" vModel={this.config.color}/>
        </ta-label-con>
        <ta-label-con label="轨道颜色">
          <ta-input placeholder="请输入轨道颜色" vModel={this.config.layerColor}/>
        </ta-label-con>
        <ta-label-con label="填充颜色">
          <ta-input placeholder="请输入填充颜色" vModel={this.config.fill}/>
        </ta-label-con>
        <ta-label-con label="动画速度">
          <ta-input placeholder="请输入动画速度" vModel={this.config.speed}/>
        </ta-label-con>
        <ta-label-con label="文字">
          <ta-input placeholder="请输入文字" vModel={this.config.text}/>
        </ta-label-con>
        <ta-label-con label="进度条宽度">
          <ta-input placeholder="请输入进度条宽度" vModel={this.config.strokeWidth}/>
        </ta-label-con>
        <ta-label-con label="端点形状">
          <ta-select vModel={this.config.strokeLinecap} style={{width:'100%'}}>
            <ta-select-option value="square">square</ta-select-option>
            <ta-select-option value="butt">butt</ta-select-option>
            <ta-select-option value="round">round</ta-select-option>
          </ta-select>
        </ta-label-con>
        <ta-label-con label="顺时针增加">
          <ta-switch vModel={this.config.clockwise}/>
        </ta-label-con>
      </base-config>
    )
  },
}
