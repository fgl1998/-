import type {
  AgentChatInput,
  AgentChatOutput,
  AgentHistoryOutput
} from './agent.schema.js'

import type { AgentRuntime } from './runtime/agent.runtime.js'

export interface AgentServiceDependencies {
  agentRuntime: AgentRuntime
}

export class AgentService {
  private readonly agentRuntime: AgentRuntime

  constructor(dependencies: AgentServiceDependencies) {
    this.agentRuntime = dependencies.agentRuntime
  }

  async chat(
    userId: number,
    token: string,
    input: AgentChatInput
  ): Promise<AgentChatOutput> {
    const answer = await this.agentRuntime.run({
      userId,
      message: input.message,
      token
    })

    return {
      answer
    }
  }

  async getHistory(
    userId: number
  ): Promise<AgentHistoryOutput> {
    const messages =
      await this.agentRuntime
        .getHistory(userId)

    return {
      messages
    }
  }
}