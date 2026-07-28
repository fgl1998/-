<template>
  <view class="shop-edit h5-page"> shop-edit </view>
</template>

<script>
import { USER_INFO } from '@/store/constants'
import { mapGetters } from 'vuex'

export default {
  name: 'pageShopEdit',
  components: {},
  data() {
    return {}
  },
  // 监听页面加载，其参数为上个页面传递的数据，参数类型为Object（用于页面传参）
  onLoad(e) {},
  // 监听页面初次渲染完成
  onReady() {},
  // 监听页面显示
  onShow() {},
  // 监听页面隐藏
  onHide() {},
  methods: {},
  computed: {
    ...mapGetters([USER_INFO]),
  },
  watch: {},
}
</script>

<style lang="scss" scoped>
.shop-edit {
  padding: $spacing;
}
</style>
