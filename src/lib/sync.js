import { doc, onSnapshot, setDoc, getDoc } from 'firebase/firestore';
import { db, isFirebaseConfigured } from './firebase';
import { useGameStore } from './gameStore';

// Firestore document paths must have an EVEN number of segments
// (collection/doc/collection/doc...). Four segments here: collection "users",
// doc "main_user", collection "gameState", doc "current".
const USER_DOC_PATH = 'users/main_user/gameState/current';
let unsubscribe = null;
let writeTimeout = null;

// Persistable fields only — excludes transient UI state
const PERSIST_KEYS = ['profile', 'topics', 'cards', 'chests', 'deck', 'achievements', 'battleHistory', 'activityLog', 'currentArena'];

function extractPersistable(state) {
  const out = {};
  for (const k of PERSIST_KEYS) {
    if (state[k] !== undefined) out[k] = state[k];
  }
  return out;
}

// Deep compare to avoid unnecessary writes
function hasChanged(a, b) {
  return JSON.stringify(a) !== JSON.stringify(b);
}

// Start listening to Firestore
export function startSync() {
  if (!isFirebaseConfigured()) {
    console.log('Firebase not configured, using local state only');
    return;
  }

  let docRef;
  try {
    docRef = doc(db, USER_DOC_PATH);
  } catch (err) {
    console.error('Failed to build Firestore doc ref, sync disabled:', err);
    return;
  }

  // Listen for real-time updates
  unsubscribe = onSnapshot(docRef, (snapshot) => {
    if (snapshot.exists()) {
      const data = snapshot.data();
      const currentState = useGameStore.getState();
      const persistable = extractPersistable(data);
      const currentPersistable = extractPersistable(currentState);

      // Only update if persistable data is different
      if (hasChanged(persistable, currentPersistable)) {
        useGameStore.getState().loadState(persistable);
      }
    }
  }, (error) => {
    console.error('Firestore sync error:', error);
  });

  // Subscribe to store changes — only persistable fields, debounced
  let lastPersisted = JSON.stringify(extractPersistable(useGameStore.getState()));

  useGameStore.subscribe((state) => {
    const persistable = extractPersistable(state);
    const serialized = JSON.stringify(persistable);
    if (serialized === lastPersisted) return;

    if (writeTimeout) clearTimeout(writeTimeout);
    writeTimeout = setTimeout(() => {
      lastPersisted = serialized;
      setDoc(docRef, persistable, { merge: true }).catch(err => {
        console.error('Firestore write error:', err);
      });
    }, 500);
  });
}

// Stop listening
export function stopSync() {
  if (unsubscribe) {
    unsubscribe();
    unsubscribe = null;
  }
  if (writeTimeout) {
    clearTimeout(writeTimeout);
    writeTimeout = null;
  }
}

// One-time load
export async function loadFromFirebase() {
  if (!isFirebaseConfigured()) return false;

  try {
    const docRef = doc(db, USER_DOC_PATH);
    const snapshot = await getDoc(docRef);
    if (snapshot.exists()) {
      const loader = useGameStore.getState().loadState;
      if (typeof loader === 'function') {
        loader(extractPersistable(snapshot.data()));
      }
      return true;
    }
  } catch (error) {
    // Swallow — sync is a nice-to-have, never block rendering.
    console.error('Failed to load from Firebase:', error);
  }
  return false;
}
