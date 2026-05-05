const {
    SlashCommandBuilder,
    ActionRowBuilder,
    StringSelectMenuBuilder
} = require('discord.js');

module.exports = {

    data: new SlashCommandBuilder()

        .setName('addmenu')
        .setDescription('Add a role dropdown menu to an embed')

        .addStringOption(option =>
            option
                .setName('messageid')
                .setDescription('Message ID of the embed')
                .setRequired(true)
        )

        .addRoleOption(option =>
            option
                .setName('role1')
                .setDescription('Role 1')
                .setRequired(true)
        )

        .addRoleOption(option =>
            option
                .setName('role2')
                .setDescription('Role 2')
                .setRequired(false)
        )

        .addRoleOption(option =>
            option
                .setName('role3')
                .setDescription('Role 3')
                .setRequired(false)
        )

        .addRoleOption(option =>
            option
                .setName('role4')
                .setDescription('Role 4')
                .setRequired(false)
        )

        .addRoleOption(option =>
            option
                .setName('role5')
                .setDescription('Role 5')
                .setRequired(false)
        ),

    async execute(interaction) {

        const messageId = interaction.options.getString('messageid');

        const roleOptions = [];

        for (let i = 1; i <= 5; i++) {

            const role = interaction.options.getRole(`role${i}`);

            if (role) {

                roleOptions.push({
                    label: role.name,
                    description: `Get the ${role.name} role`,
                    value: role.id
                });
            }
        }

        try {

            const message = await interaction.channel.messages.fetch(messageId);

            const menu = new StringSelectMenuBuilder()
                .setCustomId('role_menu')
                .setPlaceholder('Choose your roles')
                .setMinValues(1)
                .setMaxValues(roleOptions.length)
                .addOptions(roleOptions);

            const row = new ActionRowBuilder().addComponents(menu);

            await message.edit({
                embeds: message.embeds,
                components: [row]
            });

            await interaction.reply({
                content: 'Role menu added successfully.',
                ephemeral: true
            });

        } catch (err) {

            console.error(err);

            await interaction.reply({
                content: 'Failed to edit message.',
                ephemeral: true
            });
        }
    }
};