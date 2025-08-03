const handler = (m) => m;

handler.all = async function(m) {
    if (m.key.fromMe) return;
    if (!m.isGroup) throw '';
    
    const gruppi = global.db.data.chats[m.chat];
    if (gruppi.spacobot === false) throw '';
    
    // Cerca messaggi che iniziano con "lo sapevi" o "curiosità" e che menzionano qualcuno
    if (/^(lo sapevi|curiosità)/i.test(m.text) && m.mentionedJid && m.mentionedJid.length > 0) {
        const mentionedUser = m.mentionedJid[0];
        const contact = await this.getContact(mentionedUser);
        const userName = contact.notify || contact.vname || contact.name || 'Qualcuno';
        
        m.reply(pickRandom([
            `${userName} è così generos* che se chiedi un abbraccio, ti regala anche un cuscino naturale!`,
            `Si dice che ${userName} abbia inventato la legge di gravità, ma solo per attirare l'attenzione sulle sue curve.`,
            `${userName} una volta ha partecipato a una gara di salto con l'asta. L'asta si è arresa e ha chiesto il risarcimento.`,
            `Lo sapevi che ${userName} ha vinto un premio per la miglior scenografia? Tutti guardavano solo il primo piano!`,
            `${userName} è così famos* che i telescopi della NASA si sono messi a puntare verso di lui/lei invece che verso le stelle.`,
            `Si mormora che ${userName} abbia insegnato ai palloncini come mantenersi in aria. Poi sono scappati per non fare concorrenza.`,
            `${userName} una volta ha provato a fare jogging. I passanti si sono fermati a guardare, pensando fosse un terremoto.`,
            `Lo sapevi che ${userName} ha inventato il reggiseno? Poi ha deciso di non usarlo per far impazzire il mondo.`,
            `${userName} è così carismatic* che una volta ha convinto un manichino a prendere vita. Poi il manichino è scappato per la vergogna.`,
            `${userName} una volta ha guardato uno specchio. Lo specchio ha ringraziato per l'onore.`,
            `Si dice che ${userName} abbia vinto una gara di apnea. Poi è emerso che stava usando un costume da bagno troppo stretto.`,
            `${userName} è così intelligent* che una volta ha risolto un cubo di Rubik in 2 secondi. Poi ha scoperto che stava guardando altro.`,
            `Lo sapevi che ${userName} ha inventato il bikini? Poi ha deciso di non indossarlo per non far impazzire i bagnini.`,
            `${userName} una volta ha provato a fare yoga. Il suo insegnante ha chiesto il trasferimento in un altro pianeta.`,
            `${userName} è così veloce che una volta ha superato un razzo. Poi il razzo ha chiesto un autografo.`,
            `Si dice che ${userName} abbia insegnato ai gatti come fare le fusa. I gatti l'hanno ignorata e sono andati a guardare altrove.`,
            `${userName} una volta ha provato a cucinare. Il fuoco si è spento da solo per non rovinare lo spettacolo.`,
            `Lo sapevi che ${userName} ha inventato il sarcasmo? Poi ha provato a usarlo e tutti l'hanno pres* sul serio perché erano distratti.`,
            `${userName} è così famos* che una volta Google ha cercato lui/lei. Poi ha cancellato la ricerca per non rovinare l'algoritmo.`,
            `${userName} una volta ha partecipato a una gara di sollevamento pesi. I pesi si sono alzati da soli per non farlo/a stancare.`,
            `Sapevi che ${userName} ha una laurea in "Saper fare tutto senza fare niente"? È un corso molto impegnativo! 🎓`,
            `${userName} è così cool che quando entra in una stanza, l'aria condizionata si spegne per non fare concorrenza ❄️`,
            `Una leggenda narra che ${userName} abbia insegnato al sole come sorgere e tramontare. Poi il sole ha chiesto un aumento. 🌞`,
            `${userName} ha talmente tanto carisma che i selfie si scattano da soli quando passa davanti alla fotocamera 📸`,
            `Lo sapevi che ${userName} ha vinto il premio "Persona più simpatica"? Poi ha rifiutato perché troppo mainstream 🏆`,
            `${userName} è così brav* a nascondersi che quando gioca a nascondino, gli altri partecipanti si arrendono dopo 5 minuti 🙈`,
            `Si dice che ${userName} abbia inventato la parola "divertimento". Poi ha cancellato il dizionario perché era troppo noioso 📚`,
            `${userName} ha un tale senso dello stile che anche i manichini dei negozi chiedono consigli di moda 👗`,
            `Lo sapevi che ${userName} può risolvere un cubo di Rubik con una sola mano? L'altra la usa per applaudirsi 🎲`,
            `${userName} è così popolare che quando dice "buongiorno", il caffè si prepara da solo ☕`
        ]), null, { mentions: [mentionedUser] });
    }
};

export default handler;

function pickRandom(list) {
    return list[Math.floor(Math.random() * list.length)];
}