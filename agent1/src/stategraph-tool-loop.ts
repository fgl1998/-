import "dotenv/config";

import { ChatDeepSeek } from "@langchain/deepseek";
import { tool } from "@langchain/core/tools";

import {
  AIMessage,
  HumanMessage,
Message,
  SystemMessage,
  type ToolMessage,
} from "@langchain/core/messages";

import {
  END,
  START,
  MessagesValue,
  StateGraph,
  StateSchema,
  type GraphNode,
} from "@langchain/langgraph";

import { z } from "zod";

/**
 * =====================================================
 * 1. 模拟数据库
 * =====================================================
 */

interface Employee {
  id: number;
  name: string;
  email: string;
}

interface Expense {
  id: number;
  employeeId: number;
  title: string;
  amount: number;
}

const employees: Employee[] = [
  {
    id: 1001,
    name: "张三",
    email: "zhangsan@example.com",
  },
  {
    id: 1002,
    name: "李四",
    email: "lisi@example.com",
  },
];

const expenses: Expense[] = [
  {
    id: 1,
    employeeId: 1001,
    title: "出差住宿",
    amount: 1200,
  },
  {
    id: 2,
    employeeId: 1001,
    title: "交通费",
    amount: 800,
  },
];

/**
 * =====================================================
 * 2. 定义三个只读工具
 * =====================================================
 */

/**
 * 工具一：根据员工姓名查询员工
 */
const findEmployeeTool = tool(
  async ({ employeeName }) => {
    console.log(
      `工具执行：find_employee，employeeName=${employeeName}`,
    );

    const employee = employees.find(
      (item) => item.name === employeeName,
    );

    if (!employee) {
      return JSON.stringify({
        found: false,
        message: `没有找到员工：${employeeName}`,
      });
    }

    return JSON.stringify({
      found: true,
      employee,
    });
  },
  {
    name: "find_employee",

    description:
      "根据员工姓名查询员工信息。" +
      "查询报销之前，必须先调用这个工具获得 employeeId。",

    schema: z.object({
      employeeName: z
        .string()
        .describe("需要查询的员工姓名，例如：张三"),
    }),
  },
);

/**
 * 工具二：根据员工ID查询待审批报销
 */
const queryPendingExpensesTool = tool(
  async ({ employeeId }) => {
    console.log(
      `工具执行：query_pending_expenses，employeeId=${employeeId}`,
    );

    const pendingExpenses = expenses.filter(
      (item) => item.employeeId === employeeId,
    );

    return JSON.stringify({
      employeeId,
      count: pendingExpenses.length,
      expenses: pendingExpenses,
    });
  },
  {
    name: "query_pending_expenses",

    description:
      "根据 employeeId 查询该员工的待审批报销。" +
      "employeeId 必须来自 find_employee 工具的查询结果。",

    schema: z.object({
      employeeId: z
        .number()
        .int()
        .positive()
        .describe("员工ID，必须来自员工查询工具"),
    }),
  },
);

/**
 * 工具三：计算多笔报销的总金额
 */
const calculateTotalTool = tool(
  async ({ amounts }) => {
    console.log(
      `工具执行：calculate_total，amounts=${amounts.join(",")}`,
    );

    const totalAmount = amounts.reduce(
      (total, amount) => total + amount,
      0,
    );

    return JSON.stringify({
      amounts,
      totalAmount,
    });
  },
  {
    name: "calculate_total",

    description:
      "计算多笔报销金额的总和。" +
      "金额必须来自 query_pending_expenses 工具的返回结果。",

    schema: z.object({
      amounts: z
        .array(z.number().nonnegative())
        .describe("需要计算总和的金额数组"),
    }),
  },
);

/**
 * 这里只开放三个安全的查询、计算工具。
 *
 * 没有发送邮件、修改数据库、审批报销等危险工具。
 */
const tools = [
  findEmployeeTool,
  queryPendingExpensesTool,
  calculateTotalTool,
];

/**
 * 方便 Tool 节点根据模型给出的工具名称找到真正的工具。
 */
const toolsByName = {
  [findEmployeeTool.name]: findEmployeeTool,
  [queryPendingExpensesTool.name]:
    queryPendingExpensesTool,
  [calculateTotalTool.name]: calculateTotalTool,
};

/**
 * =====================================================
 * 3. 创建模型，并绑定允许使用的工具
 * =====================================================
 */

