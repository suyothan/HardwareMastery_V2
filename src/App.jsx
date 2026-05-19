import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useEffect } from 'react';
import Layout from './components/Layout';
import Home from './screens/Home';
import Curriculum from './screens/Curriculum';
import Battle from './screens/Battle';
import Cards from './screens/Cards';
import Profile from './screens/Profile';
import Settings from './screens/Settings';
import { startSync, loadFromFirebase } from './lib/sync';
import ErrorBoundary from './components/ErrorBoundary';
import ScrollManager from './components/ScrollManager';

function App() {
  useEffect(() => {
    // Never let cloud sync failures crash the UI.
    try {
      loadFromFirebase().catch((err) =>
        console.error('loadFromFirebase failed:', err)
      );
    } catch (err) {
      console.error('loadFromFirebase threw synchronously:', err);
    }
    try {
      startSync();
    } catch (err) {
      console.error('startSync threw:', err);
    }
  }, []);

  return (
    <ErrorBoundary>
      <Router>
        <ScrollManager />
        <Layout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/curriculum" element={<Curriculum />} />
            <Route path="/battle" element={<Battle />} />
            <Route path="/cards" element={<Cards />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/settings" element={<Settings />} />
          </Routes>
        </Layout>
      </Router>
    </ErrorBoundary>
  );
}

export default App;
