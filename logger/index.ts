import winston from 'winston'
const { combine, timestamp, printf } = winston.format

const formatLog = printf((info) => {
  const ts = info.timestamp.slice(0, 19).replace('T', ' ')
  return `${ts} ${info.level}: ${info.message}`
})

const format = combine(timestamp(), formatLog)

const logger = winston.createLogger({
  level: 'info',
  format,

  defaultMeta: { service: 'user-service' },
  transports: [
    new winston.transports.File({
      filename: 'logs/error.log',
      level: 'error',
      maxsize: 1048576,
    }),
    new winston.transports.File({
      filename: 'logs/combined.log',
      level: 'debug',
    }),
  ],
})

if (process.env.NODE_ENV !== 'production') {
  logger.add(
    new winston.transports.Console({
      format,
    })
  )
}

export default logger
