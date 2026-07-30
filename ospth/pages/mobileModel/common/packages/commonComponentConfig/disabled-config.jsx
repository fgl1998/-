// "禁用" 配置项
export default {
  name: 'disabled-config',
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
  methods:{
    changeDefultData(e){
      this.config.disabled = e.target.value
    }
  },
  render () {
    return (
      <ta-label-con label="是否禁用">
        <ta-input vModel={this.config.disabled} style="width: 90%;" vOn:change={this.changeDefultData}/>
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
