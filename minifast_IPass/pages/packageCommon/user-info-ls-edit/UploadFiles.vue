<template>
  <div class="upload-files-wrapper" v-if="renderData && renderData.length > 0">
    <block v-for="(item, index) in renderData" :key="item.id">
      <div class="item-wrapper" :class="[item.isLimit ? '' : 'no-limit']">
        <div class="item-example">
          <div class="left">
            {{ item.isRequired ? '必传材料' : '非必传材料' }}
          </div>
        </div>
        <div class="item-title">
          <div class="left">{{ item.name }}</div>
          <div class="right">
            <span class="uplaod">{{ item.uploadNum || 0 }}</span>
            <span>/</span>
            <span>{{ item.uploadMaxNum }}</span>
          </div>
        </div>
        <div class="img-wrapper d-f ai-c fw-w">
          <block
            v-for="(uploadItem, uploadIndex) in item.files"
            :key="uploadIndex"
          >
            <div class="img-item" v-if="uploadItem.path">
              <img
                :src="uploadItem.path"
                alt=""
                @click="handlePreviewImage(index, uploadIndex)"
              />
              <i
                class="iconfont iconfont-clear"
                @click.stop="handleDeleteFile(index, uploadIndex)"
              ></i>
            </div>
          </block>
          <div
            class="img-item add"
            v-if="item.isCanUpload"
            @click="handleChooseFile(index)"
          >
            <div class="icon"></div>
            <div>上传材料</div>
          </div>
        </div>
      </div>
    </block>
  </div>
</template>

<script>
import {
  chooseImage,
  previewImage,
  uploadFile,
  showLoading,
  hideLoading,
  showModal,
} from '@/utils/uni-api'
import { USER_LIST } from '@/store/constants' // 常量
import { mapGetters } from 'vuex'
import config from '@/config'
const { requestUrl } = config
// 默认文件带有的信息
const defaultFileInfo = {
  id: '',
  // 英文名 用于文件上传
  name_en: '',
  // 中文名 用于文件上传提示
  name_zh: '',
  // 文件网络地址
  path: '',
  // 文件提示本地地址
  staticPath: '',
  // 文件示例地址
  examplePath: '',
  // 文件示例本地地址
  exampleStaticPath: '',
  // 文件示例类型 两种类型 image 图片 page 页面
  exampleType: '',
  // 文件大小
  size: 0,
  // 是否必须上传
  isRequired: false,
  // 是否上传成功
  isUploadSuccess: false,
}