const model = new ChatDeepSeek({
  model: "deepseek-v4-flash",
  temperature: 0,

  modelKwargs: {
    thinking: {
      type: "disabled",
    },
  },
});

/**
 * 模型只能看到 tools 数组中的工具。
 */
const modelWithTools = model.bindTools(tools);

/**
 * =====================================================
 * 4. 定义整个工作流的 State
 * =====================================================
 */

const WorkflowState = new StateSchema({
  /**
   * MessagesValue 内置消息 Reducer。
   *
   * 节点返回新消息时，会追加到原来的消息数组，
   * 而不是覆盖之前的消息。
   */
  messages: MessagesValue,

  /**
   * 固定开始节点校验用户输入。
   */
  requestValid: z
    .boolean()
    .default(false),

  /**
   * 已经执行了多少轮工具调用。
   */
  toolRounds: z
    .number()
    .int()
    .nonnegative()
    .default(0),

  /**
   * 最终经过固定节点提取的回答。
   */
  finalAnswer: z
    .string()
    .default(""),
});

type WorkflowStateType =
  typeof WorkflowState.State;

/**
 * 最多允许执行5轮工具。
 */
const MAX_TOOL_ROUNDS = 5;

/**
 * =====================================================
 * 5. 固定节点：校验用户输入
 * =====================================================
 */

const prepareRequestNode: GraphNode<
  typeof WorkflowState
> = async (state) => {
  console.log("\n执行节点：prepareRequest");

  const firstMessage = state.messages[0];
  const content = firstMessage?.content;

  const requestValid =
    typeof content === "string" &&
    content.trim().length > 0;

  if (!requestValid) {
    return {
      requestValid: false,
      finalAnswer: "用户输入不能为空",
    };
  }

  return {
    requestValid: true,
  };
};

/**
 * prepareRequest 执行完成后的固定判断。
 */
function routeAfterPrepare(
  state: WorkflowStateType,
): "model" | typeof END {
  if (state.requestValid) {
    return "model";
  }

  return END;
}

/**
 * =====================================================
 * 6. AI节点：让模型判断是否调用工具
 * =====================================================
 */

const modelNode: GraphNode<
  typeof WorkflowState
> = async (state) => {
  console.log("\n执行节点：model");

  const response = await modelWithTools.invoke([
    new SystemMessage(`
你是一个报销查询助手。

你只能根据工具返回的数据回答，禁止编造员工、报销和金额。

处理报销查询时，必须遵守以下顺序：

1. 先调用 find_employee，根据姓名查询员工。
2. 找到员工后，使用返回的 employeeId 调用 query_pending_expenses。
3. 如果存在报销记录，提取每笔报销的 amount，调用 calculate_total。
4. 工具全部执行完成后，向用户返回最终结果。
5. 如果员工不存在，直接告诉用户没有找到员工，不要继续调用其他工具。
6. 如果没有报销记录，直接告诉用户没有待审批报销。
7. 不要重复调用已经成功执行过的相同工具。
    `),

    ...state.messages,
  ]);

  if (response.tool_calls?.length) {
    console.log(
      "模型决定调用工具：",
      response.tool_calls.map(
        (item) => item.name,
      ),
    );
  } else {
    console.log("模型不再调用工具，准备输出最终答案");
  }

  return {
    messages: [response],
  };
};

/**
 * =====================================================
 * 7. Tool节点：执行模型产生的 tool_calls
 * =====================================================
 */

const toolNode: GraphNode<
  typeof WorkflowState
> = async (state) => {
  console.log("\n执行节点：toolNode");

  const lastMessage = state.messages.at(-1);

  /**
   * Tool节点只处理 AIMessage。
   */
  if (
    !lastMessage ||
    !AIMessage.isInstance(lastMessage)
  ) {
    return {
      messages: [],
    };
  }

  const toolMessages: ToolMessage[] = [];

  /**
   * 一个 AIMessage 中可能同时包含多个 tool_call。
   */
  for (
    const toolCall of
    lastMessage.tool_calls ?? []
  ) {
    console.log(
      `准备调用工具：${toolCall.name}`,
    );

    const selectedTool =
      toolsByName[toolCall.name];

    /**
     * 模型只能调用已经注册的工具。
     */
    if (!selectedTool) {
      throw new Error(
        `不允许调用工具：${toolCall.name}`,
      );
    }

    /**
     * toolCall 中包含：
     *
     * name
     * args
     * id
     *
     * selectedTool.invoke(toolCall)
     * 会执行工具并返回 ToolMessage。
     */
    const toolMessage =
      await selectedTool.invoke(toolCall);

    toolMessages.push(toolMessage);
  }

  return {
    /**
     * MessagesValue 会把 ToolMessage
     * 追加到原来的消息数组。
     */
    messages: toolMessages,

    /**
     * 普通 State 字段默认采用覆盖更新，
     * 所以需要自己加1。
     */
    toolRounds: state.toolRounds + 1,
  };
};

