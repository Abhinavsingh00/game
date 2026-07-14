import type { Position, LevelTheme, SkinConfig, PowerUpType } from '../types/game';

/**
 * Draws the background grid and terrain details based on the level theme.
 */
export const drawThemeBackground = (
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  gridSize: number,
  theme: LevelTheme
) => {
  const cellSize = width / gridSize;

  // Set base background color
  switch (theme) {
    case 'meadow':
      ctx.fillStyle = '#064e3b'; // Deep grass green
      ctx.fillRect(0, 0, width, height);
      // Subtle grass textures
      ctx.fillStyle = '#047857';
      for (let i = 0; i < gridSize; i++) {
        for (let j = 0; j < gridSize; j++) {
          if ((i + j) % 2 === 0) {
            ctx.fillRect(i * cellSize, j * cellSize, cellSize, cellSize);
          }
        }
      }
      break;

    case 'stone':
      ctx.fillStyle = '#1f2937'; // Dark stone grey
      ctx.fillRect(0, 0, width, height);
      // Cobble texture
      ctx.strokeStyle = '#374151';
      ctx.lineWidth = 1;
      for (let i = 0; i <= gridSize; i++) {
        ctx.beginPath();
        ctx.moveTo(i * cellSize, 0);
        ctx.lineTo(i * cellSize, height);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(0, i * cellSize);
        ctx.lineTo(width, i * cellSize);
        ctx.stroke();
      }
      break;

    case 'desert':
      ctx.fillStyle = '#78350f'; // Sandy orange-brown
      ctx.fillRect(0, 0, width, height);
      // Sand ripple patterns
      ctx.fillStyle = '#b45309';
      for (let i = 0; i < gridSize; i++) {
        for (let j = 0; j < gridSize; j++) {
          if ((i + j) % 3 === 0) {
            ctx.fillRect(i * cellSize + 2, j * cellSize + 2, cellSize - 4, cellSize - 4);
          }
        }
      }
      break;

    case 'snow':
      ctx.fillStyle = '#0f172a'; // Deep slate
      ctx.fillRect(0, 0, width, height);
      // Ice sheet grids
      ctx.strokeStyle = 'rgba(147, 197, 253, 0.15)';
      ctx.lineWidth = 2;
      for (let i = 0; i <= gridSize; i++) {
        ctx.beginPath();
        ctx.moveTo(i * cellSize, 0);
        ctx.lineTo(i * cellSize, height);
        ctx.stroke();
      }
      ctx.fillStyle = 'rgba(255, 255, 255, 0.03)';
      for (let i = 0; i < gridSize; i++) {
        for (let j = 0; j < gridSize; j++) {
          if ((i + j) % 2 === 1) {
            ctx.fillRect(i * cellSize, j * cellSize, cellSize, cellSize);
          }
        }
      }
      break;

    case 'forest':
      ctx.fillStyle = '#14532d'; // Deep forest green
      ctx.fillRect(0, 0, width, height);
      // Moss spots
      ctx.fillStyle = '#166534';
      ctx.beginPath();
      for (let i = 0; i < gridSize; i += 2) {
        ctx.rect(i * cellSize, ((i * 3) % gridSize) * cellSize, cellSize * 1.5, cellSize);
      }
      ctx.fill();
      break;

    case 'jungle':
      ctx.fillStyle = '#022c22'; // Swamp green
      ctx.fillRect(0, 0, width, height);
      // Leaf textures
      ctx.fillStyle = '#065f46';
      for (let i = 0; i < gridSize; i++) {
        for (let j = 0; j < gridSize; j++) {
          if ((i * j) % 4 === 1) {
            ctx.fillRect(i * cellSize + 1, j * cellSize + 1, cellSize - 2, cellSize - 2);
          }
        }
      }
      break;

    case 'volcano':
      ctx.fillStyle = '#1c1917'; // Ash dark grey
      ctx.fillRect(0, 0, width, height);
      // Lava cracks
      ctx.fillStyle = '#7c2d12';
      for (let i = 0; i < gridSize; i++) {
        if (i % 3 === 0) {
          ctx.fillRect(i * cellSize, 0, cellSize * 0.4, height);
          ctx.fillRect(0, i * cellSize, width, cellSize * 0.4);
        }
      }
      break;

    case 'lava':
      ctx.fillStyle = '#0c0a09'; // Pitch black ash
      ctx.fillRect(0, 0, width, height);
      // Flowing lava canals
      ctx.fillStyle = '#9a3412';
      for (let i = 0; i < gridSize; i++) {
        for (let j = 0; j < gridSize; j++) {
          if ((i + j) % 5 === 0) {
            ctx.fillRect(i * cellSize, j * cellSize, cellSize, cellSize);
          }
        }
      }
      break;

    case 'crystal':
      ctx.fillStyle = '#1e1b4b'; // Midnight indigo
      ctx.fillRect(0, 0, width, height);
      // Crystal sparkles
      ctx.fillStyle = '#311042';
      for (let i = 0; i < gridSize; i++) {
        for (let j = 0; j < gridSize; j++) {
          if ((i * 7 + j * 13) % 8 === 0) {
            ctx.fillRect(i * cellSize, j * cellSize, cellSize, cellSize);
          }
        }
      }
      break;

    case 'cosmic':
      ctx.fillStyle = '#020617'; // Cosmic void black
      ctx.fillRect(0, 0, width, height);
      // Star particles (static layout based on coordinates)
      ctx.fillStyle = '#ffffff';
      for (let i = 0; i < gridSize; i++) {
        for (let j = 0; j < gridSize; j++) {
          const val = (i * 31 + j * 47) % 100;
          if (val === 7) {
            ctx.beginPath();
            ctx.arc((i + 0.5) * cellSize, (j + 0.5) * cellSize, 1.5, 0, Math.PI * 2);
            ctx.fill();
          }
        }
      }
      break;
  }
};

