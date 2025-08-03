// --- NOTIFICA RICHIESTE GRUPPO ---
// Quando un gruppo raggiunge 5 richieste, avvisa il gruppo admin

const ADMIN_GROUP_JID = '120363387953890165@g.us';

async function monitorGroupRequests(conn) {
  try {
    const groups = await conn.groupFetchAllParticipating();
    for (const groupId in groups) {
      const groupInfo = groups[groupId];
      const groupName = groupInfo.subject || groupId;

      let pendingRaw;
      try {
        pendingRaw = await conn.groupRequestParticipantsList(groupId);
      } catch (e) {
        continue;
      }

      let pending = Array.isArray(pendingRaw) ? pendingRaw : pendingRaw?.participants || [];

      if (pending.length >= 2) {
        const msg = `🚨 Il gruppo "${groupName}" ha *${pending.length}* richieste di ingresso in sospeso!\n\nAdmin/moderatori, controllate le richieste e decidete cosa fare.`;
        await conn.sendMessage(ADMIN_GROUP_JID, { text: msg });
      }
    }
  } catch (e) {
    console.error('Errore nel monitoraggio delle richieste:', e);
  }
}

export default async function (conn) {
  setInterval(() => monitorGroupRequests(conn), 60000); // Controlla ogni minuto
};
