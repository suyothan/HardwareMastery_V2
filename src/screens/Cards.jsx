import { useState, useRef } from 'react';
import { useGameStore } from '../lib/gameStore';
import { CHARACTER_CARDS, RARITY_COLORS, RARITY_LABELS } from '../data/cards';
import { UPGRADE_COSTS } from '../data/economy';
import { Star, Lock, ArrowUp, X, ChevronRight } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { CharacterArt } from '../components/CharacterArt';

// 3D tilt hook
function useTilt() {
  const ref = useRef(null);
  const handleMouseMove = (e) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    ref.current.style.transform = `perspective(600px) rotateY(${x * 12}deg) rotateX(${-y * 12}deg) scale(1.03)`;
  };
  const handleMouseLeave = () => {
    if (!ref.current) return;
    ref.current.style.transform = 'perspective(600px) rotateY(0deg) rotateX(0deg) scale(1)';
  };
  return { ref, handleMouseMove, handleMouseLeave };
}

function GameCard({ card, state, isEquipped, onClick }) {
  const { ref, handleMouseMove, handleMouseLeave } = useTilt();

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
      whileTap={{ scale: 0.95 }}
      className={`relative rounded-xl overflow-hidden cursor-pointer transition-transform duration-200 card-shine ${
        state?.unlocked ? '' : 'opacity-40'
      }`}
      style={{
        border: `2px solid ${state?.unlocked ? RARITY_COLORS[card.rarity] : '#2a3158'}`,
        boxShadow: state?.unlocked
          ? `0 0 15px ${RARITY_COLORS[card.rarity]}30, 0 4px 12px rgba(0,0,0,0.4)`
          : '0 2px 8px rgba(0,0,0,0.3)',
        background: state?.unlocked
          ? `linear-gradient(160deg, ${card.color1}25, #1e2440 50%, ${card.color2}15)`
          : 'linear-gradient(160deg, #1a1f3a, #1e2440)',
      }}
    >
      {/* Equipped badge */}
      {isEquipped && (
        <div className="absolute top-1.5 right-1.5 z-10 px-1.5 py-0.5 rounded-md bg-gold/30 text-gold text-[8px] font-bold uppercase tracking-wider border border-gold/40">
          Equipped
        </div>
      )}

      {/* Card content */}
      <div className="p-3 text-center">
        {/* Character art area */}
        <div
          className="w-20 h-24 mx-auto rounded-lg flex items-center justify-center mb-2 overflow-hidden"
          style={{
            background: state?.unlocked
              ? `radial-gradient(circle at center, ${card.color1}30, transparent 70%)`
              : 'linear-gradient(135deg, #1a2235, #1e2440)',
            boxShadow: state?.unlocked ? `0 0 20px ${card.color1}30` : 'none',
          }}
        >
          {state?.unlocked ? <CharacterArt cardId={card.id} size={80} /> : <Lock size={20} className="text-text-muted" />}
        </div>

        {/* Name */}
        <div
          className="font-game font-bold text-xs mb-0.5"
          style={{ color: state?.unlocked ? RARITY_COLORS[card.rarity] : '#5a6b8a' }}
        >
          {card.name}
        </div>

        {/* Stars */}
        {state?.unlocked && (
          <div className="flex justify-center gap-0.5 mb-1">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                size={9}
                className={i < (state.level || 1) ? 'text-gold fill-gold' : 'text-text-muted/30'}
              />
            ))}
          </div>
        )}

        {/* Level & DMG */}
        {state?.unlocked && (
          <div className="flex justify-between text-[9px]">
            <span className="text-text-muted">LVL {state.level}</span>
            <span className="text-gold font-rajdhani font-bold">DMG {card.damage + ((state.level || 1) - 1) * 10}</span>
          </div>
        )}

        {/* Rarity */}
        <div className="mt-1.5">
          <span
            className="text-[7px] uppercase tracking-widest px-1.5 py-0.5 rounded-sm font-bold"
            style={{
              color: RARITY_COLORS[card.rarity],
              backgroundColor: RARITY_COLORS[card.rarity] + '15',
              border: `1px solid ${RARITY_COLORS[card.rarity]}30`,
            }}
          >
            {RARITY_LABELS[card.rarity]}
          </span>
        </div>
      </div>
    </motion.div>
  );
}

