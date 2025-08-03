const emojiMap = {
  cuore: "❤️",
  fuoco: "🔥",
  teschio: "💀",
  stella: "⭐",
  dolci: "🍬",
  bacini: "💋",
  vita: "💖",
  livello: "📈",
  exp: "✨",
  limite: "🔒",
  pozione: "🧪",
  macchina: "🚗",
  moto: "🏍️",
  bici: "🚲",
  coniglio: "🐰",
  gatto: "🐱",
  cane: "🐶",
  drago: "🐉",
  scudo: "🛡️"
}

/**
 * Rimpiazza le parole chiave con emoji, se esistono.
 * @param {string} text - Il testo da convertire.
 * @returns {string}
 */
export default function renderEmoji(text = '') {
  if (typeof text !== 'string') return text;

  for (const [key, emoji] of Object.entries(emojiMap)) {
    const regex = new RegExp(`\\b${key}\\b`, 'gi');
    text = text.replace(regex, emoji);
  }

  return text;
}
