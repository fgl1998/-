import Vue from 'vue'
import Vuex from 'vuex'

import { getIsDev } from '@/utils/get'

import state from './state/index.js'
import mutations from './mutations/index.js'
import getters from './getters/index.js'
import actions from './actions/index.js'
import modules from './modules/index.js'

Vue.use(Vuex)

const isDev = getIsDev()
let plugins = []
if (isDev) {
  plugins = [Vuex.createLogger()]
}
const store = new Vuex.Store({
  state,
  mutations,
  getters,
  actions,
  modules,
  plugins,
})

export default store
