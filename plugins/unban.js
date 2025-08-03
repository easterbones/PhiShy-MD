import fetch from 'node-fetch';

let handler = async (m, { conn, text }) => {
  const numero = text?.replace(/[^0-9]/g, "");
  if (!numero) {
    return m.reply("❌ Scrivi il numero dell'utente da riaggiungere. Esempio: `.unban 391234567890`");
  }

  const targetUser = numero + "@s.whatsapp.net";
  const userData = global.db.data.users[targetUser];

  if (!userData?.bannedGroups || userData.bannedGroups.length === 0) {
    return m.reply("⚠️ Questo utente non risulta bannato da alcun gruppo.");
  }

  const riaggiunti = [];
  const falliti = [];

  for (let groupId of userData.bannedGroups) {
    try {
      const metadata = await conn.groupMetadata(groupId);
      const isBotAdmin = metadata.participants.find(p => p.id === conn.user.jid)?.admin;

      if (!isBotAdmin) continue;

      // Prova ad aggiungere direttamente
      try {
        await conn.groupParticipantsUpdate(groupId, [targetUser], "add");
        riaggiunti.push(groupId);
      } catch {
        // Se non è possibile aggiungerlo, prova con l'invito
        try {
          const inviteCode = await conn.groupInviteCode(groupId);
          const inviteLink = `https://chat.whatsapp.com/${inviteCode}`;

          await conn.sendMessage(targetUser, {
            text: `🔓 Sei stato invitato nel gruppo *${metadata.subject}*:\n${inviteLink}`
          });
          riaggiunti.push(groupId);
        } catch (e) {
          falliti.push(groupId);
        }
      }
    } catch (e) {
      console.log(`[unban] Errore nel gruppo ${groupId}:`, e);
      falliti.push(groupId);
    }
  }

  userData.bannedGroups = []; // reset lista

  return m.reply(`✅ Utente @${numero} riaggiunto in *${riaggiunti.length}* gruppi.\n❌ Falliti: *${falliti.length}*`, null, {
    mentions: [targetUser]
  });
};

handler.help = ['unban'];
handler.tags = ['group'];
handler.command = /^unban$/i;
handler.owner = true;

export default handler;