export default {
  name: 'uploadFiles',
  props: {
    // 数据
    renderList: {
      type: [Array],
      required: true,
    },
  },
  data() {
    return {
      urlUpload: '/upload/uploadFile',
      renderData: [],
    }
  },
  components: {},
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
    // 获取渲染数据
    getRenderData(val) {
      let arr = []
      const listData = val
      const len = listData.length
      if (listData && len > 0) {
        for (let i = 0; i < len; i++) {
          let item = listData[i]
          // 渲染 item
          let rendItem = {
            id: 'che092_' + item.che092, // id
            isLimit: true, // 是否限制文件上传规定页数
            uploadMaxNum: 0, // 最多上传页数 配合 isLimit 使用
            uploadMinNum: 1, // 至少上传页数 配合 isLimit 使用
            isCanUpload: true, // 是否能够继续上传 配合 isLimit 使用
            name: item.che091, // 名称 用于标题提示
            isRequired: false, // 材料是否为必传 此属性的值和 files 中 item.isRequired 的值一致
            files: [], // 包含文件
            isHavePreviewFile: false, // 是否含有示例文件
          }
          // 单类型材料上传的文件
          let fileItem = Object.assign({}, defaultFileInfo)

          // 处理必传材料
          if (item.che09a === '1') {
            rendItem.isRequired = true
            fileItem.isRequired = true
          }
          // 处理是否上传限制规定页数材料
          if (item.che09c) {
            rendItem.isLimit = false
            rendItem.uploadMaxNum = parseInt(item.che09c)
          }

          // 处理资料文件上传页码大于0 优先获取上传限制页数
          const pageNumber = parseInt(item.che09c || item.che094)
          rendItem.uploadMaxNum = pageNumber
          for (let j = 0; j < pageNumber; j++) {
            fileItem = {
              ...fileItem,
              ...item,
            }

            fileItem.staticPath = ''
            fileItem.id = 'file_' + item.che092 + '_' + j
            fileItem.name_zh = rendItem.name
            fileItem.name_en = fileItem.id
            rendItem.files.push(fileItem)
          }
          arr.push(rendItem)
        }
      }
      console.log(arr, 9876543)
      this.renderData = [...arr]
    },
    // 预览文件
    handlePreviewImage(i, j) {
      const renderData = [...this.renderData]
      let item = renderData[i].files[j]
      const files = renderData[i].files
      const urls = []
      files.forEach((file) => {
        if (file.path) {
          urls.push(file.path)
        }
      })
      previewImage(urls, item.path)
    },

    // 处理选择文件
    handleChooseFile(i) {
      const renderData = [...this.renderData]
      let item = renderData[i]
      let fileItem = {}
      let fileIndex = 0
      for (let index = 0, len = item.files.length; index < len; index++) {
        const ele = item.files[index]
        if (!ele.path) {
          fileItem = {
            ...ele,
          }
          fileIndex = index
          break
        }
      }

      chooseImage(1).then((res) => {
        showLoading('上传中')
        // 目前只针对处理上传时选择一张图片
        const tempFile = res.tempFiles[0]
        const { path, size } = tempFile

        fileItem.size = size
        this.requestUploadFile(path)
          .then((res) => {
            const data = JSON.parse(res.data)
            const { errors } = data
            // 上传出现错误
            if (errors && errors.length > 0) {
              const errorMsg = errors[0].msg
              fileItem.isUploadSuccess = false
              showModal(errorMsg).then(() => {
                fileItem.path = ''
                fileItem.size = ''
                item.files[fileIndex] = {
                  ...fileItem,
                }
                this.renderData = [...renderData]
              })
            } else {
              const { resultData } = data.data
              if (resultData.code == '-1') {
                fileItem.isUploadSuccess = false
                showModal(resultData.message)
              } else {
                const { fileid, filename } = resultData.data
                fileItem.path = requestUrl + '/upload/downloadFile/' + fileid
                fileItem.isUploadSuccess = true
                fileItem.fileid = fileid
                fileItem.filename = filename
              }
              item.files[fileIndex] = {
                ...fileItem,
              }

              // 计算是否添加可用
              let num = 0
              item.files.map((ele) => {
                if (ele.path) {
                  num++
                }
              })
              item.uploadNum = num
              if (item.isLimit) {
                if (num < item.files.length) {
                  item.isCanUpload = true
                } else {
                  item.isCanUpload = false
                }
              } else {
                if (num < item.uploadMaxNum) {
                  item.isCanUpload = true
                } else {
                  item.isCanUpload = false
                }
              }

              this.renderData = [...renderData]
            }
          })
          .catch((err) => {
            fileItem.isUploadSuccess = false
            item.files[fileIndex] = {
              ...fileItem,
            }
            this.renderData = [...renderData]
            showModal(err.errMsg)
          })
          .finally(() => {
            hideLoading()
          })
      })
    },

    // 处理删除文件
    handleDeleteFile(i, j) {
      const renderData = [...this.renderData]
      let item = renderData[i]
      let fileItem = item.files[j]
      fileItem.path = ''
      fileItem.isUploadSuccess = false
      fileItem.fileid = ''
      fileItem.filename = ''

      // 计算是否添加可用
      let num = 0
      item.files.map((ele) => {
        if (ele.path) {
          num++
        }
      })
      item.uploadNum = num
      if (item.isLimit) {
        if (num < item.files.length) {
          item.isCanUpload = true
        } else {
          item.isCanUpload = false
        }
      } else {
        if (num < item.uploadMaxNum) {
          item.isCanUpload = true
        } else {
          item.isCanUpload = false
        }
      }

      this.renderData = [...renderData]
    },

    // 检测文件上传状态
    checkFilesUploadStatus() {
      const renderData = [...this.renderData]
      let tagError = false // 标记 是否有未上传资料
      let tagErrorStr = '' // 标记 是否有未上传资料
      // console.log('renderData', renderData)
      // 返回结果
      let result = {
        status: '1', // 0 失败 1 成功
        data: [],
      }
      // 上传失败或者未上传
      const uploadError = []
      for (let i = 0, len = renderData.length; i < len; i++) {
        const item = renderData[i]
        // 非必传 跳过
        if (!item.isRequired) {
          continue
        } else {
          // 必传
          // 限制上传页数
          if (item.isLimit) {
            const files = item.files
            for (let j = 0, jLen = files.length; j < jLen; j++) {
              const itemFile = files[j]
              // 未上传成功
              if (!itemFile.isUploadSuccess) {
                uploadError.push(itemFile)
                tagError = true
                result.status = '0'
                break
              }
            }
            if (tagError) {
              break
            }
          } else {
            tagErrorStr = ''
            const files = item.files
            let itemFile = {}
            for (let j = 0, jLen = files.length; j < jLen; j++) {
              itemFile = files[j]
              if (itemFile.isUploadSuccess) {
                tagErrorStr = 'limit_success'
                break
              }
            }
            if (tagErrorStr !== 'limit_success') {
              uploadError.push(itemFile)
              tagError = true
              result.status = '0'
            }
          }
        }
      }
      // 有未上传成功文件
      if (uploadError.length > 0) {
        result.data = [...uploadError]
        return result
      } else {
        const successFils = []
        for (let i = 0, len = renderData.length; i < len; i++) {
          const item = renderData[i].files
          for (let j = 0, jLen = item.length; j < jLen; j++) {
            const itemfile = item[j]
            if (itemfile.isUploadSuccess) {
              successFils.push(itemfile)
            }
          }
        }
        result.data = [...successFils]
        return result
      }
    },
  },
  computed: {
    ...mapGetters([USER_LIST]),
  },
  watch: {
    renderList: {
      handler(val) {
        if (val && val.length > 0) {
          this.getRenderData(val)
        }
      },
      immediate: true,
    },
  },
}
</script>

