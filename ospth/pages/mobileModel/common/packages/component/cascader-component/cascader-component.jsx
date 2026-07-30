import componentMixin from "../../../mixin/componentMixin";
export default {
  name: 'cascader-component',
  props: {
    componentConfig: {
      type: Object,
      required: true,
      default: () => {
        return {}
      },
    },
  },
  computed: {
    realOptions: {
      get: function () {
        if(this.item.dataType === 'static') return this.item.staticData
        if(this.item.dataType === 'remote') return this.item.remoteData
      },
      set: function () {

      }
    }
  },
  data () {
    return {
      show: false,
      eventMap:{},
      value: '',
      text: '',
    }
  },
  mixins: [componentMixin],
  mounted() {
    this.value = this.componentConfig.initialValue
  },
  methods:{
    showPop(){
      this.isShow()
      let this_ = this.getVue()
    },
    hidePop(){
      this.show = false
    },
    onChange({ value,selectedOptions }){
      if (this.eventMap.change){
        eval(this.eventMap.change)
      }else{
        this.value = selectedOptions.map((option) => option.value).join(',');
        this.text = selectedOptions.map((option) => option.text).join('/');
      }
    },
    // 全部选项选择完毕后，会触发 finish 事件
    onFinish({ value,selectedOptions }) {
      let result = true
      if (this.eventMap.finish){
        eval(this.eventMap.finish)
      }else{
        this.value = selectedOptions.map((option) => option.value).join(',');
        this.text = selectedOptions.map((option) => option.text).join('/');
      }
      if (!result){
        return
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
  render() {
    const {$props, $listeners, $attrs, $scopedSlots} = this
    const {
      componentConfig: {
        type,
        icon,
        span,
        display,
        style,
        dataType,
        name,
        staticData,
        remoteData,
        initialValue,
        ...restItem
      },
      value,
      checked,
      modulePartId,
      ...restProps
    } = $props
    this.setRestItem(restItem)
    this.setFunctions(restItem)
    const initStyle = !style || style === "" ? "width:100%;" : style
    if (restItem.isSearch) {
      restItem.showSearch = function (inputValue, path) {
        return (path.some(option => (option.label).toLowerCase().indexOf(inputValue.toLowerCase()) > -1))
      }
    }
    let treeData = []
    if (dataType === 'static') {
      treeData = staticData || []
    }
    if (dataType === 'remote') {
      treeData = remoteData || []
    }
    const event = {}
    event.close = this.hidePop
    event.finish = this.onFinish
    event.change = this.onChange
    const _this = this
    const setValue = function (value){
      if (!value||value==''){
        _this.value = ''
        _this.text = ''
        return
      }
      let valueList = []
      if (value.indexOf(',')>-1){
        valueList = value.split(",")
      }else {
        valueList = [value]
      }
      _this.value = value;
      _this.text = '';
      let tempData = treeData.find((option)=>option.value === valueList[0])
      if (!tempData){
        return;
      }
      for (let i=0;i<valueList.length;i++){
        if (i === 0){
          _this.text = tempData.text
          if (!tempData.children||tempData.children.length<1){
            return;
          }
          continue
        }
        tempData = tempData.children.find((option)=>option.value === valueList[i])
        if (!tempData){
          return;
        }
        _this.text = `${_this.text}/${tempData.text}`
        if (!tempData.children||tempData.children.length<1){
          return;
        }
      }
    }
    const cascaderProps = {
      props: {
        ...restProps,
        ...restItem,
        options: treeData,
        placeholder: restItem.placeholder || `请输入${restItem.label}`,
      },
      attrs: {
        ...$attrs,
        style: initStyle
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
              vModel={this.text}
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
            <van-cascader {...cascaderProps}/>
          </van-popup>
          <van-field
              vModel={this.value}
              name={name}
              vShow={false}/>
        </div>
    )
  },
}
