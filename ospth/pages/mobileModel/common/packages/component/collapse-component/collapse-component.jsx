export default {
  name: 'collapse-component',
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
      activeNames: ['1'],
    }
  },
  methods: {
    normalRadioGroup () {
      const { dataType, staticData, size, activeNames } = this.$props.componentConfig
      const { $listeners, $scopedSlots, } = this
      const collapseItemProps = {
        props: {
          size,
        },
        on: {
          ...$listeners,
        },
        scopedSlots: $scopedSlots,
      }
      let dataSource = []
      if (dataType === 'static') {
        dataSource = staticData || []
      }
      const children = dataSource.map((item, index) => (
        <van-collapse-item {...collapseItemProps}
          title={item.label}
          name={index}
          key={item.value}
        >
          {item.value}
        </van-collapse-item>
      ))
      return (
        <van-collapse vModel={this.activeNames}>
          {children}
        </van-collapse>
      )
    },
  },
  render () {
    return this.normalRadioGroup()
  },
}
