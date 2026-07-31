<template>
  <div class="group-item">
    <div class="group-title">
      <div class="title-lt">
        <i class="ic ic-resume-title"></i>
        <span>语言能力</span>
      </div>
      <div class="title-rt">
        <button type="primary" size="mini" @click="fnAdd" plain>继续添加</button>
      </div>
    </div>
    <div class="group-con">
      <div class="group-list">
        <div class="group-head">
          <div class="group-th">语言类别</div>
          <div class="group-th">熟练程度</div>
          <div class="group-th">读写能力</div>
          <div class="group-th">听说能力</div>
          <div class="group-th align-center">操作</div>
        </div>
        <div class="group-body" v-if="cc24List.length > 0">
          <div class="group-tr" v-for="(item, index) in cc24List" :key="index">
            <div class="group-td">{{ $utils.queryCodeDesc('acc241', item.acc241) }}</div>
            <div class="group-td">{{ $utils.queryCodeDesc('acc242', item.acc242) }}</div>
            <div class="group-td">{{ $utils.queryCodeDesc('acc242', item.acc243) }}</div>
            <div class="group-td">{{ $utils.queryCodeDesc('acc242', item.acc244) }}</div>
            <div class="group-td align-center">
              <span class="text-error" @click="fnDel(item)">删除</span>
			  <span class="text-error" @click="fbEdit(item)">编辑</span>
            </div>
          </div>
        </div>
        <div class="group-none" v-if="cc24List.length < 1 && !isAdd">
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
                <custom-select
                  id="acc241"
                  label="语言类别"
                  collect="acc241"
                  v-model="formData.acc241"
                  required
                  @input="binddata('acc241', formData.acc241)"
                  placeholder="请选择语言类别"
                  ref="acc241"
                >
                </custom-select>
              </div>
              <div class="form-td">
                <custom-select
                  id="acc242"
                  label="熟练程度"
                  collect="acc242"
                  v-model="formData.acc242"
                  required
                  @input="binddata('acc242', formData.acc242)"
                  placeholder="请选择熟练程度"
                  ref="acc242"
                >
                </custom-select>
              </div>
              <div class="form-td">
                <custom-select
                  id="acc243"
                  label="读写能力"
                  collect="acc242"
                  v-model="formData.acc243"
                  required
                  @input="binddata('acc243', formData.acc243)"
                  placeholder="请选择读写能力"
                  ref="acc243"
                >
                </custom-select>
              </div>
              <div class="form-td">
                <custom-select
                  id="acc244"
                  label="听说能力"
                  collect="acc242"
                  v-model="formData.acc244"
                  required
                  @input="binddata('acc244', formData.acc244)"
                  placeholder="请选择听说能力"
                  ref="acc244"
                >
                </custom-select>
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
  name: 'language',
  props: {
    langExperience: {
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
      cc24List: [],
      formData: {},
      isAdd: false,
	  isEdit: false,
    }
  },
  watch: {
    langExperience: {
      handler(newVal, oldVal) {
        this.cc24List = newVal.map((item) => {
          return item
        })
        if (this.cc24List.length >= 3) {
          this.isAdd = false
        }
      },
    },
    deep: true,
    immediate: true,
  },
  methods: {
    fnAdd() {
      if (this.cc24List.length < 3) {
        this.isAdd = true
		this.isEdit = false
		this.formData.acc240 = ''
      } else {
        this.$utils.showToast('最多三条语言能力，请先删除不需要的')
      }
    },
    //删除
    fnDel(item) {
      this.$emit('delCcList', '1', item.acc240)
    },
	// 编辑
	fbEdit(item){
		this.isEdit = true
		this.$nextTick(()=>{
			this.formData = {...item}
		})
	},
	cancelOn(){
		this.isAdd = false
		this.isEdit = false
		this.formData = {}
	},
    saveInfo() {
      const some = this.cc24List.some((item) => item.acc241 === this.formData.acc241)
      if (some&&!this.isEdit) {
        this.$utils.showToast('请勿重复添加')
        return
      }
      if (!this.formData.acc241) {
        this.$utils.showToast('请选择语言类别')
        return
      }
      if (!this.formData.acc242) {
        this.$utils.showToast('请选择熟练程度')
        return
      }
      if (!this.formData.acc243) {
        this.$utils.showToast('请选择读写能力')
        return
      }
      if (!this.formData.acc244) {
        this.$utils.showToast('请选择听说能力')
        return
      }
      let param = {
        acc200: this.acc200,
        aac001: this.userInfo.aac001,
        ...this.formData,
        method: 'jy202_hrm136',
      }
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
