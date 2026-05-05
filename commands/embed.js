const {
    SlashCommandBuilder,
    EmbedBuilder
} = require('discord.js');

module.exports = {

    data: new SlashCommandBuilder()
        .setName('embed')
        .setDescription('Create an embed')

        .addStringOption(option =>
            option
                .setName('title')
                .setDescription('Embed title')
                .setRequired(true)
        )

        .addStringOption(option =>
            option
                .setName('description')
                .setDescription('Embed description')
                .setRequired(true)
        ),

    async execute(interaction) {

        const title = interaction.options.getString('title');
        const description = interaction.options.getString('description');

        const embed = new EmbedBuilder()
            .setTitle(title)
            .setDescription(description)
            .setColor('Blue');

        const msg = await interaction.reply({
            embeds: [embed],
            fetchReply: true
        });

        await interaction.followUp({
            content: `Embed created.\nMessage ID: ${msg.id}`,
            ephemeral: true
        });
    }
};