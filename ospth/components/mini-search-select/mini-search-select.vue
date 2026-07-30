<template>
  <view class="mini-area-wrapper">
    <!-- 触发区域 -->
    <view class="pickYz" @click="open">
      <span class="resume-label">
        {{ selectedItem[labelKey] || '请选择' }}
      </span>
      <img src="/static/images/arrow-d.png" class="arrow" />
    </view>

    <!-- 弹窗 -->
    <mini-popup :isShowPopup="visible" :maskCloseable="true" @clickMask="close">
      <view class="popup-content-wrapper round">
        <!-- 顶部工具栏 -->
        <view class="toolbar">
          <view class="left"></view>
          <view class="center">请选择</view>
          <view class="right" @click="confirm">确认</view>
        </view>

        <!-- 搜索框 -->
        <view class="search-box">
          <u-input v-model="keyword" :placeholder="placeholder" clearable @input="onSearch" />
        </view>

        <!-- 单选列表 -->
        <scroll-view scroll-y class="list">
          <view
            v-for="(item, index) in list"
            :key="index"
            class="list-item"
            :class="{ active: index === activeIndex }"
            @click="select(item, index)"
          >
            <span>{{ item[labelKey] }}</span>
            <u-icon v-if="index === activeIndex" name="checkmark" color="#3b93f7" size="32" />
          </view>

          <view v-if="!list.length" class="empty"> 暂无数据 </view>
        </scroll-view>
      </view>
    </mini-popup>
  </view>
</template>

<script>
export default {
  name: 'mini-search-select',
  props: {
    label: String,
    placeholder: {
      type: String,
      default: '请输入关键字',
    },
    api: {
      // 搜索方法，必须 return Promise
      type: Function,
      required: true,
    },
    labelKey: {
      type: String,
      default: 'name',
    },
  },
  data() {
    return {
      visible: false,
      keyword: '',
      list: [],
      activeIndex: -1,
      selectedItem: {},
      timer: null,
    }
  },
  methods: {
    open() {
      this.visible = true
      this.keyword = ''
      this.list = []
      this.activeIndex = -1
    },
    close() {
      this.visible = false
    },
    onSearch(val) {
      clearTimeout(this.timer)
      this.timer = setTimeout(() => {
        this.fetchList(val)
      }, 300)
    },
    fetchList(keyword) {
      if (!keyword) {
        this.list = []
        return
      }
      this.api(keyword).then((res) => {
        console.log(res, 'res')

        this.list = res || []
        this.activeIndex = -1
      })
    },
    select(item, index) {
      this.activeIndex = index
      this.selectedItem = item
    },
    confirm() {
      if (!this.selectedItem[this.labelKey]) {
        this.$u.toast('请选择一项')
        return
      }
      this.visible = false
      this.$emit('confirm', this.selectedItem)
    },
  },
}
</script>

<style scoped lang="scss">
.pickYz {
  display: none;
  justify-content: space-between;
  align-items: center;
  height: 84rpx;
  padding: 0 30rpx;
  border: 1px solid #eee;
  background: #fff;
}

.arrow {
  width: 8px;
  height: 5px;
}

.popup-content-wrapper {
  height: 80vh;
  display: flex;
  flex-direction: column;
  background: #fff;
}

.toolbar {
  display: flex;
  justify-content: space-between;
  padding: 20rpx;
  border-bottom: 1px solid #eee;
}

.search-box {
  padding: 20rpx;
}

.list {
  flex: 1;
}

.list-item {
  padding: 24rpx 30rpx;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 28rpx;
}

.list-item.active {
  color: #3b93f7;
}

.empty {
  text-align: center;
  color: #999;
  padding: 40rpx;
}
</style>
