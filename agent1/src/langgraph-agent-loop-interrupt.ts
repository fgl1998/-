import "dotenv/config";

import {
  AIMessage,
  HumanMessage,
  SystemMessage,
  ToolMessage,
  type BaseMessage,
} from "@langchain/core/messages";
import { tool } from "@langchain/core/tools";
import { ChatDeepSeek } from "@langchain/deepseek";
import {
  Command,
  END,
  MemorySaver,
  MessagesValue,
  START,
  StateGraph,
  StateSchema,
  interrupt,
  type GraphNode,
} from "@langchain/langgraph";
import { ToolNode } from "@langchain/langgraph/prebuilt";
import { stdin, stdout } from "node:process";
import { createInterface } from "node:readline/promises";
import { z } from "zod";

/*
运行前：

1. 安装依赖：
   npm install @langchain/langgraph @langchain/core @langchain/deepseek zod dotenv

2. 在 .env 中配置：
   DEEPSEEK_API_KEY=你的密钥

3. 运行：
   npx tsx langgraph-agent-loop-interrupt.ts

正确流程：

START
  -> agent
  -> tool
  -> agent
  -> tool
  -> agent
  -> checkResult
      -> 最终结果 > 200：END
      -> 最终结果 <= 200：interrupt
          -> 用户输入新的计算要求
          -> agent，开始新一轮 Agent-Tool 循环

关键点：
只有 agent 不再返回 tool_calls，才说明本轮计算结束，才能检查最终结果。
*/

// ============================================================
// 1. 创建计算工具
// ============================================================

