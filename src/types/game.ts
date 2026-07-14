export interface Position {
  x: number;
  y: number;
}

export type Direction = 'UP' | 'DOWN' | 'LEFT' | 'RIGHT';

export type GameStatus =
  | 'HOME'
  | 'LEVEL_SELECT'
  | 'SHOP'
  | 'ACHIEVEMENTS'
  | 'SETTINGS'
  | 'PLAYING'
  | 'PAUSED'
  | 'GAME_OVER'
  | 'VICTORY';

export type LevelTheme =
  | 'meadow'
  | 'stone'
  | 'desert'
  | 'snow'
  | 'forest'
  | 'jungle'
  | 'volcano'
  | 'lava'
  | 'crystal'
  | 'cosmic';

export interface LevelObjective {
  type: 'eat_fruits' | 'beat_timer' | 'survive';
  target: number;
  description: string;
}

export interface LevelConfig {
  id: number;
  name: string;
  theme: LevelTheme;
  gridSize: number;
  speed: number;
  obstacles: Position[];
  objective: LevelObjective;
  timeLimit?: number; // In seconds
  foodType: 'apple' | 'orange' | 'banana' | 'cherry' | 'watermelon' | 'grapes' | 'golden_apple' | 'diamond_fruit';
  coinReward: number;
}

export interface SkinConfig {
  id: string;
  name: string;
  cost: number;
  description: string;
  colorHead: string;
  colorBody: string;
  glowColor: string;
  pattern: 'classic' | 'stripes' | 'dragon' | 'ice' | 'fire' | 'galaxy' | 'metallic' | 'shadow';
}

export type PowerUpType = 'SPEED' | 'SHIELD' | 'MAGNET' | 'SLOW_MO' | 'DOUBLE_SCORE';

export interface ActivePowerUp {
  type: PowerUpType;
  durationLeft: number; // in milliseconds
  maxDuration: number;
}

export interface PowerUpItem {
  position: Position;
  type: PowerUpType;
  pulseTimer: number;
}

export interface LevelProgress {
  levelId: number;
  completed: boolean;
  stars: number;
  highScore: number;
}

export interface SaveState {
  unlockedLevel: number;
  coins: number;
  stars: number;
  equippedSkin: string;
  unlockedSkins: string[];
  levelsProgress: Record<number, LevelProgress>;
  unlockedAchievements: string[];
  musicOn: boolean;
  soundOn: boolean;
  difficulty: 'easy' | 'medium' | 'hard';
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  reward: number;
  check: (state: SaveState, totalFruitsEaten: number) => boolean;
}
