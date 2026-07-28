<template>
  <div class="ez-weather-wrapper">
    <div class="ez-weather-address" v-if="weatherInfo.city">
      {{ weatherInfo.city }}
    </div>
    <div class="ez-weather-temperature" v-if="weatherInfo.temperature">
      {{ weatherInfo.temperature }}°C
    </div>
  </div>
</template>

<script>
import { useAMap } from '@/mixins/index'
/**
 * 天气
 */

export default {
  name: 'ezWeather',
  props: {
    // 头像url路径
    src: {
      type: String,
      default: '',
    },
    width: {
      type: [String, Number],
      default: '64rpx',
    },
    height: {
      type: [String, Number],
      default: '64rpx',
    },
  },
  data() {
    return {}
  },
  mixins: [useAMap],
  components: {},
  created() {},
  methods: {},
  computed: {},
  watch: {},
}
</script>
<style lang="scss" scoped>
.ez-weather-wrapper {
  display: flex;
  align-items: center;
  font-size: $font-size-xl;
  line-height: 42rpx;
  color: #ffffff;
}
.ez-weather-address {
  font-weight: 700;
  margin-right: 70rpx;
}
.ez-weather-temperature {
  font-size: $font-size;
  font-weight: 500;
}
</style>
