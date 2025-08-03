import fetch from 'node-fetch';
import { isCanvasAvailable } from '../lib/canvas-wrapper.js';
import fs from 'fs';
import path from 'path';

// Importa ChartJSNodeCanvas solo se canvas è disponibile
let ChartJSNodeCanvas = null;
let chartJSNodeCanvas = null;

if (isCanvasAvailable()) {
  try {
    const chartModule = await import('chartjs-node-canvas');
    ChartJSNodeCanvas = chartModule.ChartJSNodeCanvas;
    const width = 800;
    const height = 400;
    chartJSNodeCanvas = new ChartJSNodeCanvas({ width, height });
  } catch (error) {
    console.warn('⚠️ ChartJS non disponibile:', error.message);
  }
}

const handler = async (m, { conn, command }) => {
  try {
    // Verifica se le funzionalità grafiche sono disponibili
    if (!isCanvasAvailable() || !chartJSNodeCanvas) {
      return m.reply('❌ *Errore*: Le funzionalità grafiche non sono disponibili su questo sistema.\n\n' +
                     'Per utilizzare questo comando è necessario un sistema compatibile con Canvas.\n' +
                     'Puoi consultare i dati Bitcoin su: https://coinmarketcap.com/');
    }

    const url = 'https://api.coingecko.com/api/v3/coins/bitcoin/market_chart?vs_currency=eur&days=1';
    const res = await fetch(url);
    const json = await res.json();

    const prices = json.prices;
    const labels = prices.map(([timestamp]) => {
      const date = new Date(timestamp);
      return `${date.getHours()}:${String(date.getMinutes()).padStart(2, '0')}`;
    });

    const values = prices.map(([, price]) => price.toFixed(2));

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
            font: {
              size: 18
            }
          },
          legend: {
            display: false
          }
        },
        scales: {
          x: {
            ticks: {
              maxTicksLimit: 10
            }
          },
          y: {
            beginAtZero: false
          }
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

    fs.unlinkSync(filename); // pulizia

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
