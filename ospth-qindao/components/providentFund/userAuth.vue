<template>
  <van-popup v-model="show" position="bottom"  :style="{ height: '40%', paddingTop: '24rpx' }" :round="true">
    <van-picker title="请选择认证方式"
                value-key="label"
                show-toolbar
                :columns="columns"
                @confirm="onConfirm"
                @cancel="onCancel"
    />
  </van-popup>
</template>
<script>
import ENUMS from "@osppm/common/enum";

export default {
  name: 'userAuth',
  props: {
    // 认证方式
    authType: {
      type: Number,
      default: '',
    }
  },
  data() {
    return {
      show: true,
      columns: [],
      sms: '',
      phone: '183****4418',
    }
  },
  mounted() {
    const FACE = { label: '人脸识别（推荐使用）', value: ENUMS.AUTH_TYPE.FACE }
    const SMS = { label: '短信验证码', value: ENUMS.AUTH_TYPE.SMS }

    const map = {
      [ENUMS.AUTH_TYPE.FACE]: [FACE],
      [ENUMS.AUTH_TYPE.SMS]: [SMS],
      [ENUMS.AUTH_TYPE.FACE_OR_SMS]: [FACE, SMS],
    }

    this.columns = map[this.authType] || []
  },
  methods: {
    onConfirm(item) {
      console.info('选择的认证方式：', item)
      if (item.value === ENUMS.AUTH_TYPE.FACE) {
        this.$emit('authSuccess', item)
      }
      if (item.value === ENUMS.AUTH_TYPE.SMS) {
        this.$emit('authSuccess', item)
      }
    },
    onCancel() {
      this.$emit('cancel')
    },
    onInput(value) {
      this.code += value
    },
    onDelete() {

    },
  },
}
</script>
<style scoped lang="scss">

</style>
