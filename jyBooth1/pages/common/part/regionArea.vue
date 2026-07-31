<template>
  <ta-tree-select
    :dropdown-style="{ maxHeight: '400px', overflow: 'auto' }"
    :placeholder="placeholder"
    :load-data="fnLoad"
    style="width: 300px"
    :value="value"
    allow-clear
    :tree-data.sync="treeList"
    tree-data-label="areaname"
    tree-data-value="areacode"
    @change="changeValue"
    :getPopupContainer="getPopupContainer"
    :disabled="disabled"
  />
</template>

<script>
import Vue from "vue";
import { treeSelect } from "@yh/ta404-ui";
Vue.use(treeSelect);
export default {
  name: "selectTree",
  model: {
    prop: "value",
    event: "change",
  },
  props: {
    value: {
      // 输入框值
      type: String,
    },
    getPopupContainerId: {
      type: String,
      default: () => {
        return "app";
      },
    },
    placeholder:{
      type: String,
      default: '请选择',
    },
    disabled:{
      type:Boolean,
      default: false,
    }
  },
  data() {
    return {
      treeList: [],
    };
  },
  methods: {
    // 异步加载下拉树数据
    fnLoad(treeNode) {
      return new Promise((resolve) => {
        this.Base.sendRequest(
          "api/business/getData.do",
          {
            apiCode: "jy007_com01",
            method: "jy007_com01",
            areacode: treeNode ? treeNode.eventKey : null,
          },
          (data) => {
            // 业务信息成功处理
            const list = data.data.resultData;
            if (!treeNode) {
              list.forEach((item, index) => {
                if (item.areacode.startsWith("65")) {
                  let obj = {};
                  obj = item;
                  list.splice(index, 1);
                  list.unshift(obj);
                }
              });
            }
            // 将返回数据作为参数传入reslove方法进行渲染
            resolve(list);
          },
          (err) => {
            // 业务信息失败处理
            this.$message.warning("查询失败");
          }
        );
      });
    },
    changeValue(value, label, extra) {
      // 去掉/
      const fullAddress = extra.triggerNode.data.namepath.replace(
        new RegExp("/", "g"),
        ""
      );
      // 去掉省
      const address = fullAddress.substring(
        fullAddress.indexOf("省") + 1,
        fullAddress.length
      );

      const obj = {
        value: value,
        label: address,
        extra: extra,
      };
      this.$emit("getValue", obj);
    },
    getPopupContainer() {
      return document.getElementById(this.getPopupContainerId);
    },
  },
};
</script>

<style scoped></style>
