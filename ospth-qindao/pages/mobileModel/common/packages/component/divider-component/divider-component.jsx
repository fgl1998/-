export default {
  name: 'divider-component',
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
    }
  },
  render (h) {
    const { value, style, contentPosition, dashed, hairline } = this.$props.componentConfig
    const { $listeners, $scopedSlots, } = this
    const dividerProps = {
      props: {
        contentPosition,
      },
      attrs: {
        style,
      },
      on: {
        ...$listeners,
      },
      scopedSlots: $scopedSlots,
    }
    return (
      <van-divider
        dashed={dashed}
        hairline={hairline}
        {...dividerProps}
      >
        {value}
      </van-divider>
    )
  },
}
