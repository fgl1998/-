<template>
  <view class="service-page" id="contrainer">
    <view class="uform">
      <DynamicForm ref="dynamicForm" :schema="schema2" v-model="formData" :events="formEvents">
        <template #miniSearchSelect="{ form }">
          <view class="area-wrapper" @click="openSearchSelect(form)">
            <u-input
              :value="form.aab004 || ''"
              placeholder="请选择就业单位名称"
              readonly
              input-align="right"
              @click="openSearchSelect(form)"
            />
          </view>
        </template>
        <template #miniAddress="{ form }">
          <view class="area-wrapper" @click="openAddress(form)">
            <u-input
              :value="form.ycc299_desc || ''"
              placeholder="请选择工作地行政区划"
              readonly
              input-align="right"
              @click="openAddress(form)"
            />
          </view>
        </template>
      </DynamicForm>
      <view class="btn-box">
        <u-button type="primary" @click="handleSaveInfo" style="width: 100%">确认</u-button>
      </view>
    </view>
    <miniAddress ref="miniAddress" @addressBack="handleComfirmAddress" />
    <miniSearchSelect
      ref="miniSearchSelect"
      @confirm="handleComfirmMiniSearchSelect"
      :api="handleSearchApi"
      labelKey="aab004"
    />
  </view>
</template>

<script>
import DynamicForm from '@/components/common/DynamicForm.vue'
import miniAddress from '@/components/mini-address/mini-address.vue'
import miniSearchSelect from '@/components/mini-search-select/mini-search-select.vue'

import moment from 'moment'
import { schema2 } from './js/form.schema.js'

