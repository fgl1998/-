<template>
  <div class="ez-upload-images-wrapper">
    <div class="items">
      <block v-for="(item, index) in imageList" :key="index">
        <div class="item" @click="handlePreviewImage(index)">
          <img :src="item.path" alt="" />
          <div
            class="iconimg iconimg-close"
            @click="handleDeleteImage(index)"
          ></div>
        </div>
      </block>
      <div class="item add" @click="handleUploadImage" v-if="canUpload">
        <div class="iconimg"></div>
        <div class="tip">{{ uploadTip }}</div>
      </div>
    </div>
  </div>
</template>

<script>
import {
  chooseImage,
  previewImage,
  uploadFile,
  downloadFile,
  showLoading,
  hideLoading,
  showModal,
} from '@/utils/uni-api'
import config from '@/config'
export default {
  name: 'uploadImages',
  props: {
    // 渲染数据
    imageList: {
      type: [Array],
      default: () => [],
    },
    // 文件上传请求地址 主动加上前缀
    urlUpload: {
      type: [String],
      default: '/upload/uploadFile',
    },
    // 文件下载请求地址 主动加上前缀
    urlDownload: {
      type: [String],
      default: '/upload/downloadFile',
    },
    // 上传数量
    uploadNum: {
      type: [Number],
      default: 1,
    },
    // 上传提示
    uploadTip: {
      type: [String],
      default: '上传材料',
    },
  },
  data() {
    return {}
  },
  components: {},
  mounted() {},
  methods: {
    // 请求上传文件
    requestUploadFile(file) {
      const url = this.urlUpload
      const { path } = file
      return new Promise((resolve, reject) => {
        uploadFile(url, path, 'file', {}, {})
          .then((res) => {
            resolve(res)
          })
          .catch((err) => {
            reject(err)
          })
      })
    },
    // 请求文件下载
    requestDownloadFile(fileid) {
      const url = this.urlDownload
      return downloadFile(url + '/' + fileid)
        .then((res) => {
          const { tempFilePath } = res
          resolve(tempFilePath)
        })
        .catch((err) => {
          reject(err)
        })
    },
    // 选择文件 进行上传
    handleUploadImage() {
      chooseImage(1).then((res) => {
        showLoading('上传中')
        // 目前只针对处理上传时选择一张图片
        const tempFile = res.tempFiles[0]
        const { path, size } = tempFile
        let fileInfo = {
          path,
          size,
        }
        this.requestUploadFile(fileInfo)
          .then((res) => {
            const data = JSON.parse(res.data)
            const { resultData } = data.data
            if (resultData.code === '200') {
              const { requestUrl } = config
              const imageList = [...this.imageList]
              const { fileid, filename } = resultData.data
              fileInfo.isUploadSuccess = true
              fileInfo.fileid = fileid
              // #ifdef H5
              fileInfo.path = requestUrl + '/upload/downloadFile/' + fileid
              // #endif
              fileInfo.filename = filename
              imageList.push(fileInfo)
              this.$emit('change', imageList)
            } else {
              fileInfo.isUploadSuccess = false
              showModal(resultData.message)
            }
          })
          .catch((err) => {
            fileInfo.isUploadSuccess = false
            showModal(err + '')
          })
          .finally(() => {
            hideLoading()
          })
      })
    },
    // 预览文件
    handlePreviewImage(index) {
      const imageList = [...this.imageList]
      let item = imageList[index]
      // 已上传 预览
      if (item && item.path) {
        const urls = []
        imageList.forEach((file) => {
          if (file.path) {
            urls.push(file.path)
          }
        })
        previewImage(urls, item.path)
      }
    },
    // 处理删除文件
    handleDeleteImage(index) {
      const imageList = [...this.imageList]
      imageList.splice(index, 1)
      this.$emit('change', imageList)
    },
  },
  computed: {
    canUpload() {
      const imageList = this.imageList
      const len = imageList.length
      const uploadNum = this.uploadNum
      let result = true
      if (len >= uploadNum) {
        result = false
      }
      return result
    },
  },
}
</script>

<style lang="scss" scoped>
view {
  box-sizing: border-box;
}
.ez-upload-images-wrapper {
  width: 100%;
  padding: 0 $spacing;
  color: #3d424d;
}
.items {
  width: 100%;
  display: flex;
  align-items: center;
  flex-wrap: wrap;
}
.item {
  width: 200rpx;
  height: 200rpx;
  background-color: #f7f8fa;
  border-radius: 4rpx;
  font-size: 26rpx;
  font-weight: 700;
  line-height: 1;
  color: $primary;
  text-align: center;
  position: relative;
  margin-right: 30rpx;
  margin-bottom: 30rpx;
  img {
    width: 100%;
    height: 100%;
  }
  .iconimg-close {
    position: absolute;
    top: -20rpx;
    right: -20rpx;
    width: 46rpx;
    height: 46rpx;
    background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAFoAAABaCAMAAAAPdrEwAAAABGdBTUEAALGPC/xhBQAAAAFzUkdCAK7OHOkAAAAzUExURUdwTOYAAOYAAOYAAOcAAO4AAOYAAOYAAOgAAOYAAOYAAOoAAOgAAOgAAOYAAOYAAOUAAGq09+wAAAAQdFJOUwCPeL41DurgH/TSJFdTolzcPn6sAAAB+klEQVRYw7WZ7XqDMAiFNR8osSr3f7Xr2q7dZiTE5Jy/Pn2bECAEhsGgsLrNp4mYaUp+c2sYeig4z3IQe9eIDyPJqWi8TI8uSUHJxSvgkcUgHiMGfAF+I6kQ3czgxUul/GJcMku1+GayslxS2eJzkotKc8HMk1zWpBo8kDSIlOgMLE3iU/ZC0ig6sck8SbOm7FnGJB2Ucj44SheNmRiUTjrE5cK90Pz/KL10kweZ42CSSD3RFPt7R8ZLIvdFcywsOu3BqYYiF/akLzu/6FQK/mdQJ3XZLvvLvZBYXuliz350L3R+U0FPWj+JKMjpls8+vv84z36nuPyWXws78TyaFfabPJPmf1TKvUf2NJdyPCn20ABl8tMiTmrZFvLjqLxUsk3kR/5jqWPbyMKaqfMgI/nb2KtUsc1kWbVTzLDt5Ps5blLBriDLZrkUP8AK8t1FLIXN/5rIVGelwVSN/WXbKrhpsF24v9nG2pAG47X4YVurTsahBWkQ4DECnQ8YMsBAB6YnYFIFXgXACwx57QKLBWCJAyzMkOVkWxG8akVwW+ketdK97cER1C03PZO8/rrDPe6QT1LgQxr5/Ac2LZCtFmSDCNjWQjbjkC1EYOMT2a5FNpmRrXFkQ7/FT0pjCOTwBDnygQ6qkOM16FAQOcqEDmChY2PssLtpRP8FfDxi8p8h5DsAAAAASUVORK5CYII=);
    background-size: 100% 100%;
    background-color: #fff;
    border-radius: 50%;
  }
  &.add {
    padding-top: 40rpx;
    .iconimg {
      display: block;
      width: 74rpx;
      height: 74rpx;
      position: relative;
      margin: 0 auto;
      &::before,
      &::after {
        content: '';
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background-color: $primary;
        border-radius: 10px;
      }
      &::after {
        width: 8rpx;
        height: 100%;
      }
      &::before {
        width: 100%;
        height: 8rpx;
      }
    }
    .tip {
      line-height: 36rpx;
      padding-top: 18rpx;
    }
  }
}
</style>
