<template>
  <div class="group-item" id="workExper">
    <div class="group-title">
      <div class="title-lt">
        <i class="ic ic-resume-title"></i>
        <span>工作经历</span>
      </div>
      <div class="title-rt">
        <button type="primary" size="mini" @click="fnAdd" plain>继续添加</button>
      </div>
    </div>
    <div class="group-con">
      <div class="group-list">
        <div class="group-head">
          <div class="group-th">工作时间</div>
          <div class="group-th">公司名称</div>
          <div class="group-th">职位</div>
          <div class="group-th">工作描述</div>
          <div class="group-th align-center">操作</div>
        </div>
        <div class="group-body no-br" v-if="WorkList.length > 0">
          <div class="group-tr" v-for="(item, index) in WorkList" :key="index">
            <div class="group-td">{{ $utils.dateFormat(item.aae030) }} ~ {{ $utils.dateFormat(item.aae031) }}</div>
            <div class="group-td">{{ item.aab004 }}</div>
            <div class="group-td">{{ item.aca112 }}</div>
            <div class="group-td">{{ item.acc251 }}</div>
            <div class="group-td align-center">
              <span class="text-error" @click="fnDel(item)">删除</span>
			   <span class="text-error" @click="fbEdit(item)">编辑</span>
            </div>
          </div>
        </div>
        <div class="group-none" v-if="WorkList.length < 1 && !isAdd">
          <div class="none-box">
            <div class="none-img">
              <image :src="baseImgSrc + '/ic_no_data.png'" mode="scaleToFill" />
            </div>
            <div class="none-text">暂时没有录入数据~</div>
          </div>
        </div>
        <div class="group-form" v-if="isAdd||isEdit">
          <uni-forms ref="form" :modeValue="formData">
            <div class="form-tr">
              <div class="form-td">
                <uni-datetime-picker
                  style="width: 100%"
                  type="date"
                  v-model="formData.aae030"
                  placeholder="入职时间"
                  :clear-icon="false"
                />
              </div>
              <div class="form-td">
                <uni-datetime-picker
                  style="width: 100%"
                  type="date"
                  v-model="formData.aae031"
                  placeholder="离职时间"
                  :clear-icon="false"
                />
              </div>
              <div class="form-td">
                <uni-easyinput
                  v-model="formData.aab004"
                  type="text"
                  class="form-input"
                  placeholder="请填写公司名称"
                  placeholderStyle="color:rgba(0,0,0,.25)"
                />
              </div>
              <div class="form-td">
                <uni-easyinput
                  v-model="formData.aca112"
                  type="text"
                  class="form-input"
                  placeholder="请填写职位名称"
                  placeholderStyle="color:rgba(0,0,0,.25)"
                />
              </div>
            </div>
            <div class="form-tr">
              <div class="form-td">
                <uni-easyinput
                  v-model="formData.acc251"
                  type="text"
                  class="form-input"
                  placeholder="请填写工作描述"
                  placeholderStyle="color:rgba(0,0,0,.25)"
                />
              </div>
            </div>
          </uni-forms>
          <div class="group-add">
            <button type="primary" class="btn" @click="saveInfo">保存</button>
			<button type="default" class="btn" @click="cancelOn">取消</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'workExper',
  props: {
    workExperience: {
      type: Array,
      default: () => {
        return []
      },
    },
    // 用户信息
    userInfo: {
      type: Object,
      default: () => {
        return {}
      },
    },
    // 简历编号
    acc200: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      baseImgSrc: this.$baseImgSrc,
      WorkList: [],
      formData: {},
      isAdd: false,
	  isEdit: false,
    }
  },
  watch: {
    workExperience: {
      handler(newVal, oldVal) {
        this.WorkList = newVal.map((item) => {
          item.workDate = [item.aae030, item.aae031]
          return item
        })
        if (this.WorkList.length >= 5) {
          this.isAdd = false
        }
      },
      deep: true,
      immediate: true,
    },
  },
  methods: {
    init() {},
    // 删除
    fnDel(item) {
      this.$emit('delCcList', '2', item.acc250)
    },
	cancelOn(){
		this.isAdd = false
		this.isEdit = false
		this.formData = {}
	},
    saveInfo() {
      if (!this.formData.aae030 && this.formData.aae031) {
        this.$utils.showToast('存在离职时间时，入职时间不能为空')
        return
      }
      if (this.formData.aae030) {
        let date = new Date()
        let year = date.getFullYear()
        let month = date.getMonth() + 1
        let day = date.getDate()
        if (month >= 1 && month <= 9) {
          month = '0' + month
        }
        if (day >= 0 && day <= 9) {
          day = '0' + day
        }
        date = year + '-' + month + '-' + day
        if (this.formData.aae030 > date) {
          this.$utils.showToast('入职时间不能超过当前日期')
          return
        }
        if (this.formData.aae031 > date) {
          this.$utils.showToast('离职时间不能超过当前日期')
          return
        }
        if (this.formData.aae031 && this.formData.aae030 > this.formData.aae031) {
          this.$utils.showToast('入职时间不能超过离职时间')
          return
        }
      }
      let param = {
        method: 'jy202_hrm134',
      }

      if (!this.formData.aae030) {
        param.start_job = '1' // 入职时间为空时
      }
      if (!this.formData.aae031) {
        param.end_job = '1' // 离职时间为空时
      }
      param.acc200 = this.acc200
      param.aac001 = this.userInfo.aac001
      if (!this.formData.aab004) {
        this.$utils.showToast('请填写公司名称')
        return
      }
      if (!this.formData.aca112) {
        this.$utils.showToast('请填写职位名称')
        return
      }
      param = Object.assign(param, this.formData)
      this.$utils
        .request('/api/business/invoke', param, true, true, 'cipher')
        .then((res) => {
          this.$emit('refresh')
          if(this.isEdit){
          	this.$utils.showToast('编辑成功')
          }else{
          	this.$utils.showToast('保存成功')
          }
          this.formData = {}
        })
        .catch((err) => {
          this.$utils.showToast('保存失败')
        })
    },
    fnAdd() {
      if (this.WorkList.length < 5) {
        this.isAdd = true
		this.isEdit = false
		this.formData.acc250 = ''
      } else {
        this.$utils.showToast('最多五条工作经历，请先删除不需要的')
      }
    },
	// 编辑
	fbEdit(item){
		this.isEdit = true
		this.$nextTick(()=>{
			this.formData = {...item}
		})
	},
  },
}
</script>

<style lang="scss" scoped>
@import '~@/static/scss/resume.scss';

.group-tr:last-child {
  border-bottom: 1px solid #a2a7a9 !important;
}
.group-list .group-form .form-tr {
  line-height: 48px;
}
.group-add {
  width: 300px;
  margin: 0 auto;
}
.text-error{
	margin-right: 20px;
	&:last-child{
		margin-right: 0px;
	}
}
</style>
