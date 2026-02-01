# 🎵 Digital Prophets NFT Integration Guide

Complete setup guide for integrating NFTs with thirdweb into your Digital Prophets blog.

## 📋 Overview

This integration adds:
- ✅ NFT minting with $PROPH token gating
- ✅ Track-based mint unlocking (listen to earn)
- ✅ NFT gallery to display user collections
- ✅ Wallet connection via RainbowKit
- ✅ Base blockchain integration
- ✅ Secure, production-ready code

## 🚀 Quick Start

### 1. Install Dependencies

```bash
cd /home/digitalprophets/daily-vibes-rewards
npm install
```

Dependencies already installed:
- `@thirdweb-dev/react` - React SDK for Web3
- `@thirdweb-dev/sdk` - Core thirdweb functionality
- `ethers@^5` - Ethereum library
- `wagmi` - React hooks for Ethereum (already installed)
- `@rainbow-me/rainbowkit` - Wallet connection (already installed)

### 2. Build the Application

```bash
npm run build
```

This will create production files in `dist/` directory.

### 3. Deploy to WordPress

Option A: Use existing WordPress plugin
```bash
# The plugin is already set up at daily-vibes-embed.php
# Just upload daily-vibes-fixed-final.zip to WordPress
```

Option B: Create new NFT-specific page
```bash
# Add [daily_vibes_nft] shortcode to any WordPress page
```

## 📁 File Structure

```
src/
├── components/
│   ├── NFTMintButton.jsx      # Mint button with gating logic
│   ├── NFTGallery.jsx          # Display user's NFT collection
│   └── SongList.jsx            # Enhanced with NFT minting
├── NFTPage.jsx                 # Dedicated NFT page
├── NFTPage.css                 # NFT styling
└── App.jsx                     # Main app (existing)
```

## 🎨 Components Usage

### 1. NFT Mint Button

```jsx
import NFTMintButton from './components/NFTMintButton';

<NFTMintButton
  songTitle="Files Unsealed - The Island Burns Tonight"
  trackCompleted={true}          // Has user finished listening?
  requiresTrackPlay={true}       // Require track completion?
  mintPrice="0"                  // Price in ETH (0 = free)
  disabled={false}               // Manual disable
/>
```

**Features:**
- ✅ Checks $PROPH balance (requires 100 PROPH)
- ✅ Verifies track completion
- ✅ Shows loading states
- ✅ Displays transaction hash on BaseScan
- ✅ Error handling with user-friendly messages

### 2. NFT Gallery

```jsx
import NFTGallery from './components/NFTGallery';

<NFTGallery maxDisplay={12} />
```

**Features:**
- ✅ Fetches all NFTs owned by connected wallet
- ✅ Displays images and metadata
- ✅ Links to OpenSea for each NFT
- ✅ Responsive grid layout
- ✅ Loading and error states

### 3. Complete NFT Page

```jsx
import NFTPage from './NFTPage';

<NFTPage />
```

**Features:**
- ✅ Tab navigation (Gallery / Mint)
- ✅ Wallet connection prompt
- ✅ Minting requirements checklist
- ✅ Contract information
- ✅ Educational content

## 🔧 Configuration

### NFT Contract Settings

Edit in `src/components/NFTMintButton.jsx`:

```jsx
// Line 5-6: NFT contract address on Base
const NFT_CONTRACT = '0xd8CfC327B23fBcdEe12802bA6cA97e1e7786bF47';
const PROPH_TOKEN = '0x1890E4f2668b98170B618bA45Bc1B5721ACf9575';

// Line 9: Minimum $PROPH required to mint
const MIN_PROPH_BALANCE = parseEther('100'); // 100 PROPH tokens
```

### Mint Price

Set per-component:

```jsx
// Free minting
<NFTMintButton mintPrice="0" />

// Paid minting (0.001 ETH)
<NFTMintButton mintPrice="0.001" />

// Higher price (0.01 ETH)
<NFTMintButton mintPrice="0.01" />
```

### Track Gating

```jsx
// Require track completion
<NFTMintButton requiresTrackPlay={true} trackCompleted={hasListened} />

// No track requirement (direct mint)
<NFTMintButton requiresTrackPlay={false} />
```

## 🎵 Integration with Music System

The NFT system integrates with your existing song rewards:

```jsx
// In SongList.jsx - Already integrated!
import NFTMintButton from './NFTMintButton';

function SongCard({ song, listened }) {
  return (
    <div className="song-card">
      {/* Audio player */}
      <audio onEnded={() => setListened(true)} />
      
      {/* Claim PROPH rewards */}
      <button onClick={claimReward}>Claim PROPH</button>
      
      {/* Mint NFT - unlocked after listening */}
      <NFTMintButton
        songTitle={song.title}
        trackCompleted={listened}
        requiresTrackPlay={true}
        mintPrice="0"
      />
    </div>
  );
}
```

