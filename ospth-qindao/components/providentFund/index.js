import Vue from 'vue';

// 批量注册全局组件（推荐：后续新增组件只需加在这里）
const globalComponents = {
  // 用 @ 指向 src 目录，路径更稳定，不受注册文件位置影响
  CommonLayout: () => import('@/components/providentFund/commonLayout.vue'),
  VanSelectWrap: () => import('@/components/providentFund/formWrap/vanSelectWrap.vue'),
  VanFormItemMap: () => import('@/components/providentFund/formWrap/vanFormItemMap.vue'),
  VanNumberWrap: () => import('@/components/providentFund/formWrap/vanNumberWrap.vue'),
  VanDatetimeWrap: () => import('@/components/providentFund/formWrap/vanDatetimeWrap.vue'),
  boxTitle: () => import('@/components/providentFund/boxTitle.vue'),
  queryLayout: () => import('@/components/providentFund/queryLayout.vue'),
};

// 遍历注册所有组件
Object.keys(globalComponents).forEach(componentName => {
  Vue.component(componentName, globalComponents[componentName]);
});

// 可选：导出一个空对象，仅用于标识文件执行过
export default {};
