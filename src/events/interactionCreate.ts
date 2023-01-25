import { EmbedBuilder, GuildMemberRoleManager } from 'discord.js'
import { Interactions, otherOptions } from '../interfaces'
import Database from '../database'

export const name = 'interactionCreate'
export const once = false

export async function execute({ client }: otherOptions, interaction: Interactions): Promise<void> {
    const database = Database.getDatabase()
    if (interaction.isButton()) {
        if (interaction.customId === 'rules') {
            const roleManger = interaction.member?.roles as GuildMemberRoleManager
            const embed = new EmbedBuilder()
                .setColor('#43b581')

            if (roleManger.cache.has(process.env.RULES_ROLE_ID)) {
                await roleManger.remove(process.env.RULES_ROLE_ID)
                embed.setTitle('Rules Declined').setDescription('You now can\'t talk and message')
            } else {
                await roleManger.add(process.env.RULES_ROLE_ID)
                embed.setTitle('Rules Accepted').setDescription('You now can talk and message')
            }

            interaction.reply({ embeds: [embed.toJSON()], ephemeral: true })
        }
    }

    if (interaction.isSelectMenu()) {
        if (interaction.customId === 'langroles') {
            for (const languageName of interaction.values) {
                const { roleId } = await database.getLang(languageName)
                const member = await interaction.guild?.members.fetch({
                    user: interaction.user
                })
                const role = await interaction.guild?.roles.fetch(roleId)
                member!.roles.add(role!)
            }

            interaction.reply({
                embeds: [
                    new EmbedBuilder()
                        .setTitle('Roles')
                        .setDescription('Roles updated')
                        .setColor(0xaaaaaa)
                ]
            })
        }
    }

    if (interaction.isCommand()) {
        const command = client?.commands?.get(interaction.commandName)
        if (!command) return
        try { command.execute({ client }, interaction) }
        catch (error) {
            console.error(error)
            await interaction.reply({
                content: 'There was an error while executing this command!',
                ephemeral: true
            })
        }
    }
}