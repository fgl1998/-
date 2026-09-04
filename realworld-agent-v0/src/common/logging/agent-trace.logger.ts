// src/common/logging/agent-trace.logger.ts

import { randomUUID } from 'node:crypto'
import { mkdir, writeFile } from 'node:fs/promises'
import { join } from 'node:path'

import type { BaseMessage } from '@langchain/core/messages'

export type AgentTraceStatus =
  | 'success'
  | 'failed'

export interface AgentTraceLoggerOptions {
  /**
   * 是否启用日志。
   * 建议只在 development 环境开启。
   */
  enabled: boolean

  /**
   * 日志根目录。
   * 默认：项目根目录/logs/agent
   */
  directory?: string
}

export interface WriteAgentTraceInput {
  /**
   * 可以不传，Logger 会自动生成 UUID。
   */
  runId?: string

  status: AgentTraceStatus

  /**
   * 本次请求开始时间。
   */
  startedAt: Date

  /**
   * 本次请求结束时间。
   * 不传则使用当前时间。
   */
  finishedAt?: Date

  /**
   * 用户最初输入的问题。
   * 这里只保存 message，绝对不要传入 JWT。
   */
  inputMessage: string

  /**
   * agent.invoke() 返回的 result.messages。
   *
   * 失败时如果拿不到 messages，可以传空数组。
   */
  messages: readonly BaseMessage[]

  /**
   * 执行失败时传入错误。
   */
  error?: unknown

  /**
   * 可以保存 requestId、userId 等辅助信息。
   * 不要放 JWT、API Key、Authorization。
   */
  metadata?: Record<string, unknown>
}

export interface AgentTraceMessage {
  index: number
  type: string
  id?: string
  name?: string
  content: unknown
  toolCalls?: unknown[]
  toolCallId?: string
  responseMetadata?: unknown
  additionalKwargs?: unknown
}

export class AgentTraceLogger {
  private readonly enabled: boolean
  private readonly directory: string

  constructor(options: AgentTraceLoggerOptions) {
    this.enabled = options.enabled

    this.directory =
      options.directory ??
      join(process.cwd(), 'logs', 'agent')
  }

  /**
   * 写入一次完整的 Agent 执行轨迹。
   *
   * 返回生成的文件路径。
   * 没有启用或写入失败时返回 null。
   */
  async write(
    input: WriteAgentTraceInput
  ): Promise<string | null> {
    if (!this.enabled) {
      return null
    }

    try {
      const runId =
        input.runId ?? randomUUID()

      const startedAt = input.startedAt
      const finishedAt =
        input.finishedAt ?? new Date()

      const dateDirectory =
        startedAt.toISOString().slice(0, 10)

      const targetDirectory = join(
        this.directory,
        dateDirectory
      )

      await mkdir(targetDirectory, {
        recursive: true
      })

      const trace = {
        runId,

        status: input.status,

        startedAt: startedAt.toISOString(),

        finishedAt: finishedAt.toISOString(),

        durationMs: Math.max(
          0,
          finishedAt.getTime() -
            startedAt.getTime()
        ),

        inputMessage: input.inputMessage,

        metadata: toJsonSafe(
          input.metadata ?? {}
        ),

        messages: input.messages.map(
          (message, index) =>
            this.serializeMessage(
              message,
              index
            )
        ),

        error:
          input.error === undefined
            ? undefined
            : serializeError(input.error)
      }

      const timestamp =
        startedAt
          .toISOString()
          .replace(/[:.]/g, '-')

      const safeRunId =
        runId.replace(
          /[^a-zA-Z0-9_-]/g,
          '_'
        )

      const filePath = join(
        targetDirectory,
        `${timestamp}_${safeRunId}.json`
      )

      await writeFile(
        filePath,
        `${JSON.stringify(trace, null, 2)}\n`,
        {
          encoding: 'utf8',

          // 文件已存在时不覆盖。
          flag: 'wx'
        }
      )

      return filePath
    } catch (error) {
      /*
       * 日志属于辅助功能。
       * 写日志失败不能让正常聊天接口失败。
       */
      console.error(
        'Agent trace log write failed:',
        error
      )

      return null
    }
  }

