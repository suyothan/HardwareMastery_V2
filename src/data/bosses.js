export const BOSSES = [
  {
    id: 'analog_overlord',
    name: 'The Analog Overlord',
    domain: 'Analog Foundation',
    hp: 800,
    difficulty: 2,
    icon: '\uD83D\uDC79',
    color1: '#3498db',
    color2: '#2980b9',
    description: 'Master of voltage dividers and op-amp circuits. Frequency waves crackle around him.',
    weakness: 'Power Electronics',
  },
  {
    id: 'pcb_demon',
    name: 'PCB Demon Lord',
    domain: 'PCB Design',
    hp: 900,
    difficulty: 3,
    icon: '\uD83D\uDC7F',
    color1: '#2ecc71',
    color2: '#27ae60',
    description: 'A traced entity of corrupted green circuits. Ground loops are his weapon.',
    weakness: 'Signal Integrity',
  },
  {
    id: 'power_tyrant',
    name: 'Power Tyrant',
    domain: 'Power Electronics',
    hp: 850,
    difficulty: 3,
    icon: '\uD83D\uDCAB',
    color1: '#f4a623',
    color2: '#e67e22',
    description: 'Massive switching converter form. His ripple voltage shakes your output caps.',
    weakness: 'Control Theory',
  },
  {
    id: 'digital_phantom',
    name: 'Digital Phantom',
    domain: 'Digital Electronics',
    hp: 750,
    difficulty: 2,
    icon: '\uD83D\uDC7B',
    color1: '#9b59b6',
    color2: '#8e44ad',
    description: 'Glitching dark figure of binary corruption. Setup time violations are his specialty.',
    weakness: 'Analog Foundation',
  },
  {
    id: 'the_oscillator',
    name: 'The Oscillator',
    domain: 'Oscillators & Timers',
    hp: 700,
    difficulty: 2,
    icon: '\uD83D\uDD2E',
    color1: '#00d4ff',
    color2: '#0099cc',
    description: 'A pure wave entity with a sinusoidal body. Resonance is his domain.',
    weakness: 'Damping & Filtering',
  },
  {
    id: 'silicon_void',
    name: 'Silicon Void',
    domain: 'All Domains',
    hp: 1500,
    difficulty: 3,
    icon: '\uD83E\uDEAC',
    color1: '#e74c3c',
    color2: '#c0392b',
    description: 'The final legendary boss. A corrupted silhouette of pure silicon darkness.',
    weakness: 'Everything you have',
  },
];

export const getRandomBosses = (count = 3, excludeIds = []) => {
  const available = BOSSES.filter(b => !excludeIds.includes(b.id));
  const shuffled = [...available].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
};

export const getBossById = (id) => BOSSES.find(b => b.id === id);
