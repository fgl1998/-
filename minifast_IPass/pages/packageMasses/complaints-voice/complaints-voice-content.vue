<template>
  <view class="complaints-voice-content">
    <div class="base">
      <ComponentPanel title="被投诉对象" v-if="isCarrier">
        <div class="panel-content">
          <div class="base-info">
            <div class="content">
              <span class="title">姓名：</span>
              <span class="val">{{ baseInfo.aac003 }}</span>
            </div>
            <div class="content">
              <span class="title">发放期号：</span>
              <span class="val">{{ baseInfo.aae209 }}</span>
            </div>
            <div class="content">
              <span class="title">身份证号：</span>
              <span class="val">{{ baseInfo.aac002 }}</span>
            </div>
            <div class="content">
              <span class="title">发放金额：</span>
              <span class="val">{{ baseInfo.aae019 }}</span>
            </div>
            <div class="content">
              <span class="title">补贴项目：</span>
              <span class="val">{{ baseInfo.chi031_desc }}</span>
            </div>
          </div>
        </div>
      </ComponentPanel>
    </div>
    <div class="edit-info">
      <ComponentPanel title="已录入信息">
        <div class="panel-content">
          <!-- 补贴项目 -->
          <div class="subsidy" v-if="subsidy && !isCarrier">
            <div class="title-header">
              <div class="title">
                <span class="required">{{ isRequired ? '*' : '' }}</span
                >已选择的补贴项目
              </div>
              <div class="to-edit" @click="toEdit(0, subsidys, subsidy_org, subsidy)" v-if="!isCarrier">
                <img src="./images/edit.png" alt="" class="e-img" />
                <span>去修改</span>
              </div>
            </div>
            <button class="btn">
              {{ subsidy }}
            </button>
          </div>
          <!-- 主题 -->
          <div class="theme" v-if="theme">
            <div class="title-header">
              <div class="title">
                <span class="required">{{ isRequired ? '*' : '' }}</span
                >已选择的投诉主题
              </div>
              <div class="to-edit" @click="toEdit(1, themes, theme_org, theme)">
                <img src="./images/edit.png" alt="" class="e-img" />
                <span>去修改</span>
              </div>
            </div>
            <button class="btn">
              {{ theme }}
            </button>
          </div>
          <!-- 区县 -->
          <div class="address" v-if="address && !isCarrier">
            <div class="title-header">
              <div class="title">
                <span class="required">{{ isRequired ? '*' : '' }}</span
                >已选择的投诉所在区县
              </div>
              <div class="to-edit" @click="toEdit(2, address_arr, address_org, address)" v-if="!isCarrier">
                <img src="./images/edit.png" alt="" class="e-img" />
                <span>去修改</span>
              </div>
            </div>
            <button class="btn">
              {{ address }}
            </button>
          </div>
          <!-- 语音 -->
          <div class="voice" v-if="messages.length > 0">
            <div class="title-header">
              <div class="title">
                <span class="required">{{ isRequired ? '*' : '' }}</span
                >已录入的投诉语音
              </div>
              <div class="to-edit" @click="toEdit(3, messages)">
                <img src="./images/edit.png" alt="" class="e-img" />
                <span>去修改</span>
              </div>
            </div>
            <div class="voice-content" v-for="(item, index) in messages" :key="item.fileSize">
              <div class="voice-content-header">
                <div class="content-left">
                  你已经录入<span class="word">{{ item.length + 's' }}</span
                  >语音
                </div>
              </div>
              <div class="words">
                <div class="words-tips">语音转文字（文字仅供参考，系统会保存语音）:</div>
                <div class="words-content">
                  {{ item.message }}
                </div>
              </div>
              <div class="play-voice" @click="handlePlayVoice(item.path, index)">
                {{ currentIndex === index ? playBtnText : clickToPlayText }}
              </div>
            </div>
          </div>
          <!-- 材料 -->
          <div class="images">
            <div class="title-header">
              <div class="title">已上传的材料</div>
              <div class="to-edit" @click="toEdit(4, uploadImages)">
                <img src="./images/edit.png" alt="" class="e-img" />
                <span>去修改</span>
              </div>
            </div>
            <div class="images-wrapper" v-if="uploadImages.length > 0">
              <div class="img-box" v-for="(item, index) in uploadImages" :key="item.id">
                <img class="img-u" :src="isRequestFF ? item.base64 : item.path" @click="handlePreviewImage(index)" />
              </div>
            </div>
            <div class="no-images" v-else>
              <NoData></NoData>
            </div>
          </div>
        </div>
      </ComponentPanel>
    </div>
    <!--  v-if="areaCode !== '511000'" -->
    <div class="open-will">
      <ComponentPanel title="您是否愿意向社会公开您的投诉信息">
        <div class="panel-content">
          <div class="describe">
            本平台有可能将你反映的问题线索和意见建议及处理情 况以适当方式向社会公开。如果你不希望公开,我们将
            充分尊重你的意愿。<span class="must">(必选项)</span>
          </div>
          <radio-group @change="radioChange" class="radio-g d-f jc-sa ai-c">
            <label><radio class="radio-style" color="#3882ff" value="willing" />愿意公开</label>
            <label><radio class="radio-style" color="#3882ff" value="unwilling" />不愿意公开</label>
          </radio-group>
        </div>
      </ComponentPanel>
    </div>
    <div class="confirm">
      <button class="btn-confirm" @click="handleClickComplaint">确定并提交投诉</button>
      <button class="btn-give-up" @click="giveUp">放弃投诉</button>
    </div>
  </view>
