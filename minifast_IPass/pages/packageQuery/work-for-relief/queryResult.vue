<template>
  <view class="query-result">
    <div class="card" v-for="item in renderData" :key="item.chi933">
      <ComponentPanel :title="item.chi934">
        <div class="panel-content">
          <div class="details">
            <span class="title">开工时间</span>
            <span class="value">{{ item.chi938.split(' ')[0] || '暂无' }}</span>
          </div>
          <div class="details">
            <span class="title">预计结束时间</span>
            <span class="value">{{ item.chi939.split(' ')[0] || '暂无' }}</span>
          </div>
          <div class="details">
            <span class="title">总投资</span>
            <span class="value">{{
              item.chi93a ? item.chi93a + '万元' : '暂无'
            }}</span>
          </div>
          <div class="details">
            <span class="title">预计发放劳务报酬</span>
            <span class="value">{{
              item.chi93d ? item.chi93d + '万元' : '暂无'
            }}</span>
          </div>
          <div class="details">
            <span class="title">项目报名方式</span>
            <span class="value">{{ item.chi93h || '暂无' }}</span>
          </div>
          <div class="details details-last">
            <span class="title">项目报名地点</span>
            <span class="value">{{ item.chi93g || '暂无' }}</span>
          </div>
          <div class="navigation" @click="handleSelectAddress" v-if="false">
            <div class="iconfont iconfont-address icon-color"></div>
            <span class="nav-words">导航前往</span>
          </div>
          <div class="img-group" v-if="item.hi21_xcList.length > 0">
            <img
              v-for="imgItem in item.hi21_xcList"
              :key="imgItem.chi215"
              :src="baseUrl + imgItem.chi215"
              @click="handlePreviewImage([baseUrl + imgItem.chi215])"
              alt=""
              class="img-g"
            />
          </div>
          <div class="policy" v-if="item.hi21_zcList.length > 0">
            <div class="p-title">{{ policyTitle }}</div>
            <div class="p-list">
              <span
                v-show="index < 3"
                @click="
                  handlePreviewFile(baseUrl + itemZc.chi215, itemZc.chi212)
                "
                class="list-content"
                v-for="(itemZc, index) in item.hi21_zcList"
                :key="itemZc.chi215"
                >政策{{ index + 1 }}：{{ itemZc.chi212 }}</span
              >
            </div>
            <div class="view-policy" v-if="item.hi21_zcList.length > 3">
              <span @click="jumpToDetails(item.hi21_zcList, item.chi037_desc)"
                >查看政策详情&nbsp;></span
              >
            </div>
          </div>
        </div>
      </ComponentPanel>
    </div>
  </view>
</template>

<script>
import config from '@/config'
import ComponentPanel from '@/components/common/ez-panel/ez-panel.vue'
import { previewImage, navigateTo } from '@/utils/uni-api'
import { previewAndSaveFiles } from '@/utils/custom-api'
export default {
  name: 'QueryResult',
  components: {
    ComponentPanel,
  },
  props: {
    renderData: {
      type: Array,
      required: true,
    },
  },
  data() {
    return {
      baseUrl: config.requestUrl + '/upload/downloadFile/',
      policyTitle: '>>相关政策<<',
    }
  },
  methods: {
    // 预览图片
    handlePreviewImage(url) {
      previewImage(url)
    },
    // 预览政策文件
    handlePreviewFile(url, name) {
      const type = name.substring(name.lastIndexOf('.') + 1)
      previewAndSaveFiles(url, type)
    },
    // 跳转到政策详情页
    jumpToDetails(hi21_zcList, chi037_desc) {
      navigateTo('policy-relief', 'packageQuery', {
        hi21_zcList: JSON.stringify(hi21_zcList),
        chi037_desc,
      })
    },
  },
}
</script>

<style lang="scss" scoped>
.query-result {
  width: 100%;

  .card {
    width: 100%;

    &:not(:first-child) {
      margin-top: 30rpx;
    }
    .details {
      width: 100%;
      height: 105rpx;
      display: flex;
      align-items: center;
      border-top: 1rpx solid #dddddd;
      justify-content: space-between;

      .title {
        font-size: 32rpx;
        color: #444444;
      }

      .value {
        font-size: 32rpx;
        color: #999999;
      }
    }

    .details-last {
      border-bottom: 1rpx solid #dddddd;
    }

    .navigation {
      margin-top: 30rpx;
      width: 100%;
      display: flex;
      align-items: center;
      justify-content: flex-end;

      .icon-color {
        color: #006dec;
      }

      .nav-words {
        margin-left: 10rpx;
        font-size: 32rpx;
        color: #006dec;
      }
    }

    .img-group {
      margin-top: 30rpx;
      width: 100%;
      height: 160rpx;
      white-space: nowrap;
      overflow-x: auto;
      overflow-y: hidden;

      .img-g {
        display: inline-block;
        width: 220rpx;
        height: 160rpx;

        &:not(:first-child) {
          margin-left: 30rpx;
        }
      }
    }

    .policy {
      margin-top: 30rpx;
      width: 100%;

      .p-title {
        width: 100%;
        margin-top: 30rpx;
        display: flex;
        justify-content: center;
        font-size: 28rpx;
        color: #444444;
      }

      .p-list {
        width: 100%;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: flex-start;
        font-size: 28rpx;
        color: #999999;

        .list-content {
          margin-top: 24rpx;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
      }

      .view-policy {
        margin-top: 30rpx;
        width: 100%;
        display: flex;
        justify-content: flex-end;
        font-size: 28rpx;
        color: #006dec;
      }
    }
  }
}
</style>