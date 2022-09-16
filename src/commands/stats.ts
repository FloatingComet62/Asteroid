import { SlashCommandBuilder, EmbedBuilder } from '@discordjs/builders'
import { Interactions, otherOptions } from '../interfaces'

export const data = new SlashCommandBuilder()
        .setName('stats')
        .setDescription('See your stats');

export async function execute({ database }: otherOptions, interaction: Interactions){
    if (!interaction.isCommand()) return
    const { c, cpp, java, rust, javascript: js, typescript: ts, python: py, general: gen, "c-sharp": cs } = await database.getUser(interaction.user.id)

    const embed = new EmbedBuilder()
        .setTitle('Stats')
        .setDescription(
            `
            **General**:    \`${gen}\`
            **C**:          \`${c}\`
            **Cpp**:        \`${cpp}\`
            **C Sharp**:    \`${cs}\`
            **Java**:       \`${java}\`
            **Rust**:       \`${rust}\`
            **JavaScript**: \`${js}\`
            **TypeScript**: \`${ts}\`
            **Python**:     \`${py}\``
        )
        .setColor(0xaaaaaa);
    
    await interaction.reply({ embeds: [embed.toJSON()], ephemeral: true })
}