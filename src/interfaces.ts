import { SlashCommandBuilder } from '@discordjs/builders'
import {
    Client,
    Collection,
    MessageComponentInteraction,
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

export type Interactions = MessageComponentInteraction

export interface User {
    _id: ObjectId
    userId: string
    c: number
    cpp: number
    "c-sharp": number
    rust: number
    java: number
    python: number
    typescript: number
    javascript: number
    general: number
}