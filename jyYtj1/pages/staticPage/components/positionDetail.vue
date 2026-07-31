<!--  -->
<template>
  <div class="company">
    <div v-for="(item, index) in positionList" :key="index">
      <companyInfo :companyInfo="item" @end="finish" />
    </div>
  </div>
</template>

<script>
import companyInfo from './companyInfo.vue'
export default {
  name: 'company',
  components: {
    companyInfo,
  },
  props: {
    positionList: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {}
  },
  computed: {},
  watch: {},
  methods: {
    finish(data) {
      this.$emit('end', data)
    },
  },
}
</script>
<style lang="less" scoped>
.company {
  position: absolute;
  left: 0;
  top: 0;
  width: 100vw;
  height: 100vh;
}
</style>
