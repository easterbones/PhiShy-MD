let handler = async (m, { conn, text }) => {
    let jid = m.chat // oppure inserisci manualmente un JID se vuoi testare fuori chat

    try {
        const msg = await conn.sendMessage(jid, {
            payment: {
                note: '💸 Ciao, questo è un test di messaggio pagamento!',
                currency: 'IDR',
                offset: 0,
                amount: '10000',
                expiry: 0,
                from: m.sender,
                image: {
                    placeholderArgb: '#000000', // sfondo nero
                    textArgb: '#ffffff', // testo bianco
                    subtextArgb: '#888888' // sottotesto grigio
                }
            },
            contextInfo: {
                externalAdReply: {
                    title: 'Phishy Pagamento Test 💰',
                    body: 'Clicca qui per confermare la transazione',
                    mediaType: 1,
                    renderLargerThumbnail: true,
                    thumbnailUrl: 'https://i.ibb.co/7d1hbwyQ/allalaallaal.png',
                    sourceUrl: 'https://t.me/viridibot_support'
                }
            }
        });

        m.reply('✅ Messaggio di pagamento inviato (se supportato da WhatsApp).');

        // Azione extra: notifica nella console
        console.log(`📤 Pagamento test inviato da ${m.sender} a ${jid}`);

        // Azione extra: avvisa anche l'owner del bot
        let ownerJid = global.owner?.[0] + '@s.whatsapp.net';
        if (ownerJid && ownerJid !== m.sender) {
            await conn.sendMessage(ownerJid, {
                text: `📬 Hai ricevuto un test payment da ${m.sender}`
            });
        }

    } catch (e) {
        console.error(e);
        m.reply('❌ Non sono riuscito a inviare il messaggio di pagamento. Forse non è supportato.');
    }
};

handler.command = ['testpayment']
handler.tags = ['tools']
handler.help = ['testpayment']
handler.register = false
handler.owner = true // solo l'owner può usarlo (per sicurezza)

export default handler;
