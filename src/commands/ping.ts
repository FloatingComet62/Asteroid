import { SlashCommandBuilder, EmbedBuilder } from '@discordjs/builders'
import { Interactions, otherOptions } from '../interfaces'

export const data = new SlashCommandBuilder()
        .setName('ping')
        .setDescription('Replies with Pong!');

export async function execute({ client }: otherOptions, interaction: Interactions){
    let ping = Date.now() - interaction.createdTimestamp
    if (ping < 0) ping *= -1

    const embed = new EmbedBuilder()
        .setTitle('Latency')
        .setDescription(`🏓**Latency** is \`${ping}ms\`.\n🏸**API Latency** is \`${Math.round(client.ws.ping)}ms\`.`)
        .setColor(0xaaaaaa);
    
    interaction.reply({ embeds: [embed.toJSON()], ephemeral: true })
}