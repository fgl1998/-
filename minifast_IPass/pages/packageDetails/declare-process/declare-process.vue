<template>
  <div class="declare-process h5-page">
    <ComponentPanel
      :title="projectName"
      v-if="isRequestOver && renderData.length > 0"
    >
      <div class="wrapper">
        <div class="items">
          <block v-for="item in renderData" :key="item.id">
            <div
              class="item"
              :class="[
                item.status === 1 ? 'active' : '',
                item.status === 2 ? 'ing' : ''
              ]"
            >
              <div class="name">{{ item.name }}</div>
              <div class="info">
                <!-- 宜宾不显示经办时间 -->
                <div class="cell" v-if="areaCode !== '511100'">
                  <div class="key">经办时间：</div>
                  <div class="value">{{ item.time }}</div>
                </div>
                <div class="cell con">
                  <div class="key">经办内容：</div>
                  <div class="value">{{ item.content }}</div>
                </div>
              </div>
              <i class="icon"></i>
            </div>
          </block>
          <i class="icon icon-line" :style="lineStyle"></i>
        </div>
        <div class="btn-wrapper" v-if="areaCode === '510400'">
          <div class="btn" @click.stop="handleViewProcess">
            <span>查询发放进度</span>
            <i class="iconfont iconfont-arrow-right-double"></i>
          </div>
        </div>
      </div>
    </ComponentPanel>
  </div>
</template>
<script>
import ComponentPanel from '@/components/common/ez-panel/ez-panel.vue'

import config from '@/config'
import { navigateBack, showModal, navigateTo } from '@/utils/uni-api'
import { requestB026 } from '@/service/api'

import { USER_LIST } from '@/store/constants'
import { mapGetters } from 'vuex'

