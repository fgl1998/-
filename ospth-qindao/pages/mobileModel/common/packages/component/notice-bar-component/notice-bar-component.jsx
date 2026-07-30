export default {
  name: 'notice-bar-component',
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
  methods: {
    staticGroup () {
      const { text, mode, color, background, leftIcon, delay, speed, scrollable, wrapable, } = this.$props.componentConfig
      const { $listeners, $scopedSlots, } = this
      const noticeProps = {
        props: {
          text,
          mode,
          color,
          background,
          leftIcon,
          delay,
          speed,
          wrapable,
        },
        on: {
          ...$listeners,
        },
        scopedSlots: $scopedSlots,
      }
      return (
        <van-notice-bar
          scrollable={scrollable}
          {...noticeProps}
        />
      )
    },
    scrollGroup () {
      const { leftIcon, staticData, mode, color, background } = this.$props.componentConfig
      const { $listeners, $scopedSlots, } = this
      const noticeProps = {
        props: {
          leftIcon,
          mode,
          color,
          background,
        },
        on: {
          ...$listeners,
        },
        scopedSlots: $scopedSlots,
      }
      const dataSource = staticData || []
      const children = dataSource.map((item, index) => (
        <van-swipe-item key={index}>{item.value}</van-swipe-item>
      ))
      const swipe = (
        <van-swipe
          vertical
          style={{ height: '40px', 'line-height': '40px', transform: 'translateX(0)', }}
          autoplay="3000"
          show-indicators={false}
        >
          {children}
        </van-swipe>
      )
      return (
        <van-notice-bar
          {...noticeProps}
          scrollable={false}
        >
          {swipe}
        </van-notice-bar>
      )
    },
  },
  render (h) {
    const { dataType } = this.$props.componentConfig
    if (dataType === 'static') {
      return this.scrollGroup()
    }

    if (dataType === 'scroll') {
      return this.staticGroup()
    }
    return this.staticGroup()
  },
}
