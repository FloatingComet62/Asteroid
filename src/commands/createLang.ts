import { HexColorString, SlashCommandBuilder } from 'discord.js'
import { PermissionFlagsBits } from 'discord-api-types/v10'
import { Interactions, otherOptions } from '../interfaces'
import Database from '../database'

export const data = new SlashCommandBuilder()
	.setName('create-lang')
	.setDescription('Add a language to the server')
	.addStringOption(option =>
		option
			.setName('language-name')
			.setDescription("Language's name")
			.setRequired(true),
	)
	.addStringOption(option =>
		option
			.setName('display-name')
			.setDescription('Display name of the language')
			.setRequired(true),
	)
	.addStringOption(option =>
		option
			.setName('language-accent-color')
			.setDescription('Hex Color')
			.setRequired(true),
	)
	.setDefaultMemberPermissions(PermissionFlagsBits.Administrator)

export async function execute({}: otherOptions, interaction: Interactions) {
	const database = Database.getDatabase()
	if (!interaction.isCommand()) return
	const languageName = interaction.options
		.get('language-name')!
		.value!.toString()
	const displayName = interaction.options.get('display-name')!.value!.toString()
	const color = interaction.options.get('language-accent-color')!
		.value as HexColorString

	if (languageName === 'general') {
		interaction.reply({
			content: `Language Name can't be general`,
			ephemeral: true,
		})
		return
	}

	// Init
	let error = false
	let content = `Adding Language ${displayName}`
	await interaction.reply({ content })

	// Channel
	const channel = await interaction.guild?.channels.create({
		name: languageName,
		parent: process.env.LANGUAGE_CATEGORY_ID,
	})
	if (channel)
		content += `\n:white_check_mark: Created Channel <#${channel.id}>`
	else {
		content += `\n:x: Failed to create channel`
		error = true
	}

	await interaction.editReply({ content })
	if (error) return

	// Role integration
	const role = await interaction.guild?.roles.create({
		name: displayName,
		color,
	})

	if (role) content += `\n:white_check_mark: Created Role <@&${role.id}>`
	else {
		content += `\n:x: Failed to create Role`
		error = true
	}

	await interaction.editReply({ content })
	if (error) return

	// Database integration
	await database.addLang(languageName, channel!.id, role!.id)

	content += `\n:white_check_mark: Updated database`
	await interaction.editReply({ content })
}
