import { Client, Intents, Collection } from 'discord.js'
import { customClient, Command, Event } from './interfaces'
import { readdirSync } from 'fs'
import { join } from 'path'
import { config } from 'dotenv'
config()

import db from './database'

const database = new db()
database.connect()
const client: customClient = new Client({
    intents: [
        Intents.FLAGS.GUILDS
    ]
})

// Command Loader
client.commands = new Collection()
const commandsPath = join(__dirname, 'commands')
const commandFiles = readdirSync(commandsPath).filter((file: string) => file.endsWith('.js'))
for(const file of commandFiles){
	const filePath = join(commandsPath, file)
	const command: Command = require(filePath)
	client.commands.set(command.data.toJSON().name, command)
}

// Event Loader
const eventsPath = join(__dirname, 'events')
const eventFiles = readdirSync(eventsPath).filter((file: string) => file.endsWith('.js'))
for(const file of eventFiles){
	const filePath = join(eventsPath, file)
	const event: Event = require(filePath)

    function eventExecuter(...args: any[]){
        let otherOptions = { client, database }
        event.execute(otherOptions, ...args)
    }

	if(event.once) client.once(event.name, (...args: any[]) => eventExecuter(...args))
	else client.on(event.name, (...args: any[]) => eventExecuter(...args))
}

client.login(process.env.TOKEN)