import 'reflect-metadata'
import { Container } from 'inversify'
import { Bot } from './bot'
import { Client } from 'discord.js'
import { TYPES } from './types'
import { CommandInterpreter } from './services/command-interpreter'
import { SqliteClient } from './clients/sqlite-client'

const container = new Container()

container.bind<SqliteClient>(TYPES.SqliteClient).to(SqliteClient).inSingletonScope()
container.bind<Bot>(TYPES.Bot).to(Bot).inSingletonScope()
container.bind<Client>(TYPES.Client).toConstantValue(new Client())
container.bind<string>(TYPES.Token).toConstantValue(process.env.TOKEN)
container.bind<CommandInterpreter>(TYPES.CommandInterpreter).to(CommandInterpreter).inSingletonScope()

export default container
