import { CommandContext } from '../models/command-context'
import { Command } from './command'

export class DailyStart implements Command
{
  public readonly commandName = 'daily-start'

  async run (commandContext : CommandContext): Promise<void>
  {
    const channel = commandContext.originalMessage.channel

    const message = await channel.send(
`Começando a daily!
Aperte na 🏁 para encerrar.`
    )

    await message.react('🏁')

    const collector = message.createReactionCollector(
      (reaction, user) => reaction.emoji.name === '🏁',
      { time : 10000 }
    )

    collector.on('collect', () => channel.send('Daily encerrada!'))
  }
}
