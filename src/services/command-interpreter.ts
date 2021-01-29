import { Message } from 'discord.js'
import { injectable } from 'inversify'

@injectable()
export class CommandInterpreter
{
  private prefix = '!';

  private possibleCommands = [
    { name : 'ping', numberOfArguments : 0 },
    { name : 'add-name', numberOfArguments : 1 },
    { name : 'list-names', numberOfArguments : 0 }
  ]

  public interpret (message : Message): { name: string, arguments: string[] } | null
  {
    if (message.author.bot)
    {
      console.log('> Ignoring bot message')
      return null
    }

    if (!message.content.startsWith(this.prefix))
    {
      console.log('Ignoring unprefixed message!')
      return null
    }

    const parameters = message.content.slice(this.prefix.length).trim().split(/ +/)

    const [commandName, ...commandArguments] = parameters

    const validatedCommand = this.possibleCommands.find(c => c.name === commandName.toLowerCase() && c.numberOfArguments === commandArguments.length)

    return validatedCommand ? { name : commandName, arguments : commandArguments } : null
  }
}
