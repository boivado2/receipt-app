import 'express-async-errors'
import winston from 'winston'


export default () => {
  winston.add(new winston.transports.File({filename: "file.log"}))

  winston.add(new winston.transports.File({filename: "rejections.log", handleRejections: true,level: "error", format: winston.format.combine(winston.format.simple(), winston.format.json()) }))

  winston.add(new winston.transports.File({filename: "exceptions.log", handleExceptions: true, level: "error", format: winston.format.combine(winston.format.simple(), winston.format.json())}))

}
