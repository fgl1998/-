<!-- 工种-输入框 -->
<template>
  <view class="inputBox">
    <el-input
        type="text"
        :placeholder="placeholder"
        @onchange="onChange"
        :value="inputValue"
        @focus="openModal"
        clearable
        @clear="onClear"
    />

    <qualification-certificate-child
        :visible="isOpenModal"
        @onClose="closeModal"
        @getData="getChoseData"
        :choseData="choseData"
        :maxLength="maxLength"
    ></qualification-certificate-child>
  </view>
</template>

<script>
import qualificationCertificateChild from './qualification-certificate-child.vue';

export default {
  components: {qualificationCertificateChild},
  name: "inputBox",
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
        if (newVal) {
          let newValArr =  newVal.split(",")

          let oddIndexArr1_dsc = newValArr.filter((item, index) => index % 2 === 1); //描述值
          let oddIndexArr2_num = newValArr.filter((item, index) => index % 2 === 0); //码值
          this.inputValue = oddIndexArr1_dsc.join(',');
          this.choseData = []
          for(let index in oddIndexArr1_dsc){
            this.choseData.push({
              aca150:oddIndexArr2_num[index],
              aca151:oddIndexArr1_dsc[index],
            })
          }
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
      this.onChange(values);
    },
    // 专业改变
    onChange(value) {
      if (value.length > 0) {
        let str  = ""
        this.inputValue = value.map(item => str += item.aca151);
        this.$emit("change", value);
        this.$emit("onBind", value);
      } else {
        this.$emit("change", []);
        this.$emit("onBind", []);
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
.inputBox {
  input {
    border-radius: 6px;
    border: 1px solid #000;
    cursor: pointer !important;
  }
}
</style>
