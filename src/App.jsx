import { useState, useEffect } from 'react';
import { WagmiProvider, createConfig, http } from 'wagmi';
import { base } from 'wagmi/chains';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { RainbowKitProvider, getDefaultConfig, ConnectButton } from '@rainbow-me/rainbowkit';
import '@rainbow-me/rainbowkit/styles.css';
import SongList from './components/SongList';
import { fetchSongsFromBlog } from './utils/blogFetcher';
import './App.css';

const REWARDS_ADDRESS = '0x31E124D370F2F885fC12032887fF906c1f3B9D71';
const PROPH_ADDRESS = '0x1890E4f2668b98170B618bA45Bc1B5721ACf9575';

const config = getDefaultConfig({
  appName: 'Daily Vibes Rewards',
  projectId: 'e542ff314e26ff34de2d4fba98db47bb', // WalletConnect Cloud project
  chains: [base],
  transports: {
    [base.id]: http(),
  },
});

const queryClient = new QueryClient();

function AppContent() {
  const [songs, setSongs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  const loadSongs = async (isManualRefresh = false) => {
    try {
      if (isManualRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }
      const fetchedSongs = await fetchSongsFromBlog();
      setSongs(fetchedSongs);
      setError(null);
    } catch (err) {
      setError('Failed to load songs. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    // Initial load
    loadSongs();

    // Auto-refresh every 5 minutes to get newest songs
    const refreshInterval = setInterval(() => {
      console.log('Auto-refreshing songs...');
      loadSongs();
    }, 5 * 60 * 1000); // 5 minutes

    return () => clearInterval(refreshInterval);
  }, []);

  return (
    <div className="app">
      <header className="app-header">
        <div className="header-content">
          <div>
            <h1>🎵 Daily Vibes Rewards</h1>
            <p className="tagline">Listen to songs from Digital Prophets, earn PROPH tokens</p>
          </div>
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
            <button 
              onClick={() => loadSongs(true)} 
              disabled={refreshing}
              style={{
                padding: '0.5rem 1rem',
                borderRadius: '8px',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                background: refreshing ? 'rgba(108, 99, 255, 0.5)' : 'rgba(108, 99, 255, 0.8)',
                color: 'white',
                cursor: refreshing ? 'not-allowed' : 'pointer',
                fontSize: '0.9rem',
                fontWeight: '500',
                transition: 'all 0.2s'
              }}
            >
              {refreshing ? '🔄 Refreshing...' : '🔄 Refresh Songs'}
            </button>
            <ConnectButton />
          </div>
        </div>
      </header>

      <main className="app-main">
        {loading && (
          <div className="loading">
            <div className="spinner"></div>
            <p>Loading songs from digitalprophets.blog...</p>
          </div>
        )}

        {error && (
          <div className="error">
            <p>{error}</p>
          </div>
        )}

        {!loading && !error && songs.length > 0 && (
          <div className="content">
            <div className="info-card">
              <h2>How it Works</h2>
              <ol>
                <li>Connect your Base wallet using the button above</li>
                <li>Play any song all the way through</li>
                <li>Claim your PROPH reward tokens (once per song)</li>
                <li>Hold $PROPH to support Digital Prophets</li>
              </ol>
              <p className="proph-info">
                💰 PROPH Token: <code>{PROPH_ADDRESS}</code>
              </p>
            </div>

            <SongList songs={songs} rewardsAddress={REWARDS_ADDRESS} />
          </div>
        )}

        {!loading && !error && songs.length === 0 && (
          <div className="no-songs">
            <p>No songs found. Please check back later!</p>
          </div>
        )}
      </main>

      <footer className="app-footer">
        <p>
          Powered by <a href="https://digitalprophets.blog" target="_blank" rel="noopener noreferrer">
            Digital Prophets
          </a> • Built on <a href="https://base.org" target="_blank" rel="noopener noreferrer">Base</a>
        </p>
      </footer>
    </div>
  );
}

function App() {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider>
          <AppContent />
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}

export default App;
