<template>
  <div class="SwiperBox" ref="SwiperBox">
    <!-- 图片 -->
    <div class="imgBox" :style="{ left: `-${leftVal}px`, transition: `${ition}s` }">
      <img
        v-for="(item, index) in imgList"
        :key="index"
        :src="item"
        loading="lazy"
        decoding="async"
        referrerpolicy="no-referrer"
        alt=""
        @load="handleImgLoad"
        @error="handleImgError"
      />
      <!-- 复制最后两张放到最后以实现无缝无线循环滚动效果 -->
      <img
        :src="imgList[0]"
        alt=""
        loading="lazy"
        decoding="async"
        referrerpolicy="no-referrer"
        @load="handleImgLoad"
        @error="handleImgError"
      />
      <img
        :src="imgList[0]"
        v-if="imgList.length == 1"
        loading="lazy"
        decoding="async"
        referrerpolicy="no-referrer"
        @load="handleImgLoad"
        @error="handleImgError"
      />
      <img
        :src="imgList[1]"
        alt=""
        v-if="imgList.length > 1"
        loading="lazy"
        decoding="async"
        referrerpolicy="no-referrer"
        @load="handleImgLoad"
        @error="handleImgError"
      />
    </div>
    <!-- 下方指示点容器 -->
    <div class="instBox">
      <div
        @click="instFun(index)"
        v-for="(item, index) in imgList.length"
        :key="index"
        :class="['inst', index == imgShow ? 'instActv' : '']"
      ></div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      leftVal: 0, // 轮播图偏移量
      flag: true, // 节流防止重复点击
      start: null, // 自动执行定时器
      imgWidth: 383, // 图片宽度
      ition: 0.6, // 过渡时间
      imgShow: 0, // 当前索引
    }
  },
  props: {
    imgList: {
      type: Array,
      default: () => [],
    },
  },
  mounted() {
    this.autoPlay()
  },
  beforeDestroy() {
    if (this.start) {
      clearInterval(this.start)
    }
  },
  methods: {
    // 自动轮播定时器
    autoPlay() {
      if (this.start) {
        clearInterval(this.start)
      }
      this.start = setInterval(() => {
        this.NextFun()
      }, 3000)
    },
    // 下一张
    NextFun() {
      if (this.leftVal == (this.imgList.length - 1) * this.imgWidth) {
        // 显示到最后一张时执行
        this.ition = 0.6
        this.leftVal += this.imgWidth
        this.imgShow = 0
        this.$nextTick(() => {
          setTimeout(() => {
            this.ition = 0
            this.leftVal = 0
          }, this.ition * 1000)
        })
      } else {
        // 未到最后一张时执行
        this.ition = 0.6
        this.leftVal += this.imgWidth
        this.imgShow++
      }
    },
    // 点击小圆点
    instFun(index) {
      this.ition = 0.6
      this.leftVal = index * this.imgWidth
      this.imgShow = index
    },
    handleImgLoad() {
      // 首张加载后启动定时器
      if (!this.start) {
        this.autoPlay()
      }
    },
    handleImgError(e) {
      const placeholder =
        'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="10" height="10"><rect width="10" height="10" fill="%23f5f7fa"/></svg>'
      if (e && e.target && !e.target._errored) {
        e.target._errored = true
        e.target.src = placeholder
      }
      if (!this.start) {
        this.autoPlay()
      }
    },
  },
}
</script>

<style>
* {
  padding: 0;
  margin: 0;
  box-sizing: border-box;
}

.SwiperBox {
  position: relative;
  width: 741px;
  height: 300px;
  box-sizing: border-box;
  cursor: pointer;
  overflow: hidden;
}

.imgBox {
  position: absolute;
  top: 0;
  left: 0;
  min-width: 741px;
  height: 270px;
  display: flex;
  justify-content: flex-start;
}

.imgBox img {
  flex-shrink: 0;
  width: 358px;
  height: 270px;
  object-fit: cover;
  display: block;
  background: #f5f7fa;
}

.imgBox img:not(:last-child) {
  margin-right: 25px;
}

.instBox {
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  bottom: 0;
  display: flex;
}

.inst {
  width: 6px;
  height: 6px;
  border: 1px solid #cbcfd6;
  margin-right: 8px;
  background: #cbcfd6;
  border-radius: 50%;
  cursor: pointer;
}

.inst:last-child {
  margin-right: 0;
}

.instActv {
  width: 18px;
  height: 6px;
  border-radius: 3px;
  background: #0c6af7;
}

#app {
  width: 100%;
  padding: 120px;
  display: flex;
  justify-content: center;
}
</style>
