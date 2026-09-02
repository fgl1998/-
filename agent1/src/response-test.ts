import "dotenv/config";

import { randomUUID } from "node:crypto";

import { agent } from "./agent.js";

const config = {
  configurable: {
    thread_id: randomUUID(),
  },
};

const result = await agent.invoke(
  {
    messages: [
      {
        role: "user",
        content: "查询张三的待审批报销",
      },
    ],
  },
  config,
);

console.log("结构化结果：");

console.dir(result.structuredResponse, {
  depth: null,
  colors: true,
});

console.log("\n完整消息日志：");

console.dir(result.messages, {
  depth: null,
  colors: true,
});