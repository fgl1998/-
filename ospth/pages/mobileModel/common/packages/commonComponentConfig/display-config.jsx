// "是否可见" 配置项
export default {
  name: 'display-config',
  model: {
    prop: 'config',
    event: 'change',
  },
  props: {
    config: {
      type: Object,
      required: true
    }
  },
  render () {
    if (this.config.display == null){
      this.$set(this.config,"display","true")
    }
    if (typeof this.config.display != 'string'){
      this.config.display+=''
    }
    return (
      <ta-label-con label="是否可见">
        <ta-input vModel={this.config.display} style="width: 90%;"/>
        <ta-popover
          width="300"
          placement="top"
          trigger="hover"
          content="录入true,false或者自定义全局对象的key">
          <ta-icon slot="reference" type="question-circle" style="cursor: pointer;margin-left: 10px;"/>
        </ta-popover>
      </ta-label-con>
    )
  }
}
