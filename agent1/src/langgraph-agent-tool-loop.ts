import "dotenv/config";

import { ChatDeepSeek } from "@langchain/deepseek";
import {
  AIMessage,
  HumanMessage,
  ToolMessage,
} from "@langchain/core/messages";
import { tool } from "@langchain/core/tools";
import {
  END,
  MessagesValue,
  START,
  StateGraph,
  StateSchema,
  type GraphNode,
} from "@langchain/langgraph";
import { z } from "zod";

class ToolBusinessError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ToolBusinessError";
  }
}

/*
运行前请确保：

1. 已安装依赖：
   npm install @langchain/langgraph @langchain/core @langchain/deepseek zod dotenv

2. 项目根目录存在 .env：
   DEEPSEEK_API_KEY=你的密钥

3. 运行：
   npx tsx langgraph-agent-tool-loop.ts

这个例子只展示最核心的 Agent 循环：

用户消息 -> agent -> tool -> agent -> 最终回答

注意：AI 只负责生成 tool_calls；真正执行工具的是 toolNode 中的 TypeScript 代码。
*/

// ============================================================
// 1. 创建模型
// ============================================================

const model = new ChatDeepSeek({
  model: "deepseek-chat",
  temperature: 0,
});

// ============================================================
// 2. 创建两个工具
// ============================================================

const multiplyTool = tool(
  async ({ a, b }) => {
    console.log("真正执行 multiplyTool");
    return a * b;
  },
  {
    name: "multiply",
    description: "计算两个数字的乘积",
    schema: z.object({
      a: z.number().describe("第一个数字"),
      b: z.number().describe("第二个数字"),
    }),
  },
);

const addTool = tool(
  async ({ a, b }) => {
    console.log("真正执行 addTool");
    return a + b;
  },
  {
    name: "add",
    description: "计算两个数字的和",
    schema: z.object({
      a: z.number().describe("第一个数字"),
      b: z.number().describe("第二个数字"),
    }),
  },
);

const divideTool = tool(
  async ({ a, b }) => {
    console.log("真正执行 divideTool");

    if (b === 0) {
      // throw new Error("除数不能为 0");
      throw new ToolBusinessError("除数不能为 0");
    }

    return a / b;
  },
  {
    name: "divide",
    description: "计算两个数字相除的结果",
    schema: z.object({
      a: z.number().describe("被除数"),
      b: z.number().describe("除数"),
    }),
  },
);

// tools 是模型能够选择的全部工具。
const tools = [multiplyTool, addTool,divideTool];

// bindTools 只是把工具的名称、说明和参数结构告诉模型。
// 它不会自动执行工具。
const modelWithTools = model.bindTools(tools);

// toolNode 收到工具名后，通过这个对象找到真正的工具。
const toolsByName = Object.fromEntries(
  tools.map((currentTool) => [currentTool.name, currentTool]),
);

// ============================================================
// 3. 定义工作流状态
// ============================================================

const ChatState = new StateSchema({
  // MessagesValue 会把每个节点返回的新消息追加到原来的消息数组中。
  messages: MessagesValue,
});

// ============================================================
// 4. agent 节点：把全部消息交给 AI
// ============================================================

const agentNode: GraphNode<typeof ChatState> = async (state) => {
  console.log("\n进入 agentNode");
  console.log("当前消息数量：", state.messages.length);

  const aiMessage = await modelWithTools.invoke(state.messages);

  console.log("AI 返回的普通内容：", aiMessage.content);
  console.log("AI 返回的 tool_calls：");
  console.dir(aiMessage.tool_calls, { depth: null });

  // 这里只返回新增的 AIMessage。
  // MessagesValue 会负责把它追加进 state.messages。
  return {
    messages: [aiMessage],
  };
};

// ============================================================
// 5. 条件路由：判断 AI 是否请求调用工具
// ============================================================

const routeAfterAgent = (
  state: typeof ChatState.State,
): "tool" | typeof END => {
  const lastMessage = state.messages.at(-1);

  if (!lastMessage || !AIMessage.isInstance(lastMessage)) {
    return END;
  }

  const hasToolCalls = (lastMessage.tool_calls?.length ?? 0) > 0;

  // 有 tool_calls：去 tool 节点执行工具。
  // 没有 tool_calls：说明 AI 已经给出最终回答，结束工作流。
  return hasToolCalls ? "tool" : END;
};

// ============================================================
// 6. tool 节点：真正执行 AI 请求的工具
// ============================================================

