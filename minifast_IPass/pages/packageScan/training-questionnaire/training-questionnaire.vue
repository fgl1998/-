<template>
  <view class="training-questionnaire">
    <div v-if="trainingData.ht333 === '1'">
      <div class="top">
        <ComponentPanel title="培训调研问卷">
          <div class="text">
            首先感谢您参加本次培训，为使将来举办的培训能更符合您的要求，希望您对此次培训提出宝贵意见，感谢您的配合!
          </div>
          <div class="notice">提交问卷后系统将自动为您签到！！！</div>
        </ComponentPanel>
      </div>

      <div class="middle">
        <ComponentPanel :title="trainingData.ht331">
          <div class="date">
            <div class="title">培训时间</div>
            <div class="content">
              <span style="margin-right: 30rpx">{{ trainingData.ht334 }}</span>
              <span>{{ trainingData.ht335 }}</span>
            </div>
          </div>
          <div class="card">
            <div class="title">
              1.
              <span class="text">您的姓名</span>
            </div>
            <div class="content">
              <ComponentInput
                v-model="userData.aac003"
                placeholder="请输入您的姓名"
                :value="userData.aac003"></ComponentInput>
            </div>
          </div>
          <div class="card-radio">
            <div class="title">
              2.
              <span class="text">您的工作单位</span>
            </div>
            <div class="content">
              <ComponentDeclareRadio
                aglin="left"
                type="radio"
                :range="workUnitRange"
                idName="workUnit"
                @change="handleRadioChange"></ComponentDeclareRadio>
            </div>
          </div>
          <div class="card">
            <div class="title">
              3.
              <span class="text">您的工作地点</span>
            </div>
            <div class="content content-depart">
              <ComponentPicker
                idName="address"
                type="address"
                placeholder="请选择工作地点"
                @change="handleChangePicker">
              </ComponentPicker>
            </div>
          </div>
          <div class="card">
            <div class="title">
              4.
              <span class="text">您的主管单位</span>
            </div>
            <div class="content content-depart">
              <ComponentPicker
                idName="unit"
                placeholder="请选择主管部门"
                :range="unitRange"
                rangeKey="name"
                valueKey="id"
                v-model="unit"
                @change="handleChangePicker"></ComponentPicker>
            </div>
          </div>
          <div v-if="renderData.length > 0">
            <div class="card-radio" v-for="(item, index) in renderData" :key="item.ht340">
              <div class="title">
                {{ index + 5 }}.
                <span class="text">{{ item.ht342 }}</span>
              </div>
              <div class="content" v-if="item.ht343 === '1' || item.ht343 === '4'">
                <ComponentDeclareRadio
                  aglin="left"
                  type="radio"
                  :range="getAssessRange(item.ht345)"
                  :idName="item.ht340"
                  @change="handleRadioChange"></ComponentDeclareRadio>
              </div>
              <div class="content" v-if="item.ht343 === '2'">
                <ComponentDeclareRadio
                  aglin="left"
                  type="checkbox"
                  :range="getAssessRange(item.ht345)"
                  :idName="item.ht340"
                  @change="handleRadioChange">
                </ComponentDeclareRadio>
              </div>
              <div class="content content-depart" v-if="item.ht343 === '3'">
                <ComponentPicker
                  :idName="item.ht340"
                  placeholder="请选择"
                  :range="getAssessRange(item.ht345)"
                  rangeKey="aaa103"
                  valueKey="aaa102"
                  v-model="unit"
                  @change="handleChangePicker">
                </ComponentPicker>
              </div>
              <div class="content textarea" v-if="item.ht343 === '0'">
                <textarea auto-height placeholder="请输入" @input="handleTextareaChange($event, item.ht340)"></textarea>
              </div>
            </div>
          </div>
        </ComponentPanel>
      </div>
      <div class="button-wrapper">
        <ComponentButton name="提交" type="primary" borderRadius="12rpx" height="80rpx" @click="handleSubmit">
        </ComponentButton>
      </div>
    </div>
  </view>
</template>

