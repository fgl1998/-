export default {
  name: 'empty-component',
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
    const { image, style, imageSize, description } = this.$props.componentConfig
    const { $listeners, $scopedSlots, } = this
    const emptyProps = {
      props: {
        image,
        imageSize,
        description,
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
      <van-empty {...emptyProps} />
    )
  },
}
