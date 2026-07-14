import React from 'react';
import type { Direction } from '../types/game';

interface CellProps {
  isSnake: boolean;
  isHead: boolean;
  isFood: boolean;
  direction: Direction;
}

export const Cell: React.FC<CellProps> = React.memo(({ isSnake, isHead, isFood, direction }) => {
  let className = 'cell';

  if (isHead) {
    className += ` snake-head head-${direction.toLowerCase()}`;
  } else if (isSnake) {
    className += ' snake-body';
  } else if (isFood) {
    className += ' food';
  } else {
    className += ' empty';
  }

  return (
    <div className={className}>
      {isHead && (
        <div className="eyes-container">
          <span className="eye"></span>
          <span className="eye"></span>
        </div>
      )}
      {isFood && <div className="food-glow"></div>}
    </div>
  );
});

Cell.displayName = 'Cell';
export default Cell;
