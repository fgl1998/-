import { z } from "zod";

export const AgentResponseSchema = z.object({
  status: z
    .enum([
      "completed",
      "needs_information",
      "failed",
    ])
    .describe(
      "任务状态：完成、缺少信息或者执行失败",
    ),

  message: z
    .string()
    .describe("需要展示给用户的消息"),

  missingFields: z
    .array(z.string())
    .describe("缺少的必要字段，没有则返回空数组"),

  result: z
    .object({
      employeeName: z
        .string()
        .nullable()
        .describe("员工姓名"),

      expenseCount: z
        .number()
        .nullable()
        .describe("待审批报销数量"),

      totalAmount: z
        .number()
        .nullable()
        .describe("待审批报销总金额"),
    })
    .nullable()
    .describe("任务成功时返回的数据"),
});

export type AgentResponse = z.infer<
  typeof AgentResponseSchema
>;