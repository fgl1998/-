<!-- 专业要求-输入框 -->
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

    <s-common-major-child
      :visible="isOpenModal"
      @onClose="closeModal"
      @getData="getChoseData"
      :choseData="choseData"
      :maxLength="maxLength"
    ></s-common-major-child>
  </view>
</template>

<script>
import sCommonMajorChild from "../s-common-major-child/s-common-major-child.vue";
export default {
  components: { sCommonMajorChild },
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
          this.inputValue = this.$codeConfig.getCodeLabel('AAC183', newVal);
		  console.info(this.inputValue)
          this.choseData = [
            {
              aac183: newVal,
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
    // 打开专业弹窗
    openModal() {
      this.isOpenModal = true;
    },
    // 关闭专业弹窗
    closeModal() {
      this.isOpenModal = false;
    },
    // 获取选中专业技能
    getChoseData(values) {
      this.choseData = values;
      this.onchange(values);
    },
    // 专业改变
    onchange(value) {
      //console.log("value", value);
      if (value.length > 0) {
        this.inputValue = value[0].aac183Desc
        this.$emit("change", value[0].aac183, value[0]);
        this.$emit("onBind", value[0].aac183, value[0]);
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
