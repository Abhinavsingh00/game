import type { Position, Direction } from '../types/game';

export const GRID_SIZE = 20;

export const INITIAL_SPEED = 150; // Milliseconds per tick
export const SPEED_DECREMENT = 12; // Decrease interval in ms every 5 foods eaten
export const MIN_SPEED = 50; // Cap speed interval at 50ms (faster would be unplayable)

export const INITIAL_SNAKE: Position[] = [
  { x: 10, y: 10 }, // Head (facing UP)
  { x: 10, y: 11 }, // Body
  { x: 10, y: 12 }, // Tail
];

export const INITIAL_DIRECTION: Direction = 'UP';

export const FOOD_SCORE = 10;
