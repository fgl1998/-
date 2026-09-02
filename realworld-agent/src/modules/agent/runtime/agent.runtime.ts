import type { ChatDeepSeek } from '@langchain/deepseek'
import { AIMessage } from '@langchain/core/messages'
import { createAgent } from 'langchain'

import { AppError } from '../../../common/errors/app.error.js'
import { AgentExecutionError } from '../../../common/errors/agent.error.js'
import type { RealWorldClient } from '../../../clients/realworld.client.js'

import { createSearchArticlesTool } from '../tools/index.js'
import { AGENT_SYSTEM_PROMPT } from './system.prompt.js'

export interface AgentRuntimeDependencies {
  model: ChatDeepSeek
  realWorldClient: RealWorldClient
}

export interface RunAgentInput {
  message: string
  token: string
}

export class AgentRuntime {
  private readonly model: ChatDeepSeek
  private readonly realWorldClient: RealWorldClient

  constructor(dependencies: AgentRuntimeDependencies) {
    this.model = dependencies.model
    this.realWorldClient = dependencies.realWorldClient
  }

  async run(input: RunAgentInput): Promise<string> {
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
        systemPrompt: AGENT_SYSTEM_PROMPT
      })

      const result = await agent.invoke({
        messages: [
          {
            role: 'user',
            content: input.message
          }
        ]
      })

      return this.extractFinalAnswer(result.messages)
    } catch (error) {
      if (error instanceof AppError) {
        throw error
      }

      throw new AgentExecutionError(error)
    }
  }

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