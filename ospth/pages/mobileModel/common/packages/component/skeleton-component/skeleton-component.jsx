export default {
  name: 'skeleton-component',
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
    const { row, rowWidth, title, titleWidth, avatar, loading, animate, avatarSize, avatarShape, } = this.$props.componentConfig
    const { $listeners, $scopedSlots, } = this
    const skeletonProps = {
      props: {
        row,
        rowWidth,
        title,
        titleWidth,
        avatar,
        loading,
        animate,
        avatarSize,
        avatarShape,
      },
      on: {
        ...$listeners,
      },
      scopedSlots: $scopedSlots,
    }
    return (
      <van-skeleton {...skeletonProps}/>
    )
  },
}
