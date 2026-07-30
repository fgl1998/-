export default {
  name: 'slider-component',
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
      value: [],
      eventMap:{}
    }
  },
  methods:{
    setFunctions(restItem){
      if (!restItem.eventList||restItem.eventList.length<1){
        return
      }
      restItem.eventList.forEach((item)=>{
        this.eventMap[item.eventType] = item.textarea
      })
    }
  },
  mounted() {
    this.value = this.componentConfig.initialValue
  },
  render () {
    const { $props, $listeners, $attrs, $scopedSlots } = this
    const {
      componentConfig: {
        type,
        icon,
        display,
        style,
        fieldType,
        ...restItem
      },
      value,
      checked,
      modulePartId,
      ...restProps
    } = $props
    this.setRestItem(restItem)
    this.setFunctions(restItem)
    const event = {}
    const _this = this
    const this_ = this.getVue()
    if (this.eventMap.change){
      event.change = function (value){
        eval(_this.eventMap.change)
      }
    }
    if (this.eventMap.input){
      event.input = function (value){
        eval(_this.eventMap.input)
      }
    }
    const initStyle = !style||style === ""?"width:100%;":style
    const sliderProps = {
      props: {
        ...restProps,
        ...restItem,
      },
      attrs: {
        ...$attrs,
      },
      on: {
        ...$listeners,
        ...event
      },
      scopedSlots: {
        ...$scopedSlots,
        ...slots
      },
    }
    const slots = {}
    slots.input = ()=>{
        return <van-slider vModel={this.value} {...sliderProps}/>
    }
    const fieldProps = {
      props: {
        ...restProps,
        ...restItem,
      },
      attrs: {
        ...$attrs,
        style:initStyle
      },
      on: {
        ...$listeners,
      },
      scopedSlots: {
        ...$scopedSlots,
        ...slots
      },
    }
    return (
        <van-field {...fieldProps}>
        </van-field>
    )
  }
}
