import React from 'react';

interface ScoreBoardProps {
  score: number;
  highScore: number;
  speed: number;
}

export const ScoreBoard: React.FC<ScoreBoardProps> = React.memo(({ score, highScore, speed }) => {
  // Compute speed level: starts at level 1 and increases every 50 points (5 foods)
  const speedLevel = Math.floor(score / 50) + 1;

  return (
    <div className="scoreboard-container">
      <div className="score-card glass-card">
        <span className="card-label">SCORE</span>
        <span className="card-value neon-green-text">{score}</span>
      </div>
      <div className="score-card glass-card">
        <span className="card-label">BEST</span>
        <span className="card-value neon-purple-text">{highScore}</span>
      </div>
      <div className="score-card glass-card">
        <span className="card-label">SPEED</span>
        <span className="card-value neon-blue-text">
          Lv.{speedLevel} <span className="speed-detail">({speed}ms)</span>
        </span>
      </div>
    </div>
  );
});

ScoreBoard.displayName = 'ScoreBoard';
export default ScoreBoard;
