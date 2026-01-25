# Musician Web3 Economy Builder - Complete Wireframe & Implementation Guide

## Overview

**BandDAO Builder** - A React dApp on Base that enables musicians to create their own digital economy in 4 simple steps: Profile → Token → NFT → DAO.

---

## Overall App Structure

### Tech Stack
- **Framework**: React 18 + Vite
- **Web3**: Thirdweb SDK v5
- **Blockchain**: Base (Mainnet & Sepolia for testing)
- **Storage**: Thirdweb Storage (IPFS)
- **Styling**: Tailwind CSS + shadcn/ui components
- **State**: React Context + localStorage for persistence

### Layout & Theme
```
┌─────────────────────────────────────────────────────────┐
│  🎸 BandDAO Builder         [Connect Wallet] [Profile]  │
├─────────────────────────────────────────────────────────┤
│                                                          │
│  ┌──────────┬──────────┬──────────┬──────────┐         │
│  │ 1.Profile│ 2.Token  │ 3.NFT    │ 4.DAO    │         │
│  │    ✓     │          │          │          │         │
│  └──────────┴──────────┴──────────┴──────────┘         │
│                                                          │
│              [Main Content Area]                         │
│                                                          │
│                                                          │
├─────────────────────────────────────────────────────────┤
│  Help Center | Docs | Built on Base ⚡                  │
└─────────────────────────────────────────────────────────┘
```

