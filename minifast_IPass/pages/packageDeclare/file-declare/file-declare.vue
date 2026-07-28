<template>
  <view class="file">
    <block v-for="(item, index) in renderData" :key="item.id">
      <div class="item-wrapper" :class="[item.isLimit ? '' : 'no-limit']">
        <!-- 示例文件 -->
        <div class="item-example">
          <div class="left">
            {{ item.che09a === '1' ? '必传材料' : '非必传材料' }}
          </div>
        </div>
        <div class="item-title">{{ item.name }}</div>
        <block
          v-for="(uploadItem, uploadIndex) in item.files"
          :key="uploadIndex"
        >
          <div class="item-upload">
            <img
              class="eg uploaded"
              :src="uploadItem.path ? uploadItem.path : uploadItem.staticPath"
              alt="img"
              @click="handlePreviewImage(index, uploadIndex)"
            />
          </div>
        </block>
      </div>
    </block>
  </view>
</template>

<script>
import imageNoImg from './images/no-img.png'
import config from '@/config/index'

import { navigateBack, showModal, previewImage } from '@/utils/uni-api'
import { requestB011 } from '@/service/api'
import { USER_INFO, USER_LIST } from '@/store/constants' // 常量
import { mapGetters } from 'vuex'
export default {
  name: 'pageDeclareFile',
  data() {
    return {
      aka131: '', // 人员类别
      chi031: '', // 项目编号
      fileList: '', // 上传的文件
      isRequestOver: false, // 是否请求完毕
      renderData: [],
    }
  },
  components: {},
  // 监听页面加载，其参数为上个页面传递的数据，参数类型为Object（用于页面传参）
  onLoad(e) {
    const { aka131, chi031, fileList } = e
    if (fileList) {
      this.fileList = JSON.parse(fileList)
    }
    if (aka131) {
      this.aka131 = aka131
    }
    if (chi031) {
      this.chi031 = chi031
    }
    if (aka131 && chi031) {
      this._requestB011()
    }
  },
  // 监听页面初次渲染完成
  onReady() {},
  // 监听页面显示
  onShow() {},
  // 监听页面隐藏
  onHide() {},
  methods: {
    // 请求配置文件
    _requestB011() {
      const chi031 = this.chi031
      const aka131 = this.aka131

      let data = [] // 存放最终结果

      requestB011(chi031, true, false)
        .then((res) => {
          const { list } = res.lists.he11List
          if (list && list.length > 0) {
            // 筛选遍历相应人员类别对应的材料
            list.map((item) => {
              const filter_arr = aka131.split(',')
              if (filter_arr.includes(item.aka131)) {
                data.push(item)
              }
            })
            this.formatData(data)
          } else {
            this.formatData([])
            showModal('该补贴项目暂未配置上传材料，请配置后重试！').then(
              (res) => {
                navigateBack(1)
              }
            )
          }
        })
        .catch((err) => {
          this.formatData([])
          showModal('加载失败，请稍后重试！').then((res) => {
            navigateBack(1)
          })
        })
    },
    // 格式化请求到的配置文件
    async formatData(listData) {
      const { requestUrl } = config
      const fileList = this.fileList
      const dataLen = listData.length
      const fileLen = fileList.length

      // 已经上传的图片添加网络图片链接
      let fileArr = []
      if (fileList && fileLen > 0) {
        for (let i = 0; i < fileLen; i++) {
          const item = fileList[i]
          fileArr.push({
            che110: item.che110,
            path: requestUrl + '/upload/downloadFile/' + item.chi215,
          })
        }
      }

      const renderData = []
      if (listData && dataLen > 0) {
        for (let i = 0; i < dataLen; i++) {
          const item = listData[i]

          // 渲染 item
          let renderItem = {
            id: 'che110_' + item.che110 + '_' + i,
            name: item.che091, // 名称 用于标题提示
            che09a: item.che09a,
            che110: item.che110,
            files: [], // 包含文件
          }
          // 渲染文件详情
          let fileItem = {
            id: 'file_' + item.che110 + '_' + i,
            path: '',
            staticPath: imageNoImg,
          }

          // 最大页数限制
          if (item.che09c) {
            let num = 0
            for (let j = 0, jLen = fileArr.length; j < jLen; j++) {
              const jItem = fileArr[j]
              if (jItem.che110 === item.che110) {
                num++
                // 渲染文件详情
                let fileItem = {
                  id: 'file_' + jItem.che110 + '_' + j,
                  path: jItem.path,
                  staticPath: imageNoImg,
                }
                renderItem.files.push(fileItem)
              }
            }
            // 没有上传的情况 设置默认图片提醒
            if (num === 0) {
              renderItem.files.push(fileItem)
            }
          } else {
            let pageNumber = parseInt(item.che094)
            for (let j = 0; j < pageNumber; j++) {
              // 渲染文件详情
              let fileItem = {
                id: 'file_' + item.che110 + '_' + j,
                path: '',
                staticPath: imageNoImg,
              }
              renderItem.files.push(fileItem)
            }

            // 修改图片的真实路径
            let _fileArr = [...fileArr]
            for (let j = 0, jLen = renderItem.files.length; j < jLen; j++) {
              const jItem = renderItem.files[j]
              for (let z = 0, len3 = _fileArr.length; z < len3; z++) {
                const item3 = _fileArr[z]
                if (item.che110 === item3.che110) {
                  jItem.path = item3.path
                  _fileArr.splice(z, 1)
                  break
                }
              }
            }
          }

          renderData.push(renderItem)
        }
      }
      this.renderData = [...renderData]
    },
    // 预览图片
    handlePreviewImage(i, j) {
      const item = this.renderData[i]
      const urls = []
      const files = item.files
      files.map((e) => {
        if (e.path) {
          urls.push(e.path)
        }
      })
      const current = urls[j]
      if (current) {
        previewImage(urls, current)
      } else {
        showModal('该图片申报人未上传，请查看其他已上传图片！')
      }
    },
  },
  computed: {
    ...mapGetters([USER_INFO, USER_LIST]),
  },
  watch: {},
}
</script>

<style lang="scss" scoped>
.file {
  padding: $spacing;
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
    .eg {
      width: 560rpx;
      height: 340rpx;
      margin: auto;
      background-color: #efefef;
      &.uploaded {
        width: 100%;
        height: 100%;
      }
    }
    .tip {
      white-space: nowrap;
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      z-index: 2;
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
      span {
        display: inline-block;
        line-height: 1.5;
        padding-top: 8rpx;
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
}
</style>
