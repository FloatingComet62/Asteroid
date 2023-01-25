import { SlashCommandBuilder, EmbedBuilder, SelectMenuBuilder, ActionRowBuilder } from '@discordjs/builders'
import { Interactions, otherOptions } from '../interfaces'

export const data = new SlashCommandBuilder()
    .setName('roles')
    .setDescription('temporary slash command');

export async function execute({ }: otherOptions, interaction: Interactions) {
    if (!interaction.isCommand()) return

    const row = new ActionRowBuilder<SelectMenuBuilder>()
        .addComponents(
            new SelectMenuBuilder()
                .setCustomId('langroles')
                .setPlaceholder('No Languages')
                .addOptions(
                    {
                        label: 'Javscript',
                        value: 'javascript'
                    },
                    {
                        label: 'Typescript',
                        value: 'typescript'
                    },
                    {
                        label: 'Python',
                        value: 'python'
                    },
                    {
                        label: 'Rust',
                        value: 'rust'
                    },
                    {
                        label: 'CSharp',
                        value: 'c-sharp'
                    }
                )
                .setMinValues(1)
                .setMaxValues(5)
        )

    await interaction.reply({
        embeds: [
            new EmbedBuilder()
                .setTitle('Language Roles')
                .setDescription(`Choose the languages you are good at`)
                .setColor(0xaaaaaa)
                .toJSON()
        ],
        components: [row],
        ephemeral: true
    })
}