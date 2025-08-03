import moment from "moment";
import abbrev from "../lib/abbrev.js";
import renderEmoji from "../lib/renderEmoji.js";
import momentDurationFormatSetup from "moment-duration-format";
momentDurationFormatSetup(moment);

/**
 * Pausa il codice per un certo numero di millisecondi
 * @param {number} ms - millisecondi da attendere
 * @returns {Promise<void>}
 */
export const delay = (ms) => new Promise(res => setTimeout(res, ms));

export class Util {
    constructor() {
        throw new Error(`La classe ${this.constructor.name} non può essere istanziata!`);
    }

    static validateHex(hex) {
        if (!hex || typeof hex !== "string") return false;
        return /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(hex);
    }

    static discordTime(time = new Date()) {
        let date = time instanceof Date ? time : new Date();
        let hours = date.getHours().toString().padStart(2, '0');
        let minutes = date.getMinutes().toString().padStart(2, '0');
        return `Oggi alle ${hours}:${minutes}`;
    }

    static formatTime(time) {
        if (!time) return "00:00";
        const fmt = moment.duration(time).format("dd:hh:mm:ss");
        const chunk = fmt.split(":");
        if (chunk.length < 2) chunk.unshift("00");
        return chunk.join(":");
    }

    static shorten(text, len) {
        if (typeof text !== "string") return "";
        if (text.length <= len) return text;
        return text.substr(0, len).trim() + "...";
    }

    static toAbbrev(num) {
        return abbrev(num);
    }

    static renderEmoji(ctx, msg, x, y) {
        return renderEmoji(ctx, msg, x, y);
    }

    static formatHex(hex, alt = "#000000") {
        if (!hex || typeof hex !== "string") return alt;
        hex = hex.replace("#", "");
        if (hex.length === 3) hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
        if (hex.length !== 6) return alt;
        return `#${hex}`;
    }

    static invertColor(hex) {
        if (!hex || typeof hex !== "string") return "#FFFFFF";
        hex = hex.replace("#", "");
        if (hex.length === 3) hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
        if (hex.length !== 6) return "#FFFFFF";

        const r = (255 - parseInt(hex.slice(0, 2), 16)).toString(16);
        const g = (255 - parseInt(hex.slice(2, 4), 16)).toString(16);
        const b = (255 - parseInt(hex.slice(4, 6), 16)).toString(16);

        const pad = (txt, length = 2) => ("0".repeat(length) + txt).slice(-length);
        return `#${pad(r)}${pad(g)}${pad(b)}`;
    }

    static getAcronym(name) {
        if (!name || typeof name !== "string") return "";
        return name.replace(/'s /g, " ").replace(/\w+/g, e => e[0]).replace(/\s/g, "");
    }

    static getLines({ text, ctx, maxWidth }) {
        if (!text) return [];
        if (!ctx) throw new Error("Canvas context non fornito!");
        if (!maxWidth) throw new Error("Max width mancante!");

        const lines = [];
        while (text.length) {
            let i;
            for (i = text.length; ctx.measureText(text.substr(0, i)).width > maxWidth; i--);
            const result = text.substr(0, i);
            let j;
            if (i !== text.length) {
                for (j = 0; result.indexOf(" ", j) !== -1; j = result.indexOf(" ", j) + 1);
            }
            lines.push(result.substr(0, j || result.length));
            text = text.substr(lines[lines.length - 1].length, text.length);
        }
        return lines;
    }
}

// 👑 Lista degli owner del bot (modifica coi tuoi dati reali)
export const globalOwner = [
    ['1234567890', 'owner1', true],   // Owner principale
    ['9876543210', 'owner2', false]   // Owner secondario
];

// Esportazione di default della classe Util
export default Util;
