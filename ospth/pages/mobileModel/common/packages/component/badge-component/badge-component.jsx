export default {
  name: 'badge-component',
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
    const { content, dot, color, max, } = this.$props.componentConfig
    const { $listeners, $scopedSlots, } = this
    const badgeProps = {
      props: {
        content,
        dot,
        color,
        max,
      },
      on: {
        ...$listeners,
      },
      scopedSlots: $scopedSlots,
    }
    return (
      <van-badge {...badgeProps} />
    )
  },
}
