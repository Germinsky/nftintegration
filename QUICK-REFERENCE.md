# 🚀 Quick Reference - Daily Vibes Rewards

## One-Command Deploy

```bash
./deploy.sh
```

That's it! Follow the prompts.

---

## Manual Deploy (Step by Step)

### 1. Setup
```bash
npm install
cp .env.example .env
# Edit .env with your values
```

### 2. Test Locally
```bash
npm run dev
# Visit http://localhost:3000
```

### 3. Build
```bash
npm run build
```

### 4. Deploy

#### Vercel (Recommended)
```bash
npm i -g vercel
vercel
```

#### Netlify
```bash
npm i -g netlify-cli
netlify deploy --prod
```

#### GitHub Pages
```bash
npm i -D gh-pages
npx gh-pages -d dist
```

---

## Environment Variables

Create `.env`:
```env
VITE_WALLETCONNECT_PROJECT_ID=e542ff314e26ff34de2d4fba98db47bb
VITE_REWARDS_CONTRACT_ADDRESS=0xYourContractAddress
VITE_BLOG_API_URL=https://digitalprophets.blog/wp-json/wp/v2/posts
```

---

## Smart Contract Deploy

### Quick (thirdweb)
1. Go to https://thirdweb.com/base
2. Upload `contracts/DailyVibesRewards.sol`
3. Deploy → Copy address → Update `.env`

### Manual (Hardhat)
```bash
npm i -D hardhat @nomicfoundation/hardhat-toolbox
npx hardhat init
npx hardhat run scripts/deploy.js --network base
```

---

## Project Commands

| Command | Description |
|---------|-------------|
| `npm run dev` | Start dev server |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build |
| `./deploy.sh` | Interactive deploy |

---

## File Structure

```
daily-vibes-rewards/
├── src/              # React app source
├── contracts/        # Smart contracts
├── dist/             # Built app (after npm run build)
├── .env              # Your secrets (create this)
├── deploy.sh         # Quick deploy script
└── DEPLOYMENT.md     # Full deployment guide
```

---

## URLs After Deployment

- **Vercel**: `https://your-project.vercel.app`
- **Netlify**: `https://your-project.netlify.app`
- **GitHub**: `https://username.github.io/repo-name`
- **Custom**: Configure in hosting dashboard

---

## Troubleshooting

### Build fails
```bash
rm -rf node_modules dist
npm install
npm run build
```

### Env vars not working
- Add `VITE_` prefix
- Restart dev server
- Redeploy to production

### Songs not loading
- Check WordPress API URL
- Check browser console
- Verify CORS settings

### Wallet won't connect
- Check WalletConnect Project ID
- Try different wallet
- Ensure Base network added

---

## Key Features

✅ WordPress REST API integration  
✅ RainbowKit wallet connection  
✅ Base blockchain support  
✅ Auto-refresh songs (5 min)  
✅ Manual refresh button  
✅ Responsive design  
✅ Production optimized  

---

## Costs

| Item | Cost |
|------|------|
| Hosting (free tier) | $0/month |
| Contract deploy | ~$20 one-time |
| User claims | <$0.01 each |
| Domain (optional) | $10/year |

---

## Next Steps

1. [ ] Deploy smart contract to Base
2. [ ] Update `.env` with contract address
3. [ ] Run `./deploy.sh`
4. [ ] Choose hosting platform
5. [ ] Test on production URL
6. [ ] Share with community!

---

## Documentation

- [README.md](README.md) - Usage guide
- [DEPLOYMENT.md](DEPLOYMENT.md) - Detailed deploy guide
- [contracts/README.md](contracts/README.md) - Contract guide
- [STANDALONE-APP-SUMMARY.md](STANDALONE-APP-SUMMARY.md) - Full overview

---

## Support

- 📖 Docs: See files above
- 🐛 Issues: GitHub Issues
- 💬 Community: Discord
- 🌐 Base: https://docs.base.org

---

**🎉 Your app is ready to deploy on Base blockchain!**

*Built by Digital Prophets | Powered by Base ⚡*