export default function Cards() {
  const cards = useGameStore(s => s.cards);
  const deck = useGameStore(s => s.deck);
  const profile = useGameStore(s => s.profile);
  const equipCard = useGameStore(s => s.equipCard);
  const unequipCard = useGameStore(s => s.unequipCard);
  const upgradeCard = useGameStore(s => s.upgradeCard);

  const [tab, setTab] = useState('COLLECTION');
  const [selectedCard, setSelectedCard] = useState(null);
  const [showDetail, setShowDetail] = useState(false);

  const [upgradingCard, setUpgradingCard] = useState(null);

  const handleCardClick = (card) => {
    setSelectedCard(card);
    setShowDetail(true);
  };

  const handleEquip = (cardId, slot) => {
    if (deck.includes(cardId)) {
      unequipCard(deck.indexOf(cardId));
    }
    equipCard(cardId, slot);
  };

  const handleUpgrade = (cardId) => {
    setUpgradingCard(cardId);
    upgradeCard(cardId);
    setTimeout(() => setUpgradingCard(null), 1000);
  };

  return (
    <div className="p-3 pb-20 lg:pb-4 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <h1 className="text-xl font-game font-bold text-gold text-shadow-game">Study</h1>
        <div className="stat-badge">
          <span className="text-gold">{Object.values(cards).filter(c => c.unlocked).length}</span>
          <span className="text-text-muted">/ {CHARACTER_CARDS.length}</span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-4">
        {['COLLECTION', 'UPGRADE'].map(t => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`btn-cr btn-cr-sm flex-1 ${tab === t ? 'btn-cr-blue' : 'bg-bg-card text-text-muted border border-border-glow'}`}
          >
            {t}
          </button>
        ))}
      </div>

      {/* Deck Row */}
      {tab === 'COLLECTION' && (
        <div className="game-panel p-3 mb-4">
          <div className="text-xs text-text-muted uppercase tracking-wider mb-2">Active Deck</div>
          <div className="flex gap-2">
            {deck.map((cardId, i) => {
              const card = cardId ? CHARACTER_CARDS.find(c => c.id === cardId) : null;
              return (
                <motion.div
                  key={i}
                  whileTap={{ scale: 0.9 }}
                  className="flex-1 aspect-[3/4] rounded-lg border-2 flex items-center justify-center"
                  style={card ? {
                    background: `linear-gradient(135deg, ${card.color1}30, ${card.color2}20)`,
                    borderColor: RARITY_COLORS[card.rarity],
                    boxShadow: `0 0 12px ${RARITY_COLORS[card.rarity]}25`,
                  } : {
                    borderColor: '#2a3158',
                    borderStyle: 'dashed',
                  }}
                >
                  {card ? (
                    <div className="text-center">
                      <CharacterArt cardId={card.id} size={40} />
                      <div className="text-[8px] text-text-primary font-bold mt-0.5">{card.name}</div>
                    </div>
                  ) : (
                    <div className="text-text-muted text-[10px]">+</div>
                  )}
                </motion.div>
              );
            })}
          </div>
        </div>
      )}

      {/* Card Grid */}
      {tab === 'COLLECTION' && (
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2">
          {CHARACTER_CARDS.map(card => (
            <GameCard
              key={card.id}
              card={card}
              state={cards[card.id]}
              isEquipped={deck.includes(card.id)}
              onClick={() => handleCardClick(card)}
            />
          ))}
        </div>
      )}

      {/* Upgrade Tab */}
      {tab === 'UPGRADE' && (
        <div className="space-y-2">
          {CHARACTER_CARDS.filter(c => cards[c.id]?.unlocked).map(card => {
            const state = cards[card.id];
            const cost = UPGRADE_COSTS[state.level];
            if (!cost) return null;
            const canUpgrade = state.shards >= cost.shards && profile.coins >= cost.coins;

            return (
              <div key={card.id} className="game-panel p-3 flex items-center gap-3">
                <div
                  className="w-11 h-11 rounded-lg flex items-center justify-center flex-shrink-0 overflow-hidden"
                  style={{ background: `radial-gradient(circle, ${card.color1}30, transparent 70%)` }}
                >
                  <CharacterArt cardId={card.id} size={40} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-bold text-sm text-text-primary">{card.name}</div>
                  <div className="text-[10px] text-text-muted">LVL {state.level} → {state.level + 1}</div>
                  <div className="mt-1.5">
                    <div className="flex justify-between text-[10px] text-text-muted mb-0.5">
                      <span>Shards</span>
                      <span>{state.shards}/{cost.shards}</span>
                    </div>
                    <div className="progress-bar-game" style={{ height: 8 }}>
                      <div
                        className="fill"
                        style={{
                          width: `${Math.min(100, (state.shards / cost.shards) * 100)}%`,
                          background: 'linear-gradient(90deg, #9b59b6, #c084fc)',
                        }}
                      />
                    </div>
                  </div>
                </div>
                <motion.button
                  onClick={() => handleUpgrade(card.id)}
                  disabled={!canUpgrade}
                  animate={upgradingCard === card.id ? { scale: [1, 1.1, 0.95, 1.05, 1] } : {}}
                  transition={{ duration: 0.5 }}
                  className={`btn-cr btn-cr-sm flex-shrink-0 ${canUpgrade ? 'btn-cr-green' : 'bg-bg-elevated text-text-muted cursor-not-allowed border border-border-glow'}`}
                >
                  <ArrowUp size={12} />
                  {cost.coins}
                </motion.button>
              </div>
            );
          })}
        </div>
      )}

      {/* Card Detail Modal */}
      <AnimatePresence>
        {showDetail && selectedCard && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/70 backdrop-blur-sm"
            onClick={() => setShowDetail(false)}
          >
            <motion.div
              initial={{ y: 100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 100, opacity: 0 }}
              transition={{ type: 'spring', damping: 20 }}
              className="w-full sm:max-w-sm game-panel overflow-hidden"
              style={{
                borderColor: RARITY_COLORS[selectedCard.rarity],
                boxShadow: `0 0 40px ${RARITY_COLORS[selectedCard.rarity]}30`,
              }}
              onClick={e => e.stopPropagation()}
            >
              {/* Card Header */}
              <div
                className="relative p-6 text-center"
                style={{
                  background: `linear-gradient(180deg, ${selectedCard.color1}40, ${selectedCard.color2}20, #1e2440)`,
                }}
              >
                <button onClick={() => setShowDetail(false)} className="absolute top-3 right-3 text-text-muted">
                  <X size={20} />
                </button>

                <div
                  className="w-28 h-28 mx-auto rounded-xl flex items-center justify-center mb-3 overflow-hidden"
                  style={{
                    background: `radial-gradient(circle at center, ${selectedCard.color1}40, transparent 70%)`,
                    boxShadow: `0 0 30px ${selectedCard.color1}50`,
                  }}
                >
                  <CharacterArt cardId={selectedCard.id} size={100} />
                </div>

                <div className="font-game font-black text-2xl" style={{ color: RARITY_COLORS[selectedCard.rarity] }}>
                  {selectedCard.name}
                </div>
                <div className="text-text-muted text-sm italic">{selectedCard.title}</div>
                <span
                  className="inline-block text-[10px] uppercase tracking-wider px-2 py-0.5 rounded mt-2 font-bold"
                  style={{
                    color: RARITY_COLORS[selectedCard.rarity],
                    backgroundColor: RARITY_COLORS[selectedCard.rarity] + '20',
                    border: `1px solid ${RARITY_COLORS[selectedCard.rarity]}40`,
                  }}
                >
                  {RARITY_LABELS[selectedCard.rarity]}
                </span>
              </div>

              {/* Stats */}
              <div className="p-4 space-y-3">
                <div className="game-panel-dark p-3 rounded-lg">
                  <div className="text-text-muted text-[10px] uppercase mb-1">Lore</div>
                  <div className="text-text-primary text-sm italic">{selectedCard.lore}</div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div className="game-panel-dark p-2 rounded-lg text-center">
                    <div className="text-gold font-rajdhani font-bold text-2xl">LVL {cards[selectedCard.id]?.level || 1}</div>
                    <div className="text-text-muted text-[10px]">Level</div>
                  </div>
                  <div className="game-panel-dark p-2 rounded-lg text-center">
                    <div className="text-red-danger font-rajdhani font-bold text-2xl">
                      {selectedCard.damage + ((cards[selectedCard.id]?.level || 1) - 1) * 10}
                    </div>
                    <div className="text-text-muted text-[10px]">Damage</div>
                  </div>
                </div>

                <div className="game-panel-dark p-2 rounded-lg">
                  <div className="text-text-muted text-[10px] uppercase mb-1">Domain</div>
                  <div className="text-text-primary text-sm">{selectedCard.domain}</div>
                </div>

                {selectedCard.special && (
                  <div className="p-2 rounded-lg bg-gold/10 border border-gold/20">
                    <div className="text-gold text-[10px] font-bold uppercase mb-1">Special</div>
                    <div className="text-gold-light text-sm">{selectedCard.special}</div>
                  </div>
                )}

                {/* Equip Buttons */}
                <div className="grid grid-cols-4 gap-2">
                  {[0, 1, 2, 3].map(slot => (
                    <button
                      key={slot}
                      onClick={() => { handleEquip(selectedCard.id, slot); setShowDetail(false); }}
                      className={`btn-cr btn-cr-sm ${deck[slot] === selectedCard.id ? 'btn-cr-blue' : 'bg-bg-elevated text-text-muted border border-border-glow'}`}
                    >
                      {deck[slot] === selectedCard.id ? '✓' : `${slot + 1}`}
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
