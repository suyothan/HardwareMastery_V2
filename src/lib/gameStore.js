import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { CURRICULUM } from '../data/curriculum';
import { CHARACTER_CARDS } from '../data/cards';
import { LEVEL_THRESHOLDS, UPGRADE_COSTS, CHEST_TIMERS, CHEST_REWARDS } from '../data/economy';
import { getCurrentArena } from '../data/arenas';

// Local-date YYYY-MM-DD (NOT UTC) so late-evening activity doesn't roll over
// the streak in the user's timezone.
const formatLocalDate = (d) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
const today = () => formatLocalDate(new Date());

const initialTopics = {};
CURRICULUM.forEach(t => {
  initialTopics[t.id] = { done: false, notes: '', dateCompleted: null };
});

const initialCards = {};
CHARACTER_CARDS.forEach(c => {
  initialCards[c.id] = {
    unlocked: c.id === 'volt',
    level: 1,
    shards: 0,
    equipped: c.id === 'volt',
  };
});

const initialAchievements = {
  first_signal: false,
  decibel_ten: false,
  week_warrior: false,
  analog_adept: false,
  power_engineer: false,
  pcb_architect: false,
  battle_hardened: false,
  silicon_master: false,
  deep_diver: false,
  card_collector: false,
  chest_hunter: false,
  max_level: false,
  perfect_battle: false,
  speed_demon: false,
  lore_master: false,
  resonant_one: false,
};

