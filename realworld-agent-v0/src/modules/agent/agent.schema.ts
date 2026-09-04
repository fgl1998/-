import { z } from 'zod'

export const AgentChatSchema = z.object({
  message: z
    .string()
    .trim()
    .min(1, '请输入问题')
    .max(2000, '问题不能超过 2000 个字符')
})

export type AgentChatInput = z.infer<typeof AgentChatSchema>

export interface AgentChatOutput {
  answer: string
}

/**
 * 返回给前端的一条历史消息。
 */
export interface AgentHistoryMessageOutput {
  /**
   * 消息在当前会话中的顺序。
   */
  index: number

  /**
   * LangChain 消息 ID。
   * 部分 HumanMessage 可能没有 ID。
   */
  id: string | null

  /**
   * 常见值：
   * human、ai、tool、system。
   */
  type: string

  /**
   * 消息名称。
   * Tool 或具名消息可能存在。
   */
  name: string | null

  /**
   * 原始消息内容。
   *
   * 可能是字符串，也可能是多模态内容数组。
   */
  content: unknown

  /**
   * 只有发起工具调用的 AIMessage
   * 才会包含数据。
   */
  toolCalls: unknown[]

  /**
   * ToolMessage 对应的工具调用 ID。
   */
  toolCallId: string | null

  /**
   * 是否为没有继续调用工具的 AIMessage。
   *
   * 当前 ReAct 流程中可以用来判断
   * 是否为最终回答。
   */
  isFinalAnswer: boolean
}

export interface AgentHistoryOutput {
  messages:
    AgentHistoryMessageOutput[]
}