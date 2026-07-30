// "label" 配置项
export default {
  name: 'label-config',
  props: {
    config: {
      type: Object,
      required: true
    }
  },
  model: {
    prop: 'config',
    event: 'change',
  },
  render () {
    return (
      <ta-label-con label="Label">
        <ta-input disabled={this.disableLableArr.indexOf(this.config.type) != -1} placeholder="请输入Label" vModel={this.config.label}/>
      </ta-label-con>
    )
  }
}
