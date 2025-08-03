import gradient from 'gradient-string';
import cfonts from 'cfonts';

// 1. ANIMAZIONE MATRIX/DIGITALE
function drawMatrixRain(frame, width, height) {
  let output = '';
  const chars = ['0', '1', '◆', '◇', 'P', 'H', 'I', 'S', 'H', 'Y'];
  
  for (let y = 0; y < height; y++) {
    let line = '';
    for (let x = 0; x < width; x++) {
      // Crea colonne che scendono a velocità diverse
      const columnSpeed = (x % 7) + 1;
      const yPosition = (frame * columnSpeed) % (height + 20);
      
      if (Math.abs(y - yPosition) < 8) {
        const char = chars[Math.floor(Math.random() * chars.length)];
        const intensity = 1 - Math.abs(y - yPosition) / 8;
        
        if (intensity > 0.8) {
          line += gradient('cyan', 'white')(char);
        } else if (intensity > 0.5) {
          line += gradient('green', 'cyan')(char);
        } else {
          line += gradient('darkgreen', 'green')(char);
        }
      } else {
        line += ' ';
      }
    }
    output += line + '\n';
  }
  process.stdout.write(output);
}

// 3. ANIMAZIONE TESSELLAZIONE GEOMETRICA
function drawGeometricTessellation(frame, width, height) {
  let output = '';
  
  for (let y = 0; y < height; y++) {
    let line = '';
    for (let x = 0; x < width; x++) {
      // Crea pattern geometrici che si muovono
      const hexX = x + frame * 0.5;
      const hexY = y + frame * 0.3;
      
      const pattern1 = Math.sin(hexX * 0.2) * Math.cos(hexY * 0.2);
      const pattern2 = Math.sin((hexX + hexY) * 0.1);
      
      const combined = pattern1 + pattern2 + Math.sin(frame * 0.1);
      
      if (combined > 0.5) {
        const shapes = ['◆', '◇', '◈', '⬢', '⬡', '●', '○'];
        const shape = shapes[Math.floor(Math.abs(combined) * shapes.length) % shapes.length];
        
        if (combined > 1.2) {
          line += gradient('magenta', 'cyan')(shape);
        } else if (combined > 0.8) {
          line += gradient('cyan', 'blue')(shape);
        } else {
          line += gradient('blue', 'purple')(shape);
        }
      } else {
        line += ' ';
      }
    }
    output += line + '\n';
  }
  process.stdout.write(output);
}

// 4. ANIMAZIONE TUNNEL/WORMHOLE
function drawTunnelEffect(frame, width, height) {
  let output = '';
  const centerX = width / 2;
  const centerY = height / 2;

  for (let y = 0; y < height; y++) {
    let line = '';
    for (let x = 0; x < width; x++) {
      const dx = x - centerX;
      const dy = y - centerY;
      const distance = Math.sqrt(dx * dx + dy * dy);
      const angle = Math.atan2(dy, dx) + frame * 0.1;

      // Crea un effetto vortice che gira
      const vortex = Math.sin(distance * 0.2 - frame * 0.1) * 0.5 + 0.5;
      const intensity = 1 - Math.abs(vortex - 0.5) * 2;

      if (intensity > 0.3) {
        const chars = ['◆', '◇', '●', '○', '✦', '✧'];
        const char = chars[Math.floor((angle / (Math.PI * 2)) * chars.length) % chars.length];

        if (intensity > 0.8) {
          line += gradient('yellow', 'red')(char);
        } else if (intensity > 0.5) {
          line += gradient('orange', 'yellow')(char);
        } else {
          line += gradient('red', 'orange')(char);
        }
      } else {
        line += ' ';
      }
    }
    output += line + '\n';
  }
  process.stdout.write(output);
}

