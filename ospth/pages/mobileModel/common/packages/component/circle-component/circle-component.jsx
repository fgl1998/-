export default {
  name: 'circle-component',
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
      value: 0
    }
  },
  mounted() {
    this.percentage = this.componentConfig.currentRate
  },
  methods:{
    setValue(value){
      this.value = value
    },
    getValue(callBack){
      callBack(this.value)
    }
  },
  render (h) {
    const {  rate, size, color, layerColor, fill, text, strokeWidth, strokeLinecap, clockwise, } = this.$props.componentConfig
    const { $listeners, $scopedSlots, } = this
    const event = {}
    event.setValue = this.setValue
    event.getValue = this.getValue
    const circleProps = {
      props: {
        rate,
        size,
        color,
        layerColor,
        fill,
        text,
        value: this.value,
        strokeWidth,
        strokeLinecap,
        clockwise,
      },
      on: {
        ...$listeners,
        ...event
      },
      scopedSlots: $scopedSlots,
    }
    return (
        <van-circle {...circleProps} />
    )
  },
}
