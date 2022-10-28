import { SlashCommandBuilder } from '@discordjs/builders'
import {
    CacheType,
    Client,
    Collection,
    Interaction,
} from 'discord.js'
import { ObjectId } from 'mongodb'
import Database from './database'

export interface customClient extends Client { commands?: Collection<string, Command> }
export interface otherOptions {
    client: customClient
    database: Database
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
    _id: ObjectId
    userId: string
    xp: number
}

export interface Language {
    _id: ObjectId
    name: string
    roleId: string
    channelId: string
}

declare global {
    namespace NodeJS {
        interface ProcessEnv {
            TOKEN: string
            CLIENTID: string
            GUILDID: string
            RULES_ROLE_ID: string
            LANGUAGE_GROUP_ID: string
            KEY: string
        }
    }
}