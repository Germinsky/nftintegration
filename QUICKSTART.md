# 🚀 Quick Start Guide

Get Daily Vibes Rewards running in 5 minutes!

## Step 1: Install Dependencies

```bash
cd ~/daily-vibes-rewards
npm install
```

## Step 2: Get WalletConnect Project ID

1. Visit https://cloud.walletconnect.com
2. Create a free account
3. Create a new project
4. Copy your Project ID

## Step 3: Update Configuration

Edit `src/App.jsx` and replace:

```javascript
projectId: 'YOUR_WALLETCONNECT_PROJECT_ID'
```

With your actual Project ID from step 2.

## Step 4: Run the App

```bash
npm run dev
```

Visit http://localhost:3000 🎉

## What You'll See

- Songs automatically fetched from digitalprophets.blog
- "Connect Wallet" button in header
- Song cards with audio players
- "Claim PROPH" buttons (greyed out until contract is deployed)

## Next Steps

### Deploy the Smart Contract

The app won't distribute tokens until you deploy the contract:

1. **Set up Hardhat:**
```bash
npm install --save-dev hardhat @nomicfoundation/hardhat-toolbox
npx hardhat init
```

2. **Copy the contract** from `src/contracts/DailyVibesRewards.sol` to `contracts/`

3. **Create deployment script** (see README.md)

4. **Deploy to Base:**
```bash
npx hardhat run scripts/deploy.js --network base
```

5. **Update `src/App.jsx`** with deployed contract address:
```javascript
const REWARDS_ADDRESS = '0xYourDeployedContractAddress';
```

6. **Fund the contract** with PROPH tokens

### Testing Without Deployment

The app works without a deployed contract:
- Songs will load and play
- Users can connect wallets
- Claim buttons will be disabled
- Perfect for testing the UI/UX

## Troubleshooting

**Songs not loading?**
- Check browser console
- Network tab should show fetch to `api.allorigins.win`
- Fallback songs will load if blog fetch fails

**Wallet not connecting?**
- Make sure you're using a Web3-enabled browser
- Install MetaMask or use a compatible wallet
- Check you have the correct WalletConnect Project ID

**Port 3000 already in use?**
- Change port in `vite.config.js`:
  ```javascript
  server: { port: 3001 }
  ```

## File Overview

- `src/App.jsx` - Main app, Web3 config
- `src/components/SongList.jsx` - Song cards & claiming logic
- `src/utils/blogFetcher.js` - Fetches from blog
- `src/contracts/DailyVibesRewards.sol` - Smart contract

## Support

Check the full README.md for detailed documentation!
