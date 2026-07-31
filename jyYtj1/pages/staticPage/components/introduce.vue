<!--  -->
<template>
  <div class="introduce">
    {{ introduceList.length }}--{{ renderList.length }}
    <div v-for="(item, index) in getrenderList(introduceList)" :key="index">
      <introduceInfo :introduceInfo="item" @finish="finish" :config="config" />
    </div>
  </div>
</template>

<script>
import introduceInfo from './introduceInfo.vue'
export default {
  name: 'introduce',
  components: { introduceInfo },
  props: {
    introduceList: {
      type: Array,
      default: () => [],
    },
    config: {
      type: Object,
      default() {
        return {
          ace929: '1',
          ace931: '2',
          ace932: '8',
          ace944: '3',
        }
      },
    },
  },
  data() {
    return {
      renderList: [],
    }
  },
  computed: {},
  watch: {
    // introduceList: {
    //   handler(val) {
    //     if (val && val.length > 0) {
    //       const data = val.map((item) => {
    //         return {
    //           title: item.acz02q,
    //           text: [item.acz02s],
    //         }
    //       })
    //       this.renderList = [
    //         {
    //           title: '惠企惠民政策清单',
    //           data,
    //         },
    //       ]
    //       console.log(this.renderList, 'renderList')
    //     }
    //   },
    //   deep: true,
    // },
  },
  mounted() {
    if (this.introduceList && this.introduceList.length > 0) {
    } else {
      debugger
      this.$utils.showToast('未配置政策列表')
      this.$emit(
        'end',
        {
          ace928: '6',
        },
        3000,
      )
    }
  },
  methods: {
    finish(data) {
      this.$emit('end', data)
    },
    getrenderList(val) {
      if (!val || val.length === 0) {
        return []
      }

      const data = val.map((item) => {
        return {
          title: item.acz02q,
          text: [item.acz02s],
        }
      })
      this.renderList = [
        {
          title: '惠企惠民政策清单',
          data,
        },
      ]
      return this.renderList
      console.log(this.renderList, 'renderList')
    },
  },
}
</script>
<style lang="less" scoped></style>
