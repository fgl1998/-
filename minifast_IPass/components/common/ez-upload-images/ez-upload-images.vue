<template>
  <div class="ez-upload-images-wrapper">
    <div class="upload-images">
      <div class="tip-wrapper">
        <div class="left">{{ uploadTip }}</div>
        <div class="right" v-if="uploadNum > 0">
          <span class="current-num">{{ currentUploadNum }}</span>
          <span class="total-num">/{{ uploadNum }}</span>
        </div>
      </div>
      <div class="images-wrapper">
        <block v-for="(item, index) in uploadImages" :key="item.id">
          <div class="img-box" @click.stop="handlePreviewImage(index)">
            <img v-if="item.path || item.base64" :src="isUploadServer ? item.path : item.base64" />
            <div class="iconimg" @click.stop="handleDeleteItem(index)"></div>
          </div>
        </block>
        <div class="img-box add" @click.stop="handleAddImage" v-if="showAddBtn"></div>
      </div>
    </div>
    <!-- 用于支付宝小程序获取base64 -->
    <div class="canvas-wrapper">
      <canvas id="canvas_img"></canvas>
    </div>
  </div>
</template>
<script>
  import {
    chooseImage,
    previewImage,
    uploadFile,
    getImageInfo,
    showModal,
    showLoading,
    hideLoading
  } from '@/utils/uni-api'
  import config from '@/config'
  export default {
    name: 'ezUploadImages',
    props: {
      // 上传数量 -1 则不限制
      uploadNum: {
        type: [Number],
        default: -1
      },
      // 是否上传到服务器 false 则保存为base64储存
      isUploadServer: {
        type: [Boolean],
        default: false
      },
      // 上传提示
      uploadTip: {
        type: [String],
        default: '若有投诉材料，请点击上传'
      }
    },
    data() {
      return {
        uploadImages: [] //  已上传图片
      }
    },
    components: {},
    created() {},
    methods: {
      // 添加上传
      handleAddImage() {
        const isUploadServer = this.isUploadServer
        chooseImage(1).then((res) => {
          const tempFiles = res.tempFilePaths
          if (isUploadServer) {
            this.handleUploadFiles(tempFiles)
          } else {
            this.handleImageBase64(tempFiles)
          }
        })
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
              reject(err)
            })
        })
      },

      // 图片转 base64
      urlTobase64(url) {
        return new Promise((resolve, reject) => {
          // #ifdef MP-ALIPAY
          getImageInfo(url)
            .then((res) => {
              const imgWidth = res.width / 2.5
              const imgHeight = res.height / 2.5
              let canvas = uni.createCanvasContext('canvas_img')
              canvas.drawImage(url, 0, 0, imgWidth, imgHeight) // 1. 绘制图片至canvas
              // 绘制完成后执行回调
              canvas.draw(false, async () => {
                let base64 = await canvas.toDataURL({
                  width: imgWidth,
                  height: imgHeight,
                  quality: 1
                })
                // base64 = base64.replace('data:image/png;base64,', '')
                resolve(base64)
              })
            })
            .catch((err) => {
              reject(err)
            })
          // #endif

          // #ifdef MP-WEIXIN
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
          // #endif
        })
      },
      // 处理上传
      async handleUploadFiles(files) {
        const { requestUrl } = config
        showLoading('上传中')
        const uploadImages = [...this.uploadImages]
        const len = files.length
        const arr = []
        for (let i = 0; i < len; i++) {
          const item = files[i]
          try {
            const uploadResult = await this.requestUpload(item)
            let suffix = item.substr(item.lastIndexOf('.') + 1)
            // #ifdef H5
            suffix = '.png'
            // #endif
            const obj = {
              id: uploadResult.fileid,
              size: '', // 文件大小
              fileName: uploadResult.filename, // 文件名称
              suffix: suffix, // 文件后缀
              tempPath: item, // 文件零时路径
              base64: '', // 文件 base64 路径
              path: requestUrl + '/upload/downloadFile/' + uploadResult.fileid
            }
            arr.push(obj)
          } catch (err) {
            hideLoading()
          }
        }
        this.uploadImages = [...uploadImages, ...arr]
        this.$emit('change', this.uploadImages)
        hideLoading()
      },
      // 处理 base64 上传
      async handleImageBase64(files) {
        showLoading('上传中')
        const uploadImages = [...this.uploadImages]
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

        this.uploadImages = [...uploadImages, ...arr]
        this.$emit('change', this.uploadImages)
        hideLoading()
      },
      // 预览
      handlePreviewImage(index) {
        const uploadImages = [...this.uploadImages]
        const isUploadServer = this.isUploadServer
        let usrls = []
        let current = ''
        uploadImages.forEach((item, i) => {
          if (isUploadServer) {
            // 上传完成未返回path,暂用tempath
            // usrls.push(item.path)
            // if (index === i) {
            //   current = item.path
            // }
            usrls.push(item.path)
            if (index === i) {
              current = item.path
            }
          } else {
            // 支付宝小程序 只支持 http 形式预览
            // #ifdef MP-ALIPAY
            usrls.push(item.tempPath)
            if (index === i) {
              current = i
            }
            // #endif
            // #ifdef MP-WEIXIN
            usrls.push(item.base64)
            if (index === i) {
              current = item.base64
            }
            // #endif
          }
        })
        previewImage(usrls, current)
      },
      // 删除
      handleDeleteItem(index) {
        const uploadImages = [...this.uploadImages]
        uploadImages.splice(index, 1)
        this.uploadImages = [...uploadImages]
        this.$emit('change', this.uploadImages)
      }
    },
    computed: {
      // 计算当前上传数量
      currentUploadNum() {
        let num = 0
        const uploadImages = this.uploadImages
        const len = uploadImages.length
        if (len > 0 && uploadImages) {
          num = len
        }
        return num + ''
      },
      // 是否显示上传按钮 根据上传规定数量是否完成
      showAddBtn() {
        let result = true
        const uploadImages = this.uploadImages
        const len = uploadImages.length
        const uploadNum = this.uploadNum
        if (uploadNum > 0) {
          if (len >= uploadNum) {
            result = false
          }
        }
        return result
      }
    }
  }
