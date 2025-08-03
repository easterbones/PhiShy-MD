const handler = async (m, { command, text }) => {

const risposta = [ `cacca`, `no`, `certo...che no`];

    
    
const random = risposta[Math.floor(Math.random() * risposta.length)];

 m.reply(random.trim(), null, m.mentionedJid ? { mentions: m.mentionedJid } : {});
};
handler.command = ["nanna"];

export default handler;