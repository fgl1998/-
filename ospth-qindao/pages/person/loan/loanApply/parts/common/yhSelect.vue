<template>
  <div>
    <van-field :value="labelName"
               input-align="right" :required="required"
               :readonly="true"
               :disabled="disabled"
               :placeholder="'请选择'+label"
               :rules="[{ required: required}]"
               :right-icon="showDelete"
               @click-right-icon="handleDelete"
               :label="label" @click="openFrame()"/>

    <van-popup v-model="showCodeValueFrame" position="bottom">
      <van-picker show-toolbar
                  :title="label"
                  value-key="label"
                  :columns="codeValues"
                  @confirm="confirm"
                  @cancel="showCodeValueFrame = false"
      />
    </van-popup>
  </div>
</template>

<script>
export default {
  props: ['label', 'disabled', 'required', 'codeValues', 'value','showDelete'],
  data() {
    return {
      labelName: undefined,
      showCodeValueFrame: false
    }
  },
  mounted() {
    this.setDesc()
  },
  watch:{
    value(){
      this.setDesc()
    },
    codeValues(){
      this.setDesc()
    }
  },
  methods: {
    cvDesc(value, cvList) {
      return cvList.find(item => item.value === value)?.label
    },
    openFrame() {
      if (!this.disabled) {
        this.showCodeValueFrame = true
      }
    },
    confirm(value) {
      this.labelName = value.label
      this.$emit('input', value.value)
      this.showCodeValueFrame = false
    },
    setDesc(val){
      const v = val || this.value
      const label = this.cvDesc(v, this.codeValues)
      this.labelName = label || v || ''
    },
    handleDelete(){
      this.$emit('handleDelete')
    }
  }
}
</script>

<style scoped lang="less">

</style>
