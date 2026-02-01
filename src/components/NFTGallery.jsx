import { useState, useEffect } from 'react';
import { useAccount, useReadContract } from 'wagmi';
import { Loader2, Image as ImageIcon, ExternalLink } from 'lucide-react';

const NFT_CONTRACT = '0xd8CfC327B23fBcdEe12802bA6cA97e1e7786bF47';

// ERC721 ABI for reading NFTs
const NFT_ABI = [
  {
    inputs: [{ name: 'owner', type: 'address' }],
    name: 'balanceOf',
    outputs: [{ name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [{ name: 'owner', type: 'address' }, { name: 'index', type: 'uint256' }],
    name: 'tokenOfOwnerByIndex',
    outputs: [{ name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [{ name: 'tokenId', type: 'uint256' }],
    name: 'tokenURI',
    outputs: [{ name: '', type: 'string' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'name',
    outputs: [{ name: '', type: 'string' }],
    stateMutability: 'view',
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

export default function NFTGallery({ maxDisplay = 12 }) {
  const { address, isConnected } = useAccount();
  const [nfts, setNfts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Get NFT balance
  const { data: balance } = useReadContract({
    address: NFT_CONTRACT,
    abi: NFT_ABI,
    functionName: 'balanceOf',
    args: address ? [address] : undefined,
    query: {
      enabled: !!address,
    },
  });

  // Get collection name
  const { data: collectionName } = useReadContract({
    address: NFT_CONTRACT,
    abi: NFT_ABI,
    functionName: 'name',
  });

  // Fetch NFT metadata
  const fetchNFTMetadata = async (tokenId) => {
    try {
      // Get tokenURI from contract
      const response = await fetch(
        `https://base.blockscout.com/api/v2/tokens/${NFT_CONTRACT}/instances/${tokenId}`,
        { headers: { 'Accept': 'application/json' } }
      );
      
      if (!response.ok) {
        // Fallback: construct generic metadata
        return {
          tokenId: tokenId.toString(),
          name: `Digital Prophets NFT #${tokenId}`,
          image: `https://api.dicebear.com/7.x/shapes/svg?seed=${tokenId}`, // Placeholder
          description: 'A Digital Prophets music NFT',
        };
      }

      const data = await response.json();
      
      // Parse metadata if it's a URL
      if (data.metadata?.token_uri) {
        try {
          const metadataResponse = await fetch(data.metadata.token_uri);
          const metadata = await metadataResponse.json();
          return {
            tokenId: tokenId.toString(),
            ...metadata,
            image: metadata.image || metadata.image_url,
          };
        } catch {
          // Use explorer data as fallback
          return {
            tokenId: tokenId.toString(),
            name: data.metadata?.name || `NFT #${tokenId}`,
            image: data.metadata?.image || `https://api.dicebear.com/7.x/shapes/svg?seed=${tokenId}`,
            description: data.metadata?.description || '',
          };
        }
      }

      return {
        tokenId: tokenId.toString(),
        name: `Digital Prophets NFT #${tokenId}`,
        image: `https://api.dicebear.com/7.x/shapes/svg?seed=${tokenId}`,
        description: 'Music NFT from Digital Prophets',
      };
    } catch (err) {
      console.error('Error fetching NFT metadata:', err);
      return {
        tokenId: tokenId.toString(),
        name: `NFT #${tokenId}`,
        image: `https://api.dicebear.com/7.x/shapes/svg?seed=${tokenId}`,
        description: 'Error loading metadata',
        error: true,
      };
    }
  };

  // Load all NFTs owned by user
  useEffect(() => {
    const loadNFTs = async () => {
      if (!address || !balance || balance === 0n) {
        setNfts([]);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const nftPromises = [];
        const count = Number(balance);
        const limit = Math.min(count, maxDisplay);

        // Fetch token IDs using Wagmi/Viem
        for (let i = 0; i < limit; i++) {
          nftPromises.push(
            // This would normally use useReadContract in a loop, but for bulk fetching
            // we'll use direct RPC calls via the public client
            fetch(`https://mainnet.base.org`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                jsonrpc: '2.0',
                id: i,
                method: 'eth_call',
                params: [{
                  to: NFT_CONTRACT,
                  data: `0x2f745c59${address.slice(2).padStart(64, '0')}${i.toString(16).padStart(64, '0')}`, // tokenOfOwnerByIndex
                }, 'latest'],
              }),
            })
              .then(res => res.json())
              .then(data => {
                const tokenId = BigInt(data.result);
                return fetchNFTMetadata(tokenId);
              })
          );
        }

        const nftData = await Promise.all(nftPromises);
        setNfts(nftData.filter(nft => !nft.error));
      } catch (err) {
        console.error('Error loading NFTs:', err);
        setError('Failed to load NFTs. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    loadNFTs();
  }, [address, balance, maxDisplay]);

  if (!isConnected) {
    return (
      <div className="nft-gallery-empty">
        <ImageIcon size={48} />
        <h3>Connect Wallet to View Your Collection</h3>
        <p>See your Digital Prophets NFTs here</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="nft-gallery-loading">
        <Loader2 className="animate-spin" size={48} />
        <p>Loading your NFT collection...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="nft-gallery-error">
        <p>{error}</p>
      </div>
    );
  }

  if (!balance || balance === 0n) {
    return (
      <div className="nft-gallery-empty">
        <ImageIcon size={48} />
        <h3>No NFTs Yet</h3>
        <p>Mint your first Digital Prophets NFT by playing tracks and earning rewards!</p>
      </div>
    );
  }

  return (
    <div className="nft-gallery">
      <div className="nft-gallery-header">
        <h2>{collectionName || 'Digital Prophets NFTs'}</h2>
        <p className="nft-count">
          {balance.toString()} {Number(balance) === 1 ? 'NFT' : 'NFTs'} owned
        </p>
      </div>

      <div className="nft-grid">
        {nfts.map((nft) => (
          <div key={nft.tokenId} className="nft-card">
            <div className="nft-image-container">
              <img 
                src={nft.image?.replace('ipfs://', 'https://ipfs.io/ipfs/') || nft.image} 
                alt={nft.name}
                onError={(e) => {
                  e.target.src = `https://api.dicebear.com/7.x/shapes/svg?seed=${nft.tokenId}`;
                }}
              />
            </div>
            <div className="nft-info">
              <h3>{nft.name}</h3>
              {nft.description && (
                <p className="nft-description">{nft.description.slice(0, 100)}</p>
              )}
              <div className="nft-footer">
                <span className="nft-token-id">#{nft.tokenId}</span>
                <a
                  href={`https://opensea.io/assets/base/${NFT_CONTRACT}/${nft.tokenId}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="nft-view-link"
                >
                  View <ExternalLink size={12} />
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