/**
 * =====================================================
 * 8. 条件边：模型执行后去哪里
 * =====================================================
 */

function routeAfterModel(
  state: WorkflowStateType,
):
  | "toolNode"
  | "validateResult"
  | "toolLimit" {
  const lastMessage = state.messages.at(-1);

  /**
   * 最后一条不是 AIMessage，
   * 说明状态不符合预期。
   */
  if (
    !lastMessage ||
    !AIMessage.isInstance(lastMessage)
  ) {
    return "validateResult";
  }

  /**
   * 模型产生了 tool_calls。
   */
  if (lastMessage.tool_calls?.length) {
    /**
     * 即使模型一直想调用工具，
     * 固定代码也会限制最大轮数。
     */
    if (
      state.toolRounds >=
      MAX_TOOL_ROUNDS
    ) {
      return "toolLimit";
    }

    return "toolNode";
  }

  /**
   * 模型没有产生 tool_calls，
   * 退出局部工具循环。
   */
  return "validateResult";
}

/**
 * =====================================================
 * 9. 固定节点：校验并提取最终结果
 * =====================================================
 */

const validateResultNode: GraphNode<
  typeof WorkflowState
> = async (state) => {
  console.log("\n执行节点：validateResult");

  const lastMessage = state.messages.at(-1);

  if (
    !lastMessage ||
    !AIMessage.isInstance(lastMessage)
  ) {
    return {
      finalAnswer:
        "模型没有返回有效的最终结果",
    };
  }

  const finalAnswer =
    lastMessage.text.trim();

  if (!finalAnswer) {
    return {
      finalAnswer:
        "模型返回的最终内容为空",
    };
  }

  return {
    finalAnswer,
  };
};

/**
 * =====================================================
 * 10. 固定节点：工具调用次数超限
 * =====================================================
 */

const toolLimitNode: GraphNode<
  typeof WorkflowState
> = async (state) => {
  console.log("\n执行节点：toolLimit");

  return {
    finalAnswer:
      `工具调用超过最大轮数：` +
      `${state.toolRounds}`,
  };
};

/**
 * =====================================================
 * 11. 组装完整 StateGraph
 * =====================================================
 */

const graph = new StateGraph(
  WorkflowState,
)
  /**
   * 注册节点
   */
  .addNode(
    "prepareRequest",
    prepareRequestNode,
  )
  .addNode(
    "model",
    modelNode,
  )
  .addNode(
    "toolNode",
    toolNode,
  )
  .addNode(
    "validateResult",
    validateResultNode,
  )
  .addNode(
    "toolLimit",
    toolLimitNode,
  )

  /**
   * 第一段：固定流程
   */
  .addEdge(
    START,
    "prepareRequest",
  )

  .addConditionalEdges(
    "prepareRequest",
    routeAfterPrepare,
    [
      "model",
      END,
    ],
  )

  /**
   * 第二段：局部 Tool 循环
   *
   * model
   *   ↓ 有 tool_calls
   * toolNode
   *   ↓ 工具执行完成
   * model
   */
  .addConditionalEdges(
    "model",
    routeAfterModel,
    [
      "toolNode",
      "validateResult",
      "toolLimit",
    ],
  )

  .addEdge(
    "toolNode",
    "model",
  )

  /**
   * 第三段：重新进入固定流程
   */
  .addEdge(
    "validateResult",
    END,
  )

  .addEdge(
    "toolLimit",
    END,
  )

  .compile();

/**
 * =====================================================
 * 12. 测试
 * =====================================================
 */

const result = await graph.invoke(
  {
    messages: [
      new HumanMessage(
        "请查询张三的待审批报销，并计算总金额",
      ),
    ],
  },
  {
    /**
     * 整张图最多执行20个步骤，
     * 防止由于错误路线产生无限循环。
     */
    recursionLimit: 20,
  },
);

console.log("\n====================");
console.log("工作流执行完成");
console.log("====================");

console.log(
  "工具执行轮数：",
  result.toolRounds,
);

console.log(
  "最终回答：",
  result.finalAnswer,
);