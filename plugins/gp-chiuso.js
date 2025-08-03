let handler = async (m, { conn, args, text, isAdmin }) => {
  // Verifica se l'utente è un moderatore
  function normalizeJid(jid) {
    return (jid || '').replace(/[^0-9]/g, '') + '@s.whatsapp.net';
  }
  
  const senderJid = normalizeJid(m.sender);
  const isOwner = global.owner && global.owner.some(([id]) => normalizeJid(id) === senderJid);
  
  // Verifica se l'utente è un moderatore (JID esatto)
  const modsList = Array.isArray(global.db.data.mods) ? global.db.data.mods : [];
  const isMod = modsList.includes(senderJid);
  // Se non è admin, owner o mod, blocca
  if (!isAdmin && !isOwner && !isMod) {
    return m.reply('❌ Solo admin, owner e moderatori possono usare questo comando.');
  }
  
  // Determina il gruppo target
  let targetGroup = m.chat;
  
  // Controllo speciale per il gruppo di controllo dei moderatori
  const CONTROL_GROUP = '120363387953890165@g.us';
  const isControlGroup = m.chat === CONTROL_GROUP;
  
  // Se siamo nel gruppo di controllo e c'è un tag, estrai il gruppo target
  if (isControlGroup && text) {
    // Estrai JID del gruppo dalla menzione o dal testo
    const mentionedJid = m.mentionedJid && m.mentionedJid[0] ? m.mentionedJid[0] : null;
    
    if (mentionedJid && mentionedJid.endsWith('@g.us')) {
      targetGroup = mentionedJid;
    } else if (text.includes('@g.us')) {
      // Estrai JID dal testo se fornito direttamente
      const match = text.match(/(\d+-\d+@g\.us)/);
      if (match) targetGroup = match[1];
    } else {
      return m.reply('❌ Formato non valido. Usa: !chiuso @tagdelgruppo');
    }
  }
  
  // Imposta la modalità del gruppo su "announcement" per chiudere la chat
  let groupSetting = "announcement"; // solo admin possono scrivere
  
  // --- Limiti per moderatori ---
  // Limite: max 3 usi ogni 24h per i moderatori (no limiti per owner/admin)
  if (isMod && !isOwner && !isAdmin) {
    if (!global.db.data.modLimits) global.db.data.modLimits = {};
    const now = Date.now();
    const windowMs = 24 * 60 * 60 * 1000;
    const maxUses = 3;
    const key = `${senderJid}:gp-chiuso`;
    let record = global.db.data.modLimits[key] || { count: 0, last: 0 };
    if (now - record.last > windowMs) {
      record = { count: 0, last: now };
    }
    if (record.count >= maxUses) {
      return m.reply('❌ Hai raggiunto il limite di 3 chiusure gruppo nelle ultime 24 ore.');
    }
    record.count++;
    record.last = now;
    global.db.data.modLimits[key] = record;
  }
  
  try {
    await conn.groupSettingUpdate(targetGroup, groupSetting);
    
    // Invia messaggio con thumbnail e anteprima
    let thumbnailUrl = 'https://images.icon-icons.com/4312/PNG/512/logo_whatsapp_icon_267304.png';
    let body = "𝐂𝐡𝐚𝐭 𝐝𝐞𝐠𝐥𝐢 𝐃𝐞𝐢 𝐚𝐭𝐭𝐢𝐯𝐚𝐭𝐚";
    
    // Messaggio di conferma nel gruppo target
    await conn.sendMessage(targetGroup, {
      text: "",
      contextInfo: {
        externalAdReply: {
          title: body,
          body: "",
          thumbnailUrl,
          mediaType: 1,
          renderLargerThumbnail: false,
          showAdAttribution: false
        }
      }
    });
    
    // Se il comando viene da gruppo di controllo, invia anche lì la conferma
    if (isControlGroup && targetGroup !== CONTROL_GROUP) {
      await m.reply(`✅ Gruppo ${targetGroup} chiuso con successo.`);
    }
  } catch (error) {
    console.error('Errore nella chiusura del gruppo:', error);
    return m.reply('❌ Errore nella chiusura del gruppo. Verifica che il bot sia admin nel gruppo target.');
  }
};

handler.help = ["group open / close", "gruppo aperto / chiuso"];
handler.tags = ["group"];
handler.command = /^(chiuso|chiudi)$/i;
handler.botAdmin = true;
export default handler;
