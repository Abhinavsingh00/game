import type { Position } from '../types/game';

/**
 * Checks if the snake's head has hit any grid boundaries (walls).
 *
 * @param head The position of the snake's head segment.
 * @param gridSize The width/height of the square grid.
 * @returns True if a boundary collision occurs, false otherwise.
 */
export const checkWallCollision = (head: Position, gridSize: number): boolean => {
  return (
    head.x < 0 ||
    head.x >= gridSize ||
    head.y < 0 ||
    head.y >= gridSize
  );
};

/**
 * Checks if the snake's head has collided with any of its body segments.
 *
 * @param head The position of the snake's head segment.
 * @param body The remaining segments of the snake (excluding the head).
 * @returns True if self-collision occurs, false otherwise.
 */
export const checkSelfCollision = (head: Position, body: Position[]): boolean => {
  return body.some((segment) => segment.x === head.x && segment.y === head.y);
};
export default { checkWallCollision, checkSelfCollision };
