# Smart Contracts for Daily Vibes Rewards

## Overview

This directory contains the smart contracts for the Daily Vibes Rewards platform on Base blockchain.

## Contracts

### DailyVibesRewards.sol

Main rewards contract that handles token distribution for music listening.

**Features:**
- ERC20 token rewards (PROPH)
- One reward per song per user
- Adjustable reward amounts
- Owner withdrawal functionality
- Listen count tracking

## Deployment

### Prerequisites

```bash
npm install --save-dev hardhat @nomicfoundation/hardhat-toolbox @openzeppelin/contracts
```

### Deploy to Base Testnet (Sepolia)

1. Create `hardhat.config.js`:

```javascript
require("@nomicfoundation/hardhat-toolbox");

module.exports = {
  solidity: "0.8.20",
  networks: {
    baseSepolia: {
      url: "https://sepolia.base.org",
      accounts: [process.env.PRIVATE_KEY],
      chainId: 84532
    },
    base: {
      url: "https://mainnet.base.org",
      accounts: [process.env.PRIVATE_KEY],
      chainId: 8453
    }
  }
};
```

2. Create deployment script `scripts/deploy.js`:

```javascript
const hre = require("hardhat");

async function main() {
  // Replace with your PROPH token address
  const prophTokenAddress = "0xYourPROPHTokenAddress";
  
  const DailyVibesRewards = await hre.ethers.getContractFactory("DailyVibesRewards");
  const rewards = await DailyVibesRewards.deploy(prophTokenAddress);
  
  await rewards.deployed();
  
  console.log("DailyVibesRewards deployed to:", rewards.address);
  console.log("Verify with:");
  console.log(`npx hardhat verify --network baseSepolia ${rewards.address} ${prophTokenAddress}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
```

3. Deploy:

```bash
npx hardhat run scripts/deploy.js --network baseSepolia
```

### Deploy with thirdweb (Easier)

1. Visit [thirdweb.com/base](https://thirdweb.com/base)
2. Click "Deploy Contract"
3. Upload `DailyVibesRewards.sol`
4. Fill in constructor parameters (PROPH token address)
5. Deploy!

## Contract Addresses

### Base Testnet (Sepolia)
- Rewards Contract: `0x...` (update after deployment)
- PROPH Token: `0x...` (update with your token address)

### Base Mainnet
- Rewards Contract: `0x...` (update after deployment)
- PROPH Token: `0x...` (update with your token address)

## Testing

Create `test/DailyVibesRewards.test.js`:

```javascript
const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("DailyVibesRewards", function () {
  let rewards, token, owner, user1, user2;

  beforeEach(async function () {
    [owner, user1, user2] = await ethers.getSigners();
    
    // Deploy mock PROPH token
    const Token = await ethers.getContractFactory("MockERC20");
    token = await Token.deploy("PROPH", "PROPH", ethers.utils.parseEther("1000000"));
    
    // Deploy rewards contract
    const Rewards = await ethers.getContractFactory("DailyVibesRewards");
    rewards = await Rewards.deploy(token.address);
    
    // Fund contract
    await token.transfer(rewards.address, ethers.utils.parseEther("10000"));
  });

  it("Should allow user to claim reward", async function () {
    await rewards.connect(user1).claimReward("song123");
    expect(await token.balanceOf(user1.address)).to.equal(ethers.utils.parseEther("10"));
  });

  it("Should prevent double claiming", async function () {
    await rewards.connect(user1).claimReward("song123");
    await expect(
      rewards.connect(user1).claimReward("song123")
    ).to.be.revertedWith("Reward already claimed for this song");
  });
});
```

Run tests:

```bash
npx hardhat test
```

## Funding the Contract

After deployment, you need to fund the contract with PROPH tokens:

```javascript
// Using ethers.js
const prophToken = new ethers.Contract(PROPH_ADDRESS, ERC20_ABI, signer);
await prophToken.transfer(REWARDS_CONTRACT_ADDRESS, ethers.utils.parseEther("10000"));
```

## Security

- ✅ ReentrancyGuard protects against reentrancy attacks
- ✅ Ownable restricts admin functions
- ✅ Uses OpenZeppelin audited contracts
- ⚠️ Get contract audited before mainnet deployment
- ⚠️ Test thoroughly on testnet first

## Integration

Update your `.env` file:

```env
VITE_REWARDS_CONTRACT_ADDRESS=0xYourDeployedContractAddress
```

The React app will automatically use this address for claims.

## License

MIT
