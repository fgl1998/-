<!-- 房屋信息、项目信息 -->
<template>
  <div>
    <box-title title="房屋信息"/>

    <van-form ref="form" :scroll-to-error="true">
      <van-form-item-map
          v-for="(item, index) in formConfig.fields"
          :key="index"
          v-if="!item.if || item.if(formData)"
          :formItemConfig.sync="item"
          :formData="formData"
      />
    </van-form>

    <box-title title="老旧小区项目"/>
    <van-form-item-map
        v-for="(item, index) in formConfig.fields2"
        :key="index"
        v-if="!item.if || item.if(formData)"
        :formItemConfig.sync="item"
        :formData="formData"
    />

    <van-popup v-model="showSearch" position="bottom" class="search-content" :style="{ height: '80%' }">
      <!-- 搜索栏 -->
      <view class="search-bar">
        <van-search v-model="searchData" placeholder="请输入项目名称" />
        <van-button class="search-button" color="#1492ff" type="primary" @click="onSearch">搜索</van-button>
      </view>

      <!-- 项目列表 -->
      <view class="project-item" v-for="(item,index) in projectList" :key="index" @click="selectProject(index)">
        <van-cell title="项目名称" :value="item.xmmc" />
        <van-cell title="项目类别" :value="item.xmbm" />
        <van-cell title="楼号栋号" :value="item.lhdh" />
        <van-cell title="所在单元" :value="item.szdy" />
        <van-cell title="居民户数" :value="item.jmhs" />
        <van-cell title="出资金额" :value="item.czje" />
      </view>
    </van-popup>
  </div>
</template>
<script>
import mixin from '@osppm/store/person/fetch/elevatorInstall/two/mixin'

export default {
  name: 'two',
  mixins: [mixin],
  data() {
    return {
    }
  }
}
</script>
<style scoped lang="scss">
.search-content{
  display: flex;
  flex-direction: column;
  padding-bottom: 24rpx;

  .search-button{
    width: 145rpx;
    height: 70rpx;
    margin-right: 20rpx;
  }

  /* 弹出层整体 */
  .search-content {
    box-sizing: border-box;
  }

  /* 搜索栏布局 */
  .search-bar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20rpx;
  }

  /* 搜索框宽度 */
  .search-bar .van-search {
    width: 100%;
  }

  /* 项目卡片 */
  .project-item {
    border: 1rpx #EEEEEE solid;
    margin: 0 24rpx 20rpx;
    border-radius: 16rpx;
    box-shadow: 0 4rpx 16rpx rgba(0, 0, 0, 0.06);
    padding: 12rpx;
  }
}

/deep/ .project-item .van-cell {
  font-size: 28rpx;
  line-height: 2;
  padding: 12rpx 12rpx;
}
</style>
