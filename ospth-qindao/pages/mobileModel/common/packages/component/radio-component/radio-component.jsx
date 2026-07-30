import componentMixin from "../../../mixin/componentMixin";
export default {
  name: 'radio-component',
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
        required: restItem.required,
      },
    }
    const radioProps = {
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
        <van-radio name={item.name}>{item.label}
        </van-radio>
    ))
    return (
        <van-field {...fieldProps}
                   rules={[{
                     required: restItem.required,
                     message: restItem.message && restItem.message!==''? restItem.message:restItem.label+'不能为空！',
                     trigger: 'onChange'
                   }]}
                   scopedSlots={{
                     input: () => (
                         <van-radio-group {...radioProps} vModel={this.value}>
                           {children}
                         </van-radio-group>
                     )
                   }}>
        </van-field>
    )
  },
}