</template>

<script>
  const innerAudioContext = uni.createInnerAudioContext()
  import config from '@/config'
  import { navigateBack, previewImage, showModal } from '@/utils/uni-api'
  import NoData from '@/components/common/ez-no-data/ez-no-data.vue'
  import ComponentPanel from '@/components/common/ez-panel/ez-panel.vue'
  import { areaCode } from '@/config/city'
  export default {
    name: 'complaintsVoiceContent',
    components: {
      ComponentPanel,
      NoData
    },
    props: {
      isCarrier: {
        type: Boolean,
        default: false
      },
      subsidy_org: {
        type: String,
        default: ''
      },
      subsidys: {
        type: Array,
        default: () => []
      },
      subsidy: {
        type: String,
        default: ''
      },
      theme_org: {
        type: String,
        default: ''
      },
      themes: {
        type: Array,
        default: () => []
      },
      theme: {
        type: String,
        default: ''
      },
      address_arr: {
        type: Array,
        default: () => []
      },
      address_org: {
        type: String,
        default: ''
      },
      address: {
        type: String,
        default: ''
      },
      messages: {
        type: Array,
        default: () => []
      },
      uploadImages: {
        type: Array,
        default: () => []
      },
      baseInfo: {
        type: Object,
        default: () => {}
      },
      isRequestFF: {
        type: Boolean,
        default: false
      }
    },
    data() {
      return {
        isRequired: true,
        isPlay: false,
        playBtnText: '播放中...',
        clickToPlayText: '点击播放语音',
        currentIndex: '',
        radioValue: '', // 意愿选中值
        areaCode: config.areaCode
      }
    },
    onReady() {
      // 语音播放结束
      innerAudioContext.onEnded(() => {
        this.isPlay = false
        this.currentIndex = ''
      })
    },
    methods: {
      // 去修改
      toEdit(i, arr, oldData, oldDataDesc) {
        this.$emit('handleEditInfo', i, arr, oldData, oldDataDesc)
      },
      // 播放录音
      handlePlayVoice(path, index) {
        this.currentIndex = index
        innerAudioContext.src = path
        this.isPlay = !this.isPlay
        if (this.isPlay) {
          innerAudioContext.play()
        } else {
          innerAudioContext.stop()
          this.currentIndex = ''
        }
      },
      // 预览
      handlePreviewImage(index) {
        const uploadImages = [...this.uploadImages]
        let usrls = []
        let current = ''
        uploadImages.forEach((item, i) => {
          if (!this.isRequestFF) {
            usrls.push(item.path)
            if (index === i) {
              current = item.path
            }
          } else {
            usrls.push(item.base64)
            if (index === i) {
              current = item.base64
            }
          }
        })
        previewImage(usrls, current)
      },
      // 放弃投诉
      giveUp() {
        showModal('确定要放弃投诉吗？', '提示', true)
          .then(() => {
            navigateBack(1)
          })
          .catch(() => {})
      },
      // radio改变回调
      radioChange(e) {
        const { value } = e.detail
        this.radioValue = value
      },
      // 提交投诉
      handleClickComplaint() {
        // if (this.radioValue && this.areaCode !== '511000') {
        //   this.$emit('handleSubmit')
        // } else {
        //   showModal('请选择是否愿意向社会公开您的投诉信息')
        //   return
        // }
        if (this.radioValue) {
          this.$emit('handleSubmit')
        }
      }
    }
  }
