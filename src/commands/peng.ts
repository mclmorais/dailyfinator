import { injectable } from 'inversify'
import { CommandContext } from '../models/command-context'
import { Command } from './command'

@injectable()
export class Peng implements Command
{
  readonly commandName = 'peng'
  async run (commandContext : CommandContext): Promise<void>
  {
    commandContext.originalMessage.reply('Pang!')
  }
}
