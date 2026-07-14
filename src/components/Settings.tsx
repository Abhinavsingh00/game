import React from 'react';
import type { SaveState } from '../types/game';
import { ArrowLeft, Volume2, Music, Trash2 } from 'lucide-react';

interface SettingsProps {
  saveState: SaveState;
  setMusicEnabled: (e: boolean) => void;
  setSoundEnabled: (e: boolean) => void;
  resetProgress: () => void;
  goHome: () => void;
}

export const Settings: React.FC<SettingsProps> = ({ saveState, setMusicEnabled, setSoundEnabled, resetProgress, goHome }) => {
  return (
    <div className="screen-container max-w-sm">
      <div className="screen-header glass-card">
        <button className="back-btn" onClick={goHome}><ArrowLeft size={18} /> Back</button>
        <h2>Settings</h2>
        <div style={{width: 60}}></div>
      </div>
      
      <div className="settings-panel glass-card">
        <div className="setting-row">
          <div className="setting-info">
            <Music size={24} className="icon-blue" /> <span>Music</span>
          </div>
          <button className={`toggle-btn ${saveState.musicOn ? 'active' : ''}`} onClick={() => setMusicEnabled(!saveState.musicOn)}>
            {saveState.musicOn ? 'ON' : 'OFF'}
          </button>
        </div>
        
        <div className="setting-row">
          <div className="setting-info">
            <Volume2 size={24} className="icon-orange" /> <span>Sound FX</span>
          </div>
          <button className={`toggle-btn ${saveState.soundOn ? 'active' : ''}`} onClick={() => setSoundEnabled(!saveState.soundOn)}>
            {saveState.soundOn ? 'ON' : 'OFF'}
          </button>
        </div>

        <div className="divider"></div>

        <div className="setting-row">
          <button className="danger-btn" onClick={() => {
            if (window.confirm('Are you sure you want to reset all your progress? This cannot be undone!')) {
              resetProgress();
            }
          }}>
            <Trash2 size={20} /> Reset All Progress
          </button>
        </div>
      </div>
    </div>
  );
};
export default Settings;
