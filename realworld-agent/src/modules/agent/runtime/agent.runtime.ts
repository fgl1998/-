import type { ChatDeepSeek } from '@langchain/deepseek'
import { AIMessage } from '@langchain/core/messages'
import { createAgent } from 'langchain'


import { AppError } from '../../../common/errors/app.error.js'
import { AgentExecutionError } from '../../../common/errors/agent.error.js'
import type { RealWorldClient } from '../../../clients/realworld.client.js'

import { createSearchArticlesTool } from '../tools/index.js'
import { AGENT_SYSTEM_PROMPT } from './system.prompt.js'

import type {AgentTraceLogger} from '../../../common/logging/agent-trace.logger.js'
import type { BaseMessage } from '@langchain/core/messages'
import type {
  MemorySaver
} from '@langchain/langgraph'

export interface AgentRuntimeDependencies {
  model: ChatDeepSeek
  realWorldClient: RealWorldClient

  traceLogger: AgentTraceLogger

  checkpointer: MemorySaver
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
  private readonly checkpointer: MemorySaver

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
}