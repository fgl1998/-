<template>
  <view>
    <van-form ref="form" :scroll-to-error="true">
      <van-form-item-map
        v-for="(item, index) in formConfig.fields"
        :key="index"
        v-if="!item.if || item.if(formData)"
        :formItemConfig.sync="item"
        :formData="formData"
      />
      <view v-if="formData.fixedPhone !== undefined" class="tip_text">(格式：xxx-xxxxxxxx)</view>
    </van-form>
  </view>
</template>

<script>
import { mapActions, mapState } from 'vuex'
import mixin from '@osppm/store/person/marshal/personalInfoChange/one/mixin'

export default {
  name: 'one',
  mixins: [mixin],
  computed: {
    ...mapState('personalInfoChange', ['ywdjh']),
  },
  methods: {
    ...mapActions('personalInfoChange', ['savePersonalInfoChange']),
    async beforeNext() {
      return new Promise(resolve => {
        this.$refs.form.validate().then(async () => {
          try {
            await this.savePersonalInfoChange({ ...this.formData, ywdjh: this.ywdjh })
            resolve(true)
          } catch (e) {
            resolve(false)
          }
        }).catch(() => resolve(false))
      })
    },
  },
}
</script>

<style scoped lang="scss">
.tip_text {
  color: #666;
  font-size: 28rpx;
  text-align: right;
  padding: 0 24rpx 24rpx;
  background: #fff;
}
</style>
