import { useGameStore } from '../lib/gameStore';
import { getRankTitle } from '../data/economy';
import { ARENAS, getNextArena, getArenaProgress } from '../data/arenas';
import { Zap, Trophy, Swords, Settings, Coins, Diamond, Flame } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useMemo } from 'react';
import { motion } from 'framer-motion';

// Floating arena particles
function ArenaParticles({ color }) {
  const particles = useMemo(() =>
    Array.from({ length: 25 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      delay: Math.random() * 6,
      duration: 3 + Math.random() * 5,
      drift: (Math.random() - 0.5) * 80,
      size: 2 + Math.random() * 5,
    })), []
  );

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {particles.map(p => (
        <div
          key={p.id}
          className="arena-particle"
          style={{
            left: `${p.left}%`,
            bottom: '5%',
            width: p.size,
            height: p.size,
            background: color,
            boxShadow: `0 0 ${p.size * 3}px ${color}`,
            '--delay': `${p.delay}s`,
            '--duration': `${p.duration}s`,
            '--drift': `${p.drift}px`,
          }}
        />
      ))}
    </div>
  );
}

export default function Home() {
  const navigate = useNavigate();
  const profile = useGameStore(s => s.profile);
  const topics = useGameStore(s => s.topics);
  const currentArenaId = useGameStore(s => s.currentArena);

  const currentArena = ARENAS.find(a => a.id === currentArenaId) || ARENAS[0];
  const nextArena = getNextArena(currentArenaId);
  const arenaProgress = getArenaProgress(profile.masteryPoints, currentArena);

  const topicsDone = Object.values(topics).filter(t => t.done).length;
  const rankTitle = getRankTitle(profile.level);

  return (
    <div className="min-h-screen flex flex-col">
      {/* ═══════ TOP BAR — exactly CR style ═══════ */}
      <div className="flex items-center justify-between px-3 py-2 bg-gradient-to-b from-black/50 to-black/20 border-b border-white/5">
        <div className="flex items-center gap-2">
          <div className="stat-badge">
            <Trophy size={14} className="text-gold" />
            <span className="text-gold font-rajdhani font-bold">{profile.masteryPoints}</span>
          </div>
          <div className="stat-badge">
            <Zap size={14} className="text-cyan-xp" />
            <span className="text-cyan-xp font-rajdhani font-bold">{profile.xp.toLocaleString()}</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="stat-badge">
            <Coins size={14} className="text-gold-light" />
            <span className="text-gold-light font-rajdhani font-bold">{profile.coins}</span>
          </div>
          <div className="stat-badge">
            <Diamond size={14} className="text-purple-epic" />
            <span className="text-purple-epic font-rajdhani font-bold">{profile.shards}</span>
          </div>
          <button
            onClick={() => navigate('/settings')}
            className="w-8 h-8 flex items-center justify-center rounded-full bg-white/5 text-text-muted hover:text-text-primary transition-colors"
          >
            <Settings size={16} />
          </button>
        </div>
      </div>

      {/* ═══════ ARENA CENTER — the heart of CR ═══════ */}
      <div className="flex-1 flex flex-col items-center relative px-4 pt-4 pb-2 overflow-hidden">
        <ArenaParticles color={currentArena.accent} />

        {/* Arena Environment — layered CSS art */}
        <div className="relative w-full max-w-sm mb-3">
          {/* Background glow */}
          <div
            className="absolute inset-0 rounded-3xl opacity-20 blur-3xl"
            style={{ background: `radial-gradient(circle, ${currentArena.accent}, transparent 70%)` }}
          />

          {/* Arena Badge */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', damping: 12 }}
            className="relative text-center py-4"
          >
            <div className="text-[10px] uppercase tracking-[4px] text-text-muted mb-2">Current Arena</div>
            <div
              className="text-6xl mb-2 drop-shadow-lg"
              style={{ filter: `drop-shadow(0 0 25px ${currentArena.accent}80)` }}
            >
              {currentArena.icon}
            </div>
            <h1
              className="text-4xl font-game text-shadow-game tracking-wide"
              style={{ color: currentArena.accent }}
            >
              {currentArena.name}
            </h1>
            <p className="text-text-muted text-sm mt-1 max-w-xs mx-auto">{currentArena.description}</p>
          </motion.div>

          {/* Pedestal base — 3D-looking */}
          <div className="relative mx-8">
            <div
              className="h-4 rounded-full"
              style={{
                background: `linear-gradient(180deg, ${currentArena.accent}40, ${currentArena.accent}10)`,
                boxShadow: `0 4px 20px ${currentArena.accent}30, inset 0 1px 0 ${currentArena.accent}60`,
              }}
            />
            <div
              className="h-2 rounded-full mx-4 -mt-0.5"
              style={{
                background: `linear-gradient(90deg, transparent, ${currentArena.accent}20, transparent)`,
              }}
            />
          </div>
        </div>

        {/* ═══════ TROPHY PROGRESS BAR ═══════ */}
        <div className="w-full max-w-sm mb-3">
          <div className="flex items-center justify-between mb-1.5">
            <div className="flex items-center gap-2">
              <Trophy size={16} className="text-gold" />
              <span className="font-rajdhani font-bold text-gold text-lg">{profile.masteryPoints}</span>
            </div>
            {nextArena && (
              <div className="flex items-center gap-1.5 text-xs text-text-muted">
                <span>Next: <span style={{ color: nextArena.accent }}>{nextArena.name}</span></span>
                <span className="text-sm">{nextArena.icon}</span>
              </div>
            )}
          </div>
          <div className="progress-bar-game h-4 rounded-lg">
            <div
              className="fill rounded-lg"
              style={{
                width: `${arenaProgress}%`,
                background: `linear-gradient(90deg, ${currentArena.color1}, ${currentArena.accent})`,
              }}
            />
          </div>
          {nextArena && (
            <div className="text-right text-[11px] text-text-muted mt-1 font-rajdhani">
              {nextArena.unlockRequirement - profile.masteryPoints} trophies to next arena
            </div>
          )}
        </div>

        {/* ═══════ BATTLE BUTTON — THE SACRED ELEMENT ═══════ */}
        <motion.button
          onClick={() => navigate('/battle')}
          whileTap={{ scale: 0.95 }}
          className="btn-cr btn-cr-gold w-[60%] min-w-[200px] text-2xl py-5 mb-3 relative overflow-hidden battle-pulse"
        >
          <Swords size={30} />
          <span>BATTLE</span>
        </motion.button>

        {/* ═══════ QUICK STATS ═══════ */}
        <div className="flex gap-2 w-full max-w-sm">
          <div className="game-panel flex-1 p-2.5 text-center">
            <div className="text-green-hp font-rajdhani font-bold text-xl">{topicsDone}</div>
            <div className="text-text-muted text-[10px] uppercase tracking-wider">Topics</div>
          </div>
          <div className="game-panel flex-1 p-2.5 text-center">
            <div className="flex items-center justify-center gap-1">
              <Flame size={14} className="text-orange-btn" />
              <span className="text-orange-btn font-rajdhani font-bold text-xl">{profile.streak}</span>
            </div>
            <div className="text-text-muted text-[10px] uppercase tracking-wider">Streak</div>
          </div>
          <div className="game-panel flex-1 p-2.5 text-center">
            <div className="text-gold font-rajdhani font-bold text-xl">{profile.level}</div>
            <div className="text-text-muted text-[10px] uppercase tracking-wider">{rankTitle}</div>
          </div>
        </div>
      </div>

    </div>
  );
}
