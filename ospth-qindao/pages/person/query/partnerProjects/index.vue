<!-- 合作楼盘查询：移动端适配 -->
<template>
  <query-layout>
    <view class="con_layout">
      <!-- 筛选项 -->
      <view class="filter_section">
        <view class="form_row">
          <van-field
              input-align="right"
              readonly
              clickable
              :value="lpssqyLabel"
              label="楼盘区县"
              placeholder="请选择"
              @click="showLpssqyPicker = true"
          />
        </view>
        <view class="form_row">
          <van-field
              input-align="right"
              :value="form.xmmc"
              @input="form.xmmc = $event.detail || $event"
              label="楼盘名称"
              placeholder="请输入"
              clearable
          />
        </view>
        <view class="form_row">
          <van-field
              input-align="right"
              :value="form.xmdz"
              @input="form.xmdz = $event.detail || $event"
              label="楼盘地址"
              placeholder="请输入"
              clearable
          />
        </view>
        <view class="btn_row">
          <van-button type="primary" block color="#4788fe" @click="query">查询</van-button>
        </view>
      </view>

      <!-- 列表 -->
      <view class="list_section">
        <scroll-view scroll-y class="scroll_list">
          <view v-for="(row, i) in projectData" :key="i" class="list_item">
            <van-cell title="楼盘编号" :value="row.lpbh"/>
            <van-cell title="楼盘名称" :value="row.xmmc"/>
            <van-cell title="产权年限" :value="row.cqnx"/>
            <van-cell title="楼盘地址" :value="row.xmdz"/>
          </view>
          <view v-for="(row, i) in projectData" :key="i" class="list_item">
            <van-cell title="楼盘编号" :value="row.lpbh"/>
            <van-cell title="楼盘名称" :value="row.xmmc"/>
            <van-cell title="产权年限" :value="row.cqnx"/>
            <van-cell title="楼盘地址" :value="row.xmdz"/>
          </view>
          <view v-if="loading && (!projectData || projectData.length === 0)" class="empty_tip">加载中...</view>
          <view v-else-if="!projectData || projectData.length === 0" class="empty_tip">暂无数据</view>
        </scroll-view>
      </view>

      <!-- 楼盘区县选择 -->
      <van-popup v-model="showLpssqyPicker" position="bottom">
        <view class="picker_list">
          <view
              v-for="opt in lpssqyOptions"
              :key="String(opt.value)"
              class="picker_item"
              @click="onSelectLpssqy(opt)"
          >{{ opt.label }}</view>
        </view>
      </van-popup>
    </view>
  </query-layout>
</template>

<script>
import { mapActions, mapMutations } from 'vuex'
import codeTableMixin from '@osppm/mixin/codeTableMixin'

export default {
  name: 'loanableProjectQuery',
  mixins: [codeTableMixin],
  data () {
    return {
      form: { lpssqy: '', xmmc: '', xmdz: '' },
      projectData: [],
      residentialAreaList: [],
      showLpssqyPicker: false,
      loading: false,
    }
  },
  computed: {
    lpssqyOptions () {
      return [{ value: '', label: '请选择' }, ...(this.residentialAreaList || [])]
    },
    lpssqyLabel () {
      if (!this.form.lpssqy) return ''
      const o = (this.residentialAreaList || []).find(i => String(i.value) === String(this.form.lpssqy))
      return o ? o.label : this.form.lpssqy
    },
  },
  onLoad (options) {
    if (options && options.projectNo) {
      this.setYwdjh(options.projectNo)
    }
  },
  async mounted () {
    await this.initCodeTable(['LPSSQY'])
    this.residentialAreaList = this.getCodeList('LPSSQY') || []
    await this.query()
  },
  methods: {
    ...mapActions('partnerProjects', ['queryObtainAcceptLoanProj']),
    ...mapMutations('partnerProjects', ['setYwdjh']),
    onSelectLpssqy (opt) {
      this.form.lpssqy = opt.value != null ? opt.value : ''
      this.showLpssqyPicker = false
    },
    async query () {
      try {
        this.loading = true
        const queryData = {
          lpssqy: this.form.lpssqy,
          xmmc: this.form.xmmc,
          xmdz: this.form.xmdz,
        }
        const response = await this.queryObtainAcceptLoanProj({ ...queryData })
        this.projectData = response.data?.list || []
      } catch (error) {
        const msg = (error && (error.message || error.msg)) ? (error.message || error.msg) : String(error)
        uni.showToast({ title: msg || '查询失败', icon: 'none' })
        this.projectData = []
      } finally {
        this.loading = false
      }
    },
  },
}
</script>

<style scoped lang="scss">
.con_layout {
  min-height: 100vh;
  //padding-top: calc(24rpx + env(safe-area-inset-top));
  background: #f5f5f5;
  box-sizing: border-box;
}

.page_title {
  font-size: 36rpx;
  font-weight: 600;
  color: #333;
  margin-bottom: 24rpx;
}

.filter_section {
  background: #fff;
  border-radius: 16rpx;
  margin-bottom: 24rpx;
  box-shadow: 0 4rpx 16rpx rgba(0, 0, 0, 0.06);

  .form_row {
  }

  .btn_row {
    margin-top: 24rpx;
    margin-bottom: 0;
    padding: 24rpx;
  }
}

.list_section {
  overflow: hidden;
}

.scroll_list {
  max-height: 65vh;
}

.list_item {
  margin-bottom: 24rpx;
  border-bottom: 1rpx solid #f0f0f0;

  &:last-of-type {
    border-bottom: none;
  }

  .row {
    display: flex;
    align-items: flex-start;
    min-height: 56rpx;
    font-size: 28rpx;
    line-height: 1.5;

    .label {
      flex-shrink: 0;
      min-width: 180rpx;
      color: #666;
    }

    .value {
      flex: 1;
      color: #333;
      word-break: break-all;
    }
  }
}

.empty_tip {
  text-align: center;
  color: #999;
  font-size: 28rpx;
  padding: 48rpx 0;
}

.picker_list {
  padding: 24rpx 0 48rpx;
  padding-bottom: calc(48rpx + env(safe-area-inset-bottom));

  .picker_item {
    padding: 28rpx 32rpx;
    font-size: 30rpx;
    color: #333;

    &:active {
      background-color: #f5f5f5;
    }
  }
}
</style>
