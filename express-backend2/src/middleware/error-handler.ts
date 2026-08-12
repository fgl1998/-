import {type ErrorRequestHandler } from 'express'
import {AppError} from '../errors/app-error.js'


export const errorHandler:ErrorRequestHandler = (error,req,res,next)=>{ 
  console.error("错误日志==========",error);
  
  if (error instanceof AppError) {
      return res.status(error.statusCode).json({
        success: false,
        code: error.code,
        message: error.message
      })
    }
   res.status(500).json({
    success:false,
    code:'INTERNAL_SERVER_ERROR',
    message:'服务器内部错误'
  })
}

