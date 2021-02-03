import { Client, Message } from 'discord.js'
import { inject, injectable } from 'inversify'
import { CommandInterpreter } from './services/command-interpreter'
import { TYPES } from './types'

@injectable()
export class Bot
{
  private client: Client
  private commandInterpreter: CommandInterpreter
  private readonly token: string

  constructor (
    @inject(TYPES.Client) client: Client,
    @inject(TYPES.Token) token: string,
    @inject(TYPES.CommandInterpreter) commandInterpreter: CommandInterpreter
  )
  {
    this.client = client
    this.token = token
    this.commandInterpreter = commandInterpreter
  }

  public async listen (): Promise<string>
  {
    this.client.on('message', (message: Message) => this.commandInterpreter.interpret(message))

    return this.client.login(this.token)
  }
}
