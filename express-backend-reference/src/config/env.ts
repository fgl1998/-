import { z } from 'zod'

const envSchema = z.object({
  NODE_ENV: z
    .enum(['development', 'test', 'production'])
    .default('development'),
  PORT: z.coerce.number().int().positive().default(3000),
  DB_HOST: z.string().trim().min(1).default('127.0.0.1'),
  DB_PORT: z.coerce.number().int().positive().default(3306),
  DB_USER: z.string().trim().min(1),
  DB_PASSWORD: z.string().default(''),
  DB_NAME: z.string().trim().min(1),
  DB_CONNECTION_LIMIT: z.coerce
    .number()
    .int()
    .positive()
    .max(100)
    .default(10),
  CORS_ORIGINS: z
    .string()
    .default('http://localhost:5173')
    .transform((value) =>
      value
        .split(',')
        .map((origin) => origin.trim())
        .filter((origin) => origin.length > 0)
    ),
  LOG_LEVEL: z
    .enum(['fatal', 'error', 'warn', 'info', 'debug', 'trace', 'silent'])
    .default('info')
})

export type AppEnv = z.infer<typeof envSchema>

export function loadEnv(
  source: Record<string, string | undefined>
): AppEnv {
  return envSchema.parse(source)
}
