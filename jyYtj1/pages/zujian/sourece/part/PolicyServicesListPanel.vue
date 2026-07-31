<template>
  <section class="wrap-box">
    <div class="wrap-con">
      <div class="wrap-title">
        <div class="title-lt">
          <div class="lt-text">
            <span>
              <span class="text-highlight">{{ title1 }}</span>
              {{ title2 }}
            </span>
            / 点击下方列表可查看
          </div>
        </div>
      </div>
      <div class="wrap-service">
        <div class="service-rt">
          <div class="service-box">
            <div class="column-list">
              <div class="list-tab">
                <div class="list-con">
                  <div
                    v-for="(item, index) in columnList"
                    :key="index"
                    class="list-item"
                    @click="handleItemClick(item)"
                  >
                    <div class="item-box">
                      <div class="item-lt">
                        <i :class="['ic ic-item', item.isHot === '0' ? 'ic-point' : 'ic-text-hot']"></i>
                        <div class="item-title" :title="item.acz02q">{{ item.acz02q }}</div>
                      </div>
                      <div class="item-rt">
                        {{ formatDate(item.acc645) }}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
export default {
  name: 'PolicyServicesListPanel',
  props: {
    /**
     * 右侧标题第一段文字
     * @values 任意字符串
     */
    title1: {
      type: String,
      default: '就业',
    },
    /**
     * 右侧标题第二段文字
     * @values 任意字符串
     */
    title2: {
      type: String,
      default: '资讯',
    },
    /**
     * 右侧列表数据
     * @values [{ acz02q: 标题, acc645: 时间, isHot: 热点标识 }]
     */
    columnList: {
      type: Array,
      default() {
        return []
      },
    },
  },
  methods: {
    /**
     * 右侧列表点击事件
     * @values emit('item-click', item)
     */
    handleItemClick(item) {
      this.$emit('item-click', item)
    },
    /**
     * 时间格式化
     * @values 返回格式化后的时间字符串
     */
    formatDate(value) {
      if (this.$utils && this.$utils.dateFormat) {
        return this.$utils.dateFormat(value)
      }
      return value
    },
  },
}
</script>

<style lang="scss" scoped>
.wrap-box {
  flex: 1;
  width: calc(100% - 340px);
  height: 760px;
  min-width: 0;
  border-radius: 0 20px 20px 0;
  background-color: #ffffff;
}

.wrap-con {
  height: 100%;
  padding: 0 40px;
  box-sizing: border-box;
}

.wrap-title {
  padding: 42px 0 26px;

  .title-lt {
    // content: '';
    // position: absolute;
    // top: 50%;
    // left: 0;
    // -webkit-transform: translateY(-50%);
    // transform: translateY(-50%);
    // width: 8px;
    // height: 23px;
    // background: #0c6af7;
    // border-radius: 2px;
    .lt-text {
      font-size: 24px;
      color: #666666;
      line-height: 36px;
    }

    .text-highlight {
      color: #0c6af7 !important;
    }
  }
}

.wrap-service {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  height: calc(100% - 104px);

  .service-rt {
    width: 100%;
    height: 100%;
    position: relative;

    .service-box {
      overflow: hidden;
      height: 100%;
      box-sizing: border-box;
      background: url('../assets/service_rt_bg.png') left bottom repeat-x;
      background-size: 20px 12px;
    }
  }
}

.column-list {
  .list-tab {
    .list-con {
      height: 560px;
      overflow: hidden;

      .list-item {
        width: 100%;
        cursor: pointer;
        height: 80px;
        line-height: 80px;
        box-sizing: border-box;
        border-bottom: 2px dashed #cccccc;

        &:last-child {
          border-bottom: none;
        }

        .item-box {
          display: flex;
          align-items: center;
          justify-content: space-between;

          .item-lt {
            width: 80%;
            display: flex;
            align-items: center;
            justify-content: flex-start;

            .ic-item {
              &.ic-text-hot {
                margin-right: 10px;
                background-size: 100% 100%;
                width: 46px;
                height: 22px;
                background: url('../assets/ic_text_hot.png');
              }

              &.ic-point {
                margin-right: 20px;
                width: 8px;
                height: 8px;
                background: #999999;
                border-radius: 50%;
              }
            }

            .item-title {
              font-size: 24px;
              color: #333333;
              overflow: hidden;
              text-overflow: ellipsis;
              white-space: nowrap;
              width: 94%;
            }
          }

          .item-rt {
            width: 180px;
            font-size: 24px;
            color: #999999;
            text-align: right;
          }
        }
      }
    }
  }
}
</style>
