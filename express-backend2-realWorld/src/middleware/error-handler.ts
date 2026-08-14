import {type ErrorRequestHandler} from 'express';
import { AppError } from '../errors/app.error.js';

export const errorHandler: ErrorRequestHandler = (err, req, res, next) => { 
  console.error("错误日志",err);
  if(err instanceof AppError){
    return res.status(err.statusCode).json({
      success: false,
      code: err.code,
      message: err.message
    })
  }
  res.status(500).json({
    success: false,
    code: 'INTERNAL_SERVER_ERROR',
    message: '服务器内部错误'
  })
}