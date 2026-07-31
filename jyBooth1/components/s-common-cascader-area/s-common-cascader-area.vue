<!-- 连级选择地区 -->
<template>
  <view class="cascaderArea">
    <el-cascader
        v-model="value"
        :options="options"
        @change="handleChange"
        :props="props"
        ref="cascader"
        class="cascader"
        clearable
        :placeholder="placeholder"
    ></el-cascader>
  </view>
</template>

<script>
export default {
  name: "cascaderArea",
  props: {
    placeholder: {
      type: String,
      default: "",
    },
    value: {
      type: Array,
      default: () => [],
    },
  },
  watch: {
    value: {
      async handler(val) {
        if (val && val.length !== 0) {
          if (!this.options || this.options.length === 0) {
            await this.fnLoad();
          }
          this.newValue = val;
          // 如果是手动选择的就不用加载重复加载下拉项
          if (this.isSelect) {
            this.isSelect = false;
            return;
          }
          if (this.newValue.length > 1) {
            let arr = JSON.parse(JSON.stringify(this.newValue));
            if (!areacode) {
              arr.shift();
            }
            // 拿到选中项的下拉数据
            if (this.options) {
              this.fnLoad(
                  [this.options.find((item) => item.areaid == this.newValue[0])],
                  arr
              );
            }
          }
        }
      },
      immediate: true,
      deep: true,
    },
  },
  data() {
    return {
      options: [], // 地区数据
      props: {
        value: "areacode",
        label: "areaname",
        lazy: true,
        lazyLoad: async (node, resolve) => {
          //console.log("node", node);
          let result = await this.fnLoad2(node.value);
          if (node.level < 2) {
            resolve(result);
          } else {
            result.forEach((item) => {
              item.leaf = true;
            });
            resolve(result);
          }
        },
      },
      newValue: null,
    };
  },
  async mounted() {
    this.options = await this.fnLoad();
  },
  methods: {
    // 最终选中
    handleChange(value) {
      let node = this.$refs.cascader.getCheckedNodes();
      this.$emit("getAreaInfo", value, node);
    },
    // 异步加载下拉树数据
    fnLoad(selectedOptions, arr) {
      if (selectedOptions) {
        var targetOption = selectedOptions[selectedOptions.length - 1];
      }
      return new Promise((resolve) => {
        let params = {
          areacode: targetOption ? targetOption.areaid : '',
        };
        this.$http.post(this.$requestConstant.commonRequestType, 'jy007_com01', null, params, false).then((data) => {
          let list = data.data.data.resultData;
          if (!targetOption) {
            if (this.lockProvince) {
              list = list.filter(
                  (item) => item.areacode == this.lockProvince
              );
            }
          }
          if (!selectedOptions) {
            this.options = list;
          } else {
            targetOption.children = list;
            if (arr && arr.length > 1) {
              let newArr = JSON.parse(JSON.stringify(arr));
              newArr.shift();
              //console.log("targetOption", targetOption);
              this.fnLoad(
                  [
                    targetOption.children.find(
                        (item) => item.areaid == arr[0]
                    ),
                  ],
                  newArr
              );
            }
            this.options = [...this.options];
          }
          // 将返回数据作为参数传入reslove方法进行渲染
          resolve(list);
        });
      });
    },
    // 异步加载下拉树数据
    fnLoad2(areacode) {
      return new Promise((resolve) => {
        let param = {
          areacode: areacode,
        };
        this.$http.post(this.$requestConstant.commonRequestType, 'jy007_com01', null, param, false).then((res) => {
          let result = res.data.data.resultData;
          let addressArr = [];
          if (result[0].arealevel == 0) {
            result.forEach((item) => {
              addressArr.push(item);
              // if (item.areacode == "650000000000") {
              //   addressArr.push(item);
              // }
            });
          } else {
            addressArr = result;
          }
          resolve(addressArr);
        });
      });
    },
  },
};
</script>

<style lang="less" scoped>
.cascaderArea {
  width: 100%;

  .cascader {
    width: 100%;
  }
}
</style>
