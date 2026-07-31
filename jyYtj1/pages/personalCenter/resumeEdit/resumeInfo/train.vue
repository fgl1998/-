<template>
  <div class="group-item">
    <div class="group-title">
      <div class="title-lt">
        <i class="ic ic-resume-title"></i>
        <span>培训经历</span>
      </div>
      <div class="title-rt">
        <button type="primary" size="mini" @click="fnAdd" plain>继续添加</button>
      </div>
    </div>
    <div class="group-con">
      <div class="group-con">
        <div class="group-list">
          <div class="group-head">
            <div class="group-th">培训机构</div>
            <div class="group-th">培训课程</div>
            <div class="group-th">开始时间</div>
            <div class="group-th">结束时间</div>
            <div class="group-th">培训内容</div>
            <div class="group-th align-center">操作</div>
          </div>
          <div class="group-body no-br">
            <div class="group-tr" v-for="(item,index) in cc28List" :key="index">
              <div class="group-td">{{item.acc271}}</div>
              <div class="group-td">{{item.acc272}}</div>
              <div class="group-td">{{$utils.dateFormat(item.aae030)}}</div>
              <div class="group-td">{{$utils.dateFormat(item.aae031)}}</div>
              <div class="group-td">{{item.acc273}}</div>
              <div class="group-td align-center">
                <span class="text-error" @click="fnDel(item)">删除</span>
				<span class="text-error" @click="fbEdit(item)">编辑</span>
              </div>
            </div>
          </div>
          <div class="group-none" v-if="cc28List.length<1&&!isAdd">
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
                  <uni-easyinput type="text" v-model="formData.acc271" :clearable="false" placeholder="请输入机构名称" />
                </div>
                <div class="form-td">
                  <uni-easyinput type="text" v-model="formData.acc272" :clearable="false" placeholder="请输入培训课程" />
                </div>
                <div class="form-td">
                  <uni-datetime-picker style="width: 100%;" type="date" v-model="formData.aae030" placeholder="请选择开始时间"
                    :clear-icon="false" />
                </div>
                <div class="form-td">
                  <uni-datetime-picker style="width: 100%;" type="date" v-model="formData.aae031" placeholder="请选择结束时间"
                    :clear-icon="false" />
                </div>
              </div>
              <div class="form-tr">
                <div class="form-td">
                  <uni-easyinput type="text" v-model="formData.acc273" :clearable="false" placeholder="请将输入培训内容" />
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
      trainExperience: {
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
        cc28List: [],
        formData: {},
        isAdd: false,
		isEdit: false,
      }
    },
    watch: {
      trainExperience: {
        handler(newVal, oldVal) {
          this.cc28List = newVal.map((item) => {
            return item
          })
          if (this.cc28List.length >= 5) {
            this.isAdd = false
          }
        },
        deep: true,
        immediate: true
      }
    },
    methods: {
      fnAdd() {
        if (this.cc28List.length < 5) {
          this.isAdd = true
		  this.isEdit = false
		  this.formData.acc270 = ''
        } else {
          this.$utils.showToast("最多五条培训经历，请先删除不需要的")
        }
      },
      //删除
      fnDel(item) {
        this.$emit("delCcList", '6', item.acc270)
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
        if (!this.formData.acc271) {
          this.$utils.showToast("请输入机构名称")
          return
        }
        if (!this.formData.acc272) {
          this.$utils.showToast("请输入培训课程")
          return
        }
        if (!this.formData.acc273) {
          this.$utils.showToast("请输入培训内容")
          return
        }
        if (!this.formData.aae030 && this.formData.aae031) {
          this.$utils.showToast("存在结束时间时，开始时间不能为空");
          return;
        };
        if (this.formData.aae030) {
          let date = new Date();
          let year = date.getFullYear();
          let month = date.getMonth() + 1;
          let day = date.getDate();
          if (month >= 1 && month <= 9) {
            month = "0" + month
          }
          if (day >= 0 && day <= 9) {
            day = "0" + day
          }
          date = year + '-' + month + '-' + day;
          if (this.formData.aae030 > date) {
            this.$utils.showToast("开始时间不能超过当前日期");
            return;
          }
          if (this.formData.aae031 > date) {
            this.$utils.showToast("结束时间不能超过当前日期");
            return;
          }
          if (this.formData.aae031 && this.formData.aae030 > this.formData.aae031) {
            this.$utils.showToast("开始时间不能超过结束时间");
            return;
          }
        }
        let param = {
			method:'jy202_hrm162',
			apiCode: 'jy202_hrm162',
		};

        if (!this.formData.aae030) {
          param.start_job = "1"; // 开始时间为空时
        }
        if (!this.formData.aae031) {
          param.end_job = "1"; // 结束时间为空时
        }
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