/* eslint-disable no-unmodified-loop-condition */
import { DMChannel, Guild, Message, NewsChannel, TextChannel } from 'discord.js'
import { injectable } from 'inversify'
import { SqliteClient } from '../clients/sqlite-client'
import { CommandHelper } from '../helpers/command-helper'
import { CommandContext } from '../models/command-context'
import dayjs = require('dayjs')

@injectable()
export class DailyInstance
{
  private channel : TextChannel | DMChannel | NewsChannel
  private guild : Guild
  private discordUserIDs : Array<string>
  private shuffledDiscordUserIDs : Array<string>
  private interrupted = false

  constructor (
    private sqliteClient : SqliteClient,
    commandContext : CommandContext
  )
  {
    this.channel = commandContext.originalMessage.channel
    this.guild = commandContext.originalMessage.guild
  }

  public async run ()
  {
    const phases =  [
      this.initialize,
      this.waitPhase,
      this.mainPhase,
      this.endPhase
    ]

    for (const phase of phases)
    {
      await phase.call(this)

      if (this.interrupted)
      {
        this.channel.send('Daily encerrada!')
        break
      }
    }
  }

  public async initialize ()
  {
    await this.channel.send('Começando a daily!')
  }

  public async  waitPhase ()
  {
    let running = true
    let returnValue = 'success'

    this.discordUserIDs = (await this.sqliteClient.database.all('SELECT discordID FROM Users')).map(user => user.discordID)
    this.shuffledDiscordUserIDs = this.shuffle(this.discordUserIDs)

    const startTimeoutDate = dayjs().add(5, 'minutes')

    const channelLink = (await this.sqliteClient.database.get(
      `SELECT *
       FROM ChannelLinks
       WHERE textChannelID=${this.channel.id}`
    ))

    const voiceChannel = this.guild.channels.cache.get(channelLink.voiceChannelID)

    const missingUsers = this.discordUserIDs.filter(id => !voiceChannel.members.get(id))

    if (missingUsers.length)
    {
      const message = await this.channel.send(
`Aguardando os seguintes usuários entrarem no canal de voz:
> ${CommandHelper.ListMentions(missingUsers, '\n> ')}
Caso algum usuário não esteja presente, a daily começará em ${startTimeoutDate.toISOString()}.
Aperte na 🏁 para encerrar.`
      )
      await this.addFinishReaction(message, () =>
      {
        running = false
        returnValue = 'interrupt'
      })
    }

    while (running)
    {
      const missingUsers = this.discordUserIDs.filter(id => !voiceChannel.members.get(id))

      if (missingUsers.length <= 0)
      {
        this.channel.send('Todo mundo está aqui!')
        running = false
      }
      else if (missingUsers && dayjs().isAfter(startTimeoutDate))
      {
        this.channel.send(`Estourado tempo máximo. Os seguintes users não estão presentes: ${CommandHelper.ListMentions(missingUsers)}`)
        running = false
      }
      await new Promise(resolve => setTimeout(resolve, 1000))
    }
    return returnValue
  }

  private async mainPhase ()
  {
    let running = true
    const order = this.shuffle(this.discordUserIDs).reduce((fullString, id, index) => `${fullString}\n> ${index + 1}. <@${id}>`, '')
    const message = await this.channel.send(`Ordem dos participantes:\n${order}`)
    await this.addFinishReaction(message, () => { running = false })
    while (running)
      await new Promise(resolve => setTimeout(resolve, 1000))
  }

  private async endPhase ()
  {

  }

  private shuffle (array : Array<any>)
  {
    return array
      .map((a) => ({ sort : Math.random(), value : a }))
      .sort((a, b) => a.sort - b.sort)
      .map((a) => a.value)
  }

  private async addFinishReaction (message : Message, callback)
  {
    await message.react('🏁')

    const collector = message.createReactionCollector(
      (reaction, user) => reaction.emoji.name === '🏁',
      { time : 1000000 }
    )

    collector.on('collect', () =>
    {
      collector.stop()
      this.interrupted = true
      return callback()
    })
  }
}
