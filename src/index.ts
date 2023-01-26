import { Client, Collection } from 'discord.js'
import { config } from 'dotenv'
import { readdirSync } from 'fs'
import { join } from 'path'
import { Command, customClient, Event } from './interfaces'

config()

// I know, very safe and creative
if (process.env.NODE_ENV !== 'production')
	process.env.DATABASE_URL = process.env.DATABASE_URL.replace('host.docker.internal', 'localhost')


const client: customClient = new Client({
	intents: ['Guilds', 'GuildMessages', 'GuildMembers'],
})

// Command Loader
client.commands = new Collection()
const commandsPath = join(__dirname, 'commands')
const commandFiles = readdirSync(commandsPath).filter((file: string) =>
	file.endsWith('.js'),
)
for (const file of commandFiles) {
	const filePath = join(commandsPath, file)
	const command: Command = require(filePath)
	client.commands.set(command.data.toJSON().name, command)
}

// Event Loader
const eventsPath = join(__dirname, 'events')
const eventFiles = readdirSync(eventsPath).filter((file: string) =>
	file.endsWith('.js'),
)
for (const file of eventFiles) {
	const filePath = join(eventsPath, file)
	const event: Event = require(filePath)

	const eventExecuter = (...args: any[]) => event.execute({ client }, ...args)

	if (event.once) client.once(event.name, eventExecuter)
	else client.on(event.name, eventExecuter)
}

client.login(process.env.TOKEN)
