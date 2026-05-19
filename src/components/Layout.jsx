import Navigation from './Navigation';
import { useGameStore } from '../lib/gameStore';
import { useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { CharacterArt } from './CharacterArt';

export default function Layout({ children }) {
  const pendingLevelUp = useGameStore(s => s.pendingLevelUp);
  const pendingCardUnlock = useGameStore(s => s.pendingCardUnlock);
  const dismissLevelUp = useGameStore(s => s.dismissLevelUp);
  const dismissCardUnlock = useGameStore(s => s.dismissCardUnlock);
  const location = useLocation();

  return (
    <div className="min-h-screen flex flex-col lg:flex-row">
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex lg:w-14 lg:flex-col lg:fixed lg:inset-y-0 bg-bg-card border-r border-border-glow z-50">
        <Navigation mode="sidebar" />
      </aside>

      {/* Main content with page transitions */}
      <main className="flex-1 lg:ml-14 pb-16 lg:pb-0">
        <AnimatePresence initial={false}>
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
          >
            {children}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Mobile bottom nav */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-50">
        <Navigation mode="bottombar" />
      </nav>

      {/* Level Up Overlay */}
      <AnimatePresence>
        {pendingLevelUp && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm"
            onClick={dismissLevelUp}
          >
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              exit={{ scale: 0, opacity: 0 }}
              transition={{ type: 'spring', damping: 10 }}
              className="text-center relative"
            >
              {/* Confetti particles */}
              {Array.from({ length: 16 }).map((_, i) => (
                <motion.div
                  key={i}
                  initial={{ x: 0, y: 0, scale: 1, opacity: 1 }}
                  animate={{
                    x: (Math.random() - 0.5) * 250,
                    y: (Math.random() - 0.5) * 250,
                    scale: 0,
                    opacity: 0,
                    rotate: Math.random() * 360,
                  }}
                  transition={{ duration: 1.5, delay: 0.1 + i * 0.05 }}
                  className="absolute w-2 h-2 rounded-sm"
                  style={{
                    left: '50%', top: '40%',
                    background: ['#f4a623', '#ffd166', '#e74c3c', '#3498db', '#2ecc71', '#9b59b6'][i % 6],
                  }}
                />
              ))}
              <div className="text-9xl font-rajdhani font-black text-gold mb-2 level-burst" style={{ textShadow: '0 0 60px rgba(244,166,35,0.6)' }}>
                {pendingLevelUp}
              </div>
              <div className="text-3xl font-game font-black text-gold-light mb-1 text-shadow-game">LEVEL UP!</div>
              <div className="text-text-muted text-sm mt-4 animate-pulse">TAP TO CONTINUE</div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Card Unlock Overlay */}
      <AnimatePresence>
        {pendingCardUnlock && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm"
            onClick={dismissCardUnlock}
          >
            <motion.div
              initial={{ rotateY: 180, scale: 0.5 }}
              animate={{ rotateY: 0, scale: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              transition={{ type: 'spring', damping: 12 }}
              className="text-center max-w-xs mx-4"
            >
              <div className="game-panel overflow-hidden" style={{ borderColor: pendingCardUnlock.color1, boxShadow: `0 0 50px ${pendingCardUnlock.color1}40` }}>
                <div
                  className="p-6 pb-4"
                  style={{ background: `linear-gradient(180deg, ${pendingCardUnlock.color1}30, #1e2440)` }}
                >
                  <div className="text-xs uppercase tracking-[4px] text-text-muted mb-3">New Card Unlocked</div>
                  <div className="mb-3 flex justify-center" style={{ filter: `drop-shadow(0 0 20px ${pendingCardUnlock.color1})` }}>
                    <CharacterArt cardId={pendingCardUnlock.id} size={80} />
                  </div>
                  <div className="font-game font-black text-2xl" style={{ color: pendingCardUnlock.color1 }}>
                    {pendingCardUnlock.name}
                  </div>
                  <div className="text-text-muted text-sm italic">{pendingCardUnlock.title}</div>
                </div>
                <div className="p-4 pt-0">
                  <div className="text-text-primary text-sm mb-4">{pendingCardUnlock.lore}</div>
                  <button
                    type="button"
                    onClick={dismissCardUnlock}
                    className="btn-cr btn-cr-gold w-full text-sm py-2.5 animate-pulse"
                  >
                    TAP TO CONTINUE
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
