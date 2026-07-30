import { Toast } from 'vant';
export default {
  name: 'countdown-component',
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
      time: 30 * 60 * 60 * 1000,
    }
  },
  methods: {
    start () {
      this.$refs.countDown.start()
    },
    pause () {
      this.$refs.countDown.pause()
    },
    reset () {
      this.$refs.countDown.reset()
    },
    finish () {
      Toast('倒计时结束')
    },
  },
  render (h) {
    const { time, format, autoStart, manualStart, millisecond } = this.$props.componentConfig
    const { $listeners, $scopedSlots, } = this
    const countDownProps = {
      props: {
        time,
        format,
        autoStart,
        millisecond,
      },
      on: {
        ...$listeners,
      },
      scopedSlots: $scopedSlots,
    }
    let children = ''
    if (manualStart === true) {
      children = (<van-grid clickable>
        <van-grid-item style={{ flexBasis: '33.33%', }} text="开始" icon="play-circle-o" onClick={this.start} />
        <van-grid-item style={{ flexBasis: '33.33%', }} text="暂停" icon="pause-circle-o" onClick={this.pause} />
        <van-grid-item style={{ flexBasis: '33.33%', }} text="重置" icon="replay" onClick={this.reset} />
      </van-grid>)
    }
    return (
      <div>
        <van-count-down
          ref="countDown"
          {...countDownProps}
          auto-start={autoStart}
          vOn:finish={this.finish}
        />
        {
          children
        }
      </div>
    )
  },
}
