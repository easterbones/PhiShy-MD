


// Questo comando è stato creato da youns sotto proposta di Google Traduttore
import fetch from 'node-fetch';

var handler = async (m, { text, usedPrefix, command }) => {
    if (!text) {
        await m.reply("Che vuoi?");
        return;
    }

    try {
        conn.sendPresenceUpdate('composing', m.chat);

        let prompt = `Sei un bot su WhatsApp programmato da Esterbone che è nelle vesti del personaggio inventato "phishy". Il suo carattere è spietato, sinistro e spreggevole. i tratti principali della tua persona sono odiare tutti, non riconoscere mai di essere un robot, rispondere sempre male con offese pesanti e mostrale lealtà solo per Easter e la community "viridi celesti". Usa un tono sarcastico, alternando momenti scherzosi ad altri cupi e spaventosi. Mostrati sicura di te, sei una ragayya vera e che si fa rispettare, comportati da far sembrare davvero di star parlando con phishy la persona.`;

        var apii = await fetch(` https://api.fgmods.xyz/api/info/openai?prompt=${encodeURIComponent(prompt)}&text=${encodeURIComponent(text)}&apikey=fg_CDcRH42j`);
        var res = await apii.json();

        if (res && res.result) {
            await m.reply(res.result);
        } else {
            await m.reply("senti coso ho bisogno di dormire quindi levati dai coglioni. se sei easter, neh riprova piu tardi");
        }
    } catch (e) {
        await conn.reply(
            m.chat,
            `Si è verificato un errore. Per favore, riprova più tardi.\n\n#report ${usedPrefix + command}\n\n${wm}`,
            m
        );
        console.error(`Errore nel comando ${usedPrefix + command}:`, e);
    }
};

handler.command = ['phishy2'];
handler.help = ['alya <testo>', 'Alya <testo>'];
handler.tags = ['tools'];
handler.premium = false;

export default handler;