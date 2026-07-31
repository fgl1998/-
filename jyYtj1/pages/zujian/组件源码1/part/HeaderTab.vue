<template>
  <div class="header">
    <div class="header_tab" ref="headertab">
      <ul ref="tabitem">
        <li
          v-for="(item, index) in listArray"
          :key="index"
          :class="index == current ? 'activeheader' : ''"
          @click="getTab(index, $event)">
          {{ item.tabTitle }}
        </li>
      </ul>
    </div>
    <div class="header_search">
      <div class="to-more">
        更多<img src="../assets/arrow-right.png" alt="" />
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'HeaderTab',
  props: {
    listArray: {
      type: Array
    },
    current: {
      type: Number,
      default: 1
    }
  },
  data() {
    return {};
  },
  methods: {
    getTab(index, e) {
      this.$emit('change', index, e);
    }
  }
};
</script>
<style lang="less">
.header {
  width: 100%;
  // background-color: #fff;
  display: flex;
}

.header_tab {
  width: 90%;
  display: flex;
  flex-wrap: nowrap;
  overflow: scroll;
  position: relative;
}

.to-more {
  color: #b8b8b8;
  text-align: right;

  img {
    width: 12px;
    height: 12px;
  }
}

.header_tab::-webkit-scrollbar {
  display: none;
}

ul {
  display: inline-block;
  white-space: nowrap;
  padding-left: 0;
}

li {
  display: inline-block;
  padding: 0px 10px;
  padding-bottom: 9px;
  font-size: 16px;
  color: #333;
  // 点击高亮某一项时,将原来的字体变大,会导致没有高亮的元素距离上面有空隙,会出现纵向滚动条
  margin-top: -1px;
}

.activeheader {
  font-size: 16px;
  font-weight: 500;
  position: relative;
  color: #0458ff;
}

.activeheader:after {
  position: absolute;
  content: '';
  width: 35%;
  height: 3px;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  background-color: #0458ff;
  border-radius: 50px;
}

.header_search {
  width: 10%;
  position: relative;
}
</style>
