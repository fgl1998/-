// "css" 配置项
export default {
  name: 'css-config',
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
      <ta-label-con label="CSS样式">
        <ta-textarea placeholder="请输入CSS样式，eg: {width: 120px}" vModel={this.config.style}/>
      </ta-label-con>
    )
  }
}
