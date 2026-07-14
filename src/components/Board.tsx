import React, { useRef, useEffect } from 'react';
import type { Position, LevelTheme, PowerUpItem, ActivePowerUp } from '../types/game';
import { drawThemeBackground, drawObstacle, drawFruit, drawPowerUp, drawSnake } from '../utils/canvas';
import { SKINS } from '../utils/shop';

interface BoardProps {
  snake: Position[];
  direction: string;
  food: Position;
  foodType: string;
  powerUpItem: PowerUpItem | null;
  obstacles: Position[];
  gridSize: number;
  theme: LevelTheme;
  equippedSkinId: string;
  pulseTick: number;
  activePowerUps: ActivePowerUp[];
}

export const Board: React.FC<BoardProps> = React.memo(
  ({
    snake,
    direction,
    food,
    foodType,
    powerUpItem,
    obstacles,
    gridSize,
    theme,
    equippedSkinId,
    pulseTick,
    activePowerUps,
  }) => {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const containerRef = useRef<HTMLDivElement | null>(null);

    // Responsive Canvas Resizing Handler
    useEffect(() => {
      const handleResize = () => {
        const canvas = canvasRef.current;
        const container = containerRef.current;
        if (!canvas || !container) return;

        // Make it square based on container width
        const size = Math.min(container.clientWidth, 600);
        canvas.width = size;
        canvas.height = size;
        
        // Redraw immediately after resize
        draw();
      };

      window.addEventListener('resize', handleResize);
      // Run once initially
      handleResize();

      return () => window.removeEventListener('resize', handleResize);
    }, [snake, direction, food, foodType, powerUpItem, obstacles, gridSize, theme, equippedSkinId, pulseTick, activePowerUps]);

    // Rendering driver loop
    const draw = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const width = canvas.width;
      const height = canvas.height;
      const cellSize = width / gridSize;

      // 1. Draw level themed background
      drawThemeBackground(ctx, width, height, gridSize, theme);

      // 2. Draw obstacles
      obstacles.forEach((obs) => {
        drawObstacle(ctx, obs, cellSize, theme);
      });

      // 3. Draw power-up items if present
      if (powerUpItem) {
        drawPowerUp(ctx, powerUpItem.position, cellSize, powerUpItem.type, pulseTick);
      }

      // 4. Draw 3D Fruit
      drawFruit(ctx, food, cellSize, foodType, pulseTick);

      // 5. Draw 3D styled Snake
      const skinConfig = SKINS.find((s) => s.id === equippedSkinId) || SKINS[0];
      drawSnake(ctx, snake, direction, cellSize, skinConfig, pulseTick);

      // 6. Draw Shield glow bubble if active
      const hasShield = activePowerUps.some((p) => p.type === 'SHIELD');
      if (hasShield && snake.length > 0) {
        const head = snake[0];
        const hx = (head.x + 0.5) * cellSize;
        const hy = (head.y + 0.5) * cellSize;
        const radius = cellSize * 0.95;

        ctx.save();
        ctx.shadowColor = '#06b6d4';
        ctx.shadowBlur = 18;
        ctx.strokeStyle = 'rgba(6, 182, 212, 0.85)';
        ctx.lineWidth = 3.5;
        
        // Inner pulse fill
        const shieldPulse = 0.15 + Math.sin(pulseTick / 3) * 0.05;
        ctx.fillStyle = `rgba(6, 182, 212, ${shieldPulse})`;

        ctx.beginPath();
        ctx.arc(hx, hy, radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
        ctx.restore();
      }
    };

    // Trigger draw whenever updates come
    useEffect(() => {
      draw();
    }, [snake, direction, food, foodType, powerUpItem, obstacles, gridSize, theme, equippedSkinId, pulseTick, activePowerUps]);

    return (
      <div className="canvas-board-container" ref={containerRef}>
        <canvas ref={canvasRef} className="game-canvas glass-card" />
      </div>
    );
  }
);

Board.displayName = 'Board';
export default Board;
