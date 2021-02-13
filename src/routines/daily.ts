import { User } from 'discord.js'
import { injectable } from 'inversify'

@injectable()
export class DailyInstance
{
  private expectedParticipants : Array<User>
  private currentParticipants : Array<User>

  public start ()
  {

  }

  public update (commandContext)
  {

  }
}
