const { Client, GatewayIntentBits, Collection, Partials } = require('discord.js');
const fs = require('fs');
const config = {
  token: process.env.TOKEN,
  logChannel: null
};

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildMessageReactions,
        GatewayIntentBits.DirectMessages
    ],
    partials: [Partials.Channel]
});

client.commands = new Collection();

// تحميل الأوامر
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    client.commands.set(command.name, command);
}

// الأحداث
client.on('messageCreate', async message => {
    if (!message.guild || message.author.bot) return;
    const prefix = '!';
    if (!message.content.startsWith(prefix)) return;

    const args = message.content.slice(prefix.length).trim().split(/ +/);
    const cmdName = args.shift().toLowerCase();

    const command = client.commands.get(cmdName);
    if (command) {
        command.execute(client, message, args);
    }
});

client.login(process.env.TOKEN);