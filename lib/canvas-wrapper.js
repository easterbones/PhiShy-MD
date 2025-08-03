/**
 * Canvas Wrapper con fallback per compatibilità multi-piattaforma
 * Gestisce gli errori di caricamento di canvas su sistemi non compatibili
 */

let canvas = null;
let canvasAvailable = false;

try {
  // Tenta di importare canvas
  const canvasModule = await import('canvas');
  canvas = canvasModule.default || canvasModule;
  canvasAvailable = true;
  console.log('✅ Canvas caricato con successo');
} catch (error) {
  console.warn('⚠️  Canvas non disponibile:', error.message);
  console.warn('ℹ️  Alcune funzionalità grafiche non saranno disponibili');
  
  // Fallback: crea oggetti mock per evitare errori
  canvas = {
    createCanvas: () => {
      throw new Error('Canvas non disponibile su questo sistema. Installa le dipendenze grafiche o usa un sistema compatibile.');
    },
    loadImage: () => {
      throw new Error('Canvas non disponibile su questo sistema. Installa le dipendenze grafiche o usa un sistema compatibile.');
    },
    registerFont: () => {
      console.warn('registerFont non disponibile - Canvas non caricato');
    }
  };
}

/**
 * Verifica se canvas è disponibile
 * @returns {boolean}
 */
export function isCanvasAvailable() {
  return canvasAvailable;
}

/**
 * Crea un canvas solo se disponibile
 * @param {number} width 
 * @param {number} height 
 * @returns {Canvas|null}
 */
export function createCanvasSafe(width, height) {
  if (!canvasAvailable) {
    console.warn('Canvas non disponibile - operazione saltata');
    return null;
  }
  return canvas.createCanvas(width, height);
}

/**
 * Carica un'immagine solo se canvas è disponibile
 * @param {string|Buffer} source 
 * @returns {Promise<Image|null>}
 */
export async function loadImageSafe(source) {
  if (!canvasAvailable) {
    console.warn('Canvas non disponibile - operazione saltata');
    return null;
  }
  return canvas.loadImage(source);
}

/**
 * Registra un font solo se canvas è disponibile
 * @param {string} path 
 * @param {object} options 
 */
export function registerFontSafe(path, options) {
  if (!canvasAvailable) {
    console.warn('Canvas non disponibile - font non registrato');
    return;
  }
  return canvas.registerFont(path, options);
}

export { canvas };
export default canvas;
