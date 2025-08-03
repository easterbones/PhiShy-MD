function handler(m) {
  const città = ['Brescia', 'Pisa', 'Cosenza', 'Bologna', 'Latina', 'Roffiano']

  const cori = [
    'Chi non salta è di *{città}*, eh oh! 🗣️',
    '*{città}* merda! *{città}* merda! 💩',
    'Olè olè olè olè, *{città}* fa schifo olè! 🤮',
    'E se vai a *{città}*, porta il saponeee 🎶🧼',
    '*{città}* è una fognaa, oh oh oh ooooh 🎤',
    'Che schifo *{città}*, che schifo *{città}*! 🤢',
    'Brucia *{città}*, brucia la città! 🔥',
    'Solo i topi vivono a *{città}*! 🐀',
    '*{città}* non ha un bidet, puzzate tutti i piedii 🎵👣',
    '*{città}*... ma va a lavorààà! 🎶',

    // ⚽️ Cori famosi da stadio
    'Voi di *{città}* siete nati con l’odio nel cuore, e il cervello spento! 🧠💀',
    'Siamo noi, siamo noi, i nemici di *{città}*, siamo noi! 💣',
    'Tornerete in Serie C, bastardi di *{città}*! 👎',
    '*{città}* pezzo di merda, il tuo odore non se ne va! 🤮',
    'Avete solo la nebbia e le zoccole, *{città}* fate schifo! 🌫️👠',
    'Vi brucia ancora? Siete nati per perdere *{città}*! 🔥',
    'Odio *{città}* e chi ci abita, non cambierà mai! 😠',
    '*{città}* è solo una provincia di m***a! 🏚️',
    'Vi aspettiamo sotto casa, *{città}* figli di p******! 😈',
    'Fate i duri ma scappate, *{città}* codardi senza palle! 🐔',

    // 🎵 Cori cantati
    'Oh *{città}*, oh *{città}*, vaffanc***o a *{città}*! 🎵',
    '*{città}* non c’è pietà, vi spacchiamo la città! ⚔️',
    'Portate rispetto, o finisce male *{città}*! ☠️',
    '*{città}* siete tutti infami, vi si sente da qui! 🔊',
    'Mamma ho visto un tifoso di *{città}*… mi sono cagato sotto! 💩',
    '*{città}* conigli bastardi, fate pena! 🐇',
    'E se muori a *{città}*, non ti piange manco tua madre! ⚰️',
    'Io odio solo *{città}*, odio solo *{città}*! 😡',
    'Figli di *{città}*, vi odieremo per sempre! 💀',
    'Vi abbiamo nel mirino, *{città}* schifosi! 🎯',
    'Con *{città}* non c’è pace, solo guerra! 🧨'
  ]

  const cittàScelta = città[Math.floor(Math.random() * città.length)]
  const coro = cori[Math.floor(Math.random() * cori.length)].replaceAll('{città}', cittàScelta)

  m.reply(`🎤 *CORO DA STADIO CONTRO ${cittàScelta.toUpperCase()}* 🎤\n\n${coro}`)
}

handler.help = ['coro']
handler.tags = ['fun']
handler.command = ['coro']
export default handler
