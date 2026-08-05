import pino, { type Logger, type LevelWithSilent } from 'pino'

const REDACTED_PATHS = [
  'req.headers.authorization',
  'req.headers.cookie',
  'authorization',
  'cookie',
  'password',
  '*.password',
  'token',
  '*.token',
  'DB_PASSWORD'
]

export function createLogger(level: LevelWithSilent = 'info'): Logger {
  return pino({
    level,
    redact: {
      paths: REDACTED_PATHS,
      censor: '[REDACTED]'
    }
  })
}

export const logger = createLogger(
  process.env.NODE_ENV === 'test'
    ? 'silent'
    : ((process.env.LOG_LEVEL as LevelWithSilent | undefined) ?? 'info')
)
