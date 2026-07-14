import React from 'react';
import { RotateCcw, Home } from 'lucide-react';

interface GameOverProps {
  score: number;
  coinsEarned: number;
  restartLevel: () => void;
  goHome: () => void;
}

export const GameOver: React.FC<GameOverProps> = ({ score, coinsEarned, restartLevel, goHome }) => {
  return (
    <div className="overlay-container">
      <div className="popup-card glass-card border-red">
        <h2 className="game-over-title">GAME OVER</h2>
        
        <div className="stats-box">
          <div className="stat">
            <span>Score</span>
            <strong>{score}</strong>
          </div>
          <div className="stat">
            <span>Coins Collected</span>
            <strong className="text-gold">+{coinsEarned}</strong>
          </div>
        </div>

        <div className="popup-actions">
          <button className="modal-btn primary" onClick={restartLevel}>
            <RotateCcw size={20} /> Retry Level
          </button>
          <button className="modal-btn secondary" onClick={goHome}>
            <Home size={20} /> Home
          </button>
        </div>
      </div>
    </div>
  );
};
export default GameOver;
