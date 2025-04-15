const { EmbedBuilder } = require('discord.js');
const logger = require('../utils/logger');
const cache = require('../utils/cache');
const fs = require('fs');
const config = require('../config.json');

module.exports = {
    name: 'bro',
    async execute(client, message, args) {
        if (!message.member.permissions.has('Administrator')) return;

        let role = null;
        let content = args.join(' ');

        if (message.mentions.roles.size) {
            role = message.mentions.roles.first();
            content = args.slice(1).join(' ');
        }

        if (!content) return message.reply('يرجى كتابة رسالة البرودكاست.');

        if (cache.isDuplicate(content)) {
            return message.reply('تم إرسال هذه الرسالة مسبقاً مؤخراً.');
        }

        const confirmEmbed = new EmbedBuilder()
            .setTitle('تأكيد البرودكاست')
            .setDescription(`**${content}**\n\nاضغط ✅ للإرسال أو ❌ للإلغاء`)
            .setColor('Blue');

        const confirmMsg = await message.channel.send({ embeds: [confirmEmbed] });
        await confirmMsg.react('✅');
        await confirmMsg.react('❌');

        const filter = (reaction, user) =>
            ['✅', '❌'].includes(reaction.emoji.name) && user.id === message.author.id;

        confirmMsg.awaitReactions({ filter, max: 1, time: 30000, errors: ['time'] })
            .then(async collected => {
                const reaction = collected.first();
                if (reaction.emoji.name === '✅') {
                    const members = await message.guild.members.fetch();
                    let sent = 0;
                    let failed = 0;

                    for (const [, member] of members) {
                        if (member.user.bot) continue;
                        if (role && !member.roles.cache.has(role.id)) continue;

                        try {
                            await member.send(content);
                            sent++;
                        } catch {
                            failed++;
                        }
                    }

                    cache.storeMessage(content);
                    logger.logBroadcast(message.guild, content, sent, failed);

                    message.reply(`تم الإرسال إلى ${sent} عضو، وفشل الإرسال إلى ${failed}.`);
                } else {
                    message.reply('تم إلغاء البرودكاست.');
                }
            })
            .catch(() => message.reply('انتهى وقت التأكيد.'));
    }
};