const toolNode: GraphNode<typeof ChatState> = async (state) => {
  console.log("\n进入 toolNode");

  const lastMessage = state.messages.at(-1);

  if (!lastMessage || !AIMessage.isInstance(lastMessage)) {
    throw new Error("toolNode 收到的最后一条消息不是 AIMessage");
  }

  const toolCalls = lastMessage.tool_calls ?? [];

  if (toolCalls.length === 0) {
    throw new Error("AIMessage 中没有需要执行的 tool_calls");
  }

  const toolMessages: ToolMessage[] = [];

  // 一条 AIMessage 可能包含一个或多个工具调用请求，所以这里必须遍历。
  // for (const toolCall of toolCalls) {
  //   if (!toolCall.id) {
  //     throw new Error(`工具调用 ${toolCall.name} 缺少 id`);
  //   }

  //   const currentTool = toolsByName[toolCall.name];

  //   if (!currentTool) {
  //     throw new Error(`找不到工具：${toolCall.name}`);
  //   }

  //   console.log("准备执行工具：", toolCall.name);
  //   console.log("工具参数：", toolCall.args);

  //   // 这里才是真正执行本地 TypeScript 工具函数的地方。
  //   const toolResult = await currentTool.invoke(toolCall.args);

  //   console.log("工具结果：", toolResult);

  //   // 把工具结果包装成 ToolMessage。
  //   // tool_call_id 必须对应 AIMessage 中同一个工具请求的 id。
  //   toolMessages.push(
  //     new ToolMessage({
  //       content: String(toolResult),
  //       name: toolCall.name,
  //       tool_call_id: toolCall.id,
  //     }),
  //   );
  // }
  for (const toolCall of toolCalls) {
  if (!toolCall.id) {
    throw new Error(`工具调用 ${toolCall.name} 缺少 id`);
  }

  try {
    const currentTool = toolsByName[toolCall.name];

    if (!currentTool) {
      throw new Error(`找不到工具：${toolCall.name}`);
    }

    console.log("准备执行工具：", toolCall.name);
    console.log("工具参数：", toolCall.args);

    const toolResult = await currentTool.invoke(
      toolCall.args,
    );

    console.log("工具执行成功：", toolResult);

    toolMessages.push(
      new ToolMessage({
        content: String(toolResult),
        name: toolCall.name,
        tool_call_id: toolCall.id,
      }),
    );
  } catch (error: unknown) {
    if (error instanceof ToolBusinessError) {
      console.log("工具业务错误：", error.message);

      toolMessages.push(
        new ToolMessage({
          content: `工具执行失败：${error.message}`,
          name: toolCall.name,
          tool_call_id: toolCall.id,
        }),
      );

      // 结束当前工具调用，继续处理下一个 toolCall
      continue;
    }

    // 未知系统错误只记录在服务器日志中
    console.error("工具出现系统错误：", error);

    // 继续向外抛出，终止工作流
    throw error;
  }
}

  // 一次性返回本轮产生的全部 ToolMessage。
  return {
    messages: toolMessages,
  };
};

// ============================================================
// 7. 创建工作流
// ============================================================

const workflow = new StateGraph(ChatState)
  .addNode("agent", agentNode)
  .addNode("tool", toolNode)
  .addEdge(START, "agent")
  .addConditionalEdges("agent", routeAfterAgent, ["tool", END])
  // 工具执行完后回到 agent。
  // 此时 AI 能看到 HumanMessage、带 tool_calls 的 AIMessage 和 ToolMessage。
  .addEdge("tool", "agent");

const graph = workflow.compile();

// ============================================================
// 8. 调用工作流
// ============================================================

async function main() {
  const result = await graph.invoke({
    messages: [
      new HumanMessage(
        [
      //      `请同时调用工具完成两个独立任务：
      //  计算 12 乘以 8,
      //  计算的到的结果加 5
      //  最后告诉我最终结果`

      `请使用 divide 计算 10 除以 0`
        ].join(""),
      ),
    ],
  });

  console.log("\n========== 工作流结束 ==========");

  result.messages.forEach((message, index) => {
    console.log(`\n第 ${index + 1} 条消息`);
    console.log("消息类型：", message.constructor.name);
    console.log("消息内容：", message.content);

    if (AIMessage.isInstance(message)) {
      console.log("tool_calls：");
      console.dir(message.tool_calls, { depth: null });
    }

    if (ToolMessage.isInstance(message)) {
      console.log("对应的 tool_call_id：", message.tool_call_id);
    }
  });
}

main().catch((error: unknown) => {
  console.error("运行失败：", error);
  process.exitCode = 1;
});
