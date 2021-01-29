import { CommandInterpreter } from './services/command-interpreter'

export const TYPES = {
  Bot                : Symbol('Bot'),
  Client             : Symbol('Client'),
  Token              : Symbol('Token'),
  CommandInterpreter : Symbol('CommandInterpreter'),
  NamesManager       : Symbol('NamesManager'),
  MessageReader      : Symbol('MessageReader')
}
