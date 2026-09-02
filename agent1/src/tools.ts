import { tool } from 'langchain'
import { z } from 'zod'

export const calculatorTool = tool(
  async ({ operation, a, b }) => {
    switch (operation) {
      case 'add':
        return `${a} + ${b} = ${a + b}`

      case 'subtract':
        return `${a} - ${b} = ${a - b}`

      case 'multiply':
        return `${a} × ${b} = ${a * b}`

      case 'divide':
        if (b === 0) {
          return '除数不能为0'
        }

        return `${a} ÷ ${b} = ${a / b}`
    }
  },
  {
    name: 'calculator',

    description: '执行两个数字之间的加减乘除运算,执行精确数学计算。涉及金额计算时必须使用该工具，不要自行心算。',

    schema: z.object({
      operation: z.enum([
        'add',
        'subtract',
        'multiply',
        'divide'
      ]),

      a: z.number().describe('第一个数字'),

      b: z.number().describe('第二个数字')
    })
  }
)

const employeeMap = {
  1001: { employeeName: '张三', email: 'zhangsan@email.com',employeeId: 1001 },
  1002: { employeeName: '李四', email: 'lisi@email.com',employeeId: 1002 },
}

const findEmployeeTool = tool(
  async({ employeeName })=>{
    if(employeeName !== '张三'){
      return {
        found: false,
        message: '员工不存在'
      }
    }
    return {
      email:'zhangsan@email.com',
      found: true,
      employeeId: 1001,
      employeeName: "张三",
    }
  },
  {
    name:'findEmployee',
    description:'根据姓名查询员工',
    schema:z.object({
      employeeName:z.string().describe('员工姓名')
    })
  }

)

const queryPendingExpensesTool = tool(
  async ({ employeeId })=>{
    if(employeeId !== 1001){
      return {
        found: false,
        message: '员工不存在'
      }
    }
    
    return {
      employeeId:1001,
      expenses:[
        {
          "id": 1,
          "title": "出差住宿",
          "amount": 1200
        },
        {
          "id": 2,
          "title": "交通费",
          "amount": 800
        }
      ]
    }

  },
  {
    name:'queryPendingExpenses',
    description:'查询员工待审批报销',
    schema:z.object({
      employeeId:z.number().describe('员工id')
    })
  }
)

const saveEmailDraft = tool(
  async ({ to, content, subject })=>{
    return {
      draftId:'draft-001',
      status: "saved",
      message: '邮件草稿保存成功，尚未发送'
    }
  },
  {
    name:'saveEmailDraft',
    description:'保存邮件草稿',
    schema:z.object({
      to:z.string().describe('邮箱地址'),
      content:z.string().describe('邮件内容'),
      subject:z.string().describe('邮件主题')
    })
  }

)

const sendEmail = tool(
  async ({ draftId })=>{
    return {
      draftId:'draft-001',
      status: "sent",
      message: '邮件发送成功'
    }
  },
  {
    name:'sendEmail',
    description:'发送邮件',
    schema:z.object({
      draftId:z.string().describe('草稿id')
    })
  }
)
export const tools = [calculatorTool,findEmployeeTool,queryPendingExpensesTool,saveEmailDraft,sendEmail]