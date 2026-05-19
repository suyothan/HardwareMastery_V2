import { useState } from 'react';
import { useGameStore } from '../lib/gameStore';
import { Settings as SettingsIcon, User, Key, Calendar, RotateCcw, Download } from 'lucide-react';

export default function Settings() {
  const profile = useGameStore(s => s.profile);
  const updateProfile = useGameStore(s => s.updateProfile);
  const setDeadline = useGameStore(s => s.setDeadline);
  const resetProgress = useGameStore(s => s.resetProgress);

  const [name, setName] = useState(profile.name);
  const [deadline, setDeadlineValue] = useState(profile.deadlineDate);
  const [geminiKey, setGeminiKey] = useState(
    () => localStorage.getItem('gemini_api_key') || import.meta.env.VITE_GEMINI_API_KEY || ''
  );
  const [resetConfirm, setResetConfirm] = useState('');
  const [showReset, setShowReset] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleSaveName = () => {
    updateProfile({ name });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleSaveDeadline = () => {
    setDeadline(deadline);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleReset = () => {
    if (resetConfirm === 'RESET') {
      resetProgress();
      setShowReset(false);
      setResetConfirm('');
    }
  };

  const handleExport = () => {
    const state = useGameStore.getState();
    const exportData = {
      profile: state.profile,
      topics: state.topics,
      cards: state.cards,
      chests: state.chests,
      deck: state.deck,
      achievements: state.achievements,
      battleHistory: state.battleHistory,
      activityLog: state.activityLog,
      exportDate: new Date().toISOString(),
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `hardware-mastery-backup-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="p-4 lg:p-6 max-w-2xl mx-auto">
      <div className="flex items-center gap-2 mb-6">
        <SettingsIcon size={24} className="text-text-muted" />
        <h1 className="text-2xl font-game font-bold text-text-primary">Settings</h1>
      </div>

      {/* Saved notification */}
      {saved && (
        <div className="mb-4 p-3 rounded-lg bg-green-common/10 border border-green-common/30 text-green-common text-sm">
          Settings saved successfully!
        </div>
      )}

      {/* Player Name */}
      <div className="game-panel p-5 mb-4">
        <div className="flex items-center gap-2 mb-3">
          <User size={16} className="text-text-muted" />
          <span className="text-text-primary font-medium">Player Name</span>
        </div>
        <div className="flex gap-2">
          <input
            type="text"
            value={name}
            onChange={e => setName(e.target.value)}
            className="flex-1 bg-bg-primary border border-border-glow rounded-lg px-4 py-2 text-text-primary focus:outline-none focus:border-gold/50"
          />
          <button
            onClick={handleSaveName}
            className="btn-cr btn-cr-sm btn-cr-gold"
          >
            Save
          </button>
        </div>
      </div>

      {/* Deadline */}
      <div className="game-panel p-5 mb-4">
        <div className="flex items-center gap-2 mb-3">
          <Calendar size={16} className="text-text-muted" />
          <span className="text-text-primary font-medium">Season Deadline</span>
        </div>
        <div className="flex gap-2">
          <input
            type="date"
            value={deadline}
            onChange={e => setDeadlineValue(e.target.value)}
            className="flex-1 bg-bg-primary border border-border-glow rounded-lg px-4 py-2 text-text-primary focus:outline-none focus:border-gold/50"
          />
          <button
            onClick={handleSaveDeadline}
            className="btn-cr btn-cr-sm btn-cr-gold"
          >
            Save
          </button>
        </div>
      </div>

      {/* API Key */}
      <div className="game-panel p-5 mb-4">
        <div className="flex items-center gap-2 mb-3">
          <Key size={16} className="text-text-muted" />
          <span className="text-text-primary font-medium">Gemini API Key</span>
        </div>
        <div className="text-text-muted text-sm mb-3">
          Get your free API key from{' '}
          <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noopener noreferrer" className="text-cyan-accent hover:underline">
            Google AI Studio
          </a>
        </div>
        <input
          type="password"
          value={geminiKey}
          onChange={e => setGeminiKey(e.target.value)}
          placeholder="Enter your Gemini API key..."
          className="w-full bg-bg-primary border border-border-glow rounded-lg px-4 py-2 text-text-primary placeholder-text-muted focus:outline-none focus:border-gold/50"
        />
        <div className="flex items-center justify-between mt-2 gap-2">
          <div className="text-text-muted text-xs">
            Saved locally in your browser. For permanent use, set <code>VITE_GEMINI_API_KEY</code> in <code>.env</code>.
          </div>
          <button
            onClick={() => {
              const trimmed = geminiKey.trim();
              if (trimmed) localStorage.setItem('gemini_api_key', trimmed);
              else localStorage.removeItem('gemini_api_key');
              setSaved(true);
              setTimeout(() => setSaved(false), 2000);
            }}
            className="btn-cr btn-cr-sm btn-cr-blue shrink-0"
          >
            Save Key
          </button>
        </div>
      </div>

      {/* Export */}
      <div className="game-panel p-5 mb-4">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Download size={16} className="text-text-muted" />
              <span className="text-text-primary font-medium">Export Progress</span>
            </div>
            <div className="text-text-muted text-sm">Download your progress as a JSON file</div>
          </div>
          <button onClick={handleExport} className="btn-cr btn-cr-sm btn-cr-blue">
            Export
          </button>
        </div>
      </div>

      {/* Reset */}
      <div className="game-panel p-5 border-red-danger/30">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <RotateCcw size={16} className="text-red-danger" />
              <span className="text-red-danger font-medium">Reset Progress</span>
            </div>
            <div className="text-text-muted text-sm">This will permanently delete all your progress</div>
          </div>
          <button onClick={() => setShowReset(true)} className="btn-cr btn-cr-sm btn-cr-red">
            Reset
          </button>
        </div>
      </div>

      {/* Reset Confirmation Modal */}
      {showReset && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-bg-card rounded-xl border border-red-danger/30 p-6 w-full max-w-sm">
            <div className="text-red-danger font-game font-bold text-xl mb-2">Reset Progress?</div>
            <div className="text-text-muted text-sm mb-4">
              Type <span className="text-red-danger font-bold">RESET</span> to confirm. This cannot be undone.
            </div>
            <input
              type="text"
              value={resetConfirm}
              onChange={e => setResetConfirm(e.target.value)}
              placeholder="Type RESET..."
              className="w-full bg-bg-primary border border-border-glow rounded-lg px-4 py-2 text-text-primary placeholder-text-muted focus:outline-none focus:border-red-danger/50 mb-4"
            />
            <div className="flex gap-2">
              <button
                onClick={() => { setShowReset(false); setResetConfirm(''); }}
                className="btn-cr btn-cr-sm btn-cr-blue flex-1"
              >
                Cancel
              </button>
              <button
                onClick={handleReset}
                disabled={resetConfirm !== 'RESET'}
                className="btn-cr btn-cr-sm btn-cr-red flex-1 disabled:opacity-30 disabled:cursor-not-allowed"
              >
                Reset Everything
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
