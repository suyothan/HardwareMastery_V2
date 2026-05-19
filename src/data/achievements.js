export const ACHIEVEMENTS = [
  {
    id: 'first_signal',
    name: 'First Signal',
    icon: '\u26A1',
    description: 'Complete your first topic',
    condition: (state) => Object.values(state.topics).some(t => t.done),
    secret: false,
  },
  {
    id: 'decibel_ten',
    name: 'Decibel Ten',
    icon: '\uD83D\uDD1F',
    description: 'Complete 10 topics',
    condition: (state) => Object.values(state.topics).filter(t => t.done).length >= 10,
    secret: false,
  },
  {
    id: 'week_warrior',
    name: 'Week Warrior',
    icon: '\uD83D\uDD25',
    description: 'Maintain a 7-day streak',
    condition: (state) => state.profile.streak >= 7,
    secret: false,
  },
  {
    id: 'analog_adept',
    name: 'Analog Adept',
    icon: '\u26A1',
    description: 'Complete all Block 1 topics',
    condition: (state) => {
      const block1Ids = [
        '1','2','3','4','5','6','7','8','9','10','11','12','13','14','15','16','17','18','19','20',
        '21','22','23','24','25','26','27','28','29','30','31','32','33','60','61','62','63','64','65',
        '66','67','68','69','70','71','72','73','A1','A2','A3','A4','A5','A6','A7','A8',
      ];
      return block1Ids.every(id => state.topics[id]?.done);
    },
    secret: false,
  },
  {
    id: 'power_engineer',
    name: 'Power Engineer',
    icon: '\uD83D\uDD0B',
    description: 'Complete all Block 2 topics',
    condition: (state) => {
      const ids = ['P1','P2','P3','P4','P5','P6','P7','P8','P9','P10'];
      return ids.every(id => state.topics[id]?.done);
    },
    secret: false,
  },
  {
    id: 'pcb_architect',
    name: 'PCB Architect',
    icon: '\uD83D\uDCBB',
    description: 'Complete all Block 4 topics',
    condition: (state) => {
      const ids = [
        '193','194','195','196','197','198','199','200','201','202','203','204','205',
        'B1','B2','B3','B4','B5','B6','B7','B8','B9','B10',
      ];
      return ids.every(id => state.topics[id]?.done);
    },
    secret: false,
  },
  {
    id: 'battle_hardened',
    name: 'Battle Hardened',
    icon: '\u2694\uFE0F',
    description: 'Win 10 battles',
    condition: (state) => state.battleHistory.filter(b => b.victory).length >= 10,
    secret: false,
  },
  {
    id: 'silicon_master',
    name: 'Silicon Master',
    icon: '\uD83D\uDC8E',
    description: 'Complete 200+ topics',
    condition: (state) => Object.values(state.topics).filter(t => t.done).length >= 200,
    secret: false,
  },
  {
    id: 'deep_diver',
    name: 'Deep Diver',
    icon: '\uD83E\uDD3F',
    description: 'Complete 50 DEEP or DEEPEST topics',
    condition: (state, curriculum) => {
      const deepIds = curriculum.filter(t => t.depth === 'DEEP' || t.depth === 'DEEPEST').map(t => t.id);
      return deepIds.filter(id => state.topics[id]?.done).length >= 50;
    },
    secret: false,
  },
  {
    id: 'card_collector',
    name: 'Card Collector',
    icon: '\uD83C\uDCCF',
    description: 'Unlock 8 character cards',
    condition: (state) => Object.values(state.cards).filter(c => c.unlocked).length >= 8,
    secret: false,
  },
  {
    id: 'chest_hunter',
    name: 'Chest Hunter',
    icon: '\uD83C\uDFB2',
    description: 'Open 20 chests',
    condition: () => false, // Tracked separately
    secret: false,
  },
  {
    id: 'max_level',
    name: 'Peak Performance',
    icon: '\uD83C\uDFC6',
    description: 'Reach Level 10',
    condition: (state) => state.profile.level >= 10,
    secret: false,
  },
  {
    id: 'perfect_battle',
    name: 'Perfect Battle',
    icon: '\uD83C\uDF1F',
    description: 'Win a battle without taking damage',
    condition: () => false, // Checked during battle
    secret: false,
  },
  {
    id: 'speed_demon',
    name: 'Speed Demon',
    icon: '\u26A1',
    description: 'Answer a question in under 5 seconds',
    condition: () => false, // Checked during battle
    secret: false,
  },
  {
    id: 'lore_master',
    name: 'Lore Master',
    icon: '\uD83D\uDCD6',
    description: 'Read the lore of all unlocked cards',
    condition: () => false, // Tracked separately
    secret: true,
  },
  {
    id: 'resonant_one',
    name: 'The Resonant One',
    icon: '\uD83C\uDF00',
    description: 'Unlock THE RESONANT card',
    condition: (state) => state.cards.resonant?.unlocked,
    secret: true,
  },
];

export const getAchievementById = (id) => ACHIEVEMENTS.find(a => a.id === id);