</script>

<style lang="scss" scoped>
  .complaints-voice-content {
    min-width: 100%;
    background-color: $page-background-color;
    padding-bottom: 350rpx;
    .base {
      margin-bottom: 20rpx;
      .panel-content {
        .base-info {
          display: flex;
          flex-direction: column;
          flex-wrap: wrap;

          .content {
            display: flex;
            margin-top: 20rpx;

            .title {
              min-width: 130rpx;
              font-size: 26rpx;
              color: #999999;
            }

            .val {
              flex: 1;
              font-size: 26rpx;
              color: #444444;
            }
          }
        }
      }
    }

    .edit-info {
      width: 100%;
      .panel-content {
        .subsidy,
        .theme,
        .address,
        .voice,
        .images {
          margin-bottom: 40rpx;
          .title-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            .title {
              .required {
                color: red;
              }
            }

            .to-edit {
              width: 130rpx;
              height: 42rpx;
              display: flex;
              justify-content: center;
              align-items: center;
              border-radius: 8rpx;
              font-size: 30rpx;
              color: #006dec;

              .e-img {
                margin-right: 10rpx;
                width: 28rpx;
                height: 28rpx;
              }
            }
          }

          .btn {
            padding: 20rpx;
            margin: 20rpx 0 0 20rpx;
            height: 92rpx;
            line-height: 52rpx;
            text-align: center;
            border-radius: 8rpx;
            color: #3882ff;
            background-color: #fff;
            border: 1rpx solid #3882ff;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
          }
        }

        .voice {
          .voice-content {
            width: 100%;
            //height: 490rpx;
            min-height: 490rpx;
            box-shadow: 0rpx 8rpx 6rpx 0rpx rgba(0, 109, 236, 0.1);
            border-radius: 4rpx;
            border: solid 1rpx #dee2e6;
            padding: 20rpx;
            background-color: #fff;

            &:not(:first-child) {
              margin-top: 20rpx;
            }

            .voice-content-header {
              display: flex;
              justify-content: space-between;
              align-items: center;
              .content-left {
                font-size: 30rpx;
                .word {
                  color: #ff7f04;
                }
              }
            }

            .words {
              height: 200rpx;
              width: 100%;
              margin-top: 20rpx;
              padding-top: 20rpx;
              border-top: solid 1rpx #dee2e6;
              font-size: 28rpx;

              .words-content {
                margin-top: 10rpx;
                height: 150rpx;
                width: 100%;
                border-radius: 8rpx;
                background-color: rgba(241, 242, 246, 1);
                overflow: auto;
                padding: 18rpx 32rpx;
                color: #444444;
              }
            }

            .play-voice {
              width: 100%;
              height: 88rpx;
              background-color: rgba(0, 109, 236, 0.05);
              border-radius: 2rpx;
              border: solid 1rpx #006dec;
              display: flex;
              justify-content: center;
              align-items: center;
              color: #006dec;
              margin-top: 88rpx;
            }
          }
        }

        .images {
          width: 100%;
          .images-wrapper {
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            width: 100%;

            .img-box {
              width: 100%;

              .img-u {
                width: 100%;
                height: 344rpx;
                margin-top: 20rpx;
              }
            }
          }

          .no-images {
            width: 100%;
          }
        }
      }
    }

    .confirm {
      bottom: 0;
      position: fixed;
      width: 100%;
      padding: 40rpx;
      background-color: #fff;

      .btn-confirm {
        width: 100%;
        height: 88rpx;
        background-color: #006dec;
        color: #fff;
        text-align: center;
        line-height: 88rpx;
        border-radius: 2rpx;
      }

      .btn-give-up {
        width: 100%;
        height: 88rpx;
        text-align: center;
        line-height: 88rpx;
        margin-top: 40rpx;
        border-radius: 8rpx;
        color: #0076ff;
        background-color: #ffffff;
        border-radius: 2rpx;
        border: solid 1rpx #006dec;
      }
    }

    .open-will {
      margin-top: $spacing;

      .describe {
        font-size: 24rpx;
        color: $color-placeholder;
        .must {
          color: #f00;
        }
      }

      .radio-g {
        margin-top: $spacing;

        .radio-style {
          transform: scale(0.7);
        }
      }
    }
  }
</style>
