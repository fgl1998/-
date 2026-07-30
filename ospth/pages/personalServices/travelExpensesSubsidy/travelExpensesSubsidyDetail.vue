<template>
  <view class="service-page" id="contrainer">
    <view class="uform">
      <DynamicForm ref="dynamicForm" :schema="schema" v-model="formData" :events="formEvents"></DynamicForm>
      <view class="title-line-blue">
        <view class="title">已录入信息</view>
      </view>
      <RecordCardList :data="tableData" :schema="recordSchema"
    /></view>
    <view class="title-line-blue">
      <view class="title">补助申报材料</view>
    </view>
    <service-upload ref="materialUploadTable" :yda020="yda020" :yda031="intripallowanceid" :visit="true" />
  </view>
</template>

<script>
import DynamicForm from '@/components/common/DynamicForm.vue'
import ActionBar from '@/components/common/ActionBar.vue'
import RecordCardList from '@/components/common/RecordCardList.vue'
import aae017SelectTree from '@/components/aae017SelectTree/aae017SelectTree.vue'

import { schema } from './js/form.schema.js'
import { recordSchema } from './js/record.schema.js'
import moment from 'moment'

export default {
  name: 'UnemploymentRegistrationAdd',
  components: {
    aae017SelectTree,
    DynamicForm,
    ActionBar,
    RecordCardList,
  },
  data() {
    return {
      intripallowanceid: '',
      headerIndex: 0,
      yda020: '425',
      disabledActionKeys: [],
      schema,
      recordSchema,
      formData: {},
      formEvents: {
        yearChange: this.yearChange,
      },
      tableData: [],
    }
  },
  onLoad(options) {
    const params = JSON.parse(options.params)
    this.params = params
    this.intripallowanceid = params.intripallowanceid || ''

    const userInfo = this.$base.getUser(true, true)
    if (userInfo && userInfo.naturalBo) {
      this.userInfo = userInfo.naturalBo
    } else {
      this.userInfo = {}
    }
  },
  onUnload() {},
  onReady() {
    this.$nextTick(() => {
      // this.setHeight()
      // this.init()
      // this.$refs.dynamicForm.setFieldValue({ year: '2025' })
      // this.$refs.dynamicForm.setFieldValue({ aae017: '5401020000' })
      // this.$refs.dynamicForm.disableField(['yac002', 'year'])
      this.$refs.dynamicForm.disable()
    })
    if (this.params.type === 'edit') {
      this.initEditInfo()
    } else {
      this.initAddInfo()
    }
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
    handleBackData(info) {
      this.tableData = info.tableData
      this.setAac008()
      this.setAac009()
    },
    fnAac009Change(aac009) {
      if (Number(aac009) >= 180) {
        var gridData = this.tableData
        var a = 0,
          b = 0,
          c = 0
        gridData.forEach((data) => {
          switch (Number(data.type)) {
            case 1:
              a = Number(a) + Number(data.aac009_c)
              break
            case 2:
              b = Number(b) + Number(data.aac009_c)
              break
            case 3:
              c = Number(c) + Number(data.aac009_c)
              break
            default:
              break
          }
        })
        if (Number(c) >= 180) {
          this.$refs.dynamicForm.setFieldValue({ money: 2000 })
        } else if (Number(b) >= 180) {
          this.$refs.dynamicForm.setFieldValue({ money: 1000 })
        } else {
          this.$refs.dynamicForm.setFieldValue({ money: 500 })
        }
      } else {
        this.$refs.dynamicForm.setFieldValue({ money: 0 })
      }
    },
    //设置年度内转移就业累计天数aac009
    setAac009() {
      if (this.tableData.length === 0) return
      const aac009 = this.tableData.reduce((acc, cur) => {
        return acc + cur.aac009_c
      }, 0)
      this.$refs.dynamicForm.setFieldValue({ aac009 })
      this.fnAac009Change(aac009)
    },
    //设置年度内首次转移就业开始时间aac008
    setAac008() {
      if (this.tableData.length === 0) {
        this.$refs.dynamicForm.setFieldValue({ aac008: '' })
        return
      }
      const allDates = this.tableData.flatMap((obj) => [obj.start_date, obj.end_date])
      const momentDates = allDates.map((dateStr) => moment(dateStr))
      const aac008 = moment.min(momentDates)
      this.$refs.dynamicForm.setFieldValue({ aac008: aac008.format('YYYY-MM-DD') })
    },
    openArea() {
      this.$refs.aae017SelectTree.handleShowPopup()
    },
    handleConfirm() {
      const fileList = this.$refs.materialUploadTable.check() || []
      if (fileList[0].files.length === 0) {
        this.$message.error('请上传必要的材料')
        return
      }
      const gridData = this.tableData
      if (gridData.length === 0) {
        this.$message.error('请录入信息')
        return
      }
      const param = {
        no: '420-0018',
        data: JSON.stringify({
          aac001: this.userInfo.ext03,
          yac002: this.userInfo.certNo,
          fileList: JSON.stringify(fileList),
          gridData: JSON.stringify(gridData),
          ...this.formData,
          intripallowanceid: this.intripallowanceid,
        }),
      }
      this.$base.post('', param, (res) => {
        if (res.serviceSuccess) {
          if (res.data.code === '0') {
            this.$message.error(res.data.msg)
          } else {
            this.headerIndex++
          }
        } else {
          this.$message.error(res.msg || '操作失败!')
        }
      })
    },
    handleAction({ key }) {
      console.log('handleAction key: ', key)
      if (key === 'fill') {
        this.$refs.dynamicForm
          .validate()
          .then((res) => {
            if (res) {
              console.log(this.formData)
              const info = {
                year: this.formData.year,
                aae017: this.formData.aae017,
                tableData: this.tableData,
              }
              console.log(info, '111')

              uni.navigateTo({
                url: `/pages/personalServices/travelExpensesSubsidy/transferInfoEntry?params=${encodeURIComponent(
                  JSON.stringify(info)
                )}`,
              })
            }
          })
          .catch((err) => {
            console.log('表单验证失败: ', err)
          })
      }
    },
    handleRecordAction({ key, record }) {
      console.log('handleRecordAction key, record: ', key, record)
      if (key === 'delete') {
        this.tableData = this.tableData.filter((item) => item.id !== record.id)
        this.$message.success('删除信息成功')
        this.setAac009()
        this.setAac008()
      }
    },
    handleNext() {
      this.$refs.dynamicForm
        .validate()
        .then((res) => {
          console.log(res, this.formData)
          if (!res) return
          this.headerIndex++
        })
        .catch((err) => {
          console.log('表单验证失败: ', err)
        })
    },
    // 获取申请资格与表单信息
    initAddInfo() {
      const param = {
        no: '420-0014',
        data: JSON.stringify({
          yac002: this.userInfo.certNo,
        }),
      }
      this.$base.post('', param, (res) => {
        if (res.serviceSuccess) {
          if (res.data.code === '0') {
            this.$message.warning(res.data.msg)
          } else {
            this.$refs.dynamicForm.setFieldValue(res.data.info)
          }
        } else {
          this.$message.error(res.msg || '获取申请资格信息失败')
        }
      })
    },
    initEditInfo() {
      const param = {
        no: '420-0016',
        data: JSON.stringify({
          intripallowanceid: this.intripallowanceid,
          operatetype: 'view',
        }),
      }
      this.$base.post('', param, (res) => {
        if (res.serviceSuccess) {
          if (res.data.code === '0') {
            this.$message.warning(res.data.msg)
          } else {
            this.$nextTick(() => {
              this.tableData = res.data.data.gridDataList
              this.tableData.forEach((item, index) => {
                item.ycc299 = item.aae017_g_desc
                item.id = index
              })
              this.$refs.dynamicForm.setFieldValue(res.data.data)
            })
          }
        } else {
          this.$message.error(res.msg || '获取详情信息失败')
        }
      })
    },
    yearChange(val) {
      const param = {
        no: '420-0015',
        data: JSON.stringify({
          year: val,
          aac001: this.userInfo.ext03,
          yac002: this.userInfo.certNo,
        }),
      }

      this.$base.post('', param, (res) => {
        if (res.serviceSuccess) {
          if (res.data.code === '0') {
            this.$message.error(res.data.msg)
            this.$refs.dynamicForm.setFieldValue({ year: '' })
          }
        } else {
          this.$message.error(res.msg || '获取信息失败!')
          this.$refs.dynamicForm.setFieldValue({ year: '' })
        }
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
</style>
