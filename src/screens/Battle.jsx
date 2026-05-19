import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGameStore } from '../lib/gameStore';
import { CHARACTER_CARDS, RARITY_COLORS } from '../data/cards';
import { BOSSES, getRandomBosses } from '../data/bosses';
import { generateBattleQuestions, getFallbackQuestions } from '../lib/gemini';
import { BASE_DAMAGE, DAMAGE_PER_CARD_LEVEL, BOSS_DAMAGE_ON_WRONG, BOSS_DAMAGE_ON_TIMEOUT, QUESTIONS_PER_BATTLE, SECONDS_PER_QUESTION, COINS_BATTLE_WIN } from '../data/economy';
import { Swords, Shield, Zap, Clock, ChevronRight, Star, Trophy } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { CharacterArt, BossArt } from '../components/CharacterArt';

const PHASES = { DECK_SELECT: 0, BOSS_SELECT: 1, BATTLE: 2, RESULT: 3 };

export default function Battle() {
  const navigate = useNavigate();
  const cards = useGameStore(s => s.cards);
  const deck = useGameStore(s => s.deck);
  const recordBattle = useGameStore(s => s.recordBattle);
  const addChest = useGameStore(s => s.addChest);

  const [phase, setPhase] = useState(PHASES.DECK_SELECT);
  const [selectedDeck, setSelectedDeck] = useState([...deck]);
  const [bosses, setBosses] = useState([]);
  const [selectedBoss, setSelectedBoss] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [currentQ, setCurrentQ] = useState(0);
  const [bossHp, setBossHp] = useState(0);
  const [playerHp, setPlayerHp] = useState(500);
  const maxPlayerHp = 500;
  const [timer, setTimer] = useState(SECONDS_PER_QUESTION);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [loading, setLoading] = useState(false);
  const [battleResult, setBattleResult] = useState(null);
  const [combo, setCombo] = useState(0);
  const [damageNumbers, setDamageNumbers] = useState([]);
  const [screenShake, setScreenShake] = useState(false);
  const [bossHit, setBossHit] = useState(false);
  const [flashColor, setFlashColor] = useState(null);
  const [answerTime, setAnswerTime] = useState(Date.now());

  const unlockedCards = CHARACTER_CARDS.filter(c => cards[c.id]?.unlocked);

  // Timer
  useEffect(() => {
    if (phase !== PHASES.BATTLE || selectedAnswer || loading) return;
    const interval = setInterval(() => {
      setTimer(prev => {
        if (prev <= 1) { handleTimeout(); return 0; }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase, currentQ, selectedAnswer, loading]);

  const toggleDeckCard = (cardId) => {
    setSelectedDeck(prev => {
      const idx = prev.indexOf(cardId);
      if (idx !== -1) { const d = [...prev]; d[idx] = null; return d; }
      const empty = prev.indexOf(null);
      if (empty !== -1) { const d = [...prev]; d[empty] = cardId; return d; }
      return prev;
    });
  };

  const startBossSelect = () => {
    setBosses(getRandomBosses(3));
    setPhase(PHASES.BOSS_SELECT);
  };

  const startBattle = async (boss) => {
    setSelectedBoss(boss);
    setBossHp(boss.hp);
    setPlayerHp(maxPlayerHp);
    setCurrentQ(0);
    setCombo(0);
    setLoading(true);
    setPhase(PHASES.BATTLE);

    try {
      const deckCards = selectedDeck.filter(Boolean).map(id => CHARACTER_CARDS.find(c => c.id === id));
      const topics = deckCards.flatMap(c => c.topics);
      const qs = await generateBattleQuestions(topics);
      setQuestions(qs);
    } catch {
      setQuestions(getFallbackQuestions([]));
    }
    setLoading(false);
    setTimer(SECONDS_PER_QUESTION);
    setAnswerTime(Date.now());
  };

  const addDamageNumber = (text, color, x) => {
    const id = Date.now() + Math.random();
    setDamageNumbers(prev => [...prev, { id, text, color, x }]);
    setTimeout(() => setDamageNumbers(prev => prev.filter(d => d.id !== id)), 1200);
  };

  const handleAnswer = (answer) => {
    if (selectedAnswer) return;
    const elapsed = (Date.now() - answerTime) / 1000;
    setSelectedAnswer(answer);

    const question = questions[currentQ];
    const isCorrect = answer === question.correct;
    const deckCards = selectedDeck.filter(Boolean).map(id => CHARACTER_CARDS.find(c => c.id === id));
    const avgLevel = deckCards.reduce((sum, c) => sum + (cards[c.id]?.level || 1), 0) / deckCards.length;
    let damage = BASE_DAMAGE + (avgLevel * DAMAGE_PER_CARD_LEVEL);

    // Speed bonus
    let speedBonus = 0;
    if (elapsed < 5) speedBonus = Math.floor(damage * 0.5);

    // Combo bonus
    let comboMultiplier = 1;
    if (isCorrect) {
      const newCombo = combo + 1;
      setCombo(newCombo);
      comboMultiplier = 1 + (newCombo - 1) * 0.1;
    }

    const totalDamage = Math.floor((damage + speedBonus) * comboMultiplier);

    if (isCorrect) {
      setBossHp(prev => Math.max(0, prev - totalDamage));
      setBossHit(true);
      setFlashColor('green');
      addDamageNumber(`-${totalDamage}`, '#2ecc71', 40 + Math.random() * 20);
      if (speedBonus > 0) addDamageNumber(`CRIT!`, '#ffd166', 60);
      if (comboMultiplier > 1) addDamageNumber(`${combo + 1}x COMBO`, '#ff66ff', 30);
      setTimeout(() => setBossHit(false), 400);
    } else {
      setPlayerHp(prev => Math.max(0, prev - BOSS_DAMAGE_ON_WRONG));
      setCombo(0);
      setScreenShake(true);
      setFlashColor('red');
      addDamageNumber(`-${BOSS_DAMAGE_ON_WRONG}`, '#e74c3c', 50);
      setTimeout(() => setScreenShake(false), 500);
    }

    setTimeout(() => {
      setFlashColor(null);
      setShowExplanation(true);
    }, 600);
  };

  const handleTimeout = () => {
    setSelectedAnswer('TIMEOUT');
    setPlayerHp(prev => Math.max(0, prev - BOSS_DAMAGE_ON_TIMEOUT));
    setCombo(0);
    setScreenShake(true);
    setFlashColor('red');
    addDamageNumber(`-${BOSS_DAMAGE_ON_TIMEOUT}`, '#e74c3c', 50);
    setTimeout(() => { setScreenShake(false); setFlashColor(null); setShowExplanation(true); }, 500);
  };

  const nextQuestion = () => {
    setSelectedAnswer(null);
    setShowExplanation(false);
    setTimer(SECONDS_PER_QUESTION);
    setAnswerTime(Date.now());
    if (currentQ + 1 >= QUESTIONS_PER_BATTLE || playerHp <= 0 || bossHp <= 0) {
      endBattle();
    } else {
      setCurrentQ(prev => prev + 1);
    }
  };

  const endBattle = () => {
    const victory = bossHp <= 0;
    const result = {
      victory,
      boss: selectedBoss.name,
      damageDealt: Math.round(bossHp <= 0 ? selectedBoss.hp : selectedBoss.hp - bossHp),
      damageTaken: Math.round(maxPlayerHp - playerHp),
      xpEarned: Math.round(victory ? 200 + (selectedBoss.hp * 0.3) : 50),
      coinsEarned: victory ? COINS_BATTLE_WIN : 10,
      cardsUsed: selectedDeck.filter(Boolean),
      date: new Date().toISOString(),
    };
    setBattleResult(result);
    setPhase(PHASES.RESULT);
    recordBattle(result);
    if (victory) addChest('component_box');
  };

  // ── DECK SELECT ──
  if (phase === PHASES.DECK_SELECT) {
    return (
      <div className="p-3 pb-20 lg:pb-4 max-w-2xl mx-auto" style={{ minHeight: '100vh' }}>
        <div className="text-center mb-4">
          <h1 className="text-2xl font-game font-black text-gold text-shadow-game">Choose Your Deck</h1>
          <p className="text-text-muted text-sm">Select 4 cards for battle</p>
        </div>

        {/* Selected Slots */}
        <div className="flex gap-2 mb-4">
          {selectedDeck.map((cardId, i) => {
            const card = cardId ? CHARACTER_CARDS.find(c => c.id === cardId) : null;
            return (
              <motion.div
                key={i}
                whileTap={{ scale: 0.9 }}
                onClick={() => card && toggleDeckCard(card.id)}
                className="flex-1 aspect-[3/4] rounded-xl border-2 flex items-center justify-center cursor-pointer"
                style={card ? {
                  background: `linear-gradient(135deg, ${card.color1}30, ${card.color2}20)`,
                  borderColor: RARITY_COLORS[card.rarity],
                  boxShadow: `0 0 15px ${RARITY_COLORS[card.rarity]}30`,
                } : { borderColor: '#2a3158', borderStyle: 'dashed' }}
              >
                {card ? (
                  <div className="text-center">
                    <CharacterArt cardId={card.id} size={50} />
                    <div className="text-[10px] text-text-primary font-bold mt-1">{card.name}</div>
                    <div className="text-[9px] text-text-muted">LVL {cards[card.id]?.level || 1}</div>
                  </div>
                ) : <div className="text-text-muted text-sm">+</div>}
              </motion.div>
            );
          })}
        </div>

        {/* Available Cards */}
        <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 mb-4">
          {unlockedCards.map(card => {
            const isSelected = selectedDeck.includes(card.id);
            return (
              <motion.button
                key={card.id}
                whileTap={{ scale: 0.9 }}
                onClick={() => toggleDeckCard(card.id)}
                className={`p-2 rounded-xl border-2 text-left transition-all ${
                  isSelected ? 'border-gold bg-gold/10' : 'border-border-glow bg-bg-card'
                }`}
              >
                <div className="flex items-center gap-1.5 mb-0.5">
                  <CharacterArt cardId={card.id} size={30} />
                  <span className="text-xs font-bold text-text-primary">{card.name}</span>
                </div>
                <div className="text-[9px] text-text-muted">{card.domain}</div>
                <div className="text-[9px] text-gold font-rajdhani font-bold mt-0.5">
                  DMG: {card.damage + ((cards[card.id]?.level || 1) - 1) * 10}
                </div>
              </motion.button>
            );
          })}
        </div>

        <button
          onClick={startBossSelect}
          disabled={selectedDeck.filter(Boolean).length < 4}
          className="btn-cr btn-cr-gold w-full text-xl py-4 disabled:opacity-30 disabled:cursor-not-allowed"
        >
          <Swords size={24} />
          SELECT BOSS
        </button>
      </div>
    );
  }

  // ── BOSS SELECT ──
  if (phase === PHASES.BOSS_SELECT) {
    return (
      <div className="p-3 pb-20 lg:pb-4 max-w-2xl mx-auto" style={{ minHeight: '100vh' }}>
        <div className="text-center mb-4">
          <h1 className="text-2xl font-game font-black text-red-danger text-shadow-game">Choose Your Opponent</h1>
        </div>

        <div className="space-y-3">
          {bosses.map((boss, i) => (
            <motion.button
              key={boss.id}
              initial={{ x: -50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: i * 0.1 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => startBattle(boss)}
              className="w-full game-panel p-4 text-left flex items-center gap-4"
              style={{ borderColor: boss.color1 + '40' }}
            >
              <div
                className="w-16 h-16 rounded-xl flex items-center justify-center flex-shrink-0 overflow-hidden"
                style={{ background: `radial-gradient(circle, ${boss.color1}30, transparent 70%)` }}
              >
                <BossArt bossId={boss.id} size={60} />
              </div>
              <div className="flex-1">
                <div className="font-game font-bold text-text-primary">{boss.name}</div>
                <div className="text-text-muted text-xs mb-1">{boss.description}</div>
                <div className="flex items-center gap-3">
                  <span className="text-red-danger font-rajdhani font-bold text-sm">{boss.hp} HP</span>
                  <span className="text-text-muted text-xs">{boss.domain}</span>
                  <div className="flex gap-0.5">
                    {Array.from({ length: boss.difficulty }).map((_, j) => (
                      <Swords key={j} size={10} className="text-orange-legendary" />
                    ))}
                  </div>
                </div>
              </div>
              <ChevronRight size={20} className="text-text-muted" />
            </motion.button>
          ))}
        </div>

        <button onClick={() => setPhase(PHASES.DECK_SELECT)} className="text-text-muted text-sm mt-4 hover:text-text-primary">
          ← Back to deck
        </button>
      </div>
    );
  }

  // ── BATTLE ──
  if (phase === PHASES.BATTLE) {
    if (loading) {
      return (
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
              className="mb-4"
            >
              <BossArt bossId={selectedBoss?.id} size={80} />
            </motion.div>
            <div className="font-game font-bold text-xl text-gold">Preparing Battle...</div>
            <div className="text-text-muted text-sm mt-1">The quiz master is conjuring questions</div>
          </div>
        </div>
      );
    }

    const question = questions[currentQ];
    if (!question) return null;

    const bossMaxHp = selectedBoss.hp;
    const bossHpPct = (bossHp / bossMaxHp) * 100;
    const playerHpPct = (playerHp / maxPlayerHp) * 100;

    return (
      <div
        className={`min-h-screen flex flex-col relative overflow-hidden ${screenShake ? 'screen-shake' : ''}`}
      >
        {/* Flash overlay */}
        <AnimatePresence>
          {flashColor && (
            <motion.div
              initial={{ opacity: 0.3 }}
              animate={{ opacity: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
              className="fixed inset-0 z-50 pointer-events-none"
              style={{ background: flashColor === 'red' ? 'rgba(231,76,60,0.2)' : 'rgba(46,204,113,0.15)' }}
            />
          )}
        </AnimatePresence>

        {/* Floating damage numbers */}
        <AnimatePresence>
          {damageNumbers.map(d => (
            <motion.div
              key={d.id}
              initial={{ opacity: 1, y: 0, x: `${d.x}%` }}
              animate={{ opacity: 0, y: -80 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.2 }}
              className="fixed z-[60] pointer-events-none font-rajdhani font-black text-3xl"
              style={{ left: `${d.x}%`, top: '30%', color: d.color, textShadow: `0 0 10px ${d.color}` }}
            >
              {d.text}
            </motion.div>
          ))}
        </AnimatePresence>

        {/* ── BOSS AREA ── */}
        <div className="flex-shrink-0 p-3 pb-2">
          {/* Boss HP */}
          <div className="flex items-center justify-between mb-1.5">
            <div className="flex items-center gap-2">
              <BossArt bossId={selectedBoss.id} size={28} />
              <span className="font-game font-bold text-sm text-text-primary">{selectedBoss.name}</span>
            </div>
            <span className="font-rajdhani font-bold text-red-danger text-sm">{Math.round(bossHp)}/{bossMaxHp}</span>
          </div>
          <div className="progress-bar-game">
            <motion.div
              className="fill"
              animate={{ width: `${bossHpPct}%` }}
              transition={{ duration: 0.3 }}
              style={{ background: 'linear-gradient(90deg, #e74c3c, #ff6b6b)' }}
            />
          </div>

          {/* Boss visual */}
          <div className={`text-center py-4 ${bossHit ? 'boss-hit' : ''}`}>
            <motion.div
              animate={bossHit ? { x: [0, -10, 10, -5, 5, 0] } : {}}
              className="inline-block"
              style={{ filter: `drop-shadow(0 0 30px ${selectedBoss.color1}60)` }}
            >
              <BossArt bossId={selectedBoss.id} size={100} />
            </motion.div>
          </div>

          {/* Combo */}
          {combo > 1 && (
            <motion.div
              key={combo}
              initial={{ scale: 1.5 }}
              animate={{ scale: 1 }}
              className="text-center"
            >
              <span className="font-rajdhani font-black text-xl text-purple-epic" style={{ textShadow: '0 0 15px #9b59b6' }}>
                {combo}x COMBO!
              </span>
            </motion.div>
          )}
        </div>

        {/* ── QUESTION ── */}
        <div className="flex-1 px-3 flex flex-col">
          <div className="game-panel p-4 mb-3 flex-shrink-0" style={{ borderColor: '#f4a62340' }}>
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] px-2 py-0.5 rounded bg-bg-elevated text-text-muted">
                {question.topic} • {question.depth}
              </span>
              <span className="font-rajdhani font-bold text-gold text-sm">
                Q{currentQ + 1}/{QUESTIONS_PER_BATTLE}
              </span>
            </div>
            <div className="text-text-primary text-base leading-relaxed">{question.question}</div>
          </div>

          {/* Timer */}
          <div className="flex items-center gap-2 mb-3 flex-shrink-0">
            <Clock size={14} className="text-cyan-accent" />
            <div className="flex-1 progress-bar-game" style={{ height: 8 }}>
              <motion.div
                className="fill"
                animate={{ width: `${(timer / SECONDS_PER_QUESTION) * 100}%` }}
                transition={{ duration: 1 }}
                style={{ background: timer > 10 ? 'linear-gradient(90deg, #00d4ff, #00a0cc)' : timer > 5 ? 'linear-gradient(90deg, #f4a623, #e67e22)' : 'linear-gradient(90deg, #e74c3c, #ff4444)' }}
              />
            </div>
            <span className={`font-rajdhani font-bold text-sm w-8 text-right ${timer <= 5 ? 'text-red-danger' : 'text-cyan-accent'}`}>{timer}</span>
          </div>

          {/* Answers */}
          <div className="grid grid-cols-1 gap-2 mb-3 flex-shrink-0">
            {question.options.map((opt, i) => {
              const letter = opt.charAt(0);
              const isSelected = selectedAnswer === letter;
              const isCorrect = letter === question.correct;
              const showResult = showExplanation;

              let style = { borderColor: '#2a3158', background: 'linear-gradient(180deg, #252b4a, #1e2440)' };
              if (showResult && isCorrect) style = { borderColor: '#2ecc71', background: 'linear-gradient(180deg, #0d2a18, #1e2440)' };
              else if (showResult && isSelected && !isCorrect) style = { borderColor: '#e74c3c', background: 'linear-gradient(180deg, #2a0d0d, #1e2440)' };

              return (
                <motion.button
                  key={i}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => handleAnswer(letter)}
                  disabled={!!selectedAnswer}
                  className="p-3 rounded-xl border-2 text-left transition-all"
                  style={style}
                >
                  <span className="text-text-primary text-sm">{opt}</span>
                </motion.button>
              );
            })}
          </div>

          {/* Explanation */}
          <AnimatePresence>
            {showExplanation && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="game-panel p-3 mb-3 flex-shrink-0"
              >
                <div className="text-sm mb-1">
                  {selectedAnswer === question.correct
                    ? <span className="text-green-common font-bold">✓ Correct!</span>
                    : selectedAnswer === 'TIMEOUT'
                    ? <span className="text-orange-legendary font-bold">⏰ Time's up!</span>
                    : <span className="text-red-danger font-bold">✗ Wrong!</span>}
                </div>
                <div className="text-text-muted text-xs">{question.explanation}</div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Next Button */}
          {showExplanation && (
            <motion.button
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              onClick={nextQuestion}
              className="btn-cr btn-cr-gold w-full text-lg py-3 mb-3 flex-shrink-0"
            >
              {currentQ + 1 >= QUESTIONS_PER_BATTLE ? 'VIEW RESULTS' : 'NEXT QUESTION'}
              <ChevronRight size={20} />
            </motion.button>
          )}
        </div>

        {/* ── PLAYER HP ── */}
        <div className="flex-shrink-0 p-3 pt-0">
          <div className="game-panel p-2.5">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs text-text-primary font-bold">YOUR HP</span>
              <span className="font-rajdhani font-bold text-green-common text-xs">{Math.round(playerHp)}/{maxPlayerHp}</span>
            </div>
            <div className="progress-bar-game" style={{ height: 8 }}>
              <motion.div
                className="fill"
                animate={{ width: `${playerHpPct}%` }}
                transition={{ duration: 0.3 }}
                style={{ background: 'linear-gradient(90deg, #2ecc71, #00d4ff)' }}
              />
            </div>
            <div className="flex gap-2 mt-1.5">
              {selectedDeck.filter(Boolean).map(cardId => {
                const card = CHARACTER_CARDS.find(c => c.id === cardId);
                return (
                  <div key={cardId} className="flex items-center gap-1 text-[9px] text-text-muted">
                    <CharacterArt cardId={card.id} size={16} />
                    <span>{card.name}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ── RESULT ──
  if (phase === PHASES.RESULT && battleResult) {
    const resultTitle = battleResult.victory ? "VICTORY!" : "DEFEAT";
    const resultColor = battleResult.victory ? '#f4a623' : '#e74c3c';

    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4 relative overflow-hidden">
        {/* Victory/Defeat background effect */}
        <div
          className="absolute inset-0 opacity-20"
          style={{
            background: battleResult.victory
              ? 'radial-gradient(circle at center, #f4a623, transparent 70%)'
              : 'radial-gradient(circle at center, #e74c3c, transparent 70%)',
          }}
        />
        {/* Gold explosion particles for victory */}
        {battleResult.victory && Array.from({ length: 12 }).map((_, i) => (
          <motion.div
            key={i}
            initial={{ x: 0, y: 0, scale: 1, opacity: 1 }}
            animate={{
              x: (Math.random() - 0.5) * 300,
              y: (Math.random() - 0.5) * 300,
              scale: 0,
              opacity: 0,
            }}
            transition={{ duration: 1.5, delay: 0.2 + i * 0.05 }}
            className="absolute w-3 h-3 rounded-full bg-gold"
            style={{ left: '50%', top: '30%' }}
          />
        ))}

        <motion.div
          initial={{ scale: 0.3, opacity: 0, rotate: -10 }}
          animate={{ scale: 1, opacity: 1, rotate: 0 }}
          transition={{ type: 'spring', damping: 10 }}
          className="text-center mb-6 relative z-10"
        >
          <motion.div
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="text-7xl mb-3"
          >
            {battleResult.victory ? <Trophy size={70} className="text-gold mx-auto drop-shadow-[0_0_20px_#f4a623]" /> : <Swords size={70} className="text-red-danger mx-auto drop-shadow-[0_0_20px_#e74c3c]" />}
          </motion.div>
          <div
            className="text-5xl font-game font-black mb-1"
            style={{ color: resultColor, textShadow: `0 0 40px ${resultColor}80` }}
          >
            {resultTitle}
          </div>
          <div className="text-text-muted text-sm">vs {battleResult.boss}</div>
        </motion.div>

        <motion.div
          initial={{ y: 40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="w-full max-w-sm space-y-3 mb-6"
        >
          <div className="game-panel p-3 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-text-muted">Damage Dealt</span>
              <span className="font-rajdhani font-bold text-gold">{battleResult.damageDealt}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-text-muted">Damage Taken</span>
              <span className="font-rajdhani font-bold text-red-danger">{battleResult.damageTaken}</span>
            </div>
            <div className="border-t border-border-glow pt-2 space-y-1.5">
              <div className="flex justify-between text-sm">
                <span className="text-text-muted">XP Earned</span>
                <span className="font-rajdhani font-bold text-gold">+{battleResult.xpEarned}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-text-muted">Coins Earned</span>
                <span className="font-rajdhani font-bold text-gold-light">+{battleResult.coinsEarned}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-text-muted">Mastery Points</span>
                <span className="font-rajdhani font-bold text-cyan-accent">+{battleResult.victory ? 100 : 20}</span>
              </div>
              {battleResult.victory && (
                <div className="flex justify-between text-sm">
                  <span className="text-text-muted">Chest</span>
                  <span className="text-text-primary">⬜ Component Box</span>
                </div>
              )}
            </div>
          </div>
        </motion.div>

        <div className="flex gap-3 w-full max-w-sm">
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => { setPhase(PHASES.DECK_SELECT); setSelectedDeck([...deck]); setBattleResult(null); }}
            className="btn-cr btn-cr-gold flex-1"
          >
            <Swords size={18} />
            BATTLE AGAIN
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => navigate('/cards')}
            className="btn-cr btn-cr-blue flex-1"
          >
            CARDS
          </motion.button>
        </div>
      </div>
    );
  }

  return null;
}
