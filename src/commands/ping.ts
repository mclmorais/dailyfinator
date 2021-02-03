import { CommandContext } from '../models/command-context'
import { Command } from './command'

export class Ping implements Command
{
  readonly commandName = 'ping'

  async run (commandContext : CommandContext): Promise<void>
  {
    commandContext.originalMessage.reply('Pong!')
  }
}
