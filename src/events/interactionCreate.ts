import { Interactions, otherOptions } from '../interfaces'

export const name = 'interactionCreate'
export const once = false

export async function execute({ client, database }: otherOptions, interaction: Interactions): Promise<void> {
    if (!interaction.isCommand()) return
    const command = client?.commands?.get(interaction.commandName)
    if(!command) return
    try{ command.execute({ client, database }, interaction) }
    catch(error){
        console.error(error)
        await interaction.reply({
            content: 'There was an error while executing this command!',
            ephemeral: true 
        })
    }
}