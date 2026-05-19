import { useState, useMemo } from 'react';
import { useGameStore } from '../lib/gameStore';
import { CURRICULUM, getBlocks } from '../data/curriculum';
import { XP_PER_DEPTH } from '../data/economy';
import { Search, FileText, X, Zap, Star } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';

const DEPTH_COLORS = { LIGHT: '#95a5a6', MEDIUM: '#3498db', DEEP: '#9b59b6', DEEPEST: '#f39c12' };

function TopicRow({ topic, state, onToggle, onNotes }) {
  const xp = XP_PER_DEPTH[topic.depth] || 25;
  const isDone = state?.done;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all ${
        isDone
          ? 'bg-[#1a2a1f]/80 border-l-[3px] border-green-hp'
          : 'bg-[#252b4a]/90 border border-white/[0.06] border-l-[3px] border-transparent hover:bg-[#2d3560]/90'
      }`}
    >
      {/* Depth gem — CSS circle, not emoji */}
      <div
        className="w-3 h-3 rounded-full shrink-0"
        style={{
          background: DEPTH_COLORS[topic.depth],
          boxShadow: `0 0 6px ${DEPTH_COLORS[topic.depth]}60`,
        }}
      />

      {/* Topic ID */}
      <span className="text-text-muted text-xs font-rajdhani w-8 shrink-0">{topic.id}</span>

      {/* Topic Title */}
      <span className={`flex-1 text-sm ${isDone ? 'text-text-muted line-through' : 'text-text-primary'}`}>
        {topic.title}
      </span>

      {/* XP Badge */}
      <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-cyan-xp/10 border border-cyan-xp/20 shrink-0">
        <Zap size={10} className="text-cyan-xp" />
        <span className="text-cyan-xp text-[11px] font-rajdhani font-bold">+{xp}</span>
      </div>

      {/* Notes button */}
      <button
        onClick={(e) => { e.stopPropagation(); onNotes(); }}
        className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 transition-colors ${
          state?.notes ? 'text-gold bg-gold/10' : 'text-text-muted/40 hover:text-text-muted hover:bg-white/5'
        }`}
      >
        <FileText size={13} />
      </button>

      {/* CR-style toggle checkbox */}
      <button
        onClick={() => onToggle(topic.id)}
        className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 transition-all ${
          isDone
            ? 'bg-green-hp text-white shadow-[0_0_10px_rgba(46,204,113,0.4)]'
            : 'bg-bg-primary border-2 border-text-muted/30 hover:border-text-muted/60'
        }`}
      >
        {isDone && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', damping: 10 }}
          >
            <Star size={14} fill="currentColor" />
          </motion.div>
        )}
      </button>
    </motion.div>
  );
}

export default function Curriculum() {
  const topics = useGameStore(s => s.topics);
  const markTopicDone = useGameStore(s => s.markTopicDone);
  const updateTopicNotes = useGameStore(s => s.updateTopicNotes);
  const xpPopups = useGameStore(s => s.xpPopups);

  const [selectedBlock, setSelectedBlock] = useState(null);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('ALL');
  const [notesTopic, setNotesTopic] = useState(null);
  const [notesText, setNotesText] = useState('');

  const blocks = getBlocks();

  const filteredTopics = useMemo(() => {
    let result = CURRICULUM;
    if (selectedBlock !== null) result = result.filter(t => t.block === selectedBlock);
    if (search) {
      const q = search.toLowerCase();
      result = result.filter(t => t.title.toLowerCase().includes(q) || t.id.toLowerCase().includes(q));
    }
    if (filter === 'PENDING') result = result.filter(t => !topics[t.id]?.done);
    else if (filter === 'DONE') result = result.filter(t => topics[t.id]?.done);
    else if (filter !== 'ALL') result = result.filter(t => t.depth === filter);
    return result;
  }, [selectedBlock, search, filter, topics]);

  // Group by block for display
  const groupedTopics = useMemo(() => {
    const groups = new Map();
    filteredTopics.forEach(t => {
      if (!groups.has(t.block)) groups.set(t.block, { block: t.block, name: t.blockName, topics: [] });
      groups.get(t.block).topics.push(t);
    });
    return Array.from(groups.values());
  }, [filteredTopics]);

  const topicsDone = Object.values(topics).filter(t => t.done).length;
  const totalTopics = CURRICULUM.length;

  const handleOpenNotes = (topic) => {
    setNotesTopic(topic);
    setNotesText(topics[topic.id]?.notes || '');
  };

  const handleSaveNotes = () => {
    if (notesTopic) updateTopicNotes(notesTopic.id, notesText);
    setNotesTopic(null);
  };

  return (
    <div className="pb-20 lg:pb-4 max-w-3xl mx-auto">
      {/* ═══════ HEADER ═══════ */}
      <div className="px-3 pt-3 pb-2">
        <div className="flex items-center justify-between mb-3">
          <h1 className="text-xl font-game text-gold text-shadow-game">Study</h1>
          <div className="stat-badge">
            <Zap size={14} className="text-cyan-xp" />
            <span className="text-cyan-xp font-rajdhani font-bold">{topicsDone} / {totalTopics}</span>
          </div>
        </div>

        {/* Progress bar */}
        <div className="progress-bar-game h-3 mb-3">
          <div
            className="fill"
            style={{
              width: `${totalTopics > 0 ? (topicsDone / totalTopics) * 100 : 0}%`,
              background: 'linear-gradient(90deg, #f4a623, #ffd166)',
            }}
          />
        </div>

        {/* Search bar — CR style */}
        <div className="relative mb-3">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted/50" />
          <input
            type="text"
            placeholder="Search topics..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-9 pr-9 py-2.5 bg-bg-primary border border-border-glow rounded-xl text-sm text-text-primary placeholder:text-text-muted/40 focus:outline-none focus:border-gold/40 transition-colors"
          />
          {search && (
            <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted/50 hover:text-text-muted">
              <X size={16} />
            </button>
          )}
        </div>

        {/* Filter pills — CR style */}
        <div className="flex gap-1.5 overflow-x-auto pb-1 no-scrollbar">
          {['ALL', 'PENDING', 'DONE', 'LIGHT', 'MEDIUM', 'DEEP', 'DEEPEST'].map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1.5 rounded-lg text-xs font-rajdhani font-bold uppercase tracking-wider whitespace-nowrap transition-all ${
                filter === f
                  ? 'bg-gold/20 text-gold border border-gold/40'
                  : 'bg-bg-card/50 text-text-muted border border-transparent hover:bg-bg-card'
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* ═══════ BLOCK TABS — horizontal scroll ═══════ */}
      <div className="flex gap-1.5 overflow-x-auto px-3 pb-2 no-scrollbar">
        <button
          onClick={() => setSelectedBlock(null)}
          className={`px-3 py-1.5 rounded-lg text-xs font-rajdhani font-bold uppercase tracking-wider whitespace-nowrap transition-all shrink-0 ${
            selectedBlock === null
              ? 'bg-gold/20 text-gold border border-gold/40'
              : 'bg-bg-card/50 text-text-muted border border-transparent hover:bg-bg-card'
          }`}
        >
          All
        </button>
        {blocks.map(b => {
          const blockTopics = CURRICULUM.filter(t => t.block === b.id);
          const blockDone = blockTopics.filter(t => topics[t.id]?.done).length;
          return (
            <button
              key={b.id}
              onClick={() => setSelectedBlock(b.id === selectedBlock ? null : b.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-rajdhani font-bold whitespace-nowrap transition-all shrink-0 flex items-center gap-1.5 ${
                selectedBlock === b.id
                  ? 'bg-gold/20 text-gold border border-gold/40'
                  : 'bg-bg-card/50 text-text-muted border border-transparent hover:bg-bg-card'
              }`}
            >
              <span>B{b.id}</span>
              <span className="text-[10px] opacity-60">{blockDone}/{blockTopics.length}</span>
            </button>
          );
        })}
      </div>

      {/* ═══════ TOPIC LIST ═══════ */}
      <div className="px-3 space-y-4">
        {groupedTopics.map(group => {
          const blockTopics = CURRICULUM.filter(t => t.block === group.block);
          const blockDone = blockTopics.filter(t => topics[t.id]?.done).length;
          const blockProgress = blockTopics.length > 0 ? (blockDone / blockTopics.length) * 100 : 0;

          return (
            <div key={group.block}>
              {/* Block header — CR arena header style */}
              <div className="flex items-center gap-3 mb-2">
                <div className="flex-1 h-px bg-gradient-to-r from-transparent via-border-glow to-transparent" />
                <div className="text-[11px] font-rajdhani font-bold uppercase tracking-[2px] text-text-muted whitespace-nowrap">
                  Block {group.block} — {group.name}
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <span className="text-[11px] font-rajdhani font-bold text-text-muted">{blockDone}/{blockTopics.length}</span>
                  <div className="w-16 h-1.5 rounded-full bg-bg-primary overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all"
                      style={{
                        width: `${blockProgress}%`,
                        background: `linear-gradient(90deg, ${DEPTH_COLORS[group.topics[0]?.depth] || '#95a5a6'}, ${DEPTH_COLORS[group.topics[0]?.depth] || '#95a5a6'}80)`,
                      }}
                    />
                  </div>
                </div>
                <div className="flex-1 h-px bg-gradient-to-r from-border-glow via-transparent to-transparent" />
              </div>

              {/* Topic rows */}
              <div className="space-y-1">
                {group.topics.map(topic => (
                  <TopicRow
                    key={topic.id}
                    topic={topic}
                    state={topics[topic.id]}
                    onToggle={markTopicDone}
                    onNotes={() => handleOpenNotes(topic)}
                  />
                ))}
              </div>
            </div>
          );
        })}

        {groupedTopics.length === 0 && (
          <div className="text-center py-12 text-text-muted/50">
            <Search size={32} className="mx-auto mb-2 opacity-30" />
            <p className="text-sm">No topics found</p>
          </div>
        )}
      </div>

      {/* ═══════ XP POPUPS ═══════ */}
      <AnimatePresence>
        {xpPopups.map(popup => (
          <motion.div
            key={popup.id}
            initial={{ opacity: 1, y: 0, scale: 1.2 }}
            animate={{ opacity: 0, y: -80, scale: 0.8 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.5 }}
            className="fixed top-1/3 left-1/2 -translate-x-1/2 pointer-events-none z-50"
          >
            <div className="font-game text-3xl text-gold text-shadow-glow">
              +{popup.amount} XP!
            </div>
          </motion.div>
        ))}
      </AnimatePresence>

      {/* ═══════ NOTES MODAL ═══════ */}
      <AnimatePresence>
        {notesTopic && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4"
            onClick={() => setNotesTopic(null)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="game-panel w-full max-w-md p-4"
              onClick={e => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-3">
                <div>
                  <div className="text-[11px] text-text-muted uppercase tracking-wider">Notes</div>
                  <div className="text-sm text-text-primary mt-0.5">{notesTopic.title}</div>
                </div>
                <button onClick={() => setNotesTopic(null)} className="text-text-muted hover:text-text-primary">
                  <X size={20} />
                </button>
              </div>
              <textarea
                value={notesText}
                onChange={e => setNotesText(e.target.value)}
                placeholder="Write your notes here..."
                className="w-full h-40 bg-bg-primary border border-border-glow rounded-lg p-3 text-sm text-text-primary placeholder:text-text-muted/30 focus:outline-none focus:border-gold/40 resize-none"
              />
              <div className="flex items-center justify-between mt-3">
                <div className="flex items-center gap-1 text-[11px] text-cyan-xp">
                  <Zap size={12} />
                  <span>+15 XP bonus for notes</span>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => setNotesTopic(null)} className="btn-cr btn-cr-sm bg-bg-card text-text-muted border-border-glow">
                    Cancel
                  </button>
                  <button onClick={handleSaveNotes} className="btn-cr btn-cr-sm btn-cr-gold">
                    Save
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
