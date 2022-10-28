import { HexColorString, SlashCommandBuilder } from 'discord.js'
import { PermissionFlagsBits } from 'discord-api-types/v10'
import { Interactions, otherOptions } from '../interfaces'

export const data = new SlashCommandBuilder()
    .setName('create-lang')
    .setDescription('Add a language to the server')
    .addStringOption(option => option
        .setName('language-name')
        .setDescription('Language\'s name')
        .setRequired(true)
    )
    .addStringOption(option => option
        .setName('language-accent-color')
        .setDescription('Hex Color')
        .setRequired(true)
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)

export async function execute({ database }: otherOptions, interaction: Interactions) {
    if (!interaction.isCommand()) return
    const languageName = interaction.options.get('language-name')!.value!.toString()
    const color = interaction.options.get('language-accent-color')!.value as HexColorString

    if (languageName === 'general') {
        interaction.reply({ content: `Language Name can't be general`, ephemeral: true })
        return
    }

    // Init
    let error = false
    let content = `Adding Language ${languageName}`
    interaction.reply({ content })

    // Channel
    const channel = await interaction.guild?.channels.create({
        name: languageName,
        parent: process.env.LANGUAGE_GROUP_ID
    })
    if (channel) content += `\n:white_check_mark: Created Channel <#${channel.id}>`
    else {
        content += `\n:x: Failed to create Channel`
        error = true
    }

    interaction.editReply({ content })
    if (error) return

    // Role integration
    const role = await interaction.guild?.roles.create({
        name: languageName,
        color
    })

    if (role) content += `\n:white_check_mark: Created Role <@&${role.id}>`
    else {
        content += `\n:x: Failed to create Role`
        error = true
    }

    interaction.editReply({ content })
    if (error) return

    // Database integration
    await database.addLang(languageName, channel!.id, role!.id)

    content += `\n:white_check_mark: Updated database`
    interaction.editReply({ content })
}