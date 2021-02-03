import { Client, Message } from 'discord.js'
import { inject, injectable } from 'inversify'
import { CommandInterpreter } from './services/command-interpreter'
import { TYPES } from './types'

@injectable()
export class Bot
{
  @inject(TYPES.Client) private client: Client
  @inject(TYPES.CommandInterpreter) private commandInterpreter: CommandInterpreter
  @inject(TYPES.Token) private readonly token: string

  public async listen (): Promise<string>
  {
    this.client.on('message', (message: Message) => this.commandInterpreter.interpret(message))

    return this.client.login(this.token)
  }
}
