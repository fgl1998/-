import 'dotenv/config'

import { z } from 'zod'

import { ChatDeepSeek } from '@langchain/deepseek'

import {
  HumanMessage,
  AIMessage,
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


// ==================== 模型 ====================

const model = new ChatDeepSeek({
  model: 'deepseek-chat',
  temperature: 0,
})


// ==================== Tool ====================

const multiplyTool = tool(
  async ({ a, b }) => {
    console.log('真正执行 multiplyTool')

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
const addTool = tool(
  async ({ a, b }) => {
    console.log('真正执行 addTool')

    return a + b
  },
  {
    name: 'add',
    description: '计算两个数字的和',

    schema: z.object({
      a: z.number().describe('第一个数字'),
      b: z.number().describe('第二个数字'),
    }),
  }
)

const modelWithTools = model.bindTools([
  multiplyTool,
  addTool,
])


// ==================== State ====================

const ChatState = new StateSchema({
  messages: MessagesValue,
})


// ==================== 节点一：AI 决策 ====================

const agentNode: GraphNode<typeof ChatState> = async state => {
  console.log('\n① 进入 agentNode')
  console.log('收到消息数量：', state.messages.length)

  const aiMessage = await modelWithTools.invoke(
    state.messages
  )

  console.log('AI 请求调用：')
  console.dir(aiMessage.tool_calls, {
    depth: null,
  })

  return {
    messages: [aiMessage],
  }
}
const routeAfterAgent = (
  state: typeof ChatState.State
) => {
  console.log('\n进入 routeAfterAgent')

  // agentNode 刚刚返回的最后一条消息
  const lastMessage = state.messages.at(-1)

  // 最后一条不是 AIMessage，直接结束
  if (
    !lastMessage ||
    !AIMessage.isInstance(lastMessage)
  ) {
    return END
  }

  // 检查 AIMessage 中有没有工具调用请求
  const hasToolCall =
    (lastMessage.tool_calls?.length ?? 0) > 0

  if (hasToolCall) {
    console.log('存在 tool_calls，前往 toolNode')

    return 'tool'
  }

  console.log('不存在 tool_calls，结束工作流')

  return END
}


// ==================== 节点二：执行 Tool ====================

// const toolNode: GraphNode<typeof ChatState> = async state => {
//   console.log('\n② 进入 toolNode')
//   console.log('收到消息数量：', state.messages.length)

//   // 取得上一节点添加的最后一条消息
//   const lastMessage = state.messages.at(-1)

//   if (
//     !lastMessage ||
//     !AIMessage.isInstance(lastMessage)
//   ) {
//     throw new Error('最后一条消息不是 AIMessage')
//   }

//   const toolCall = lastMessage.tool_calls?.[0]

//   if (!toolCall) {
//     throw new Error('AI 没有请求调用工具')
//   }

//   if (toolCall.name !== 'multiply') {
//     throw new Error(`未知工具：${toolCall.name}`)
//   }

//   if (!toolCall.id) {
//     throw new Error('工具调用缺少 id')
//   }

//   const toolResult = await multiplyTool.invoke(
//     toolCall.args
//   )

//   const toolMessage = new ToolMessage({
//     content: String(toolResult),
//     name: toolCall.name,
//     tool_call_id: toolCall.id,
//   })

//   console.log('ToolMessage：')
//   console.dir(toolMessage, {
//     depth: null,
//   })

//   return {
//     messages: [toolMessage],
//   }
// }
const toolNode: GraphNode<typeof ChatState> = async state => {
  console.log('\n进入 toolNode')

  const lastMessage = state.messages.at(-1)

  if (
    !lastMessage ||
    !AIMessage.isInstance(lastMessage)
  ) {
    throw new Error('最后一条消息不是 AIMessage')
  }

  // 取得全部工具调用请求
  const toolCalls = lastMessage.tool_calls ?? []

  if (toolCalls.length === 0) {
    throw new Error('没有需要执行的工具')
  }

  // 用来保存全部 ToolMessage
  const toolMessages: ToolMessage[] = []

  // 逐条处理工具调用
  for (const toolCall of toolCalls) {
    console.log('\nAI 请求调用：', toolCall.name)
    console.log('参数：', toolCall.args)

    if (!toolCall.id) {
      throw new Error('工具调用缺少 id')
    }

    let toolResult: number

    // 根据名称调用不同工具
    if (toolCall.name === 'multiply') {
      toolResult = await multiplyTool.invoke(
        toolCall.args
      )
    } else if (toolCall.name === 'add') {
      toolResult = await addTool.invoke(
        toolCall.args
      )
    } else {
      throw new Error(`未知工具：${toolCall.name}`)
    }

    console.log('工具结果：', toolResult)

    // 每次工具调用都有自己的 ToolMessage
    const toolMessage = new ToolMessage({
      content: String(toolResult),
      name: toolCall.name,
      tool_call_id: toolCall.id,
    })

    toolMessages.push(toolMessage)
  }

  // 一次返回所有工具结果
  return {
    messages: toolMessages,
  }
}


// ==================== 节点三：AI 最终回答 ====================

const answerNode: GraphNode<typeof ChatState> = async state => {
  console.log('\n③ 进入 answerNode')
  console.log('收到消息数量：', state.messages.length)

  const finalAiMessage = await modelWithTools.invoke(
    state.messages
  )

  console.log('AI 最终回答：')
  console.log(finalAiMessage.content)

  return {
    messages: [finalAiMessage],
  }
}


// ==================== 工作流 ====================

const workflow = new StateGraph(ChatState)
  .addNode('agent', agentNode)
  .addNode('tool', toolNode)

  .addEdge(START, 'agent')
  .addConditionalEdges(
    'agent',
    routeAfterAgent,
    ['tool', END]
  )
  .addEdge('tool', 'agent')


const graph = workflow.compile()


// ==================== 执行 ====================

async function main() {
  const result = await graph.invoke({
    messages: [
      new HumanMessage(
        // '请调用 multiply 工具计算 12 乘以 8'
        // '介绍一下你自己'
         `请同时调用工具完成两个独立任务：
       计算 12 乘以 8,
       计算的到的结果加 5
       最后告诉我最终结果`
      ),
    ],
  })

  console.log('\n========== 最终 messages ==========')

  result.messages.forEach((message, index) => {
    console.log(`\n消息 ${index + 1}`)
    console.log('类型：', message.constructor.name)
    console.log('内容：', message.content)

    if (AIMessage.isInstance(message)) {
      console.log('tool_calls：', message.tool_calls)
    }
  })
}

main().catch(console.error)