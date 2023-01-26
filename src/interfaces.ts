import { SlashCommandBuilder } from '@discordjs/builders'
import { CacheType, Client, Collection, Interaction } from 'discord.js'

export interface customClient extends Client {
	commands?: Collection<string, Command>
}
export interface otherOptions {
	client: customClient
}
export interface Command {
	data: SlashCommandBuilder
	execute(otherOptions: otherOptions, interaction: Interactions): Promise<void>
}
export interface Event {
	name: string
	once: boolean
	execute(otherOptions: otherOptions, ...any: any[]): Promise<void>
}

export type Interactions = Interaction<CacheType>

export interface User {
	userId: string
	xp: number
	created_at: Date
	updated_at: Date
}

export interface Language {
	name: string
	roleId: string
	channelId: string
	created_at: Date
	updated_at: Date
}

declare global {
	namespace NodeJS {
		interface ProcessEnv {
			TOKEN: string
			CLIENTID: string
			GUILDID: string
			RULES_ROLE_ID: string
			LANGUAGE_CATEGORY_ID: string
			DATABASE_URL: string
			NODE_ENV: string
		}
	}
}
