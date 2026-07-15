import type { LevelConfig, LevelTheme, Position } from '../types/game';

// Themes matching level progress
const THEMES: LevelTheme[] = [
  'meadow',   // Levels 1-5
  'stone',    // Levels 6-10
  'desert',   // Levels 11-15
  'snow',     // Levels 16-20
  'forest',   // Levels 21-25
  'jungle',   // Levels 26-30
  'volcano',  // Levels 31-35
  'lava',     // Levels 36-40
  'crystal',  // Levels 41-45
  'cosmic',   // Levels 46-50
];

const FOOD_TYPES: LevelConfig['foodType'][] = [
  'apple',
  'orange',
  'banana',
  'cherry',
  'watermelon',
  'grapes',
  'golden_apple',
  'diamond_fruit',
];

const LEVEL_NAMES = [
  'Whispering Grass', 'Pebble Path', 'Stone Sentinel', 'Sandy Dunes', 'Frosty Flakes',
  'Woodland Walk', 'Orchard Trail', 'Magma Chamber', 'Lava River', 'Crystal Cave',
  'Emerald glade', 'Boulder Bash', 'Cobble Corner', 'Sahara Winds', 'Glacier Peak',
  'Mossy Hollow', 'Dense Canopy', 'Cinder Crater', 'Basalt Flow', 'Amethyst Mine',
  'Meadow Breeze', 'Monolith Ruins', 'Gravel Gorge', 'Desert Oasis', 'Ice Arch',
  'Canopy Shadow', 'Tropic Rainforest', 'Volcanic Vents', 'Magma Abyss', 'Quartz Cavern',
  'Pasture Green', 'Ancient Pillars', 'Rock Ridge', 'Mirage Valley', 'Frozen Tundra',
  'Deep Woods', 'Jungle Temple', 'Fume Fissures', 'Lava Sea', 'Prismatic Caves',
  'Verdant Fields', 'Ruins Portal', 'Stony Ravine', 'Dust Bowl', 'Snowmelt Pass',
  'Dark Forest', 'Lost Safari', 'Supernova Core', 'Lava Cascade', 'Cosmic Horizon'
];

/**
 * Procedurally generates obstacle coordinates based on the level ID and theme.
 */
function generateObstacles(levelId: number, theme: LevelTheme, gridSize: number): Position[] {
  const obstacles: Position[] = [];
  const center = Math.floor(gridSize / 2);

  switch (theme) {
    case 'stone':
      // 4 Pillars in corners
      const dist = 4;
      obstacles.push({ x: dist, y: dist });
      obstacles.push({ x: gridSize - 1 - dist, y: dist });
      obstacles.push({ x: dist, y: gridSize - 1 - dist });
      obstacles.push({ x: gridSize - 1 - dist, y: gridSize - 1 - dist });
      break;

    case 'desert':
      // Diagonal lines of sand piles in corners
      for (let i = 1; i <= 3; i++) {
        obstacles.push({ x: i, y: i });
        obstacles.push({ x: gridSize - 1 - i, y: gridSize - 1 - i });
      }
      break;

    case 'snow':
      // A small square block in the center
      obstacles.push({ x: center - 1, y: center - 1 });
      obstacles.push({ x: center, y: center - 1 });
      obstacles.push({ x: center - 1, y: center });
      obstacles.push({ x: center, y: center });
      break;

    case 'forest':
      // Scattered tree trunks (procedural but deterministic)
      const seed1 = levelId * 17;
      for (let i = 0; i < 4 + (levelId % 3); i++) {
        const x = 3 + ((seed1 + i * 7) % (gridSize - 6));
        const y = 3 + ((seed1 + i * 13) % (gridSize - 6));
        // Avoid center starting point
        if (Math.abs(x - center) > 2 || Math.abs(y - center) > 2) {
          obstacles.push({ x, y });
        }
      }
      break;

    case 'jungle':
      // Corner walls / L-shapes
      obstacles.push({ x: 2, y: 2 }, { x: 2, y: 3 }, { x: 3, y: 2 });
      obstacles.push({ x: gridSize - 3, y: 2 }, { x: gridSize - 3, y: 3 }, { x: gridSize - 4, y: 2 });
      obstacles.push({ x: 2, y: gridSize - 3 }, { x: 2, y: gridSize - 4 }, { x: 3, y: gridSize - 3 });
      obstacles.push({ x: gridSize - 3, y: gridSize - 3 }, { x: gridSize - 3, y: gridSize - 4 }, { x: gridSize - 4, y: gridSize - 3 });
      break;

    case 'volcano':
      // Rhythmic magma lines on the borders
      for (let i = 4; i < gridSize - 4; i += 2) {
        obstacles.push({ x: i, y: 2 });
        obstacles.push({ x: i, y: gridSize - 3 });
      }
      break;

    case 'lava':
      // A split divider with gaps (horizontal or vertical depending on levelId)
      const isHorizontal = levelId % 2 === 0;
      for (let i = 2; i < gridSize - 2; i++) {
        if (Math.abs(i - center) > 2) {
          if (isHorizontal) {
            obstacles.push({ x: i, y: center });
          } else {
            obstacles.push({ x: center, y: i });
          }
        }
      }
      break;

    case 'crystal':
      // Maze corners
      for (let i = 3; i < 8; i++) {
        obstacles.push({ x: i, y: 3 });
        obstacles.push({ x: 3, y: i });
        obstacles.push({ x: gridSize - 1 - i, y: gridSize - 4 });
        obstacles.push({ x: gridSize - 4, y: gridSize - 1 - i });
      }
      break;

    case 'cosmic':
      // Outer barrier ring (gated borders)
      for (let i = 4; i < gridSize - 4; i++) {
        if (i !== center) {
          obstacles.push({ x: 1, y: i });
          obstacles.push({ x: gridSize - 2, y: i });
          obstacles.push({ x: i, y: 1 });
          obstacles.push({ x: i, y: gridSize - 2 });
        }
      }
      break;

    case 'meadow':
    default:
      // Level 1-5 has no obstacles for tutorial purposes
      break;
  }

  // Deduplicate and filter out coordinates too close to snake start (grid center x=8..12, y=8..12)
  return obstacles.filter(
    (obs, index, self) =>
      self.findIndex((o) => o.x === obs.x && o.y === obs.y) === index &&
      (Math.abs(obs.x - center) > 3 || Math.abs(obs.y - center) > 3)
  );
}

