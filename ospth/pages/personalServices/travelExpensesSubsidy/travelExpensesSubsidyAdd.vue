<template>
  <view class="service-page" id="contrainer">
    <StepContainer v-model="headerIndex">
      <template #default="{ current }">
        <view class="uform" v-show="current === 0">
          <DynamicForm ref="dynamicForm" :schema="schema" v-model="formData" :events="formEvents"></DynamicForm>
          <view class="title-line-blue">
            <view class="title">已录入信息</view>
          </view>
          <RecordCardList
            :data="tableData"
            :schema="recordSchema"
            :actions="recordActions"
            @action="handleRecordAction"
          />
          <ActionBar
            :items="[{ key: 'fill', type: 'success', text: '转移信息录入' }]"
            :disabled-keys="disabledActionKeys"
            @action="handleAction"
          />

          <view class="btn-box">
            <u-button type="primary" @click="handleNext" style="width: 100%">下一步</u-button>
          </view>
        </view>

        <view v-show="current === 1">
          <service-upload ref="materialUploadTable" :yda020="yda020" :yda031="intripallowanceid" />
          <view class="btn-box">
            <u-button @click="--headerIndex" style="width: 45%">上一步</u-button>
            <u-button type="primary" @click="handleConfirm" style="width: 45%">确认提交</u-button>
          </view>
        </view>

        <view v-show="current === 2">
          <service-complete />
        </view>
      </template>
    </StepContainer>
  </view>
</template>

<script>
import StepContainer from '@/components/common/StepContainer.vue'
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
    StepContainer,
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
      recordActions: [
        {
          key: 'delete',
          text: '删除',
          type: 'secondary',
          disabledWhen: (record) => false,
        },
      ],
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

    uni.$on('transferInfoEntry_info', this.handleBackData)
  },
  onUnload() {
    // 记得移除监听
    uni.$off('transferInfoEntry_info', this.handleBackData)
  },
  onReady() {
    this.$nextTick(() => {
      this.setHeight()
      // this.$refs.dynamicForm.setFieldValue({ year: '2025' })
      // this.$refs.dynamicForm.setFieldValue({ aae017: '5401020000' })
      // this.$refs.dynamicForm.disableField(['yac002', 'year'])
    })
    if (this.params.type === 'edit') {
      this.initEditInfo()
    } else {
      this.initAddInfo()
    }
  },
  onShow() {
    this.$nextTick(() => {
      this.setHeight()
    })
  },
  watch: {
    headerIndex: {
      handler: function (newVal, oldVal) {
        console.log('newVal, oldVal: ', newVal, oldVal)
        this.$nextTick(() => {
          this.setHeight()
        })
      },
    },
  },
  methods: {
    setHeight() {
      try {
        const query = uni.createSelectorQuery().in(this)
        query
          .select('#contrainer')
          .boundingClientRect((data) => {
            if (data) {
              this.componentHeight = data.height
              if (typeof terminalUtil !== 'undefined' && terminalUtil._setIframeHeight) {
                terminalUtil._setIframeHeight(data.height)
              }
            }
          })
          .exec()
      } catch (error) {
        console.error('设置高度异常:', error)
      }
    },
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
    async handleAction({ key }) {
      // console.log('handleAction key: ', key)
      if (key === 'fill') {
        const res = await this.getHistoryDate()
        if (!res) return
        const { last_end_date, last_start_date } = res
        this.$refs.dynamicForm
          .validate()
          .then((res) => {
            if (res) {
              if (this.formData.aae017.slice(4, 6) === '00') {
                this.$message.error('工作地请至少选择到区县')
                return
              }
              const info = {
                year: this.formData.year,
                aae017: this.formData.aae017,
                tableData: this.tableData,
                last_end_date,
                last_start_date,
              }
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
    getHistoryDate() {
      const year = this.formData.year
      const param = {
        no: '420-0017',
        data: JSON.stringify({
          year,
          aae017: this.formData.aae017,
          yac002: this.userInfo.certNo,
        }),
      }
      return new Promise((resolve, reject) => {
        this.$base.post('', param, (res) => {
          if (res.serviceSuccess) {
            if (res.data.code === '0') {
              this.$message.error(res.data.msg)
            } else {
              const { last_end_date, last_start_date } = res.data
              resolve({ last_end_date, last_start_date })
            }
          } else {
            reject(false)
            this.$message.error(res.msg || '获取信息失败!')
          }
        })
      })
    },
    handleRecordAction({ key, record }) {
      // console.log('handleRecordAction key, record: ', key, record)
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
          if (!res) return
          if (this.tableData.length === 0) {
            this.$message.error('请录入信息')
            return
          }
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
          operatetype: 'edit',
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
          this.$message.error(res.msg || '获取编辑信息失败')
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
