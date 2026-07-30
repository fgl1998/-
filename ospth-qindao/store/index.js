import Vue from 'vue'
import Vuex from 'vuex'

// 引入 osppm 的 store 模块
import osppmStore from '@osppm/store/index'

Vue.use(Vuex)

const store = new Vuex.Store({
  modules: {
    // 展开 osppm 的所有 store 模块
    ...osppmStore,
  },
})

export default store

