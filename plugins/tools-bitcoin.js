import fetch from 'node-fetch';
import fs from 'fs';
import path from 'path';
let ChartJSNodeCanvas, chartJSNodeCanvas;
let canvasAvailable = false;
try {
  require.resolve('canvas');
  const chartModule = require('chartjs-node-canvas');
  ChartJSNodeCanvas = chartModule.ChartJSNodeCanvas;
  chartJSNodeCanvas = new ChartJSNodeCanvas({ width: 800, height: 400 });
  canvasAvailable = true;
} catch (error) {
  canvasAvailable = false;
}

const handler = async (m, { conn, command }) => {
  try {
    const url = 'https://api.coingecko.com/api/v3/coins/bitcoin/market_chart?vs_currency=eur&days=1';
    const res = await fetch(url);
    const json = await res.json();

    const prices = json.prices;
    const labels = prices.map(([timestamp]) => {
      const date = new Date(timestamp);
      return `${date.getHours()}:${String(date.getMinutes()).padStart(2, '0')}`;
    });
    const values = prices.map(([, price]) => price.toFixed(2));

    if (canvasAvailable && chartJSNodeCanvas) {
      const configuration = {
        type: 'line',
        data: {
          labels,
          datasets: [{
            label: 'Bitcoin in EUR (ultime 24h)',
            data: values,
            borderColor: 'rgb(255, 205, 86)',
            backgroundColor: 'rgba(255, 205, 86, 0.2)',
            tension: 0.3,
            fill: true
          }]
        },
        options: {
          plugins: {
            title: {
              display: true,
              text: 'Andamento BTC (24h)',
              font: { size: 18 }
            },
            legend: { display: false }
          },
          scales: {
            x: { ticks: { maxTicksLimit: 10 } },
            y: { beginAtZero: false }
          }
        }
      };
      const buffer = await chartJSNodeCanvas.renderToBuffer(configuration);
      const filename = path.join('/tmp', `btc_graph_${Date.now()}.png`);
      fs.writeFileSync(filename, buffer);
      await conn.sendMessage(m.chat, {
        image: { url: filename },
        caption: '📈 Grafico del valore del *Bitcoin* nelle ultime 24 ore (in €)'
      }, { quoted: m });
      fs.unlinkSync(filename);
    } else {
      // Canvas non disponibile: invia dati testuali
      let msg = '📊 *Bitcoin EUR (ultime 24h)*\n\n';
      for (let i = 0; i < labels.length; i += Math.ceil(labels.length / 10)) {
        msg += `${labels[i]}: €${values[i]}\n`;
      }
      msg += '\nGrafico non disponibile su questo sistema.';
      await conn.reply(m.chat, msg, m);
    }
  } catch (err) {
    console.error(err);
    conn.reply(m.chat, '❌ Errore durante la generazione del grafico BTC.', m);
  }
};

handler.command = ['btc', 'bitcoin'];
handler.help = ['btcgrafico'];
handler.tags = ['finanza'];
handler.register = true;

export default handler;
