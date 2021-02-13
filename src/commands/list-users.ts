import { SqliteClient } from '../clients/sqlite-client'
import { CommandHelper } from '../helpers/command-helper'
import { CommandContext } from '../models/command-context'
import { Command } from './command'

export class ListUsers implements Command
{
  readonly commandName = 'list-users'

  private sqliteClient : SqliteClient

  constructor (sqliteClient : SqliteClient)
  {
    this.sqliteClient = sqliteClient
  }

  async run (commandContext : CommandContext)
  {
    const userIDs = (await this.sqliteClient.database.all(
      `SELECT *
       FROM Users`
    )).map(d => d.DiscordID)

    await commandContext.originalMessage.reply(`Stored users: ${CommandHelper.ListMentions(userIDs)}`)
  }
}
