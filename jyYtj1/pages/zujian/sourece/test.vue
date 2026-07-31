<template>
  <div class="test-page">
    <policy-services-section
      :sidebarTitle="sidebarTitle"
      :sidebarDescription="sidebarDescription"
      :itemIndex="itemIndex"
      :title1="title1"
      :title2="title2"
      :menuList="menuList"
      :columnList="columnList"
      @type-change="handleTypeChange"
      @item-click="handleItemClick"
    />

    <div class="debug-box">
      <div class="debug-title">测试结果</div>
      <div class="debug-item">当前菜单：{{ itemIndex }}</div>
      <div class="debug-item">当前标题：{{ title1 }}{{ title2 }}</div>
      <div class="debug-item">当前点击：{{ currentItemTitle || '暂无' }}</div>
    </div>
  </div>
</template>

<script>
import PolicyServicesSection from './index.vue'

export default {
  name: 'SoureceTest',
  components: {
    PolicyServicesSection,
  },
  data() {
    return {
      sidebarTitle: '政策资讯',
      sidebarDescription: '聚焦政策，把握机遇，原圆就业',
      itemIndex: 1,
      title1: '就业',
      title2: '资讯',
      currentItemTitle: '',
      menuList: [
        {
          value: 1,
          label: '就业资讯',
          icon: require('./assets/icon_policy1.png'),
        },
        {
          value: 2,
          label: '政策解读',
          icon: require('./assets/icon_policy2.png'),
        },
      ],
      listMap: {
        1: [
          {
            acz02q: '高校毕业生就业创业政策解读',
            acc645: '2026-03-25',
            isHot: '1',
          },
          {
            acz02q: '重点群体就业帮扶服务指南',
            acc645: '2026-03-24',
            isHot: '0',
          },
          {
            acz02q: '一次性扩岗补助申领流程说明',
            acc645: '2026-03-23',
            isHot: '1',
          },
          {
            acz02q: '灵活就业社会保险补贴政策问答',
            acc645: '2026-03-22',
            isHot: '0',
          },
          {
            acz02q: '就业见习补贴申请材料清单',
            acc645: '2026-03-21',
            isHot: '0',
          },
        ],
        2: [
          {
            acz02q: '最新就业促进政策权威解读',
            acc645: '2026-03-20',
            isHot: '1',
          },
          {
            acz02q: '创业补贴申报常见问题说明',
            acc645: '2026-03-19',
            isHot: '0',
          },
          {
            acz02q: '灵活就业扶持政策适用范围解答',
            acc645: '2026-03-18',
            isHot: '1',
          },
          {
            acz02q: '高校毕业生就业服务政策速览',
            acc645: '2026-03-17',
            isHot: '0',
          },
          {
            acz02q: '公益性岗位安置政策解读',
            acc645: '2026-03-16',
            isHot: '0',
          },
        ],
      },
      columnList: [],
    }
  },
  mounted() {
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
}
</style>