## 🔒 Security Features

### 1. Balance Gating
```jsx
// Checks user has enough PROPH tokens
const { data: prophBalance } = useReadContract({
  address: PROPH_TOKEN,
  abi: ERC20_ABI,
  functionName: 'balanceOf',
  args: [userAddress],
});

const hasEnoughPROPH = prophBalance >= MIN_PROPH_BALANCE;
```

### 2. Track Completion Verification
```jsx
// Only enable mint after track ends
const [listened, setListened] = useState(false);

<audio onEnded={() => setListened(true)} />

<NFTMintButton 
  trackCompleted={listened}
  requiresTrackPlay={true}
/>
```

### 3. Transaction Confirmation
```jsx
// Wait for blockchain confirmation
const { isLoading, isSuccess } = useWaitForTransactionReceipt({
  hash: transactionHash,
});
```

### 4. Error Handling
```jsx
try {
  await writeContract({ ... });
} catch (error) {
  console.error('Mint error:', error);
  // Show user-friendly error message
}
```

## 🌐 WordPress Integration

### Method 1: Add to Existing Pages

Edit your existing WordPress posts and add the NFT components inline with song players.

**Already integrated in:** `src/components/SongList.jsx` - Each song card now has a mint button.

### Method 2: Create Dedicated NFT Page

1. Create new WordPress page: "NFT Collection"
2. Add shortcode: `[daily_vibes_nft]`
3. Update `daily-vibes-embed.php`:

```php
function daily_vibes_nft_shortcode() {
    ob_start();
    ?>
    <div id="daily-vibes-nft-root"></div>
    <script>
        // Render NFTPage component instead of App
        import('./NFTPage.jsx');
    </script>
    <?php
    return ob_get_clean();
}
add_shortcode('daily_vibes_nft', 'daily_vibes_nft_shortcode');
```

### Method 3: Add Navigation

Update `App.jsx` to add NFT page link:

```jsx
<nav>
  <a href="/">Songs</a>
  <a href="/nfts">NFT Collection</a>
</nav>
```

## 📱 Responsive Design

All components are mobile-responsive:

```css
/* Mobile (< 768px) */
@media (max-width: 768px) {
  .nft-grid {
    grid-template-columns: 1fr; /* Single column */
  }
  
  .nft-mint-button {
    font-size: 0.875rem; /* Smaller text */
  }
}

/* Tablet (768px - 1024px) */
@media (min-width: 768px) and (max-width: 1024px) {
  .nft-grid {
    grid-template-columns: repeat(2, 1fr); /* 2 columns */
  }
}

/* Desktop (> 1024px) */
@media (min-width: 1024px) {
  .nft-grid {
    grid-template-columns: repeat(3, 1fr); /* 3 columns */
  }
}
```

## 🎨 Customization

### Change Colors

Edit `src/NFTPage.css`:

```css
/* Primary gradient */
.nft-mint-button.primary {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

/* Change to your brand colors */
.nft-mint-button.primary {
  background: linear-gradient(135deg, #FF6B6B 0%, #4ECDC4 100%);
}
```

### Custom NFT Card Design

```css
.nft-card {
  background: white;
  border-radius: 12px;
  /* Add custom styles */
  border: 2px solid #667eea;
  background: linear-gradient(to bottom, #fff, #f8f9fa);
}
```

### Add Music Theme

```css
.nft-card::before {
  content: '🎵';
  position: absolute;
  top: 10px;
  right: 10px;
  font-size: 2rem;
  opacity: 0.3;
}
```

## 🧪 Testing

### 1. Local Testing

```bash
npm run dev
# Visit http://localhost:5173
```

### 2. Test Wallet Connection

- Connect with MetaMask/WalletConnect
- Switch to Base network
- Verify wallet address displays

### 3. Test PROPH Balance Check

```javascript
// Open browser console
const balance = await readContract({
  address: '0x1890E4f2668b98170B618bA45Bc1B5721ACf9575',
  abi: [{ name: 'balanceOf', ... }],
  functionName: 'balanceOf',
  args: ['YOUR_WALLET_ADDRESS'],
});
console.log('PROPH Balance:', formatEther(balance));
```

### 4. Test NFT Minting

1. Ensure you have > 100 PROPH
2. Play a track to completion
3. Click "Mint NFT" button
4. Confirm transaction in wallet
5. Wait for confirmation
6. Check BaseScan for transaction
7. NFT should appear in gallery

### 5. Test NFT Gallery

1. Connect wallet that owns NFTs
2. Navigate to NFT gallery
3. Verify NFTs load with images
4. Click "View" link → opens OpenSea
5. Test responsive layout (mobile/desktop)

