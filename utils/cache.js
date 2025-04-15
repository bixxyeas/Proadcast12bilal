let recentMessages = [];

function isDuplicate(message) {
    return recentMessages.includes(message);
}

function storeMessage(message) {
    if (recentMessages.length >= 3) recentMessages.shift();
    recentMessages.push(message);
}

module.exports = { isDuplicate, storeMessage };
