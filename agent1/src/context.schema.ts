import { z } from "zod";

export const AgentContextSchema = z.object({
  userId: z.number().int().positive(),

  role: z.enum([
    "employee",
    "manager",
    "admin",
  ]),
});

export type AgentContext = z.infer<
  typeof AgentContextSchema
>;