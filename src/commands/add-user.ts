import { injectable } from 'inversify'
import { SqliteClient } from '../clients/sqlite-client'
import { CommandContext } from '../models/command-context'
import { Command } from './command'

@injectable()
export class AddUser implements Command
{
  readonly commandName = 'add-user'

  private sqliteClient : SqliteClient

  constructor (sqliteClient : SqliteClient)
  {
    this.sqliteClient = sqliteClient
  }

  async run (commandContext : CommandContext): Promise<void>
  {
    const mention = this.getUserFromMention(commandContext.args[0])
    if (mention)
    {
      await this.sqliteClient.database.run(
        `INSERT INTO Users (DiscordID)
         VALUES ("${mention}");`
      )
      commandContext.originalMessage.channel.send(`User ${mention} detected!`)
    }
    else
      commandContext.originalMessage.channel.send('No user detected!')
  }

  private getUserFromMention (mention: string) : string | null
  {
    if (!mention) return null

    if (mention.startsWith('<@') && mention.endsWith('>'))
    {
      mention = mention.slice(2, -1)

      if (mention.startsWith('!'))
        mention = mention.slice(1)

      return mention
    }
    return null
  }
}