/**
 * Draws obstacles matching the level theme.
 */
export const drawObstacle = (
  ctx: CanvasRenderingContext2D,
  pos: Position,
  cellSize: number,
  theme: LevelTheme
) => {
  const x = pos.x * cellSize;
  const y = pos.y * cellSize;
  const margin = 2;
  const size = cellSize - margin * 2;

  ctx.save();
  ctx.shadowColor = 'black';
  ctx.shadowBlur = 6;
  ctx.shadowOffsetY = 3;

  switch (theme) {
    case 'stone':
    case 'jungle':
      // Stone boulder
      const stoneGrad = ctx.createRadialGradient(
        x + size / 3,
        y + size / 3,
        2,
        x + size / 2,
        y + size / 2,
        size / 2
      );
      stoneGrad.addColorStop(0, '#9ca3af');
      stoneGrad.addColorStop(0.7, '#4b5563');
      stoneGrad.addColorStop(1, '#1f2937');
      ctx.fillStyle = stoneGrad;
      ctx.beginPath();
      ctx.arc(x + cellSize / 2, y + cellSize / 2, size / 2, 0, Math.PI * 2);
      ctx.fill();
      // Stone cracks
      ctx.strokeStyle = '#111827';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(x + 4, y + 4);
      ctx.lineTo(x + size - 4, y + size - 4);
      ctx.moveTo(x + size - 4, y + 4);
      ctx.lineTo(x + 4, y + size - 4);
      ctx.stroke();
      break;

    case 'desert':
      // Sandstone pyramid obstacle
      ctx.fillStyle = '#d97706';
      ctx.strokeStyle = '#78350f';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(x + cellSize / 2, y + margin);
      ctx.lineTo(x + margin, y + cellSize - margin);
      ctx.lineTo(x + cellSize - margin, y + cellSize - margin);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
      break;

    case 'snow':
      // Ice Block
      const iceGrad = ctx.createLinearGradient(x, y, x + size, y + size);
      iceGrad.addColorStop(0, '#c0f0fc');
      iceGrad.addColorStop(0.5, '#7dd3fc');
      iceGrad.addColorStop(1, '#0284c7');
      ctx.fillStyle = iceGrad;
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 1;
      ctx.fillRect(x + margin, y + margin, size, size);
      ctx.strokeRect(x + margin, y + margin, size, size);
      break;

    case 'volcano':
    case 'lava':
      // Molten Obsidian
      ctx.fillStyle = '#1c1917';
      ctx.fillRect(x + margin, y + margin, size, size);
      // Glowing core
      ctx.fillStyle = '#ea580c';
      ctx.beginPath();
      ctx.arc(x + cellSize / 2, y + cellSize / 2, size / 3, 0, Math.PI * 2);
      ctx.fill();
      break;

    case 'crystal':
      // Glowing crystal prism
      const cryGrad = ctx.createLinearGradient(x, y, x + size, y + size);
      cryGrad.addColorStop(0, '#f472b6');
      cryGrad.addColorStop(1, '#6366f1');
      ctx.fillStyle = cryGrad;
      ctx.beginPath();
      ctx.moveTo(x + cellSize / 2, y + margin);
      ctx.lineTo(x + cellSize - margin, y + cellSize / 2);
      ctx.lineTo(x + cellSize / 2, y + cellSize - margin);
      ctx.lineTo(x + margin, y + cellSize / 2);
      ctx.closePath();
      ctx.fill();
      break;

    case 'cosmic':
      // Black hole portal obstacle
      ctx.fillStyle = '#000000';
      ctx.strokeStyle = '#a855f7';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.arc(x + cellSize / 2, y + cellSize / 2, size / 2.2, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      break;

    default:
      // Basic wall block
      ctx.fillStyle = '#374151';
      ctx.fillRect(x + margin, y + margin, size, size);
  }
  ctx.restore();
};

/**
 * Draws a realistic fruit with 3D gradients and shading.
 */
export const drawFruit = (
  ctx: CanvasRenderingContext2D,
  pos: Position,
  cellSize: number,
  type: string,
  pulseTimer: number
) => {
  // Center coordinates of the cell
  const cx = (pos.x + 0.5) * cellSize;
  // Apply visual float animation
  const floatOffset = Math.sin(pulseTimer / 8) * 3;
  const cy = (pos.y + 0.5) * cellSize + floatOffset;

  // Pulse scaling
  const scale = 0.85 + Math.sin(pulseTimer / 4) * 0.07;
  const radius = (cellSize / 2) * scale;

  ctx.save();
  ctx.shadowColor = 'rgba(0, 0, 0, 0.4)';
  ctx.shadowBlur = 8;
  ctx.shadowOffsetY = 6;

  switch (type) {
    case 'apple':
      // Red Apple
      const appleGrad = ctx.createRadialGradient(
        cx - radius / 3,
        cy - radius / 3,
        2,
        cx,
        cy,
        radius
      );
      appleGrad.addColorStop(0, '#fca5a5');
      appleGrad.addColorStop(0.3, '#ef4444');
      appleGrad.addColorStop(1, '#991b1b');
      ctx.fillStyle = appleGrad;
      
      // Draw double lobes of apple
      ctx.beginPath();
      ctx.arc(cx - radius / 4, cy, radius * 0.95, 0, Math.PI * 2);
      ctx.arc(cx + radius / 4, cy, radius * 0.95, 0, Math.PI * 2);
      ctx.fill();

      // Stem & Leaf
      ctx.strokeStyle = '#78350f';
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.moveTo(cx, cy - radius * 0.8);
      ctx.quadraticCurveTo(cx + 4, cy - radius * 1.3, cx + 8, cy - radius * 1.2);
      ctx.stroke();

      // Leaf
      ctx.fillStyle = '#22c55e';
      ctx.beginPath();
      ctx.ellipse(cx + 6, cy - radius * 1.2, 5, 2.5, Math.PI / 4, 0, Math.PI * 2);
      ctx.fill();
      break;

    case 'orange':
      // Orange
      const orangeGrad = ctx.createRadialGradient(
        cx - radius / 3,
        cy - radius / 3,
        2,
        cx,
        cy,
        radius
      );
      orangeGrad.addColorStop(0, '#fde047');
      orangeGrad.addColorStop(0.4, '#f97316');
      orangeGrad.addColorStop(1, '#ea580c');
      ctx.fillStyle = orangeGrad;
      ctx.beginPath();
      ctx.arc(cx, cy, radius, 0, Math.PI * 2);
      ctx.fill();

      // Dimple dot on top
      ctx.fillStyle = '#7c2d12';
      ctx.beginPath();
      ctx.arc(cx, cy - radius + 2, 2, 0, Math.PI * 2);
      ctx.fill();
      break;

    case 'banana':
      // Yellow curved banana
      ctx.fillStyle = '#facc15';
      ctx.strokeStyle = '#854d0e';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.arc(cx, cy + radius * 0.3, radius, Math.PI * 1.15, Math.PI * 1.85);
      ctx.quadraticCurveTo(cx, cy - radius * 0.3, cx - radius * 0.8, cy - radius * 0.4);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
      break;

    case 'cherry':
      // Twin Cherries
      const drawSingleCherry = (x: number, y: number, r: number) => {
        const cherryGrad = ctx.createRadialGradient(x - r / 3, y - r / 3, 1, x, y, r);
        cherryGrad.addColorStop(0, '#fda4af');
        cherryGrad.addColorStop(0.3, '#f43f5e');
        cherryGrad.addColorStop(1, '#9f1239');
        ctx.fillStyle = cherryGrad;
        ctx.beginPath();
        ctx.arc(x, y, r, 0, Math.PI * 2);
        ctx.fill();
      };

      const cRadius = radius * 0.65;
      drawSingleCherry(cx - cRadius * 0.8, cy + cRadius * 0.4, cRadius);
      drawSingleCherry(cx + cRadius * 0.8, cy + cRadius * 0.6, cRadius);

      // Stems
      ctx.strokeStyle = '#4d7c0f';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(cx - cRadius * 0.8, cy);
      ctx.quadraticCurveTo(cx - 2, cy - cRadius * 1.5, cx, cy - cRadius * 1.8);
      ctx.moveTo(cx + cRadius * 0.8, cy);
      ctx.quadraticCurveTo(cx + 2, cy - cRadius * 1.5, cx, cy - cRadius * 1.8);
      ctx.stroke();
      break;

    case 'watermelon':
      // Slice of Watermelon
      ctx.save();
      // Outer green rind
      ctx.fillStyle = '#15803d';
      ctx.beginPath();
      ctx.arc(cx, cy - radius * 0.3, radius, 0, Math.PI);
      ctx.closePath();
      ctx.fill();

      // White inner rind
      ctx.fillStyle = '#f8fafc';
      ctx.beginPath();
      ctx.arc(cx, cy - radius * 0.3, radius * 0.85, 0, Math.PI);
      ctx.closePath();
      ctx.fill();

      // Red pulp
      ctx.fillStyle = '#f43f5e';
      ctx.beginPath();
      ctx.arc(cx, cy - radius * 0.3, radius * 0.75, 0, Math.PI);
      ctx.closePath();
      ctx.fill();

      // Black seeds
      ctx.fillStyle = '#000000';
      ctx.beginPath();
      ctx.arc(cx - radius * 0.3, cy + radius * 0.1, 1.5, 0, Math.PI * 2);
      ctx.arc(cx + radius * 0.3, cy + radius * 0.1, 1.5, 0, Math.PI * 2);
      ctx.arc(cx, cy + radius * 0.3, 1.5, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
      break;

    case 'grapes':
      // Grapes bunch
      const grapeR = radius * 0.35;
      const drawGrape = (gx: number, gy: number) => {
        const grapeGrad = ctx.createRadialGradient(gx - grapeR/3, gy - grapeR/3, 1, gx, gy, grapeR);
        grapeGrad.addColorStop(0, '#c084fc');
        grapeGrad.addColorStop(1, '#6b21a8');
        ctx.fillStyle = grapeGrad;
        ctx.beginPath();
        ctx.arc(gx, gy, grapeR, 0, Math.PI * 2);
        ctx.fill();
      };
      
      // Pile grape circles
      drawGrape(cx - grapeR * 0.7, cy - grapeR);
      drawGrape(cx + grapeR * 0.7, cy - grapeR);
      drawGrape(cx, cy - grapeR);
      drawGrape(cx - grapeR * 0.4, cy);
      drawGrape(cx + grapeR * 0.4, cy);
      drawGrape(cx, cy + grapeR);
      break;

    case 'golden_apple':
      // Shiny Gold Apple with sparkles
      const goldGrad = ctx.createRadialGradient(
        cx - radius / 3,
        cy - radius / 3,
        2,
        cx,
        cy,
        radius
      );
      goldGrad.addColorStop(0, '#fffbeb');
      goldGrad.addColorStop(0.3, '#fbbf24');
      goldGrad.addColorStop(1, '#b45309');
      ctx.fillStyle = goldGrad;
      
      ctx.beginPath();
      ctx.arc(cx - radius / 4, cy, radius * 0.95, 0, Math.PI * 2);
      ctx.arc(cx + radius / 4, cy, radius * 0.95, 0, Math.PI * 2);
      ctx.fill();

      // Stem
      ctx.strokeStyle = '#d97706';
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.moveTo(cx, cy - radius * 0.8);
      ctx.quadraticCurveTo(cx + 4, cy - radius * 1.3, cx + 8, cy - radius * 1.2);
      ctx.stroke();

      // Sparkles
      ctx.fillStyle = '#ffffff';
      if (Math.floor(pulseTimer / 3) % 2 === 0) {
        ctx.beginPath();
        ctx.arc(cx - radius * 0.7, cy - radius * 0.5, 2, 0, Math.PI * 2);
        ctx.arc(cx + radius * 0.8, cy + radius * 0.4, 2, 0, Math.PI * 2);
        ctx.fill();
      }
      break;

    case 'diamond_fruit':
      // Cyan Glowing Diamond Prismatic Fruit
      const diaGrad = ctx.createRadialGradient(
        cx - radius / 3,
        cy - radius / 3,
        2,
        cx,
        cy,
        radius
      );
      diaGrad.addColorStop(0, '#e0f7fa');
      diaGrad.addColorStop(0.5, '#26c6da');
      diaGrad.addColorStop(1, '#006064');
      ctx.fillStyle = diaGrad;

      ctx.beginPath();
      ctx.moveTo(cx, cy - radius);
      ctx.lineTo(cx + radius * 0.9, cy);
      ctx.lineTo(cx, cy + radius);
      ctx.lineTo(cx - radius * 0.9, cy);
      ctx.closePath();
      ctx.fill();

      // Specular shine highlights
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.6)';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(cx, cy - radius + 3);
      ctx.lineTo(cx - radius * 0.6, cy);
      ctx.stroke();
      break;
  }
  ctx.restore();
};

/**
 * Draws a power-up item with specific icon layout and duration circular timers.
 */
export const drawPowerUp = (
  ctx: CanvasRenderingContext2D,
  pos: Position,
  cellSize: number,
  type: PowerUpType,
  pulseTimer: number
) => {
  const cx = (pos.x + 0.5) * cellSize;
  const floatOffset = Math.sin(pulseTimer / 6) * 4;
  const cy = (pos.y + 0.5) * cellSize + floatOffset;
  const radius = (cellSize / 2.2) * (0.9 + Math.sin(pulseTimer / 3) * 0.08);

  ctx.save();
  ctx.shadowColor = 'black';
  ctx.shadowBlur = 8;

  // Background glow
  let glowColor = 'rgba(59, 130, 246, 0.4)';
  let iconText = '⚡';
  switch (type) {
    case 'SPEED':
      glowColor = 'rgba(249, 115, 22, 0.4)'; // Orange
      iconText = '⚡';
      break;
    case 'SHIELD':
      glowColor = 'rgba(16, 185, 129, 0.4)'; // Green
      iconText = '🛡️';
      break;
    case 'MAGNET':
      glowColor = 'rgba(168, 85, 247, 0.4)'; // Purple
      iconText = '🧲';
      break;
    case 'SLOW_MO':
      glowColor = 'rgba(6, 182, 212, 0.4)'; // Cyan
      iconText = '⏱️';
      break;
    case 'DOUBLE_SCORE':
      glowColor = 'rgba(234, 179, 8, 0.4)'; // Yellow
      iconText = '2x';
      break;
  }

  // Outer glowing ring
  ctx.strokeStyle = glowColor.replace('0.4', '0.8');
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.arc(cx, cy, radius, 0, Math.PI * 2);
  ctx.stroke();

  // Translucent center fill
  ctx.fillStyle = glowColor;
  ctx.beginPath();
  ctx.arc(cx, cy, radius - 2, 0, Math.PI * 2);
  ctx.fill();

  // Draw power-up identifier symbol/text
  ctx.fillStyle = '#ffffff';
  ctx.font = `bold ${Math.floor(cellSize * 0.45)}px sans-serif`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(iconText, cx, cy);

  ctx.restore();
};

/**
 * Draws the curved snake body segments with specific patterns and shading.
 */
export const drawSnake = (
  ctx: CanvasRenderingContext2D,
  snake: Position[],
  direction: string,
  cellSize: number,
  skin: SkinConfig,
  time: number
) => {
  const head = snake[0];
  const body = snake.slice(1);
  const halfCell = cellSize / 2;

  ctx.save();
  // Draw shadows
  ctx.shadowColor = 'rgba(0, 0, 0, 0.5)';
  ctx.shadowBlur = 10;
  ctx.shadowOffsetY = 6;

  // 1. Draw Body Segments with curves
  body.forEach((seg, idx) => {
    const cx = seg.x * cellSize + halfCell;
    const cy = seg.y * cellSize + halfCell;
    const radius = halfCell * 0.85;

    ctx.save();
    // 3D Sphere gradient
    const grad = ctx.createRadialGradient(
      cx - radius / 3,
      cy - radius / 3,
      1,
      cx,
      cy,
      radius
    );
    grad.addColorStop(0, skin.colorHead);
    grad.addColorStop(0.7, skin.colorBody);
    grad.addColorStop(1, '#000000');
    ctx.fillStyle = grad;

    ctx.beginPath();
    ctx.arc(cx, cy, radius, 0, Math.PI * 2);
    ctx.fill();

    // Draw skin specific overlays/patterns
    switch (skin.pattern) {
      case 'stripes':
        // Zebra stripes or warning lines
        ctx.strokeStyle = 'rgba(0,0,0,0.3)';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(cx - radius * 0.7, cy - radius * 0.2);
        ctx.lineTo(cx + radius * 0.7, cy + radius * 0.2);
        ctx.moveTo(cx - radius * 0.2, cy - radius * 0.7);
        ctx.lineTo(cx + radius * 0.2, cy + radius * 0.7);
        ctx.stroke();
        break;

      case 'dragon':
        // Spiky diamonds on body
        ctx.fillStyle = '#f43f5e';
        ctx.beginPath();
        ctx.moveTo(cx, cy - radius * 0.8);
        ctx.lineTo(cx + radius * 0.4, cy);
        ctx.lineTo(cx, cy + radius * 0.8);
        ctx.lineTo(cx - radius * 0.4, cy);
        ctx.closePath();
        ctx.fill();
        break;

      case 'ice':
        // Frozen sparkles
        ctx.fillStyle = 'rgba(255, 255, 255, 0.25)';
        ctx.beginPath();
        ctx.arc(cx - radius * 0.4, cy + radius * 0.3, 1.5, 0, Math.PI * 2);
        ctx.arc(cx + radius * 0.3, cy - radius * 0.4, 2, 0, Math.PI * 2);
        ctx.fill();
        break;

      case 'fire':
        // Molten embers
        ctx.fillStyle = '#f97316';
        ctx.beginPath();
        ctx.arc(cx + Math.sin(time + idx) * 3, cy + Math.cos(time + idx) * 3, 2.5, 0, Math.PI * 2);
        ctx.fill();
        break;

      case 'galaxy':
        // Tiny stars
        ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
        ctx.fillRect(cx - radius * 0.5, cy - radius * 0.5, 1.5, 1.5);
        ctx.fillRect(cx + radius * 0.4, cy + radius * 0.2, 1.5, 1.5);
        break;

      case 'metallic':
        // High reflections (white diagonal shine)
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(cx - radius * 0.5, cy - radius * 0.3);
        ctx.quadraticCurveTo(cx, cy, cx + radius * 0.3, cy + radius * 0.5);
        ctx.stroke();
        break;
      
      case 'shadow':
        // Fading opacity overlay
        ctx.fillStyle = 'rgba(0,0,0,0.5)';
        ctx.beginPath();
        ctx.arc(cx, cy, radius * 0.9, 0, Math.PI*2);
        ctx.fill();
        break;
    }
    ctx.restore();
  });

  // 2. Draw Snake Head
  const hx = head.x * cellSize + halfCell;
  const hy = head.y * cellSize + halfCell;
  const hRadius = halfCell * 0.95;

  ctx.save();
  const headGrad = ctx.createRadialGradient(
    hx - hRadius / 3,
    hy - hRadius / 3,
    1,
    hx,
    hy,
    hRadius
  );
  headGrad.addColorStop(0, skin.colorHead);
  headGrad.addColorStop(0.8, skin.colorBody);
  headGrad.addColorStop(1, '#052e16');
  ctx.fillStyle = headGrad;

  // Draw slightly oval head segment
  ctx.beginPath();
  ctx.arc(hx, hy, hRadius, 0, Math.PI * 2);
  ctx.fill();

  // Glow aura for elemental skins
  if (skin.glowColor) {
    ctx.strokeStyle = skin.glowColor;
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(hx, hy, hRadius + 2, 0, Math.PI * 2);
    ctx.stroke();
  }

  // 3. Draw Eyes looking in steering direction
  let angle = 0; // Angle facing

  switch (direction) {
    case 'UP':
      angle = -Math.PI / 2;
      break;
    case 'DOWN':
      angle = Math.PI / 2;
      break;
    case 'LEFT':
      angle = Math.PI;
      break;
    case 'RIGHT':
      angle = 0;
      break;
  }

  const drawEye = (ex: number, ey: number) => {
    // White eyeball
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(ex, ey, 4.5, 0, Math.PI * 2);
    ctx.fill();

    // Pupil looking forward
    ctx.fillStyle = skin.pattern === 'dragon' ? '#ef4444' : '#000000';
    ctx.beginPath();
    let pdx = 0;
    let pdy = 0;
    if (direction === 'UP') pdy = -1.5;
    if (direction === 'DOWN') pdy = 1.5;
    if (direction === 'LEFT') pdx = -1.5;
    if (direction === 'RIGHT') pdx = 1.5;
    ctx.arc(ex + pdx, ey + pdy, 2.2, 0, Math.PI * 2);
    ctx.fill();
  };

  // Place left and right eyes perpendicular to heading direction
  ctx.save();
  ctx.translate(hx, hy);
  ctx.rotate(angle);
  
  // Perpendicular eye offset positions relative to local heading
  drawEye(hRadius * 0.35, -hRadius * 0.35);
  drawEye(hRadius * 0.35, hRadius * 0.35);

  // 4. Draw Animated Darting red tongue
  const tongueTimer = Math.floor(time / 2) % 4;
  if (tongueTimer === 1 || tongueTimer === 2) {
    ctx.strokeStyle = '#ef4444';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.moveTo(hRadius * 0.9, 0);
    ctx.lineTo(hRadius * 1.4, 0);
    // Forked tips
    ctx.moveTo(hRadius * 1.4, 0);
    ctx.lineTo(hRadius * 1.55, -3);
    ctx.moveTo(hRadius * 1.4, 0);
    ctx.lineTo(hRadius * 1.55, 3);
    ctx.stroke();
  }
  ctx.restore();

  ctx.restore();
};
export default { drawThemeBackground, drawObstacle, drawFruit, drawPowerUp, drawSnake };
