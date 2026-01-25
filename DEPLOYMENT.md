# 🚀 Deployment Guide - Daily Vibes Rewards

Complete guide to deploy your Daily Vibes Rewards app on Base blockchain.

## Prerequisites

- ✅ Node.js 18+ installed
- ✅ Git installed
- ✅ MetaMask wallet
- ✅ Some ETH on Base (for gas fees)
- ✅ WalletConnect Project ID from [cloud.walletconnect.com](https://cloud.walletconnect.com)

## Step 1: Prepare Your App

### 1.1 Update Configuration

Create `.env` file in project root:

```bash
cp .env.example .env
```

Edit `.env` with your values:

```env
VITE_WALLETCONNECT_PROJECT_ID=your_walletconnect_project_id
VITE_REWARDS_CONTRACT_ADDRESS=0xYourRewardsContractAddress
VITE_BLOG_API_URL=https://digitalprophets.blog/wp-json/wp/v2/posts
```

### 1.2 Test Locally

```bash
npm install
npm run dev
```

Visit `http://localhost:3000` and test:
- ✅ Songs load from blog
- ✅ Wallet connects
- ✅ Audio playback works
- ✅ UI looks good

## Step 2: Deploy Smart Contract (Optional but Recommended)

### Option A: Quick Deploy with thirdweb (Easiest)

1. Visit [thirdweb.com/base](https://thirdweb.com/base)
2. Click "Deploy Contract"
3. Select "Token" or upload `contracts/DailyVibesRewards.sol`
4. Connect your wallet
5. Deploy to Base (testnet first, then mainnet)
6. Copy contract address and update `.env`

### Option B: Manual Deploy with Hardhat

```bash
# Install Hardhat
npm install --save-dev hardhat @nomicfoundation/hardhat-toolbox

# Initialize Hardhat
npx hardhat init

# Create deployment script (see contracts/README.md)
# Deploy to Base Sepolia testnet
npx hardhat run scripts/deploy.js --network baseSepolia

# After testing, deploy to Base mainnet
npx hardhat run scripts/deploy.js --network base
```

### Fund Your Contract

Transfer PROPH tokens to the rewards contract so users can claim:

```bash
# Send 10,000 PROPH tokens to contract
# Use your wallet or run:
npx hardhat run scripts/fundContract.js --network base
```

## Step 3: Build Production App

```bash
# Build optimized production bundle
npm run build
```

This creates a `/dist` folder with your production app.

## Step 4: Deploy to Hosting Platform

### Option A: Deploy to Vercel (Recommended)

**Method 1: GitHub Integration (Easiest)**

1. Push your code to GitHub
2. Visit [vercel.com](https://vercel.com)
3. Click "New Project"
4. Import your GitHub repo
5. Add environment variables:
   - `VITE_WALLETCONNECT_PROJECT_ID`
   - `VITE_REWARDS_CONTRACT_ADDRESS`
   - `VITE_BLOG_API_URL`
6. Click "Deploy"

**Method 2: CLI**

```bash
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy
vercel

# Add environment variables in Vercel dashboard
# Then deploy to production
vercel --prod
```

Your app will be live at: `https://your-project.vercel.app`

### Option B: Deploy to Netlify

**Method 1: Drag & Drop**

1. Build your app: `npm run build`
2. Visit [app.netlify.com/drop](https://app.netlify.com/drop)
3. Drag `/dist` folder
4. Done! But environment variables won't work

**Method 2: CLI (Better)**

```bash
# Install Netlify CLI
npm i -g netlify-cli

# Login
netlify login

# Deploy
netlify deploy --prod

# Follow prompts, select /dist as publish directory
```

Add environment variables in Netlify dashboard under Site Settings > Environment Variables.

### Option C: Deploy to Fleek (Decentralized IPFS)

1. Visit [fleek.co](https://fleek.co)
2. Connect GitHub repo or upload `/dist`
3. Configure build settings:
   - Build command: `npm run build`
   - Publish directory: `dist`
4. Add environment variables
5. Deploy

Your app will be on IPFS with ENS domain support!

### Option D: Deploy to GitHub Pages

```bash
# Install gh-pages
npm install --save-dev gh-pages

# Add to package.json scripts:
# "deploy": "npm run build && gh-pages -d dist"

# Deploy
npm run deploy
```

Access at: `https://yourusername.github.io/daily-vibes-rewards`

## Step 5: Configure Custom Domain (Optional)

### Vercel:
1. Go to Project Settings > Domains
2. Add your domain
3. Update DNS records as instructed

### Netlify:
1. Go to Site Settings > Domain Management
2. Add custom domain
3. Update DNS

### Fleek:
1. Register ENS domain
2. Point to IPFS hash in Fleek dashboard

## Step 6: Post-Deployment Checklist

After deployment, verify:

- [ ] App loads without errors
- [ ] Wallet connection works (MetaMask, Coinbase, WalletConnect)
- [ ] Songs fetch from WordPress API
- [ ] Audio playback functions
- [ ] Claim button appears after song completes
- [ ] Smart contract interaction works
- [ ] Mobile responsive design works
- [ ] HTTPS is enabled
- [ ] Environment variables are set correctly

## Step 7: Set Up Analytics (Optional)

### Add Google Analytics

1. Get GA4 tracking ID
2. Add to `index.html`:

```html
<!-- Google tag (gtag.js) -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-XXXXXXXXXX');
</script>
```

### Add Web3 Analytics

- [Dune Analytics](https://dune.com) - on-chain analytics
- [Alchemy](https://www.alchemy.com) - RPC analytics
- [Mixpanel](https://mixpanel.com) - user behavior

## Troubleshooting

### Build Fails

```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json dist
npm install
npm run build
```

### Environment Variables Not Working

- Vercel/Netlify: Add in dashboard, then redeploy
- Vite requires `VITE_` prefix
- Rebuild after changing `.env`

### Songs Not Loading

- Check WordPress API URL in `.env`
- Verify CORS settings on WordPress
- Check browser console for errors

### Wallet Won't Connect

- Verify WalletConnect Project ID
- Check Base network is added to wallet
- Try different wallets (MetaMask, Coinbase)

### Contract Calls Fail

- Ensure contract is deployed
- Verify contract address in `.env`
- Check wallet is on Base network
- Ensure contract has funds

## Continuous Deployment

### Set Up Auto-Deploy

**Vercel/Netlify GitHub Integration:**
- Every push to `main` branch auto-deploys
- Pull requests get preview deployments
- Automatic rollbacks on failures

**GitHub Actions CI/CD:**

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Production

on:
  push:
    branches: [ main ]

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm install
      - run: npm run build
      - uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.ORG_ID }}
          vercel-project-id: ${{ secrets.PROJECT_ID }}
```

## Monitoring & Maintenance

### Monitor Performance

- Vercel Analytics (built-in)
- Lighthouse CI for performance scores
- Sentry for error tracking

### Update Strategy

1. Test changes locally
2. Deploy to preview/staging
3. Test on preview URL
4. Deploy to production
5. Monitor for errors

### Backup Strategy

- Code: GitHub repository
- Contract: Verified on Basescan
- Data: WordPress API is source of truth

## Security Best Practices

- ✅ Never commit `.env` files
- ✅ Use environment variables for secrets
- ✅ Enable HTTPS only
- ✅ Audit smart contracts before mainnet
- ✅ Use hardware wallet for contract owner
- ✅ Enable 2FA on all services
- ✅ Regular security updates (`npm audit`)

## Cost Estimate

### Free Tier Options
- **Vercel**: Free for hobby projects
- **Netlify**: 100GB bandwidth/month free
- **GitHub Pages**: Free for public repos
- **Fleek**: Free tier available

### Paid Hosting (if needed)
- **Vercel Pro**: $20/month
- **Netlify Pro**: $19/month
- **Custom domain**: $10-15/year

### Blockchain Costs
- **Contract deployment**: ~$10-50 (one-time)
- **User transactions**: <$0.01 per claim on Base

## Next Steps

1. ✅ Deploy contract to Base testnet
2. ✅ Deploy app to Vercel/Netlify
3. ✅ Test end-to-end on testnet
4. ✅ Deploy contract to Base mainnet
5. ✅ Update production app with mainnet contract
6. ✅ Announce to community!

## Support

Need help? Check:
- [Vercel Docs](https://vercel.com/docs)
- [Netlify Docs](https://docs.netlify.com)
- [Base Docs](https://docs.base.org)
- [Wagmi Docs](https://wagmi.sh)
- [RainbowKit Docs](https://rainbowkit.com)

---

🎉 **Congratulations!** Your Daily Vibes Rewards app is now live on Base blockchain!

Share your deployment at: https://twitter.com/intent/tweet?text=Just%20deployed%20Daily%20Vibes%20Rewards%20on%20Base%20blockchain!
