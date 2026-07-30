export default {
  name: 'progress-component',
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
      percentage: 0
    }
  },
  mounted() {
    this.percentage = this.componentConfig.percentage
  },
  methods:{
    setValue(value){
      this.percentage = value
    },
    getValue(callBack){
      callBack(this.percentage)
    }
  },
  render (h) {
    const { percentage, strokeWidth, color, trackColor, pivotText, pivotColor, textColor, inactive, showPivot, } = this.$props.componentConfig
    const { $listeners, $scopedSlots, } = this
    const event = {}
    event.setValue = this.setValue
    event.getValue = this.getValue
    const progressProps = {
      props: {
        strokeWidth,
        color,
        trackColor,
        pivotText,
        pivotColor,
        textColor,
        inactive,
        showPivot,
      },
      on: {
        ...$listeners,
        ...event
      },
      scopedSlots: $scopedSlots,
    }
    return (
      <van-progress percentage={this.percentage} {...progressProps}/>
    )
  },
}
