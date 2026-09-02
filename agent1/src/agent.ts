import { createAgent,humanInTheLoopMiddleware,toolStrategy, } from 'langchain'
import { ChatDeepSeek } from '@langchain/deepseek'
import { tools } from './tools.js'
import { systemPrompt } from './prompts.js'
import { MemorySaver } from "@langchain/langgraph"
import { AgentResponseSchema } from "./agent-response.schema.js"
import { AgentContextSchema } from "./context.schema.js"

const model = new ChatDeepSeek({

  apiKey: process.env.DEEPSEEK_API_KEY,
  model: 'deepseek-v4-flash',
  temperature: 0,

  // Agent需要多轮调用工具，入门阶段先关闭思考模式
  modelKwargs: {
    thinking: {
      type: 'disabled'
    }
  }
})

const checkpointer = new MemorySaver();

export const agent = createAgent({
  model,
  tools,
  systemPrompt,
  middleware: [
    humanInTheLoopMiddleware({
      interruptOn: {
        sendEmail: {
          allowedDecisions: [
            "approve",
            "reject",
          ],
        },
      },
      descriptionPrefix: "工具执行需要人工审批",
    }),
  ],
  checkpointer,
  // 控制Agent最终返回格式
  responseFormat: toolStrategy(
    AgentResponseSchema,
  ),
  // contextSchema: AgentContextSchema,
})