# Daily Vibes Rewards 🎵

Earn PROPH tokens on Base blockchain for listening to Digital Prophets music!

## Features

- 🎶 **Stream Music** - Listen to latest Digital Prophets tracks
- 💰 **Earn Rewards** - Get PROPH tokens for completing songs
- 🔗 **Base Blockchain** - Powered by Base L2 for fast, cheap transactions
- 🌈 **RainbowKit** - Connect with MetaMask, Coinbase Wallet, WalletConnect & more
- 🔄 **Auto-Refresh** - New songs load automatically every 5 minutes
- 📱 **Responsive** - Works on desktop and mobile

## Tech Stack

- **Frontend**: React 18 + Vite
- **Blockchain**: Base (Ethereum L2)
- **Web3**: Wagmi v2 + RainbowKit + Viem
- **Data Source**: WordPress REST API
- **Styling**: Custom CSS with modern design

## Quick Start

### Prerequisites

- Node.js 18+ and npm
- MetaMask or compatible Web3 wallet
- Base network added to your wallet

### Installation

```bash
# Clone or navigate to project
cd daily-vibes-rewards

# Install dependencies
npm install

# Start development server
npm run dev
```

Visit `http://localhost:3000` to see the app!

### Build for Production

```bash
# Create optimized production build
npm run build

# Preview production build locally
npm run preview
```

The build outputs to `/dist` directory.

## Deployment

### Deploy to Vercel (Recommended)

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

Or connect your GitHub repo to Vercel dashboard for automatic deployments.

### Deploy to Netlify

```bash
# Install Netlify CLI
npm i -g netlify-cli

# Deploy
netlify deploy --prod
```