  private serializeMessage(
    message: BaseMessage,
    index: number
  ): AgentTraceMessage {
    /*
     * 不直接 JSON.stringify 整个 class 实例，
     * 只提取我们真正关心的字段。
     */
    const rawMessage =
      message as unknown as Record<
        string,
        unknown
      >

    const type = getMessageType(message)

    const traceMessage: AgentTraceMessage = {
      index,
      type,

      content: normalizeContent(
        rawMessage.content,
        type
      )
    }

    if (typeof rawMessage.id === 'string') {
      traceMessage.id = rawMessage.id
    }

    if (typeof rawMessage.name === 'string') {
      traceMessage.name =
        rawMessage.name
    }

    if (
      Array.isArray(
        rawMessage.tool_calls
      )
    ) {
      traceMessage.toolCalls =
        toJsonSafe(
          rawMessage.tool_calls
        ) as unknown[]
    }

    if (
      typeof rawMessage.tool_call_id ===
      'string'
    ) {
      traceMessage.toolCallId =
        rawMessage.tool_call_id
    }

    if (
      rawMessage.response_metadata !==
      undefined
    ) {
      traceMessage.responseMetadata =
        toJsonSafe(
          rawMessage.response_metadata
        )
    }

    if (
      rawMessage.additional_kwargs !==
      undefined
    ) {
      traceMessage.additionalKwargs =
        toJsonSafe(
          rawMessage.additional_kwargs
        )
    }

    return traceMessage
  }
}

/**
 * 获取 LangChain Message 类型。
 *
 * 常见返回：
 * human、ai、tool、system。
 */
function getMessageType(
  message: BaseMessage
): string {
  const candidate =
    message as unknown as {
      getType?: () => string
      _getType?: () => string
      constructor?: {
        name?: string
      }
    }

  try {
    if (
      typeof candidate.getType ===
      'function'
    ) {
      return candidate.getType.call(message)
    }

    if (
      typeof candidate._getType ===
      'function'
    ) {
      return candidate._getType.call(
        message
      )
    }
  } catch {
    // 获取类型失败时继续使用构造函数名称。
  }

  return (
    candidate.constructor?.name ??
    'unknown'
  )
}

/**
 * Tool 返回值通常是 JSON 字符串。
 *
 * 如果能够解析，就在日志中保存成真正的对象，
 * 这样打开日志时更容易阅读。
 */
function normalizeContent(
  content: unknown,
  messageType: string
): unknown {
  if (
    messageType === 'tool' &&
    typeof content === 'string'
  ) {
    const trimmedContent =
      content.trim()

    if (
      trimmedContent.startsWith('{') ||
      trimmedContent.startsWith('[')
    ) {
      try {
        return toJsonSafe(
          JSON.parse(trimmedContent)
        )
      } catch {
        // 不是合法 JSON，保留原始字符串。
      }
    }
  }

  return toJsonSafe(content)
}

/**
 * 把 Error 转换成可以写入 JSON 的普通对象。
 */
function serializeError(
  error: unknown
): unknown {
  if (!(error instanceof Error)) {
    return toJsonSafe(error)
  }

  return {
    name: error.name,
    message: error.message,
    stack: error.stack,

    cause:
      error.cause === undefined
        ? undefined
        : serializeError(error.cause)
  }
}

/**
 * 将任意值转换成可以安全 JSON.stringify 的结构。
 *
 * 同时处理：
 * - Error
 * - BigInt
 * - Date
 * - 循环引用
 * - 常见敏感字段
 */
function toJsonSafe(
  value: unknown,
  seen = new WeakSet<object>()
): unknown {
  if (
    value === null ||
    value === undefined
  ) {
    return value
  }

  if (
    typeof value === 'string' ||
    typeof value === 'number' ||
    typeof value === 'boolean'
  ) {
    return value
  }

  if (typeof value === 'bigint') {
    return value.toString()
  }

  if (
    typeof value === 'function'
  ) {
    return `[Function: ${value.name || 'anonymous'}]`
  }

  if (typeof value === 'symbol') {
    return value.toString()
  }

  if (value instanceof Date) {
    return value.toISOString()
  }

  if (value instanceof Error) {
    return serializeError(value)
  }

  if (Array.isArray(value)) {
    return value.map(item =>
      toJsonSafe(item, seen)
    )
  }

  if (typeof value === 'object') {
    if (seen.has(value)) {
      return '[Circular]'
    }

    seen.add(value)

    const output: Record<
      string,
      unknown
    > = {}

    for (
      const [key, item] of
      Object.entries(value)
    ) {
      if (isSensitiveKey(key)) {
        output[key] = '[REDACTED]'
        continue
      }

      output[key] =
        toJsonSafe(item, seen)
    }

    seen.delete(value)

    return output
  }

  return String(value)
}

/**
 * 只匹配明确的敏感字段。
 *
 * 不使用简单的 key.includes('token')，
 * 避免把 tokenUsage 这种统计字段也删除。
 */
function isSensitiveKey(
  key: string
): boolean {
  const normalizedKey =
    key
      .toLowerCase()
      .replace(/[-_]/g, '')

  return [
    'authorization',
    'apikey',
    'deepseekapikey',
    'jwt',
    'jwtsecret',
    'accesstoken',
    'refreshtoken',
    'password',
    'passwordhash'
  ].includes(normalizedKey)
}