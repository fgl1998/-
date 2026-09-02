import {
  END,
  START,
  StateGraph,
  StateSchema,
  type GraphNode,
} from "@langchain/langgraph";

import { z } from "zod";

/*
 * 1. 定义整个工作流共享的State
 */
const ExpenseState = new StateSchema({
  // 调用Graph时传入
  employeeName: z.string(),

  // 查询员工节点产生
  employeeId: z
    .number()
    .nullable()
    .default(null),

  // 查询报销节点产生
  expenses: z
    .array(
      z.object({
        id: z.number(),
        title: z.string(),
        amount: z.number(),
      }),
    )
    .default([]),

  // 计算节点产生
  totalAmount: z.number().default(0),

  // 最终节点产生
  message: z.string().default(""),
});

type ExpenseStateType =
  typeof ExpenseState.State;

/*
 * 2. 查询员工节点
 */
const findEmployeeNode: GraphNode<
  typeof ExpenseState
> = async (state) => {
  console.log("\n进入findEmployee节点");
  console.log("当前State：", state);

  // 先使用假数据
  if (state.employeeName === "张三") {
    return {
      employeeId: 1001,
    };
  }

  return {
    employeeId: null,
  };
};

/*
 * 3. 查询报销节点
 */
const queryExpensesNode: GraphNode<
  typeof ExpenseState
> = async (state) => {
  console.log("\n进入queryExpenses节点");
  console.log("当前State：", state);

  if (state.employeeId !== 1001) {
    return {
      expenses: [],
    };
  }

  return {
    expenses: [
      {
        id: 1,
        title: "出差住宿",
        amount: 1200,
      },
      {
        id: 2,
        title: "交通费",
        amount: 800,
      },
    ],
  };
};

/*
 * 4. 计算总金额节点
 */
const calculateTotalNode: GraphNode<
  typeof ExpenseState
> = async (state) => {
  console.log("\n进入calculateTotal节点");
  console.log("当前State：", state);

  const totalAmount = state.expenses.reduce(
    (total, expense) => {
      return total + expense.amount;
    },
    0,
  );

  return {
    totalAmount,
  };
};

/*
 * 5. 生成最终结果节点
 */
const buildResultNode: GraphNode<
  typeof ExpenseState
> = async (state) => {
  console.log("\n进入buildResult节点");
  console.log("当前State：", state);

  if (!state.employeeId) {
    return {
      message: `没有找到员工：${state.employeeName}`,
    };
  }

  if (state.expenses.length === 0) {
    return {
      message: `${state.employeeName}没有待审批报销`,
    };
  }

  return {
    message:
      `${state.employeeName}有` +
      `${state.expenses.length}条待审批报销，` +
      `总金额${state.totalAmount}元。`,
  };
};

/*
 * 6. 添加Node和Edge
 */
const workflow = new StateGraph(
  ExpenseState,
)
  .addNode(
    "findEmployee",
    findEmployeeNode,
  )
  .addNode(
    "queryExpenses",
    queryExpensesNode,
  )
  .addNode(
    "calculateTotal",
    calculateTotalNode,
  )
  .addNode(
    "buildResult",
    buildResultNode,
  )

  // 设置固定执行顺序
  .addEdge(
    START,
    "findEmployee",
  )
  .addEdge(
    "findEmployee",
    "queryExpenses",
  )
  .addEdge(
    "queryExpenses",
    "calculateTotal",
  )
  .addEdge(
    "calculateTotal",
    "buildResult",
  )
  .addEdge(
    "buildResult",
    END,
  );

/*
 * 7. 编译成可运行的Graph
 */
const graph = workflow.compile();

/*
 * 8. 执行Graph
 */
const result: ExpenseStateType =
  await graph.invoke({
    employeeName: "王五",
  });

console.log("\n最终State：");

console.dir(result, {
  depth: null,
  colors: true,
});

console.log("\n最终回答：");
console.log(result.message);