const stats = require('../data/stats.json');

module.exports = {
    name: 'stats',
    async execute(client, message) {
        if (!message.member.permissions.has('Administrator')) return;

        const embed = {
            color: 0x00AE86,
            title: 'إحصائيات البرودكاست',
            fields: [
                { name: 'عدد البرودكاستات', value: `${stats.totalBroadcasts}`, inline: true },
                { name: 'عدد المستقبلين', value: `${stats.totalRecipients}`, inline: true },
                { name: 'عدد الفشل', value: `${stats.totalFails}`, inline: true },
                { name: 'أكثر رسالة مكررة', value: `${stats.mostFrequent || 'لا شيء'}`, inline: false }
            ]
        };

        message.channel.send({ embeds: [embed] });
    }
};
