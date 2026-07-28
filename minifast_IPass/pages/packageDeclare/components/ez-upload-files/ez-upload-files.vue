<template>
  <div class="ez-upload-files-wrapper" v-if="renderData && renderData.length > 0">
    <block v-for="(item, index) in renderData" :key="item.id">
      <div class="item-wrapper" :class="[item.isLimit ? '' : 'no-limit']">
        <!-- 示例文件 -->
        <div class="item-example">
          <div class="left">
            {{ item.isRequired ? '必传材料' : '非必传材料' }}
          </div>
          <div class="right" @click="previewFiles(item.files)" v-if="item.isHavePreviewFile">
            <span>查看示例</span>
            <i class="iconfont iconfont-arrow-right-double"></i>
          </div>
        </div>
        <div class="item-title">{{ item.name }}</div>
        <block v-if="item.isLimit">
          <block v-for="(uploadItem, uploadIndex) in item.files" :key="uploadIndex">
            <div class="item-upload" @click="handleChooseFile(index, uploadIndex)">
              <img class="bg" :src="imageBg" alt="upload-file-bg" v-if="!uploadItem.path" />
              <img
                class="eg"
                :class="[uploadItem.path ? 'uploaded' : '']"
                :src="uploadItem.path ? uploadItem.path : uploadItem.staticPath"
                alt="img" />
              <div class="tip d-f fw-w" v-if="!uploadItem.path">
                <i class="iconfont iconfont-camera"></i>
                <div class="span">
                  <span>{{ uploadItem.name_zh + '上传' }}</span>
                </div>
              </div>
              <i
                class="iconfont iconfont-delete"
                v-if="uploadItem.path && uploadItem.che092 !== '1465'"
                @click.stop="handleDeleteFile(index, uploadIndex)"></i>
            </div>
          </block>
        </block>
        <block v-else>
          <div class="img-wrapper d-f ai-c fw-w">
            <block v-for="(uploadItem, uploadIndex) in item.files" :key="uploadIndex">
              <div class="img-item" v-if="uploadItem.path">
                <img :src="uploadItem.path" alt="" @click="handlePreviewImage(index, uploadIndex)" />
                <i
                  v-if="uploadItem.che092 !== '1465'"
                  class="iconfont iconfont-clear"
                  @click.stop="handleDeleteFile02(index, uploadIndex)"></i>
              </div>
            </block>
            <div class="img-item add" v-if="item.isCanUpload" @click="handleChooseFile02(index)">
              <div class="icon"></div>
              <div>上传材料</div>
            </div>
          </div>
        </block>
      </div>
    </block>
  </div>
</template>