const multiplyTool = tool(
  async ({ a, b }) => {
    const result = a * b;
    console.log(`[multiply] ${a} × ${b} = ${result}`);
    return result;
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
    const result = a + b;
    console.log(`[add] ${a} + ${b} = ${result}`);
    return result;
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

const tools = [multiplyTool, addTool];

// 官方 ToolNode 会读取 AIMessage.tool_calls、执行工具并生成 ToolMessage。
const toolNode = new ToolNode(tools);

// bindTools 只负责把工具信息告诉模型，不会执行工具。
const model = new ChatDeepSeek({
  model: "deepseek-chat",
  temperature: 0,
});

const modelWithTools = model.bindTools(tools);

// ============================================================
// 2. 定义状态
// ============================================================

const CalculationState = new StateSchema({
  messages: MessagesValue,

  // checkResultNode 执行完后写入：
  // true  -> 最终结果 > 200，可以结束
  // false -> 用户已经提交新要求，需要回到 agent
  isResultOver200: z.boolean().nullable().default(null),
});

// interrupt 恢复时，Command.resume 必须符合这个结构。
const RecalculateInputSchema = z.object({
  calculation: z.string().trim().min(1, "新的计算要求不能为空"),
});

// ============================================================
// 3. agent 节点
// ============================================================

const systemMessage = new SystemMessage(
  [
    "你是一个计算助手，所有加法和乘法都必须调用提供的工具，不能自己口算。",
    "一次任务可能包含多步计算。",
    "如果后一步依赖前一步的结果，必须先调用第一个工具，收到 ToolMessage 后，再调用下一个工具。",
    "完成全部工具调用后，再向用户说明最终计算结果。",
    "不得自行修改用户提供的数字。",
  ].join("\n"),
);

const agentNode: GraphNode<typeof CalculationState> = async (state) => {
  console.log("\n========== 进入 agentNode ==========");

  const aiMessage = await modelWithTools.invoke([
    systemMessage,
    ...state.messages,
  ]);

  console.log("AI 内容：", aiMessage.content);
  console.log("AI tool_calls：");
  console.dir(aiMessage.tool_calls, { depth: null });

  return {
    messages: [aiMessage],
  };
};

// ============================================================
// 4. agent 后面的路由
// ============================================================

const routeAfterAgent = (
  state: typeof CalculationState.State,
): "tool" | "checkResult" => {
  const lastMessage = state.messages.at(-1);

  if (!lastMessage || !AIMessage.isInstance(lastMessage)) {
    throw new Error("agentNode 执行后，最后一条消息必须是 AIMessage");
  }

  const hasToolCalls = (lastMessage.tool_calls?.length ?? 0) > 0;

  if (hasToolCalls) {
    // AI 还要调用工具，本轮计算尚未结束。
    return "tool";
  }

  // AI 不再调用工具，本轮 Agent-Tool 循环结束。
  // 现在才能检查最终计算结果。
  return "checkResult";
};

// ============================================================
// 5. 检查最终计算结果
// ============================================================

function findLatestToolResult(
  messages: readonly BaseMessage[],
): number {
  // 从后往前找，拿到本轮计算中最后一次工具执行的结果。
  const latestToolMessage = [...messages]
    .reverse()
    .find((message) => ToolMessage.isInstance(message));

  if (!latestToolMessage) {
    throw new Error("没有找到 ToolMessage，无法检查最终计算结果");
  }

  const result = Number(latestToolMessage.text);

  if (!Number.isFinite(result)) {
    throw new Error(`工具最终结果不是有效数字：${latestToolMessage.text}`);
  }

  return result;
}

const checkResultNode: GraphNode<typeof CalculationState> = async (state) => {
  console.log("\n========== 进入 checkResultNode ==========");

  const finalResult = findLatestToolResult(state.messages);

  console.log("本轮最终计算结果：", finalResult);

  if (finalResult > 200) {
    console.log("结果大于 200，允许结束工作流");

    return {
      isResultOver200: true,
    };
  }

  console.log("结果没有大于 200，暂停并等待用户重新输入");

  // interrupt 在这里暂停。
  // 恢复时 new Command({ resume: ... }) 中的值会返回到 resumeValue。
  // 不要把 interrupt 放进普通 try/catch。
  const resumeValue = interrupt({
    type: "recalculate",
    currentResult: finalResult,
    requiredResult: "> 200",
    message: `当前最终结果是 ${finalResult}，必须大于 200，请输入新的完整计算要求。`,
  });

  const newInput = RecalculateInputSchema.parse(resumeValue);

  // interrupt 恢复后，把用户的新要求追加成一条新的 HumanMessage。
  // 然后路由回 agent，重新开始 Agent-Tool 循环。
  return {
    isResultOver200: false,
    messages: [
      new HumanMessage(
        [
          `上一轮最终结果 ${finalResult} 没有大于 200。`,
          `用户新的计算要求：${newInput.calculation}`,
          "请根据新要求重新调用工具计算。",
        ].join("\n"),
      ),
    ],
  };
};

// ============================================================
// 6. checkResult 后面的路由
// ============================================================

const routeAfterCheck = (
  state: typeof CalculationState.State,
): "agent" | typeof END => {
  return state.isResultOver200 ? END : "agent";
};

// ============================================================
// 7. 创建工作流
// ============================================================

const workflow = new StateGraph(CalculationState)
  .addNode("agent", agentNode)
  .addNode("tool", toolNode)
  .addNode("checkResult", checkResultNode)
  .addEdge(START, "agent")

  // 有 tool_calls 就执行工具；没有才检查最终结果。
  .addConditionalEdges("agent", routeAfterAgent, ["tool", "checkResult"])

  // 工具执行完必须回到 agent。
  // agent 可能继续调用下一工具，也可能生成最终回答。
  .addEdge("tool", "agent")

  // 检查通过就结束；恢复并收到新输入后回到 agent。
  .addConditionalEdges("checkResult", routeAfterCheck, ["agent", END]);

// interrupt 必须配合 checkpointer 使用。
const checkpointer = new MemorySaver();

const graph = workflow.compile({
  checkpointer,
});

// 同一次暂停与恢复必须使用相同的 thread_id。
const config = {
  configurable: {
    thread_id: "calculator-over-200-demo",
  },
};

// ============================================================
// 8. 从命令行运行并处理多次 interrupt
// ============================================================

async function main() {
  const readline = createInterface({
    input: stdin,
    output: stdout,
  });

  try {
    console.log("计算目标：最终结果必须大于 200");
    console.log("示例：先计算 12 乘以 8，再把结果加 50");

    const initialCalculation = await readline.question(
      "\n请输入第一次完整计算要求：",
    );

    if (!initialCalculation.trim()) {
      throw new Error("第一次计算要求不能为空");
    }

    let result = await graph.invoke(
      {
        messages: [new HumanMessage(initialCalculation)],
      },
      config,
    );

    // 如果新结果仍然 <= 200，还会再次 interrupt，因此这里使用循环。
    while (result.__interrupt__?.length) {
      const currentInterrupt = result.__interrupt__.at(0);

      console.log("\n========== 工作流已暂停 ==========");
      console.dir(currentInterrupt?.value, { depth: null });

      const newCalculation = await readline.question(
        "请输入新的完整计算要求：",
      );

      if (!newCalculation.trim()) {
        console.log("输入不能为空，请重新输入");
        continue;
      }

      // 使用同一个 config/thread_id 恢复原工作流。
      result = await graph.invoke(
        new Command({
          resume: {
            calculation: newCalculation,
          },
        }),
        config,
      );
    }

    console.log("\n========== 工作流正常结束 ==========");

    const finalMessage = result.messages.at(-1);

    console.log("最终回答：", finalMessage?.content);

    console.log("\n========== 完整消息历史 ==========");

    result.messages.forEach((message, index) => {
      console.log(`\n第 ${index + 1} 条消息`);
      console.log("类型：", message.constructor.name);
      console.log("内容：", message.content);

      if (AIMessage.isInstance(message)) {
        console.log("tool_calls：");
        console.dir(message.tool_calls, { depth: null });
      }

      if (ToolMessage.isInstance(message)) {
        console.log("tool_call_id：", message.tool_call_id);
      }
    });
  } finally {
    readline.close();
  }
}

main().catch((error: unknown) => {
  console.error("程序执行失败：", error);
  process.exitCode = 1;
});
