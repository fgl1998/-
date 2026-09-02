// import 'dotenv/config'
// import { agent } from './agent.js'


// const result = await agent.invoke({
//   messages: [
//     {
//       role: 'user',
//       content:  "查询张三有没有待审批报销。如果有，计算总金额，并生成提醒邮件草稿，但不要发送。",
//     }
//   ]
// })

// console.dir(result.messages, {
//   depth: null
// })

// console.log(
//   '最终回答：',
//   result.messages.at(-1)?.content
// )


// import "dotenv/config";

// import { randomUUID } from "node:crypto";
// import { stdin, stdout } from "node:process";
// import { createInterface } from "node:readline/promises";

// import { agent } from "./agent.js";

// const readline = createInterface({
//   input: stdin,
//   output: stdout,
// });

// // 一个CLI进程代表一个聊天窗口
// // 必须放在while外面，保证每轮对话使用同一个thread_id
// const threadId = randomUUID();

// const config = {
//   configurable: {
//     thread_id: threadId,
//   },
// };

// console.log("🤖 Agent 已启动");
// console.log(`当前会话：${threadId}`);
// console.log("输入 exit、quit 或 退出，可以结束对话。\n");

// try {
//   while (true) {
//     const userInput = (await readline.question("你：")).trim();

//     // 忽略空输入
//     if (!userInput) {
//       continue;
//     }

//     // 退出命令
//     if (
//       ["exit", "quit", "退出"].includes(
//         userInput.toLowerCase(),
//       )
//     ) {
//       console.log("AI：再见！");
//       break;
//     }

//     try {
//       const result = await agent.invoke(
//         {
//           // 这里只传本次的新消息
//           // 之前的消息由checkpointer根据thread_id读取
//           messages: [
//             {
//               role: "user",
//               content: userInput,
//             },
//           ],
//         },
//         config,
//       );

//       const finalMessage = result.messages.at(-1);

//       // console.log(`\nAI：${finalMessage?.content ?? ""}\n`);
//       console.dir(result.messages, {
//         depth: null
//       })
      
//     } catch (error) {
//       const message =
//         error instanceof Error
//           ? error.message
//           : String(error);

//       console.error(`\n调用失败：${message}\n`);
//     }
//   }
// } finally {
//   readline.close();
// }

import "dotenv/config";

import { randomUUID } from "node:crypto";
import { stdin, stdout } from "node:process";
import { createInterface } from "node:readline/promises";
import { Command } from "@langchain/langgraph";

import { agent } from "./agent.js";

const readline = createInterface({
  input: stdin,
  output: stdout,
});

// 本次CLI运行只有一个会话
const threadId = randomUUID();

const config = {
  configurable: {
    thread_id: threadId,
  },
};

const exitCommands = new Set([
  "exit",
  "quit",
  "退出",
]);

// 用于只打印本轮新增的消息
let printedMessageCount = 0;

function printNewMessages(messages: unknown[]) {
  const newMessages = messages.slice(
    printedMessageCount,
  );

  console.log("\n本轮执行日志：");

  console.dir(newMessages, {
    depth: null,
    colors: true,
  });

  printedMessageCount = messages.length;
}

console.log("🤖 Agent 已启动");
console.log(`当前会话ID：${threadId}`);
console.log("输入 exit、quit 或 退出结束对话。\n");

try {
  while (true) {
    const userInput = (
      await readline.question("你：")
    ).trim();

    if (!userInput) {
      continue;
    }

    if (
      exitCommands.has(userInput.toLowerCase())
    ) {
      console.log("AI：再见！");
      break;
    }

    try {
      // 第一次invoke：开始一个新任务
      let result = await agent.invoke(
        {
          messages: [
            {
              role: "user",
              content: userInput,
            },
          ],
        },
        config,
      );

      printNewMessages(result.messages);

      /*
       * 如果Agent准备调用需要审批的工具，
       * result中就会出现__interrupt__
       */
      while (result.__interrupt__?.length) {
        console.log(
          "\n⚠️ 检测到需要人工审批的工具调用：",
        );

        console.dir(result.__interrupt__, {
          depth: null,
          colors: true,
        });

        let approval = (
          await readline.question(
            "\n是否批准执行？y/n：",
          )
        )
          .trim()
          .toLowerCase();

        // 输入不是y或n时继续询问
        while (
          approval !== "y" &&
          approval !== "n"
        ) {
          approval = (
            await readline.question(
              "请输入 y 或 n：",
            )
          )
            .trim()
            .toLowerCase();
        }

        const decision =
          approval === "y"
            ? {
                type: "approve" as const,
              }
            : {
                type: "reject" as const,
                message:
                  "用户拒绝执行该操作，不要重试。",
              };

        /*
         * 第二次invoke：不是发送新消息，
         * 而是恢复刚才暂停的任务
         */
        result = await agent.invoke(
          new Command({
            resume: {
              decisions: [decision],
            },
          }),
          config,
        );

        printNewMessages(result.messages);
      }

      // 不存在interrupt，说明本次任务执行结束
      const finalMessage =
        result.messages.at(-1);

      console.log(
        `\nAI：${finalMessage?.content ?? ""}\n`,
      );
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : String(error);

      console.error(`\n调用失败：${message}\n`);
    }
  }
} finally {
  readline.close();
}