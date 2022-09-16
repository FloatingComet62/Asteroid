import { Message } from 'discord.js'
import { otherOptions, UserAttribute } from '../interfaces'

export const name = 'messageCreate'
export const once = false

export function execute({ database }: otherOptions, message: Message<boolean>): void {
    if (message.author.bot) return
    const userId = message.author.id
    const channelToIdMap: { [key: string]: UserAttribute } = {
        "1015533928855126076": "general",
        "1015528649706983515": "javascript",
        "1015529035398393926": "typescript",
        "1015529047926771712": "python",
        "1018451908928737330": "c-sharp",
        "1018451947025612850": "cpp",
        "1018451993754337340": "c",
        "1018452032476160010": "rust",
        "1018452204803330079": "java"
    }

    for (const item in channelToIdMap)
        if (item === message.channelId)
            database.addPoints(userId, channelToIdMap[item])
}