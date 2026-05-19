// XP per topic by depth
export const XP_PER_DEPTH = {
  LIGHT: 10,
  MEDIUM: 25,
  DEEP: 50,
  DEEPEST: 100,
};

// Bonus XP
export const XP_NOTES_BONUS = 15;
export const XP_DAILY_CHALLENGE = 100;
export const XP_BLOCK_COMPLETE = 200;

// Coins
export const COINS_PER_TOPIC = 5;
export const COINS_BATTLE_WIN = 50;
export const COINS_DAILY_LOGIN = 10;

// Shards per battle
export const SHARDS_PER_BATTLE = 10;

// Card upgrade costs (level -> cost)
export const UPGRADE_COSTS = {
  1: { shards: 50, coins: 100 },
  2: { shards: 100, coins: 250 },
  3: { shards: 200, coins: 500 },
  4: { shards: 400, coins: 1000 },
};

// Level thresholds
export const LEVEL_THRESHOLDS = [
  { level: 1, xp: 0, title: 'Hobbyist' },
  { level: 2, xp: 500, title: 'Tinkerer' },
  { level: 3, xp: 1200, title: 'Circuit Solver' },
  { level: 4, xp: 2500, title: 'Analog Apprentice' },
  { level: 5, xp: 4500, title: 'Signal Handler' },
  { level: 6, xp: 7000, title: 'Component Master' },
  { level: 7, xp: 10000, title: 'Board Designer' },
  { level: 8, xp: 14000, title: 'Power Engineer' },
  { level: 9, xp: 19000, title: 'PCB Architect' },
  { level: 10, xp: 25000, title: 'Silicon Sage' },
  { level: 15, xp: 50000, title: 'Hardware Veteran' },
  { level: 20, xp: 100000, title: 'Silicon Master' },
];

// Get rank title for level
export const getRankTitle = (level) => {
  const threshold = [...LEVEL_THRESHOLDS].reverse().find(t => level >= t.level);
  return threshold ? threshold.title : 'Hobbyist';
};

// Get XP needed for next level
export const getXpForNextLevel = (currentLevel) => {
  const next = LEVEL_THRESHOLDS.find(t => t.level > currentLevel);
  return next ? next.xp : null;
};

// Chest types and timers (ms)
export const CHEST_TIMERS = {
  'component_box': 0,           // Free
  'prototype_chest': 3 * 3600000,  // 3 hours
  'engineers_vault': 8 * 3600000,  // 8 hours
  'master_cache': 12 * 3600000,    // 12 hours
  'silicon_chest': 24 * 3600000,   // 24 hours
};

// Chest rewards
export const CHEST_REWARDS = {
  'component_box': { xp: 50, coins: 25, shards: 20, tipCards: 0 },
  'prototype_chest': { xp: 150, coins: 75, shards: 60, tipCards: 1 },
  'engineers_vault': { xp: 400, coins: 200, shards: 150, tipCards: 2 },
  'master_cache': { xp: 800, coins: 400, shards: 300, tipCards: 0, badgeChance: true },
  'silicon_chest': { xp: 2000, coins: 1000, shards: 600, tipCards: 0, guaranteedBadge: true },
};

// Chest display info
export const CHEST_INFO = {
  'component_box': { name: 'Component Box', icon: '\u2B1C', color: '#95a5a6' },
  'prototype_chest': { name: 'Prototype Chest', icon: '\uD83E\uDDF1', color: '#795548' },
  'engineers_vault': { name: "Engineer's Vault", icon: '\uD83E\uDD49', color: '#95a5a6' },
  'master_cache': { name: 'Master Cache', icon: '\uD83E\uDD47', color: '#f4a623' },
  'silicon_chest': { name: 'Silicon Chest', icon: '\uD83D\uDC8E', color: '#00d4ff' },
};

// Battle damage
export const BASE_DAMAGE = 50;
export const DAMAGE_PER_CARD_LEVEL = 10;
export const BOSS_DAMAGE_ON_WRONG = 80;
export const BOSS_DAMAGE_ON_TIMEOUT = 60;

// Questions per battle
export const QUESTIONS_PER_BATTLE = 10;
export const SECONDS_PER_QUESTION = 30;

// Daily challenge templates
export const DAILY_CHALLENGES = [
  { text: 'Complete 3 DEEP topics', target: 3, depth: 'DEEP', reward: { xp: 100, chest: 'component_box' } },
  { text: 'Complete 5 topics of any depth', target: 5, depth: null, reward: { xp: 100, chest: 'prototype_chest' } },
  { text: 'Win 2 battles', target: 2, type: 'battle', reward: { xp: 100, chest: 'component_box' } },
  { text: 'Complete 2 MEDIUM topics', target: 2, depth: 'MEDIUM', reward: { xp: 100, chest: 'component_box' } },
  { text: 'Complete 1 DEEPEST topic', target: 1, depth: 'DEEPEST', reward: { xp: 100, chest: 'engineers_vault' } },
];

// Hardware tips for chest openings
export const HARDWARE_TIPS = [
  'A 0.1\u00B5F ceramic cap placed within 2mm of an IC\'s power pin reduces high-frequency noise by 20dB.',
  'The 7805 regulator needs at least 2V headroom to maintain regulation. Input should be 7V or higher.',
  'A 10\u00B5F electrolytic + 100nF ceramic in parallel covers both low and high frequency decoupling.',
  'SMD 0805 resistors are rated for 0.125W, while 0603 are rated for 0.1W. Always check power rating.',
  'The thermal time constant of a TO-220 package is about 1 minute. Don\'t trust instant temperature readings.',
  'Ferrite beads are inductive at low frequencies and resistive at high frequencies. They\'re lossy by design.',
  'A ground plane under a signal trace creates a controlled impedance transmission line.',
  'The voltage drop across a silicon diode decreases by about 2mV/\u00B0C. This is the basis of temperature sensing.',
  'Bypass capacitors should be placed as close as possible to the IC power pins, with short, wide traces.',
  'A 4-layer PCB with proper stackup can reduce EMI by 20dB compared to a 2-layer board.',
  'The skin effect at 100kHz in copper is about 0.2mm. Use litz wire for high-frequency inductors.',
  'When measuring with an oscilloscope, the ground clip should be as short as possible to avoid ringing.',
  'NTC thermistors have a negative temperature coefficient — resistance decreases as temperature increases.',
  'A Schottky diode has lower forward voltage (0.3V) and faster switching than a standard silicon diode.',
  'The Miller effect multiplies the effective input capacitance of an amplifier by the voltage gain.',
  'For a buck converter, the inductor ripple current should be 20-40% of the load current for good performance.',
  'USB 2.0 requires 90\u03A9 differential impedance on the D+/D- traces. Route them as a matched pair.',
  'A watchdog timer resets the MCU if the firmware hangs. Always use one in production embedded systems.',
  'The bandwidth of an op-amp decreases as gain increases. Gain-bandwidth product is constant.',
  'For EMC compliance, keep high-speed signals away from board edges. Use a continuous ground plane.',
];

export const getRandomTip = () => HARDWARE_TIPS[Math.floor(Math.random() * HARDWARE_TIPS.length)];
