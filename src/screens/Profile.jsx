import { useGameStore } from '../lib/gameStore';
import { getRankTitle, getXpForNextLevel } from '../data/economy';
import { ACHIEVEMENTS } from '../data/achievements';
import { ARENAS } from '../data/arenas';
import { Zap, Flame, Trophy, Swords, Target, Shield, Star } from 'lucide-react';

export default function Profile() {
  const profile = useGameStore(s => s.profile);
  const topics = useGameStore(s => s.topics);
  const achievements = useGameStore(s => s.achievements);
  const battleHistory = useGameStore(s => s.battleHistory);
  const activityLog = useGameStore(s => s.activityLog);
  const currentArenaId = useGameStore(s => s.currentArena);

  const topicsDone = Object.values(topics).filter(t => t.done).length;
  const battlesWon = battleHistory.filter(b => b.victory).length;
  const rankTitle = getRankTitle(profile.level);
  const xpForNext = getXpForNextLevel(profile.level);
  const currentArena = ARENAS.find(a => a.id === currentArenaId) || ARENAS[0];

  // Heatmap
  const generateHeatmap = () => {
    const weeks = [];
    const today = new Date();
    for (let w = 11; w >= 0; w--) {
      const week = [];
      for (let d = 6; d >= 0; d--) {
        const date = new Date(today);
        date.setDate(date.getDate() - (w * 7 + d));
        const dateStr = date.toISOString().split('T')[0];
        week.push({ date: dateStr, count: activityLog[dateStr] || 0 });
      }
      weeks.push(week);
    }
    return weeks;
  };

  const heatmap = generateHeatmap();
  const getHeatColor = (c) => c === 0 ? '#1e2440' : c <= 2 ? '#2ecc7130' : c <= 5 ? '#2ecc7160' : c <= 8 ? '#2ecc71a0' : '#2ecc71';

  return (
    <div className="p-3 pb-20 lg:pb-4 max-w-3xl mx-auto">
      <h1 className="text-xl font-game font-bold text-gold text-shadow-game mb-4">Commander HQ</h1>

      {/* Commander Card */}
      <div className="game-panel p-4 mb-4" style={{ borderColor: currentArena.accent + '30' }}>
        <div className="flex items-center gap-4 mb-3">
          <div
            className="w-14 h-14 rounded-xl flex items-center justify-center text-3xl"
            style={{
              background: `linear-gradient(135deg, ${currentArena.color1}, ${currentArena.color2})`,
              boxShadow: `0 0 20px ${currentArena.accent}40`,
            }}
          >
            {currentArena.icon}
          </div>
          <div>
            <div className="text-text-primary text-lg font-bold">{profile.name}</div>
            <div className="text-text-muted text-xs">{rankTitle}</div>
            <div className="flex items-center gap-2 mt-1">
              <span className="px-2 py-0.5 rounded bg-gold/20 text-gold text-[10px] font-rajdhani font-bold">LVL {profile.level}</span>
              <span className="px-2 py-0.5 rounded text-[10px] font-rajdhani font-bold" style={{ backgroundColor: currentArena.accent + '20', color: currentArena.accent }}>
                {currentArena.name}
              </span>
            </div>
          </div>
        </div>

        {/* XP Bar */}
        <div className="mb-3">
          <div className="flex justify-between text-[10px] text-text-muted mb-1">
            <span>XP: {profile.xp.toLocaleString()}</span>
            <span>{xpForNext ? `${xpForNext - profile.xp} to next` : 'MAX'}</span>
          </div>
          <div className="progress-bar-game">
            <div className="fill" style={{ width: xpForNext ? `${(profile.xp / xpForNext) * 100}%` : '100%', background: 'linear-gradient(90deg, #f4a623, #ffd166)' }} />
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-4 gap-2">
          {[
            { icon: <Zap size={14} />, value: profile.xp.toLocaleString(), label: 'XP', color: '#f4a623' },
            { icon: <Target size={14} />, value: topicsDone, label: 'Topics', color: '#2ecc71' },
            { icon: <Swords size={14} />, value: battlesWon, label: 'Wins', color: '#00d4ff' },
            { icon: <Flame size={14} />, value: profile.bestStreak, label: 'Streak', color: '#e67e22' },
          ].map((s, i) => (
            <div key={i} className="game-panel-dark p-2 rounded-lg text-center">
              <div className="flex justify-center mb-0.5" style={{ color: s.color }}>{s.icon}</div>
              <div className="font-rajdhani font-bold text-sm" style={{ color: s.color }}>{s.value}</div>
              <div className="text-text-muted text-[8px]">{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Achievements */}
      <div className="game-panel p-3 mb-4">
        <div className="text-sm font-bold text-text-primary mb-3 flex items-center gap-2">
          <Trophy size={14} className="text-gold" />
          Achievements
        </div>
        <div className="grid grid-cols-4 sm:grid-cols-4 gap-2">
          {ACHIEVEMENTS.map(a => {
            const unlocked = achievements[a.id];
            const isSecret = a.secret && !unlocked;
            return (
              <div
                key={a.id}
                className={`p-2 rounded-lg border text-center transition-all ${
                  unlocked ? 'border-gold/30 bg-gold/5' : 'border-border-glow bg-bg-primary/50 opacity-50'
                }`}
              >
                <div className="text-lg mb-0.5">{isSecret ? '❓' : a.icon}</div>
                <div className="text-[8px] font-bold text-text-primary">{isSecret ? '???' : a.name}</div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Heatmap */}
      <div className="game-panel p-3 mb-4">
        <div className="text-sm font-bold text-text-primary mb-3 flex items-center gap-2">
          <Flame size={14} className="text-orange-legendary" />
          Activity
        </div>
        <div className="overflow-x-auto">
          <div className="flex gap-0.5">
            {heatmap.map((week, wi) => (
              <div key={wi} className="flex flex-col gap-0.5">
                {week.map((day, di) => (
                  <div
                    key={di}
                    className="w-2.5 h-2.5 rounded-sm"
                    style={{ backgroundColor: getHeatColor(day.count) }}
                    title={`${day.date}: ${day.count} topics`}
                  />
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Battle History */}
      <div className="game-panel p-3">
        <div className="text-sm font-bold text-text-primary mb-3 flex items-center gap-2">
          <Swords size={14} className="text-cyan-accent" />
          Recent Battles
        </div>
        {battleHistory.length === 0 ? (
          <div className="text-text-muted text-xs text-center py-4">No battles yet</div>
        ) : (
          <div className="space-y-1.5">
            {battleHistory.slice(0, 8).map((b, i) => (
              <div key={i} className="flex items-center justify-between p-2 rounded-lg bg-bg-primary/50">
                <div className="flex items-center gap-2">
                  <span className={b.victory ? 'text-green-common' : 'text-red-danger'}>{b.victory ? '✓' : '✗'}</span>
                  <div>
                    <div className="text-xs text-text-primary font-bold">{b.boss}</div>
                    <div className="text-[9px] text-text-muted">{new Date(b.date).toLocaleDateString()}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-xs font-rajdhani font-bold text-gold">+{b.xpEarned} XP</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
