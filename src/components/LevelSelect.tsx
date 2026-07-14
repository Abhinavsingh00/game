import React from 'react';
import type { SaveState } from '../types/game';
import { LEVELS } from '../utils/levels';
import { Lock, Star, ArrowLeft } from 'lucide-react';

interface LevelSelectProps {
  saveState: SaveState;
  startLevel: (id: number) => void;
  goHome: () => void;
}

export const LevelSelect: React.FC<LevelSelectProps> = ({ saveState, startLevel, goHome }) => {
  return (
    <div className="screen-container">
      <div className="screen-header glass-card">
        <button className="back-btn" onClick={goHome}><ArrowLeft size={18} /> Back</button>
        <h2>Select Level</h2>
        <div className="stars-badge"><Star size={16} fill="currentColor" /> {saveState.stars}</div>
      </div>
      
      <div className="levels-grid">
        {LEVELS.map((level) => {
          const isUnlocked = level.id <= saveState.unlockedLevel;
          const progress = saveState.levelsProgress[level.id];
          const starsEarned = progress ? progress.stars : 0;
          
          return (
            <div key={level.id} className={`level-card glass-card ${isUnlocked ? 'unlocked' : 'locked'}`} onClick={() => isUnlocked && startLevel(level.id)}>
              <div className="level-card-header">
                <span className="level-id">{level.id}</span>
                {!isUnlocked && <Lock className="lock-icon" size={16} />}
              </div>
              <h3 className="level-name">{level.name}</h3>
              {isUnlocked && (
                <div className="level-stars">
                  {[1, 2, 3].map((star) => (
                    <Star key={star} size={14} className={star <= starsEarned ? 'star-earned' : 'star-empty'} fill={star <= starsEarned ? 'currentColor' : 'none'} />
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
export default LevelSelect;