<script>
  import imageBg from './images/bg.png'
  import imageIdcardPositive from './images/idcard-positive.png'
  import imageIdcardNegative from './images/idcard-negative.png'
  import imageHukouMain from './images/hukou-main.png'
  import ComponentImg from '@/components/common/ez-img/ez-img.vue'

  import config from '@/config'

  import {
    chooseImage,
    previewImage,
    uploadFile,
    downloadFile,
    showLoading,
    hideLoading,
    showModal,
    navigateBack,
    navigateTo
  } from '@/utils/uni-api'

  import { requestB011 } from '@/service/api'
  import { USER_LIST, EDIT_SUBSIDY_INFO } from '@/store/constants' // 常量
  import { mapGetters } from 'vuex'
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
    isUploadSuccess: false
  }

  export default {
    name: 'uploadFiles',
    props: {
      // 文件上传请求地址 主动加上前缀
      urlUpload: {
        type: [String],
        default: '/upload/uploadFile'
      },
      // 文件下载请求地址 主动加上前缀
      urlDownload: {
        type: [String],
        default: '/upload/downloadFile'
      },
      chi031: {
        type: [String],
        default: '20014'
      },
      // 过滤人员特有上传材料
      filter: {
        type: [String],
        default: ''
      },
      // 签名数据
      signData: {
        type: [Object],
        default: () => {
          return {}
        }
      }
    },
    data() {
      return {
        imageBg,
        // 渲染数据
        renderData: []
      }
    },
    components: {
      ComponentImg
    },
    mounted() {
      this.requestConfigFile()
    },
    methods: {
      // 查看示例
      previewFiles(files) {
        const filesList = []
        // files.forEach((item) => {
        //   filesList.push(...item.hi21List);
        // });
        // 只需要拿第一个，因为如果设置了最大上传数大于1，每个文件的示例文件数组hi21List都一样
        filesList.push(...files[0].hi21List)
        navigateTo('view-examples', 'packageDeclare', {
          filesList: JSON.stringify(filesList)
        })
      },
      // 请求配置文件
      requestConfigFile() {
        const chi031 = this.chi031
        const filter = this.filter
        let data = []

        requestB011(chi031, true, false)
          .then((res) => {
            const { list } = res.lists.he11List
            if (list && list.length > 0) {
              // 筛选遍历相应人员类别对应的材料
              list.map((item) => {
                const filter_arr = filter.split(',')
                if (filter_arr.includes(item.aka131)) {
                  data.push(item)
                }
              })
              // 筛选遍历不同人员类别对应的相同材料
              let dataObj = {}
              data.forEach((item) => {
                if (!dataObj['che092_' + item.che092]) {
                  dataObj['che092_' + item.che092] = item
                }
              })
              // 转换格式
              let tempArr = []
              for (let item in dataObj) {
                tempArr.push(dataObj[item])
              }
              data = [...tempArr]
              this.formatConfigData(data)
            } else {
              //this.formatConfigData([])
              showModal('该补贴项目暂未配置上传材料，请配置后重试！').then((res) => {
                navigateBack(1)
              })
            }
          })
          .catch((err) => {
            this.formatConfigData([])
            showModal('加载失败，请稍后重试！').then((res) => {
              navigateBack(1)
            })
          })
      },
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

      // 格式化请求到的配置文件
      formatConfigData(listData) {
        const len = listData.length
        if (listData && len > 0) {
          const renderData = []
          for (let i = 0; i < len; i++) {
            let item = listData[i]
            // 渲染 item
            let rendItem = {
              id: 'che092_' + item.che092, // id
              isLimit: true, // 是否限制文件上传规定页数
              uploadMaxNum: 0, // 最多上传页数 配合 isLimit 使用
              uploadMinNum: 1, // 至少上传页数 配合 isLimit 使用
              canUploadNum: 0, // 还可以上传文件数量 配合 isLimit 使用
              isCanUpload: true, // 是否能够继续上传 配合 isLimit 使用
              name: '', // 名称 用于标题提示
              isRequired: false, // 材料是否为必传 此属性的值和 files 中 item.isRequired 的值一致
              files: [], // 包含文件
              isHavePreviewFile: false // 是否含有示例文件
            }
            // 单类型材料上传的文件
            let fileItem = Object.assign({}, defaultFileInfo)

            // 处理一级file信息
            switch (item.che092) {
              case '100':
                rendItem.id = 'idcard'
                rendItem.name = '居民身份证'
                break
              case '101':
                rendItem.id = 'hukou'
                rendItem.name = '居民户口薄'
                break
              default:
                rendItem.id = 'other_' + item.che092
                rendItem.name = item.che091
                break
            }
            // 处理必传材料
            if (item.che09a === '1') {
              rendItem.isRequired = true
              fileItem.isRequired = true
            }
            // 处理是否上传限制规定页数材料
            if (item.che09c) {
              rendItem.isLimit = false
              rendItem.uploadMaxNum = parseInt(item.che09c)
              //初始还可以上传的文件数量与最大数量相同
              rendItem.canUploadNum = rendItem.uploadMaxNum
            }

            if (item.che092 == '1465' && this.signData) {
              fileItem = {
                ...fileItem,
                ...this.signData,
                isUploadSuccess: true
              }
            }

            // 处理资料文件上传页码大于0 优先获取上传限制页数
            const pageNumber = parseInt(item.che09c || item.che094)
            for (let j = 0; j < pageNumber; j++) {
              fileItem = {
                ...fileItem,
                ...item
              }
              fileItem.staticPath = ''
              // 处理 fileItem
              switch (item.che092) {
                case '100':
                  if (j === 0) {
                    fileItem.id = 'idcard_positive'
                    fileItem.name_zh = '身份证正面'
                    fileItem.staticPath = imageIdcardPositive
                  } else if (j === 1) {
                    fileItem.id = 'idcard_negative'
                    fileItem.name_zh = '身份证反面'
                    fileItem.staticPath = imageIdcardNegative
                  } else {
                    fileItem.id = 'idcard_' + j
                    fileItem.name_zh = '身份证'
                  }
                  break
                // case '101':
                //   if (j === 0) {
                //     fileItem.id = 'hukou_main'
                //     fileItem.name_zh = '户主页'
                //     fileItem.staticPath = imageHukouMain
                //   } else if (j === 1) {
                //     fileItem.id = 'hukou_own'
                //     fileItem.name_zh = '本人页'
                //   } else {
                //     fileItem.id = 'hukou_' + j
                //     fileItem.name_zh = '户口薄'
                //   }
                //   break
                default:
                  fileItem.id = 'file_' + item.che092 + '_' + j
                  fileItem.name_zh = rendItem.name
                  break
              }
              fileItem.name_en = fileItem.id
              rendItem.files.push(fileItem)
              // 判断是否存在示例文件，如果后台设置了最大上传数大于1那么只需要判断files数组的第一个即可
              if (rendItem.files.length > 0) {
                if (rendItem.files[0].hi21List && rendItem.files[0].hi21List.length > 0) {
                  rendItem.isHavePreviewFile = true
                } else {
                  rendItem.isHavePreviewFile = false
                }
              }
            }
            renderData.push(rendItem)
          }
          this.renderData = [...renderData]
          this.getUploadImages()
          //true表示需要上传材料
          this.$emit('change', true)
        } else {
          // 过滤对应的项目过后，存在项目不需要上传材料,直接设置请求按钮可见,现在this.$emit('change',false)其中的第二个参数表示该项目不需要上传材料
          this.$emit('change', false)
          return
        }
      },

      // 处理选择文件
      handleChooseFile(i, j) {
        const renderData = [...this.renderData]
        let item = renderData[i].files[j]
        if (item.path) {
          const files = renderData[i].files
          const urls = []
          files.forEach((file) => {
            if (file.path) {
              urls.push(file.path)
            }
          })
          previewImage(urls, item.path)
        } else {
          // 未上传 上传
          chooseImage(1).then((res) => {
            showLoading('上传中')
            // 目前只针对处理上传时选择一张图片
            const tempFile = res.tempFiles[0]
            const { path, size } = tempFile

            item.size = size
            this.requestUploadFile(path)
              .then((res) => {
                const data = JSON.parse(res.data)
                const { errors } = data
                // 上传出现错误
                if (errors && errors.length > 0) {
                  const errorMsg = errors[0].msg
                  item.isUploadSuccess = false
                  showModal(errorMsg).then(() => {
                    item.path = ''
                    item.size = ''
                    this.renderData = [...renderData]
                  })
                } else {
                  const { resultData } = data.data
                  const { requestUrl, areaCode } = config
                  if (resultData.code == '-1') {
                    item.isUploadSuccess = false
                    item.path = ''
                    item.size = ''
                    this.renderData = [...renderData]
                    showModal(resultData.message)
                  } else {
                    const { fileid, filename } = resultData.data
                    item.isUploadSuccess = true
                    // 资阳ftp上传模式 无法和其他地市一样获取图片
                    if (areaCode === '512000') {
                      item.path = path
                    } else {
                      item.path = requestUrl + '/upload/downloadFile/' + fileid
                    }
                    item.fileid = fileid
                    item.filename = filename
                  }
                }
              })
              .catch((err) => {
                item.path = ''
                item.isUploadSuccess = false
                showModal(err.errMsg)
              })
              .finally(() => {
                this.renderData = [...renderData]
                hideLoading()
              })
          })
        }
      },

      // 处理选择文件
      handleChooseFile02(i) {
        const renderData = [...this.renderData]
        let item = renderData[i]
        //canUploadNum还可以上传的数量
        let uploadNum = 0
        item.canUploadNum > 9 ? (uploadNum = 9) : (uploadNum = item.canUploadNum)
        chooseImage(uploadNum).then(async (res) => {
          // 对于多张图片上传
          const len = res.tempFiles.length
          for (let i = 0; i < len; i++) {
            showLoading('上传中')

            let fileItem = {} //获取模板文件字段
            //let fileIndex = 0
            for (let index = 0, len = item.files.length; index < len; index++) {
              const ele = item.files[index]
              if (!ele.path) {
                fileItem = {
                  ...ele
                }
                //fileIndex = index
                break
              }
            }

            const tempFile = res.tempFiles[i]
            const { path, size } = tempFile

            fileItem.size = size

            //for循环异步操作解决,使用await
            try {
              const uploadRes = await this.requestUploadFile(path)
              //console.log('uploadRes',uploadRes)
              const data = JSON.parse(uploadRes.data)
              const { errors } = data
              // 上传出现错误
              if (errors && errors.length > 0) {
                const errorMsg = errors[0].msg
                fileItem.isUploadSuccess = false
                showModal(errorMsg).then(() => {
                  fileItem.path = ''
                  fileItem.size = ''
                  // item.files[fileIndex] = {
                  //   ...fileItem
                  // }
                  item.files.push(fileItem)
                  this.renderData = [...renderData]
                })
              } else {
                const { resultData } = data.data
                if (resultData.code == '-1') {
                  fileItem.isUploadSuccess = false
                  showModal(resultData.message)
                } else {
                  const { requestUrl, areaCode } = config
                  const { fileid, filename } = resultData.data
                  if (areaCode === '512000') {
                    fileItem.path = path
                  } else {
                    fileItem.path = requestUrl + '/upload/downloadFile/' + fileid
                  }

                  fileItem.isUploadSuccess = true
                  fileItem.fileid = fileid
                  fileItem.filename = filename
                }
                // item.files[fileIndex] = {
                //   ...fileItem
                // }
                item.files.push(fileItem)
                // 计算是否添加可用
                let num = 0
                item.files.map((ele) => {
                  if (ele.path) {
                    num++
                  }
                })
                if (num < item.uploadMaxNum) {
                  item.isCanUpload = true
                  item.canUploadNum = item.uploadMaxNum - num
                } else {
                  item.isCanUpload = false
                  item.canUploadNum = 0
                }
                this.renderData = [...renderData]
              }
            } catch (err) {
              fileItem.isUploadSuccess = false
              // item.files[fileIndex] = {
              //   ...fileItem
              // }
              item.files.push(fileItem)
              this.renderData = [...renderData]
              showModal(err.errMsg)
            }
          }
          hideLoading()
        })
      },
      // 处理删除文件
      handleDeleteFile(i, j) {
        const renderData = [...this.renderData]
        let item = renderData[i].files[j]
        item.path = ''
        item.isUploadSuccess = false
        item.fileid = ''
        item.filename = ''
        this.renderData = [...renderData]
      },
      // 处理删除文件
      handleDeleteFile02(i, j) {
        const renderData = [...this.renderData]
        let item = renderData[i]
        renderData[i].files[j].path = ''
        renderData[i].files[j].isUploadSuccess = false
        renderData[i].files[j].fileid = ''
        renderData[i].files[j].filename = ''
        // let fileItem = item.files
        //let fileItem = item.files[j]
        // fileItem.path = ''
        // fileItem.isUploadSuccess = false
        // fileItem.fileid = ''
        // fileItem.filename = ''
        // fileItem.splice(j, 1)

        // 计算是否添加可用
        let num = 0
        item.files.map((ele) => {
          if (ele.path) {
            num++
          }
        })
        if (num < item.uploadMaxNum) {
          item.isCanUpload = true
          item.canUploadNum = item.uploadMaxNum - num
        } else {
          item.isCanUpload = false
          item.canUploadNum = 0
        }

        this.renderData = [...renderData]
      },
      // 清空 重新上传
      clear() {
        this.renderData = []
        this.requestConfigFile()
      },
      // 检测文件上传状态
      checkFilesUploadStatus() {
        const renderData = [...this.renderData]
        let tagError = false // 标记 是否有未上传资料
        let tagErrorStr = '' // 标记 是否有未上传资料
        // 返回结果
        let result = {
          status: '1', // 0 失败 1 成功
          data: []
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
      // 获取已上传的图片 资阳ftp模式上传的会存在问题
      async getUploadImages() {
        const { requestUrl } = config
        const { hi21List } = this.editSubsidyInfo
        const renderData = [...this.renderData]
        const renderDataLen = renderData.length
        if (!hi21List || renderDataLen < 1 || hi21List.length < 1) {
          return
        }
        const hi21ListLen = hi21List.length
        // 添加图片网络地址
        let tempArr = []
        for (let i = 0; i < hi21ListLen; i++) {
          const item = hi21List[i]
          tempArr.push({
            ...item,
            tempSrc: requestUrl + '/upload/downloadFile/' + item.chi215
          })
        }

        for (let i = 0; i < renderDataLen; i++) {
          const { files } = renderData[i]
          for (let j = 0, jLen = files.length; j < jLen; j++) {
            const jItem = files[j]

            for (let z = 0, zLen = tempArr.length; z < zLen; z++) {
              const zItem = tempArr[z]
              if (jItem.che110 === zItem.che110) {
                jItem.isUploadSuccess = true
                jItem.path = zItem.tempSrc
                jItem.filename = zItem.chi212
                jItem.fileid = zItem.chi215
                tempArr.splice(z, 1)
                break
              }
            }
          }
        }

        // 设置 isCanUpload
        for (let i = 0; i < renderDataLen; i++) {
          const item = renderData[i]
          const { files } = item
          let num = 0
          for (let j = 0, jLen = files.length; j < jLen; j++) {
            const jItem = files[j]
            if (jItem.path) {
              num++
            }
          }
          if (num >= item.uploadMaxNum) {
            item.isCanUpload = false
            item.canUploadNum = item.uploadMaxNum - num
          } else {
            item.isCanUpload = true
            item.canUploadNum = 0
          }
        }

        this.renderData = [...renderData]
      }
    },
    computed: {
      ...mapGetters([USER_LIST, EDIT_SUBSIDY_INFO])
    },
    watch: {}
  }
</script>

<style lang="scss" scoped>
  /* #ifdef MP-WEIXIN */
  /* #endif */

  $border-raidus: 16rpx;

  view {
    box-sizing: border-box;
  }

  .ez-upload-files-wrapper {
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
