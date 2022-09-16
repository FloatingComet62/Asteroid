import { EmbedBuilder, GuildMemberRoleManager } from 'discord.js'
import { Interactions, otherOptions } from '../interfaces'

export const name = 'interactionCreate'
export const once = false

export async function execute({ client, database }: otherOptions, interaction: Interactions): Promise<void> {
    if (interaction.isButton()) {
        if (interaction.customId === 'rules') {
            const roleManger = interaction.member?.roles as GuildMemberRoleManager
            const embed = new EmbedBuilder()
                .setColor('#43b581')

            if(roleManger.cache.has(process.env.RULES_ROLE_ID)) {
                await roleManger.remove(process.env.RULES_ROLE_ID)
                embed.setTitle('Rules Declined').setDescription('You now can\'t talk and message')
            } else {
                await  roleManger.add(process.env.RULES_ROLE_ID)
                embed.setTitle('Rules Accepted').setDescription('You now can talk and message')
            }

            interaction.reply({ embeds: [embed.toJSON()], ephemeral: true })
        }
    }

    if (interaction.isCommand()) {
        const command = client?.commands?.get(interaction.commandName)
        if (!command) return
        try{ command.execute({ client, database }, interaction) }
        catch(error){
            console.error(error)
            await interaction.reply({
                content: 'There was an error while executing this command!',
                ephemeral: true 
            })
        }
    }
}