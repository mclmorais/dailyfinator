/* eslint-disable no-unmodified-loop-condition */
import { SqliteClient } from '../clients/sqlite-client'
import { CommandHelper } from '../helpers/command-helper'
import { CommandContext } from '../models/command-context'
import { Command } from './command'
import dayjs = require('dayjs')

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
    const channel = commandContext.originalMessage.channel

    await channel.send('Começando a daily!')

    const startTimeoutDate = dayjs().add(5, 'minutes')

    const discordIDs = (await this.sqliteClient.database.all(
      `SELECT *
       FROM Users`
    )).map(d => d.DiscordID)

    const shuffledIDs = discordIDs.map((a) => ({ sort : Math.random(), value : a }))
      .sort((a, b) => a.sort - b.sort)
      .map((a) => a.value)

    const message = await channel.send(
`Aguardando os seguintes usuários entrarem no canal de voz:
> ${CommandHelper.ListMentions(shuffledIDs, '\n> ')}
Aperte na 🏁 para encerrar.`
    )

    await message.react('🏁')

    const collector = message.createReactionCollector(
      (reaction, user) => reaction.emoji.name === '🏁',
      { time : 1000000 }
    )

    let running = true
    collector.on('collect', () =>
    {
      channel.send('Daily encerrada!')
      running = false
      console.log('tchau')
    })

    const channelLink = (await this.sqliteClient.database.get(
      `SELECT *
       FROM ChannelLinks
       WHERE textChannelID=${commandContext.originalMessage.channel.id}`
    ))

    const guild = commandContext.originalMessage.guild
    const voiceChannel = guild.channels.cache.get(channelLink.voiceChannelID)

    while (running)
    {
      const missingUsers = discordIDs.filter(id => !voiceChannel.members.get(id))

      if (!missingUsers)
      {
        channel.send('Todo mundo está aqui!')
        running = false
      }
      else if (missingUsers && dayjs().isAfter(startTimeoutDate))
      {
        channel.send(`Estourado tempo máximo. Os seguintes users não estão presentes: ${CommandHelper.ListMentions(missingUsers)}`)
        running = false
      }
      await new Promise(resolve => setTimeout(resolve, 1000))
    }
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
