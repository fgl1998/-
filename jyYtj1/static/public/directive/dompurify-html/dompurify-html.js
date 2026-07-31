import purify from 'dompurify'

export function defaultDOMPurifyInstanceBuilder () {
  return purify
}

function setUpHooks (
  config,
  dompurifyInstance
) {
  const hooks = config.hooks ?? {}

  let hookName
  for (hookName in hooks) {
    const hook = hooks[hookName]
    if (hook !== undefined) {
      dompurifyInstance.addHook(hookName, hook)
    }
  }
}

export function buildDirective (
  config = {},
  buildDOMPurifyInstance = defaultDOMPurifyInstanceBuilder
) {
  const dompurifyInstance = buildDOMPurifyInstance()
  setUpHooks(config, dompurifyInstance)

  const updateComponent = function (
    el,
    binding
  ) {
    if (binding.oldValue === binding.value) {
      return
    }
    const arg = binding.arg
    const namedConfigurations = config.namedConfigurations
    if (
      namedConfigurations &&
      arg !== undefined &&
      typeof namedConfigurations[arg] !== 'undefined'
    ) {
      el.innerHTML = dompurifyInstance.sanitize(
        binding.value,
        namedConfigurations[arg]
      )
      return
    }
    el.innerHTML = dompurifyInstance.sanitize(
      binding.value,
      config.default ?? {}
    )
  }

  return {
    inserted: updateComponent,
    update: updateComponent,
    unbind (el) {
      el.innerHTML = ''
    },
  }
}
export default purify
