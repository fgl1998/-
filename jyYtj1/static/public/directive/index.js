import Vue from 'vue'
import VueDOMPurifyHTML from './dompurify-html'
Vue.use(VueDOMPurifyHTML, {
  namedConfigurations: {
    svg: {
      USE_PROFILES: { svg: true, },
    },
    mathml: {
      USE_PROFILES: { mathMl: true, },
    },
  },
})
