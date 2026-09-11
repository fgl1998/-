import 'dotenv/config'

import { z } from 'zod'

import { ChatDeepSeek } from '@langchain/deepseek'

import {
  HumanMessage,
  ToolMessage,
} from '@langchain/core/messages'

import { tool } from '@langchain/core/tools'

import {
  START,
  END,
  StateGraph,
  StateSchema,
  MessagesValue,
  type GraphNode,
} from '@langchain/langgraph'


// ==================== 1. 创建模型 ====================

const model = new ChatDeepSeek({
  model: 'deepseek-chat',
  temperature: 0,
})


// ==================== 2. 定义 Tool ====================

const multiplyTool = tool(
  async ({ a, b }) => {
    console.log('multiplyTool 真正执行了')

    return a * b
  },
  {
    name: 'multiply',

    description: '计算两个数字的乘积',

    schema: z.object({
      a: z.number().describe('第一个数字'),
      b: z.number().describe('第二个数字'),
    }),
  }
)


// ==================== 3. 把 Tool 说明交给模型 ====================

const modelWithTools = model.bindTools([
  multiplyTool,
])


// ==================== 4. 定义状态 ====================

const ChatState = new StateSchema({
  messages: MessagesValue,
})


// ==================== 5. 定义 AI 节点 ====================

// const agentNode: GraphNode<typeof ChatState> = async state => {
//   console.log('① 进入 agentNode')

//   // AI 读取用户消息和工具说明
//   const aiMessage = await modelWithTools.invoke(
//     state.messages
//   )

//   console.log('② AI 返回的 tool_calls：')
//   console.dir(aiMessage.tool_calls, {
//     depth: null,
//   })

//   // 取得 AI 提出的第一条工具调用请求
//   const toolCall = aiMessage.tool_calls?.[0]

//   // AI 没有调用工具
//   if (!toolCall) {
//     console.log('AI 没有请求调用工具')

//     return {
//       messages: [aiMessage],
//     }
//   }

//   console.log('③ AI 想调用：', toolCall.name)
//   console.log('AI 提供的参数：', toolCall.args)

//   // 当前只有 multiply 这一个工具
//   if (toolCall.name !== 'multiply') {
//     throw new Error(`未知工具：${toolCall.name}`)
//   }

//   // TypeScript 真正执行工具
//   const toolResult = await multiplyTool.invoke(
//     toolCall.args
//   )

//   console.log('④ 工具执行结果：', toolResult)

//   return {
//     messages: [aiMessage],
//   }
// }
const agentNode: GraphNode<typeof ChatState> = async state => {
  console.log('① 第一次调用 AI')

  // 第一次调用 AI：让 AI 决定是否需要 Tool
  const aiMessage = await modelWithTools.invoke(
    state.messages
  )

  const toolCall = aiMessage.tool_calls?.[0]

  // 没有工具调用，直接返回普通回答
  if (!toolCall) {
    return {
      messages: [aiMessage],
    }
  }

  console.log('② AI 请求调用：', toolCall.name)
  console.log('调用参数：', toolCall.args)

  if (toolCall.name !== 'multiply') {
    throw new Error(`未知工具：${toolCall.name}`)
  }

  if (!toolCall.id) {
    throw new Error('工具调用缺少 id')
  }

  // TypeScript 真正执行 Tool
  const toolResult = await multiplyTool.invoke(
    toolCall.args
  )

  console.log('③ Tool 执行结果：', toolResult)

  // 把普通数据包装成 ToolMessage
  const toolMessage = new ToolMessage({
    content: String(toolResult),
    name: toolCall.name,
    tool_call_id: toolCall.id,
  })

  console.log('④ 创建 ToolMessage：')
  console.dir(toolMessage, {
    depth: null,
  })

  // 第二次调用 AI
  const finalAiMessage = await modelWithTools.invoke([
    ...state.messages,
    aiMessage,
    toolMessage,
  ])

  console.log('⑤ AI 最终回答：')
  console.log(finalAiMessage.content)

  // 返回本节点新产生的三条消息
  return {
    messages: [
      aiMessage,
      toolMessage,
      finalAiMessage,
    ],
  }
}

// ==================== 6. 创建工作流 ====================

const workflow = new StateGraph(ChatState)
  .addNode('agent', agentNode)
  .addEdge(START, 'agent')
  .addEdge('agent', END)

const graph = workflow.compile()


// ==================== 7. 执行 ====================

async function main() {
  const result = await graph.invoke({
    messages: [
      new HumanMessage(
        '请调用 multiply 工具计算 12 乘以 8'
      ),
    ],
  })

  console.log('最终 messages：')

  result.messages.forEach((message, index) => {
    console.log(`消息 ${index + 1}`)
    console.log('类型：', message.constructor.name)
    console.log('内容：', message.content)
  })
}


main().catch(console.error)