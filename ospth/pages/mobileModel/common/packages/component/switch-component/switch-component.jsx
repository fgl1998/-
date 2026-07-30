export default {
  name: 'switch-component',
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
    const slots = {}
    slots.input = ()=>{
        return <van-switch vModel={this.value} disabled={restItem.disabled} size={restItem.size} size="20" />
    }
    const fieldProps = {
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
      scopedSlots: {
        ...$scopedSlots,
        ...slots
      },
    }
    return (
        <van-field {...fieldProps}>
        </van-field>
    )
  }
}
