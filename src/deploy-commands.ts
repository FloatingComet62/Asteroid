import { REST } from '@discordjs/rest'
import { Routes } from 'discord-api-types/v9'
import { Command } from './interfaces'
import { readdirSync } from 'fs'
import { join } from 'path'
import { config } from 'dotenv'
config()

const commands = []
const commandsPath = join(__dirname, 'commands')
const commandFiles = readdirSync(commandsPath).filter(file =>
	file.endsWith('.js'),
)
for (const file of commandFiles) {
	const filePath = join(commandsPath, file)
	const command: Command = require(filePath)
	commands.push(command.data.toJSON())
}

const rest = new REST({ version: '9' }).setToken(process.env.TOKEN || '')
rest
	.put(
		Routes.applicationGuildCommands(
			process.env.CLIENTID || '',
			process.env.GUILDID || '',
		),
		{ body: commands },
	)
	.then(() => console.log('Commands deployed!'))
	.catch(console.error)
