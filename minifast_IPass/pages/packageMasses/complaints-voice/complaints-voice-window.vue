<template>
  <view class="complaints-voice-window">
    <ComponentPanel title="投诉举报内容">
      <!-- 提示 -->
      <div class="tips">
        <span class="required">{{ isRequired ? '*' : '' }}</span
        >{{ tips }}
      </div>
      <!-- 内容主体 -->
      <div :class="['content', { 'min-h': isCarrier }, { 'subsidy-hight': currentStep === 0 }]">
        <!-- 选择投诉补贴项目 -->
        <div class="subsidy" v-if="currentStep === 0 && !isCarrier">
          <button
            :class="['btn', { 'is-chosed': item.isChosed }]"
            v-for="(item, index) in subsidys"
            :key="item.chi031"
            @click="choseSubsidy(index)">
            {{ item.name }}
          </button>
        </div>
        <!-- 选择投诉主题 -->
        <div class="content-theme" v-if="currentStep === 1">
          <button
            :class="['btn', { 'is-chosed': item.isChosed }]"
            v-for="(item, index) in themes"
            :key="item.aae102"
            @click="choseTheme(index)">
            {{ item.aaa103 }}
          </button>
        </div>
        <!-- 选择被投诉人所在区县 -->
        <div class="address" v-if="currentStep === 2 && !isCarrier">
          <button
            :class="['btn', { 'is-chosed': item.isChosed }]"
            v-for="(item, index) in address"
            :key="item.orgid"
            @click="choseAddress(index)">
            {{ item.orgname }}
          </button>
        </div>
        <!-- 语音录入 -->
        <div class="voice" v-if="currentStep === 3">
          <div class="voice-content" v-for="(item, index) in messages" :key="item.fileSize">
            <div class="voice-content-header">
              <div class="content-left">
                你已经录入<span class="word">{{ item.length + 's' }}</span
                >语音
              </div>
              <div class="content-right" @click="deleteVoice(index)">
                <img src="./images/delete.png" alt="" class="r-img" />
                删除
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
        <!-- 材料上传 -->
        <div class="upload-file" v-if="currentStep === 4">
          <div class="all-images" v-for="(item, index) in showImages" :key="item.id">
            <div class="img-box" @click="handlePreviewImage(index)">
              <img class="img-u" :src="isRequestFF ? item.base64 : item.path" alt="" />
              <div class="iconimg" @click.stop="handleDeleteItem(index)"></div>
            </div>
          </div>
          <div class="add-image" @click="handleAddImage">
            <img src="./images/add.png" alt="" class="add" />
            <span class="click-upload">点击上传</span>
          </div>
        </div>
      </div>
    </ComponentPanel>
    <div class="btn-confirm">
      <div class="recording" v-if="currentStep === 3">
        <button
          :class="['recording-btn', isStartRecord ? 'active' : '']"
          @longpress="handleStartRecord"
          @touchend="handleStopRecord">
          <img class="img-r" src="./images/recording.png" alt="" />
          <span class="words-r">{{ recordingBtnText }}</span>
        </button>
      </div>
      <div class="btn">
        <button
          :class="[
            'pre-step',
            {
              'btn-gray': isGray
            }
          ]"
          @click="$emit('preStep')">
          {{ preBtnText }}
        </button>
        <button class="next-step" @click="$emit('nextStep')">
          {{ nextBtnText }}
        </button>
      </div>
    </div>
  </view>
</template>

