import "reflect-metadata"
import {Container} from "inversify"
import { Bot } from "./bot";
import { Client } from "discord.js";
import { TYPES } from "./types";
import { MessageResponder } from "./services/message-responder";
import { CommandFinder } from "./services/command-finder";
import { NamesManager } from "./services/names-manager";

let container = new Container();

container.bind<Bot>(TYPES.Bot).to(Bot).inSingletonScope;
container.bind<Client>(TYPES.Client).toConstantValue(new Client());
container.bind<string>(TYPES.Token).toConstantValue(process.env.TOKEN);
container.bind<MessageResponder>(TYPES.MessageResponder).to(MessageResponder).inSingletonScope();
container.bind<CommandFinder>(TYPES.CommandFinder).to(CommandFinder).inSingletonScope();
container.bind<NamesManager>(TYPES.NamesManager).to(NamesManager).inSingletonScope;

export default container;