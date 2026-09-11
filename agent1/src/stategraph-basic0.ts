import {
  END,
  START,
  StateGraph,
  StateSchema,
  MemorySaver,
  MessagesValue,
  interrupt,
  Command,
  type GraphNode
} from '@langchain/langgraph'
import { z } from 'zod'
import {
  stdin,
  stdout,
} from "node:process";
import {
  createInterface,
} from "node:readline/promises";

const ExpenseState = new StateSchema({
  messages: MessagesValue,

  employeeName: z.string(),

  employeeId:z.number().nullable().default(null),

  expenses:z.array(
    z.object({
      id:z.number(),
      amount:z.number(),
      title:z.string(),
    })
  ).default([]),

  totalAmount:z.number().default(0),

  message:z.string().default(''),

  approved:z.boolean().default(false),
})

type ExpenseStateType = typeof ExpenseState.State

const findEmployeeNode:GraphNode<typeof ExpenseState>=async(state)=>{
  console.log("\n进入findEmployee节点");
  console.log("当前State：", state);
  if(state.employeeName==='张三'){
    return{
      employeeId:1001
    }
  }
  return{
    employeeId:null
  }
}
const queryExpensesNode:GraphNode<typeof ExpenseState>=async(state)=>{ 
  console.log("\n进入queryExpenses节点");
  console.log("当前State：", state);
  if(state.employeeId!==1001){
    return{
      expenses:[]
    }
  }
  return{
    expenses:[
      {
        id:1,
        title:'出差住宿',
        amount:1200.
      },
      {
        id:2,
        title:'交通费',
        amount:800.
      }
    ]
  }
}

const calculateTotalNode:GraphNode<typeof ExpenseState>=async(state)=>{ 
  console.log("\n进入calculateTotal节点");
  console.log("当前State：", state);
  return{
    totalAmount:state.expenses.reduce((acc,cur)=>acc+cur.amount,0)
  }
}

type ApprovalAnswer = 'y' | 'n'
const pauseNode:GraphNode<typeof ExpenseState>=async(state)=>{
  console.log("\n进入pause节点");
  console.log("当前State：", state);
  const userAnswer = interrupt({
    // question:"是否继续生成最终结果？",
    // employeeName:state.employeeName,
    // totalAmount:state.totalAmount
    type: 'approval',
    question: `报销总额是 ${state.totalAmount} 元，是否同意？`,
  }) as ApprovalAnswer;
  console.log(
    "interrupt 返回的用户回答：",
    userAnswer,
  );
  const approved = userAnswer==='y';
  // return new Command({
  //   update:{
  //     approved
  //   },
  //   goto:approved?'buildResult':'rejectResult'
  // })
  return{
    approved,
  }
}

const reviseExpenseNode:GraphNode<typeof ExpenseState>=async(state)=>{ 
   console.log('进入修改报销信息节点')
   const reviseData = interrupt({
      type: 'reviseExpense',
      question: '请选择要修改的报销记录，并输入新金额',
      expenses: state.expenses,
    }) as {
      id: number
      amount: number
    }

  const expenseExists = state.expenses.some(
    expense => expense.id === reviseData.id
  )

  if (!expenseExists) {
    throw new Error(`报销记录 ${reviseData.id} 不存在`)
  }

  const newExpenses = state.expenses.map(expense => {
    if (expense.id !== reviseData.id) {
      return expense
    }

    return {
      ...expense,
      amount: reviseData.amount,
    }
  })
   return {
    expenses: newExpenses,
    approved: false,
    message: `报销记录 ${reviseData.id} 已修改`,
  }
}

const rejectResultNode:GraphNode<typeof ExpenseState>=async(state)=>{ 
  console.log("\n进入rejectResult节点");
  console.log("当前State：", state);
  return{
    message:`${state.employeeName}的报销申请被拒绝`
  }
}

const buildResultNode:GraphNode<typeof ExpenseState>=async(state)=>{
  console.log("\n进入buildResult节点");
  console.log("当前State：", state);
  if(!state.employeeId){
    return{
      message:`没有找到员工：${state.employeeName}`
    }
  }
  if(state.expenses.length===0){
    return{
      message:`${state.employeeName}没有待审批报销`
    }
  }
  return {
    message:`${state.employeeName}有${state.expenses.length}条待审批报销，总金额${state.totalAmount}元。`
  }
}
function routerAfterFindEmployee(state:ExpenseStateType){
  console.log("判断：是否找到员工");
  if(state.employeeId!==null){
    return 'queryExpenses';
  }
  return 'buildResult';
}
function routerAfterQueryExpenses(state:ExpenseStateType){
  console.log("判断：是否存在待审批报销");
  if(state.expenses.length>0){
    return 'calculateTotal';
  }
  return 'buildResult';
}

function routerAfterPause(state:ExpenseStateType){
  console.log("判断：是否继续生成最终结果");
  if(state.approved){
    return 'buildResult';
  }
  return 'reviseExpense';
}

