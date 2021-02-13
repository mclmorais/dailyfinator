export class CommandHelper
{
  static ListMentions (discordIDs, separator = ', ')
  {
    return discordIDs.map(id => `<@${id}>`).join(separator)
  }

  static GetChannelFromMention (mention: string) : string | null
  {
    if (!mention) return null

    if (mention.startsWith('<#') && mention.endsWith('>'))
    {
      mention = mention.slice(2, -1)

      if (mention.startsWith('!'))
        mention = mention.slice(1)

      return mention
    }
    return null
  }
}
