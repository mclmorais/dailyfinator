import { Client, Message } from "discord.js"
import { inject, injectable } from "inversify"
import { TYPES } from "./types"

@injectable()
export class Bot {
  private client: Client
  private readonly token: string

  constructor(
    @inject(TYPES.Client) client: Client,
    @inject(TYPES.Token) token: string) {
    this.client = client
    this.token = token
  }

  public listen(): Promise<string> {
    let client = new Client();
    client.on('message', (message: Message) => { 
      console.log(`Message received! Contents: ${message.content}`)

    });
    
    return client.login(this.token);
  }
}