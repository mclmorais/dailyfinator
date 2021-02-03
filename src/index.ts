/* eslint-disable import/first */
import { config } from 'dotenv'
config()
import { Bot } from './bot'
import { SqliteClient } from './clients/sqlite-client'
import container from './inversify.config'
import { TYPES } from './types'

const bot = container.get<Bot>(TYPES.Bot)
const sqliteDb = container.get<SqliteClient>(TYPES.SqliteClient)

sqliteDb.initialize()
  .then(() =>
  {
    console.log('Database initialized')
    return bot.listen()
  })
  .then(() => { console.log('Successfully logged in') })
  .catch(error => { console.error('Error: ', error) })
