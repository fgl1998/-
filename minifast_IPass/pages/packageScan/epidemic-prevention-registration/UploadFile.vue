<template>
  <div class="upload-files-wrapper">
    <div class="item-wrapper">
      <!-- 示例文件 -->
      <div class="item-example">
        <div class="left">
          {{ isRequired ? '必传材料' : '非必传材料' }}
        </div>
      </div>
      <div class="item-title">{{ name }}</div>
      <div class="item-upload">
        <block v-if="uploadImageSrc">
          <img
            class="img"
            :src="uploadImageSrc"
            alt="img"
            @click="handlePreviewImage"
          />
          <i
            class="iconfont iconfont-delete"
            @click.stop="handleDeleteFile"
          ></i>
        </block>
        <div class="tip" v-else @click="handleChooseFile">
          <i class="iconimg iconimg-img"></i>
          <div class="text">点击上传</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import config from '@/config'

import {
  chooseImage,
  previewImage,
  uploadFile,
  showLoading,
  hideLoading,
  showModal,
} from '@/utils/uni-api'

export default {
  name: 'uploadFile',
  props: {
    // 材料名称
    name: {
      type: [String],
      default: '',
    },

    // 是否为必穿材料
    isRequired: {
      type: [Boolean],
      default: false,
    },
  },
  data() {
    return {
      urlUpload: '/upload/uploadFile',
      urlDownload: '/upload/downloadFile',
      uploadImageSrc: '',
    }
  },

  mounted() {},
  methods: {
    // 请求上传文件
    requestUploadFile(path) {
      let url = this.urlUpload
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

    // 预览文件
    handlePreviewImage() {
      const uploadImageSrc = this.uploadImageSrc
      previewImage([uploadImageSrc], uploadImageSrc)
    },

    // 处理选择文件
    handleChooseFile() {
      // 未上传 上传
      chooseImage(1).then((res) => {
        showLoading('上传中')
        // 目前只针对处理上传时选择一张图片
        const tempFile = res.tempFiles[0]
        const { path, size } = tempFile
        const file = {
          path,
          size,
        }
        this.requestUploadFile(path)
          .then((res) => {
            const data = JSON.parse(res.data)
            const { errors } = data
            // 上传出现错误
            if (errors && errors.length > 0) {
              const errorMsg = errors[0].msg
              showModal(errorMsg)
            } else {
              const { resultData } = data.data
              const { requestUrl } = config
              if (resultData.code === '200') {
                const { fileid, filename } = resultData.data
                file.src = requestUrl + '/upload/downloadFile/' + fileid
                file.fileid = fileid
                file.filename = filename
                this.uploadImageSrc = file.src
                this.$emit('change', file)
              } else {
                showModal(resultData.message)
              }
            }
          })
          .catch((err) => {
            showModal(err.errMsg)
          })
          .finally(() => {
            hideLoading()
          })
      })
    },

    // 处理删除文件
    handleDeleteFile() {
      this.uploadImageSrc = ''
      this.$emit('change', {})
    },
  },
  computed: {},
  watch: {},
}
</script>

<style lang="scss" scoped>
$border-raidus: 16rpx;

view {
  box-sizing: border-box;
}

.upload-files-wrapper {
  width: 100%;
  padding: 0 $spacing;
  color: #3d424d;
}

.item-wrapper {
  width: 100%;
  background-color: #fff;
  border-radius: $border-raidus;
  margin-bottom: $spacing;
  padding-bottom: 40rpx;
  overflow: hidden;

  &:last-child {
    margin-bottom: 0;
  }
}

.item-example {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 104rpx;
  background-color: #d9e7ff;
  background-color: rgba($color: $primary, $alpha: 0.25);
  padding: 0 $spacing;
  font-size: 32rpx;
  font-weight: 700;
}

.item-title {
  padding-right: $spacing;
  padding-left: $spacing + 26rpx;
  position: relative;
  font-size: 32rpx;
  font-weight: 700;
  line-height: 1;
  margin: $spacing 0;

  &::before {
    content: '';
    width: 8rpx;
    height: 32rpx;
    background-color: $primary;
    border-radius: 2rpx;
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    left: $spacing;
  }
}

.item-upload {
  width: 100%;
  font-size: 28rpx;
  font-weight: 700;
  text-align: center;
  line-height: 1;
  color: $primary;
  position: relative;
  display: flex;
  width: 686rpx;
  width: 100%;
  height: 346rpx;
  padding: 0 $spacing;

  img {
    display: block;
  }
  .img {
    width: 100%;
    height: 348rpx;
  }

  .tip {
    width: 100%;
    height: 348rpx;
    white-space: nowrap;
    background-color: #f8f8f8;
    border-radius: 4px;
    .iconimg-img {
      width: 120rpx;
      height: 88rpx;
      background: url(data:image/png;base64,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)
        no-repeat center center;
      background-size: 100% 100%;
      display: block;
      margin: 100rpx auto 0;
    }

    .text {
      width: 100%;
      font-size: 32rpx;
      line-height: 46rpx;
      color: #999;
      text-align: center;
      padding-top: 14rpx;
    }
  }

  .iconfont-delete {
    font-size: 48rpx;
    position: absolute;
    right: $spacing + 20rpx;
    bottom: $spacing / 2 + 20rpx;
  }
}
</style>
