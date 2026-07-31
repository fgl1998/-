<template>
  <div class="group-item">
    <div class="group-title">
      <div class="title-lt">
        <i class="ic ic-resume-title"></i>
        <span>求职意向</span>
      </div>
      <div class="title-rt">
        <button type="primary" size="mini" @click="fnAdd" plain>继续添加</button>
      </div>
    </div>
    <div class="group-con">
      <div class="group-list">
        <div class="group-head">
          <div class="group-th">意愿岗位</div>
          <div class="group-th">薪资范围</div>
          <div class="group-th">工作方式</div>
          <div class="group-th">工作地点</div>
          <div class="group-th align-center">操作</div>
        </div>
        <div class="group-body no-br">
          <div class="group-tr" v-for="(item, index) in jobIntentInfo" :key="index">
            <div class="group-td">{{ item.aca112 }}</div>
            <div class="group-td" v-if="item.acb21h || item.acb21j">
              <label class="text-red" v-if="item.acb21h && item.acb21j">{{ item.acb21h }}~{{ item.acb21j }}元</label>
              <label class="text-red" v-else-if="item.acb21h">{{ item.acb21h }}元</label>
              <label class="text-red" v-else-if="item.acb21j">{{ item.acb21j }}元</label>
              <!-- <label class="text-red" v-if="item.acb241 && item.acb242">{{ item.acb241 }}~{{ item.acb242 }}元</label>
              <label class="text-red" v-else-if="item.acb241">{{ item.acb241 }}元起</label>
              <label class="text-red" v-else-if="item.acb242">最高{{ item.acb242 }}元</label> -->
            </div>
            <div class="group-td" v-else>
              <label class="text-red">{{ '未知薪资' }}</label>
            </div>
            <div class="group-td">{{ $utils.queryCodeDesc('acb469', item.acb469) }}</div>
            <div class="group-td">{{ item.acb202 }}</div>
            <div class="group-td align-center">
              <span class="text-error" @click="fnDel(item)">删除</span>
              <span class="text-error" @click="fbEdit(item)">编辑</span>
            </div>
          </div>
        </div>
        <div class="group-none" v-if="jobIntentInfo.length < 1 && !isAdd">
          <div class="none-box">
            <div class="none-img">
              <image :src="baseImgSrc + '/ic_no_data.png'" mode="scaleToFill" />
            </div>
            <div class="none-text">暂时没有录入数据~</div>
          </div>
        </div>
        <div class="group-form" v-if="isAdd || isEdit">
          <uni-forms ref="form" :modeValue="formData">
            <div class="form-tr">
              <div class="form-td">
                <modal-workType
                  ref="addressAca111"
                  moduleKey="aca111"
                  :moduleId="formData.aca111"
                  v-model="formData.aca112"
                  @setModalValue="getModalValue"
                  placeholder="请选择意愿岗位"
                ></modal-workType>
              </div>
              <div class="form-td">
                <!-- <custom-select
                  id="acc034"
                  collect="acc034"
                  v-model="formData.acc034"
                  required
                  @input="binddata('acc034', formData.acc034)"
                  placeholder="请选择期望薪资"
                  ref="acc034"
                >
                </custom-select> -->
                <uni-easyinput
                  v-model="formData.acb21h"
                  type="number"
                  class="form-input"
                  placeholder="请填写期望薪资下限"
                  placeholderStyle="color:rgba(0,0,0,.25)"
                />
              </div>
              <div class="form-td">
                <uni-easyinput
                  v-model="formData.acb21j"
                  type="number"
                  class="form-input"
                  placeholder="请填写期望薪资上限"
                  placeholderStyle="color:rgba(0,0,0,.25)"
                />
              </div>
              <div class="form-td">
                <custom-select
                  id="acb469"
                  collect="acb469"
                  v-model="formData.acb469"
                  required
                  @input="binddata('acb469', formData.acb469)"
                  placeholder="请选择工作方式"
                  ref="acb469"
                >
                </custom-select>
              </div>
              <div class="form-td">
                <modal-address
                  ref="addressAab301"
                  areaid="aab301"
                  :areaCode="formData.aab301"
                  v-model="formData.acb202"
                  @setAreaValue="getAreaValue"
                  placeholder="请选择工作地点"
                ></modal-address>
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
  name: 'jobIntention',
  props: {
    // 数据
    jobIntent: {
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
      workTypeTree: [], //意愿岗位树状数据
      jobIntentInfo: [],
      formData: {
        aca111: '',
        acc034: '',
        acb469: '',
        aab301: '',
        acb202: '',
        acb21h: '',
        acb21j: '',
      },
      isAdd: false,
      isEdit: false,
    }
  },
  watch: {
    jobIntent: {
      handler(newVal, oldVal) {
        this.jobIntentInfo = newVal
        if (this.jobIntentInfo.length >= 3) {
          this.isAdd = false
        }
      },
      deep: true,
      immediate: true,
    },
  },
  mounted() {
    this.init()
  },
  methods: {
    async init() {
      this.workTypeTree = await this.$utils.getWorkTypeTree()
      console.log(this.workTypeTree, 'workTypeTree')

      this.jobIntentInfo = this.jobIntentInfo.map((item) => {
        if (item.acb241) {
          item.acb241 = parseInt(item.acb241)
        }

        if (item.acb242) {
          item.acb242 = parseInt(item.acb242)
        }
        return item
      })
    },
    // 行业选择结果
    getModalValue(value) {
      this.formData.aca111 = value.aca111
      this.formData.aca112 = value.aca112
    },
    // 地区选择结果
    getAreaValue(value) {
      this.formData.aab301 = value.areaCode
      this.formData.acb202 = value.areaname
    },
    binddata(value1, value2) {},
    cancelOn() {
      this.isAdd = false
      this.isEdit = false
      this.formData = {}
    },
    saveInfo() {
      let param = {
        acc200: this.acc200,
        aac001: this.userInfo.aac001,
        ...this.formData,
        method: 'jy202_hrm133',
      }
      if (this.isEdit) {
        // 编辑
        param.acc210 = this.formData.acc210
      }
      if (!param.aca111 || !param.acb469 || !param.aab301 || !param.acb202 || !param.acb21h || !param.acb21j) {
        this.$utils.showToast('请完整填写求职意向')
        return
      }
      if (Number(param.acb21h) > Number(param.acb21j)) {
        this.$utils.showToast('薪资上限不能小于薪资下限')
        return
      }
      //return
      this.$utils.request('/api/business/invoke', param, true, true, 'cipher').then((res) => {
        this.$emit('refresh')
        if (this.isEdit) {
          this.$utils.showToast('编辑成功')
        } else {
          this.$utils.showToast('保存成功')
        }
        this.formData = {
          aca111: '',
          acc034: '',
          acb469: '',
          aab301: '',
          acb202: '',
          acb21h: '',
          acb21j: '',
        }
        const { acb202, aca112, acc034, acb469, acb21h, acb21j } = this.formData
        const newObj = { acb202: acb202, aca112, acc034, acb469, acb21h, acb21j }
        this.jobIntentInfo.push(newObj)
        if (this.jobIntentInfo.length >= 3) {
          this.isAdd = false
        }
      })
    },
    fnAdd() {
      if (this.jobIntentInfo.length < 3) {
        this.isAdd = true
        this.isEdit = false
      } else {
        this.$utils.showToast('最多三条求职意向，请先删除不需要的')
      }
    },
    // 删除
    fnDel(item) {
      this.$emit('delCcList', '4', item.acc210)
    },
    // 编辑
    fbEdit(item) {
      this.isEdit = true
      this.$nextTick(() => {
        this.formData = { ...item }
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

.group-add {
  width: 300px;
  margin: 0 auto;
}
.text-error {
  margin-right: 20px;
  &:last-child {
    margin-right: 0px;
  }
}
</style>