export default {
  name: 'UnemploymentRegistrationAdd',
  components: {
    DynamicForm,
    miniAddress,
    miniSearchSelect,
  },
  data() {
    return {
      schema2,
      headerIndex: 0,
      formData: {},
      formEvents: {
        start_dateChange: this.start_dateChange,
        end_dateChange: this.end_dateChange,
      },

      last_end_date: '',
      last_start_date: '',
      tableData: [],
    }
  },
  onLoad(options) {
    const params = JSON.parse(options.params)
    this.params = params
    this.tableData = this.params.tableData
    this.last_end_date = this.params.last_end_date
    this.last_start_date = this.params.last_start_date

    const userInfo = this.$base.getUser(true, true)
    if (userInfo && userInfo.naturalBo) {
      this.userInfo = userInfo.naturalBo
    } else {
      this.userInfo = {}
    }
  },
  onReady() {
    this.$nextTick(() => {
      // this.setHeight()
      // this.init()
      // this.$refs.dynamicForm.setFieldValue({ aae017: '5401020000', year: '2025' })
      // this.$refs.dynamicForm.disableField(['yac002', 'year'])
      this.$refs.dynamicForm.setFieldValue({ year: this.params.year })
    })
  },
  onShow() {
    this.$nextTick(() => {
      // this.setHeight()
    })
  },
  watch: {
    // headerIndex: {
    //   handler: function (newVal, oldVal) {
    //     console.log('newVal, oldVal: ', newVal, oldVal)
    //     this.$nextTick(() => {
    //       this.setHeight()
    //     })
    //   },
    // },
  },
  methods: {
    handleConfirm() {},
    openAddress() {
      this.$refs.miniAddress.handleShow()
    },
    handleComfirmAddress(data) {
      const { areaname, areaid } = data
      this.$refs.dynamicForm.setFieldValue({
        ycc299: areaid,
        ycc299_desc: areaname,
      })
    },

    openSearchSelect() {
      this.$refs.miniSearchSelect.open()
    },
    handleComfirmMiniSearchSelect(data) {
      const { aab004, aab998 } = data
      this.$refs.dynamicForm.setFieldValue({
        aab004: aab004,
        aab998,
      })
    },
    //搜索方法，返回promise
    handleSearchApi(value) {
      return new Promise((resolve, reject) => {
        const param = {
          no: '000-0019',
          data: JSON.stringify({
            aab004: value,
          }),
        }
        this.$base.post('', param, (res) => {
          if (res.serviceSuccess) {
            if (res.data.code === '0') {
              this.$message.warning(res.data.msg)
              reject()
            } else {
              resolve(res.data.aab004List)
            }
          } else {
            this.$message.error(res.msg || '获取信息失败!')
            reject()
          }
        })
      })
    },
    start_dateChange(start_date) {
      // console.log(start_date, 'start_date')

      // console.log(this.last_end_date, this.last_start_date)
      this.$refs.dynamicForm.setFieldValue({ end_date: '' })

      const { isCross, end_date } = this.isCrossYear(start_date)
      if (this.last_end_date) {
        if (moment(this.last_end_date).isAfter(moment(start_date))) {
          this.$message.error('开始日期不能小于上次结束日期')
          this.$nextTick(() => {
            this.form2.setFieldsValue({
              start_date: '',
              end_date: '',
              aac009_c: '',
            })
          })
          return
        }
      }

      const obj = this.formData

      if (start_date && obj.end_date) {
        if (moment(start_date).isAfter(moment(obj.end_date))) {
          this.$message.error('开始日期不能大于结束日期')
          this.$nextTick(() => {
            this.$refs.dynamicForm.setFieldValue({
              start_date: '',
              end_date: '',
              aac009_c: '',
            })
          })
          return
        }
      }

      if (isCross) {
        this.$refs.dynamicForm.setFieldValue({
          end_date,
          aac009_c: 180,
        })
      } else {
        let days = moment(obj.end_date).diff(moment(start_date), 'days') + 1
        if (!obj.end_date || !start_date) {
          days = 0
        }
        this.$refs.dynamicForm.setFieldValue({
          aac009_c: days,
        })
      }
      this.$nextTick(() => {
        const res = this.isRepeat()
        if (res) {
          this.$message.error('日期不能与已添加表格中的时间重合')
          this.$nextTick(() => {
            this.$refs.dynamicForm.setFieldValue({
              start_date: '',
              end_date: '',
              aac009_c: '',
            })
          })
        }
      })
    },
    end_dateChange(end_date) {
      console.log(end_date, 'end_date')

      const obj = this.formData
      console.log(obj, 'start_date')

      if (obj.start_date && end_date) {
        if (moment(obj.start_date).isAfter(moment(end_date))) {
          this.$message.error('开始日期不能大于结束日期')
          this.$nextTick(() => {
            this.$refs.dynamicForm.setFieldValue({
              start_date: '',
              end_date: '',
              aac009_c: '',
            })
          })
          return
        }
      }
      if (this.last_start_date) {
        if (moment(this.last_start_date).isBefore(moment(end_date))) {
          this.$message.error('结束日期不能大于上次开始日期')
          this.$nextTick(() => {
            this.$refs.dynamicForm.setFieldValue({
              start_date: '',
              end_date: '',
              aac009_c: '',
            })
          })
          return
        }
      }
      let days = moment(end_date).diff(moment(obj.start_date), 'days') + 1
      if (!obj.start_date || !end_date) {
        days = 0
      }
      this.$refs.dynamicForm.setFieldValue({
        aac009_c: days,
      })
      this.$nextTick(() => {
        const res = this.isRepeat()
        if (res) {
          this.$message.warning('日期不能与已添加表格中的时间重合')
          this.$nextTick(() => {
            this.$refs.dynamicForm.setFieldValue({
              start_date: '',
              end_date: '',
              aac009_c: '',
            })
          })
        }
      })
    },
    //是否跨年
    isCrossYear(val) {
      const date = new Date(val)
      date.setDate(date.getDate() + 180)
      const end_date = date.toISOString().split('T')[0]
      const start_year = val.split('-')[0]
      const end_year = end_date.split('-')[0]
      return {
        isCross: start_year !== end_year,
        end_date,
      }
    },
    //判断是否与已添加表格中的时间重合
    isRepeat() {
      let res = false
      console.log(this.tableData, 'tableData')

      if (this.tableData.length === 0) return
      const { start_date, end_date } = this.formData
      if (end_date && start_date) {
        res = this.tableData.some((item) => {
          return this.isOverlap(start_date, end_date, item.start_date, item.end_date)
        })
      }
      if (start_date && end_date) {
        res = this.tableData.some((item) => {
          return this.isOverlap(start_date, end_date, item.start_date, item.end_date)
        })
      }
      return res
    },
    isOverlap(t1, t2, t3, t4) {
      // 创建moment对象
      const start1 = moment(t1)
      const end1 = moment(t2)
      const start2 = moment(t3)
      const end2 = moment(t4)
      // 判断是否有重叠：核心逻辑
      console.log(t1, t2, t3, t4, 't')

      console.log(start1.isBefore(end2) && end1.isAfter(start2), 'res')

      return start1.isBefore(end2) && end1.isAfter(start2)
    },
    //录入
    handleSaveInfo() {
      this.$refs.dynamicForm
        .validate()
        .then((res) => {
          if (!res) return
          const areaCode = this.formData.ycc299

          let obj = this.formData
          obj.aae017_g = areaCode

          // obj.aae017_g = this.ycc299Codes[this.ycc299Codes.length - 1]
          const sf1 = areaCode.slice(0, 2) //省份
          const ds1 = areaCode.slice(0, 4) //地市
          const qx1 = areaCode.slice(0, 6) //区县
          const sf2 = this.params.aae017.slice(0, 2)
          const ds2 = this.params.aae017.slice(0, 4)
          const qx2 = this.params.aae017.slice(0, 6)

          if (areaCode.slice(4, 6) === '00') {
            this.$message.warning('工作地请至少选择到区县')
            return
          }
          if ((sf1 !== sf2 || ds1 !== ds2 || qx1 === qx2) && obj.type === '1') {
            this.$message.warning('工作地选择不符合跨地市转移方式，请重新选择！')
            return
          }
          if ((sf1 !== sf2 || ds1 === ds2) && obj.type === '2') {
            this.$message.warning('工作地选择不符合跨地市转移方式，请重新选择!')
            return
          }
          if (sf1 === sf2 && obj.type === '3') {
            this.$message.warning('工作地选择不符合跨省转移方式，请重新选择！')
            return
          }

          obj.id = moment().format('YYYYMMDDHHmmssSSS')

          this.tableData.push(obj)
          this.$message.success('录入成功')
          const info = {
            tableData: this.tableData,
          }
          uni.$emit('transferInfoEntry_info', info)
          uni.navigateBack({
            delta: 1,
          })
          // this.setAac009()
          // this.setAac008()
        })
        .catch((err) => {
          console.log('表单验证失败: ', err)
        })
    },
  },
}
</script>

<style lang="scss" scoped>
@import url('../../../static/css/sass/form.scss');
.area-wrapper {
  flex: 1; /* ⭐ 撑满右侧区域 */
}
.service-page {
  background-color: #ffffff;
  padding: 0 32rpx;
}
::v-deep .resumePicker {
  display: none !important;
}
</style>
