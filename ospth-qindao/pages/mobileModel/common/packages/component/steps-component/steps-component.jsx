export default {
  name: 'steps-component',
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
      active: 0,
    }
  },
  mounted() {
    this.active = this.componentConfig.active
  },
  methods: {
    getStep(callback){
      callback(this.active)
    },
    setStep(active){
      this.active = active
    },
    nextStep(){
      this.active++
    },
    preStep(){
      this.active--
    },
    stepsGroup () {
      const { direction, activeColor, activeIcon, inactiveIcon, finishIcon, center, dataType, staticData } = this.$props.componentConfig
      const { $listeners, $scopedSlots, } = this
      const stepsProps = {
        props: {
          direction,
          activeColor,
          activeIcon,
          inactiveIcon,
          finishIcon,
          center,
        },
        on: {
          ...$listeners,
          getStep: this.getStep,
          setStep: this.setStep,
          nextStep: this.nextStep,
          preStep: this.preStep,
        },
        scopedSlots: $scopedSlots,
      }
      let dataSource = []
      if (dataType === 'static') {
        dataSource = staticData || []
      }
      const children = dataSource.map((item, index) => (
        <van-step
          key={index}
        >
          {item.value}
          {direction === 'vertical' && <p>{item.time}</p>}
        </van-step>
      ))
      return (
        <van-steps active={this.active} {...stepsProps}>
          {children}
        </van-steps>
      )
    },
  },
  render (h) {
    return this.stepsGroup()
  },
}
