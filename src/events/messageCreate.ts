import { Message } from 'discord.js'
import { otherOptions } from '../interfaces'

export const name = 'messageCreate'
export const once = false

export function execute({ database }: otherOptions, message: Message<boolean>): void {
    if (message.author.bot) return
    database.addPoints(message.author.id)
}