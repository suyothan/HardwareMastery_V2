import { useState, useEffect, useRef } from 'react';
import { useGameStore } from '../lib/gameStore';
import { CHEST_INFO } from '../data/economy';
import { AnimatePresence, motion } from 'framer-motion';

export default function ChestSlot({ chest, slot }) {
  const openChest = useGameStore(s => s.openChest);
  const [timeLeft, setTimeLeft] = useState(null);
  const [canOpen, setCanOpen] = useState(false);
  const [phase, setPhase] = useState('idle'); // idle | jiggle | crack | explode | rewards | done
  const [rewards, setRewards] = useState(null);
  const [showTap, setShowTap] = useState(false);
  const timeoutsRef = useRef([]);

  // Clear all pending timeouts on unmount
  useEffect(() => {
    return () => {
      timeoutsRef.current.forEach(clearTimeout);
      timeoutsRef.current = [];
    };
  }, []);

  const safeSetTimeout = (fn, ms) => {
    const id = setTimeout(fn, ms);
    timeoutsRef.current.push(id);
    return id;
  };

  useEffect(() => {
    if (!chest.type || !chest.unlocksAt) return;
    const update = () => {
      const diff = chest.unlocksAt - Date.now();
      if (diff <= 0) { setTimeLeft(null); setCanOpen(true); return; }
      const h = Math.floor(diff / 3600000);
      const m = Math.floor((diff % 3600000) / 60000);
      setTimeLeft(h > 0 ? `${h}h${m}m` : `${m}m`);
      setCanOpen(false);
    };
    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, [chest]);

  const handleOpen = () => {
    if (!canOpen && chest.type && chest.unlocksAt) return;
    if (phase !== 'idle') return;

    // Phase 1: Jiggle (5 cycles)
    setPhase('jiggle');
    safeSetTimeout(() => {
      // Phase 2: Crack
      setPhase('crack');
      safeSetTimeout(() => {
        // Phase 3: Explode
        setPhase('explode');
        safeSetTimeout(() => {
          // Phase 4: Open chest and show rewards
          const result = openChest(slot);
          if (result) {
            setRewards(result);
            setPhase('rewards');
            // Phase 5: Show "TAP TO CONTINUE" after rewards appear
            safeSetTimeout(() => setShowTap(true), 1200);
          } else {
            setPhase('idle');
          }
        }, 400);
      }, 500);
    }, 600);
  };

  const handleCollect = () => {
    setPhase('done');
    safeSetTimeout(() => {
      setPhase('idle');
      setRewards(null);
      setShowTap(false);
    }, 300);
  };

  const info = chest.type ? CHEST_INFO[chest.type] : null;

  if (!chest.type) {
    return (
      <div className="aspect-square rounded-lg border-2 border-dashed border-text-muted/20 flex items-center justify-center bg-bg-primary/30">
        <span className="text-text-muted/20 text-[10px] uppercase tracking-wider font-rajdhani font-bold">Empty</span>
      </div>
    );
  }

  return (
    <>
      <motion.div
        animate={
          phase === 'jiggle'
            ? { rotate: [0, -6, 6, -6, 6, -4, 4, -2, 2, 0] }
            : phase === 'crack'
            ? { scale: [1, 1.05, 1, 1.05, 1] }
            : phase === 'explode'
            ? { scale: [1, 1.3], opacity: [1, 0] }
            : {}
        }
        transition={
          phase === 'jiggle'
            ? { duration: 0.6, ease: 'easeInOut' }
            : phase === 'crack'
            ? { duration: 0.5 }
            : phase === 'explode'
            ? { duration: 0.4 }
            : {}
        }
        className={`aspect-square rounded-lg flex flex-col items-center justify-center relative overflow-hidden cursor-pointer transition-all ${
          canOpen ? 'chest-glow border-2 border-gold/60' : 'border border-border-glow/50'
        }`}
        style={{
          background: info
            ? `linear-gradient(135deg, ${info.color}20, ${info.color}08)`
            : 'linear-gradient(135deg, #1e2440, #1a1f3a)',
        }}
        onClick={handleOpen}
      >
        {/* Crack lines — visible during crack phase */}
        {phase === 'crack' && (
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-1/4 left-1/4 w-1/2 h-px bg-white/60 rotate-12" />
            <div className="absolute top-1/2 left-1/3 w-1/3 h-px bg-white/40 -rotate-6" />
            <div className="absolute top-3/4 left-1/4 w-2/5 h-px bg-white/50 rotate-3" />
          </div>
        )}

        {/* Chest icon/visual */}
        <div className="text-2xl mb-0.5">{info?.icon || '?'}</div>
        <div className="text-[9px] text-text-muted font-rajdhani font-bold truncate w-full text-center px-1">
          {info?.name || 'Chest'}
        </div>

        {/* Timer or Open indicator */}
        {chest.unlocksAt && !canOpen && timeLeft && (
          <div className="text-[10px] text-gold font-rajdhani font-bold mt-0.5">{timeLeft}</div>
        )}
        {canOpen && phase === 'idle' && (
          <motion.div
            animate={{ scale: [1, 1.15, 1] }}
            transition={{ duration: 0.8, repeat: Infinity }}
            className="text-[10px] text-gold font-game font-bold mt-0.5"
          >
            TAP!
          </motion.div>
        )}
      </motion.div>

      {/* ═══════ REWARDS OVERLAY ═══════ */}
      <AnimatePresence>
        {phase === 'rewards' && rewards && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
            onClick={showTap ? handleCollect : undefined}
          >
            <motion.div
              initial={{ scale: 0.5, y: 40 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ type: 'spring', damping: 12 }}
              className="game-panel w-full max-w-xs p-5 text-center"
              onClick={e => e.stopPropagation()}
            >
              {/* Chest name */}
              <motion.div
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="font-game font-black text-xl text-gold mb-4"
              >
                Chest Opened!
              </motion.div>

              {/* Rewards — staggered float in */}
              <div className="space-y-3 mb-4">
                <motion.div
                  initial={{ x: -30, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  className="flex items-center justify-between p-2 rounded-lg bg-bg-primary/50"
                >
                  <span className="text-text-muted text-sm">XP</span>
                  <span className="text-gold font-rajdhani font-bold text-lg">+{rewards.xp}</span>
                </motion.div>
                <motion.div
                  initial={{ x: 30, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.4 }}
                  className="flex items-center justify-between p-2 rounded-lg bg-bg-primary/50"
                >
                  <span className="text-text-muted text-sm">Coins</span>
                  <span className="text-gold-light font-rajdhani font-bold text-lg">+{rewards.coins}</span>
                </motion.div>
                <motion.div
                  initial={{ x: -30, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.6 }}
                  className="flex items-center justify-between p-2 rounded-lg bg-bg-primary/50"
                >
                  <span className="text-text-muted text-sm">Shards</span>
                  <span className="text-purple-epic font-rajdhani font-bold text-lg">+{rewards.shards}</span>
                </motion.div>
                {rewards.tip && (
                  <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.8 }}
                    className="text-cyan-xp text-xs italic p-2 rounded-lg bg-cyan-xp/5 border border-cyan-xp/10"
                  >
                    {rewards.tip}
                  </motion.div>
                )}
              </div>

              {/* Tap to continue */}
              <AnimatePresence>
                {showTap && (
                  <motion.button
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    onClick={handleCollect}
                    className="btn-cr btn-cr-gold w-full"
                  >
                    COLLECT
                  </motion.button>
                )}
              </AnimatePresence>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
