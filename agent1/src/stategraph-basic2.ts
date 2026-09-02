import {
  END,
  START,
  StateGraph,
  StateSchema,
  type GraphNode,
} from "@langchain/langgraph";

import { z } from "zod";

/**
 * 1. 定义整个业务流程共享的 State
 */
const ExpenseState = new StateSchema({
  employeeName: z.string(),

  employeeId: z
    .number()
    .nullable()
    .default(null),

  expenses: z
    .array(
      z.object({
        id: z.number(),
        title: z.string(),
        amount: z.number(),
      }),
    )
    .default([]),

  totalAmount: z
    .number()
    .default(0),

  message: z
    .string()
    .default(""),
});

type ExpenseStateType = typeof ExpenseState.State;

/**
 * 2. 查找员工节点
 */
const findEmployeeNode: GraphNode<
  typeof ExpenseState
> = async (state) => {
  console.log("执行节点：findEmployee");

  // 模拟数据库查询
  if (state.employeeName === "张三") {
    return {
      employeeId: 1001,
    };
  }

  if (state.employeeName === "李四") {
    return {
      employeeId: 1002,
    };
  }

  return {
    employeeId: null,
  };
};

/**
 * 3. 查询员工的待审批报销
 */
const queryExpensesNode: GraphNode<
  typeof ExpenseState
> = async (state) => {
  console.log("执行节点：queryExpenses");

  // 张三存在待审批报销
  if (state.employeeId === 1001) {
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
  }

  // 李四没有待审批报销
  return {
    expenses: [],
  };
};

/**
 * 4. 计算报销总金额
 */
const calculateTotalNode: GraphNode<
  typeof ExpenseState
> = async (state) => {
  console.log("执行节点：calculateTotal");

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

/**
 * 5. 生成最终结果
 */
const buildResultNode: GraphNode<
  typeof ExpenseState
> = async (state) => {
  console.log("执行节点：buildResult");

  // 没找到员工
  if (state.employeeId === null) {
    return {
      message: `没有找到员工：${state.employeeName}`,
    };
  }

  // 找到员工，但没有待审批报销
  if (state.expenses.length === 0) {
    return {
      message: `${state.employeeName}没有待审批报销`,
    };
  }

  // 找到员工，也存在待审批报销
  return {
    message:
      `${state.employeeName}有` +
      `${state.expenses.length}条待审批报销，` +
      `总金额${state.totalAmount}元。`,
  };
};

/**
 * 6. 条件一：
 * 查找员工后，判断下一步去哪里
 */
function routeAfterFindEmployee(
  state: ExpenseStateType,
): "queryExpenses" | "buildResult" {
  console.log("判断：是否找到员工");

  if (state.employeeId !== null) {
    return "queryExpenses";
  }

  return "buildResult";
}

/**
 * 7. 条件二：
 * 查询报销后，判断是否需要计算金额
 */
function routeAfterQueryExpenses(
  state: ExpenseStateType,
): "calculateTotal" | "buildResult" {
  console.log("判断：是否存在待审批报销");

  if (state.expenses.length > 0) {
    return "calculateTotal";
  }

  return "buildResult";
}

/**
 * 8. 创建图
 */
const graph = new StateGraph(ExpenseState)
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

  // 第一个执行的节点
  .addEdge(
    START,
    "findEmployee",
  )

  // 找到员工后进行条件判断
  .addConditionalEdges(
    "findEmployee",
    routeAfterFindEmployee,
    [
      "queryExpenses",
      "buildResult",
    ],
  )

  // 查询报销后进行条件判断
  .addConditionalEdges(
    "queryExpenses",
    routeAfterQueryExpenses,
    [
      "calculateTotal",
      "buildResult",
    ],
  )

  // 计算完成后生成结果
  .addEdge(
    "calculateTotal",
    "buildResult",
  )

  // 结束流程
  .addEdge(
    "buildResult",
    END,
  )

  .compile();

  /*
 * 8. 执行Graph
 */
const result: ExpenseStateType =
  await graph.invoke({
    employeeName: "张三",
  });

console.log("\n最终State：");

console.dir(result, {
  depth: null,
  colors: true,
});

console.log("\n最终回答：");
console.log(result.message);