/**
 * Generate the 50 level array.
 */
export const LEVELS: LevelConfig[] = Array.from({ length: 50 }, (_, index) => {
  const id = index + 1;
  const themeIndex = Math.floor((id - 1) / 5);
  const theme = THEMES[themeIndex] || 'cosmic';

  // Sizing changes: 16x16 (early), 20x20 (mid), 24x24 (late)
  let gridSize = 16;
  if (id > 15) gridSize = 20;
  if (id > 35) gridSize = 24;

  // Speed: starts at 250ms, caps at 60ms (decreasing interval = faster game)
  const speed = Math.max(60, 250 - (id - 1) * 3.5);

  // Procedural food cycling
  const foodType = FOOD_TYPES[(id - 1) % FOOD_TYPES.length];

  // Procedural objectives
  let type: LevelConfig['objective']['type'] = 'eat_fruits';
  let target = 10 + (id - 1) * 2; // e.g., Level 1: 10, Level 50: 108
  let timeLimit: number | undefined;

  if (id % 3 === 0) {
    type = 'beat_timer';
    target = 8 + Math.floor(id * 1.2);
    timeLimit = Math.max(25, 60 - Math.floor(id * 0.5)); // starts at 60s, goes down to 25s
  } else if (id % 5 === 0) {
    type = 'survive';
    target = 30 + id; // Survive for N seconds
  }

  let desc = '';
  switch (type) {
    case 'eat_fruits':
      desc = `Eat ${target} ${foodType}s to win!`;
      break;
    case 'beat_timer':
      desc = `Eat ${target} ${foodType}s in under ${timeLimit} seconds!`;
      break;
    case 'survive':
      desc = `Survive for ${target} seconds while avoiding obstacles!`;
      break;
  }

  return {
    id,
    name: LEVEL_NAMES[index] || `Level ${id}`,
    theme,
    gridSize,
    speed,
    obstacles: generateObstacles(id, theme, gridSize),
    objective: {
      type,
      target,
      description: desc,
    },
    timeLimit,
    foodType,
    coinReward: 50 + id * 10, // Level 1: 60, Level 50: 550
  };
});

/**
 * Returns rating stars based on level performance:
 * - 3 Stars: completed with minimal length / within 65% of time limit
 * - 2 Stars: completed with moderate performance
 * - 1 Star: completed level successfully
 */
export const calculateStars = (level: LevelConfig, _score: number, timeSpent: number): number => {
  if (level.objective.type === 'beat_timer' && level.timeLimit) {
    const ratio = timeSpent / level.timeLimit;
    if (ratio < 0.5) return 3;
    if (ratio < 0.8) return 2;
    return 1;
  }

  // For general score targets, reward based on steps or efficiency. Since we don't track steps closely,
  // we can reward 3 stars for completing the level in a speedy time relative to score.
  const timePerFruit = timeSpent / (level.objective.target || 1);
  if (timePerFruit < 1.2) return 3;
  if (timePerFruit < 2.0) return 2;
  return 1;
};
