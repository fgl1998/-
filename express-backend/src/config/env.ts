import { z } from 'zod'

const envSchema = z.object({
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
})
export type AppEnv = z.infer<typeof envSchema>
export function loadEnv(source: Record<string, string | undefined>) {
  return envSchema.parse(source)
}