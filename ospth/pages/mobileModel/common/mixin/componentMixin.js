import moment from 'moment'
import base from '../../../../static/public/utils/applet.base.js'
// import {$postRequest} from "../js/requestTools";
export default {
  props: {
    checked: {
      type: Boolean,
      default: () => {
        return {}
      },
    },
  },
  watch:{
    checked(val){
      this.selected = val;
    }
  },
  data () {
    return {
      moment: moment,
      selected: false
    }
  },
  mounted () {
    this.selected = this.checked
    // 请求当前表单项的数据
    this.fnQueryData()
  },
  methods: {
    // 递归查找属性
    getData (obj, dataName) {
      let res = undefined
      const tempArr = Object.getOwnPropertyNames(obj)
      if (tempArr.includes(dataName)) {
        return obj[dataName]
      } else {
        for (let i = 0; i < tempArr.length; i++) {
          if (res) return res
          res =  this.getData(obj[tempArr[i]], dataName)
          if (res) return res
        }
      }
    },
    // 请求数据
    fnQueryData () {
      let this_ = this.getVue()
      if (this.componentConfig.dataType === 'remote') {
        if(this.componentConfig.initUrl === undefined||this.componentConfig.isLoad){
          return
        }
        let data = {};
        let url = this.componentConfig.initUrl
        data.app_url = this_.app_url
		let param = {}
        if(this.componentConfig.params){
          param = JSON.parse(this.componentConfig.params);
        }
		uni.request({
		    url: url,
		    data: param,
			method: "POST",
		    header: {
				'content-type': 'application/x-www-form-urlencoded'
			},
		    success: (res) => {
				let data = {}
				if(res.data && res.data.data && res.data.data.resultData) {
					data = res.data.data.resultData
				} else if(res.data && res.data.data) {
					data = res.data.data
				} else {
					data = res.data
				}
				if(data && this.componentConfig.resName) {
					this.componentConfig.remoteData = data[this.componentConfig.resName]
				} else {
					this.componentConfig.remoteData = data
				}
		        // this.$forceUpdate()
		    }
		});
      }
    },
    //带弹出层组件弹出判定，选中组件时不弹出，再次点击弹出
    isShow(){
      if(this.selected || window.location.href.indexOf("mobileModel") > 0)
        this.show = true
    }
  }
}
