import { CommandContext } from '../models/command-context'

export interface Command
{

  readonly commandName : string

  run(commandContext : CommandContext): Promise<void>
}
