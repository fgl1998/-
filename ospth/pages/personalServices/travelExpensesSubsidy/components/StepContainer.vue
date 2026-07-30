<template>
  <view class="step-container">
    <slot :current="current" />
  </view>
</template>

<script>
export default {
  name: 'StepContainer',
  props: {
    value: { type: Number, default: 0 },
  },
  computed: {
    current() {
      return this.value
    },
  },
}
</script>
