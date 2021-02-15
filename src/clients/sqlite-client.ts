import { injectable } from 'inversify'
import { open, Database } from 'sqlite'
import { Database as originalDatabase } from 'sqlite3'

@injectable()
export class SqliteClient
{
  public database : Database

  public async initialize ()
  {
    this.database = await open({
      filename : 'database.db',
      driver   : originalDatabase
    })

    await this.database.run(
      `CREATE TABLE IF NOT EXISTS Users (
        discordID text
    );`
    )

    await this.database.run(
      `CREATE TABLE IF NOT EXISTS ChannelLinks (
        textChannelID text,
        voiceChannelID text
    );`
    )
  }
}