</script>
<style lang="scss" scoped>
  .ez-upload-images-wrapper {
    width: 100%;
    .upload-images {
      width: 100%;
    }
    .tip-wrapper {
      display: flex;
      align-items: center;
      justify-content: space-between;
      font-size: 24rpx;
      font-weight: 500;
      line-height: 1;
      color: #8a8f99;
      padding-bottom: 16rpx;
      .current-num {
        color: #f00;
        font-weight: 700;
      }
    }
    .images-wrapper {
      display: flex;
      align-items: center;
      flex-wrap: wrap;
      background-color: #f0f2f5;
      border-radius: 8rpx;
      width: 100%;
      padding: 24rpx 24rpx 0;
    }
    .img-box {
      width: 130rpx;
      height: 130rpx;
      margin-bottom: 24rpx;
      border-radius: 8rpx;
      margin-right: 24rpx;
      position: relative;
      &:nth-of-type(4n) {
        margin-right: 0;
      }
      .iconimg {
        position: absolute;
        top: -16rpx;
        right: -16rpx;
        width: 32rpx;
        height: 32rpx;
        z-index: 99;
        background-image: url(data:image/png;base64,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);
      }
      img {
        display: block;
        width: 100%;
        height: 100%;
      }
      &.add {
        border: dashed 4rpx #dcdfe6;
        position: relative;
        &::before,
        &::after {
          content: '';
          position: absolute;
          top: 50%;
          left: 50%;
          width: 60rpx;
          height: 4rpx;
          transform: translate(-50%, -50%);
          background-color: #c4c7cc;
          border-radius: 2rpx;
        }
        &::after {
          width: 4rpx;
          height: 60rpx;
        }
      }
    }
    .canvas-wrapper {
      width: 0;
      height: 0;
      canvas {
        visibility: hidden;
      }
    }
  }
</style>
