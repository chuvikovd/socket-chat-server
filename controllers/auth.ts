import { RequestHandler } from 'express'
import storage from '../storage'
import userSchema from '../validators/userSchema'
import logger from '../logger'

export const login: RequestHandler = (req, res) => {
  logger.log('info', `[/login]: ${JSON.stringify(req.body)}`)

  const { username } = req.body

  if (storage.exists(username))
    return res.status(403).end('Username already taken')

  try {
    userSchema.validateSync(username)

    storage.add(username)
    res.status(200).end()
  } catch (error) {
    res.status(400).end(error.message)
  }
}
