let handler = async (m, { conn, participants, groupMetadata, isBotAdmin, isAdmin, isCreator, from }) => {
    try {
        if (!m.isGroup) return m.reply("❌ Questo comando può essere usato solo nei gruppi!");

        if (!(isCreator || isAdmin || m.fromMe)) {
            return m.reply("❌ Solo i proprietari o gli admin del gruppo possono usarlo!");
        }

        await m.reply("*♻️ Scansione dei membri online in corso...*");

        const onlineMembers = new Set();
        const groupData = await conn.groupMetadata(m.chat);
        const presencePromises = [];

        for (const participant of groupData.participants) {
            presencePromises.push(
                conn.presenceSubscribe(participant.id)
                    .then(() => conn.sendPresenceUpdate('composing', participant.id))
            );
        }

        await Promise.all(presencePromises);

        const presenceHandler = (json) => {
            for (const id in json.presences) {
                const presence = json.presences[id]?.lastKnownPresence;
                if (['available', 'composing', 'recording', 'online'].includes(presence)) {
                    onlineMembers.add(id);
                }
            }
        };

        conn.ev.on('presence.update', presenceHandler);

        const checks = 3;
        const checkInterval = 5000;
        let checksDone = 0;

        const interval = setInterval(async () => {
            checksDone++;
            
            if (checksDone >= checks) {
                clearInterval(interval);
                conn.ev.off('presence.update', presenceHandler);

                if (onlineMembers.size === 0) {
                    return m.reply("⚠️ Nessun membro online rilevato. Forse stanno nascondendo la presenza.");
                }

                const onlineArray = Array.from(onlineMembers);
                const onlineList = onlineArray.map(member => `✑ @${member.split('@')[0]}`).join('\n');
                const message = `*🎗️ MEMBRI ONLINE ${onlineArray.length}/${groupData.participants.length}*\n\n${onlineList}`;

                await conn.sendMessage(m.chat, {
                    text: message,
                    mentions: onlineArray
                }, { quoted: m });
            }
        }, checkInterval);

    } catch (e) {
        console.error("Errore nel comando online:", e);
        m.reply(`Si è verificato un errore: ${e.message}`);
    }
};

handler.command = ["online", "whosonline", "co"];
handler.desc = "Controlla chi è online nel gruppo (solo admin e proprietario)";
handler.tags = ["gruppo"];
handler.group = true;
handler.admin = true;

export default handler;
