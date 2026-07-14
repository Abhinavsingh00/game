import React from 'react';
import type { LevelConfig, ActivePowerUp } from '../types/game';
import { Pause, Music, Volume2, VolumeX, Shield, Zap, Sparkles } from 'lucide-react';

interface HeaderProps {
  level: LevelConfig;
  score: number;
  fruitsEaten: number;
  timeLeft: number;
  activePowerUps: ActivePowerUp[];
  musicOn: boolean;
  soundOn: boolean;
  setMusicEnabled: (enabled: boolean) => void;
  setSoundEnabled: (enabled: boolean) => void;
  pauseGame: () => void;
}

export const Header: React.FC<HeaderProps> = React.memo(
  ({
    level,
    score,
    fruitsEaten,
    timeLeft,
    activePowerUps,
    musicOn,
    soundOn,
    setMusicEnabled,
    setSoundEnabled,
    pauseGame,
  }) => {
    // Helper to render power-up icon
    const getPowerUpIcon = (type: string) => {
      switch (type) {
        case 'SHIELD':
          return <Shield className="powerup-icon text-emerald-400" size={16} />;
        case 'SPEED':
          return <Zap className="powerup-icon text-orange-400" size={16} />;
        default:
          return <Sparkles className="powerup-icon text-yellow-400" size={16} />;
      }
    };

    return (
      <header className="game-screen-header glass-card">
        {/* Left side: Level details */}
        <div className="header-meta">
          <span className="level-badge">Lvl {level.id}</span>
          <h2 className="level-title-text">{level.name}</h2>
        </div>

        {/* Center: Objective display */}
        <div className="header-objective">
          <div className="objective-progress-box">
            <span className="objective-label">Goal:</span>
            {level.objective.type === 'eat_fruits' && (
              <span className="objective-value">
                🍎 {fruitsEaten} / {level.objective.target}
              </span>
            )}
            {level.objective.type === 'beat_timer' && (
              <span className="objective-value">
                ⏳ {fruitsEaten} / {level.objective.target}
              </span>
            )}
            {level.objective.type === 'survive' && (
              <span className="objective-value">🛡️ Survive!</span>
            )}
          </div>

          {/* Time Limit Indicator */}
          {(level.timeLimit || level.objective.type === 'survive') && (
            <div className={`timer-box ${timeLeft <= 10 ? 'timer-warning' : ''}`}>
              <span className="timer-label">Time:</span>
              <span className="timer-value">{timeLeft}s</span>
            </div>
          )}
        </div>

        {/* Active Powerups Bar */}
        {activePowerUps.length > 0 && (
          <div className="active-powerups-container">
            {activePowerUps.map((p) => (
              <div key={p.type} className="active-powerup-badge glass-card">
                {getPowerUpIcon(p.type)}
                <span className="powerup-label">{p.type}</span>
                <div className="powerup-progress-bar">
                  <div
                    className="powerup-progress-fill"
                    style={{ width: `${(p.durationLeft / p.maxDuration) * 100}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Right side: Actions / Stats */}
        <div className="header-stats-actions">
          <div className="header-score">
            <span className="score-label">Score</span>
            <span className="score-val">{score}</span>
          </div>

          <div className="control-toggles">
            <button
              className={`toggle-btn ${musicOn ? 'active' : ''}`}
              onClick={() => setMusicEnabled(!musicOn)}
              title="Toggle Music"
            >
              <Music size={18} />
            </button>
            <button
              className={`toggle-btn ${soundOn ? 'active' : ''}`}
              onClick={() => setSoundEnabled(!soundOn)}
              title="Toggle Sound"
            >
              {soundOn ? <Volume2 size={18} /> : <VolumeX size={18} />}
            </button>
            <button className="pause-btn" onClick={pauseGame} title="Pause Game">
              <Pause size={18} />
            </button>
          </div>
        </div>
      </header>
    );
  }
);

Header.displayName = 'Header';
export default Header;
