import {
  buildDirective,
  defaultDOMPurifyInstanceBuilder,
} from './dompurify-html'

export const buildVueDompurifyHTMLDirective = buildDirective

export default {
  install (
    Vue,
    config = {},
    buildDOMPurifyInstance = defaultDOMPurifyInstanceBuilder
  ) {
    Vue.directive(
      'dompurify-html',
      buildDirective(config, buildDOMPurifyInstance)
    )
  },
}
