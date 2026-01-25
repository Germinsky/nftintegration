import { useState } from 'react';
import { useAccount, useWriteContract, useReadContract } from 'wagmi';
import { parseAbi } from 'viem';
import { Music, Download, ExternalLink, Award, CheckCircle2 } from 'lucide-react';
import './SongList.css';

const REWARDS_ABI = parseAbi([
  'function claimReward(string calldata songId) external',
  'function hasClaimed(address, string) public view returns (bool)',
  'function rewardAmount() public view returns (uint256)',
  'event RewardClaimed(address indexed user, string songId, uint256 amount)'
]);

export default function SongList({ songs, rewardsAddress }) {
  const { address, isConnected } = useAccount();
  const { writeContract, isPending } = useWriteContract();
  const [listened, setListened] = useState({});
  const [currentlyPlaying, setCurrentlyPlaying] = useState(null);

  const handlePlay = (songId) => {
    setCurrentlyPlaying(songId);
  };

  const handleEnded = (songId) => {
    setListened(prev => ({ ...prev, [songId]: true }));
    // Keep the song marked as having been played even after it ends
    setCurrentlyPlaying(null);
  };

  const handleClaim = async (songId) => {
    console.log('Claim button clicked for song:', songId);
    console.log('Connected:', isConnected, 'Address:', address);
    console.log('Rewards Address:', rewardsAddress);
    
    if (!isConnected || !address) {
      alert('Please connect your wallet first');
      return;
    }

    // Check if rewards address is still a placeholder
    if (rewardsAddress === '0xYourDeployedRewardsContractHere') {
      alert('Rewards contract not yet deployed. Please deploy the contract first.');
      console.error('Rewards address is still a placeholder:', rewardsAddress);
      return;
    }

    try {
      console.log('Attempting to claim reward...');
      await writeContract({
        address: rewardsAddress,
        abi: REWARDS_ABI,
        functionName: 'claimReward',
        args: [songId],
      });
      console.log('Claim transaction submitted successfully');
    } catch (error) {
      console.error('Failed to claim reward:', error);
      alert('Failed to claim reward. See console for details.');
    }
  };

  return (
    <div className="song-list">
      <h2>🎶 Recent Songs</h2>
      <div className="songs-grid">
        {songs.map((song) => (
          <SongCard
            key={song.id}
            song={song}
            address={address}
            isConnected={isConnected}
            rewardsAddress={rewardsAddress}
            listened={listened[song.id]}
            currentlyPlaying={currentlyPlaying === song.id}
            onPlay={() => handlePlay(song.id)}
            onEnded={() => handleEnded(song.id)}
            onClaim={() => handleClaim(song.id)}
            isPending={isPending}
          />
        ))}
      </div>
    </div>
  );
}

function SongCard({ 
  song, 
  address, 
  isConnected, 
  rewardsAddress, 
  listened, 
  currentlyPlaying, 
  onPlay, 
  onEnded, 
  onClaim,
  isPending 
}) {
  const { data: hasClaimed } = useReadContract({
    address: rewardsAddress,
    abi: REWARDS_ABI,
    functionName: 'hasClaimed',
    args: address ? [address, song.id] : undefined,
    enabled: !!address && isConnected,
  });

  const canClaim = isConnected && listened && !hasClaimed;
  const alreadyClaimed = hasClaimed;

  return (
    <div className="song-card">
      <div className="song-card-header">
        {song.image && (
          <img src={song.image} alt={song.title} className="song-image" />
        )}
        <div className="song-overlay">
          <Music className="music-icon" />
        </div>
      </div>

      <div className="song-card-body">
        <h3 className="song-title">{song.title}</h3>
        <p className="song-date">{song.date}</p>
        
        {song.headlines && (
          <p className="song-description">{song.headlines.substring(0, 100)}...</p>
        )}

        <div className="audio-section">
          <audio
            controls
            className="audio-player"
            onPlay={onPlay}
            onEnded={onEnded}
          >
            <source src={song.audioUrl} type="audio/wav" />
            <source src={song.audioUrl.replace('.wav', '.mp3')} type="audio/mpeg" />
            Your browser does not support the audio element.
          </audio>
        </div>

        <div className="song-actions">
          <button
            className={`claim-button ${canClaim ? 'ready' : ''} ${alreadyClaimed ? 'claimed' : ''}`}
            onClick={onClaim}
            disabled={!canClaim || isPending || alreadyClaimed}
          >
            {alreadyClaimed ? (
              <>
                <CheckCircle2 size={16} />
                Claimed
              </>
            ) : isPending ? (
              'Claiming...'
            ) : canClaim ? (
              <>
                <Award size={16} />
                Claim PROPH
              </>
            ) : !isConnected ? (
              'Connect Wallet'
            ) : !listened ? (
              'Listen First'
            ) : (
              'Claim PROPH'
            )}
          </button>

          <div className="secondary-actions">
            {song.downloadUrl && (
              <a 
                href={song.downloadUrl} 
                download 
                className="icon-button"
                title="Download"
              >
                <Download size={18} />
              </a>
            )}
            {song.blogUrl && (
              <a 
                href={song.blogUrl} 
                target="_blank" 
                rel="noopener noreferrer"
                className="icon-button"
                title="Read on blog"
              >
                <ExternalLink size={18} />
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
