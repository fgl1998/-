import componentMixin from "../../../mixin/componentMixin";
export default {
  name: 'number-keyboard-component',
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
    event.blur = this.hideBoard
    const numberKeyboardProps = {
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
    const fieldProps={
      props: {
        ...restProps,
        ...restItem,
        placeholder: restItem.placeholder || `请选择${restItem.label}`,
      },
    }
    return (
        <div>
          <van-field
              vModel={this.value}
              clickable={!restItem.disabled}
              readonly={true}
              vOn:click={restItem.disabled ? ()=>{} : this.showBoard}
              rules={[{
                required: restItem.required,
                message: restItem.message&&restItem.message!==''?restItem.message:restItem.label+'不能为空！'
              }]}
              {...fieldProps}
          />
            <van-number-keyboard
                vModel={this.value}
                show={this.show}
                get-container={'.mobileShape'}
                {...numberKeyboardProps}
            />
        </div>
    )
  }
}
