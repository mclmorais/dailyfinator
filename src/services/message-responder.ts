import { Message } from "discord.js";
import { promises } from "fs";
import { inject, injectable } from "inversify";
import { TYPES } from "../types";
import { NamesManager } from "./names-manager";
import { CommandFinder } from "./command-finder";

@injectable()
export class MessageResponder {
  private commandFinder: CommandFinder;
  private namesManager: NamesManager;

  constructor(
    @inject(TYPES.CommandFinder) commandFinder : CommandFinder,
    @inject(TYPES.NamesManager) namesManager : NamesManager
  ) {
    this.commandFinder = commandFinder;
    this.namesManager = namesManager;
  }

  handle(message : Message) : Promise<Message | Message[]> {

    if(this.commandFinder.isPing(message.content)) {
      return message.reply('pong!')
    }

    if(this.commandFinder.isNameAddCommand(message.content)) {
      this.namesManager.addName(message.content)
      return message.reply('name added!')
    }

    if(this.commandFinder.isNameListcommand(message.content)) {
      return message.reply(this.namesManager.listNames())
    }



    return Promise.reject();
  }
}