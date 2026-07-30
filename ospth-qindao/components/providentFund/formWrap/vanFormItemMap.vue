<template>
  <!-- 修复：v-bind="$attrs" 透传所有属性，v-on="$listeners" 透传所有事件 -->
  <component
      :is="componentName"
      :form-item-config="formItemConfig"
      :value="formData[formItemConfig.name]"
      @input="handleInput"
      @change="handleChange"
  />
</template>

<script>
import vanSelectWrap from './vanSelectWrap.vue'
import vanInputWrap from './vanInputWrap.vue'
import vanNumberWrap from './vanNumberWrap.vue'
import vanDatetimeWrap from './vanDatetimeWrap.vue'

export default {
  name: 'vanFormItemMap',
  components: {
    vanSelectWrap,
    vanInputWrap,
    vanNumberWrap,
    vanDatetimeWrap
  },
  props: {
    formItemConfig: {
      type: Object,
      required: true
    },
    formData: {
      type: Object,
      required: true
    }
  },
  computed: {
    // 修复1：映射「字符串组件名」而非组件实例（Vue2 必须）
    componentName() {
      const componentMap = {
        select: 'vanSelectWrap',
        input: 'vanInputWrap',
        number: 'vanNumberWrap',
        date: 'vanDatetimeWrap',
        month: 'vanDatetimeWrap'
      }
      return componentMap[this.formItemConfig.type] || 'vanInputWrap'
    }
  },
  methods: {
    // 修复2：只负责通知父组件更新，不重复处理值
    handleInput(val) {
      this.$set(this.formData, this.formItemConfig.name, val)
    },
    handleChange(val) {
      this.$set(this.formData, this.formItemConfig.name, val)
    }
  },
}
</script>

<style scoped lang="less">
</style>
