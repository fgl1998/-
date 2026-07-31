<!-- 职位亮点要求-输入框 -->
<template>
  <div class="jobHeightLightIntpu">
    <el-input
      type="text"
      :placeholder="placeholder"
      @onchange="onchange"
      :value="inputValue"
      @focus="openModal"
      clearable
      @clear="onClear"
    />

    <s-common-job-height-lights-child
      :visible="isOpenModal"
      @onClose="closeModal"
      @getData="getChoseData"
      :choseData="choseData"
      :maxLength="maxLength"
    ></s-common-job-height-lights-child>
  </div>
</template>

<script>
import SCommonJobHeightLightsChild from "../s-common-job-height-lights-child/s-common-job-height-lights-child.vue";
export default {
  components: { SCommonJobHeightLightsChild },
  name: "jobHeightLightIntpu",
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
          let value = newVal.split(',')
          // value = value.map(item => {
          //   return this.$codeConfig.getCodeLabel('ACB00R', item)
          // });
          this.inputValue = value.join(',');
          this.choseData = newVal.split(',')
        } else {
          this.inputValue = "";
          this.choseData = [];
        }
      },
    },
  },
  methods: {
    // 打开职位亮点弹窗
    openModal() {
      this.isOpenModal = true;
    },
    // 关闭职位亮点弹窗
    closeModal() {
      this.isOpenModal = false;
    },
    // 获取选中职位亮点
    getChoseData(values) {
      this.choseData = values;
      this.onchange(values);
    },
    // 职位亮点改变
    onchange(value) {
      if (value.length > 0) {
        let result = [...value];
        result = result.map((item) => {
          return this.$codeConfig.getCodeLabel("ACB00R", item);
        });
        this.inputValue = result.join(",");
        this.$emit("change", this.inputValue);
        this.$emit("onBind", value.join(","));
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
.jobHeightLightIntpu {
  input {
    border-radius: 6px;
    border: 1px solid #000;
    cursor: pointer !important;
  }
}
</style>
