import React, { useEffect } from 'react';
import { useSnakeGame } from './hooks/useSnakeGame';
import Header from './components/Header';
import Board from './components/Board';
import Controls from './components/Controls';
import Shop from './components/Shop';
import LevelSelect from './components/LevelSelect';
import Achievements from './components/Achievements';
import Settings from './components/Settings';
import GameOver from './components/GameOver';
import GameComplete from './components/GameComplete';
import { calculateStars } from './utils/levels';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, ShoppingBag, Trophy, Settings as SettingsIcon } from 'lucide-react';
import './App.css';

const App: React.FC = () => {
  const game = useSnakeGame();

  // Keyboard Steer Controls
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (game.status === 'PLAYING') {
        switch (e.key) {
          case 'ArrowUp': case 'w': case 'W': e.preventDefault(); game.changeDirection('UP'); break;
          case 'ArrowDown': case 's': case 'S': e.preventDefault(); game.changeDirection('DOWN'); break;
          case 'ArrowLeft': case 'a': case 'A': e.preventDefault(); game.changeDirection('LEFT'); break;
          case 'ArrowRight': case 'd': case 'D': e.preventDefault(); game.changeDirection('RIGHT'); break;
          case 'Escape': case 'p': case 'P': game.pauseGame(); break;
        }
      } else if (game.status === 'PAUSED' && (e.key === 'Escape' || e.key === 'p' || e.key === 'P')) {
        game.resumeGame();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [game]);

  const pageVariants = {
    initial: { opacity: 0, scale: 0.95 },
    in: { opacity: 1, scale: 1 },
    out: { opacity: 0, scale: 1.05 }
  };

  const renderScreen = () => {
    switch (game.status) {
      case 'HOME':
        return (
          <motion.div key="home" className="home-screen" initial="initial" animate="in" exit="out" variants={pageVariants} transition={{ duration: 0.4, ease: "easeOut" }}>
            <div className="hero-logo">
              <h1 className="main-title">
                <span className="title-emoji">🐍</span>
              </h1>
              <h1 className="title-text">Snake Adventure 3D</h1>
              <p className="subtitle">50 Levels of Epic Challenges</p>
            </div>
            
            <div className="home-menu">
              <button className="menu-btn play-btn" onClick={game.goLevelSelect}>
                <Play size={28} fill="currentColor" /> Play Campaign
              </button>
              
              <div className="menu-row">
                <button className="menu-btn glass-card action-card" onClick={game.goShop}>
                  <ShoppingBag size={28} className="icon-gold" /> Skins Shop
                </button>
                <button className="menu-btn glass-card action-card" onClick={game.goAchievements}>
                  <Trophy size={28} className="icon-purple" /> Achievements
                </button>
              </div>
              
              <button className="menu-btn glass-card small-btn" onClick={game.goSettings}>
                <SettingsIcon size={20} className="icon-gray" /> Settings
              </button>
            </div>
          </motion.div>
        );
      
      case 'LEVEL_SELECT':
        return (
          <motion.div key="levels" className="full-screen" initial="initial" animate="in" exit="out" variants={pageVariants}>
            <LevelSelect saveState={game.saveState} startLevel={game.startLevel} goHome={game.goHome} />
          </motion.div>
        );

      case 'SHOP':
        return (
          <motion.div key="shop" className="full-screen" initial="initial" animate="in" exit="out" variants={pageVariants}>
            <Shop saveState={game.saveState} buySkin={game.buySkin} equipSkin={game.equipSkin} goHome={game.goHome} />
          </motion.div>
        );

      case 'ACHIEVEMENTS':
        return (
          <motion.div key="achievements" className="full-screen" initial="initial" animate="in" exit="out" variants={pageVariants}>
            <Achievements saveState={game.saveState} goHome={game.goHome} />
          </motion.div>
        );

      case 'SETTINGS':
        return (
          <motion.div key="settings" className="full-screen" initial="initial" animate="in" exit="out" variants={pageVariants}>
            <Settings saveState={game.saveState} setMusicEnabled={game.setMusicEnabled} setSoundEnabled={game.setSoundEnabled} resetProgress={game.resetProgress} goHome={game.goHome} />
          </motion.div>
        );

      case 'PLAYING':
      case 'PAUSED':
      case 'GAME_OVER':
      case 'VICTORY':
        return (
          <motion.div key="game" className="game-screen" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <Header 
              level={game.currentLevel}
              score={game.score}
              fruitsEaten={game.fruitsEaten}
              timeLeft={game.timeLeft}
              activePowerUps={game.activePowerUps}
              musicOn={game.saveState.musicOn}
              soundOn={game.saveState.soundOn}
              setMusicEnabled={game.setMusicEnabled}
              setSoundEnabled={game.setSoundEnabled}
              pauseGame={game.pauseGame}
            />
            
            <div className="board-wrapper">
              <Board 
                snake={game.snake}
                direction={game.direction}
                food={game.food}
                foodType={game.currentLevel.foodType}
                powerUpItem={game.powerUpItem}
                obstacles={game.currentLevel.obstacles}
                gridSize={game.currentLevel.gridSize}
                theme={game.currentLevel.theme}
                equippedSkinId={game.saveState.equippedSkin}
                pulseTick={game.pulseTick}
                activePowerUps={game.activePowerUps}
              />

              {game.status === 'PAUSED' && (
                <div className="overlay-container">
                  <div className="glass-card pause-modal">
                    <h2 className="pause-title">PAUSED</h2>
                    <button className="modal-btn primary" onClick={game.resumeGame}>Resume</button>
                    <button className="modal-btn secondary" onClick={game.goHome}>Exit to Menu</button>
                  </div>
                </div>
              )}
              
              {game.status === 'GAME_OVER' && (
                <GameOver score={game.score} coinsEarned={game.coinsEarnedThisLevel} restartLevel={game.restartLevel} goHome={game.goHome} />
              )}

              {game.status === 'VICTORY' && (
                <GameComplete score={game.score} coinsEarned={game.coinsEarnedThisLevel} levelId={game.selectedLevelId} totalLevels={50} stars={calculateStars(game.currentLevel, game.score, game.timeSpent)} startLevel={game.startLevel} goHome={game.goHome} />
              )}
            </div>

            <Controls changeDirection={game.changeDirection} status={game.status} />
          </motion.div>
        );
      
      default:
        return null;
    }
  };

  return (
    <div className="app-container">
      <AnimatePresence mode="wait">
        {renderScreen()}
      </AnimatePresence>
    </div>
  );
};

export default App;