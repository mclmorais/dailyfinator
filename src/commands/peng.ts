import { CommandContext } from '../models/command-context'
import { Command } from './command'

export class Peng implements Command
{
  readonly commandName = 'peng'
  async run (commandContext : CommandContext): Promise<void>
  {
    commandContext.originalMessage.reply('Pang!')
  }
}
