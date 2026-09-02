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