<script>
  const innerAudioContext = uni.createInnerAudioContext()
  const plugin = requirePlugin('WechatSI')
  const pluginAVoice = plugin.getRecordRecognitionManager()

  import config from '@/config'
  import {
    chooseImage,
    previewImage,
    uploadFile,
    getImageInfo,
    login,
    showModal,
    showLoading,
    hideLoading,
    vibrateShort
  } from '@/utils/uni-api'
  import ComponentPanel from '@/components/common/ez-panel/ez-panel.vue'
  export default {
    name: 'complaintsVoiceWindow',
    components: {
      ComponentPanel
    },
    props: {
      subsidys: {
        type: Array,
        default: () => []
      },
      themes: {
        type: Array,
        default: () => []
      },
      messages: {
        type: Array,
        default: () => []
      },
      address: {
        type: Array,
        default: () => []
      },
      showImages: {
        type: Array,
        default: () => []
      },
      isCarrier: {
        type: Boolean,
        default: false
      },
      currentStep: {
        type: Number,
        default: 0
      },
      tips: {
        type: String,
        required: true
      },
      isRequired: {
        type: Boolean,
        default: true
      },
      isRequestFF: {
        type: Boolean,
        default: false
      },
      preBtnText: {
        type: String,
        required: true
      },
      nextBtnText: {
        type: String,
        required: true
      },
      isEdit: {
        type: Boolean,
        default: false
      }
    },
    data() {
      return {
        isStartRecord: false, // 是否开始录音
        timer: null, // 录音计时器
        time: 0, // 录音时长
        isPlay: false, // 是否播放录音
        playBtnText: '播放中...',
        clickToPlayText: '点击播放语音',
        recordingBtnText: '按住说话录入信息',
        currentIndex: ''
      }
    },
    computed: {
      isGray() {
        if ((this.currentStep === 0 || (this.isCarrier && this.currentStep === 1)) && !this.isEdit) {
          return true
        } else {
          return false
        }
      }
    },
    onReady() {
      // 有新的识别内容返回，则会调用此事件
      pluginAVoice.onRecognize = (res) => {
        // console.log('有新的识别内容返回，则会调用此事件', res)
      }
      // 识别结束事件
      pluginAVoice.onStop = (res) => {
        // console.log('识别结束事件', res)
        this.stopRecord(res)
      }
      // 正常开始录音识别时会调用此事件
      pluginAVoice.onStart = (res) => {
        // console.log('成功开始录音识别', res)
      }
      // 识别错误事件
      pluginAVoice.onError = (res) => {
        // console.error('识别错误事件', res)
        hideLoading()
        // 识别出错时将最后一条语音数据删除
        const { retcode } = res
        this.handleWechatSpeechRecognitionError(retcode)
      }
      // 语音播放结束
      innerAudioContext.onEnded(() => {
        this.isPlay = false
        this.currentIndex = ''
      })
    },
    methods: {
      // 开始录音
      handleStartRecord() {
        vibrateShort()
        this.isStartRecord = true
        this.recordingBtnText = '录音中...'
        this.time = 0
        pluginAVoice.start()
        this.timer = setInterval(() => {
          this.time++
        }, 1000)
      },
      // 结束录音
      handleStopRecord() {
        this.isStartRecord = false
        this.recordingBtnText = '按住说话录入信息'
        clearInterval(this.timer)
        pluginAVoice.stop()
      },
      // 停止录音
      stopRecord(res) {
        const { result, duration, fileSize, tempFilePath } = res
        if (!!result) {
          this.$emit('handleChangeMessages', {
            path: tempFilePath,
            length: this.time,
            fileSize: fileSize,
            message: result,
            suffix: tempFilePath.substr(tempFilePath.lastIndexOf('.') + 1)
          })
        } else {
          showModal('你好像什么都没说，请重新录入！')
        }
      },
      // 选择补贴项目
      choseSubsidy(index) {
        this.$emit('handleChoseSub', index)
      },
      // 选择主题
      choseTheme(index) {
        this.$emit('handleChoseTheme', index)
      },
      choseAddress(index) {
        this.$emit('handleChoseAddress', index)
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
      // 删除已经录制的语音
      deleteVoice(index) {
        this.$emit('handleDelete', index)
      },
      // 处理 base64 上传
      async handleImageBase64(files) {
        showLoading('上传中')
        const uploadImages = [...this.showImages]
        const len = files.length
        let arr = []
        for (let i = 0; i < len; i++) {
          const item = files[i]
          let fileName = item.substr(item.lastIndexOf('/') + 1)
          let suffix = item.substr(item.lastIndexOf('.') + 1)
          const obj = {
            id: fileName,
            size: '', // 文件大小
            fileName: fileName, // 文件名称
            suffix: suffix, // 文件后缀
            tempPath: item, // 文件零时路径
            base64: '', // 文件 base64 路径
            path: '' // 文件 上传成后的 路径
          }
          const base64 = await this.urlTobase64(item)
          obj.base64 = base64
          arr.push(obj)
        }
        this.$emit('handleChangeImages', [...uploadImages, ...arr])
        hideLoading()
      },
      // 处理上传
      async handleUploadFiles(files) {
        const { requestUrl } = config
        showLoading('上传中')
        const uploadImages = [...this.showImages]
        const len = files.length
        const arr = []
        for (let i = 0; i < len; i++) {
          const item = files[i]
          const uploadResult = await this.requestUpload(item)
          let suffix = item.substr(item.lastIndexOf('.') + 1)
          const obj = {
            id: uploadResult.fileid,
            size: '', // 文件大小
            fileName: uploadResult.filename, // 文件名称
            suffix: suffix, // 文件后缀
            tempPath: item, // 文件临时路径
            base64: '', // 文件 base64 路径
            path: requestUrl + '/upload/downloadFile/' + uploadResult.fileid
          }
          arr.push(obj)
        }
        this.$emit('handleChangeImages', [...uploadImages, ...arr])
        hideLoading()
      },
      // 点击上传
      handleAddImage() {
        const isRequestFF = this.isRequestFF
        chooseImage(1)
          .then((res) => {
            const tempFiles = res.tempFilePaths
            if (!isRequestFF) {
              this.handleUploadFiles(tempFiles)
            } else {
              this.handleImageBase64(tempFiles)
            }
          })
          .catch((err) => {
            console.log(err)
          })
      },
      // 删除图片
      handleDeleteItem(index) {
        const uploadImages = [...this.showImages]
        uploadImages.splice(index, 1)
        this.$emit('handleChangeImages', [...uploadImages])
      },
      // 预览
      handlePreviewImage(index) {
        const uploadImages = [...this.showImages]
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
      // 请求上传
      requestUpload(path) {
        return new Promise((resolve, reject) => {
          uploadFile('/upload/uploadFile', path, 'file')
            .then((res) => {
              if (res.statusCode === 200) {
                const data = JSON.parse(res.data)
                const { resultData } = data.data
                if (resultData && resultData.code === '-1') {
                  reject(resultData.message || '服务器返回错误')
                } else {
                  resolve(resultData.data)
                }
              }
            })
            .catch((err) => {
              console.log('upload err', err)
              reject(err)
            })
        })
      },
      // 图片转 base64
      urlTobase64(url) {
        return new Promise((resolve, reject) => {
          const fs = wx.getFileSystemManager()
          let suffix = url.substr(url.lastIndexOf('.') + 1)
          let base64 = ''
          try {
            let base64Data = fs.readFileSync(url, 'base64')
            base64 = 'data:image/' + suffix + ';base64,' + base64Data
            resolve(base64)
          } catch (err) {
            showModal('获取文件数据失败')
            reject(err)
          }
        })
      },
      // 图片上传改变
      handleChangeUploadImages(files) {
        if (files && files.length > 0) {
          this.$emit('handleChangeImages', [...files])
        }
      },
      // 处理微信语音识别错误
      handleWechatSpeechRecognitionError(code) {
        let errMsg = ''
        switch (code) {
          case -30001:
            errMsg = '录音接口出错。'
            break
          case -30002:
            errMsg = '录音暂停接口被调用，录音终止，识别终止。'
            break
          case -30003:
            errMsg = '录音帧数据未产生或者发送失败导致的数据传输失败。'
            break
          case -30004:
            errMsg = '因网络或者其他非正常状态导致的未查询识别结果。'
            break
          case -30005:
            errMsg = '语音识别服务内部错误。'
            break
          case -30006:
            errMsg = '语音识别服务未在限定时间内识别完成。'
            break
          case -30007:
            errMsg = 'start启动参数错误。'
            break
          case -30008:
            errMsg = '查询请求时网络失败。'
            break
          case -30009:
            errMsg = '创建鉴权内部失败。'
            break
          case -30010:
            errMsg = '发送鉴权时网络失败。'
            break
          case -30011:
            errMsg = '试图在识别正在进行中是再次调用start，返回错误，正在进行的识别任务正常进行。'
            break
          case -30012:
            errMsg = '当前无识别任务进行时调用stop错误。'
            break
          case -30013:
            errMsg = '其他未知错误。'
            break
          case -40001:
            errMsg = '达到接口调用频率限制。'
            break
          default:
            errMsg = '未知错误。'
            break
        }
        errMsg += '请稍后重试！'
        showModal(errMsg)
      }
    }
  }
</script>

<style lang="scss" scoped>
  .complaints-voice-window {
    padding-top: 20rpx;
    width: 100%;
    height: 100%;

    .tips {
      margin-top: 20rpx;
      font-size: 36rpx;

      .required {
        color: red;
      }
    }

    .content {
      width: 100%;
      max-height: 800rpx;
      overflow: auto;

      .content-theme,
      .subsidy,
      .address {
        margin-top: 20rpx;
        display: flex;
        justify-content: flex-start;
        flex-wrap: wrap;

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

        .is-chosed {
          color: #fff;
          background-color: #3882ff;
        }
      }

      .voice {
        padding: 20rpx;
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

            .content-right {
              display: flex;
              align-items: center;
              justify-content: center;
              font-size: 30rpx;
              color: #ff7f04;
              .r-img {
                width: 26rpx;
                height: 29rpx;
                margin-right: 10rpx;
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

      .upload-file {
        width: 100%;

        .all-images {
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          width: 100%;
          height: 344rpx;
          margin: 20rpx 0;

          .img-box {
            position: relative;
            width: 100%;
            height: 344rpx;

            &:not(:last-child) {
              margin-bottom: 20rpx;
            }

            .img-u {
              width: 100%;
              height: 344rpx;
            }

            .iconimg {
              position: absolute;
              top: 0;
              right: 0;
              width: 32rpx;
              height: 32rpx;
              z-index: 99;
              background-image: url(data:image/png;base64,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);
            }
          }
        }

        .add-image {
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          height: 344rpx;
          background-color: rgba(153, 153, 153, 0.05);
          border-radius: 2rpx;
          border: solid 1rpx #999999;
          margin-top: 20rpx;

          .add {
            width: 103px;
            height: 82px;
          }

          .click-upload {
            margin-top: 18rpx;
            font-size: 30rpx;
            color: #999999;
          }
        }
      }
    }

    .min-h {
      max-height: 500rpx;
    }

    .subsidy-hight {
      max-height: 1000rpx;
    }

    .btn-confirm {
      position: absolute;
      bottom: 0;
      width: 100%;
      background-color: #fff;
      padding: 30rpx;
      margin-top: 30rpx;

      .recording {
        width: 100%;
        height: 120rpx;

        .recording-btn {
          display: flex;
          justify-content: center;
          align-items: center;
          width: 100%;
          height: 120rpx;
          background-color: #ff7f04;
          border-radius: 60rpx;

          .img-r {
            width: 44rpx;
            height: 60rpx;
          }

          .words-r {
            margin-left: 30rpx;
            font-size: 32rpx;
            color: #ffffff;
          }
        }

        .active {
          background-color: #19cb88;
        }
      }

      .btn {
        width: 100%;
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-top: 20rpx;

        .pre-step,
        .next-step {
          text-align: center;
          font-size: 32rpx;
          width: 330rpx;
          height: 88rpx;
          border-radius: 2rpx;
          border: solid 1rpx #006dec;
        }

        .pre-step {
          color: #0076ff;
          background-color: #fff;
          border: 1rpx solid #006dec;
        }

        .btn-gray {
          background-color: rgba(232, 232, 232, 1);
          color: #fff;
          border: 0;
        }

        .next-step {
          color: #fff;
          background-color: #006dec;
        }
      }
    }
  }
</style>
