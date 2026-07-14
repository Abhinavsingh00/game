import React from 'react';
import type { Direction } from '../types/game';
import { ChevronUp, ChevronDown, ChevronLeft, ChevronRight } from 'lucide-react';

interface ControlsProps {
  changeDirection: (dir: Direction) => void;
  status: string;
}

export const Controls: React.FC<ControlsProps> = React.memo(({ changeDirection, status }) => {
  if (status !== 'PLAYING') return null;

  return (
    <div className="controls-container">
      <div className="d-pad glass-card">
        <button className="d-pad-btn up" onClick={() => changeDirection('UP')}><ChevronUp size={32} /></button>
        <div className="d-pad-middle">
          <button className="d-pad-btn left" onClick={() => changeDirection('LEFT')}><ChevronLeft size={32} /></button>
          <div className="d-pad-center"></div>
          <button className="d-pad-btn right" onClick={() => changeDirection('RIGHT')}><ChevronRight size={32} /></button>
        </div>
        <button className="d-pad-btn down" onClick={() => changeDirection('DOWN')}><ChevronDown size={32} /></button>
      </div>
    </div>
  );
});

Controls.displayName = 'Controls';
export default Controls;