<script>
  import ComponentButton from '@/components/common/ez-button/ez-button.vue'
  import ComponentPanel from '@/components/common/ez-panel/ez-panel.vue'
  import ComponentInput from '@/components/common/ez-input/ez-input.vue'
  import ComponentDeclareRadio from '@/components/project/ez-declare-radio/ez-declare-radio.vue'
  import ComponentPicker from '@/components/project/ez-picker/ez-picker.vue'

  import { mapGetters } from 'vuex'
  import { USER_INFO, USER_LIST } from '@/store/constants'
  import { showModal, navigateBack, showToast } from '@/utils/uni-api'
  import { requestB145, requestB140, requestFFGetChi037List } from '@/service/api'

  export default {
    name: 'pageEpidemicPreventionRegistration',
    data() {
      return {
        trainingData: {
          ht330: '',
          ht333: '',
          ht331: '',
          ht334: '',
          ht335: ''
        },
        renderData: [],
        userData: {
          aac003: '',
          ht330: ''
        },
        unit: '',
        formData: {},
        workUnitRange: [
          {
            aaa102: '0',
            aaa103: '村（社区）委员会'
          },
          {
            aaa102: '1',
            aaa103: '乡镇（街道）办事处'
          },
          {
            aaa102: '2',
            aaa103: '区县业务局'
          },
          {
            aaa102: '3',
            aaa103: '市级业务主管部门'
          }
        ],
        assessRange: [],
        unitRange: []
      }
    },
    components: {
      ComponentButton,
      ComponentPanel,
      ComponentInput,
      ComponentDeclareRadio,
      ComponentPicker
    },
    // 监听页面加载，其参数为上个页面传递的数据，参数类型为Object（用于页面传参）
    onLoad(e) {
      const { ht330, ht333, ht331, ht334, ht335 } = e
      this.trainingData.ht333 = ht333
      this.trainingData.ht330 = ht330
      this.trainingData.ht331 = ht331
      this.trainingData.ht334 = ht334
      this.trainingData.ht335 = ht335
      this.userData.ht330 = ht330
      this.getQuestionnaire(ht330, ht333)
      this.getUnitRange()
    },
    // 监听页面初次渲染完成
    onReady() {},
    // 监听页面显示
    onShow() {},
    // 监听页面隐藏
    onHide() {},
    methods: {
      getUserData() {
        const { aab301, cpb10d, che015 } = this.userList
        this.userData = {
          ...this.userData,
          aac002: cpb10d,
          aab301,
          che015
        }
      },
      // 获取问卷信息
      getQuestionnaire(ht330, ht333) {
        console.log(ht330, ht333)
        if (ht333 === '1') {
          requestB145(ht330)
            .then((res) => {
              this.renderData = res.lists.ht34List.list || []
            })
            .catch((err) => {
              showModal(err)
            })
        }
        if (ht333 === '0') {
          showModal('签到未开始!')
          navigateBack(99)
        }
        if (ht333 === '2') {
          showModal('签到已结束!')
          navigateBack(99)
        }
      },
      // 捕获 radio 改变
      handleRadioChange(id, val_desc, val) {
        // console.log(id, val_desc, val)
        if (Array.isArray(val)) {
          let str = val.join(',')
          this.formData = {
            ...this.formData,
            [id]: str
          }
          return
        }
        if (id === 'workUnit') {
          this.userData = {
            ...this.userData,
            [id]: val
          }
          return
        } else {
          // console.log(666, val);
          this.formData = {
            ...this.formData,
            [id]: val
            // [id + '_desc']: val_desc,
          }
        }
      },
      // 内容改变
      handleChangePicker(id, value) {
        if (id === 'address') {
          this.userData = {
            ...this.userData,
            chb015: value[0].orgid || '',
            chb017: value[1].orgid || '',
            chb018: value[2].orgid || ''
          }
          return
        }
        if (id === 'unit') {
          this.userData = {
            ...this.userData
            // [id]: value || '',
          }
          return
        } else {
          this.formData = {
            ...this.formData,
            [id]: value || ''
          }
        }
      },
      // 文本改变
      handleTextareaChange(e, id) {
        this.formData = {
          ...this.formData,
          [id]: e.detail.value
        }
      },
      // 获取主管单位数据
      getUnitRange() {
        requestFFGetChi037List().then((res) => {
          const { list } = res
          if (list) {
            const newList = []
            for (let i = 0, len = list.length; i < len; i++) {
              let item = list[i]
              newList.push({
                id: item.chi037,
                value: item.chi037,
                name: item.chi011
              })
            }
            this.unitRange = [...newList]
          }
        })
      },
      // 提交问卷并到
      handleSubmit() {
        this.getUserData()
        const list = Object.values(this.formData)
        const ht35List = [{ ...this.userData }]
        const ht36List = [{ ...this.formData }]
        const userList = [this.userList]

        for (let i = 0; i < list.length; i++) {
          if (list[i].length === 0) {
            showModal('请将信息填写完整！')
            return
          }
        }
        requestB140(ht35List, ht36List, userList)
          .then((res) => {
            console.log(res)
            const { resultMsg, message } = res
            if (resultMsg === '签到成功') {
              showToast(resultMsg, 'success').then(() => {
                const timer = setTimeout(() => {
                  clearTimeout(timer)
                  navigateBack(9)
                }, 1500)
              })
            }
            if (message === '重复签到') {
              console.log(message)
              showToast(message).then(() => {
                const timer = setTimeout(() => {
                  clearTimeout(timer)
                  navigateBack(9)
                }, 1500)
              })
            } else {
              showModal(message)
            }
          })
          .catch((err) => {
            showModal(err)
          })
      }
    },
    computed: {
      ...mapGetters([USER_INFO, USER_LIST]),
      getAssessRange() {
        return (data) => {
          let list = []
          data.split('#').forEach((item, index) => {
            list.push({
              aaa102: index.toString(),
              aaa103: item
            })
          })
          return list
        }
      }
    },
    watch: {}
  }
