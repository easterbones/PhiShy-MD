
// --- GESTIONE MODERATORI DINAMICA ---
function normalizeJid(jid) {
  return (jid || '').replace(/[^0-9]/g, '') + '@s.whatsapp.net';
}

if (!global.db.data.mods) global.db.data.mods = [];

let handler = async (m, { conn, isBotAdmin, isAdmin, isOwner, args, command }) => {
  // Comandi owner per aggiungere/rimuovere mod, usabili ovunque
  if (/^(addmod|delmod)$/i.test(command)) {
    if (!isOwner) return m.reply('❌ Solo il creatore può usare questo comando.');
    const numero = (args[0] || '').replace(/[^0-9]/g, '');
    if (!numero) return m.reply('❌ Specifica un numero (es: .addmod 393123456789)');
    const jid = normalizeJid(numero);
    if (/^addmod$/i.test(command)) {
      if (global.db.data.mods.includes(jid)) return m.reply('❌ Questo utente è già moderatore.');
      global.db.data.mods.push(jid);
      return m.reply(`✅ ${jid} aggiunto come moderatore.`);
    } else {
      const idx = global.db.data.mods.indexOf(jid);
      if (idx === -1) return m.reply('❌ Questo utente non è moderatore.');
      global.db.data.mods.splice(idx, 1);
      return m.reply(`✅ ${jid} rimosso dai moderatori.`);
    }
  }

  // I comandi richieste/accetta funzionano solo nei gruppi
  if (!m.isGroup) return m.reply("❌ Questo comando si usa solo nei gruppi.");
  if (!isBotAdmin) return m.reply("❌ Devo essere admin per eseguire questa azione.");

  // Controllo moderatore solo tramite db
  const senderJid = normalizeJid(m.sender);
  const isMod = global.db.data.mods.includes(senderJid);
  if (!isMod && !isAdmin && !isOwner) {
    return m.reply("❌ Solo moderatori, admin del gruppo o il creatore possono usare questo comando.");
  }

  const groupId = m.chat;
  let pendingRaw;
  try {
    pendingRaw = await conn.groupRequestParticipantsList(groupId);
  } catch (e) {
    return m.reply("❌ Questo gruppo non supporta la gestione delle richieste (forse è già pubblico o non hai attivato la modalità di approvazione).");
  }

  let pending = Array.isArray(pendingRaw)
    ? pendingRaw
    : pendingRaw?.participants || [];

  if (command === 'accetta') {
    const filtroPrefisso = args[0];
    if (!pending.length) return m.reply("❌ Non ci sono richieste da accettare.");

    let accettati = 0;
    let errori = 0;

    for (let p of pending) {
      const numero = p.jid.split('@')[0];
      if (!filtroPrefisso || numero.startsWith(filtroPrefisso)) {
        try {
          await conn.groupRequestParticipantsUpdate(groupId, [p.jid], 'approve');
          accettati++;
        } catch (e) {
          console.log(`[ERRORE] Non sono riuscito ad accettare ${p.jid}:`, e);
          errori++;
        }
      }
    }

    let messaggio = "";
    if (accettati > 0) {
      messaggio += `✅ Accettate ${accettati} richieste con successo${filtroPrefisso ? ` con prefisso +${filtroPrefisso}` : ""}.`;
    }
    if (errori > 0) {
      messaggio += `\n❌ Si sono verificati ${errori} errori durante l'accettazione.`;
    }
    if (accettati === 0 && errori === 0) {
      messaggio = filtroPrefisso ? `❌ Nessuna richiesta con prefisso +${filtroPrefisso}.` : "❌ Nessuna richiesta accettata.";
    }

    return m.reply(messaggio.trim());
  }

  if (command === 'richieste') {
    if (!pending.length) return conn.reply(m.chat, "Ehy moderatori, non ci sono richieste in sospeso, prova più tardi.", m, phishy);

    let contatti = pending.map(p => {
      const numero = p.jid.split('@')[0];
      return {
        vcard: `
BEGIN:VCARD
VERSION:3.0
FN:+${numero}
TEL;type=CELL;type=VOICE;waid=${numero}:+${numero}
END:VCARD`.trim()
      };
    });

    await conn.sendMessage(m.chat, {
      contacts: {
        displayName: `Richieste in sospeso (${contatti.length})`,
        contacts: contatti
      },
      contextInfo: {
        externalAdReply: {
          title: `📥 Richieste da approvare`,
          body: `Tocca per vedere i numeri e scrivergli in privato.`,
          mediaType: 1,
          renderLargerThumbnail: true
        }
      }
    }, { quoted: m });

    return conn.reply(m.chat, `✅ *ci sono ${contatti.length} richieste, se vuoi accettarle tutte scrivi .accetta*`, m);
  }
}

handler.command = /^(accetta|richieste|addmod|delmod)$/i
handler.tags = ['gruppo']
handler.help = [
  'accetta [prefisso] - accetta richieste (es. .accetta 39)',
  'richieste - mostra chi ha chiesto di entrare'
]
handler.group = true
handler.botAdmin = true

export default handler
