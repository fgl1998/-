// "title" 配置项
export default {
  name: 'title-config',
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
      <ta-label-con label="标题">
        <ta-input disabled={this.disableLableArr.indexOf(this.config.type) != -1} placeholder="请输入Title" vModel={this.config.title}/>
      </ta-label-con>
    )
  }
}
