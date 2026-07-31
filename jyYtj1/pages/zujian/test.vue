<template>
  <view class="test-page">
    <index
      :sidebarTitle="sidebarTitle"
      :sidebarDescription="sidebarDescription"
      :itemIndex="itemIndex"
      :title1="title1"
      :title2="title2"
      :menuList="menuList"
      :columnList="columnList"
      @type-change="handleTypeChange"
      @item-click="handleItemClick"
    ></index>

    <view class="debug-box">
      <view class="debug-title">sourece 组件测试结果</view>
      <view class="debug-item">当前菜单：{{ itemIndex }}</view>
      <view class="debug-item">当前标题：{{ title1 }}{{ title2 }}</view>
      <view class="debug-item">当前点击：{{ currentItemTitle || '暂无' }}</view>
    </view>

    <view class="debug-box industry-box">
      <view class="debug-title">行业选择弹窗组件测试</view>
      <industry-popup-selector
        v-model="industryName"
        :moduleId="industryCode"
        :dataSource="industryOptions"
        placeholder="请选择行业"
        searchPlaceholder="请输入行业名称"
        @setModalValue="handleIndustryChange"
      ></industry-popup-selector>

      <view class="debug-item">当前编码：{{ industryCode || '暂无' }}</view>
      <view class="debug-item">当前名称：{{ industryName || '暂无' }}</view>
      <view class="debug-item">当前路径：{{ industryPath || '暂无' }}</view>
    </view>
  </view>
</template>

<script>
import index from './sourece/index.vue'
import IndustryPopupSelector from './sourece2/index.vue'

export default {
  name: 'test',
  components: {
    index,
    IndustryPopupSelector,
  },
  data() {
    return {
      sidebarTitle: '政策资讯',
      sidebarDescription: '用于测试 sourece 组件的传参与事件',
      itemIndex: 1,
      title1: '就业',
      title2: '资讯',
      currentItemTitle: '',
      menuList: [
        {
          value: 1,
          label: '就业资讯',
          icon: require('./sourece/assets/icon_policy1.png'),
        },
        {
          value: 2,
          label: '政策解读',
          icon: require('./sourece/assets/icon_policy2.png'),
        },
      ],
      listMap: {
        1: [
          {
            acz02q: '高校毕业生就业创业政策解读',
            acc645: '2026-03-25 10:00:00',
            isHot: '1',
          },
          {
            acz02q: '重点群体就业帮扶服务指南',
            acc645: '2026-03-24 09:30:00',
            isHot: '0',
          },
          {
            acz02q: '一次性扩岗补助申领流程说明',
            acc645: '2026-03-23 14:20:00',
            isHot: '1',
          },
          {
            acz02q: '灵活就业社会保险补贴政策问答',
            acc645: '2026-03-22 16:45:00',
            isHot: '0',
          },
          {
            acz02q: '就业见习补贴申请材料清单',
            acc645: '2026-03-21 11:15:00',
            isHot: '0',
          },
        ],
        2: [
          {
            acz02q: '最新就业促进政策权威解读',
            acc645: '2026-03-20 15:10:00',
            isHot: '1',
          },
          {
            acz02q: '创业补贴申报常见问题说明',
            acc645: '2026-03-19 13:00:00',
            isHot: '0',
          },
          {
            acz02q: '灵活就业扶持政策适用范围解答',
            acc645: '2026-03-18 09:20:00',
            isHot: '1',
          },
          {
            acz02q: '高校毕业生就业服务政策速览',
            acc645: '2026-03-17 11:30:00',
            isHot: '0',
          },
          {
            acz02q: '公益性岗位安置政策解读',
            acc645: '2026-03-16 08:45:00',
            isHot: '0',
          },
        ],
      },
      columnList: [],
      industryCode: '0102',
      industryName: '',
      industryPath: '',
      industryOptions: [
        {
          aab022: '01',
          aab022Desc: '制造业',
          children: [
            {
              aab022: '0101',
              aab022Desc: '装备制造',
              children: [
                {
                  aab022: '010101',
                  aab022Desc: '通用设备制造',
                },
                {
                  aab022: '010102',
                  aab022Desc: '专用设备制造',
                },
              ],
            },
            {
              aab022: '0102',
              aab022Desc: '食品制造',
            },
          ],
        },
        {
          aab022: '02',
          aab022Desc: '信息传输、软件和信息技术服务业',
          children: [
            {
              aab022: '0201',
              aab022Desc: '软件和信息技术服务业',
              children: [
                {
                  aab022: '020101',
                  aab022Desc: '基础软件开发',
                },
                {
                  aab022: '020102',
                  aab022Desc: '应用软件开发',
                },
              ],
            },
          ],
        },
        {
          aab022: '03',
          aab022Desc: '批发和零售业',
          children: [
            {
              aab022: '0301',
              aab022Desc: '零售业',
            },
            {
              aab022: '0302',
              aab022Desc: '批发业',
            },
          ],
        },
      ],
    }
  },
  onLoad() {
    this.updateContent(this.itemIndex)
  },
  methods: {
    handleTypeChange(value) {
      this.itemIndex = value
      this.currentItemTitle = ''
      this.updateContent(value)
      console.log('type-change', value)
    },
    handleItemClick(item) {
      this.currentItemTitle = item.acz02q
      console.log('item-click', item)
    },
    updateContent(value) {
      if (Number(value) === 1) {
        this.title1 = '就业'
        this.title2 = '资讯'
      } else {
        this.title1 = '政策'
        this.title2 = '解读'
      }
      this.columnList = this.listMap[value] || []
    },
    handleIndustryChange(item) {
      this.industryCode = item.value
      this.industryName = item.label
      this.industryPath = (item.pathLabels || []).join(' / ')
      console.log('industry-change', item)
    },
  },
}
</script>

<style lang="scss" scoped>
.test-page {
  min-height: 100vh;
  padding: 20px;
  box-sizing: border-box;
  background: #f5f7fb;
}

.debug-box {
  width: 100%;
  max-width: 1760px;
  margin: 0 auto;
  padding: 20px 24px;
  box-sizing: border-box;
  background: #ffffff;
  border-radius: 16px;
}

.industry-box {
  margin-top: 20px;
}

.debug-title {
  font-size: 20px;
  font-weight: 600;
  color: #333333;
  margin-bottom: 12px;
}

.debug-item {
  font-size: 16px;
  line-height: 28px;
  color: #666666;
  margin-top: 8px;
}
</style>
