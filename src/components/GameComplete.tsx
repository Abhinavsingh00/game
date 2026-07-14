import React from 'react';
import { Play, Home, Star } from 'lucide-react';

interface GameCompleteProps {
  score: number;
  coinsEarned: number;
  levelId: number;
  totalLevels: number;
  stars: number;
  startLevel: (id: number) => void;
  goHome: () => void;
}

export const GameComplete: React.FC<GameCompleteProps> = ({ score, coinsEarned, levelId, totalLevels, stars, startLevel, goHome }) => {
  return (
    <div className="overlay-container victory">
      <div className="popup-card glass-card border-emerald">
        <h2 className="victory-title">LEVEL CLEARED!</h2>
        
        <div className="victory-stars">
          {[1, 2, 3].map((s) => (
            <Star 
              key={s} 
              size={56} 
              className={`star-icon ${s <= stars ? 'star-earned' : 'star-empty'}`} 
              fill={s <= stars ? 'currentColor' : 'none'} 
              strokeWidth={s <= stars ? 0 : 1.5} 
            />
          ))}
        </div>

        <div className="stats-box">
          <div className="stat">
            <span>Score</span>
            <strong>{score}</strong>
          </div>
          <div className="stat">
            <span>Bonus Coins</span>
            <strong className="text-gold">+{coinsEarned}</strong>
          </div>
        </div>
        
        <div className="popup-actions">
          {levelId < totalLevels && (
            <button className="modal-btn primary" onClick={() => startLevel(levelId + 1)}>
              Next Level <Play size={20} fill="currentColor" />
            </button>
          )}
          <button className="modal-btn secondary" onClick={goHome}>
            <Home size={20} /> Menu
          </button>
        </div>
      </div>
    </div>
  );
};
export default GameComplete;
