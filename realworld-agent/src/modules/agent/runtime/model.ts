import { ChatDeepSeek } from '@langchain/deepseek'

import type { Env } from '../../../config/env.js'

export type DeepSeekModelConfig = Pick<
  Env,
  | 'DEEPSEEK_API_KEY'
  | 'DEEPSEEK_BASE_URL'
  | 'DEEPSEEK_MODEL'
  | 'DEEPSEEK_TIMEOUT_MS'
  | 'DEEPSEEK_MAX_RETRIES'
>

export function createDeepSeekModel(
  config: DeepSeekModelConfig,
): ChatDeepSeek {
  return new ChatDeepSeek({
    apiKey: config.DEEPSEEK_API_KEY,

    model: config.DEEPSEEK_MODEL,

    temperature: 0,

    timeout: config.DEEPSEEK_TIMEOUT_MS,

    maxRetries: config.DEEPSEEK_MAX_RETRIES,

    configuration: {
      baseURL: config.DEEPSEEK_BASE_URL,
    },

    modelKwargs: {
      thinking: {
        type: 'disabled',
      },
    },
  })
}