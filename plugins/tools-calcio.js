import fetch from 'node-fetch';

const API_KEY = '834a5ee55c444637b0688b479e3a7b7e';

const competitionCodes = {
  'serie a': 'SA',
  'serie a italia': 'SA',
  'italia': 'SA',
  'serie b': 'SB',
  'premier league': 'PL',
  'bundesliga': 'BL1',
  'liga': 'PD',
  'ligue 1': 'FL1',
};

function getCompetitionCode(input) {
  return competitionCodes[input.toLowerCase()] || null;
}

const handler = async (m, { conn, args }) => {
  if (args.length === 0) {
    return m.reply(
      '❗ Usa il comando così:\n' +
      '- .calcio nome_squadra\n' +
      '- .calcio risultato nome_squadra\n' +
      '- .calcio prossima [campionato]\n' +
      'Esempi:\n.calcio inter\n.calcio risultato inter\n.calcio prossima serie a'
    );
  }

  const sub = args[0].toLowerCase();
  try {
    // === SOTTOPRINT: RISULTATO ===
    if (sub === 'risultato') {
      if (args.length < 2)
        return m.reply('❗ Specifica la squadra: es `.calcio risultato inter`');

      const team = args.slice(1).join(' ').toLowerCase();
      const url = `https://api.football-data.org/v4/competitions/SA/matches?status=FINISHED&limit=10`;

      const res = await fetch(url, { headers: { 'X-Auth-Token': API_KEY } });
      if (res.status === 404) 
        return m.reply('❌ Endpoint risultati non trovato (404).');
      if (!res.ok) 
        return m.reply(`❌ Errore API: ${res.status} ${res.statusText}`);

      const { matches } = await res.json();
      if (!Array.isArray(matches)) 
        return m.reply('❌ Formato dati inatteso dai risultati.');

      const last = matches.find(mch =>
        mch.homeTeam.name.toLowerCase().includes(team) ||
        mch.awayTeam.name.toLowerCase().includes(team)
      );
      if (!last)
        return m.reply(`❌ Nessuna partita FINITA per "${team}".`);

      const { homeTeam, awayTeam, score, utcDate } = last;
      const date = new Date(utcDate).toLocaleString();
      return m.reply(
        `⚽ Risultato ultima partita di "${team}":\n\n` +
        `${homeTeam.name} ${score.fullTime.home ?? '-'} - ${score.fullTime.away ?? '-'} ${awayTeam.name}\n` +
        `Data: ${date}`
      );
    }

    // === SOTTOPRINT: PROSSIMA ===
    if (sub === 'prossima') {
      let compInput = 'serie a';
      if (args.length > 1) compInput = args.slice(1).join(' ');
      const code = getCompetitionCode(compInput);
      if (!code)
        return m.reply(`❌ Campionato "${compInput}" non riconosciuto.`);

      const url = `https://api.football-data.org/v4/competitions/${code}/matches?status=SCHEDULED&limit=1`;
      const res = await fetch(url, { headers: { 'X-Auth-Token': API_KEY } });
      if (res.status === 404)
        return m.reply(`❌ Campionato "${compInput}" (${code}) non esiste (404).`);
      if (!res.ok)
        return m.reply(`❌ Errore API: ${res.status} ${res.statusText}`);

      const { matches } = await res.json();
      if (!matches?.length)
        return m.reply(`❌ Nessuna prossima partita trovata per ${compInput}.`);

      const next = matches[0];
      const date = new Date(next.utcDate).toLocaleString();
      return m.reply(
        `⚽ Prossima partita ${compInput}:\n\n` +
        `${next.homeTeam.name} vs ${next.awayTeam.name}\n` +
        `Data: ${date}`
      );
    }

    // === SOTTOPRINT: PROSSIMA PARTITA SQUADRA ===
    // default: name of team => next match
    const teamName = args.join(' ').toLowerCase();
    const url = `https://api.football-data.org/v4/competitions/SA/matches?status=SCHEDULED&limit=20`;

    const res = await fetch(url, { headers: { 'X-Auth-Token': API_KEY } });
    if (res.status === 404)
      return m.reply('❌ Endpoint partite non trovato (404).');
    if (!res.ok)
      return m.reply(`❌ Errore API: ${res.status} ${res.statusText}`);

    const { matches } = await res.json();
    if (!Array.isArray(matches))
      return m.reply('❌ Formato dati inatteso dalle partite.');

    const nextMatch = matches.find(mch =>
      mch.homeTeam.name.toLowerCase().includes(teamName) ||
      mch.awayTeam.name.toLowerCase().includes(teamName)
    );
    if (!nextMatch)
      return m.reply(`❌ Nessuna prossima partita per "${teamName}".`);

    const date = new Date(nextMatch.utcDate).toLocaleString();
    return m.reply(
      `⚽ Prossima partita di "${teamName}":\n\n` +
      `${nextMatch.homeTeam.name} vs ${nextMatch.awayTeam.name}\n` +
      `Data: ${date}`
    );

  } catch (err) {
    console.error('Errore calcio plugin:', err);
    return m.reply('❌ Errore interno: impossibile completare la richiesta.');
  }
};

handler.help = ['calcio [risultato|prossima|nome_squadra]'];
handler.tags = ['sport', 'calcio'];
handler.command = /^calcio$/i;
handler.limit = 3;

export default handler;
