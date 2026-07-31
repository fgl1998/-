<template>
  <div class="box-news">
    <header-tab
      :listArray="dataSource"
      :current="current"
      @change="changeTab"
      ref="tab">
      <img :src="imgSrc" alt="" slot="header_tab_img" />
    </header-tab>
    <div class="tab-content">
      <div class="list-box">
        <div
          class="list-item"
          v-for="(item, index) in currentList"
          :key="index">
          <div class="item-title">{{ item.title }}</div>
          <div class="item-time">{{ item.time }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import HeaderTab from './part/HeaderTab.vue';
import dataSource from './dataSource';
export default {
  name: 'news',
  components: {
    HeaderTab
  },

  props: {
    /**
     * 显示的数据列表
     */
    dataSource: {
      type: Array,
      default: () => {
        return [
          {
            tabTitle: '新闻资讯',
            tabIndex: '0',
            list: [
              {
                title: '《中华人民共和国反不正当竞争法》中关于商业秘密的规定',
                time: '2025-03-09'
              },
              {
                title: '《民法典》中关于商业秘密的规定',
                time: '2025-01-29'
              },
              {
                title: '高明区“五个一”推动市监所标准化规范化建设取得实效',
                time: '2025-02-13'
              },
              {
                title: '“食品监管最新政策学习”开课啦',
                time: '2025-03-09'
              },
              {
                title: '全国两会重大会议进行中',
                time: '2025-02-05'
              }
            ]
          },
          {
            tabTitle: '政策解读',
            tabIndex: '0',
            list: [
              {
                title: '《佛山市食品展销会食品安全管理规定》解读',
                time: '2025-01-06'
              },
              {
                title: '五问+一图,读懂《卫星网络国内协调管理办法(暂行)》',
                time: '2025-02-29'
              },
              {
                title:
                  '工信部印发《卫星网络国内协调管理办法(暂行)》自5月1日起施行',
                time: '2024-03-22'
              },
              {
                title: '外汇局:积极稳外贸稳外资 推动贸易便利化政策优化扩围',
                time: '2024-04-02'
              },
              {
                title: '上海市落实国家8大类家电消费补贴政策参与门店列表',
                time: '2024-05-02'
              }
            ]
          }
        ];
      }
    }
  },
  data() {
    return {
      current: 0,
      // currentList: [],
      imgSrc: ''
    };
  },
  created() {
    this.getlist();
    // this.currentList = this.dataSource[this.current].list
    this.imgSrc = '';
  },
  computed: {
    currentList() {
      return this.dataSource[this.current].list;
    }
  },
  methods: {
    getlist() {},
    changeTab(index, e) {
      this.current = index; // 高亮当前
      // this.currentList = this.dataSource[index].list
      // console.log(this.currentList)
      let tab = this.$refs.tab.$refs.headertab; // 包裹 ul的 div
      let tabitem = this.$refs.tab.$refs.tabitem; // 包裹 li的 ul
      let winWidth = window.innerWidth; // 当前屏幕的宽度
      let liList = e.target; // 当前点击的li
      if (liList) {
        //  当前li左偏移, li的宽度, 中间值(当前屏幕的宽度 - li的宽度) /2, 目标值 (中间值 - 当前li左偏移), 整个ul的宽度
        let liLeft = liList.offsetLeft,
          liWidth = liList.offsetWidth,
          liCenter = (winWidth - liWidth) / 2,
          liTarget = liLeft - liCenter;
        let ulWidth = tabitem.offsetWidth;
        if (liTarget < 0) {
          tab.scrollLeft = 0;
          return;
        }
        // winWidth(375) - ulWidth(436) =  -61
        if (liTarget < winWidth - ulWidth) {
          tab.scrollLeft = -(winWidth - ulWidth) + liWidth;
          return;
        }
        tab.scrollLeft = liTarget;
      }
    }
  }
};
</script>
<style lang="less" scoped>
.box-news {
  width: 100%;
  height: 100%;
  background: rgba(255, 255, 255, 0.4);
  // box-shadow: 0px 0px 20px 8px rgba(140, 201, 250, 0.2);
  border-radius: 12px;
  border: 1px solid #ffffff;
  padding: 19px;
  font-size: 15px;
}

.tab-content {
  .list-box {
    .list-item {
      height: 52px;
      background: #ffffff;
      border-radius: 10px;
      border: 1px solid #eeeeee;
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0 16px;
      margin-bottom: 8px;

      .idot {
        width: 4px;
        height: 4px;
        background: #0458ff;
        padding: 5px;
        border: 2px solid #bcd0f9;
      }

      .item-title {
        font-weight: 400;
        font-size: 15px;
        color: #666666;
        text-align: left;
        font-style: normal;
      }

      .item-title::before {
        display: inline-block;
        width: 4px;
        height: 4px;
        background: #0458ff;
        border: 2px solid #bcd0f9;
        content: '';
        margin-bottom: 1px;
        margin-right: 5px;
      }

      .item-time {
        font-size: 15px;
        width: 86px;
        color: #666;
      }
    }
  }
}
</style>
