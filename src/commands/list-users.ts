import { SqliteClient } from '../clients/sqlite-client'
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
    const userIDs = await this.sqliteClient.database.all(
      `SELECT *
       FROM Users`
    )

    let responseString = 'Stored users: '

    for (const userID of userIDs.map(u => u.DiscordID))
      responseString += `<@${userID}>, `

    commandContext.originalMessage.reply(responseString)
  }
}
