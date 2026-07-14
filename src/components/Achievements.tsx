import React from 'react';
import type { SaveState } from '../types/game';
import { ACHIEVEMENTS } from '../utils/shop';
import { ArrowLeft, Trophy, CheckCircle2 } from 'lucide-react';

interface AchievementsProps {
  saveState: SaveState;
  goHome: () => void;
}

export const Achievements: React.FC<AchievementsProps> = ({ saveState, goHome }) => {
  return (
    <div className="screen-container">
      <div className="screen-header glass-card">
        <button className="back-btn" onClick={goHome}><ArrowLeft size={18} /> Back</button>
        <h2>Achievements</h2>
        <div className="trophy-badge"><Trophy size={18} /> {saveState.unlockedAchievements.length} / {ACHIEVEMENTS.length}</div>
      </div>
      
      <div className="achievements-list">
        {ACHIEVEMENTS.map((ach) => {
          const isUnlocked = saveState.unlockedAchievements.includes(ach.id);
          return (
            <div key={ach.id} className={`achievement-card glass-card ${isUnlocked ? 'unlocked' : 'locked'}`}>
              <div className="ach-icon">{isUnlocked ? <CheckCircle2 className="icon-emerald" size={28} /> : <Trophy className="icon-gray" size={28} />}</div>
              <div className="ach-info">
                <h3>{ach.title}</h3>
                <p>{ach.description}</p>
              </div>
              <div className="ach-reward">
                +{ach.reward} Coins
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
export default Achievements;
