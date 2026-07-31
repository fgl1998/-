<!-- 个人求职意向 -->
<template>
  <view class="filter-item">
    <el-select :value="value" :name="this.name" :placeholder="this.placeholder">
      <el-option
          v-for="item in options"
          :key="item.value"
          :label="item.label"
          :value="item.value">
      </el-option>
    </el-select>
  </view>
</template>
<script>

export default {
  name: "CC20FilterItem",
  props: {
    name: {
      type: String,
    },
    placeholder: {
      type: String,
      required: true,
      default: "",
    },
    options: {
      type: Array,
      default: [
        {value: '1', label: "选项一"},
        {value: '2', label: "选项二"},
        {value: '3', label: "选项三"},
      ]
    },
    value: {
      type: String,
    }
  },
  data() {
    return {}
  },
  created() {
  },
  methods: {},
};
</script>
<style lang="scss" scoped>
.filter-item {
  width: 132px;
  height: 40px;

  background: #0682FE;
  border-radius: 5px;

  /deep/ .el-select {
    border-radius: 5px;


    .el-input {

      :first-child {
        background: #0682FE;
        border-radius: 5px;

        font-family: SourceHanSansCN, SourceHanSansCN;
        font-weight: 400;
        font-size: 20px;
        color: #FFFFFF;
        line-height: 30px;
        text-align: center;
        font-style: normal;

        &::-webkit-input-placeholder { /* Edge */
          color: #FFFFFF !important;
        }

        &::-ms-input-placeholder { /* Internet Explorer 10-11 */
          color: #FFFFFF !important;
        }

        &:-ms-input-placeholder { /* Internet Explorer 10-11 */
          color: #FFFFFF !important;
        }

        &::-moz-placeholder { /* Mozilla Firefox 4 to 18 */
          color: #FFFFFF !important;
        }

        &:-moz-placeholder { /* Mozilla Firefox 4 to 18 */
          color: #FFFFFF !important;
        }

        &::placeholder {
          color: #FFFFFF !important;
        }
      }

      :last-child {
        top: 6px;
        height: 80%;
      }
    }
  }
}
</style>