function drawGlowingText(frame) {
  const glowIntensity = Math.min(frame / 15, 1);
  const pulse = Math.sin(frame * 0.5) * 0.3 + 0.7;

  let output = '';

  const glowChars = ['░', '▒', '▓', '█'];
  const glowRadius = Math.floor(glowIntensity * 4);
  const glowWidth = 60;

  for (let i = 0; i < glowRadius; i++) {
    const char = glowChars[Math.min(i, glowChars.length - 1)];
    output += gradient('cyan', 'blue')(char.repeat(glowWidth)) + '\n';
  }

  const mainColor = pulse > 0.8 ? gradient('magenta', 'cyan') : gradient('cyan', 'blue');
  output += mainColor('◆ PHISHY ◆') + '\n';
  output += gradient('cyan', 'magenta')('◇ fckU ◇') + '\n';

  for (let i = glowRadius - 1; i >= 0; i--) {
    const char = glowChars[Math.min(i, glowChars.length - 1)];
    output += gradient('blue', 'cyan')(char.repeat(glowWidth)) + '\n';
  }

  process.stdout.write(output);
}

// FUNZIONE PER L'EFFETTO A PARTICELLE A SPIRALE
function drawBurstParticles(frame, width, height) {
  let output = '';
  const centerX = width / 2;
  const centerY = height / 2;
  const particles = [];

  // Genera particelle che si muovono in una spirale
  for (let i = 0; i < 100; i++) {
    const angle = (i / 100) * Math.PI * 2 + frame * 0.1; // Movimento a spirale
    const distance = frame * 0.2 + i * 0.5; // Distanza crescente
    const x = centerX + Math.cos(angle) * distance;
    const y = centerY + Math.sin(angle) * distance;

    if (x >= 0 && x < width && y >= 0 && y < height) {
      particles.push({ x: Math.floor(x), y: Math.floor(y) });
    }
  }

  for (let y = 0; y < height; y++) {
    let line = '';
    for (let x = 0; x < width; x++) {
      const hasParticle = particles.some(p => p.x === x && p.y === y);

      if (hasParticle) {
        const symbols = ['★', '✦', '✧', '◆', '◇', '●', '○'];
        const symbol = symbols[Math.floor(Math.random() * symbols.length)];
        line += gradient('yellow', 'red')(symbol);
      } else {
        line += ' ';
      }
    }
    output += line + '\n';
  }
  process.stdout.write(output);
}

// FUNZIONE PER L'EFFETTO GLITCH
function drawGlitchEffect(frame, width, height) {
  const targetText = 'PHISHY';
  const glitchChars = '!@#$%^&*()_+[]{}|;:,.<>?';
  const glitchProbability = 0.3; // Probability of a character being glitched

  let output = '';

  for (let y = 0; y < height; y++) {
    let line = '';
    for (let x = 0; x < width; x++) {
      if (y === Math.floor(height / 2) && x >= Math.floor((width - targetText.length) / 2) && x < Math.floor((width + targetText.length) / 2)) {
        const charIndex = x - Math.floor((width - targetText.length) / 2);
        const targetChar = targetText[charIndex];

        if (Math.random() < glitchProbability) {
          const randomChar = glitchChars[Math.floor(Math.random() * glitchChars.length)];
          line += gradient('red', 'magenta')(randomChar);
        } else {
          line += gradient('cyan', 'white')(targetChar);
        }
      } else {
        line += ' ';
      }
    }
    output += line + '\n';
  }

  process.stdout.write(output);
}

// ESEMPIO DI UTILIZZO NELLA TUA FUNZIONE PRINCIPALE:
export async function animatePhishy() {
  return new Promise((resolve) => {
    const width = process.stdout.columns || 80;
    const height = process.stdout.rows || 24;

    let frame = 0;
    const maxFrames = 100;

    const interval = setInterval(() => {
      process.stdout.write('\x1b[H\x1b[J');

      if (frame < 20) {
        drawMatrixRain(frame, width, height);
      } else if (frame < 40) {
        drawTunnelEffect(frame - 20, width, height);
      } else if (frame < 60) {
        drawBurstParticles(frame - 40, width, height);
      } else if (frame < 80) {
        drawGeometricTessellation(frame - 60, width, height);
      } else if (frame < 90) {
        drawGlowingText(frame - 80);
      } else {
        drawGlitchEffect(frame - 90, width, height);
      }

      frame++;
      if (frame >= maxFrames) {
        clearInterval(interval);
        resolve();
      }
    }, 80);
  });
}