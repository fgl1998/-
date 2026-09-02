import type {
  AgentChatInput,
  AgentChatOutput
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
    token: string,
    input: AgentChatInput
  ): Promise<AgentChatOutput> {
    const answer = await this.agentRuntime.run({
      message: input.message,
      token
    })

    return {
      answer
    }
  }
}