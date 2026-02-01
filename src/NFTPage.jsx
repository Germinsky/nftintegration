import { useState } from 'react';
import { useAccount } from 'wagmi';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import NFTGallery from './components/NFTGallery';
import NFTMintButton from './components/NFTMintButton';
import './NFTPage.css';

export default function NFTPage() {
  const { isConnected } = useAccount();
  const [activeTab, setActiveTab] = useState('gallery');

  return (
    <div className="nft-page">
      <header className="nft-header">
        <div className="nft-header-content">
          <h1>🎵 Digital Prophets NFT Collection</h1>
          <p>Mint exclusive music NFTs and showcase your collection</p>
          <ConnectButton />
        </div>
      </header>

      <div className="nft-tabs">
        <button
          className={`nft-tab ${activeTab === 'gallery' ? 'active' : ''}`}
          onClick={() => setActiveTab('gallery')}
        >
          My Collection
        </button>
        <button
          className={`nft-tab ${activeTab === 'mint' ? 'active' : ''}`}
          onClick={() => setActiveTab('mint')}
        >
          Mint NFT
        </button>
      </div>

      <main className="nft-content">
        {activeTab === 'gallery' && (
          <NFTGallery maxDisplay={12} />
        )}

        {activeTab === 'mint' && (
          <div className="nft-mint-section">
            <div className="mint-intro">
              <h2>Mint Your Digital Prophets NFT</h2>
              <p>
                Earn NFTs by completing tracks and holding PROPH tokens. 
                Each NFT is a unique piece of the Digital Prophets music collection.
              </p>
            </div>

            <div className="mint-requirements">
              <h3>Requirements to Mint:</h3>
              <ul>
                <li>✅ Connect your wallet</li>
                <li>✅ Hold at least 100 PROPH tokens</li>
                <li>✅ Complete listening to a track</li>
              </ul>
            </div>

            {isConnected ? (
              <div className="mint-action">
                <h3>Mint Now</h3>
                <NFTMintButton
                  songTitle="Digital Prophets Collection"
                  trackCompleted={true}
                  requiresTrackPlay={false}
                  mintPrice="0"
                />
                <p className="mint-note">
                  💡 Tip: Play tracks on the main page to unlock track-specific NFTs!
                </p>
              </div>
            ) : (
              <div className="mint-connect">
                <p>Connect your wallet to mint NFTs</p>
                <ConnectButton />
              </div>
            )}

            <div className="nft-info">
              <h3>About Digital Prophets NFTs</h3>
              <ul>
                <li>🎨 Unique artwork for each track</li>
                <li>🔗 Stored on Base blockchain (low fees)</li>
                <li>💎 View on OpenSea and other marketplaces</li>
                <li>🎵 Unlock exclusive DAO benefits</li>
                <li>🏆 Collect them all for special rewards</li>
              </ul>
            </div>

            <div className="nft-contract">
              <h4>NFT Contract Details</h4>
              <div className="contract-info">
                <span className="label">Network:</span>
                <span className="value">Base (Chain ID: 8453)</span>
              </div>
              <div className="contract-info">
                <span className="label">Contract:</span>
                <span className="value">
                  <a
                    href="https://basescan.org/address/0xd8CfC327B23fBcdEe12802bA6cA97e1e7786bF47"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    0xd8CfC327B23fBcdEe12802bA6cA97e1e7786bF47
                  </a>
                </span>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
