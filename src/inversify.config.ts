import 'reflect-metadata'
import { Container } from 'inversify'
import { Bot } from './bot'
import { Client } from 'discord.js'
import { TYPES } from './types'
import { CommandInterpreter } from './services/command-interpreter'
import { NamesManager } from './services/names-manager'

const container = new Container()

container.bind<Bot>(TYPES.Bot).to(Bot).inSingletonScope()
container.bind<Client>(TYPES.Client).toConstantValue(new Client())
container.bind<string>(TYPES.Token).toConstantValue(process.env.TOKEN)
container.bind<CommandInterpreter>(TYPES.CommandInterpreter).to(CommandInterpreter).inSingletonScope()
container.bind<NamesManager>(TYPES.NamesManager).to(NamesManager).inSingletonScope()

export default container
