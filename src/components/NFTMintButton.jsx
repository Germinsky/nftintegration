import { useState } from 'react';
import { useAccount, useReadContract, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { parseEther, formatEther } from 'viem';
import { Loader2, Music, CheckCircle, AlertCircle } from 'lucide-react';

// Your NFT contract address on Base
const NFT_CONTRACT = '0xd8CfC327B23fBcdEe12802bA6cA97e1e7786bF47';
const PROPH_TOKEN = '0x1890E4f2668b98170B618bA45Bc1B5721ACf9575';

// Minimum $PROPH balance required to mint (adjust as needed)
const MIN_PROPH_BALANCE = parseEther('100'); // 100 PROPH tokens

// Simple ERC721 ABI for minting
const NFT_ABI = [
  {
    inputs: [{ name: 'to', type: 'address' }],
    name: 'mint',
    outputs: [],
    stateMutability: 'payable',
    type: 'function',
  },
  {
    inputs: [{ name: 'to', type: 'address' }, { name: 'tokenURI', type: 'string' }],
    name: 'mintWithURI',
    outputs: [],
    stateMutability: 'payable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'totalSupply',
    outputs: [{ name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
];

// ERC20 ABI for checking balance
const ERC20_ABI = [
  {
    inputs: [{ name: 'account', type: 'address' }],
    name: 'balanceOf',
    outputs: [{ name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
];

export default function NFTMintButton({ 
  songTitle, 
  trackCompleted = false,
  mintPrice = '0', // Price in ETH (e.g., '0.001')
  requiresTrackPlay = true,
  disabled = false 
}) {
  const { address, isConnected } = useAccount();
  const [isMinting, setIsMinting] = useState(false);
  const [mintSuccess, setMintSuccess] = useState(false);

  // Check $PROPH balance
  const { data: prophBalance } = useReadContract({
    address: PROPH_TOKEN,
    abi: ERC20_ABI,
    functionName: 'balanceOf',
    args: address ? [address] : undefined,
    query: {
      enabled: !!address,
    },
  });

  // Get total supply
  const { data: totalSupply } = useReadContract({
    address: NFT_CONTRACT,
    abi: NFT_ABI,
    functionName: 'totalSupply',
  });

  // Mint transaction
  const { data: hash, writeContract, isPending, error: writeError } = useWriteContract();

  // Wait for transaction confirmation
  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({
    hash,
  });

  const hasEnoughPROPH = prophBalance && prophBalance >= MIN_PROPH_BALANCE;
  const canMint = 
    isConnected && 
    hasEnoughPROPH && 
    (!requiresTrackPlay || trackCompleted) &&
    !disabled;

  const handleMint = async () => {
    if (!canMint) return;

    try {
      setIsMinting(true);
      setMintSuccess(false);

      // Mint NFT
      writeContract({
        address: NFT_CONTRACT,
        abi: NFT_ABI,
        functionName: 'mint',
        args: [address],
        value: mintPrice ? parseEther(mintPrice) : 0n,
      });
    } catch (err) {
      console.error('Mint error:', err);
      setIsMinting(false);
    }
  };

  // Handle transaction confirmation
  if (isConfirmed && !mintSuccess) {
    setMintSuccess(true);
    setIsMinting(false);
  }

  if (isPending || isConfirming) {
    setIsMinting(true);
  } else if (!isConfirmed && isMinting) {
    setIsMinting(false);
  }

  // Get mint button text and state
  const getMintButtonState = () => {
    if (!isConnected) {
      return { text: 'Connect Wallet to Mint', disabled: true, variant: 'secondary' };
    }
    if (!hasEnoughPROPH) {
      return { 
        text: `Need ${formatEther(MIN_PROPH_BALANCE)} PROPH`, 
        disabled: true, 
        variant: 'secondary' 
      };
    }
    if (requiresTrackPlay && !trackCompleted) {
      return { text: '🎵 Play Track to Unlock', disabled: true, variant: 'secondary' };
    }
    if (mintSuccess) {
      return { text: '✅ Minted!', disabled: true, variant: 'success' };
    }
    if (isMinting || isPending || isConfirming) {
      return { text: 'Minting...', disabled: true, variant: 'primary' };
    }
    return { 
      text: mintPrice && mintPrice !== '0' ? `Mint NFT (${mintPrice} ETH)` : 'Mint NFT', 
      disabled: false, 
      variant: 'primary' 
    };
  };

  const buttonState = getMintButtonState();

  return (
    <div className="nft-mint-container">
      <button
        onClick={handleMint}
        disabled={buttonState.disabled || disabled}
        className={`nft-mint-button ${buttonState.variant}`}
      >
        {isMinting || isPending || isConfirming ? (
          <>
            <Loader2 className="animate-spin" size={16} />
            <span>{buttonState.text}</span>
          </>
        ) : mintSuccess ? (
          <>
            <CheckCircle size={16} />
            <span>{buttonState.text}</span>
          </>
        ) : (
          <>
            <Music size={16} />
            <span>{buttonState.text}</span>
          </>
        )}
      </button>

      {/* Status messages */}
      {!isConnected && (
        <p className="mint-hint">Connect your wallet to mint NFTs</p>
      )}
      
      {isConnected && !hasEnoughPROPH && (
        <p className="mint-hint warning">
          <AlertCircle size={14} />
          You need at least {formatEther(MIN_PROPH_BALANCE)} PROPH tokens to mint
        </p>
      )}

      {isConnected && hasEnoughPROPH && requiresTrackPlay && !trackCompleted && (
        <p className="mint-hint info">
          <Music size={14} />
          Complete playing "{songTitle}" to unlock minting
        </p>
      )}

      {totalSupply !== undefined && (
        <p className="mint-stats">Total Minted: {totalSupply.toString()}</p>
      )}

      {writeError && (
        <p className="mint-error">
          <AlertCircle size={14} />
          Error: {writeError.message.slice(0, 100)}
        </p>
      )}

      {mintSuccess && hash && (
        <p className="mint-success">
          <CheckCircle size={14} />
          Minted! 
          <a 
            href={`https://basescan.org/tx/${hash}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            View on BaseScan
          </a>
        </p>
      )}
    </div>
  );
}
