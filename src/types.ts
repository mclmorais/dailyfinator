import { CommandFinder } from "./services/command-finder";

export const TYPES = {
  Bot        : Symbol("Bot"),
  Client     : Symbol("Client"),
  Token      : Symbol("Token"),
  CommandFinder : Symbol("CommandFinder"),
  NamesManager : Symbol("NamesManager"),
  MessageResponder : Symbol("MessageResponder")
}