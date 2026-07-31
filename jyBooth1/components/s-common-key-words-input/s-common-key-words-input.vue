<!-- 关键字-输入框 -->
<template>
  <view class="keyWordsInput">
    <el-input
      type="text"
      :placeholder="placeholder"
      @onchange="onchange"
      :value="inputValue"
      @focus="openModal"
      clearable
      @clear="onClear"
    />

    <s-common-key-words-child
      :visible="isOpenModal"
      @onClose="closeModal"
      @getData="getChoseData"
      :choseData="choseData"
      :maxLength="maxLength"
    ></s-common-key-words-child>
  </view>
</template>

<script>
import SCommonKeyWordsChild from "../s-common-key-words-child/s-common-key-words-child.vue";
export default {
  components: { SCommonKeyWordsChild },
  name: "keyWordsInput",
  props: {
    value: {
      type: String,
    },
    maxLength: {
      type: Number,
      default: 1,
    },
    placeholder: {
      // 输入框提示文字
      type: String,
      default: "",
    },
  },
  data() {
    return {
      isOpenModal: false,
      choseData: [],
      inputValue: "",
    };
  },
  watch: {
    value: {
      handler(newVal, oldVal) {
        //console.log("value newVal", newVal);
        if (newVal) {
          this.inputValue = newVal;
          this.choseData = newVal.split(',')
        } else {
          this.inputValue = "";
          this.choseData = [];
        }
      },
    },
  },
  methods: {
    // 打开关键字弹窗
    openModal() {
      this.isOpenModal = true;
    },
    // 关闭关键字弹窗
    closeModal() {
      this.isOpenModal = false;
    },
    // 获取选中关键字技能
    getChoseData(values) {
      this.choseData = values;
      this.onchange(values);
    },
    // 关键字改变
    onchange(value) {
      //console.log("value", value);
      if (value.length > 0) {
        this.inputValue = value.join(',');
        this.$emit("change", value.join(','));
        this.$emit("onBind", value.join(','));
      } else {
        this.$emit("change", "");
        this.$emit("onBind", "");
      }
    },
    // 清除
    onClear() {
      this.inputValue = "";
      this.choseData = [];
      this.$emit("change", "");
    },
  },
};
</script>

<style lang="less" scoped>
.keyWordsInput {
  input {
    border-radius: 6px;
    border: 1px solid #000;
    cursor: pointer !important;
  }
}
</style>
