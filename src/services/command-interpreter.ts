import { Message } from 'discord.js'
import { inject, injectable } from 'inversify'
import { SqliteClient } from '../clients/sqlite-client'
import { AddUser } from '../commands/add-user'
import { Command } from '../commands/command'
import { Peng } from '../commands/peng'
import { Ping } from '../commands/ping'
import { CommandContext } from '../models/command-context'
import { TYPES } from '../types'

@injectable()
export class CommandInterpreter
{
  @inject(TYPES.SqliteClient) private sqliteClient : SqliteClient
  private commands : Command[];

  constructor ()
  {
    const commandClasses = [Ping, Peng, AddUser]
    this.commands = commandClasses.map(CommandClass => new CommandClass(this.sqliteClient))
  }

  public interpret (message : Message)
  {
    const commandContext = new CommandContext(message, '!')

    const matchedCommand = this.commands.find(command => command.commandName === commandContext.parsedCommandName)

    if (matchedCommand)
      matchedCommand.run(commandContext)
  }
}