<style lang="scss" scoped>
/* #ifdef MP-WEIXIN */
/* #endif */

$border-raidus: 16rpx;

view {
  box-sizing: border-box;
}

.upload-files-wrapper {
  width: 100%;
  color: $color;
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

  &.no-limit {
    padding-bottom: 0;
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

  .right {
    display: flex;
    align-items: center;
    font-size: 28rpx;
    font-weight: 500;
    color: $primary;

    .iconfont-arrow-right-double {
      font-size: 28rpx - 4rpx;
      font-weight: 400;
      padding-left: 4px;
    }
  }
}

.item-title {
  padding-right: $spacing;
  padding-left: $spacing + 26rpx;
  position: relative;
  font-size: 32rpx;
  font-weight: 700;
  line-height: 1;
  margin: $spacing 0 $spacing - 20rpx;
  display: flex;
  align-items: center;
  .left {
    flex: 1;
    overflow: hidden;
  }
  .right {
    color: #f00;
    margin-left: 20rpx;
  }
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
  align-items: center;
  width: 686rpx;
  width: 100%;
  height: 486rpx;
  padding: $spacing $spacing $spacing / 2;

  img {
    display: block;
  }

  .bg {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 486rpx;
  }

  /* #ifdef H5 */
  img[src=''],
  img:not([src]) {
    display: none;
  }

  /* #endif */

  .eg {
    width: 560rpx;
    height: 340rpx;
    margin: auto;

    &.uploaded {
      width: 100%;
      height: 100%;
      display: block;
    }
  }

  .tip {
    width: 100%;
    white-space: nowrap;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    z-index: 2;
    padding: 0 40rpx;

    .iconfont-camera {
      width: 160rpx;
      height: 160rpx;
      line-height: 160rpx;
      background-color: #cde2fe;
      background-color: tint($primary, 75);
      border-radius: 50%;
      font-size: 68rpx;
      margin: auto;
    }

    .span {
      width: 100%;

      line-height: 1.5;
      padding-top: 8rpx;
      white-space: normal;

      span {
        text-align: left;
        display: inline-block;
      }
    }
  }

  .iconfont-delete {
    font-size: 48rpx;
    position: absolute;
    right: $spacing + 20rpx;
    bottom: $spacing / 2 + 20rpx;
  }
}

.img-wrapper {
  padding: 30rpx;

  .img-item {
    width: 194rpx;
    height: 194rpx;
    margin-right: 24rpx;
    margin-bottom: 24rpx;
    position: relative;

    img {
      display: block;
      width: 100%;
      height: 100%;
      background-color: #f7f8fa;
      border-radius: 5rpx;
      overflow: hidden;
    }

    .iconfont-clear {
      font-size: 42rpx;
      position: absolute;
      right: -16rpx;
      top: -16rpx;
      color: #f00;
    }

    &:nth-of-type(3n) {
      margin-right: 0;
    }

    &.add {
      background-color: #f7f8fa;
      border-radius: 5rpx;
      font-size: 26rpx;
      font-weight: 700;
      line-height: 38rpx;
      color: $primary;
      text-align: center;
      padding-top: 40rpx;

      .icon {
        width: 74rpx;
        height: 74rpx;
        position: relative;
        margin: 0 auto;
        margin-bottom: 16rpx;

        &::before,
        &::after {
          content: '';
          position: absolute;
          border-radius: 8px;
          background-color: $primary;
        }

        &::before {
          width: 100%;
          height: 8rpx;
          left: 0;
          top: 50%;
          transform: translateY(-50%);
        }

        &::after {
          width: 8rpx;
          height: 100%;
          left: 50%;
          top: 0;
          transform: translateX(-50%);
        }
      }
    }
  }
}
</style>
