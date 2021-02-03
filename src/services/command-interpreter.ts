import { Message } from 'discord.js'
import { injectable } from 'inversify'
import { Command } from '../commands/command'
import { Peng } from '../commands/peng'
import { Ping } from '../commands/ping'
import { CommandContext } from '../models/command-context'

@injectable()
export class CommandInterpreter
{
  private commands : Command[];
  constructor ()
  {
    const commandClasses = [Ping, Peng]
    this.commands = commandClasses.map(CommandClass => new CommandClass())
  }

  public interpret (message : Message)
  {
    const commandContext = new CommandContext(message, '!')

    const matchedCommand = this.commands.find(command => command.commandName === commandContext.parsedCommandName)

    if (matchedCommand)
      matchedCommand.run(commandContext)
  }
}
