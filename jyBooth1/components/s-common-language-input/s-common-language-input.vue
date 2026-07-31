<!-- 语言要求-输入框 -->
<template>
  <view class="majorInput">
    <el-input
        type="text"
        :placeholder="placeholder"
        @onchange="onchange"
        :value="inputValue"
        @focus="openModal"
        clearable
        @clear="onClear"
    />

    <s-common-language-child
        :visible="isOpenModal"
        @onClose="closeModal"
        @getData="getChoseData"
        :choseData="choseData"
        :maxLength="maxLength"
    ></s-common-language-child>
  </view>
</template>

<script>
import SCommonLanguageChild from "../s-common-language-child/s-common-language-child.vue";

export default {
  components: {SCommonLanguageChild},
  name: "majorInput",
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
          this.inputValue = this.$utils.queryCodeDesc("ACC241", newVal);
          this.choseData = [
            {
              acc241: newVal,
            },
          ];
        } else {
          this.inputValue = "";
          this.choseData = [];
        }
      },
    },
  },
  methods: {
    // 打开语言弹窗
    openModal() {
      this.isOpenModal = true;
    },
    // 关闭语言弹窗
    closeModal() {
      this.isOpenModal = false;
    },
    // 获取选中语言技能
    getChoseData(values) {
      this.choseData = values;
      this.onchange(values);
    },
    // 语言改变
    onchange(value) {
      console.log("语言改变value", value);
      if (value.length > 0) {
        this.inputValue = value[0].acc241Desc;
        this.$emit("change", value[0].acc241, value[0]);
        this.$emit("onBind", value[0].acc241, value[0]);
      } else {
        this.$emit("change", "", {});
        this.$emit("onBind", "", {});
      }
    },
    // 清除
    onClear() {
      this.inputValue = "";
      this.choseData = [];
      this.$emit("change", "", {});
    },
  },
};
</script>

<style lang="less" scoped>
.majorInput {
  input {
    border-radius: 6px;
    border: 1px solid #000;
    cursor: pointer !important;
  }
}
</style>