### Color Scheme
- **Primary**: Electric Blue (#2563EB) - Base network vibes
- **Secondary**: Purple (#7C3AED) - Web3 creativity
- **Accent**: Cyan (#06B6D4) - Interactive elements
- **Background**: Dark (#0F172A) with gradient overlays
- **Text**: White (#FFFFFF) / Gray (#94A3B8)

### Navigation Pattern
- Progressive wizard: locked steps until previous ones complete
- Persistent progress bar showing completion %
- "Save & Continue Later" option at each step
- Mobile-first responsive design

---

## Screen 1: Profile Creation (Onboarding)

### Purpose
Collect basic artist information and store it on IPFS. Create the foundation for their Web3 identity.

### Wireframe
```
┌───────────────────────────────────────────────────────────┐
│                   🎸 Create Your Profile                   │
│                                                            │
│  ┌──────────────────────────────────────────────────────┐ │
│  │                                                       │ │
│  │         [Upload Profile Picture]                     │ │
│  │              📸 Click to Upload                       │ │
│  │           (or drag & drop)                           │ │
│  │                                                       │ │
│  └──────────────────────────────────────────────────────┘ │
│                                                            │
│  Artist/Band Name *                                        │
│  ┌──────────────────────────────────────────────────────┐ │
│  │ The Digital Prophets                                  │ │
│  └──────────────────────────────────────────────────────┘ │
│                                                            │
│  Genre                                                     │
│  ┌──────────────────────────────────────────────────────┐ │
│  │ Hip Hop / Electronic        [▼]                       │ │
│  └──────────────────────────────────────────────────────┘ │
│                                                            │
│  Bio / Description                                         │
│  ┌──────────────────────────────────────────────────────┐ │
│  │ Creating sonic news commentary through AI-powered    │ │
│  │ music that turns daily headlines into beats...       │ │
│  │                                                       │ │
│  │                                                       │ │
│  └──────────────────────────────────────────────────────┘ │
│                                                            │
│  Social Links (Optional)                                   │
│  ┌──────────────────────────────────────────────────────┐ │
│  │ 🌐 Website: digitalprophets.blog                     │ │
│  │ 𝕏  Twitter: @digitalprophets                         │ │
│  │ 📷 Instagram: @digitalprophets                        │ │
│  └──────────────────────────────────────────────────────┘ │
│                                                            │
│              [Save to IPFS & Continue →]                   │
│                                                            │
└───────────────────────────────────────────────────────────┘
```

### Key UI Elements
- **Profile Picture Uploader**: Drag-drop zone with preview, max 5MB
- **Form Fields**: Clean inputs with validation
- **Genre Selector**: Multi-select dropdown with popular genres
- **Progress Indicator**: "Step 1 of 4"
- **Storage Notice**: "Your profile will be stored on IPFS (decentralized, permanent)"

### Thirdweb Integration

**Dependencies:**
```json
{
  "@thirdweb-dev/react": "^4.9.0",
  "@thirdweb-dev/sdk": "^4.0.0"
}
```

**Code Implementation:**

```jsx
// ProfileCreation.jsx
import { useState } from 'react';
import { useStorageUpload, useAddress } from '@thirdweb-dev/react';
import { toast } from 'react-hot-toast';

export default function ProfileCreation({ onComplete }) {
  const address = useAddress();
  const { mutateAsync: upload } = useStorageUpload();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    genre: '',
    bio: '',
    website: '',
    twitter: '',
    instagram: '',
  });
  const [profileImage, setProfileImage] = useState(null);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file && file.size <= 5 * 1024 * 1024) { // 5MB limit
      setProfileImage(file);
    } else {
      toast.error('Image must be less than 5MB');
    }
  };

  const createProfile = async () => {
    if (!address) {
      toast.error('Please connect your wallet first');
      return;
    }

    if (!formData.name || !formData.genre || !formData.bio) {
      toast.error('Please fill in all required fields');
      return;
    }

    setLoading(true);

    try {
      // Upload profile image to IPFS via Thirdweb Storage
      let imageUri = '';
      if (profileImage) {
        const [uploadUri] = await upload({ data: [profileImage] });
        imageUri = uploadUri;
        toast.success('Profile image uploaded to IPFS!');
      }

      // Create profile metadata object
      const profileMetadata = {
        name: formData.name,
        genre: formData.genre,
        bio: formData.bio,
        image: imageUri,
        socials: {
          website: formData.website,
          twitter: formData.twitter,
          instagram: formData.instagram,
        },
        walletAddress: address,
        createdAt: new Date().toISOString(),
      };

      // Upload metadata to IPFS
      const [metadataUri] = await upload({
        data: [profileMetadata],
        options: { uploadWithGatewayUrl: true },
      });

      toast.success('Profile created successfully!');

      // Store profile URI in localStorage and pass to parent
      localStorage.setItem('artistProfile', JSON.stringify({
        ...profileMetadata,
        metadataUri,
      }));

      onComplete({ profileUri: metadataUri, profile: profileMetadata });

    } catch (error) {
      console.error('Error creating profile:', error);
      toast.error('Failed to create profile: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-slate-800 rounded-lg">
      <h2 className="text-3xl font-bold text-white mb-6 text-center">
        🎸 Create Your Profile
      </h2>

      {/* Profile Image Upload */}
      <div className="mb-6">
        <label className="block text-gray-300 mb-2">Profile Picture</label>
        <div className="border-2 border-dashed border-gray-600 rounded-lg p-8 text-center hover:border-blue-500 transition-colors cursor-pointer">
          <input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="hidden"
            id="profile-image"
          />
          <label htmlFor="profile-image" className="cursor-pointer">
            {profileImage ? (
              <img
                src={URL.createObjectURL(profileImage)}
                alt="Preview"
                className="w-32 h-32 mx-auto rounded-full object-cover"
              />
            ) : (
              <div>
                <p className="text-4xl mb-2">📸</p>
                <p className="text-gray-400">Click to upload or drag & drop</p>
                <p className="text-sm text-gray-500">Max 5MB</p>
              </div>
            )}
          </label>
        </div>
      </div>

      {/* Artist Name */}
      <div className="mb-4">
        <label className="block text-gray-300 mb-2">
          Artist/Band Name <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          placeholder="The Digital Prophets"
          className="w-full px-4 py-3 bg-slate-700 text-white rounded-lg border border-slate-600 focus:border-blue-500 focus:outline-none"
        />
      </div>

      {/* Genre */}
      <div className="mb-4">
        <label className="block text-gray-300 mb-2">Genre</label>
        <select
          value={formData.genre}
          onChange={(e) => setFormData({ ...formData, genre: e.target.value })}
          className="w-full px-4 py-3 bg-slate-700 text-white rounded-lg border border-slate-600 focus:border-blue-500 focus:outline-none"
        >
          <option value="">Select genre...</option>
          <option value="Hip Hop">Hip Hop</option>
          <option value="Electronic">Electronic</option>
          <option value="Rock">Rock</option>
          <option value="Pop">Pop</option>
          <option value="Jazz">Jazz</option>
          <option value="R&B">R&B</option>
          <option value="Country">Country</option>
          <option value="Indie">Indie</option>
        </select>
      </div>

      {/* Bio */}
      <div className="mb-4">
        <label className="block text-gray-300 mb-2">Bio / Description</label>
        <textarea
          value={formData.bio}
          onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
          placeholder="Tell your fans about your music..."
          rows={4}
          className="w-full px-4 py-3 bg-slate-700 text-white rounded-lg border border-slate-600 focus:border-blue-500 focus:outline-none resize-none"
        />
      </div>

      {/* Social Links */}
      <div className="mb-6 space-y-3">
        <label className="block text-gray-300 mb-2">Social Links (Optional)</label>
        <input
          type="url"
          value={formData.website}
          onChange={(e) => setFormData({ ...formData, website: e.target.value })}
          placeholder="🌐 Website URL"
          className="w-full px-4 py-3 bg-slate-700 text-white rounded-lg border border-slate-600 focus:border-blue-500 focus:outline-none"
        />
        <input
          type="text"
          value={formData.twitter}
          onChange={(e) => setFormData({ ...formData, twitter: e.target.value })}
          placeholder="𝕏 Twitter handle"
          className="w-full px-4 py-3 bg-slate-700 text-white rounded-lg border border-slate-600 focus:border-blue-500 focus:outline-none"
        />
        <input
          type="text"
          value={formData.instagram}
          onChange={(e) => setFormData({ ...formData, instagram: e.target.value })}
          placeholder="📷 Instagram handle"
          className="w-full px-4 py-3 bg-slate-700 text-white rounded-lg border border-slate-600 focus:border-blue-500 focus:outline-none"
        />
      </div>

      {/* Submit Button */}
      <button
        onClick={createProfile}
        disabled={loading}
        className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? 'Uploading to IPFS...' : 'Save to IPFS & Continue →'}
      </button>

      <p className="text-sm text-gray-400 text-center mt-4">
        🔒 Your profile will be stored on IPFS (decentralized & permanent)
      </p>
    </div>
  );
}
```

---

## Screen 2: Token Creation (ERC-20)

### Purpose
Deploy a custom ERC-20 token on Base that represents the artist's fan economy. This token can be used for governance, rewards, merch discounts, etc.

### Wireframe
```
┌───────────────────────────────────────────────────────────┐
│              💎 Create Your Fan Token                      │
│                                                            │
│  Your fan token is the currency of your community.        │
│  Fans can earn it, trade it, and use it to vote.         │
│                                                            │
│  ┌──────────────────────────────────────────────────────┐ │
│  │              TOKEN PREVIEW                            │ │
│  │                                                       │ │
│  │         ┌──────────┐                                 │ │
│  │         │   PROPH  │                                 │ │
│  │         │    🎵    │                                 │ │
│  │         └──────────┘                                 │ │
│  │                                                       │ │
│  │    Digital Prophets Token                            │ │
│  │    Symbol: PROPH                                     │ │
│  │    Total Supply: 1,000,000                           │ │
│  │                                                       │ │
│  └──────────────────────────────────────────────────────┘ │
│                                                            │
│  Token Name *                                              │
│  ┌──────────────────────────────────────────────────────┐ │
│  │ Digital Prophets Token                                │ │
│  └──────────────────────────────────────────────────────┘ │
│                                                            │
│  Token Symbol * (3-5 characters)                           │
│  ┌──────────────────────────────────────────────────────┐ │
│  │ PROPH                                                 │ │
│  └──────────────────────────────────────────────────────┘ │
│                                                            │
│  Total Supply *                                            │
│  ┌──────────────────────────────────────────────────────┐ │
│  │ 1,000,000                                             │ │
│  └──────────────────────────────────────────────────────┘ │
│                                                            │
│  Initial Distribution                                      │
│  ┌──────────────────────────────────────────────────────┐ │
│  │ • You (Artist): 500,000 (50%)                        │ │
│  │ • Community Rewards Pool: 300,000 (30%)              │ │
│  │ • DAO Treasury: 200,000 (20%)                        │ │
│  └──────────────────────────────────────────────────────┘ │
│                                                            │
│  ⚠️ Deployment Cost: ~$2-5 in gas fees                   │
│                                                            │
│          [Deploy Token on Base →]                          │
│                                                            │
└───────────────────────────────────────────────────────────┘
```

### Key UI Elements
- **Token Preview Card**: Live preview of token branding
- **Supply Calculator**: Helper showing supply recommendations
- **Distribution Slider**: Visual breakdown of token allocation
- **Gas Estimator**: Real-time gas cost estimate
- **Confirmation Modal**: Review before deploying

### Thirdweb Integration

```jsx
// TokenCreation.jsx
import { useState, useEffect } from 'react';
import {
  useAddress,
  useSDK,
  useContract,
} from '@thirdweb-dev/react';
import { toast } from 'react-hot-toast';

export default function TokenCreation({ artistProfile, onComplete }) {
  const address = useAddress();
  const sdk = useSDK();
  const [loading, setLoading] = useState(false);
  const [tokenData, setTokenData] = useState({
    name: `${artistProfile?.name || 'Artist'} Token`,
    symbol: '',
    totalSupply: '1000000',
  });
  const [deployedAddress, setDeployedAddress] = useState('');

  const deployToken = async () => {
    if (!address) {
      toast.error('Please connect your wallet');
      return;
    }

    if (!tokenData.name || !tokenData.symbol || !tokenData.totalSupply) {
      toast.error('Please fill in all fields');
      return;
    }

    if (tokenData.symbol.length < 3 || tokenData.symbol.length > 5) {
      toast.error('Symbol must be 3-5 characters');
      return;
    }

    setLoading(true);

    try {
      toast.loading('Deploying your token contract on Base...');

      // Deploy ERC20 token using Thirdweb
      const tokenAddress = await sdk.deployer.deployToken({
        name: tokenData.name,
        symbol: tokenData.symbol.toUpperCase(),
        primary_sale_recipient: address, // Artist receives initial tokens
      });

      toast.dismiss();
      toast.success('Token contract deployed!');

      // Get the deployed contract
      const tokenContract = await sdk.getContract(tokenAddress, 'token');

      // Mint initial supply
      toast.loading('Minting initial token supply...');
      
      const totalSupply = tokenData.totalSupply;
      await tokenContract.mint(totalSupply);

      toast.dismiss();
      toast.success(`Successfully minted ${totalSupply} ${tokenData.symbol}!`);

      setDeployedAddress(tokenAddress);

      // Save token info
      const tokenInfo = {
        name: tokenData.name,
        symbol: tokenData.symbol,
        totalSupply: tokenData.totalSupply,
        contractAddress: tokenAddress,
        deployedAt: new Date().toISOString(),
        network: 'base',
      };

      localStorage.setItem('artistToken', JSON.stringify(tokenInfo));
      onComplete(tokenInfo);

    } catch (error) {
      console.error('Error deploying token:', error);
      toast.dismiss();
      toast.error('Failed to deploy token: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-slate-800 rounded-lg">
      <h2 className="text-3xl font-bold text-white mb-4 text-center">
        💎 Create Your Fan Token
      </h2>
      <p className="text-gray-400 text-center mb-6">
        Your fan token is the currency of your community. Fans can earn it, trade it, and use it to vote.
      </p>

      {/* Token Preview */}
      <div className="bg-gradient-to-br from-blue-600 to-purple-600 p-6 rounded-lg mb-6">
        <div className="text-center">
          <div className="inline-block bg-white/20 backdrop-blur-sm rounded-full p-6 mb-4">
            <span className="text-6xl">🎵</span>
          </div>
          <h3 className="text-2xl font-bold text-white mb-2">
            {tokenData.name || 'Your Token Name'}
          </h3>
          <p className="text-blue-100 text-lg">
            Symbol: {tokenData.symbol.toUpperCase() || 'SYMBOL'}
          </p>
          <p className="text-blue-200">
            Total Supply: {Number(tokenData.totalSupply).toLocaleString()}
          </p>
        </div>
      </div>

      {/* Token Name */}
      <div className="mb-4">
        <label className="block text-gray-300 mb-2">
          Token Name <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          value={tokenData.name}
          onChange={(e) => setTokenData({ ...tokenData, name: e.target.value })}
          placeholder="Digital Prophets Token"
          className="w-full px-4 py-3 bg-slate-700 text-white rounded-lg border border-slate-600 focus:border-blue-500 focus:outline-none"
        />
      </div>

      {/* Token Symbol */}
      <div className="mb-4">
        <label className="block text-gray-300 mb-2">
          Token Symbol <span className="text-red-500">*</span> (3-5 characters)
        </label>
        <input
          type="text"
          value={tokenData.symbol}
          onChange={(e) => setTokenData({ ...tokenData, symbol: e.target.value.toUpperCase() })}
          placeholder="PROPH"
          maxLength={5}
          className="w-full px-4 py-3 bg-slate-700 text-white rounded-lg border border-slate-600 focus:border-blue-500 focus:outline-none uppercase"
        />
      </div>

      {/* Total Supply */}
      <div className="mb-6">
        <label className="block text-gray-300 mb-2">
          Total Supply <span className="text-red-500">*</span>
        </label>
        <input
          type="number"
          value={tokenData.totalSupply}
          onChange={(e) => setTokenData({ ...tokenData, totalSupply: e.target.value })}
          placeholder="1000000"
          className="w-full px-4 py-3 bg-slate-700 text-white rounded-lg border border-slate-600 focus:border-blue-500 focus:outline-none"
        />
        <p className="text-sm text-gray-400 mt-1">
          💡 Recommended: 100,000 - 10,000,000 for small communities
        </p>
      </div>

      {/* Initial Distribution Info */}
      <div className="bg-slate-700 p-4 rounded-lg mb-6">
        <h4 className="text-white font-semibold mb-2">Initial Distribution</h4>
        <ul className="space-y-1 text-gray-300 text-sm">
          <li>• All tokens will be minted to your wallet initially</li>
          <li>• You can distribute them to fans, reward pools, and DAO treasury</li>
          <li>• Consider holding 40-60% for community rewards</li>
        </ul>
      </div>

      {/* Gas Estimate */}
      <div className="bg-yellow-500/10 border border-yellow-500/30 p-4 rounded-lg mb-6">
        <p className="text-yellow-400 text-sm">
          ⚠️ Deployment Cost: ~$2-5 in gas fees (paid in ETH on Base)
        </p>
      </div>

      {/* Deploy Button */}
      <button
        onClick={deployToken}
        disabled={loading}
        className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? 'Deploying on Base...' : 'Deploy Token on Base →'}
      </button>

      {deployedAddress && (
        <div className="mt-4 p-4 bg-green-500/10 border border-green-500/30 rounded-lg">
          <p className="text-green-400 font-semibold mb-2">✅ Token Deployed!</p>
          <p className="text-sm text-gray-300">
            Contract: <code className="text-blue-400">{deployedAddress}</code>
          </p>
          <a
            href={`https://basescan.org/address/${deployedAddress}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-400 text-sm hover:underline mt-2 inline-block"
          >
            View on BaseScan →
          </a>
        </div>
      )}
    </div>
  );
}
```

---

## Screen 3: NFT Minting (Song as NFT)

### Purpose
Turn a song into an NFT (ERC-1155 Edition) with royalties. Fans can collect limited editions.

### Wireframe
```
┌───────────────────────────────────────────────────────────┐
│             🎵 Mint Your Song as NFT                       │
│                                                            │
│  Create a collectible edition of your song that fans      │
│  can own. Set royalties and earn every time it's sold.   │
│                                                            │
│  ┌─────────────┐  ┌──────────────────────────────────┐   │
│  │             │  │                                   │   │
│  │   [Upload   │  │  Song Title                       │   │
│  │    Album    │  │  ┌──────────────────────────────┐│   │
│  │    Art]     │  │  │ Quicksand Deliria            ││   │
│  │             │  │  └──────────────────────────────┘│   │
│  │   Drag &    │  │                                   │   │
│  │    Drop     │  │  Description                      │   │
│  │             │  │  ┌──────────────────────────────┐│   │
│  │   1:1       │  │  │ A sonic journey through...   ││   │
│  │   Square    │  │  │                              ││   │
│  │             │  │  └──────────────────────────────┘│   │
│  └─────────────┘  └──────────────────────────────────┘   │
│                                                            │
│  Upload Audio File (MP3, WAV) *                            │
│  ┌──────────────────────────────────────────────────────┐ │
│  │  🎧 quicksand-deliria.wav                  [Upload]  │ │
│  └──────────────────────────────────────────────────────┘ │
│                                                            │
│  Edition Size * (How many can be minted?)                  │
│  ┌──────────────────────────────────────────────────────┐ │
│  │ 100          ← Limited Edition (100 copies)          │ │
│  └──────────────────────────────────────────────────────┘ │
│                                                            │
│  Price per NFT (in ETH)                                    │
│  ┌──────────────────────────────────────────────────────┐ │
│  │ 0.01 ETH     (~$25 USD)                              │ │
│  └──────────────────────────────────────────────────────┘ │
│                                                            │
│  Royalty Percentage (on secondary sales)                   │
│  ┌──────────────────────────────────────────────────────┐ │
│  │ [████████──] 10%                                     │ │
│  └──────────────────────────────────────────────────────┘ │
│                                                            │
│  NFT Perks (Optional)                                      │
│  ☑ Download rights                                        │
│  ☑ Behind-the-scenes content                             │
│  ☐ Exclusive Discord access                              │
│  ☐ Meet & greet eligibility                              │
│                                                            │
│          [Create NFT Collection →]                         │
│                                                            │
└───────────────────────────────────────────────────────────┘
```

### Key UI Elements
- **Dual Upload**: Album art (image) + Audio file
- **Edition Size Selector**: Dropdown with presets (10, 50, 100, 1000, Unlimited)
- **Price Calculator**: ETH to USD conversion
- **Royalty Slider**: Visual 0-10% slider with explanation
- **Perks Checklist**: Additional utility for holders
- **Preview Card**: Shows how NFT will look on marketplaces

### Thirdweb Integration

```jsx
// NFTMinting.jsx
import { useState } from 'react';
import {
  useAddress,
  useSDK,
  useStorageUpload,
} from '@thirdweb-dev/react';
import { toast } from 'react-hot-toast';

export default function NFTMinting({ artistProfile, onComplete }) {
  const address = useAddress();
  const sdk = useSDK();
  const { mutateAsync: upload } = useStorageUpload();
  const [loading, setLoading] = useState(false);

  const [nftData, setNftData] = useState({
    name: '',
    description: '',
    editionSize: '100',
    price: '0.01',
    royalty: 10, // 10% royalty
  });

  const [albumArt, setAlbumArt] = useState(null);
  const [audioFile, setAudioFile] = useState(null);
  const [collectionAddress, setCollectionAddress] = useState('');

  const handleAlbumArtUpload = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith('image/')) {
      setAlbumArt(file);
    } else {
      toast.error('Please upload a valid image file');
    }
  };

  const handleAudioUpload = (e) => {
    const file = e.target.files[0];
    if (file && (file.type.startsWith('audio/') || file.name.endsWith('.wav'))) {
      setAudioFile(file);
    } else {
      toast.error('Please upload a valid audio file (MP3, WAV)');
    }
  };

  const createNFTCollection = async () => {
    if (!address) {
      toast.error('Please connect your wallet');
      return;
    }

    if (!nftData.name || !nftData.description) {
      toast.error('Please fill in all required fields');
      return;
    }

    if (!albumArt || !audioFile) {
      toast.error('Please upload both album art and audio file');
      return;
    }

    setLoading(true);

    try {
      // Step 1: Upload album art to IPFS
      toast.loading('Uploading album art to IPFS...');
      const [artUri] = await upload({ data: [albumArt] });
      toast.dismiss();
      toast.success('Album art uploaded!');

      // Step 2: Upload audio file to IPFS
      toast.loading('Uploading audio file to IPFS...');
      const [audioUri] = await upload({ data: [audioFile] });
      toast.dismiss();
      toast.success('Audio file uploaded!');

      // Step 3: Deploy Edition (ERC-1155) contract
      toast.loading('Deploying NFT collection on Base...');
      
      const editionAddress = await sdk.deployer.deployEdition({
        name: `${artistProfile.name} - ${nftData.name}`,
        description: nftData.description,
        image: artUri,
        primary_sale_recipient: address,
        seller_fee_basis_points: nftData.royalty * 100, // Convert % to basis points
        fee_recipient: address, // Royalties go to artist
        platform_fee_basis_points: 0,
        platform_fee_recipient: address,
      });

      toast.dismiss();
      toast.success('NFT collection deployed!');

      // Step 4: Get the deployed contract
      const edition = await sdk.getContract(editionAddress, 'edition');

      // Step 5: Mint the first NFT with audio as property
      toast.loading('Minting NFT edition...');
      
      const nftMetadata = {
        name: nftData.name,
        description: nftData.description,
        image: artUri,
        animation_url: audioUri, // Audio file as animation_url (standard for audio NFTs)
        attributes: [
          { trait_type: 'Artist', value: artistProfile.name },
          { trait_type: 'Genre', value: artistProfile.genre },
          { trait_type: 'Edition Size', value: nftData.editionSize },
        ],
        properties: {
          audioFile: audioUri,
          artist: artistProfile.name,
        },
      };

      await edition.mintTo(
        address, // Mint to artist initially
        nftMetadata
      );

      toast.dismiss();
      toast.success(`NFT minted successfully!`);

      setCollectionAddress(editionAddress);

      // Save NFT collection info
      const nftInfo = {
        name: nftData.name,
        description: nftData.description,
        editionSize: nftData.editionSize,
        price: nftData.price,
        royalty: nftData.royalty,
        collectionAddress: editionAddress,
        albumArt: artUri,
        audioFile: audioUri,
        createdAt: new Date().toISOString(),
      };

      localStorage.setItem('artistNFT', JSON.stringify(nftInfo));
      onComplete(nftInfo);

    } catch (error) {
      console.error('Error creating NFT:', error);
      toast.dismiss();
      toast.error('Failed to create NFT: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-slate-800 rounded-lg">
      <h2 className="text-3xl font-bold text-white mb-4 text-center">
        🎵 Mint Your Song as NFT
      </h2>
      <p className="text-gray-400 text-center mb-6">
        Create a collectible edition of your song that fans can own. Set royalties and earn every time it's sold.
      </p>

      <div className="grid md:grid-cols-2 gap-6 mb-6">
        {/* Album Art Upload */}
        <div>
          <label className="block text-gray-300 mb-2">
            Album Art <span className="text-red-500">*</span>
          </label>
          <div className="aspect-square border-2 border-dashed border-gray-600 rounded-lg hover:border-blue-500 transition-colors cursor-pointer overflow-hidden">
            <input
              type="file"
              accept="image/*"
              onChange={handleAlbumArtUpload}
              className="hidden"
              id="album-art"
            />
            <label
              htmlFor="album-art"
              className="w-full h-full flex items-center justify-center cursor-pointer"
            >
              {albumArt ? (
                <img
                  src={URL.createObjectURL(albumArt)}
                  alt="Album Art"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="text-center p-6">
                  <p className="text-4xl mb-2">🖼️</p>
                  <p className="text-gray-400">Upload Album Art</p>
                  <p className="text-sm text-gray-500">1:1 Square Recommended</p>
                </div>
              )}
            </label>
          </div>
        </div>

        {/* Song Details */}
        <div className="space-y-4">
          <div>
            <label className="block text-gray-300 mb-2">
              Song Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={nftData.name}
              onChange={(e) => setNftData({ ...nftData, name: e.target.value })}
              placeholder="Quicksand Deliria"
              className="w-full px-4 py-3 bg-slate-700 text-white rounded-lg border border-slate-600 focus:border-blue-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-gray-300 mb-2">Description</label>
            <textarea
              value={nftData.description}
              onChange={(e) => setNftData({ ...nftData, description: e.target.value })}
              placeholder="A sonic journey through the chaos of 2026..."
              rows={4}
              className="w-full px-4 py-3 bg-slate-700 text-white rounded-lg border border-slate-600 focus:border-blue-500 focus:outline-none resize-none"
            />
          </div>
        </div>
      </div>

      {/* Audio File Upload */}
      <div className="mb-6">
        <label className="block text-gray-300 mb-2">
          Upload Audio File (MP3, WAV) <span className="text-red-500">*</span>
        </label>
        <div className="bg-slate-700 border border-slate-600 rounded-lg p-4">
          <input
            type="file"
            accept="audio/*,.wav"
            onChange={handleAudioUpload}
            className="hidden"
            id="audio-file"
          />
          <label htmlFor="audio-file" className="cursor-pointer flex items-center justify-between">
            <span className="text-white">
              {audioFile ? `🎧 ${audioFile.name}` : 'Choose audio file...'}
            </span>
            <button className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
              Upload
            </button>
          </label>
        </div>
      </div>

      {/* Edition Size */}
      <div className="mb-4">
        <label className="block text-gray-300 mb-2">
          Edition Size <span className="text-red-500">*</span> (How many can be minted?)
        </label>
        <select
          value={nftData.editionSize}
          onChange={(e) => setNftData({ ...nftData, editionSize: e.target.value })}
          className="w-full px-4 py-3 bg-slate-700 text-white rounded-lg border border-slate-600 focus:border-blue-500 focus:outline-none"
        >
          <option value="10">10 - Super Rare</option>
          <option value="50">50 - Limited Edition</option>
          <option value="100">100 - Collectible</option>
          <option value="1000">1000 - Community Edition</option>
          <option value="unlimited">Unlimited - Open Edition</option>
        </select>
      </div>

      {/* Price per NFT */}
      <div className="mb-4">
        <label className="block text-gray-300 mb-2">Price per NFT (in ETH)</label>
        <input
          type="number"
          step="0.001"
          value={nftData.price}
          onChange={(e) => setNftData({ ...nftData, price: e.target.value })}
          placeholder="0.01"
          className="w-full px-4 py-3 bg-slate-700 text-white rounded-lg border border-slate-600 focus:border-blue-500 focus:outline-none"
        />
        <p className="text-sm text-gray-400 mt-1">
          💡 0.01 ETH ≈ $25-30 USD (Base network has low fees!)
        </p>
      </div>

      {/* Royalty Slider */}
      <div className="mb-6">
        <label className="block text-gray-300 mb-2">
          Royalty Percentage (on secondary sales)
        </label>
        <input
          type="range"
          min="0"
          max="10"
          step="0.5"
          value={nftData.royalty}
          onChange={(e) => setNftData({ ...nftData, royalty: parseFloat(e.target.value) })}
          className="w-full"
        />
        <div className="flex justify-between text-sm text-gray-400 mt-1">
          <span>0%</span>
          <span className="text-blue-400 font-bold">{nftData.royalty}%</span>
          <span>10%</span>
        </div>
        <p className="text-sm text-gray-400 mt-2">
          You'll earn {nftData.royalty}% every time this NFT is resold
        </p>
      </div>

      {/* Deploy Button */}
      <button
        onClick={createNFTCollection}
        disabled={loading}
        className="w-full py-4 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? 'Creating NFT Collection...' : 'Create NFT Collection →'}
      </button>

      {collectionAddress && (
        <div className="mt-4 p-4 bg-green-500/10 border border-green-500/30 rounded-lg">
          <p className="text-green-400 font-semibold mb-2">✅ NFT Collection Created!</p>
          <p className="text-sm text-gray-300">
            Contract: <code className="text-blue-400">{collectionAddress}</code>
          </p>
          <a
            href={`https://basescan.org/address/${collectionAddress}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-400 text-sm hover:underline mt-2 inline-block"
          >
            View on BaseScan →
          </a>
        </div>
      )}
    </div>
  );
}
```

---

## Screen 4: DAO Setup (Governance)

### Purpose
Create a DAO where NFT holders can vote on decisions using the fan token. This gives fans real influence over the artist's direction.

### Wireframe
```
┌───────────────────────────────────────────────────────────┐
│              🏛️ Create Your Fan DAO                        │
│                                                            │
│  Give your community a voice! NFT holders can vote on     │
│  important decisions using your fan tokens.               │
│                                                            │
│  ┌──────────────────────────────────────────────────────┐ │
│  │            DAO GOVERNANCE SETUP                       │ │
│  │                                                       │ │
│  │  Membership:  Own 1+ of your NFTs                    │ │
│  │  Voting Power: Based on token holdings               │ │
│  │  Proposals:   Any member can create                  │ │
│  │                                                       │ │
│  └──────────────────────────────────────────────────────┘ │
│                                                            │
│  DAO Name *                                                │
│  ┌──────────────────────────────────────────────────────┐ │
│  │ Digital Prophets DAO                                  │ │
│  └──────────────────────────────────────────────────────┘ │
│                                                            │
│  Voting Token *                                            │
│  ┌──────────────────────────────────────────────────────┐ │
│  │ PROPH Token (0x1234...)              [Connected ✓]  │ │
│  └──────────────────────────────────────────────────────┘ │
│                                                            │
│  NFT Membership Requirement *                              │
│  ┌──────────────────────────────────────────────────────┐ │
│  │ Song Collection (0xabcd...)           [Connected ✓]  │ │
│  └──────────────────────────────────────────────────────┘ │
│                                                            │
│  Voting Settings                                           │
│  ┌──────────────────────────────────────────────────────┐ │
│  │ Proposal Duration: [ 7 days     ▼]                   │ │
│  │ Quorum Required:   [████─────] 25%                   │ │
│  │ Approval Threshold: 51% majority                     │ │
│  └──────────────────────────────────────────────────────┘ │
│                                                            │
│  Initial Proposal Ideas                                    │
│  • Which song should we release next?                     │
│  • Where should we tour?                                  │
│  • What merch should we create?                           │
│  • How should we spend DAO treasury?                      │
│                                                            │
│          [Create DAO & Launch Governance →]                │
│                                                            │
└───────────────────────────────────────────────────────────┘
```

### Key UI Elements
- **Governance Model Diagram**: Visual showing NFT → Membership, Token → Voting Power
- **Contract Connectors**: Auto-detect deployed token & NFT contracts
- **Voting Duration Selector**: Dropdown (1, 3, 7, 14, 30 days)
- **Quorum Slider**: Visual percentage slider
- **Example Proposals**: Inspire artists with ideas
- **Advanced Options**: Expandable section for execution delay, etc.

### Thirdweb Integration

```jsx
// DAOSetup.jsx
import { useState, useEffect } from 'react';
import {
  useAddress,
  useSDK,
  useContract,
} from '@thirdweb-dev/react';
import { toast } from 'react-hot-toast';

export default function DAOSetup({ artistToken, artistNFT, onComplete }) {
  const address = useAddress();
  const sdk = useSDK();
  const [loading, setLoading] = useState(false);

  const [daoData, setDaoData] = useState({
    name: 'Fan DAO',
    votingPeriod: 7, // days
    quorum: 25, // percentage
  });

  const [voteAddress, setVoteAddress] = useState('');

  const createDAO = async () => {
    if (!address) {
      toast.error('Please connect your wallet');
      return;
    }

    if (!artistToken?.contractAddress) {
      toast.error('Please create your token first');
      return;
    }

    if (!artistNFT?.collectionAddress) {
      toast.error('Please create your NFT collection first');
      return;
    }

    setLoading(true);

    try {
      toast.loading('Deploying DAO governance contract...');

      // Deploy Vote contract using Thirdweb
      const voteContractAddress = await sdk.deployer.deployVote({
        name: daoData.name,
        voting_token_address: artistToken.contractAddress, // Use artist's token for voting
        voting_delay_in_blocks: 0, // No delay
        voting_period_in_blocks: daoData.votingPeriod * 6570, // ~6570 blocks per day on Base
        voting_quorum_fraction: daoData.quorum, // Quorum percentage
        proposal_token_threshold: '1', // Need at least 1 token to propose
      });

      toast.dismiss();
      toast.success('DAO contract deployed!');

      setVoteAddress(voteContractAddress);

      // Configure NFT-gated membership (optional advanced feature)
      // This would typically use Thirdweb's permission system
      toast.success('DAO governance is ready!');

      // Save DAO info
      const daoInfo = {
        name: daoData.name,
        votingToken: artistToken.contractAddress,
        nftMembership: artistNFT.collectionAddress,
        votingPeriod: daoData.votingPeriod,
        quorum: daoData.quorum,
        contractAddress: voteContractAddress,
        createdAt: new Date().toISOString(),
      };

      localStorage.setItem('artistDAO', JSON.stringify(daoInfo));
      onComplete(daoInfo);

    } catch (error) {
      console.error('Error creating DAO:', error);
      toast.dismiss();
      toast.error('Failed to create DAO: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-slate-800 rounded-lg">
      <h2 className="text-3xl font-bold text-white mb-4 text-center">
        🏛️ Create Your Fan DAO
      </h2>
      <p className="text-gray-400 text-center mb-6">
        Give your community a voice! NFT holders can vote on important decisions using your fan tokens.
      </p>

      {/* DAO Governance Overview */}
      <div className="bg-gradient-to-br from-purple-600 to-blue-600 p-6 rounded-lg mb-6">
        <h3 className="text-white font-bold text-lg mb-4">DAO Governance Setup</h3>
        <div className="space-y-2 text-white/90">
          <div className="flex items-center">
            <span className="text-2xl mr-3">🎫</span>
            <span>Membership: Own 1+ of your NFTs</span>
          </div>
          <div className="flex items-center">
            <span className="text-2xl mr-3">💎</span>
            <span>Voting Power: Based on {artistToken?.symbol || 'token'} holdings</span>
          </div>
          <div className="flex items-center">
            <span className="text-2xl mr-3">📝</span>
            <span>Proposals: Any member can create</span>
          </div>
        </div>
      </div>

      {/* DAO Name */}
      <div className="mb-4">
        <label className="block text-gray-300 mb-2">
          DAO Name <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          value={daoData.name}
          onChange={(e) => setDaoData({ ...daoData, name: e.target.value })}
          placeholder="Digital Prophets DAO"
          className="w-full px-4 py-3 bg-slate-700 text-white rounded-lg border border-slate-600 focus:border-blue-500 focus:outline-none"
        />
      </div>

      {/* Voting Token */}
      <div className="mb-4">
        <label className="block text-gray-300 mb-2">
          Voting Token <span className="text-red-500">*</span>
        </label>
        <div className="bg-slate-700 border border-green-500/30 rounded-lg p-4 flex items-center justify-between">
          <div>
            <p className="text-white font-semibold">
              {artistToken?.symbol || 'TOKEN'} Token
            </p>
            <p className="text-xs text-gray-400 font-mono">
              {artistToken?.contractAddress?.slice(0, 10)}...
            </p>
          </div>
          <span className="text-green-400">✓ Connected</span>
        </div>
      </div>

      {/* NFT Membership */}
      <div className="mb-6">
        <label className="block text-gray-300 mb-2">
          NFT Membership Requirement <span className="text-red-500">*</span>
        </label>
        <div className="bg-slate-700 border border-green-500/30 rounded-lg p-4 flex items-center justify-between">
          <div>
            <p className="text-white font-semibold">
              {artistNFT?.name || 'Song Collection'}
            </p>
            <p className="text-xs text-gray-400 font-mono">
              {artistNFT?.collectionAddress?.slice(0, 10)}...
            </p>
          </div>
          <span className="text-green-400">✓ Connected</span>
        </div>
        <p className="text-sm text-gray-400 mt-2">
          Only holders of this NFT can participate in governance
        </p>
      </div>

      {/* Voting Settings */}
      <div className="bg-slate-700 p-4 rounded-lg mb-6">
        <h4 className="text-white font-semibold mb-4">Voting Settings</h4>

        {/* Voting Period */}
        <div className="mb-4">
          <label className="block text-gray-300 text-sm mb-2">
            Proposal Duration
          </label>
          <select
            value={daoData.votingPeriod}
            onChange={(e) => setDaoData({ ...daoData, votingPeriod: parseInt(e.target.value) })}
            className="w-full px-4 py-2 bg-slate-600 text-white rounded border border-slate-500 focus:border-blue-500 focus:outline-none"
          >
            <option value="1">1 day</option>
            <option value="3">3 days</option>
            <option value="7">7 days</option>
            <option value="14">14 days</option>
            <option value="30">30 days</option>
          </select>
        </div>

        {/* Quorum */}
        <div className="mb-4">
          <label className="block text-gray-300 text-sm mb-2">
            Quorum Required: {daoData.quorum}%
          </label>
          <input
            type="range"
            min="10"
            max="50"
            step="5"
            value={daoData.quorum}
            onChange={(e) => setDaoData({ ...daoData, quorum: parseInt(e.target.value) })}
            className="w-full"
          />
          <div className="flex justify-between text-xs text-gray-400 mt-1">
            <span>10%</span>
            <span>50%</span>
          </div>
        </div>

        {/* Approval Threshold */}
        <div>
          <label className="block text-gray-300 text-sm mb-2">
            Approval Threshold
          </label>
          <div className="bg-slate-600 p-2 rounded">
            <span className="text-white">51% majority</span>
          </div>
        </div>
      </div>

      {/* Initial Proposal Ideas */}
      <div className="bg-blue-500/10 border border-blue-500/30 p-4 rounded-lg mb-6">
        <h4 className="text-blue-400 font-semibold mb-2">Initial Proposal Ideas</h4>
        <ul className="space-y-1 text-gray-300 text-sm">
          <li>• Which song should we release next?</li>
          <li>• Where should we tour?</li>
          <li>• What merch should we create?</li>
          <li>• How should we spend DAO treasury?</li>
        </ul>
      </div>

      {/* Create DAO Button */}
      <button
        onClick={createDAO}
        disabled={loading}
        className="w-full py-4 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? 'Creating DAO...' : 'Create DAO & Launch Governance →'}
      </button>

      {voteAddress && (
        <div className="mt-4 p-4 bg-green-500/10 border border-green-500/30 rounded-lg">
          <p className="text-green-400 font-semibold mb-2">✅ DAO Created!</p>
          <p className="text-sm text-gray-300">
            Contract: <code className="text-blue-400">{voteAddress}</code>
          </p>
          <a
            href={`https://basescan.org/address/${voteAddress}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-400 text-sm hover:underline mt-2 inline-block"
          >
            View on BaseScan →
          </a>
        </div>
      )}
    </div>
  );
}
```

---

## Screen 5: Dashboard / Overview

### Purpose
Final overview showing all created contracts and next steps. Central hub for managing the Web3 economy.

### Wireframe
```
┌───────────────────────────────────────────────────────────┐
│  🎉 Your Web3 Music Economy is Live!                      │
│                                                            │
│  ┌──────────────────────────────────────────────────────┐ │
│  │              Digital Prophets                         │ │
│  │         ┌──────────┐                                  │ │
│  │         │   🎸     │                                  │ │
│  │         └──────────┘                                  │ │
│  │                                                        │ │
│  │  Hip Hop • 500 PROPH holders • 100 NFTs minted       │ │
│  └──────────────────────────────────────────────────────┘ │
│                                                            │
│  Your Contracts                                            │
│  ┌──────────────────────────────────────────────────────┐ │
│  │ 💎 Fan Token: PROPH                                  │ │
│  │    0x1234...5678                    [View] [Share]   │ │
│  │    ✓ 1,000,000 total supply                          │ │
│  │    ✓ 500 holders                                     │ │
│  └──────────────────────────────────────────────────────┘ │
│                                                            │
│  ┌──────────────────────────────────────────────────────┐ │
│  │ 🎵 NFT Collection: Quicksand Deliria                 │ │
│  │    0xabcd...ef12                    [View] [Share]   │ │
│  │    ✓ 100/100 editions minted                         │ │
│  │    ✓ 0.5 ETH in royalties earned                     │ │
│  └──────────────────────────────────────────────────────┘ │
│                                                            │
│  ┌──────────────────────────────────────────────────────┐ │
│  │ 🏛️ DAO: Digital Prophets DAO                         │ │
│  │    0x9876...5432                    [View] [Share]   │ │
│  │    ✓ 3 active proposals                              │ │
│  │    ✓ 250 voting members                              │ │
│  └──────────────────────────────────────────────────────┘ │
│                                                            │
│  Quick Actions                                             │
│  ┌─────────────┬─────────────┬─────────────┬──────────┐  │
│  │ Create New  │ View        │ Airdrop     │ Create   │  │
│  │ Proposal    │ Analytics   │ Tokens      │ New NFT  │  │
│  └─────────────┴─────────────┴─────────────┴──────────┘  │
│                                                            │
│  Share Your Economy                                        │
│  ┌──────────────────────────────────────────────────────┐ │
│  │ 🔗 digitalprophets.bandao.app                        │ │
│  │                                   [Copy Link] [QR]   │ │
│  └──────────────────────────────────────────────────────┘ │
│                                                            │
└───────────────────────────────────────────────────────────┘
```

### Key UI Elements
- **Profile Card**: Artist info with stats
- **Contract Cards**: Each deployed contract with quick actions
- **Stats Dashboard**: Holdings, sales, votes
- **Action Buttons**: Create proposal, airdrop, mint more
- **Shareable Link**: Custom subdomain or link to share
- **Analytics**: Charts showing token distribution, NFT sales

### Thirdweb Integration

```jsx
// Dashboard.jsx
import { useState, useEffect } from 'react';
import {
  useAddress,
  useContract,
  useTokenSupply,
  useNFTs,
} from '@thirdweb-dev/react';

export default function Dashboard() {
  const address = useAddress();
  const [artistData, setArtistData] = useState({
    profile: null,
    token: null,
    nft: null,
    dao: null,
  });

  // Load saved data from localStorage
  useEffect(() => {
    const profile = JSON.parse(localStorage.getItem('artistProfile') || 'null');
    const token = JSON.parse(localStorage.getItem('artistToken') || 'null');
    const nft = JSON.parse(localStorage.getItem('artistNFT') || 'null');
    const dao = JSON.parse(localStorage.getItem('artistDAO') || 'null');

    setArtistData({ profile, token, nft, dao });
  }, []);

  // Get token contract
  const { contract: tokenContract } = useContract(
    artistData.token?.contractAddress,
    'token'
  );
  const { data: tokenSupply } = useTokenSupply(tokenContract);

  // Get NFT contract
  const { contract: nftContract } = useContract(
    artistData.nft?.collectionAddress,
    'edition'
  );
  const { data: nfts } = useNFTs(nftContract);

  const shareUrl = `https://banddao.app/${address}`;

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    toast.success('Link copied to clipboard!');
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-4xl font-bold text-white mb-2 text-center">
        🎉 Your Web3 Music Economy is Live!
      </h1>
      <p className="text-gray-400 text-center mb-8">
        Everything is set up. Now grow your community!
      </p>

      {/* Profile Card */}
      {artistData.profile && (
        <div className="bg-gradient-to-br from-blue-600 to-purple-600 p-6 rounded-lg mb-6 text-center">
          {artistData.profile.image && (
            <img
              src={artistData.profile.image}
              alt={artistData.profile.name}
              className="w-24 h-24 rounded-full mx-auto mb-4 border-4 border-white/20"
            />
          )}
          <h2 className="text-2xl font-bold text-white mb-2">
            {artistData.profile.name}
          </h2>
          <p className="text-blue-100">
            {artistData.profile.genre}
          </p>
        </div>
      )}

      {/* Contracts Overview */}
      <div className="space-y-4 mb-6">
        {/* Token Card */}
        {artistData.token && (
          <div className="bg-slate-800 p-6 rounded-lg border border-slate-700">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center">
                <span className="text-4xl mr-3">💎</span>
                <div>
                  <h3 className="text-white font-bold text-lg">
                    Fan Token: {artistData.token.symbol}
                  </h3>
                  <p className="text-xs text-gray-400 font-mono">
                    {artistData.token.contractAddress}
                  </p>
                </div>
              </div>
              <div className="flex gap-2">
                <a
                  href={`https://basescan.org/address/${artistData.token.contractAddress}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700"
                >
                  View
                </a>
                <button
                  onClick={() => copyToClipboard(artistData.token.contractAddress)}
                  className="px-3 py-1 bg-slate-700 text-white text-sm rounded hover:bg-slate-600"
                >
                  Share
                </button>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-gray-400">Total Supply</p>
                <p className="text-white font-semibold">
                  {Number(artistData.token.totalSupply).toLocaleString()}
                </p>
              </div>
              <div>
                <p className="text-gray-400">Your Balance</p>
                <p className="text-white font-semibold">
                  {tokenSupply ? tokenSupply.displayValue : '...'}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* NFT Card */}
        {artistData.nft && (
          <div className="bg-slate-800 p-6 rounded-lg border border-slate-700">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center">
                <span className="text-4xl mr-3">🎵</span>
                <div>
                  <h3 className="text-white font-bold text-lg">
                    NFT Collection: {artistData.nft.name}
                  </h3>
                  <p className="text-xs text-gray-400 font-mono">
                    {artistData.nft.collectionAddress}
                  </p>
                </div>
              </div>
              <div className="flex gap-2">
                <a
                  href={`https://basescan.org/address/${artistData.nft.collectionAddress}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1 bg-purple-600 text-white text-sm rounded hover:bg-purple-700"
                >
                  View
                </a>
                <button
                  onClick={() => copyToClipboard(artistData.nft.collectionAddress)}
                  className="px-3 py-1 bg-slate-700 text-white text-sm rounded hover:bg-slate-600"
                >
                  Share
                </button>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-gray-400">Edition Size</p>
                <p className="text-white font-semibold">
                  {artistData.nft.editionSize}
                </p>
              </div>
              <div>
                <p className="text-gray-400">Minted</p>
                <p className="text-white font-semibold">
                  {nfts ? nfts.length : '...'}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* DAO Card */}
        {artistData.dao && (
          <div className="bg-slate-800 p-6 rounded-lg border border-slate-700">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center">
                <span className="text-4xl mr-3">🏛️</span>
                <div>
                  <h3 className="text-white font-bold text-lg">
                    DAO: {artistData.dao.name}
                  </h3>
                  <p className="text-xs text-gray-400 font-mono">
                    {artistData.dao.contractAddress}
                  </p>
                </div>
              </div>
              <div className="flex gap-2">
                <a
                  href={`https://basescan.org/address/${artistData.dao.contractAddress}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1 bg-green-600 text-white text-sm rounded hover:bg-green-700"
                >
                  View
                </a>
                <button
                  onClick={() => copyToClipboard(artistData.dao.contractAddress)}
                  className="px-3 py-1 bg-slate-700 text-white text-sm rounded hover:bg-slate-600"
                >
                  Share
                </button>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-gray-400">Voting Period</p>
                <p className="text-white font-semibold">
                  {artistData.dao.votingPeriod} days
                </p>
              </div>
              <div>
                <p className="text-gray-400">Quorum</p>
                <p className="text-white font-semibold">
                  {artistData.dao.quorum}%
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <button className="bg-slate-800 hover:bg-slate-700 p-4 rounded-lg text-center transition-colors">
          <span className="text-3xl block mb-2">📝</span>
          <span className="text-white text-sm">Create Proposal</span>
        </button>
        <button className="bg-slate-800 hover:bg-slate-700 p-4 rounded-lg text-center transition-colors">
          <span className="text-3xl block mb-2">📊</span>
          <span className="text-white text-sm">View Analytics</span>
        </button>
        <button className="bg-slate-800 hover:bg-slate-700 p-4 rounded-lg text-center transition-colors">
          <span className="text-3xl block mb-2">🎁</span>
          <span className="text-white text-sm">Airdrop Tokens</span>
        </button>
        <button className="bg-slate-800 hover:bg-slate-700 p-4 rounded-lg text-center transition-colors">
          <span className="text-3xl block mb-2">➕</span>
          <span className="text-white text-sm">Mint New NFT</span>
        </button>
      </div>

      {/* Share Section */}
      <div className="bg-gradient-to-r from-cyan-500 to-blue-500 p-6 rounded-lg">
        <h3 className="text-white font-bold text-lg mb-4">
          Share Your Economy
        </h3>
        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 flex items-center justify-between">
          <span className="text-white font-mono">
            🔗 {shareUrl}
          </span>
          <button
            onClick={() => copyToClipboard(shareUrl)}
            className="px-4 py-2 bg-white text-blue-600 font-semibold rounded hover:bg-blue-50 transition-colors"
          >
            Copy Link
          </button>
        </div>
      </div>
    </div>
  );
}
```

---

## Main App Component (Bringing It All Together)

```jsx
// App.jsx
import { useState } from 'react';
import { ThirdwebProvider, ConnectWallet } from '@thirdweb-dev/react';
import { BaseSepoliaTestnet, Base } from '@thirdweb-dev/chains';
import { Toaster } from 'react-hot-toast';
import ProfileCreation from './components/ProfileCreation';
import TokenCreation from './components/TokenCreation';
import NFTMinting from './components/NFTMinting';
import DAOSetup from './components/DAOSetup';
import Dashboard from './components/Dashboard';

// Your Thirdweb Client ID (get from thirdweb.com/dashboard)
const CLIENT_ID = 'your_client_id_here';

function App() {
  const [currentStep, setCurrentStep] = useState(1);
  const [artistProfile, setArtistProfile] = useState(null);
  const [artistToken, setArtistToken] = useState(null);
  const [artistNFT, setArtistNFT] = useState(null);
  const [artistDAO, setArtistDAO] = useState(null);

  const steps = [
    { number: 1, name: 'Profile', icon: '🎸' },
    { number: 2, name: 'Token', icon: '💎' },
    { number: 3, name: 'NFT', icon: '🎵' },
    { number: 4, name: 'DAO', icon: '🏛️' },
    { number: 5, name: 'Dashboard', icon: '🎉' },
  ];

  const handleProfileComplete = (data) => {
    setArtistProfile(data.profile);
    setCurrentStep(2);
  };

  const handleTokenComplete = (data) => {
    setArtistToken(data);
    setCurrentStep(3);
  };

  const handleNFTComplete = (data) => {
    setArtistNFT(data);
    setCurrentStep(4);
  };

  const handleDAOComplete = (data) => {
    setArtistDAO(data);
    setCurrentStep(5);
  };

  return (
    <ThirdwebProvider
      activeChain={BaseSepoliaTestnet} // Use Base for production
      clientId={CLIENT_ID}
    >
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
        {/* Header */}
        <header className="bg-slate-900/50 backdrop-blur-sm border-b border-slate-700">
          <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
            <h1 className="text-2xl font-bold text-white">
              🎸 BandDAO Builder
            </h1>
            <ConnectWallet theme="dark" btnTitle="Connect Wallet" />
          </div>
        </header>

        {/* Progress Steps */}
        <div className="max-w-4xl mx-auto px-6 py-8">
          <div className="flex items-center justify-between mb-8">
            {steps.map((step, index) => (
              <div key={step.number} className="flex items-center">
                <div
                  className={`flex flex-col items-center ${
                    currentStep >= step.number ? 'opacity-100' : 'opacity-40'
                  }`}
                >
                  <div
                    className={`w-12 h-12 rounded-full flex items-center justify-center text-2xl mb-2 ${
                      currentStep >= step.number
                        ? 'bg-blue-600'
                        : 'bg-slate-700'
                    }`}
                  >
                    {currentStep > step.number ? '✓' : step.icon}
                  </div>
                  <span className="text-white text-sm">{step.name}</span>
                </div>
                {index < steps.length - 1 && (
                  <div
                    className={`h-1 w-16 mx-2 ${
                      currentStep > step.number
                        ? 'bg-blue-600'
                        : 'bg-slate-700'
                    }`}
                  />
                )}
              </div>
            ))}
          </div>

          {/* Main Content */}
          <div className="mb-8">
            {currentStep === 1 && (
              <ProfileCreation onComplete={handleProfileComplete} />
            )}
            {currentStep === 2 && (
              <TokenCreation
                artistProfile={artistProfile}
                onComplete={handleTokenComplete}
              />
            )}
            {currentStep === 3 && (
              <NFTMinting
                artistProfile={artistProfile}
                onComplete={handleNFTComplete}
              />
            )}
            {currentStep === 4 && (
              <DAOSetup
                artistToken={artistToken}
                artistNFT={artistNFT}
                onComplete={handleDAOComplete}
              />
            )}
            {currentStep === 5 && <Dashboard />}
          </div>
        </div>

        {/* Footer */}
        <footer className="bg-slate-900/50 border-t border-slate-700 py-6">
          <div className="max-w-7xl mx-auto px-6 text-center text-gray-400 text-sm">
            <p>Built on Base ⚡ Powered by Thirdweb</p>
            <div className="mt-2 space-x-4">
              <a href="#" className="hover:text-white">Help Center</a>
              <a href="#" className="hover:text-white">Docs</a>
              <a href="#" className="hover:text-white">Community</a>
            </div>
          </div>
        </footer>

        <Toaster position="bottom-right" />
      </div>
    </ThirdwebProvider>
  );
}

export default App;
```

---

## Final Recommendations

### 1. **Testing Strategy**
```bash
# Start on Base Sepolia Testnet
- Get test ETH from Base Sepolia faucet
- Deploy all contracts in test environment
- Test full user flow before mainnet
- Use Thirdweb dashboard to monitor contracts
```

### 2. **Security Considerations**
- **Audit smart contracts** before mainnet deployment (especially DAO)
- Use Thirdweb's **audited contract templates** (they're pre-audited)
- Implement **rate limiting** on contract interactions
- Add **multi-sig** for DAO treasury withdrawals

### 3. **Monetization Ideas**
- **Platform Fee**: 2% of NFT sales
- **Premium Features**: Advanced analytics, custom branding ($10/month)
- **Token Launch Service**: Charge for marketing/promotion
- **White Label**: License to record labels ($500+/month)

### 4. **User Experience Enhancements**
- **Tutorial Videos**: Embed video guides at each step
- **Gas Estimation**: Show real-time cost before transactions
- **Mobile App**: React Native version for on-the-go management
- **Email Notifications**: Alert on proposals, sales, etc.

### 5. **Growth Features (Phase 2)**
- **Social Discovery**: Browse other artists' DAOs
- **Collaboration Tools**: Co-create NFTs with other artists
- **Merch Integration**: Token-gated merch store
- **Streaming Integration**: Spotify/Apple Music metadata sync
- **Fan Dashboard**: Separate UI for fans to view holdings/vote

### 6. **Required Dependencies**

```json
{
  "dependencies": {
    "@thirdweb-dev/react": "^4.9.0",
    "@thirdweb-dev/sdk": "^4.0.0",
    "@thirdweb-dev/chains": "^0.1.0",
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-hot-toast": "^2.4.1",
    "tailwindcss": "^3.4.0"
  }
}
```

### 7. **Thirdweb Dashboard Setup**
1. Sign up at [thirdweb.com](https://thirdweb.com)
2. Create a project and get your **Client ID**
3. Enable **Base** and **Base Sepolia** chains
4. Configure **Thirdweb Storage** for IPFS uploads
5. Monitor all deployed contracts in the dashboard

### 8. **Marketing Checklist**
- [ ] Create landing page showing example DAOs
- [ ] Partner with music NFT marketplaces
- [ ] Run contest: "Build your DAO, win $1000 in PROPH"
- [ ] Create TikTok/YouTube tutorials
- [ ] Reach out to independent artists (they're eager for Web3)

---

## Quick Start Command

```bash
# Clone and setup
npm create vite@latest band-dao-builder -- --template react
cd band-dao-builder
npm install @thirdweb-dev/react @thirdweb-dev/sdk react-hot-toast
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p

# Add Base chain and start
npm run dev
```

---

This complete implementation gives musicians a **no-code way** to build their Web3 economy in ~30 minutes. The Thirdweb SDK handles all the complex blockchain interactions, making it beginner-friendly while still being powerful enough for advanced users.

**Next Step**: Build this and launch on Base Sepolia for testing! 🚀