export const useGameStore = create(persist((set, get) => ({
  // Profile
  profile: {
    name: 'Curious Observer',
    level: 1,
    xp: 0,
    coins: 0,
    shards: 0,
    masteryPoints: 0,
    streak: 0,
    lastActiveDate: null,
    activeDays: 0,
    bestStreak: 0,
    deadlineDate: '2026-09-01',
  },

  // Current arena
  currentArena: 1,

  // Topics
  topics: initialTopics,

  // Cards
  cards: initialCards,

  // Chests (4 slots)
  chests: [
    { type: null, unlocksAt: null },
    { type: null, unlocksAt: null },
    { type: null, unlocksAt: null },
    { type: null, unlocksAt: null },
  ],

  // Deck (4 equipped card slots)
  deck: ['volt', null, null, null],

  // Achievements
  achievements: initialAchievements,

  // Battle history
  battleHistory: [],

  // Activity log (date -> count)
  activityLog: {},

  // Pending XP popups
  xpPopups: [],

  // Level up pending
  pendingLevelUp: null,

  // Card unlock pending
  pendingCardUnlock: null,

  // --- Actions ---

  // Mark topic done
  markTopicDone: (topicId) => {
    const state = get();
    const topic = state.topics[topicId];
    if (!topic || topic.done) return;

    const curriculumTopic = CURRICULUM.find(t => t.id === topicId);
    if (!curriculumTopic) return;

    const xpReward = curriculumTopic.depth === 'LIGHT' ? 10
      : curriculumTopic.depth === 'MEDIUM' ? 25
      : curriculumTopic.depth === 'DEEP' ? 50
      : 100;

    const notesBonus = topic.notes ? 15 : 0;
    const totalXp = xpReward + notesBonus;
    const coinReward = 5;

    const dateStr = today();
    const newActivityLog = { ...state.activityLog };
    newActivityLog[dateStr] = (newActivityLog[dateStr] || 0) + 1;

    // Check streak
    const lastActive = state.profile.lastActiveDate;
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = formatLocalDate(yesterday);

    let newStreak = state.profile.streak;
    let newActiveDays = state.profile.activeDays;

    if (lastActive !== dateStr) {
      if (lastActive === yesterdayStr) {
        newStreak += 1;
      } else if (lastActive !== dateStr) {
        newStreak = 1;
      }
      newActiveDays += 1;
    }

    const newProfile = {
      ...state.profile,
      xp: state.profile.xp + totalXp,
      coins: state.profile.coins + coinReward,
      masteryPoints: state.profile.masteryPoints + Math.ceil(totalXp / 2),
      streak: newStreak,
      lastActiveDate: dateStr,
      activeDays: newActiveDays,
      bestStreak: Math.max(state.profile.bestStreak, newStreak),
    };

    // Check level up
    let newLevel = state.profile.level;
    for (let i = LEVEL_THRESHOLDS.length - 1; i >= 0; i--) {
      if (newProfile.xp >= LEVEL_THRESHOLDS[i].xp) {
        newLevel = LEVEL_THRESHOLDS[i].level;
        break;
      }
    }
    newProfile.level = newLevel;

    const popupId = Date.now();
    set({
      topics: {
        ...state.topics,
        [topicId]: { ...topic, done: true, dateCompleted: dateStr },
      },
      profile: newProfile,
      currentArena: getCurrentArena(newProfile.masteryPoints).id,
      activityLog: newActivityLog,
      xpPopups: [...state.xpPopups, { id: popupId, amount: totalXp }],
      pendingLevelUp: newLevel > state.profile.level ? newLevel : null,
    });

    // Check card unlocks
    get().checkCardUnlocks();
    get().checkAchievements();

    // Clear popup after animation
    setTimeout(() => {
      set(s => ({ xpPopups: s.xpPopups.filter(p => p.id !== popupId) }));
    }, 1500);
  },

  // Update topic notes
  updateTopicNotes: (topicId, notes) => {
    set(state => ({
      topics: {
        ...state.topics,
        [topicId]: { ...state.topics[topicId], notes },
      },
    }));
  },

  // Check card unlock conditions
  checkCardUnlocks: () => {
    const state = get();
    const newCards = { ...state.cards };
    let unlockedCard = null;

    CHARACTER_CARDS.forEach(card => {
      if (newCards[card.id]?.unlocked) return;

      const condition = card.unlockCondition(state.topics, state.profile);
      if (condition) {
        newCards[card.id] = { ...newCards[card.id], unlocked: true };
        unlockedCard = card;
      }
    });

    if (unlockedCard) {
      set({ cards: newCards, pendingCardUnlock: unlockedCard });
    }
  },

  // Equip card to deck
  equipCard: (cardId, slot) => {
    set(state => {
      const newDeck = [...state.deck];
      // If the card is already equipped in another slot, swap it with whatever
      // is currently in the target slot so no card occupies two slots at once.
      const existingSlot = newDeck.indexOf(cardId);
      if (existingSlot !== -1 && existingSlot !== slot) {
        newDeck[existingSlot] = newDeck[slot];
      }
      newDeck[slot] = cardId;
      return { deck: newDeck };
    });
  },

  // Unequip card
  unequipCard: (slot) => {
    set(state => {
      const newDeck = [...state.deck];
      newDeck[slot] = null;
      return { deck: newDeck };
    });
  },

  // Upgrade card
  upgradeCard: (cardId) => {
    const state = get();
    const card = state.cards[cardId];
    if (!card) return;

    const cost = UPGRADE_COSTS[card.level];
    if (!cost || card.shards < cost.shards || state.profile.coins < cost.coins) return;

    set({
      cards: {
        ...state.cards,
        [cardId]: {
          ...card,
          level: card.level + 1,
          shards: card.shards - cost.shards,
        },
      },
      profile: {
        ...state.profile,
        coins: state.profile.coins - cost.coins,
      },
    });
  },

  // Add chest to slot
  addChest: (type) => {
    set(state => {
      const newChests = [...state.chests];
      const emptySlot = newChests.findIndex(c => c.type === null);
      if (emptySlot === -1) return state;

      newChests[emptySlot] = {
        type,
        unlocksAt: Date.now() + CHEST_TIMERS[type],
      };
      return { chests: newChests };
    });
  },

  // Open chest
  openChest: (slot) => {
    const state = get();
    const chest = state.chests[slot];
    if (!chest || !chest.type || chest.unlocksAt > Date.now()) return null;

    const rewards = CHEST_REWARDS[chest.type];

    const newChests = [...state.chests];
    newChests[slot] = { type: null, unlocksAt: null };

    // Add random shards to cards
    const newCards = { ...state.cards };
    if (rewards.shards) {
      const cardIds = Object.keys(newCards).filter(id => newCards[id].unlocked);
      const randomCard = cardIds[Math.floor(Math.random() * cardIds.length)];
      if (randomCard) {
        newCards[randomCard] = {
          ...newCards[randomCard],
          shards: newCards[randomCard].shards + rewards.shards,
        };
      }
    }

    set({
      chests: newChests,
      cards: newCards,
      profile: {
        ...state.profile,
        xp: state.profile.xp + (rewards.xp || 0),
        coins: state.profile.coins + (rewards.coins || 0),
      },
    });

    return rewards;
  },

  // Record battle result
  recordBattle: (result) => {
    set(state => {
      const newHistory = [result, ...state.battleHistory].slice(0, 20);

      // Add shards to cards used
      const newCards = { ...state.cards };
      if (result.cardsUsed) {
        result.cardsUsed.forEach(cardId => {
          if (newCards[cardId]) {
            newCards[cardId] = {
              ...newCards[cardId],
              shards: newCards[cardId].shards + 10,
            };
          }
        });
      }

      return {
        battleHistory: newHistory,
        cards: newCards,
        profile: {
          ...state.profile,
          xp: state.profile.xp + (result.xpEarned || 0),
          coins: state.profile.coins + (result.coinsEarned || 0),
          masteryPoints: state.profile.masteryPoints + (result.victory ? 100 : 20),
        },
      };
    });

    const newState = get();
    set({ currentArena: getCurrentArena(newState.profile.masteryPoints).id });
    newState.checkAchievements();
  },

  // Check achievements
  checkAchievements: () => {
    const state = get();
    const newAchievements = { ...state.achievements };
    let changed = false;

    const topicsDone = Object.values(state.topics).filter(t => t.done).length;
    const battlesWon = state.battleHistory.filter(b => b.victory).length;

    // First Signal
    if (!newAchievements.first_signal && topicsDone >= 1) {
      newAchievements.first_signal = true;
      changed = true;
    }

    // Decibel Ten
    if (!newAchievements.decibel_ten && topicsDone >= 10) {
      newAchievements.decibel_ten = true;
      changed = true;
    }

    // Week Warrior
    if (!newAchievements.week_warrior && state.profile.streak >= 7) {
      newAchievements.week_warrior = true;
      changed = true;
    }

    // Battle Hardened
    if (!newAchievements.battle_hardened && battlesWon >= 10) {
      newAchievements.battle_hardened = true;
      changed = true;
    }

    // Silicon Master
    if (!newAchievements.silicon_master && topicsDone >= 200) {
      newAchievements.silicon_master = true;
      changed = true;
    }

    // Card Collector
    const cardsUnlocked = Object.values(state.cards).filter(c => c.unlocked).length;
    if (!newAchievements.card_collector && cardsUnlocked >= 8) {
      newAchievements.card_collector = true;
      changed = true;
    }

    if (changed) {
      set({ achievements: newAchievements });
    }
  },

  // Update profile
  updateProfile: (updates) => {
    set(state => ({
      profile: { ...state.profile, ...updates },
    }));
  },

  // Set deadline
  setDeadline: (date) => {
    set(state => ({
      profile: { ...state.profile, deadlineDate: date },
    }));
  },

  // Dismiss level up
  dismissLevelUp: () => set({ pendingLevelUp: null }),

  // Dismiss card unlock
  dismissCardUnlock: () => set({ pendingCardUnlock: null }),

  // Clear XP popup
  clearXpPopup: (id) => {
    set(s => ({ xpPopups: s.xpPopups.filter(p => p.id !== id) }));
  },

  // Reset all progress
  resetProgress: () => {
    set({
      profile: {
        name: 'Curious Observer',
        level: 1,
        xp: 0,
        coins: 0,
        shards: 0,
        masteryPoints: 0,
        streak: 0,
        lastActiveDate: null,
        activeDays: 0,
        bestStreak: 0,
        deadlineDate: '2026-09-01',
      },
      currentArena: 1,
      topics: initialTopics,
      cards: initialCards,
      chests: [
        { type: null, unlocksAt: null },
        { type: null, unlocksAt: null },
        { type: null, unlocksAt: null },
        { type: null, unlocksAt: null },
      ],
      deck: ['volt', null, null, null],
      achievements: initialAchievements,
      battleHistory: [],
      activityLog: {},
    });
  },

  // Load state from Firebase
  loadState: (data) => {
    if (!data) return;
    // Only accept known persistable keys to avoid injecting transient fields
    const allowed = ['profile', 'currentArena', 'topics', 'cards', 'chests', 'deck', 'achievements', 'battleHistory', 'activityLog'];
    const safe = {};
    for (const k of allowed) {
      if (data[k] !== undefined) safe[k] = data[k];
    }
    set(s => ({ ...s, ...safe }));
  },
}), {
  name: 'hw-mastery-store',
  // Only persist the serializable game state; exclude transient UI bits.
  partialize: (state) => ({
    profile: state.profile,
    currentArena: state.currentArena,
    topics: state.topics,
    cards: state.cards,
    chests: state.chests,
    deck: state.deck,
    achievements: state.achievements,
    battleHistory: state.battleHistory,
    activityLog: state.activityLog,
  }),
  // Merge persisted data with defaults so missing fields don't break the app
  merge: (persisted, current) => ({
    ...current,
    ...persisted,
    // Ensure nested objects always have all required fields
    profile: { ...current.profile, ...persisted?.profile },
    achievements: { ...current.achievements, ...persisted?.achievements },
  }),
}));
