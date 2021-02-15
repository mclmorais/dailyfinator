/* eslint-disable no-unmodified-loop-condition */
import { SqliteClient } from '../clients/sqlite-client'
import { CommandContext } from '../models/command-context'
import { DailyInstance } from '../routines/daily'
import { Command } from './command'

export class DailyStart implements Command
{
  public readonly commandName = 'daily'

  private sqliteClient : SqliteClient

  constructor (sqliteClient : SqliteClient)
  {
    this.sqliteClient = sqliteClient
  }

  async run (commandContext : CommandContext): Promise<void>
  {
    switch (commandContext.args[0])
    {
      case 'start':
        return this.StartDaily(commandContext)
      case 'config':
        return this.linkChannels(commandContext)
      default:
        return null
    }
  }

  async StartDaily (commandContext: CommandContext)
  {
    const daily = new DailyInstance(this.sqliteClient, commandContext)
    await daily.run()
  }

  async linkChannels (commandContext: CommandContext)
  {
    const textChannelId = commandContext.originalMessage.channel.id
    const voiceChannelId = commandContext.args[1]
    await this.sqliteClient.database.run(
      `INSERT INTO ChannelLinks
       VALUES ("${textChannelId}", "${voiceChannelId}");`
    )

    await commandContext.originalMessage.reply(`fiz o link do canal de texto <#${textChannelId}> com o canal de voz <#${voiceChannelId}>!`)
  }
}
