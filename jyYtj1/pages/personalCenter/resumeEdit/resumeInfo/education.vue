<template>
  <div class="group-item">
    <div class="group-title">
      <div class="title-lt">
        <i class="ic ic-resume-title"></i>
        <span>教育背景</span>
      </div>
      <div class="title-rt">
        <button type="primary" size="mini" @click="fnAdd" plain>继续添加</button>
      </div>
    </div>
    <div class="group-con">
      <div class="group-list">
        <div class="group-head">
          <div class="group-th">学校名称</div>
          <div class="group-th">所学专业</div>
          <div class="group-th">学历</div>
          <div class="group-th">入学时间</div>
          <div class="group-th">毕业时间</div>
          <div class="group-th align-center">操作</div>
        </div>
        <div class="group-body" v-if="cc26List.length > 0">
          <div class="group-tr" v-for="(item, index) in cc26List" :key="index">
            <div class="group-td">{{ item.acc261 }}</div>
            <div class="group-td">{{ item.acc262Desc?item.acc262Desc:$utils.queryCodeDesc('aac183', item.acc262) }}</div>
            <div class="group-td">{{ $utils.queryCodeDesc('aac011', item.aac011) }}</div>
            <div class="group-td">{{ $utils.dateFormat(item.aae030) }}</div>
            <div class="group-td">{{ $utils.dateFormat(item.aae031) }}</div>
            <div class="group-td align-center">
              <span class="text-error" @click="fnDel(item)">删除</span>
			  <span class="text-error" @click="fbEdit(item)">编辑</span>
            </div>
          </div>
        </div>
        <div class="group-none" v-if="cc26List.length < 1 && !isAdd">
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
                <uni-easyinput type="text" v-model="formData.acc261" :clearable="false" placeholder="请填写学校名称" />
              </div>
              <div class="form-td">
				  <modal-major
				    ref="addressAab301"
				    v-model="formData.acc262Desc"
				    @setAreaValue="getAreaValue"
				    placeholder="请选择所学专业"
				  ></modal-major>
                <!-- <custom-select
                  id="acc262"
                  label="所学专业"
                  collect="aac183"
                  v-model="formData.acc262"
                  required
                  @input="binddata('acc262', formData.acc262)"
                  placeholder="请选择所学专业"
                  ref="acc262"
                >
                </custom-select> -->
              </div>
              <div class="form-td">
                <custom-select
                  id="aac011"
                  label="最高学历"
                  collect="aac011"
                  v-model="formData.aac011"
                  required
                  @input="binddata('aac011', formData.aac011)"
                  placeholder="请选择学历"
                  ref="aac011"
                >
                </custom-select>
              </div>
            </div>
            <div class="form-tr">
              <div class="form-td">
                <uni-datetime-picker
                  style="width: 100%"
                  type="date"
                  v-model="formData.aae030"
                  placeholder="入学时间"
                  :clear-icon="false"
                />
              </div>
              <div class="form-td">
                <uni-datetime-picker
                  style="width: 100%"
                  type="date"
                  v-model="formData.aae031"
                  placeholder="毕业时间"
                  :clear-icon="false"
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
  name: 'education',
  props: {
    eduExperience: {
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
      cc26List: [],
      formData: {},
      isAdd: false,
	  isEdit: false,
    }
  },
  watch: {
    eduExperience: {
      handler(newVal, oldVal) {
        this.cc26List = newVal.map((item) => {
          return item
        })
        if (this.cc26List.length >= 3) {
          this.isAdd = false
        }
      },
    },
    deep: true,
    immediate: true,
  },
  methods: {
    fnAdd() {
      if (this.cc26List.length < 3) {
        this.isAdd = true
		this.isEdit = false
		this.formData.acc260 = ''
      } else {
        this.$utils.showToast('最多三条教育经历，请先删除不需要的')
      }
    },
    //删除
    fnDel(item) {
      this.$emit('delCcList', '3', item.acc260)
    },
	cancelOn(){
		this.isAdd = false
		this.isEdit = false
		this.formData = {}
	},
    saveInfo() {
      if (!this.formData.aae030 && this.formData.aae031) {
        this.$utils.showToast('存在毕业时间时，入学时间不能为空')
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
          this.$utils.showToast('入学时间不能超过当前日期')
          return
        }
        if (this.formData.aae031 && this.formData.aae030 > this.formData.aae031) {
          this.$utils.showToast('入学时间不能超过毕业时间')
          return
        }
      }
      if (!this.formData.acc261) {
        this.$utils.showToast('请填写学校名称')
        return
      }
      if (!this.formData.acc262) {
        this.$utils.showToast('请选择所学专业')
        return
      }
      if (!this.formData.aac011) {
        this.$utils.showToast('请选择您的学历')
        return
      }
      let param = {
        acc200: this.acc200,
        aac001: this.userInfo.aac001,
        ...this.formData,
        method: 'jy202_hrm135',
      }
	  if(this.isEdit){
		  param.acc260 = this.formData.acc260
	  }
      // aac011_dsc: this.aac011_dsc,
      this.$utils.request('/api/business/invoke', param, true, true, 'cipher').then((res) => {
        this.$emit('refresh')
        if(this.isEdit){
        	this.$utils.showToast('编辑成功')
        }else{
        	this.$utils.showToast('保存成功')
        }
        this.formData = {}
      })
    },
	// 地区选择结果
	getAreaValue(value) {
	  this.formData.acc262 = value.value
	},
	// 编辑
	fbEdit(item){
		this.isEdit = true
		this.$nextTick(()=>{
			if(!item.acc262Desc){
				item.acc262Desc = this.$utils.queryCodeDesc('aac183', item.acc262)
			}
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
