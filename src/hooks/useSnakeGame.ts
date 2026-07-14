import { useState, useEffect, useRef, useCallback } from 'react';
import type {
  Position,
  Direction,
  GameStatus,
  SaveState,
  ActivePowerUp,
  PowerUpItem,
  PowerUpType,
} from '../types/game';
import { LEVELS, calculateStars } from '../utils/levels';
import { SKINS, ACHIEVEMENTS } from '../utils/shop';
import { soundManager } from '../utils/sound';
import { getRandomFoodPosition } from '../utils/randomFood';
import { checkWallCollision, checkSelfCollision } from '../utils/collision';

const DEFAULT_SAVE: SaveState = {
  unlockedLevel: 1,
  coins: 0,
  stars: 0,
  equippedSkin: 'classic',
  unlockedSkins: ['classic'],
  levelsProgress: {},
  unlockedAchievements: [],
  musicOn: true,
  soundOn: true,
  difficulty: 'medium',
};

function useInterval(callback: () => void, delay: number | null) {
  const savedCallback = useRef(callback);
  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);
  useEffect(() => {
    if (delay !== null) {
      const id = setInterval(() => savedCallback.current(), delay);
      return () => clearInterval(id);
    }
  }, [delay]);
}

export const useSnakeGame = () => {
  // Navigation & Global Save State
  const [status, setStatus] = useState<GameStatus>('HOME');
  const [saveState, setSaveState] = useState<SaveState>(() => {
    const saved = localStorage.getItem('snake_adventure_3d_save');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        // Ensure defaults if keys are missing
        return { ...DEFAULT_SAVE, ...parsed };
      } catch {
        return DEFAULT_SAVE;
      }
    }
    return DEFAULT_SAVE;
  });

  // Level Selection
  const [selectedLevelId, setSelectedLevelId] = useState<number>(1);
  const currentLevel = LEVELS[selectedLevelId - 1] || LEVELS[0];

  // Game Play States
  const [snake, setSnake] = useState<Position[]>([]);
  const [direction, setDirection] = useState<Direction>('UP');
  const [food, setFood] = useState<Position>({ x: 0, y: 0 });
  const [powerUpItem, setPowerUpItem] = useState<PowerUpItem | null>(null);
  const [activePowerUps, setActivePowerUps] = useState<ActivePowerUp[]>([]);
  
  // Scoring / Counters
  const [score, setScore] = useState<number>(0);
  const [fruitsEaten, setFruitsEaten] = useState<number>(0);
  const [coinsEarnedThisLevel, setCoinsEarnedThisLevel] = useState<number>(0);
  const [timeLeft, setTimeLeft] = useState<number>(0); // in seconds
  const [totalFruitsEatenSession, setTotalFruitsEatenSession] = useState<number>(0);

  // Time metrics for stars calculation
  const [timeSpent, setTimeSpent] = useState<number>(0); // in seconds

  // Controls Queues
  const directionQueueRef = useRef<Direction[]>([]);
  const lastMovedDirectionRef = useRef<Direction>('UP');
  const pulseTimerRef = useRef<number>(0);
  const [pulseTick, setPulseTick] = useState<number>(0);

  // Sound Config Sync
  useEffect(() => {
    soundManager.setSoundEnabled(saveState.soundOn);
    soundManager.setMusicEnabled(saveState.musicOn);
  }, [saveState.soundOn, saveState.musicOn]);

  // Handle Level BGM
  useEffect(() => {
    if (status === 'PLAYING') {
      soundManager.startBgm(currentLevel.theme);
    } else {
      soundManager.stopBgm();
    }
    return () => soundManager.stopBgm();
  }, [status, selectedLevelId, currentLevel.theme]);

  // Persist SaveState on changes and perform Achievement checking
  const saveProgress = useCallback((newState: SaveState) => {
    // Check achievements
    const newlyUnlockedAchievements = [...newState.unlockedAchievements];
    let coinsBonus = 0;

    ACHIEVEMENTS.forEach((ach) => {
      if (!newlyUnlockedAchievements.includes(ach.id)) {
        if (ach.check(newState, totalFruitsEatenSession)) {
          newlyUnlockedAchievements.push(ach.id);
          coinsBonus += ach.reward;
          soundManager.playPowerUp(); // Play fanfare for achievement
        }
      }
    });

    const finalState = {
      ...newState,
      coins: newState.coins + coinsBonus,
      unlockedAchievements: newlyUnlockedAchievements,
    };

    setSaveState(finalState);
    localStorage.setItem('snake_adventure_3d_save', JSON.stringify(finalState));
  }, [totalFruitsEatenSession]);

  // Sound triggers wrapper
  const playClick = useCallback(() => {
    soundManager.playClick();
  }, []);

  // Set Preferences
  const setMusicEnabled = useCallback((enabled: boolean) => {
    saveProgress({ ...saveState, musicOn: enabled });
  }, [saveState, saveProgress]);

  const setSoundEnabled = useCallback((enabled: boolean) => {
    saveProgress({ ...saveState, soundOn: enabled });
  }, [saveState, saveProgress]);

  const resetProgress = useCallback(() => {
    saveProgress(DEFAULT_SAVE);
    setSelectedLevelId(1);
    setStatus('HOME');
  }, [saveProgress]);

  // Skins Shop Purchases
  const buySkin = useCallback((skinId: string) => {
    const skin = SKINS.find((s) => s.id === skinId);
    if (!skin) return false;
    
    if (saveState.coins >= skin.cost && !saveState.unlockedSkins.includes(skinId)) {
      const updatedSkins = [...saveState.unlockedSkins, skinId];
      const updatedState: SaveState = {
        ...saveState,
        coins: saveState.coins - skin.cost,
        unlockedSkins: updatedSkins,
        equippedSkin: skinId,
      };
      saveProgress(updatedState);
      soundManager.playVictory();
      return true;
    }
    return false;
  }, [saveState, saveProgress]);

  const equipSkin = useCallback((skinId: string) => {
    if (saveState.unlockedSkins.includes(skinId)) {
      saveProgress({
        ...saveState,
        equippedSkin: skinId,
      });
      soundManager.playClick();
      return true;
    }
    return false;
  }, [saveState, saveProgress]);

  // Initialize Level Variables
  const resetLevelData = useCallback(() => {
    const center = Math.floor(currentLevel.gridSize / 2);
    // Position snake in the center vertically, pointing UP
    setSnake([
      { x: center, y: center },
      { x: center, y: center + 1 },
      { x: center, y: center + 2 },
    ]);
    setDirection('UP');
    lastMovedDirectionRef.current = 'UP';
    directionQueueRef.current = [];

    // Food spawning (make sure it does not spawn on obstacles or starting snake)
    const startingSnake = [
      { x: center, y: center },
      { x: center, y: center + 1 },
      { x: center, y: center + 2 },
    ];
    const invalidPositions = [...startingSnake, ...currentLevel.obstacles];
    setFood(getRandomFoodPosition(invalidPositions, currentLevel.gridSize));

    // Reset powerups and timers
    setPowerUpItem(null);
    setActivePowerUps([]);
    setScore(0);
    setFruitsEaten(0);
    setCoinsEarnedThisLevel(0);
    setTimeSpent(0);

    if (currentLevel.objective.type === 'survive') {
      setTimeLeft(currentLevel.objective.target);
    } else if (currentLevel.timeLimit) {
      setTimeLeft(currentLevel.timeLimit);
    } else {
      setTimeLeft(0);
    }
  }, [currentLevel]);

  const startLevel = useCallback((levelId: number) => {
    setSelectedLevelId(levelId);
    setStatus('PLAYING');
    soundManager.playClick();
  }, []);

  // Quick navigation helpers
  const goHome = useCallback(() => { setStatus('HOME'); soundManager.playClick(); }, []);
  const goLevelSelect = useCallback(() => { setStatus('LEVEL_SELECT'); soundManager.playClick(); }, []);
  const goShop = useCallback(() => { setStatus('SHOP'); soundManager.playClick(); }, []);
  const goAchievements = useCallback(() => { setStatus('ACHIEVEMENTS'); soundManager.playClick(); }, []);
  const goSettings = useCallback(() => { setStatus('SETTINGS'); soundManager.playClick(); }, []);

  const pauseGame = useCallback(() => {
    if (status === 'PLAYING') {
      setStatus('PAUSED');
      soundManager.playClick();
    }
  }, [status]);

  const resumeGame = useCallback(() => {
    if (status === 'PAUSED') {
      setStatus('PLAYING');
      soundManager.playClick();
    }
  }, [status]);

  const restartLevel = useCallback(() => {
    resetLevelData();
    setStatus('PLAYING');
    soundManager.playClick();
  }, [resetLevelData]);

  // Steer Queue trigger
  const changeDirection = useCallback((newDir: Direction) => {
    const queue = directionQueueRef.current;
    const baseDirection = queue.length > 0 ? queue[queue.length - 1] : lastMovedDirectionRef.current;

    if (newDir === 'UP' && baseDirection === 'DOWN') return;
    if (newDir === 'DOWN' && baseDirection === 'UP') return;
    if (newDir === 'LEFT' && baseDirection === 'RIGHT') return;
    if (newDir === 'RIGHT' && baseDirection === 'LEFT') return;

    if (queue.length < 2) {
      queue.push(newDir);
    }
  }, []);

  // Helper: check if a powerup is active
  const hasActivePowerUp = useCallback((type: PowerUpType): boolean => {
    return activePowerUps.some((p) => p.type === type && p.durationLeft > 0);
  }, [activePowerUps]);

  // Time counting tick (every 1 second)
  useEffect(() => {
    if (status !== 'PLAYING') return;

    const timer = setInterval(() => {
      setTimeSpent((prev) => prev + 1);

      // Handle level timer decreasing (Time Attack / Survival)
      if (currentLevel.objective.type === 'survive') {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            // Victory on survival complete!
            clearInterval(timer);
            handleLevelComplete();
            return 0;
          }
          return prev - 1;
        });
      } else if (currentLevel.timeLimit) {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            // Lose if timer expires
            clearInterval(timer);
            setStatus('GAME_OVER');
            soundManager.playGameOver();
            return 0;
          }
          return prev - 1;
        });
      }

      // Tick down active power-ups durations
      setActivePowerUps((prev) =>
        prev
          .map((p) => ({ ...p, durationLeft: Math.max(0, p.durationLeft - 1000) }))
          .filter((p) => p.durationLeft > 0)
      );
    }, 1000);

    return () => clearInterval(timer);
  }, [status, currentLevel, activePowerUps]);

  // Floating/animation ticks for canvas render objects (runs at 60fps)
  useEffect(() => {
    let frameId: number;
    const tickPulse = () => {
      pulseTimerRef.current += 1;
      setPulseTick(pulseTimerRef.current);
      frameId = requestAnimationFrame(tickPulse);
    };
    frameId = requestAnimationFrame(tickPulse);
    return () => cancelAnimationFrame(frameId);
  }, []);

  // Level Completion Win Handler
  const handleLevelComplete = () => {
    soundManager.playVictory();
    setStatus('VICTORY');

    const calculatedCoins = currentLevel.coinReward + coinsEarnedThisLevel;
    const finalStars = calculateStars(currentLevel, score, timeSpent);
    
    // Read previous records
    const previousRecord = saveState.levelsProgress[currentLevel.id];
    const prevBestStars = previousRecord ? previousRecord.stars : 0;
    const prevHighScore = previousRecord ? previousRecord.highScore : 0;

    const currentLevelProgress = {
      levelId: currentLevel.id,
      completed: true,
      stars: Math.max(prevBestStars, finalStars),
      highScore: Math.max(prevHighScore, score),
    };

    // Calculate total delta stars for save
    const starDelta = Math.max(0, currentLevelProgress.stars - prevBestStars);

    const updatedProgress = {
      ...saveState.levelsProgress,
      [currentLevel.id]: currentLevelProgress,
    };

    // Level progression
    const nextLevelId = currentLevel.id + 1;
    const unlockedLevel = Math.max(saveState.unlockedLevel, nextLevelId);

    const updatedState: SaveState = {
      ...saveState,
      unlockedLevel,
      coins: saveState.coins + calculatedCoins,
      stars: saveState.stars + starDelta,
      levelsProgress: updatedProgress,
    };

    setTotalFruitsEatenSession((prev) => prev + fruitsEaten);
    saveProgress(updatedState);
  };

  // Main Steer loop tick
  const gameTick = useCallback(() => {
    if (status !== 'PLAYING') return;

    // Pull queued key direction
    const nextDir = directionQueueRef.current.shift() || direction;
    if (nextDir !== direction) {
      setDirection(nextDir);
    }
    lastMovedDirectionRef.current = nextDir;

    setSnake((prevSnake) => {
      if (prevSnake.length === 0) return prevSnake;

      const head = prevSnake[0];
      const newHead = { x: head.x, y: head.y };

      // Apply slow motion modifier (makes movement speed slower but ticks still operate)
      switch (nextDir) {
        case 'UP':
          newHead.y -= 1;
          break;
        case 'DOWN':
          newHead.y += 1;
          break;
        case 'LEFT':
          newHead.x -= 1;
          break;
        case 'RIGHT':
          newHead.x += 1;
          break;
      }

      // Check Shield protection or die on Wall collision
      if (checkWallCollision(newHead, currentLevel.gridSize)) {
        if (hasActivePowerUp('SHIELD')) {
          setActivePowerUps((prev) => prev.filter((p) => p.type !== 'SHIELD'));
          soundManager.playPowerUp(); // play shield shatter sound
          return prevSnake; // Ignore step
        }
        setStatus('GAME_OVER');
        soundManager.playGameOver();
        return prevSnake;
      }

      // Obstacle collision check
      const hitsObstacle = currentLevel.obstacles.some(
        (obs) => obs.x === newHead.x && obs.y === newHead.y
      );
      if (hitsObstacle) {
        if (hasActivePowerUp('SHIELD')) {
          setActivePowerUps((prev) => prev.filter((p) => p.type !== 'SHIELD'));
          soundManager.playPowerUp();
          return prevSnake;
        }
        setStatus('GAME_OVER');
        soundManager.playGameOver();
        return prevSnake;
      }

      // Self-collision (excluding tail if it's about to slide away)
      const eatsFood = newHead.x === food.x && newHead.y === food.y;
      const eatsPowerUp = powerUpItem && newHead.x === powerUpItem.position.x && newHead.y === powerUpItem.position.y;
      
      const collisionBody = (eatsFood || eatsPowerUp) ? prevSnake : prevSnake.slice(0, -1);
      if (checkSelfCollision(newHead, collisionBody)) {
        if (hasActivePowerUp('SHIELD')) {
          setActivePowerUps((prev) => prev.filter((p) => p.type !== 'SHIELD'));
          soundManager.playPowerUp();
          return prevSnake;
        }
        setStatus('GAME_OVER');
        soundManager.playGameOver();
        return prevSnake;
      }

      const newSnake = [newHead, ...prevSnake];

      // Handle Powerup item ingestion
      if (eatsPowerUp && powerUpItem) {
        soundManager.playPowerUp();
        
        // Add or stack active powerup
        setActivePowerUps((prev) => {
          const filtered = prev.filter((p) => p.type !== powerUpItem.type);
          return [
            ...filtered,
            { type: powerUpItem.type, durationLeft: 8000, maxDuration: 8000 },
          ];
        });

        setPowerUpItem(null);
      }

      // Handle Food ingestion
      if (eatsFood) {
        soundManager.playEat();
        
        const isDouble = hasActivePowerUp('DOUBLE_SCORE');
        const multiplier = isDouble ? 2 : 1;

        const points = 10 * multiplier;
        const coinsEarned = 1 * multiplier;

        setScore((prev) => prev + points);
        setFruitsEaten((prev) => {
          const nextCount = prev + 1;
          
          // Check level victory criteria for fruit hunts
          if (
            (currentLevel.objective.type === 'eat_fruits' ||
              currentLevel.objective.type === 'beat_timer') &&
            nextCount >= currentLevel.objective.target
          ) {
            handleLevelComplete();
          }
          return nextCount;
        });

        setCoinsEarnedThisLevel((prev) => prev + coinsEarned);

        // Spawn next food, avoiding snake body, obstacles, and active powerups
        const invalidPositions = [...newSnake, ...currentLevel.obstacles];
        if (powerUpItem) {
          invalidPositions.push(powerUpItem.position);
        }
        setFood(getRandomFoodPosition(invalidPositions, currentLevel.gridSize));

        // Procedural Powerup spawning (6% chance on food eaten if no powerup is on screen)
        if (!powerUpItem && Math.random() < 0.08) {
          const powerUpTypes: PowerUpType[] = ['SPEED', 'SHIELD', 'MAGNET', 'SLOW_MO', 'DOUBLE_SCORE'];
          const randType = powerUpTypes[Math.floor(Math.random() * powerUpTypes.length)];
          
          // Generate coordinate avoiding body, obstacles, and new food
          const foodPos = getRandomFoodPosition([...newSnake, ...currentLevel.obstacles, food], currentLevel.gridSize);
          setPowerUpItem({
            position: foodPos,
            type: randType,
            pulseTimer: 0,
          });
        }
      } else {
        // Normal slide, pop tail segment
        newSnake.pop();
      }

      // Magnet pull simulation: moves food closer if within 3 cells
      if (hasActivePowerUp('MAGNET')) {
        const headSeg = newSnake[0];
        const dist = Math.abs(headSeg.x - food.x) + Math.abs(headSeg.y - food.y);
        
        if (dist > 0 && dist <= 3) {
          // Calculate movement step towards head
          const dx = Math.sign(headSeg.x - food.x);
          const dy = Math.sign(headSeg.y - food.y);
          
          const nextFoodPos = {
            x: food.x + (dx !== 0 ? dx : 0),
            y: food.y + (dx === 0 && dy !== 0 ? dy : 0),
          };
          
          // Check that target pull location does not overlay walls/obstacles
          const overlapsObstacle = currentLevel.obstacles.some(
            (o) => o.x === nextFoodPos.x && o.y === nextFoodPos.y
          );
          if (!overlapsObstacle) {
            setFood(nextFoodPos);
          }
        }
      }

      return newSnake;
    });
  }, [status, direction, food, powerUpItem, activePowerUps, currentLevel, saveState, fruitsEaten, score, timeSpent, coinsEarnedThisLevel]);

  // Calculate speed delay interval based on power-ups
  const getGameLoopInterval = (): number | null => {
    if (status !== 'PLAYING') return null;

    let delay = currentLevel.speed; // e.g. 170ms to 60ms
    if (hasActivePowerUp('SLOW_MO')) {
      delay *= 1.7; // Slow down movement
    }
    if (hasActivePowerUp('SPEED')) {
      delay *= 0.65; // Speed up movement
    }
    return delay;
  };

  useInterval(gameTick, getGameLoopInterval());

  // Trigger loading level data on entrance to active session
  useEffect(() => {
    if (status === 'PLAYING') {
      resetLevelData();
    }
  }, [status, selectedLevelId, resetLevelData]);

  return {
    // states
    status,
    saveState,
    selectedLevelId,
    currentLevel,
    snake,
    direction,
    food,
    powerUpItem,
    activePowerUps,
    score,
    fruitsEaten,
    coinsEarnedThisLevel,
    timeLeft,
    timeSpent,
    pulseTick,
    
    // state handlers
    buySkin,
    equipSkin,
    startLevel,
    pauseGame,
    resumeGame,
    restartLevel,
    changeDirection,
    goHome,
    goLevelSelect,
    goShop,
    goAchievements,
    goSettings,
    setMusicEnabled,
    setSoundEnabled,
    resetProgress,
    playClick,
  };
};
export type UseSnakeGameType = ReturnType<typeof useSnakeGame>;