export default {
  name: 'pageDeclareProcess',
  data() {
    return {
      projectName: '',
      renderData: [],
      isRequestOver: false,
      areaCode: ''
    }
  },
  components: {
    ComponentPanel
  },
  onLoad(e) {
    this.areaCode = config.areaCode

    let { cpb100, chb000 } = e
    if (cpb100 || chb000) {
      this._requestB026(cpb100, chb000)
    } else {
      showModal('cpb100或者chb000不存在，请检查数据！').then((res) => {
        navigateBack(1)
      })
    }
  },
  created() {},
  mounted() {},
  methods: {
    // 用于申报的当前流程图
    _requestB026(cpb100, chb000) {
      requestB026(cpb100, chb000)
        .then((res) => {
          const { list } = res.lists.pb11List
          if (list.length > 0) {
            let newList = []
            list.map((item, i) => {
              var {
                currentNode,
                handleFinish,
                che011,
                aae036,
                cpb103,
                chi031_desc
              } = item
              // #ifdef H5
              if (che011 == '微信小程序申报') {
                che011 = '天府市民云申报'
              }
              if (cpb103) {
                cpb103 = cpb103.replace('微信端', '天府市民云')
              }
              // #endif
              let obj = {
                id: i,
                name: che011,
                status: 1,
                time: aae036,
                content: cpb103 || '暂无'
              }

              if (currentNode === '1') {
                newList.push(obj)
              } else {
                if (handleFinish === '1') {
                  obj.status = 0
                  newList.push(obj)
                } else {
                  obj.status = 2
                  newList.push(obj)
                }
              }
              if (i === 0) {
                this.projectName = chi031_desc || '暂无'
              }
            })
            this.renderData = [...newList]
          } else {
            showModal('未查询到该条申报信息的审批流程！').then((res) => {
              navigateBack()
            })
          }
          this.isRequestOver = true
        })
        .finally(() => {})
    },
    // 跳转到个人补贴发放查询页查询补贴发放进度
    handleViewProcess() {
      navigateTo('subsidy-payment', 'packageQuery', { isFromProcess: true })
    }
  },
  computed: {
    ...mapGetters([USER_LIST]),
    lineStyle() {
      let str = ''
      const renderData = this.renderData
      const len = renderData.length
      const height = 300 * (len - 1) + 140
      str += `height: ${height}rpx;`
      if (height <= 2560) {
        str += `background-size: 20rpx 2560rpx;`
      } else {
        str += `background-size: 100% 100%;`
      }
      return str
    }
  },

  watch: {},
  onShow() {},
  onUnload() {}
}
</script>
<style lang="scss" scoped>
.declare-process {
  width: 100%;
  min-height: 100%;
  min-height: 100vh;
  padding: $spacing 0;
}
.wrapper {
  width: 100%;
  padding-bottom: 52rpx;
  padding-left: 68rpx;
  padding-right: 44rpx;
  padding-top: 40rpx;
  position: relative;

  .btn-wrapper {
    display: flex;
    align-items: center;
    justify-content: center;
    color: $primary;
    padding: 20rpx 0;
    .btn {
      display: flex;
      align-items: center;
      font-size: 28rpx;
      line-height: 60rpx;
      .iconfont {
        font-size: 26rpx;
        padding-left: 4rpx;
      }
    }
  }
}
.items {
  width: 100%;
  position: relative;
  .icon-line {
    position: absolute;
    top: 12rpx + 32rpx;
    width: 20rpx;
    height: 100%;
    left: -12rpx;
    z-index: 0;
    background-image: url(data:image/png;base64,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);
    background-size: 100% 100%;
    background-repeat: no-repeat;
    background-position: center bottom;
  }
}
.item {
  width: 100%;
  font-size: 28rpx;
  color: #666666;
  line-height: 40rpx;
  padding-left: 80rpx;
  padding-top: 12rpx;
  position: relative;
  .name {
    width: 100%;
    height: 64rpx;
    line-height: 64rpx;
    background-color: #edfaf1;
    border-radius: 32px;
    text-align: center;
    font-size: 30rpx;
    font-weight: 700;
    color: #51d574;
    margin-bottom: 24rpx;
  }
  .cell {
    margin-bottom: 12rpx;
    display: flex;
    &.con {
      height: 160rpx;
      max-height: 160rpx;
      overflow: hidden;
    }
  }
  .key {
    font-weight: 700;
  }
  .value {
    flex: 1;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 4;
    -webkit-box-orient: vertical;
  }
  .icon {
    position: absolute;
    top: 12rpx + 32rpx;
    left: -16rpx;
    width: 100rpx;
    height: 44rpx;
    transform: translateY(-50%);
    background: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAPAAAABoCAMAAAD4vo2OAAAA9lBMVEUAAACv//8txf8txv8txf8txv8txv8ux/831P9D5P9M//831P800f8txv882f9E5/9G6v9E5f9D5v9E5v9D5v9E5f9E5v9D5v9E5v9D5v9F5v9F5v9F5f9B4/8xy/8zz/9E5v8xy/8/3/8+3v883P872/862f851/8zzv8xzf8vyP8zzf80z/820f8/3v9A4f9G6P8txv9E5v////9D5f8sxP8txv9A4v8+3/8vyf8yzf800f831P872v851//P+f8wy/893f882/8zz/820v841v862P/3/v/j/P+a8v9p6/9g6f9G5v+x9f8ux/8uxv9Q5/+w9P+0/hxbAAAAM3RSTlMAAX96hYl1cDweBsKzji4QGfnz6eDZy8m/bmddO/5pSaSW8ezi3dPOpaGRXllPIvpYwKWcD+jgAAADFklEQVR42u3aaVPaUBgF4BvZhJYW2RepdG/tpia5IiJB2VXA/v8/07w5yS3OQKczSZ3byft8O/KFMycGkiAYY4wxxhhjjDHGGGOMMcYYY4z91472yL6ISqHZqVeKxUq90ywIHR1L25URkcg1ataGWiMntJO3ZVSFjVbZAqXcMoRm8nZUC2er1hbVrNBLPqpD+rBkbVU6FFqJauGTA2uHgxOhk5S3cDr0vqrv3cKZz2ZzZ3GnGmu1ccqOonC2ZMGtYyrOrQUlnf6PI1nYqKLZ/dJ8ZHmPv1c1OldHsnALvR4w7wbnAa+0hDZStgxdOFfGvuj7iIONy/p8A0naJCHCaGDGpbnFEq81hC6SUoYuXMP5ytwKZ66a0EUECxcwomNu5eBVba4kkjJ04SY+f80d8HncFJqIYOEziyzMHRYWORMuwzByuZzwvFSQC1nXd4L8QhHE2FeQj8g3gvyVfCHIryCTySCn0+kEObXJngihro7oPxzT9Xb7nHS7bbyBLrkmyDeuK3KDPJ1OB4PJYDIZIPfJuD8e95EvyehyNBoh98iwNxz2kIeuCw+yXK/Xkk5YMnThikXm5g5zi1TOfd3zoDAEha/dvmjsFx5AUHhCdanzWBX2OyOPeqAKo64qvJKAxqEKFy0yM3eYWaSo+naFB21pY2QsTJDdgbHwBFktPEbeXJiMRsHGyJuFyQqNqe7TFQa/MBpvFr7CxMiDgdf4cWHq2/cLgyqMfXFIkwvVGFnKNQo/1SHdDgbuGiisJka+DhaeIk/dxpgYeYKB3crIYzUxshp4iDwMGq+QV9QYAz/NSYsKt9s/XHgDb8hbgvyOvCfIH8hHgvxMQX6uIH8inwnya8+xCznlSrpOwy/c+ZuPpY6hyRVTwibJ+HzxSEivcHy+WvoLx+fiIWFLFP5Hl4c/dbs89BeOzw2AtKSFU/G5xZO2SSo+N/HS0iscn9u0/sLxuRGPwvn4PGrJSK9wfB6mZWxJhePzuDSDQzo+D8T9Qzo+P3n4vXBMftSyv0eOBGOMMcYYY4wxxhhjjDHGGGOMMcbi4BdiDoiYwCizmwAAAABJRU5ErkJggg==)
      no-repeat center center;
    background-size: 120rpx 52rpx;
    z-index: 1;
  }
  &.active {
    .name {
      background-image: linear-gradient(180deg, #a1e5ff 0%, #005fff 100%);
      color: #fff;
    }
    .icon {
      left: -22rpx;
      background-image: url(data:image/png;base64,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);
      background-size: 142rpx 64rpx;
    }
  }
  &.ing {
    color: #999;
    .name {
      color: #999;
      background-color: #eaf2ff;
    }
  }
}
</style>