const workflow = new StateGraph(
  ExpenseState
)
  .addNode(
    'buildResult',
    buildResultNode
  )
  .addNode(
    'findEmployee',
    findEmployeeNode
  )
  .addNode(
    'queryExpenses',
    queryExpensesNode
  )
  .addNode(
    'calculateTotal',
    calculateTotalNode
  )
  .addNode(
    'pause',
    pauseNode
  )
  .addNode(
    'rejectResult',
    rejectResultNode
  )
  .addNode(
    'reviseExpense',
    reviseExpenseNode
  )
  
  .addEdge(
    START,
    'findEmployee'
  )
  .addConditionalEdges(
    'findEmployee',
    routerAfterFindEmployee
  )
  // .addEdge(
  //   'findEmployee',
  //   'queryExpenses'
  // )
  .addConditionalEdges(
    'queryExpenses',
    routerAfterQueryExpenses
  )
  // .addEdge(
  //   'queryExpenses',
  //   'calculateTotal'
  // )
  .addEdge(
    'calculateTotal',
    'pause'
  )
  // .addEdge(
  //   'pause',
  //   'buildResult'
  // )
  .addConditionalEdges(
    'pause',
    routerAfterPause
  )
  .addEdge(
    'buildResult',
    END
  )
  .addEdge(
    'rejectResult',
    END
  )
  .addEdge(
    'reviseExpense',
    'calculateTotal'
  )

const checkpointer = new MemorySaver()

const graph =workflow.compile({
  checkpointer
})

const config = {
  configurable: {
    thread_id: "expense-demo-001",
  },
}

// const result:ExpenseStateType = await graph.invoke({
//   employeeName:'张三'
// },config)

// console.log("\n最终State：");

// console.dir(result, {
//   depth: null,
//   colors: true,
// });

// const snapshot = await graph.getState(config);

// console.log("\n当前 State111：");
// console.dir(snapshot.values, {
//   depth: null,
//   colors: true,
// });

// console.log("\n接下来要执行的节点：");
// console.dir(snapshot.next);

// const readline = createInterface({
//   input: stdin,
//   output: stdout,
// });

// try {
//   // 第一次执行
//   const firstResult = await graph.invoke(
//     {
//       employeeName: "张三",
//     },
//     config,
//   );

//   console.log("\n工作流已经暂停：");

//   console.dir(firstResult.__interrupt__, {
//     depth: null,
//     colors: true,
//   });

//   // Graph 已经暂停，现在是外部程序等待用户
//   const userAnswer = await readline.question(
//     "\n请输入回复后继续：",
//   );
//   // 第二次执行：恢复之前暂停的 Graph
//   const finalResult = await graph.invoke(
//     new Command({
//       resume:userAnswer,
//     }),
//     config,
//   );

//   console.log("\n工作流恢复完成：");

//   console.dir(finalResult, {
//     depth: null,
//     colors: true,
//   });
// } finally {
//   readline.close();
// }

// 1. 创建终端输入对象
const rl = createInterface({
  input: stdin,
  output: stdout,
})




// 3. 专门负责询问 y/n
async function askDecision(
  question: string
): Promise<'y' | 'n'> {
  while (true) {
    const answer = (
      await rl.question(`${question}\n请输入 y 或 n：`)
    )
      .trim()
      .toLowerCase()

    if (answer === 'y' || answer === 'n') {
      return answer
    }

    console.log('输入错误，只能输入 y 或 n')
  }
}


// 4. 执行整个图
async function main() {
  try {
    // 第一次启动图
    let result = await graph.invoke(
      {
        employeeName: '张三',
        messages:[
          {
            role:'human',
            content: '请帮我查询并审批报销记录',
          }
        ]
      },
      config
    )
    console.log('result===',result.__interrupt__);
    

    // 只要图还存在中断，就继续询问
    while (result.__interrupt__?.length) {
      const interruptData =
        result.__interrupt__[0].value as {
          question: string
          type: string
          expenses?: Array<{
            id: number
            title: string
            amount: number
          }>
        }

      if(interruptData.type==='approval'){
         // 等待用户输入 y 或 n
        const answer = await askDecision(
          interruptData.question
        )

        // 使用同一个 config 恢复图
        result = await graph.invoke(
          new Command({
            // 直接传 "y" 或 "n"，不要转换成布尔值
            resume: answer,
          }),
          config
        )
        continue
      }

      // 第二种：修改报销信息
      if (interruptData.type === 'reviseExpense') {
        console.log(interruptData.question)

        // 打印当前报销记录
        console.table(interruptData.expenses)

        const id = Number(
          await rl.question('请输入要修改的报销记录 id：')
        )

        const amount = Number(
          await rl.question('请输入新的金额：')
        )

        result = await graph.invoke(
          new Command({
            resume: {
              id,
              amount,
            },
          }),
          config
        )

        continue
      }

      throw new Error(
        `无法识别的中断类型：${interruptData.type}`
      )
     
    }

    // 没有 __interrupt__，说明图执行结束
    console.log('\n流程执行结束')
    console.dir(result, {
      depth: null,
    })
  } finally {
    // 无论成功还是报错，都关闭终端输入
    rl.close()
  }
}


// 5. 调用 main
main().catch(error => {
  console.error('程序执行失败：', error)
  process.exitCode = 1
})