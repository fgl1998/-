export default {
  name: 'rate-component',
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
      value: 0,
    }
  },
  methods: {
    validator(val) {
      if(!this.componentConfig.required) return true
      return val !== 0;
    },
  },
  render () {
    const { $props, $listeners, $attrs, $scopedSlots } = this
    const {
      componentConfig: {
        type,
        icon,
        display,
        style,
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
    const rateProps = {
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
    return (
        <van-field {...fieldProps}
                   rules={[{
                     validator: this.validator,
                     message: restItem.message && restItem.message!=='' ? restItem.message : restItem.label+'不能为空！'
                   }]}
                   scopedSlots={{
                     input: () => (
                         <van-rate {...rateProps} vModel={this.value} />
                     )
                   }}>
        </van-field>
    )
  },
}
