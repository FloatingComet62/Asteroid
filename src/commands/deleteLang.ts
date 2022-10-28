import { SlashCommandBuilder } from 'discord.js'
import { PermissionFlagsBits } from 'discord-api-types/v10'
import { Interactions, otherOptions } from '../interfaces'

export const data = new SlashCommandBuilder()
	.setName('delete-lang')
	.setDescription(`Delete a language from the server`)
	.addStringOption(option => option
		.setName('language-name')
		.setDescription('Language\'s name')
		.setRequired(true)
	)
	.setDefaultMemberPermissions(PermissionFlagsBits.Administrator)

export async function execute({ database }: otherOptions, interaction: Interactions) {
	if (!interaction.isCommand()) return
	const languageName = interaction.options.get('language-name')!.value!.toString()

	if (languageName === 'general') {
		interaction.reply({ content: `Language Name can't be general`, ephemeral: true })
		return
	}

	// Init
	let error = false
	let content = `Deleting Language ${languageName}`
	interaction.reply({ content })

	const languageData = await database.getLang(languageName)

	// Channel Segregation
	const targetChannel = await interaction.guild?.channels.fetch(languageData.channelId)
	if (!targetChannel) {
		content += `\n:x: Channel #${languageName} not found`
		error = true
	}
	else if (!targetChannel.deletable) {
		content += `\n:x: Channel <#${targetChannel.id}> is not deletable`
		error = true
	}
	else {
		await targetChannel.delete()
		content += `\n:white_check_mark: Channel deleted`
	}

	interaction.editReply({ content })
	if (error) return

	// Role Segregation
	const targetRole = await interaction.guild?.roles.fetch(languageData.roleId)
	if (!targetRole) {
		content += `\n:x: Role @${languageName} not found`
		error = true
	}
	//! there is no role.deletable
	else {
		await targetRole.delete()
		content += `\n:white_check_mark: Role deleted`
	}

	interaction.editReply({ content })
	if (error) return

	// Database Segregation
	await database.deleteLang(languageName)
	content += `\n:white_check_mark: Updated database`

	interaction.editReply({ content })
}