const fs = require('fs');
const config = require('../config.json');
const stats = require('../data/stats.json');

function logBroadcast(guild, message, sent, failed) {
    const logMsg = `📢 تم إرسال برودكاست: "${message}"\n✅ نجح: ${sent} | ❌ فشل: ${failed}`;
    const logChannel = guild.channels.cache.get(config.logChannel);
    if (logChannel) logChannel.send(logMsg);

    // تحديث الإحصائيات
    stats.totalBroadcasts++;
    stats.totalRecipients += sent;
    stats.totalFails += failed;

    if (!stats.messageCounts) stats.messageCounts = {};
    stats.messageCounts[message] = (stats.messageCounts[message] || 0) + 1;

    const sorted = Object.entries(stats.messageCounts).sort((a, b) => b[1] - a[1]);
    stats.mostFrequent = sorted[0]?.[0] || '';

    fs.writeFileSync('./data/stats.json', JSON.stringify(stats, null, 2));
}

module.exports = { logBroadcast };
