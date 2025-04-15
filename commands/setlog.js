const fs = require('fs');
const config = require('../config.json');

module.exports = {
    name: 'setlog',
    async execute(client, message, args) {
        if (!message.member.permissions.has('Administrator')) return;

        const channel = message.mentions.channels.first();
        if (!channel) return message.reply('يرجى منشن القناة.');

        config.logChannel = channel.id;
        fs.writeFileSync('./config.json', JSON.stringify(config, null, 2));

        message.reply(`تم تعيين قناة اللوق إلى ${channel}`);
    }
};
