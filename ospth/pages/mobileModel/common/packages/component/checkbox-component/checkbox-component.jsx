import componentMixin from "../../../mixin/componentMixin";
export default {
  name: 'checkbox-component',
  props: {
    componentConfig: {
      type: Object,
      required: true,
      default: () => {
        return {}
      },
    },
  },
  data () {
    return {
      value: []
    }
  },
  mixins: [componentMixin],
  mounted() {
    this.value = this.componentConfig.initialValue ? this.componentConfig.initialValue.split(',') : []
  },
  render () {
    const { $props, $listeners, $attrs, $scopedSlots } = this
    const {
      componentConfig: {
          type,
          icon,
          display,
          style,
          dataType,
          staticData,
          remoteData,
          collectionData,
          ...restItem
      },
      value,
      checked,
      modulePartId,
      ...restProps
    } = $props
    this.setRestItem(restItem)
    const initStyle = !style||style === ""?"width:100%;":style
    const fieldProps={
      props: {
          name: restItem.name,
          label: restItem.label,
          required: restItem.required
      },
    }
    const checkboxProps = {
      props: {
        ...restProps,
        ...restItem,
      },
      attrs: {
        ...$attrs,
        style:initStyle
      },
      on: {
        ...$listeners,
      },
      scopedSlots: $scopedSlots,
    }
    let dataSource = []
    if(dataType === 'static'){
      dataSource = staticData || []
    }
    if(dataType === 'remote') {
      dataSource = remoteData || []
    }
    if(dataType === 'dict') {
      dataSource = collectionData || []
    }
    const children = dataSource.map(item => (
        <van-checkbox name={item.name}>{item.label}
        </van-checkbox>
    ))
    return (
        <van-field {...fieldProps}
                   rules={[{
                     required: restItem.required,
                     message: restItem.message && restItem.message!=='' ? restItem.message : restItem.label+'不能为空！',
                     trigger:'onChange'
                   }]}
                   scopedSlots={{
                     input: () => (
                         <van-checkbox-group {...checkboxProps} vModel={this.value}>
                           {children}
                         </van-checkbox-group>
                     )
                   }}>
      </van-field>
    )
  },
}
