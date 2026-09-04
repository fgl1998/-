import type { ChatDeepSeek } from '@langchain/deepseek'
import { AIMessage,ToolMessage,BaseMessage } from '@langchain/core/messages'
// import type { BaseMessage } from '@langchain/core/messages'

import { createAgent } from 'langchain'


import { AppError } from '../../../common/errors/app.error.js'
import { AgentExecutionError } from '../../../common/errors/agent.error.js'
import type { RealWorldClient } from '../../../clients/realworld.client.js'

import { createSearchArticlesTool } from '../tools/index.js'
import { AGENT_SYSTEM_PROMPT } from './system.prompt.js'

import type {AgentTraceLogger} from '../../../common/logging/agent-trace.logger.js'
import type {
  MemorySaver
} from '@langchain/langgraph'
import type {
  BaseCheckpointSaver
} from '@langchain/langgraph'

import type { AgentHistoryMessageOutput } from '../agent.schema.js' 


export interface AgentRuntimeDependencies {
  model: ChatDeepSeek
  realWorldClient: RealWorldClient

  traceLogger: AgentTraceLogger

  checkpointer: BaseCheckpointSaver
}

export interface RunAgentInput {
  userId: number
  message: string
  token: string
}

export class AgentRuntime {
  private readonly model: ChatDeepSeek
  private readonly realWorldClient: RealWorldClient

  private readonly traceLogger: AgentTraceLogger
  private readonly checkpointer: BaseCheckpointSaver

  constructor(dependencies: AgentRuntimeDependencies) {
    this.model = dependencies.model
    this.realWorldClient = dependencies.realWorldClient

    this.traceLogger =dependencies.traceLogger
    this.checkpointer = dependencies.checkpointer
  }

  async run(input: RunAgentInput): Promise<string> {
    const startedAt = new Date()
    let traceMessages:
    readonly BaseMessage[] = []
    try {
      const tools = [
        createSearchArticlesTool({
          realWorldClient: this.realWorldClient,
          token: input.token
        })
      ]

      const agent = createAgent({
        model: this.model,
        tools,
        systemPrompt: AGENT_SYSTEM_PROMPT,
        checkpointer: this.checkpointer
      })

      const threadId = `realworld-user:${input.userId}`

      const result = await agent.invoke({
        messages: [
          {
            role: 'user',
            content: input.message
          }
        ]
      },{
        configurable:{
          thread_id: threadId
        }

      })
       /*
     * 先保存到局部变量。
     *
     * 如果后面的extractFinalAnswer失败，
     * catch仍然可以把这些messages写入失败日志。
     */
      traceMessages = result.messages

      const answer =
        this.extractFinalAnswer(
          result.messages
        )

      await this.traceLogger.write({
      status: 'success',
      startedAt,
      inputMessage: input.message,
      messages: traceMessages
      })

      // return this.extractFinalAnswer(result.messages)
      return answer
    } catch (error) {
      await this.traceLogger.write({
        status: 'failed',
        startedAt,
        inputMessage: input.message,
        messages: traceMessages,
        error
      })

      if (error instanceof AppError) {
        throw error
      }

      throw new AgentExecutionError(error)
    }
  }

  // 它适合当前无历史记录的单轮 Agent，但不适合作为未来多轮对话的通用实现
  private extractFinalAnswer(
    messages: Awaited<
      ReturnType<
        ReturnType<typeof createAgent>['invoke']
      >
    >['messages']
  ): string {
    for (let index = messages.length - 1; index >= 0; index -= 1) {
      const message = messages[index]

      if (!AIMessage.isInstance(message)) {
        continue
      }

      if (message.tool_calls && message.tool_calls.length > 0) {
        continue
      }

      const content = this.extractTextContent(message.content)

      if (content) {
        return content
      }
    }

    throw new AgentExecutionError(
      new Error('Agent 没有返回最终文本结果')
    )
  }

  private extractTextContent(
    content: AIMessage['content']
  ): string {
    if (typeof content === 'string') {
      return content.trim()
    }

    return content
      .map(block => {
        if (typeof block === 'string') {
          return block
        }

        if (
          block &&
          typeof block === 'object' &&
          'text' in block &&
          typeof block.text === 'string'
        ) {
          return block.text
        }

        return ''
      })
      .filter(Boolean)
      .join('\n')
      .trim()
  }

   /**
   * 查询当前用户会话中的全部消息。
   *
   * 这里不调用大模型，也不调用 Tool。
   * 只是读取 SQLite 中最新的 checkpoint。
   */
  async getHistory(
    userId: number
  ): Promise<
    AgentHistoryMessageOutput[]
  > {
    try {
      const threadId = `realworld-user:${userId}`

      /*
       * 不传 checkpoint_id 时，
       * SqliteSaver 会读取这个 thread
       * 最新的一份 checkpoint。
       */
      const checkpointTuple =
        await this.checkpointer
          .getTuple({
            configurable: {
              thread_id:
                threadId
            }
          })

      if (!checkpointTuple) {
        return []
      }

      /*
       * createAgent 默认把对话消息
       * 保存在 channel_values.messages。
       */
      const storedMessages =
        checkpointTuple
          .checkpoint
          .channel_values
          .messages

      if (
        !Array.isArray(
          storedMessages
        )
      ) {
        return []
      }

      /*
       * Checkpointer 反序列化后，
       * 应该得到 LangChain BaseMessage 实例。
       *
       * 这里再判断一次，避免异常数据
       * 导致接口失败。
       */
      const messages =
        storedMessages.filter(
          (
            message
          ): message is BaseMessage =>
            BaseMessage.isInstance(
              message
            )
        )

      return messages.map(
        (message, index) =>
          this.toHistoryMessage(
            message,
            index
          )
      )
    } catch (error) {
      if (
        error instanceof AppError
      ) {
        throw error
      }

      throw new AgentExecutionError(
        error
      )
    }
  }

  /**
   * 把 LangChain Message 转换为
   * 前端容易使用的普通对象。
   */
  private toHistoryMessage(
    message: BaseMessage,
    index: number
  ): AgentHistoryMessageOutput {
    const isAiMessage =
      AIMessage.isInstance(
        message
      )

    const isToolMessage =
      ToolMessage.isInstance(
        message
      )

    const toolCalls =
      isAiMessage
        ? message.tool_calls ?? []
        : []

    const toolCallId =
      isToolMessage
        ? message.tool_call_id
        : null

    return {
      index,

      id:
        message.id ?? null,

      type:
        message.getType(),

      name:
        message.name ?? null,

      content:
        message.content,

      toolCalls,

      toolCallId,

      isFinalAnswer:
        isAiMessage &&
        toolCalls.length === 0
    }
  }
}