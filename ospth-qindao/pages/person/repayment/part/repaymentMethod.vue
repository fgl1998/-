<template>
  <div>
    <van-cell-group inset style="padding: 24px 0">
      <div class="img">
        <img :src="require('@/assets/images/common/creditCard.svg')">
      </div>

      <yhSelect :code-values="repaymentMethodList"
                :required="true"
                :readonly="true"
                @input="input"
                label="还款方式"/>
    </van-cell-group>
  </div>
</template>
<script>
import yhSelect from '@/components/yhSelect.vue'

export default {
  name: 'repaymentMethod',
  components: {yhSelect},
  props: ['codeValueFilter'],
  data() {
    return {
      repaymentMethod: undefined,
      repaymentMethodList: [],
    }
  },
  async mounted() {
    this.repaymentMethodList = await this.codeValue('HKJKFS', this.codeValueFilter)
  },
  methods: {
    input(value) {
      this.repaymentMethod = value
      this.$emit('repaymentMethodChange',value)
    }
  }
}
</script>
<style scoped lang="less">
.img {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 24px;

  img {
    width: 50%;
  }
}
</style>
