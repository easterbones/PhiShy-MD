const userSpamData = {};
let handler = m => m;

handler.before = async function (m, { conn, isAdmin, isBotAdmin, isOwner, isROwner, isPrems }) {
  const chat = global.db.data.chats[m.chat];
  if (!m.isGroup) return;
  if (chat.modoadmin) return;
  if (isOwner || isROwner || isAdmin || !isBotAdmin || isPrems) return;

  const sender = m.sender;
  const currentTime = new Date().getTime();
  const timeWindow = 4500; // 4.5 seconds
  const messageLimit = 3; // More than 3 messages is considered spam

  if (!(sender in userSpamData)) {
    userSpamData[sender] = {
      lastMessageTime: currentTime,
      messageCount: 1,
      messages: [m.key.id],
      warnings: 0
    };
  } else {
    const userData = userSpamData[sender];
    const timeDifference = currentTime - userData.lastMessageTime;

    if (timeDifference <= timeWindow) {
      userData.messageCount += 1;
      userData.messages.push(m.key.id);

      if (userData.messageCount > messageLimit) {
        // Close the group chat
        await conn.groupSettingUpdate(m.chat, 'announcement');

        // Delete the last 3 messages from the spammer
        const messagesToDelete = userData.messages.slice(-3);
        for (const msgId of messagesToDelete) {
          await conn.sendMessage(m.chat, { delete: { remoteJid: m.chat, fromMe: false, id: msgId } });
        }

        // Warn the user
        await conn.sendMessage(m.chat, {
          text: `⚠️ @${sender.split('@')[0]} hai spammato troppi messaggi! Hai ricevuto un warn per spam.`,
          mentions: [sender]
        });

        // Add a warning to the user
        if (!global.db.data.users[sender]) {
          global.db.data.users[sender] = { warnReasonsAdmin: [] };
        }
        global.db.data.users[sender].warnReasonsAdmin.push({
          reason: 'Spam',
          date: new Date().toISOString()
        });

        userData.warnings += 1;
        userData.messageCount = 0;
        userData.messages = [];

        // If the user repeats the behavior, remove them from the group
        if (userData.warnings >= 2) {
          await conn.groupParticipantsUpdate(m.chat, [sender], 'remove');
        }
      }
    } else {
      // Reset the counter if the time window has passed
      userData.messageCount = 1;
      userData.messages = [m.key.id];
    }

    userData.lastMessageTime = currentTime;
  }
};

export default handler;