import { z } from 'zod'

const EnvSchema = z.object({
  NODE_ENV: z
    .enum(['development', 'test', 'production'])
    .default('development'),

  PORT: z.coerce
    .number()
    .int('PORT必须是整数')
    .min(1, 'PORT不能小于1')
    .max(65535, 'PORT不能大于65535')
    .default(3001),

  REALWORLD_API_URL: z
    .string()
    .trim()
    .url('REALWORLD_API_URL必须是有效URL'),

  DEEPSEEK_API_KEY: z
    .string()
    .trim()
    .min(1, 'DEEPSEEK_API_KEY不能为空'),

  DEEPSEEK_BASE_URL: z
    .string()
    .trim()
    .url('DEEPSEEK_BASE_URL必须是有效URL')
    .default('https://api.deepseek.com'),

  DEEPSEEK_MODEL: z
    .string()
    .trim()
    .min(1, 'DEEPSEEK_MODEL不能为空')
    .default('deepseek-v4-flash'),

  JWT_SECRET: z
    .string()
    .min(32, 'JWT_SECRET至少需要32个字符'),

  REALWORLD_API_TIMEOUT_MS: z.coerce
    .number()
    .int('REALWORLD_API_TIMEOUT_MS必须是整数')
    .positive('REALWORLD_API_TIMEOUT_MS必须大于0')
    .max(60000, 'REALWORLD_API_TIMEOUT_MS不能超过60000')
    .default(10000),

  DEEPSEEK_MAX_RETRIES: z.coerce
    .number()
    .int('DEEPSEEK_MAX_RETRIES必须是整数')
    .min(0, 'DEEPSEEK_MAX_RETRIES不能小于0')
    .max(5, 'DEEPSEEK_MAX_RETRIES不能超过5')
    .default(2),

  DEEPSEEK_TIMEOUT_MS: z.coerce
    .number()
    .int('DEEPSEEK_TIMEOUT_MS必须是整数')
    .min(1000, 'DEEPSEEK_TIMEOUT_MS不能小于1000')
    .max(120000, 'DEEPSEEK_TIMEOUT_MS不能超过120000')
    .default(30000),
  })

export type Env = z.infer<typeof EnvSchema>

export function loadEnv(rawEnv: NodeJS.ProcessEnv): Env {
  const result = EnvSchema.safeParse(rawEnv)

  if (!result.success) {
    const details = result.error.issues
      .map((issue) => {
        const field = issue.path.join('.')

        return `${field}: ${issue.message}`
      })
      .join('; ')

    throw new Error(`环境变量配置错误：${details}`)
  }

  return result.data
}

export const env = EnvSchema.parse(process.env)