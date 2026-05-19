export const CHARACTER_CARDS = [
  // STARTER
  {
    id: 'volt',
    name: 'VOLT',
    title: 'The Spark Apprentice',
    rarity: 'starter',
    domain: 'Analog Foundation basics',
    lore: 'Born from the first spark on your bench. Small but determined.',
    icon: '\u26A1',
    color1: '#3498db',
    color2: '#2980b9',
    damage: 30,
    topics: ['Current', 'Voltage', "Ohm's Law", 'Basic Circuit Analysis'],
    unlockCondition: (topics) => Object.values(topics).some(t => t.done),
    special: null,
  },

  // COMMON
  {
    id: 'ohm',
    name: 'OHM',
    title: 'The Resistor Knight',
    rarity: 'common',
    domain: 'Passive components & analysis',
    lore: 'Steady as a precision resistor. V=IR is his sword.',
    icon: '\uD83D\uDD27',
    color1: '#95a5a6',
    color2: '#7f8c8d',
    damage: 35,
    topics: ['Resistors', 'Voltage Dividers', 'Kirchhoff\'s Laws'],
    unlockCondition: (topics) => {
      const analogIds = ['1','2','3','4','5','6','7','8','9','10','60','61','62'];
      return analogIds.filter(id => topics[id]?.done).length >= 10;
    },
    special: null,
  },
  {
    id: 'capella',
    name: 'CAPELLA',
    title: 'The Filter Mage',
    rarity: 'common',
    domain: 'Capacitors, Filters, RC/RL circuits',
    lore: 'She bends frequencies to her will. High pass. Low pass. All pass.',
    icon: '\uD83C\uDF0A',
    color1: '#00d4ff',
    color2: '#0099cc',
    damage: 35,
    topics: ['Capacitors', 'Low Pass Filters', 'High Pass Filters', 'Active Filters'],
    unlockCondition: (topics) => {
      const ids = ['11', '63', '68', '69', '70'];
      return ids.every(id => topics[id]?.done);
    },
    special: null,
  },
  {
    id: 'diodex',
    name: 'DIODEX',
    title: 'The Rectifier Scout',
    rarity: 'common',
    domain: 'Diodes, Rectifiers, Zener',
    lore: 'One direction. Always. No exceptions.',
    icon: '\uD83D\uDD22',
    color1: '#e74c3c',
    color2: '#c0392b',
    damage: 35,
    topics: ['Diodes', 'Rectifiers', 'Zener Diodes', 'Schottky Diodes'],
    unlockCondition: (topics) => {
      const ids = ['14', '15', '16', '17'];
      return ids.every(id => topics[id]?.done);
    },
    special: null,
  },

  // RARE
  {
    id: 'transisto',
    name: 'TRANSISTO',
    title: 'The Switching Warrior',
    rarity: 'rare',
    domain: 'BJT, MOSFET, Transistor Switching',
    lore: 'NPN or PNP — he doesn\'t care. Saturation is his battlefield.',
    icon: '\uD83D\uDC80',
    color1: '#8e44ad',
    color2: '#6c3483',
    damage: 50,
    topics: ['Transistors (BJT)', 'MOSFETs', 'Transistor Switching'],
    unlockCondition: (topics) => {
      const ids = ['23', '24', '25'];
      return ids.every(id => topics[id]?.done);
    },
    special: null,
  },
  {
    id: 'kirchhoff',
    name: 'KIRCHHOFF',
    title: 'The Law Enforcer',
    rarity: 'rare',
    domain: 'Circuit analysis, theorems',
    lore: 'Every node. Every loop. Nothing escapes his laws.',
    icon: '\u2696\uFE0F',
    color1: '#3498db',
    color2: '#f4a623',
    damage: 50,
    topics: ["Kirchhoff's Laws", 'RC Circuits', 'RL Circuits'],
    unlockCondition: (topics) => {
      const ids = ['60', '61', '62'];
      return ids.every(id => topics[id]?.done);
    },
    special: null,
  },
  {
    id: 'amplius',
    name: 'AMPLIUS',
    title: 'The Signal Amplifier',
    rarity: 'rare',
    domain: 'Amplifiers, Op-Amps',
    lore: 'He takes your whispers and turns them into thunderclaps.',
    icon: '\uD83D\uDD0A',
    color1: '#e67e22',
    color2: '#d35400',
    damage: 50,
    topics: ['Amplifiers', 'Small Signal Amplifiers', 'Common Emitter Amplifier', 'Audio Amplifiers'],
    unlockCondition: (topics) => {
      const ids = ['26', '27', '28', '29'];
      return ids.every(id => topics[id]?.done);
    },
    special: null,
  },
  {
    id: 'timerx',
    name: 'TIMER-X',
    title: 'The 555 Assassin',
    rarity: 'rare',
    domain: 'Oscillators, timers, clocks',
    lore: 'Monostable. Astable. He\'ll time your downfall.',
    icon: '\u23F1\uFE0F',
    color1: '#f1c40f',
    color2: '#d4ac0d',
    damage: 50,
    topics: ['Oscillators', 'Crystal Oscillators', 'Clock Oscillators', '555 Timer'],
    unlockCondition: (topics) => {
      const ids = ['30', '31', '32', '33'];
      return ids.every(id => topics[id]?.done);
    },
    special: null,
  },

  // EPIC
  {
    id: 'megafet',
    name: 'MEGAFET',
    title: 'The MOSFET Overlord',
    rarity: 'epic',
    domain: 'Power Electronics, Buck/Boost, LDO',
    lore: 'Gate voltage is his command. Drain current is his army.',
    icon: '\u26A1',
    color1: '#9b59b6',
    color2: '#6c3483',
    damage: 75,
    topics: ['Buck Converter', 'Boost Converter', 'LDO vs Switching Regulator'],
    unlockCondition: (topics) => {
      const ids = ['P1', 'P2', 'P3', 'P4', 'P5', 'P6', 'P7', 'P8', 'P9', 'P10'];
      return ids.every(id => topics[id]?.done);
    },
    special: '+15% XP bonus on all power topics',
  },
  {
    id: 'pcb_phantom',
    name: 'PCB PHANTOM',
    title: 'The Layout Specter',
    rarity: 'epic',
    domain: 'PCB Design, Signal Integrity, Layout',
    lore: 'He haunts bad layouts. A floating trace is his invitation.',
    icon: '\uD83D\uDCBB',
    color1: '#2ecc71',
    color2: '#27ae60',
    damage: 75,
    topics: ['PCB Fundamentals', 'Routing Techniques', 'Ground Planes'],
    unlockCondition: (topics) => {
      const ids = ['193','194','195','196','197','198','199','200','201','202','203','204','205',
        'B1','B2','B3','B4','B5','B6','B7','B8','B9','B10'];
      return ids.every(id => topics[id]?.done);
    },
    special: 'Unlocks "PCB Blitz" battle mode',
  },
  {
    id: 'smps_demon',
    name: 'SMPS DEMON',
    title: 'The Switching Inferno',
    rarity: 'epic',
    domain: 'Flyback, Forward, Push-Pull, PWM Controllers',
    lore: 'Born in the switching node of a flyback converter. He runs at 100kHz.',
    icon: '\uD83D\uDD25',
    color1: '#e67e22',
    color2: '#d35400',
    damage: 75,
    topics: ['SMPS Fundamentals', 'Flyback Converter', 'PWM Controllers'],
    unlockCondition: (topics) => {
      const ids = ['E1','E2','E3','E4','E5','E6','E7','E8','E9','E10','E11','E12'];
      return ids.every(id => topics[id]?.done);
    },
    special: null,
  },

  // LEGENDARY
  {
    id: 'silicon_master',
    name: 'SILICON MASTER',
    title: 'The Final Form',
    rarity: 'legendary',
    domain: 'All domains',
    lore: 'When you\'ve mapped every electron\'s path, you become the circuit.',
    icon: '\uD83E\uDDE0',
    color1: '#f4a623',
    color2: '#ffd166',
    damage: 100,
    topics: ['All'],
    unlockCondition: (topics) => {
      return Object.values(topics).filter(t => t.done).length >= 200;
    },
    special: '+25% XP all topics, special battle multiplier',
  },
  {
    id: 'resonant',
    name: 'THE RESONANT',
    title: 'Induction Overlord',
    rarity: 'legendary',
    domain: 'Induction heating, ZVS, LLC, Magnetics',
    lore: 'He found your induction stove. He learned its secrets. He IS the tank circuit.',
    icon: '\uD83C\uDF00',
    color1: '#00d4ff',
    color2: '#f4a623',
    damage: 100,
    topics: ['Resonant Power', 'Power Magnetics'],
    unlockCondition: (topics) => {
      const ids = [
        'RS1','RS2','RS3','RS4','RS5','RS6','RS7','RS8','RS9','RS10','RS11','RS12','RS13','RS14',
        'MG1','MG2','MG3','MG4','MG5','MG6','MG7','MG8','MG9','MG10','MG11','MG12',
      ];
      return ids.every(id => topics[id]?.done);
    },
    special: 'Unlocks exclusive "Resonance Arena" battle',
  },
];

export const getCardById = (id) => CHARACTER_CARDS.find(c => c.id === id);

export const getCardsByRarity = (rarity) => CHARACTER_CARDS.filter(c => c.rarity === rarity);

export const RARITY_COLORS = {
  starter: '#3498db',
  common: '#95a5a6',
  rare: '#3498db',
  epic: '#9b59b6',
  legendary: '#f39c12',
};

export const RARITY_LABELS = {
  starter: 'Starter',
  common: 'Common',
  rare: 'Rare',
  epic: 'Epic',
  legendary: 'Legendary',
};
