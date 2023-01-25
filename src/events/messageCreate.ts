import { Message } from 'discord.js'
import { otherOptions } from '../interfaces'
import Database from '../database'

export const name = 'messageCreate'
export const once = false

export function execute({ }: otherOptions, message: Message<boolean>): void {
    const database = Database.getDatabase()
    if (message.author.bot) return
    database.addPoints(message.author.id)
}