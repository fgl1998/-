export default {
  name: 'field-component',
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
      value: '',
    }
  },
  mounted() {
    this.value = this.componentConfig.initialValue
  },
  render () {
    const { $props, $listeners, $attrs, $scopedSlots } = this
    const {
      componentConfig: {
        type,
        icon,
        display,
        style,
        fieldType,
        ...restItem
      },
      value,
      checked,
      modulePartId,
      ...restProps
    } = $props
    this.setRestItem(restItem)
    const initStyle = !style||style === ""?"width:100%;":style
    const fieldProps = {
      props: {
        ...restProps,
        ...restItem,
        type: fieldType,
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
        <van-field {...fieldProps} vModel={this.value}
                   rules={[{
                     required: restItem.required,
                     message: restItem.message&&restItem.message!==''?restItem.message:restItem.label+'不能为空！'
                   }]}
        />
    )
  }
}
