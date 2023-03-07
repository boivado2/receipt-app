import winston from 'winston'


export default winston.createLogger({
    format: winston.format.json(),

    transports: [
      new winston.transports.File({ filename: "file.log" })
    ],
    exceptionHandlers: [
      new winston.transports.File({ filename: 'exceptions.log' })
    ],

    rejectionHandlers: [
      new winston.transports.File({ filename: 'rejections.log' })
    ]
})