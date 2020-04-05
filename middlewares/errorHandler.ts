import { ErrorRequestHandler } from 'express'
import logger from '../logger'

const errorHandler: ErrorRequestHandler = (error, _, res, __) => {
  const { name, status, message } = error

  logger.log('error', `${name}:${status} - ${message}`)

  res.status(status || 500).send({ error: message })
}

export default errorHandler
