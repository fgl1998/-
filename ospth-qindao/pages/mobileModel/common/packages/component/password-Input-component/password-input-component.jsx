import componentMixin from "../../../mixin/componentMixin";
export default {
  name: 'password-input-component',
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
      show: false,
      eventMap:{},
      value: ''
    }
  },
  mixins: [componentMixin],
  methods: {
    showBoard() {
      this.isShow()
      let this_ = this.getVue()
    },
    hideBoard() {
      this.show = false
    },
    onFocus() {
      if (this.eventMap.confirm){
        eval(this.eventMap.confirm)
      }else{
        this.showBoard()
      }
    },
    setFunctions(restItem){
      if (!restItem.eventList||restItem.eventList.length<1){
        return
      }
      restItem.eventList.forEach((item)=>{
        this.eventMap[item.eventType] = item.textarea
      })
    },
  },
  render () {
    const { $props, $listeners, $attrs, $scopedSlots } = this
    $attrs.value = this.value
    const {
      componentConfig: {
        type,
        icon,
        display,
        style,
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
    event.focus = this.onFocus
    const passwordProps = {
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
      scopedSlots: $scopedSlots,
    }
    const boardProps={
      props: {
        ...restProps,
        ...restItem,
      },
    }
    return (
        <div>
          <van-password-input
              value={this.value}
              {...passwordProps}
          />
            <van-number-keyboard
                vModel={this.value}
                show={this.show}
                vOn:blur={this.hideBoard}
                get-container={'.mobileShape'}
                {...boardProps}
            />
        </div>
    )
  }
}