</script>

<style lang="scss" scoped>
  .training-questionnaire {
    padding: $spacing;

    .attendance {
      background: #fff;

      .training-info {
        display: flex;
        flex-direction: column;
        align-items: center;

        .item {
          display: flex;
          font-family: Source Han Sans CN;
          font-size: 28rpx;
          font-weight: normal;
          font-stretch: normal;
          letter-spacing: 0rpx;
          color: #666666;
          line-height: 50rpx;
        }
      }
    }

    .top {
      .text {
        font-family: Source Han Sans CN;
        font-size: 28rpx;
        font-weight: normal;
        font-stretch: normal;
        letter-spacing: 0rpx;
        color: #666666;
        text-indent: 2em;
      }

      .notice {
        font-family: Source Han Sans CN;
        font-size: 28rpx;
        font-weight: normal;
        font-stretch: normal;
        letter-spacing: 0rpx;
        color: #fea127;
        margin: 14rpx 0 20rpx 0;
      }
    }

    .middle {
      margin-top: 32rpx;

      .date {
        display: flex;
        justify-content: space-between;
        border-bottom: solid 1rpx #cccccc;
        padding-bottom: 16rpx;

        .title {
          font-family: Source Han Sans CN;
          font-size: 32rpx;
          font-weight: normal;
          font-stretch: normal;
          letter-spacing: 0rpx;
          color: #999999;
        }

        .content {
          font-family: Source Han Sans CN;
          font-size: 28rpx;
          font-weight: normal;
          font-stretch: normal;
          letter-spacing: 0rpx;
          color: #999999;
        }
      }

      .card {
        margin-top: 50rpx;

        .title {
          font-family: Source Han Sans CN;
          font-size: 32rpx;
          font-weight: normal;
          letter-spacing: 0rpx;
          color: #444444;
          margin-bottom: 24rpx;

          .text {
            &::before {
              content: '*';
              color: #f00;
            }
          }
        }

        .content {
          background-color: #ffffff;
          border-radius: 4rpx;
          border: solid 1rpx #cccccc;
          padding: 0 24rpx;
          border-radius: 4rpx;
        }

        .content-depart {
          ::v-deep .picker-content {
            padding: 0;
            font-family: Source Han Sans CN;
            font-size: 26rpx;
            font-weight: normal;
            font-stretch: normal;
            line-height: 1.4;
            letter-spacing: 0rpx;
            height: 88rpx;
            background-color: #ffffff;
            padding: 0 12rpx;
          }

          ::v-deep .picker-placeholder {
            letter-spacing: 0;
            color: #b4b2b2;
          }
        }

        .textarea {
          padding-top: 24rpx;
          padding-bottom: 24rpx;

          textarea {
            width: 100%;
            font-family: Source Han Sans CN;
            font-size: 28rpx;
            font-weight: normal;
            font-stretch: normal;
            line-height: 40rpx;
            letter-spacing: 0rpx;
            color: #999999;
          }
        }
      }

      .card-radio {
        margin-top: 50rpx;

        .title {
          font-family: Source Han Sans CN;
          font-size: 32rpx;
          font-weight: normal;
          letter-spacing: 0rpx;
          color: #444444;
          margin-bottom: 24rpx;

          .text {
            &::before {
              content: '*';
              color: #f00;
            }
          }
        }

        .content {
          ::v-deep .ez-declare-radio-wrapper {
            border-bottom: 0;
          }

          ::v-deep label {
            width: 100%;
            font-family: Source Han Sans CN;
            font-size: 28rpx;
            font-weight: normal;
            font-stretch: normal;
            line-height: 40rpx;
            letter-spacing: 0rpx;
            height: 60rpx;
          }
        }

        .content-depart {
          border: solid 1rpx #cccccc;

          ::v-deep .picker-content {
            padding: 0;
            font-family: Source Han Sans CN;
            font-size: 26rpx;
            font-weight: normal;
            font-stretch: normal;
            line-height: 1.4;
            letter-spacing: 0rpx;
            height: 88rpx;
            background-color: #ffffff;
            padding: 0 12rpx;
          }

          ::v-deep .picker-placeholder {
            letter-spacing: 0;
            color: #b4b2b2;
          }
        }

        .textarea {
          padding: 24rpx;
          border: solid 1rpx #cccccc;

          textarea {
            width: 100%;
            font-family: Source Han Sans CN;
            font-size: 28rpx;
            font-weight: normal;
            font-stretch: normal;
            line-height: 40rpx;
            letter-spacing: 0rpx;
            color: #999999;
          }
        }
      }
    }

    .button-wrapper {
      margin-top: 80rpx;
    }
  }
</style>
