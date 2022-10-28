import { GuildMember } from 'discord.js'
import { otherOptions } from '../interfaces'

export const name = 'guildMemberAdd'
export const once = false

export async function execute({ database }: otherOptions, member: GuildMember): Promise<void> {
    if (member.user.bot) return
    await database.createUser(member.id)
}