import moment from "moment";
import componentMixin from "../../../mixin/componentMixin";
export default {
  name: 'calendar-component',
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
    showCalendar() {
      this.isShow()
      let this_ = this.getVue()
    },
    hideCalendar() {
      this.show = false
    },
    // 点击完成按钮后，会触发 confirm 事件
    onConfirm(value) {
      if (this.eventMap.confirm){
        eval(this.eventMap.confirm)
      }else{
        switch (this.componentConfig.calendarType){
          case 'multiple':
            value.forEach((item, index)=>{
              if (index !== 0) {
                this.value = this.value + ',' + moment(item).format('YYYY/MM/DD')
              }else {
                this.value = moment(item).format('YYYY/MM/DD')
              }
            })
            break
          case 'range':
            this.value = moment(value[0]).format('YYYY/MM/DD')+ ' - '+moment(value[1]).format('YYYY/MM/DD')
            break
          default:
            this.value = moment(value).format('YYYY/MM/DD')
        }
      }
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
        dateRange,
        ...restItem
      },
      value,
      checked,
      modulePartId,
      ...restProps
    } = $props
    this.setRestItem(restItem)
    this.setFunctions(restItem)
    const initStyle = !style||style === ""?"width:100%;":style
    const event = {}
    event.confirm = this.onConfirm
    const minDate = dateRange.length > 0 ? moment ( dateRange[0],'YYYY-MM-DD').toDate() : undefined
    const maxDate = dateRange.length > 0 ? moment ( dateRange[1],'YYYY-MM-DD').toDate() : undefined
    const calendarProps = {
      props: {
        ...restProps,
        ...restItem,
        type: restItem.calendarType,
        minDate: minDate,
        maxDate: maxDate
      },
      attrs: {
        ...$attrs,
        style:initStyle
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
              isLink={!restItem.disabled}
              readonly={true}
              vOn:click={restItem.disabled ? ()=>{} : this.showCalendar}
              rules={[{
                required: restItem.required,
                message: restItem.message&&restItem.message!==''?restItem.message:restItem.label+'不能为空！'
              }]}
              {...fieldProps}
          />
            <van-calendar {...calendarProps} vModel={this.show} get-container={'.mobileShape'}/>
        </div>
    )
  },
}
