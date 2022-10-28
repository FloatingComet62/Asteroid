import { SlashCommandBuilder, EmbedBuilder } from '@discordjs/builders'
import { Interactions, otherOptions } from '../interfaces'

export const data = new SlashCommandBuilder()
    .setName('stats')
    .setDescription('See your stats');

export async function execute({ database }: otherOptions, interaction: Interactions) {
    if (!interaction.isCommand()) return
    const data = await database.getUser(interaction.user.id)
    const embed = new EmbedBuilder()
        .setTitle('Stats')
        .setDescription(
            `
            xp: ${data.xp}
            `
        )
        .setColor(0xaaaaaa);

    await interaction.reply({ embeds: [embed.toJSON()], ephemeral: true })
}