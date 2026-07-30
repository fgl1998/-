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
      console.log(this.codeValues)
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
    cvDesc(value, cvList=[]) {
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
      if (val) {
        this.labelName = this.cvDesc(val, this.codeValues)
      }else {
        this.labelName = this.cvDesc(this.value, this.codeValues)
      }
    },
    handleDelete(){
      this.$emit('handleDelete')
    }
  }
}
</script>

<style scoped lang="less">
/* 全局或本页面都行 */
.van-field__control {
  --cell-border: 0 !important;        /* vant 4 变量 */
}
/* 如果上面不生效，再补一条更细的 */
.van-cell::after {
  display: none !important;
}
</style>
