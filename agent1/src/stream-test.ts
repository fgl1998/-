import "dotenv/config";

import { randomUUID } from "node:crypto";
import { agent } from "./agent.js";

const config = {
  configurable: {
    thread_id: randomUUID(),
  },
  streamMode: "messages" as const,
};

const stream = await agent.stream(
  {
    messages: [
      {
        role: "user",
        content: "请帮我计算42乘以17",
      },
    ],
  },
  config,
);

for await (const chunk of stream) {
  console.log("\n收到新的执行步骤：");

  console.dir(chunk, {
    depth: null,
    colors: true,
  });
}