import { GuildMember } from 'discord.js'
import { otherOptions } from '../interfaces'
import Database from '../database'

export const name = 'guildMemberAdd'
export const once = false

export async function execute(
	{}: otherOptions,
	member: GuildMember,
): Promise<void> {
	const database = Database.getDatabase()
	if (member.user.bot) return
	await database.createUser(member.id)
}
