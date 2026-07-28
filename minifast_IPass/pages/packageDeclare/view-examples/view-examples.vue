<template>
  <div class="view-examples">
    <!-- 示例图片 -->
    <div class="view-images" v-if="imgUrls.length > 0">
      <div class="tip">
        <span>小提示：点击图片预览，预览模式下长按保存！</span>
      </div>
      <image
        v-for="(item, index) in imgUrls"
        :key="index"
        :src="item.url"
        :mode="item.mode"
        @click="handleToPreview(item.url, item.type)"
      ></image>
    </div>
    <!-- 示例文件 -->
    <div class="view-files" v-if="filesUrls.length > 0">
      <ComponentPanel title="示例文件">
        <view
          @click="handleToPreview(item.url, item.type)"
          class="file-item"
          v-for="(item, index) in filesUrls"
          :key="index"
        >
          <div class="content">
            <div class="file-tip">
              <span>小提示：点击打开文件并下载到本地！</span>
            </div>
            <div class="file-content">
              <img src="./images/ppt.png" v-if="item.logo === 'pptLogo'" />
              <img
                src="./images/excel.png"
                v-else-if="item.logo === 'excelLogo'"
              />
              <img src="./images/word.png" v-else />
              <span>{{ item.name }}</span>
            </div>
          </div>
        </view>
      </ComponentPanel>
    </div>
  </div>
</template>

<script>
import config from '@/config/index.js'
import { previewAndSaveFiles } from '@/utils/custom-api/index'
import ComponentPanel from '@/components/common/ez-panel/ez-panel.vue'

export default {
  name: 'view-examples',
  data() {
    return {
      imgUrls: [],
      filesUrls: []
    }
  },
  components: { ComponentPanel },
  onLoad(e) {
    const { filesList } = e
    const files = JSON.parse(filesList)
    // 图片、文件下载基础url
    const baseUrl = config.requestUrl + '/upload/downloadFile/'
    // 文件只支持这些类型
    const fileTypes = ['doc', 'xls', 'ppt', 'pdf', 'docx', 'xlsx', 'pptx']
    const pptType = ['ppt', 'pdf', 'pptx']
    const excelType = ['xls', 'xlsx']
    // const wordType = ["doc", "docx"];
    files.forEach((item) => {
      const fileType = item.chi212.split('.').pop()
      fileTypes.includes(fileType)
        ? this.filesUrls.push({
            type: fileType,
            url: baseUrl + item.chi215 + '?fileType=' + fileType,
            name: item.chi212,
            logo: pptType.includes(fileType)
              ? 'pptLogo'
              : excelType.includes(fileType)
              ? 'excelLogo'
              : 'wordLogo'
          })
        : this.imgUrls.push({
            type: fileType,
            url: baseUrl + item.chi215,
            name: item.chi212,
            mode: 'scaleToFill'
          })
    })
  },
  methods: {
    handleToPreview(url, type) {
      previewAndSaveFiles(url, type)
    }
  }
}
</script>

<style lang="scss" scoped>
.view-examples {
  padding: 10px;
  height: 100vh;
  overflow: auto;
  .view-images {
    .tip {
      width: 100%;
      height: 30px;
      background-color: rgba(255, 0, 0, 0.1);
      span {
        padding-left: 5px;
        font-size: 14px;
        font-weight: 400;
        line-height: 30px;
        color: #333;
      }
    }
    image {
      width: 100%;
      height: 486rpx;

      &:not(:first-child) {
        margin-top: 10px;
      }
    }
  }

  .view-files {
    margin-top: 20px;

    .file-item {
      position: relative;
      width: 100%;
      height: 50px;
      &::before {
        content: '';
        position: absolute;
        width: 100%;
        left: 0;
        height: 50px;
        background-image: linear-gradient(180deg, #f6f7f8 0%, #ffffff 100%);
        z-index: $z-index;
      }

      &:not(:first-child) {
        margin-top: 10px;
      }

      .content {
        display: flex;
        flex-direction: column;
        .file-tip {
          margin: 2px 0 0 5px;
          z-index: $z-index-position;
          span {
            font-size: 10px;
            font-style: oblique;
            color: rgb(153, 153, 153);
          }
        }
        .file-content {
          height: 100%;
          display: flex;
          justify-content: start;
          align-items: center;
          margin: 5px 0 0 5px;

          img {
            width: 23px;
            height: 26px;
            z-index: $z-index-position;
          }

          span {
            z-index: $z-index-position;
            font-size: 28rpx;
            font-weight: 500;
            color: $color;
            word-break: keep-all;
            margin-left: 5px;
            @include textOverflow(2);
          }
        }
      }
    }
  }
}
</style>
