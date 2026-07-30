<template>
  <view class="service-page" id="contrainer">
    <StepContainer v-model="headerIndex">
      <template #default="{ current }">
        <view class="uform" v-show="current === 0">
          <DynamicForm
            ref="dynamicForm"
            :schema="schema"
            v-model="formData"
            :events="formEvents"
            :optionsMap="optionsMap"
          ></DynamicForm>
          <view class="btn-box">
            <u-button type="primary" @click="handleNext" style="width: 100%">下一步</u-button>
          </view>
        </view>

        <view v-show="current === 1">
          <view class="title-line-blue" v-if="fileShow1">
            <view class="title">补助申报材料</view>
          </view>
          <service-upload ref="materialUploadTable" v-if="fileShow1" :yda020="yda020" yda031="" />
          <view class="title-line-blue" v-if="fileShow2">
            <view class="title">被吸纳人员材料</view>
          </view>
          <service-upload ref="materialUploadTable2" v-if="fileShow2" :yda020="yda020_2" yda031_2="" />
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
  },
  data() {
    return {
      intripallowanceid: '',
      headerIndex: 0,
      yda020: '496',
      yda020_2: '497',
      disabledActionKeys: [],
      schema,
      recordSchema,
      formData: {},
      optionsMap: {
        ady019List: [],
      },
      formEvents: {
        adc635Change: this.adc635Change,
      },
      tableData: [],

      fileShow1: false,
      fileShow2: false,
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
  onUnload() {
    // 记得移除监听
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
    handleNext() {
      this.$refs.dynamicForm
        .validate()
        .then((res) => {
          // if (!res) return

          this.headerIndex++
        })
        .catch((err) => {
          console.log('表单验证失败: ', err)
        })
    },
    // 获取申请资格与表单信息
    initAddInfo() {
      const param = {
        no: '325-0006',
        data: JSON.stringify({
          yac002: this.userInfo.certNo,
          aac001: this.userInfo.ext03,
          type: '1',
        }),
      }
      this.$base.post('', param, (res) => {
        if (res.serviceSuccess) {
          if (res.data.code === '0') {
            this.$message.warning(res.data.msg)
          } else {
            const { ady019List, map } = res.data
            this.optionsMap.ady019List = ady019List.map((item) => {
              return {
                value: item.id,
                label: item.name,
              }
            })
            this.$refs.dynamicForm.setFieldValue(map)
          }
        } else {
          this.$message.error(res.msg || '获取信息失败')
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
    adc635Change(value) {
      if (value === '01') {
        this.fileShow1 = true
        this.fileShow2 = false
        this.getStudentInfo(value)
        this.$refs.dynamicForm.setFieldValue({ bar: '' })
      }
      if (value === '02') {
        this.fileShow2 = true
        this.fileShow1 = true
        this.getStudentInfo(value)
        this.$refs.dynamicForm.setFieldValue({ bar: 'showLS' })
      }
      if (value === '03') {
        this.fileShow1 = true
        this.fileShow2 = false
        this.getStudentInfo(value)
        this.$refs.dynamicForm.setFieldValue({ bar: '' })
      }
    },
    //获取毕业生信息
    getStudentInfo(adc635) {
      const param = {
        no: '325-0007',
        data: JSON.stringify({
          yac002: this.userInfo.certNo,
          aac001: this.userInfo.ext03,
          adc635,
        }),
      }
      this.$base.post('', param, (res) => {
        if (res.serviceSuccess) {
          if (res.data.code === '0') {
            this.$message.error(res.data.msg)
          } else {
            const { dy41Info } = res.data
            console.log('dy41Info: ', dy41Info)

            this.$nextTick(() => {
              if (adc635 === '01') {
                this.ady019Disabled = true
                this.yau002Disabled = true
                this.aac181Disabled = true
                console.log(this.optionsMap.ady019List)

                this.$refs.dynamicForm.setFieldValue({
                  ...dy41Info,
                })
                if (dy41Info.aac181 && moment(dy41Info.aac181).isBefore(moment('2020-01-01'))) {
                  this.$message.warning('创业者毕业时间需在2020-01-01之后（包括2020-01-01）')
                }
              }
              if (adc635 === '02') {
                this.ady019Disabled = true
                this.yau002Disabled = true
                this.aac181Disabled = true
                this.$refs.dynamicForm.setFieldValue({
                  ...dy41Info,
                  ady019: dy41Info.ady019_s,
                })
                if (dy41Info.aac181 && moment(dy41Info.aac181).isBefore(moment('2020-01-01'))) {
                  this.$message.warning('创业者毕业时间需在2020-01-01之后（包括2020-01-01）')
                }
              }
              if (adc635 === '03') {
                this.ady019Disabled = false
                this.yau002Disabled = false
                this.aac181Disabled = false
                this.$refs.dynamicForm.setFieldValue({
                  aac181: '',
                  ady019: '',
                  yau002: '',
                })
              }
            })
          }
        } else {
          this.$message.error(res.msg || '获取信息失败')
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
