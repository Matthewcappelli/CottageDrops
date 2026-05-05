require('dotenv').config();

const fs = require('fs');
const path = require('path');

const {
    Client,
    Collection,
    GatewayIntentBits,
    Events
} = require('discord.js');

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.MessageContent
    ]
});

client.commands = new Collection();

const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

for (const file of commandFiles) {

    const filePath = path.join(commandsPath, file);
    const command = require(filePath);

    if ('data' in command && 'execute' in command) {
        client.commands.set(command.data.name, command);
    }
}

client.once(Events.ClientReady, () => {
    console.log(`Logged in as ${client.user.tag}`);
});

client.on(Events.InteractionCreate, async interaction => {

    // Slash Commands
    if (interaction.isChatInputCommand()) {

        const command = client.commands.get(interaction.commandName);

        if (!command) return;

        try {
            await command.execute(interaction);
        } catch (error) {

            console.error(error);

            if (interaction.replied || interaction.deferred) {
                await interaction.followUp({
                    content: 'There was an error executing this command.',
                    ephemeral: true
                });
            } else {
                await interaction.reply({
                    content: 'There was an error executing this command.',
                    ephemeral: true
                });
            }
        }
    }

    // ROLE DROPDOWN MENU
    if (interaction.isStringSelectMenu()) {

        if (interaction.customId === 'role_menu') {

            const member = interaction.member;
            const selectedRoles = interaction.values;

            try {

                // Remove roles from this menu first
                for (const option of interaction.component.options) {

                    const roleId = option.value;

                    if (member.roles.cache.has(roleId)) {
                        await member.roles.remove(roleId);
                    }
                }

                // Add selected roles
                for (const roleId of selectedRoles) {
                    await member.roles.add(roleId);
                }

                await interaction.reply({
                    content: 'Your roles have been updated.',
                    ephemeral: true
                });

            } catch (err) {

                console.error(err);

                await interaction.reply({
                    content: 'Failed to update roles.',
                    ephemeral: true
                });
            }
        }
    }
});

client.login(process.env.TOKEN);