## 🚨 Troubleshooting

### Issue: "Need 100 PROPH" message

**Solution:** 
```bash
# Check PROPH balance
# Make sure user has claimed rewards from listening to songs
# Or adjust MIN_PROPH_BALANCE in NFTMintButton.jsx
```

### Issue: NFT images not loading

**Solution:**
```jsx
// Gallery uses fallback placeholder
// Check if tokenURI is valid IPFS/HTTP URL
// Verify CORS settings on image host
```

### Issue: Transaction fails

**Solution:**
```bash
# Check gas fees (Base is usually cheap)
# Verify contract has mint() function
# Ensure wallet has ETH for gas
# Check if NFT contract is paused/has supply limit
```

### Issue: Gallery shows "No NFTs"

**Solution:**
```jsx
// Verify NFT contract supports ERC721Enumerable
// Check if tokenOfOwnerByIndex() function exists
// Use alternative method (events) if not enumerable
```

## 📊 Contract Requirements

Your NFT contract at `0xd8CfC327B23fBcdEe12802bA6cA97e1e7786bF47` should have:

### Required Functions:
```solidity
// Minting
function mint(address to) external payable;
// OR
function mintWithURI(address to, string memory tokenURI) external payable;

// Reading
function totalSupply() external view returns (uint256);
function balanceOf(address owner) external view returns (uint256);
function tokenOfOwnerByIndex(address owner, uint256 index) external view returns (uint256);
function tokenURI(uint256 tokenId) external view returns (string memory);
```

### Optional Functions:
```solidity
function name() external view returns (string memory);
function symbol() external view returns (string memory);
function setMintPrice(uint256 newPrice) external; // If you want dynamic pricing
```

## 🔗 External Links

- **NFT Contract:** [BaseScan](https://basescan.org/address/0xd8CfC327B23fBcdEe12802bA6cA97e1e7786bF47)
- **PROPH Token:** [BaseScan](https://basescan.org/address/0x1890E4f2668b98170B618bA45Bc1B5721ACf9575)
- **OpenSea Collection:** `https://opensea.io/collection/digital-prophets` (if verified)
- **Base Network:** [base.org](https://base.org)
- **RainbowKit Docs:** [rainbowkit.com](https://www.rainbowkit.com)
- **Wagmi Docs:** [wagmi.sh](https://wagmi.sh)

## 🎯 Next Steps

1. ✅ **Deploy Updated Plugin**
   ```bash
   # Upload daily-vibes-fixed-final.zip to WordPress
   # Activate plugin
   ```

2. ✅ **Test on Staging**
   - Test all mint buttons
   - Verify PROPH gating
   - Check gallery loads
   - Test mobile responsive

3. ✅ **Production Launch**
   - Announce NFT feature on blog
   - Create tutorial post
   - Set up Discord/Twitter announcements

4. 🚀 **Future Enhancements**
   - Batch minting
   - NFT staking for bonus PROPH
   - Exclusive content for NFT holders
   - DAO voting with NFT weight
   - Rarity system (common/rare/legendary)

## 💡 Tips

- **Free Mints:** Set `mintPrice="0"` to encourage adoption
- **Paid Mints:** Use low prices on Base (0.001-0.01 ETH) due to low gas fees
- **Engagement:** Require track completion to increase listen time
- **Rewards:** Give extra PROPH to NFT holders
- **Community:** Create NFT holder Discord role

## 🎵 Music-Themed Features

### Unlock NFTs by Track Plays
```jsx
// Track listening stats
const [trackStats, setTrackStats] = useState({
  'song-id-1': { plays: 0, completed: false },
  'song-id-2': { plays: 0, completed: false },
});

// Unlock special NFT after 10 complete listens
{trackStats['song-id-1'].plays >= 10 && (
  <NFTMintButton
    songTitle="Ultra Rare: 10 Plays Achievement"
    trackCompleted={true}
    mintPrice="0"
  />
)}
```

### Album Collection NFTs
```jsx
// Mint album NFT after collecting all track NFTs
const hasAllTracks = userNFTs.length >= totalTracks;

{hasAllTracks && (
  <NFTMintButton
    songTitle="Complete Album Collection"
    trackCompleted={true}
    mintPrice="0.01"
  />
)}
```

### DAO Voting with NFTs
```jsx
// NFT holders get voting power
const votingPower = userNFTs.length * 10; // 10 votes per NFT

<button onClick={vote}>
  Vote (Power: {votingPower})
</button>
```

---

## 📞 Support

For issues or questions:
- GitHub: [your-repo/issues]
- Discord: [your-discord-invite]
- Email: support@digitalprophets.blog

**Built with ❤️ for Digital Prophets community**
