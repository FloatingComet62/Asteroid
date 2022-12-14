import { Client, Collection } from 'discord.js'
import { config } from 'dotenv'
import { readdirSync } from 'fs'
import { join } from 'path'
import { Command, customClient, Event } from './interfaces'
import db from './database'
config()

const database = db.getDatabase();
const client: customClient = new Client({
    intents: [
        "Guilds",
        "GuildMessages",
        "GuildMembers"
    ]
})

// Command Loader
client.commands = new Collection()
const commandsPath = join(__dirname, 'commands')
const commandFiles = readdirSync(commandsPath).filter((file: string) => file.endsWith('.js'))
for (const file of commandFiles) {
    const filePath = join(commandsPath, file)
    const command: Command = require(filePath)
    client.commands.set(command.data.toJSON().name, command)
}

// Event Loader
const eventsPath = join(__dirname, 'events')
const eventFiles = readdirSync(eventsPath).filter((file: string) => file.endsWith('.js'))
for (const file of eventFiles) {
    const filePath = join(eventsPath, file)
    const event: Event = require(filePath)

    function eventExecuter(...args: any[]) {
        let otherOptions = { client, database }
        event.execute(otherOptions, ...args)
    }

    if (event.once) client.once(event.name, eventExecuter)
    else client.on(event.name, eventExecuter)
}

process.on('exit', () => {
    database.close() // I know it could have just passed this function as the parameter, but i might want to add more exit stuff later
})

client.login(process.env.TOKEN)