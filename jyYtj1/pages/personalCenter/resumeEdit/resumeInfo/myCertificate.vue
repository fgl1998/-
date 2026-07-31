<template>
  <div class="group-item">
    <div class="group-title">
      <div class="title-lt">
        <i class="ic ic-resume-title"></i>
        <span>我的证书</span>
      </div>
      <div class="title-rt">
        <button type="primary" size="mini" @click="fnAdd" plain>继续添加</button>
      </div>
    </div>
    <div class="group-con">
      <div class="group-con">
        <div class="group-list">
          <div class="group-head">
            <div class="group-th">项目名称</div>
            <div class="group-th align-center">操作</div>
          </div>
          <div class="group-body no-br">
            <div class="group-tr" v-for="(item,index) in cc30List" :key="index">
              <div class="group-td">{{item.acc281}}</div>
              <div class="group-td align-center">
                <span class="text-error" @click="fnDel(item)">删除</span>
				<span class="text-error" @click="fbEdit(item)">编辑</span>
              </div>
            </div>
          </div>
          <div class="group-none" v-if="cc30List.length<1&&!isAdd">
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
                  <uni-easyinput type="text" v-model="formData.acc281" :clearable="false" placeholder="请输入证书名称" />
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
  </div>
</template>

<script>
  export default {
    name: 'projectExper',
    props: {
      certificateList: {
        type: Array,
        default: () => {
          return []
        }
      },
      // 用户信息
      userInfo: {
        type: Object,
        default: () => {
          return {}
        }
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
        cc30List: [],
        formData: {},
        isAdd: false,
		isEdit: false,
      }
    },
    watch: {
      certificateList: {
        handler(newVal, oldVal) {
          this.cc30List = newVal.map((item) => {
            return item
          })
          if (this.cc30List.length >= 5) {
            this.isAdd = false
          }
        },
        deep: true,
        immediate: true
      }
    },
    methods: {
      fnAdd() {
        if (this.cc30List.length < 5) {
          this.isAdd = true
		  this.isEdit = false
		  this.formData.acc280 = ''
        } else {
          this.$utils.showToast("最多五项证书，请先删除不需要的")
        }
      },
      //删除
      fnDel(item) {
        this.$emit("delCcList", '7', item.acc280)
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
        if (!this.formData.acc281) {
          this.$utils.showToast("请输入证书名称")
          return
        }
        let param = {
			method:'jy202_hrm165',
			apiCode: 'jy202_hrm165',
		};
        param.acc200 = this.acc200;
        param.aac001 = this.userInfo.aac001;
        param.aae100 = '1';
        param = Object.assign(param, this.formData);
        this.$utils.request('/api/business/invoke', param, true, true, 'cipher').then(
        res => {
			this.$emit('refresh')
			if(this.isEdit){
				this.$utils.showToast('编辑成功')
			}else{
				this.$utils.showToast('保存成功')
			}
			this.formData = {}
        })
      }
    }
  }
</script>

<style lang="scss" scoped>
  @import '~@/static/scss/resume.scss';

  .group-tr:last-child {
    border-bottom: 1px solid #A2A7A9 !important;
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