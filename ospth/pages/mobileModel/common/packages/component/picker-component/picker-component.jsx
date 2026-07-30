import componentMixin from "../../../mixin/componentMixin";
export default {
  name: 'picker-component',
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
      value: '',
      label: ''
    }
  },
  mixins:[componentMixin],
  methods:{
    showPop(){
      this.isShow()
      let this_ = this.getVue()
    },
    hidePop(){
      this.show = false
    },
    //点击完成按钮后，会触发 confirm 事件
    onConfirm(value, index) {
      if (this.eventMap.confirm){
        eval(this.eventMap.confirm)
      }else{
        this.label = value
        switch (this.componentConfig.dataType){
          case 'remote':
            this.value = this.componentConfig.remoteData.find(item => item.label===value).name
            break
          case 'static':
            this.value = this.componentConfig.staticData.find(item => item.label===value).name
            break
          case 'dict':
            this.value = this.componentConfig.collectionData.find(item => item.label===value).name
            break
        }
      }
      this.show = false;
    },
    setFunctions(restItem){
      if (!restItem.eventList||restItem.eventList.length<1){
        return
      }
      restItem.eventList.forEach((item)=>{
        this.eventMap[item.eventType] = item.textarea
      })
    }
  },
  render () {
    const { $props, $listeners, $attrs, $scopedSlots } = this
    const {
      componentConfig: {
          name,
          type,
          icon,
          display,
          style,
          dataType,
          staticData,
          remoteData,
          collectionData,
          ...restItem
      },
      value,
      checked,
      modulePartId,
      ...restProps
    } = $props
    this.setRestItem(restItem)
    const initStyle = !style||style === ""?"width:100%;":style
    let pickerData = []
    if(dataType === 'static'){
      pickerData = staticData || []
    }
    if(dataType === 'remote') {
      pickerData = remoteData || []
    }
    if(dataType === 'dict') {
      pickerData = collectionData || []
    }
    let columns = pickerData.map(item => {return item.label})
    const event = {}
    event.cancel = this.hidePop
    event.confirm = this.onConfirm
    const _this = this
    const setValue = function (value){
      if (!value || value === ''){
        _this.value = ''
        _this.label = ''
        return
      }
      for (const item of pickerData) {
        if(item.name === value){
          _this.value = value;
          _this.label = item.label
          break
        }
      }
    }
    const pickerProps = {
      props: {
        ...restProps,
        ...restItem,
        columns,
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
      on: {
        setValue: setValue
      }
    }
    return (
        <div>
          <van-field
              vModel={this.label}
              isLink={!restItem.disabled}
              readonly={true}
              vOn:click={restItem.disabled ? ()=>{} : this.showPop}
              name={name+'_label'}
              rules={[{
                required: restItem.required,
                message: restItem.message&&restItem.message!==''?restItem.message:restItem.label+'不能为空！'
              }]}
              {...fieldProps}
          />
          <van-popup vModel={this.show} round position="bottom" get-container={'.mobileShape'}>
            <van-picker {...pickerProps} />
          </van-popup>
          <van-field
              vModel={this.value}
              name={name}
              vShow={false}/>
        </div>
    )
  },
}