Or drag the `/dist` folder to [Netlify Drop](https://app.netlify.com/drop).

### Deploy to Fleek (IPFS/Web3)

1. Build the project: `npm run build`
2. Upload `/dist` folder to [Fleek](https://fleek.co)
3. Get your decentralized URL!

## Environment Variables

Create a `.env` file (see `.env.example`):

```env
VITE_WALLETCONNECT_PROJECT_ID=your_project_id
VITE_REWARDS_CONTRACT_ADDRESS=0xYourContractAddress
VITE_BLOG_API_URL=https://digitalprophets.blog/wp-json/wp/v2/posts
```

## Smart Contract Deployment

The app requires a rewards contract deployed on Base mainnet.

### Quick Deploy (Recommended)

Use [thirdweb](https://thirdweb.com) for easy deployment:

1. Visit [thirdweb.com/base](https://thirdweb.com/base)
2. Deploy a Token or NFT contract
3. Copy contract address
4. Update `.env` with your contract address

### Manual Deploy with Hardhat

```bash
# Install Hardhat
npm install --save-dev hardhat @nomicfoundation/hardhat-toolbox

# Create Hardhat project
npx hardhat init

# Deploy to Base
npx hardhat run scripts/deploy.js --network base
```

## Configuration

### Update WalletConnect Project ID

1. Visit [cloud.walletconnect.com](https://cloud.walletconnect.com)
2. Create a new project
3. Copy your Project ID
4. Update in `.env`:
   ```
   VITE_WALLETCONNECT_PROJECT_ID=your_new_id
   ```

### Customize Blog Source

Edit `src/utils/blogFetcher.js` to change the WordPress API endpoint:

```javascript
const WP_API_URL = 'https://your-blog.com/wp-json/wp/v2/posts';
```

## Project Structure

```
daily-vibes-rewards/
├── src/
│   ├── components/      # React components
│   │   ├── SongList.jsx # Song grid display
│   │   └── SongCard.jsx # Individual song card
│   ├── utils/          # Utility functions
│   │   └── blogFetcher.js # WordPress API integration
│   ├── App.jsx         # Main app component
│   ├── App.css         # Styles
│   └── main.jsx        # Entry point
├── dist/               # Production build (generated)
├── public/             # Static assets
├── index.html          # HTML template
├── vite.config.js      # Vite configuration
├── vercel.json         # Vercel deployment config
├── netlify.toml        # Netlify deployment config
└── package.json        # Dependencies
```

## Development

### Run Locally

```bash
npm run dev
```

### Build Production

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

## Features Roadmap

- [x] WordPress API integration
- [x] Wallet connection (RainbowKit)
- [x] Base blockchain integration
- [x] Auto-refresh songs
- [x] Manual refresh button
- [ ] Deploy PROPH token contract
- [ ] Deploy rewards contract
- [ ] User dashboard with claim history
- [ ] Leaderboard for top listeners
- [ ] NFT badges for milestones
- [ ] Song voting with governance
- [ ] Playlist creation

## Troubleshooting

### Songs Not Loading

- Check WordPress API endpoint in `.env`
- Verify CORS settings on WordPress site
- Check browser console for errors

### Wallet Not Connecting

- Ensure MetaMask is installed
- Check WalletConnect Project ID is valid
- Make sure Base network is added to wallet

### Build Errors

```bash
# Clean install
rm -rf node_modules package-lock.json
npm install
npm run build
```

## Support & Community

- **Website**: [digitalprophets.blog](https://digitalprophets.blog)
- **Twitter**: [@digitalprophets](https://twitter.com/digitalprophets)
- **Discord**: [Join Community](#)
- **Issues**: [GitHub Issues](#)

## License

MIT License - see LICENSE file for details

---

Built with ❤️ by Digital Prophets | Powered by Base ⚡

## Contributing

Contributions welcome! Please read our contributing guidelines and submit pull requests.

## Security

Found a security issue? Please email security@digitalprophets.com instead of opening an issue.

- 🎶 **Auto-fetches songs** from Digital Prophets blog
- 💰 **Earn PROPH tokens** for listening to songs
- 🔗 **Base blockchain** integration via Wagmi & RainbowKit
- 🎨 **Beautiful UI** with modern gradients and animations
- 📱 **Fully responsive** design
- ⚡ **One claim per song** per wallet address
- 🔒 **Secure** smart contract with OpenZeppelin standards

## Quick Start

### 1. Install Dependencies

```bash
cd ~/daily-vibes-rewards
npm install
```

### 2. Configuration

Before running, update these values in `src/App.jsx`:

```javascript
// Get a project ID from https://cloud.walletconnect.com
projectId: 'YOUR_WALLETCONNECT_PROJECT_ID'

// Update after deploying the smart contract
const REWARDS_ADDRESS = '0xYourDeployedRewardsContractHere';
```

### 3. Run Development Server

```bash
npm run dev
```

Visit `http://localhost:3000` to see the app!

## Smart Contract Deployment

### Deploy to Base

1. **Install Hardhat** (if you haven't):
```bash
npm install --save-dev hardhat @nomicfoundation/hardhat-toolbox
```

2. **Create deployment script** (`scripts/deploy.js`):
```javascript
const hre = require("hardhat");

async function main() {
  const PROPH_ADDRESS = "0x1890E4f2668b98170B618bA45Bc1B5721ACf9575";
  const REWARD_AMOUNT = hre.ethers.parseEther("10"); // 10 PROPH per claim

  const DailyVibesRewards = await hre.ethers.getContractFactory("DailyVibesRewards");
  const rewards = await DailyVibesRewards.deploy(PROPH_ADDRESS, REWARD_AMOUNT);

  await rewards.waitForDeployment();

  console.log("DailyVibesRewards deployed to:", await rewards.getAddress());
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
```

3. **Deploy:**
```bash
npx hardhat run scripts/deploy.js --network base
```

4. **Fund the contract** with PROPH tokens:
```javascript
// Transfer PROPH to the deployed contract address
prophToken.transfer(REWARDS_CONTRACT_ADDRESS, amount);
```

## How It Works

### User Flow

1. **Connect Wallet**: User connects their Base wallet via RainbowKit
2. **Browse Songs**: App fetches latest songs from digitalprophets.blog
3. **Listen**: User plays a song all the way through
4. **Claim Reward**: After listening, user claims PROPH tokens
5. **One-time Claim**: Each song can only be claimed once per wallet

### Technical Stack

- **Frontend**: React + Vite
- **Web3**: Wagmi v2 + RainbowKit
- **Blockchain**: Base (Ethereum L2)
- **Token**: PROPH (0x1890E4f2668b98170B618bA45Bc1B5721ACf9575)
- **Styling**: CSS3 with custom properties
- **Icons**: Lucide React

### Smart Contract

Contract: `src/contracts/DailyVibesRewards.sol`

**Key Functions:**
- `claimReward(string songId)` - Claim PROPH for a song
- `hasClaimed(address, string)` - Check if user claimed a song
- `updateRewardAmount(uint256)` - Owner can adjust rewards
- `withdrawTokens(address, uint256)` - Owner can withdraw PROPH

## Project Structure

```
daily-vibes-rewards/
├── src/
│   ├── components/
│   │   ├── SongList.jsx       # Song cards with claim buttons
│   │   └── SongList.css
│   ├── contracts/
│   │   └── DailyVibesRewards.sol  # Reward distribution contract
│   ├── utils/
│   │   └── blogFetcher.js     # Fetches songs from blog
│   ├── App.jsx                # Main app component
│   ├── App.css
│   ├── main.jsx               # React entry point
├── index.html
├── package.json
├── vite.config.js
└── README.md
```

## Customization

### Change Reward Amount

In the smart contract or after deployment:
```solidity
rewards.updateRewardAmount(ethers.parseEther("20")); // 20 PROPH per claim
```

### Modify Styling

Colors are defined in `src/App.css`:
```css
:root {
  --primary: #6C63FF;
  --secondary: #FF6584;
  --bg-dark: #0F0E17;
  /* etc... */
}
```

### Add More Songs

The app automatically fetches from the blog. To add fallback songs, edit `src/utils/blogFetcher.js`:

```javascript
function getFallbackSongs() {
  return [
    {
      id: 'your-song-id',
      title: 'Your Song Title',
      audioUrl: 'https://...',
      // ...
    }
  ];
}
```

## Deployment

### Build for Production

```bash
npm run build
```

This creates a `dist/` folder ready for deployment.

### Deploy Options

**Vercel:**
```bash
npm i -g vercel
vercel
```

**Netlify:**
```bash
npm i -g netlify-cli
netlify deploy --prod
```

**IPFS/Fleek:**
```bash
npm run build
# Upload dist/ folder to IPFS via Fleek
```

## Environment Variables

Create `.env` for sensitive data:

```env
VITE_WALLETCONNECT_PROJECT_ID=your_project_id
VITE_REWARDS_CONTRACT=0xYourContractAddress
```

Access in code:
```javascript
const projectId = import.meta.env.VITE_WALLETCONNECT_PROJECT_ID;
```

## Security Notes

- ✅ ReentrancyGuard prevents reentrancy attacks
- ✅ OpenZeppelin Ownable for access control
- ✅ One claim per song per address enforced on-chain
- ⚠️ Contract owner can update reward amount
- ⚠️ Contract owner can withdraw tokens

## Troubleshooting

### CORS Issues
The app uses `api.allorigins.win` as a proxy. If it fails:
- Run your own CORS proxy
- Use a different proxy service
- Implement server-side fetching

### Contract Connection Issues
- Ensure you're on Base network
- Check MetaMask/wallet is connected
- Verify contract address is correct
- Confirm contract has PROPH balance

### Songs Not Loading
- Check browser console for errors
- Verify blog is accessible
- Check network tab for failed requests
- Try fallback songs in `blogFetcher.js`

## Contributing

Ideas for enhancements:
- Add playlist feature for historical songs
- Implement leaderboard for top listeners
- Add NFT badges for milestones
- Create admin dashboard
- Add analytics tracking
- Implement sharing features

## License

MIT License - Feel free to use and modify!

## Links

- **Blog**: https://digitalprophets.blog
- **PROPH Token**: https://basescan.org/token/0x1890E4f2668b98170B618bA45Bc1B5721ACf9575
- **Base Network**: https://base.org

---

**Built with ❤️ for the Digital Prophets community**
