// import {$postRequest} from "../../common/js/requestTools";
export default {
  data () {
    return {
    }
  },
  methods: {
    /**
     * 获取表单数据对象
     * @param name 组件编号
     */
    getObj(name){
      return this.objMap[name]
    },
    /**
     * 获取组件对象
     * @param name 组件编号
     */
    getComponent(name) {
      let obj = void 0;
      if (this.$refs[name + "_col"] && this.$refs[name + "_col"][0]&&!this.$refs[name + "_col"][0].$refs[name]){
        obj = this.$refs[name + "_col"][0].$children[0];
      }else if (this.$refs[name + "_col"] && this.$refs[name + "_col"][0]&&this.$refs[name + "_col"][0].$refs[name].$children) {
        obj = this.$refs[name + "_col"][0].$refs[name].$children[0];
      }
      return obj;
    },
    /**
     * 执行表单submit事件
     */
    submitForm(){
      this.$refs.baseForm.submit()
    },

    /**
     * 获取表单组件值
     * @param name 组件编号
     */
    getValue(name){
      let param = this.$refs.baseForm.getValues()
      return param[name]
    },
    getValues(){
      return this.$refs.baseForm.getValues()
    },
    /**
     * form表单赋值
     * @param name 组件编号
     * @param value 参数值
     */
    setValue(name,value){
      if(!this.getComponent(name)) return;
      if(['cascader','picker'].includes(this.getObj(name).type)){
        this.executeEvent(name,'setValue',value)
        return;
      }
      this.$refs[name + "_col"][0].$refs[name].value = value
    },
    /**
     * form表单赋值
     * @param param 赋值对象
     */
    setValues(param){
      if (!param){
        return;
      }
      let keyList = Object.keys(param)
      if (keyList.length<1){
        return;
      }
      keyList.forEach(name=>{
        this.setValue(name,param[name])
      })
    },
    /**
     * 执行组件提供的事件
     * @param name 组件编号
     * @param eventName 事件名称
     * @param param 事件参数
     */
    executeEvent(name,eventName,...param) {
      this.getComponent(name).$emit(eventName, ...param)
    },
    /**
     * 批量展示组件
     * @param names 组件编号，复数以,分割
     */
    showObj(names){
      if (names) {
        const nameArray = names.split(',')
        for (let i = 0; i < nameArray.length; i++) {
          this.$set(this.displayParams,nameArray[i],true)
        }
      }
    },
    /**
     * 批量隐藏组件
     * @param names 组件编号，复数以,分割
     */
    hideObj(names){
      if (names) {
        const nameArray = names.split(',')
        for (let i = 0; i < nameArray.length; i++) {
          this.$set(this.displayParams,nameArray[i],false)
        }
      }
    },
    /**
     * 批量置灰组件
     * @param names 组件编号，复数以,分割
     */
    setDisable(names){
      if (names) {
        const nameArray = names.split(',')
        for (let i = 0; i < nameArray.length; i++) {
          this.disabledParams[nameArray[i]] = true
        }
      }
    },
    /**
     * 批量可用组件
     * @param names 组件编号，复数以,分割
     */
    setEnable(names){
      if (names) {
        const nameArray = names.split(',')
        for (let i = 0; i < nameArray.length; i++) {
          this.disabledParams[nameArray[i]] = false
        }
      }
    },
    /**
     * 提交远程请求
     * @param url 请求地址
     * @param param 请求参数
     * @param successCallback 回调函数
     * @param config 请求配置 比如header
     */
    submitRemote (url, param, successCallback) {
      const data = {
        url: url,
        param: JSON.stringify(param),
        app_no: this.getParam('appNo')?this.getParam('appNo'):this.app_no,
      }
      $postRequest('form/remote/action/call',data).then(result => {
        successCallback(result)
      })
    },
    /**
     * 提交本地请求
     * @param url 请求地址
     * @param param 请求参数
     * @param successCallback 回调函数
     * @param config 请求配置 比如header
     */
    submit (url, param, successCallback,config) {
      $postRequest(url, param,config).then((res)=>{
        successCallback(res)
      });
    },
    /**
     * 存放当前页面的变量
     * @param key 字段变量
     * @param value 字段值
     */
    setParam (key, value) {
      this.params[key] = value
    },
    /**
     * 存放当前页面的变量
     * @param {key:value}
     */
    setParams (param) {
      for (const key in param) {
        this.params[key] = param[key]
      }
    },
    /**
     * 获取当前页面的变量值
     * @param key
     * @returns {*}
     */
    getParam (key) {
      return this.params[key]
    },
  }
}
