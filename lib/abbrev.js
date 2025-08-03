export default function abbrev(number) {
    if (typeof number !== 'number') number = parseFloat(number);
    if (isNaN(number)) return '0';

    const symbols = ['', 'K', 'M', 'B', 'T'];
    const tier = Math.log10(Math.abs(number)) / 3 | 0;

    if (tier === 0) return number.toString();

    const suffix = symbols[tier];
    const scale = Math.pow(10, tier * 3);
    const scaled = number / scale;

    return scaled.toFixed(1).replace(/\.0$/, '') + suffix;
}
