import type { Position } from '../types/game';

/**
 * Generates a random coordinate (x, y) on the grid and ensures
 * that it does not overlap with any part of the snake's body or obstacles.
 */
export const getRandomFoodPosition = (invalidPositions: Position[], gridSize: number): Position => {
  let newFoodPosition: Position | null = null;
  let isOccupied = true;
  let attempts = 0;
  const maxAttempts = gridSize * gridSize;

  while (isOccupied && attempts < maxAttempts) {
    const candidate: Position = {
      x: Math.floor(Math.random() * gridSize),
      y: Math.floor(Math.random() * gridSize),
    };

    // Check if the candidate overlaps with any snake segment or obstacle
    const overlaps = invalidPositions.some(
      (pos) => pos.x === candidate.x && pos.y === candidate.y
    );

    if (!overlaps) {
      newFoodPosition = candidate;
      isOccupied = false;
    }
    attempts++;
  }

  // Fallback in case of a full grid or unexpected edge case
  return newFoodPosition || { x: Math.floor(gridSize / 2), y: Math.floor(gridSize / 2) };
};
